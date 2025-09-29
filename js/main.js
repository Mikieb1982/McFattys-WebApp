// app.js (ES module)
import { renderTiles, initTileSystem } from './tiles.js';
import { createContextFeature } from './features/context.js';
import { createIntentionFeature } from './features/intention.js';

// Firebase (loaded dynamically to allow graceful offline fallback)
let initializeApp;
let getAuth;
let onAuthStateChanged;
let fbSignOut;
let signInWithEmailAndPassword;
let createUserWithEmailAndPassword;
let updateProfile;
let GoogleAuthProvider;
let signInWithPopup;
let signInWithRedirect;
let getRedirectResult;
let setPersistence;
let browserLocalPersistence;
let getFirestore;
let collection;
let doc;
let addDoc;
let updateDoc;
let deleteDoc;
let onSnapshot;
let getDocs;
let getDoc;
let query;
let orderBy;
let serverTimestamp;
let setDoc;

const firebaseConfig = {
  apiKey: "AIzaSyC1qN3ksU0uYhXRXYNmYlmGX0iyUa-BJFQ",
  authDomain: "mcfattys-food-tracker.firebaseapp.com",
  projectId: "mcfattys-food-tracker",
  storageBucket: "mcfattys-food-tracker.appspot.com",
  messagingSenderId: "831603858264",
  appId: "1:831603858264:web:58506c01975e9a1991e32d",
  measurementId: "G-KQX4BQ71VK"
};

// Firebase state (populated asynchronously)
let app = null;
let auth = null;
let db = null;
let firebaseReady = false;
let authListenerReady = false;
let authListenerUnsubscribe = null;

// Constants
const MAX_RECENT_ROWS = 10;

// State
let logCollectionRef = null;
let unsubscribe = null;
let lang = 'en';
let deferredInstallPrompt = null;
let installBannerTimeout;
let latestSnapshot = null;
let isLoginMode = true;
let allEntries = [];
let activeFilter = 'all';
let searchTerm = '';
let todaysIntention = null;
let intentionUnsubscribe = null;
let isEditingIntention = false;
let contextFeature;
let intentionFeature;
let tileSystemInstance = null;
let currentUserProfile = null;
let currentWelcomeKey = 'welcome';

// Local state used by context helpers (prevents ReferenceErrors if invoked)
let pendingContextLogId = null;
let selectedFeeling = '';
const contextCache = new Map();

// Element refs (assigned on DOMContentLoaded)
let appContent, nameInput, dairyCheckbox, outsideMealsCheckbox, addBtn, tbody, emptyState, installBanner;
let sidebar, scrim, welcomeMessage, landingPage, donateBtn, langToggle, switchEl, googleSigninBtn, pwaInstallBtn;
let menuOpenBtn, menuCloseBtn, logoutBtn, logoutBtnMain, userInfo, userName, exportBtn;
let statTotal, statDairy, statOutside, statLast, statLastSubtext, logSearchInput, noResultsMessage, filterButtons;
let dashboardControls, reorderToggle, reorderHint, themeToggle, themeToggleIcon, themeToggleLabel, themeColorMeta;
let manifestoModal, closeManifestoBtn, historyModal, closeHistoryBtn, historyContent;
let legalModal, legalTitle, legalContent, closeLegalBtn, impressumLink, privacyLink;
let instructionsModal, closeInstructionsBtn, logoCard, manifestoCard, supportCard;
let authSection, loginBtn, signupBtn, authSubmit, authActions, signupFields, authTitle, authToggle;
let authEmail, authPassword, authUsername, authRePassword;
let contextFollowup, contextFeelingButtons, contextSettingInput, contextSaveBtn, contextSkipBtn, contextStatus;
let intentionForm, intentionTextarea, intentionSaveBtn, intentionDisplay, intentionCurrent, intentionDate, intentionEditBtn, intentionStatus;
let accountModal, accountNameInput, accountNicknameInput, accountEmailInput, accountSaveBtn, accountCancelBtn;

const loadFirebaseModules = async () => {
  try {
    const [appModule, authModule, firestoreModule] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
    ]);

    ({ initializeApp } = appModule);
    ({
      getAuth,
      onAuthStateChanged,
      signOut: fbSignOut,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      updateProfile,
      GoogleAuthProvider,
      signInWithPopup,
      signInWithRedirect,
      getRedirectResult,
      setPersistence,
      browserLocalPersistence
    } = authModule);
    ({
      getFirestore,
      collection,
      doc,
      addDoc,
      updateDoc,
      deleteDoc,
      onSnapshot,
      getDocs,
      getDoc,
      query,
      orderBy,
      serverTimestamp,
      setDoc
    } = firestoreModule);

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    if (typeof setPersistence === 'function' && browserLocalPersistence) {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.warn('Unable to set Firebase auth persistence:', error);
      }
    }
    db = getFirestore(app);
    firebaseReady = true;
  } catch (error) {
    console.warn('Firebase modules failed to load. Running in offline mode.', error);
  }
};

// DOM Content Loaded - Initialize element references
document.addEventListener('DOMContentLoaded', async () => {
  // Main app elements
  appContent = document.getElementById('app-content');

  // Render dashboard tiles before querying for tile-specific elements
  renderTiles(appContent);

  nameInput = document.getElementById('food-name');
  dairyCheckbox = document.getElementById('contains-dairy');
  outsideMealsCheckbox = document.getElementById('outside-meals');
  addBtn = document.getElementById('add-button');
  tbody = document.getElementById('log-body');
  emptyState = document.getElementById('empty-state');
  installBanner = document.getElementById('install-banner');

  contextFollowup = document.getElementById('context-followup');
  contextFeelingButtons = Array.from(document.querySelectorAll('.context-feeling'));
  contextSettingInput = document.getElementById('context-setting');
  contextSaveBtn = document.getElementById('save-context');
  contextSkipBtn = document.getElementById('skip-context');
  contextStatus = document.getElementById('context-status');

  contextFeature?.assignElements({
    followup: contextFollowup,
    feelingButtons: contextFeelingButtons,
    settingInput: contextSettingInput,
    saveBtn: contextSaveBtn,
    skipBtn: contextSkipBtn,
    status: contextStatus,
    tbody
  });

  // Navigation and UI
  sidebar = document.getElementById('sidebar');
  scrim = document.getElementById('scrim');
  welcomeMessage = document.getElementById('welcome-message');
  landingPage = document.getElementById('landing-page');
  donateBtn = document.getElementById('donate-button');
  langToggle = document.getElementById('lang-toggle');
  switchEl = document.getElementById('switch');
  googleSigninBtn = document.getElementById('google-signin');
  pwaInstallBtn = document.getElementById('pwa-install');
  
  // Menu controls
  menuOpenBtn = document.getElementById('menu-open');
  menuCloseBtn = document.getElementById('menu-close');
  logoutBtn = document.getElementById('logout-btn');
  logoutBtnMain = document.getElementById('logout-btn-main');
  userInfo = document.getElementById('user-info');
  userName = document.getElementById('user-name');
  exportBtn = document.getElementById('export-button');
  
  // Stats elements
  statTotal = document.getElementById('stat-total');
  statDairy = document.getElementById('stat-dairy');
  statOutside = document.getElementById('stat-outside');
  statLast = document.getElementById('stat-last');
  statLastSubtext = document.getElementById('stat-last-subtext');
  
  // Search and filters
  logSearchInput = document.getElementById('log-search');
  noResultsMessage = document.getElementById('no-results');
  filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  
  // Dashboard controls
  dashboardControls = document.getElementById('dashboard-controls');
  reorderToggle = document.getElementById('reorder-toggle');
  reorderHint = document.getElementById('reorder-hint');
  
  // Theme controls
  themeToggle = document.getElementById('theme-toggle');
  themeToggleIcon = document.getElementById('theme-toggle-icon');
  themeToggleLabel = document.getElementById('theme-toggle-label');
  themeColorMeta = document.getElementById('theme-color');
  
  // Modals
  manifestoModal = document.getElementById('manifesto-modal');
  closeManifestoBtn = document.getElementById('close-manifesto');
  historyModal = document.getElementById('history-modal');
  closeHistoryBtn = document.getElementById('close-history');
  historyContent = document.getElementById('history-content');
  legalModal = document.getElementById('legal-modal');
  legalTitle = document.getElementById('legal-title');
  legalContent = document.getElementById('legal-content');
  closeLegalBtn = document.getElementById('close-legal');
  impressumLink = document.getElementById('impressum-link');
  privacyLink = document.getElementById('privacy-link');
  instructionsModal = document.getElementById('instructions-modal');
  closeInstructionsBtn = document.getElementById('close-instructions');
  
  // Cards
  logoCard = document.getElementById('logo-card');
  manifestoCard = document.getElementById('manifesto-card');
  supportCard = document.getElementById('support-button');

  // Account modal
  accountModal = document.getElementById('account-modal');
  accountNameInput = document.getElementById('account-name');
  accountNicknameInput = document.getElementById('account-nickname');
  accountEmailInput = document.getElementById('account-email');
  accountSaveBtn = document.getElementById('save-account');
  accountCancelBtn = document.getElementById('cancel-account');

  // Auth elements
  authSection = document.getElementById('auth-section');
  loginBtn = document.getElementById('login-btn');
  signupBtn = document.getElementById('signup-btn');
  authSubmit = document.getElementById('auth-submit');
  authActions = document.getElementById('auth-actions');
  signupFields = document.getElementById('signup-fields');
  authTitle = document.getElementById('auth-title');
  authToggle = document.getElementById('auth-toggle');
  authEmail = document.getElementById('auth-email');
  authPassword = document.getElementById('auth-password');
  authUsername = document.getElementById('auth-username');
  authRePassword = document.getElementById('auth-re-password');
  intentionForm = document.getElementById('intention-form');
  intentionTextarea = document.getElementById('intention-text');
  intentionSaveBtn = document.getElementById('intention-save');
  intentionDisplay = document.getElementById('intention-display');
  intentionCurrent = intentionDisplay ? intentionDisplay.querySelector('.intention-current') : null;
  intentionDate = intentionDisplay ? intentionDisplay.querySelector('.intention-date') : null;
  intentionEditBtn = document.getElementById('intention-edit');
  intentionStatus = document.getElementById('intention-status');

  intentionFeature?.assignElements({
    form: intentionForm,
    textarea: intentionTextarea,
    saveBtn: intentionSaveBtn,
    display: intentionDisplay,
    current: intentionCurrent,
    date: intentionDate,
    editBtn: intentionEditBtn,
    status: intentionStatus
  });

  // Initialize tile system after elements are available
  const tileSystem = initTileSystem({
    container: appContent,
    reorderToggle,
    reorderHint,
    getTranslation
  });
  tileSystemInstance = tileSystem;

  // Initialize theme and other setup
  initializeTheme();
  setLanguage('en');
  
  // Set up event listeners after elements are available
  setupEventListeners(tileSystem);

  await loadFirebaseModules();

  // Handle Google redirect result once, then initialize auth listener with possible prefetched user
  const redirectResult = await handleGoogleRedirectResult();
  initializeAuthListener(redirectResult?.user || null);
});

// --- Translations ---
const translations = {
  en: {
    loginBtn: 'Login',
    signupBtn: 'Sign Up',
    logoutBtn: 'Logout',
    installBtn: 'Install',
    googleSignin: 'Sign in with Google',
    manifesto: "The Food Mutiny Manifesto",
    manifestoTitle: "The Food Mutiny Manifesto",
    manifestoP1: "The Food Mutiny is not about calories, restrictions, or guilt. If you want chips, eat them. No shame, no punishment. Just write it down. Recording without judgment is the act that matters.",
    manifestoP2: "This app is free. No subscriptions, no upsells, no lifestyle packages. We reject the idea that food and health should be sold back to us. Eating should not be a business model.",
    manifestoP3: "Instead, The Food Mutiny helps you pause, check in with your body, and notice your habits. Consciously or subconsciously, the simple act of logging allows you to see patterns and slowly shift your relationship with food. Change should not be a race. It should be slow, gentle, and rooted in respect for your choices.",
    manifestoP4: "We are against cycles of guilt, shame, and impossible promises. We will not celebrate consumerism dressed up as self-care. We believe the radical choice is to slow down, listen to yourself, and eat on your own terms.",
    manifestoP5: "The app will always be free to use. There is a donation button for those who want to support, because while the world should be free, it isn't. But The Food Mutiny will never profit from your guilt.",
    donateBtn: 'Donate',
    welcome: 'Welcome',
    welcomeBack: 'Welcome back',
    quickStatsTitle: 'Quick stats',
    statEntriesToday: 'Entries today',
    statDairyToday: 'Dairy items',
    statOutsideMeals: 'Outside of mealtimes',
    statLastEntry: 'Last entry',
    quickAddTitle: 'Quick add',
    quickAddHint: 'Log what you’re eating right now—no pressure, no judgement.',
    contextPrompt: 'How did that feel?',
    contextFeelingEnergized: 'Energized',
    contextFeelingSatisfied: 'Satisfied',
    contextFeelingSluggish: 'Sluggish',
    contextSettingLabel: 'Where were you?',
    contextSettingPlaceholder: 'At my desk',
    contextSave: 'Save',
    contextSkip: 'Skip',
    contextSaved: 'Reflection added.',
    contextError: 'Sorry, we couldn’t save that reflection.',
    contextView: 'View context',
    contextHide: 'Hide context',
    contextEmpty: 'No reflections yet.',
    contextLoading: 'Loading reflections...',
    contextAddedTime: 'Logged at',
    intentionTitle: 'Daily intention',
    intentionLabel: 'What’s your focus today?',
    intentionPlaceholder: 'Pause, notice, breathe',
    intentionExamples: 'Try: “Pause between bites”, “Notice fullness cues”.',
    intentionSave: 'Save intention',
    intentionEdit: 'Edit intention',
    intentionSaved: 'Intention saved.',
    intentionError: 'Sorry, we couldn’t save your intention.',
    intentionToday: 'Set on {date}',
    intentionEmpty: 'Set an intention to guide your day.',
    intentionRequired: 'Please enter an intention before saving.',
    supportBadge: 'Keep The Food Mutiny free',
    supportTitle: 'Support us',
    supportCopy: 'Chip in to cover hosting and keep the tracker open for everyone.',
    recentLogTitle: 'Recent log',
    organizeTiles: 'Organize tiles',
    doneOrganizing: 'Done',
    reorderHint: 'Drag tiles to reorder. Tap Done when you’re finished.',
    logSearchLabel: 'Search log',
    logSearchPlaceholder: 'Search entries',
    filterGroupLabel: 'Filters',
    filterAll: 'All',
    filterDairy: 'Dairy',
    filterNonDairy: 'No dairy',
    filterOutsideMeals: 'Outside of mealtimes',
    filterMeals: 'At mealtimes',
    noResults: 'No entries match your filters yet.',
    addTitle: 'Add item',
    foodLabel: 'Food item name',
    foodPlaceholder: 'e.g., Cheeseburger',
    addBtn: 'Add to log',
    dairyLabel: 'Contains dairy',
    outsideMealsLabel: 'Outside of mealtimes',
    logTitle: 'Today’s log',
    exportBtn: 'Export',
    thItem: 'Item',
    thTime: 'Time',
    thDairy: 'Dairy',
    thOutsideMeals: 'Outside of mealtimes',
    thActions: 'Actions',
    emptyState: 'No items yet. Add your first item above.',
    confirmTitle: 'Are you sure?',
    cancelBtn: 'Cancel',
    closeBtn: 'Close',
    confirmClearBtn: 'Confirm',
    accountModalTitle: 'Edit Account',
    nameLabel: 'Name',
    nicknameLabel: 'Nickname',
    emailLabel: 'Email',
    accountMissingName: 'Please enter your full name before saving.',
    accountSaveError: 'Sorry, we couldn’t update your profile.',
    deleteAccountBtn: 'Delete Account',
    saveBtn: 'Save',
    menuTitle: 'Menu',
    corePractices: 'Core Practices',
    newJournal: 'New Journal Entry',
    settings: 'Application Settings',
    account: 'Account',
    logout: 'Log Out',
    footerText: 'Designed and created by Burrow · 2025',
    loginTitle: 'Login',
    signupTitle: 'Sign Up',
    loginAction: 'Login',
    signupAction: 'Sign Up',
    authToggleToSignup: 'Need an account? Sign Up',
    authToggleToLogin: 'Have an account? Login',
    passwordLabel: 'Password',
    usernameLabel: 'Username',
    rePasswordLabel: 'Re-type Password',
    installSuccess: 'App installed! Find The Food Mutiny on your home screen.',
    installDismissed: 'Install dismissed.',
    yes: 'Yes',
    no: 'No',
    editBtn: 'Edit',
    removeBtn: 'Remove',
    editEntryAria: 'Edit entry',
    removeEntryAria: 'Remove entry',
    authMissingFields: 'Please enter an email and password.',
    authMissingUsername: 'Please choose a username.',
    authPasswordMismatch: 'Passwords do not match.',
    authUnavailable: 'Authentication is currently unavailable. Please try again later.',
    googleSigninBlocked: 'Google sign-in couldn’t finish because this browser blocked the login session. Try again in your default browser and ensure cookies are enabled.',
    addError: 'Sorry, there was an error adding your entry.',
    deleteError: 'Sorry, there was an error removing your entry.',
    updateError: 'Sorry, there was an error updating your entry.',
    authErrorPrefix: 'Error:',
    csvHeaderDate: 'Date',
    csvHeaderItem: 'Item',
    csvHeaderDairy: 'Dairy',
    csvHeaderOutsideMeals: 'Outside of mealtimes',
    csvYes: 'Yes',
    csvNo: 'No',
    notAvailable: 'N/A',
    history: 'History',
    historyTitle: 'Log History',
    impressum: 'Legal Notice',
    privacyPolicy: 'Privacy Policy',
  },
  de: {
    loginBtn: 'Anmelden',
    signupBtn: 'Registrieren',
    logoutBtn: 'Abmelden',
    installBtn: 'Installieren',
    googleSignin: 'Mit Google anmelden',
    manifesto: 'Manifest von The Food Mutiny',
    manifestoTitle: 'Manifest von The Food Mutiny',
    manifestoP1: 'Bei The Food Mutiny geht es nicht um Kalorien, Einschränkungen oder Schuldgefühle. Wenn du Chips willst, iss sie. Keine Scham, keine Bestrafung. Schreib es einfach auf. Das Aufzeichnen ohne Urteil ist der entscheidende Akt.',
    manifestoP2: 'Diese App ist kostenlos. Keine Abonnements, keine Upsells, keine Lifestyle-Pakete. Wir lehnen die Idee ab, dass uns Essen und Gesundheit zurückverkauft werden sollten. Essen sollte kein Geschäftsmodell sein.',
    manifestoP3: 'Stattdessen hilft Ihnen The Food Mutiny, innezuhalten, auf Ihren Körper zu hören und Ihre Gewohnheiten zu bemerken. Bewusst oder unbewusst ermöglicht Ihnen das einfache Protokollieren, Muster zu erkennen und Ihre Beziehung zum Essen langsam zu verändern. Veränderung sollte kein Wettlauf sein. Sie sollte langsam, sanft und in Respekt für Ihre Entscheidungen verwurzelt sein.',
    manifestoP4: 'Wir sind gegen Kreisläufe von Schuld, Scham und unmöglichen Versprechungen. Wir werden den als Selbstfürsorge getarnten Konsum nicht feiern. Wir glauben, die radikale Wahl ist, zu verlangsamen, auf sich selbst zu hören und zu Ihren eigenen Bedingungen zu essen.',
    manifestoP5: 'Die App wird immer kostenlos sein. Es gibt einen Spenden-Button für diejenigen, die unterstützen möchten, denn obwohl die Welt frei sein sollte, ist sie es nicht. Aber The Food Mutiny wird niemals von Ihrer Schuld profitieren.',
    donateBtn: 'Spenden',
    welcome: 'Willkommen',
    welcomeBack: 'Willkommen zurück',
    quickStatsTitle: 'Schnelle Statistiken',
    statEntriesToday: 'Einträge heute',
    statDairyToday: 'Milchprodukte',
    statOutsideMeals: 'Außerhalb der Mahlzeiten',
    statLastEntry: 'Letzter Eintrag',
    quickAddTitle: 'Schnell hinzufügen',
    quickAddHint: 'Protokolliere, was du gerade isst – ohne Druck, ohne Urteil.',
    contextPrompt: 'Wie hat sich das angefühlt?',
    contextFeelingEnergized: 'Energiegeladen',
    contextFeelingSatisfied: 'Zufrieden',
    contextFeelingSluggish: 'Träge',
    contextSettingLabel: 'Wo warst du?',
    contextSettingPlaceholder: 'An meinem Schreibtisch',
    contextSave: 'Speichern',
    contextSkip: 'Überspringen',
    contextSaved: 'Reflexion gespeichert.',
    contextError: 'Leider konnte die Reflexion nicht gespeichert werden.',
    contextView: 'Kontext anzeigen',
    contextHide: 'Kontext verbergen',
    contextEmpty: 'Noch keine Reflexionen.',
    contextLoading: 'Reflexionen werden geladen …',
    contextAddedTime: 'Erfasst um',
    intentionTitle: 'Tägliche Intention',
    intentionLabel: 'Worauf möchtest du dich heute konzentrieren?',
    intentionPlaceholder: 'Pause, wahrnehmen, atmen',
    intentionExamples: 'Zum Beispiel: „Zwischen den Bissen pausieren“, „Sättigung wahrnehmen“.',
    intentionSave: 'Intention speichern',
    intentionEdit: 'Intention bearbeiten',
    intentionSaved: 'Intention gespeichert.',
    intentionError: 'Deine Intention konnte leider nicht gespeichert werden.',
    intentionToday: 'Festgelegt am {date}',
    intentionEmpty: 'Lege eine Intention fest, um deinen Tag zu begleiten.',
    intentionRequired: 'Bitte gib eine Intention ein, bevor du speicherst.',
    supportBadge: 'Halte The Food Mutiny kostenlos',
    supportTitle: 'Unterstütze uns',
    supportCopy: 'Hilf mit, die Hosting-Kosten zu decken und den Tracker für alle offen zu halten.',
    recentLogTitle: 'Aktuelles Protokoll',
    organizeTiles: 'Kacheln anordnen',
    doneOrganizing: 'Fertig',
    reorderHint: 'Ziehe die Kacheln, um sie neu anzuordnen. Tippe auf „Fertig", wenn du zufrieden bist.',
    logSearchLabel: 'Protokoll durchsuchen',
    logSearchPlaceholder: 'Einträge durchsuchen',
    filterGroupLabel: 'Filter',
    filterAll: 'Alle',
    filterDairy: 'Milch',
    filterNonDairy: 'Ohne Milch',
    filterOutsideMeals: 'Außerhalb der Mahlzeiten',
    filterMeals: 'Zu den Mahlzeiten',
    noResults: 'Keine Einträge passen zu deinen Filtern.',
    addTitle: 'Element hinzufügen',
    foodLabel: 'Name des Lebensmittels',
    foodPlaceholder: 'z.B. Käseburger',
    addBtn: 'Zum Protokoll hinzufügen',
    dairyLabel: 'Enthält Milchprodukte',
// app.js (ES module)
import { renderTiles, initTileSystem } from './tiles.js';
import { createContextFeature } from './features/context.js';
import { createIntentionFeature } from './features/intention.js';

// Firebase (loaded dynamically to allow graceful offline fallback)
let initializeApp;
let getAuth;
let onAuthStateChanged;
let fbSignOut;
let signInWithEmailAndPassword;
let createUserWithEmailAndPassword;
let updateProfile;
let GoogleAuthProvider;
let signInWithPopup;
let signInWithRedirect;
let getRedirectResult;
let setPersistence;
let browserLocalPersistence;
let getFirestore;
let collection;
let doc;
let addDoc;
let updateDoc;
let deleteDoc;
let onSnapshot;
let getDocs;
let getDoc;
let query;
let orderBy;
let serverTimestamp;
let setDoc;

const firebaseConfig = {
  apiKey: "AIzaSyC1qN3ksU0uYhXRXYNmYlmGX0iyUa-BJFQ",
  authDomain: "mcfattys-food-tracker.firebaseapp.com",
  projectId: "mcfattys-food-tracker",
  storageBucket: "mcfattys-food-tracker.appspot.com",
  messagingSenderId: "831603858264",
  appId: "1:831603858264:web:58506c01975e9a1991e32d",
  measurementId: "G-KQX4BQ71VK"
};

// Firebase state (populated asynchronously)
let app = null;
let auth = null;
let db = null;
let firebaseReady = false;
let authListenerReady = false;
let authListenerUnsubscribe = null;

// Constants
const MAX_RECENT_ROWS = 10;

// State
let logCollectionRef = null;
let unsubscribe = null;
let lang = 'en';
let deferredInstallPrompt = null;
let installBannerTimeout;
let latestSnapshot = null;
let isLoginMode = true;
let allEntries = [];
let activeFilter = 'all';
let searchTerm = '';
let todaysIntention = null;
let intentionUnsubscribe = null;
let isEditingIntention = false;
let contextFeature;
let intentionFeature;
let tileSystemInstance = null;
let currentUserProfile = null;
let currentWelcomeKey = 'welcome';

// Local state used by context helpers (prevents ReferenceErrors if invoked)
let pendingContextLogId = null;
let selectedFeeling = '';
const contextCache = new Map();

// Element refs (assigned on DOMContentLoaded)
let appContent, nameInput, dairyCheckbox, outsideMealsCheckbox, addBtn, tbody, emptyState, installBanner;
let sidebar, scrim, welcomeMessage, landingPage, donateBtn, langToggle, switchEl, googleSigninBtn, pwaInstallBtn;
let menuOpenBtn, menuCloseBtn, logoutBtn, logoutBtnMain, userInfo, userName, exportBtn;
let statTotal, statDairy, statOutside, statLast, statLastSubtext, logSearchInput, noResultsMessage, filterButtons;
let dashboardControls, reorderToggle, reorderHint, themeToggle, themeToggleIcon, themeToggleLabel, themeColorMeta;
let manifestoModal, closeManifestoBtn, historyModal, closeHistoryBtn, historyContent;
let legalModal, legalTitle, legalContent, closeLegalBtn, impressumLink, privacyLink;
let instructionsModal, closeInstructionsBtn, logoCard, manifestoCard, supportCard;
let authSection, loginBtn, signupBtn, authSubmit, authActions, signupFields, authTitle, authToggle;
let authEmail, authPassword, authUsername, authRePassword;
let contextFollowup, contextFeelingButtons, contextSettingInput, contextSaveBtn, contextSkipBtn, contextStatus;
let intentionForm, intentionTextarea, intentionSaveBtn, intentionDisplay, intentionCurrent, intentionDate, intentionEditBtn, intentionStatus;
let accountModal, accountNameInput, accountNicknameInput, accountEmailInput, accountSaveBtn, accountCancelBtn;

const loadFirebaseModules = async () => {
  try {
    const [appModule, authModule, firestoreModule] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
    ]);

    ({ initializeApp } = appModule);
    ({
      getAuth,
      onAuthStateChanged,
      signOut: fbSignOut,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      updateProfile,
      GoogleAuthProvider,
      signInWithPopup,
      signInWithRedirect,
      getRedirectResult,
      setPersistence,
      browserLocalPersistence
    } = authModule);
    ({
      getFirestore,
      collection,
      doc,
      addDoc,
      updateDoc,
      deleteDoc,
      onSnapshot,
      getDocs,
      getDoc,
      query,
      orderBy,
      serverTimestamp,
      setDoc
    } = firestoreModule);

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    if (typeof setPersistence === 'function' && browserLocalPersistence) {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.warn('Unable to set Firebase auth persistence:', error);
      }
    }
    db = getFirestore(app);
    firebaseReady = true;
  } catch (error) {
    console.warn('Firebase modules failed to load. Running in offline mode.', error);
  }
};

// --- Translations ---
const translations = {
  en: {
    loginBtn: 'Login',
    signupBtn: 'Sign Up',
    logoutBtn: 'Logout',
    installBtn: 'Install',
    googleSignin: 'Sign in with Google',
    manifesto: "The Food Mutiny Manifesto",
    manifestoTitle: "The Food Mutiny Manifesto",
    manifestoP1: "The Food Mutiny is not about calories, restrictions, or guilt. If you want chips, eat them. No shame, no punishment. Just write it down. Recording without judgment is the act that matters.",
    manifestoP2: "This app is free. No subscriptions, no upsells, no lifestyle packages. We reject the idea that food and health should be sold back to us. Eating should not be a business model.",
    manifestoP3: "Instead, The Food Mutiny helps you pause, check in with your body, and notice your habits. Consciously or subconsciously, the simple act of logging allows you to see patterns and slowly shift your relationship with food. Change should not be a race. It should be slow, gentle, and rooted in respect for your choices.",
    manifestoP4: "We are against cycles of guilt, shame, and impossible promises. We will not celebrate consumerism dressed up as self-care. We believe the radical choice is to slow down, listen to yourself, and eat on your own terms.",
    manifestoP5: "The app will always be free to use. There is a donation button for those who want to support, because while the world should be free, it isn't. But The Food Mutiny will never profit from your guilt.",
    donateBtn: 'Donate',
    welcome: 'Welcome',
    welcomeBack: 'Welcome back',
    quickStatsTitle: 'Quick stats',
    statEntriesToday: 'Entries today',
    statDairyToday: 'Dairy items',
    statOutsideMeals: 'Outside of mealtimes',
    statLastEntry: 'Last entry',
    quickAddTitle: 'Quick add',
    quickAddHint: 'Log what you’re eating right now—no pressure, no judgement.',
    contextPrompt: 'How did that feel?',
    contextFeelingEnergized: 'Energized',
    contextFeelingSatisfied: 'Satisfied',
    contextFeelingSluggish: 'Sluggish',
    contextSettingLabel: 'Where were you?',
    contextSettingPlaceholder: 'At my desk',
    contextSave: 'Save',
    contextSkip: 'Skip',
    contextSaved: 'Reflection added.',
    contextError: 'Sorry, we couldn’t save that reflection.',
    contextView: 'View context',
    contextHide: 'Hide context',
    contextEmpty: 'No reflections yet.',
    contextLoading: 'Loading reflections...',
    contextAddedTime: 'Logged at',
    intentionTitle: 'Daily intention',
    intentionLabel: 'What’s your focus today?',
    intentionPlaceholder: 'Pause, notice, breathe',
    intentionExamples: 'Try: “Pause between bites”, “Notice fullness cues”.',
    intentionSave: 'Save intention',
    intentionEdit: 'Edit intention',
    intentionSaved: 'Intention saved.',
    intentionError: 'Sorry, we couldn’t save your intention.',
    intentionToday: 'Set on {date}',
    intentionEmpty: 'Set an intention to guide your day.',
    intentionRequired: 'Please enter an intention before saving.',
    supportBadge: 'Keep The Food Mutiny free',
    supportTitle: 'Support us',
    supportCopy: 'Chip in to cover hosting and keep the tracker open for everyone.',
    recentLogTitle: 'Recent log',
    organizeTiles: 'Organize tiles',
    doneOrganizing: 'Done',
    reorderHint: 'Drag tiles to reorder. Tap Done when you’re finished.',
    logSearchLabel: 'Search log',
    logSearchPlaceholder: 'Search entries',
    filterGroupLabel: 'Filters',
    filterAll: 'All',
    filterDairy: 'Dairy',
    filterNonDairy: 'No dairy',
    filterOutsideMeals: 'Outside of mealtimes',
    filterMeals: 'At mealtimes',
    noResults: 'No entries match your filters yet.',
    addTitle: 'Add item',
    foodLabel: 'Food item name',
    foodPlaceholder: 'e.g., Cheeseburger',
    addBtn: 'Add to log',
    dairyLabel: 'Contains dairy',
    outsideMealsLabel: 'Outside of mealtimes',
    logTitle: 'Today’s log',
    exportBtn: 'Export',
    thItem: 'Item',
    thTime: 'Time',
    thDairy: 'Dairy',
    thOutsideMeals: 'Outside of mealtimes',
    thActions: 'Actions',
    emptyState: 'No items yet. Add your first item above.',
    confirmTitle: 'Are you sure?',
    cancelBtn: 'Cancel',
    closeBtn: 'Close',
    confirmClearBtn: 'Confirm',
    accountModalTitle: 'Edit Account',
    nameLabel: 'Name',
    nicknameLabel: 'Nickname',
    emailLabel: 'Email',
    accountMissingName: 'Please enter your full name before saving.',
    accountSaveError: 'Sorry, we couldn’t update your profile.',
    deleteAccountBtn: 'Delete Account',
    saveBtn: 'Save',
    menuTitle: 'Menu',
    corePractices: 'Core Practices',
    newJournal: 'New Journal Entry',
    settings: 'Application Settings',
    account: 'Account',
    logout: 'Log Out',
    footerText: 'Designed and created by Burrow · 2025',
    loginTitle: 'Login',
    signupTitle: 'Sign Up',
    loginAction: 'Login',
    signupAction: 'Sign Up',
    authToggleToSignup: 'Need an account? Sign Up',
    authToggleToLogin: 'Have an account? Login',
    passwordLabel: 'Password',
    usernameLabel: 'Username',
    rePasswordLabel: 'Re-type Password',
    installSuccess: 'App installed! Find The Food Mutiny on your home screen.',
    installDismissed: 'Install dismissed.',
    yes: 'Yes',
    no: 'No',
    editBtn: 'Edit',
    removeBtn: 'Remove',
    editEntryAria: 'Edit entry',
    removeEntryAria: 'Remove entry',
    authMissingFields: 'Please enter an email and password.',
    authMissingUsername: 'Please choose a username.',
    authPasswordMismatch: 'Passwords do not match.',
    authUnavailable: 'Authentication is currently unavailable. Please try again later.',
    googleSigninBlocked: 'Google sign-in couldn’t finish because this browser blocked the login session. Try again in your default browser and ensure cookies are enabled.',
    addError: 'Sorry, there was an error adding your entry.',
    deleteError: 'Sorry, there was an error removing your entry.',
    updateError: 'Sorry, there was an error updating your entry.',
    authErrorPrefix: 'Error:',
    csvHeaderDate: 'Date',
    csvHeaderItem: 'Item',
    csvHeaderDairy: 'Dairy',
    csvHeaderOutsideMeals: 'Outside of mealtimes',
    csvYes: 'Yes',
    csvNo: 'No',
    notAvailable: 'N/A',
    history: 'History',
    historyTitle: 'Log History',
    impressum: 'Legal Notice',
    privacyPolicy: 'Privacy Policy',
    // *** NEW TRANSLATIONS ***
    authPopupClosed: 'The sign-in window was closed before completing. Please try again.',
    authAccountExists: 'An account already exists with this email address. Please sign in with your original method.',
    authGenericError: 'An unknown error occurred during sign-in. Please check your connection and try again.'
  },
  de: {
    loginBtn: 'Anmelden',
    signupBtn: 'Registrieren',
    logoutBtn: 'Abmelden',
    installBtn: 'Installieren',
    googleSignin: 'Mit Google anmelden',
    manifesto: 'Manifest von The Food Mutiny',
    manifestoTitle: 'Manifest von The Food Mutiny',
    manifestoP1: 'Bei The Food Mutiny geht es nicht um Kalorien, Einschränkungen oder Schuldgefühle. Wenn du Chips willst, iss sie. Keine Scham, keine Bestrafung. Schreib es einfach auf. Das Aufzeichnen ohne Urteil ist der entscheidende Akt.',
    manifestoP2: 'Diese App ist kostenlos. Keine Abonnements, keine Upsells, keine Lifestyle-Pakete. Wir lehnen die Idee ab, dass uns Essen und Gesundheit zurückverkauft werden sollten. Essen sollte kein Geschäftsmodell sein.',
    manifestoP3: 'Stattdessen hilft Ihnen The Food Mutiny, innezuhalten, auf Ihren Körper zu hören und Ihre Gewohnheiten zu bemerken. Bewusst oder unbewusst ermöglicht Ihnen das einfache Protokollieren, Muster zu erkennen und Ihre Beziehung zum Essen langsam zu verändern. Veränderung sollte kein Wettlauf sein. Sie sollte langsam, sanft und in Respekt für Ihre Entscheidungen verwurzelt sein.',
    manifestoP4: 'Wir sind gegen Kreisläufe von Schuld, Scham und unmöglichen Versprechungen. Wir werden den als Selbstfürsorge getarnten Konsum nicht feiern. Wir glauben, die radikale Wahl ist, zu verlangsamen, auf sich selbst zu hören und zu Ihren eigenen Bedingungen zu essen.',
    manifestoP5: 'Die App wird immer kostenlos sein. Es gibt einen Spenden-Button für diejenigen, die unterstützen möchten, denn obwohl die Welt frei sein sollte, ist sie es nicht. Aber The Food Mutiny wird niemals von Ihrer Schuld profitieren.',
    donateBtn: 'Spenden',
    welcome: 'Willkommen',
    welcomeBack: 'Willkommen zurück',
    quickStatsTitle: 'Schnelle Statistiken',
    statEntriesToday: 'Einträge heute',
    statDairyToday: 'Milchprodukte',
    statOutsideMeals: 'Außerhalb der Mahlzeiten',
    // *** NEW TRANSLATIONS ***
    authPopupClosed: 'Das Anmeldefenster wurde vor dem Abschluss geschlossen. Bitte versuchen Sie es erneut.',
    authAccountExists: 'Ein Konto mit dieser E-Mail-Adresse existiert bereits. Bitte melden Sie sich mit Ihrer ursprünglichen Methode an.',
    authGenericError: 'Ein unbekannter Fehler ist bei der Anmeldung aufgetreten. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.'
  }
};

// --- Helper Functions ---
const getTranslation = (key, replacements = {}) => {
  let text = translations[lang][key] || key;
  for (const placeholder in replacements) {
    text = text.replace(`{${placeholder}}`, replacements[placeholder]);
  }
  return text;
};

// --- Google Sign-In Handler with Error Management ---
const handleGoogleSignIn = async () => {
  if (!auth || !GoogleAuthProvider) {
    console.warn('Firebase auth or provider is not ready.');
    alert(getTranslation('authUnavailable'));
    return;
  }

  const provider = new GoogleAuthProvider();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  try {
    if (isMobile) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
    }
    // A successful login will be handled by the onAuthStateChanged listener
  } catch (error) {
    console.error("Google sign-in error:", error.code, error.message);
    
    let errorMessageKey = 'authGenericError'; // Default error message key

    switch (error.code) {
      case 'auth/popup-blocked':
        errorMessageKey = 'googleSigninBlocked';
        break;
      case 'auth/popup-closed-by-user':
        errorMessageKey = 'authPopupClosed';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessageKey = 'authAccountExists';
        break;
      case 'auth/cancelled-popup-request':
        // This can happen if the user clicks the button multiple times quickly.
        // It's often best to just ignore this and not show an alert.
        return; 
    }

    alert(getTranslation(errorMessageKey));
  }
};

// --- Event Listeners Setup ---
const setupEventListeners = (tileSystem) => {
    // Other event listeners would go here...
    // For example:
    // addBtn.addEventListener('click', handleAddItem);
    // menuOpenBtn.addEventListener('click', () => sidebar.classList.add('open'));
    
    // Attach the new Google Sign-In handler
    if(googleSigninBtn) {
        googleSigninBtn.addEventListener('click', handleGoogleSignIn);
    }
};

// --- App Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
  // Main app elements
  appContent = document.getElementById('app-content');

  // Render dashboard tiles before querying for tile-specific elements
  renderTiles(appContent);
  
  // Assign all other element references...
  nameInput = document.getElementById('food-name');
  dairyCheckbox = document.getElementById('contains-dairy');
  outsideMealsCheckbox = document.getElementById('outside-meals');
  addBtn = document.getElementById('add-button');
  tbody = document.getElementById('log-body');
  emptyState = document.getElementById('empty-state');
  installBanner = document.getElementById('install-banner');
  contextFollowup = document.getElementById('context-followup');
  contextFeelingButtons = Array.from(document.querySelectorAll('.context-feeling'));
  contextSettingInput = document.getElementById('context-setting');
  contextSaveBtn = document.getElementById('save-context');
  contextSkipBtn = document.getElementById('skip-context');
  contextStatus = document.getElementById('context-status');
  sidebar = document.getElementById('sidebar');
  scrim = document.getElementById('scrim');
  welcomeMessage = document.getElementById('welcome-message');
  landingPage = document.getElementById('landing-page');
  donateBtn = document.getElementById('donate-button');
  langToggle = document.getElementById('lang-toggle');
  switchEl = document.getElementById('switch');
  googleSigninBtn = document.getElementById('google-signin');
  pwaInstallBtn = document.getElementById('pwa-install');
  menuOpenBtn = document.getElementById('menu-open');
  menuCloseBtn = document.getElementById('menu-close');
  logoutBtn = document.getElementById('logout-btn');
  logoutBtnMain = document.getElementById('logout-btn-main');
  userInfo = document.getElementById('user-info');
  userName = document.getElementById('user-name');
  exportBtn = document.getElementById('export-button');
  statTotal = document.getElementById('stat-total');
  statDairy = document.getElementById('stat-dairy');
  statOutside = document.getElementById('stat-outside');
  statLast = document.getElementById('stat-last');
  statLastSubtext = document.getElementById('stat-last-subtext');
  logSearchInput = document.getElementById('log-search');
  noResultsMessage = document.getElementById('no-results');
  filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  dashboardControls = document.getElementById('dashboard-controls');
  reorderToggle = document.getElementById('reorder-toggle');
  reorderHint = document.getElementById('reorder-hint');
  themeToggle = document.getElementById('theme-toggle');
  themeToggleIcon = document.getElementById('theme-toggle-icon');
  themeToggleLabel = document.getElementById('theme-toggle-label');
  themeColorMeta = document.getElementById('theme-color');
  manifestoModal = document.getElementById('manifesto-modal');
  closeManifestoBtn = document.getElementById('close-manifesto');
  historyModal = document.getElementById('history-modal');
  closeHistoryBtn = document.getElementById('close-history');
  historyContent = document.getElementById('history-content');
  legalModal = document.getElementById('legal-modal');
  legalTitle = document.getElementById('legal-title');
  legalContent = document.getElementById('legal-content');
  closeLegalBtn = document.getElementById('close-legal');
  impressumLink = document.getElementById('impressum-link');
  privacyLink = document.getElementById('privacy-link');
  instructionsModal = document.getElementById('instructions-modal');
  closeInstructionsBtn = document.getElementById('close-instructions');
  logoCard = document.getElementById('logo-card');
  manifestoCard = document.getElementById('manifesto-card');
  supportCard = document.getElementById('support-button');
  accountModal = document.getElementById('account-modal');
  accountNameInput = docum

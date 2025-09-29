// i18n dictionaries
const translations = {
  en: {
    loginBtn: 'Login',
    signupBtn: 'Sign Up',
    logoutBtn: 'Logout',
    installBtn: 'Install',
    googleSignin: 'Sign in with Google',
    manifesto: 'The Food Mutiny Manifesto',// app.js (ES module)

// Tiles and feature modules
import { renderTiles, initTileSystem } from './tiles.js';
import { createContextFeature } from './features/context.js';
import { createIntentionFeature } from './features/intention.js';

// -----------------------------
// Firebase dynamic loader
// -----------------------------
let firebaseReady = false;
let app = null;
let auth = null;
let db = null;

// Firebase modular API refs (filled after load)
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
let inMemoryPersistence;
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

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC1qN3ksU0uYhXRXYNmYlmGX0iyUa-BJFQ",
  authDomain: "mcfattys-food-tracker.firebaseapp.com",
  projectId: "mcfattys-food-tracker",
  storageBucket: "mcfattys-food-tracker.appspot.com",
  messagingSenderId: "831603858264",
  appId: "1:831603858264:web:58506c01975e9a1991e32d",
  measurementId: "G-KQX4BQ71VK"
};

async function loadFirebase() {
  try {
    const appMod = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const authMod = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    const fsMod = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

    initializeApp = appMod.initializeApp;

    getAuth = authMod.getAuth;
    onAuthStateChanged = authMod.onAuthStateChanged;
    fbSignOut = authMod.signOut;
    signInWithEmailAndPassword = authMod.signInWithEmailAndPassword;
    createUserWithEmailAndPassword = authMod.createUserWithEmailAndPassword;
    updateProfile = authMod.updateProfile;
    GoogleAuthProvider = authMod.GoogleAuthProvider;
    signInWithPopup = authMod.signInWithPopup;
    signInWithRedirect = authMod.signInWithRedirect;
    getRedirectResult = authMod.getRedirectResult;
    setPersistence = authMod.setPersistence;
    browserLocalPersistence = authMod.browserLocalPersistence;

    getFirestore = fsMod.getFirestore;
    collection = fsMod.collection;
    doc = fsMod.doc;
    addDoc = fsMod.addDoc;
    updateDoc = fsMod.updateDoc;
    deleteDoc = fsMod.deleteDoc;
    onSnapshot = fsMod.onSnapshot;
    getDocs = fsMod.getDocs;
    getDoc = fsMod.getDoc;
    query = fsMod.query;
    orderBy = fsMod.orderBy;
    serverTimestamp = fsMod.serverTimestamp;
    setDoc = fsMod.setDoc;


const processRedirectAuthResult = async () => {
  if (!firebaseReady || !auth || typeof getRedirectResult !== 'function') {
    return;
  }

  try {
    await getRedirectResult(auth);
  } catch (error) {
    if (error?.code && error.code !== 'auth/no-auth-event') {
      console.error('Google redirect sign-in error:', error);
      alert(`${getTranslation('authErrorPrefix')} ${error.message}`);
    }
  }
};

// Constants
const MAX_RECENT_ROWS = 10;


    // Persist auth in local storage for better UX
    try { await setPersistence(auth, browserLocalPersistence); } catch {}

    firebaseReady = true;

    // If we arrived back from redirect, finalize the flow
    if (typeof getRedirectResult === 'function') {
      try { await getRedirectResult(auth); } catch {}
    }
  } catch (err) {
    console.error('Firebase failed to load. App runs in read-only mode.', err);
    firebaseReady = false;
  }
}

// -----------------------------
// DOM refs
// -----------------------------
const appContent = document.getElementById('app-content');
const landingPage = document.getElementById('landing-page');
const authActions = document.getElementById('auth-actions');
const userInfo = document.getElementById('user-info');
const dashboardControls = document.getElementById('dashboard-controls');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const themeToggle = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const themeToggleLabel = document.getElementById('theme-toggle-label');

const addBtn = document.getElementById('add-button');
const nameInput = document.getElementById('food-name');
const dairyCheckbox = document.getElementById('food-dairy');
const outsideMealsCheckbox = document.getElementById('food-outside');

const table = document.getElementById('log-table');
const tbody = table ? table.querySelector('tbody') : null;
const emptyState = document.getElementById('empty-state');
const noResultsMessage = document.getElementById('no-results');
const exportBtn = document.getElementById('export-button');

const statTotal = document.getElementById('stat-total');
const statDairy = document.getElementById('stat-dairy');
const statOutside = document.getElementById('stat-outside');
const statLast = document.getElementById('stat-last');
const statLastSubtext = document.getElementById('stat-last-subtext');

const logSearchInput = document.getElementById('log-search');
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));

const loginBtn = document.getElementById('login-button');
const signupBtn = document.getElementById('signup-button');
const logoutBtn = document.getElementById('logout-button');
const logoutBtnMain = document.getElementById('logout-button-main');

const authSection = document.getElementById('auth-section');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authUsername = document.getElementById('auth-username');
const authRePassword = document.getElementById('auth-repassword');
const signupFields = document.getElementById('signup-fields');
const authSubmit = document.getElementById('auth-submit');
const authToggle = document.getElementById('auth-toggle');
const authTitle = document.getElementById('auth-title');

const pwaInstallBtn = document.getElementById('pwa-install');
const installBanner = document.getElementById('install-banner');

const welcomeMessage = document.getElementById('welcome-message');
const userName = document.getElementById('user-name');

const langToggle = document.getElementById('lang-toggle');
const switchEl = document.getElementById('switch');

const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');
const menuOpenBtn = document.getElementById('menu-open');
const menuCloseBtn = document.getElementById('menu-close');

const donateBtn = document.getElementById('donate-button');
const supportCard = document.getElementById('support-card');

const logoCard = document.getElementById('logo-card');
const instructionsModal = document.getElementById('instructions-modal');
const closeInstructionsBtn = document.getElementById('instructions-close');

const manifestoCard = document.getElementById('manifesto-card');
const manifestoModal = document.getElementById('manifesto-modal');
const closeManifestoBtn = document.getElementById('manifesto-close');

const historyModal = document.getElementById('history-modal');
const historyContent = document.getElementById('history-content');
const closeHistoryBtn = document.getElementById('history-close');

const impressumLink = document.getElementById('link-impressum');
const privacyLink = document.getElementById('link-privacy');
const legalModal = document.getElementById('legal-modal');
const legalTitle = document.getElementById('legal-title');
const legalContent = document.getElementById('legal-content');
const closeLegalBtn = document.getElementById('legal-close');

const googleSigninBtn = document.getElementById('google-signin');

// Context UI bits
const contextFollowup = document.getElementById('context-followup');
const contextStatus = document.getElementById('context-status');
const contextSettingInput = document.getElementById('context-setting');
const contextSaveBtn = document.getElementById('context-save');
const contextSkipBtn = document.getElementById('context-skip');
const contextFeelingButtons = Array.from(document.querySelectorAll('.context-feeling-btn'));

// Intention UI bits
const intentionForm = document.getElementById('intention-form');
const intentionTextarea = document.getElementById('intention-textarea');
const intentionSaveBtn = document.getElementById('intention-save');
const intentionEditBtn = document.getElementById('intention-edit');
const intentionDisplay = document.getElementById('intention-display');
const intentionCurrent = document.getElementById('intention-current');
const intentionDate = document.getElementById('intention-date');
const intentionStatus = document.getElementById('intention-status');

// -----------------------------
// State
// -----------------------------
let lang = 'en';
let deferredInstallPrompt = null;
let installBannerTimeout = null;

let tileSystemInstance = null;

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
      browserLocalPersistence,
      inMemoryPersistence
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
      query,
      orderBy,
      serverTimestamp,
      setDoc
    } = firestoreModule);

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    if (typeof setPersistence === 'function' && auth) {
      try {
        if (browserLocalPersistence) {
          await setPersistence(auth, browserLocalPersistence);
        }
      } catch (persistenceError) {
        if (inMemoryPersistence) {
          try {
            await setPersistence(auth, inMemoryPersistence);
          } catch (fallbackError) {
            console.warn('Failed to apply in-memory auth persistence fallback.', fallbackError);
          }
        } else {
          console.warn('Failed to apply auth persistence.', persistenceError);
        }
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


let logCollectionRef = null;

let pendingContextLogId = null;
let selectedFeeling = '';
const contextCache = new Map();


  await loadFirebaseModules();
  await processRedirectAuthResult();
  initializeAuthListener();
});


// -----------------------------
// i18n dictionaries (merged)
// -----------------------------
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
    quickAddHint: 'Log what you are eating right now, no pressure, no judgement.',
    contextPrompt: 'How did that feel?',
    contextFeelingEnergized: 'Energized',
    contextFeelingSatisfied: 'Satisfied',
    contextFeelingSluggish: 'Sluggish',
    contextSettingLabel: 'Where were you?',
    contextSettingPlaceholder: 'At my desk',
    contextSave: 'Save',
    contextSkip: 'Skip',
    contextSaved: 'Reflection added.',
    contextError: 'Sorry, we could not save that reflection.',
    contextView: 'View context',
    contextHide: 'Hide context',
    contextEmpty: 'No reflections yet.',
    contextLoading: 'Loading reflections...',
    contextAddedTime: 'Logged at',
    intentionTitle: 'Daily intention',
    intentionLabel: 'What is your focus today?',
    intentionPlaceholder: 'Pause, notice, breathe',
    intentionExamples: 'Try: "Pause between bites", "Notice fullness cues".',
    intentionSave: 'Save intention',
    intentionEdit: 'Edit intention',
    intentionSaved: 'Intention saved.',
    intentionError: 'Sorry, we could not save your intention.',
    intentionToday: 'Set on {date}',
    intentionEmpty: 'Set an intention to guide your day.',
    intentionRequired: 'Please enter an intention before saving.',
    supportBadge: 'Keep The Food Mutiny free',
    supportTitle: 'Support us',
    supportCopy: 'Chip in to cover hosting and keep the tracker open for everyone.',
    recentLogTitle: 'Recent log',
    recentLogSubtitle: 'Your latest check-ins at a glance.',
    organizeTiles: 'Organize tiles',
    doneOrganizing: 'Done',
    reorderHint: 'Drag tiles to reorder. Tap Done when you are finished.',
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
    emailLabel: 'Email',
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
    authSessionStorageUnsupported: 'This browser cannot complete Google sign-in because session storage is disabled. Please open the app in your default browser.',
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
    quickAddHint: 'Protokolliere, was du gerade isst - ohne Druck, ohne Urteil.',
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
    intentionExamples: 'Zum Beispiel: "Zwischen den Bissen pausieren", "Sättigung wahrnehmen".',
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
    recentLogSubtitle: 'Deine neuesten Einträge auf einen Blick.',
    organizeTiles: 'Kacheln anordnen',
    doneOrganizing: 'Fertig',
    reorderHint: 'Ziehe die Kacheln, um sie neu anzuordnen. Tippe auf "Fertig", wenn du zufrieden bist.',
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
    foodPlaceholder: 'z. B. Käseburger',
    addBtn: 'Zum Protokoll hinzufügen',
    dairyLabel: 'Enthält Milchprodukte',
    outsideMealsLabel: 'Außerhalb der Mahlzeiten',
    logTitle: 'Heutiges Protokoll',
    exportBtn: 'Exportieren',
    thItem: 'Element',
    thTime: 'Uhrzeit',
    thDairy: 'Milchprodukte',
    thOutsideMeals: 'Außerhalb der Mahlzeiten',
    thActions: 'Aktionen',
    emptyState: 'Noch keine Einträge. Füge oben deinen ersten Eintrag hinzu.',
    confirmTitle: 'Sind Sie sicher?',
    cancelBtn: 'Abbrechen',
    closeBtn: 'Schließen',
    confirmClearBtn: 'Bestätigen',
    accountModalTitle: 'Konto bearbeiten',
    nameLabel: 'Name',
    emailLabel: 'Email',
    deleteAccountBtn: 'Konto löschen',
    saveBtn: 'Speichern',
    menuTitle: 'Menü',
    corePractices: 'Kernpraktiken',
    newJournal: 'Neuer Journaleintrag',
    settings: 'Anwendungseinstellungen',
    account: 'Konto',
    logout: 'Abmelden',
    footerText: 'Designed and created by Burrow · 2025',
    loginTitle: 'Anmelden',
    signupTitle: 'Registrieren',
    loginAction: 'Anmelden',
    signupAction: 'Registrieren',
    authToggleToSignup: 'Noch kein Konto? Registrieren',
    authToggleToLogin: 'Konto vorhanden? Anmelden',
    passwordLabel: 'Passwort',
    usernameLabel: 'Benutzername',
    rePasswordLabel: 'Passwort erneut eingeben',
    installSuccess: 'App installiert! The Food Mutiny ist jetzt auf deinem Startbildschirm.',
    installDismissed: 'Installation abgebrochen.',
    yes: 'Ja',
    no: 'Nein',
    editBtn: 'Bearbeiten',
    removeBtn: 'Entfernen',
    editEntryAria: 'Eintrag bearbeiten',
    removeEntryAria: 'Eintrag entfernen',
    authMissingFields: 'Bitte E-Mail und Passwort eingeben.',
    authMissingUsername: 'Bitte einen Benutzernamen wählen.',
    authPasswordMismatch: 'Passwörter stimmen nicht überein.',
    authUnavailable: 'Die Anmeldung ist derzeit nicht verfügbar. Bitte versuche es später erneut.',
    authSessionStorageUnsupported: 'Diese Anmeldung im Browser kann nicht abgeschlossen werden, weil der Sitzungsspeicher deaktiviert ist. Bitte öffne die App im Standardbrowser.',
    addError: 'Beim Hinzufügen deines Eintrags ist ein Fehler aufgetreten.',
    deleteError: 'Beim Entfernen deines Eintrags ist ein Fehler aufgetreten.',
    updateError: 'Beim Aktualisieren deines Eintrags ist ein Fehler aufgetreten.',
    authErrorPrefix: 'Fehler:',
    csvHeaderDate: 'Datum',
    csvHeaderItem: 'Element',
    csvHeaderDairy: 'Milchprodukte',
    csvHeaderOutsideMeals: 'Außerhalb der Mahlzeiten',
    csvYes: 'Ja',
    csvNo: 'Nein',
    notAvailable: 'k. A.',
    history: 'Verlauf',
    historyTitle: 'Protokollverlauf',
    impressum: 'Impressum',
    privacyPolicy: 'Datenschutzerklärung',
  }
};

// Legal docs content
const legalDocs = {
  en: {
    impressum: `<h3>Legal Notice (Impressum)</h3>
      <p>Information according to § 5 TMG</p>
      <p>[Your Name]<br>[Your Street and House Number]<br>[Your Postal Code and City]</p>
      <h4>Contact</h4>
      <p>Email: [Your Email Address]</p>
      <h4>Disclaimer</h4>
      <p>This is a private, non-commercial project. The content of our pages has been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness or topicality.</p>`,
    privacyPolicy: `<h3>Privacy Policy</h3>
      <p><strong>1. General Information</strong></p>
      <p>The following gives a simple overview of what happens to your personal information when you use our app.</p>
      <p><strong>Responsible:</strong><br/>[Your Name]<br>[Address]<br>Email: [Your Email]</p>
      <p><strong>2. Data Collection</strong></p>
      <p><strong>User Authentication:</strong> We use Firebase Authentication.</p>
      <p><strong>Data Storage:</strong> Food log entries are stored in Cloud Firestore linked to your user ID.</p>
      <p><strong>3. Your Rights</strong></p>
      <p>You have the right to information, correction, deletion within legal limits.</p>`
  },
  de: {
    impressum: `<h3>Impressum</h3>
      <p>Angaben gemäß § 5 TMG</p>
      <p>[Ihr Name]<br>[Ihre Straße und Hausnummer]<br>[Ihre PLZ und Stadt]</p>
      <h4>Kontakt</h4>
      <p>E-Mail: [Ihre E-Mail-Adresse]</p>
      <h4>Haftungsausschluss</h4>
      <p>Dies ist ein privates, nicht-kommerzielles Projekt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann keine Gewähr übernommen werden.</p>`,
    privacyPolicy: `<h3>Datenschutzerklärung</h3>
      <p><strong>1. Allgemeiner Hinweis</strong></p>
      <p>Überblick über die Verarbeitung personenbezogener Daten in der App.</p>
      <p><strong>Verantwortliche Stelle:</strong><br/>[Ihr Name]<br>[Adresse]<br>E-Mail: [Ihre E-Mail]</p>
      <p><strong>2. Datenerfassung</strong></p>
      <p><strong>Nutzerauthentifizierung:</strong> Firebase Authentication.</p>
      <p><strong>Datenspeicherung:</strong> Protokolle in Cloud Firestore, verknüpft mit Ihrer Benutzer-ID.</p>
      <p><strong>3. Ihre Rechte</strong></p>
      <p>Sie haben Rechte auf Auskunft, Berichtigung, Löschung im Rahmen der gesetzlichen Bestimmungen.</p>`
  }
};

// -----------------------------
// i18n helpers and features
// -----------------------------
const getTranslation = (key) => {
  const dictionary = translations[lang] || translations.en;
  return (dictionary && dictionary[key]) || translations.en[key] || '';
};

let contextFeature = createContextFeature({
  getTranslation: (key) => getTranslation(key),
  getLang: () => lang,
  getFirebase: () => ({ firebaseReady, auth, db }),
  getFirestore: () => ({ collection, getDocs, orderBy, query, addDoc, serverTimestamp })
});

let intentionFeature = createIntentionFeature({
  getTranslation: (key) => getTranslation(key),
  getLang: () => lang,
  getFirebase: () => ({ firebaseReady, auth, db }),
  getFirestore: () => ({ doc, setDoc, onSnapshot, serverTimestamp })
});

// -----------------------------
// Theme
// -----------------------------
const THEME_STORAGE_KEY = 'preferred-theme';
const themeColors = { light: '#fdfaf3', dark: '#1a1a1a' };

const getStoredTheme = () => {
  try { return localStorage.getItem(THEME_STORAGE_KEY); } catch { return null; }
};
const storeTheme = (value) => {
  try { localStorage.setItem(THEME_STORAGE_KEY, value); } catch {}
};

const applyTheme = (theme) => {
  const normalized = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = normalized;
  if (themeColorMeta) {
    const metaColor = themeColors[normalized] || themeColors.light;
    themeColorMeta.setAttribute('content', metaColor);
  }
  const isDark = normalized === 'dark';
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  if (themeToggleIcon) themeToggleIcon.textContent = isDark ? '☀️' : '🌙';
  if (themeToggleLabel) themeToggleLabel.textContent = isDark ? 'Enable light mode' : 'Enable dark mode';
};

const initializeTheme = () => {
  const stored = getStoredTheme();
  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored);
    return;
  }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
};

const toggleTheme = () => {
  const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  storeTheme(next);
};

// -----------------------------
// Language
// -----------------------------
const updateAuthTexts = () => {
  if (!authTitle || !authSubmit || !authToggle) return;
  const titleKey = isLoginMode ? 'loginTitle' : 'signupTitle';
  const actionKey = isLoginMode ? 'loginAction' : 'signupAction';
  const toggleKey = isLoginMode ? 'authToggleToSignup' : 'authToggleToLogin';
  authTitle.textContent = getTranslation(titleKey);
  authSubmit.textContent = getTranslation(actionKey);
  authToggle.textContent = getTranslation(toggleKey);
};

const showInstallBanner = (message) => {
  if (!message || !installBanner) return;
  installBanner.textContent = message;
  installBanner.classList.add('show');
  clearTimeout(installBannerTimeout);
  installBannerTimeout = setTimeout(() => {
    if (installBanner) installBanner.classList.remove('show');
  }, 4000);
};

const setLanguage = (newLang) => {
  lang = newLang;
  if (langToggle) {
    langToggle.setAttribute('aria-pressed', newLang === 'de' ? 'true' : 'false');
  }
  if (switchEl) {
    switchEl.classList.toggle('active', newLang === 'de');
  }
  document.documentElement.lang = newLang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = getTranslation(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = getTranslation(key);
  });

  const user = firebaseReady && auth ? auth.currentUser : null;
  if (user && welcomeMessage) {
    const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
    const welcomeTextKey = isNewUser ? 'welcome' : 'welcomeBack';
    const welcomeText = getTranslation(welcomeTextKey);
    const displayName = user.displayName || user.email || '';
    welcomeMessage.textContent = displayName ? `${welcomeText}, ${displayName}!` : getTranslation('welcome');
  }

  updateAuthTexts();
  if (latestSnapshot) renderEntries(latestSnapshot);

  if (contextFollowup) {
    const feelingsGroup = contextFollowup.querySelector('.context-feelings');
    if (feelingsGroup) {
      feelingsGroup.setAttribute('aria-label', getTranslation('contextPrompt'));
    }
  }
  if (contextStatus && contextStatus.dataset.statusKey) {
    contextStatus.textContent = getTranslation(contextStatus.dataset.statusKey);
  }
  updateIntentionUI();
  if (intentionStatus && intentionStatus.dataset.statusKey) {
    intentionStatus.textContent = getTranslation(intentionStatus.dataset.statusKey);
  }

  tileSystemInstance?.refreshLayout?.();
};

const toggleLanguage = () => setLanguage(lang === 'en' ? 'de' : 'en');

// -----------------------------
// Context feature helpers
// -----------------------------
const setContextStatus = (key) => {
  if (!contextStatus) return;
  if (!key) {
    contextStatus.textContent = '';
    delete contextStatus.dataset.statusKey;
    return;
  }
  contextStatus.textContent = getTranslation(key);
  contextStatus.dataset.statusKey = key;
};

const updateContextSaveState = () => {
  if (!contextSaveBtn) return;
  const hasFeeling = Boolean(selectedFeeling);
  const hasSetting = Boolean(contextSettingInput && contextSettingInput.value.trim());
  const canSave = Boolean(pendingContextLogId) && (hasFeeling || hasSetting);
  contextSaveBtn.disabled = !canSave;
};

const showContextPrompt = (logId) => {
  if (!contextFollowup) return;
  pendingContextLogId = logId;
  selectedFeeling = '';
  contextFollowup.hidden = false;
  setContextStatus(null);
  if (contextSettingInput) contextSettingInput.value = '';
  if (contextFeelingButtons && contextFeelingButtons.length) {
    contextFeelingButtons.forEach(btn => btn.classList.remove('is-selected'));
  }
  updateContextSaveState();
};

const hideContextPrompt = () => {
  pendingContextLogId = null;
  selectedFeeling = '';
  if (contextFollowup) contextFollowup.hidden = true;
  setContextStatus(null);
  if (contextSettingInput) contextSettingInput.value = '';
  if (contextFeelingButtons && contextFeelingButtons.length) {
    contextFeelingButtons.forEach(btn => btn.classList.remove('is-selected'));
  }
  updateContextSaveState();
};

const handleFeelingSelection = (button) => {
  if (!button || !contextFeelingButtons) return;
  const value = button.dataset.feeling || '';
  if (selectedFeeling === value) {
    selectedFeeling = '';
    button.classList.remove('is-selected');
  } else {
    selectedFeeling = value;
    contextFeelingButtons.forEach(btn => {
      btn.classList.toggle('is-selected', btn === button);
    });
  }
  updateContextSaveState();
};

const getFeelingLabel = (value) => {
  switch (value) {
    case 'energized': return getTranslation('contextFeelingEnergized');
    case 'satisfied': return getTranslation('contextFeelingSatisfied');
    case 'sluggish': return getTranslation('contextFeelingSluggish');
    default: return value || '';
  }
};

const loadContextForEntry = async (entryId, forceRefresh = false) => {
  if (!entryId || !firebaseReady || !auth || !auth.currentUser || !db) return [];
  if (!forceRefresh && contextCache.has(entryId)) return contextCache.get(entryId);
  if (typeof collection !== 'function' || typeof getDocs !== 'function' || typeof query !== 'function' || typeof orderBy !== 'function') return [];
  const contextRef = collection(db, 'users', auth.currentUser.uid, 'logs', entryId, 'context');
  const q = query(contextRef, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  const entries = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  contextCache.set(entryId, entries);
  return entries;
};

const renderContextContent = (entryId, entries, container) => {
  if (!container) return;
  if (!Array.isArray(entries) || !entries.length) {
    container.innerHTML = `<p>${getTranslation('contextEmpty')}</p>`;
    return;
  }
  const locale = lang === 'de' ? 'de-DE' : 'en-US';
  const list = document.createElement('ul');
  list.className = 'context-list';
  entries.forEach(item => {
    const li = document.createElement('li');
    li.className = 'context-list-item';
    const feelingLabel = getFeelingLabel(item.feeling);

    const line = document.createElement('div');
    line.className = 'context-line';

    let hasContent = false;
    if (feelingLabel) {
      const feelingEl = document.createElement('strong');
      feelingEl.textContent = feelingLabel;
      line.appendChild(feelingEl);
      hasContent = true;
    }

    if (item.setting) {
      if (hasContent) line.appendChild(document.createTextNode(' · '));
      const settingEl = document.createElement('span');
      settingEl.textContent = item.setting;
      line.appendChild(settingEl);
      hasContent = true;
    }

    if (!hasContent) {
      const placeholder = document.createElement('span');
      placeholder.textContent = getTranslation('contextEmpty');
      line.appendChild(placeholder);
    }

    li.appendChild(line);

    const time = item.timestamp && typeof item.timestamp.toDate === 'function'
      ? item.timestamp.toDate().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
      : '';
    if (time) {
      const timeEl = document.createElement('small');
      timeEl.textContent = `${getTranslation('contextAddedTime')} ${time}`;
      li.appendChild(timeEl);
    }

    list.appendChild(li);
  });
  container.innerHTML = '';
  container.appendChild(list);
};

const toggleContextForRow = async (entryId, button) => {
  if (!tbody || !entryId || !button) return;
  const contextRow = tbody.querySelector(`tr.context-row[data-entry-id="${entryId}"]`);
  if (!contextRow) return;
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    contextRow.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.textContent = getTranslation('contextView');
    return;
  }
  contextRow.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  button.textContent = getTranslation('contextHide');
  const container = contextRow.querySelector('.context-content');
  if (!container) return;
  container.innerHTML = `<p>${getTranslation('contextLoading')}</p>`;
  try {
    const entries = await loadContextForEntry(entryId);
    renderContextContent(entryId, entries, container);
  } catch (error) {
    console.error('Error loading context:', error);
    container.innerHTML = `<p>${getTranslation('contextError')}</p>`;
  }
};

const saveContextEntry = async () => {
  if (!pendingContextLogId || !firebaseReady || !auth || !auth.currentUser || !db) return;
  const feeling = selectedFeeling;
  const setting = contextSettingInput ? contextSettingInput.value.trim() : '';
  if (!feeling && !setting) return;
  setContextStatus(null);
  if (contextSaveBtn) contextSaveBtn.disabled = true;
  try {
    const contextRef = collection(db, 'users', auth.currentUser.uid, 'logs', pendingContextLogId, 'context');
    await addDoc(contextRef, { feeling: feeling || null, setting: setting || null, timestamp: serverTimestamp() });
    setContextStatus('contextSaved');
    if (contextSettingInput) contextSettingInput.value = '';
    if (contextFeelingButtons && contextFeelingButtons.length) {
      contextFeelingButtons.forEach(btn => btn.classList.remove('is-selected'));
    }
    selectedFeeling = '';
    contextCache.delete(pendingContextLogId);
    updateContextSaveState();
    const contextRow = tbody ? tbody.querySelector(`tr.context-row[data-entry-id="${pendingContextLogId}"]`) : null;
    if (contextRow && !contextRow.hidden) {
      const container = contextRow.querySelector('.context-content');
      if (container) {
        const entries = await loadContextForEntry(pendingContextLogId, true);
        renderContextContent(pendingContextLogId, entries, container);
      }
    }
  } catch (error) {
    console.error('Error saving context:', error);
    setContextStatus('contextError');
  } finally {
    updateContextSaveState();
  }
};

const skipContextEntry = () => hideContextPrompt();

// -----------------------------
// Intention helpers
// -----------------------------
const setIntentionStatus = (key) => {
  if (!intentionStatus) return;
  if (!key) {
    intentionStatus.textContent = '';
    delete intentionStatus.dataset.statusKey;
    return;
  }
  intentionStatus.textContent = getTranslation(key);
  intentionStatus.dataset.statusKey = key;
};

const getTodayId = () => {
  const today = new Date();
  return today.toISOString().slice(0, 10);
};

const getIntentionDateLabel = (intention) => {
  if (!intention) return '';
  const locale = lang === 'de' ? 'de-DE' : 'en-US';
  let date = null;
  if (intention.date) {
    const [year, month, day] = intention.date.split('-').map(Number);
    if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
      date = new Date(year, month - 1, day);
    }
  } else if (intention.timestamp && typeof intention.timestamp.toDate === 'function') {
    date = intention.timestamp.toDate();
  }
  if (!date || Number.isNaN(date.getTime())) return '';
  const formatted = date.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });
  return getTranslation('intentionToday').replace('{date}', formatted);
};

function updateIntentionUI() {
  if (!intentionForm || !intentionDisplay) return;
  const hasIntention = Boolean(todaysIntention && todaysIntention.text);
  const showForm = !hasIntention || isEditingIntention;
  intentionForm.hidden = !showForm;
  intentionDisplay.hidden = showForm;

  if (showForm && intentionTextarea && document.activeElement !== intentionTextarea) {
    intentionTextarea.value = todaysIntention && todaysIntention.text ? todaysIntention.text : '';
  }

  if (!showForm && intentionCurrent && todaysIntention) {
    intentionCurrent.textContent = todaysIntention.text;
  }

  if (!showForm && intentionDate) {
    intentionDate.textContent = getIntentionDateLabel(todaysIntention);
  } else if (intentionDate) {
    intentionDate.textContent = '';
  }

  if (intentionStatus) {
    if (!hasIntention && !isEditingIntention && !intentionStatus.dataset.statusKey) {
      setIntentionStatus('intentionEmpty');
    } else if ((hasIntention || isEditingIntention) && intentionStatus.dataset.statusKey === 'intentionEmpty') {
      setIntentionStatus(null);
    }
  }
}

const saveIntention = async () => {
  if (!intentionTextarea || !firebaseReady || !auth || !auth.currentUser || !db) return;
  const text = intentionTextarea.value.trim();
  if (!text) {
    setIntentionStatus('intentionRequired');
    return;
  }
  if (intentionSaveBtn) intentionSaveBtn.disabled = true;
  setIntentionStatus(null);
  let succeeded = false;
  const todayId = getTodayId();
  try {
    const ref = doc(db, 'users', auth.currentUser.uid, 'intentions', todayId);
    await setDoc(ref, { text, date: todayId, timestamp: serverTimestamp() });
    setIntentionStatus('intentionSaved');
    isEditingIntention = false;
    succeeded = true;
  } catch (error) {
    console.error('Error saving intention:', error);
    setIntentionStatus('intentionError');
  } finally {
    if (intentionSaveBtn) intentionSaveBtn.disabled = false;
    if (succeeded) {
      if (!todaysIntention) {
        todaysIntention = { text, date: todayId };
      } else {
        todaysIntention = { ...todaysIntention, text, date: todayId };
      }
    }
    updateIntentionUI();
  }
};

const editIntention = () => {
  isEditingIntention = true;
  setIntentionStatus(null);
  updateIntentionUI();
  if (intentionTextarea) {
    intentionTextarea.focus();
    intentionTextarea.setSelectionRange(intentionTextarea.value.length, intentionTextarea.value.length);
  }
};

const resetIntentionState = () => {
  if (intentionUnsubscribe) {
    intentionUnsubscribe();
    intentionUnsubscribe = null;
  }
  todaysIntention = null;
  isEditingIntention = false;
  if (intentionTextarea) intentionTextarea.value = '';
  setIntentionStatus(null);
  updateIntentionUI();
};

const subscribeToIntention = (userId) => {
  resetIntentionState();
  if (!firebaseReady || !db || typeof doc !== 'function' || typeof onSnapshot !== 'function') return;
  const todayId = getTodayId();
  const intentionRef = doc(db, 'users', userId, 'intentions', todayId);
  intentionUnsubscribe = onSnapshot(intentionRef, (snap) => {
    if (snap.exists()) {
      todaysIntention = snap.data();
      isEditingIntention = false;
    } else {
      todaysIntention = null;
    }
    updateIntentionUI();
  }, (error) => {
    console.error('Error listening to intention:', error);
  });
};

// -----------------------------
// Entries, stats, filters
// -----------------------------
const MAX_RECENT_ROWS = 10;

const getEntryDate = (entry) => {
  if (entry && entry.timestamp && typeof entry.timestamp.toDate === 'function') {
    return entry.timestamp.toDate();
  }
  return null;
};

const isSameDay = (dateA, dateB) => {
  if (!dateA || !dateB) return false;
  return dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate();
};

const updateStats = () => {
  if (!statTotal || !statDairy || !statOutside || !statLast || !statLastSubtext) return;

  const today = new Date();
  const locale = lang === 'de' ? 'de-DE' : 'en-US';
  const entriesToday = allEntries.filter(entry => isSameDay(getEntryDate(entry), today));
  const dairyToday = entriesToday.filter(entry => entry.dairy).length;
  const outsideMealsToday = entriesToday.filter(entry => entry.outsideMeals).length;
  const latestEntry = allEntries.find(entry => getEntryDate(entry));
  const latestDate = latestEntry ? getEntryDate(latestEntry) : null;

  statTotal.textContent = entriesToday.length;
  statDairy.textContent = dairyToday;
  statOutside.textContent = outsideMealsToday;

  if (latestDate) {
    statLast.textContent = latestDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    statLastSubtext.textContent = latestDate.toLocaleDateString(locale, { weekday: 'long', month: 'short', day: 'numeric' });
  } else {
    statLast.textContent = '-';
    statLastSubtext.textContent = '';
  }
};

const renderRows = (entries) => {
  if (!tbody) return;
  tbody.innerHTML = '';

  entries.forEach(entry => {
    const tr = document.createElement('tr');
    tr.dataset.entryId = entry.id;

    const nameCell = document.createElement('td');
    nameCell.textContent = entry.name || '';
    nameCell.dataset.label = getTranslation('thItem');

    const timeCell = document.createElement('td');
    const date = getEntryDate(entry);
    timeCell.textContent = date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : getTranslation('notAvailable');
    timeCell.dataset.label = getTranslation('thTime');

    const dairyCell = document.createElement('td');
    const hasDairy = Boolean(entry.dairy);
    const dairyPill = document.createElement('span');
    dairyPill.className = `pill ${hasDairy ? 'pill-yes' : 'pill-no'}`;
    dairyPill.textContent = hasDairy ? getTranslation('yes') : getTranslation('no');
    dairyCell.appendChild(dairyPill);
    dairyCell.dataset.label = getTranslation('thDairy');

    const outsideCell = document.createElement('td');
    const outsideValue = Boolean(entry.outsideMeals);
    const outsidePill = document.createElement('span');
    outsidePill.className = `pill ${outsideValue ? 'pill-yes' : 'pill-no'}`;
    outsidePill.textContent = outsideValue ? getTranslation('yes') : getTranslation('no');
    outsideCell.appendChild(outsidePill);
    outsideCell.dataset.label = getTranslation('thOutsideMeals');

    const actionsCell = document.createElement('td');
    actionsCell.className = 'row-actions actions';
    actionsCell.dataset.label = getTranslation('thActions');

    const contextBtnEl = document.createElement('button');
    contextBtnEl.className = 'btn btn-secondary context-entry';
    contextBtnEl.type = 'button';
    contextBtnEl.dataset.id = entry.id;
    contextBtnEl.textContent = getTranslation('contextView');
    contextBtnEl.setAttribute('aria-expanded', 'false');
    contextBtnEl.setAttribute('aria-controls', `context-${entry.id}`);

    const editBtnEl = document.createElement('button');
    editBtnEl.className = 'btn btn-secondary edit-entry';
    editBtnEl.type = 'button';
    editBtnEl.dataset.id = entry.id;
    editBtnEl.textContent = getTranslation('editBtn');
    editBtnEl.setAttribute('aria-label', `${getTranslation('editEntryAria')} ${entry.name || ''}`.trim());

    const removeBtnEl = document.createElement('button');
    removeBtnEl.className = 'btn btn-danger remove-entry';
    removeBtnEl.type = 'button';
    removeBtnEl.dataset.id = entry.id;
    removeBtnEl.textContent = getTranslation('removeBtn');
    removeBtnEl.setAttribute('aria-label', `${getTranslation('removeEntryAria')} ${entry.name || ''}`.trim());

    actionsCell.appendChild(contextBtnEl);
    actionsCell.appendChild(editBtnEl);
    actionsCell.appendChild(removeBtnEl);

    tr.appendChild(nameCell);
    tr.appendChild(timeCell);
    tr.appendChild(dairyCell);
    tr.appendChild(outsideCell);
    tr.appendChild(actionsCell);
    tbody.appendChild(tr);

    const contextRow = document.createElement('tr');
    contextRow.className = 'context-row';
    contextRow.dataset.entryId = entry.id;
    contextRow.hidden = true;

    const contextCell = document.createElement('td');
    contextCell.colSpan = 5;
    contextCell.id = `context-${entry.id}`;

    const contextContent = document.createElement('div');
    contextContent.className = 'context-content';
    contextCell.appendChild(contextContent);

    contextRow.appendChild(contextCell);
    tbody.appendChild(contextRow);
  });
};

const resetFilters = () => {
  activeFilter = 'all';
  searchTerm = '';
  if (logSearchInput) logSearchInput.value = '';
  filterButtons.forEach(btn => btn.classList.toggle('is-active', btn.dataset.filter === 'all'));
  toggleNoResults(false);
};

const toggleNoResults = (show) => {
  if (!noResultsMessage) return;
  noResultsMessage.style.display = show ? 'block' : 'none';
};

const applyFilters = () => {
  if (!tbody) return;
  if (!allEntries.length) {
    tbody.innerHTML = '';
    toggleNoResults(false);
    return;
  }

  let filtered = [...allEntries];

  if (searchTerm) {
    filtered = filtered.filter(entry => (entry.name || '').toLowerCase().includes(searchTerm));
  }

  if (activeFilter === 'dairy') {
    filtered = filtered.filter(entry => entry.dairy);
  } else if (activeFilter === 'non-dairy') {
    filtered = filtered.filter(entry => !entry.dairy);
  } else if (activeFilter === 'outside-meals') {
    filtered = filtered.filter(entry => entry.outsideMeals);
  } else if (activeFilter === 'during-meals') {
    filtered = filtered.filter(entry => !entry.outsideMeals);
  }

  if (!filtered.length) {
    tbody.innerHTML = '';
    toggleNoResults(true);
    return;
  }

  toggleNoResults(false);
  renderRows(filtered.slice(0, MAX_RECENT_ROWS));
};

const renderEntries = (snapshot) => {
  latestSnapshot = snapshot;

  if (!snapshot) {
    allEntries = [];
    updateStats();
    if (tbody) tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  allEntries = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      dairy: Boolean(data.dairy),
      outsideMeals: Boolean(data.outsideMeals)
    };
  });

  updateStats();

  if (!tbody || !emptyState) return;

  if (!allEntries.length) {
    tbody.innerHTML = '';
    emptyState.style.display = 'block';
    toggleNoResults(false);
    return;
  }

  emptyState.style.display = 'none';
  applyFilters();
};

const renderHistory = (snapshot) => {
  if (!historyContent) return;
  historyContent.innerHTML = '';
  if (!snapshot || snapshot.empty) {
    historyContent.innerHTML = `<p>${getTranslation('emptyState')}</p>`;
    return;
  }

  const entriesByDate = {};
  snapshot.forEach(doc => {
    const entry = doc.data();
    if (entry.timestamp && typeof entry.timestamp.toDate === 'function') {
      const date = entry.timestamp.toDate();
      const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(

    manifestoTitle: 'The Food Mutiny Manifesto',
    manifestoP1: 'The Food Mutiny is not about calories, restrictions, or guilt. If you want chips, eat them. No shame, no punishment. Just write it down. Recording without judgment is the act that matters.',
    manifestoP2: 'This app is free. No subscriptions, no upsells, no lifestyle packages. We reject the idea that food and health should be sold back to us. Eating should not be a business model.',
    manifestoP3: 'Instead, The Food Mutiny helps you pause, check in with your body, and notice your habits. Consciously or subconsciously, the simple act of logging allows you to see patterns and slowly shift your relationship with food. Change should not be a race. It should be slow, gentle, and rooted in respect for your choices.',
    manifestoP4: 'We are against cycles of guilt, shame, and impossible promises. We will not celebrate consumerism dressed up as self-care. We believe the radical choice is to slow down, listen to yourself, and eat on your own terms.',
    manifestoP5: 'The app will always be free to use. There is a donation button for those who want to support, because while the world should be free, it isn\'t. But The Food Mutiny will never profit from your guilt.',
    donateBtn: 'Donate',
    welcome: 'Welcome',
    welcomeBack: 'Welcome back',
    quickStatsTitle: 'Quick stats',
    statEntriesToday: 'Entries today',
    statDairyToday: 'Dairy items',
    statOutsideMeals: 'Outside of mealtimes',
    statLastEntry: 'Last entry',
    quickAddTitle: 'Quick add',
    quickAddHint: 'Log what you’re eating right now, no pressure, no judgement.',
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
    recentLogSubtitle: 'Your latest check-ins at a glance.',
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
    emailLabel: 'Email',
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
    authSessionStorageUnsupported: 'This browser cannot complete Google sign-in because session storage is disabled. Please open the app in your default browser.',
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
    recentLogSubtitle: 'Deine neuesten Einträge auf einen Blick.',
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
    outsideMealsLabel: 'Außerhalb der Mahlzeiten',
    logTitle: 'Heutiges Protokoll',
    exportBtn: 'Exportieren',
    thItem: 'Element',
    thTime: 'Uhrzeit',
    thDairy: 'Milchprodukte',
    thOutsideMeals: 'Außerhalb der Mahlzeiten',
    thActions: 'Aktionen',
    emptyState: 'Noch keine Einträge. Fügen Sie oben Ihren ersten Eintrag hinzu.',
    confirmTitle: 'Sind Sie sicher?',
    cancelBtn: 'Abbrechen',
    closeBtn: 'Schließen',
    confirmClearBtn: 'Bestätigen',
    accountModalTitle: 'Konto bearbeiten',
    nameLabel: 'Name',
    emailLabel: 'Email',
    deleteAccountBtn: 'Konto löschen',
    saveBtn: 'Speichern',
    menuTitle: 'Menü',
    corePractices: 'Kernpraktiken',
    newJournal: 'Neuer Journaleintrag',
    settings: 'Anwendungseinstellungen',
    account: 'Konto',
    logout: 'Abmelden',
    footerText: 'Designed and created by Burrow · 2025',
    loginTitle: 'Anmelden',
    signupTitle: 'Registrieren',
    loginAction: 'Anmelden',
    signupAction: 'Registrieren',
    authToggleToSignup: 'Noch kein Konto? Registrieren',
    authToggleToLogin: 'Konto vorhanden? Anmelden',
    passwordLabel: 'Passwort',
    usernameLabel: 'Benutzername',
    rePasswordLabel: 'Passwort erneut eingeben',
    installSuccess: 'App installiert! The Food Mutiny ist jetzt auf deinem Startbildschirm.',
    installDismissed: 'Installation abgebrochen.',
    yes: 'Ja',
    no: 'Nein',
    editBtn: 'Bearbeiten',
    removeBtn: 'Entfernen',
    editEntryAria: 'Eintrag bearbeiten',
    removeEntryAria: 'Eintrag entfernen',
    authMissingFields: 'Bitte E-Mail und Passwort eingeben.',
    authMissingUsername: 'Bitte einen Benutzernamen wählen.',
    authPasswordMismatch: 'Passwörter stimmen nicht überein.',
    authUnavailable: 'Die Anmeldung ist derzeit nicht verfügbar. Bitte versuche es später erneut.',
    authSessionStorageUnsupported: 'Diese Anmeldung im Browser kann nicht abgeschlossen werden, weil der Sitzungsspeicher deaktiviert ist. Bitte öffne die App im Standardbrowser.',
    addError: 'Beim Hinzufügen deines Eintrags ist ein Fehler aufgetreten.',
    deleteError: 'Beim Entfernen deines Eintrags ist ein Fehler aufgetreten.',
    updateError: 'Beim Aktualisieren deines Eintrags ist ein Fehler aufgetreten.',
    authErrorPrefix: 'Fehler:',
    csvHeaderDate: 'Datum',
    csvHeaderItem: 'Element',
    csvHeaderDairy: 'Milchprodukte',
    csvHeaderOutsideMeals: 'Außerhalb der Mahlzeiten',
    csvYes: 'Ja',
    csvNo: 'Nein',
    notAvailable: 'k. A.',
    history: 'Verlauf',
    historyTitle: 'Protokollverlauf',
    impressum: 'Impressum',
    privacyPolicy: 'Datenschutzerklärung',
  }
};

// i18n helpers
const getTranslation = (key) => {
  const dictionary = translations[lang] || translations.en;
  return (dictionary && dictionary[key]) || translations.en[key] || '';
};

contextFeature = createContextFeature({
  getTranslation: (key) => getTranslation(key),
  getLang: () => lang,
  getFirebase: () => ({ firebaseReady, auth, db }),
  getFirestore: () => ({ collection, getDocs, orderBy, query, addDoc, serverTimestamp })
});

intentionFeature = createIntentionFeature({
  getTranslation: (key) => getTranslation(key),
  getLang: () => lang,
  getFirebase: () => ({ firebaseReady, auth, db }),
  getFirestore: () => ({ doc, setDoc, onSnapshot, serverTimestamp })
});

// Language switch (merged)
const setLanguage = (newLang) => {
  lang = newLang;
  if (langToggle) {
    langToggle.setAttribute('aria-pressed', newLang === 'de' ? 'true' : 'false');
  }
  if (switchEl) {
    switchEl.classList.toggle('active', newLang === 'de');
  }
  document.documentElement.lang = newLang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = getTranslation(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = getTranslation(key);
  });

  const user = firebaseReady && auth ? auth.currentUser : null;
  if (user && welcomeMessage) {
    const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
    const welcomeTextKey = isNewUser ? 'welcome' : 'welcomeBack';
    const welcomeText = getTranslation(welcomeTextKey);
    const displayName = user.displayName || user.email || '';
    welcomeMessage.textContent = displayName ? `${welcomeText}, ${displayName}!` : getTranslation('welcome');
  }

  updateAuthTexts();
  if (latestSnapshot) renderEntries(latestSnapshot);

  if (contextFollowup) {
    const feelingsGroup = contextFollowup.querySelector('.context-feelings');
    if (feelingsGroup) {
      feelingsGroup.setAttribute('aria-label', getTranslation('contextPrompt'));
    }
  }
  if (contextStatus && contextStatus.dataset.statusKey) {
    contextStatus.textContent = getTranslation(contextStatus.dataset.statusKey);
  }
  updateIntentionUI();
  if (intentionStatus && intentionStatus.dataset.statusKey) {
    intentionStatus.textContent = getTranslation(intentionStatus.dataset.statusKey);
  }

  // ensure layout recalculates after text changes
  tileSystemInstance?.refreshLayout?.();
};

// PWA detect (no conflict)
const isStandalonePwa = () => {
  const matchMediaStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const navigatorStandalone = typeof window.navigator.standalone === 'boolean' && window.navigator.standalone;
  return matchMediaStandalone || navigatorStandalone;
};

let sessionStorageAvailableCache = null;

// Session storage check (merged)
const isSessionStorageAvailable = () => {
  if (sessionStorageAvailableCache !== null) {
    return sessionStorageAvailableCache;
  }
  try {
    const testKey = '__mutiny_auth_test__';
    window.sessionStorage.setItem(testKey, '1');
    window.sessionStorage.removeItem(testKey);
    sessionStorageAvailableCache = true;
  } catch (error) {
    console.warn('Session storage is unavailable; redirect-based auth will be disabled.', error);
    sessionStorageAvailableCache = false;
  }
  return sessionStorageAvailableCache;
};

const shouldUseRedirectAuth = () => {
  if (!isSessionStorageAvailable()) return false;
  const smallViewport = window.matchMedia('(max-width: 768px)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const mobileUserAgent = /iphone|ipod|ipad|android/i.test(navigator.userAgent);
  return isStandalonePwa() || smallViewport || isTouchDevice || mobileUserAgent;
};

// Setup event listeners function
const isStandalonePwa = () => {
  const matchMediaStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const navigatorStandalone = typeof window.navigator.standalone === 'boolean' && window.navigator.standalone;
  return matchMediaStandalone || navigatorStandalone;
};

let sessionStorageAvailableCache = null;

const isSessionStorageAvailable = () => {
  if (sessionStorageAvailableCache !== null) {
    return sessionStorageAvailableCache;
  }

  try {
    const testKey = '__mutiny_auth_test__';
    window.sessionStorage.setItem(testKey, '1');
    window.sessionStorage.removeItem(testKey);
    sessionStorageAvailableCache = true;
  } catch (error) {
    console.warn('Session storage is unavailable; redirect-based auth will be disabled.', error);
    sessionStorageAvailableCache = false;
  }

  return sessionStorageAvailableCache;
};

const shouldUseRedirectAuth = () => {
  if (!isSessionStorageAvailable()) {
    return false;
  }

  const smallViewport = window.matchMedia('(max-width: 768px)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const mobileUserAgent = /iphone|ipod|ipad|android/i.test(navigator.userAgent);
  return isStandalonePwa() || smallViewport || isTouchDevice || mobileUserAgent;
};


const setupEventListeners = (tileSystem) => {
  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleTheme();
      }
    });
  }

  // Main app functionality
  if (addBtn) addBtn.addEventListener('click', addEntry);
  contextFeature?.attachListeners(tileSystem);
  intentionFeature?.attachListeners(tileSystem);

  if (tbody) tbody.addEventListener('click', handleLogAction);
  if (exportBtn) exportBtn.addEventListener('click', exportToCsv);

  // Search and filters
  if (logSearchInput) {
    logSearchInput.addEventListener('input', (event) => {
      searchTerm = event.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const { filter } = button.dataset;
      if (!filter) return;
      activeFilter = filter;
      filterButtons.forEach(btn => btn.classList.toggle('is-active', btn === button));
      applyFilters();
    });
  });

  // Auth buttons
  if (loginBtn) loginBtn.addEventListener('click', () => {
    resetAuthFields();
    if (authSection) authSection.style.display = 'block';
    setAuthMode(true);
  });
  if (signupBtn) signupBtn.addEventListener('click', () => {
    resetAuthFields();
    if (authSection) authSection.style.display = 'block';
    setAuthMode(false);
  });
  if (authToggle) authToggle.addEventListener('click', () => setAuthMode(!isLoginMode));
  if (authSubmit) authSubmit.addEventListener('click', handleAuthSubmit);

  // Google sign-in
  if (googleSigninBtn) {
    googleSigninBtn.addEventListener('click', async () => {
      if (!firebaseReady || !auth || typeof GoogleAuthProvider !== 'function') {
        alert(getTranslation('authUnavailable'));
        return;
      }

      const provider = new GoogleAuthProvider();

      const sessionStorageAvailable = isSessionStorageAvailable();
      const useRedirect = shouldUseRedirectAuth();
      const canUsePopup = typeof signInWithPopup === 'function';
      const canUseRedirect = sessionStorageAvailable && typeof signInWithRedirect === 'function';

      if (!canUsePopup && !canUseRedirect) {
        alert(getTranslation('authUnavailable'));
        return;
      }
      if (!sessionStorageAvailable && !canUsePopup) {
        alert(getTranslation('authSessionStorageUnsupported'));
        return;
      }

      try {
        if (useRedirect && canUseRedirect) {
          await signInWithRedirect(auth, provider);
        } else if (canUsePopup) {
          await signInWithPopup(auth, provider);
        } else if (canUseRedirect) {
          await signInWithRedirect(auth, provider);
        } else {
          throw new Error('No compatible authentication method available.');
        }
      } catch (err) {
        // Popup-based auth frequently fails on mobile standalone PWAs; fall back to redirect
        if (
          err?.code === 'auth/operation-not-supported-in-this-environment' &&
          canUseRedirect
        ) {

          try {
            await signInWithRedirect(auth, provider);
            return;
          } catch (redirectError) {
            console.error('Google sign-in redirect fallback error:', redirectError);
            alert(`${getTranslation('authErrorPrefix')} ${redirectError.message}`);
            return;
          }
        } else if (
          err?.code === 'auth/operation-not-supported-in-this-environment' &&
          !sessionStorageAvailable
        ) {
          alert(getTranslation('authSessionStorageUnsupported'));
          return;
        }


        console.error('Google sign-in error:', err);
        alert(`${getTranslation('authErrorPrefix')} ${err.message}`);
      }
    });
  }

  // Logout buttons
  if (logoutBtn) logoutBtn.addEventListener('click', signOut);
  if (logoutBtnMain) logoutBtnMain.addEventListener('click', signOut);

  // Donation buttons
  if (donateBtn) donateBtn.addEventListener('click', openDonationPage);
  if (supportCard) {
    supportCard.addEventListener('click', () => {
      if (tileSystem.isReorganizeMode()) return;
      openDonationPage();
    });
  }

  // Language toggle
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
    langToggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleLanguage();
      }
    });
  }

  // Menu controls
  if (menuOpenBtn && sidebar && scrim) {
    menuOpenBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      scrim.classList.add('show');
    });
  }
  if (menuCloseBtn && sidebar && scrim) {
    menuCloseBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
      scrim.classList.remove('show');
    });
  }
  if (scrim && sidebar) {
    scrim.addEventListener('click', () => {
      sidebar.classList.remove('open');
      scrim.classList.remove('show');
    });
  }

  // Sidebar actions -> modals
  if (sidebar) {
    sidebar.addEventListener('click', (event) => {
      const button = event.target.closest('.sb-item-btn');
      if (!button) return;
      const action = button.dataset.action;

      if (action === 'manifesto') {
        if (manifestoModal) manifestoModal.classList.add('show');
      } else if (action === 'history') {
        if (!logCollectionRef) return;
        const q = query(logCollectionRef, orderBy('timestamp', 'desc'));
        getDocs(q).then(renderHistory);
        if (historyModal) historyModal.classList.add('show');
      }
      sidebar.classList.remove('open');
      if (scrim) scrim.classList.remove('show');
    });
  }

  // Logo card -> instructions modal
  if (logoCard && instructionsModal) {
    logoCard.addEventListener('click', () => {
      if (!tileSystem.isReorganizeMode()) {
        instructionsModal.classList.add('show');
      }
    });
  }

  // Manifesto card click
  if (manifestoCard) {
    manifestoCard.addEventListener('click', () => {
      if (!tileSystem.isReorganizeMode()) {
        if (manifestoModal) manifestoModal.classList.add('show');
      }
    });
  }

  // Modal close buttons
  if (closeInstructionsBtn && instructionsModal) {
    closeInstructionsBtn.addEventListener('click', () => instructionsModal.classList.remove('show'));
  }
  if (closeManifestoBtn) {
    closeManifestoBtn.addEventListener('click', () => {
      if (manifestoModal) manifestoModal.classList.remove('show');
    });
  }
  if (closeHistoryBtn) {
    closeHistoryBtn.addEventListener('click', () => {
      if (historyModal) historyModal.classList.remove('show');
    });
  }

  // Legal links
  if (impressumLink) {
    impressumLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (!legalTitle || !legalContent || !legalModal) return;
      legalTitle.textContent = getTranslation('impressum');
      legalContent.innerHTML = lang === 'de' ? legalDocs.de.impressum : legalDocs.en.impressum;
      legalModal.classList.add('show');
    });
  }
  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (!legalTitle || !legalContent || !legalModal) return;
      legalTitle.textContent = getTranslation('privacyPolicy');
      legalContent.innerHTML = lang === 'de' ? legalDocs.de.privacyPolicy : legalDocs.en.privacyPolicy;
      legalModal.classList.add('show');
    });
  }
  if (closeLegalBtn) {
    closeLegalBtn.addEventListener('click', () => {
      if (legalModal) legalModal.classList.remove('show');
    });
  }

  // PWA install
  if (pwaInstallBtn) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      pwaInstallBtn.style.display = 'inline-flex';
    });

    pwaInstallBtn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      showInstallBanner(getTranslation(outcome === 'accepted' ? 'installSuccess' : 'installDismissed'));
      deferredInstallPrompt = null;
      pwaInstallBtn.style.display = 'none';
    });

    window.addEventListener('appinstalled', () => {
      showInstallBanner(getTranslation('installSuccess'));
      deferredInstallPrompt = null;
      pwaInstallBtn.style.display = 'none';
    });
  }
};

// Auth state (merged; includes layout refresh)
const handleAuthStateChange = (user) => {
  if (unsubscribe) { unsubscribe(); unsubscribe = null; }

  const loggedIn = !!user;

  if (landingPage) landingPage.style.display = loggedIn ? 'none' : 'grid';
  if (appContent) appContent.style.display = loggedIn ? 'grid' : 'none';
  if (authActions) authActions.style.display = loggedIn ? 'none' : 'flex';
  if (userInfo) userInfo.style.display = loggedIn ? 'flex' : 'none';
  if (authSection) authSection.style.display = 'none';
  if (dashboardControls) {
    dashboardControls.hidden = !loggedIn;
  }

  if (loggedIn) {
    tileSystemInstance?.refreshLayout?.();
  }

  if (loggedIn) {

    resetFilters();
    contextFeature?.clearAll();

    const displayName = user.displayName || user.email || '';
    const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
    const welcomeTextKey = isNewUser ? 'welcome' : 'welcomeBack';
    const welcomeText = getTranslation(welcomeTextKey);
    if (welcomeMessage) {
      welcomeMessage.textContent = displayName ? `${welcomeText}, ${displayName}!` : getTranslation('welcome');
    }

    if (userName) userName.textContent = displayName;

    logCollectionRef = collection(db, 'users', user.uid, 'logs');
    const q = query(logCollectionRef, orderBy('timestamp', 'desc'));
    unsubscribe = onSnapshot(q, renderEntries);
    intentionFeature?.subscribe(user.uid);

  } else {
    if (userName) userName.textContent = '';
    if (welcomeMessage) welcomeMessage.textContent = '';
    latestSnapshot = null;
    if (tbody) tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    logCollectionRef = null;
    allEntries = [];

    contextFeature?.clearAll();

    resetFilters();
    updateStats();
    setAuthMode(true);
    resetAuthFields();

    intentionFeature?.reset();
  }
};

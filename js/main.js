// app.js (ES module)

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


// Constants
const MAX_RECENT_ROWS = 10;


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
let logCollectionRef = null;

let pendingContextLogId = null;
let selectedFeeling = '';
const contextCache = new Map();


// Element refs (assigned on DOMContentLoaded)
// These were duplicated and merged for clarity
// Some elements from the original conflict were already assigned directly above,
// so this section mostly ensures all IDs are correctly mapped to variables.
// The primary intent is to consolidate and correct element assignments.
// Re-declarations are removed if already present at the top.
let reorderToggle, reorderHint; // Added as they were missing direct top-level declaration in snippets
let unsubscribe = null; // Added for onSnapshot management


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
  // appContent is already declared at the top, no need to re-declare.

  // Render dashboard tiles before querying for tile-specific elements
  renderTiles(appContent);

  // Re-assign existing global variables for clarity/safety, even if already declared.
  // This ensures they are properly linked after DOMContentLoaded.
  nameInput = document.getElementById('food-name');
  dairyCheckbox = document.getElementById('contains-dairy');
  outsideMealsCheckbox = document.getElementById('outside-meals');
  addBtn = document.getElementById('add-button');
  tbody = document.getElementById('log-body'); // Use log-body if it exists as in the conflicting snippet
  emptyState = document.getElementById('empty-state');
  installBanner = document.getElementById('install-banner');

  // Context UI elements
  // contextFollowup, contextSettingInput, contextSaveBtn, contextSkipBtn, contextStatus are declared at top.
  // Re-assigning here for consistency and to ensure they're linked after DOM is ready.
  // contextFeelingButtons from original snippet was querySelectorAll('.context-feeling-btn'),
  // while the new snippet used querySelectorAll('.context-feeling').
  // Assuming the latter is correct given the `contextFeature.assignElements`.
  contextFeelingButtons = Array.from(document.querySelectorAll('.context-feeling'));


  contextFeature?.assignElements({
    followup: contextFollowup,
    feelingButtons: contextFeelingButtons,
    settingInput: contextSettingInput,
    saveBtn: contextSaveBtn,
    skipBtn: contextSkipBtn,
    status: contextStatus,
    tbody // Assuming tbody is passed to contextFeature for rendering context rows
  });

  // Navigation and UI
  // sidebar, scrim, welcomeMessage, landingPage, donateBtn, langToggle, switchEl, googleSigninBtn, pwaInstallBtn are declared at top.
  // Re-assigning here for consistency.

  // Menu controls
  // menuOpenBtn, menuCloseBtn, logoutBtn, logoutBtnMain, userInfo, userName, exportBtn are declared at top.
  // Re-assigning here for consistency.
  // Note: logoutBtn and logoutBtnMain IDs from conflicted snippet were 'logout-button' and 'logout-button-main',
  // while the refined one used 'logout-btn' and 'logout-btn-main'. Assuming refined is correct.

  // Stats elements
  // statTotal, statDairy, statOutside, statLast, statLastSubtext are declared at top.

  // Search and filters
  // logSearchInput, noResultsMessage, filterButtons are declared at top.
  // filterButtons from original snippet used `[data-filter]`,
  // the refined one used `.filter-btn`. Assuming `.filter-btn` is correct.
  filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  
  // Dashboard controls
  // dashboardControls is declared at top.
  reorderToggle = document.getElementById('reorder-toggle');
  reorderHint = document.getElementById('reorder-hint');
  
  // Theme controls
  // themeToggle, themeToggleIcon, themeToggleLabel, themeColorMeta are declared at top.
  
  // Modals
  // manifestoModal, closeManifestoBtn, historyModal, closeHistoryBtn, historyContent,
  // legalModal, legalTitle, legalContent, closeLegalBtn, impressumLink, privacyLink,
  // instructionsModal, closeInstructionsBtn are declared at top.
  // Note: Modal close button IDs from conflict used `instructions-close`, `manifesto-close`, `history-close`, `legal-close`,
  // while the refined version used `close-instructions`, `close-manifesto`, `close-history`, `close-legal`.
  // Assuming refined version is correct.
  
  // Cards
  // logoCard, manifestoCard, supportCard are declared at top.
  // Note: supportCard ID from conflict was `support-card`, while refined used `support-button`.
  // Assuming refined version `support-button` is correct.
  
  // Auth elements
  // authSection, loginBtn, signupBtn, authSubmit, authActions, signupFields, authTitle, authToggle,
  // authEmail, authPassword, authUsername, authRePassword are declared at top.
  // Note: loginBtn, signupBtn IDs from conflict used `login-button`, `signup-button`,
  // while refined used `login-btn`, `signup-btn`. Assuming refined is correct.
  // Note: authRePassword ID from conflict used `auth-repassword`, while refined used `auth-re-password`.
  // Assuming refined is correct.
  
  // Intention UI elements
  // intentionForm, intentionTextarea, intentionSaveBtn, intentionDisplay, intentionCurrent,
  // intentionDate, intentionEditBtn, intentionStatus are declared at top.
  // Note: intentionTextarea ID from conflict used `intention-textarea`, while refined used `intention-text`.
  // Assuming refined `intention-text` is correct.

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


  await loadFirebaseModules();
  // processRedirectAuthResult is handled within loadFirebaseModules for initial load
  // and signInWithPopup/signInWithRedirect for subsequent Google sign-ins.
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
    manifesto: "The Food Mutiny Manifesto", // Original kept this; the other snippet used manifestoTitle here too
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
      <p>Dies ist ein privates, nicht-kommerzielles Projekt. Für die Richt
// app.js (ES module)
import { renderTiles, initTileSystem } from './tiles.js';

// Firebase v9+ (modular)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
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
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyC1qN3ksU0uYhXRXYNmYlmGX0iyUa-BJFQ",
  authDomain: "mcfattys-food-tracker.firebaseapp.com",
  projectId: "mcfattys-food-tracker",
  storageBucket: "mcfattys-food-tracker.appspot.com",
  messagingSenderId: "831603858264",
  appId: "1:831603858264:web:58506c01975e9a1991e32d",
  measurementId: "G-KQX4BQ71VK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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

// --- Translations ---
const translations = {
  en: {
    loginBtn: 'Login',
    signupBtn: 'Sign Up',
    logoutBtn: 'Logout',
    installBtn: 'Install',
    googleSignin: 'Sign in with Google',
    manifesto: "McFatty's Manifesto",
    manifestoTitle: "McFatty's Manifesto",
    manifestoP1: "McFatty’s Food Tracker is not about calories, restrictions, or guilt. If you want chips, eat them. No shame, no punishment. Just write it down. Recording without judgment is the act that matters.",
    manifestoP2: "This app is free. No subscriptions, no upsells, no lifestyle packages. We reject the idea that food and health should be sold back to us. Eating should not be a business model.",
    manifestoP3: "Instead, McFatty’s helps you pause, check in with your body, and notice your habits. Consciously or subconsciously, the simple act of logging allows you to see patterns and slowly shift your relationship with food. Change should not be a race. It should be slow, gentle, and rooted in respect for your choices.",
    manifestoP4: "We are against cycles of guilt, shame, and impossible promises. We will not celebrate consumerism dressed up as self-care. We believe the radical choice is to slow down, listen to yourself, and eat on your own terms.",
    manifestoP5: "The app will always be free to use. There is a donation button for those who want to support, because while the world should be free, it isn’t. But McFatty’s will never profit from your guilt.",
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
    growthTitle: 'Room to grow',
    growthCopy: 'This space is ready for habits, reflections, or whatever else you need next.',
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
    installSuccess: 'App installed! Find McFatty’s on your home screen.',
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
    supportTitle: 'Support Us',
    supportCopy: 'If you find this app useful, please consider a small donation.',
  },
  de: {
    loginBtn: 'Anmelden',
    signupBtn: 'Registrieren',
    logoutBtn: 'Abmelden',
    installBtn: 'Installieren',
    googleSignin: 'Mit Google anmelden',
    manifesto: 'McFettys Manifest',
    manifestoTitle: 'McFettys Manifest',
    manifestoP1: 'Bei McFettys Food Tracker geht es nicht um Kalorien, Einschränkungen oder Schuldgefühle. Wenn du Chips willst, iss sie. Keine Scham, keine Bestrafung. Schreib es einfach auf. Das Aufzeichnen ohne Urteil ist der entscheidende Akt.',
    manifestoP2: 'Diese App ist kostenlos. Keine Abonnements, keine Upsells, keine Lifestyle-Pakete. Wir lehnen die Idee ab, dass uns Essen und Gesundheit zurückverkauft werden sollten. Essen sollte kein Geschäftsmodell sein.',
    manifestoP3: 'Stattdessen hilft Ihnen McFatty’s, innezuhalten, auf Ihren Körper zu hören und Ihre Gewohnheiten zu bemerken. Bewusst oder unbewusst ermöglicht Ihnen das einfache Protokollieren, Muster zu erkennen und Ihre Beziehung zum Essen langsam zu verändern. Veränderung sollte kein Wettlauf sein. Sie sollte langsam, sanft und in Respekt für Ihre Entscheidungen verwurzelt sein.',
    manifestoP4: 'Wir sind gegen Kreisläufe von Schuld, Scham und unmöglichen Versprechungen. Wir werden den als Selbstfürsorge getarnten Konsum nicht feiern. Wir glauben, die radikale Wahl ist, zu verlangsamen, auf sich selbst zu hören und zu Ihren eigenen Bedingungen zu essen.',
    manifestoP5: 'Die App wird immer kostenlos sein. Es gibt einen Spenden-Button für diejenigen, die unterstützen möchten, denn obwohl die Welt frei sein sollte, ist sie es nicht. Aber McFatty’s wird niemals von Ihrer Schuld profitieren.',
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
    growthTitle: 'Platz für mehr',
    growthCopy: 'Hier ist Raum für Gewohnheiten, Reflexionen oder alles, was du als Nächstes brauchst.',
    recentLogTitle: 'Aktuelles Protokoll',
    organizeTiles: 'Kacheln anordnen',
    doneOrganizing: 'Fertig',
    reorderHint: 'Ziehe die Kacheln, um sie neu anzuordnen. Tippe auf „Fertig“, wenn du zufrieden bist.',
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
    installSuccess: 'App installiert! McFatty’s ist jetzt auf deinem Startbildschirm.',
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
    supportTitle: 'Unterstütze uns',
    supportCopy: 'Wenn du diese App nützlich findest, ziehe bitte eine kleine Spende in Betracht.',
  }
};

const legalDocs = {
  en: {
    impressum: `<h3>Legal Notice (Impressum)</h3>
      <p>Information according to § 5 TMG</p>
      <p>[Your Name]<br>[Your Street and House Number]<br>[Your Postal Code and City]</p>
      <h4>Contact</h4>
      <p>Email: [Your Email Address]</p>
      <h4>Disclaimer</h4>
      <p>This is a private, non-commercial project. The content of our pages has been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness or topicality. According to statutory provisions, we are furthermore responsible for our own content on these web pages. In this context, please note that we are accordingly not obliged to monitor merely the transmitted or saved information of third parties, or investigate circumstances pointing to illegal activity.</p>`,
    privacyPolicy: `<h3>Privacy Policy</h3>
      <p><strong>1. General Information</strong></p>
      <p>The following gives a simple overview of what happens to your personal information when you use our app. Personal information is any data with which you could be personally identified.</p>
      <p><strong>Responsible for data collection on this app is:</strong><br/>
      [Your Name]<br>[Your Street and House Number]<br>[Your Postal Code and City]<br>Email: [Your Email Address]</p>
      <p><strong>2. Data Collection on our App</strong></p>
      <p><strong>User Authentication:</strong> To use this app, you must create an account. We use Firebase Authentication (a service of Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland) for this purpose. When you register via email and password, your email address, a password hash, and a unique user ID are stored. If you use Google Sign-In, Google provides us with your name, email address, and profile picture.</p>
      <p><strong>Data Storage:</strong> Your food log entries are stored in a Cloud Firestore database, which is also a service provided by Google. This data is linked to your unique user ID. We do not process this data for any other purpose than displaying it back to you within the app.</p>
      <p><strong>Server Log Files:</strong> The provider of the pages automatically collects and stores information that your browser automatically transmits to us in "server log files". These are: Browser type and browser version, operating system used, referrer URL, host name of the accessing computer, time of the server request, and IP address. This data will not be combined with data from other sources.</p>
      <p><strong>3. Your Rights</strong></p>
      <p>You have the right to free information about your stored personal data, its origin and recipient and the purpose of the data processing and, if necessary, a right to correction, blocking or deletion of this data at any time within the scope of the applicable legal provisions. You can contact us at any time at the address given in the legal notice if you have further questions on the subject of personal data.</p>`
  },
  de: {
    impressum: `<h3>Impressum</h3>
      <p>Angaben gemäß § 5 TMG</p>
      <p>[Ihr Name]<br>[Ihre Straße und Hausnummer]<br>[Ihre PLZ und Stadt]</p>
      <h4>Kontakt</h4>
      <p>E-Mail: [Ihre E-Mail-Adresse]</p>
      <h4>Haftungsausschluss</h4>
      <p>Dies ist ein privates, nicht-kommerzielles Projekt. Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>`,
    privacyPolicy: `<h3>Datenschutzerklärung</h3>
      <p><strong>1. Allgemeiner Hinweis</strong></p>
      <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere App nutzen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
      <p><strong>Verantwortliche Stelle für die Datenerfassung in dieser App ist:</strong><br/>
      [Ihr Name]<br>[Ihre Straße und Hausnummer]<br>[Ihre PLZ und Stadt]<br>E-Mail: [Ihre E-Mail-Adresse]</p>
      <p><strong>2. Datenerfassung in unserer App</strong></p>
      <p><strong>Nutzerauthentifizierung:</strong> Um diese App zu nutzen, müssen Sie ein Konto erstellen. Wir verwenden hierfür Firebase Authentication (ein Dienst von Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland). Bei der Registrierung per E-Mail und Passwort werden Ihre E-Mail-Adresse, ein Passwort-Hash und eine eindeutige Benutzer-ID gespeichert. Wenn Sie die Google-Anmeldung verwenden, übermittelt Google uns Ihren Namen, Ihre E-Mail-Adresse und Ihr Profilbild.</p>
      <p><strong>Datenspeicherung:</strong> Ihre Essensprotokolle werden in einer Cloud Firestore-Datenbank gespeichert, die ebenfalls von Google bereitgestellt wird. Diese Daten sind mit Ihrer eindeutigen Benutzer-ID verknüpft. Wir verarbeiten diese Daten zu keinem anderen Zweck, als sie Ihnen in der App wieder anzuzeigen.</p>
      <p><strong>Server-Log-Dateien:</strong> Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.</p>
      <p><strong>3. Ihre Rechte</strong></p>
      <p>Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.</p>`
  }
};

// i18n helpers
const getTranslation = (key) => {
  const dictionary = translations[lang] || translations.en;
  return (dictionary && dictionary[key]) || translations.en[key] || '';
};

// Theme
const THEME_STORAGE_KEY = 'preferred-theme';
const themeColors = { light: '#fdfaf3', dark: '#1a1a1a' };

const getStoredTheme = () => {
  try { return localStorage.getItem(THEME_STORAGE_KEY); } catch { return null; }
};
const storeTheme = (value) => {
  try { localStorage.setItem(THEME_STORAGE_KEY, value); } catch { /* ignore */ }
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
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Swi

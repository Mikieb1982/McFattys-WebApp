import { renderTiles, initTileSystem } from './tiles.js';

const firebaseConfig = {
  apiKey: "AIzaSyC1qN3ksU0uYhXRXYNmYlmGX0iyUa-BJFQ",
  authDomain: "mcfattys-food-tracker.firebaseapp.com",
  projectId: "mcfattys-food-tracker",
  storageBucket: "mcfattys-food-tracker.appspot.com",
  messagingSenderId: "831603858264",
  appId: "1:831603858264:web:58506c01975e9a1991e32d",
  measurementId: "G-KQX4BQ71VK"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const MAX_RECENT_ROWS = 10;

const appContent = document.getElementById('app-content');
renderTiles(appContent);

let logCollection;
let unsubscribe;
let lang = 'en';
let deferredInstallPrompt = null;
let installBannerTimeout;
let latestSnapshot = null;
let isLoginMode = true;
let allEntries = [];
let activeFilter = 'all';
let searchTerm = '';

// Elements
const nameInput = document.getElementById('food-name');
const dairyCheckbox = document.getElementById('contains-dairy');
const outsideMealsCheckbox = document.getElementById('outside-meals');
const addBtn = document.getElementById('add-button');
const tbody = document.getElementById('log-body');
const emptyState = document.getElementById('empty-state');
const installBanner = document.getElementById('install-banner');
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');
const welcomeMessage = document.getElementById('welcome-message');
const landingPage = document.getElementById('landing-page');
const donateBtn = document.getElementById('donate-button');
const langToggle = document.getElementById('lang-toggle');
const switchEl = document.getElementById('switch');
const googleSigninBtn = document.getElementById('google-signin');
const pwaInstallBtn = document.getElementById('pwa-install');
const menuOpenBtn = document.getElementById('menu-open');
const menuCloseBtn = document.getElementById('menu-close');
const logoutBtn = document.getElementById('logout-btn');
const logoutBtnMain = document.getElementById('logout-btn-main');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const exportBtn = document.getElementById('export-button');
const statTotal = document.getElementById('stat-total');
const statDairy = document.getElementById('stat-dairy');
const statOutside = document.getElementById('stat-outside');
const statLast = document.getElementById('stat-last');
const statLastSubtext = document.getElementById('stat-last-subtext');
const logSearchInput = document.getElementById('log-search');
const noResultsMessage = document.getElementById('no-results');
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const dashboardControls = document.getElementById('dashboard-controls');
const reorderToggle = document.getElementById('reorder-toggle');
const reorderHint = document.getElementById('reorder-hint');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const themeToggleLabel = document.getElementById('theme-toggle-label');
const themeColorMeta = document.getElementById('theme-color');


// Modals / legal links
const manifestoModal = document.getElementById('manifesto-modal');
const closeManifestoBtn = document.getElementById('close-manifesto');
const historyModal = document.getElementById('history-modal');
const closeHistoryBtn = document.getElementById('close-history');
const historyContent = document.getElementById('history-content');
const legalModal = document.getElementById('legal-modal');
const legalTitle = document.getElementById('legal-title');
const legalContent = document.getElementById('legal-content');
const closeLegalBtn = document.getElementById('close-legal');
const impressumLink = document.getElementById('impressum-link');
const privacyLink = document.getElementById('privacy-link');

// Auth Elements
const authSection = document.getElementById('auth-section');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const authSubmit = document.getElementById('auth-submit');
const authActions = document.getElementById('auth-actions');
const signupFields = document.getElementById('signup-fields');
const authTitle = document.getElementById('auth-title');
const authToggle = document.getElementById('auth-toggle');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authUsername = document.getElementById('auth-username');
const authRePassword = document.getElementById('auth-re-password');

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

const getTranslation = (key) => {
  const dictionary = translations[lang] || translations.en;
  return (dictionary && dictionary[key]) || translations.en[key] || '';
};

const tileSystem = initTileSystem({
  container: appContent,
  reorderToggle,
  reorderHint,
  getTranslation
});

const THEME_STORAGE_KEY = 'preferred-theme';
const themeColors = {
  light: '#fdfaf3',
  dark: '#1a1a1a'
};

const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null;
  }
};

const storeTheme = (value) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, value);
  } catch (error) {
    // ignore storage failures
  }
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
  if (themeToggleIcon) {
    themeToggleIcon.textContent = isDark ? '☀️' : '🌙';
  }
  if (themeToggleLabel) {
    themeToggleLabel.textContent = isDark ? 'Enable light mode' : 'Enable dark mode';
  }
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

initializeTheme();

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
  themeToggle.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTheme();
    }
  });
}

const updateAuthTexts = () => {
  const titleKey = isLoginMode ? 'loginTitle' : 'signupTitle';
  const actionKey = isLoginMode ? 'loginAction' : 'signupAction';
  const toggleKey = isLoginMode ? 'authToggleToSignup' : 'authToggleToLogin';
  authTitle.textContent = getTranslation(titleKey);
  authSubmit.textContent = getTranslation(actionKey);
  authToggle.textContent = getTranslation(toggleKey);
};

const showInstallBanner = (message) => {
  if (!message) return;
  installBanner.textContent = message;
  installBanner.classList.add('show');
  clearTimeout(installBannerTimeout);
  installBannerTimeout = setTimeout(() => installBanner.classList.remove('show'), 4000);
};

const setLanguage = (newLang) => {
  lang = newLang;
  langToggle.setAttribute('aria-pressed', newLang === 'de' ? 'true' : 'false');
  switchEl.classList.toggle('active', newLang === 'de');
  document.documentElement.lang = newLang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = getTranslation(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = getTranslation(key);
  });

  const user = auth.currentUser;
  if (user) {
    const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
    const welcomeTextKey = isNewUser ? 'welcome' : 'welcomeBack';
    const welcomeText = getTranslation(welcomeTextKey);
    const displayName = user.displayName || user.email || '';
    welcomeMessage.textContent = displayName ? `${welcomeText}, ${displayName}!` : getTranslation('welcome');
  }

  tileSystem.refreshLabels();
  updateAuthTexts();
  if (latestSnapshot) renderEntries(latestSnapshot);
};

const addEntry = () => {
  const name = nameInput.value.trim();
  if (!name || !logCollection) return;

  logCollection.add({
    name,
    dairy: dairyCheckbox.checked,
    outsideMeals: outsideMealsCheckbox.checked,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    nameInput.value = '';
    dairyCheckbox.checked = false;
    outsideMealsCheckbox.checked = false;
    nameInput.focus();
  }).catch((error) => {
    console.error('Error adding document: ', error);
    alert(getTranslation('addError'));
  });
};

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
  const entriesToday = allEntries.filter(entry => {
    const date = getEntryDate(entry);
    return isSameDay(date, today);
  });
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
    statLast.textContent = '—';
    statLastSubtext.textContent = '';
  }
};

const renderRows = (entries) => {
  tbody.innerHTML = '';

  entries.forEach(entry => {
    const tr = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = entry.name || '';

    const timeCell = document.createElement('td');
    const date = getEntryDate(entry);
    timeCell.textContent = date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : getTranslation('notAvailable');

    const dairyCell = document.createElement('td');
    const hasDairy = Boolean(entry.dairy);
    const dairyPill = document.createElement('span');
    dairyPill.className = `pill ${hasDairy ? 'pill-yes' : 'pill-no'}`;
    dairyPill.textContent = hasDairy ? getTranslation('yes') : getTranslation('no');
    dairyCell.appendChild(dairyPill);

    const outsideCell = document.createElement('td');
    const outsideValue = Boolean(entry.outsideMeals);
    const outsidePill = document.createElement('span');
    outsidePill.className = `pill ${outsideValue ? 'pill-yes' : 'pill-no'}`;
    outsidePill.textContent = outsideValue ? getTranslation('yes') : getTranslation('no');
    outsideCell.appendChild(outsidePill);

    const actionsCell = document.createElement('td');
    actionsCell.className = 'row-actions actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-secondary edit-entry';
    editBtn.type = 'button';
    editBtn.dataset.id = entry.id;
    editBtn.textContent = getTranslation('editBtn');
    editBtn.setAttribute('aria-label', `${getTranslation('editEntryAria')} ${entry.name || ''}`.trim());

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger remove-entry';
    removeBtn.type = 'button';
    removeBtn.dataset.id = entry.id;
    removeBtn.textContent = getTranslation('removeBtn');
    removeBtn.setAttribute('aria-label', `${getTranslation('removeEntryAria')} ${entry.name || ''}`.trim());

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(removeBtn);

    tr.appendChild(nameCell);
    tr.appendChild(timeCell);
    tr.appendChild(dairyCell);
    tr.appendChild(outsideCell);
    tr.appendChild(actionsCell);
    tbody.appendChild(tr);
  });
};

const resetFilters = () => {
  activeFilter = 'all';
  searchTerm = '';
  if (logSearchInput) {
    logSearchInput.value = '';
  }
  filterButtons.forEach(btn => btn.classList.toggle('is-active', btn.dataset.filter === 'all'));
  toggleNoResults(false);
};

const toggleNoResults = (show) => {
  if (!noResultsMessage) return;
  noResultsMessage.style.display = show ? 'block' : 'none';
};

const applyFilters = () => {
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
      const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
      (entriesByDate[key] ||= []).push(entry);
    }
  });

  let html = '';
  Object.keys(entriesByDate).sort().reverse().forEach(key => {
    const [y,m,d] = key.split('-').map(n=>parseInt(n,10));
    const display = new Date(y, m-1, d).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

    html += `<h3>${display}</h3>`;
    html += `<table class="table" style="margin-bottom:20px;"><thead><tr><th>${getTranslation('thItem')}</th><th>${getTranslation('thTime')}</th><th>${getTranslation('thDairy')}</th><th>${getTranslation('thOutsideMeals')}</th></tr></thead><tbody>`;
    entriesByDate[key].sort((a,b)=>b.timestamp.seconds - a.timestamp.seconds).forEach(entry=>{
      const time = entry.timestamp.toDate().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
      const hasDairy = Boolean(entry.dairy);
      const dairyText = hasDairy ? getTranslation('yes') : getTranslation('no');
      const pillClass = hasDairy ? 'pill-yes' : 'pill-no';
      const outsideValue = Boolean(entry.outsideMeals);
      const outsideText = outsideValue ? getTranslation('yes') : getTranslation('no');
      const outsideClass = outsideValue ? 'pill-yes' : 'pill-no';
      html += `<tr><td>${entry.name}</td><td>${time}</td><td><span class="pill ${pillClass}">${dairyText}</span></td><td><span class="pill ${outsideClass}">${outsideText}</span></td></tr>`;
    });
    html += `</tbody></table>`;
  });

  historyContent.innerHTML = html || `<p>${getTranslation('emptyState')}</p>`;
};

const handleLogAction = (event) => {
  if (!logCollection) return;
  const button = event.target.closest('button');
  if (!button) return;

  const { id } = button.dataset;
  if (!id) return;

  if (button.classList.contains('remove-entry')) {
    logCollection.doc(id).delete().catch(error => {
      console.error('Error removing document: ', error);
      alert(getTranslation('deleteError'));
    });
    return;
  }

  if (button.classList.contains('edit-entry')) {
    const currentName = button.closest('tr')?.querySelector('td')?.textContent || '';
    const newName = prompt(getTranslation('editBtn'), currentName);
    if (newName && newName.trim() && newName.trim() !== currentName) {
      logCollection.doc(id).update({ name: newName.trim() }).catch(error => {
        console.error('Error updating document:', error);
        alert(getTranslation('updateError'));
      });
    }
  }
};

const exportToCsv = () => {
  if (!logCollection) return;

  logCollection.orderBy('timestamp', 'desc').get().then(snapshot => {
    const header = [
      getTranslation('csvHeaderDate'),
      getTranslation('csvHeaderItem'),
      getTranslation('csvHeaderDairy'),
      getTranslation('csvHeaderOutsideMeals')
    ].join(',');
    let csvContent = "data:text/csv;charset=utf-8," + header + "\n";
    const locale = lang === 'de' ? 'de-DE' : 'en-US';

    snapshot.forEach(doc => {
      const entry = doc.data();
      const date = entry.timestamp ? entry.timestamp.toDate().toLocaleDateString(locale) : getTranslation('notAvailable');
      const safeName = `"${(entry.name || '').replace(/"/g, '""')}"`;
      const hasDairy = Boolean(entry.dairy);
      const outsideValue = Boolean(entry.outsideMeals);
      const row = [
        date,
        safeName,
        hasDairy ? getTranslation('csvYes') : getTranslation('csvNo'),
        outsideValue ? getTranslation('csvYes') : getTranslation('csvNo')
      ].join(',');
      csvContent += row + "\n";
    });

    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'mcfattys_log.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

const resetAuthFields = () => {
  authEmail.value = '';
  authPassword.value = '';
  authUsername.value = '';
  authRePassword.value = '';
};

const setAuthMode = (isLogin) => {
  isLoginMode = isLogin;
  signupFields.style.display = isLogin ? 'none' : 'block';
  updateAuthTexts();
};

auth.onAuthStateChanged(user => {
  if (unsubscribe) { unsubscribe(); unsubscribe = null; }

  const loggedIn = !!user;

  landingPage.style.display = loggedIn ? 'none' : 'grid';
  appContent.style.display = loggedIn ? 'grid' : 'none';
  authActions.style.display = loggedIn ? 'none' : 'flex';
  userInfo.style.display = loggedIn ? 'flex' : 'none';
  authSection.style.display = 'none';
  if (dashboardControls) {
    dashboardControls.hidden = !loggedIn;
  }

  if (loggedIn) {
    tileSystem.refreshLabels();
    resetFilters();
    const displayName = user.displayName || user.email || '';
    const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
    const welcomeTextKey = isNewUser ? 'welcome' : 'welcomeBack';
    const welcomeText = getTranslation(welcomeTextKey);
    welcomeMessage.textContent = displayName ? `${welcomeText}, ${displayName}!` : getTranslation('welcome');

    userName.textContent = displayName;

    logCollection = db.collection('users').doc(user.uid).collection('logs');
    unsubscribe = logCollection.orderBy('timestamp', 'desc').onSnapshot(renderEntries);
  } else {
    tileSystem.exitReorganizeMode(false);
    userName.textContent = '';
    welcomeMessage.textContent = '';
    latestSnapshot = null;
    tbody.innerHTML = '';
    emptyState.style.display = 'block';
    logCollection = null;
    allEntries = [];
    resetFilters();
    updateStats();
    setAuthMode(true);
    resetAuthFields();
  }
});

const handleAuthSubmit = async () => {
  const email = authEmail.value.trim();
  const password = authPassword.value.trim();

  if (!email || !password) {
    alert(getTranslation('authMissingFields'));
    return;
  }
  if (!isLoginMode) {
    const username = authUsername.value.trim();
    const confirmPassword = authRePassword.value.trim();
    if (!username) {
      alert(getTranslation('authMissingUsername'));
      return;
    }
    if (password !== confirmPassword) {
      alert(getTranslation('authPasswordMismatch'));
      return;
    }
  }

  authSubmit.disabled = true;
  try {
    if (isLoginMode) {
      await auth.signInWithEmailAndPassword(email, password);
    } else {
      const username = authUsername.value.trim();
      const { user: newUser } = await auth.createUserWithEmailAndPassword(email, password);
      await newUser.updateProfile({ displayName: username });
      await db.collection('users').doc(newUser.uid).set({
        displayName: username,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }
    authSection.style.display = 'none';
    resetAuthFields();
  } catch (error) {
    alert(`${getTranslation('authErrorPrefix')} ${error.message}`);
  } finally {
    authSubmit.disabled = false;
  }
};

// Helpers
const signOut = () => auth.signOut();
const toggleLanguage = () => setLanguage(lang === 'en' ? 'de' : 'en');

// Event Listeners
addBtn.addEventListener('click', addEntry);
tbody.addEventListener('click', handleLogAction);
exportBtn.addEventListener('click', exportToCsv);

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

loginBtn.addEventListener('click', () => { resetAuthFields(); authSection.style.display = 'block'; setAuthMode(true); });
signupBtn.addEventListener('click', () => { resetAuthFields(); authSection.style.display = 'block'; setAuthMode(false); });
authToggle.addEventListener('click', () => setAuthMode(!isLoginMode));
authSubmit.addEventListener('click', handleAuthSubmit);

googleSigninBtn.addEventListener('click', () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(err => {
  alert(`${getTranslation('authErrorPrefix')} ${err.message}`);
  console.error('Google sign-in error:', err);
}));

logoutBtn.addEventListener('click', signOut);
logoutBtnMain.addEventListener('click', signOut);

donateBtn.addEventListener('click', () => {
  const w = window.open('https://www.paypal.com/donate', '_blank');
  if (w) w.opener = null;
});

langToggle.addEventListener('click', toggleLanguage);
langToggle.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleLanguage();
  }
});

menuOpenBtn.addEventListener('click', () => { sidebar.classList.add('open'); scrim.classList.add('show'); });
menuCloseBtn.addEventListener('click', () => { sidebar.classList.remove('open'); scrim.classList.remove('show'); });
scrim.addEventListener('click', () => { sidebar.classList.remove('open'); scrim.classList.remove('show'); });

// Sidebar actions -> modals
sidebar.addEventListener('click', (event) => {
  const button = event.target.closest('.sb-item-btn');
  if (!button) return;
  const action = button.dataset.action;

  if (action === 'manifesto') {
    manifestoModal.classList.add('show');
  } else if (action === 'history') {
    if (!logCollection) return;
    logCollection.orderBy('timestamp', 'desc').get().then(renderHistory);
    historyModal.classList.add('show');
  }
  // Close sidebar after action
  sidebar.classList.remove('open');
  scrim.classList.remove('show');
});

// Manifesto card click
const manifestoCard = document.getElementById('manifesto-card');
if (manifestoCard) {
  manifestoCard.addEventListener('click', () => {
    if (!tileSystem.isReorganizeMode()) {
      manifestoModal.classList.add('show');
    }
  });
}

closeManifestoBtn.addEventListener('click', () => manifestoModal.classList.remove('show'));
closeHistoryBtn.addEventListener('click', () => historyModal.classList.remove('show'));

impressumLink.addEventListener('click', (e) => {
  e.preventDefault();
  legalTitle.textContent = getTranslation('impressum');
  legalContent.innerHTML = lang === 'de' ? legalDocs.de.impressum : legalDocs.en.impressum;
  legalModal.classList.add('show');
});

privacyLink.addEventListener('click', (e) => {
  e.preventDefault();
  legalTitle.textContent = getTranslation('privacyPolicy');
  legalContent.innerHTML = lang === 'de' ? legalDocs.de.privacyPolicy : legalDocs.en.privacyPolicy;
  legalModal.classList.add('show');
});

closeLegalBtn.addEventListener('click', () => legalModal.classList.remove('show'));

// PWA install
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

// SW
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(err => console.error('SW registration failed:', err)));
}

// Boot
setLanguage('en');

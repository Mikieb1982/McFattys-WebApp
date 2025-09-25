// app.js (ES module)
import { renderTiles, initTileSystem } from './tiles.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signOut as fbSignOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyC1qN3ksU0uYhXRXYNmYlmGX0iyUa-BJFQ",
  authDomain: "mcfattys-food-tracker.firebaseapp.com",
  projectId: "mcfattys-food-tracker",
  storageBucket: "mcfattys-food-tracker.appspot.com",
  messagingSenderId: "831603858264",
  appId: "1:831603858264:web:58506c01975e9a1991e32d",
  measurementId: "G-KQX4BQ71VK"
};

// Firebase v9 modular
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const MAX_RECENT_ROWS = 10;

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

document.addEventListener('DOMContentLoaded', () => {
  const appContent = document.getElementById('app-content');
  if (appContent) {
    renderTiles(appContent);
    // initTileSystem?.(appContent); // uncomment when you actually use it
  }

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

  if (logoutBtn) logoutBtn.addEventListener('click', handleSignOut);
  if (logoutBtnMain) logoutBtnMain.addEventListener('click', handleSignOut);

  function handleSignOut(e) {
    if (e) e.preventDefault();
    fbSignOut(auth).catch((error) => {
      console.error('Error signing out:', error);
    });
  }

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
  const instructionsModal = document.getElementById('instructions-modal');
  const closeInstructionsBtn = document.getElementById('close-instructions');
  const logoCard = document.getElementById('logo-card');

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

  // Your translations and legalDocs objects can remain as-is.
});
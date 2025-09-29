// i18n dictionaries
const translations = {
  en: {
    loginBtn: 'Login',
    signupBtn: 'Sign Up',
    logoutBtn: 'Logout',
    installBtn: 'Install',
    googleSignin: 'Sign in with Google',
    manifesto: 'The Food Mutiny Manifesto',
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

// Event listeners (merged; keeps select_account param)
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
      if (typeof provider.setCustomParameters === 'function') {
        provider.setCustomParameters({ prompt: 'select_account' });
      }

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
        if (err?.code === 'auth/operation-not-supported-in-this-environment' && canUseRedirect) {
          try {
            await signInWithRedirect(auth, provider);
            return;
          } catch (redirectError) {
            console.error('Google sign-in redirect fallback error:', redirectError);
            alert(`${getTranslation('authErrorPrefix')} ${redirectError.message}`);
            return;
          }
        } else if (err?.code === 'auth/operation-not-supported-in-this-environment' && !sessionStorageAvailable) {
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
    // ensure layout stable when switching views
    tileSystemInstance?.refreshLayout?.();

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

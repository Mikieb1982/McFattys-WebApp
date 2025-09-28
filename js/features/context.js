const DEFAULT_ELEMENTS = {
  followup: null,
  feelingButtons: [],
  settingInput: null,
  saveBtn: null,
  skipBtn: null,
  status: null,
  tbody: null
};

export function createContextFeature({ getTranslation, getLang, getFirebase, getFirestore }) {
  const state = {
    elements: { ...DEFAULT_ELEMENTS },
    tileSystem: null,
    pendingLogId: null,
    selectedFeeling: '',
    cache: new Map(),
    statusKey: null,
    statusTimeout: null,
    listenersBound: false
  };

  const isReorganizing = () => Boolean(state.tileSystem?.isReorganizeMode?.());

  const translate = (key) => (typeof getTranslation === 'function' ? getTranslation(key) : key);
  const currentLang = () => (typeof getLang === 'function' ? getLang() : 'en');

  const applyStatusText = () => {
    const { status } = state.elements;
    if (!status) return;
    if (!state.statusKey) {
      status.textContent = '';
      delete status.dataset.statusKey;
      return;
    }
    status.textContent = translate(state.statusKey);
    status.dataset.statusKey = state.statusKey;
  };

  const clearStatusTimer = () => {
    if (state.statusTimeout) {
      clearTimeout(state.statusTimeout);
      state.statusTimeout = null;
    }
  };

  const setStatus = (key, { autoClearMs } = {}) => {
    clearStatusTimer();
    state.statusKey = key || null;
    applyStatusText();

    if (state.statusKey && typeof autoClearMs === 'number' && autoClearMs > 0) {
      state.statusTimeout = setTimeout(() => {
        if (state.statusKey === key) {
          setStatus(null);
        }
      }, autoClearMs);
    }
  };

  const updateSaveState = () => {
    const { saveBtn, settingInput } = state.elements;
    if (!saveBtn) return;
    const hasFeeling = Boolean(state.selectedFeeling);
    const hasSetting = Boolean(settingInput?.value.trim());
    const canSave = Boolean(state.pendingLogId) && (hasFeeling || hasSetting);
    saveBtn.disabled = !canSave;
  };

  const clearFeelingSelection = () => {
    state.selectedFeeling = '';
    state.elements.feelingButtons?.forEach(btn => btn.classList.remove('is-selected'));
  };

  const hidePrompt = ({ preserveStatus = false } = {}) => {
    const { followup, settingInput } = state.elements;
    state.pendingLogId = null;
    state.selectedFeeling = '';
    if (followup) followup.hidden = true;
    if (settingInput) settingInput.value = '';
    clearFeelingSelection();
    if (!preserveStatus) {
      setStatus(null);
    }
    updateSaveState();
  };

  const showPrompt = (logId) => {
    const { followup, settingInput } = state.elements;
    state.pendingLogId = logId;
    state.selectedFeeling = '';
    if (followup) followup.hidden = false;
    if (settingInput) settingInput.value = '';
    clearFeelingSelection();
    setStatus(null);
    updateSaveState();
  };

  const getFirestoreFns = () => ({ ...getFirestore?.() });

  const getFirebaseContext = () => getFirebase?.() || {};

  const fetchContextEntries = async (entryId, forceRefresh = false) => {
    if (!entryId) return [];
    if (!forceRefresh && state.cache.has(entryId)) {
      return state.cache.get(entryId);
    }

    const { firebaseReady, auth, db } = getFirebaseContext();
    const { collection, getDocs, orderBy, query } = getFirestoreFns();

    if (!firebaseReady || !auth?.currentUser || !db) return [];
    if (typeof collection !== 'function' || typeof getDocs !== 'function' ||
        typeof orderBy !== 'function' || typeof query !== 'function') {
      return [];
    }

    const contextRef = collection(db, 'users', auth.currentUser.uid, 'logs', entryId, 'context');
    const q = query(contextRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const entries = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    state.cache.set(entryId, entries);
    return entries;
  };

  const getFeelingLabel = (value) => {
    switch (value) {
      case 'energized':
        return translate('contextFeelingEnergized');
      case 'satisfied':
        return translate('contextFeelingSatisfied');
      case 'sluggish':
        return translate('contextFeelingSluggish');
      default:
        return value || '';
    }
  };

  const renderContextContent = (entryId, entries, container) => {
    if (!container) return;

    if (!Array.isArray(entries) || !entries.length) {
      container.innerHTML = `<p>${translate('contextEmpty')}</p>`;
      return;
    }

    const locale = currentLang() === 'de' ? 'de-DE' : 'en-US';
    const list = document.createElement('ul');
    list.className = 'context-list';

    entries.forEach(item => {
      const li = document.createElement('li');
      li.className = 'context-list-item';

      const line = document.createElement('div');
      line.className = 'context-line';

      const feelingLabel = getFeelingLabel(item.feeling);
      let hasContent = false;

      if (feelingLabel) {
        const feelingEl = document.createElement('strong');
        feelingEl.textContent = feelingLabel;
        line.appendChild(feelingEl);
        hasContent = true;
      }

      if (item.setting) {
        if (hasContent) {
          line.appendChild(document.createTextNode(' · '));
        }
        const settingEl = document.createElement('span');
        settingEl.textContent = item.setting;
        line.appendChild(settingEl);
        hasContent = true;
      }

      if (!hasContent) {
        const placeholder = document.createElement('span');
        placeholder.textContent = translate('contextEmpty');
        line.appendChild(placeholder);
      }

      li.appendChild(line);

      const time = item.timestamp && typeof item.timestamp.toDate === 'function'
        ? item.timestamp.toDate().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
        : '';
      if (time) {
        const timeEl = document.createElement('small');
        timeEl.textContent = `${translate('contextAddedTime')} ${time}`;
        li.appendChild(timeEl);
      }

      list.appendChild(li);
    });

    container.innerHTML = '';
    container.appendChild(list);
  };

  const refreshOpenRow = async (entryId) => {
    const { tbody } = state.elements;
    if (!tbody) return;
    const contextRow = tbody.querySelector(`tr.context-row[data-entry-id="${entryId}"]`);
    if (!contextRow || contextRow.hidden) return;
    const container = contextRow.querySelector('.context-content');
    if (!container) return;
    try {
      const entries = await fetchContextEntries(entryId, true);
      renderContextContent(entryId, entries, container);
    } catch (error) {
      console.error('Error refreshing context:', error);
      container.innerHTML = `<p>${translate('contextError')}</p>`;
    }
  };

  const toggleRow = async (entryId, button) => {
    const { tbody } = state.elements;
    if (!tbody || !entryId || !button) return;
    const contextRow = tbody.querySelector(`tr.context-row[data-entry-id="${entryId}"]`);
    if (!contextRow) return;

    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      contextRow.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      button.textContent = translate('contextView');
      return;
    }

    contextRow.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    button.textContent = translate('contextHide');

    const container = contextRow.querySelector('.context-content');
    if (!container) return;
    container.innerHTML = `<p>${translate('contextLoading')}</p>`;

    try {
      const entries = await fetchContextEntries(entryId);
      renderContextContent(entryId, entries, container);
    } catch (error) {
      console.error('Error loading context:', error);
      container.innerHTML = `<p>${translate('contextError')}</p>`;
    }
  };

  const saveContextEntry = async () => {
    const { firebaseReady, auth, db } = getFirebaseContext();
    const { collection, addDoc, serverTimestamp } = getFirestoreFns();
    const { saveBtn, settingInput } = state.elements;

    if (!state.pendingLogId || !firebaseReady || !auth?.currentUser || !db) return;
    if (typeof collection !== 'function' || typeof addDoc !== 'function' || typeof serverTimestamp !== 'function') {
      return;
    }

    const entryId = state.pendingLogId;
    const feeling = state.selectedFeeling;
    const setting = settingInput?.value.trim() || '';
    if (!entryId || (!feeling && !setting)) return;

    setStatus(null);
    if (saveBtn) saveBtn.disabled = true;

    try {
      const contextRef = collection(db, 'users', auth.currentUser.uid, 'logs', entryId, 'context');
      await addDoc(contextRef, {
        feeling: feeling || null,
        setting: setting || null,
        timestamp: serverTimestamp()
      });
      setStatus('contextSaved', { autoClearMs: 4000 });
      if (settingInput) settingInput.value = '';
      clearFeelingSelection();
      state.selectedFeeling = '';
      state.cache.delete(entryId);
      await refreshOpenRow(entryId);
      hidePrompt({ preserveStatus: true });
    } catch (error) {
      console.error('Error saving context:', error);
      setStatus('contextError');
    } finally {
      if (saveBtn) saveBtn.disabled = false;
    }
  };

  const handleFeelingSelection = (button) => {
    if (!button || !state.elements.feelingButtons?.length) return;
    const value = button.dataset.feeling || '';
    if (state.selectedFeeling === value) {
      state.selectedFeeling = '';
      button.classList.remove('is-selected');
    } else {
      state.selectedFeeling = value;
      state.elements.feelingButtons.forEach(btn => {
        btn.classList.toggle('is-selected', btn === button);
      });
    }
    updateSaveState();
  };

  const skipContextEntry = () => {
    hidePrompt();
  };

  const feelingsGroup = () => state.elements.followup?.querySelector('.context-feelings');

  const applyLanguage = () => {
    const group = feelingsGroup();
    if (group) {
      group.setAttribute('aria-label', translate('contextPrompt'));
    }
    applyStatusText();
  };

  const assignElements = (elements) => {
    state.elements = { ...DEFAULT_ELEMENTS, ...elements };
    applyLanguage();
    updateSaveState();
  };

  const attachListeners = (tileSystem) => {
    state.tileSystem = tileSystem;
    if (state.listenersBound) return;

    const { feelingButtons, settingInput, saveBtn, skipBtn } = state.elements;

    feelingButtons?.forEach(button => {
      button.addEventListener('click', () => {
        if (isReorganizing()) return;
        handleFeelingSelection(button);
      });
    });

    if (settingInput) {
      settingInput.addEventListener('input', updateSaveState);
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (isReorganizing()) return;
        saveContextEntry();
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        if (isReorganizing()) return;
        skipContextEntry();
      });
    }

    state.listenersBound = true;
  };

  return {
    assignElements,
    attachListeners,
    showPrompt,
    hidePrompt,
    toggleRow,
    clearCacheForEntry(entryId) {
      if (entryId) {
        state.cache.delete(entryId);
        if (state.pendingLogId === entryId) {
          hidePrompt();
        }
      }
    },
    clearAll() {
      state.cache.clear();
      clearStatusTimer();
      hidePrompt();
    },
    onLanguageChange: applyLanguage,
    saveContextEntry, // exposed for potential direct usage/testing
    skipContextEntry
  };
}

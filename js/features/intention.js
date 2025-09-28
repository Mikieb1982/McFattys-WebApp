const DEFAULT_ELEMENTS = {
  form: null,
  textarea: null,
  saveBtn: null,
  display: null,
  current: null,
  date: null,
  editBtn: null,
  status: null
};

const getTodayId = () => new Date().toISOString().slice(0, 10);

export function createIntentionFeature({ getTranslation, getLang, getFirebase, getFirestore }) {
  const state = {
    elements: { ...DEFAULT_ELEMENTS },
    tileSystem: null,
    todaysIntention: null,
    unsubscribe: null,
    isEditing: false,
    statusKey: null,
    listenersBound: false
  };

  const translate = (key) => (typeof getTranslation === 'function' ? getTranslation(key) : key);
  const currentLang = () => (typeof getLang === 'function' ? getLang() : 'en');
  const isReorganizing = () => Boolean(state.tileSystem?.isReorganizeMode?.());

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

  const setStatus = (key) => {
    state.statusKey = key || null;
    applyStatusText();
  };

  const clearStatusIfError = () => {
    if (!state.statusKey) return;
    if (state.statusKey === 'intentionError' || state.statusKey === 'intentionRequired') {
      setStatus(null);
    }
  };

  const getDateLabel = (intention) => {
    if (!intention) return '';
    const locale = currentLang() === 'de' ? 'de-DE' : 'en-US';
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
    return translate('intentionToday').replace('{date}', formatted);
  };

  const applyStatusForEmptyState = () => {
    const hasIntention = Boolean(state.todaysIntention?.text);
    if (!hasIntention && !state.isEditing) {
      if (!state.statusKey) {
        setStatus('intentionEmpty');
      } else if (state.statusKey === 'intentionEmpty') {
        applyStatusText();
      }
    } else if (state.statusKey === 'intentionEmpty') {
      setStatus(null);
    }
  };

  const updateUI = () => {
    const { form, textarea, saveBtn, display, current, date } = state.elements;
    const hasIntention = Boolean(state.todaysIntention?.text);
    const showForm = !hasIntention || state.isEditing;

    if (form) form.hidden = !showForm;
    if (display) display.hidden = showForm;

    if (showForm && textarea && document.activeElement !== textarea) {
      textarea.value = state.todaysIntention?.text || '';
    }

    if (!showForm && current) {
      current.textContent = state.todaysIntention?.text || '';
    }

    if (!showForm && date) {
      date.textContent = getDateLabel(state.todaysIntention);
    } else if (date) {
      date.textContent = '';
    }

    if (saveBtn) {
      saveBtn.disabled = false;
    }

    applyStatusForEmptyState();
  };

  const getFirebaseContext = () => getFirebase?.() || {};
  const getFirestoreFns = () => ({ ...getFirestore?.() });

  const resetSubscription = () => {
    if (state.unsubscribe) {
      state.unsubscribe();
      state.unsubscribe = null;
    }
  };

  const resetData = () => {
    resetSubscription();
    state.todaysIntention = null;
    state.isEditing = false;
    if (state.elements.textarea) {
      state.elements.textarea.value = '';
    }
    setStatus(null);
    updateUI();
  };

  const saveIntention = async () => {
    const { firebaseReady, auth, db } = getFirebaseContext();
    const { doc, setDoc, serverTimestamp } = getFirestoreFns();
    const { textarea, saveBtn } = state.elements;

    if (!textarea || !firebaseReady || !auth?.currentUser || !db) return;
    if (typeof doc !== 'function' || typeof setDoc !== 'function' || typeof serverTimestamp !== 'function') {
      return;
    }

    const text = textarea.value.trim();
    if (!text) {
      setStatus('intentionRequired');
      return;
    }

    if (saveBtn) saveBtn.disabled = true;
    setStatus(null);

    const todayId = getTodayId();
    let succeeded = false;

    try {
      const ref = doc(db, 'users', auth.currentUser.uid, 'intentions', todayId);
      await setDoc(ref, {
        text,
        date: todayId,
        timestamp: serverTimestamp()
      });
      setStatus('intentionSaved');
      state.isEditing = false;
      state.todaysIntention = { ...(state.todaysIntention || {}), text, date: todayId };
      succeeded = true;
    } catch (error) {
      console.error('Error saving intention:', error);
      setStatus('intentionError');
    } finally {
      if (saveBtn) saveBtn.disabled = false;
      if (succeeded) {
        updateUI();
      }
    }
  };

  const editIntention = () => {
    state.isEditing = true;
    setStatus(null);
    updateUI();
    const { textarea } = state.elements;
    if (textarea) {
      textarea.focus();
      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    }
  };

  const subscribe = (userId) => {
    resetSubscription();

    const { firebaseReady, db } = getFirebaseContext();
    const { doc, onSnapshot } = getFirestoreFns();

    if (!firebaseReady || !db || !userId) {
      state.todaysIntention = null;
      state.isEditing = false;
      updateUI();
      return;
    }

    if (typeof doc !== 'function' || typeof onSnapshot !== 'function') {
      return;
    }

    const todayId = getTodayId();
    const ref = doc(db, 'users', userId, 'intentions', todayId);
    state.unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        state.todaysIntention = snap.data();
        state.isEditing = false;
      } else {
        state.todaysIntention = null;
      }
      updateUI();
    }, (error) => {
      console.error('Error listening to intention:', error);
    });
  };

  const assignElements = (elements) => {
    state.elements = { ...DEFAULT_ELEMENTS, ...elements };
    updateUI();
  };

  const attachListeners = (tileSystem) => {
    state.tileSystem = tileSystem;
    if (state.listenersBound) return;

    const { saveBtn, editBtn, textarea } = state.elements;

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (isReorganizing()) return;
        saveIntention();
      });
    }

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        if (isReorganizing()) return;
        editIntention();
      });
    }

    if (textarea) {
      textarea.addEventListener('input', clearStatusIfError);
    }

    state.listenersBound = true;
  };

  const onLanguageChange = () => {
    applyStatusText();
    updateUI();
  };

  return {
    assignElements,
    attachListeners,
    save: saveIntention,
    edit: editIntention,
    subscribe,
    reset: resetData,
    onLanguageChange
  };
}

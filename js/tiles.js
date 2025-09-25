const tileDefinitions = [
  {
    id: 'logo',
    elementId: 'logo-card',
    classNames: ['logo-card'],
    ariaLabel: "McFatty's logo",
    span: false,
    template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <div class="logo-card-inner">
        <img src="Logo.png" alt="McFatty's Food Tracker logo">
      </div>
    `
  },
  {
    id: 'manifesto',
    elementId: 'manifesto-card',
    classNames: ['logo-card'],
    ariaLabel: "McFatty's Manifesto",
    span: false,
    template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <div class="logo-card-inner">
        <img src="manifesto.png" alt="McFatty's Manifesto logo">
      </div>
    `
  },
  {
    id: 'welcome',
    elementId: 'welcome-section',
    classNames: [],
    ariaLabelledBy: 'welcome-message',
    span: false,
    template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <h2 id="welcome-message" data-i18n="welcome"></h2>
    `
  },
  {
    id: 'growth',
    elementId: 'growth-section',
    classNames: [],
    ariaLabelledBy: 'growth-title',
    span: false,
    template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <h2 id="growth-title" data-i18n="growthTitle">Room to grow</h2>
      <p data-i18n="growthCopy">This space is ready for habits, reflections, or whatever else you need next.</p>
    `
  },
  {
    id: 'support',
    elementId: 'support-card',
    classNames: ['support-card'],
    ariaLabelledBy: 'support-title',
    span: false,
    template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <div class="support-card-inner">
        <span class="support-badge" data-i18n="supportBadge">Keep McFatty’s free</span>
        <h2 id="support-title" data-i18n="supportTitle">Support us</h2>
        <p class="support-copy" data-i18n="supportCopy">Chip in to cover hosting and keep the tracker open for everyone.</p>
        <button id="support-button" class="btn btn-primary" type="button" data-i18n="donateBtn">Donate</button>
      </div>
    `
  },
  {
    id: 'stats',
    elementId: 'stats-section',
    classNames: ['span-2'],
    ariaLabelledBy: 'quick-stats-title',
    span: true,
    template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <h2 id="quick-stats-title" data-i18n="quickStatsTitle">Quick stats</h2>
      <div class="quick-stats-grid">
        <div class="stat-card">
          <span class="stat-label" data-i18n="statEntriesToday">Entries today</span>
          <div id="stat-total" class="stat-value">0</div>
        </div>
        <div class="stat-card">
          <span class="stat-label" data-i18n="statDairyToday">Dairy items</span>
          <div id="stat-dairy" class="stat-value">0</div>
        </div>
        <div class="stat-card">
          <span class="stat-label" data-i18n="statOutsideMeals">Outside of mealtimes</span>
          <div id="stat-outside" class="stat-value">0</div>
        </div>
        <div class="stat-card">
          <span class="stat-label" data-i18n="statLastEntry">Last entry</span>
          <div id="stat-last" class="stat-value" aria-live="polite">—</div>
          <div id="stat-last-subtext" class="stat-subtext"></div>
        </div>
      </div>
    `
  },
  {
    id: 'quick-add',
    elementId: 'add-item-section',
    classNames: ['span-2'],
    ariaLabelledBy: 'addItem',
    span: true,
    template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <h2 id="addItem" data-i18n="quickAddTitle">Quick add</h2>
      <p class="quick-add-subtext" data-i18n="quickAddHint">Log what you’re eating right now—no pressure, no judgement.</p>
      <div class="quick-add-body">
        <div>
          <label for="food-name" class="label" data-i18n="foodLabel">Food item name</label>
          <input id="food-name" class="input" type="text" placeholder="e.g., Cheeseburger" data-i18n-placeholder="foodPlaceholder">
        </div>
        <div class="quick-add-actions">
          <label style="display:flex;align-items:center;gap:var(--sp-8);margin:0;">
            <input id="contains-dairy" type="checkbox" class="checkbox" aria-label="Contains dairy">
            <span data-i18n="dairyLabel">Contains dairy</span>
          </label>
          <label style="display:flex;align-items:center;gap:var(--sp-8);margin:0;">
            <input id="outside-meals" type="checkbox" class="checkbox" aria-label="Outside of mealtimes">
            <span data-i18n="outsideMealsLabel">Outside of mealtimes</span>
          </label>
          <button id="add-button" class="btn btn-primary" type="button" data-i18n="addBtn">Add to log</button>
        </div>
      </div>
    `
  },
  {
    id: 'recent-log',
    elementId: 'log-section',
    classNames: ['span-2'],
    ariaLabelledBy: 'recentLog',
    span: true,
    template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <div class="section-head">
        <h2 id="recentLog" data-i18n="recentLogTitle">Recent log</h2>
        <button id="export-button" class="btn btn-secondary" type="button" data-i18n="exportBtn">Export</button>
      </div>
      <div class="log-controls" role="search">
        <div class="log-search">
          <label class="sr-only" for="log-search" data-i18n="logSearchLabel">Search log</label>
          <input id="log-search" class="input" type="search" placeholder="Search entries" data-i18n-placeholder="logSearchPlaceholder">
        </div>
        <div class="filter-group" role="group" aria-labelledby="log-filters-label">
          <span id="log-filters-label" class="sr-only" data-i18n="filterGroupLabel">Filters</span>
          <button type="button" class="filter-btn is-active" data-filter="all" data-i18n="filterAll">All</button>
          <button type="button" class="filter-btn" data-filter="dairy" data-i18n="filterDairy">Dairy</button>
          <button type="button" class="filter-btn" data-filter="non-dairy" data-i18n="filterNonDairy">No dairy</button>
          <button type="button" class="filter-btn" data-filter="outside-meals" data-i18n="filterOutsideMeals">Outside of mealtimes</button>
          <button type="button" class="filter-btn" data-filter="during-meals" data-i18n="filterMeals">At mealtimes</button>
        </div>
      </div>
      <table class="table" aria-describedby="recentLog">
        <thead>
          <tr>
            <th data-i18n="thItem">Item</th>
            <th data-i18n="thTime">Time</th>
            <th data-i18n="thDairy">Dairy</th>
            <th data-i18n="thOutsideMeals">Outside of mealtimes</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="log-body"></tbody>
      </table>
      <div id="empty-state" class="info-text" style="display:none" data-i18n="emptyState">No items yet. Add your first item above.</div>
      <div id="no-results" class="info-text" style="display:none" data-i18n="noResults">No entries match your filters yet.</div>
    `
  }
];

let containerRef = null;
let reorderToggleRef = null;
let reorderHintRef = null;
let translationFn = (key) => key;
let dragState = null;
let isReorganizeMode = false;

const DASHBOARD_ORDER_KEY = 'dashboard-card-order-v1';

export function renderTiles(container) {
  if (!container) return;
  container.innerHTML = '';
  tileDefinitions.forEach(def => {
    const section = document.createElement('section');
    section.id = def.elementId;
    section.dataset.cardId = def.id;
    section.classList.add('section', 'dashboard-card');
    if (Array.isArray(def.classNames)) {
      def.classNames.forEach(name => section.classList.add(name));
    }
    if (def.span) {
      section.classList.add('span-2');
    }
    if (def.ariaLabel) {
      section.setAttribute('aria-label', def.ariaLabel);
    }
    if (def.ariaLabelledBy) {
      section.setAttribute('aria-labelledby', def.ariaLabelledBy);
    }
    section.innerHTML = def.template;
    container.appendChild(section);
  });
}

function getDashboardCards() {
  if (!containerRef) return [];
  return Array.from(containerRef.querySelectorAll('.dashboard-card'));
}

function persistCardOrder() {
  if (!containerRef) return;
  try {
    const order = getDashboardCards().map(card => card.dataset.cardId).filter(Boolean);
    localStorage.setItem(DASHBOARD_ORDER_KEY, JSON.stringify(order));
  } catch (error) {
    console.warn('Unable to save dashboard order', error);
  }
}

function applyStoredCardOrder() {
  if (!containerRef) return;
  const cards = getDashboardCards();
  if (!cards.length) return;

  const defaultOrder = cards.map(card => card.dataset.cardId).filter(Boolean);
  let storedOrder = [];

  try {
    const storedValue = localStorage.getItem(DASHBOARD_ORDER_KEY);
    storedOrder = storedValue ? JSON.parse(storedValue) : [];
  } catch (error) {
    storedOrder = [];
  }

  if (!Array.isArray(storedOrder) || !storedOrder.length) return;

  const validStored = storedOrder.filter(id => defaultOrder.includes(id));
  const storedSet = new Set(validStored);
  const queue = [...validStored];
  const finalOrder = [];

  defaultOrder.forEach(id => {
    if (!id) return;
    if (!storedSet.has(id)) {
      if (!finalOrder.includes(id)) {
        finalOrder.push(id);
      }
    } else {
      const nextStored = queue.shift();
      if (nextStored && !finalOrder.includes(nextStored)) {
        finalOrder.push(nextStored);
      }
    }
  });

  queue.forEach(id => {
    if (id && !finalOrder.includes(id)) {
      finalOrder.push(id);
    }
  });

  defaultOrder.forEach(id => {
    if (id && !finalOrder.includes(id)) {
      finalOrder.push(id);
    }
  });

  finalOrder.forEach(id => {
    const card = containerRef.querySelector(`[data-card-id="${id}"]`);
    if (card) {
      containerRef.appendChild(card);
    }
  });
}

function createPlaceholder(card, rect) {
  const placeholder = document.createElement('div');
  placeholder.className = 'dashboard-placeholder';
  if (card.classList.contains('span-2')) {
    placeholder.classList.add('span-2');
  }
  placeholder.style.minHeight = `${rect.height}px`;
  return placeholder;
}

function removeDragListeners() {
  window.removeEventListener('pointermove', handleCardDragMove);
  window.removeEventListener('pointerup', handleCardDragEnd);
  window.removeEventListener('pointercancel', handleCardDragEnd);
}

function resetDraggedCardStyles(card) {
  card.classList.remove('is-dragging', 'is-active-drag');
  card.style.position = '';
  card.style.width = '';
  card.style.height = '';
  card.style.left = '';
  card.style.top = '';
  card.style.zIndex = '';
  card.style.pointerEvents = '';
  card.style.transform = '';
}

function finishDrag(commit) {
  if (!dragState) return;

  const { card, placeholder, originalParent, originalNextSibling, pointerId, captureTarget } = dragState;

  removeDragListeners();

  if (captureTarget && captureTarget.releasePointerCapture) {
    try {
      captureTarget.releasePointerCapture(pointerId);
    } catch (error) {
      // ignore
    }
  }

  if (placeholder) {
    if (commit && placeholder.parentNode) {
      placeholder.parentNode.insertBefore(card, placeholder);
    } else if (!commit && originalParent) {
      if (originalNextSibling && originalNextSibling.parentNode === originalParent) {
        originalParent.insertBefore(card, originalNextSibling);
      } else {
        originalParent.appendChild(card);
      }
    }
    if (placeholder.parentNode) {
      placeholder.parentNode.removeChild(placeholder);
    }
  }

  resetDraggedCardStyles(card);
  document.body.classList.remove('card-dragging');

  dragState = null;

  if (commit) {
    persistCardOrder();
  }
}

function updateDraggedCardPosition(event) {
  if (!dragState) return;
  const { card, offsetX, offsetY } = dragState;
  card.style.left = `${event.clientX - offsetX}px`;
  card.style.top = `${event.clientY - offsetY}px`;
}

function updatePlaceholderFromPointer(event) {
  if (!dragState || !containerRef) return;
  const { placeholder, card } = dragState;
  if (!placeholder) return;

  const element = document.elementFromPoint(event.clientX, event.clientY);
  const targetCard = element ? element.closest('.dashboard-card') : null;

  if (targetCard && targetCard !== card) {
    const rect = targetCard.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;

    if (before) {
      if (targetCard !== placeholder.nextSibling) {
        containerRef.insertBefore(placeholder, targetCard);
      }
    } else if (targetCard.nextSibling !== placeholder) {
      containerRef.insertBefore(placeholder, targetCard.nextSibling);
    }
    return;
  }

  const cards = getDashboardCards().filter(item => item !== card);
  if (!cards.length) return;

  const firstCard = cards[0];
  const firstRect = firstCard.getBoundingClientRect();
  if (event.clientY < firstRect.top) {
    if (placeholder !== firstCard) {
      containerRef.insertBefore(placeholder, firstCard);
    }
    return;
  }

  const lastCard = cards[cards.length - 1];
  const lastRect = lastCard.getBoundingClientRect();
  if (event.clientY > lastRect.bottom) {
    if (lastCard.nextSibling !== placeholder) {
      containerRef.appendChild(placeholder);
    }
  }
}

function handleCardDragMove(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  event.preventDefault();
  updateDraggedCardPosition(event);
  updatePlaceholderFromPointer(event);
}

function handleCardDragEnd(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const commit = event.type !== 'pointercancel';
  finishDrag(commit);
}

function startCardDrag(card, event) {
  if (!isReorganizeMode || !containerRef || dragState) return;

  const rect = card.getBoundingClientRect();
  const placeholder = createPlaceholder(card, rect);
  const originalParent = card.parentNode;
  const originalNextSibling = card.nextSibling;
  const captureTarget = event.currentTarget || event.target || card;

  dragState = {
    card,
    placeholder,
    pointerId: event.pointerId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    originalParent,
    originalNextSibling,
    captureTarget
  };

  containerRef.insertBefore(placeholder, card);

  card.classList.add('is-dragging', 'is-active-drag');
  card.style.position = 'fixed';
  card.style.width = `${rect.width}px`;
  card.style.height = `${rect.height}px`;
  card.style.left = `${rect.left}px`;
  card.style.top = `${rect.top}px`;
  card.style.zIndex = '950';
  card.style.pointerEvents = 'none';
  card.style.transform = 'scale(1.02)';

  document.body.classList.add('card-dragging');

  try {
    captureTarget.setPointerCapture(event.pointerId);
  } catch (error) {
    // ignore
  }

  updateDraggedCardPosition(event);

  window.addEventListener('pointermove', handleCardDragMove, { passive: false });
  window.addEventListener('pointerup', handleCardDragEnd);
  window.addEventListener('pointercancel', handleCardDragEnd);
}

function handleHandlePointerDown(event) {
  if (!isReorganizeMode) return;
  if (!event.isPrimary) return;
  if (event.pointerType === 'mouse' && event.button !== 0) return;

  const card = event.currentTarget ? event.currentTarget.closest('.dashboard-card') : event.target.closest('.dashboard-card');
  if (!card || !card.dataset.cardId) return;

  event.preventDefault();
  event.stopPropagation();
  startCardDrag(card, event);
}

function toggleReorderMode() {
  if (isReorganizeMode) {
    exitReorganizeMode(true);
    if (reorderToggleRef) {
      reorderToggleRef.focus();
    }
  } else {
    enterReorganizeMode();
  }
}

function handleReorderKeydown(event) {
  if (event.key !== 'Escape') return;

  if (dragState) {
    finishDrag(false);
    return;
  }

  if (isReorganizeMode) {
    exitReorganizeMode(true);
    if (reorderToggleRef) {
      reorderToggleRef.focus();
    }
  }
}

function updateReorderTexts() {
  if (!reorderToggleRef) return;
  const labelKey = isReorganizeMode ? 'doneOrganizing' : 'organizeTiles';
  const label = translationFn(labelKey);
  reorderToggleRef.textContent = label;
  reorderToggleRef.setAttribute('aria-pressed', isReorganizeMode ? 'true' : 'false');
  reorderToggleRef.setAttribute('aria-label', label);
  if (reorderHintRef) {
    reorderHintRef.hidden = !isReorganizeMode;
    reorderHintRef.textContent = translationFn('reorderHint');
  }
}

function enterReorganizeMode() {
  if (!containerRef || isReorganizeMode) return;
  isReorganizeMode = true;
  containerRef.classList.add('reorganize-mode', 'is-reordering');
  getDashboardCards().forEach(card => {
    const handle = card.querySelector('.drag-handle');
    if (handle) {
      handle.setAttribute('role', 'button');
      handle.setAttribute('tabindex', '0');
    }
  });
  updateReorderTexts();
}

function exitReorganizeMode(commit = true) {
  if (dragState) {
    finishDrag(commit);
  }

  if (!containerRef || !isReorganizeMode) {
    updateReorderTexts();
    return;
  }

  isReorganizeMode = false;
  containerRef.classList.remove('reorganize-mode', 'is-reordering');
  getDashboardCards().forEach(card => {
    const handle = card.querySelector('.drag-handle');
    if (handle) {
      handle.removeAttribute('tabindex');
    }
  });
  updateReorderTexts();

  if (commit) {
    persistCardOrder();
  }
}

export function initTileSystem({ container, reorderToggle, reorderHint, getTranslation }) {
  containerRef = container;
  reorderToggleRef = reorderToggle || null;
  reorderHintRef = reorderHint || null;
  translationFn = typeof getTranslation === 'function' ? getTranslation : translationFn;

  if (!containerRef) {
    return {
      enterReorganizeMode: () => {},
      exitReorganizeMode: () => {},
      refreshLabels: () => {},
      isReorganizeMode: () => false
    };
  }

  applyStoredCardOrder();
  persistCardOrder();
  updateReorderTexts();

  getDashboardCards().forEach(card => {
    const handle = card.querySelector('.drag-handle');
    if (handle) {
      handle.setAttribute('role', 'button');
      handle.setAttribute('tabindex', '-1');
      handle.addEventListener('pointerdown', handleHandlePointerDown);
    }
  });

  if (reorderToggleRef) {
    reorderToggleRef.addEventListener('click', toggleReorderMode);
  }

  document.addEventListener('keydown', handleReorderKeydown);

  containerRef.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      exitReorganizeMode(true);
      if (reorderToggleRef) {
        reorderToggleRef.focus();
      }
    });
  });

  return {
    enterReorganizeMode,
    exitReorganizeMode,
    refreshLabels: updateReorderTexts,
    isReorganizeMode: () => isReorganizeMode
  };
}

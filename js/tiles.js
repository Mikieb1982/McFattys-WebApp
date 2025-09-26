import logoTile from './tiles/logo.js';
import manifestoTile from './tiles/manifesto.js';
import welcomeTile from './tiles/welcome.js';
import growthTile from './tiles/growth.js';
import supportTile from './tiles/support.js';
import statsTile from './tiles/stats.js';
import quickAddTile from './tiles/quick-add.js';
import recentLogTile from './tiles/recent-log.js';

// To add or remove tiles, create or delete a file in js/tiles and update this list.
export const tileDefinitions = [
  logoTile,
  manifestoTile,
  welcomeTile,
  growthTile,
  supportTile,
  statsTile,
  quickAddTile,
  recentLogTile
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

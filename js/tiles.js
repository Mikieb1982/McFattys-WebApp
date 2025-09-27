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

function getNodeIndex(node) {
  if (!node || !node.parentNode) return -1;
  return Array.prototype.indexOf.call(node.parentNode.children, node);
}

function captureCardPositions(excludeCard) {
  if (!containerRef) return null;
  const positions = new Map();
  getDashboardCards().forEach(card => {
    if (card === excludeCard) return;
    positions.set(card, card.getBoundingClientRect());
  });
  return positions;
}

function animateCardPositions(previousPositions, excludeCard) {
  if (!previousPositions) return;
  requestAnimationFrame(() => {
    previousPositions.forEach((prevRect, card) => {
      if (!card || card === excludeCard) return;
      const nextRect = card.getBoundingClientRect();
      const deltaX = prevRect.left - nextRect.left;
      const deltaY = prevRect.top - nextRect.top;
      if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
        return;
      }
      const originalTransition = card.style.transition;
      card.style.transition = 'none';
      card.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      void card.offsetHeight;
      if (originalTransition) {
        card.style.transition = originalTransition;
      } else {
        card.style.removeProperty('transition');
      }
      card.style.transform = '';
    });
  });
}

function getSortableCards(excludeCard) {
  if (!containerRef) return [];
  return getDashboardCards().filter(card => card !== excludeCard);
}

function swapPlaceholderWithCard(targetCard, draggedCard) {
  if (!dragState || !containerRef) return false;
  const { placeholder } = dragState;
  if (!placeholder || !targetCard) return false;

  const placeholderIndex = getNodeIndex(placeholder);
  const targetIndex = getNodeIndex(targetCard);
  if (placeholderIndex === -1 || targetIndex === -1 || placeholderIndex === targetIndex) {
    return false;
  }

  const previousPositions = captureCardPositions(draggedCard);

  if (placeholderIndex < targetIndex) {
    const targetNext = targetCard.nextSibling;
    containerRef.insertBefore(targetCard, placeholder);
    if (targetNext && targetNext !== placeholder) {
      containerRef.insertBefore(placeholder, targetNext);
    } else {
      containerRef.appendChild(placeholder);
    }
  } else {
    const placeholderNext = placeholder.nextSibling;
    containerRef.insertBefore(placeholder, targetCard);
    if (placeholderNext) {
      containerRef.insertBefore(targetCard, placeholderNext);
    } else {
      containerRef.appendChild(targetCard);
    }
  }

  animateCardPositions(previousPositions, draggedCard);
  return true;
}

function movePlaceholderBefore(reference, draggedCard) {
  if (!dragState || !containerRef) return false;
  const { placeholder } = dragState;
  if (!placeholder || !reference || reference === placeholder) return false;
  if (reference.previousSibling === placeholder) return false;

  const previousPositions = captureCardPositions(draggedCard);
  containerRef.insertBefore(placeholder, reference);
  animateCardPositions(previousPositions, draggedCard);
  return true;
}

function movePlaceholderAfter(reference, draggedCard) {
  if (!dragState || !containerRef) return false;
  const { placeholder } = dragState;
  if (!placeholder || !reference) return false;
  const next = reference.nextSibling;
  if (next === placeholder) return false;

  const previousPositions = captureCardPositions(draggedCard);
  if (next) {
    containerRef.insertBefore(placeholder, next);
  } else {
    containerRef.appendChild(placeholder);
  }
  animateCardPositions(previousPositions, draggedCard);
  return true;
}

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

  if (targetCard && targetCard !== card && targetCard !== placeholder) {
    if (swapPlaceholderWithCard(targetCard, card)) {
      return;
    }
  }

  const cards = getSortableCards(card);
  if (!cards.length) return;

  const firstCard = cards[0];
  const firstRect = firstCard.getBoundingClientRect();
  if (event.clientY < firstRect.top) {
    movePlaceholderBefore(firstCard, card);
    return;
  }

  const lastCard = cards[cards.length - 1];
  const lastRect = lastCard.getBoundingClientRect();
  if (event.clientY > lastRect.bottom) {
    movePlaceholderAfter(lastCard, card);
    return;
  }

  let closestCard = null;
  let closestDistance = Number.POSITIVE_INFINITY;
  cards.forEach(currentCard => {
    const rect = currentCard.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCard = currentCard;
    }
  });

  if (!closestCard || closestCard === placeholder) {
    return;
  }

  const rect = closestCard.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = event.clientX - centerX;
  const deltaY = event.clientY - centerY;
  const dominantAxis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';

  if (dominantAxis === 'x') {
    if (deltaX < 0) {
      movePlaceholderBefore(closestCard, card);
    } else {
      movePlaceholderAfter(closestCard, card);
    }
  } else if (deltaY < 0) {
    movePlaceholderBefore(closestCard, card);
  } else {
    movePlaceholderAfter(closestCard, card);
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

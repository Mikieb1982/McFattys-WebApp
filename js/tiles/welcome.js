const welcomeTile = {
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
};

export default welcomeTile;

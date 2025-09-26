const growthTile = {
  id: 'growth',
  elementId: 'growth-section',
  classNames: ['tile--growth'],
  ariaLabelledBy: 'growth-title',
  span: false,
  template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <h2 id="growth-title" data-i18n="growthTitle">Room to grow</h2>
      <p data-i18n="growthCopy">This space is ready for habits, reflections, or whatever else you need next.</p>
    `
};

export default growthTile;

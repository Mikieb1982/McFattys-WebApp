const supportTile = {
  id: 'support',
  elementId: 'support-card',
  classNames: ['support-card'],
  ariaLabelledBy: 'support-title',
  span: false,
   template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <div class="logo-card-inner">
        <img src="support.png" alt="McFatty's Support logo">
      </div>
    `
};

export default supportTile;

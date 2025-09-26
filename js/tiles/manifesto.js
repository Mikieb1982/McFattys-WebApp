const manifestoTile = {
  id: 'manifesto',
  elementId: 'manifesto-card',
  classNames: ['logo-card', 'tile--manifesto'],
  ariaLabel: "McFatty's Manifesto",
  span: false,
  template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <div class="logo-card-inner">
        <img src="manifesto.png" alt="McFatty's Manifesto logo">
      </div>
    `
};

export default manifestoTile;

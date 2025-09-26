const logoTile = {
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
};

export default logoTile;

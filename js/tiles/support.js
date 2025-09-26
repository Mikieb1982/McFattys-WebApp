const supportTile = {
  id: 'support',
  elementId: 'support-card',
  classNames: ['support-card'],
  span: false,
  template: `
    <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
    <button class="close-btn" aria-label="Finish organizing">&times;</button>
    <div class="support-card-inner">
      <span class="support-badge" data-i18n="supportBadge">Keep McFatty’s free</span>
      <img src="support.png" alt="McFatty's donation jar illustration" class="support-illustration">
      <h3 id="support-title" data-i18n="supportTitle">Support us</h3>
      <p class="support-copy" data-i18n="supportCopy">Chip in to cover hosting and keep the tracker open for everyone.</p>
      <button id="support-button" class="btn btn-primary" type="button" data-i18n="donateBtn">Donate</button>
    </div>
  `
};

export default supportTile;


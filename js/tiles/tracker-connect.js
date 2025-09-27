const trackerTile = {
  id: 'tracker-connect',
  elementId: 'tracker-card',
  classNames: ['tile--tracker'],
  span: false,
  ariaLabelledBy: 'tracker-title',
  template: `
    <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
    <button class="close-btn" aria-label="Finish organizing">&times;</button>
    <div class="tracker-card-inner">
      <div class="tracker-card-visual" aria-hidden="true">
        <div class="tracker-logo-cloud">
          <img src="icons/google-fit.svg" class="tracker-logo tracker-logo--google" alt="" loading="lazy">
          <img src="icons/withings.svg" class="tracker-logo tracker-logo--withings" alt="" loading="lazy">
        </div>
      </div>
      <div class="tracker-card-content">
        <h3 id="tracker-title" data-i18n="trackerTitle">Connect trackers</h3>
        <p class="tracker-copy" data-i18n="trackerCopy">Link your wellness apps to see a combined snapshot alongside your food log.</p>
        <ul class="tracker-summary" id="tracker-summary" aria-live="polite">
          <li class="tracker-summary__empty" data-i18n="trackerSummaryEmpty">No trackers connected yet.</li>
        </ul>
        <button id="manage-trackers" class="btn btn-secondary tracker-manage-btn" type="button" data-i18n="trackerConnectCta">Connect a tracker</button>
      </div>
    </div>
  `
};

export default trackerTile;

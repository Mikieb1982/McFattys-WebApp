const intentionTile = {
  id: 'intention',
  elementId: 'intention-section',
  classNames: ['tile--intention'],
  ariaLabelledBy: 'intention-title',
  span: false,
  template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <h2 id="intention-title" data-i18n="intentionTitle">Daily intention</h2>
      <div class="intention-body">
        <form id="intention-form" class="stack-16" novalidate>
          <label for="intention-text" class="label" data-i18n="intentionLabel">What's your focus today?</label>
          <textarea id="intention-text" class="input" rows="3" placeholder="Pause, notice, breathe" data-i18n-placeholder="intentionPlaceholder"></textarea>
          <p class="intention-hint" data-i18n="intentionExamples">Try: "Pause between bites", "Notice fullness cues".</p>
          <div class="intention-actions">
            <button id="intention-save" class="btn btn-primary" type="button" data-i18n="intentionSave">Save intention</button>
          </div>
        </form>
        <div id="intention-display" class="intention-display" hidden>
          <p class="intention-current" aria-live="polite"></p>
          <p class="intention-date"></p>
          <div class="intention-actions">
            <button id="intention-edit" class="btn btn-secondary" type="button" data-i18n="intentionEdit">Edit intention</button>
          </div>
        </div>
        <p id="intention-status" class="intention-status" aria-live="polite"></p>
      </div>
    `
};

export default intentionTile;

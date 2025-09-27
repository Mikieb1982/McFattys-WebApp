const quickAddTile = {
  id: 'quick-add',
  elementId: 'add-item-section',
  classNames: ['span-2', 'tile--quick-add'],
  ariaLabelledBy: 'addItem',
  span: true,
  template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <h2 id="addItem" data-i18n="quickAddTitle">Quick add</h2>
      <p class="quick-add-subtext" data-i18n="quickAddHint">Log what you’re eating right now—no pressure, no judgement.</p>
      <div class="quick-add-body">
        <div>
          <label for="food-name" class="label" data-i18n="foodLabel">Food item name</label>
          <input id="food-name" class="input" type="text" placeholder="e.g., Cheeseburger" data-i18n-placeholder="foodPlaceholder">
        </div>
        <div class="quick-add-actions">
          <label style="display:flex;align-items:center;gap:var(--sp-8);margin:0;">
            <input id="contains-dairy" type="checkbox" class="checkbox" aria-label="Contains dairy">
            <span data-i18n="dairyLabel">Contains dairy</span>
          </label>
          <label style="display:flex;align-items:center;gap:var(--sp-8);margin:0;">
            <input id="outside-meals" type="checkbox" class="checkbox" aria-label="Outside of mealtimes">
            <span data-i18n="outsideMealsLabel">Outside of mealtimes</span>
          </label>
          <button id="add-button" class="btn btn-primary" type="button" data-i18n="addBtn">Add to log</button>
        </div>
      </div>
      <div id="context-followup" class="context-followup" hidden>
        <p class="context-question" data-i18n="contextPrompt">How did that feel?</p>
        <div class="context-feelings" role="group" aria-label="Select how you felt">
          <button type="button" class="btn context-feeling" data-feeling="energized" data-i18n="contextFeelingEnergized">Energized</button>
          <button type="button" class="btn context-feeling" data-feeling="satisfied" data-i18n="contextFeelingSatisfied">Satisfied</button>
          <button type="button" class="btn context-feeling" data-feeling="sluggish" data-i18n="contextFeelingSluggish">Sluggish</button>
        </div>
        <label for="context-setting" class="label" data-i18n="contextSettingLabel">Where were you?</label>
        <input id="context-setting" class="input" type="text" placeholder="At my desk" data-i18n-placeholder="contextSettingPlaceholder">
        <div class="context-actions">
          <button id="save-context" class="btn btn-primary" type="button" data-i18n="contextSave" disabled>Save</button>
          <button id="skip-context" class="btn btn-secondary" type="button" data-i18n="contextSkip">Skip</button>
        </div>
        <p id="context-status" class="context-status" aria-live="polite"></p>
      </div>
    `
};

export default quickAddTile;

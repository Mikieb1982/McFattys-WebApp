const statsTile = {
  id: 'stats',
  elementId: 'stats-section',
  classNames: ['span-2'],
  ariaLabelledBy: 'quick-stats-title',
  span: true,
  template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <h2 id="quick-stats-title" data-i18n="quickStatsTitle">Quick stats</h2>
      <div class="quick-stats-grid">
        <div class="stat-card">
          <span class="stat-label" data-i18n="statEntriesToday">Entries today</span>
          <div id="stat-total" class="stat-value">0</div>
        </div>
        <div class="stat-card">
          <span class="stat-label" data-i18n="statDairyToday">Dairy items</span>
          <div id="stat-dairy" class="stat-value">0</div>
        </div>
        <div class="stat-card">
          <span class="stat-label" data-i18n="statOutsideMeals">Outside of mealtimes</span>
          <div id="stat-outside" class="stat-value">0</div>
        </div>
        <div class="stat-card">
          <span class="stat-label" data-i18n="statLastEntry">Last entry</span>
          <div id="stat-last" class="stat-value" aria-live="polite">—</div>
          <div id="stat-last-subtext" class="stat-subtext"></div>
        </div>
      </div>
    `
};

export default statsTile;

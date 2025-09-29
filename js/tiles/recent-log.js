const recentLogTile = {
  id: 'recent-log',
  elementId: 'log-section',
  classNames: ['span-2', 'tile--recent-log'],
  ariaLabelledBy: 'recentLog',
  span: true,
  template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <div class="section-head">
        <div class="section-heading">
          <span class="tile-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path fill="currentColor" d="M6 3h12a2 2 0 0 1 2 2v15.5a.5.5 0 0 1-.68.46L12 18.1l-7.32 2.86A.5.5 0 0 1 4 20.5V5a2 2 0 0 1 2-2zm0 2v12.76l6-2.34 6 2.34V5H6z" />
            </svg>
          </span>
          <div class="section-heading-text">
            <h2 id="recentLog" data-i18n="recentLogTitle">Recent log</h2>
            <p class="section-subtitle" data-i18n="recentLogSubtitle">Your latest check-ins at a glance.</p>
          </div>
        </div>
        <div class="section-actions">
          <button id="export-button" class="btn btn-secondary" type="button" data-i18n="exportBtn">Export</button>
        </div>
      </div>
      <div class="log-controls" role="search">
        <div class="log-search">
          <label class="sr-only" for="log-search" data-i18n="logSearchLabel">Search log</label>
          <input id="log-search" class="input" type="search" placeholder="Search entries" data-i18n-placeholder="logSearchPlaceholder">
        </div>
        <div class="filter-group" role="group" aria-labelledby="log-filters-label">
          <span id="log-filters-label" class="sr-only" data-i18n="filterGroupLabel">Filters</span>
          <button type="button" class="filter-btn is-active" data-filter="all" data-i18n="filterAll">All</button>
          <button type="button" class="filter-btn" data-filter="dairy" data-i18n="filterDairy">Dairy</button>
          <button type="button" class="filter-btn" data-filter="non-dairy" data-i18n="filterNonDairy">No dairy</button>
          <button type="button" class="filter-btn" data-filter="outside-meals" data-i18n="filterOutsideMeals">Outside of mealtimes</button>
          <button type="button" class="filter-btn" data-filter="during-meals" data-i18n="filterMeals">At mealtimes</button>
        </div>
      </div>
      <div class="log-table" role="region" aria-live="polite">
        <div class="log-table-inner">
          <table class="table" aria-describedby="recentLog">
            <thead>
              <tr>
                <th data-i18n="thItem">Item</th>
                <th data-i18n="thTime">Time</th>
                <th data-i18n="thDairy">Dairy</th>
                <th data-i18n="thOutsideMeals">Outside of mealtimes</th>
                <th data-i18n="thActions" class="actions-heading">Actions</th>
              </tr>
            </thead>
            <tbody id="log-body"></tbody>
          </table>
        </div>
      </div>
      <div id="empty-state" class="info-text" style="display:none" data-i18n="emptyState">No items yet. Add your first item above.</div>
      <div id="no-results" class="info-text" style="display:none" data-i18n="noResults">No entries match your filters yet.</div>
    `
};

export default recentLogTile;

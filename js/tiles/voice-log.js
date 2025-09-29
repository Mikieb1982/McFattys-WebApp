const voiceLogTile = {
  id: 'voice-log',
  elementId: 'voice-log-tile',
  classNames: ['tile--voice-log'],
  ariaLabelledBy: 'voiceLogTitle',
  template: `
      <div class="drag-handle" aria-label="Drag to reorder"><span></span><span></span><span></span></div>
      <button class="close-btn" aria-label="Finish organizing">&times;</button>
      <div class="voice-log-tile">
        <button id="voice-log-trigger" class="voice-log-button" type="button" aria-pressed="false" aria-describedby="voiceLogTitle voiceLogHint">
          <span class="sr-only" data-i18n="voiceLogTriggerLabel">Start voice logging</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2z"/>
          </svg>
        </button>
        <div class="voice-log-copy">
          <h2 id="voiceLogTitle" data-i18n="voiceLogTitle">Voice log</h2>
          <p id="voiceLogHint" class="voice-log-hint" data-i18n="voiceLogHint">Tap the mic and speak to log your food.</p>
          <p id="voice-log-status" class="voice-log-status" role="status" aria-live="polite"></p>
        </div>
      </div>
    `
};

export default voiceLogTile;

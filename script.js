/* Simple, feature-parity logic:
   - Add item with dairy flag
   - Remove item
   - Export CSV
   - Clear all
   No storage added. Single page.
*/

const state = {
  items: [] // { name: string, dairy: boolean }
};

// Elements
const nameInput = document.getElementById('food-name');
const dairyCheckbox = document.getElementById('contains-dairy');
const addBtn = document.getElementById('add-button');
const exportBtn = document.getElementById('export-button');
const clearBtn = document.getElementById('clear-all');
const tbody = document.getElementById('log-body');

// Helpers
function render() {
  tbody.innerHTML = '';

  state.items.forEach((item, idx) => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.textContent = item.name;

    const tdDairy = document.createElement('td');
    const chip = document.createElement('span');
    chip.className = 'pill ' + (item.dairy ? 'pill-yes' : 'pill-no');
    chip.textContent = item.dairy ? 'Yes' : 'No';
    tdDairy.appendChild(chip);

    const tdActions = document.createElement('td');
    tdActions.className = 'row-actions';
    const rm = document.createElement('button');
    rm.className = 'btn btn-danger';
    rm.type = 'button';
    rm.setAttribute('aria-label', `Remove ${item.name}`);
    rm.textContent = 'Remove';
    rm.addEventListener('click', () => removeItem(idx));
    tdActions.appendChild(rm);

    tr.appendChild(tdName);
    tr.appendChild(tdDairy);
    tr.appendChild(tdActions);
    tbody.appendChild(tr);
  });
}

function addItem() {
  const name = (nameInput.value || '').trim();
  if (!name) {
    nameInput.focus();
    // brief visual nudge
    nameInput.style.boxShadow = '0 0 0 6px rgba(230,57,70,.22)';
    setTimeout(() => (nameInput.style.boxShadow = ''), 300);
    return;
  }
  const dairy = !!dairyCheckbox.checked;
  state.items.push({ name, dairy });
  render();
  // feedback pulse
  nameInput.value = '';
  dairyCheckbox.checked = false;
  nameInput.style.boxShadow = '0 0 0 6px rgba(67,170,139,.22)';
  setTimeout(() => (nameInput.style.boxShadow = ''), 350);
  nameInput.focus();
}

function removeItem(index) {
  state.items.splice(index, 1);
  render();
}

function clearAll() {
  if (!state.items.length) return;
  // keep the action as visual only, no alerts added
  state.items.length = 0;
  render();
}

function exportCSV() {
  if (!state.items.length) return;

  const rows = [['Item', 'Dairy']];
  state.items.forEach(i => rows.push([i.name, i.dairy ? 'Yes' : 'No']));

  const csv = rows.map(r =>
    r.map(field => {
      const f = String(field).replace(/"/g, '""');
      return `"${f}"`;
    }).join(',')
  ).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mcFattys-log.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Events
addBtn.addEventListener('click', addItem);
nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') addItem(); });
exportBtn.addEventListener('click', exportCSV);
clearBtn.addEventListener('click', clearAll);

// Initial render
render();
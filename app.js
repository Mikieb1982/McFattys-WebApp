/***** 1) KILL ANY OLD SERVICE WORKERS (stale cache = stale JS) *****/
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations?.().then(regs => {
    regs.forEach(r => r.unregister());
  }).catch(()=>{});
}

/***** 2) DOM HOOKS + BASIC GUARDS *****/
const form = document.getElementById('entryForm');
const input = document.getElementById('item');
const dairyBox = document.getElementById('dairy');
const tbody = document.getElementById('rows');

function guard() {
  const missing = [];
  if (!form) missing.push('#entryForm');
  if (!input) missing.push('#item');
  if (!dairyBox) missing.push('#dairy');
  if (!tbody) missing.push('#rows');
  if (missing.length) {
    alert('Page elements missing: ' + missing.join(', ') + '\nCheck your index.html IDs match.');
    throw new Error('Missing elements: ' + missing.join(', '));
  }
}
guard();

/***** 3) STORAGE WITH FALLBACK *****/
const KEY = 'mcfattys_entries';
const storage = (() => {
  try {
    const testKey = '__test__' + Math.random();
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return localStorage;
  } catch {
    return sessionStorage; // still works in-session
  }
})();

const read = () => {
  try { return JSON.parse(storage.getItem(KEY) || '[]'); }
  catch (e) { console.error('Read parse error', e); return []; }
};
const write = (arr) => {
  try { storage.setItem(KEY, JSON.stringify(arr)); }
  catch (e) { console.error('Write error', e); alert('Saving failed. Storage might be blocked.'); }
};

/***** 4) TIME HELPERS *****/
const pad = n => String(n).padStart(2,'0');
const stamp = d => ({
  date: `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,
  time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
});

/***** 5) RENDER *****/
function render() {
  const data = read();
  if (!data.length) {
    tbody.innerHTML = `<tr class="empty"><td colspan="3">Your log is empty. Add an item to get started!</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map((r,i)=>`
    <tr>
      <td>${r.item}</td>
      <td>${r.dairy ? 'Yes' : 'No'}</td>
      <td><button class="ghost" data-i="${i}" style="padding:6px 10px;border-radius:10px">Remove</button></td>
    </tr>
  `).join('');
}
render();

/***** 6) ADD ENTRY *****/
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const {date, time} = stamp(new Date());
  const rows = read();
  rows.unshift({ item: text, dairy: !!dairyBox.checked, date, time });
  write(rows);
  render();
  form.reset();
  input.focus();
});

/***** 7) REMOVE SINGLE ENTRY *****/
tbody.addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-i]');
  if (!btn) return;
  const i = Number(btn.dataset.i);
  const rows = read();
  rows.splice(i,1);
  write(rows);
  render();
});

/***** 8) EXPORT CSV (date,time,item,dairy) *****/
function toCsv(rows){
  const header = 'date,time,item,dairy';
  const body = rows.map(r =>
    [r.date, r.time, `"${String(r.item||'').replace(/"/g,'""')}"`, r.dairy ? 'Yes':'No'].join(',')
  ).join('\n');
  return header + '\n' + body + '\n';
}
document.getElementById('btnExport')?.addEventListener('click', ()=>{
  const csv = toCsv(read());
  const url = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `McFattys_${new Date().toISOString().slice(0,10)}.csv`
  });
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

/***** 9) CLEAR ALL *****/
document.getElementById('btnClear')?.addEventListener('click', ()=>{
  if (!confirm('Delete all items in the log')) return;
  write([]); render();
});
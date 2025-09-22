// Storage
const KEY = 'mcfattys_entries';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const write = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

// Helpers
const pad = (n) => String(n).padStart(2,'0');
const nowParts = () => {
  const d = new Date();
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,      // YYYY-MM-DD
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`  // HH:MM:SS
  };
};

// Render
const tbody = document.getElementById('rows');
function render(){
  const data = read();
  tbody.innerHTML = data.map((r, i) => `
    <tr>
      <td>${r.date}</td>
      <td>${r.time}</td>
      <td>${r.meal||''}</td>
      <td>${r.item||''}</td>
      <td>${r.qty||''}</td>
      <td>${r.cal||''}</td>
      <td><button data-i="${i}" class="del btn btn-ghost" style="padding:.3rem .6rem">✕</button></td>
    </tr>
  `).join('');
}
render();

// Add entry
document.getElementById('entryForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const {date, time} = nowParts();
  const row = {
    date, time,
    meal: document.getElementById('meal').value,
    item: document.getElementById('item').value.trim(),
    qty : document.getElementById('qty').value.trim(),
    cal : document.getElementById('cal').value.trim()
  };
  if (!row.item) return;
  const data = read();
  data.unshift(row);
  write(data);
  render();
  e.target.reset();
});

// Delete entry
tbody.addEventListener('click', (e)=>{
  const btn = e.target.closest('.del');
  if (!btn) return;
  const i = Number(btn.dataset.i);
  const data = read();
  data.splice(i,1);
  write(data);
  render();
});

// CSV export
function toCsv(rows){
  const cols = ['date','time','meal','item','qty','cal'];
  const header = cols.join(',');
  const body = rows.map(r => cols.map(k => `"${String(r[k]??'').replace(/"/g,'""')}"`).join(',')).join('\n');
  return header + '\n' + body + '\n';
}
document.getElementById('exportCsv')?.addEventListener('click', ()=>{
  const csv = toCsv(read());
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `McFattys_${new Date().toISOString().slice(0,10)}.csv`
  });
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

// Export to Google Sheet (via Apps Script webhook)
const SCRIPT_URL = ''; // <-- paste your Web App URL here (see steps below)

async function postJSON(url, payload){
  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json().catch(()=> ({}));
}

document.getElementById('exportSheet')?.addEventListener('click', async ()=>{
  if (!SCRIPT_URL) { alert('Add your Apps Script Web App URL in app.js (SCRIPT_URL).'); return; }
  const rows = read();
  if (!rows.length) { alert('No entries to export.'); return; }

  // Send all rows at once; script will append to the sheet.
  try {
    await postJSON(SCRIPT_URL, { rows });
    alert('Exported to Google Sheet.');
  } catch (err) {
    alert('Export failed. Check SCRIPT_URL and script permissions.');
    console.error(err);
  }
});
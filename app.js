// --- PWA install prompt ---
let deferredPrompt;
const btnInstall = document.getElementById('btnInstall');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (btnInstall) btnInstall.hidden = false;
});

btnInstall?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  btnInstall.hidden = true;
});

// --- Simple data gateway you likely already have ---
function readEntries(){
  try { return JSON.parse(localStorage.getItem('mcfattys_entries') || '[]'); }
  catch { return []; }
}
function writeEntries(arr){
  localStorage.setItem('mcfattys_entries', JSON.stringify(arr));
}

// --- CSV export ---
function toCsv(rows){
  if (!rows.length) return 'date,meal,item,qty,calories\n';
  const header = Object.keys(rows[0]).join(',');
  const body = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  return header + '\n' + body + '\n';
}
document.getElementById('btnExport')?.addEventListener('click', () => {
  const data = readEntries();
  const csv = toCsv(data);
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const stamp = new Date().toISOString().slice(0,10);
  a.download = `McFattys_${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// --- CSV import ---
document.getElementById('fileImport')?.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
  const headers = headerLine.split(',').map(h => h.replace(/^"|"$/g,''));
  const rows = lines.map(line => {
    // naive CSV parsing for quoted fields
    const parts = [];
    let cur = '', inQ = false;
    for (let i=0;i<line.length;i++){
      const ch = line[i];
      if (ch === '"' && line[i+1] === '"'){ cur += '"'; i++; continue; }
      if (ch === '"'){ inQ = !inQ; continue; }
      if (ch === ',' && !inQ){ parts.push(cur); cur=''; continue; }
      cur += ch;
    }
    parts.push(cur);
    const obj = {};
    headers.forEach((h,idx) => obj[h] = parts[idx] ?? '');
    return obj;
  });
  const current = readEntries();
  writeEntries([...current, ...rows]);
  alert('Import complete');
  e.target.value = '';
});

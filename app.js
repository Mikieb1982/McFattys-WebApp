// --- Simple in-memory+localStorage model ---
function readEntries(){ try { return JSON.parse(localStorage.getItem('mcfattys_entries')||'[]'); } catch { return []; } }
function writeEntries(arr){ localStorage.setItem('mcfattys_entries', JSON.stringify(arr)); }

// --- Minimal UI wiring so it works out of the box ---
const tbody = document.querySelector('#entriesTable tbody');
function render(){
  const rows = readEntries();
  tbody.innerHTML = rows.map(r => `
    <tr class="border-t border-white/10">
      <td class="py-2">${r.date||''}</td>
      <td>${r.meal||''}</td>
      <td>${r.item||''}</td>
      <td>${r.qty||''}</td>
      <td>${r.calories||''}</td>
    </tr>`).join('');
}
document.getElementById('entryForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const row = {
    date: document.getElementById('date').value,
    meal: document.getElementById('meal').value,
    item: document.getElementById('item').value,
    qty: document.getElementById('qty').value,
    calories: document.getElementById('calories').value
  };
  const data = readEntries(); data.unshift(row); writeEntries(data); render(); e.target.reset();
});
render();

// --- CSV export/import ---
function toCsv(rows){
  if (!rows.length) return 'date,meal,item,qty,calories\n';
  const header = Object.keys(rows[0]).join(',');
  const body = rows.map(r => Object.values(r).map(v => `"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
  return header + '\n' + body + '\n';
}
document.getElementById('btnExport')?.addEventListener('click', ()=>{
  const csv = toCsv(readEntries());
  const url = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  const a = Object.assign(document.createElement('a'), { href:url, download:`McFattys_${new Date().toISOString().slice(0,10)}.csv` });
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});
document.getElementById('fileImport')?.addEventListener('change', async (e)=>{
  const f = e.target.files?.[0]; if(!f) return;
  const text = await f.text();
  const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
  const headers = headerLine.split(',').map(h=>h.replace(/^"|"$/g,''));
  const rows = lines.map(line=>{
    const parts=[]; let cur='', q=false;
    for(let i=0;i<line.length;i++){ const ch=line[i];
      if(ch==='"' && line[i+1]==='"'){cur+='"'; i++; continue;}
      if(ch==='"'){q=!q; continue;}
      if(ch===',' && !q){parts.push(cur); cur=''; continue;}
      cur+=ch;
    }
    parts.push(cur);
    const obj={}; headers.forEach((h,i)=>obj[h]=parts[i]??''); return obj;
  });
  writeEntries([...readEntries(), ...rows]); render(); e.target.value='';
});

// --- PWA install prompt ---
let deferredPrompt;
const btnInstall = document.getElementById('btnInstall');
window.addEventListener('beforeinstallprompt',(e)=>{ e.preventDefault(); deferredPrompt=e; if(btnInstall) btnInstall.hidden=false; });
btnInstall?.addEventListener('click', async ()=>{
  if(!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; btnInstall.hidden=true;
});

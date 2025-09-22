// storage
const KEY = 'mcfattys_entries';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)||'[]'); } catch { return []; } };
const write = arr => localStorage.setItem(KEY, JSON.stringify(arr));

// time helpers
const pad = n => String(n).padStart(2,'0');
const stamp = d => ({
  date: `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,
  time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
});

// render
const tbody = document.getElementById('rows');
function render(){
  const data = read();
  if (!data.length){
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

// add
document.getElementById('entryForm').addEventListener('submit', e=>{
  e.preventDefault();
  const txt = document.getElementById('item').value.trim();
  const dairy = document.getElementById('dairy').checked;
  if (!txt) return;
  const t = stamp(new Date());
  const rows = read();
  rows.unshift({ item: txt, dairy, date: t.date, time: t.time });
  write(rows);
  render();
  e.target.reset();
  document.getElementById('item').focus();
});

// remove
tbody.addEventListener('click', e=>{
  const i = e.target?.dataset?.i;
  if (i === undefined) return;
  const rows = read();
  rows.splice(Number(i),1);
  write(rows);
  render();
});

// clear all
document.getElementById('btnClear').addEventListener('click', ()=>{
  if (!confirm('Delete all items in the log')) return;
  write([]);
  render();
});

// export CSV (includes date and time, even if not shown)
function toCsv(rows){
  const header = 'date,time,item,dairy';
  const body = rows.map(r =>
    [r.date, r.time, `"${String(r.item).replace(/"/g,'""')}"`, r.dairy ? 'Yes' : 'No'].join(',')
  ).join('\n');
  return header + '\n' + body + '\n';
}
document.getElementById('btnExport').addEventListener('click', ()=>{
  const csv = toCsv(read());
  const url = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
  const a = Object.assign(document.createElement('a'), {
    href: url,
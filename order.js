const $=id=>document.getElementById(id);
function payload(table){
  const it=Cart.items(),tot=Cart.total();
  if(location.protocol.startsWith('http')){
    const u=new URL('waiter.html',location.href);
    u.searchParams.set('t',table||'-');u.searchParams.set('i',it.map(x=>[x.n,x.q,x.p].join('~')).join('|'));return u.href}
  return `Table ${table||'-'}\n`+it.map(x=>`${x.q} x ${x.n}`).join('\n')+`\nTotal: ${tot} MAD`}
function render(){
  const it=Cart.items();
  $('empty').hidden=it.length>0;$('order').hidden=it.length===0;
  $('list').innerHTML=it.map(x=>`<li data-n="${x.n}"><span class="nm">${x.n}</span><div class="qty"><button type="button" data-d="-1" aria-label="Remove one ${x.n}">−</button><output>${x.q}</output><button type="button" data-d="1" aria-label="Add one ${x.n}">+</button></div><span class="sub">${x.q*x.p} MAD</span></li>`).join('');
  $('total').textContent=Cart.total()+' MAD';
  if(!it.length)return;
  try{const qr=qrcode(0,'M');qr.addData(payload($('table').value.trim()));qr.make();$('qr').innerHTML=qr.createSvgTag({cellSize:6,margin:0,scalable:true})}
  catch(e){$('qr').textContent='Order too long for a QR code. Please remove a few drinks.'}
  $('mode').textContent=location.protocol.startsWith('http')?'Scanning opens the order on the waiter\u2019s phone.':'Scanning shows the order as text on the waiter\u2019s phone.';
}
$('list').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  const li=b.closest('li'),n=li.dataset.n,x=Cart.items().find(i=>i.n===n);Cart.set(n,x.p,Math.min(20,x.q+ +b.dataset.d));render()});
$('table').addEventListener('input',render);
$('clear').addEventListener('click',()=>{Cart.clear();render()});
render();Cart.sync();

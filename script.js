// Split the title into letters for the entrance animation
const t=document.getElementById('title');
t.innerHTML=[...t.textContent].map((c,i)=>c===' '?'<span class="sp"> </span>':`<span style="animation-delay:${i*60}ms">${c}</span>`).join('');
// Reveal cards when they scroll into view
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.card').forEach((c,i)=>{c.style.transitionDelay=(i%4)*80+'ms';io.observe(c)});
// 3D tilt that follows the mouse
document.querySelectorAll('.card').forEach(c=>{
  c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    c.style.transition='transform .1s';c.style.transform=`perspective(700px) rotateX(${-y*10}deg) rotateY(${x*12}deg) translateY(-4px)`});
  c.addEventListener('mouseleave',()=>{c.style.transition='transform .5s';c.style.transform=''});
});
// Fade out before switching pages
document.querySelectorAll('nav a,.next').forEach(a=>a.addEventListener('click',e=>{
  if(a.classList.contains('active'))return;e.preventDefault();document.body.classList.add('leaving');setTimeout(()=>location.href=a.href,280)}));
// ---- Ordering ----
const bar=document.createElement('a');bar.className='cartbar';bar.href='order.html';document.body.append(bar);
function refreshBar(){const c=Cart.count();bar.classList.toggle('show',c>0);bar.innerHTML=`<b>${c}</b> ${c===1?'drink':'drinks'} · ${Cart.total()} MAD <span>Confirm order</span>`;Cart.sync()}
document.querySelectorAll('.card').forEach(card=>{
  const out=card.querySelector('output'),name=card.dataset.name,price=+card.dataset.price;
  out.textContent=(Cart.load()[name]||{q:0}).q;
  card.querySelectorAll('.qty button').forEach(b=>b.addEventListener('click',()=>{
    const q=Math.max(0,Math.min(20,+out.textContent+ +b.dataset.d));
    out.textContent=q;Cart.set(name,price,q);card.classList.toggle('picked',q>0);
    out.classList.remove('pop');void out.offsetWidth;out.classList.add('pop');refreshBar()}));
  card.classList.toggle('picked',+out.textContent>0);
});
refreshBar();

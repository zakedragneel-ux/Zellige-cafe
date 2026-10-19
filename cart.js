// The order travels with the page links (?c=...), so it works everywhere: hosted online,
// opened from a folder, any browser. It is also backed up in window.name and localStorage.
const Cart={key:'zc-order',pre:'zc:',state:null,
 parse(c){const o={};String(c).split('|').filter(Boolean).forEach(r=>{const[n,q,p]=r.split('~');if(n&&+q>0)o[n]={p:+p,q:+q}});return o},
 read(){
  try{const c=new URLSearchParams(location.search).get('c');if(c!==null)return this.parse(c)}catch(e){}
  try{if(String(window.name).startsWith(this.pre))return JSON.parse(window.name.slice(this.pre.length))}catch(e){}
  try{return JSON.parse(localStorage.getItem(this.key))||{}}catch(e){return{}}},
 persist(){const s=JSON.stringify(this.state);
  try{window.name=this.pre+s}catch(e){}
  try{localStorage.setItem(this.key,s)}catch(e){}},
 load(){if(!this.state){this.state=this.read();this.persist()}return this.state},
 save(o){this.state=o;this.persist();this.sync()},
 enc(){return this.items().map(x=>[x.n,x.q,x.p].join('~')).join('|')},
 sync(){const e=this.enc();document.querySelectorAll('a[href]').forEach(a=>{
  const m=(a.getAttribute('href')||'').match(/^(index|cold|order)\.html/);
  if(m)a.setAttribute('href',m[1]+'.html'+(e?'?c='+encodeURIComponent(e):''))})},
 set(name,price,q){const o=this.load();if(q<=0)delete o[name];else o[name]={p:price,q};this.save(o);return o},
 items(){return Object.entries(this.load()).map(([n,v])=>({n,p:v.p,q:v.q}))},
 count(){return this.items().reduce((a,i)=>a+i.q,0)},
 total(){return this.items().reduce((a,i)=>a+i.q*i.p,0)},
 clear(){this.save({})}};

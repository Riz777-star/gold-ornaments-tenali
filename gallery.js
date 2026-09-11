(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let photos=[],saved=[],category='All',query='',savedOnly=false,page=1;
  const size=16;
  try{const stored=JSON.parse(localStorage.getItem('bg-photo-favourites')||'[]');if(Array.isArray(stored))saved=stored.filter(x=>typeof x==='string');}catch{}
  function render(){
    const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const rows=photos.filter(p=>(category==='All'||p.category===category)&&(!savedOnly||saved.includes(p.id))&&words.every(word=>[p.title,p.category,p.brand,p.id,p.style||''].join(' ').toLowerCase().includes(word)));
    const pages=Math.max(1,Math.ceil(rows.length/size));page=Math.max(1,Math.min(page,pages));
    $('photo-result-count').textContent=rows.length+' picture'+(rows.length===1?'':'s');$('photo-saved-count').textContent=saved.length;
    $('photo-page').textContent=`${page} / ${pages}`;$('photo-prev').disabled=page===1;$('photo-next').disabled=page===pages;
    document.querySelectorAll('[data-photo-category]').forEach(button=>{const active=button.dataset.photoCategory===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    const grid=$('photo-grid');grid.replaceChildren();
    for(const item of rows.slice((page-1)*size,page*size)){
      const card=document.createElement('article');card.className='photo-card';const isSaved=saved.includes(item.id);
      card.innerHTML=`<div class="photo-image-wrap"><button class="photo-open" aria-label="Enlarge ${esc(item.title)}"><img src="${esc(item.thumbnail||item.image)}" alt="${esc(item.title)} — ${esc(item.brand)} catalogue photograph" loading="lazy" decoding="async" width="800" height="900"><span class="photo-zoom" aria-hidden="true">＋</span></button><button class="photo-heart" aria-label="${isSaved?'Unsave':'Save'} ${esc(item.title)} ${esc(item.id)}" aria-pressed="${isSaved}">${isSaved?'♥':'♡'}</button></div><div class="photo-caption"><h3>${esc(item.title)}</h3><span>${esc(item.brand)} · reference</span></div>`;
      card.querySelector('.photo-open').onclick=()=>showPhoto(item);
      card.querySelector('img').onerror=event=>{event.target.hidden=true;card.querySelector('.photo-zoom').textContent='Image unavailable';};
      card.querySelector('.photo-heart').onclick=()=>{saved=isSaved?saved.filter(id=>id!==item.id):[...saved,item.id];try{localStorage.setItem('bg-photo-favourites',JSON.stringify(saved));}catch{$('photo-storage-note').textContent='Favourites are saved for this visit only.';}render();const button=[...grid.querySelectorAll('.photo-heart')].find(b=>b.getAttribute('aria-label').endsWith(item.id));button?.focus({preventScroll:true});};grid.append(card);
    }
    if(!rows.length){grid.innerHTML='<div class="photo-empty"><h3>No pictures match yet.</h3><p>Try a different category or clear your search.</p><button class="button outline">Show all pictures</button></div>';grid.querySelector('button').onclick=()=>{category='All';query='';savedOnly=false;page=1;$('photo-search').value='';$('photo-saved').checked=false;render();};}
  }
  function showPhoto(item){
    const sourceCredit=item.brand+(item.page?' · catalogue page '+item.page:' · design reference');
    const dialog=$('detail-dialog');dialog.classList.add('photo-dialog');
    $('detail-content').innerHTML=`<div class="photo-detail"><div class="photo-detail-image"><img src="${esc(item.image)}" alt="${esc(item.title)}"></div><div class="photo-detail-copy"><p class="eyebrow">${esc(item.category)}</p><h2>${esc(item.title)}</h2><p class="photo-credit">${esc(sourceCredit)}</p><p>Like this style? Bring the reference into a personal design conversation.</p><p class="photo-small">External design reference. Availability, materials and what can be made are confirmed by the jeweller.</p><button id="photo-enquire" class="button gold">Enquire about this style ↗</button></div></div>`;
    $('photo-enquire').onclick=()=>{dialog.close();const map={Necklaces:'Necklace',Bangles:'Bangles',Earrings:'Earrings',Rings:'Ring','Bridal sets':'Bridal jewellery','Hair ornaments':'Hair ornament',Armlets:'Armlet / vanki','Waist belts':'Waist belt',Pendants:'Pendant',Bracelets:'Bracelet',Chains:'Chain',Mangalsutras:'Mangalsutra'};$('piece').value=map[item.category]||'Other ornament';document.querySelector('input[name="purity"][value="Need guidance"]').checked=true;const reference=`Interested in: ${item.title} (${item.id})\nReference: ${sourceCredit}\nPlease discuss suitable materials and a personal design.`;const existing=$('details').value.trim();$('details').value=(reference+(existing?'\n\n'+existing:'')).slice(0,1000);updateSummary();$('custom').scrollIntoView({behavior:'smooth'});$('details').focus({preventScroll:true});};dialog.showModal();
  }
  $('photo-search').oninput=event=>{query=event.target.value;page=1;render();};$('photo-saved').onchange=event=>{savedOnly=event.target.checked;page=1;render();};
  for(const [id,direction] of [['photo-prev',-1],['photo-next',1]])$(id).onclick=()=>{page+=direction;render();$('photo-result-count').focus({preventScroll:true});$('photo-filters').scrollIntoView({behavior:'smooth',block:'start'});};
  async function load(){try{const response=await fetch('gallery.json');if(!response.ok)throw Error('Gallery unavailable');const data=await response.json();if(!Array.isArray(data.items)||!data.items.length)throw Error('No images');photos=data.items;saved=saved.filter(id=>photos.some(p=>p.id===id));const filter=$('photo-filters');filter.replaceChildren();for(const value of ['All',...new Set(photos.map(p=>p.category))]){const button=document.createElement('button');button.dataset.photoCategory=value;const count=value==='All'?photos.length:photos.filter(p=>p.category===value).length;button.innerHTML=esc(value==='All'?'All jewellery':value)+' <span class="photo-category-count">'+count+'</span>';button.onclick=()=>{category=value;page=1;render();};filter.append(button);}$('photo-pagination').hidden=false;render();}catch{$('photo-result-count').textContent='Unable to load pictures.';$('photo-grid').innerHTML='<div class="photo-empty"><p>Please try loading the gallery again.</p><button id="photo-retry" class="button outline">Try again</button></div>';$('photo-retry').onclick=load;}}
  load();
})();

var ADMIN_PW='7204';

function ls(k,fb){try{var v=localStorage.getItem(k);return v!==null?JSON.parse(v):fb;}catch(e){return fb;}}

function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}

function getCustomArticles(){return ls('svh_articles',[]);}

function saveCustomArticles(a){lsSet('svh_articles',a);}

function getFolders(){return ls('svh_folders',['2025','2026']);}

function saveFolders(a){lsSet('svh_folders',a);}

function getRekorde(){return ls('svh_rekorde',defaultRekorde);}

function saveRekordData(d){lsSet('svh_rekorde',d);}

function getPageContent(k){return ls('svh_page_'+k,null);}

function savePageContent(k,v){lsSet('svh_page_'+k,v);}

function getSlideCount(){return ls('svh_slide_count',4);}

function escH(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function buildNewsGrids(){
  var all=getCustomArticles().concat(builtinArticles);
  var hg=document.getElementById('homeNewsGrid'),ag=document.getElementById('allNewsGrid');
  var hh='',ah='';
  for(var i=0;i<all.length;i++){var c=makeNewsCard(all[i],i===0);if(i<6)hh+=c;ah+=c;}
  if(hg)hg.innerHTML=hh;if(ag)ag.innerHTML=ah;
}

function showArticle(id){
  var all=getCustomArticles().concat(builtinArticles);
  var art=null;for(var i=0;i<all.length;i++){if(all[i].id===id){art=all[i];break;}}
  if(!art)return;
  document.getElementById('articleTitle').textContent=art.title;
  document.getElementById('articleBody').innerHTML=art.full;
  var hero=document.getElementById('articleHero'),ph=document.getElementById('articleImgPh');
  var ei=hero.querySelector('img.article-bg');if(ei)ei.remove();
  if(art.imgData){var img=document.createElement('img');img.className='article-bg';img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.45';hero.insertBefore(img,hero.firstChild);img.src=art.imgData;if(ph)ph.style.display='none';}
  else{if(ph)ph.style.display='flex';}
  showPage('article');var nn=document.getElementById('nav-news');if(nn)nn.classList.add('active');
}

function buildPersonGrid(people,containerId){
  var el=document.getElementById(containerId);if(!el)return;
  var html='';
  for(var i=0;i<people.length;i++){
    var p=people[i],name=typeof p==='string'?p:p.n,role=typeof p==='string'?'':p.r||'',email=typeof p==='object'&&p.e?p.e:'',slug='av-'+containerId+'-'+i;
    html+='<div class="person-card"><div class="person-avatar" id="'+slug+'"><span class="av-initials">'+initials(name)+'</span><input type="file" accept="image/*" onchange="uploadPersonImg(this,\''+slug+'\')" /></div><div class="person-name">'+name+'</div>'+(role?'<div class="person-role">'+role+'</div>':'')+(email?'<div class="person-email">'+email+'</div>':'')+'</div>';
  }
  el.innerHTML=html;
}

function renderRekordePage(){
  var data=getRekorde();
  ['lang','kurz'].forEach(function(type){
    var tbody=document.getElementById('rekord-page-'+type);if(!tbody)return;
    var html='';
    data[type].forEach(function(r){html+='<tr><td>'+escH(r.mName)+'</td><td>'+escH(r.mJg)+'</td><td style="font-weight:700">'+escH(r.mZeit)+'</td><td style="font-size:11px;color:var(--muted)">'+escH(r.mDatum||'')+'</td><td class="disc">'+escH(r.disc)+'</td><td style="font-size:11px;color:var(--muted)">'+escH(r.fDatum||'')+'</td><td style="font-weight:700">'+escH(r.fZeit)+'</td><td>'+escH(r.fJg)+'</td><td>'+escH(r.fName)+'</td></tr>';});
    tbody.innerHTML=html;
  });
}

function uploadHeroBg(input){if(!input.files[0])return;var r=new FileReader();r.onload=function(e){var img=document.getElementById('heroBgImg');if(img){img.src=e.target.result;img.style.display='block';}showHint();};r.readAsDataURL(input.files[0]);}

function uploadPersonImg(input,avatarId){if(!input.files[0])return;var r=new FileReader();r.onload=function(e){var av=document.getElementById(avatarId);if(!av)return;av.innerHTML='<img src="'+e.target.result+'" style="width:100%;height:100%;object-fit:cover"/><input type="file" accept="image/*" onchange="uploadPersonImg(this,\''+avatarId+'\')" />';showHint();};r.readAsDataURL(input.files[0]);}

function showHint(){var h=document.getElementById('uploadHint');h.classList.add('show');setTimeout(function(){h.classList.remove('show');},2000);}

var editablePages=[
  {key:'verein-text',label:'Der Verein – Text',field:'textarea'},
  {key:'jugend-text',label:'Jugend – Text',field:'textarea'},
  {key:'masters-text',label:'Masters – Text',field:'textarea'},
  {key:'kurse-text',label:'Schwimmkurse – Text',field:'textarea'},
  {key:'beitrag-tabelle',label:'Beitragsordnung',field:'beitrag'},
  {key:'termine-liste',label:'Termine',field:'termine'},
  {key:'impressum-text',label:'Impressum – Text',field:'textarea'}
];

// ── Init ──
// ── init ──
buildPersonGrid(vorstand,'pgVorstand');
buildPersonGrid(erweiterter,'pgErweiterter');
buildPersonGrid(trainers,'pgTrainer');
buildPersonGrid(kurstrainer,'pgKurstrainer');
buildNewsGrids();
renderFolderDropdowns();
renderRekordePage();

renderFolderDropdowns();
renderRekordePage();

// ════════════════════════════════════════════
//  AUTO-SYNC BILDER VON GITHUB
//  Läuft auf JEDEM Gerät – kein Token nötig
//  (Funktioniert nur bei öffentlichen Repositories)
// ════════════════════════════════════════════


(async function initImages(){
  // Slide labels zuerst (braucht kein Netzwerk)
  var savedLabels=ls('svh_slide_labels',null);
  if(savedLabels){
    for(var i=0;i<4;i++){
      var sl=document.getElementById('hs'+i);
      if(!sl||!savedLabels[i])continue;
      var lbl=sl.querySelector('.carousel-slide-label');
      if(lbl){
        var h2=lbl.querySelector('h2');var p=lbl.querySelector('p');
        if(h2)h2.textContent=savedLabels[i].title;
        if(p)p.textContent=savedLabels[i].sub;
      }
    }
  }
  restoreHeroBgBlur();
  // Page content
  var t=getPageContent('termine-liste');if(t)applyTermine(t);
  var b=getPageContent('beitrag-tabelle');if(b)applyBeitrag(b);

  // ── Bestimme GitHub Repo ──
  // Priorität: 1. localStorage (vom Admin gesetzt), 2. eingebettete Defaults
  var ghUser=localStorage.getItem('svh_gh_user')||'justni11';
  var ghRepo=localStorage.getItem('svh_gh_repo')||'Vereinswebseite';

  // ── Lokale Bilder aus localStorage ──
  var localHeroBg=ls('svh_hero_bg',null);
  var localSlideImgs=ls('svh_slide_imgs',{});
  var hasLocalImages=localHeroBg||(Object.keys(localSlideImgs).length>0);

  // ── Wenn lokale Bilder als GitHub-URL gespeichert – direkt anwenden ──
  function applyImages(heroBg, slideImgs){
    if(heroBg){
      var img=document.getElementById('heroBgImg');
      if(img){img.src=heroBg;img.style.display='block';}
      var ov=document.getElementById('heroBgOverlay');if(ov)ov.style.display='block';
      var hg=document.querySelector('.hero-grid');if(hg)hg.style.opacity='0';
    }
    var count=getSlideCount();
    for(var i=0;i<count;i++){
      if(!slideImgs[i])continue;
      var slide=document.getElementById('hs'+i);
      if(!slide)continue;
      var sImg=slide.querySelector('img.slide-img-bg');
      if(!sImg){
        sImg=document.createElement('img');
        sImg.className='slide-img-bg';
        sImg.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5';
        slide.insertBefore(sImg,slide.firstChild);
      }
      sImg.src=slideImgs[i];
    }
  }

  // Lokale Bilder sofort anwenden (schnell, kein Netzwerk)
  if(hasLocalImages){
    applyImages(localHeroBg, localSlideImgs);
  }

  // ── GitHub Sync: Dateien im bilder/ Ordner abrufen ──
  // Läuft immer – auch wenn lokale Bilder vorhanden (um aktuellste Version zu holen)
  try{
    var apiUrl='https://api.github.com/repos/'+ghUser+'/'+ghRepo+'/contents/bilder';
    var resp=await fetch(apiUrl,{headers:{'Accept':'application/vnd.github.v3+json'}});
    if(!resp.ok)return; // kein Repo / kein Ordner – still fail
    var files=await resp.json();
    if(!Array.isArray(files))return;

    // Bilde Map: Dateiname → raw URL
    var fileMap={};
    files.forEach(function(f){fileMap[f.name]=f.download_url;});

    // Hero Hintergrund: suche hero-bg.*
    var heroUrl=null;
    Object.keys(fileMap).forEach(function(name){
      if(name.startsWith('hero-bg.'))heroUrl=fileMap[name];
    });

    // Slides: suche slide-0.*, slide-1.*, ...
    var ghSlideImgs={};
    var count=getSlideCount();
    for(var i=0;i<count+4;i++){
      Object.keys(fileMap).forEach(function(name){
        if(name.startsWith('slide-'+i+'.'))ghSlideImgs[i]=fileMap[name];
      });
    }

    // Nur updaten wenn GitHub neuere/andere Bilder hat
    var changed=false;
    if(heroUrl&&heroUrl!==localHeroBg){lsSet('svh_hero_bg',heroUrl);changed=true;}
    Object.keys(ghSlideImgs).forEach(function(idx){
      if(ghSlideImgs[idx]!==localSlideImgs[idx]){
        var imgs=ls('svh_slide_imgs',{});imgs[idx]=ghSlideImgs[idx];lsSet('svh_slide_imgs',imgs);
        localSlideImgs[idx]=ghSlideImgs[idx];changed=true;
      }
    });

    // Anwenden wenn sich etwas geändert hat oder keine lokalen Bilder da waren
    if(changed||!hasLocalImages){
      applyImages(heroUrl||localHeroBg, localSlideImgs);
    }

    // Auch Artikel-Bilder aus GitHub holen und localStorage aktualisieren
    var customs=getCustomArticles();
    var artChanged=false;
    customs.forEach(function(art){
      Object.keys(fileMap).forEach(function(name){
        // Artikel-Bilder heißen "artikel-TIMESTAMP.ext"
        if(name.startsWith('artikel-')&&art.imgData&&art.imgData.includes(name.replace(/\.[^.]+$/,''))){
          if(art.imgData!==fileMap[name]){art.imgData=fileMap[name];artChanged=true;}
        }
      });
    });
    if(artChanged){saveCustomArticles(customs);buildNewsGrids();}

  }catch(e){
    // Netzwerkfehler – lokale Bilder wurden schon angewendet, kein Problem
  }

  // Admin-Status
  if(localStorage.getItem('svh_admin')==='1'){
    var ph=document.getElementById('heroBgPh');if(ph)ph.style.display='flex';
  }

  // Slide-Count aus localStorage wiederherstellen und extra Slides bauen
  var savedCount=getSlideCount();
  totalSlides=savedCount;
  if(savedCount>4){
    var track=document.getElementById('heroSlider');
    var dots=document.getElementById('sDots');
    var initLabels=ls('svh_slide_labels',null)||[];
    for(var si=4;si<savedCount;si++){
      var slEl=document.createElement('div');
      slEl.className='carousel-slide';slEl.id='hs'+si;
      var lblI=initLabels[si]||{title:'Slide '+(si+1),sub:''};
      slEl.innerHTML='<div class="carousel-slide-label"><h2>'+lblI.title+'</h2><p>'+lblI.sub+'</p></div>';
      track.appendChild(slEl);
      var dotEl=document.createElement('button');dotEl.className='c-dot';
      dotEl.setAttribute('onclick','goSlide('+si+')');dots.appendChild(dotEl);
    }
  }
})();

// ── event listeners ──
(function(){
  document.querySelectorAll('.drop > .nav-a').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var menu=btn.nextElementSibling;if(!menu)return;
      var wasOpen=menu.classList.contains('open');
      document.querySelectorAll('.drop-menu.open').forEach(function(m){m.classList.remove('open');});
      if(!wasOpen) menu.classList.add('open');
    });
  });
  document.addEventListener('click',function(){document.querySelectorAll('.drop-menu.open').forEach(function(m){m.classList.remove('open');});});
  var hb=document.getElementById('hamburgerBtn');if(hb)hb.addEventListener('click',function(e){e.stopPropagation();toggleMobileMenu();});
  var pw=document.getElementById('pwInput');if(pw)pw.addEventListener('keydown',function(e){if(e.key==='Enter')checkLogin();});
})();

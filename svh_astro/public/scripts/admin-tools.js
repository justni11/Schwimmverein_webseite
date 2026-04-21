var adminImgData=null;
var adminImgFile=null;
var panelIds=['apanel-articles','apanel-add','apanel-bilder','apanel-folders','apanel-pages','apanel-rekorde','apanel-info'];
var tabKeys=['articles','add','bilder','folders','pages','rekorde','info'];
var extraImgFiles=[];
var extraImgDatas=[];
var cropState={file:null,callback:null,canvas:null,selCanvas:null,ctx:null,selCtx:null,imgEl:null,scale:1,dragging:false,startX:0,startY:0,sel:{x:0,y:0,w:0,h:0}};

function openAdminLogin(){if(localStorage.getItem('svh_admin')==='1'){openAdminPanel();return;}document.getElementById('loginOverlay').classList.add('open');setTimeout(function(){var pw=document.getElementById('pwInput');if(pw)pw.focus();},100);}

function closeAdminLogin(){document.getElementById('loginOverlay').classList.remove('open');}

function checkLogin(){
  var pw=document.getElementById('pwInput').value;
  if(pw===ADMIN_PW){localStorage.setItem('svh_admin','1');closeAdminLogin();openAdminPanel();document.getElementById('pwInput').value='';document.getElementById('pwError').style.display='none';}
  else{document.getElementById('pwError').style.display='block';document.getElementById('pwInput').value='';document.getElementById('pwInput').focus();}
}

function openAdminPanel(){showPage('admin');renderAdminList();renderFolderDropdowns();renderFolders();renderPageEditorMenu();renderRekordEditor();renderBilderTab();var ph=document.getElementById('heroBgPh');if(ph)ph.style.display='flex';}

function logoutAdmin(){localStorage.removeItem('svh_admin');showPage('home');var ph=document.getElementById('heroBgPh');if(ph)ph.style.display='none';}

function switchAdminTab(tab){
  var idx=tabKeys.indexOf(tab);
  document.querySelectorAll('.admin-tab').forEach(function(t,i){t.classList.toggle('active',i===idx);});
  var panelIds=['apanel-articles','apanel-add','apanel-bilder','apanel-folders','apanel-pages','apanel-rekorde','apanel-info'];
  document.querySelectorAll('.admin-panel').forEach(function(p){p.classList.toggle('active',p.id===panelIds[idx]);});
  if(tab==='articles')renderAdminList();
  if(tab==='bilder'){renderBilderTab();restoreHeroBgBlur();}
  if(tab==='folders'){renderFolders();renderFolderDropdowns();}
  if(tab==='rekorde')renderRekordEditor();
  if(tab==='info')initGithubUI();
}

function renderAdminList(){
  var customs=getCustomArticles(),all=customs.concat(builtinArticles);
  var filter=document.getElementById('folderFilter'),sel=filter?filter.value:'';
  if(sel)all=all.filter(function(a){return(a.folder||'')==sel;});
  var cnt=document.getElementById('articleCount');if(cnt)cnt.textContent='('+all.length+' Artikel)';
  var el=document.getElementById('adminArticleList');if(!el)return;
  var html='';
  for(var i=0;i<all.length;i++){
    var art=all[i],isC=false;
    for(var j=0;j<customs.length;j++){if(customs[j].id===art.id){isC=true;break;}}
    html+='<div class="admin-article-item">'
      +'<div class="art-thumb">'+(art.imgData?'<img src="'+art.imgData+'"/>':'<div style="height:100%;display:flex;align-items:center;justify-content:center;font-size:18px">📰</div>')+'</div>'
      +'<div class="art-info"><div class="art-title">'+art.title+'</div><div class="art-date">'+(art.date||'Kein Datum')+(art.folder?' · 📁 '+art.folder:'')+(isC?' · <strong style="color:var(--blue2)">Eigener Artikel</strong>':'')+'</div></div>'
      +'<div style="display:flex;gap:6px;flex-shrink:0">'
      +(isC?'<button style="background:rgba(30,111,255,.1);border:1.5px solid var(--blue2);color:var(--blue2);padding:7px 12px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif" onclick="editArticle(\''+art.id+'\')">✏️ Bearbeiten</button>':'')
      +(isC?'<button class="btn-del" onclick="deleteArticle(\''+art.id+'\')">🗑 Löschen</button>':'<span style="font-size:11px;color:var(--text2);padding:4px 8px;background:var(--bg);border-radius:6px">Standard</span>')
      +'</div></div>';
  }
  el.innerHTML=html||'<p style="color:var(--text2);font-size:14px;padding:16px">Keine Artikel gefunden.</p>';
}

function renderFolderDropdowns(){
  var folders=getFolders(),ids=['folderFilter','af-folder'];
  for(var k=0;k<ids.length;k++){
    var sel=document.getElementById(ids[k]);if(!sel)continue;
    var cur=sel.value;
    var html=ids[k]==='folderFilter'?'<option value="">Alle Ordner</option>':'<option value="">Kein Ordner</option>';
    for(var i=0;i<folders.length;i++)html+='<option value="'+folders[i]+'"'+(cur===folders[i]?' selected':'')+'>'+folders[i]+'</option>';
    sel.innerHTML=html;
  }
}

function renderFolders(){
  var folders=getFolders(),el=document.getElementById('folderList');if(!el)return;
  var all=getCustomArticles().concat(builtinArticles),html='';
  for(var i=0;i<folders.length;i++){
    var f=folders[i],count=all.filter(function(a){return(a.folder||'')==f;}).length;
    html+='<div style="background:var(--card);border-radius:12px;padding:20px;box-shadow:var(--shadow);border:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px">'
      +'<div><div style="font-family:Bebas Neue,sans-serif;font-size:26px;color:#fff">📁 '+f+'</div><div style="font-size:12px;color:var(--text2);margin-top:2px">'+count+' Artikel</div></div>'
      +'<button class="btn-del" onclick="deleteFolder(\''+f+'\')">Löschen</button></div>';
  }
  el.innerHTML=html||'<p style="color:var(--text2);font-size:14px">Noch keine Ordner. Standard: 2025, 2026.</p>';
}

function createFolder(){
  var input=document.getElementById('folder-name-input'),name=(input.value||'').trim();
  if(!name){alert('Bitte Namen eingeben.');return;}
  var folders=getFolders();
  if(folders.indexOf(name)>-1){alert('Ordner existiert bereits.');return;}
  folders.push(name);folders.sort().reverse();saveFolders(folders);input.value='';renderFolders();renderFolderDropdowns();
}

function deleteFolder(name){
  if(!confirm('Ordner "'+name+'" löschen?'))return;
  saveFolders(getFolders().filter(function(f){return f!==name;}));renderFolders();renderFolderDropdowns();
}

function startNewArticle(){
  document.getElementById('af-edit-id').value='';
  document.getElementById('af-title').value='';
  document.getElementById('af-teaser').value='';
  document.getElementById('af-content').value='';
  document.getElementById('af-date').value='';
  document.getElementById('af-folder').value='';
  adminImgData=null;
  adminImgFile=null;
  resetExtraImgs();
  document.getElementById('af-img-placeholder').style.display='block';
  document.getElementById('af-img-preview').style.display='none';
  document.getElementById('af-error').style.display='none';
  document.getElementById('formTitle').textContent='Neuen Artikel erstellen';
  document.getElementById('formSubtitle').textContent='Fülle alle Pflichtfelder aus und klicke auf Veröffentlichen.';
  document.getElementById('af-submit-btn').textContent='Artikel veröffentlichen';
  switchAdminTab('add');
}

function cancelEdit(){switchAdminTab('articles');}

function editArticle(id){
  var customs=getCustomArticles(),art=null;
  for(var i=0;i<customs.length;i++){if(customs[i].id===id){art=customs[i];break;}}
  if(!art)return;
  document.getElementById('af-edit-id').value=id;
  document.getElementById('af-title').value=art.title||'';
  document.getElementById('af-teaser').value=art.teaser||'';
  var tmp=document.createElement('div');tmp.innerHTML=art.full||'';
  document.getElementById('af-content').value=tmp.innerText||tmp.textContent||'';
  if(art.date){var dp=(art.date||'').split('.');if(dp.length===3)document.getElementById('af-date').value=dp[2]+'-'+dp[1]+'-'+dp[0];else document.getElementById('af-date').value='';}
  document.getElementById('af-folder').value=art.folder||'';
  adminImgData=art.imgData||null;
  if(adminImgData){document.getElementById('af-img-placeholder').style.display='none';document.getElementById('af-img-preview').style.display='block';document.getElementById('af-img-preview-img').src=adminImgData;}
  else{document.getElementById('af-img-placeholder').style.display='block';document.getElementById('af-img-preview').style.display='none';}
  document.getElementById('af-error').style.display='none';
  document.getElementById('formTitle').textContent='Artikel bearbeiten';
  document.getElementById('formSubtitle').textContent='"'+art.title+'" – Änderungen vornehmen und speichern.';
  document.getElementById('af-submit-btn').textContent='Änderungen speichern';
  loadExtraImgsForEdit(art);
  // Restore content from HTML
  var txt=articleHtmlToText(art.full||'');
  if(txt)document.getElementById('af-content').value=txt;
  switchAdminTab('add');
}

function deleteArticle(id){
  if(!confirm('Artikel wirklich löschen?'))return;
  var c=getCustomArticles().filter(function(a){return a.id!==id;});
  saveCustomArticles(c);buildNewsGrids();renderAdminList();
}

async function publishArticle(){
  var title=document.getElementById('af-title').value.trim();
  var teaser=document.getElementById('af-teaser').value.trim();
  var content=document.getElementById('af-content').value.trim();
  var dateVal=document.getElementById('af-date').value;
  var folder=document.getElementById('af-folder').value;
  var editId=document.getElementById('af-edit-id').value;
  var errEl=document.getElementById('af-error');
  if(!title||!teaser||!content){errEl.textContent='Bitte Titel, Kurzbeschreibung und Inhalt ausfüllen.';errEl.style.display='block';return;}
  errEl.style.display='none';
  var dateStr=dateVal?new Date(dateVal).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'}):'';
  var fullHtml='<p>'+content.replace(/\n\n+/g,'</p><p>').replace(/\n/g,'<br/>')+'</p>';
  var customs=getCustomArticles();
  if(editId){
    for(var i=0;i<customs.length;i++){
      if(customs[i].id===editId){
        customs[i].title=title;customs[i].teaser=teaser;
        customs[i].full=buildArticleHtml(content,extraImgDatas)||fullHtml;
        customs[i].extraImgs=extraImgDatas.slice();
        customs[i].date=dateStr;customs[i].folder=folder;
        if(adminImgData)customs[i].imgData=adminImgData;break;
      }
    }
    saveCustomArticles(customs);buildNewsGrids();alert('Artikel "'+title+'" aktualisiert!');
  } else {
    customs.unshift({id:'custom-'+Date.now(),title:title,teaser:teaser,date:dateStr,folder:folder,full:fullHtml,imgData:adminImgData||null});
    saveCustomArticles(customs);buildNewsGrids();alert('Artikel "'+title+'" veröffentlicht!');
  }
  switchAdminTab('articles');
}

function clearCustomArticles(){lsSet('svh_articles',[]);buildNewsGrids();renderAdminList();alert('Eigene Artikel gelöscht.');}

function clearFolders(){lsSet('svh_folders',['2025','2026']);renderFolders();alert('Ordner zurückgesetzt.');}

function resetAll(){localStorage.clear();location.reload();}

function renderBilderTab(){
  var heroPrev=document.getElementById('admin-hero-preview');
  var heroBgImg=document.getElementById('heroBgImg');
  if(heroPrev&&heroBgImg&&heroBgImg.src&&heroBgImg.style.display!=='none'){
    heroPrev.innerHTML='<img src="'+heroBgImg.src+'" style="width:100%;height:100%;object-fit:cover"/>';
  }
  var list=document.getElementById('admin-slides-list');if(!list)return;
  var count=getSlideCount();
  var savedLabels=ls('svh_slide_labels',null)||JSON.parse(JSON.stringify(slideLabels));
  var slideImgs=ls('svh_slide_imgs',{});
  var html='<div style="display:flex;gap:8px;align-items:center;margin-bottom:18px;flex-wrap:wrap">'
    +'<span style="font-size:13px;color:var(--text2);font-weight:600">'+count+' Slides aktiv</span>'
    +'<button onclick="adminAddSlide()" style="background:rgba(30,111,255,.15);border:1px solid var(--border);color:var(--blue2);padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif">+ Slide hinzufügen</button>'
    +(count>1?'<button onclick="adminRemoveSlide()" style="background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.3);color:#f87171;padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif">− Letzten entfernen</button>':'')
    +'</div>';
  for(var i=0;i<count;i++){
    var hasImg=slideImgs[i]||null;
    var lbl=savedLabels[i]||(slideLabels[i]||{title:'Slide '+(i+1),sub:''});
    html+='<div style="background:var(--card2);border:1px solid var(--border);border-radius:14px;padding:20px;display:grid;grid-template-columns:180px 1fr;gap:20px;align-items:start;margin-bottom:12px">'
      +'<div><div style="width:100%;height:110px;border-radius:10px;overflow:hidden;background:linear-gradient(135deg,var(--navy3),var(--card2));margin-bottom:10px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center">'
      +(hasImg?'<img src="'+hasImg+'" style="width:100%;height:100%;object-fit:cover"/>':'<span style="font-size:11px;color:var(--muted)">Kein Bild</span>')
      +'</div>'
      +'<input type="file" accept="image/*" onchange="adminUploadSlide(this,'+i+')" style="font-size:11px;width:100%;font-family:Inter,sans-serif;color:var(--text2)"/>'
      +(hasImg?'<button onclick="adminRemoveSlideImg('+i+')" style="margin-top:6px;font-size:11px;color:#f87171;background:none;border:none;cursor:pointer;font-family:Inter,sans-serif">🗑 Bild entfernen</button>':'')
      +'</div>'
      +'<div><div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:10px;text-transform:uppercase;letter-spacing:.08em">Slide '+(i+1)+'</div>'
      +'<div class="form-field" style="margin-bottom:10px"><label>Titel</label><input type="text" id="slide-title-'+i+'" value="'+escH(lbl.title)+'" style="width:100%;padding:9px 12px;background:var(--navy2);border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:Inter,sans-serif;color:var(--text)"/></div>'
      +'<div class="form-field" style="margin-bottom:12px"><label>Untertitel</label><input type="text" id="slide-sub-'+i+'" value="'+escH(lbl.sub)+'" style="width:100%;padding:9px 12px;background:var(--navy2);border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:Inter,sans-serif;color:var(--text)"/></div>'
      +'<button onclick="adminSaveSlideLabel('+i+')" style="background:rgba(30,111,255,.15);border:1px solid var(--border);color:var(--blue2);padding:7px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif">💾 Speichern</button>'
      +'</div></div>';
  }
  list.innerHTML=html;
}

function adminSaveSlideLabel(idx){
  var title=document.getElementById('slide-title-'+idx);
  var sub=document.getElementById('slide-sub-'+idx);
  if(!title||!sub)return;
  var labels=ls('svh_slide_labels',null)||JSON.parse(JSON.stringify(slideLabels));
  labels[idx]={title:title.value,sub:sub.value};
  lsSet('svh_slide_labels',labels);
  // Apply to live slide label
  var sl=document.getElementById('hs'+idx);
  if(sl){
    var lbl=sl.querySelector('.hero-slide-label');
    if(lbl){lbl.querySelector('h2').textContent=title.value;lbl.querySelector('p').textContent=sub.value;}
  }
  showHint();
}

function renderPageEditorMenu(){
  var menu=document.getElementById('pageEditorMenu');if(!menu)return;
  var html='';
  for(var i=0;i<editablePages.length;i++){
    var pg=editablePages[i];
    html+='<div onclick="loadPageEditor(\''+pg.key+'\')" style="padding:12px 16px;cursor:pointer;font-size:13px;font-weight:500;color:var(--text2);border-bottom:1px solid var(--border);transition:.15s" onmouseover="this.style.background=\'var(--blue-light)\';this.style.color=\'var(--blue2)\'" onmouseout="this.style.background=\'\';this.style.color=\'var(--muted)\'">'+pg.label+'</div>';
  }
  menu.innerHTML=html;
}

function savePage(key){var area=document.getElementById('page-edit-area');if(!area)return;savePageContent(key,area.value.trim());applyPageContent(key,area.value.trim());alert('Gespeichert!');}

function applyPageContent(key,val){
  var map={'verein-text':'page-verein','jugend-text':'page-jugend','masters-text':'page-masters','kurse-text':'page-kurse','impressum-text':'page-impressum'};
  var pageId=map[key];if(!pageId)return;
  var pg=document.querySelector('#'+pageId+' .white-card');if(!pg)return;
  var paras=val.split(/\n\n+/);
  var btn=pg.querySelector('a.btn-primary');
  pg.innerHTML=paras.map(function(p){return '<p style="font-size:15px;line-height:1.85;color:var(--text2);margin-bottom:14px">'+escH(p.replace(/\n/g,' '))+'</p>';}).join('')+(btn?btn.outerHTML:'');
}

function applyTermine(termine){
  var list=document.querySelector('#page-termine .event-list');if(!list)return;
  var html='';
  for(var i=0;i<termine.length;i++){var t=termine[i];html+='<div class="event-item"><div class="event-date"><div class="event-day">'+t.day+'</div><div class="event-mon">'+t.mon+'</div></div><div class="event-info"><h4>'+t.title+'</h4><p>'+t.desc+'</p></div></div>';}
  list.innerHTML=html;
}

function applyBeitrag(rows){
  var table=document.querySelector('#page-beitragsordnung .styled-table');if(!table)return;
  var html='<tr><th>Kategorie</th><th>Jahresbeitrag</th></tr>';
  for(var i=0;i<rows.length;i++)html+='<tr><td>'+rows[i][0]+'</td><td><strong>'+rows[i][1]+(rows[i][1]==='frei'?'':' €,–')+'</strong></td></tr>';
  table.innerHTML=html;
}

function inputCell(v,ph){return '<td style="padding:3px"><input type="text" value="'+escH(v)+'" placeholder="'+escH(ph||'')+'" style="width:100%;padding:4px 6px;border:1.5px solid var(--border);border-radius:5px;font-size:12px;font-family:Inter,sans-serif"/></td>';}

function renderRekordEditor(){
  var data=getRekorde();
  renderRekordEditorTable(data.lang,'rekord-lang-body');
  renderRekordEditorTable(data.kurz,'rekord-kurz-body');
}

function renderRekordEditorTable(rows,bodyId){
  var tbody=document.getElementById(bodyId);if(!tbody)return;
  var html='';
  for(var i=0;i<rows.length;i++){
    var r=rows[i];
    html+='<tr>'+inputCell(r.mName,'Name')+inputCell(r.mJg,'Jg')+inputCell(r.mZeit,'Zeit')+inputCell(r.mDatum||'','TT.MM.JJ')+'<td style="padding:3px;background:rgba(42,128,25,.1)">'+inputCell(r.disc,'Disziplin')+'</td>'+inputCell(r.fDatum||'','TT.MM.JJ')+inputCell(r.fZeit,'Zeit')+inputCell(r.fJg,'Jg')+inputCell(r.fName,'Name')
      +'<td style="padding:3px;text-align:center"><button onclick="this.closest(\'tr\').remove()" style="color:#f87171;background:none;border:none;cursor:pointer;font-size:15px">🗑</button></td></tr>';
  }
  tbody.innerHTML=html;
}

function addRekordRow(type){
  var tbody=document.getElementById('rekord-'+type+'-body');if(!tbody)return;
  var tr=document.createElement('tr');
  tr.innerHTML=inputCell('','Name')+inputCell('','Jg')+inputCell('','Zeit')+inputCell('','TT.MM.JJ')+'<td style="padding:3px;background:rgba(42,128,25,.1)">'+inputCell('','Disziplin')+'</td>'+inputCell('','TT.MM.JJ')+inputCell('','Zeit')+inputCell('','Jg')+inputCell('','Name')+'<td style="padding:3px;text-align:center"><button onclick="this.closest(\'tr\').remove()" style="color:#f87171;background:none;border:none;cursor:pointer;font-size:15px">🗑</button></td>';
  tbody.appendChild(tr);
}

function collectRekordRows(bodyId){
  var tbody=document.getElementById(bodyId);if(!tbody)return[];
  var rows=[];
  tbody.querySelectorAll('tr').forEach(function(tr){var inp=tr.querySelectorAll('input');if(inp.length>=9)rows.push({mName:inp[0].value,mJg:inp[1].value,mZeit:inp[2].value,mDatum:inp[3].value,disc:inp[4].value,fDatum:inp[5].value,fZeit:inp[6].value,fJg:inp[7].value,fName:inp[8].value});});
  return rows;
}

function saveRekorde(){
  var data={lang:collectRekordRows('rekord-lang-body'),kurz:collectRekordRows('rekord-kurz-body')};
  saveRekordData(data);renderRekordePage();alert('Vereinsrekorde gespeichert und aktualisiert!');
}

function adminUploadHeroBg(input){
  if(!input.files[0])return;
  openCropModal(input.files[0],function(croppedFile){
    var r=new FileReader();
    r.onload=async function(e){
      var dataUrl=e.target.result;
      var img=document.getElementById('heroBgImg');
      if(img){img.src=dataUrl;img.style.display='block';}
      var ov=document.getElementById('heroBgOverlay');if(ov)ov.style.display='block';
      var hg=document.querySelector('.hero-grid');if(hg)hg.style.opacity='0';
      var prev=document.getElementById('admin-hero-preview');
      if(prev)prev.innerHTML='<img src="'+dataUrl+'" style="width:100%;height:100%;object-fit:cover"/>';
      if(ghConfigured()){
        showUploadProgress('⏳ Lade Bild zu GitHub hoch...');
        var path='bilder/hero-bg.'+fileExt(croppedFile);
        var url=await uploadToGithub(croppedFile,path);
        if(url){
          if(img)img.src=url;
          lsSet('svh_hero_bg',url);
          if(prev)prev.innerHTML='<img src="'+url+'" style="width:100%;height:100%;object-fit:cover"/>';
          hideUploadProgress();
        } else {
          lsSet('svh_hero_bg',dataUrl);
          showUploadProgress('⚠ GitHub Upload fehlgeschlagen – lokal gespeichert');
          setTimeout(function(){document.getElementById('uploadHint').classList.remove('show');},3000);
        }
      } else {
        lsSet('svh_hero_bg',dataUrl);
        showHint();
      }
    };
    r.readAsDataURL(croppedFile);
  });
}

function adminUploadSlide(input,idx){
  if(!input.files[0])return;
  openCropModal(input.files[0],function(croppedFile){
    var r=new FileReader();
    r.onload=async function(e){
      var dataUrl=e.target.result;
      var sl=document.getElementById('hs'+idx);
      if(sl){
        var sImg=sl.querySelector('img.slide-img-bg');
        if(!sImg){sImg=document.createElement('img');sImg.className='slide-img-bg';sImg.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5';sl.insertBefore(sImg,sl.firstChild);}
        sImg.src=dataUrl;
      }
      if(ghConfigured()){
        showUploadProgress('⏳ Lade Bild zu GitHub hoch...');
        var path='bilder/slide-'+idx+'.'+fileExt(croppedFile);
        var url=await uploadToGithub(croppedFile,path);
        if(url){
          if(sl){var si2=sl.querySelector('img.slide-img-bg');if(si2)si2.src=url;}
          var imgs=ls('svh_slide_imgs',{});imgs[idx]=url;lsSet('svh_slide_imgs',imgs);
          hideUploadProgress();
        } else {
          var imgs=ls('svh_slide_imgs',{});imgs[idx]=dataUrl;lsSet('svh_slide_imgs',imgs);
          showUploadProgress('⚠ GitHub Upload fehlgeschlagen – lokal gespeichert');
          setTimeout(function(){document.getElementById('uploadHint').classList.remove('show');},3000);
        }
      } else {
        var imgs=ls('svh_slide_imgs',{});imgs[idx]=dataUrl;lsSet('svh_slide_imgs',imgs);
        showHint();
      }
      renderBilderTab();
    };
    r.readAsDataURL(croppedFile);
  });
}

function previewAdminImg(input){
  if(!input.files[0])return;
  openCropModal(input.files[0],function(file){
    adminImgFile=file;
    var r=new FileReader();
    r.onload=function(e){
      adminImgData=e.target.result;
      document.getElementById('af-img-placeholder').style.display='none';
      document.getElementById('af-img-preview').style.display='block';
      document.getElementById('af-img-preview-img').src=e.target.result;
    };
    r.readAsDataURL(file);
  });
}

function openCropModal(file, callback){
  cropState.file=file; cropState.callback=callback;
  var modal=document.getElementById('cropModal');
  modal.classList.add('open');
  var canvas=document.getElementById('cropCanvas');
  var selCanvas=document.getElementById('cropSelection');
  cropState.canvas=canvas; cropState.selCanvas=selCanvas;
  cropState.ctx=canvas.getContext('2d');
  cropState.selCtx=selCanvas.getContext('2d');
  var reader=new FileReader();
  reader.onload=function(e){
    var img=new Image();
    img.onload=function(){
      cropState.imgEl=img;
      var maxW=Math.min(window.innerWidth*0.85,900);
      var maxH=window.innerHeight*0.65;
      var scale=Math.min(maxW/img.width,maxH/img.height,1);
      cropState.scale=scale;
      canvas.width=Math.round(img.width*scale);
      canvas.height=Math.round(img.height*scale);
      selCanvas.width=canvas.width; selCanvas.height=canvas.height;
      selCanvas.style.width=canvas.width+'px'; selCanvas.style.height=canvas.height+'px';
      cropState.ctx.drawImage(img,0,0,canvas.width,canvas.height);
      cropState.sel={x:0,y:0,w:0,h:0};
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);

  // Mouse events
  var sc=selCanvas;
  sc.onmousedown=sc.ontouchstart=function(e){
    e.preventDefault();
    var rect=sc.getBoundingClientRect();
    var clientX=e.touches?e.touches[0].clientX:e.clientX;
    var clientY=e.touches?e.touches[0].clientY:e.clientY;
    cropState.dragging=true;
    cropState.startX=clientX-rect.left;
    cropState.startY=clientY-rect.top;
    cropState.sel={x:cropState.startX,y:cropState.startY,w:0,h:0};
  };
  sc.onmousemove=sc.ontouchmove=function(e){
    if(!cropState.dragging)return;
    e.preventDefault();
    var rect=sc.getBoundingClientRect();
    var clientX=e.touches?e.touches[0].clientX:e.clientX;
    var clientY=e.touches?e.touches[0].clientY:e.clientY;
    var x=clientX-rect.left, y=clientY-rect.top;
    cropState.sel.w=x-cropState.startX;
    cropState.sel.h=y-cropState.startY;
    drawCropSelection();
  };
  sc.onmouseup=sc.ontouchend=function(){cropState.dragging=false;};
}

function drawCropSelection(){
  var sc=cropState.selCtx, sw=cropState.selCanvas.width, sh=cropState.selCanvas.height;
  sc.clearRect(0,0,sw,sh);
  var sel=cropState.sel;
  if(Math.abs(sel.w)<4||Math.abs(sel.h)<4)return;
  // Darken outside
  sc.fillStyle='rgba(0,0,0,.5)';sc.fillRect(0,0,sw,sh);
  // Clear selection area
  sc.clearRect(sel.x,sel.y,sel.w,sel.h);
  // Border
  sc.strokeStyle='rgba(255,255,255,.9)';sc.lineWidth=2;sc.setLineDash([6,3]);
  sc.strokeRect(sel.x,sel.y,sel.w,sel.h);
  sc.setLineDash([]);
}

function cropConfirm(){
  var sel=cropState.sel;
  var scale=cropState.scale;
  var out=document.createElement('canvas');
  if(Math.abs(sel.w)>4&&Math.abs(sel.h)>4){
    var sx=Math.min(sel.x,sel.x+sel.w)/scale;
    var sy=Math.min(sel.y,sel.y+sel.h)/scale;
    var sw=Math.abs(sel.w)/scale;
    var sh=Math.abs(sel.h)/scale;
    out.width=Math.round(sw); out.height=Math.round(sh);
    out.getContext('2d').drawImage(cropState.imgEl,sx,sy,sw,sh,0,0,out.width,out.height);
  } else {
    // No selection – use full image
    out.width=cropState.imgEl.width; out.height=cropState.imgEl.height;
    out.getContext('2d').drawImage(cropState.imgEl,0,0);
  }
  out.toBlob(function(blob){
    var file=new File([blob],(cropState.file.name||'crop.jpg'),{type:'image/jpeg'});
    closeCropModal();
    if(cropState.callback)cropState.callback(file);
  },'image/jpeg',0.92);
}

function cropUseOriginal(){
  var file=cropState.file, cb=cropState.callback;
  closeCropModal();
  if(cb)cb(file);
}

function cropCancel(){closeCropModal();}

function closeCropModal(){
  var modal=document.getElementById('cropModal');
  modal.classList.remove('open');
  cropState.sel={x:0,y:0,w:0,h:0};
  var sc=cropState.selCanvas;
  if(sc)cropState.selCtx.clearRect(0,0,sc.width,sc.height);
}

function addExtraImgSlot(){
  if(extraImgFiles.length>=8){alert('Maximum 8 zusätzliche Fotos.');return;}
  var idx=extraImgFiles.length;
  extraImgFiles.push(null);
  extraImgDatas.push(null);
  var container=document.getElementById('af-extra-imgs');
  var div=document.createElement('div');
  div.id='extra-img-slot-'+idx;
  div.style.cssText='display:flex;gap:10px;align-items:center;background:var(--card2);border:1px solid var(--border);border-radius:10px;padding:12px;';
  div.innerHTML='<div id="extra-prev-'+idx+'" style="width:80px;height:45px;border-radius:6px;background:var(--card);border:1px solid var(--border);overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center"><span style="font-size:10px;color:var(--muted)">[[FOTO_'+(idx+1)+']]</span></div>'
    +'<div style="flex:1"><div style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:6px">Foto '+(idx+1)+' <span style="color:var(--muted);font-weight:400">→ im Text: [[FOTO_'+(idx+1)+']]</span></div>'
    +'<input type="file" accept="image/*" onchange="handleExtraImg(this,'+idx+')" style="font-size:12px;font-family:Inter,sans-serif;color:var(--text2);width:100%"/></div>'
    +'<button onclick="removeExtraImgSlot('+idx+')" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:18px;flex-shrink:0">🗑</button>';
  container.appendChild(div);
}

function handleExtraImg(input, idx){
  if(!input.files[0])return;
  openCropModal(input.files[0], function(file){
    extraImgFiles[idx]=file;
    var r=new FileReader();
    r.onload=function(e){
      extraImgDatas[idx]=e.target.result;
      var prev=document.getElementById('extra-prev-'+idx);
      if(prev)prev.innerHTML='<img src="'+e.target.result+'" style="width:100%;height:100%;object-fit:cover"/>';
    };
    r.readAsDataURL(file);
  });
}

function removeExtraImgSlot(idx){
  extraImgFiles[idx]=null;
  extraImgDatas[idx]=null;
  var slot=document.getElementById('extra-img-slot-'+idx);
  if(slot)slot.remove();
}

function resetExtraImgs(){
  extraImgFiles=[];extraImgDatas=[];
  var c=document.getElementById('af-extra-imgs');
  if(c)c.innerHTML='';
}

function loadExtraImgsForEdit(art){
  resetExtraImgs();
  if(!art.extraImgs||!art.extraImgs.length)return;
  for(var i=0;i<art.extraImgs.length;i++){
    addExtraImgSlot();
    extraImgDatas[i]=art.extraImgs[i]||null;
    if(extraImgDatas[i]){
      var prev=document.getElementById('extra-prev-'+i);
      if(prev)prev.innerHTML='<img src="'+extraImgDatas[i]+'" style="width:100%;height:100%;object-fit:cover"/>';
    }
  }
}

function buildArticleHtml(content, extraImgs){
  var paras=content.split(/\n\n+/);
  var html='';
  paras.forEach(function(p){
    // Check if paragraph is a [[FOTO_N]] placeholder
    var m=p.trim().match(/^\[\[FOTO_(\d+)\]\]$/i);
    if(m){
      var imgIdx=parseInt(m[1])-1;
      var src=extraImgs&&extraImgs[imgIdx]?extraImgs[imgIdx]:null;
      if(src){
        html+='<div class="art-img-block"><img src="'+src+'"/></div>';
      }
    } else {
      html+='<p>'+p.replace(/\n/g,'<br/>')+'</p>';
    }
  });
  return html;
}

function articleHtmlToText(html){
  var tmp=document.createElement('div');tmp.innerHTML=html||'';
  // Convert art-img-block back to [[FOTO_N]] placeholder
  var imgBlocks=tmp.querySelectorAll('.art-img-block');
  var imgIdx=0;
  imgBlocks.forEach(function(b){
    var ph=document.createElement('p');
    ph.textContent='[[FOTO_'+(++imgIdx)+']]';
    b.parentNode.replaceChild(ph,b);
  });
  return tmp.innerText||tmp.textContent||'';
}

function setHeroBgBlur(val){
  var img=document.getElementById('heroBgImg');
  if(img)img.style.filter=val>0?'blur('+val+'px)':'';
  var lbl=document.getElementById('heroBgBlurVal');
  if(lbl)lbl.textContent=val;
  lsSet('svh_hero_blur',parseInt(val));
}

function restoreHeroBgBlur(){
  var val=ls('svh_hero_blur',0);
  var slider=document.getElementById('heroBgBlurSlider');
  if(slider)slider.value=val||0;
  if(val)setHeroBgBlur(val);
  // Show overlay if bg image exists
  var img=document.getElementById('heroBgImg');
  if(img&&img.src&&img.style.display!=='none'){var ov=document.getElementById('heroBgOverlay');if(ov)ov.style.display='block';}
}

function getGhSettings(){return{user:localStorage.getItem('svh_gh_user')||'',repo:localStorage.getItem('svh_gh_repo')||'',token:localStorage.getItem('svh_gh_token')||''};}

function ghConfigured(){var s=getGhSettings();return !!(s.user&&s.repo&&s.token);}

function saveGithubSettings(){
  var user=(document.getElementById('gh-user').value||'').trim();
  var repo=(document.getElementById('gh-repo').value||'').trim();
  var token=(document.getElementById('gh-token').value||'').trim();
  if(!user||!repo||!token){setGhStatus('error','Bitte alle drei Felder ausfüllen.');return;}
  localStorage.setItem('svh_gh_user',user);
  localStorage.setItem('svh_gh_repo',repo);
  localStorage.setItem('svh_gh_token',token);
  setGhStatus('ok','✓ Einstellungen gespeichert. Bitte Verbindung testen.');
}

function clearGithubSettings(){
  ['svh_gh_user','svh_gh_repo','svh_gh_token'].forEach(function(k){localStorage.removeItem(k);});
  ['gh-user','gh-repo','gh-token'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  setGhStatus('info','GitHub Einstellungen gelöscht.');
}

function setGhStatus(type,msg){
  var el=document.getElementById('gh-status');if(!el)return;
  var bg={ok:'rgba(55,160,38,.15)',error:'rgba(248,113,113,.12)',info:'rgba(55,160,38,.08)',loading:'rgba(55,160,38,.08)'};
  var col={ok:'var(--accent)',error:'#f87171',info:'var(--text2)',loading:'var(--text2)'};
  el.innerHTML='<div style="padding:10px 16px;border-radius:10px;font-size:13px;background:'+bg[type]+';color:'+col[type]+';border:1px solid var(--border2)">'+msg+'</div>';
}

async function testGithubConnection(){
  var s=getGhSettings();
  if(!s.user||!s.repo||!s.token){setGhStatus('error','Bitte zuerst Einstellungen speichern.');return;}
  setGhStatus('loading','⏳ Verbindung wird getestet...');
  try{
    var resp=await fetch('https://api.github.com/repos/'+s.user+'/'+s.repo,{headers:{'Authorization':'Bearer '+s.token,'Accept':'application/vnd.github.v3+json'}});
    if(resp.ok){var d=await resp.json();setGhStatus('ok','✓ Verbunden mit <strong>'+d.full_name+'</strong> · Bilder werden jetzt direkt ins Repository hochgeladen.');}
    else if(resp.status===401)setGhStatus('error','✗ Token ungültig oder abgelaufen. Bitte neuen Token erstellen.');
    else if(resp.status===404)setGhStatus('error','✗ Repository nicht gefunden. Bitte Username und Repository-Namen prüfen.');
    else setGhStatus('error','✗ Fehler: HTTP '+resp.status);
  }catch(e){setGhStatus('error','✗ Netzwerkfehler: '+e.message);}
}

async function uploadToGithub(file,path){
  var s=getGhSettings();if(!s.user||!s.repo||!s.token)return null;
  var b64=await new Promise(function(res,rej){var r=new FileReader();r.onload=function(e){res(e.target.result.split(',')[1]);};r.onerror=rej;r.readAsDataURL(file);});
  var apiUrl='https://api.github.com/repos/'+s.user+'/'+s.repo+'/contents/'+path;
  var sha=null;
  try{var ck=await fetch(apiUrl,{headers:{'Authorization':'Bearer '+s.token,'Accept':'application/vnd.github.v3+json'}});if(ck.ok){var ex=await ck.json();sha=ex.sha;}}catch(e){}
  var body={message:'Bild: '+path,content:b64,branch:'main'};if(sha)body.sha=sha;
  try{
    var resp=await fetch(apiUrl,{method:'PUT',headers:{'Authorization':'Bearer '+s.token,'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify(body)});
    if(resp.ok)return 'https://raw.githubusercontent.com/'+s.user+'/'+s.repo+'/main/'+path;
  }catch(e){}
  return null;
}

function fileExt(file){return (file.name||'img.jpg').split('.').pop().toLowerCase()||'jpg';}

function showUploadProgress(msg){var h=document.getElementById('uploadHint');h.textContent=msg;h.classList.add('show');}

function hideUploadProgress(){var h=document.getElementById('uploadHint');h.textContent='✓ Bild gespeichert!';setTimeout(function(){h.classList.remove('show');},2500);}

function initGithubUI(){
  var s=getGhSettings();
  var u=document.getElementById('gh-user');var r=document.getElementById('gh-repo');var t=document.getElementById('gh-token');
  if(u)u.value=s.user;if(r)r.value=s.repo;
  // Don't prefill token field for security – just show masked hint
  if(t&&s.token)t.placeholder='••••••••••••••••••••• (gespeichert)';
  if(s.user&&s.repo&&s.token)setGhStatus('ok','✓ GitHub verbunden: '+s.user+'/'+s.repo);
}

// ── Seiten-Editor ──
function loadPageEditor(key){
  var pg=null;
  for(var i=0;i<editablePages.length;i++){if(editablePages[i].key===key){pg=editablePages[i];break;}}
  if(!pg)return;
  var cont=document.getElementById('pageEditorContent');if(!cont)return;
  var val=getPageContent(key);
  // Highlight selected menu item
  var menu=document.getElementById('pageEditorMenu');
  if(menu)menu.querySelectorAll('div').forEach(function(d){d.style.background='';d.style.color='var(--text2)';});

  if(pg.field==='textarea'){
    var text=val||'';
    cont.innerHTML='<h4 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:14px">'+escH(pg.label)+'</h4>'
      +'<textarea id="page-edit-area" style="width:100%;min-height:280px;background:var(--bg2);border:1.5px solid var(--border);border-radius:10px;color:var(--text);font-size:14px;font-family:Inter,sans-serif;padding:12px 14px;resize:vertical;box-sizing:border-box;line-height:1.7">'+escH(text)+'</textarea>'
      +'<div style="margin-top:14px;display:flex;gap:10px">'
      +'<button class="btn-primary" style="font-size:13px;padding:9px 20px" onclick="savePage(\''+key+'\')">💾 Speichern</button>'
      +'</div>'
      +'<p style="font-size:12px;color:var(--text2);margin-top:10px">Absätze mit einer Leerzeile trennen.</p>';
  } else if(pg.field==='beitrag'){
    var rows=val||[];
    var rowHtml='';
    for(var j=0;j<rows.length;j++){
      rowHtml+='<tr>'
        +'<td style="padding:4px"><input type="text" value="'+escH(rows[j][0])+'" style="width:100%;padding:6px 10px;background:var(--bg2);border:1.5px solid var(--border);border-radius:7px;color:var(--text);font-size:13px;font-family:Inter,sans-serif"/></td>'
        +'<td style="padding:4px"><input type="text" value="'+escH(rows[j][1])+'" style="width:100%;padding:6px 10px;background:var(--bg2);border:1.5px solid var(--border);border-radius:7px;color:var(--text);font-size:13px;font-family:Inter,sans-serif"/></td>'
        +'<td style="padding:4px;text-align:center"><button onclick="this.closest(\'tr\').remove()" style="color:#f87171;background:none;border:none;cursor:pointer;font-size:16px">🗑</button></td>'
        +'</tr>';
    }
    cont.innerHTML='<h4 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:14px">'+escH(pg.label)+'</h4>'
      +'<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">'
      +'<thead><tr style="background:var(--card2)"><th style="padding:8px;text-align:left;border-bottom:1px solid var(--border);color:var(--text2)">Kategorie</th><th style="padding:8px;text-align:left;border-bottom:1px solid var(--border);color:var(--text2)">Betrag (€)</th><th style="width:40px"></th></tr></thead>'
      +'<tbody id="beitrag-edit-body">'+rowHtml+'</tbody></table></div>'
      +'<div style="margin-top:14px;display:flex;gap:10px">'
      +'<button onclick="beitragAddRow()" style="background:rgba(30,111,255,.12);border:1px solid var(--border);color:var(--blue2);padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif">+ Zeile hinzufügen</button>'
      +'<button class="btn-primary" style="font-size:13px;padding:9px 20px" onclick="saveBeitrag()">💾 Speichern</button>'
      +'</div>';
  } else if(pg.field==='termine'){
    var termine=val||[];
    var termHtml='';
    for(var k=0;k<termine.length;k++){
      var t=termine[k];
      termHtml+=termRowHtml(t.day||'',t.mon||'',t.title||'',t.desc||'');
    }
    cont.innerHTML='<h4 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:14px">'+escH(pg.label)+'</h4>'
      +'<div id="termine-edit-body">'+termHtml+'</div>'
      +'<div style="margin-top:14px;display:flex;gap:10px">'
      +'<button onclick="termineAddRow()" style="background:rgba(30,111,255,.12);border:1px solid var(--border);color:var(--blue2);padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif">+ Termin hinzufügen</button>'
      +'<button class="btn-primary" style="font-size:13px;padding:9px 20px" onclick="saveTermine()">💾 Speichern</button>'
      +'</div>';
  }
}

function termRowHtml(day,mon,title,desc){
  return '<div style="display:grid;grid-template-columns:60px 60px 1fr 1fr 32px;gap:8px;align-items:center;margin-bottom:8px;background:var(--card2);padding:10px;border-radius:10px;border:1px solid var(--border)">'
    +'<input type="text" value="'+escH(day)+'" placeholder="Tag" style="padding:6px 8px;background:var(--bg2);border:1.5px solid var(--border);border-radius:7px;color:var(--text);font-size:13px;font-family:Inter,sans-serif;width:100%;box-sizing:border-box"/>'
    +'<input type="text" value="'+escH(mon)+'" placeholder="Mon" style="padding:6px 8px;background:var(--bg2);border:1.5px solid var(--border);border-radius:7px;color:var(--text);font-size:13px;font-family:Inter,sans-serif;width:100%;box-sizing:border-box"/>'
    +'<input type="text" value="'+escH(title)+'" placeholder="Titel" style="padding:6px 8px;background:var(--bg2);border:1.5px solid var(--border);border-radius:7px;color:var(--text);font-size:13px;font-family:Inter,sans-serif;width:100%;box-sizing:border-box"/>'
    +'<input type="text" value="'+escH(desc)+'" placeholder="Beschreibung" style="padding:6px 8px;background:var(--bg2);border:1.5px solid var(--border);border-radius:7px;color:var(--text);font-size:13px;font-family:Inter,sans-serif;width:100%;box-sizing:border-box"/>'
    +'<button onclick="this.parentNode.remove()" style="color:#f87171;background:none;border:none;cursor:pointer;font-size:18px;line-height:1">🗑</button>'
    +'</div>';
}

function termineAddRow(){
  var body=document.getElementById('termine-edit-body');if(!body)return;
  var div=document.createElement('div');
  div.innerHTML=termRowHtml('','','','');
  body.appendChild(div.firstChild);
}

function saveTermine(){
  var body=document.getElementById('termine-edit-body');if(!body)return;
  var rows=[];
  body.querySelectorAll('div').forEach(function(row){
    var inputs=row.querySelectorAll('input');
    if(inputs.length>=4&&(inputs[0].value||inputs[2].value))
      rows.push({day:inputs[0].value,mon:inputs[1].value,title:inputs[2].value,desc:inputs[3].value});
  });
  savePageContent('termine-liste',rows);
  applyTermine(rows);
  alert('Termine gespeichert!');
}

function beitragAddRow(){
  var tbody=document.getElementById('beitrag-edit-body');if(!tbody)return;
  var tr=document.createElement('tr');
  tr.innerHTML='<td style="padding:4px"><input type="text" placeholder="Kategorie" style="width:100%;padding:6px 10px;background:var(--bg2);border:1.5px solid var(--border);border-radius:7px;color:var(--text);font-size:13px;font-family:Inter,sans-serif"/></td>'
    +'<td style="padding:4px"><input type="text" placeholder="Betrag" style="width:100%;padding:6px 10px;background:var(--bg2);border:1.5px solid var(--border);border-radius:7px;color:var(--text);font-size:13px;font-family:Inter,sans-serif"/></td>'
    +'<td style="padding:4px;text-align:center"><button onclick="this.closest(\'tr\').remove()" style="color:#f87171;background:none;border:none;cursor:pointer;font-size:16px">🗑</button></td>';
  tbody.appendChild(tr);
}

function saveBeitrag(){
  var tbody=document.getElementById('beitrag-edit-body');if(!tbody)return;
  var rows=[];
  tbody.querySelectorAll('tr').forEach(function(tr){
    var inputs=tr.querySelectorAll('input');
    if(inputs.length>=2&&inputs[0].value)rows.push([inputs[0].value,inputs[1].value]);
  });
  savePageContent('beitrag-tabelle',rows);
  applyBeitrag(rows);
  alert('Beitragsordnung gespeichert!');
}

// ── Slide Management ──
function adminAddSlide(){
  var count=getSlideCount();
  if(count>=8){alert('Maximum 8 Slides.');return;}
  var newCount=count+1;
  lsSet('svh_slide_count',newCount);
  totalSlides=newCount;
  var track=document.getElementById('heroSlider');
  if(track){
    var lblData=ls('svh_slide_labels',null)||[];
    var lbl=lblData[count]||{title:'Slide '+(count+1),sub:''};
    var sl=document.createElement('div');
    sl.className='carousel-slide';sl.id='hs'+count;
    sl.innerHTML='<div class="carousel-slide-label"><h2>'+escH(lbl.title)+'</h2><p>'+escH(lbl.sub)+'</p></div>';
    track.appendChild(sl);
  }
  var dots=document.getElementById('sDots');
  if(dots){
    var dot=document.createElement('button');
    dot.className='c-dot';
    dot.setAttribute('onclick','goSlide('+count+')');
    dots.appendChild(dot);
  }
  renderBilderTab();
}

function adminRemoveSlide(){
  var count=getSlideCount();
  if(count<=1){alert('Mindestens 1 Slide erforderlich.');return;}
  var newCount=count-1;
  lsSet('svh_slide_count',newCount);
  totalSlides=newCount;
  var last=document.getElementById('hs'+newCount);if(last)last.remove();
  var dots=document.getElementById('sDots');
  if(dots&&dots.lastChild)dots.lastChild.remove();
  var imgs=ls('svh_slide_imgs',{});delete imgs[newCount];lsSet('svh_slide_imgs',imgs);
  if(curSlide>=newCount)goSlide(0);
  renderBilderTab();
}

function adminRemoveSlideImg(idx){
  var imgs=ls('svh_slide_imgs',{});delete imgs[idx];lsSet('svh_slide_imgs',imgs);
  var sl=document.getElementById('hs'+idx);
  if(sl){var si=sl.querySelector('img.slide-img-bg');if(si)si.remove();}
  renderBilderTab();
}


var NAV_MAP={home:'nav-home',news:'nav-news',article:'nav-news',verein:'nav-verein',vorstandschaft:'nav-verein',historie:'nav-verein',termine:'nav-verein',beitragsordnung:'nav-verein',jugendordnung:'nav-verein',training:'nav-training',jugend:'nav-training',masters:'nav-training',trainingszeiten:'nav-training',trainer:'nav-training',trainingsstaetten:'nav-training',kurse:'nav-kurse',kurstrainer:'nav-kurse',einzelstunden:'nav-kurse',wettkampf:'nav-wettkampf',vereinsrekorde:'nav-wettkampf',impressum:'nav-sonstiges',datenschutz:'nav-sonstiges'};



function showPage(id){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  var el=document.getElementById('page-'+id);
  if(el){el.classList.add('active');window.scrollTo(0,0);}
  ['nav-home','nav-news','nav-verein','nav-training','nav-kurse','nav-wettkampf','nav-sonstiges'].forEach(function(n){var el=document.getElementById(n);if(el)el.classList.remove('active');});
  var nid=NAV_MAP[id];if(nid){var nn=document.getElementById(nid);if(nn)nn.classList.add('active');}
  if(id==='news')buildNewsGrids();
  if(id==='vereinsrekorde')renderRekordePage();
}

function toggleMobileMenu(){var b=document.getElementById('hamburgerBtn'),d=document.getElementById('mobileDrawer');if(b)b.classList.toggle('open');if(d)d.classList.toggle('open');}

function closeMobileMenu(){var b=document.getElementById('hamburgerBtn'),d=document.getElementById('mobileDrawer');if(b)b.classList.remove('open');if(d)d.classList.remove('open');}

function mobNav(p){showPage(p);closeMobileMenu();}

function mobArticle(id){showArticle(id);closeMobileMenu();}

function toggleMobSub(id){
  var sub=document.getElementById(id);if(!sub)return;
  var top=sub.previousElementSibling,wasOpen=sub.classList.contains('open');
  document.querySelectorAll('.mob-sub.open').forEach(function(s){s.classList.remove('open');if(s.previousElementSibling)s.previousElementSibling.classList.remove('expanded');});
  if(!wasOpen){sub.classList.add('open');if(top)top.classList.add('expanded');}
}


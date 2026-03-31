var curSlide=0;
var totalSlides=4;

function changeSlide(d){goSlide(curSlide+d);}

function goSlide(n){curSlide=(n+totalSlides)%totalSlides;var sl=document.getElementById('heroSlider');if(sl)sl.style.transform='translateX(-'+(curSlide*100)+'%)';document.querySelectorAll('.s-dot').forEach(function(d,i){d.classList.toggle('active',i===curSlide);});}


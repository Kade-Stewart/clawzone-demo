(function(){
  var bar = document.getElementById('stickyBar');
  var hero = document.getElementById('top');
  if('IntersectionObserver' in window){
    var watcher = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.target === hero){
          bar.classList.toggle('scrolled', !e.isIntersecting);
          return;
        }
        if(e.isIntersecting && e.intersectionRatio >= 0.15){
          var el = e.target;
          el.classList.add('in');
          watcher.unobserve(el);
          el.addEventListener('transitionend', function once(ev){
            if(ev.propertyName !== 'transform') return;
            el.classList.remove('reveal','in');
            el.removeEventListener('transitionend', once);
          });
        }
      });
    }, {threshold:[0,0.15]});
    watcher.observe(hero);
    document.querySelectorAll('.reveal').forEach(function(el){ watcher.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
    bar.classList.add('scrolled');
  }

  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if(menuToggle && mobileMenu){
    menuToggle.addEventListener('click', function(){
      var isOpen = mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var signupForm = document.getElementById('signupForm');
  var signupConfirm = document.getElementById('signupConfirm');
  if(signupForm){
    signupForm.addEventListener('submit', function(e){
      e.preventDefault();
      signupForm.classList.add('sent');
      signupConfirm.classList.add('show');
    });
  }

})();

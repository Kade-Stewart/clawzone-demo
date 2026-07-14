(function(){
  var bar = document.getElementById('stickyBar');
  var hero = document.getElementById('top');

  // Lock hero to one measured height on mobile so iOS URL-bar show/hide
  // cannot resize the section and reflow centered type while scrolling.
  function lockHeroHeight(){
    if(!hero) return;
    if(window.matchMedia('(max-width:768px)').matches){
      document.documentElement.style.setProperty('--hero-height', window.innerHeight + 'px');
    } else {
      document.documentElement.style.removeProperty('--hero-height');
    }
  }
  lockHeroHeight();
  window.addEventListener('orientationchange', function(){
    setTimeout(lockHeroHeight, 300);
  });

  if('IntersectionObserver' in window){
    var heroWatcher = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.target === hero){
          bar.classList.toggle('scrolled', !e.isIntersecting);
        }
      });
    }, {threshold:0, rootMargin:'-8% 0px 0px 0px'});
    heroWatcher.observe(hero);

    var revealWatcher = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!(e.isIntersecting && e.intersectionRatio >= 0.12)) return;
        var el = e.target;
        el.classList.add('in');
        revealWatcher.unobserve(el);
        el.addEventListener('transitionend', function once(ev){
          if(ev.propertyName !== 'opacity' && ev.propertyName !== 'transform') return;
          el.classList.remove('reveal','in');
          el.removeEventListener('transitionend', once);
        });
      });
    }, {threshold:0.12, rootMargin:'0px 0px -6% 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){ revealWatcher.observe(el); });
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

  var hoursPreview = document.getElementById('hoursPreview');
  if(hoursPreview){
    var dayKeys = ['sun','mon','tue','wed','thu','fri','sat'];
    var schedule = {
      sun:[12,21], mon:[16,21], tue:null, wed:[16,21],
      thu:[16,21], fri:[16,24], sat:[12,24]
    };
    function fmtHour(h){
      var h24 = h % 24;
      var period = h24 < 12 ? 'am' : 'pm';
      var h12 = h24 % 12 === 0 ? 12 : h24 % 12;
      return h12 + period;
    }
    var now = new Date();
    var todayKey = dayKeys[now.getDay()];
    var today = schedule[todayKey];
    var hour = now.getHours() + now.getMinutes() / 60;
    var text;
    if(!today){
      text = 'Closed today';
    } else if(hour < today[0]){
      text = 'Opens today at ' + fmtHour(today[0]);
    } else if(hour < today[1]){
      text = 'Open now · Closes ' + fmtHour(today[1]);
    } else {
      text = 'Closed now';
    }
    hoursPreview.textContent = text;

    var todayRow = document.querySelector('.hours-grid [data-day="' + todayKey + '"]');
    if(todayRow) todayRow.classList.add('today');
  }

  var hoursDetails = document.querySelector('.hours-details');
  if(hoursDetails){
    var hoursSummary = hoursDetails.querySelector('summary');
    var hoursPanel = hoursDetails.querySelector('.hours-panel');
    if(hoursSummary && hoursPanel){
      hoursSummary.addEventListener('click', function(e){
        e.preventDefault();
        if(hoursDetails.open){
          hoursDetails.classList.remove('is-expanded');
          var closeH = hoursPanel.scrollHeight;
          hoursPanel.style.height = closeH + 'px';
          hoursPanel.getBoundingClientRect();
          hoursPanel.style.height = '0px';
          var onClose = function(ev){
            if(ev.propertyName !== 'height') return;
            hoursDetails.removeAttribute('open');
            hoursPanel.style.height = '';
            hoursPanel.removeEventListener('transitionend', onClose);
          };
          hoursPanel.addEventListener('transitionend', onClose);
        } else {
          hoursDetails.setAttribute('open', '');
          hoursDetails.classList.add('is-expanded');
          var openH = hoursPanel.scrollHeight;
          hoursPanel.style.height = '0px';
          hoursPanel.getBoundingClientRect();
          hoursPanel.style.height = openH + 'px';
          var onOpen = function(ev){
            if(ev.propertyName !== 'height') return;
            hoursPanel.style.height = '';
            hoursPanel.removeEventListener('transitionend', onOpen);
          };
          hoursPanel.addEventListener('transitionend', onOpen);
        }
      });
    }
  }

})();

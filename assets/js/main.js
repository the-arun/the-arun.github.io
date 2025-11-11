/**
 * Modern Portfolio JavaScript - Technical Trainer Theme
 * Enhanced functionality for the new design
 */

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .nav-link', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle with enhanced functionality
   */
  on('click', '.mobile-nav-toggle', function(e) {
    e.preventDefault();
    const body = select('body');
    const navbarToggle = select('.mobile-nav-toggle');
    
    body.classList.toggle('mobile-nav-active');
    
    // Update ARIA attributes for accessibility
    const isExpanded = body.classList.contains('mobile-nav-active');
    navbarToggle.setAttribute('aria-expanded', isExpanded);
    
    // Focus management
    if (isExpanded) {
      // Focus first navigation item when menu opens
      const firstNavLink = select('#navbar .nav-link');
      if (firstNavLink) {
        setTimeout(() => firstNavLink.focus(), 100);
      }
    } else {
      // Return focus to toggle button when menu closes
      navbarToggle.focus();
    }
  })

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.setAttribute('aria-expanded', 'false');
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Keyboard navigation support
   */
  on('keydown', '.mobile-nav-toggle', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  })

  // Close mobile menu when clicking outside
  on('click', 'body', function(e) {
    if (select('body').classList.contains('mobile-nav-active')) {
      if (!e.target.closest('#header') && !e.target.closest('.mobile-nav-toggle')) {
        select('body').classList.remove('mobile-nav-active');
        const navbarToggle = select('.mobile-nav-toggle');
        navbarToggle.setAttribute('aria-expanded', 'false');
      }
    }
  })

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect with enhanced typing animation
   */
  const typed = select('.typed-text')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed-text', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      showCursor: true,
      cursorChar: '|'
    });
  }

  /**
   * Skills animation with enhanced progress bars
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.skill-progress', true);
        progress.forEach((el) => {
          const width = el.getAttribute('data-width');
          el.style.width = width + '%';
        });
      }
    })
  }

  // Alternative skills animation for new structure
  const skillProgressBars = select('.skill-progress', true);
  if (skillProgressBars.length > 0) {
    const animateSkills = () => {
      skillProgressBars.forEach((bar) => {
        const rect = bar.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !bar.classList.contains('animated')) {
          const width = bar.getAttribute('data-width');
          bar.style.width = width + '%';
          bar.classList.add('animated');
        }
      });
    };

    window.addEventListener('scroll', animateSkills);
    window.addEventListener('load', animateSkills);
  }

  /**
   * Certificate lightbox initialization
   */
  const certificateLightbox = GLightbox({
    selector: '.certificate-lightbox',
    touchNavigation: true,
    loop: true,
    autoplayVideos: false
  });

  /**
   * Animation on scroll initialization
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 100
    })
  });

  /**
   * Form handling
   */
  const contactForm = select('.contact-form .form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const subject = this.querySelector('input[placeholder="Subject"]').value;
      const message = this.querySelector('textarea').value;
      
      // Basic validation
      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // Simulate form submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  /**
   * Smooth scrolling for all anchor links
   */
  on('click', 'a[href^="#"]', function(e) {
    const target = this.getAttribute('href');
    if (target === '#') return;
    
    e.preventDefault();
    const targetElement = select(target);
    if (targetElement) {
      scrollto(target);
    }
  });

  /**
   * Parallax effect for hero section
   */
  const heroSection = select('.hero-section');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.5;
      heroSection.style.transform = `translateY(${parallax}px)`;
    });
  }

  /**
   * Counter animation for statistics
   */
  const statNumbers = select('.stat-number', true);
  if (statNumbers.length > 0) {
    const animateCounters = () => {
      statNumbers.forEach((stat) => {
        const rect = stat.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !stat.classList.contains('animated')) {
          const target = parseInt(stat.textContent.replace(/\D/g, ''));
          const suffix = stat.textContent.replace(/\d/g, '');
          let current = 0;
          const increment = target / 50;
          
          const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target + suffix;
              clearInterval(counter);
            } else {
              stat.textContent = Math.floor(current) + suffix;
            }
          }, 30);
          
          stat.classList.add('animated');
        }
      });
    };

    window.addEventListener('scroll', animateCounters);
    window.addEventListener('load', animateCounters);
  }

  /**
   * Intersection Observer for animations
   */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = select('.course-card, .certificate-card, .timeline-item, .skill-category', true);
  animateElements.forEach(el => {
    observer.observe(el);
  });

  /**
   * Theme toggle functionality (for future enhancement)
   */
  const createThemeToggle = () => {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="bx bx-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      themeToggle.innerHTML = isDark ? '<i class="bx bx-sun"></i>' : '<i class="bx bx-moon"></i>';
      
      // Save theme preference
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.innerHTML = '<i class="bx bx-sun"></i>';
    }
    
    document.body.appendChild(themeToggle);
  };

  // Uncomment to enable theme toggle
  // createThemeToggle();

  /**
   * Loading animation
   */
  window.addEventListener('load', () => {
    const loader = select('.loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  });

  /**
   * Preload critical images
   */
  const preloadImages = () => {
    const criticalImages = [
      'assets/img/profile-img.png',
      'assets/img/hero-bg.jpg'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  };

  preloadImages();

  /**
   * Performance optimization
   */
  // Lazy load images
  const lazyImages = select('img[data-src]', true);
  if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }

  /**
   * Error handling
   */
  window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
  });

  /**
   * Service Worker registration (for PWA features)
   */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

})();
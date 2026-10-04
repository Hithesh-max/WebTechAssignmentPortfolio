/**
 * Hithesh D — Portfolio JavaScript
 * Pure vanilla JavaScript (ES6+) for interactive canvas, typewriter,
 * scrollspy navigation, mobile menu, and scroll reveal animations.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 0. THEME TOGGLE (LIGHT & DARK MODE WITH SUNLIGHT & MOON)
  // ============================================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  
  // Apply saved theme preference on load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.body.classList.add('light-mode');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isCurrentlyLight = document.documentElement.getAttribute('data-theme') === 'light' || document.body.classList.contains('light-mode');
      
      if (isCurrentlyLight) {
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ============================================================
  // 1. INTERACTIVE PARTICLE CANVAS BACKGROUND (Blue & Yellow)
  // ============================================================
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 75;

    // Palette with theme blues & vibrant yellow/gold
    const colors = [
      'rgba(59, 130, 246, ',   // Electric Blue
      'rgba(96, 165, 250, ',   // Light Blue
      'rgba(250, 204, 21, ',   // Cyberpunk Yellow
      'rgba(234, 179, 8, ',    // Amber Yellow
      'rgba(255, 255, 255, '   // Crisp White
    ];

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.6;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5 - 0.2;
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light' || document.body.classList.contains('light-mode');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = isLight 
          ? (this.baseColor.includes('250, 204') ? `rgba(16, 185, 129, ${this.alpha * 0.85})` : `rgba(37, 99, 235, ${this.alpha * 0.75})`)
          : `${this.baseColor}${this.alpha})`;
        ctx.shadowBlur = isLight ? 2 : 6;
        ctx.shadowColor = this.baseColor.includes('250, 204') ? (isLight ? '#10b981' : '#facc15') : '#3b82f6';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Connect particles within proximity
    function connectParticles() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light' || document.body.classList.contains('light-mode');
      const maxDistance = 110;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isLight ? 0.2 : 0.15);
            ctx.strokeStyle = isLight ? `rgba(37, 99, 235, ${alpha})` : `rgba(96, 165, 250, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ============================================================
  // 2. TYPEWRITER EFFECT
  // ============================================================
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const roles = [
      'AI Engineer',
      'ML Developer',
      'Security Researcher',
      'Full-Stack Developer',
      'Game Developer',
      'Problem Solver'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typeSpeed = 85;
    const eraseSpeed = 40;
    const pauseDelay = 1800;

    function handleTypewriter() {
      const currentRole = roles[roleIdx];

      if (!isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === currentRole.length) {
          isDeleting = true;
          setTimeout(handleTypewriter, pauseDelay);
          return;
        }
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
        }
      }
      setTimeout(handleTypewriter, isDeleting ? eraseSpeed : typeSpeed);
    }
    setTimeout(handleTypewriter, 600);
  }

  // ============================================================
  // 3. STICKY NAVBAR & ACTIVE SCROLLSPY
  // ============================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scrollspy section detector
    let currentSection = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll();

  // ============================================================
  // 4. MOBILE HAMBURGER MENU
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ============================================================
  // 5. SCROLL REVEAL OBSERVER & STAT COUNTERS
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================================
  // 6. CONTACT FORM SUBMISSION HANDLER
  // ============================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        if (formStatus) formStatus.textContent = 'Please fill out all fields.';
        return;
      }

      // Construct mailto link
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Hithesh,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`);
      const mailtoUrl = `mailto:hitheshd12006@gmail.com?subject=${subject}&body=${body}`;

      if (submitBtn) {
        submitBtn.innerHTML = '<span>Opening Mail Client...</span>';
      }

      if (formStatus) {
        formStatus.textContent = '✓ Redirecting to your email client...';
      }

      setTimeout(() => {
        window.location.href = mailtoUrl;
        contactForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = `
            <span>Message Prepared</span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6L9 17l-5-5"/></svg>
          `;
        }
      }, 500);
    });
  }

});

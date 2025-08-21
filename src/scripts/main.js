import '../styles/main.scss';

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    initializeWebsite();
  } catch (error) {
    console.error('Error initializing website:', error);
  }
});

function initializeWebsite() {
  initializeNavbar();
  initializeMobileMenu();
  initializeSmoothScroll();
  initializeLanguageSelector();
  initializeScrollReveal();
}

function initializeNavbar() {
  try {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    });
  } catch (error) {
    console.error('Error initializing navbar:', error);
  }
}

function initializeMobileMenu() {
  try {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navRight = document.querySelector('.nav-right');

    if (!hamburger || !navLinks || !navRight) return;

    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navRight.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && 
          !navLinks.contains(e.target) && 
          !navRight.contains(e.target)) {
        navLinks.classList.remove('active');
        navRight.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  } catch (error) {
    console.error('Error initializing mobile menu:', error);
  }
}

function initializeSmoothScroll() {
  try {
    const navLinks = document.querySelector('.nav-links');
    const navRight = document.querySelector('.nav-right');
    const hamburger = document.querySelector('.hamburger');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        try {
          e.preventDefault();
          const href = this.getAttribute('href');
          if (!href) return;

          const target = document.querySelector(href);
          if (!target) return;

          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          if (navLinks && navRight && hamburger) {
            navLinks.classList.remove('active');
            navRight.classList.remove('active');
            hamburger.classList.remove('active');
          }
        } catch (error) {
          console.error('Error in smooth scroll:', error);
        }
      });
    });
  } catch (error) {
    console.error('Error initializing smooth scroll:', error);
  }
}

function initializeLanguageSelector() {
  try {
    const languageLinks = document.querySelectorAll('.language-selector a');
    if (!languageLinks.length) return;

    languageLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        try {
          e.preventDefault();
          languageLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        } catch (error) {
          console.error('Error in language selector:', error);
        }
      });
    });
  } catch (error) {
    console.error('Error initializing language selector:', error);
  }
}

function initializeScrollReveal() {
  try {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.opacity = '1';
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('section, .feature, .room-card');
    if (!elements.length) return;

    elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'all 0.6s ease-out';
      observer.observe(element);
    });
  } catch (error) {
    console.error('Error initializing scroll reveal:', error);
  }
}
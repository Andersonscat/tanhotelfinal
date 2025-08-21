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
  initializeBookingForm();
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

function initializeBookingForm() {
  try {
    const guestsSection = document.querySelector('.booking-section.guests');
    const roomsSection = document.querySelector('.booking-section.rooms');
    
    if (guestsSection) {
      initializePopover(guestsSection, 'guests');
    }
    
    if (roomsSection) {
      initializePopover(roomsSection, 'rooms');
    }
    
    // Close popovers when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.booking-section') && !e.target.closest('.popover')) {
        closeAllPopovers();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllPopovers();
      }
    });
    
  } catch (error) {
    console.error('Error initializing booking form:', error);
  }
}

function initializePopover(section, type) {
  const popover = section.querySelector('.popover');
  const textElement = section.querySelector('.section-text');
  
  if (!popover || !textElement) return;
  
  // Click handler
  section.addEventListener('click', (e) => {
    e.preventDefault();
    togglePopover(section, popover);
  });
  
  // Keyboard handlers
  section.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePopover(section, popover);
    }
  });
  
  // Stepper functionality
  const steppers = popover.querySelectorAll('.stepper');
  steppers.forEach(stepper => {
    const minusBtn = stepper.querySelector('.minus');
    const plusBtn = stepper.querySelector('.plus');
    const input = stepper.querySelector('input');
    
    if (minusBtn && plusBtn && input) {
      minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentValue = parseInt(input.value);
        const min = parseInt(input.min);
        if (currentValue > min) {
          input.value = currentValue - 1;
          updateDisplayText(type, textElement, input);
        }
      });
      
      plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentValue = parseInt(input.value);
        const max = parseInt(input.max);
        if (currentValue < max) {
          input.value = currentValue + 1;
          updateDisplayText(type, textElement, input);
        }
      });
      
      input.addEventListener('change', () => {
        updateDisplayText(type, textElement, input);
      });
    }
  });
}

function togglePopover(section, popover) {
  const isActive = popover.classList.contains('active');
  
  // Close all other popovers first
  closeAllPopovers();
  
  if (!isActive) {
    popover.classList.add('active');
    section.setAttribute('aria-expanded', 'true');
  }
}

function closeAllPopovers() {
  const activePopovers = document.querySelectorAll('.popover.active');
  const activeSections = document.querySelectorAll('.booking-section[aria-expanded="true"]');
  
  activePopovers.forEach(popover => {
    popover.classList.remove('active');
  });
  
  activeSections.forEach(section => {
    section.setAttribute('aria-expanded', 'false');
  });
}

function updateDisplayText(type, textElement, input) {
  if (type === 'guests') {
    const adultsInput = input.name === 'adults' ? input : input.parentElement.parentElement.querySelector('input[name="adults"]');
    const childrenInput = input.name === 'children' ? input : input.parentElement.parentElement.querySelector('input[name="children"]');
    
    if (adultsInput && childrenInput) {
      const adults = parseInt(adultsInput.value);
      const children = parseInt(childrenInput.value);
      textElement.textContent = `${adults} Adult${adults !== 1 ? 's' : ''}, ${children} Child${children !== 1 ? 'ren' : ''}`;
    }
  } else if (type === 'rooms') {
    const rooms = parseInt(input.value);
    textElement.textContent = `${rooms} Room${rooms !== 1 ? 's' : ''}`;
  }
}
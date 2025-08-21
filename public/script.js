// Calendar functionality
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDates = {
            checkIn: null,
            checkOut: null
        };
        this.isSelectingCheckIn = true;
        
        this.init();
    }
    
    init() {
        this.overlay = document.getElementById('calendar-overlay');
        this.datesSection = document.querySelector('.booking-section.dates');
        this.sectionText = this.datesSection.querySelector('.section-text');
        
        this.bindEvents();
        this.render();
    }
    
    bindEvents() {
        // Open calendar on dates section click
        this.datesSection.addEventListener('click', () => {
            this.open();
        });
        
        // Close calendar on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
        
        // Close button
        const closeBtn = this.overlay.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            this.close();
        });
        
        // Navigation buttons
        const prevBtn = this.overlay.querySelector('.nav-btn.prev');
        const nextBtn = this.overlay.querySelector('.nav-btn.next');
        
        prevBtn.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });
        
        nextBtn.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }
    
    open() {
        this.overlay.classList.add('active');
        this.render();
    }
    
    close() {
        this.overlay.classList.remove('active');
    }
    
    isOpen() {
        return this.overlay.classList.contains('active');
    }
    
    render() {
        this.updateMonthDisplay();
        this.renderCurrentMonth();
        this.renderNextMonth();
    }
    
    updateMonthDisplay() {
        const currentMonthEl = this.overlay.querySelector('.current-month');
        const nextMonthEl = this.overlay.querySelector('.next-month');
        
        const currentMonth = this.currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        }).toUpperCase();
        
        const nextMonthDate = new Date(this.currentDate);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        const nextMonth = nextMonthDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        }).toUpperCase();
        
        currentMonthEl.textContent = currentMonth;
        nextMonthEl.textContent = nextMonth;
    }
    
    renderCurrentMonth() {
        this.renderMonth('.current-month-days', this.currentDate);
    }
    
    renderNextMonth() {
        const nextMonthDate = new Date(this.currentDate);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        this.renderMonth('.next-month-days', nextMonthDate);
    }
    
    renderMonth(selector, date) {
        const container = this.overlay.querySelector(selector);
        container.innerHTML = '';
        
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Get first day of month and last day
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Get starting date (previous month's days to fill first week)
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay() + (firstDay.getDay() === 0 ? -6 : 1));
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Generate calendar grid
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayEl = document.createElement('div');
            dayEl.className = 'day';
            dayEl.textContent = currentDate.getDate();
            
            // Check if date is from current month
            if (currentDate.getMonth() !== month) {
                dayEl.classList.add('other-month');
            }
            
            // Check if date is today
            if (currentDate.getTime() === today.getTime()) {
                dayEl.classList.add('today');
            }
            
            // Check if date is disabled (past dates)
            if (currentDate < today) {
                dayEl.classList.add('disabled');
            } else {
                // Add click event for selectable dates
                dayEl.addEventListener('click', () => {
                    this.selectDate(currentDate);
                });
            }
            
            // Check if date is selected
            if (this.selectedDates.checkIn && this.isSameDate(currentDate, this.selectedDates.checkIn)) {
                dayEl.classList.add('selected');
            }
            if (this.selectedDates.checkOut && this.isSameDate(currentDate, this.selectedDates.checkOut)) {
                dayEl.classList.add('selected');
            }
            
            // Check if date is in range
            if (this.selectedDates.checkIn && this.selectedDates.checkOut) {
                if (currentDate >= this.selectedDates.checkIn && currentDate <= this.selectedDates.checkOut) {
                    dayEl.classList.add('in-range');
                }
            }
            
            container.appendChild(dayEl);
        }
    }
    
    selectDate(date) {
        if (this.isSelectingCheckIn) {
            this.selectedDates.checkIn = date;
            this.selectedDates.checkOut = null;
            this.isSelectingCheckIn = false;
        } else {
            if (date < this.selectedDates.checkIn) {
                this.selectedDates.checkOut = this.selectedDates.checkIn;
                this.selectedDates.checkIn = date;
            } else {
                this.selectedDates.checkOut = date;
            }
            this.isSelectingCheckIn = true;
            this.close();
        }
        
        this.updateDisplay();
        this.render();
    }
    
    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    updateDisplay() {
        if (this.selectedDates.checkIn && this.selectedDates.checkOut) {
            const checkIn = this.selectedDates.checkIn.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            const checkOut = this.selectedDates.checkOut.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            this.sectionText.textContent = `${checkIn} → ${checkOut}`;
        } else if (this.selectedDates.checkIn) {
            const checkIn = this.selectedDates.checkIn.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            this.sectionText.textContent = `${checkIn} → Check-out`;
        } else {
            this.sectionText.textContent = 'Check-in → Check-out';
        }
    }
}

// Guest counter functionality
class GuestCounter {
    constructor() {
        this.init();
    }
    
    init() {
        const guestsSection = document.querySelector('.booking-section.guests');
        const minusBtns = guestsSection.querySelectorAll('.minus');
        const plusBtns = guestsSection.querySelectorAll('.plus');
        const inputs = guestsSection.querySelectorAll('input[type="number"]');
        const sectionText = guestsSection.querySelector('.section-text');
        
        minusBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const input = inputs[index];
                const currentValue = parseInt(input.value);
                if (currentValue > parseInt(input.min)) {
                    input.value = currentValue - 1;
                    this.updateDisplay();
                }
            });
        });
        
        plusBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const input = inputs[index];
                const currentValue = parseInt(input.value);
                if (currentValue < parseInt(input.max)) {
                    input.value = currentValue + 1;
                    this.updateDisplay();
                }
            });
        });
        
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateDisplay();
            });
        });
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        const guestsSection = document.querySelector('.booking-section.guests');
        const adultsInput = guestsSection.querySelector('input[name="adults"]');
        const childrenInput = guestsSection.querySelector('input[name="children"]');
        const sectionText = guestsSection.querySelector('.section-text');
        
        const adults = adultsInput.value;
        const children = childrenInput.value;
        
        sectionText.textContent = `${adults} Adults, ${children} Children`;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
    new GuestCounter();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

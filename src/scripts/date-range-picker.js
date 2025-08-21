class DateRangePicker {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      onSelect: () => {},
      onClose: () => {},
      ...options
    };
    
    this.isOpen = false;
    this.checkIn = null;
    this.checkOut = null;
    this.currentMonth = new Date();
    this.hoveredDate = null;
    
    this.init();
  }
  
  init() {
    this.createPicker();
    this.bindEvents();
  }
  
  createPicker() {
    this.picker = document.createElement('div');
    this.picker.className = 'date-range-picker';
    this.picker.innerHTML = `
      <div class="picker-header">
        <button class="nav-btn prev" aria-label="Previous month">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <div class="month-year"></div>
        <button class="nav-btn next" aria-label="Next month">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>
      <div class="picker-body">
        <div class="weekdays">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
        <div class="calendar-grid"></div>
      </div>
      <div class="picker-footer">
        <button class="clear-btn">Clear</button>
        <button class="apply-btn">Apply</button>
      </div>
    `;
    
    this.container.appendChild(this.picker);
  }
  
  bindEvents() {
    // Navigation
    this.picker.querySelector('.prev').addEventListener('click', () => {
      this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
      this.render();
    });
    
    this.picker.querySelector('.next').addEventListener('click', () => {
      this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
      this.render();
    });
    
    // Buttons
    this.picker.querySelector('.clear-btn').addEventListener('click', () => {
      this.clearSelection();
    });
    
    this.picker.querySelector('.apply-btn').addEventListener('click', () => {
      this.applySelection();
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.picker.contains(e.target) && !e.target.closest('.booking-section.dates')) {
        this.close();
      }
    });
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }
  
  render() {
    const monthYear = this.picker.querySelector('.month-year');
    const grid = this.picker.querySelector('.calendar-grid');
    
    // Update header
    monthYear.textContent = this.currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
    
    // Generate calendar
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    let html = '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();
      const isSelected = this.isDateSelected(date);
      const isInRange = this.isDateInRange(date);
      const isDisabled = date < today;
      
      let className = 'date-cell';
      if (!isCurrentMonth) className += ' other-month';
      if (isToday) className += ' today';
      if (isSelected) className += ' selected';
      if (isInRange) className += ' in-range';
      if (isDisabled) className += ' disabled';
      
      html += `
        <div class="${className}" data-date="${date.toISOString().split('T')[0]}" ${isDisabled ? '' : 'tabindex="0"'}>
          ${date.getDate()}
        </div>
      `;
    }
    
    grid.innerHTML = html;
    
    // Add click handlers
    grid.querySelectorAll('.date-cell:not(.disabled)').forEach(cell => {
      cell.addEventListener('click', () => {
        const dateStr = cell.dataset.date;
        const date = new Date(dateStr);
        this.selectDate(date);
      });
      
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const dateStr = cell.dataset.date;
          const date = new Date(dateStr);
          this.selectDate(date);
        }
      });
      
      // Hover effects for range selection
      cell.addEventListener('mouseenter', () => {
        if (!this.checkIn || this.checkOut) return;
        const dateStr = cell.dataset.date;
        const date = new Date(dateStr);
        this.hoveredDate = date;
        this.updateHoverRange();
      });
      
      cell.addEventListener('mouseleave', () => {
        this.hoveredDate = null;
        this.updateHoverRange();
      });
    });
  }
  
  selectDate(date) {
    if (!this.checkIn || (this.checkIn && this.checkOut)) {
      // Start new selection
      this.checkIn = date;
      this.checkOut = null;
    } else {
      // Complete selection
      if (date < this.checkIn) {
        this.checkOut = this.checkIn;
        this.checkIn = date;
      } else {
        this.checkOut = date;
      }
    }
    
    this.render();
  }
  
  isDateSelected(date) {
    return (this.checkIn && this.isSameDate(date, this.checkIn)) ||
           (this.checkOut && this.isSameDate(date, this.checkOut));
  }
  
  isDateInRange(date) {
    if (!this.checkIn || !this.checkOut) return false;
    return date >= this.checkIn && date <= this.checkOut;
  }
  
  isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
  updateHoverRange() {
    const cells = this.picker.querySelectorAll('.date-cell');
    cells.forEach(cell => {
      cell.classList.remove('hover-range');
    });
    
    if (this.checkIn && this.hoveredDate && !this.checkOut) {
      const start = this.checkIn < this.hoveredDate ? this.checkIn : this.hoveredDate;
      const end = this.checkIn < this.hoveredDate ? this.hoveredDate : this.checkIn;
      
      cells.forEach(cell => {
        const dateStr = cell.dataset.date;
        const date = new Date(dateStr);
        if (date >= start && date <= end) {
          cell.classList.add('hover-range');
        }
      });
    }
  }
  
  clearSelection() {
    this.checkIn = null;
    this.checkOut = null;
    this.render();
  }
  
  applySelection() {
    if (this.checkIn && this.checkOut) {
      this.options.onSelect(this.checkIn, this.checkOut);
      this.close();
    }
  }
  
  open() {
    this.isOpen = true;
    this.picker.style.display = 'block';
    this.render();
  }
  
  close() {
    this.isOpen = false;
    this.picker.style.display = 'none';
    this.options.onClose();
  }
  
  setDates(checkIn, checkOut) {
    this.checkIn = checkIn ? new Date(checkIn) : null;
    this.checkOut = checkOut ? new Date(checkOut) : null;
    if (this.isOpen) {
      this.render();
    }
  }
  
  getDates() {
    return {
      checkIn: this.checkIn,
      checkOut: this.checkOut
    };
  }
}

export default DateRangePicker;

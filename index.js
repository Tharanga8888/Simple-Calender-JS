const monthYear = document.getElementById("monthYear");
const calendarDates = document.getElementById("calendarDates");
const selectedDateDisplay = document.getElementById("selectedDateDisplay");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const calendar = document.querySelector(".calendar");

let currentDate = new Date();
let selectedDate = null;

// Limit navigation ±10 years from current year
const currentYear = new Date().getFullYear();
const minYear = currentYear - 10;
const maxYear = currentYear + 10;

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthYear.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  calendarDates.innerHTML = "";
  calendarDates.classList.add("fade-in");
  setTimeout(() => calendarDates.classList.remove("fade-in"), 300);

  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("empty");
    calendarDates.appendChild(emptyDiv);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = day;
    dayDiv.tabIndex = 0;
    dayDiv.setAttribute("role", "gridcell");
    dayDiv.setAttribute("aria-label", `${monthNames[month]} ${day}, ${year}`);

    // Highlight today's date
    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayDiv.classList.add("today");
    }

    // Highlight selected date
    if (
      selectedDate &&
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    ) {
      dayDiv.classList.add("selected");
    }

    dayDiv.onclick = () => {
      selectedDate = new Date(year, month, day);
      renderCalendar(currentDate);
      displaySelectedDate();
    };

    dayDiv.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dayDiv.click();
      }
    };

    calendarDates.appendChild(dayDiv);
  }

  updateNavButtons(year, month);
}

function updateNavButtons(year, month) {
  const prevMonthDate = new Date(year, month - 1);
  const nextMonthDate = new Date(year, month + 1);

  prevBtn.disabled = prevMonthDate.getFullYear() < minYear;
  nextBtn.disabled = nextMonthDate.getFullYear() > maxYear;
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
}

function displaySelectedDate() {
  if (!selectedDate) {
    selectedDateDisplay.textContent = "";
    return;
  }
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  selectedDateDisplay.textContent = `Selected Date: ${selectedDate.toLocaleDateString(undefined, options)}`;
}

// Keyboard navigation: left/right to prev/next month
calendar.addEventListener('keydown', e => {
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (!prevBtn.disabled) prevMonth();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    if (!nextBtn.disabled) nextMonth();
  }
});

prevBtn.addEventListener("click", prevMonth);
nextBtn.addEventListener("click", nextMonth);

renderCalendar(currentDate);
displaySelectedDate();

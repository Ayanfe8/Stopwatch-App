let startTime = 0,
  elapsedTime = 0,
  timerInterval,
  isRunning = false,
  lapCounter = 0;
const laps = [];

// Elements
const $ = (id) => document.getElementById(id);
const hmsDisplay = $("hms-display");
const msDisplay = $("ms-display");
const startBtn = $("start-btn");
const stopBtn = $("stop-btn");
const resetBtn = $("reset-btn");
const lapBtn = $("lap-btn");
const lapList = $("lap-list");
const themeToggle = $("theme-toggle");
const toggleIcon = $("toggle-icon");

// Helpers
const pad = (n, d = 2) => String(n).padStart(d, "0");
const formatTime = (ms) => {
  const totalSec = Math.floor(ms / 1000);
  return {
    hms: `${pad(Math.floor(totalSec / 3600))}:${pad(
      Math.floor(totalSec / 60) % 60
    )}:${pad(totalSec % 60)}`,
    ms: `.${pad(Math.floor((ms % 1000) / 10))}`,
  };
};
const updateDisplay = () => {
  const time = isRunning ? elapsedTime + (Date.now() - startTime) : elapsedTime;
  const { hms, ms } = formatTime(time);
  hmsDisplay.textContent = hms;
  msDisplay.textContent = ms;
};
const setButtons = (running) => {
  startBtn.disabled = running;
  stopBtn.disabled = !running;
  lapBtn.disabled = !running;
};

// Core functions
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startTime = Date.now();
  timerInterval = setInterval(() => {
    elapsedTime += Date.now() - startTime;
    startTime = Date.now();
    updateDisplay();
  }, 10);
  setButtons(true);
}
function stopTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(timerInterval);
  setButtons(false);
}
function resetTimer() {
  stopTimer();
  startTime = elapsedTime = lapCounter = 0;
  laps.length = 0;
  hmsDisplay.textContent = "00:00:00";
  msDisplay.textContent = ".00";
  lapList.innerHTML = "";
}
function recordLap() {
  if (!isRunning) return;
  lapCounter++;
  const current = elapsedTime + (Date.now() - startTime);
  const prev = laps.length ? laps[laps.length - 1].time : 0;
  const split = current - prev;
  const total = formatTime(current),
    splitFmt = formatTime(split);

  laps.push({ number: lapCounter, time: current });
  const li = document.createElement("li");
  li.className = "lap-item";
  li.innerHTML = `
    <span class="lap-number">Lap ${lapCounter}</span>
    <span class="lap-split">Split: ${splitFmt.hms}${splitFmt.ms}</span>
    <span class="lap-total">${total.hms}${total.ms}</span>`;
  lapList.prepend(li);
}
function toggleTheme() {
  const light = document.body.classList.toggle("light-theme");
  document.body.classList.toggle("dark-theme", !light);
  toggleIcon.innerHTML = light
    ? `<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
       <path d="M3 12h1m16 0h1m-10 4v1m0 -10v1m-4 8l-0.5 0.5m10 -11l-0.5 0.5m-11 4l0.5 -0.5m11 -1l-0.5 -0.5"></path>`
    : `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>`;
}

// Event listeners
startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", recordLap);
themeToggle.addEventListener("click", toggleTheme);

// Initial state
setButtons(false);

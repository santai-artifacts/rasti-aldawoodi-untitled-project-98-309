const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const tzEl   = document.getElementById('tz');

function pad(n) { return String(n).padStart(2, '0'); }

function buildTimeHTML(h, m, s) {
  // Wrap colons in spans so CSS can pulse them
  return `${pad(h)}<span class="colon">:</span>${pad(m)}<span class="colon">:</span>${pad(s)}`;
}

function tick() {
  const now = new Date();

  timeEl.innerHTML = buildTimeHTML(now.getHours(), now.getMinutes(), now.getSeconds());

  const dayName   = DAYS[now.getDay()];
  const monthName = MONTHS[now.getMonth()];
  dateEl.textContent = `${dayName}, ${monthName} ${now.getDate()}, ${now.getFullYear()}`;

  const tzName   = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offset   = -now.getTimezoneOffset();          // minutes, positive = ahead of UTC
  const sign     = offset >= 0 ? '+' : '−';
  const absOff   = Math.abs(offset);
  const offStr   = `${pad(Math.floor(absOff / 60))}:${pad(absOff % 60)}`;
  tzEl.textContent = `${tzName} · UTC${sign}${offStr}`;
}

tick();
// Sync subsequent ticks to the top of each second
setTimeout(() => { tick(); setInterval(tick, 1000); }, 1000 - (Date.now() % 1000));

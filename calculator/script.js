let display = '0';
let prev = null;
let operator = null;
let fresh = false;   // next key starts a new number
let expression = '';

const displayEl    = document.getElementById('display');
const expressionEl = document.getElementById('expression');

const OP_LABEL = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function render() {
  let val = display;
  if (val !== 'Error' && val.length > 12) {
    const n = parseFloat(val);
    if (isFinite(n)) val = parseFloat(n.toPrecision(10)).toString();
  }
  displayEl.textContent = val;
  expressionEl.textContent = expression;

  // highlight active operator
  document.querySelectorAll('.btn-op').forEach(b => b.classList.remove('active'));
  if (operator && fresh) {
    document.querySelectorAll('.btn-op').forEach(b => {
      if (b.textContent.trim() === OP_LABEL[operator]) b.classList.add('active');
    });
  }
}

function inputDigit(d) {
  if (display === 'Error') { display = d; fresh = false; render(); return; }
  if (fresh) { display = d; fresh = false; }
  else       { display = display === '0' ? d : display + d; }
  if (display.length > 15) display = display.slice(0, 15);
  render();
}

function inputDot() {
  if (display === 'Error') { display = '0.'; fresh = false; render(); return; }
  if (fresh) { display = '0.'; fresh = false; }
  else if (!display.includes('.')) display += '.';
  render();
}

function setOp(op) {
  if (operator && !fresh) compute(true);   // chain operations
  prev = parseFloat(display);
  operator = op;
  fresh = true;
  expression = `${prev} ${OP_LABEL[op]}`;
  render();
}

function compute(chaining = false) {
  if (operator === null) return;
  if (fresh && !chaining) return;

  const cur = parseFloat(display);
  let result;
  switch (operator) {
    case '+': result = prev + cur; break;
    case '-': result = prev - cur; break;
    case '*': result = prev * cur; break;
    case '/': result = cur === 0 ? NaN : prev / cur; break;
  }

  if (!chaining) {
    expression = `${prev} ${OP_LABEL[operator]} ${cur} =`;
  }

  if (isNaN(result) || !isFinite(result)) {
    display = 'Error';
  } else {
    display = parseFloat(result.toPrecision(12)).toString();
  }

  prev = null;
  operator = null;
  fresh = true;
  render();
}

function clear() {
  display = '0'; prev = null; operator = null; fresh = false; expression = '';
  render();
}

function negate() {
  if (display === 'Error' || display === '0') return;
  display = display.startsWith('-') ? display.slice(1) : '-' + display;
  render();
}

function percent() {
  if (display === 'Error') return;
  display = parseFloat((parseFloat(display) / 100).toPrecision(12)).toString();
  render();
}

function backspace() {
  if (fresh || display === 'Error') { clear(); return; }
  display = display.length > 1 ? display.slice(0, -1) : '0';
  render();
}

// Button clicks
document.querySelector('.buttons').addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const { action, digit, op } = btn.dataset;
  if      (action === 'digit')   inputDigit(digit);
  else if (action === 'dot')     inputDot();
  else if (action === 'op')      setOp(op);
  else if (action === 'equals')  compute();
  else if (action === 'clear')   clear();
  else if (action === 'negate')  negate();
  else if (action === 'percent') percent();
});

// Keyboard support
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9')    inputDigit(e.key);
  else if (e.key === '.')              inputDot();
  else if (e.key === '+')              setOp('+');
  else if (e.key === '-')              setOp('-');
  else if (e.key === '*')              setOp('*');
  else if (e.key === '/')              { e.preventDefault(); setOp('/'); }
  else if (e.key === 'Enter' || e.key === '=') compute();
  else if (e.key === 'Escape')         clear();
  else if (e.key === 'Backspace')      backspace();
  else if (e.key === '%')              percent();
});

render();

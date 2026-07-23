let tasks  = [];
let filter = 'all';
let nextId = 1;

const listEl  = document.getElementById('task-list');
const inputEl = document.getElementById('new-task');
const countEl = document.getElementById('count');

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function render() {
  const visible = tasks.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'done')   return  t.done;
    return true;
  });

  if (visible.length === 0) {
    listEl.innerHTML = `<li class="empty-msg">${
      filter === 'all'    ? 'No tasks yet — add one above.' :
      filter === 'active' ? 'Nothing active right now.' :
                            'Nothing completed yet.'
    }</li>`;
  } else {
    listEl.innerHTML = visible.map(t => `
      <li class="task-item${t.done ? ' done' : ''}" data-id="${t.id}">
        <div class="check" data-toggle="${t.id}" role="checkbox"
             aria-checked="${t.done}" tabindex="0" aria-label="Toggle done">
          <div class="check-icon"></div>
        </div>
        <span class="task-text">${esc(t.text)}</span>
        <button class="delete-btn" data-delete="${t.id}" aria-label="Delete task">×</button>
      </li>
    `).join('');
  }

  const active = tasks.filter(t => !t.done).length;
  countEl.textContent = `${active} left`;
}

function addTask() {
  const text = inputEl.value.trim();
  if (!text) return;
  tasks.push({ id: nextId++, text, done: false });
  inputEl.value = '';
  render();
}

// Delegated events on list
listEl.addEventListener('click', e => {
  const toggleEl = e.target.closest('[data-toggle]');
  const deleteEl = e.target.closest('[data-delete]');
  if (toggleEl) {
    const t = tasks.find(t => t.id === Number(toggleEl.dataset.toggle));
    if (t) { t.done = !t.done; render(); }
  } else if (deleteEl) {
    tasks = tasks.filter(t => t.id !== Number(deleteEl.dataset.delete));
    render();
  }
});

listEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    const toggleEl = e.target.closest('[data-toggle]');
    if (toggleEl) { toggleEl.click(); e.preventDefault(); }
  }
});

document.getElementById('add-btn').addEventListener('click', addTask);

inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

document.getElementById('clear-done').addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  render();
});

// Seed a couple of tasks so the app doesn't look empty on first load
tasks.push({ id: nextId++, text: 'Buy groceries', done: false });
tasks.push({ id: nextId++, text: 'Read for 20 minutes', done: true });
tasks.push({ id: nextId++, text: 'Go for a walk', done: false });

render();

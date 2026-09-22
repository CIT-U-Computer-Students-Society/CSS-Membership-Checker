let members = {};

const form = document.getElementById('check-form');
const input = document.getElementById('id-input');
const statusLine = document.getElementById('status-line');
const submitBtn = form.querySelector('button');

const resultActive = document.getElementById('result-active');
const resultPending = document.getElementById('result-pending');
const resultNotFound = document.getElementById('result-not-found');

function hideAllResults() {
  resultActive.classList.remove('show');
  resultPending.classList.remove('show');
  resultNotFound.classList.remove('show');
}

function normalizeId(raw) {
  return raw.trim().toUpperCase();
}

async function loadData() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('Failed to load data.json');
    const records = await res.json();
    records.forEach((r) => {
      members[normalizeId(r.id)] = r;
    });
    statusLine.textContent = 'Type your ID number to check your status.';
    submitBtn.disabled = false;
  } catch (err) {
    statusLine.textContent = 'Could not load member records. Please refresh or try again later.';
    submitBtn.disabled = true;
  }
}

function showActive(record) {
  document.getElementById('active-name').textContent = record.name;
  document.getElementById('active-id').textContent = 'ID ' + record.id;
  document.getElementById('active-since').textContent = record.memberSince || '—';
  document.getElementById('active-program').textContent = record.program || '—';
  document.getElementById('active-yr').textContent = record.year || '—';
  hideAllResults();
  resultActive.classList.add('show');
}

function showPending(record) {
  document.getElementById('pending-name').textContent = record.name;
  document.getElementById('pending-id').textContent = 'ID ' + record.id;
  hideAllResults();
  resultPending.classList.add('show');
}

function showNotFound() {
  hideAllResults();
  resultNotFound.classList.add('show');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = normalizeId(input.value);
  if (!id) return;
  const record = members[id];
  if (!record) {
    showNotFound();
  } else if (record.status === 'active') {
    showActive(record);
  } else {
    showPending(record);
  }
});

submitBtn.disabled = true;
loadData();

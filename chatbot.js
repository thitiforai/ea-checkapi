// ===== GOOGLE SHEET API =====
const SHEET_API = 'https://sheetdb.io/api/v1/rnzgcs6kgmmoz';
let QA_DATA = [];

async function loadQAFromSheet() {
  try {
    const res = await fetch(SHEET_API);
    const data = await res.json();
    QA_DATA = data.map(row => ({
      keywords: [row.keyword.toLowerCase()],
      answer: row.answer
    }));
  } catch (e) {
    console.error('โหลดข้อมูลไม่ได้:', e);
  }
}

// ===== RENDER CHECKLIST =====
function renderChecklist() {
  const container = document.getElementById('checklist');
  CHECKLIST_ITEMS.forEach(item => {
    const div = document.createElement('div');
    div.className = 'checklist-item';
    div.id = `item-${item.id}`;
    div.innerHTML = `
      <input type="checkbox" id="chk-${item.id}" 
             onchange="toggleItem(${item.id})" />
      <label for="chk-${item.id}">${item.text}</label>
    `;
    container.appendChild(div);
  });
  updateProgress();
}

function toggleItem(id) {
  const div = document.getElementById(`item-${id}`);
  const chk = document.getElementById(`chk-${id}`);
  div.classList.toggle('done', chk.checked);
  updateProgress();
}

function updateProgress() {
  const total = CHECKLIST_ITEMS.length;
  const checked = document.querySelectorAll('.checklist input:checked').length;
  const pct = total ? (checked / total * 100) : 0;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressText').textContent = `${checked} / ${total} รายการ`;
}

// ===== CHATBOT =====
function toggleChat() {
  const win = document.getElementById('chatWindow');
  win.classList.toggle('open');
}

async function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  input.value = '';

  if (QA_DATA.length === 0) await loadQAFromSheet();

  setTimeout(() => {
    const reply = getReply(text);
    appendMessage(reply, 'bot');
  }, 400);
}

function appendMessage(text, who) {
  const box = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${who}`;

  if (who === 'bot') {
    div.innerHTML = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  } else {
    div.textContent = text;
  }

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function getReply(text) {
  const lower = text.toLowerCase();
  for (const qa of QA_DATA) {
    if (qa.keywords.some(k => lower.includes(k))) {
      return qa.answer;
    }
  }
  return "ขอโทษนะครับ ยังไม่มีข้อมูลตรงนี้ ลองถามเรื่อง EA, TOGAF, หรือการเตรียมสอบได้เลยครับ 😊";
}

// ===== INIT =====
renderChecklist();
loadQAFromSheet();

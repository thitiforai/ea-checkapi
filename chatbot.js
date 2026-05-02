// ===== GOOGLE SHEET API =====
const SHEET_API = 'https://sheetdb.io/api/v1/rnzgcs6kgmmoz';
let QA_DATA = []; // ไม่ประกาศซ้ำใน data.js แล้ว
let isLoading = false;
let lastLoadedAt = null; // ✅ เพิ่มบรรทัดนี้

async function loadQAFromSheet() {
  const SYNC_INTERVAL = 1800 * 60 * 1000; // 90 นาที (ms)
  const now = Date.now();
  // ✅ แก้บรรทัดนี้ — โหลดซ้ำถ้าเกิน 90 นาที หรือยังไม่เคยโหลด
  if (isLoading || (QA_DATA.length > 0 && lastLoadedAt && now - lastLoadedAt < SYNC_INTERVAL)) return;
  isLoading = true; 
  try {
    const res = await fetch(SHEET_API);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    QA_DATA = data.map(row => ({
      keywords: row.keyword.toLowerCase().split(',').map(k => k.trim()),
      answer: row.answer
    }));
    lastLoadedAt = Date.now(); // ✅ เพิ่มบรรทัดนี้
    console.log(`✅ โหลด QA สำเร็จ ${QA_DATA.length} รายการ | ${new Date().toLocaleTimeString()}`);
  } catch (e) {
    console.warn('⚠️ โหลด Sheet ไม่ได้ ใช้ Fallback แทน:', e);
    QA_DATA = QA_FALLBACK;
  } finally {
    isLoading = false;
  }
}

// ===== RENDER CHECKLIST =====
function renderChecklist() {
  const container = document.getElementById('checklist');
  if (!container) return;
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
  if (!div || !chk) return;
  div.classList.toggle('done', chk.checked);
  updateProgress();
}

function updateProgress() {
  const total = CHECKLIST_ITEMS.length;
  const checked = document.querySelectorAll('.checklist input:checked').length;
  const pct = total ? Math.round(checked / total * 100) : 0;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressText').textContent = `${checked} / ${total} รายการ`;
}

// ===== CHATBOT =====
function toggleChat() {
  const win = document.getElementById('chatWindow');
  if (!win) return;
  win.classList.toggle('open');
}

async function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  input.value = '';
  input.disabled = true;

  const typingId = showTyping();

  if (QA_DATA.length === 0) await loadQAFromSheet();

  setTimeout(() => {
    removeTyping(typingId);
    const reply = getReply(text);
    appendMessage(reply, 'bot');
    input.disabled = false;
    input.focus();
  }, 600);
}

function showTyping() {
  const box = document.getElementById('chatMessages');
  const div = document.createElement('div');
  const id = 'typing-' + Date.now();
  div.className = 'msg bot typing';
  div.id = id;
  div.innerHTML = '<span>.</span><span>.</span><span>.</span>';
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
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

// รองรับกด Enter ส่งข้อความ
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('userInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});

// ===== INIT =====
renderChecklist();
loadQAFromSheet();
setInterval(loadQAFromSheet, 90 * 60 * 1000); // ✅ เพิ่มบรรทัดนี้ — Sync ทุก 90 นาที

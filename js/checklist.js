// Логика чек-листа

const CHECKLIST_ITEMS = [
  { cat: 'Пароли и аккаунты', text: 'Включите двухфакторную аутентификацию (2FA) на главных аккаунтах' },
  { cat: 'Пароли и аккаунты', text: 'Используйте менеджер паролей (Bitwarden, 1Password)' },
  { cat: 'Пароли и аккаунты', text: 'Не используйте один пароль на разных сайтах' },
  { cat: 'Соглашения', text: 'Перед галочкой "Согласен" — пролистайте до конца' },
  { cat: 'Соглашения', text: 'Ищите подозрительные пункты: передача данных, ответственность, изменения условий' },
  { cat: 'Соглашения', text: 'Не подписывайте "лицензии" в обмен на вай-фай или скидку' },
  { cat: 'Cookies и трекинг', text: 'В cookie-баннерах жмите "Отклонить" или "Только необходимые"' },
  { cat: 'Cookies и трекинг', text: 'Регулярно чистите cookies в браузере' },
  { cat: 'Cookies и трекинг', text: 'Используйте режим "Инкогнито" для чувствительных запросов' },
  { cat: 'Приложения', text: 'Проверяйте разрешения: фонарику не нужны контакты' },
  { cat: 'Приложения', text: 'Удаляйте приложения, которыми не пользуетесь' },
  { cat: 'Приложения', text: 'Скачивайте только из официальных магазинов' },
  { cat: 'Общая гигиена', text: 'Не публикуйте посадочные талоны, паспорта, билеты в соцсетях' },
  { cat: 'Общая гигиена', text: 'Проверяйте отправителя письма перед переходом по ссылке' },
  { cat: 'Общая гигиена', text: 'Регулярно обновляйте ОС и приложения' }
];

document.addEventListener('DOMContentLoaded', function() {
  const user = requireUser();
  if (!user) return;

  const progress = Storage.getProgress();
  if (!progress.block1 || !progress.block2 || !progress.block3) {
    showToast('Сначала пройдите все 3 раздела', 'warning');
    setTimeout(() => window.location.href = 'dashboard.html', 1500);
    return;
  }

  document.getElementById('userName').textContent = user.name;
  renderChecklist();
  loadCheckedState();
  updateProgress();
});

function renderChecklist() {
  const container = document.getElementById('checklistContainer');
  const categories = {};

  CHECKLIST_ITEMS.forEach((item, idx) => {
    if (!categories[item.cat]) categories[item.cat] = [];
    categories[item.cat].push({ ...item, idx });
  });

  let html = '';
  for (const cat in categories) {
    html += `<h3 class="text-cyan-400 font-semibold text-sm mt-6 mb-3 uppercase tracking-wide">${cat}</h3>`;
    html += '<div class="space-y-2 mb-2">';
    categories[cat].forEach(item => {
      html += `
        <label class="flex items-start gap-3 bg-slate-800 rounded-lg p-3 border border-slate-700 cursor-pointer hover:border-cyan-500/50 transition">
          <input type="checkbox" class="checklist-item mt-1 w-5 h-5 accent-cyan-500 flex-shrink-0" data-idx="${item.idx}" onchange="onCheck()">
          <span class="text-sm text-slate-200">${item.text}</span>
        </label>
      `;
    });
    html += '</div>';
  }

  container.innerHTML = html;
}

function onCheck() {
  saveCheckedState();
  updateProgress();
}

function saveCheckedState() {
  const checked = [];
  document.querySelectorAll('.checklist-item').forEach(el => {
    if (el.checked) checked.push(el.dataset.idx);
  });
  localStorage.setItem('hygiene_checklist', JSON.stringify(checked));
}

function loadCheckedState() {
  const saved = localStorage.getItem('hygiene_checklist');
  if (!saved) return;
  const checked = JSON.parse(saved);
  document.querySelectorAll('.checklist-item').forEach(el => {
    if (checked.includes(el.dataset.idx)) el.checked = true;
  });
}

function updateProgress() {
  const total = CHECKLIST_ITEMS.length;
  const done = document.querySelectorAll('.checklist-item:checked').length;
  document.getElementById('progressText').textContent = `${done} / ${total}`;
  document.getElementById('progressBar').style.width = `${(done / total) * 100}%`;
}

function printChecklist() {
  window.print();
}

function goToDashboard() {
  window.location.href = 'dashboard.html';
}

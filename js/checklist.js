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

// Генерация PDF через Canvas — гарантированно работает с кириллицей
async function savePDF() {
  const btn = document.querySelector('[onclick="savePDF()"]');
  btn.disabled = true;
  btn.textContent = '⏳ Генерация PDF...';

  try {
    // Собираем данные
    const total = CHECKLIST_ITEMS.length;
    const checkedSet = new Set();
    document.querySelectorAll('.checklist-item').forEach(el => {
      if (el.checked) checkedSet.add(parseInt(el.dataset.idx));
    });
    const done = checkedSet.size;

    // Группировка
    const categories = {};
    CHECKLIST_ITEMS.forEach((item, idx) => {
      if (!categories[item.cat]) categories[item.cat] = [];
      categories[item.cat].push({ ...item, idx });
    });

    // Создаём canvas
    const scale = 3;
    const W = 595 * scale;
    const pageH = 842 * scale;
    const margin = 50 * scale;
    const maxTextW = W - margin * 2;

    // Сначала считаем общую высоту
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = W;
    tempCanvas.height = 100;
    const tempCtx = tempCanvas.getContext('2d');

    let totalHeight = margin; // отступ сверху

    // Заголовок + подзаголовок + прогресс
    totalHeight += 30 * scale; // заголовок
    totalHeight += 20 * scale; // подзаголовок
    totalHeight += 25 * scale; // прогресс-бар область
    totalHeight += 15 * scale; // отступ

    // Считаем высоту контента
    for (const cat in categories) {
      totalHeight += 30 * scale; // категория
      categories[cat].forEach(item => {
        tempCtx.font = `${11 * scale}px Arial, sans-serif`;
        const lines = wrapText(tempCtx, item.text, maxTextW - 25 * scale);
        totalHeight += Math.max(lines.length * 14 * scale, 18 * scale) + 8 * scale;
      });
      totalHeight += 5 * scale;
    }

    totalHeight += 30 * scale; // футер
    totalHeight += margin; // отступ снизу

    // Создаём финальный canvas
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = Math.max(totalHeight, pageH);
    const ctx = canvas.getContext('2d');

    // --- Фон ---
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let y = margin;

    // --- Эмодзи ---
    ctx.font = `${28 * scale}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('🎁', W / 2, y + 20 * scale);
    y += 35 * scale;

    // --- Заголовок ---
    ctx.font = `bold ${18 * scale}px Arial, sans-serif`;
    ctx.fillStyle = '#00bcd4';
    ctx.textAlign = 'center';
    ctx.fillText('Чек-лист: 15 шагов', W / 2, y);
    y += 22 * scale;

    // --- Подзаголовок ---
    ctx.font = `${10 * scale}px Arial, sans-serif`;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Цифровая гигиена на каждый день', W / 2, y);
    y += 20 * scale;

    ctx.textAlign = 'left';

    // --- Прогресс-бар ---
    const barX = margin;
    const barW = W - margin * 2;
    const barH = 8 * scale;
    const barRadius = 4 * scale;

    // Текст прогресса
    ctx.font = `${11 * scale}px Arial, sans-serif`;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Выполнено:', barX, y);
    ctx.fillStyle = '#00bcd4';
    ctx.font = `bold ${11 * scale}px Arial, sans-serif`;
    const progressStr = `${done} / ${total}`;
    ctx.fillText(progressStr, barX + ctx.measureText('Выполнено:  ').width, y);
    y += 12 * scale;

    // Фон бар
    ctx.fillStyle = '#1e293b';
    roundRect(ctx, barX, y, barW, barH, barRadius);
    ctx.fill();

    // Заполненный бар
    if (done > 0) {
      ctx.fillStyle = '#06b6d4';
      const fillW = (done / total) * barW;
      roundRect(ctx, barX, y, Math.max(fillW, barRadius * 2), barH, barRadius);
      ctx.fill();
    }

    y += barH + 20 * scale;

    // --- Категории и пункты ---
    for (const cat in categories) {
      // Заголовок категории
      ctx.font = `bold ${11 * scale}px Arial, sans-serif`;
      ctx.fillStyle = '#06b6d4';
      ctx.fillText(cat.toUpperCase(), margin, y);
      y += 18 * scale;

      categories[cat].forEach(item => {
        const isChecked = checkedSet.has(item.idx);
        const rowX = margin;

        // Чекбокс
        const boxSize = 13 * scale;
        const boxY = y - boxSize + 2 * scale;

        if (isChecked) {
          // Заполненный чекбокс
          ctx.fillStyle = '#06b6d4';
          roundRect(ctx, rowX, boxY, boxSize, boxSize, 2 * scale);
          ctx.fill();

          // Галочка
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2 * scale;
          ctx.beginPath();
          ctx.moveTo(rowX + 3 * scale, boxY + boxSize / 2);
          ctx.lineTo(rowX + boxSize / 2 - 1 * scale, boxY + boxSize - 3 * scale);
          ctx.lineTo(rowX + boxSize - 3 * scale, boxY + 3 * scale);
          ctx.stroke();
        } else {
          // Пустой чекбокс
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1.5 * scale;
          roundRectStroke(ctx, rowX, boxY, boxSize, boxSize, 2 * scale);
        }

        // Текст пункта
        const textX = rowX + boxSize + 8 * scale;
        const textMaxW = maxTextW - boxSize - 8 * scale;

        ctx.font = `${11 * scale}px Arial, sans-serif`;
        ctx.fillStyle = isChecked ? '#a5f3fc' : '#cbd5e1';

        const lines = wrapText(ctx, item.text, textMaxW);
        lines.forEach((line, i) => {
          ctx.fillText(line, textX, y + i * 14 * scale);
        });

        y += Math.max(lines.length * 14 * scale, 18 * scale) + 8 * scale;
      });

      y += 5 * scale;
    }

    // --- Футер ---
    y += 10 * scale;
    ctx.font = `${9 * scale}px Arial, sans-serif`;
    ctx.fillStyle = '#64748b';
    ctx.fillText('Сгенерировано: ' + new Date().toLocaleDateString('ru-RU'), margin, y);

    // --- Конвертация в PDF ---
    const { jsPDF } = window.jspdf;
    const imgData = canvas.toDataURL('image/png', 1.0);

    // Считаем сколько страниц A4 нужно
    const pdfW = 210; // мм
    const pdfH = 297; // мм
    const imgAspect = canvas.width / canvas.height;
    const totalPdfH = pdfW / imgAspect * (canvas.height / canvas.width) * canvas.width / W * pdfW;
    const imgHeightMM = (canvas.height / canvas.width) * pdfW;

    const doc = new jsPDF('portrait', 'mm', 'a4');

    if (imgHeightMM <= pdfH) {
      // Всё влезает на одну страницу
      doc.addImage(imgData, 'PNG', 0, 0, pdfW, imgHeightMM);
    } else {
      // Нарезаем на страницы
      const pageCanvasH = (pdfH / imgHeightMM) * canvas.height;
      let srcY = 0;
      let page = 0;

      while (srcY < canvas.height) {
        if (page > 0) doc.addPage();

        const sliceH = Math.min(pageCanvasH, canvas.height - srcY);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceH;
        const sliceCtx = sliceCanvas.getContext('2d');

        // Фон для слайса
        sliceCtx.fillStyle = '#0f172a';
        sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);

        sliceCtx.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

        const sliceData = sliceCanvas.toDataURL('image/png', 1.0);
        const sliceHMM = (sliceH / canvas.width) * pdfW;
        doc.addImage(sliceData, 'PNG', 0, 0, pdfW, sliceHMM);

        srcY += pageCanvasH;
        page++;
      }
    }

    doc.save('checklist-15-shagov.pdf');

  } catch (error) {
    console.error('Ошибка генерации PDF:', error);
    alert('Не удалось создать PDF. Попробуйте ещё раз.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '📥 Скачать PDF';
  }
}

// Вспомогательные функции
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function roundRectStroke(ctx, x, y, w, h, r) {
  roundRect(ctx, x, y, w, h, r);
  ctx.stroke();
}

function goToDashboard() {
  window.location.href = 'dashboard.html';
}

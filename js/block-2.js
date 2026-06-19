// ===== Блок 2: Cookie-баннер =====

// --- Утилиты модалок (локальные для block-2) ---
function showBlock2Modal(id) {
  var m = document.getElementById(id);
  if (!m) {
    console.error('Модалка не найдена:', id);
    return;
  }
  m.classList.remove('hidden');
  m.classList.add('flex');
  console.log('Показана модалка:', id);
}

function hideBlock2Modal(id) {
  var m = document.getElementById(id);
  if (!m) {
    console.error('Модалка не найдена:', id);
    return;
  }
  m.classList.add('hidden');
  m.classList.remove('flex');
  console.log('Скрыта модалка:', id);
}

// --- Кнопка «Принять все» — ошибка ---
function handleAcceptAll() {
  document.getElementById('badChoiceText').textContent =
    'Нажав «Принять все», вы разрешили 247 партнёрам отслеживать вас: какие сайты посещаете, что покупаете, где находитесь.';
  showBlock2Modal('badChoiceModal');
}

// --- Кнопка «Отклонить» — правильный выбор ---
function handleReject() {
  document.getElementById('goodChoiceText').textContent =
    'Вы отказались от необязательных cookies. Сайт по-прежнему будет работать, но 247 партнёров не будут вас отслеживать.';
  document.getElementById('goodChoiceList').innerHTML =
    '<li>• Не повелись на яркую кнопку</li>' +
    '<li>• Нашли скрытую опцию «Отклонить»</li>' +
    '<li>• Защитили свою приватность</li>';
  showBlock2Modal('goodChoiceModal');
  if (typeof completeBlock === 'function') completeBlock(2);
}

// --- Кнопка «Настройки» — открыть модалку ---
function handleSettings() {
  document.getElementById('cookieAnalytics').checked = true;
  document.getElementById('cookieMarketing').checked = true;
  showBlock2Modal('settingsModal');
}

// --- Сохранение настроек ---
function saveSettings() {
  var analytics = document.getElementById('cookieAnalytics').checked;
  var marketing = document.getElementById('cookieMarketing').checked;

  console.log('saveSettings вызван. analytics:', analytics, 'marketing:', marketing);

  hideBlock2Modal('settingsModal');

  // Обе галочки остались включены — ошибка
  if (analytics && marketing) {
    console.log('Обе включены — ошибка');
    document.getElementById('badChoiceText').textContent =
      'Вы оставили все галочки включёнными — это то же самое, что нажать «Принять все». Галочки были предвключены специально — это тёмный паттерн. Нужно было снять лишние!';
    showBlock2Modal('badChoiceModal');
    return;
  }

  // Одна снята, одна нет — частичный успех
  if (analytics || marketing) {
    console.log('Одна включена — частичный успех');
    var still = analytics ? 'аналитику' : 'рекламу';
    document.getElementById('settingsResult').textContent =
      'Вы сняли часть галочек — уже неплохо! Но вы оставили ' + still + '. В идеале лучше отключать все необязательные cookies.';
    showBlock2Modal('settingsResultModal');
    if (typeof completeBlock === 'function') completeBlock(2);
    return;
  }

  // Обе сняты — идеальный результат
  console.log('Обе сняты — идеально');
  document.getElementById('goodChoiceText').textContent =
    'Вы открыли настройки и сняли предвключённые галочки. Сайт работает, а ваши данные защищены.';
  document.getElementById('goodChoiceList').innerHTML =
    '<li>• Не поленились зайти в настройки</li>' +
    '<li>• Заметили предвключённые галочки</li>' +
    '<li>• Сняли ненужные разрешения</li>' +
    '<li>• Защитили свою приватность</li>';
  showBlock2Modal('goodChoiceModal');
  if (typeof completeBlock === 'function') completeBlock(2);
}

// --- Попробовать снова ---
function tryAgain() {
  hideBlock2Modal('badChoiceModal');
  document.getElementById('cookieAnalytics').checked = true;
  document.getElementById('cookieMarketing').checked = true;
}

// --- Навигация ---
function goToNextBlock() {
  window.location.href = 'block-3.html';
}

function goToDashboard() {
  window.location.href = 'dashboard.html';
}

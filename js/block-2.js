// ===== Блок 2: Cookie-баннер =====

// --- Утилиты модалок ---
function showModal(id) {
  const m = document.getElementById(id);
  m.classList.remove('hidden');
  m.classList.add('flex');
}

function hideModal(id) {
  const m = document.getElementById(id);
  m.classList.add('hidden');
  m.classList.remove('flex');
}

// --- Кнопка «Принять все» — ошибка ---
function handleAcceptAll() {
  document.getElementById('badChoiceText').textContent =
    'Нажав «Принять все», вы разрешили 247 партнёрам отслеживать вас: какие сайты посещаете, что покупаете, где находитесь.';
  showModal('badChoiceModal');
}

// --- Кнопка «Отклонить» — правильный выбор ---
function handleReject() {
  document.getElementById('goodChoiceText').textContent =
    'Вы отказались от необязательных cookies. Сайт по-прежнему будет работать, но 247 партнёров не будут вас отслеживать.';
  document.getElementById('goodChoiceList').innerHTML = `
    <li>• Не повелись на яркую кнопку</li>
    <li>• Нашли скрытую опцию «Отклонить»</li>
    <li>• Защитили свою приватность</li>
  `;
  showModal('goodChoiceModal');
  if (typeof completeBlock === 'function') completeBlock(2);
}

// --- Кнопка «Настройки» — открыть модалку ---
function handleSettings() {
  // Сбрасываем галочки обратно во «включено» при каждом открытии
  document.getElementById('cookieAnalytics').checked = true;
  document.getElementById('cookieMarketing').checked = true;
  showModal('settingsModal');
}

// --- Сохранение настроек ---
function saveSettings() {
  const analytics = document.getElementById('cookieAnalytics').checked;
  const marketing = document.getElementById('cookieMarketing').checked;

  hideModal('settingsModal');

  // Обе галочки остались включены — ошибка (тёмный паттерн сработал)
  if (analytics && marketing) {
    document.getElementById('badChoiceText').textContent =
      'Вы оставили все галочки включёнными — это то же самое, что нажать «Принять все». Галочки были предвключены специально — это тёмный паттерн. Нужно было снять лишние!';
    showModal('badChoiceModal');
    return;
  }

  // Одна снята, одна нет — частичный успех
  if (analytics || marketing) {
    const still = analytics ? 'аналитику' : 'рекламу';
    document.getElementById('settingsResult').textContent =
      'Вы сняли часть галочек — уже неплохо! Но вы оставили ' + still + '. В идеале лучше отключать все необязательные cookies.';
    showModal('settingsResultModal');
    if (typeof completeBlock === 'function') completeBlock(2);
    return;
  }

  // Обе сняты — идеальный результат
  document.getElementById('goodChoiceText').textContent =
    'Вы открыли настройки и сняли предвключённые галочки. Сайт работает, а ваши данные защищены.';
  document.getElementById('goodChoiceList').innerHTML = `
    <li>• Не поленились зайти в настройки</li>
    <li>• Заметили предвключённые галочки</li>
    <li>• Сняли ненужные разрешения</li>
    <li>• Защитили свою приватность</li>
  `;
  showModal('goodChoiceModal');
  if (typeof completeBlock === 'function') completeBlock(2);
}

// --- Попробовать снова ---
function tryAgain() {
  hideModal('badChoiceModal');
  // Сбрасываем галочки обратно
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

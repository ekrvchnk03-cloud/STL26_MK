// ===== Блок 2: Cookie-баннер =====

// --- Безопасное завершение блока ---
function safeCompleteBlock(n) {
  try {
    if (typeof completeBlock === 'function') {
      completeBlock(n);
    } else if (typeof Storage !== 'undefined' && typeof Storage.setBlockComplete === 'function') {
      Storage.setBlockComplete(n);
    } else {
      // Fallback — сохраняем напрямую в localStorage
      var key = 'block_' + n + '_complete';
      localStorage.setItem(key, 'true');
      console.log('Блок ' + n + ' завершён (fallback)');
    }
  } catch (e) {
    console.warn('Не удалось сохранить прогресс:', e);
  }
}

// --- Утилиты модалок ---
function showBlock2Modal(id) {
  var m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('hidden');
  m.classList.add('flex');
}

function hideBlock2Modal(id) {
  var m = document.getElementById(id);
  if (!m) return;
  m.classList.add('hidden');
  m.classList.remove('flex');
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
  safeCompleteBlock(2);
}

// --- Кнопка «Настройки» ---
function handleSettings() {
  document.getElementById('cookieAnalytics').checked = true;
  document.getElementById('cookieMarketing').checked = true;
  showBlock2Modal('settingsModal');
}

// --- Сохранение настроек ---
function saveSettings() {
  var analytics = document.getElementById('cookieAnalytics').checked;
  var marketing = document.getElementById('cookieMarketing').checked;

  hideBlock2Modal('settingsModal');

  // Обе включены — ошибка
  if (analytics && marketing) {
    document.getElementById('badChoiceText').textContent =
      'Вы оставили все галочки включёнными — это то же самое, что нажать «Принять все». Галочки были предвключены специально — это тёмный паттерн. Нужно было снять лишние!';
    showBlock2Modal('badChoiceModal');
    return;
  }

  // Одна снята — частичный успех
  if (analytics || marketing) {
    var still = analytics ? 'аналитику' : 'рекламу';
    document.getElementById('settingsResult').textContent =
      'Вы сняли часть галочек — уже неплохо! Но вы оставили ' + still + '. В идеале лучше отключать все необязательные cookies.';
    showBlock2Modal('settingsResultModal');
    safeCompleteBlock(2);
    return;
  }

  // Обе сняты — идеально
  document.getElementById('goodChoiceText').textContent =
    'Вы открыли настройки и сняли предвключённые галочки. Сайт работает, а ваши данные защищены.';
  document.getElementById('goodChoiceList').innerHTML =
    '<li>• Не поленились зайти в настройки</li>' +
    '<li>• Заметили предвключённые галочки</li>' +
    '<li>• Сняли ненужные разрешения</li>' +
    '<li>• Защитили свою приватность</li>';
  showBlock2Modal('goodChoiceModal');
  safeCompleteBlock(2);
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

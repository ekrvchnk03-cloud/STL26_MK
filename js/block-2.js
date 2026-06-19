// Логика раздела 2 — Cookie-баннер

document.addEventListener('DOMContentLoaded', function() {
  const user = requireUser();
  if (!user) return;

  if (!Storage.isBlockAvailable(2)) {
    showToast('Сначала пройдите раздел 1', 'warning');
    setTimeout(() => window.location.href = 'dashboard.html', 1500);
    return;
  }

  if (Storage.getProgress().block2) {
    document.getElementById('alreadyDone').classList.remove('hidden');
  }
});

function handleAcceptAll() {
  document.getElementById('cookieBanner').classList.add('hidden');
  document.getElementById('badChoiceModal').classList.remove('hidden');
  document.getElementById('badChoiceModal').classList.add('flex');
}

function handleReject() {
  document.getElementById('cookieBanner').classList.add('hidden');
  Storage.setBlockComplete(2);
  document.getElementById('goodChoiceModal').classList.remove('hidden');
  document.getElementById('goodChoiceModal').classList.add('flex');
}

function handleSettings() {
  document.getElementById('cookieBanner').classList.add('hidden');
  document.getElementById('settingsModal').classList.remove('hidden');
  document.getElementById('settingsModal').classList.add('flex');
}

function saveSettings() {
  const analytics = document.getElementById('cookieAnalytics').checked;
  const marketing = document.getElementById('cookieMarketing').checked;

  document.getElementById('settingsModal').classList.add('hidden');
  document.getElementById('settingsModal').classList.remove('flex');

  Storage.setBlockComplete(2);

  let message;
  if (!analytics && !marketing) {
    message = 'Отличный выбор! Вы отключили все необязательные cookies.';
  } else if (analytics && marketing) {
    message = 'Вы разрешили все cookies. В реальности лучше отключать ненужные.';
  } else {
    message = 'Хороший компромисс. Вы сами решаете, что разрешать.';
  }

  document.getElementById('settingsResult').textContent = message;
  document.getElementById('settingsResultModal').classList.remove('hidden');
  document.getElementById('settingsResultModal').classList.add('flex');
}

function tryAgain() {
  document.getElementById('badChoiceModal').classList.add('hidden');
  document.getElementById('badChoiceModal').classList.remove('flex');
  document.getElementById('cookieBanner').classList.remove('hidden');
}

function goToDashboard() {
  window.location.href = 'dashboard.html';
}

function goToNextBlock() {
  window.location.href = 'block-3.html';
}

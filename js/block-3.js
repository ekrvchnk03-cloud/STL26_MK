// Логика раздела 3 — Разрешения приложений

const SCENARIOS = [
  {
    icon: '🔦',
    app: 'Фонарик Pro',
    permission: 'Доступ к контактам',
    description: 'Приложение "Фонарик Pro" запрашивает доступ к вашим контактам.',
    correct: 'deny',
    explanation: 'Фонарику не нужны ваши контакты! Это классический пример сбора лишних данных. Такие приложения часто продают контакты рекламодателям.'
  },
  {
    icon: '🗺️',
    app: 'Карты',
    permission: 'Доступ к геолокации',
    description: 'Приложение "Карты" запрашивает доступ к вашему местоположению для построения маршрутов.',
    correct: 'allow',
    explanation: 'Это логично: картам нужна геолокация для работы. Но лучше выбрать "Только при использовании", а не "Всегда".'
  },
  {
    icon: '🎮',
    app: 'Весёлая игра',
    permission: 'Доступ к микрофону',
    description: 'Бесплатная игра-головоломка запрашивает доступ к микрофону.',
    correct: 'deny',
    explanation: 'Игре-головоломке микрофон не нужен. Возможно, приложение собирает аудиоданные для рекламного таргетинга.'
  },
  {
    icon: '💬',
    app: 'Мессенджер',
    permission: 'Доступ к камере',
    description: 'Мессенджер запрашивает доступ к камере, чтобы вы могли отправлять фото и видеозвонки.',
    correct: 'allow',
    explanation: 'Это оправдано: без камеры не получится сделать видеозвонок или отправить фото. Но проверьте в настройках, что разрешение действует только когда вы сами вызываете камеру.'
  },
  {
    icon: '🧘',
    app: 'Медитация',
    permission: 'Доступ ко всем файлам',
    description: 'Приложение для медитации просит полный доступ ко всем файлам на телефоне.',
    correct: 'deny',
    explanation: 'Медитации не нужны ваши файлы! Это подозрительный запрос. Возможно, приложение собирает данные для продажи или используется для слежки.'
  }
];

let currentIndex = 0;
let correctAnswers = 0;

document.addEventListener('DOMContentLoaded', function() {
  const user = requireUser();
  if (!user) return;

  if (!Storage.isBlockAvailable(3)) {
    showToast('Сначала пройдите раздел 2', 'warning');
    setTimeout(() => window.location.href = 'dashboard.html', 1500);
    return;
  }

  if (Storage.getProgress().block3) {
    document.getElementById('alreadyDone').classList.remove('hidden');
  }

  renderScenario();
});

function renderScenario() {
  const s = SCENARIOS[currentIndex];

  document.getElementById('scenarioCounter').textContent = `Ситуация ${currentIndex + 1} из ${SCENARIOS.length}`;
  document.getElementById('progressBar').style.width = `${((currentIndex) / SCENARIOS.length) * 100}%`;

  document.getElementById('appIcon').textContent = s.icon;
  document.getElementById('appName').textContent = s.app;
  document.getElementById('permissionName').textContent = s.permission;
  document.getElementById('scenarioDesc').textContent = s.description;

  document.getElementById('scenarioCard').classList.remove('hidden');
  document.getElementById('feedbackCard').classList.add('hidden');
}

function answer(choice) {
  const s = SCENARIOS[currentIndex];
  const isCorrect = choice === s.correct;

  if (isCorrect) correctAnswers++;

  document.getElementById('scenarioCard').classList.add('hidden');
  document.getElementById('feedbackCard').classList.remove('hidden');

  const icon = document.getElementById('feedbackIcon');
  const title = document.getElementById('feedbackTitle');
  const text = document.getElementById('feedbackText');
  const card = document.getElementById('feedbackCard');

  card.classList.remove('border-green-500/50', 'border-red-500/50');

  if (isCorrect) {
    icon.textContent = '✅';
    title.textContent = 'Верно!';
    card.classList.add('border-green-500/50');
  } else {
    icon.textContent = '❌';
    title.textContent = 'Не совсем';
    card.classList.add('border-red-500/50');
  }

  text.textContent = s.explanation;

  const btn = document.getElementById('nextBtn');
  if (currentIndex < SCENARIOS.length - 1) {
    btn.textContent = 'Следующая ситуация →';
  } else {
    btn.textContent = 'Посмотреть результат →';
  }
}

function nextScenario() {
  currentIndex++;
  if (currentIndex >= SCENARIOS.length) {
    showFinal();
    return;
  }
  renderScenario();
}

function showFinal() {
  Storage.setBlockComplete(3);

  document.getElementById('scenarioCard').classList.add('hidden');
  document.getElementById('feedbackCard').classList.add('hidden');
  document.getElementById('finalCard').classList.remove('hidden');

  document.getElementById('progressBar').style.width = '100%';
  document.getElementById('scenarioCounter').textContent = 'Готово!';

  const score = `${correctAnswers} / ${SCENARIOS.length}`;
  document.getElementById('finalScore').textContent = score;

  let message;
  if (correctAnswers === 5) {
    message = 'Идеально! Вы отлично понимаете, какие разрешения логичны, а какие — подозрительны.';
  } else if (correctAnswers >= 3) {
    message = 'Хороший результат! Главное правило: разрешение должно соответствовать функции приложения.';
  } else {
    message = 'Есть над чем поработать. Главное правило: разрешение должно соответствовать функции приложения. Фонарику не нужны контакты, игре — микрофон.';
  }

  document.getElementById('finalMessage').textContent = message;
}

function goToDashboard() {
  window.location.href = 'dashboard.html';
}

function goToChecklist() {
  window.location.href = 'checklist.html';
}

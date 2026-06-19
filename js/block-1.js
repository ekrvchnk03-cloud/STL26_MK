// Логика раздела 1 — поиск подвохов в соглашении

const SUSPICIOUS_ITEMS = {
  'trap-7-3': {
    title: 'Пункт 7.3 — передача смартфона',
    explanation: 'Это юридическая ловушка! Внутри длинного "обычного" соглашения спрятан пункт о безвозмездной передаче вашего смартфона. Подписав, вы формально соглашаетесь.'
  },
  'trap-8-3': {
    title: 'Пункт 8.3 — ответственность ограничена 100 рублей',
    explanation: 'Организатор ограничивает свою ответственность смешной суммой в 100 рублей. Даже если он сольёт ваши данные — больше 100₽ с него не взыскать.'
  },
  'trap-2-4': {
    title: 'Пункт 2.4 — изменение условий без уведомления',
    explanation: 'Организатор может в любой момент изменить условия — и обязан только разместить новую версию. Вы сами должны следить за изменениями.'
  }
};

let foundTraps = [];

document.addEventListener('DOMContentLoaded', function() {
  const user = requireUser();
  if (!user) return;

  if (Storage.getProgress().block1) {
    document.getElementById('alreadyDone').classList.remove('hidden');
  }

  document.querySelectorAll('.suspicious').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function() {
      handleSuspiciousClick(this);
    });
  });

  document.querySelectorAll('.fake-trap').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function() {
      handleFakeClick(this);
    });
  });
});

function handleSuspiciousClick(el) {
  const id = el.dataset.trap;
  if (foundTraps.includes(id)) return;

  foundTraps.push(id);
  el.classList.add('suspicious-found');

  showTrapModal(id);
  updateCounter();
}

function handleFakeClick(el) {
  el.classList.add('suspicious-wrong');
  setTimeout(() => el.classList.remove('suspicious-wrong'), 600);
  showToast('Это обычный пункт. Ищи ловушку!', 'warning');
}

function showTrapModal(id) {
  const trap = SUSPICIOUS_ITEMS[id];
  document.getElementById('trapTitle').textContent = trap.title;
  document.getElementById('trapText').textContent = trap.explanation;
  const modal = document.getElementById('trapModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeTrapModal() {
  const modal = document.getElementById('trapModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');

  if (foundTraps.length === 3) {
    setTimeout(showFinalModal, 400);
  }
}

function updateCounter() {
  document.getElementById('foundCount').textContent = foundTraps.length;
  const bar = document.getElementById('foundBar');
  bar.style.width = (foundTraps.length / 3 * 100) + '%';
}

function showFinalModal() {
  Storage.setBlockComplete(1);
  document.getElementById('finalModal').classList.remove('hidden');
  document.getElementById('finalModal').classList.add('flex');
}

function goToDashboard() {
  window.location.href = 'dashboard.html';
}

function goToNextBlock() {
  window.location.href = 'block-2.html';
}

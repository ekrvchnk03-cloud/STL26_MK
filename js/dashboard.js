// Логика личного кабинета

document.addEventListener('DOMContentLoaded', function() {
    const user = requireUser();
    if (!user) return;

    renderUserGreeting(user);
    renderProgress();
    renderBlocks();
    renderChecklistCard();
});

function renderUserGreeting(user) {
    const firstName = user.name.split(' ')[0] || user.name;
    document.getElementById('userGreeting').textContent = `Привет, ${firstName}!`;
}

function renderProgress() {
    const progress = Storage.getProgress();
    let completed = 0;
    if (progress.block1) completed++;
    if (progress.block2) completed++;
    if (progress.block3) completed++;

    document.getElementById('progressCount').textContent = `${completed} / 3`;
    document.getElementById('progressBar').style.width = `${(completed / 3) * 100}%`;
}

function renderBlocks() {
    const progress = Storage.getProgress();

    // Опрос
    const pollCard = document.getElementById('pollCard');
    if (progress.poll) {
        pollCard.querySelector('.status-badge').innerHTML = '<span class="text-green-400 text-xs">✓ Пройдено</span>';
        pollCard.querySelector('.action-btn').textContent = 'Посмотреть результаты →';
    }

    // Блок 1
    renderBlockCard(1, progress.block1, Storage.isBlockAvailable(1));
    // Блок 2
    renderBlockCard(2, progress.block2, Storage.isBlockAvailable(2));
    // Блок 3
    renderBlockCard(3, progress.block3, Storage.isBlockAvailable(3));
}

function renderBlockCard(num, completed, available) {
    const card = document.getElementById(`block${num}Card`);
    if (!card) return;

    const badge = card.querySelector('.status-badge');
    const btn = card.querySelector('.action-btn');

    if (completed) {
        badge.innerHTML = '<span class="text-green-400 text-xs">✓ Пройдено</span>';
        btn.textContent = 'Пройти заново →';
        btn.classList.remove('bg-slate-700', 'cursor-not-allowed', 'text-slate-500');
        btn.classList.add('bg-cyan-500', 'hover:bg-cyan-600', 'text-white');
        btn.disabled = false;
    } else if (available) {
        badge.innerHTML = '<span class="text-cyan-400 text-xs">● Доступно</span>';
        btn.textContent = 'Начать →';
        btn.classList.remove('bg-slate-700', 'cursor-not-allowed', 'text-slate-500');
        btn.classList.add('bg-cyan-500', 'hover:bg-cyan-600', 'text-white');
        btn.disabled = false;
    } else {
        badge.innerHTML = '<span class="text-slate-500 text-xs">🔒 Заблокировано</span>';
        btn.textContent = `Сначала пройдите раздел ${num - 1}`;
        btn.classList.add('bg-slate-700', 'cursor-not-allowed', 'text-slate-500');
        btn.classList.remove('bg-cyan-500', 'hover:bg-cyan-600', 'text-white');
        btn.disabled = true;
    }
}

function renderChecklistCard() {
    const card = document.getElementById('checklistCard');
    if (!card) return;

    if (Storage.isChecklistAvailable()) {
        card.classList.remove('opacity-50');
        const btn = card.querySelector('.action-btn');
        btn.classList.remove('bg-slate-700', 'cursor-not-allowed', 'text-slate-500');
        btn.classList.add('bg-gradient-to-r', 'from-yellow-500', 'to-orange-500', 'hover:from-yellow-600', 'hover:to-orange-600', 'text-white');
        btn.disabled = false;
        btn.textContent = '🎁 Забрать чек-лист';
    }
}

function logout() {
    if (confirm('Выйти из личного кабинета? Прогресс сохранится.')) {
        // Не удаляем данные, просто переходим на главную
        window.location.href = 'index.html';
    }
}

function goToBlock(num) {
    if (!Storage.isBlockAvailable(num)) {
        showToast(`Сначала пройдите раздел ${num - 1}`, 'warning');
        return;
    }
    window.location.href = `block-${num}.html`;
}

// Логика опроса
document.addEventListener('DOMContentLoaded', function() {
  const user = requireUser();
  if (!user) return;

  // Если опрос уже пройден — сразу показываем результат
  if (Storage.getProgress().poll) {
    // ✅ Читаем сохранённый ответ
    const savedAnswer = localStorage.getItem('pollAnswer');
    showResult(savedAnswer);
  }
});

const POLL_STATS = {
  always: 2,
  long: 7,
  rarely: 23,
  never: 68
};

const POLL_LABELS = {
  always: 'Всегда читаю полностью',
  long: 'Читаю, если короткое',
  rarely: 'Иногда пролистываю',
  never: 'Никогда не читаю'
};

function selectAnswer(value) {
  document.querySelectorAll('.poll-option').forEach(el => {
    el.classList.remove('border-cyan-500', 'bg-cyan-900/30');
    el.classList.add('border-slate-700');
  });

  const selected = document.querySelector(`[data-value="${value}"]`);
  selected.classList.remove('border-slate-700');
  selected.classList.add('border-cyan-500', 'bg-cyan-900/30');

  document.getElementById('submitBtn').disabled = false;
  document.getElementById('submitBtn').dataset.answer = value;
}

function submitPoll() {
  const answer = document.getElementById('submitBtn').dataset.answer;
  if (!answer) return;

  // ✅ Сохраняем ответ пользователя
  localStorage.setItem('pollAnswer', answer);

  Storage.setPollComplete();
  showResult(answer);
}

function showResult(userAnswer) {
  document.getElementById('pollQuestion').classList.add('hidden');
  document.getElementById('pollResult').classList.remove('hidden');

  let html = '<div class="space-y-3">';
  for (const key in POLL_STATS) {
    const percent = POLL_STATS[key];
    const isUser = key === userAnswer;
    const barColor = isUser ? 'bg-cyan-500' : 'bg-slate-600';
    const textColor = isUser ? 'text-cyan-400 font-bold' : 'text-slate-300';
    html += `
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span class="${textColor}">${POLL_LABELS[key]} ${isUser ? '← ваш ответ' : ''}</span>
          <span class="${textColor}">${percent}%</span>
        </div>
        <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
          <div class="${barColor} h-full transition-all" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }
  html += '</div>';
  document.getElementById('statsContainer').innerHTML = html;
}

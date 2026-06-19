// Общая логика для всех страниц

// Проверка авторизации — если пользователь не зарегистрирован, отправляем на главную
function requireUser() {
    if (!Storage.hasUser()) {
        window.location.href = 'index.html';
        return null;
    }
    return Storage.getUser();
}

// Показ всплывающих уведомлений (тосты)
function showToast(message, type = 'info') {
    // Удаляем предыдущий тост, если есть
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Экранирование HTML (для безопасной вставки пользовательского ввода)
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

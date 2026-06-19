// Работа с localStorage

const Storage = {
    KEYS: {
        USER: 'mk_user',
        PROGRESS: 'mk_progress',
        BLOCK3_SCORE: 'mk_block3_score'
    },

    // === Пользователь ===
    saveUser(user) {
        localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
    },

    getUser() {
        const data = localStorage.getItem(this.KEYS.USER);
        return data ? JSON.parse(data) : null;
    },

    hasUser() {
        return this.getUser() !== null;
    },

    // === Прогресс ===
    getProgress() {
        const data = localStorage.getItem(this.KEYS.PROGRESS);
        return data ? JSON.parse(data) : {
            poll: false,
            block1: false,
            block2: false,
            block3: false
        };
    },

    setPollComplete() {
        const progress = this.getProgress();
        progress.poll = true;
        localStorage.setItem(this.KEYS.PROGRESS, JSON.stringify(progress));
    },

    setBlockComplete(blockNum) {
        const progress = this.getProgress();
        progress['block' + blockNum] = true;
        localStorage.setItem(this.KEYS.PROGRESS, JSON.stringify(progress));
    },

    // === Результат раздела 3 ===
    saveBlock3Score(score) {
        localStorage.setItem(this.KEYS.BLOCK3_SCORE, score.toString());
    },

    getBlock3Score() {
        const score = localStorage.getItem(this.KEYS.BLOCK3_SCORE);
        return score ? parseInt(score) : 0;
    },

    // === Проверки ===
    isBlockAvailable(blockNum) {
        const progress = this.getProgress();
        if (blockNum === 1) return true;
        if (blockNum === 2) return progress.block1;
        if (blockNum === 3) return progress.block2;
        return false;
    },

    isChecklistAvailable() {
        const progress = this.getProgress();
        return progress.block1 && progress.block2 && progress.block3;
    },

    // === Полная очистка (для админки) ===
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
};

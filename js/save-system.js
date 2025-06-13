class SaveSystem {
    constructor() {
        this.saveKey = 'novella_save';
        this.autoSaveKey = 'novella_autosave';
        this.settingsKey = 'novella_settings';
        this.maxSaveSlots = 5;
        this.autoSaveInterval = 30000; // 30 секунд
        this.autoSaveTimer = null;
    }

    // Сохранение игры в указанный слот
    saveGame(gameState, slotNumber = 0) {
        try {
            const saveData = {
                ...gameState,
                flags: Array.from(gameState.flags), // Конвертация Set в Array
                timestamp: Date.now(),
                version: '1.0',
                slotNumber: slotNumber,
                playTime: this.calculatePlayTime(gameState)
            };

            const saveKey = slotNumber === 0 ? this.autoSaveKey : `${this.saveKey}_slot_${slotNumber}`;
            localStorage.setItem(saveKey, JSON.stringify(saveData));
            
            console.log(`Игра сохранена в слот ${slotNumber}`);
            return true;
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            this.handleSaveError(error);
            return false;
        }
    }

    // Загрузка игры из указанного слота
    loadGame(slotNumber = 0) {
        try {
            const saveKey = slotNumber === 0 ? this.autoSaveKey : `${this.saveKey}_slot_${slotNumber}`;
            const saveData = localStorage.getItem(saveKey);
            
            if (!saveData) {
                console.log(`Сохранение в слоте ${slotNumber} не найдено`);
                return null;
            }

            const parsed = JSON.parse(saveData);
            
            // Восстановление Set из Array
            parsed.flags = new Set(parsed.flags || []);
            
            console.log(`Игра загружена из слота ${slotNumber}`);
            return parsed;
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            return null;
        }
    }

    // Получение информации о всех сохранениях
    getAllSaves() {
        const saves = [];
        
        // Автосохранение
        const autoSave = this.getSaveInfo(0);
        if (autoSave) {
            saves.push(autoSave);
        }

        // Ручные сохранения
        for (let i = 1; i <= this.maxSaveSlots; i++) {
            const save = this.getSaveInfo(i);
            if (save) {
                saves.push(save);
            }
        }

        return saves;
    }

    // Получение информации о сохранении
    getSaveInfo(slotNumber) {
        try {
            const saveKey = slotNumber === 0 ? this.autoSaveKey : `${this.saveKey}_slot_${slotNumber}`;
            const saveData = localStorage.getItem(saveKey);
            
            if (!saveData) return null;

            const parsed = JSON.parse(saveData);
            return {
                slotNumber: slotNumber,
                timestamp: parsed.timestamp,
                currentScene: parsed.currentScene,
                playTime: parsed.playTime || 0,
                stats: parsed.stats,
                isAutoSave: slotNumber === 0,
                formattedDate: new Date(parsed.timestamp).toLocaleString('ru-RU'),
                sceneName: this.getSceneName(parsed.currentScene)
            };
        } catch (error) {
            console.error(`Ошибка получения информации о слоте ${slotNumber}:`, error);
            return null;
        }
    }

    // Удаление сохранения
    deleteSave(slotNumber) {
        if (slotNumber === 0) {
            console.warn('Нельзя удалить автосохранение');
            return false;
        }

        try {
            const saveKey = `${this.saveKey}_slot_${slotNumber}`;
            localStorage.removeItem(saveKey);
            console.log(`Сохранение в слоте ${slotNumber} удалено`);
            return true;
        } catch (error) {
            console.error('Ошибка удаления сохранения:', error);
            return false;
        }
    }

    // Экспорт сохранения в файл
    exportSave(slotNumber) {
        const saveData = this.loadGame(slotNumber);
        if (!saveData) {
            console.error('Сохранение не найдено');
            return;
        }

        const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `novella_save_slot_${slotNumber}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Импорт сохранения из файла
    importSave(file, slotNumber) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    
                    // Валидация данных
                    if (!this.validateSaveData(saveData)) {
                        reject(new Error('Неверный формат файла сохранения'));
                        return;
                    }

                    // Сохранение в указанный слот
                    saveData.flags = new Set(saveData.flags || []);
                    const success = this.saveGame(saveData, slotNumber);
                    
                    if (success) {
                        resolve(saveData);
                    } else {
                        reject(new Error('Ошибка сохранения импортированных данных'));
                    }
                } catch (error) {
                    reject(new Error('Ошибка парсинга файла: ' + error.message));
                }
            };

            reader.onerror = () => reject(new Error('Ошибка чтения файла'));
            reader.readAsText(file);
        });
    }

    // Валидация данных сохранения
    validateSaveData(saveData) {
        const requiredFields = ['currentScene', 'stats', 'choices'];
        return requiredFields.every(field => saveData.hasOwnProperty(field));
    }

    // Автосохранение
    startAutoSave(gameStateGetter) {
        this.stopAutoSave();
        
        this.autoSaveTimer = setInterval(() => {
            const gameState = gameStateGetter();
            this.saveGame(gameState, 0);
        }, this.autoSaveInterval);
        
        console.log('Автосохранение запущено');
    }

    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
            console.log('Автосохранение остановлено');
        }
    }

    // Сохранение настроек
    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения настроек:', error);
            return false;
        }
    }

    // Загрузка настроек
    loadSettings() {
        try {
            const settings = localStorage.getItem(this.settingsKey);
            return settings ? JSON.parse(settings) : this.getDefaultSettings();
        } catch (error) {
            console.error('Ошибка загрузки настроек:', error);
            return this.getDefaultSettings();
        }
    }

    // Настройки по умолчанию
    getDefaultSettings() {
        return {
            textSpeed: 30,
            autoSave: true,
            soundEnabled: true,
            musicVolume: 0.7,
            sfxVolume: 0.8
        };
    }

    // Вспомогательные методы
    calculatePlayTime(gameState) {
        // Простой расчет времени игры на основе количества выборов
        return gameState.choices ? gameState.choices.length * 2 : 0; // 2 минуты на выбор
    }

    getSceneName(sceneId) {
        const sceneNames = {
            'prologue': 'Пролог',
            'director_meeting': 'Встреча с директором',
            'road_to_hotel': 'Дорога в отель',
            'conference_hall': 'Зал конференции',
            'presentation_start': 'Начало презентации',
            'ending_hired': 'Концовка: Принят на работу',
            'ending_fired': 'Концовка: Увольнение'
        };
        
        return sceneNames[sceneId] || sceneId;
    }

    handleSaveError(error) {
        if (error.name === 'QuotaExceededError') {
            console.warn('Превышен лимит localStorage. Очистка старых сохранений...');
            this.cleanupOldSaves();
        }
    }

    cleanupOldSaves() {
        // Удаление самых старых сохранений при нехватке места
        const saves = this.getAllSaves().filter(save => !save.isAutoSave);
        saves.sort((a, b) => a.timestamp - b.timestamp);
        
        // Удаляем половину старых сохранений
        const toDelete = saves.slice(0, Math.floor(saves.length / 2));
        toDelete.forEach(save => this.deleteSave(save.slotNumber));
    }

    // Получение статистики использования localStorage
    getStorageStats() {
        let totalSize = 0;
        let novellaSize = 0;
        
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const size = localStorage[key].length;
                totalSize += size;
                
                if (key.startsWith('novella_')) {
                    novellaSize += size;
                }
            }
        }
        
        return {
            totalSize: totalSize,
            novellaSize: novellaSize,
            totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
            novellaSizeMB: (novellaSize / 1024 / 1024).toFixed(2)
        };
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaveSystem;
}

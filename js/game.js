class NovellaGame {
    constructor() {
        this.gameState = this.getInitialState();
        this.isInitialized = false;
        
        // Инициализация подсистем
        this.saveSystem = new SaveSystem();
        this.uiManager = new UIManager(this);
        this.dialogueSystem = new DialogueSystem(this.uiManager);
        this.minigameManager = new MinigameManager(this);
        
        // Привязка методов к контексту
        this.makeChoice = this.makeChoice.bind(this);
        this.saveGame = this.saveGame.bind(this);
        this.loadGame = this.loadGame.bind(this);
    }

    init() {
        console.log('Инициализация новеллы...');
        
        // Инициализация UI
        this.uiManager.init();
        
        // Загрузка сохранения или начало новой игры
        this.loadGame(0);
        
        // Запуск автосохранения
        this.saveSystem.startAutoSave(() => this.gameState);
        
        // Первое отображение сцены
        this.renderScene();
        
        this.isInitialized = true;
        console.log('Новелла инициализирована успешно');
    }

    renderScene() {
        const currentScene = storyData[this.gameState.currentScene];
        
        if (!currentScene) {
            console.error(`Сцена ${this.gameState.currentScene} не найдена`);
            return;
        }

        if (currentScene.isEndingNode) {
            this.handleEndingNode();
            return;
        }

        // Обновление фона
        this.uiManager.updateBackground(currentScene.background);
        
        // Запуск диалогов если они есть
        if (currentScene.dialogues && currentScene.dialogues.length > 0) {
            this.dialogueSystem.startDialogues(currentScene.dialogues, () => {
                // Показываем выборы после диалогов
                this.uiManager.renderChoices(currentScene.choices, this.makeChoice);
            });
        } else {
            // Старая система для сцен без диалогов
            this.uiManager.displayText(currentScene.text || "Текст отсутствует");
            this.uiManager.renderChoices(currentScene.choices, this.makeChoice);
        }
        
        this.uiManager.updateStatsDisplay();
        
        if (currentScene.minigame) {
            this.initMinigame(currentScene.minigame);
        }
    }

    makeChoice(choice, index) {
        if (this.minigameManager.isActive) return;
        
        // Сохранение выбора в историю
        this.gameState.choices.push({
            scene: this.gameState.currentScene,
            choice: choice.text,
            index: index,
            timestamp: Date.now()
        });

        // Применение эффектов выбора
        this.applyChoiceEffects(choice);
        
        // Отображение результата выбора
        if (choice.result) {
            this.showChoiceResult(choice.result, () => {
                this.proceedToNextScene(choice.next);
            });
        } else {
            this.proceedToNextScene(choice.next);
        }
    }

    applyChoiceEffects(choice) {
        // Изменение статистики
        if (choice.effects) {
            Object.keys(choice.effects).forEach(stat => {
                this.gameState.stats[stat] += choice.effects[stat];
                
                // Анимация изменения через UI
                this.uiManager.animateStatChange(stat, choice.effects[stat]);
            });
        }

        // Установка флагов
        if (choice.setFlag) {
            this.gameState.flags.add(choice.setFlag);
        }

        // Перезапуск игры
        if (choice.restart) {
            this.restartGame();
        }
    }

    showChoiceResult(result, callback) {
        // Простое отображение результата
        alert(result);
        if (callback) callback();
    }

    proceedToNextScene(nextScene) {
        if (!nextScene) {
            console.error('Следующая сцена не указана');
            return;
        }

        // Анимация перехода через UI
        this.uiManager.sceneTransition(() => {
            this.gameState.currentScene = nextScene;
            this.renderScene();
        });
    }

    handleEndingNode() {
        const ending = determineEnding(this.gameState.stats);
        this.gameState.currentScene = ending;
        this.renderScene();
    }

    isChoiceAvailable(choice) {
        if (choice.requires) {
            return this.gameState.flags.has(choice.requires);
        }
        return true;
    }

    initMinigame(minigameData) {
        const container = document.getElementById('minigame-container');
        if (container) {
            this.minigameManager.initMinigame(minigameData, container);
        }
    }

    saveGame(slotNumber = 0) {
        const success = this.saveSystem.saveGame(this.gameState, slotNumber);
        console.log(success ? 'Игра сохранена' : 'Ошибка сохранения');
        return success;
    }

    loadGame(slotNumber = 0) {
        const saveData = this.saveSystem.loadGame(slotNumber);
        
        if (saveData) {
            this.gameState = saveData;
            
            if (this.isInitialized) {
                this.renderScene();
            }
            
            return true;
        }
        return false;
    }

    getInitialState() {
        return {
            currentScene: 'prologue',
            stats: {
                leadership: 0,
                efficiency: 0,
                psychology: 0,
                collective: 0
            },
            flags: new Set(),
            choices: [],
            startTime: Date.now()
        };
    }

    restartGame() {
        this.gameState = this.getInitialState();
        this.saveGame(0);
        this.renderScene();
        console.log('Игра перезапущена');
    }

    cleanup() {
        this.saveSystem.stopAutoSave();
        this.minigameManager.cleanup();
        console.log('Ресурсы игры очищены');
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.game = new NovellaGame();
    window.game.init();
    
    window.addEventListener('beforeunload', () => {
        window.game.cleanup();
    });
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovellaGame;
}

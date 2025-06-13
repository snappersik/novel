class UIManager {
    constructor(game) {
        this.game = game;
        this.elements = {};
        this.isMobile = window.innerWidth <= 768;
        this.animations = {
            fadeSpeed: 300,
            slideSpeed: 400,
            typewriterSpeed: 30
        };

        this.setupEventListeners();
    }

    // Инициализация UI элементов
    init() {
        this.cacheElements();
        this.setupMobileAdaptation();
        this.initializeMenus();
        this.updateStatsDisplay();
    }

    // Кэширование DOM элементов
    cacheElements() {
        this.elements = {
            // Основные элементы
            gameContainer: document.getElementById('game-container'),
            background: document.getElementById('background'),
            character: document.getElementById('character'),
            dialogBox: document.getElementById('dialog-box'),
            dialogText: document.getElementById('dialogue-text'), // Исправлено
            choicesContainer: document.getElementById('choices-container'),

            // Панель статистики
            statsPanel: document.getElementById('stats-panel'),
            statsToggle: document.getElementById('stats-toggle'),
            statsValues: {
                leadership: document.getElementById('stat-leadership-value'),
                efficiency: document.getElementById('stat-efficiency-value'),
                psychology: document.getElementById('stat-psychology-value'),
                collective: document.getElementById('stat-collective-value')
            },
            statsLevels: {
                leadership: document.getElementById('stat-leadership-level'),
                efficiency: document.getElementById('stat-efficiency-level'),
                psychology: document.getElementById('stat-psychology-level'),
                collective: document.getElementById('stat-collective-level')
            },

            // Меню и модальные окна
            mainMenu: document.getElementById('main-menu'),
            saveMenu: document.getElementById('save-menu'),
            loadMenu: document.getElementById('load-menu'),
            settingsMenu: document.getElementById('settings-menu'),

            // Кнопки
            menuButton: document.getElementById('menu-button'),
            saveButton: document.getElementById('save-button'),
            loadButton: document.getElementById('load-button'),
            settingsButton: document.getElementById('settings-button'),

            // Мини-игры
            minigameContainer: document.getElementById('minigame-container'),

            // Оверлеи
            overlay: document.getElementById('overlay'),
            loadingScreen: document.getElementById('loading-screen')
        };
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Изменение размера окна
        window.addEventListener('resize', this.handleResize.bind(this));

        // Клавиатурные сокращения
        document.addEventListener('keydown', this.handleKeyPress.bind(this));

        // Предотвращение контекстного меню на мобильных
        document.addEventListener('contextmenu', (e) => {
            if (this.isMobile) e.preventDefault();
        });
    }

    // Мобильная адаптация
    setupMobileAdaptation() {
        if (this.isMobile) {
            this.elements.gameContainer?.classList.add('mobile-layout');
            this.setupTouchGestures();
        }
    }

    // Touch жесты для мобильных
    setupTouchGestures() {
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;

            // Свайп вверх - показать статистику
            if (diff > 50 && this.elements.statsPanel) {
                this.toggleStatsPanel();
            }
        });
    }

    // Инициализация меню
    initializeMenus() {
        // Главное меню
        if (this.elements.menuButton) {
            this.elements.menuButton.addEventListener('click', this.toggleMainMenu.bind(this));
        }

        // Кнопки сохранения/загрузки
        if (this.elements.saveButton) {
            this.elements.saveButton.addEventListener('click', this.showSaveMenu.bind(this));
        }

        if (this.elements.loadButton) {
            this.elements.loadButton.addEventListener('click', this.showLoadMenu.bind(this));
        }

        if (this.elements.settingsButton) {
            this.elements.settingsButton.addEventListener('click', this.showSettingsMenu.bind(this));
        }

        // Переключение статистики
        if (this.elements.statsToggle) {
            this.elements.statsToggle.addEventListener('click', this.toggleStatsPanel.bind(this));
        }

        // Кнопка перезапуска
        const restartButton = document.getElementById('restart-button');
        if (restartButton) {
            restartButton.addEventListener('click', this.handleRestart.bind(this));
        }

        // Закрытие меню по клику на оверлей
        if (this.elements.overlay) {
            this.elements.overlay.addEventListener('click', this.closeAllMenus.bind(this));
        }
    }

    // Обработка перезапуска
    handleRestart() {
        if (confirm('Вы уверены, что хотите начать игру заново? Весь прогресс будет потерян.')) {
            // Очистка localStorage
            localStorage.removeItem('novella_save');
            localStorage.removeItem('novella_autosave');
            localStorage.removeItem('novella_settings');

            // Очистка всех слотов сохранения
            for (let i = 1; i <= 5; i++) {
                localStorage.removeItem(`novella_save_slot_${i}`);
            }

            console.log('localStorage очищен');

            // Перезапуск игры
            this.game.restartGame();

            // Показать уведомление
            this.showNotification('Игра перезапущена! localStorage очищен.', 'success');
        }
    }

    // Отображение текста БЕЗ эффекта печатной машинки
    displayText(text, callback) {
        if (!this.elements.dialogText) return;

        // Показываем текст сразу
        this.elements.dialogText.innerHTML = text;
        this.elements.dialogBox?.classList.add('show');
        
        // Сразу вызываем callback если он есть
        if (callback) {
            callback();
        }
    }

    // Обновление фона с анимацией
    updateBackground(backgroundName) {
        if (!backgroundName || !this.elements.background) return;

        const imageName = backgroundName.includes('.') ? backgroundName : `${backgroundName}.png`;
        const backgroundPath = `images/backgrounds/${imageName}`;

        console.log(`Загружаем фон: ${backgroundPath}`);

        // Устанавливаем атрибут для CSS селекторов
        this.elements.background.setAttribute('data-scene', backgroundName);

        // Проверяем существование изображения
        const img = new Image();
        img.onload = () => {
            this.elements.background.style.opacity = '0';

            setTimeout(() => {
                this.elements.background.style.backgroundImage = `url(${backgroundPath})`;
                this.elements.background.style.opacity = '1';
                console.log(`✓ Фон загружен: ${backgroundPath}`);

                // Дополнительная настройка для конкретных изображений
                this.adjustBackgroundForImage(backgroundName, img);
            }, this.animations.fadeSpeed / 2);
        };

        img.onerror = () => {
            console.error(`✗ Фон не найден: ${backgroundPath}`);
            this.elements.background.style.backgroundColor = '#2c3e50';
            this.elements.background.style.backgroundImage = 'none';
        };

        img.src = backgroundPath;
    }

    // Дополнительная настройка фона в зависимости от соотношения сторон
    adjustBackgroundForImage(backgroundName, img) {
        const aspectRatio = img.width / img.height;
        const screenAspectRatio = window.innerWidth / window.innerHeight;

        // Если изображение шире экрана
        if (aspectRatio > screenAspectRatio) {
            this.elements.background.style.backgroundSize = 'auto 100%';
        } else {
            this.elements.background.style.backgroundSize = 'cover';
        }
    }

    // Обновление персонажа
    updateCharacter(characterName) {
        if (!this.elements.character) return;

        if (characterName) {
            const characterPath = `images/characters/${characterName}.png`;
            this.elements.character.style.backgroundImage = `url(${characterPath})`;
            this.elements.character.style.display = 'block';
            this.elements.character.classList.add('slide-in');

            setTimeout(() => {
                this.elements.character.classList.remove('slide-in');
            }, this.animations.slideSpeed);
        } else {
            this.elements.character.style.display = 'none';
        }
    }

    // Отображение вариантов выбора БЕЗ анимации
    renderChoices(choices, onChoiceClick) {
        if (!this.elements.choicesContainer || !choices) return;

        this.elements.choicesContainer.innerHTML = '';

        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';

            // Проверка доступности выбора
            const isAvailable = this.game.isChoiceAvailable(choice);

            if (!isAvailable) {
                button.className += ' choice-locked';
                button.disabled = true;
                button.title = 'Выбор заблокирован';
            }

            button.innerHTML = choice.text;

            // Защита от двойных кликов
            let isClicked = false;
            button.addEventListener('click', () => {
                if (isClicked) return;
                isClicked = true;
                button.disabled = true;

                // Отключаем все кнопки выбора
                document.querySelectorAll('.choice-button').forEach(btn => {
                    btn.disabled = true;
                });

                onChoiceClick(choice, index);
            });

            // Убираем анимацию - показываем кнопки сразу
            // button.style.animationDelay = `${index * 100}ms`;
            // button.classList.add('choice-appear');

            this.elements.choicesContainer.appendChild(button);
        });
    }

    // Обновление отображения статистики
    updateStatsDisplay() {
        if (!this.game.gameState) return;

        Object.keys(this.game.gameState.stats).forEach(stat => {
            const value = this.game.gameState.stats[stat];

            // Обновление уровня (убираем значения, оставляем только уровень)
            const statLevelElement = document.getElementById(`stat-${stat}-level`);
            if (statLevelElement) {
                const level = getStatLevel(value, stat);
                statLevelElement.textContent = level;
            }
        });
    }

    // Анимация изменения статистики с стрелочками
    animateStatChange(stat, change) {
        const indicatorElement = document.getElementById(`stat-${stat}-indicator`);
        if (!indicatorElement) return;

        // Очищаем предыдущие классы
        indicatorElement.className = 'stat-change-indicator';

        // Устанавливаем стрелочку и класс
        if (change > 0) {
            indicatorElement.textContent = '↗';
            indicatorElement.classList.add('positive');
        } else if (change < 0) {
            indicatorElement.textContent = '↘';
            indicatorElement.classList.add('negative');
        }

        // Убираем анимацию через 1 секунду
        setTimeout(() => {
            indicatorElement.classList.remove('positive', 'negative');
        }, 1000);
    }

    // Переключение панели статистики
    toggleStatsPanel() {
        if (!this.elements.statsPanel) return;

        this.elements.statsPanel.classList.toggle('stats-visible');

        // Сохранение состояния панели
        const isVisible = this.elements.statsPanel.classList.contains('stats-visible');
        localStorage.setItem('stats_panel_visible', isVisible);
    }

    // Показ уведомления
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Обработка изменения размера окна
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        if (wasMobile !== this.isMobile) {
            this.setupMobileAdaptation();
        }

        // Адаптация мини-игр
        if (this.game.minigameManager?.isActive) {
            this.game.minigameManager.handleResize();
        }
    }

    // Обработка нажатий клавиш
    handleKeyPress(e) {
        switch (e.key) {
            case 'Escape':
                if (document.querySelector('.menu.show')) {
                    this.closeAllMenus();
                } else {
                    this.toggleMainMenu();
                }
                break;
            case 's':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.showSaveMenu();
                }
                break;
            case 'l':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.showLoadMenu();
                }
                break;
            case 'Tab':
                e.preventDefault();
                this.toggleStatsPanel();
                break;
        }
    }

    // Анимация перехода между сценами
    sceneTransition(callback) {
        this.elements.gameContainer?.classList.add('scene-transition');

        setTimeout(() => {
            if (callback) callback();
            this.elements.gameContainer?.classList.remove('scene-transition');
        }, this.animations.fadeSpeed);
    }

    // Заглушки для методов меню (если они не нужны)
    toggleMainMenu() {}
    showSaveMenu() {}
    showLoadMenu() {}
    showSettingsMenu() {}
    closeAllMenus() {}
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}

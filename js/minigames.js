class MinigameManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.currentMinigame = null;
        this.isActive = false;
        this.container = null;
    }

    // Инициализация мини-игры
    initMinigame(minigameData, container) {
        this.isActive = true;
        this.currentMinigame = minigameData;
        this.container = container;
        
        // Скрытие основного интерфейса
        document.getElementById('choices-container').style.display = 'none';
        container.style.display = 'block';
        
        // Запуск соответствующей мини-игры
        switch (minigameData.type) {
            case 'sort_presentation':
                this.startSortMinigame(minigameData);
                break;
            case 'osu_questions':
                this.startOsuMinigame(minigameData);
                break;
            default:
                console.error(`Неизвестный тип мини-игры: ${minigameData.type}`);
        }
    }

    // Мини-игра 1: Сортировка презентации (Drag & Drop)
    startSortMinigame(data) {
        this.container.innerHTML = `
            <div class="minigame-header">
                <h3>${data.instruction}</h3>
                <div class="timer" id="sort-timer">${data.timeLimit}</div>
            </div>
            <div class="sort-container" id="sort-items"></div>
            <div class="minigame-controls">
                <button class="minigame-submit" id="sort-submit">Подтвердить порядок</button>
                <button class="minigame-hint" id="sort-hint">Подсказка</button>
            </div>
        `;

        const itemsContainer = document.getElementById('sort-items');
        const timerElement = document.getElementById('sort-timer');
        const submitButton = document.getElementById('sort-submit');
        const hintButton = document.getElementById('sort-hint');
        
        // Перемешивание элементов для случайного порядка
        const shuffledItems = this.shuffleArray([...data.items]);
        
        // Создание перетаскиваемых элементов
        shuffledItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'sort-item';
            itemElement.innerHTML = `
                <div class="sort-item-number">${index + 1}</div>
                <div class="sort-item-text">${item}</div>
                <div class="sort-item-handle">⋮⋮</div>
            `;
            itemElement.draggable = true;
            itemElement.dataset.originalIndex = data.items.indexOf(item);
            
            // Обработчики drag & drop
            itemElement.addEventListener('dragstart', this.handleDragStart.bind(this));
            itemElement.addEventListener('dragover', this.handleDragOver.bind(this));
            itemElement.addEventListener('drop', this.handleDrop.bind(this));
            itemElement.addEventListener('dragend', this.handleDragEnd.bind(this));
            
            // Touch события для мобильных устройств
            itemElement.addEventListener('touchstart', this.handleTouchStart.bind(this));
            itemElement.addEventListener('touchmove', this.handleTouchMove.bind(this));
            itemElement.addEventListener('touchend', this.handleTouchEnd.bind(this));
            
            itemsContainer.appendChild(itemElement);
        });

        // Таймер
        let timeLeft = data.timeLimit;
        const timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            timerElement.className = timeLeft <= 10 ? 'timer timer-warning' : 'timer';
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.endSortMinigame(data, false);
            }
        }, 1000);

        // Кнопка подтверждения
        submitButton.addEventListener('click', () => {
            clearInterval(timer);
            const currentOrder = Array.from(itemsContainer.children).map(el => 
                parseInt(el.dataset.originalIndex)
            );
            const isCorrect = this.checkSortOrder(currentOrder, data.correctOrder);
            this.endSortMinigame(data, isCorrect);
        });

        // Кнопка подсказки (одноразовая)
        let hintUsed = false;
        hintButton.addEventListener('click', () => {
            if (!hintUsed) {
                this.showSortHint(data);
                hintUsed = true;
                hintButton.disabled = true;
                hintButton.textContent = 'Подсказка использована';
            }
        });

        this.currentTimer = timer;
    }

    // Подсказка для сортировки
    showSortHint(data) {
        const hintText = "Правильный порядок: Введение → Актуальность → Решение → Функционал → Вывод";
        const hintElement = document.createElement('div');
        hintElement.className = 'minigame-hint-text';
        hintElement.textContent = hintText;
        
        document.getElementById('sort-items').appendChild(hintElement);
        
        setTimeout(() => {
            hintElement.remove();
        }, 5000);
    }

    // Обработчики Drag & Drop
    handleDragStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const afterElement = this.getDragAfterElement(e.target.parentNode, e.clientY);
        if (afterElement == null) {
            e.target.parentNode.appendChild(this.draggedElement);
        } else {
            e.target.parentNode.insertBefore(this.draggedElement, afterElement);
        }
    }

    handleDrop(e) {
        e.preventDefault();
        this.updateSortNumbers();
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedElement = null;
    }

    // Touch события для мобильных
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (elementBelow && elementBelow.classList.contains('sort-item') && elementBelow !== this.draggedElement) {
            const container = this.draggedElement.parentNode;
            const afterElement = this.getDragAfterElement(container, touch.clientY);
            
            if (afterElement == null) {
                container.appendChild(this.draggedElement);
            } else {
                container.insertBefore(this.draggedElement, afterElement);
            }
        }
    }

    handleTouchEnd(e) {
        if (this.draggedElement) {
            this.draggedElement.classList.remove('dragging');
            this.updateSortNumbers();
            this.draggedElement = null;
        }
    }

    // Вспомогательные функции для drag & drop
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.sort-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    updateSortNumbers() {
        const items = document.querySelectorAll('.sort-item');
        items.forEach((item, index) => {
            const numberElement = item.querySelector('.sort-item-number');
            numberElement.textContent = index + 1;
        });
    }

    // Проверка правильности порядка
    checkSortOrder(currentOrder, correctOrder) {
        return JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    }

    // Завершение мини-игры сортировки
    endSortMinigame(data, success) {
        if (this.currentTimer) {
            clearInterval(this.currentTimer);
        }
        
        const result = success ? data.onSuccess : data.onFailure;
        this.endMinigame(result);
    }

    // Мини-игра 2: OSU-стиль ответы на вопросы
    startOsuMinigame(data) {
        this.container.innerHTML = `
            <div class="minigame-header">
                <h3>${data.instruction}</h3>
                <div class="osu-stats">
                    <div class="osu-score">Попаданий: <span id="osu-hits">0</span>/${data.totalCircles}</div>
                    <div class="osu-accuracy">Точность: <span id="osu-accuracy">100%</span></div>
                </div>
            </div>
            <div class="osu-game-area" id="osu-area">
                <div class="osu-instructions">Нажимайте на кружочки!</div>
            </div>
            <div class="osu-progress">
                <div class="osu-progress-bar" id="osu-progress"></div>
            </div>
        `;

        const gameArea = document.getElementById('osu-area');
        const hitsElement = document.getElementById('osu-hits');
        const accuracyElement = document.getElementById('osu-accuracy');
        const progressBar = document.getElementById('osu-progress');
        
        let hits = 0;
        let misses = 0;
        let circlesSpawned = 0;
        let activeCircles = 0;
        
        const updateStats = () => {
            hitsElement.textContent = hits;
            const total = hits + misses;
            const accuracy = total > 0 ? Math.round((hits / total) * 100) : 100;
            accuracyElement.textContent = accuracy + '%';
            
            const progress = (circlesSpawned / data.totalCircles) * 100;
            progressBar.style.width = progress + '%';
        };
        
        const spawnCircle = () => {
            if (circlesSpawned >= data.totalCircles) return;
            
            const circle = document.createElement('div');
            circle.className = 'osu-circle';
            
            // Случайная позиция (с отступами от краев)
            const margin = 60;
            const x = margin + Math.random() * (gameArea.offsetWidth - margin * 2);
            const y = margin + Math.random() * (gameArea.offsetHeight - margin * 2);
            
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';
            
            // Анимация появления
            circle.style.transform = 'scale(0)';
            setTimeout(() => {
                circle.style.transform = 'scale(1)';
            }, 50);
            
            // Обработчик клика/тапа
            const handleHit = (e) => {
                e.preventDefault();
                hits++;
                activeCircles--;
                circle.classList.add('hit');
                circle.style.pointerEvents = 'none';
                
                // Эффект попадания
                const hitEffect = document.createElement('div');
                hitEffect.className = 'osu-hit-effect';
                hitEffect.style.left = circle.style.left;
                hitEffect.style.top = circle.style.top;
                gameArea.appendChild(hitEffect);
                
                setTimeout(() => {
                    circle.remove();
                    hitEffect.remove();
                }, 200);
                
                updateStats();
                checkGameEnd();
            };
            
            circle.addEventListener('click', handleHit);
            circle.addEventListener('touchstart', handleHit);
            
            gameArea.appendChild(circle);
            circlesSpawned++;
            activeCircles++;
            updateStats();
            
            // Автоматическое исчезновение через 2.5 секунды
            setTimeout(() => {
                if (circle.parentNode && !circle.classList.contains('hit')) {
                    misses++;
                    activeCircles--;
                    circle.classList.add('miss');
                    
                    setTimeout(() => {
                        circle.remove();
                    }, 300);
                    
                    updateStats();
                    checkGameEnd();
                }
            }, 2500);
            
            // Спавн следующего кружка
            if (circlesSpawned < data.totalCircles) {
                const nextSpawnDelay = 600 + Math.random() * 400; // 600-1000ms
                setTimeout(spawnCircle, nextSpawnDelay);
            }
        };
        
        const checkGameEnd = () => {
            if (circlesSpawned >= data.totalCircles && activeCircles === 0) {
                const success = hits >= data.targetHits;
                setTimeout(() => {
                    this.endOsuMinigame(data, success);
                }, 1000);
            }
        };
        
        // Начинаем игру через небольшую задержку
        setTimeout(() => {
            document.querySelector('.osu-instructions').remove();
            spawnCircle();
        }, 1500);
    }

    // Завершение OSU мини-игры
    endOsuMinigame(data, success) {
        const result = success ? data.onSuccess : data.onFailure;
        this.endMinigame(result);
    }

    // Общее завершение мини-игры
    endMinigame(result) {
        this.isActive = false;
        this.currentMinigame = null;
        
        // Показ результата
        const resultScreen = document.createElement('div');
        resultScreen.className = 'minigame-result';
        resultScreen.innerHTML = `
            <div class="result-content">
                <h3>Результат</h3>
                <p>${result.result}</p>
                <button class="continue-button">Продолжить</button>
            </div>
        `;
        
        this.container.appendChild(resultScreen);
        
        // Обработчик продолжения
        resultScreen.querySelector('.continue-button').addEventListener('click', () => {
            // Скрытие контейнера мини-игры
            this.container.style.display = 'none';
            document.getElementById('choices-container').style.display = 'block';
            
            // Применение эффектов результата через игровой движок
            this.game.applyChoiceEffects(result);
            
            // Переход к следующей сцене
            this.game.proceedToNextScene(result.next);
        });
    }

    // Вспомогательная функция перемешивания массива
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Очистка ресурсов
    cleanup() {
        if (this.currentTimer) {
            clearInterval(this.currentTimer);
        }
        this.isActive = false;
        this.currentMinigame = null;
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MinigameManager;
}

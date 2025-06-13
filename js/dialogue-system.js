class DialogueSystem {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.currentDialogues = [];
        this.currentDialogueIndex = 0;
        this.isPlaying = false;
        this.onComplete = null;
    }

    startDialogues(dialogues, onComplete) {
        this.currentDialogues = dialogues;
        this.currentDialogueIndex = 0;
        this.isPlaying = true;
        this.onComplete = onComplete;

        const dialogueSystem = document.getElementById('dialogue-system');
        const choicesContainer = document.getElementById('choices-container');

        if (dialogueSystem) {
            dialogueSystem.style.display = 'block';
        }
        if (choicesContainer) {
            choicesContainer.style.display = 'none';
        }

        this.showCurrentDialogue();
    }

    showCurrentDialogue() {
        if (this.currentDialogueIndex >= this.currentDialogues.length) {
            this.endDialogues();
            return;
        }

        const dialogue = this.currentDialogues[this.currentDialogueIndex];

        // Обновление персонажа
        this.updateCharacterState(dialogue.character, dialogue.speaker);

        // Обновление диалогового окна
        const speakerName = document.getElementById('speaker-name');
        const dialogueText = document.getElementById('dialogue-text');

        // Убираем имя говорящего (скрываем элемент)
        if (speakerName) {
            speakerName.style.display = 'none';
        }

        if (dialogueText) {
            // Показываем текст сразу без анимации печатной машинки
            dialogueText.textContent = dialogue.text;
        }

        // Показываем кнопку "Далее" как вариант выбора
        this.showContinueChoice();
    }

    // Добавляем недостающий метод updateCharacterState
    updateCharacterState(characterImage, speaker) {
        const characterElement = document.getElementById('character');

        if (!characterElement) return;

        if (characterImage) {
            // Показываем персонажа
            characterElement.style.backgroundImage = `url(images/characters/${characterImage}.png)`;
            characterElement.style.display = 'block';

            // Активное/неактивное состояние
            if (speaker === 'narrator') {
                characterElement.className = 'inactive';
            } else {
                characterElement.className = 'active';
            }
        } else {
            // Скрываем персонажа для нарратора
            characterElement.style.display = 'none';
        }
    }

    // Добавляем недостающий метод getSpeakerDisplayName
    getSpeakerDisplayName(speaker) {
        const names = {
            'narrator': '',
            'director': 'Директор',
            'alexy': 'Алексей',
            'player': 'Вы'
        };

        return names[speaker] || speaker;
    }

    showContinueChoice() {
        const choicesContainer = document.getElementById('choices-container');
        if (!choicesContainer) return;

        // Очищаем контейнер выборов
        choicesContainer.innerHTML = '';
        choicesContainer.style.display = 'block';

        // Создаем кнопку "Далее" как обычный выбор
        const continueButton = document.createElement('button');
        continueButton.className = 'choice-button';
        continueButton.textContent = 'Далее';

        // Обработчик клика
        continueButton.addEventListener('click', () => {
            this.nextDialogue();
        });

        choicesContainer.appendChild(continueButton);

        // Обработчик клавиш
        const keyHandler = (e) => {
            if ((e.code === 'Space' || e.code === 'Enter') && this.isPlaying) {
                e.preventDefault();
                document.removeEventListener('keydown', keyHandler);
                this.nextDialogue();
            }
        };
        document.addEventListener('keydown', keyHandler);
    }

    // Убираем анимацию печатной машинки
    typewriterEffect(element, text) {
        element.textContent = text;
    }

    nextDialogue() {
        if (!this.isPlaying) return;

        this.currentDialogueIndex++;
        this.showCurrentDialogue();
    }

    endDialogues() {
        this.isPlaying = false;

        const dialogueSystem = document.getElementById('dialogue-system');
        const choicesContainer = document.getElementById('choices-container');

        if (choicesContainer) {
            choicesContainer.style.display = 'block';
            choicesContainer.innerHTML = ''; // Очищаем от кнопки "Далее"
        }

        // Сброс состояния персонажа
        const characterElement = document.getElementById('character');
        if (characterElement) {
            characterElement.className = '';
        }

        // Вызываем callback для показа реальных выборов
        if (this.onComplete) {
            this.onComplete();
        }
    }

}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DialogueSystem;
}

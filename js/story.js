const STATS = {
    LEADERSHIP: 'leadership',
    EFFICIENCY: 'efficiency', 
    PSYCHOLOGY: 'psychology',
    COLLECTIVE: 'collective'
};

const STAT_LEVELS = {
    10: { 
        leadership: "любимчик начальства", 
        efficiency: "будущий управленец",
        psychology: "амбассадор счастья",
        collective: "душа компании"
    },
    8: { 
        leadership: "доверенное лицо", 
        efficiency: "мастер своего дела",
        psychology: "источник оптимизма",
        collective: "звезда вечеринок"
    },
    5: { 
        leadership: "на хорошем счету", 
        efficiency: "ведущий специалист",
        psychology: "словил дзен",
        collective: "с тобой хотят общаться"
    },
    2: { 
        leadership: "внимательный ученик", 
        efficiency: "будущий эксперт",
        psychology: "в ресурсе",
        collective: "выучили твоё имя"
    },
    0: { 
        leadership: "юный подаван", 
        efficiency: "начинающий профессионал",
        psychology: "все нормально",
        collective: "очередной стажер"
    },
    '-2': { 
        leadership: "идущий к тьме", 
        efficiency: "подающий надежды",
        psychology: "тревожные звоночки",
        collective: "любитель анекдотов"
    },
    '-5': { 
        leadership: "дарт вейдер", 
        efficiency: "табуретка",
        psychology: "пригорает",
        collective: "нежелательная персона"
    },
    '-8': { 
        leadership: "мазолит глаза", 
        efficiency: "кандидат на увольнение",
        psychology: "на грани срыва",
        collective: "изгой офиса"
    }
};

function getStatLevel(value, statType) {
    if (value >= 10) return STAT_LEVELS[10][statType];
    if (value >= 8) return STAT_LEVELS[8][statType];
    if (value >= 5) return STAT_LEVELS[5][statType];
    if (value >= 2) return STAT_LEVELS[2][statType];
    if (value >= 0) return STAT_LEVELS[0][statType];
    if (value >= -2) return STAT_LEVELS['-2'][statType];
    if (value >= -5) return STAT_LEVELS['-5'][statType];
    return STAT_LEVELS['-8'][statType];
}

const storyData = {
    "prologue": {
        background: "office",
        dialogues: [
            {
                speaker: "narrator",
                text: "Прошел месяц напряженной работы. Ваша команда создала инновационную платформу для внутренних коммуникаций.",
                character: null
            },
            {
                speaker: "narrator", 
                text: "Сегодня - день защиты на престижной IT-конференции 'Цифровое будущее'. Результат определит не только судьбу проекта, но и вашу карьеру в компании.",
                character: null
            }
        ],
        choices: [
            {
                text: "Продолжить",
                next: "director_meeting"
            }
        ]
    },

    "director_meeting": {
        background: "boss-office",
        dialogues: [
            {
                speaker: "narrator",
                text: "Алексей приводит вас к директору. На столе лежат документы конференции.",
                character: null
            },
            {
                speaker: "director",
                text: "Отлично! Проект готов, и я принял решение - на конференцию едете вы двое. Это большая ответственность и возможность.",
                character: "director"
            },
            {
                speaker: "alexy",
                text: "Мы? Я думал, поедет более опытная команда...",
                character: "alexy-mentor"
            },
            {
                speaker: "director", 
                text: "Наша команда получила крупный проект. Нужно создать платформу для улучшения коммуникаций в компании. Что тебя больше привлекает",
                character: "director"
            }
        ],
        choices: [
            {
                text: "Разработка функционала",
                effects: { 
                    [STATS.EFFICIENCY]: 2, 
                    [STATS.LEADERSHIP]: 2 
                },
                result: "Директор одобрительно кивает: \"Вот это настрой! Именно такого отношения я и ждал.\" Алексей улыбается вам - ваша уверенность произвела хорошее впечатление на обоих.",
                next: "road_to_hotel"
            },
            {
                text: "Создание дизайна",
                effects: { 
                    [STATS.LEADERSHIP]: 1, 
                    [STATS.PSYCHOLOGY]: -1 
                },
                result: "Директор понимающе смотрит на вас: \"Волнение - это нормально. Главное, что ты готов попробовать.\" Алексей ободряюще кладет руку на плечо, но внутри вы чувствуете лёгкую тревогу.",
                next: "road_to_hotel"
            },
            {
                text: "Создание дизайна",
                effects: { 
                    [STATS.LEADERSHIP]: -2, 
                    [STATS.EFFICIENCY]: -1 
                },
                result: "Лицо директора слегка омрачается: \"Такая неуверенность меня разочаровывает. Я верил в тебя.\" Алексей неловко откашливается - ваши сомнения подорвали авторитет и в глазах руководства, и в собственных.",
                next: "road_to_hotel"
            },
            {
                text: "Координация процессов",
                effects: { 
                    [STATS.PSYCHOLOGY]: 1, 
                    [STATS.COLLECTIVE]: -2 
                },
                result: "В кабинете повисает неловкая тишина. Директор хмурит брови, а Алексей смущенно отводит взгляд. \"Это... была шутка?\" - неуверенно спрашивает директор. Ваша неуместная попытка разрядить обстановку только всё испортила.",
                next: "road_to_hotel"
            }
        ]
    },

    "road_to_hotel": {
        background: "hotel-room",
        dialogues: [
            {
                speaker: "narrator",
                text: "Вы с Алексеем едете на конференцию. Дорога занимает 3 часа. Алексей рассказывает о предыдущих конференциях, дает советы...",
                character: null
            },
            {
                speaker: "alexy",
                text: "Главное - не волноваться. Ты знаешь материал. А я буду рядом.",
                character: "alexy-mentor"
            },
            {
                speaker: "narrator",
                text: "Прибытие в отель. 22:00. Алексей: \"Завтра рано вставать. Конференция начинается в 9 утра, наше выступление в 11. Рекомендую хорошо выспаться. Увидимся завтра за завтраком!\" Вы остались одни в номере. Ваши действия:",
                character: null
            }
        ],
        choices: [
            {
                text: "Лечь спать пораньше (22:30)",
                effects: { 
                    [STATS.EFFICIENCY]: 2, 
                    [STATS.PSYCHOLOGY]: 1 
                },
                result: "Вы мудро решили хорошо выспаться. Утром просыпаетесь бодрым и готовым к важному дню. Голова ясная, мысли сосредоточены - отличная подготовка к конференции.",
                next: "conference_morning",
                setFlag: "well_rested"
            },
            {
                text: "Повторить речь защиты (до 23:30)",
                effects: { 
                    [STATS.LEADERSHIP]: 2, 
                    [STATS.PSYCHOLOGY]: -1 
                },
                result: "Вы тщательно проговариваете каждую фразу презентации, запоминаете ключевые моменты. Слегка устали, но теперь материал сидит в голове крепко. Это может очень пригодиться завтра.",
                next: "conference_morning",
                setFlag: "practiced_speech"
            },
            {
                text: "Поиграть в мобильную игру для расслабления (до 01:00)",
                effects: { 
                    [STATS.PSYCHOLOGY]: 1, 
                    [STATS.EFFICIENCY]: -2 
                },
                result: "Игра затягивает вас до глубокой ночи. Вроде бы расслабились, но теперь переживаете, что мало поспите. Мелодия из игры крутится в голове - сможете ли завтра сосредоточиться на важном?",
                next: "conference_morning",
                setFlag: "played_games"
            },
            {
                text: "Изучить информацию о других участниках (до 00:30)",
                effects: { 
                    [STATS.COLLECTIVE]: 1, 
                    [STATS.PSYCHOLOGY]: -1,
                    [STATS.EFFICIENCY]: 1 
                },
                result: "Вы изучаете профили других команд, их проекты и подходы. Полезная информация, которая поможет понять уровень конкуренции, но от обилия данных слегка болит голова.",
                next: "conference_morning",
                setFlag: "studied_competitors"
            }
        ]
    },

    "conference_morning": {
        background: "hotel-room",
        dialogues: [
            {
                speaker: "narrator",
                text: "Будильник звонит в 7:00. Как вы себя чувствуете после вчерашнего вечера?",
                character: null
            }
        ],
        choices: [
            {
                text: "Продолжить",
                next: "conference_hall"
            }
        ]
    },

    "conference_hall": {
        background: "conference-room",
        dialogues: [
            {
                speaker: "narrator",
                text: "Вы заходите в зал, полный IT-специалистов, стартаперов и инвесторов, и занимаете свои места. Первая команда уже выступает. Вы — последние в очереди.",
                character: null
            },
            {
                speaker: "narrator",
                text: "Наступает ваша очередь. Вы с Алексеем уверенно выходите к экрану. Присутствующие внимательно окидывают вас взглядом. Алексей подключает кабель к ноутбуку, но на экране ничего не отображается.",
                character: null
            },
            {
                speaker: "alexy",
                text: "Что за... Сейчас, минутку... *пытается перезагрузить* Зал начинает шептаться. Время идет. Что делать?",
                character: "alexy-mentor"
            }
        ],
        choices: [
            {
                text: "Начать рассказывать о компании",
                requires: "practiced_speech",
                effects: { 
                    [STATS.LEADERSHIP]: 2, 
                    [STATS.EFFICIENCY]: 1 
                },
                result: "Вы вспоминаете слова, которые повторяли перед сном, и уверенно начинаете: \"Уважаемые коллеги, пока мы решаем техническую проблему, позвольте рассказать о нашей компании...\" Зал внимательно слушает, Алексей благодарно смотрит на вас. Кризис превращен в возможность!",
                next: "presentation_minigame"
            },
            {
                text: "Рассказать анекдот про IT",
                effects: { 
                    [STATS.LEADERSHIP]: 1, 
                    [STATS.COLLECTIVE]: -1 
                },
                result: "\"Знаете, наш проект как раз решает проблему, когда техника не работает в самый важный момент!\" С зала раздаются редкие смешки. Большинство слушателей теряют к вам интерес - шутка показалась неуместной в серьезной обстановке.",
                next: "presentation_minigame"
            },
            {
                text: "Попросить техническую паузу",
                effects: { 
                    [STATS.EFFICIENCY]: -1 
                },
                result: "\"Уважаемые коллеги, нам нужна минута на решение технической проблемы\" Честное признание проблемы. Зал понимающе ждет, но драгоценное время презентации уходит. Вы чувствуете, как теряете инициативу и контроль над ситуацией.",
                next: "presentation_minigame"
            },
            {
                text: "Молча ждать, пока Алексей решит проблему",
                effects: { 
                    [STATS.LEADERSHIP]: -2 
                },
                result: "Вы стоите в стороне, пока Алексей борется с техникой. Зал видит, что вы не готовы взять инициативу в сложной ситуации. Упущенная возможность показать лидерские качества.",
                next: "presentation_minigame"
            }
        ]
    },

    "presentation_minigame": {
        background: "conference-room",
        dialogues: [
            {
                speaker: "narrator",
                text: "Техническая проблема решена! Теперь нужно провести презентацию.",
                character: null
            }
        ],
        minigame: {
            type: "sort_presentation",
            instruction: "Расставьте пункты презентации в правильном порядке за 30 секунд!",
            items: [
                "Введение",
                "Актуальность", 
                "Решение задач",
                "Функционал приложения",
                "Вывод"
            ],
            correctOrder: [0, 1, 2, 3, 4],
            timeLimit: 30,
            onSuccess: {
                effects: { 
                    [STATS.EFFICIENCY]: 2, 
                    [STATS.LEADERSHIP]: 2 
                },
                result: "Вы четко и логично излагаете материал. Зал слушает внимательно, Алексей гордо улыбается. Профессиональная подача произвела отличное впечатление на аудиторию.",
                next: "questions_from_audience"
            },
            onFailure: {
                effects: { 
                    [STATS.EFFICIENCY]: -2, 
                    [STATS.LEADERSHIP]: -1 
                },
                result: "Вы путаетесь в последовательности, перескакиваете с темы на тему. Алексей вынужден вмешаться: \"Позвольте, я дополню...\" Зал видит, что вы не владеете материалом в достаточной мере.",
                next: "questions_from_audience"
            }
        }
    },

    "questions_from_audience": {
        background: "conference-room",
        dialogues: [
            {
                speaker: "narrator",
                text: "После презентации поднимается мужчина с задних рядов.",
                character: null
            },
            {
                speaker: "narrator",
                text: "Интересный проект! А как вы планируете решить проблему информационной безопасности в корпоративной среде?",
                character: "question-men"
            },
            {
                speaker: "narrator",
                text: "Алексей переводит взгляд на вас. В зале тишина.",
                character: null
            },
            {
                speaker: "alexy",
                text: "Твой выход. Будешь отвечать?",
                character: "alexy-mentor"
            }
        ],
        choices: [
            {
                text: "Да, отвечу сам!",
                next: "answer_minigame"
            },
            {
                text: "Лучше ответит Алексей",
                effects: { 
                    [STATS.LEADERSHIP]: -2, 
                    [STATS.EFFICIENCY]: -1 
                },
                result: "Алексей профессионально отвечает на вопрос, но его взгляд говорит о разочаровании. Зал видит, что стажер не готов к серьезным вызовам. Упущенная возможность показать себя.",
                next: "conference_results"
            }
        ]
    },

    "answer_minigame": {
        background: "conference-room",
        dialogues: [
            {
                speaker: "narrator",
                text: "Вы решили отвечать сами. Нужно дать уверенный ответ!",
                character: null
            }
        ],
        minigame: {
            type: "rhythm_answer",
            instruction: "Нажимайте на кружочки в ритм, чтобы дать уверенный ответ! Попадите в 4 из 5 кружков!",
            targetScore: 4,
            maxScore: 5,
            onSuccess: {
                effects: { 
                    [STATS.LEADERSHIP]: 2, 
                    [STATS.EFFICIENCY]: 1 
                },
                result: "Вы уверенно отвечаете: \"Мы предусмотрели многоуровневую систему шифрования и аутентификации. Все данные хранятся локально с резервным копированием...\" Зал одобрительно кивает, а в глазах Алексея читается гордость за своего подопечного.",
                next: "conference_results"
            },
            onFailure: {
                effects: { 
                    [STATS.LEADERSHIP]: -2, 
                    [STATS.EFFICIENCY]: -1 
                },
                result: "Вы начинаете отвечать, но сбиваетесь: \"Ну... мы... то есть... безопасность это...\" Алексей видит ваши затруднения и перехватывает инициативу: \"Позвольте мне дополнить...\" Неловкость ситуации очевидна всем присутствующим.",
                next: "conference_results"
            }
        }
    },

    "conference_results": {
        background: "conference-room",
        dialogues: [
            {
                speaker: "narrator",
                text: "Через час после всех выступлений ведущий объявляет: \"А теперь результаты! 1-е место... 2-е место... 3-е место... 4-е место занимает команда 'Инноватех' с проектом 'КоммуникоПро'!\"",
                character: null
            }
        ],
        choices: [
            {
                text: "Четвертое место? Отлично! Мы в топе!",
                effects: { 
                    [STATS.PSYCHOLOGY]: 1, 
                    [STATS.COLLECTIVE]: 1 
                },
                result: "Ваш позитивный настрой заражает окружающих. Другие участники улыбаются и поздравляют вас. Алексей довольно кивает - такое отношение к результату показывает зрелость.",
                next: "ending_determination"
            },
            {
                text: "Могли бы и выше, но опыт бесценен",
                effects: { 
                    [STATS.EFFICIENCY]: 1 
                },
                result: "Взвешенная оценка ситуации. Вы показываете, что умеете анализировать результаты и извлекать пользу даже из не самых блестящих итогов.",
                next: "ending_determination"
            },
            {
                text: "Обидно... Думал, что заняли выше",
                effects: { 
                    [STATS.PSYCHOLOGY]: -1, 
                    [STATS.LEADERSHIP]: -1 
                },
                result: "Ваше разочарование очевидно. Алексей хмурится - такая реакция на достойный результат говорит о незрелости и завышенных ожиданиях.",
                next: "ending_determination"
            },
            {
                text: "Промолчать и поддержать Алексея",
                effects: { 
                    [STATS.LEADERSHIP]: 1, 
                    [STATS.COLLECTIVE]: 1 
                },
                result: "Вы мудро решаете не акцентировать внимание на результате, вместо этого благодарите Алексея за поддержку. Зрелый поступок, который оценили и наставник, и окружающие.",
                next: "ending_determination"
            }
        ]
    },

    "ending_determination": {
        background: "office",
        isEndingNode: true
    },

    "ending_hired": {
        background: "reception",
        dialogues: [
            {
                speaker: "alexy",
                text: "Поздравляю! Директор только что позвонил - тебя официально принимают в штат! Должность: младший специалист! Ты показал себя как перспективный сотрудник, который может работать под давлением и развиваться.",
                character: "alexy-mentor"
            }
        ],
        isEnding: true,
        choices: [
            {
                text: "Начать заново",
                next: "prologue",
                restart: true
            }
        ]
    },

    "ending_internship_extended": {
        background: "office",
        dialogues: [
            {
                speaker: "alexy",
                text: "Не расстраивайся. Опыт был отличным, но нужно еще немного подтянуть навыки. Стажировка продлевается на месяц. У тебя есть потенциал, но требуется больше времени для развития.",
                character: "alexy-mentor"
            }
        ],
        isEnding: true,
        choices: [
            {
                text: "Начать заново",
                next: "prologue",
                restart: true
            }
        ]
    },

    "ending_warning": {
        background: "office",
        dialogues: [
            {
                speaker: "alexy",
                text: "Слушай, нам нужно поговорить. Твои шутки в неподходящие моменты создают проблемы. Стажировка продлевается, но работай над тем, когда и что говоришь. Профессионализм важнее юмора.",
                character: "alexy-mentor"
            }
        ],
        isEnding: true,
        choices: [
            {
                text: "Начать заново",
                next: "prologue",
                restart: true
            }
        ]
    },

    "ending_fired": {
        background: "office",
        dialogues: [
            {
                speaker: "alexy",
                text: "К сожалению, этот путь не для тебя. Результаты показывают, что тебе нужно серьезно поработать над профессиональными навыками. Но не сдавайся - опыт поможет в будущем!",
                character: "alexy-mentor"
            }
        ],
        isEnding: true,
        choices: [
            {
                text: "Начать заново",
                next: "prologue",
                restart: true
            }
        ]
    }
};

function determineEnding(stats) {
    // Условия трудоустройства: Отношения с руководителем >= 0 И Эффективность >= 0
    if (stats.leadership >= 0 && stats.efficiency >= 0) {
        return "ending_hired";
    }
    
    // Условия выговора: Коллектив <= -2 (любитель анекдотов)
    if (stats.collective <= -2) {
        return "ending_warning";
    }
    
    // Условия увольнения: Эффективность <= -5
    if (stats.efficiency <= -5) {
        return "ending_fired";
    }
    
    // Иначе - продление стажировки
    return "ending_internship_extended";
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        storyData,
        STATS,
        STAT_LEVELS,
        getStatLevel,
        determineEnding
    };
}

// Состояние игры
let wins = 0;
let losses = 0;
let currentPairs = [];
let currentConditions = [];
let correctAnswers = [0, 0];

// Элементы DOM
const code1Element = document.getElementById('code1');
const code2Element = document.getElementById('code2');
const pairsDisplay = document.getElementById('pairs-display');
const answer1Input = document.getElementById('answer1');
const answer2Input = document.getElementById('answer2');
const winsElement = document.getElementById('wins');
const lossesElement = document.getElementById('losses');
const checkBtn = document.getElementById('check-btn');

// Вспомогательные функции
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomCondition(variable) {
    const operators = ['>', '<', '>=', '<=', '!='];
    const operator = operators[getRandomInt(0, operators.length - 1)];
    const value = getRandomInt(-49, 49);
    return { variable, operator, value };
}

function generateCode(conditions, joinOperator) {
    const condition1 = `${conditions[0].variable} ${conditions[0].operator} ${conditions[0].value}`;
    const condition2 = `${conditions[1].variable} ${conditions[1].operator} ${conditions[1].value}`;

    return `s = int(input())\nt = int(input())\nif ${condition1} ${joinOperator} ${condition2}:\n    print("YES")\nelse:\n    print("NO")`;
}

function generateRandomPairs(count) {
    const pairs = [];
    for (let i = 0; i < count; i++) {
        pairs.push([getRandomInt(-50, 50), getRandomInt(-50, 50)]);
    }
    return pairs;
}

function evaluateCondition(condition, s, t) {
    const varValue = condition.variable === 's' ? s : t;
    const expr = `${varValue} ${condition.operator} ${condition.value}`;
    return eval(expr);
}

function countYesResults(conditions, joinOperator, pairs) {
    let count = 0;

    pairs.forEach(([s, t]) => {
        const result1 = evaluateCondition(conditions[0], s, t);
        const result2 = evaluateCondition(conditions[1], s, t);

        if (joinOperator === 'or') {
            if (result1 || result2) count++;
        } else {
            if (result1 && result2) count++;
        }
    });

    return count;
}

function updateScore() {
    winsElement.textContent = wins;
    lossesElement.textContent = losses;
}

function displayPairs(pairs) {
    pairsDisplay.textContent = pairs.map(pair => `(${pair[0]}, ${pair[1]})`).join(', ');
}

function newGame() {
    // Генерация случайных условий
    currentConditions = [
        generateRandomCondition('s'),
        generateRandomCondition('t')
    ];

    // Генерация кодов
    const code1 = generateCode(currentConditions, 'or');
    const code2 = generateCode(currentConditions, 'and');

    code1Element.textContent = code1;
    code2Element.textContent = code2;

    // Генерация случайных пар
    currentPairs = generateRandomPairs(10);
    displayPairs(currentPairs);

    // Подсчет правильных ответов
    correctAnswers = [
        countYesResults(currentConditions, 'or', currentPairs),
        countYesResults(currentConditions, 'and', currentPairs)
    ];

    // Очистка полей ввода
    answer1Input.value = '';
    answer2Input.value = '';

    // Сброс стилей
    code1Element.classList.remove('correct', 'incorrect');
    code2Element.classList.remove('correct', 'incorrect');
}

function checkAnswers() {
    const userAnswer1 = parseInt(answer1Input.value);
    const userAnswer2 = parseInt(answer2Input.value);

    if (isNaN(userAnswer1) || isNaN(userAnswer2)) {
        alert('Пожалуйста, введите числа в оба поля');
        return;
    }

    const isCorrect1 = userAnswer1 === correctAnswers[0];
    const isCorrect2 = userAnswer2 === correctAnswers[1];

    // Визуальные эффекты
    if (isCorrect1) {
        code1Element.classList.add('correct');
    } else {
        code1Element.classList.add('incorrect');
        code1Element.classList.add('shake');
        setTimeout(() => code1Element.classList.remove('shake'), 300);
    }

    if (isCorrect2) {
        code2Element.classList.add('correct');
    } else {
        code2Element.classList.add('incorrect');
        code2Element.classList.add('shake');
        setTimeout(() => code2Element.classList.remove('shake'), 300);
    }

    // Обновление счета
    if (isCorrect1 && isCorrect2) {
        wins++;
        setTimeout(() => {
            document.querySelector('.container').classList.add('pulse');
            setTimeout(() => document.querySelector('.container').classList.remove('pulse'), 500);
            alert('Правильно! Отличная работа!');
            newGame();
        }, 500);
    } else {
        losses++;
        setTimeout(() => {
            alert(`Неверно. Правильные ответы: ${correctAnswers[0]} (OR) и ${correctAnswers[1]} (AND).`);
            newGame();
        }, 500);
    }

    updateScore();
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    newGame();
    updateScore();

    checkBtn.addEventListener('click', checkAnswers);

    // Обработка нажатия Enter
    answer1Input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswers();
    });

    answer2Input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswers();
    });
});
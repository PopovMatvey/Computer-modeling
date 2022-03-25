
/* Переменные */
const SAMPLE_SIZE = 1000;
const AMOUNT_EXPERIENCE = 1000;
const AMOUNT_STEPS = 10;
const ARRAY_AWAY_FROM_START = [];
const ARRAY_AWAY_FROM_START_AVERAGE = [];
const AMOUNT_INTERVALS = 20;
const DELTA = 10;              // Дельта
let firstHistogrammData = {};  // Данные для гистограммы

// Моделирование эксперимента
function modilateExperience(arrayAwayFromStartAverage, arrayAwayFromStart, amountExperience, amountSteps, sampleSize) {
    let pointAwayFromStratAverage = 0;
    let pointAwayFromStrat = 0;
    let moveToX = 0;
    let moveToY = 0;
    let moveToZ = 0;

    for (let k = 0; k < sampleSize; k++) {
        pointAwayFromStratAverage = 0;
        for (let i = 0; i < amountExperience; i++) {
            moveToX = 0;
            moveToY = 0;
            moveToZ = 0;
            for (let j = 0; j < amountSteps; j++) {
                r = Math.random();
                if (r < 0.1667) {
                    moveToX--;
                } else if (r < 0.3334) {
                    moveToX++;
                } else if (r < 0.5001) {
                    moveToY--;
                } else if (r < 0.7505) {
                    moveToY++;
                } else if (r < 0.8335) {
                    moveToZ--;
                } else if (r < 1) {
                    moveToZ++;
                }
            }
            pointAwayFromStrat = Math.sqrt(moveToX * moveToX + moveToY * moveToY + moveToZ * moveToZ);
            arrayAwayFromStart.push(pointAwayFromStrat);
            pointAwayFromStratAverage += pointAwayFromStrat;
        }
        arrayAwayFromStartAverage.push(pointAwayFromStratAverage / amountExperience);
    }
}

// Сортировка массива
function arraySort(array) {
    array.sort(
        function (a, b) {
            return a - b;
        }
    );
}

// Получить величину одного интервала
function getInerval(array, part, n) {
    return (array[n - 1] - array[0]) / part;
}

// Получить Первый элемент массива
function getFirstElementarray(array, n) {
    let lastElement = 0;

    for (let i = 0; i < n; i++) {
        lastElement = array[0];
    }

    return lastElement;
}

// Получить последний элемент массива
function getLastElementarray(array, n) {
    let lastElement = 0;

    for (let i = 0; i < n; i++) {
        lastElement = array[n - 1];
    }

    return lastElement;
}

// Получить массив левой границы интервалов
function getLeftBoardForNormArray(a, k, koefInt) {
    let array = [];

    for (let i = 0; i < k; i++) {
        array[i] = (a * i) + koefInt;
    }

    return array;
}

// Получить массив правой границы интервалов
function getRightBoardForNormArray(a, k, koefInt) {
    let array = [];

    for (let i = 0; i < k; i++) {
        array[i] = (a + a * i) + koefInt;
    }

    return array;
}

// Получить оценку вероятностей попадания случайной величины на всех интервалах
function getArrayWithValuesBelongingDetermInterval(array, intervAmount, rightBoardForNormFunction, leftBoardForNormFunction, n) {
    let amountArray = [];

    for (let i = 0; i < intervAmount; i++) {
        amountArray[i] = 0;

        for (let j = 0; j < n; j++) {
            if ((array[j] <= rightBoardForNormFunction[i]) && (array[j] > leftBoardForNormFunction[i])) {
                amountArray[i] = amountArray[i] + 1;
            }
        }
    }

    return amountArray;
}

// Получить нормализованное количество значений
function getNormlAmoutValue(amountArray, intervAmount, delta) {
    let normlAmountArray = [];

    for (let i = 0; i < intervAmount; i++) {
        normlAmountArray[i] = amountArray[i] / (delta);
    }

    return normlAmountArray;
}

// Заполнить первую гистограмму данными
function fillFirstGistogrammData(keys, pSluchValue, k) {
    for (let i = 0; i < k; i++) {
        let key = keys[i];
        let value = pSluchValue[i];
        firstHistogrammData[key] = value;
    }

}

//Получить стат функцию
function getStatFunction(diffrentRightArray, array, n, amountInterals) {
    let statFunc = [];
    let sumStatFunction = 0;

    for (let i = 0; i < amountInterals; i++) {
        statFunc[i] = 0;

        for (let j = 0; j < n; j++) {
            if ((array[j] < diffrentRightArray[i])) {
                sumStatFunction = sumStatFunction + statFunc[i] + 1;
                statFunc[i] = statFunc[i] + 1;
            }
        }
    }

    return statFunc;
}

// Получить сумму стат функции
function getSumStatFunction(array, k) {
    let summArray = [];
    let sum = 0;

    for (let i = 0; i < k; i++) {
        sum = sum + array[i];
        summArray[i] = (sum + array[i]) / k;
    }

    let lastElementSummArray = getLastElementarray(summArray, k);

    for (let i = 0; i < k; i++) {
        summArray[i] = summArray[i] / lastElementSummArray;
    }


    return summArray;
}

// Получить массив функции нормального закона
function getFuncNormlRule(n) {
    let counter = 0;
    let sumNormlRul = [];

    for (let i = 0; i < n; i++) {
        counter++;
        sumNormlRul[i] = counter / n;
    }

    return sumNormlRul;
}


// Нормализация элементов выборки
function normolizeValuesSample(array, lastElement, amountElements) {
    let returnedArray = [];

    for (let i = 0; i < amountElements; i++) {
        returnedArray[i] = array[i] / lastElement;
    }

    return returnedArray;
}

// Моделирование эксперимента
modilateExperience(ARRAY_AWAY_FROM_START_AVERAGE, ARRAY_AWAY_FROM_START, AMOUNT_EXPERIENCE, AMOUNT_STEPS, SAMPLE_SIZE);
arraySort(ARRAY_AWAY_FROM_START);
arraySort(ARRAY_AWAY_FROM_START_AVERAGE);

let firlsElementSample = getFirstElementarray(ARRAY_AWAY_FROM_START_AVERAGE, SAMPLE_SIZE);
let lastElementSample = getLastElementarray(ARRAY_AWAY_FROM_START_AVERAGE, SAMPLE_SIZE);

const NORMOLIZE_ARRAY = normolizeValuesSample(ARRAY_AWAY_FROM_START_AVERAGE, lastElementSample, SAMPLE_SIZE);

firlsElementSample = getFirstElementarray(NORMOLIZE_ARRAY, SAMPLE_SIZE);
lastElementSample = getLastElementarray(NORMOLIZE_ARRAY, SAMPLE_SIZE);

const SIZE_INTERVAL = getInerval(NORMOLIZE_ARRAY, AMOUNT_INTERVALS, SAMPLE_SIZE);
const RIGHT_BORDERS = getRightBoardForNormArray(SIZE_INTERVAL, AMOUNT_INTERVALS, firlsElementSample);
const LEFT_BORDERS = getLeftBoardForNormArray(SIZE_INTERVAL, AMOUNT_INTERVALS, firlsElementSample);
const AMOUNT_VALUES_ARRAY = getArrayWithValuesBelongingDetermInterval(NORMOLIZE_ARRAY, AMOUNT_INTERVALS, RIGHT_BORDERS, LEFT_BORDERS, SAMPLE_SIZE);
const AMOUNT_NORMOLIZE_VALUES_ARRAY = getNormlAmoutValue(AMOUNT_VALUES_ARRAY, AMOUNT_INTERVALS, DELTA);

// Заполнение гистограммы данными
fillFirstGistogrammData(RIGHT_BORDERS, AMOUNT_NORMOLIZE_VALUES_ARRAY, AMOUNT_INTERVALS);

const ARRAY_STAT_FUNCTION = getStatFunction(RIGHT_BORDERS, AMOUNT_NORMOLIZE_VALUES_ARRAY, SAMPLE_SIZE, AMOUNT_INTERVALS);
const ARRAY_SUM__STAT_FUNCTION = getSumStatFunction(AMOUNT_NORMOLIZE_VALUES_ARRAY, AMOUNT_INTERVALS);

const ARRAY_NORM_RASPR = getFuncNormlRule(SAMPLE_SIZE);

//Ставим загрузку диаграммы на событие загрузки страницы
window.addEventListener("load", Diagram);


//Готовим диаграмму
function Diagram() {
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], //Подписи оси x
            datasets: [
                {
                    label: 'F(x)', //Метка
                    data: [], //Данные
                    borderColor: 'blue', //Цвет
                    borderWidth: 2, //Толщина линии
                    fill: false //Не заполнять под графиком
                },
                //Можно добавить другие графики
            ]
        },
        options: {
            responsive: false, //Вписывать в размер canvas
            scales: {
                xAxes: [{
                    display: true
                }],
                yAxes: [{
                    display: true
                }]
            }
        }
    });

    //Заполняем данными
    // for (var i = 0.0; i < AMOUNT_INTERVALS; i++) {
    for (var i = 0.0; i < AMOUNT_INTERVALS; i++) {
        myChart.data.labels.push('' + ARRAY_SUM__STAT_FUNCTION[i].toFixed(2));
        myChart.data.datasets[0].data.push(f(ARRAY_SUM__STAT_FUNCTION[i]).toFixed(2));
    }

    //Обновляем
    myChart.update();

    //Вычисление нужной функции
    function f(x) {
        return x;
    }

}


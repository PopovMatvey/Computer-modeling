/* Переменные */

let arrayNormalRasprX = [];     // Массив с нормальным законом распределнения X
let arrayNormalRasprY = [];     // Массив с нормальным законом распределнения Y
let arrayNormal = [];
let randomAmountArray = [];
let randomAmountArrayNorml = [];
let statFunction = [];          // Стат функция
let sumStatFunction = [];          // Стат функция
let sumNormlRulArray = [];
let normlSecondArry = [];

let amountArray = [];       // Массив с количеством чисел на каждом интервале
let verPopSluchVal = [];    // Массив вероятностей попадания случайных чисел на каждом интервале
let waitAmountVal = [];     // Массив ожидаемых числовых величин
let c = [];                 // Массив С
let mearDifr = 0;           // Величина расхождения между теоретической и эксперементальной плотностями вероятности
let XiCv = 0;               // "хи-квадрат"


let randomRightArray = [];      //Массив правых границ интервалов
let randomLeftArray = [];       //Массивы левых границ интервалов

let sizeInterval = 0;

let firstHistogrammData = {};  // Данные для гистограммы

// Параметры выборки
const DELTA = 67;              // Дельта
const SAMPLE_SIZE = 1000;      // Размер выборки
const AMOUNT_INTERVALS = 15;   // Количество интервалов
const MATH_WAITING = -1.5;      // Мат. ожидание
const DISPERTION = 1.7;        // Дисперсия

// Переменные для критерия Колмогорова
let iOnN = [];              // i/n
let iSubOneOnN = [];        // (i-1)/n
let dPlus = [];             // D+
let lastElementDPlus = 0;   // Последний элемент D+
let dSub = [];              // D-
let lasrElementDSub = 0;    // Последний элемент D-
let maxD = 0;               // Максимальное D
let dTabl = 0               // D табл.
let lyambda = 0;            // Лямбда



// Генератор для бета-распределения
function getRandomValue(arrayFirst, arraySecond, mathWait, middleSqwOtkl, n) {
    let p = 2;
    let m = 5;

    for (let i = 0; i < n; i++) {
        s = 0.0;
     
        for (let j = 0; j < m; j++) {
            r = Math.random();
            s += Math.log(r) / (p + j);
        }
        arrayFirst[i] = Math.exp(s);
    }
}

// Генератор для распределения Вейбула
function getRandomValueSecond(arrayFirst, mathWait, middleSqwOtkl, n) {
    let c = 2;
    let b = 5;

    for (let i = 0; i < n; i++) {
        r = Math.random();
        arrayFirst[i] = b * Math.pow(-Math.log(r), 1 / c);
    }
}



// Получить оценку вероятностей попадания случайной величины на всех интервалах
function getpSluchValue(amountArray, array, intervAmount, rightBoardForNormFunction, leftBoardForNormFunction) {
    for (let i = 0; i < intervAmount; i++) {
        amountArray[i] = 0;

        for (let j = 0; j < SAMPLE_SIZE; j++) {
            if ((array[j] <= rightBoardForNormFunction[i]) && (array[j] > leftBoardForNormFunction[i])) {
                amountArray[i] = amountArray[i] + 1;
            }
        }
    }
}

// Получить нормализованное количество значений
function getNormlAmoutValue(normlAmountArray, amountArray, intervAmount) {
    for (let i = 0; i < intervAmount; i++) {
        normlAmountArray[i] = amountArray[i] / (DELTA);
    }
}

// Получить массив левой границы интервалов
function getLeftBoardForNormArray(array, a, k, koefInt) {
    for (let i = 0; i < k; i++) {
        array[i] = (a * i) + koefInt;
    }
}

// Получить массив правой границы интервалов
function getRightBoardForNormArray(array, a, k, koefInt, lastElement) {
    for (let i = 0; i < k; i++) {
        array[i] = (a + a * i) + koefInt;
    }
}

// Получить величину одного интервала
function getInerval(array, part) {
    return (array[SAMPLE_SIZE - 1] - array[0]) / part;
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
function getStatFunction(statFunc, diffrentRightArray, array) {
    let sumStatFunction = 0;

    for (let i = 0; i < AMOUNT_INTERVALS; i++) {
        statFunc[i] = 0;

        for (let j = 0; j < SAMPLE_SIZE; j++) {
            if ((array[j] < diffrentRightArray[i])) {
                sumStatFunction = sumStatFunction + statFunc[i] + 1;
                statFunc[i] = statFunc[i] + 1;

            }
        }
    }
}

// Получить сумму стат функции
function getSumStatFunction(summArray, array) {
    let sum = 0;

    for (let i = 0; i < AMOUNT_INTERVALS; i++) {
        sum = sum + array[i];
        summArray[i] = (sum + array[i]) / SAMPLE_SIZE;
        summArray[AMOUNT_INTERVALS - 1] = SAMPLE_SIZE / SAMPLE_SIZE;
    }

}

// Получить последний элемент массива
function getLastElementArray(array) {
    let lastElementArray = 0;

    for (let i = 0; i < SAMPLE_SIZE; i++) {
        lastElementArray = array[SAMPLE_SIZE - 1];

        return lastElementArray;
    }
}

// Получить Мат ожидание
function getMathWaiting(array) {
    let summNumbers = 0;

    for (let i = 0; i < SAMPLE_SIZE; i++) {
        summNumbers = summNumbers + array[i];
    }

    return mathWait = summNumbers / SAMPLE_SIZE;
}

// Получить диперсию
function getDispersion(mathWait, array) {
    let sumDisp = 0;

    for (let i = 0; i < SAMPLE_SIZE; i++) {
        sumDisp = sumDisp + (array[i] - mathWait) * (array[i] - mathWait);
    }

    return sumDisp / (SAMPLE_SIZE - 1);
}


// Получить массив функции нормального закона
function getFuncNormlRule(sumNormlRul, array) {
    let counter = 0;
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        counter++;
        sumNormlRul[i] = counter / SAMPLE_SIZE;

    }

}


/*Критерий Колмогорова*/

// Расчёт i/n
function getIOnN(array) {
    let j = 0;
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        j = i + 1;
        array[i] = j / SAMPLE_SIZE;
    }
}

// Расччёт (i-1)/n
function getISubOneOnN(array) {
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        array[i] = i / SAMPLE_SIZE;
    }
}

// Расчёт D+
function countDplus(arrayDPlus, arrayIOnN, arrayX) {
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        arrayDPlus[i] = arrayIOnN[i] - arrayX[i];
    }
}

// Расчёт D-
function countDsub(arrayDSub, arrayISubOneOnN, arrayX) {
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        arrayDSub[i] = arrayX[i] - arrayISubOneOnN[i];
    }
}

// Получить Первый элемент массива
function getFirstElementarray(array) {
    let lastElement = 0;

    for (let i = 0; i < SAMPLE_SIZE; i++) {
        lastElement = array[0];
    }

    return lastElement;
}

// Получить последний элемент массива
function getLastElementarray(array) {
    let lastElement = 0;

    for (let i = 0; i < SAMPLE_SIZE; i++) {
        lastElement = array[SAMPLE_SIZE - 1];
    }

    return lastElement;
}

// Определение макимального числа 
function getMaxValue(firstVal, secondVals, koef) {
    if (firstVal > secondVals) {

        return firstVal;
    } else if (firstVal < secondVals) {

        return secondVals;
    }

    return;
}

// Получить лямбду
function getLyambda(D, n) {
    let lyambda = 0;
    lyambda = (6 * n * D + 1) / (6 * Math.sqrt(n));
    return lyambda * 10;
}

// Определение ответа в критерии Колмогорова
function determAnswerKolm(D, d) {
    if (d >= D) {
        $(".sravn-krit-Kolm_chart")[0].innerHTML = "<";
        $(".answer-kri-Kolm")[0].innerHTML = "Гипотеза подтверждается";
    } else if (d < D) {
        $(".sravn-krit-Kolm_chart")[0].innerHTML = ">";
        $(".answer-kri-Kolm")[0].innerHTML = "Гипотеза отвергается";
    }
}

// Интегрирование функции 
function integrirFunction(mathWait, leftX, array) {
    let = integrFunction = [];

    for (let i = 1; i < SAMPLE_SIZE; i++) {

        if ((array[i] > leftX) && (array[i] < mathWait)) {
            integrFunction[i] = array[i] - array[i - 1];

        }
    }



    return integrFunction;
}

/*Критерий Пирсона*/

// Получить массив случайной величины
function getVerPopSluchVal(array, k, rightBoardForNormFunction, leftBoardForNormFunction, sizeInterval) {
    for (let i = 0; i < k; i++) {
        array[i] = ((rightBoardForNormFunction[i] - leftBoardForNormFunction[i]) / 2) * sizeInterval;
    }
}

// Получить массив С
function getCArray(array, n, k, verPopSluchVal) {
    for (let i = 0; i < k; i++) {
        array[i] = n / verPopSluchVal[i];
    }
}

// Получение ожидаемого количества величин в каждом интервале
function getWaitAmountVal(array, intervAmount, n, verPopSluchVal) {
    for (let i = 0; i < intervAmount; i++) {
        array[i] = n * verPopSluchVal[i];
    }
}

// Подсчёт "хи-квадрат" для критерия Пирсона
function countXiCv(val, amountArray, verPopSluchVal, intervAmount) {
    let sumVal = 0;
    for (let i = 0; i < intervAmount; i++) {
        val = ((amountArray[i] - verPopSluchVal[i]) * (amountArray[i] - verPopSluchVal[i])) / verPopSluchVal[i];
        sumVal = sumVal + val;
    }
    return sumVal;
}

// Определение ответа в критерии Пирсона
function determAnswerPirson(XiCv, mearDifr) {
    if (mearDifr > XiCv) {
        $(".sravn-krit-Pirson_chart")[0].innerHTML = "<";
        $(".answer-kri-Pirson")[0].innerHTML = "Гипотеза подтверждается";
    } else if (mearDifr < XiCv) {
        $(".sravn-krit-Pirson_chart")[0].innerHTML = ">";
        $(".answer-kri-Pirson")[0].innerHTML = "Гипотеза отвергается";
    } else if (mearDifr == XiCv) {
        $(".sravn-krit-Pirson_chart")[0].innerHTML = "=";
        $(".answer-kri-Pirson")[0].innerHTML = "Гипотеза отвергается";
    }
}

// Получить оценку вероятностей попадания случайной величины на всех интервалах
function getpAmountValue(array, intervAmount, vib, rightBoardForNormFunction, leftBoardForNormFunction) {
    for (let i = 0; i < intervAmount; i++) {
        array[i] = 0;
        for (let j = 0; j < SAMPLE_SIZE; j++) {
            if ((vib[j] < rightBoardForNormFunction[i]) & (vib[j] >= leftBoardForNormFunction[i])) {
                array[i] = array[i] + 1;
            }
        }
    }
}


// Переключаем эти две функции для проверки одного задания

getRandomValue(arrayNormalRasprX, arrayNormalRasprY, MATH_WAITING, DISPERTION, SAMPLE_SIZE);

// getRandomValueSecond(arrayNormalRasprX, MATH_WAITING, DISPERTION, SAMPLE_SIZE);



arraySort(arrayNormalRasprX);


getInerval(arrayNormalRasprX, AMOUNT_INTERVALS);

// Получаем правую границу интервалов
getRightBoardForNormArray(randomRightArray, getInerval(arrayNormalRasprX, AMOUNT_INTERVALS), AMOUNT_INTERVALS, getFirstElementarray(arrayNormalRasprX), getLastElementArray(arrayNormalRasprX));

// Получаем левую границу интервалов
getLeftBoardForNormArray(randomLeftArray, getInerval(arrayNormalRasprX, AMOUNT_INTERVALS), AMOUNT_INTERVALS, getFirstElementarray(arrayNormalRasprX));

getpSluchValue(randomAmountArray, arrayNormalRasprX, AMOUNT_INTERVALS, randomRightArray, randomLeftArray);


getNormlAmoutValue(randomAmountArrayNorml, randomAmountArray, AMOUNT_INTERVALS);


fillFirstGistogrammData(randomRightArray, randomAmountArray, AMOUNT_INTERVALS);


getStatFunction(statFunction, randomRightArray, randomAmountArrayNorml);


getSumStatFunction(sumStatFunction, randomAmountArray);

getFuncNormlRule(sumNormlRulArray, randomAmountArray);


let countingMathWaiting = getMathWaiting(arrayNormalRasprX);
let countingDispircion = getDispersion(countingMathWaiting, arrayNormalRasprX);

writeOnPage(countingMathWaiting, ".math-waiting__value");
writeOnPage(countingDispircion, ".dispercion__value");


// Критерий Колмогорова

const LEFT_X_VALUE = -3;

const ITEGRAL_FUNCTION = integrirFunction(countingMathWaiting, LEFT_X_VALUE, sumNormlRulArray);

getIOnN(iOnN);                              // Расчёт i/n
getISubOneOnN(iSubOneOnN);                  // Расччёт (i-1)/n
countDplus(dPlus, iOnN, sumNormlRulArray);
arraySort(dPlus);

lastElementDPlus = getLastElementarray(dPlus);
countDsub(dSub, iSubOneOnN, sumNormlRulArray);
arraySort(dSub);
lasrElementDSub = getLastElementarray(dSub);
maxD = getMaxValue(lastElementDPlus, lasrElementDSub, getLastElementArray(arrayNormalRasprX));

const LYANBDA = getLyambda(maxD, SAMPLE_SIZE,);

dTabl = 0.964;

writeOnPage(LYANBDA, ".D_value");
writeOnPage(dTabl, ".d_value");
determAnswerKolm(LYANBDA, dTabl);

// Получить количество чисел на каждом интервале
getpAmountValue(amountArray, AMOUNT_INTERVALS, arrayNormalRasprX, randomRightArray, randomLeftArray);
/*ГРАФИК ФУНКЦИИ*/

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
    for (var i = 0.0; i < AMOUNT_INTERVALS; i++) {
        myChart.data.labels.push('' + sumStatFunction[i].toFixed(2));
        myChart.data.datasets[0].data.push(f(sumStatFunction[i]).toFixed(2));
    }

    //Обновляем
    myChart.update();

    //Вычисление нужной функции
    function f(x) {
        return x;
    }

}

// Вывод в консоль
function write(arg) {
    console.log(arg);
}

// Сортировка массива
function arraySort(array) {
    array.sort(
        function (a, b) {
            return a - b;
        }
    );
}

function writeOnPage(value, pageField) {
    $(pageField)[0].innerHTML = value;
}

//Ставим загрузку диаграммы на событие загрузки страницы
window.addEventListener("load", Diagram);
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



// Получение случайных чисел
function getRandomValue(arrayFirst, arraySecond, mathWait, middleSqwOtkl, n) {
    let i = 0;
    while (i < n) {

        r1 = Math.random();
        r2 = Math.random();

        u1 = -1 + 2 * r1;
        u2 = -1 + 2 * r2;
        s = u1 * u1 + u2 * u2;

        if (s <= 1) {
            arrayFirst[i] = u1 * Math.sqrt(-2 * Math.log(s) / s);
            arrayFirst[i] = mathWait + arrayFirst[i] * Math.sqrt(middleSqwOtkl);
            i++;
        }
    }
}

function getRandomValueSecond(arrayFirst, mathWait, middleSqwOtkl, n) {
    // let x = 0;
    for (let i = 0; i < n; i++) {
        s = 0;
        for (let j = 0; j < 12; j++) {
            r = Math.random();
            s += r;
        }
        arrayFirst[i] = s - 6;
        arrayFirst[i] = mathWait + arrayFirst[i] * Math.sqrt(middleSqwOtkl);
        // console.log(i + 1, arrayFirst[i]);

    }

}



// Получить оценку вероятностей попадания случайной величины на всех интервалах
function getpSluchValue(amountArray, array, intervAmount, rightBoardForNormFunction, leftBoardForNormFunction) {
    for (let i = 0; i < intervAmount; i++) {
        amountArray[i] = 0;

        for (let j = 0; j < SAMPLE_SIZE; j++) {
            if ((array[j] <= rightBoardForNormFunction[i]) && (array[j] > leftBoardForNormFunction[i])) {
                amountArray[i] = amountArray[i] + 1;
                // console.log(array[j]," ", leftBoardForNormFunction[i], " ", rightBoardForNormFunction[i], " ", amountArray[i]);
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
        // console.log(a + a * i);
        // array[k] = lastElement + koefInt;
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
        // console.log(array[i])
    }



    return integrFunction;
}

/*Критерий Пирсона*/

// Получить массив случайной величины
function getVerPopSluchVal(array, k, rightBoardForNormFunction, leftBoardForNormFunction, sizeInterval) {
    for (let i = 0; i < k; i++) {
        array[i] = ((rightBoardForNormFunction[i] - leftBoardForNormFunction[i]) / 2) * sizeInterval;
        // console.log(((sizeInterval) / 2)* sizeInterval);
        // console.log(array[i])
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
        // console.log(verPopSluchVal[i])
    }
}

// Подсчёт "хи-квадрат" для критерия Пирсона
function countXiCv(val, amountArray, verPopSluchVal, intervAmount) {
    let sumVal = 0;
    for (let i = 0; i < intervAmount; i++) {
        val = ((amountArray[i] - verPopSluchVal[i]) * (amountArray[i] - verPopSluchVal[i])) / verPopSluchVal[i];

        // console.log((amountArray[i] - verPopSluchVal[i]) * (amountArray[i] - verPopSluchVal[i]) / verPopSluchVal[i]);
        // console.log(((verPopSluchVal[i]- amountArray[i]) * (verPopSluchVal[i] - amountArray[i]))/ verPopSluchVal[i] )
        // console.log(verPopSluchVal[i]);
        // console.log(amountArray[i]);


        // console.log((amountArray[i] - verPopSluchVal[i]) * (amountArray[i] - verPopSluchVal[i]));
        sumVal = sumVal + val;

        // console.log(sumVal)
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

// function getHi2(array) {
//     let xi = 0.0;
//     for (let i = 0; i < SAMPLE_SIZE; i++) {
//         let b = Math.pow(array[i] / SAMPLE_SIZE - calcItegr(i, AMOUNT_INTERVALS), 2) / calcItegr(i, AMOUNT_INTERVALS);
//         xi += b;

//         // console.log(index[i]);
//         // console.log(NR(i));
//     }

//     return xi * SAMPLE_SIZE;
// }

// function calcItegr(i, AMOUNT_INTERVALS) {
//     let a = (6 * i) / AMOUNT_INTERVALS + 2;
//     let b = (6 * (i + 1)) / AMOUNT_INTERVALS + 2;
//     // let AMOUNT_INTERVALS = 100;
//     let inter = (b - a) / AMOUNT_INTERVALS;
//     let x = 0;

//     for (let i = 0; i < AMOUNT_INTERVALS; i++) {
//         let min = a + i * inter;
//         let max = min + inter;
//         let res = ((functionOtX(min, DISPERTION, MATH_WAITING) + functionOtX(max, DISPERTION, MATH_WAITING)) / 2) * inter;
//         x += res;
//         // console.log(x);
//     }
//     // console.log(a);

//     return Math.abs(x);
// }

// function functionOtX(x, kvad, mu) {

//     let a =
//         (1 / (kvad * Math.sqrt(2 * Math.PI))) *
//         Math.exp(-0.5 * Math.pow((x - mu) / kvad, 2));
//     console.log(kvad);

//     return a;
// }


getRandomValue(arrayNormalRasprX, arrayNormalRasprY, MATH_WAITING, DISPERTION, SAMPLE_SIZE);

// getRandomValueSecond(normlSecondArry, MATH_WAITING, DISPERTION, SAMPLE_SIZE);
// getRandomValueSecond(arrayNormalRasprX, MATH_WAITING, DISPERTION, SAMPLE_SIZE);

arraySort(arrayNormalRasprX);

console.log(normlSecondArry);

getInerval(arrayNormalRasprX, AMOUNT_INTERVALS);

// console.log(getInerval(arrayNormalRasprX, AMOUNT_INTERVALS));

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

console.log(sumNormlRulArray);

let countingMathWaiting = getMathWaiting(arrayNormalRasprX);
let countingDispircion = getDispersion(countingMathWaiting, arrayNormalRasprX);

writeOnPage(countingMathWaiting, ".math-waiting__value");
writeOnPage(countingDispircion, ".dispercion__value");


// Критерий Колмогорова

const LEFT_X_VALUE = -3;

// console.log(integrirFunction(countingMathWaiting, LEFT_X_VALUE, sumNormlRulArray));

const ITEGRAL_FUNCTION = integrirFunction(countingMathWaiting, LEFT_X_VALUE, sumNormlRulArray);

// console.log(ITEGRAL_FUNCTION);

getIOnN(iOnN);                              // Расчёт i/n
getISubOneOnN(iSubOneOnN);                  // Расччёт (i-1)/n
countDplus(dPlus, iOnN, sumNormlRulArray);
// countDplus(dPlus, iOnN, ITEGRAL_FUNCTION);
arraySort(dPlus);

// console.log(sumNormlRulArray);

lastElementDPlus = getLastElementarray(dPlus);
countDsub(dSub, iSubOneOnN, sumNormlRulArray);
// countDsub(dSub, iSubOneOnN, ITEGRAL_FUNCTION);
arraySort(dSub);
lasrElementDSub = getLastElementarray(dSub);
maxD = getMaxValue(lastElementDPlus, lasrElementDSub, getLastElementArray(arrayNormalRasprX));

// console.log(maxD);
const LYANBDA = getLyambda(maxD, SAMPLE_SIZE,);

dTabl = 0.964;

writeOnPage(LYANBDA, ".D_value");
// writeOnPage(maxD, ".D_value");
writeOnPage(dTabl, ".d_value");
determAnswerKolm(LYANBDA, dTabl);
// determAnswerKolm(maxD, dTabl);

// Получить количество чисел на каждом интервале
getpAmountValue(amountArray, AMOUNT_INTERVALS, arrayNormalRasprX, randomRightArray, randomLeftArray);

// console.log(getHi2(amountArray));
// Критерий Пирсона 
// getVerPopSluchVal(verPopSluchVal, AMOUNT_INTERVALS, randomRightArray, randomLeftArray, getInerval(arrayNormalRasprX, AMOUNT_INTERVALS));
// getWaitAmountVal(waitAmountVal, AMOUNT_INTERVALS, SAMPLE_SIZE, verPopSluchVal);

// // console.log(waitAmountVal);

// mearDifr = 8.55;
// XiCv = countXiCv(XiCv, amountArray, waitAmountVal, AMOUNT_INTERVALS,);
// // XiCv = countXiCv(XiCv, amountArray, verPopSluchVal, AMOUNT_INTERVALS,);
// determAnswerPirson(XiCv, mearDifr);
// // writeOnPage(XiCv, ".XiCv_value");
// // writeOnPage(mearDifr, ".XiCvTabl_value");

// writeOnPage(XiCv, ".XiCv_value");
// writeOnPage(mearDifr, ".XiCvTabl_value");
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
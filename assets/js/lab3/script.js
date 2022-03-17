/*Переменные*/

// Массивы случайных чискл
var randomArray = [];

//Массив правых границ интервалов
let randomRightArray = [];

//Массивы левых границ интервалов
let randomLeftArray = [];

// Массив с количесвом элементов на каждом интервале
let randomAmountArray = [];

// Массив с нормализированными данными
let randomAmountArrayNorml = [];


//  
let delta = 67;


let n = 1000;
let k = 15;

// Переменные для критерия колмогорова
let iOnN = [];              // i/n
let iSubOneOnN = [];        // (i-1)/n
let dPlus = [];             // D+
let lastElementDPlus = 0;   // Последний элемент D+
let dSub = [];              // D-
let lasrElementDSub = 0;    // Последний элемент D-
let maxD = 0;               // Максимальное D
let dTabl = 0               // D табл.
let lyambda = 0;            // Лямбда
let pOtLyambda = 0;         // P(Лямбда)

//Праметриы выборки
let mathWaiting = 0;
let dispercion = 0;


// Объект данных для первой гистограммы
let firstHistogrammData = {};

// Ожидание прогрузки страницы
$(document).ready(function () {



});



// Закон распределения
function getRandomarray(array) {
    for (let i = 0; i < n; i++) {
        // максимальное значение плотности вероятности
        let C = 0.875;
        let a = 0;
        let b = 3.4;
        let f = true;
        let r1 = 0.00;
        let r2 = 0.00;
        let z1 = 0.00;
        let z2 = 0.00;
        while (f) {
            r1 = Math.random();
            r2 = Math.random();
            z1 = a + r1 * (b - a);
            z2 = C * r2;
            if (((z2 < 0.15) && (z1 > 0) && (z1 < 1)) || ((z2 < 0.35) && (z1 > 1) && (z1 < 2)) || ((z2 < 0.875) && (z1 > 2) && (z1 < 2.4)) || ((z2 < 0.15) && (z1 > 2.4) && (z1 < 3.4))) {
                array[i] = z1;
                f = false;
            }
        }
    }
    return array;
}


// Сортировка массива
function arraySort(array) {
    array.sort();
}

// Получить величину одного интервала
function getInerval(array, part) {
    return diffrent = (array[n - 1] - array[0]) / part;
}

// Получить массив левой границы интервалов
function getLeftBoardForNormArray(array, a, k, koefInt) {
    for (let i = 0; i < k; i++) {
        array[i] = (a * i) + koefInt;
    }
}

// Получить массив правой границы интервалов
function getRightBoardForNormArray(array, a, k, koefInt) {
    for (let i = 0; i < k; i++) {
        array[i] = (a + a * i) + koefInt;
    }
}

// Получить оценку вероятностей попадания случайной величины на всех интервалах
function getpSluchValue(amountArray, array, intervAmount, rightBoardForNormFunction, leftBoardForNormFunction) {
    for (let i = 0; i < intervAmount; i++) {
        amountArray[i] = 0;
        for (let j = 0; j < n; j++) {
            if ((array[j] < rightBoardForNormFunction[i]) & (array[j] >= leftBoardForNormFunction[i])) {
                amountArray[i] = amountArray[i] + 1;
            }
        }
    }
}


function getNormlAmoutValue(normlAmountArray, amountArray, intervAmount) {
    for (let i = 0; i < intervAmount; i++) {
        normlAmountArray[i] = amountArray[i] / (delta);
    }
}

// Заполнить первую гистограмму данными
function fillFirstGistogrammData(keys, pSluchValue, k) {
    for (let i = 0; i < k; i++) {
        let key = keys[i];
        let value = pSluchValue[i];
        firstHistogrammData[key] = value;
    }
}

/*Критерий Колмогорова*/

// Расчёт i/n
function getIOnN(array) {
    let j = 0;
    for (let i = 0; i < n; i++) {
        j = i + 1;
        array[i] = j / n;
    }
}

// Расччёт (i-1)/n
function getISubOneOnN(array) {
    for (let i = 0; i < n; i++) {
        array[i] = i / n;
    }
}

// Расчёт D+
function countDplus(arrayDPlus, arrayIOnN, arrayX) {
    for (let i = 0; i < n; i++) {
        if ((arrayX[i] >= 0) && (arrayX[i] < 1)) {
            arrayDPlus[i] = Math.abs(arrayIOnN[i] - (0.15 * arrayX[i] * 0.5));
        } else if ((arrayX[i] >= 1) && (arrayX[i] < 2)) {
            arrayDPlus[i] = Math.abs(arrayIOnN[i] - (0.35 * arrayX[i] * 0.5 - 0.2));
        }
        else if ((arrayX[i] >= 2) && (arrayX[i] < 2.4)) {
            arrayDPlus[i] = Math.abs(arrayIOnN[i] - (0.875 * arrayX[i] * 0.5 + 0.125));
        }
        else if ((arrayX[i] >= 2.4) && (arrayX[i] < 3.8)) {
            arrayDPlus[i] = Math.abs(arrayIOnN[i] - (0.15 * arrayX[i] * 0.5 + 0.49));
        }

    }
}

// Расчёт D-
function countDsub(arrayDSub, arrayISubOneOnN, arrayX) {
    for (let i = 0; i < n; i++) {
        if ((arrayX[i] >= 0) && (arrayX[i] * 0.5 < 1)) {
            arrayDSub[i] = Math.abs((0.15 * arrayX[i]) - arrayISubOneOnN[i]);
        } else if ((arrayX[i] >= 1) && (arrayX[i] < 2)) {
            arrayDSub[i] = Math.abs((0.35 * arrayX[i] * 0.5 - 0.2) - arrayISubOneOnN[i]);
        } else if ((arrayX[i] >= 2) && (arrayX[i] < 2.4)) {
            arrayDSub[i] = Math.abs((0.875 * arrayX[i] * 0.5 - 0.125) - arrayISubOneOnN[i]);
        } else if ((arrayX[i] >= 2.4) && (arrayX[i] < 3.4)) {
            arrayDSub[i] = Math.abs((0.15 * arrayX[i] * 0.5 + 0.49) - arrayISubOneOnN[i]);
        }
    }

}

// Получить последний элемент массива
function getLastElementarray(array) {
    let lastElement = 0;
    for (let i = 0; i < n; i++) {
        lastElement = array[n - 1];
    }
    return lastElement;
}

// Определение макимального числа 
function getMaxValue(firstVal, secondVals) {
    if (firstVal > secondVals) {
        return firstVal;
    } else if (firstVal < secondVals) {
        return secondVals;
    } else {
        return;
    }
}

// Получить лямбду
function getLyambda(D, n) {
    return D * Math.sqrt(n);
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

/*Параметры*/
// Получить Мат ожидание
function getMathWaiting(array) {
    let summNumbers = 0;
    let valueMathWaiting = 0;
    for (let i = 0; i < n; i++) {
        summNumbers = summNumbers + array[i];
    }
    valueMathWaiting = summNumbers / n;
    return valueMathWaiting;
}

// Получить диперсию
function getDispersion(array, mathWait) {
    let dispersion = 0;
    let sumDisp = 0;
    for (let i = 0; i < n; i++) {
        sumDisp = sumDisp + (array[i] - mathWait) * (array[i] - mathWait);
    }
    return dispersion = sumDisp / (n - 1);

}

let countRandomarray = getRandomarray(randomArray);
//Сортировка массивов
arraySort(countRandomarray);

// Получаем правую границу интервалов
getRightBoardForNormArray(randomRightArray, getInerval(randomArray, k), k, 0);

// Получаем левую границу интервалов
getLeftBoardForNormArray(randomLeftArray, getInerval(randomArray, k), k, 0);

// Получаем количесво элементов в каждом интервале каждой функции
getpSluchValue(randomAmountArray, randomArray, k, randomRightArray, randomLeftArray);


getNormlAmoutValue(randomAmountArrayNorml, randomAmountArray, k);


// Критерий Колмогорова
getIOnN(iOnN);              // Расчёт i/n
getISubOneOnN(iSubOneOnN);  // Расччёт (i-1)/n
countDplus(dPlus, iOnN, countRandomarray);
arraySort(dPlus);

lastElementDPlus = getLastElementarray(dPlus);
countDsub(dSub, iSubOneOnN, countRandomarray);
arraySort(dSub);


lasrElementDSub = getLastElementarray(dSub);

maxD = getMaxValue(lastElementDPlus, lasrElementDSub);




dTabl = 0.964;

writeInPage(maxD, ".D_value");
writeInPage(dTabl, ".d_value");
determAnswerKolm(maxD, dTabl);

// Расчёт параметров выборки

mathWaiting = getMathWaiting(countRandomarray);
writeInPage(mathWaiting, ".math-waiting__value");
dispercion = getDispersion(countRandomarray, mathWaiting);
writeInPage(dispercion, ".dispercion__value");


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
                    label: 'f(x)', //Метка
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
    for (var i = 0.0; i < n; i++) {
        myChart.data.labels.push('' + countRandomarray[i].toFixed(2));
        myChart.data.datasets[0].data.push(f(countRandomarray[i]).toFixed(2));
    }
    //Обновляем
    myChart.update();

    //Вычисление нужной функции
    function f(x) {
        return x;
    }

}
fillFirstGistogrammData(randomRightArray, randomAmountArrayNorml, k);
//Ставим загрузку диаграммы на событие загрузки страницы
window.addEventListener("load", Diagram);

// Вывод значение в поле страницы
function writeInPage(value, field) {
    $(field)[0].innerHTML = value;
}
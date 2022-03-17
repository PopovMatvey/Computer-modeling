/*Переменные*/
let a = 165;                // Значение a для генератора псевдослучайных чисел
let mu = 3463;              // Значение мю для генератора псевдослучайных чисел
let m = 4096 * 4;           // Хначение m для генератора псевдослучайных чисел
let y = 3887;               // Начальное значение y
let x = [];                 // Массив псевдослучайных чисел
let n = 4000;               // Размер выборки
let k = 16;                 // Количество частей выборки
let mathWait = 0;           // Мат ожидание
let summNumbers = 0;        // Сумма значений для подсчёта мат ожидания
let dispersion = 0;         // Дисперсия
let sumDisp = 0;            // Сумма значений, необходимая для подсчёта дисперсии
let pSluchValue = [];       // Оценка вероятности попадания случайной величины в i-й интервал
let amountNumberInPart = 0; // Количество значений в одной части выборки
let nullStr = "";           // Пустая строка
let keys = [];              // Индекс в объекте  гистограммы
let empireFunction = [];    // Эмпирическая функция
var diffrent = 0;           // Длина интервала от 0 до 1
var diffrentRightArray = [];// Массив правой границы интервала
var diffrentleftArray = []; // Массив левой границы интервала
let normAmountArray = [];   // Массив с нормализованными данными
var amountArray = [];       // Массив с количеством чисел на каждом интервале
let sumEmpireFunction = 0;  // Сумма эмпирической функции
let delta = 248;            // Дельта
let intervAmount = 0;       // Количество инервалов

let rightBoardForNormFunction = []; // Правая граница для нормализованной функции
let leftBoardForNormFunction = [];  // Левая граница для нормализованной функции


let firstHistogrammData = {};          // Объект данных для первой гистограммы
let secondHistogrammData = {};         // Объект данных для второй гистограммы

let secondMomentOutputField = ".second-moment_number";      // Поле вывода второго момента
let thirdMomentOutputField = ".third-moment_number";        // Поле выводв третьего момента


//Ожидание прогрущки страницы
$(document).ready(function () {


    // Расчёт и получение всех необходимых параметров
    getMathWaiting();
    getDispersion();
    getBeginnerMoment(2, secondMomentOutputField);
    getBeginnerMoment(3, thirdMomentOutputField);



});

// Манипуляция с выборкой
getPseudoRaundomNumber(a, mu, m);
arraySort(x);
getInerval(x, k);

// Получение границ интервалов
getDiffrentRightArrya(diffrentRightArray, diffrent);
getDiffrentLeftArrya(diffrentleftArray, diffrent);
getAmountInterv(n, delta);
getInerval(x, intervAmount);

getLeftBoardForNormArray(leftBoardForNormFunction, diffrent);
getRightBoardForNormArray(rightBoardForNormFunction, diffrent);


// Методы, необходимые для гистограммы
getAmountNumberInPart(n, k);
getpSluchValue(intervAmount);
getNormalArray(amountArray, delta, intervAmount);
getEmpireFunction();
fillFirstGistogrammData(rightBoardForNormFunction, normAmountArray, intervAmount);
fillSecondGistogrammData(rightBoardForNormFunction, empireFunction, intervAmount);

// Получить количество значений в одной части выборки
function getAmountNumberInPart(n, k) {
    amountNumberInPart = n / k;
}

function arraySort(array) {
    array.sort();
}

// Получить оценку вероятностей попадания случайной величины на всех интервалах
function getpSluchValue(intervAmount) {
    for (let i = 0; i < intervAmount; i++) {
        amountArray[i] = 0;
        for (let j = 0; j < n; j++) {
            if ((x[j] < rightBoardForNormFunction[i]) & (x[j] >= leftBoardForNormFunction[i])) {
                amountArray[i] = amountArray[i] + 1;
            }
        }
    }
}

// Получить величину одного интервала
function getInerval(array, part) {
    diffrent = (array[n - 1] - array[0]) / part;
}


// Получить массив правой границы интервалов
function getDiffrentRightArrya(array, a) {
    for (let i = 0; i < k; i++) {
        array[i] = a + a * i;
    }
}

// Получить количество интервалов
function getAmountInterv(n, delta) {
    intervAmount = (n / delta);
    if (intervAmount % 2 != 0) {
        intervAmount = intervAmount - intervAmount % 2
    }
}

// Получить массив левой границы интервалов
function getDiffrentLeftArrya(array, a) {
    for (let i = 0; i < k; i++) {
        array[i] = a * i;
    }
}
// Получить массив левой границы интервалов
function getLeftBoardForNormArray(array, a) {
    for (let i = 0; i < intervAmount; i++) {
        array[i] = a * i;
    }
}

// Получить массив правой границы интервалов
function getRightBoardForNormArray(array, a) {
    for (let i = 0; i < intervAmount; i++) {
        array[i] = a + a * i;
    }
}

// Получить массив левой границы интервалов
function getLeftArrya(array, a) {
    for (let i = 0; i < k; i++) {
        array[i] = a * i;
    }
}

//Получить эмпирическую функцию
function getEmpireFunction() {
    for (let i = 0; i < k; i++) {
        empireFunction[i] = 0;
        for (let j = 0; j < n; j++) {
            if ((x[j] < diffrentRightArray[i])) {
                sumEmpireFunction = sumEmpireFunction + empireFunction[i] + 1;
                empireFunction[i] = empireFunction[i] + 1;
            }
        }
    }
}

//Получить нормализованную функцию
function getNormalArray(amountArray, delta, intervAmount) {
    for (let i = 0; i < intervAmount; i++) {
        normAmountArray[i] = amountArray[i] / (delta);
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



// Заполнить вторую гистограмму данными
function fillSecondGistogrammData(keys, empireFunction, k) {
    for (let i = 0; i < k; i++) {
        let key = empireFunction[i];
        let value = empireFunction[i];
        secondHistogrammData[key] = value;

    }
}

// Генератор псевдослучайных чисел
function Rnd(a, mu, m) {
    y = (a * y + mu) % m;

    return y / m;
}

// Получить массив псевдослучайных чисел
function getPseudoRaundomNumber(a, mu, m) {
    for (let i = 0; i < n; i++) {
        x[i] = Rnd(a, mu, m);
    }
}

// Получить Мат ожидание
function getMathWaiting() {
    for (let i = 0; i < n; i++) {
        summNumbers = summNumbers + x[i];
    }
    mathWait = summNumbers / n;
    $(".math-wait_number")[0].innerHTML = mathWait;
}

// Получить диперсию
function getDispersion() {
    for (let i = 0; i < n; i++) {
        sumDisp = sumDisp + (x[i] - mathWait) * (x[i] - mathWait);
    }
    dispersion = sumDisp / (n - 1);
    $('.dispertion_number')[0].innerHTML = dispersion;
}

// Получить начальный момент определённого порядка
function getBeginnerMoment(step, outputField) {
    let summSecondmoment = 0;   // Начальный момент
    let beginnerMoment = 0;     // Сумма значений, необходимая для подсчёта начального момента 
    
    for (let i = 0; i < n; i++) {
        summSecondmoment = summSecondmoment + Math.pow(x[i], step);
    }
    beginnerMoment = summSecondmoment / n;
    $(outputField)[0].innerHTML = beginnerMoment;
}


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
    for (var x = 0.0; x <= diffrentRightArray[15]; x += diffrent) {
        myChart.data.labels.push('' + x.toFixed(2));
        myChart.data.datasets[0].data.push(f(x).toFixed(2));
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

//Ставим загрузку диаграммы на событие загрузки страницы
window.addEventListener("load", Diagram);
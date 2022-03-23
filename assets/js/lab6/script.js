/*Переменные*/

const AMOUNT_EXPERIENCES = 1000000
const FIRST_PROPABILITY = 0.6;
const SECOND_PROPABILITY = 0.6;
const THIRD_PROPABILITY = 0.6;
const AMOUNT_SWITCH = 2;
const PROPABILITY_ARRAY = [FIRST_PROPABILITY, SECOND_PROPABILITY, THIRD_PROPABILITY];
const MODALING_PROPABILITY = getExperiencePropability(AMOUNT_EXPERIENCES, FIRST_PROPABILITY, SECOND_PROPABILITY, THIRD_PROPABILITY, AMOUNT_SWITCH);
const POGR_TRUTH_INTERVAL = getPogrTruthInterval(AMOUNT_EXPERIENCES);
const RIGHT_BORDER_INTERVAL = getRightBorderInterval(MODALING_PROPABILITY, POGR_TRUTH_INTERVAL);
const LEFT_BORER_INTERVAL = getLeftBorderInterval(MODALING_PROPABILITY, POGR_TRUTH_INTERVAL);
const ACCURACY_PROPABILITY = getAccuracyPropability(PROPABILITY_ARRAY, AMOUNT_SWITCH);
const CONCLUSION = checkBelatednessAccPropabilityConfidenceInterval(ACCURACY_PROPABILITY, LEFT_BORER_INTERVAL, RIGHT_BORDER_INTERVAL);

// Вывод на страницу доверительных интервалов
inputOnPage(LEFT_BORER_INTERVAL, ".left-border");
inputOnPage(RIGHT_BORDER_INTERVAL, ".right-border");
inputOnPage(ACCURACY_PROPABILITY, ".accuracy-propability_value");
inputOnPage(CONCLUSION, ".conclusion-value");


// Получить вероятность из опыта
function getExperiencePropability(amountExperiences, propabilityFirst, propabilitySecond, propabilityThird, amountSwitch) {
    let amountPaasedEvent = 0;

    for (let i = 0; i < amountExperiences; i++) {
        let amountBagFirst = 0;
        let amountBagSecond = 0;
        let amountBagThird = 0;

        for (let k = 0; k < amountSwitch; k++) {

            r = Math.random();
            if (amountBagFirst < 2) {
                if (r < propabilityFirst) {
                    amountBagFirst++;
                }

                if (amountBagFirst === 2) {
                    firstUzel = "Первый узел неисправен";
                }
            }

            r = Math.random();

            if (amountBagSecond < 2) {
                if (r < propabilitySecond) {
                    amountBagSecond++;
                }

                if (amountBagSecond === 2) {
                    secondUzel = "Второй узел неисправен";
                }
            }

            r = Math.random();

            if (amountBagThird < 2) {
                if (r < propabilityThird) {
                    amountBagThird++;
                }

                if (amountBagThird === 2) {
                    thirdUzel = "Третий узел неисправен";
                }
            }

            if (k === amountSwitch - 1) {
                if ((amountBagFirst < 2) && (amountBagSecond < 2) && (amountBagThird < 2)) {
                    amountPaasedEvent++;
                }
            }
        }
    }

    return amountPaasedEvent / amountExperiences;
}

// Получение погрешности доверительного интервала
function getPogrTruthInterval(n) {
    return (1.96 * 0.08) / Math.sqrt(n);
}

// Получение правой границы доверительного интервала
function getRightBorderInterval(modalingPropability, pogrTruthInterval) {
    return modalingPropability + pogrTruthInterval;
}

// Получение левой границы доверительного интервала
function getLeftBorderInterval(modalingPropability, pogrTruthInterval) {
    return modalingPropability - pogrTruthInterval;
}

// Вывести значение на страницу
function inputOnPage(value, pageField) {
    $(pageField)[0].innerHTML = value;
}

// Подсчитать степень числа
function countValueInStep(value, step) {
    return Math.pow(value, step);
}

// Получить точную вероятность
function getAccuracyPropability(propabilityArray, amountSwitches) {
    let accuracyPropability = 1;
    let reversePropability = 0;
    let reversePropabilityMaxStep = 0;
    let reversePropabilityLowerStep = 0;
    let mullAmountSwitchAndAccPropabillity = 0;

    for (let i = 0; i < propabilityArray.length; i++) {
        reversePropability = 1 - propabilityArray[i];
        reversePropabilityMaxStep = countValueInStep(reversePropability, amountSwitches);
        reversePropabilityLowerStep = countValueInStep(reversePropability, amountSwitches - 1);
        mullAmountSwitchAndAccPropabillity = amountSwitches * propabilityArray[i];
        accuracyPropability = accuracyPropability * (reversePropabilityMaxStep + mullAmountSwitchAndAccPropabillity * reversePropabilityLowerStep);
    }

    return accuracyPropability;
}

// Проверка на принадлежность точной вероятности доверительному интервалу
function checkBelatednessAccPropabilityConfidenceInterval(accuracuPropability, leftBorder, rightBorder) {
    if ((accuracuPropability > leftBorder) && (accuracuPropability < rightBorder)) {
        return " Точная вероятность принадлежит доверительному интервалу ";
    }

    return " Точная вероятность не принадлежит доверительному интервалу ";
}

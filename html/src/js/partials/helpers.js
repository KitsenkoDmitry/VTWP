// Небольшие вспомогательные функции

/**
 * Проверяет число или нет
 *
 * @param {*} n Любой аргумент
 * @returns {boolean}
 */
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


/**
 * Удаляет все нечисловые символы и приводит к числу
 *
 * @param {str|number} param
 * @returns {number}
 */
function removeNotDigits(param) {
    /* удаляем все символы кроме цифр и переводим в число */
    return +param.toString().replace(/\D/g, '');
}

/**
 * Разделяет на разряды
 * Например, 3800000 -> 3 800 000
 *
 * @param {str|number} param
 * @returns {str}
 */
function divideByDigits(param) {
    if (param === null) param = 0;
    return param.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
}

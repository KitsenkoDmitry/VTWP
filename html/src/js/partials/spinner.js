/**
 *   Активировать/дезактивировать спиннер
 *   const $block = $('.spinner');
 *   const spinner = Spinner.getInstance($block);
 *   spinner.enableSpinner();/spinner.disableSpinner();
 *
 */

class Spinner {
    /**
     * @param  {Object}  options                   Объект с параметрами.
     * @param  {jQuery}  options.$block            Шаблон.
     * @param  {number}  [options.value = 0]       Начальное значение.
     * @param  {number}  [options.min = -Infinity] Минимальное значение.
     * @param  {number}  [options.max = Infinity]  Максимальное значение.
     * @param  {number}  [options.step = 1]        Шаг.
     * @param  {number}  [options.precision]       Точность (нужна для десятичного шага).
     */
    constructor({ $block, value = 0, min = -Infinity, max = Infinity, step = 1, precision } = {}) {
        this.$block = $block;
        this.elements = {
            $dec: $('.spinner__btn--dec', this.$block),
            $inc: $('.spinner__btn--inc', this.$block),
            $input: $('.spinner__input', this.$block),
        };

        this.value = +value;
        this.min = +min;
        this.max = +max;
        this.step = +step;
        this.precision = +precision;
    }

    /**
     * Приводит разметку в соответствие параметрам.
     */
    init() {
        this.updateButtons();
    }

    /**
     * Обновляет состояние блокировки кнопок.
     */
    updateButtons() {
        this.elements.$dec.prop('disabled', false);
        this.elements.$inc.prop('disabled', false);

        if (this.value < this.min + this.step) {
            this.elements.$dec.prop('disabled', true);
        }

        if (this.value > this.max - this.step) {
            this.elements.$inc.prop('disabled', true);
        }
    }

    /**
     * Отключение спиннера.
     */
    disableSpinner() {
        this.elements.$dec.prop('disabled', true);
        this.elements.$inc.prop('disabled', true);
        this.elements.$input.prop('disabled', true);
        this.$block.addClass('is-disabled');
    }

    /**
     * Включение спиннера.
     */
    enableSpinner() {
        this.init();
        this.elements.$input.prop('disabled', false);
        this.$block.removeClass('is-disabled');
    }

    /**
     * Обновляет значение счётчика.
     *
     * @param {number} value Новое значение.
     */
    changeValue(value) {
        this.value = value;
        this.$block.attr('data-value', value);
        this.elements.$input.attr('value', value);
        this.elements.$input.val(value);
    }

    /**
     * Меняет значение минимума.
     *
     * @param  {number} value Новое значение.
     */
    changeMin(value) {
        this.min = value;
        this.$block.attr('data-min', value);
    }

    /**
     * Меняет значение максимума.
     *
     * @param  {number} value Новое значение.
     */
    changeMax(value) {
        this.max = value;
        this.$block.attr('data-max', value);
    }

    /**
     * Массив созданных объектов.
     */
    static instances = [];

    /**
     * Находит объект класса по шаблону.
     *
     * @param  {jQuery} $block Шаблон.
     * @return {Spinner}       Объект.
     */
    static getInstance($block) {
        return Spinner.instances.find(spinner => spinner.$block.is($block));
    }

    /**
     * Создаёт объекты по шаблонам.
     *
     * @param {jQuery} [$spinners = $('.spinner')] Шаблоны.
     */
    static create($spinners = $('.spinner')) {
        $spinners.each((index, block) => {
            const $block = $(block);

            if (Spinner.getInstance($block)) return;

            const spinner = new Spinner({
                $block,
                value: $block.attr('data-value'),
                min: $block.attr('data-min'),
                max: $block.attr('data-max'),
                step: $block.attr('data-step'),
                precision: $block.attr('data-precision'),
            });

            $block.hasClass('is-disabled') ? spinner.disableSpinner() : spinner.init();

            Spinner.instances.push(spinner);
        });
    }

    /**
     * Удаляет объекты по шаблонам.
     *
     * @param {jQuery} [$spinners = $('.spinner')] Шаблоны.
     */
    static remove($spinners = $('.spinner')) {
        $spinners.each((index, block) => {
            const $block = $(block);

            const spinnerIndex = Spinner.instances.findIndex(spinner => spinner.$block.is($block));

            Spinner.instances.splice(spinnerIndex, 1);
        });
    }
}

$(document).on('click', '.spinner__btn--dec', handleDecClick);
$(document).on('click', '.spinner__btn--inc', handleIncClick);
$(document).on('input', '.spinner__input', handleInput);

/* Инициализация спиннеров */
let spinners = Spinner.create();

/**
 * Обработчик клика по кнопке уменьшения.
 *
 * @param {Object} e Объект события.
 */
function handleDecClick(e) {
    const { currentTarget } = e;
    const $target = $(currentTarget);
    const $block = $target.closest('.spinner');
    const spinner = Spinner.getInstance($block);

    let value = spinner.value - spinner.step;

    if (spinner.precision) {
        value = parseFloat(value.toFixed(spinner.precision));
    }

    spinner.changeValue(value);

    spinner.updateButtons();
}

/**
 * Обработчик клика по кнопке увеличения.
 *
 * @param {Object} e Объект события.
 */
function handleIncClick(e) {
    const { currentTarget } = e;
    const $target = $(currentTarget);
    const $block = $target.closest('.spinner');
    const spinner = Spinner.getInstance($block);

    let value = spinner.value + spinner.step;

    if (spinner.precision) {
        value = parseFloat(value.toFixed(spinner.precision));
    }

    spinner.changeValue(value);

    spinner.updateButtons();
}

/**
 * Обработчик ввода в поле.
 *
 * @param {Object} e Объект события.
 */
function handleInput(e) {
    const { currentTarget } = e;
    const $target = $(currentTarget);
    const $block = $target.closest('.spinner');
    const spinner = Spinner.getInstance($block);
    const { $input } = spinner.elements;

    let value = +$input.val();

    if (!$input.val().length || value < spinner.min || value > spinner.max) {
        ({ value } = spinner);
    }

    spinner.changeValue(value);

    spinner.updateButtons();
}

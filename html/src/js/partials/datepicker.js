const datepickerDefaultOptions = {
    dateFormat: 'dd.mm.yy',
    showOtherMonths: true,
};

/**
 * Делает выпадющие календарики
 * @see  http://api.jqueryui.com/datepicker/
 *
 * @example
 * // в data-date-min и data-date-max можно задать дату в формате dd.mm.yyyy
 * <input type="text" name="dateInput" id="" class="js-datepicker" data-date-min="06.11.2015" data-date-max="10.12.2015">
 */
let Datepicker = function() {
    const datepicker = $('.js-datepicker');

    datepicker.each(function() {
        let minDate = $(this).data('date-min');
        let maxDate = $(this).data('date-max');
        const showMY = $(this).data('show-m-y');

        /* если в атрибуте указано current, то выводим текущую дату */
        if (maxDate === 'current' || minDate === 'current') {
            const currentDate = new Date();
            let currentDay = currentDate.getDate();
            currentDay < 10 ? (currentDay = '0' + currentDay.toString()) : currentDay;
            const newDate = currentDay + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
            maxDate === 'current' ? (maxDate = newDate) : (minDate = newDate);
        }

        let itemOptions = {
            minDate: minDate || null,
            maxDate: maxDate || null,
            onSelect: function() {
                $(this).change();
                $(this)
                    .closest('.field')
                    .addClass('is-filled');
            },
        };

        if (showMY) {
            itemOptions['changeYear'] = true;
            itemOptions['yearRange'] = 'c-100:c';
            itemOptions['changeMonth'] = true;
        }

        $.extend(true, itemOptions, datepickerDefaultOptions);

        $(this).datepicker(itemOptions);
    });

    // делаем красивым селек месяца и года
    $(document).on('focus', '.js-datepicker', () => {
        // используем задержку, чтобы дейтпикер успел инициализироваться
        setTimeout(() => {
            if ($('.ui-datepicker').find('select').length) {
                $('.ui-datepicker')
                    .find('select')
                    .select2({
                        selectOnBlur: true,
                        dropdownCssClass: 'error',
                        minimumResultsForSearch: Infinity,
                    });
            }
        }, 10);
    });
};

let datepicker = new Datepicker();

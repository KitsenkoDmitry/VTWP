/**
 * Стилизует селекты с помощью плагина select2
 * https://select2.github.io
 */
let CustomSelect = function($elem) {
    let self = this;

    self.init = function($initElem) {
        $initElem.each(function() {
            if ($(this).hasClass('select2-hidden-accessible')) {
                return;
            } else {
                let selectSearch = $(this).data('search');
                let minimumResultsForSearch;

                if (selectSearch) {
                    minimumResultsForSearch = 1; // показываем поле поиска
                } else {
                    minimumResultsForSearch = Infinity; // не показываем поле поиска
                }

                $(this).select2({
                    minimumResultsForSearch: minimumResultsForSearch,
                    selectOnBlur: true,
                    dropdownCssClass: 'error',
                    language: {
                        noResults: function () {
                            return 'Совпадений не найдено';
                        },
                    }
                });

                $(this).on('change', function(e) {
                    // нужно для вылидации на лету
                    $(this).find(`option[value="${$(this).value}"]`).click();
                });
            }
        });

    };

    self.update = function($updateElem) {
        $updateElem.select2('destroy');
        self.init($updateElem);
    };

    self.init($elem);
};

var customSelect = new CustomSelect($('select'));

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(document).ready(function () {
  /**
   * Глобальные переменные, которые используются многократно
   */
  var globalOptions = {
    // Время для анимаций
    time: 200,
    // Контрольные точки адаптива
    desktopLgSize: 1910,
    desktopMdSize: 1600,
    desktopSize: 1480,
    desktopSmSize: 1280,
    tabletLgSize: 1024,
    tabletSize: 768,
    mobileLgSize: 640,
    mobileSize: 480,
    lang: $('html').attr('lang')
  }; // Брейкпоинты адаптива
  // @example if (globalOptions.breakpointTablet.matches) {} else {}

  var breakpoints = {
    breakpointDesktopLg: window.matchMedia("(max-width: ".concat(globalOptions.desktopLgSize - 1, "px)")),
    breakpointDesktopMd: window.matchMedia("(max-width: ".concat(globalOptions.desktopMdSize - 1, "px)")),
    breakpointDesktop: window.matchMedia("(max-width: ".concat(globalOptions.desktopSize - 1, "px)")),
    breakpointDesktopSm: window.matchMedia("(max-width: ".concat(globalOptions.desktopSmSize - 1, "px)")),
    breakpointTabletLg: window.matchMedia("(max-width: ".concat(globalOptions.tabletLgSize - 1, "px)")),
    breakpointTablet: window.matchMedia("(max-width: ".concat(globalOptions.tabletSize - 1, "px)")),
    breakpointMobileLgSize: window.matchMedia("(max-width: ".concat(globalOptions.mobileLgSize - 1, "px)")),
    breakpointMobile: window.matchMedia("(max-width: ".concat(globalOptions.mobileSize - 1, "px)"))
  };
  $.extend(true, globalOptions, breakpoints);
  $(window).on('load', function () {
    if ($('textarea').length > 0) {
      autosize($('textarea'));
    }
  });
  /**
   * Подключение js partials
   */

  /**
  * Расширение animate.css
  * @param  {String} animationName название анимации
  * @param  {Function} callback функция, которая отработает после завершения анимации
  * @return {Object} объект анимации
  *
  * @see  https://daneden.github.io/animate.css/
  *
  * @example
  * $('#yourElement').animateCss('bounce');
  *
  * $('#yourElement').animateCss('bounce', function() {
  *     // Делаем что-то после завершения анимации
  * });
  */

  $.fn.extend({
    animateCss: function animateCss(animationName, callback) {
      var animationEnd = function (el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd'
        };

        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      }(document.createElement('div'));

      this.addClass('animated ' + animationName).one(animationEnd, function () {
        $(this).removeClass('animated ' + animationName);
        if (typeof callback === 'function') callback();
      });
      return this;
    }
  }); // Небольшие вспомогательные функции

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

  var locale = globalOptions.lang == 'ru-RU' ? 'ru' : 'en';
  Parsley.setLocale(locale);
  /* Настройки Parsley */

  $.extend(Parsley.options, {
    trigger: 'blur change',
    // change нужен для select'а
    validationThreshold: '0',
    errorsWrapper: '<div></div>',
    errorTemplate: '<p class="parsley-error-message"></p>',
    classHandler: function classHandler(instance) {
      var $element = instance.$element;
      var type = $element.attr('type'),
          $handler;

      if (type == 'checkbox' || type == 'radio') {
        $handler = $element; // то есть ничего не выделяем (input скрыт), иначе выделяет родительский блок
      } else if ($element.hasClass('select2-hidden-accessible')) {
        $handler = $('.select2-selection--single', $element.next('.select2'));
      }

      return $handler;
    },
    errorsContainer: function errorsContainer(instance) {
      var $element = instance.$element;
      var type = $element.attr('type'),
          $container;

      if (type == 'checkbox' || type == 'radio') {
        $container = $("[name=\"".concat($element.attr('name'), "\"]:last + label")).next('.errors-placement');
      } else if ($element.hasClass('select2-hidden-accessible')) {
        $container = $element.next('.select2').next('.errors-placement');
      } else if (type == 'file') {
        $container = $element.closest('.custom-file').next('.errors-placement');
      } else if ($element.attr('name') == 'is_recaptcha_success') {
        $container = $element.parent().next('.g-recaptcha').next('.errors-placement');
      } // else {
      //     $container = $element.closest('.field');
      //     console.log($container)
      // }


      return $container;
    }
  }); // Кастомные валидаторы
  // Только русские буквы, тире, пробелы

  Parsley.addValidator('nameRu', {
    validateString: function validateString(value) {
      return /^[а-яё\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы А-Я, а-я, " ", "-"',
      en: 'Only simbols А-Я, а-я, " ", "-"'
    }
  }); // Только латинские буквы, тире, пробелы

  Parsley.addValidator('nameEn', {
    validateString: function validateString(value) {
      return /^[a-z\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, " ", "-"',
      en: 'Only simbols A-Z, a-z, " ", "-"'
    }
  }); // Только латинские и русские буквы, тире, пробелы

  Parsley.addValidator('name', {
    validateString: function validateString(value) {
      return /^[а-яёa-z\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, А-Я, а-я, " ", "-"',
      en: 'Only simbols A-Z, a-z, А-Я, а-я, " ", "-"'
    }
  }); // Только цифры и русские буквы

  Parsley.addValidator('numLetterRu', {
    validateString: function validateString(value) {
      return /^[0-9а-яё]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы А-Я, а-я, 0-9',
      en: 'Only simbols А-Я, а-я, 0-9'
    }
  }); // Только цифры, латинские и русские буквы

  Parsley.addValidator('numLetter', {
    validateString: function validateString(value) {
      return /^[а-яёa-z0-9]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, А-Я, а-я, 0-9',
      en: 'Only simbols A-Z, a-z, А-Я, а-я, 0-9'
    }
  }); // Телефонный номер

  Parsley.addValidator('phone', {
    validateString: function validateString(value) {
      return /^[-+0-9() ]*$/i.test(value);
    },
    messages: {
      ru: 'Некорректный телефонный номер',
      en: 'Incorrect phone number'
    }
  }); // Только цифры

  Parsley.addValidator('number', {
    validateString: function validateString(value) {
      return /^[0-9]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы 0-9',
      en: 'Only simbols 0-9'
    }
  }); // Почта без кириллицы

  Parsley.addValidator('email', {
    validateString: function validateString(value) {
      return /^([A-Za-zА-Яа-я0-9\-](\.|_|-){0,1})+[A-Za-zА-Яа-я0-9\-]\@([A-Za-zА-Яа-я0-9\-])+((\.){0,1}[A-Za-zА-Яа-я0-9\-]){1,}\.[a-zа-я0-9\-]{2,}$/.test(value);
    },
    messages: {
      ru: 'Некорректный почтовый адрес',
      en: 'Incorrect email address'
    }
  }); // Формат даты DD.MM.YYYY

  Parsley.addValidator('date', {
    validateString: function validateString(value) {
      var regTest = /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/,
          regMatch = /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
          min = arguments[2].$element.data('dateMin'),
          max = arguments[2].$element.data('dateMax'),
          minDate,
          maxDate,
          valueDate,
          result;

      if (min && (result = min.match(regMatch))) {
        minDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      if (max && (result = max.match(regMatch))) {
        maxDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      if (result = value.match(regMatch)) {
        valueDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      return regTest.test(value) && (minDate ? valueDate >= minDate : true) && (maxDate ? valueDate <= maxDate : true);
    },
    messages: {
      ru: 'Некорректная дата',
      en: 'Incorrect date'
    }
  }); // Файл ограниченного размера

  Parsley.addValidator('fileMaxSize', {
    validateString: function validateString(value, maxSize, parsleyInstance) {
      var files = parsleyInstance.$element[0].files;
      return files.length != 1 || files[0].size <= maxSize * 1024;
    },
    requirementType: 'integer',
    messages: {
      ru: 'Файл должен весить не более, чем %s Kb',
      en: "File size can't be more then %s Kb"
    }
  }); // Ограничения расширений файлов

  Parsley.addValidator('fileExtension', {
    validateString: function validateString(value, formats) {
      var fileExtension = value.split('.').pop();
      var formatsArr = formats.split(', ');
      var valid = false;

      for (var i = 0; i < formatsArr.length; i++) {
        if (fileExtension === formatsArr[i]) {
          valid = true;
          break;
        }
      }

      return valid;
    },
    messages: {
      ru: 'Допустимы только файлы формата %s',
      en: 'Available extensions are %s'
    }
  }); // Создаёт контейнеры для ошибок у нетипичных элементов

  Parsley.on('field:init', function () {
    var $element = this.$element,
        type = $element.attr('type'),
        $block = $('<div/>').addClass('errors-placement'),
        $last;

    if (type == 'checkbox' || type == 'radio') {
      $last = $("[name=\"".concat($element.attr('name'), "\"]:last + label"));

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.hasClass('select2-hidden-accessible')) {
      $last = $element.next('.select2');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if (type == 'file') {
      $last = $element.closest('.custom-file');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.closest('.js-datepicker-range').length) {
      $last = $element.closest('.js-datepicker-range');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.attr('name') == 'is_recaptcha_success') {
      $last = $element.parent().next('.g-recaptcha');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    }
  }); // Инициирует валидацию на втором каледарном поле диапазона

  Parsley.on('field:validated', function () {
    var $element = $(this.element);
  });
  $('form[data-validate="true"]').parsley(); // используется только на странице checkout.html

  if ($('.js-collapse-btn').length) {
    $(document).on('click', '.js-collapse-btn', function (e) {
      var $self = $(e.currentTarget);
      var $collapseBody = $self.closest('.js-collapse').find('.js-collapse-body');

      if ($self.hasClass('is-active')) {
        $self.removeClass('is-active');
        $collapseBody.slideUp('fast');
      } else {
        $self.addClass('is-active');
        $collapseBody.slideDown('fast');
      }
    });
  }
  /**
   * Добавляет маски в поля форм
   * @see  https://github.com/RobinHerbots/Inputmask
   *
   * @example
   * <input class="js-phone-mask" type="tel" name="tel" id="tel">
   */


  $('.js-phone-mask').inputmask('+7(999) 999-99-99', {
    clearMaskOnLostFocus: true,
    showMaskOnHover: false
  });
  /**
   * Стилизует селекты с помощью плагина select2
   * https://select2.github.io
   */

  var CustomSelect = function CustomSelect($elem) {
    var self = this;

    self.init = function ($initElem) {
      $initElem.each(function () {
        if ($(this).hasClass('select2-hidden-accessible')) {
          return;
        } else {
          var selectSearch = $(this).data('search');
          var minimumResultsForSearch;

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
              noResults: function noResults() {
                return 'Совпадений не найдено';
              }
            }
          });
          $(this).on('change', function (e) {
            // нужно для вылидации на лету
            $(this).find("option[value=\"".concat($(this).value, "\"]")).click();
          });
        }
      });
    };

    self.update = function ($updateElem) {
      $updateElem.select2('destroy');
      self.init($updateElem);
    };

    self.init($elem);
  };

  var customSelect = new CustomSelect($('select'));
  var datepickerDefaultOptions = {
    dateFormat: 'dd.mm.yy',
    showOtherMonths: true
  };
  /**
   * Делает выпадющие календарики
   * @see  http://api.jqueryui.com/datepicker/
   *
   * @example
   * // в data-date-min и data-date-max можно задать дату в формате dd.mm.yyyy
   * <input type="text" name="dateInput" id="" class="js-datepicker" data-date-min="06.11.2015" data-date-max="10.12.2015">
   */

  var Datepicker = function Datepicker() {
    var datepicker = $('.js-datepicker');
    datepicker.each(function () {
      var minDate = $(this).data('date-min');
      var maxDate = $(this).data('date-max');
      var showMY = $(this).data('show-m-y');
      /* если в атрибуте указано current, то выводим текущую дату */

      if (maxDate === 'current' || minDate === 'current') {
        var currentDate = new Date();
        var currentDay = currentDate.getDate();
        currentDay < 10 ? currentDay = '0' + currentDay.toString() : currentDay;
        var newDate = currentDay + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
        maxDate === 'current' ? maxDate = newDate : minDate = newDate;
      }

      var itemOptions = {
        minDate: minDate || null,
        maxDate: maxDate || null,
        onSelect: function onSelect() {
          $(this).change();
          $(this).closest('.field').addClass('is-filled');
        }
      };

      if (showMY) {
        itemOptions['changeYear'] = true;
        itemOptions['yearRange'] = 'c-100:c';
        itemOptions['changeMonth'] = true;
      }

      $.extend(true, itemOptions, datepickerDefaultOptions);
      $(this).datepicker(itemOptions);
    }); // делаем красивым селек месяца и года

    $(document).on('focus', '.js-datepicker', function () {
      // используем задержку, чтобы дейтпикер успел инициализироваться
      setTimeout(function () {
        if ($('.ui-datepicker').find('select').length) {
          $('.ui-datepicker').find('select').select2({
            selectOnBlur: true,
            dropdownCssClass: 'error',
            minimumResultsForSearch: Infinity
          });
        }
      }, 10);
    });
  };

  var datepicker = new Datepicker();
  var $mobileMenu = $('.js-mobile-menu');
  var $cartModal = $('.js-cart-modal');
  $(document).on('click', '.js-menu-btn', function () {
    openModal($mobileMenu);
  });
  $(document).on('click', '.js-menu-close', function () {
    hideModal($mobileMenu);
  });
  $(document).on('click', '.js-cart-btn', function (e) {
    e.preventDefault();
    openModal($cartModal);
  });
  $(document).on('click', '.js-cart-close', function () {
    hideModal($cartModal);
  });
  /**
   * Open modal block
   * @param {jQuery} $modalBlock Modal block
   */

  function openModal($modalBlock) {
    $modalBlock.addClass('is-active').animateCss('slideInRight');
    $('body').addClass('has-overlay');
    lockDocument();
  }
  /**
   * Hide modal block
   * @param {jQuery} $modalBlock Modal block
   */


  function hideModal($modalBlock) {
    $modalBlock.animateCss('slideOutRight', function () {
      $modalBlock.removeClass('is-active');
      $('body').removeClass('has-overlay');
      unlockDocument();
    });
  }
  /**
   * Unlock document for scroll
   */


  function unlockDocument() {
    $('html').removeClass('is-locked');
  }
  /**
   * Lock document for scroll
   * @param {jQuery} $lockBlock Block which define document height
   */


  function lockDocument() {
    $('html').addClass('is-locked');
  } // ------ логика открытия выпадашек хедера ------


  var $header = $('.js-header');
  $(document).on('mouseover', '.js-header-dropdown-btn', function (e) {
    var $self = $(e.currentTarget);
    var category = $self.attr('data-category');
    $('.js-header-dropdown').removeClass('is-active');
    $header.removeClass('is-active');
    $('body').removeClass('has-overlay');

    if (category) {
      var $categoryDropdown = $("[data-dropdown-category='".concat(category, "']"));
      $categoryDropdown.addClass('is-active');
      $header.addClass('is-active');
      $('body').addClass('has-overlay');
    }
  });
  $(document).on('mouseleave', '.js-header-dropdown', function (e) {
    $('.js-header-dropdown').removeClass('is-active');
    $header.removeClass('is-active');
    $('body').removeClass('has-overlay');
  }); // немного специфичные табы. Используются на странице checkout.html. При желании можно доработать

  if ($('.js-tabs-link').length) {
    $(document).on('click', '.js-tabs-link', function (e) {
      // e.preventDefault();
      var $self = $(e.currentTarget);
      if ($self.hasClass('is-active')) return;
      var $tabs = $self.closest('.js-tabs');
      var $tabsLinks = $tabs.find('.js-tabs-link');
      var $tabsItems = $tabs.find('.js-tabs-item'); // выключаем все активные табы и ссылки

      $tabsLinks.removeClass('is-active');
      $tabsItems.removeClass('is-active'); // выключаем валидацию у скрытых полей и очищаем их

      var $hiddenFormFields = $tabsItems.find('[data-required]');

      if ($hiddenFormFields.length) {
        $hiddenFormFields.prop('data-required', false);
        $hiddenFormFields.prop('required', false);
        $hiddenFormFields.val('');
      } // включаем нужный таб и делаем нужную ссылку активной


      $self.addClass('is-active');
      var $selfItem = $($self.data('tab'));
      $selfItem.addClass('is-active'); // включаем валидацию у скрытых полей

      $hiddenFormFields = $selfItem.find('[data-required]');

      if ($hiddenFormFields.length) {
        $hiddenFormFields.prop('data-required', true);
        $hiddenFormFields.prop('required', true);
      }
    });
  }
  /**
   *   Активировать/дезактивировать спиннер
   *   const $block = $('.spinner');
   *   const spinner = Spinner.getInstance($block);
   *   spinner.enableSpinner();/spinner.disableSpinner();
   *
   */


  var Spinner =
  /*#__PURE__*/
  function () {
    /**
     * @param  {Object}  options                   Объект с параметрами.
     * @param  {jQuery}  options.$block            Шаблон.
     * @param  {number}  [options.value = 0]       Начальное значение.
     * @param  {number}  [options.min = -Infinity] Минимальное значение.
     * @param  {number}  [options.max = Infinity]  Максимальное значение.
     * @param  {number}  [options.step = 1]        Шаг.
     * @param  {number}  [options.precision]       Точность (нужна для десятичного шага).
     */
    function Spinner() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          $block = _ref.$block,
          _ref$value = _ref.value,
          value = _ref$value === void 0 ? 0 : _ref$value,
          _ref$min = _ref.min,
          min = _ref$min === void 0 ? -Infinity : _ref$min,
          _ref$max = _ref.max,
          max = _ref$max === void 0 ? Infinity : _ref$max,
          _ref$step = _ref.step,
          step = _ref$step === void 0 ? 1 : _ref$step,
          precision = _ref.precision;

      _classCallCheck(this, Spinner);

      this.$block = $block;
      this.elements = {
        $dec: $('.spinner__btn--dec', this.$block),
        $inc: $('.spinner__btn--inc', this.$block),
        $input: $('.spinner__input', this.$block)
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


    _createClass(Spinner, [{
      key: "init",
      value: function init() {
        this.updateButtons();
      }
      /**
       * Обновляет состояние блокировки кнопок.
       */

    }, {
      key: "updateButtons",
      value: function updateButtons() {
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

    }, {
      key: "disableSpinner",
      value: function disableSpinner() {
        this.elements.$dec.prop('disabled', true);
        this.elements.$inc.prop('disabled', true);
        this.elements.$input.prop('disabled', true);
        this.$block.addClass('is-disabled');
      }
      /**
       * Включение спиннера.
       */

    }, {
      key: "enableSpinner",
      value: function enableSpinner() {
        this.init();
        this.elements.$input.prop('disabled', false);
        this.$block.removeClass('is-disabled');
      }
      /**
       * Обновляет значение счётчика.
       *
       * @param {number} value Новое значение.
       */

    }, {
      key: "changeValue",
      value: function changeValue(value) {
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

    }, {
      key: "changeMin",
      value: function changeMin(value) {
        this.min = value;
        this.$block.attr('data-min', value);
      }
      /**
       * Меняет значение максимума.
       *
       * @param  {number} value Новое значение.
       */

    }, {
      key: "changeMax",
      value: function changeMax(value) {
        this.max = value;
        this.$block.attr('data-max', value);
      }
      /**
       * Массив созданных объектов.
       */

    }], [{
      key: "getInstance",

      /**
       * Находит объект класса по шаблону.
       *
       * @param  {jQuery} $block Шаблон.
       * @return {Spinner}       Объект.
       */
      value: function getInstance($block) {
        return Spinner.instances.find(function (spinner) {
          return spinner.$block.is($block);
        });
      }
      /**
       * Создаёт объекты по шаблонам.
       *
       * @param {jQuery} [$spinners = $('.spinner')] Шаблоны.
       */

    }, {
      key: "create",
      value: function create() {
        var $spinners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $('.spinner');
        $spinners.each(function (index, block) {
          var $block = $(block);
          if (Spinner.getInstance($block)) return;
          var spinner = new Spinner({
            $block: $block,
            value: $block.attr('data-value'),
            min: $block.attr('data-min'),
            max: $block.attr('data-max'),
            step: $block.attr('data-step'),
            precision: $block.attr('data-precision')
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

    }, {
      key: "remove",
      value: function remove() {
        var $spinners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $('.spinner');
        $spinners.each(function (index, block) {
          var $block = $(block);
          var spinnerIndex = Spinner.instances.findIndex(function (spinner) {
            return spinner.$block.is($block);
          });
          Spinner.instances.splice(spinnerIndex, 1);
        });
      }
    }]);

    return Spinner;
  }();

  _defineProperty(Spinner, "instances", []);

  $(document).on('click', '.spinner__btn--dec', handleDecClick);
  $(document).on('click', '.spinner__btn--inc', handleIncClick);
  $(document).on('input', '.spinner__input', handleInput);
  /* Инициализация спиннеров */

  var spinners = Spinner.create();
  /**
   * Обработчик клика по кнопке уменьшения.
   *
   * @param {Object} e Объект события.
   */

  function handleDecClick(e) {
    var currentTarget = e.currentTarget;
    var $target = $(currentTarget);
    var $block = $target.closest('.spinner');
    var spinner = Spinner.getInstance($block);
    var value = spinner.value - spinner.step;

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
    var currentTarget = e.currentTarget;
    var $target = $(currentTarget);
    var $block = $target.closest('.spinner');
    var spinner = Spinner.getInstance($block);
    var value = spinner.value + spinner.step;

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
    var currentTarget = e.currentTarget;
    var $target = $(currentTarget);
    var $block = $target.closest('.spinner');
    var spinner = Spinner.getInstance($block);
    var $input = spinner.elements.$input;
    var value = +$input.val();

    if (!$input.val().length || value < spinner.min || value > spinner.max) {
      value = spinner.value;
    }

    spinner.changeValue(value);
    spinner.updateButtons();
  }

  initCarousels();
  $(window).on('resize', initCarousels); // инициализирует все карусели

  function initCarousels() {
    //  карусель на первом баннере на главной странице
    var $newsCarousel = $('.js-news-carousel');

    if ($newsCarousel.length && !$newsCarousel.hasClass('slick-initialized')) {
      $newsCarousel.slick({
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        centerMode: false,
        variableWidth: true,
        mobileFirst: true,
        responsive: [{
          breakpoint: 767,
          settings: {// infinite: false,
          }
        }, {
          breakpoint: 1023,
          settings: 'unslick'
        }]
      });
    } // карусель подбора байков


    var $bikesCarousel = $('.js-bikes-carousel');

    if ($bikesCarousel.length && !$bikesCarousel.hasClass('slick-initialized')) {
      $bikesCarousel.slick({
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
        mobileFirst: true,
        responsive: [{
          breakpoint: 767,
          settings: 'unslick'
        }]
      }); // check bike after init

      $bikesCarousel.find('.slick-active').find('input').prop('checked', true); // check bike after change

      $bikesCarousel.on('afterChange', function () {
        $bikesCarousel.find('.slick-active').find('input').prop('checked', true);
      });
    } // карусель категорий


    var $categoriesCarousel = $('.js-categories-carousel');

    if ($categoriesCarousel.length && !$categoriesCarousel.hasClass('slick-initialized')) {
      $categoriesCarousel.slick({
        arrows: false,
        infinite: false,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: '0',
        variableWidth: false,
        dots: true,
        mobileFirst: true,
        responsive: [{
          breakpoint: 767,
          settings: 'unslick'
        }]
      });
    } // карусель на главной


    var $indexMainCarousel = $('.js-index-main-carousel');

    if ($indexMainCarousel.length && !$indexMainCarousel.hasClass('slick-initialized')) {
      $indexMainCarousel.slick({
        arrows: false,
        infinite: false,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: '0',
        variableWidth: false,
        dots: true
      });
    } // карусель картинок товара


    var $productCarousel = $('.js-product-carousel');

    if ($productCarousel.length && !$productCarousel.hasClass('slick-initialized')) {
      $productCarousel.slick({
        arrows: true,
        infinite: true,
        slidesToShow: 1,
        prevArrow: '<button type="button" class="btn-arrow btn-arrow--prev product-page__carousel-prev"><svg class="icon icon--arrow-next"><use xlink:href="#icon-arrow_next"></use></svg></button>',
        nextArrow: '<button type="button" class="btn-arrow product-page__carousel-next"><svg class="icon icon--arrow-next"><use xlink:href="#icon-arrow_next"></use></svg></button>',
        dots: false,
        responsive: [{
          breakpoint: 768,
          settings: {
            arrows: false,
            dots: true
          }
        }]
      });
    } // карусель похожих товаров


    var $similarCarousel = $('.js-similar-carousel');

    if ($similarCarousel.length && !$similarCarousel.hasClass('slick-initialized')) {
      $similarCarousel.slick({
        arrows: false,
        infinite: false,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: '0',
        variableWidth: false,
        dots: true,
        mobileFirst: true,
        responsive: [{
          breakpoint: 639,
          settings: 'unslick'
        }]
      });
    } // карусель картинок


    var $pictureCarousel = $('.js-picture-carousel');

    if ($pictureCarousel.length && !$pictureCarousel.hasClass('slick-initialized')) {
      $pictureCarousel.slick({
        arrows: false,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true
      });
    }

    var $bikeCardCarousel = $('.js-bike-card-carousel');

    if ($bikeCardCarousel.length && !$bikeCardCarousel.hasClass('slick-initialized')) {
      $bikeCardCarousel.each(function (index, item) {
        $(item).slick({
          slidesToScroll: 1,
          slidesToShow: 1,
          arrows: false,
          dots: false,
          fade: true,
          responsive: [{
            breakpoint: 767,
            settings: {
              fade: false
            }
          }]
        });
      }); // реализовываем переключение слайдов

      $(document).on('click', '.js-bike-card-slide-btn', function (e) {
        var $btn = $(e.currentTarget);
        var $parent = $btn.closest('.bike-card');
        var $carousel = $parent.find('.js-bike-card-carousel');
        var slideId = $btn.data('slide');
        $parent.find('.js-bike-card-slide-btn').removeClass('is-active');
        $btn.addClass('is-active');
        $carousel.slick('slickGoTo', slideId);
      });
    }
  }

  var $upBtn = $('.js-btn-up');

  if ($upBtn.length) {
    $(document).on('click', '.js-btn-up', function () {
      $('html, body').animate({
        scrollTop: 0
      });
    });
    $(window).on('scroll', function () {
      if ($(window).width() >= globalOptions.tabletLgSize) {
        $(window).scrollTop() > 50 ? $upBtn.show() : $upBtn.hide();
      }
    });
  }

  var $filterModal = $('.js-filter-modal');

  if ($filterModal.length) {
    $(document).on('click', '.js-filter-btn', function (e) {
      $filterModal.addClass('is-active').animateCss('slideInRight');
      $('body').addClass('has-overlay');
    });
    $(document).on('click', '.js-filter-close', function (e) {
      $filterModal.animateCss('slideOutRight', function () {
        $filterModal.removeClass('is-active');
        $('body').removeClass('has-overlay');
      });
    });
  }

  if ($('.js-label-animation').length > 0) {
    /**
     * Анимация элемента label при фокусе полей формы
     */
    $('.js-label-animation').each(function (index, el) {
      var field = $(el).find('input, textarea');

      if ($(field).val().trim() != '' || $(field).is(':placeholder-shown')) {
        $(el).addClass('is-filled');
      }

      $(field).on('focus', function (event) {
        $(el).addClass('is-filled');
      }).on('blur', function (event) {
        if ($(this).val().trim() === '' && !$(field).is(':placeholder-shown')) {
          $(el).removeClass('is-filled');
        }
      });
    });
  }
  /* @see https://atomiks.github.io/tippyjs/ */


  var tooltipSettings = {
    arrow: false,
    allowHTML: false,
    animateFill: false,
    placement: 'right-center',
    distance: 20,
    theme: 'tooltip'
  };
  /**
   *  init all tooltips
   */

  function initTooltips() {
    $('[data-tooltip]').each(function (index, elem) {
      var localSettings = {
        content: $(elem).attr('data-tooltip')
      };

      if ($(elem).data('click')) {
        localSettings['trigger'] = 'click keyup';
        localSettings['interactive'] = true;
      }

      tippy(elem, Object.assign({}, tooltipSettings, localSettings));
    });
  }

  initTooltips(); // shop address
  // Московская облать, Солнечногорский район, д. Дурыкино, 1Д.

  var shop = {
    lat: 56.059695,
    lng: 37.144142
  }; // for black map

  var mapStyles = [{
    elementType: 'geometry',
    stylers: [{
      color: '#212121'
    }]
  }, {
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#757575'
    }]
  }, {
    elementType: 'labels.text.stroke',
    stylers: [{
      color: '#212121'
    }]
  }, {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{
      color: '#757575'
    }]
  }, {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#9e9e9e'
    }]
  }, {
    featureType: 'administrative.land_parcel',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#bdbdbd'
    }]
  }, {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#757575'
    }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{
      color: '#181818'
    }]
  }, {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#616161'
    }]
  }, {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [{
      color: '#1b1b1b'
    }]
  }, {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#2c2c2c'
    }]
  }, {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#8a8a8a'
    }]
  }, {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{
      color: '#373737'
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{
      color: '#3c3c3c'
    }]
  }, {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{
      color: '#4e4e4e'
    }]
  }, {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#616161'
    }]
  }, {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#757575'
    }]
  }, {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{
      color: '#000000'
    }]
  }, {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#3d3d3d'
    }]
  }]; // Initialize and add the map

  function initMap() {
    // The map, centered at Shop
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: shop,
      styles: mapStyles,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true
    });
    var pointIcon = {
      url: 'img/svg/point.svg',
      // This marker is 72 pixels wide by 72 pixels high.
      size: new google.maps.Size(72, 72),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the center at (0, 32).
      anchor: new google.maps.Point(36, 36)
    }; // The marker, positioned at shop

    var marker = new google.maps.Marker({
      position: shop,
      icon: pointIcon,
      map: map
    });
  }

  window.initMap = initMap;
  ;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wTGdTaXplIiwiZGVza3RvcE1kU2l6ZSIsImRlc2t0b3BTaXplIiwiZGVza3RvcFNtU2l6ZSIsInRhYmxldExnU2l6ZSIsInRhYmxldFNpemUiLCJtb2JpbGVMZ1NpemUiLCJtb2JpbGVTaXplIiwibGFuZyIsImF0dHIiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnREZXNrdG9wTGciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYnJlYWtwb2ludERlc2t0b3BNZCIsImJyZWFrcG9pbnREZXNrdG9wIiwiYnJlYWtwb2ludERlc2t0b3BTbSIsImJyZWFrcG9pbnRUYWJsZXRMZyIsImJyZWFrcG9pbnRUYWJsZXQiLCJicmVha3BvaW50TW9iaWxlTGdTaXplIiwiYnJlYWtwb2ludE1vYmlsZSIsImV4dGVuZCIsIm9uIiwibGVuZ3RoIiwiYXV0b3NpemUiLCJmbiIsImFuaW1hdGVDc3MiLCJhbmltYXRpb25OYW1lIiwiY2FsbGJhY2siLCJhbmltYXRpb25FbmQiLCJlbCIsImFuaW1hdGlvbnMiLCJhbmltYXRpb24iLCJPQW5pbWF0aW9uIiwiTW96QW5pbWF0aW9uIiwiV2Via2l0QW5pbWF0aW9uIiwidCIsInN0eWxlIiwidW5kZWZpbmVkIiwiY3JlYXRlRWxlbWVudCIsImFkZENsYXNzIiwib25lIiwicmVtb3ZlQ2xhc3MiLCJpc051bWVyaWMiLCJuIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJyZW1vdmVOb3REaWdpdHMiLCJwYXJhbSIsInRvU3RyaW5nIiwicmVwbGFjZSIsImRpdmlkZUJ5RGlnaXRzIiwibG9jYWxlIiwiUGFyc2xleSIsInNldExvY2FsZSIsIm9wdGlvbnMiLCJ0cmlnZ2VyIiwidmFsaWRhdGlvblRocmVzaG9sZCIsImVycm9yc1dyYXBwZXIiLCJlcnJvclRlbXBsYXRlIiwiY2xhc3NIYW5kbGVyIiwiaW5zdGFuY2UiLCIkZWxlbWVudCIsInR5cGUiLCIkaGFuZGxlciIsImhhc0NsYXNzIiwibmV4dCIsImVycm9yc0NvbnRhaW5lciIsIiRjb250YWluZXIiLCJjbG9zZXN0IiwicGFyZW50IiwiYWRkVmFsaWRhdG9yIiwidmFsaWRhdGVTdHJpbmciLCJ2YWx1ZSIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJkYXRhIiwibWF4IiwibWluRGF0ZSIsIm1heERhdGUiLCJ2YWx1ZURhdGUiLCJyZXN1bHQiLCJtYXRjaCIsIkRhdGUiLCJtYXhTaXplIiwicGFyc2xleUluc3RhbmNlIiwiZmlsZXMiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsImkiLCIkYmxvY2siLCIkbGFzdCIsImFmdGVyIiwiZWxlbWVudCIsInBhcnNsZXkiLCJlIiwiJHNlbGYiLCJjdXJyZW50VGFyZ2V0IiwiJGNvbGxhcHNlQm9keSIsImZpbmQiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwiaW5wdXRtYXNrIiwiY2xlYXJNYXNrT25Mb3N0Rm9jdXMiLCJzaG93TWFza09uSG92ZXIiLCJDdXN0b21TZWxlY3QiLCIkZWxlbSIsInNlbGYiLCJpbml0IiwiJGluaXRFbGVtIiwiZWFjaCIsInNlbGVjdFNlYXJjaCIsIm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIiwiSW5maW5pdHkiLCJzZWxlY3QyIiwic2VsZWN0T25CbHVyIiwiZHJvcGRvd25Dc3NDbGFzcyIsImxhbmd1YWdlIiwibm9SZXN1bHRzIiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbVNlbGVjdCIsImRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyIsImRhdGVGb3JtYXQiLCJzaG93T3RoZXJNb250aHMiLCJEYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsInNob3dNWSIsImN1cnJlbnREYXRlIiwiY3VycmVudERheSIsImdldERhdGUiLCJuZXdEYXRlIiwiZ2V0TW9udGgiLCJnZXRGdWxsWWVhciIsIml0ZW1PcHRpb25zIiwib25TZWxlY3QiLCJjaGFuZ2UiLCJzZXRUaW1lb3V0IiwiJG1vYmlsZU1lbnUiLCIkY2FydE1vZGFsIiwib3Blbk1vZGFsIiwiaGlkZU1vZGFsIiwicHJldmVudERlZmF1bHQiLCIkbW9kYWxCbG9jayIsImxvY2tEb2N1bWVudCIsInVubG9ja0RvY3VtZW50IiwiJGhlYWRlciIsImNhdGVnb3J5IiwiJGNhdGVnb3J5RHJvcGRvd24iLCIkdGFicyIsIiR0YWJzTGlua3MiLCIkdGFic0l0ZW1zIiwiJGhpZGRlbkZvcm1GaWVsZHMiLCJwcm9wIiwidmFsIiwiJHNlbGZJdGVtIiwiU3Bpbm5lciIsInN0ZXAiLCJwcmVjaXNpb24iLCJlbGVtZW50cyIsIiRkZWMiLCIkaW5jIiwiJGlucHV0IiwidXBkYXRlQnV0dG9ucyIsImluc3RhbmNlcyIsInNwaW5uZXIiLCJpcyIsIiRzcGlubmVycyIsImluZGV4IiwiYmxvY2siLCJnZXRJbnN0YW5jZSIsImRpc2FibGVTcGlubmVyIiwicHVzaCIsInNwaW5uZXJJbmRleCIsImZpbmRJbmRleCIsInNwbGljZSIsImhhbmRsZURlY0NsaWNrIiwiaGFuZGxlSW5jQ2xpY2siLCJoYW5kbGVJbnB1dCIsInNwaW5uZXJzIiwiY3JlYXRlIiwiJHRhcmdldCIsInRvRml4ZWQiLCJjaGFuZ2VWYWx1ZSIsImluaXRDYXJvdXNlbHMiLCIkbmV3c0Nhcm91c2VsIiwic2xpY2siLCJhcnJvd3MiLCJpbmZpbml0ZSIsInNsaWRlc1RvU2hvdyIsImNlbnRlck1vZGUiLCJ2YXJpYWJsZVdpZHRoIiwibW9iaWxlRmlyc3QiLCJyZXNwb25zaXZlIiwiYnJlYWtwb2ludCIsInNldHRpbmdzIiwiJGJpa2VzQ2Fyb3VzZWwiLCIkY2F0ZWdvcmllc0Nhcm91c2VsIiwiY2VudGVyUGFkZGluZyIsImRvdHMiLCIkaW5kZXhNYWluQ2Fyb3VzZWwiLCIkcHJvZHVjdENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJHNpbWlsYXJDYXJvdXNlbCIsIiRwaWN0dXJlQ2Fyb3VzZWwiLCJzbGlkZXNUb1Njcm9sbCIsIiRiaWtlQ2FyZENhcm91c2VsIiwiaXRlbSIsImZhZGUiLCIkYnRuIiwiJHBhcmVudCIsIiRjYXJvdXNlbCIsInNsaWRlSWQiLCIkdXBCdG4iLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwid2lkdGgiLCJzaG93IiwiaGlkZSIsIiRmaWx0ZXJNb2RhbCIsImZpZWxkIiwidHJpbSIsImV2ZW50IiwidG9vbHRpcFNldHRpbmdzIiwiYXJyb3ciLCJhbGxvd0hUTUwiLCJhbmltYXRlRmlsbCIsInBsYWNlbWVudCIsImRpc3RhbmNlIiwidGhlbWUiLCJpbml0VG9vbHRpcHMiLCJlbGVtIiwibG9jYWxTZXR0aW5ncyIsImNvbnRlbnQiLCJ0aXBweSIsIk9iamVjdCIsImFzc2lnbiIsInNob3AiLCJsYXQiLCJsbmciLCJtYXBTdHlsZXMiLCJlbGVtZW50VHlwZSIsInN0eWxlcnMiLCJjb2xvciIsInZpc2liaWxpdHkiLCJmZWF0dXJlVHlwZSIsImluaXRNYXAiLCJtYXAiLCJnb29nbGUiLCJtYXBzIiwiTWFwIiwiZ2V0RWxlbWVudEJ5SWQiLCJ6b29tIiwiY2VudGVyIiwic3R5bGVzIiwiem9vbUNvbnRyb2wiLCJtYXBUeXBlQ29udHJvbCIsInNjYWxlQ29udHJvbCIsInN0cmVldFZpZXdDb250cm9sIiwicm90YXRlQ29udHJvbCIsImZ1bGxzY3JlZW5Db250cm9sIiwicG9pbnRJY29uIiwidXJsIiwiU2l6ZSIsIm9yaWdpbiIsIlBvaW50IiwiYW5jaG9yIiwibWFya2VyIiwiTWFya2VyIiwicG9zaXRpb24iLCJpY29uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBVztBQUN6Qjs7O0FBR0EsTUFBSUMsYUFBYSxHQUFHO0FBQ2hCO0FBQ0FDLElBQUFBLElBQUksRUFBRyxHQUZTO0FBSWhCO0FBQ0FDLElBQUFBLGFBQWEsRUFBRyxJQUxBO0FBTWhCQyxJQUFBQSxhQUFhLEVBQUcsSUFOQTtBQU9oQkMsSUFBQUEsV0FBVyxFQUFLLElBUEE7QUFRaEJDLElBQUFBLGFBQWEsRUFBRyxJQVJBO0FBU2hCQyxJQUFBQSxZQUFZLEVBQUksSUFUQTtBQVVoQkMsSUFBQUEsVUFBVSxFQUFNLEdBVkE7QUFXaEJDLElBQUFBLFlBQVksRUFBSSxHQVhBO0FBWWhCQyxJQUFBQSxVQUFVLEVBQU0sR0FaQTtBQWNoQkMsSUFBQUEsSUFBSSxFQUFFYixDQUFDLENBQUMsTUFBRCxDQUFELENBQVVjLElBQVYsQ0FBZSxNQUFmO0FBZFUsR0FBcEIsQ0FKeUIsQ0FxQnpCO0FBQ0E7O0FBQ0EsTUFBTUMsV0FBVyxHQUFHO0FBQ2hCQyxJQUFBQSxtQkFBbUIsRUFBRUMsTUFBTSxDQUFDQyxVQUFQLHVCQUFpQ2YsYUFBYSxDQUFDRSxhQUFkLEdBQThCLENBQS9ELFNBREw7QUFFaEJjLElBQUFBLG1CQUFtQixFQUFFRixNQUFNLENBQUNDLFVBQVAsdUJBQWlDZixhQUFhLENBQUNHLGFBQWQsR0FBOEIsQ0FBL0QsU0FGTDtBQUdoQmMsSUFBQUEsaUJBQWlCLEVBQUVILE1BQU0sQ0FBQ0MsVUFBUCx1QkFBaUNmLGFBQWEsQ0FBQ0ksV0FBZCxHQUE0QixDQUE3RCxTQUhIO0FBSWhCYyxJQUFBQSxtQkFBbUIsRUFBRUosTUFBTSxDQUFDQyxVQUFQLHVCQUFpQ2YsYUFBYSxDQUFDSyxhQUFkLEdBQThCLENBQS9ELFNBSkw7QUFLaEJjLElBQUFBLGtCQUFrQixFQUFFTCxNQUFNLENBQUNDLFVBQVAsdUJBQWlDZixhQUFhLENBQUNNLFlBQWQsR0FBNkIsQ0FBOUQsU0FMSjtBQU1oQmMsSUFBQUEsZ0JBQWdCLEVBQUVOLE1BQU0sQ0FBQ0MsVUFBUCx1QkFBaUNmLGFBQWEsQ0FBQ08sVUFBZCxHQUEyQixDQUE1RCxTQU5GO0FBT2hCYyxJQUFBQSxzQkFBc0IsRUFBRVAsTUFBTSxDQUFDQyxVQUFQLHVCQUFpQ2YsYUFBYSxDQUFDUSxZQUFkLEdBQTZCLENBQTlELFNBUFI7QUFRaEJjLElBQUFBLGdCQUFnQixFQUFFUixNQUFNLENBQUNDLFVBQVAsdUJBQWlDZixhQUFhLENBQUNTLFVBQWQsR0FBMkIsQ0FBNUQ7QUFSRixHQUFwQjtBQVdBWixFQUFBQSxDQUFDLENBQUMwQixNQUFGLENBQVMsSUFBVCxFQUFldkIsYUFBZixFQUE4QlksV0FBOUI7QUFFQWYsRUFBQUEsQ0FBQyxDQUFDaUIsTUFBRCxDQUFELENBQVVVLEVBQVYsQ0FBYSxNQUFiLEVBQXFCLFlBQU07QUFDdkIsUUFBSTNCLENBQUMsQ0FBQyxVQUFELENBQUQsQ0FBYzRCLE1BQWQsR0FBdUIsQ0FBM0IsRUFBOEI7QUFDMUJDLE1BQUFBLFFBQVEsQ0FBQzdCLENBQUMsQ0FBQyxVQUFELENBQUYsQ0FBUjtBQUNIO0FBQ0osR0FKRDtBQU1BOzs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlSkEsRUFBQUEsQ0FBQyxDQUFDOEIsRUFBRixDQUFLSixNQUFMLENBQVk7QUFDUkssSUFBQUEsVUFBVSxFQUFFLG9CQUFTQyxhQUFULEVBQXdCQyxRQUF4QixFQUFrQztBQUMxQyxVQUFJQyxZQUFZLEdBQUksVUFBU0MsRUFBVCxFQUFhO0FBQzdCLFlBQUlDLFVBQVUsR0FBRztBQUNiQyxVQUFBQSxTQUFTLEVBQUUsY0FERTtBQUViQyxVQUFBQSxVQUFVLEVBQUUsZUFGQztBQUdiQyxVQUFBQSxZQUFZLEVBQUUsaUJBSEQ7QUFJYkMsVUFBQUEsZUFBZSxFQUFFO0FBSkosU0FBakI7O0FBT0EsYUFBSyxJQUFJQyxDQUFULElBQWNMLFVBQWQsRUFBMEI7QUFDdEIsY0FBSUQsRUFBRSxDQUFDTyxLQUFILENBQVNELENBQVQsTUFBZ0JFLFNBQXBCLEVBQStCO0FBQzNCLG1CQUFPUCxVQUFVLENBQUNLLENBQUQsQ0FBakI7QUFDSDtBQUNKO0FBQ0osT0Fia0IsQ0FhaEJ4QyxRQUFRLENBQUMyQyxhQUFULENBQXVCLEtBQXZCLENBYmdCLENBQW5COztBQWVBLFdBQUtDLFFBQUwsQ0FBYyxjQUFjYixhQUE1QixFQUEyQ2MsR0FBM0MsQ0FBK0NaLFlBQS9DLEVBQTZELFlBQVc7QUFDcEVsQyxRQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVErQyxXQUFSLENBQW9CLGNBQWNmLGFBQWxDO0FBRUEsWUFBSSxPQUFPQyxRQUFQLEtBQW9CLFVBQXhCLEVBQW9DQSxRQUFRO0FBQy9DLE9BSkQ7QUFNQSxhQUFPLElBQVA7QUFDSDtBQXhCTyxHQUFaLEVBNUQ2QixDQXVGekI7O0FBRUE7Ozs7Ozs7QUFNQSxXQUFTZSxTQUFULENBQW1CQyxDQUFuQixFQUFzQjtBQUNsQixXQUFPLENBQUNDLEtBQUssQ0FBQ0MsVUFBVSxDQUFDRixDQUFELENBQVgsQ0FBTixJQUF5QkcsUUFBUSxDQUFDSCxDQUFELENBQXhDO0FBQ0g7QUFFRDs7Ozs7Ozs7QUFNQSxXQUFTSSxlQUFULENBQXlCQyxLQUF6QixFQUFnQztBQUM1QjtBQUNBLFdBQU8sQ0FBQ0EsS0FBSyxDQUFDQyxRQUFOLEdBQWlCQyxPQUFqQixDQUF5QixLQUF6QixFQUFnQyxFQUFoQyxDQUFSO0FBQ0g7QUFFRDs7Ozs7Ozs7O0FBT0EsV0FBU0MsY0FBVCxDQUF3QkgsS0FBeEIsRUFBK0I7QUFDM0IsUUFBSUEsS0FBSyxLQUFLLElBQWQsRUFBb0JBLEtBQUssR0FBRyxDQUFSO0FBQ3BCLFdBQU9BLEtBQUssQ0FBQ0MsUUFBTixHQUFpQkMsT0FBakIsQ0FBeUIsNkJBQXpCLEVBQXdELEtBQXhELENBQVA7QUFDSDs7QUFFRCxNQUFJRSxNQUFNLEdBQUd2RCxhQUFhLENBQUNVLElBQWQsSUFBc0IsT0FBdEIsR0FBZ0MsSUFBaEMsR0FBdUMsSUFBcEQ7QUFFQThDLEVBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkYsTUFBbEI7QUFFQTs7QUFDQTFELEVBQUFBLENBQUMsQ0FBQzBCLE1BQUYsQ0FBU2lDLE9BQU8sQ0FBQ0UsT0FBakIsRUFBMEI7QUFDdEJDLElBQUFBLE9BQU8sRUFBRSxhQURhO0FBQ0U7QUFDeEJDLElBQUFBLG1CQUFtQixFQUFFLEdBRkM7QUFHdEJDLElBQUFBLGFBQWEsRUFBRSxhQUhPO0FBSXRCQyxJQUFBQSxhQUFhLEVBQUUsdUNBSk87QUFLdEJDLElBQUFBLFlBQVksRUFBRSxzQkFBU0MsUUFBVCxFQUFtQjtBQUM3QixVQUFNQyxRQUFRLEdBQUdELFFBQVEsQ0FBQ0MsUUFBMUI7QUFDQSxVQUFJQyxJQUFJLEdBQUdELFFBQVEsQ0FBQ3RELElBQVQsQ0FBYyxNQUFkLENBQVg7QUFBQSxVQUNJd0QsUUFESjs7QUFFQSxVQUFJRCxJQUFJLElBQUksVUFBUixJQUFzQkEsSUFBSSxJQUFJLE9BQWxDLEVBQTJDO0FBQ3ZDQyxRQUFBQSxRQUFRLEdBQUdGLFFBQVgsQ0FEdUMsQ0FDbEI7QUFDeEIsT0FGRCxNQUVPLElBQUlBLFFBQVEsQ0FBQ0csUUFBVCxDQUFrQiwyQkFBbEIsQ0FBSixFQUFvRDtBQUN2REQsUUFBQUEsUUFBUSxHQUFHdEUsQ0FBQyxDQUFDLDRCQUFELEVBQStCb0UsUUFBUSxDQUFDSSxJQUFULENBQWMsVUFBZCxDQUEvQixDQUFaO0FBQ0g7O0FBRUQsYUFBT0YsUUFBUDtBQUNILEtBaEJxQjtBQWlCdEJHLElBQUFBLGVBQWUsRUFBRSx5QkFBU04sUUFBVCxFQUFtQjtBQUNoQyxVQUFNQyxRQUFRLEdBQUdELFFBQVEsQ0FBQ0MsUUFBMUI7QUFDQSxVQUFJQyxJQUFJLEdBQUdELFFBQVEsQ0FBQ3RELElBQVQsQ0FBYyxNQUFkLENBQVg7QUFBQSxVQUNJNEQsVUFESjs7QUFHQSxVQUFJTCxJQUFJLElBQUksVUFBUixJQUFzQkEsSUFBSSxJQUFJLE9BQWxDLEVBQTJDO0FBQ3ZDSyxRQUFBQSxVQUFVLEdBQUcxRSxDQUFDLG1CQUFXb0UsUUFBUSxDQUFDdEQsSUFBVCxDQUFjLE1BQWQsQ0FBWCxzQkFBRCxDQUFvRDBELElBQXBELENBQXlELG1CQUF6RCxDQUFiO0FBQ0gsT0FGRCxNQUVPLElBQUlKLFFBQVEsQ0FBQ0csUUFBVCxDQUFrQiwyQkFBbEIsQ0FBSixFQUFvRDtBQUN2REcsUUFBQUEsVUFBVSxHQUFHTixRQUFRLENBQUNJLElBQVQsQ0FBYyxVQUFkLEVBQTBCQSxJQUExQixDQUErQixtQkFBL0IsQ0FBYjtBQUNILE9BRk0sTUFFQSxJQUFJSCxJQUFJLElBQUksTUFBWixFQUFvQjtBQUN2QkssUUFBQUEsVUFBVSxHQUFHTixRQUFRLENBQUNPLE9BQVQsQ0FBaUIsY0FBakIsRUFBaUNILElBQWpDLENBQXNDLG1CQUF0QyxDQUFiO0FBQ0gsT0FGTSxNQUVBLElBQUlKLFFBQVEsQ0FBQ3RELElBQVQsQ0FBYyxNQUFkLEtBQXlCLHNCQUE3QixFQUFxRDtBQUN4RDRELFFBQUFBLFVBQVUsR0FBR04sUUFBUSxDQUNoQlEsTUFEUSxHQUVSSixJQUZRLENBRUgsY0FGRyxFQUdSQSxJQUhRLENBR0gsbUJBSEcsQ0FBYjtBQUlILE9BaEIrQixDQWlCaEM7QUFDQTtBQUNBO0FBQ0E7OztBQUVBLGFBQU9FLFVBQVA7QUFDSDtBQXhDcUIsR0FBMUIsRUEvSHlCLENBMEt6QjtBQUVBOztBQUNBZixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLFFBQXJCLEVBQStCO0FBQzNCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0I7QUFDNUIsYUFBTyxnQkFBZ0JDLElBQWhCLENBQXFCRCxLQUFyQixDQUFQO0FBQ0gsS0FIMEI7QUFJM0JFLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsNEJBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFKaUIsR0FBL0IsRUE3S3lCLENBdUx6Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2tCLFlBQVIsQ0FBcUIsUUFBckIsRUFBK0I7QUFDM0JDLElBQUFBLGNBQWMsRUFBRSx3QkFBU0MsS0FBVCxFQUFnQjtBQUM1QixhQUFPLGVBQWVDLElBQWYsQ0FBb0JELEtBQXBCLENBQVA7QUFDSCxLQUgwQjtBQUkzQkUsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSw0QkFERTtBQUVOQyxNQUFBQSxFQUFFLEVBQUU7QUFGRTtBQUppQixHQUEvQixFQXhMeUIsQ0FrTXpCOztBQUNBeEIsRUFBQUEsT0FBTyxDQUFDa0IsWUFBUixDQUFxQixNQUFyQixFQUE2QjtBQUN6QkMsSUFBQUEsY0FBYyxFQUFFLHdCQUFTQyxLQUFULEVBQWdCO0FBQzVCLGFBQU8sbUJBQW1CQyxJQUFuQixDQUF3QkQsS0FBeEIsQ0FBUDtBQUNILEtBSHdCO0FBSXpCRSxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLHNDQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBSmUsR0FBN0IsRUFuTXlCLENBNk16Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2tCLFlBQVIsQ0FBcUIsYUFBckIsRUFBb0M7QUFDaENDLElBQUFBLGNBQWMsRUFBRSx3QkFBU0MsS0FBVCxFQUFnQjtBQUM1QixhQUFPLGdCQUFnQkMsSUFBaEIsQ0FBcUJELEtBQXJCLENBQVA7QUFDSCxLQUgrQjtBQUloQ0UsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSx1QkFERTtBQUVOQyxNQUFBQSxFQUFFLEVBQUU7QUFGRTtBQUpzQixHQUFwQyxFQTlNeUIsQ0F3TnpCOztBQUNBeEIsRUFBQUEsT0FBTyxDQUFDa0IsWUFBUixDQUFxQixXQUFyQixFQUFrQztBQUM5QkMsSUFBQUEsY0FBYyxFQUFFLHdCQUFTQyxLQUFULEVBQWdCO0FBQzVCLGFBQU8sbUJBQW1CQyxJQUFuQixDQUF3QkQsS0FBeEIsQ0FBUDtBQUNILEtBSDZCO0FBSTlCRSxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLGlDQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBSm9CLEdBQWxDLEVBek55QixDQW1PekI7O0FBQ0F4QixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLE9BQXJCLEVBQThCO0FBQzFCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0I7QUFDNUIsYUFBTyxpQkFBaUJDLElBQWpCLENBQXNCRCxLQUF0QixDQUFQO0FBQ0gsS0FIeUI7QUFJMUJFLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsK0JBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFKZ0IsR0FBOUIsRUFwT3lCLENBOE96Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2tCLFlBQVIsQ0FBcUIsUUFBckIsRUFBK0I7QUFDM0JDLElBQUFBLGNBQWMsRUFBRSx3QkFBU0MsS0FBVCxFQUFnQjtBQUM1QixhQUFPLFlBQVlDLElBQVosQ0FBaUJELEtBQWpCLENBQVA7QUFDSCxLQUgwQjtBQUkzQkUsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSxhQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBSmlCLEdBQS9CLEVBL095QixDQXlQekI7O0FBQ0F4QixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLE9BQXJCLEVBQThCO0FBQzFCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0I7QUFDNUIsYUFBTyx3SUFBd0lDLElBQXhJLENBQ0hELEtBREcsQ0FBUDtBQUdILEtBTHlCO0FBTTFCRSxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLDZCQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBTmdCLEdBQTlCLEVBMVB5QixDQXNRekI7O0FBQ0F4QixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLE1BQXJCLEVBQTZCO0FBQ3pCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0I7QUFDNUIsVUFBSUssT0FBTyxHQUFHLGtUQUFkO0FBQUEsVUFDSUMsUUFBUSxHQUFHLCtCQURmO0FBQUEsVUFFSUMsR0FBRyxHQUFHQyxTQUFTLENBQUMsQ0FBRCxDQUFULENBQWFuQixRQUFiLENBQXNCb0IsSUFBdEIsQ0FBMkIsU0FBM0IsQ0FGVjtBQUFBLFVBR0lDLEdBQUcsR0FBR0YsU0FBUyxDQUFDLENBQUQsQ0FBVCxDQUFhbkIsUUFBYixDQUFzQm9CLElBQXRCLENBQTJCLFNBQTNCLENBSFY7QUFBQSxVQUlJRSxPQUpKO0FBQUEsVUFLSUMsT0FMSjtBQUFBLFVBTUlDLFNBTko7QUFBQSxVQU9JQyxNQVBKOztBQVNBLFVBQUlQLEdBQUcsS0FBS08sTUFBTSxHQUFHUCxHQUFHLENBQUNRLEtBQUosQ0FBVVQsUUFBVixDQUFkLENBQVAsRUFBMkM7QUFDdkNLLFFBQUFBLE9BQU8sR0FBRyxJQUFJSyxJQUFKLENBQVMsQ0FBQ0YsTUFBTSxDQUFDLENBQUQsQ0FBaEIsRUFBcUJBLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWSxDQUFqQyxFQUFvQyxDQUFDQSxNQUFNLENBQUMsQ0FBRCxDQUEzQyxDQUFWO0FBQ0g7O0FBQ0QsVUFBSUosR0FBRyxLQUFLSSxNQUFNLEdBQUdKLEdBQUcsQ0FBQ0ssS0FBSixDQUFVVCxRQUFWLENBQWQsQ0FBUCxFQUEyQztBQUN2Q00sUUFBQUEsT0FBTyxHQUFHLElBQUlJLElBQUosQ0FBUyxDQUFDRixNQUFNLENBQUMsQ0FBRCxDQUFoQixFQUFxQkEsTUFBTSxDQUFDLENBQUQsQ0FBTixHQUFZLENBQWpDLEVBQW9DLENBQUNBLE1BQU0sQ0FBQyxDQUFELENBQTNDLENBQVY7QUFDSDs7QUFDRCxVQUFLQSxNQUFNLEdBQUdkLEtBQUssQ0FBQ2UsS0FBTixDQUFZVCxRQUFaLENBQWQsRUFBc0M7QUFDbENPLFFBQUFBLFNBQVMsR0FBRyxJQUFJRyxJQUFKLENBQVMsQ0FBQ0YsTUFBTSxDQUFDLENBQUQsQ0FBaEIsRUFBcUJBLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWSxDQUFqQyxFQUFvQyxDQUFDQSxNQUFNLENBQUMsQ0FBRCxDQUEzQyxDQUFaO0FBQ0g7O0FBRUQsYUFDSVQsT0FBTyxDQUFDSixJQUFSLENBQWFELEtBQWIsTUFBd0JXLE9BQU8sR0FBR0UsU0FBUyxJQUFJRixPQUFoQixHQUEwQixJQUF6RCxNQUFtRUMsT0FBTyxHQUFHQyxTQUFTLElBQUlELE9BQWhCLEdBQTBCLElBQXBHLENBREo7QUFHSCxLQXhCd0I7QUF5QnpCVixJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLG1CQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBekJlLEdBQTdCLEVBdlF5QixDQXNTekI7O0FBQ0F4QixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLGFBQXJCLEVBQW9DO0FBQ2hDQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0JpQixPQUFoQixFQUF5QkMsZUFBekIsRUFBMEM7QUFDdEQsVUFBSUMsS0FBSyxHQUFHRCxlQUFlLENBQUM3QixRQUFoQixDQUF5QixDQUF6QixFQUE0QjhCLEtBQXhDO0FBQ0EsYUFBT0EsS0FBSyxDQUFDdEUsTUFBTixJQUFnQixDQUFoQixJQUFxQnNFLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBU0MsSUFBVCxJQUFpQkgsT0FBTyxHQUFHLElBQXZEO0FBQ0gsS0FKK0I7QUFLaENJLElBQUFBLGVBQWUsRUFBRSxTQUxlO0FBTWhDbkIsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSx3Q0FERTtBQUVOQyxNQUFBQSxFQUFFLEVBQUU7QUFGRTtBQU5zQixHQUFwQyxFQXZTeUIsQ0FtVHpCOztBQUNBeEIsRUFBQUEsT0FBTyxDQUFDa0IsWUFBUixDQUFxQixlQUFyQixFQUFzQztBQUNsQ0MsSUFBQUEsY0FBYyxFQUFFLHdCQUFTQyxLQUFULEVBQWdCc0IsT0FBaEIsRUFBeUI7QUFDckMsVUFBSUMsYUFBYSxHQUFHdkIsS0FBSyxDQUFDd0IsS0FBTixDQUFZLEdBQVosRUFBaUJDLEdBQWpCLEVBQXBCO0FBQ0EsVUFBSUMsVUFBVSxHQUFHSixPQUFPLENBQUNFLEtBQVIsQ0FBYyxJQUFkLENBQWpCO0FBQ0EsVUFBSUcsS0FBSyxHQUFHLEtBQVo7O0FBRUEsV0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixVQUFVLENBQUM3RSxNQUEvQixFQUF1QytFLENBQUMsRUFBeEMsRUFBNEM7QUFDeEMsWUFBSUwsYUFBYSxLQUFLRyxVQUFVLENBQUNFLENBQUQsQ0FBaEMsRUFBcUM7QUFDakNELFVBQUFBLEtBQUssR0FBRyxJQUFSO0FBQ0E7QUFDSDtBQUNKOztBQUVELGFBQU9BLEtBQVA7QUFDSCxLQWRpQztBQWVsQ3pCLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsbUNBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFmd0IsR0FBdEMsRUFwVHlCLENBeVV6Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2hDLEVBQVIsQ0FBVyxZQUFYLEVBQXlCLFlBQVc7QUFDaEMsUUFBSXlDLFFBQVEsR0FBRyxLQUFLQSxRQUFwQjtBQUFBLFFBQ0lDLElBQUksR0FBR0QsUUFBUSxDQUFDdEQsSUFBVCxDQUFjLE1BQWQsQ0FEWDtBQUFBLFFBRUk4RixNQUFNLEdBQUc1RyxDQUFDLENBQUMsUUFBRCxDQUFELENBQVk2QyxRQUFaLENBQXFCLGtCQUFyQixDQUZiO0FBQUEsUUFHSWdFLEtBSEo7O0FBS0EsUUFBSXhDLElBQUksSUFBSSxVQUFSLElBQXNCQSxJQUFJLElBQUksT0FBbEMsRUFBMkM7QUFDdkN3QyxNQUFBQSxLQUFLLEdBQUc3RyxDQUFDLG1CQUFXb0UsUUFBUSxDQUFDdEQsSUFBVCxDQUFjLE1BQWQsQ0FBWCxzQkFBVDs7QUFDQSxVQUFJLENBQUMrRixLQUFLLENBQUNyQyxJQUFOLENBQVcsbUJBQVgsRUFBZ0M1QyxNQUFyQyxFQUE2QztBQUN6Q2lGLFFBQUFBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRixNQUFaO0FBQ0g7QUFDSixLQUxELE1BS08sSUFBSXhDLFFBQVEsQ0FBQ0csUUFBVCxDQUFrQiwyQkFBbEIsQ0FBSixFQUFvRDtBQUN2RHNDLE1BQUFBLEtBQUssR0FBR3pDLFFBQVEsQ0FBQ0ksSUFBVCxDQUFjLFVBQWQsQ0FBUjs7QUFDQSxVQUFJLENBQUNxQyxLQUFLLENBQUNyQyxJQUFOLENBQVcsbUJBQVgsRUFBZ0M1QyxNQUFyQyxFQUE2QztBQUN6Q2lGLFFBQUFBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRixNQUFaO0FBQ0g7QUFDSixLQUxNLE1BS0EsSUFBSXZDLElBQUksSUFBSSxNQUFaLEVBQW9CO0FBQ3ZCd0MsTUFBQUEsS0FBSyxHQUFHekMsUUFBUSxDQUFDTyxPQUFULENBQWlCLGNBQWpCLENBQVI7O0FBQ0EsVUFBSSxDQUFDa0MsS0FBSyxDQUFDckMsSUFBTixDQUFXLG1CQUFYLEVBQWdDNUMsTUFBckMsRUFBNkM7QUFDekNpRixRQUFBQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUYsTUFBWjtBQUNIO0FBQ0osS0FMTSxNQUtBLElBQUl4QyxRQUFRLENBQUNPLE9BQVQsQ0FBaUIsc0JBQWpCLEVBQXlDL0MsTUFBN0MsRUFBcUQ7QUFDeERpRixNQUFBQSxLQUFLLEdBQUd6QyxRQUFRLENBQUNPLE9BQVQsQ0FBaUIsc0JBQWpCLENBQVI7O0FBQ0EsVUFBSSxDQUFDa0MsS0FBSyxDQUFDckMsSUFBTixDQUFXLG1CQUFYLEVBQWdDNUMsTUFBckMsRUFBNkM7QUFDekNpRixRQUFBQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUYsTUFBWjtBQUNIO0FBQ0osS0FMTSxNQUtBLElBQUl4QyxRQUFRLENBQUN0RCxJQUFULENBQWMsTUFBZCxLQUF5QixzQkFBN0IsRUFBcUQ7QUFDeEQrRixNQUFBQSxLQUFLLEdBQUd6QyxRQUFRLENBQUNRLE1BQVQsR0FBa0JKLElBQWxCLENBQXVCLGNBQXZCLENBQVI7O0FBQ0EsVUFBSSxDQUFDcUMsS0FBSyxDQUFDckMsSUFBTixDQUFXLG1CQUFYLEVBQWdDNUMsTUFBckMsRUFBNkM7QUFDekNpRixRQUFBQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUYsTUFBWjtBQUNIO0FBQ0o7QUFDSixHQWhDRCxFQTFVeUIsQ0E0V3pCOztBQUNBakQsRUFBQUEsT0FBTyxDQUFDaEMsRUFBUixDQUFXLGlCQUFYLEVBQThCLFlBQVc7QUFDckMsUUFBSXlDLFFBQVEsR0FBR3BFLENBQUMsQ0FBQyxLQUFLK0csT0FBTixDQUFoQjtBQUNILEdBRkQ7QUFJQS9HLEVBQUFBLENBQUMsQ0FBQyw0QkFBRCxDQUFELENBQWdDZ0gsT0FBaEMsR0FqWHlCLENBbVh6Qjs7QUFDQSxNQUFJaEgsQ0FBQyxDQUFDLGtCQUFELENBQUQsQ0FBc0I0QixNQUExQixFQUFrQztBQUM5QjVCLElBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixrQkFBeEIsRUFBNEMsVUFBQXNGLENBQUMsRUFBSTtBQUM3QyxVQUFNQyxLQUFLLEdBQUdsSCxDQUFDLENBQUNpSCxDQUFDLENBQUNFLGFBQUgsQ0FBZjtBQUNBLFVBQU1DLGFBQWEsR0FBR0YsS0FBSyxDQUFDdkMsT0FBTixDQUFjLGNBQWQsRUFBOEIwQyxJQUE5QixDQUFtQyxtQkFBbkMsQ0FBdEI7O0FBQ0EsVUFBSUgsS0FBSyxDQUFDM0MsUUFBTixDQUFlLFdBQWYsQ0FBSixFQUFpQztBQUM3QjJDLFFBQUFBLEtBQUssQ0FBQ25FLFdBQU4sQ0FBa0IsV0FBbEI7QUFDQXFFLFFBQUFBLGFBQWEsQ0FBQ0UsT0FBZCxDQUFzQixNQUF0QjtBQUNILE9BSEQsTUFHTztBQUNISixRQUFBQSxLQUFLLENBQUNyRSxRQUFOLENBQWUsV0FBZjtBQUNBdUUsUUFBQUEsYUFBYSxDQUFDRyxTQUFkLENBQXdCLE1BQXhCO0FBQ0g7QUFDSixLQVZEO0FBV0g7QUFFRDs7Ozs7Ozs7O0FBT0F2SCxFQUFBQSxDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQndILFNBQXBCLENBQThCLG1CQUE5QixFQUFtRDtBQUMvQ0MsSUFBQUEsb0JBQW9CLEVBQUUsSUFEeUI7QUFFL0NDLElBQUFBLGVBQWUsRUFBRTtBQUY4QixHQUFuRDtBQUtBOzs7OztBQUlBLE1BQUlDLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQVNDLEtBQVQsRUFBZ0I7QUFDL0IsUUFBSUMsSUFBSSxHQUFHLElBQVg7O0FBRUFBLElBQUFBLElBQUksQ0FBQ0MsSUFBTCxHQUFZLFVBQVNDLFNBQVQsRUFBb0I7QUFDNUJBLE1BQUFBLFNBQVMsQ0FBQ0MsSUFBVixDQUFlLFlBQVc7QUFDdEIsWUFBSWhJLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXVFLFFBQVIsQ0FBaUIsMkJBQWpCLENBQUosRUFBbUQ7QUFDL0M7QUFDSCxTQUZELE1BRU87QUFDSCxjQUFJMEQsWUFBWSxHQUFHakksQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRd0YsSUFBUixDQUFhLFFBQWIsQ0FBbkI7QUFDQSxjQUFJMEMsdUJBQUo7O0FBRUEsY0FBSUQsWUFBSixFQUFrQjtBQUNkQyxZQUFBQSx1QkFBdUIsR0FBRyxDQUExQixDQURjLENBQ2U7QUFDaEMsV0FGRCxNQUVPO0FBQ0hBLFlBQUFBLHVCQUF1QixHQUFHQyxRQUExQixDQURHLENBQ2lDO0FBQ3ZDOztBQUVEbkksVUFBQUEsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRb0ksT0FBUixDQUFnQjtBQUNaRixZQUFBQSx1QkFBdUIsRUFBRUEsdUJBRGI7QUFFWkcsWUFBQUEsWUFBWSxFQUFFLElBRkY7QUFHWkMsWUFBQUEsZ0JBQWdCLEVBQUUsT0FITjtBQUlaQyxZQUFBQSxRQUFRLEVBQUU7QUFDTkMsY0FBQUEsU0FBUyxFQUFFLHFCQUFXO0FBQ2xCLHVCQUFPLHVCQUFQO0FBQ0g7QUFISztBQUpFLFdBQWhCO0FBV0F4SSxVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVEyQixFQUFSLENBQVcsUUFBWCxFQUFxQixVQUFTc0YsQ0FBVCxFQUFZO0FBQzdCO0FBQ0FqSCxZQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQ0txSCxJQURMLDBCQUMyQnJILENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUStFLEtBRG5DLFVBRUswRCxLQUZMO0FBR0gsV0FMRDtBQU1IO0FBQ0osT0EvQkQ7QUFnQ0gsS0FqQ0Q7O0FBbUNBWixJQUFBQSxJQUFJLENBQUNhLE1BQUwsR0FBYyxVQUFTQyxXQUFULEVBQXNCO0FBQ2hDQSxNQUFBQSxXQUFXLENBQUNQLE9BQVosQ0FBb0IsU0FBcEI7QUFDQVAsTUFBQUEsSUFBSSxDQUFDQyxJQUFMLENBQVVhLFdBQVY7QUFDSCxLQUhEOztBQUtBZCxJQUFBQSxJQUFJLENBQUNDLElBQUwsQ0FBVUYsS0FBVjtBQUNILEdBNUNEOztBQThDQSxNQUFJZ0IsWUFBWSxHQUFHLElBQUlqQixZQUFKLENBQWlCM0gsQ0FBQyxDQUFDLFFBQUQsQ0FBbEIsQ0FBbkI7QUFFQSxNQUFNNkksd0JBQXdCLEdBQUc7QUFDN0JDLElBQUFBLFVBQVUsRUFBRSxVQURpQjtBQUU3QkMsSUFBQUEsZUFBZSxFQUFFO0FBRlksR0FBakM7QUFLQTs7Ozs7Ozs7O0FBUUEsTUFBSUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsR0FBVztBQUN4QixRQUFNQyxVQUFVLEdBQUdqSixDQUFDLENBQUMsZ0JBQUQsQ0FBcEI7QUFFQWlKLElBQUFBLFVBQVUsQ0FBQ2pCLElBQVgsQ0FBZ0IsWUFBVztBQUN2QixVQUFJdEMsT0FBTyxHQUFHMUYsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRd0YsSUFBUixDQUFhLFVBQWIsQ0FBZDtBQUNBLFVBQUlHLE9BQU8sR0FBRzNGLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXdGLElBQVIsQ0FBYSxVQUFiLENBQWQ7QUFDQSxVQUFNMEQsTUFBTSxHQUFHbEosQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRd0YsSUFBUixDQUFhLFVBQWIsQ0FBZjtBQUVBOztBQUNBLFVBQUlHLE9BQU8sS0FBSyxTQUFaLElBQXlCRCxPQUFPLEtBQUssU0FBekMsRUFBb0Q7QUFDaEQsWUFBTXlELFdBQVcsR0FBRyxJQUFJcEQsSUFBSixFQUFwQjtBQUNBLFlBQUlxRCxVQUFVLEdBQUdELFdBQVcsQ0FBQ0UsT0FBWixFQUFqQjtBQUNBRCxRQUFBQSxVQUFVLEdBQUcsRUFBYixHQUFtQkEsVUFBVSxHQUFHLE1BQU1BLFVBQVUsQ0FBQzdGLFFBQVgsRUFBdEMsR0FBK0Q2RixVQUEvRDtBQUNBLFlBQU1FLE9BQU8sR0FBR0YsVUFBVSxHQUFHLEdBQWIsSUFBb0JELFdBQVcsQ0FBQ0ksUUFBWixLQUF5QixDQUE3QyxJQUFrRCxHQUFsRCxHQUF3REosV0FBVyxDQUFDSyxXQUFaLEVBQXhFO0FBQ0E3RCxRQUFBQSxPQUFPLEtBQUssU0FBWixHQUF5QkEsT0FBTyxHQUFHMkQsT0FBbkMsR0FBK0M1RCxPQUFPLEdBQUc0RCxPQUF6RDtBQUNIOztBQUVELFVBQUlHLFdBQVcsR0FBRztBQUNkL0QsUUFBQUEsT0FBTyxFQUFFQSxPQUFPLElBQUksSUFETjtBQUVkQyxRQUFBQSxPQUFPLEVBQUVBLE9BQU8sSUFBSSxJQUZOO0FBR2QrRCxRQUFBQSxRQUFRLEVBQUUsb0JBQVc7QUFDakIxSixVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVEySixNQUFSO0FBQ0EzSixVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQ0syRSxPQURMLENBQ2EsUUFEYixFQUVLOUIsUUFGTCxDQUVjLFdBRmQ7QUFHSDtBQVJhLE9BQWxCOztBQVdBLFVBQUlxRyxNQUFKLEVBQVk7QUFDUk8sUUFBQUEsV0FBVyxDQUFDLFlBQUQsQ0FBWCxHQUE0QixJQUE1QjtBQUNBQSxRQUFBQSxXQUFXLENBQUMsV0FBRCxDQUFYLEdBQTJCLFNBQTNCO0FBQ0FBLFFBQUFBLFdBQVcsQ0FBQyxhQUFELENBQVgsR0FBNkIsSUFBN0I7QUFDSDs7QUFFRHpKLE1BQUFBLENBQUMsQ0FBQzBCLE1BQUYsQ0FBUyxJQUFULEVBQWUrSCxXQUFmLEVBQTRCWix3QkFBNUI7QUFFQTdJLE1BQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUWlKLFVBQVIsQ0FBbUJRLFdBQW5CO0FBQ0gsS0FsQ0QsRUFId0IsQ0F1Q3hCOztBQUNBekosSUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWTBCLEVBQVosQ0FBZSxPQUFmLEVBQXdCLGdCQUF4QixFQUEwQyxZQUFNO0FBQzVDO0FBQ0FpSSxNQUFBQSxVQUFVLENBQUMsWUFBTTtBQUNiLFlBQUk1SixDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQnFILElBQXBCLENBQXlCLFFBQXpCLEVBQW1DekYsTUFBdkMsRUFBK0M7QUFDM0M1QixVQUFBQSxDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUNLcUgsSUFETCxDQUNVLFFBRFYsRUFFS2UsT0FGTCxDQUVhO0FBQ0xDLFlBQUFBLFlBQVksRUFBRSxJQURUO0FBRUxDLFlBQUFBLGdCQUFnQixFQUFFLE9BRmI7QUFHTEosWUFBQUEsdUJBQXVCLEVBQUVDO0FBSHBCLFdBRmI7QUFPSDtBQUNKLE9BVlMsRUFVUCxFQVZPLENBQVY7QUFXSCxLQWJEO0FBY0gsR0F0REQ7O0FBd0RBLE1BQUljLFVBQVUsR0FBRyxJQUFJRCxVQUFKLEVBQWpCO0FBRUEsTUFBTWEsV0FBVyxHQUFHN0osQ0FBQyxDQUFDLGlCQUFELENBQXJCO0FBQ0EsTUFBTThKLFVBQVUsR0FBRzlKLENBQUMsQ0FBQyxnQkFBRCxDQUFwQjtBQUVBQSxFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsY0FBeEIsRUFBd0MsWUFBTTtBQUMxQ29JLElBQUFBLFNBQVMsQ0FBQ0YsV0FBRCxDQUFUO0FBQ0gsR0FGRDtBQUlBN0osRUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWTBCLEVBQVosQ0FBZSxPQUFmLEVBQXdCLGdCQUF4QixFQUEwQyxZQUFNO0FBQzVDcUksSUFBQUEsU0FBUyxDQUFDSCxXQUFELENBQVQ7QUFDSCxHQUZEO0FBSUE3SixFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsY0FBeEIsRUFBd0MsVUFBQXNGLENBQUMsRUFBSTtBQUN6Q0EsSUFBQUEsQ0FBQyxDQUFDZ0QsY0FBRjtBQUNBRixJQUFBQSxTQUFTLENBQUNELFVBQUQsQ0FBVDtBQUNILEdBSEQ7QUFLQTlKLEVBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixnQkFBeEIsRUFBMEMsWUFBTTtBQUM1Q3FJLElBQUFBLFNBQVMsQ0FBQ0YsVUFBRCxDQUFUO0FBQ0gsR0FGRDtBQUlBOzs7OztBQUlBLFdBQVNDLFNBQVQsQ0FBbUJHLFdBQW5CLEVBQWdDO0FBQzVCQSxJQUFBQSxXQUFXLENBQUNySCxRQUFaLENBQXFCLFdBQXJCLEVBQWtDZCxVQUFsQyxDQUE2QyxjQUE3QztBQUNBL0IsSUFBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVNkMsUUFBVixDQUFtQixhQUFuQjtBQUNBc0gsSUFBQUEsWUFBWTtBQUNmO0FBRUQ7Ozs7OztBQUlBLFdBQVNILFNBQVQsQ0FBbUJFLFdBQW5CLEVBQWdDO0FBQzVCQSxJQUFBQSxXQUFXLENBQUNuSSxVQUFaLENBQXVCLGVBQXZCLEVBQXdDLFlBQU07QUFDMUNtSSxNQUFBQSxXQUFXLENBQUNuSCxXQUFaLENBQXdCLFdBQXhCO0FBQ0EvQyxNQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVUrQyxXQUFWLENBQXNCLGFBQXRCO0FBQ0FxSCxNQUFBQSxjQUFjO0FBQ2pCLEtBSkQ7QUFLSDtBQUVEOzs7OztBQUdBLFdBQVNBLGNBQVQsR0FBMEI7QUFDdEJwSyxJQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVUrQyxXQUFWLENBQXNCLFdBQXRCO0FBQ0g7QUFFRDs7Ozs7O0FBSUEsV0FBU29ILFlBQVQsR0FBd0I7QUFDcEJuSyxJQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVU2QyxRQUFWLENBQW1CLFdBQW5CO0FBQ0gsR0Foa0J3QixDQWtrQnpCOzs7QUFDQSxNQUFNd0gsT0FBTyxHQUFHckssQ0FBQyxDQUFDLFlBQUQsQ0FBakI7QUFFQUEsRUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWTBCLEVBQVosQ0FBZSxXQUFmLEVBQTRCLHlCQUE1QixFQUF1RCxVQUFBc0YsQ0FBQyxFQUFJO0FBQ3hELFFBQU1DLEtBQUssR0FBR2xILENBQUMsQ0FBQ2lILENBQUMsQ0FBQ0UsYUFBSCxDQUFmO0FBQ0EsUUFBTW1ELFFBQVEsR0FBR3BELEtBQUssQ0FBQ3BHLElBQU4sQ0FBVyxlQUFYLENBQWpCO0FBQ0FkLElBQUFBLENBQUMsQ0FBQyxxQkFBRCxDQUFELENBQXlCK0MsV0FBekIsQ0FBcUMsV0FBckM7QUFDQXNILElBQUFBLE9BQU8sQ0FBQ3RILFdBQVIsQ0FBb0IsV0FBcEI7QUFDQS9DLElBQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVStDLFdBQVYsQ0FBc0IsYUFBdEI7O0FBQ0EsUUFBSXVILFFBQUosRUFBYztBQUNWLFVBQU1DLGlCQUFpQixHQUFHdkssQ0FBQyxvQ0FBNkJzSyxRQUE3QixRQUEzQjtBQUNBQyxNQUFBQSxpQkFBaUIsQ0FBQzFILFFBQWxCLENBQTJCLFdBQTNCO0FBQ0F3SCxNQUFBQSxPQUFPLENBQUN4SCxRQUFSLENBQWlCLFdBQWpCO0FBQ0E3QyxNQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVU2QyxRQUFWLENBQW1CLGFBQW5CO0FBQ0g7QUFDSixHQVpEO0FBY0E3QyxFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLFlBQWYsRUFBNkIscUJBQTdCLEVBQW9ELFVBQUFzRixDQUFDLEVBQUk7QUFDckRqSCxJQUFBQSxDQUFDLENBQUMscUJBQUQsQ0FBRCxDQUF5QitDLFdBQXpCLENBQXFDLFdBQXJDO0FBQ0FzSCxJQUFBQSxPQUFPLENBQUN0SCxXQUFSLENBQW9CLFdBQXBCO0FBQ0EvQyxJQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVUrQyxXQUFWLENBQXNCLGFBQXRCO0FBQ0gsR0FKRCxFQW5sQnlCLENBeWxCekI7O0FBRUEsTUFBSS9DLENBQUMsQ0FBQyxlQUFELENBQUQsQ0FBbUI0QixNQUF2QixFQUErQjtBQUMzQjVCLElBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixlQUF4QixFQUF5QyxVQUFBc0YsQ0FBQyxFQUFJO0FBQzFDO0FBQ0EsVUFBTUMsS0FBSyxHQUFHbEgsQ0FBQyxDQUFDaUgsQ0FBQyxDQUFDRSxhQUFILENBQWY7QUFFQSxVQUFJRCxLQUFLLENBQUMzQyxRQUFOLENBQWUsV0FBZixDQUFKLEVBQWlDO0FBRWpDLFVBQU1pRyxLQUFLLEdBQUd0RCxLQUFLLENBQUN2QyxPQUFOLENBQWMsVUFBZCxDQUFkO0FBQ0EsVUFBTThGLFVBQVUsR0FBR0QsS0FBSyxDQUFDbkQsSUFBTixDQUFXLGVBQVgsQ0FBbkI7QUFDQSxVQUFNcUQsVUFBVSxHQUFHRixLQUFLLENBQUNuRCxJQUFOLENBQVcsZUFBWCxDQUFuQixDQVIwQyxDQVUxQzs7QUFDQW9ELE1BQUFBLFVBQVUsQ0FBQzFILFdBQVgsQ0FBdUIsV0FBdkI7QUFDQTJILE1BQUFBLFVBQVUsQ0FBQzNILFdBQVgsQ0FBdUIsV0FBdkIsRUFaMEMsQ0FjMUM7O0FBQ0EsVUFBSTRILGlCQUFpQixHQUFHRCxVQUFVLENBQUNyRCxJQUFYLENBQWdCLGlCQUFoQixDQUF4Qjs7QUFDQSxVQUFJc0QsaUJBQWlCLENBQUMvSSxNQUF0QixFQUE4QjtBQUMxQitJLFFBQUFBLGlCQUFpQixDQUFDQyxJQUFsQixDQUF1QixlQUF2QixFQUF3QyxLQUF4QztBQUNBRCxRQUFBQSxpQkFBaUIsQ0FBQ0MsSUFBbEIsQ0FBdUIsVUFBdkIsRUFBbUMsS0FBbkM7QUFDQUQsUUFBQUEsaUJBQWlCLENBQUNFLEdBQWxCLENBQXNCLEVBQXRCO0FBQ0gsT0FwQnlDLENBc0IxQzs7O0FBQ0EzRCxNQUFBQSxLQUFLLENBQUNyRSxRQUFOLENBQWUsV0FBZjtBQUNBLFVBQU1pSSxTQUFTLEdBQUc5SyxDQUFDLENBQUNrSCxLQUFLLENBQUMxQixJQUFOLENBQVcsS0FBWCxDQUFELENBQW5CO0FBQ0FzRixNQUFBQSxTQUFTLENBQUNqSSxRQUFWLENBQW1CLFdBQW5CLEVBekIwQyxDQTJCMUM7O0FBQ0E4SCxNQUFBQSxpQkFBaUIsR0FBR0csU0FBUyxDQUFDekQsSUFBVixDQUFlLGlCQUFmLENBQXBCOztBQUNBLFVBQUlzRCxpQkFBaUIsQ0FBQy9JLE1BQXRCLEVBQThCO0FBQzFCK0ksUUFBQUEsaUJBQWlCLENBQUNDLElBQWxCLENBQXVCLGVBQXZCLEVBQXdDLElBQXhDO0FBQ0FELFFBQUFBLGlCQUFpQixDQUFDQyxJQUFsQixDQUF1QixVQUF2QixFQUFtQyxJQUFuQztBQUNIO0FBQ0osS0FqQ0Q7QUFrQ0g7QUFFRDs7Ozs7Ozs7O0FBaG9CeUIsTUF3b0JuQkcsT0F4b0JtQjtBQUFBO0FBQUE7QUF5b0JyQjs7Ozs7Ozs7O0FBU0EsdUJBQThGO0FBQUEscUZBQUosRUFBSTtBQUFBLFVBQWhGbkUsTUFBZ0YsUUFBaEZBLE1BQWdGO0FBQUEsNEJBQXhFN0IsS0FBd0U7QUFBQSxVQUF4RUEsS0FBd0UsMkJBQWhFLENBQWdFO0FBQUEsMEJBQTdETyxHQUE2RDtBQUFBLFVBQTdEQSxHQUE2RCx5QkFBdkQsQ0FBQzZDLFFBQXNEO0FBQUEsMEJBQTVDMUMsR0FBNEM7QUFBQSxVQUE1Q0EsR0FBNEMseUJBQXRDMEMsUUFBc0M7QUFBQSwyQkFBNUI2QyxJQUE0QjtBQUFBLFVBQTVCQSxJQUE0QiwwQkFBckIsQ0FBcUI7QUFBQSxVQUFsQkMsU0FBa0IsUUFBbEJBLFNBQWtCOztBQUFBOztBQUMxRixXQUFLckUsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsV0FBS3NFLFFBQUwsR0FBZ0I7QUFDWkMsUUFBQUEsSUFBSSxFQUFFbkwsQ0FBQyxDQUFDLG9CQUFELEVBQXVCLEtBQUs0RyxNQUE1QixDQURLO0FBRVp3RSxRQUFBQSxJQUFJLEVBQUVwTCxDQUFDLENBQUMsb0JBQUQsRUFBdUIsS0FBSzRHLE1BQTVCLENBRks7QUFHWnlFLFFBQUFBLE1BQU0sRUFBRXJMLENBQUMsQ0FBQyxpQkFBRCxFQUFvQixLQUFLNEcsTUFBekI7QUFIRyxPQUFoQjtBQU1BLFdBQUs3QixLQUFMLEdBQWEsQ0FBQ0EsS0FBZDtBQUNBLFdBQUtPLEdBQUwsR0FBVyxDQUFDQSxHQUFaO0FBQ0EsV0FBS0csR0FBTCxHQUFXLENBQUNBLEdBQVo7QUFDQSxXQUFLdUYsSUFBTCxHQUFZLENBQUNBLElBQWI7QUFDQSxXQUFLQyxTQUFMLEdBQWlCLENBQUNBLFNBQWxCO0FBQ0g7QUFFRDs7Ozs7QUFqcUJxQjtBQUFBO0FBQUEsNkJBb3FCZDtBQUNILGFBQUtLLGFBQUw7QUFDSDtBQUVEOzs7O0FBeHFCcUI7QUFBQTtBQUFBLHNDQTJxQkw7QUFDWixhQUFLSixRQUFMLENBQWNDLElBQWQsQ0FBbUJQLElBQW5CLENBQXdCLFVBQXhCLEVBQW9DLEtBQXBDO0FBQ0EsYUFBS00sUUFBTCxDQUFjRSxJQUFkLENBQW1CUixJQUFuQixDQUF3QixVQUF4QixFQUFvQyxLQUFwQzs7QUFFQSxZQUFJLEtBQUs3RixLQUFMLEdBQWEsS0FBS08sR0FBTCxHQUFXLEtBQUswRixJQUFqQyxFQUF1QztBQUNuQyxlQUFLRSxRQUFMLENBQWNDLElBQWQsQ0FBbUJQLElBQW5CLENBQXdCLFVBQXhCLEVBQW9DLElBQXBDO0FBQ0g7O0FBRUQsWUFBSSxLQUFLN0YsS0FBTCxHQUFhLEtBQUtVLEdBQUwsR0FBVyxLQUFLdUYsSUFBakMsRUFBdUM7QUFDbkMsZUFBS0UsUUFBTCxDQUFjRSxJQUFkLENBQW1CUixJQUFuQixDQUF3QixVQUF4QixFQUFvQyxJQUFwQztBQUNIO0FBQ0o7QUFFRDs7OztBQXhyQnFCO0FBQUE7QUFBQSx1Q0EyckJKO0FBQ2IsYUFBS00sUUFBTCxDQUFjQyxJQUFkLENBQW1CUCxJQUFuQixDQUF3QixVQUF4QixFQUFvQyxJQUFwQztBQUNBLGFBQUtNLFFBQUwsQ0FBY0UsSUFBZCxDQUFtQlIsSUFBbkIsQ0FBd0IsVUFBeEIsRUFBb0MsSUFBcEM7QUFDQSxhQUFLTSxRQUFMLENBQWNHLE1BQWQsQ0FBcUJULElBQXJCLENBQTBCLFVBQTFCLEVBQXNDLElBQXRDO0FBQ0EsYUFBS2hFLE1BQUwsQ0FBWS9ELFFBQVosQ0FBcUIsYUFBckI7QUFDSDtBQUVEOzs7O0FBbHNCcUI7QUFBQTtBQUFBLHNDQXFzQkw7QUFDWixhQUFLaUYsSUFBTDtBQUNBLGFBQUtvRCxRQUFMLENBQWNHLE1BQWQsQ0FBcUJULElBQXJCLENBQTBCLFVBQTFCLEVBQXNDLEtBQXRDO0FBQ0EsYUFBS2hFLE1BQUwsQ0FBWTdELFdBQVosQ0FBd0IsYUFBeEI7QUFDSDtBQUVEOzs7Ozs7QUEzc0JxQjtBQUFBO0FBQUEsa0NBZ3RCVGdDLEtBaHRCUyxFQWd0QkY7QUFDZixhQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDQSxhQUFLNkIsTUFBTCxDQUFZOUYsSUFBWixDQUFpQixZQUFqQixFQUErQmlFLEtBQS9CO0FBQ0EsYUFBS21HLFFBQUwsQ0FBY0csTUFBZCxDQUFxQnZLLElBQXJCLENBQTBCLE9BQTFCLEVBQW1DaUUsS0FBbkM7QUFDQSxhQUFLbUcsUUFBTCxDQUFjRyxNQUFkLENBQXFCUixHQUFyQixDQUF5QjlGLEtBQXpCO0FBQ0g7QUFFRDs7Ozs7O0FBdnRCcUI7QUFBQTtBQUFBLGdDQTR0QlhBLEtBNXRCVyxFQTR0Qko7QUFDYixhQUFLTyxHQUFMLEdBQVdQLEtBQVg7QUFDQSxhQUFLNkIsTUFBTCxDQUFZOUYsSUFBWixDQUFpQixVQUFqQixFQUE2QmlFLEtBQTdCO0FBQ0g7QUFFRDs7Ozs7O0FBanVCcUI7QUFBQTtBQUFBLGdDQXN1QlhBLEtBdHVCVyxFQXN1Qko7QUFDYixhQUFLVSxHQUFMLEdBQVdWLEtBQVg7QUFDQSxhQUFLNkIsTUFBTCxDQUFZOUYsSUFBWixDQUFpQixVQUFqQixFQUE2QmlFLEtBQTdCO0FBQ0g7QUFFRDs7OztBQTN1QnFCO0FBQUE7O0FBZ3ZCckI7Ozs7OztBQWh2QnFCLGtDQXN2QkY2QixNQXR2QkUsRUFzdkJNO0FBQ3ZCLGVBQU9tRSxPQUFPLENBQUNRLFNBQVIsQ0FBa0JsRSxJQUFsQixDQUF1QixVQUFBbUUsT0FBTztBQUFBLGlCQUFJQSxPQUFPLENBQUM1RSxNQUFSLENBQWU2RSxFQUFmLENBQWtCN0UsTUFBbEIsQ0FBSjtBQUFBLFNBQTlCLENBQVA7QUFDSDtBQUVEOzs7Ozs7QUExdkJxQjtBQUFBO0FBQUEsK0JBK3ZCb0I7QUFBQSxZQUEzQjhFLFNBQTJCLHVFQUFmMUwsQ0FBQyxDQUFDLFVBQUQsQ0FBYztBQUNyQzBMLFFBQUFBLFNBQVMsQ0FBQzFELElBQVYsQ0FBZSxVQUFDMkQsS0FBRCxFQUFRQyxLQUFSLEVBQWtCO0FBQzdCLGNBQU1oRixNQUFNLEdBQUc1RyxDQUFDLENBQUM0TCxLQUFELENBQWhCO0FBRUEsY0FBSWIsT0FBTyxDQUFDYyxXQUFSLENBQW9CakYsTUFBcEIsQ0FBSixFQUFpQztBQUVqQyxjQUFNNEUsT0FBTyxHQUFHLElBQUlULE9BQUosQ0FBWTtBQUN4Qm5FLFlBQUFBLE1BQU0sRUFBTkEsTUFEd0I7QUFFeEI3QixZQUFBQSxLQUFLLEVBQUU2QixNQUFNLENBQUM5RixJQUFQLENBQVksWUFBWixDQUZpQjtBQUd4QndFLFlBQUFBLEdBQUcsRUFBRXNCLE1BQU0sQ0FBQzlGLElBQVAsQ0FBWSxVQUFaLENBSG1CO0FBSXhCMkUsWUFBQUEsR0FBRyxFQUFFbUIsTUFBTSxDQUFDOUYsSUFBUCxDQUFZLFVBQVosQ0FKbUI7QUFLeEJrSyxZQUFBQSxJQUFJLEVBQUVwRSxNQUFNLENBQUM5RixJQUFQLENBQVksV0FBWixDQUxrQjtBQU14Qm1LLFlBQUFBLFNBQVMsRUFBRXJFLE1BQU0sQ0FBQzlGLElBQVAsQ0FBWSxnQkFBWjtBQU5hLFdBQVosQ0FBaEI7QUFTQThGLFVBQUFBLE1BQU0sQ0FBQ3JDLFFBQVAsQ0FBZ0IsYUFBaEIsSUFBaUNpSCxPQUFPLENBQUNNLGNBQVIsRUFBakMsR0FBNEROLE9BQU8sQ0FBQzFELElBQVIsRUFBNUQ7QUFFQWlELFVBQUFBLE9BQU8sQ0FBQ1EsU0FBUixDQUFrQlEsSUFBbEIsQ0FBdUJQLE9BQXZCO0FBQ0gsU0FqQkQ7QUFrQkg7QUFFRDs7Ozs7O0FBcHhCcUI7QUFBQTtBQUFBLCtCQXl4Qm9CO0FBQUEsWUFBM0JFLFNBQTJCLHVFQUFmMUwsQ0FBQyxDQUFDLFVBQUQsQ0FBYztBQUNyQzBMLFFBQUFBLFNBQVMsQ0FBQzFELElBQVYsQ0FBZSxVQUFDMkQsS0FBRCxFQUFRQyxLQUFSLEVBQWtCO0FBQzdCLGNBQU1oRixNQUFNLEdBQUc1RyxDQUFDLENBQUM0TCxLQUFELENBQWhCO0FBRUEsY0FBTUksWUFBWSxHQUFHakIsT0FBTyxDQUFDUSxTQUFSLENBQWtCVSxTQUFsQixDQUE0QixVQUFBVCxPQUFPO0FBQUEsbUJBQUlBLE9BQU8sQ0FBQzVFLE1BQVIsQ0FBZTZFLEVBQWYsQ0FBa0I3RSxNQUFsQixDQUFKO0FBQUEsV0FBbkMsQ0FBckI7QUFFQW1FLFVBQUFBLE9BQU8sQ0FBQ1EsU0FBUixDQUFrQlcsTUFBbEIsQ0FBeUJGLFlBQXpCLEVBQXVDLENBQXZDO0FBQ0gsU0FORDtBQU9IO0FBanlCb0I7O0FBQUE7QUFBQTs7QUFBQSxrQkF3b0JuQmpCLE9BeG9CbUIsZUE4dUJGLEVBOXVCRTs7QUFveUJ6Qi9LLEVBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixvQkFBeEIsRUFBOEN3SyxjQUE5QztBQUNBbk0sRUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWTBCLEVBQVosQ0FBZSxPQUFmLEVBQXdCLG9CQUF4QixFQUE4Q3lLLGNBQTlDO0FBQ0FwTSxFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsaUJBQXhCLEVBQTJDMEssV0FBM0M7QUFFQTs7QUFDQSxNQUFJQyxRQUFRLEdBQUd2QixPQUFPLENBQUN3QixNQUFSLEVBQWY7QUFFQTs7Ozs7O0FBS0EsV0FBU0osY0FBVCxDQUF3QmxGLENBQXhCLEVBQTJCO0FBQUEsUUFDZkUsYUFEZSxHQUNHRixDQURILENBQ2ZFLGFBRGU7QUFFdkIsUUFBTXFGLE9BQU8sR0FBR3hNLENBQUMsQ0FBQ21ILGFBQUQsQ0FBakI7QUFDQSxRQUFNUCxNQUFNLEdBQUc0RixPQUFPLENBQUM3SCxPQUFSLENBQWdCLFVBQWhCLENBQWY7QUFDQSxRQUFNNkcsT0FBTyxHQUFHVCxPQUFPLENBQUNjLFdBQVIsQ0FBb0JqRixNQUFwQixDQUFoQjtBQUVBLFFBQUk3QixLQUFLLEdBQUd5RyxPQUFPLENBQUN6RyxLQUFSLEdBQWdCeUcsT0FBTyxDQUFDUixJQUFwQzs7QUFFQSxRQUFJUSxPQUFPLENBQUNQLFNBQVosRUFBdUI7QUFDbkJsRyxNQUFBQSxLQUFLLEdBQUc1QixVQUFVLENBQUM0QixLQUFLLENBQUMwSCxPQUFOLENBQWNqQixPQUFPLENBQUNQLFNBQXRCLENBQUQsQ0FBbEI7QUFDSDs7QUFFRE8sSUFBQUEsT0FBTyxDQUFDa0IsV0FBUixDQUFvQjNILEtBQXBCO0FBRUF5RyxJQUFBQSxPQUFPLENBQUNGLGFBQVI7QUFDSDtBQUVEOzs7Ozs7O0FBS0EsV0FBU2MsY0FBVCxDQUF3Qm5GLENBQXhCLEVBQTJCO0FBQUEsUUFDZkUsYUFEZSxHQUNHRixDQURILENBQ2ZFLGFBRGU7QUFFdkIsUUFBTXFGLE9BQU8sR0FBR3hNLENBQUMsQ0FBQ21ILGFBQUQsQ0FBakI7QUFDQSxRQUFNUCxNQUFNLEdBQUc0RixPQUFPLENBQUM3SCxPQUFSLENBQWdCLFVBQWhCLENBQWY7QUFDQSxRQUFNNkcsT0FBTyxHQUFHVCxPQUFPLENBQUNjLFdBQVIsQ0FBb0JqRixNQUFwQixDQUFoQjtBQUVBLFFBQUk3QixLQUFLLEdBQUd5RyxPQUFPLENBQUN6RyxLQUFSLEdBQWdCeUcsT0FBTyxDQUFDUixJQUFwQzs7QUFFQSxRQUFJUSxPQUFPLENBQUNQLFNBQVosRUFBdUI7QUFDbkJsRyxNQUFBQSxLQUFLLEdBQUc1QixVQUFVLENBQUM0QixLQUFLLENBQUMwSCxPQUFOLENBQWNqQixPQUFPLENBQUNQLFNBQXRCLENBQUQsQ0FBbEI7QUFDSDs7QUFFRE8sSUFBQUEsT0FBTyxDQUFDa0IsV0FBUixDQUFvQjNILEtBQXBCO0FBRUF5RyxJQUFBQSxPQUFPLENBQUNGLGFBQVI7QUFDSDtBQUVEOzs7Ozs7O0FBS0EsV0FBU2UsV0FBVCxDQUFxQnBGLENBQXJCLEVBQXdCO0FBQUEsUUFDWkUsYUFEWSxHQUNNRixDQUROLENBQ1pFLGFBRFk7QUFFcEIsUUFBTXFGLE9BQU8sR0FBR3hNLENBQUMsQ0FBQ21ILGFBQUQsQ0FBakI7QUFDQSxRQUFNUCxNQUFNLEdBQUc0RixPQUFPLENBQUM3SCxPQUFSLENBQWdCLFVBQWhCLENBQWY7QUFDQSxRQUFNNkcsT0FBTyxHQUFHVCxPQUFPLENBQUNjLFdBQVIsQ0FBb0JqRixNQUFwQixDQUFoQjtBQUpvQixRQUtaeUUsTUFMWSxHQUtERyxPQUFPLENBQUNOLFFBTFAsQ0FLWkcsTUFMWTtBQU9wQixRQUFJdEcsS0FBSyxHQUFHLENBQUNzRyxNQUFNLENBQUNSLEdBQVAsRUFBYjs7QUFFQSxRQUFJLENBQUNRLE1BQU0sQ0FBQ1IsR0FBUCxHQUFhakosTUFBZCxJQUF3Qm1ELEtBQUssR0FBR3lHLE9BQU8sQ0FBQ2xHLEdBQXhDLElBQStDUCxLQUFLLEdBQUd5RyxPQUFPLENBQUMvRixHQUFuRSxFQUF3RTtBQUNqRVYsTUFBQUEsS0FEaUUsR0FDdkR5RyxPQUR1RCxDQUNqRXpHLEtBRGlFO0FBRXZFOztBQUVEeUcsSUFBQUEsT0FBTyxDQUFDa0IsV0FBUixDQUFvQjNILEtBQXBCO0FBRUF5RyxJQUFBQSxPQUFPLENBQUNGLGFBQVI7QUFDSDs7QUFFRHFCLEVBQUFBLGFBQWE7QUFFYjNNLEVBQUFBLENBQUMsQ0FBQ2lCLE1BQUQsQ0FBRCxDQUFVVSxFQUFWLENBQWEsUUFBYixFQUF1QmdMLGFBQXZCLEVBaDNCeUIsQ0FrM0J6Qjs7QUFDQSxXQUFTQSxhQUFULEdBQXlCO0FBQ3JCO0FBQ0EsUUFBTUMsYUFBYSxHQUFHNU0sQ0FBQyxDQUFDLG1CQUFELENBQXZCOztBQUNBLFFBQUk0TSxhQUFhLENBQUNoTCxNQUFkLElBQXdCLENBQUNnTCxhQUFhLENBQUNySSxRQUFkLENBQXVCLG1CQUF2QixDQUE3QixFQUEwRTtBQUN0RXFJLE1BQUFBLGFBQWEsQ0FBQ0MsS0FBZCxDQUFvQjtBQUNoQkMsUUFBQUEsTUFBTSxFQUFFLEtBRFE7QUFFaEJDLFFBQUFBLFFBQVEsRUFBRSxJQUZNO0FBR2hCQyxRQUFBQSxZQUFZLEVBQUUsQ0FIRTtBQUloQkMsUUFBQUEsVUFBVSxFQUFFLEtBSkk7QUFLaEJDLFFBQUFBLGFBQWEsRUFBRSxJQUxDO0FBTWhCQyxRQUFBQSxXQUFXLEVBQUUsSUFORztBQU9oQkMsUUFBQUEsVUFBVSxFQUFFLENBQ1I7QUFDSUMsVUFBQUEsVUFBVSxFQUFFLEdBRGhCO0FBRUlDLFVBQUFBLFFBQVEsRUFBRSxDQUNOO0FBRE07QUFGZCxTQURRLEVBT1I7QUFDSUQsVUFBQUEsVUFBVSxFQUFFLElBRGhCO0FBRUlDLFVBQUFBLFFBQVEsRUFBRTtBQUZkLFNBUFE7QUFQSSxPQUFwQjtBQW9CSCxLQXhCb0IsQ0EwQnJCOzs7QUFDQSxRQUFNQyxjQUFjLEdBQUd2TixDQUFDLENBQUMsb0JBQUQsQ0FBeEI7O0FBQ0EsUUFBSXVOLGNBQWMsQ0FBQzNMLE1BQWYsSUFBeUIsQ0FBQzJMLGNBQWMsQ0FBQ2hKLFFBQWYsQ0FBd0IsbUJBQXhCLENBQTlCLEVBQTRFO0FBQ3hFZ0osTUFBQUEsY0FBYyxDQUFDVixLQUFmLENBQXFCO0FBQ2pCQyxRQUFBQSxNQUFNLEVBQUUsS0FEUztBQUVqQkMsUUFBQUEsUUFBUSxFQUFFLElBRk87QUFHakJDLFFBQUFBLFlBQVksRUFBRSxDQUhHO0FBSWpCQyxRQUFBQSxVQUFVLEVBQUUsSUFKSztBQUtqQkMsUUFBQUEsYUFBYSxFQUFFLElBTEU7QUFNakJDLFFBQUFBLFdBQVcsRUFBRSxJQU5JO0FBT2pCQyxRQUFBQSxVQUFVLEVBQUUsQ0FDUjtBQUNJQyxVQUFBQSxVQUFVLEVBQUUsR0FEaEI7QUFFSUMsVUFBQUEsUUFBUSxFQUFFO0FBRmQsU0FEUTtBQVBLLE9BQXJCLEVBRHdFLENBZ0J4RTs7QUFDQUMsTUFBQUEsY0FBYyxDQUNUbEcsSUFETCxDQUNVLGVBRFYsRUFFS0EsSUFGTCxDQUVVLE9BRlYsRUFHS3VELElBSEwsQ0FHVSxTQUhWLEVBR3FCLElBSHJCLEVBakJ3RSxDQXNCeEU7O0FBQ0EyQyxNQUFBQSxjQUFjLENBQUM1TCxFQUFmLENBQWtCLGFBQWxCLEVBQWlDLFlBQU07QUFDbkM0TCxRQUFBQSxjQUFjLENBQ1RsRyxJQURMLENBQ1UsZUFEVixFQUVLQSxJQUZMLENBRVUsT0FGVixFQUdLdUQsSUFITCxDQUdVLFNBSFYsRUFHcUIsSUFIckI7QUFJSCxPQUxEO0FBTUgsS0F6RG9CLENBMkRyQjs7O0FBQ0EsUUFBTTRDLG1CQUFtQixHQUFHeE4sQ0FBQyxDQUFDLHlCQUFELENBQTdCOztBQUNBLFFBQUl3TixtQkFBbUIsQ0FBQzVMLE1BQXBCLElBQThCLENBQUM0TCxtQkFBbUIsQ0FBQ2pKLFFBQXBCLENBQTZCLG1CQUE3QixDQUFuQyxFQUFzRjtBQUNsRmlKLE1BQUFBLG1CQUFtQixDQUFDWCxLQUFwQixDQUEwQjtBQUN0QkMsUUFBQUEsTUFBTSxFQUFFLEtBRGM7QUFFdEJDLFFBQUFBLFFBQVEsRUFBRSxLQUZZO0FBR3RCQyxRQUFBQSxZQUFZLEVBQUUsQ0FIUTtBQUl0QkMsUUFBQUEsVUFBVSxFQUFFLElBSlU7QUFLdEJRLFFBQUFBLGFBQWEsRUFBRSxHQUxPO0FBTXRCUCxRQUFBQSxhQUFhLEVBQUUsS0FOTztBQU90QlEsUUFBQUEsSUFBSSxFQUFFLElBUGdCO0FBUXRCUCxRQUFBQSxXQUFXLEVBQUUsSUFSUztBQVN0QkMsUUFBQUEsVUFBVSxFQUFFLENBQ1I7QUFDSUMsVUFBQUEsVUFBVSxFQUFFLEdBRGhCO0FBRUlDLFVBQUFBLFFBQVEsRUFBRTtBQUZkLFNBRFE7QUFUVSxPQUExQjtBQWdCSCxLQTlFb0IsQ0FnRnJCOzs7QUFDQSxRQUFNSyxrQkFBa0IsR0FBRzNOLENBQUMsQ0FBQyx5QkFBRCxDQUE1Qjs7QUFDQSxRQUFJMk4sa0JBQWtCLENBQUMvTCxNQUFuQixJQUE2QixDQUFDK0wsa0JBQWtCLENBQUNwSixRQUFuQixDQUE0QixtQkFBNUIsQ0FBbEMsRUFBb0Y7QUFDaEZvSixNQUFBQSxrQkFBa0IsQ0FBQ2QsS0FBbkIsQ0FBeUI7QUFDckJDLFFBQUFBLE1BQU0sRUFBRSxLQURhO0FBRXJCQyxRQUFBQSxRQUFRLEVBQUUsS0FGVztBQUdyQkMsUUFBQUEsWUFBWSxFQUFFLENBSE87QUFJckJDLFFBQUFBLFVBQVUsRUFBRSxJQUpTO0FBS3JCUSxRQUFBQSxhQUFhLEVBQUUsR0FMTTtBQU1yQlAsUUFBQUEsYUFBYSxFQUFFLEtBTk07QUFPckJRLFFBQUFBLElBQUksRUFBRTtBQVBlLE9BQXpCO0FBU0gsS0E1Rm9CLENBOEZyQjs7O0FBQ0EsUUFBTUUsZ0JBQWdCLEdBQUc1TixDQUFDLENBQUMsc0JBQUQsQ0FBMUI7O0FBQ0EsUUFBSTROLGdCQUFnQixDQUFDaE0sTUFBakIsSUFBMkIsQ0FBQ2dNLGdCQUFnQixDQUFDckosUUFBakIsQ0FBMEIsbUJBQTFCLENBQWhDLEVBQWdGO0FBQzVFcUosTUFBQUEsZ0JBQWdCLENBQUNmLEtBQWpCLENBQXVCO0FBQ25CQyxRQUFBQSxNQUFNLEVBQUUsSUFEVztBQUVuQkMsUUFBQUEsUUFBUSxFQUFFLElBRlM7QUFHbkJDLFFBQUFBLFlBQVksRUFBRSxDQUhLO0FBSW5CYSxRQUFBQSxTQUFTLEVBQ0wsaUxBTGU7QUFNbkJDLFFBQUFBLFNBQVMsRUFDTCxpS0FQZTtBQVFuQkosUUFBQUEsSUFBSSxFQUFFLEtBUmE7QUFTbkJOLFFBQUFBLFVBQVUsRUFBRSxDQUNSO0FBQ0lDLFVBQUFBLFVBQVUsRUFBRSxHQURoQjtBQUVJQyxVQUFBQSxRQUFRLEVBQUU7QUFDTlIsWUFBQUEsTUFBTSxFQUFFLEtBREY7QUFFTlksWUFBQUEsSUFBSSxFQUFFO0FBRkE7QUFGZCxTQURRO0FBVE8sT0FBdkI7QUFtQkgsS0FwSG9CLENBc0hyQjs7O0FBQ0EsUUFBTUssZ0JBQWdCLEdBQUcvTixDQUFDLENBQUMsc0JBQUQsQ0FBMUI7O0FBQ0EsUUFBSStOLGdCQUFnQixDQUFDbk0sTUFBakIsSUFBMkIsQ0FBQ21NLGdCQUFnQixDQUFDeEosUUFBakIsQ0FBMEIsbUJBQTFCLENBQWhDLEVBQWdGO0FBQzVFd0osTUFBQUEsZ0JBQWdCLENBQUNsQixLQUFqQixDQUF1QjtBQUNuQkMsUUFBQUEsTUFBTSxFQUFFLEtBRFc7QUFFbkJDLFFBQUFBLFFBQVEsRUFBRSxLQUZTO0FBR25CQyxRQUFBQSxZQUFZLEVBQUUsQ0FISztBQUluQkMsUUFBQUEsVUFBVSxFQUFFLElBSk87QUFLbkJRLFFBQUFBLGFBQWEsRUFBRSxHQUxJO0FBTW5CUCxRQUFBQSxhQUFhLEVBQUUsS0FOSTtBQU9uQlEsUUFBQUEsSUFBSSxFQUFFLElBUGE7QUFRbkJQLFFBQUFBLFdBQVcsRUFBRSxJQVJNO0FBU25CQyxRQUFBQSxVQUFVLEVBQUUsQ0FDUjtBQUNJQyxVQUFBQSxVQUFVLEVBQUUsR0FEaEI7QUFFSUMsVUFBQUEsUUFBUSxFQUFFO0FBRmQsU0FEUTtBQVRPLE9BQXZCO0FBZ0JILEtBeklvQixDQTJJckI7OztBQUNBLFFBQU1VLGdCQUFnQixHQUFHaE8sQ0FBQyxDQUFDLHNCQUFELENBQTFCOztBQUNBLFFBQUlnTyxnQkFBZ0IsQ0FBQ3BNLE1BQWpCLElBQTJCLENBQUNvTSxnQkFBZ0IsQ0FBQ3pKLFFBQWpCLENBQTBCLG1CQUExQixDQUFoQyxFQUFnRjtBQUM1RXlKLE1BQUFBLGdCQUFnQixDQUFDbkIsS0FBakIsQ0FBdUI7QUFDbkJDLFFBQUFBLE1BQU0sRUFBRSxLQURXO0FBRW5CQyxRQUFBQSxRQUFRLEVBQUUsS0FGUztBQUduQkMsUUFBQUEsWUFBWSxFQUFFLENBSEs7QUFJbkJpQixRQUFBQSxjQUFjLEVBQUUsQ0FKRztBQUtuQmYsUUFBQUEsYUFBYSxFQUFFO0FBTEksT0FBdkI7QUFPSDs7QUFFRCxRQUFNZ0IsaUJBQWlCLEdBQUdsTyxDQUFDLENBQUMsd0JBQUQsQ0FBM0I7O0FBQ0EsUUFBSWtPLGlCQUFpQixDQUFDdE0sTUFBbEIsSUFBNEIsQ0FBQ3NNLGlCQUFpQixDQUFDM0osUUFBbEIsQ0FBMkIsbUJBQTNCLENBQWpDLEVBQWtGO0FBQzlFMkosTUFBQUEsaUJBQWlCLENBQUNsRyxJQUFsQixDQUF1QixVQUFDMkQsS0FBRCxFQUFRd0MsSUFBUixFQUFpQjtBQUNwQ25PLFFBQUFBLENBQUMsQ0FBQ21PLElBQUQsQ0FBRCxDQUFRdEIsS0FBUixDQUFjO0FBQ1ZvQixVQUFBQSxjQUFjLEVBQUUsQ0FETjtBQUVWakIsVUFBQUEsWUFBWSxFQUFFLENBRko7QUFHVkYsVUFBQUEsTUFBTSxFQUFFLEtBSEU7QUFJVlksVUFBQUEsSUFBSSxFQUFFLEtBSkk7QUFLVlUsVUFBQUEsSUFBSSxFQUFFLElBTEk7QUFNVmhCLFVBQUFBLFVBQVUsRUFBRSxDQUNSO0FBQ0lDLFlBQUFBLFVBQVUsRUFBRSxHQURoQjtBQUVJQyxZQUFBQSxRQUFRLEVBQUU7QUFDTmMsY0FBQUEsSUFBSSxFQUFFO0FBREE7QUFGZCxXQURRO0FBTkYsU0FBZDtBQWVILE9BaEJELEVBRDhFLENBbUI5RTs7QUFDQXBPLE1BQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3Qix5QkFBeEIsRUFBbUQsVUFBQXNGLENBQUMsRUFBSTtBQUNwRCxZQUFNb0gsSUFBSSxHQUFHck8sQ0FBQyxDQUFDaUgsQ0FBQyxDQUFDRSxhQUFILENBQWQ7QUFDQSxZQUFNbUgsT0FBTyxHQUFHRCxJQUFJLENBQUMxSixPQUFMLENBQWEsWUFBYixDQUFoQjtBQUNBLFlBQU00SixTQUFTLEdBQUdELE9BQU8sQ0FBQ2pILElBQVIsQ0FBYSx3QkFBYixDQUFsQjtBQUNBLFlBQU1tSCxPQUFPLEdBQUdILElBQUksQ0FBQzdJLElBQUwsQ0FBVSxPQUFWLENBQWhCO0FBQ0E4SSxRQUFBQSxPQUFPLENBQUNqSCxJQUFSLENBQWEseUJBQWIsRUFBd0N0RSxXQUF4QyxDQUFvRCxXQUFwRDtBQUNBc0wsUUFBQUEsSUFBSSxDQUFDeEwsUUFBTCxDQUFjLFdBQWQ7QUFDQTBMLFFBQUFBLFNBQVMsQ0FBQzFCLEtBQVYsQ0FBZ0IsV0FBaEIsRUFBNkIyQixPQUE3QjtBQUNILE9BUkQ7QUFTSDtBQUNKOztBQUVELE1BQU1DLE1BQU0sR0FBR3pPLENBQUMsQ0FBQyxZQUFELENBQWhCOztBQUVBLE1BQUl5TyxNQUFNLENBQUM3TSxNQUFYLEVBQW1CO0FBQ2Y1QixJQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsWUFBeEIsRUFBc0MsWUFBTTtBQUN4QzNCLE1BQUFBLENBQUMsQ0FBQyxZQUFELENBQUQsQ0FBZ0IwTyxPQUFoQixDQUF3QjtBQUNwQkMsUUFBQUEsU0FBUyxFQUFFO0FBRFMsT0FBeEI7QUFHSCxLQUpEO0FBTUEzTyxJQUFBQSxDQUFDLENBQUNpQixNQUFELENBQUQsQ0FBVVUsRUFBVixDQUFhLFFBQWIsRUFBdUIsWUFBTTtBQUN6QixVQUFJM0IsQ0FBQyxDQUFDaUIsTUFBRCxDQUFELENBQVUyTixLQUFWLE1BQXFCek8sYUFBYSxDQUFDTSxZQUF2QyxFQUFxRDtBQUNqRFQsUUFBQUEsQ0FBQyxDQUFDaUIsTUFBRCxDQUFELENBQVUwTixTQUFWLEtBQXdCLEVBQXhCLEdBQTZCRixNQUFNLENBQUNJLElBQVAsRUFBN0IsR0FBNkNKLE1BQU0sQ0FBQ0ssSUFBUCxFQUE3QztBQUNIO0FBQ0osS0FKRDtBQUtIOztBQUVELE1BQU1DLFlBQVksR0FBRy9PLENBQUMsQ0FBQyxrQkFBRCxDQUF0Qjs7QUFDQSxNQUFJK08sWUFBWSxDQUFDbk4sTUFBakIsRUFBeUI7QUFDckI1QixJQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsZ0JBQXhCLEVBQTBDLFVBQUFzRixDQUFDLEVBQUk7QUFDM0M4SCxNQUFBQSxZQUFZLENBQUNsTSxRQUFiLENBQXNCLFdBQXRCLEVBQW1DZCxVQUFuQyxDQUE4QyxjQUE5QztBQUNBL0IsTUFBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVNkMsUUFBVixDQUFtQixhQUFuQjtBQUNILEtBSEQ7QUFLQTdDLElBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixrQkFBeEIsRUFBNEMsVUFBQXNGLENBQUMsRUFBSTtBQUM3QzhILE1BQUFBLFlBQVksQ0FBQ2hOLFVBQWIsQ0FBd0IsZUFBeEIsRUFBeUMsWUFBTTtBQUMzQ2dOLFFBQUFBLFlBQVksQ0FBQ2hNLFdBQWIsQ0FBeUIsV0FBekI7QUFDQS9DLFFBQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVStDLFdBQVYsQ0FBc0IsYUFBdEI7QUFDSCxPQUhEO0FBSUgsS0FMRDtBQU1IOztBQUVELE1BQUkvQyxDQUFDLENBQUMscUJBQUQsQ0FBRCxDQUF5QjRCLE1BQXpCLEdBQWtDLENBQXRDLEVBQXlDO0FBQ3JDOzs7QUFHQTVCLElBQUFBLENBQUMsQ0FBQyxxQkFBRCxDQUFELENBQXlCZ0ksSUFBekIsQ0FBOEIsVUFBUzJELEtBQVQsRUFBZ0J4SixFQUFoQixFQUFvQjtBQUM5QyxVQUFNNk0sS0FBSyxHQUFHaFAsQ0FBQyxDQUFDbUMsRUFBRCxDQUFELENBQU1rRixJQUFOLENBQVcsaUJBQVgsQ0FBZDs7QUFFQSxVQUNJckgsQ0FBQyxDQUFDZ1AsS0FBRCxDQUFELENBQ0tuRSxHQURMLEdBRUtvRSxJQUZMLE1BRWUsRUFGZixJQUdBalAsQ0FBQyxDQUFDZ1AsS0FBRCxDQUFELENBQVN2RCxFQUFULENBQVksb0JBQVosQ0FKSixFQUtFO0FBQ0V6TCxRQUFBQSxDQUFDLENBQUNtQyxFQUFELENBQUQsQ0FBTVUsUUFBTixDQUFlLFdBQWY7QUFDSDs7QUFFRDdDLE1BQUFBLENBQUMsQ0FBQ2dQLEtBQUQsQ0FBRCxDQUNLck4sRUFETCxDQUNRLE9BRFIsRUFDaUIsVUFBU3VOLEtBQVQsRUFBZ0I7QUFDekJsUCxRQUFBQSxDQUFDLENBQUNtQyxFQUFELENBQUQsQ0FBTVUsUUFBTixDQUFlLFdBQWY7QUFDSCxPQUhMLEVBSUtsQixFQUpMLENBSVEsTUFKUixFQUlnQixVQUFTdU4sS0FBVCxFQUFnQjtBQUN4QixZQUNJbFAsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUNLNkssR0FETCxHQUVLb0UsSUFGTCxPQUVnQixFQUZoQixJQUdBLENBQUNqUCxDQUFDLENBQUNnUCxLQUFELENBQUQsQ0FBU3ZELEVBQVQsQ0FBWSxvQkFBWixDQUpMLEVBS0U7QUFDRXpMLFVBQUFBLENBQUMsQ0FBQ21DLEVBQUQsQ0FBRCxDQUFNWSxXQUFOLENBQWtCLFdBQWxCO0FBQ0g7QUFDSixPQWJMO0FBY0gsS0ExQkQ7QUEyQkg7QUFFRDs7O0FBRUEsTUFBTW9NLGVBQWUsR0FBRztBQUNwQkMsSUFBQUEsS0FBSyxFQUFFLEtBRGE7QUFFcEJDLElBQUFBLFNBQVMsRUFBRSxLQUZTO0FBR3BCQyxJQUFBQSxXQUFXLEVBQUUsS0FITztBQUlwQkMsSUFBQUEsU0FBUyxFQUFFLGNBSlM7QUFLcEJDLElBQUFBLFFBQVEsRUFBRSxFQUxVO0FBTXBCQyxJQUFBQSxLQUFLLEVBQUU7QUFOYSxHQUF4QjtBQVNBOzs7O0FBR0EsV0FBU0MsWUFBVCxHQUF3QjtBQUNwQjFQLElBQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CZ0ksSUFBcEIsQ0FBeUIsVUFBQzJELEtBQUQsRUFBUWdFLElBQVIsRUFBaUI7QUFDdEMsVUFBTUMsYUFBYSxHQUFHO0FBQ2xCQyxRQUFBQSxPQUFPLEVBQUU3UCxDQUFDLENBQUMyUCxJQUFELENBQUQsQ0FBUTdPLElBQVIsQ0FBYSxjQUFiO0FBRFMsT0FBdEI7O0FBR0EsVUFBSWQsQ0FBQyxDQUFDMlAsSUFBRCxDQUFELENBQVFuSyxJQUFSLENBQWEsT0FBYixDQUFKLEVBQTJCO0FBQ3ZCb0ssUUFBQUEsYUFBYSxDQUFDLFNBQUQsQ0FBYixHQUEyQixhQUEzQjtBQUNBQSxRQUFBQSxhQUFhLENBQUMsYUFBRCxDQUFiLEdBQStCLElBQS9CO0FBQ0g7O0FBRURFLE1BQUFBLEtBQUssQ0FBQ0gsSUFBRCxFQUFPSSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCYixlQUFsQixFQUFtQ1MsYUFBbkMsQ0FBUCxDQUFMO0FBQ0gsS0FWRDtBQVdIOztBQUVERixFQUFBQSxZQUFZLEdBdm9DYSxDQXlvQ3pCO0FBQ0E7O0FBQ0EsTUFBTU8sSUFBSSxHQUFHO0FBQUVDLElBQUFBLEdBQUcsRUFBRSxTQUFQO0FBQWtCQyxJQUFBQSxHQUFHLEVBQUU7QUFBdkIsR0FBYixDQTNvQ3lCLENBNm9DekI7O0FBQ0EsTUFBTUMsU0FBUyxHQUFHLENBQ2Q7QUFDSUMsSUFBQUEsV0FBVyxFQUFFLFVBRGpCO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFGYixHQURjLEVBU2Q7QUFDSUYsSUFBQUEsV0FBVyxFQUFFLGFBRGpCO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lFLE1BQUFBLFVBQVUsRUFBRTtBQURoQixLQURLO0FBRmIsR0FUYyxFQWlCZDtBQUNJSCxJQUFBQSxXQUFXLEVBQUUsa0JBRGpCO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFGYixHQWpCYyxFQXlCZDtBQUNJRixJQUFBQSxXQUFXLEVBQUUsb0JBRGpCO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFGYixHQXpCYyxFQWlDZDtBQUNJRSxJQUFBQSxXQUFXLEVBQUUsZ0JBRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxVQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0FqQ2MsRUEwQ2Q7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLHdCQURqQjtBQUVJSixJQUFBQSxXQUFXLEVBQUUsa0JBRmpCO0FBR0lDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFIYixHQTFDYyxFQW1EZDtBQUNJRSxJQUFBQSxXQUFXLEVBQUUsNEJBRGpCO0FBRUlILElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lFLE1BQUFBLFVBQVUsRUFBRTtBQURoQixLQURLO0FBRmIsR0FuRGMsRUEyRGQ7QUFDSUMsSUFBQUEsV0FBVyxFQUFFLHlCQURqQjtBQUVJSixJQUFBQSxXQUFXLEVBQUUsa0JBRmpCO0FBR0lDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFIYixHQTNEYyxFQW9FZDtBQUNJRSxJQUFBQSxXQUFXLEVBQUUsS0FEakI7QUFFSUosSUFBQUEsV0FBVyxFQUFFLGtCQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0FwRWMsRUE2RWQ7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLFVBRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxVQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0E3RWMsRUFzRmQ7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLFVBRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxrQkFGakI7QUFHSUMsSUFBQUEsT0FBTyxFQUFFLENBQ0w7QUFDSUMsTUFBQUEsS0FBSyxFQUFFO0FBRFgsS0FESztBQUhiLEdBdEZjLEVBK0ZkO0FBQ0lFLElBQUFBLFdBQVcsRUFBRSxVQURqQjtBQUVJSixJQUFBQSxXQUFXLEVBQUUsb0JBRmpCO0FBR0lDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFIYixHQS9GYyxFQXdHZDtBQUNJRSxJQUFBQSxXQUFXLEVBQUUsTUFEakI7QUFFSUosSUFBQUEsV0FBVyxFQUFFLGVBRmpCO0FBR0lDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFIYixHQXhHYyxFQWlIZDtBQUNJRSxJQUFBQSxXQUFXLEVBQUUsTUFEakI7QUFFSUosSUFBQUEsV0FBVyxFQUFFLGtCQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0FqSGMsRUEwSGQ7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLGVBRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxVQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0ExSGMsRUFtSWQ7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLGNBRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxVQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0FuSWMsRUE0SWQ7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLGdDQURqQjtBQUVJSixJQUFBQSxXQUFXLEVBQUUsVUFGakI7QUFHSUMsSUFBQUEsT0FBTyxFQUFFLENBQ0w7QUFDSUMsTUFBQUEsS0FBSyxFQUFFO0FBRFgsS0FESztBQUhiLEdBNUljLEVBcUpkO0FBQ0lFLElBQUFBLFdBQVcsRUFBRSxZQURqQjtBQUVJSixJQUFBQSxXQUFXLEVBQUUsa0JBRmpCO0FBR0lDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFIYixHQXJKYyxFQThKZDtBQUNJRSxJQUFBQSxXQUFXLEVBQUUsU0FEakI7QUFFSUosSUFBQUEsV0FBVyxFQUFFLGtCQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0E5SmMsRUF1S2Q7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLE9BRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxVQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0F2S2MsRUFnTGQ7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLE9BRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxrQkFGakI7QUFHSUMsSUFBQUEsT0FBTyxFQUFFLENBQ0w7QUFDSUMsTUFBQUEsS0FBSyxFQUFFO0FBRFgsS0FESztBQUhiLEdBaExjLENBQWxCLENBOW9DeUIsQ0F5MEN6Qjs7QUFDQSxXQUFTRyxPQUFULEdBQW1CO0FBQ2Y7QUFDQSxRQUFNQyxHQUFHLEdBQUcsSUFBSUMsTUFBTSxDQUFDQyxJQUFQLENBQVlDLEdBQWhCLENBQW9CN1EsUUFBUSxDQUFDOFEsY0FBVCxDQUF3QixLQUF4QixDQUFwQixFQUFvRDtBQUM1REMsTUFBQUEsSUFBSSxFQUFFLEVBRHNEO0FBRTVEQyxNQUFBQSxNQUFNLEVBQUVoQixJQUZvRDtBQUc1RGlCLE1BQUFBLE1BQU0sRUFBRWQsU0FIb0Q7QUFJNURlLE1BQUFBLFdBQVcsRUFBRSxJQUorQztBQUs1REMsTUFBQUEsY0FBYyxFQUFFLEtBTDRDO0FBTTVEQyxNQUFBQSxZQUFZLEVBQUUsSUFOOEM7QUFPNURDLE1BQUFBLGlCQUFpQixFQUFFLEtBUHlDO0FBUTVEQyxNQUFBQSxhQUFhLEVBQUUsS0FSNkM7QUFTNURDLE1BQUFBLGlCQUFpQixFQUFFO0FBVHlDLEtBQXBELENBQVo7QUFZQSxRQUFNQyxTQUFTLEdBQUc7QUFDZEMsTUFBQUEsR0FBRyxFQUFFLG1CQURTO0FBRWQ7QUFDQXZMLE1BQUFBLElBQUksRUFBRSxJQUFJeUssTUFBTSxDQUFDQyxJQUFQLENBQVljLElBQWhCLENBQXFCLEVBQXJCLEVBQXlCLEVBQXpCLENBSFE7QUFJZDtBQUNBQyxNQUFBQSxNQUFNLEVBQUUsSUFBSWhCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZZ0IsS0FBaEIsQ0FBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsQ0FMTTtBQU1kO0FBQ0FDLE1BQUFBLE1BQU0sRUFBRSxJQUFJbEIsTUFBTSxDQUFDQyxJQUFQLENBQVlnQixLQUFoQixDQUFzQixFQUF0QixFQUEwQixFQUExQjtBQVBNLEtBQWxCLENBZGUsQ0F3QmY7O0FBQ0EsUUFBTUUsTUFBTSxHQUFHLElBQUluQixNQUFNLENBQUNDLElBQVAsQ0FBWW1CLE1BQWhCLENBQXVCO0FBQ2xDQyxNQUFBQSxRQUFRLEVBQUVoQyxJQUR3QjtBQUVsQ2lDLE1BQUFBLElBQUksRUFBRVQsU0FGNEI7QUFHbENkLE1BQUFBLEdBQUcsRUFBRUE7QUFINkIsS0FBdkIsQ0FBZjtBQUtIOztBQUVEMVAsRUFBQUEsTUFBTSxDQUFDeVAsT0FBUCxHQUFpQkEsT0FBakI7QUFFSjtBQUNDLENBNzJDRCIsInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqINCT0LvQvtCx0LDQu9GM0L3Ri9C1INC/0LXRgNC10LzQtdC90L3Ri9C1LCDQutC+0YLQvtGA0YvQtSDQuNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8g0LzQvdC+0LPQvtC60YDQsNGC0L3QvlxuICAgICAqL1xuICAgIGxldCBnbG9iYWxPcHRpb25zID0ge1xuICAgICAgICAvLyDQktGA0LXQvNGPINC00LvRjyDQsNC90LjQvNCw0YbQuNC5XG4gICAgICAgIHRpbWU6ICAyMDAsXG5cbiAgICAgICAgLy8g0JrQvtC90YLRgNC+0LvRjNC90YvQtSDRgtC+0YfQutC4INCw0LTQsNC/0YLQuNCy0LBcbiAgICAgICAgZGVza3RvcExnU2l6ZTogIDE5MTAsXG4gICAgICAgIGRlc2t0b3BNZFNpemU6ICAxNjAwLFxuICAgICAgICBkZXNrdG9wU2l6ZTogICAgMTQ4MCxcbiAgICAgICAgZGVza3RvcFNtU2l6ZTogIDEyODAsXG4gICAgICAgIHRhYmxldExnU2l6ZTogICAxMDI0LFxuICAgICAgICB0YWJsZXRTaXplOiAgICAgNzY4LFxuICAgICAgICBtb2JpbGVMZ1NpemU6ICAgNjQwLFxuICAgICAgICBtb2JpbGVTaXplOiAgICAgNDgwLFxuXG4gICAgICAgIGxhbmc6ICQoJ2h0bWwnKS5hdHRyKCdsYW5nJylcbiAgICB9O1xuXG4gICAgLy8g0JHRgNC10LnQutC/0L7QuNC90YLRiyDQsNC00LDQv9GC0LjQstCwXG4gICAgLy8gQGV4YW1wbGUgaWYgKGdsb2JhbE9wdGlvbnMuYnJlYWtwb2ludFRhYmxldC5tYXRjaGVzKSB7fSBlbHNlIHt9XG4gICAgY29uc3QgYnJlYWtwb2ludHMgPSB7XG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wTGc6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcExnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wTWQ6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcE1kU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BTbTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wU21TaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludFRhYmxldExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldExnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXQ6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMudGFibGV0U2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGVMZ1NpemU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlTGdTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludE1vYmlsZTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5tb2JpbGVTaXplIC0gMX1weClgKVxuICAgIH07XG5cbiAgICAkLmV4dGVuZCh0cnVlLCBnbG9iYWxPcHRpb25zLCBicmVha3BvaW50cyk7XG5cbiAgICAkKHdpbmRvdykub24oJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIGlmICgkKCd0ZXh0YXJlYScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGF1dG9zaXplKCQoJ3RleHRhcmVhJykpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LTQutC70Y7Rh9C10L3QuNC1IGpzIHBhcnRpYWxzXG4gICAgICovXG4gICAgLyoqXG4gKiDQoNCw0YHRiNC40YDQtdC90LjQtSBhbmltYXRlLmNzc1xuICogQHBhcmFtICB7U3RyaW5nfSBhbmltYXRpb25OYW1lINC90LDQt9Cy0LDQvdC40LUg0LDQvdC40LzQsNGG0LjQuFxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrINGE0YPQvdC60YbQuNGPLCDQutC+0YLQvtGA0LDRjyDQvtGC0YDQsNCx0L7RgtCw0LXRgiDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcbiAqIEByZXR1cm4ge09iamVjdH0g0L7QsdGK0LXQutGCINCw0L3QuNC80LDRhtC40LhcbiAqXG4gKiBAc2VlICBodHRwczovL2RhbmVkZW4uZ2l0aHViLmlvL2FuaW1hdGUuY3NzL1xuICpcbiAqIEBleGFtcGxlXG4gKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnKTtcbiAqXG4gKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnLCBmdW5jdGlvbigpIHtcbiAqICAgICAvLyDQlNC10LvQsNC10Lwg0YfRgtC+LdGC0L4g0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XG4gKiB9KTtcbiAqL1xuJC5mbi5leHRlbmQoe1xuICAgIGFuaW1hdGVDc3M6IGZ1bmN0aW9uKGFuaW1hdGlvbk5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBhbmltYXRpb25FbmQgPSAoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25zID0ge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ2FuaW1hdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgT0FuaW1hdGlvbjogJ29BbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgICAgIE1vekFuaW1hdGlvbjogJ21vekFuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgV2Via2l0QW5pbWF0aW9uOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciAobGV0IHQgaW4gYW5pbWF0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25zW3RdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuXG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb25OYW1lKS5vbmUoYW5pbWF0aW9uRW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb25OYW1lKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbn0pO1xuXG4gICAgLy8g0J3QtdCx0L7Qu9GM0YjQuNC1INCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvQtSDRhNGD0L3QutGG0LjQuFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0Y/QtdGCINGH0LjRgdC70L4g0LjQu9C4INC90LXRglxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSBuINCb0Y7QsdC+0Lkg0LDRgNCz0YPQvNC10L3RglxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzTnVtZXJpYyhuKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvRj9C10YIg0LLRgdC1INC90LXRh9C40YHQu9C+0LLRi9C1INGB0LjQvNCy0L7Qu9GLINC4INC/0YDQuNCy0L7QtNC40YIg0Log0YfQuNGB0LvRg1xuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJ8bnVtYmVyfSBwYXJhbVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm90RGlnaXRzKHBhcmFtKSB7XG4gICAgICAgIC8qINGD0LTQsNC70Y/QtdC8INCy0YHQtSDRgdC40LzQstC+0LvRiyDQutGA0L7QvNC1INGG0LjRhNGAINC4INC/0LXRgNC10LLQvtC00LjQvCDQsiDRh9C40YHQu9C+ICovXG4gICAgICAgIHJldHVybiArcGFyYW0udG9TdHJpbmcoKS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCg0LDQt9C00LXQu9GP0LXRgiDQvdCwINGA0LDQt9GA0Y/QtNGLXG4gICAgICog0J3QsNC/0YDQuNC80LXRgCwgMzgwMDAwMCAtPiAzIDgwMCAwMDBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyfG51bWJlcn0gcGFyYW1cbiAgICAgKiBAcmV0dXJucyB7c3RyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpdmlkZUJ5RGlnaXRzKHBhcmFtKSB7XG4gICAgICAgIGlmIChwYXJhbSA9PT0gbnVsbCkgcGFyYW0gPSAwO1xuICAgICAgICByZXR1cm4gcGFyYW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9XG5cbiAgICB2YXIgbG9jYWxlID0gZ2xvYmFsT3B0aW9ucy5sYW5nID09ICdydS1SVScgPyAncnUnIDogJ2VuJztcblxuICAgIFBhcnNsZXkuc2V0TG9jYWxlKGxvY2FsZSk7XG5cbiAgICAvKiDQndCw0YHRgtGA0L7QudC60LggUGFyc2xleSAqL1xuICAgICQuZXh0ZW5kKFBhcnNsZXkub3B0aW9ucywge1xuICAgICAgICB0cmlnZ2VyOiAnYmx1ciBjaGFuZ2UnLCAvLyBjaGFuZ2Ug0L3Rg9C20LXQvSDQtNC70Y8gc2VsZWN0J9CwXG4gICAgICAgIHZhbGlkYXRpb25UaHJlc2hvbGQ6ICcwJyxcbiAgICAgICAgZXJyb3JzV3JhcHBlcjogJzxkaXY+PC9kaXY+JyxcbiAgICAgICAgZXJyb3JUZW1wbGF0ZTogJzxwIGNsYXNzPVwicGFyc2xleS1lcnJvci1tZXNzYWdlXCI+PC9wPicsXG4gICAgICAgIGNsYXNzSGFuZGxlcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICAgICAkaGFuZGxlcjtcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkZWxlbWVudDsgLy8g0YLQviDQtdGB0YLRjCDQvdC40YfQtdCz0L4g0L3QtSDQstGL0LTQtdC70Y/QtdC8IChpbnB1dCDRgdC60YDRi9GCKSwg0LjQvdCw0YfQtSDQstGL0LTQtdC70Y/QtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDQsdC70L7QulxuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkKCcuc2VsZWN0Mi1zZWxlY3Rpb24tLXNpbmdsZScsICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gJGhhbmRsZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yc0NvbnRhaW5lcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyO1xuXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmN1c3RvbS1maWxlJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpID09ICdpc19yZWNhcHRjaGFfc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgICAgIC5uZXh0KCcuZy1yZWNhcHRjaGEnKVxuICAgICAgICAgICAgICAgICAgICAubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICRjb250YWluZXIgPSAkZWxlbWVudC5jbG9zZXN0KCcuZmllbGQnKTtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygkY29udGFpbmVyKVxuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICByZXR1cm4gJGNvbnRhaW5lcjtcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCa0LDRgdGC0L7QvNC90YvQtSDQstCw0LvQuNC00LDRgtC+0YDRi1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lUnUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZUVuJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlthLXpcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosIFwiIFwiLCBcIi1cIicsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXpcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIicsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiyDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlclJ1Jywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlswLTnQsC3Rj9GRXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0YssINC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlcicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtejAtOV0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIDAtOScsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgFxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdwaG9uZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bLSswLTkoKSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INGC0LXQu9C10YTQvtC90L3Ri9C5INC90L7QvNC10YAnLFxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgcGhvbmUgbnVtYmVyJyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bWJlcicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bMC05XSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIDAtOScsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQn9C+0YfRgtCwINCx0LXQtyDQutC40YDQuNC70LvQuNGG0YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZW1haWwnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXShcXC58X3wtKXswLDF9KStbQS1aYS160JAt0K/QsC3RjzAtOVxcLV1cXEAoW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKSsoKFxcLil7MCwxfVtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSl7MSx9XFwuW2EtetCwLdGPMC05XFwtXXsyLH0kLy50ZXN0KFxuICAgICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L/QvtGH0YLQvtCy0YvQuSDQsNC00YDQtdGBJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGVtYWlsIGFkZHJlc3MnLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KTQvtGA0LzQsNGCINC00LDRgtGLIERELk1NLllZWVlcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZGF0ZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgcmVnVGVzdCA9IC9eKD86KD86MzEoXFwuKSg/OjA/WzEzNTc4XXwxWzAyXSkpXFwxfCg/Oig/OjI5fDMwKShcXC4pKD86MD9bMSwzLTldfDFbMC0yXSlcXDIpKSg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezJ9KSR8Xig/OjI5KFxcLikwPzJcXDMoPzooPzooPzoxWzYtOV18WzItOV1cXGQpPyg/OjBbNDhdfFsyNDY4XVswNDhdfFsxMzU3OV1bMjZdKXwoPzooPzoxNnxbMjQ2OF1bMDQ4XXxbMzU3OV1bMjZdKTAwKSkpKSR8Xig/OjA/WzEtOV18MVxcZHwyWzAtOF0pKFxcLikoPzooPzowP1sxLTldKXwoPzoxWzAtMl0pKVxcNCg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezR9KSQvLFxuICAgICAgICAgICAgICAgIHJlZ01hdGNoID0gLyhcXGR7MSwyfSlcXC4oXFxkezEsMn0pXFwuKFxcZHs0fSkvLFxuICAgICAgICAgICAgICAgIG1pbiA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWluJyksXG4gICAgICAgICAgICAgICAgbWF4ID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNYXgnKSxcbiAgICAgICAgICAgICAgICBtaW5EYXRlLFxuICAgICAgICAgICAgICAgIG1heERhdGUsXG4gICAgICAgICAgICAgICAgdmFsdWVEYXRlLFxuICAgICAgICAgICAgICAgIHJlc3VsdDtcblxuICAgICAgICAgICAgaWYgKG1pbiAmJiAocmVzdWx0ID0gbWluLm1hdGNoKHJlZ01hdGNoKSkpIHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF4ICYmIChyZXN1bHQgPSBtYXgubWF0Y2gocmVnTWF0Y2gpKSkge1xuICAgICAgICAgICAgICAgIG1heERhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgocmVzdWx0ID0gdmFsdWUubWF0Y2gocmVnTWF0Y2gpKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlRGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIHJlZ1Rlc3QudGVzdCh2YWx1ZSkgJiYgKG1pbkRhdGUgPyB2YWx1ZURhdGUgPj0gbWluRGF0ZSA6IHRydWUpICYmIChtYXhEYXRlID8gdmFsdWVEYXRlIDw9IG1heERhdGUgOiB0cnVlKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3QsNGPINC00LDRgtCwJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGRhdGUnLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KTQsNC50Lsg0L7Qs9GA0LDQvdC40YfQtdC90L3QvtCz0L4g0YDQsNC30LzQtdGA0LBcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZU1heFNpemUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgbWF4U2l6ZSwgcGFyc2xleUluc3RhbmNlKSB7XG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBwYXJzbGV5SW5zdGFuY2UuJGVsZW1lbnRbMF0uZmlsZXM7XG4gICAgICAgICAgICByZXR1cm4gZmlsZXMubGVuZ3RoICE9IDEgfHwgZmlsZXNbMF0uc2l6ZSA8PSBtYXhTaXplICogMTAyNDtcbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWlyZW1lbnRUeXBlOiAnaW50ZWdlcicsXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Ck0LDQudC7INC00L7Qu9C20LXQvSDQstC10YHQuNGC0Ywg0L3QtSDQsdC+0LvQtdC1LCDRh9C10LwgJXMgS2InLFxuICAgICAgICAgICAgZW46IFwiRmlsZSBzaXplIGNhbid0IGJlIG1vcmUgdGhlbiAlcyBLYlwiLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0J7Qs9GA0LDQvdC40YfQtdC90LjRjyDRgNCw0YHRiNC40YDQtdC90LjQuSDRhNCw0LnQu9C+0LJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZUV4dGVuc2lvbicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlLCBmb3JtYXRzKSB7XG4gICAgICAgICAgICBsZXQgZmlsZUV4dGVuc2lvbiA9IHZhbHVlLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgICAgICBsZXQgZm9ybWF0c0FyciA9IGZvcm1hdHMuc3BsaXQoJywgJyk7XG4gICAgICAgICAgICBsZXQgdmFsaWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JtYXRzQXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVFeHRlbnNpb24gPT09IGZvcm1hdHNBcnJbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWxpZDtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0JTQvtC/0YPRgdGC0LjQvNGLINGC0L7Qu9GM0LrQviDRhNCw0LnQu9GLINGE0L7RgNC80LDRgtCwICVzJyxcbiAgICAgICAgICAgIGVuOiAnQXZhaWxhYmxlIGV4dGVuc2lvbnMgYXJlICVzJyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCh0L7Qt9C00LDRkdGCINC60L7QvdGC0LXQudC90LXRgNGLINC00LvRjyDQvtGI0LjQsdC+0Log0YMg0L3QtdGC0LjQv9C40YfQvdGL0YUg0Y3Qu9C10LzQtdC90YLQvtCyXG4gICAgUGFyc2xleS5vbignZmllbGQ6aW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgJGVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICAgICAgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICRibG9jayA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdlcnJvcnMtcGxhY2VtZW50JyksXG4gICAgICAgICAgICAkbGFzdDtcblxuICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCY0L3QuNGG0LjQuNGA0YPQtdGCINCy0LDQu9C40LTQsNGG0LjRjiDQvdCwINCy0YLQvtGA0L7QvCDQutCw0LvQtdC00LDRgNC90L7QvCDQv9C+0LvQtSDQtNC40LDQv9Cw0LfQvtC90LBcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDp2YWxpZGF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgJCgnZm9ybVtkYXRhLXZhbGlkYXRlPVwidHJ1ZVwiXScpLnBhcnNsZXkoKTtcblxuICAgIC8vINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDRgtC+0LvRjNC60L4g0L3QsCDRgdGC0YDQsNC90LjRhtC1IGNoZWNrb3V0Lmh0bWxcbiAgICBpZiAoJCgnLmpzLWNvbGxhcHNlLWJ0bicpLmxlbmd0aCkge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNvbGxhcHNlLWJ0bicsIGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgJHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCAkY29sbGFwc2VCb2R5ID0gJHNlbGYuY2xvc2VzdCgnLmpzLWNvbGxhcHNlJykuZmluZCgnLmpzLWNvbGxhcHNlLWJvZHknKTtcbiAgICAgICAgICAgIGlmICgkc2VsZi5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcbiAgICAgICAgICAgICAgICAkc2VsZi5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJGNvbGxhcHNlQm9keS5zbGlkZVVwKCdmYXN0Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRzZWxmLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkY29sbGFwc2VCb2R5LnNsaWRlRG93bignZmFzdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQlNC+0LHQsNCy0LvRj9C10YIg0LzQsNGB0LrQuCDQsiDQv9C+0LvRjyDRhNC+0YDQvFxuICAgICAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9Sb2JpbkhlcmJvdHMvSW5wdXRtYXNrXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxpbnB1dCBjbGFzcz1cImpzLXBob25lLW1hc2tcIiB0eXBlPVwidGVsXCIgbmFtZT1cInRlbFwiIGlkPVwidGVsXCI+XG4gICAgICovXG4gICAgJCgnLmpzLXBob25lLW1hc2snKS5pbnB1dG1hc2soJys3KDk5OSkgOTk5LTk5LTk5Jywge1xuICAgICAgICBjbGVhck1hc2tPbkxvc3RGb2N1czogdHJ1ZSxcbiAgICAgICAgc2hvd01hc2tPbkhvdmVyOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqINCh0YLQuNC70LjQt9GD0LXRgiDRgdC10LvQtdC60YLRiyDRgSDQv9C+0LzQvtGJ0YzRjiDQv9C70LDQs9C40L3QsCBzZWxlY3QyXG4gICAgICogaHR0cHM6Ly9zZWxlY3QyLmdpdGh1Yi5pb1xuICAgICAqL1xuICAgIGxldCBDdXN0b21TZWxlY3QgPSBmdW5jdGlvbigkZWxlbSkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi5pbml0ID0gZnVuY3Rpb24oJGluaXRFbGVtKSB7XG4gICAgICAgICAgICAkaW5pdEVsZW0uZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0U2VhcmNoID0gJCh0aGlzKS5kYXRhKCdzZWFyY2gnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gMTsgLy8g0L/QvtC60LDQt9GL0LLQsNC10Lwg0L/QvtC70LUg0L/QvtC40YHQutCwXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IEluZmluaXR5OyAvLyDQvdC1INC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zZWxlY3QyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdE9uQmx1cjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duQ3NzQ2xhc3M6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vUmVzdWx0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAn0KHQvtCy0L/QsNC00LXQvdC40Lkg0L3QtSDQvdCw0LnQtNC10L3Qvic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINC90YPQttC90L4g0LTQu9GPINCy0YvQu9C40LTQsNGG0LjQuCDQvdCwINC70LXRgtGDXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoYG9wdGlvblt2YWx1ZT1cIiR7JCh0aGlzKS52YWx1ZX1cIl1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnVwZGF0ZSA9IGZ1bmN0aW9uKCR1cGRhdGVFbGVtKSB7XG4gICAgICAgICAgICAkdXBkYXRlRWxlbS5zZWxlY3QyKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBzZWxmLmluaXQoJHVwZGF0ZUVsZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuaW5pdCgkZWxlbSk7XG4gICAgfTtcblxuICAgIHZhciBjdXN0b21TZWxlY3QgPSBuZXcgQ3VzdG9tU2VsZWN0KCQoJ3NlbGVjdCcpKTtcblxuICAgIGNvbnN0IGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgZGF0ZUZvcm1hdDogJ2RkLm1tLnl5JyxcbiAgICAgICAgc2hvd090aGVyTW9udGhzOiB0cnVlLFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDQlNC10LvQsNC10YIg0LLRi9C/0LDQtNGO0YnQuNC1INC60LDQu9C10L3QtNCw0YDQuNC60LhcbiAgICAgKiBAc2VlICBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9kYXRlcGlja2VyL1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyDQsiBkYXRhLWRhdGUtbWluINC4IGRhdGEtZGF0ZS1tYXgg0LzQvtC20L3QviDQt9Cw0LTQsNGC0Ywg0LTQsNGC0YMg0LIg0YTQvtGA0LzQsNGC0LUgZGQubW0ueXl5eVxuICAgICAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJkYXRlSW5wdXRcIiBpZD1cIlwiIGNsYXNzPVwianMtZGF0ZXBpY2tlclwiIGRhdGEtZGF0ZS1taW49XCIwNi4xMS4yMDE1XCIgZGF0YS1kYXRlLW1heD1cIjEwLjEyLjIwMTVcIj5cbiAgICAgKi9cbiAgICBsZXQgRGF0ZXBpY2tlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBkYXRlcGlja2VyID0gJCgnLmpzLWRhdGVwaWNrZXInKTtcblxuICAgICAgICBkYXRlcGlja2VyLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgbWluRGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1taW4nKTtcbiAgICAgICAgICAgIGxldCBtYXhEYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1heCcpO1xuICAgICAgICAgICAgY29uc3Qgc2hvd01ZID0gJCh0aGlzKS5kYXRhKCdzaG93LW0teScpO1xuXG4gICAgICAgICAgICAvKiDQtdGB0LvQuCDQsiDQsNGC0YDQuNCx0YPRgtC1INGD0LrQsNC30LDQvdC+IGN1cnJlbnQsINGC0L4g0LLRi9Cy0L7QtNC40Lwg0YLQtdC60YPRidGD0Y4g0LTQsNGC0YMgKi9cbiAgICAgICAgICAgIGlmIChtYXhEYXRlID09PSAnY3VycmVudCcgfHwgbWluRGF0ZSA9PT0gJ2N1cnJlbnQnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50RGF5ID0gY3VycmVudERhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnREYXkgPCAxMCA/IChjdXJyZW50RGF5ID0gJzAnICsgY3VycmVudERheS50b1N0cmluZygpKSA6IGN1cnJlbnREYXk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3RGF0ZSA9IGN1cnJlbnREYXkgKyAnLicgKyAoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpICsgJy4nICsgY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICBtYXhEYXRlID09PSAnY3VycmVudCcgPyAobWF4RGF0ZSA9IG5ld0RhdGUpIDogKG1pbkRhdGUgPSBuZXdEYXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGl0ZW1PcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIG1pbkRhdGU6IG1pbkRhdGUgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICBtYXhEYXRlOiBtYXhEYXRlIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoYW5nZSgpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLmZpZWxkJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChzaG93TVkpIHtcbiAgICAgICAgICAgICAgICBpdGVtT3B0aW9uc1snY2hhbmdlWWVhciddID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpdGVtT3B0aW9uc1sneWVhclJhbmdlJ10gPSAnYy0xMDA6Yyc7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ2NoYW5nZU1vbnRoJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBpdGVtT3B0aW9ucywgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5kYXRlcGlja2VyKGl0ZW1PcHRpb25zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g0LTQtdC70LDQtdC8INC60YDQsNGB0LjQstGL0Lwg0YHQtdC70LXQuiDQvNC10YHRj9GG0LAg0Lgg0LPQvtC00LBcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2ZvY3VzJywgJy5qcy1kYXRlcGlja2VyJywgKCkgPT4ge1xuICAgICAgICAgICAgLy8g0LjRgdC/0L7Qu9GM0LfRg9C10Lwg0LfQsNC00LXRgNC20LrRgywg0YfRgtC+0LHRiyDQtNC10LnRgtC/0LjQutC10YAg0YPRgdC/0LXQuyDQuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0YLRjNGB0Y9cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgkKCcudWktZGF0ZXBpY2tlcicpLmZpbmQoJ3NlbGVjdCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcudWktZGF0ZXBpY2tlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnc2VsZWN0JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZWxlY3QyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd25Dc3NDbGFzczogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBsZXQgZGF0ZXBpY2tlciA9IG5ldyBEYXRlcGlja2VyKCk7XG5cbiAgICBjb25zdCAkbW9iaWxlTWVudSA9ICQoJy5qcy1tb2JpbGUtbWVudScpO1xuICAgIGNvbnN0ICRjYXJ0TW9kYWwgPSAkKCcuanMtY2FydC1tb2RhbCcpO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1tZW51LWJ0bicsICgpID0+IHtcbiAgICAgICAgb3Blbk1vZGFsKCRtb2JpbGVNZW51KTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtbWVudS1jbG9zZScsICgpID0+IHtcbiAgICAgICAgaGlkZU1vZGFsKCRtb2JpbGVNZW51KTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtY2FydC1idG4nLCBlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBvcGVuTW9kYWwoJGNhcnRNb2RhbCk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNhcnQtY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgIGhpZGVNb2RhbCgkY2FydE1vZGFsKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIE9wZW4gbW9kYWwgYmxvY2tcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJG1vZGFsQmxvY2sgTW9kYWwgYmxvY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvcGVuTW9kYWwoJG1vZGFsQmxvY2spIHtcbiAgICAgICAgJG1vZGFsQmxvY2suYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpLmFuaW1hdGVDc3MoJ3NsaWRlSW5SaWdodCcpO1xuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgIGxvY2tEb2N1bWVudCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhpZGUgbW9kYWwgYmxvY2tcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJG1vZGFsQmxvY2sgTW9kYWwgYmxvY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoaWRlTW9kYWwoJG1vZGFsQmxvY2spIHtcbiAgICAgICAgJG1vZGFsQmxvY2suYW5pbWF0ZUNzcygnc2xpZGVPdXRSaWdodCcsICgpID0+IHtcbiAgICAgICAgICAgICRtb2RhbEJsb2NrLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgICAgIHVubG9ja0RvY3VtZW50KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVubG9jayBkb2N1bWVudCBmb3Igc2Nyb2xsXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5sb2NrRG9jdW1lbnQoKSB7XG4gICAgICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnaXMtbG9ja2VkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9jayBkb2N1bWVudCBmb3Igc2Nyb2xsXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRsb2NrQmxvY2sgQmxvY2sgd2hpY2ggZGVmaW5lIGRvY3VtZW50IGhlaWdodFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvY2tEb2N1bWVudCgpIHtcbiAgICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpcy1sb2NrZWQnKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0g0LvQvtCz0LjQutCwINC+0YLQutGA0YvRgtC40Y8g0LLRi9C/0LDQtNCw0YjQtdC6INGF0LXQtNC10YDQsCAtLS0tLS1cbiAgICBjb25zdCAkaGVhZGVyID0gJCgnLmpzLWhlYWRlcicpO1xuXG4gICAgJChkb2N1bWVudCkub24oJ21vdXNlb3ZlcicsICcuanMtaGVhZGVyLWRyb3Bkb3duLWJ0bicsIGUgPT4ge1xuICAgICAgICBjb25zdCAkc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSAkc2VsZi5hdHRyKCdkYXRhLWNhdGVnb3J5Jyk7XG4gICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICRoZWFkZXIucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgIGlmIChjYXRlZ29yeSkge1xuICAgICAgICAgICAgY29uc3QgJGNhdGVnb3J5RHJvcGRvd24gPSAkKGBbZGF0YS1kcm9wZG93bi1jYXRlZ29yeT0nJHtjYXRlZ29yeX0nXWApO1xuICAgICAgICAgICAgJGNhdGVnb3J5RHJvcGRvd24uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJGhlYWRlci5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZWxlYXZlJywgJy5qcy1oZWFkZXItZHJvcGRvd24nLCBlID0+IHtcbiAgICAgICAgJCgnLmpzLWhlYWRlci1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICB9KTtcblxuICAgIC8vINC90LXQvNC90L7Qs9C+INGB0L/QtdGG0LjRhNC40YfQvdGL0LUg0YLQsNCx0YsuINCY0YHQv9C+0LvRjNC30YPRjtGC0YHRjyDQvdCwINGB0YLRgNCw0L3QuNGG0LUgY2hlY2tvdXQuaHRtbC4g0J/RgNC4INC20LXQu9Cw0L3QuNC4INC80L7QttC90L4g0LTQvtGA0LDQsdC+0YLQsNGC0YxcblxuICAgIGlmICgkKCcuanMtdGFicy1saW5rJykubGVuZ3RoKSB7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtdGFicy1saW5rJywgZSA9PiB7XG4gICAgICAgICAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCAkc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICAgICAgaWYgKCRzZWxmLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCAkdGFicyA9ICRzZWxmLmNsb3Nlc3QoJy5qcy10YWJzJyk7XG4gICAgICAgICAgICBjb25zdCAkdGFic0xpbmtzID0gJHRhYnMuZmluZCgnLmpzLXRhYnMtbGluaycpO1xuICAgICAgICAgICAgY29uc3QgJHRhYnNJdGVtcyA9ICR0YWJzLmZpbmQoJy5qcy10YWJzLWl0ZW0nKTtcblxuICAgICAgICAgICAgLy8g0LLRi9C60LvRjtGH0LDQtdC8INCy0YHQtSDQsNC60YLQuNCy0L3Ri9C1INGC0LDQsdGLINC4INGB0YHRi9C70LrQuFxuICAgICAgICAgICAgJHRhYnNMaW5rcy5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkdGFic0l0ZW1zLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8g0LLRi9C60LvRjtGH0LDQtdC8INCy0LDQu9C40LTQsNGG0LjRjiDRgyDRgdC60YDRi9GC0YvRhSDQv9C+0LvQtdC5INC4INC+0YfQuNGJ0LDQtdC8INC40YVcbiAgICAgICAgICAgIGxldCAkaGlkZGVuRm9ybUZpZWxkcyA9ICR0YWJzSXRlbXMuZmluZCgnW2RhdGEtcmVxdWlyZWRdJyk7XG4gICAgICAgICAgICBpZiAoJGhpZGRlbkZvcm1GaWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgnZGF0YS1yZXF1aXJlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy5wcm9wKCdyZXF1aXJlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy52YWwoJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQstC60LvRjtGH0LDQtdC8INC90YPQttC90YvQuSDRgtCw0LEg0Lgg0LTQtdC70LDQtdC8INC90YPQttC90YPRjiDRgdGB0YvQu9C60YMg0LDQutGC0LjQstC90L7QuVxuICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgY29uc3QgJHNlbGZJdGVtID0gJCgkc2VsZi5kYXRhKCd0YWInKSk7XG4gICAgICAgICAgICAkc2VsZkl0ZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLyDQstC60LvRjtGH0LDQtdC8INCy0LDQu9C40LTQsNGG0LjRjiDRgyDRgdC60YDRi9GC0YvRhSDQv9C+0LvQtdC5XG4gICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcyA9ICRzZWxmSXRlbS5maW5kKCdbZGF0YS1yZXF1aXJlZF0nKTtcbiAgICAgICAgICAgIGlmICgkaGlkZGVuRm9ybUZpZWxkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy5wcm9wKCdkYXRhLXJlcXVpcmVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogICDQkNC60YLQuNCy0LjRgNC+0LLQsNGC0Ywv0LTQtdC30LDQutGC0LjQstC40YDQvtCy0LDRgtGMINGB0L/QuNC90L3QtdGAXG4gICAgICogICBjb25zdCAkYmxvY2sgPSAkKCcuc3Bpbm5lcicpO1xuICAgICAqICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcbiAgICAgKiAgIHNwaW5uZXIuZW5hYmxlU3Bpbm5lcigpOy9zcGlubmVyLmRpc2FibGVTcGlubmVyKCk7XG4gICAgICpcbiAgICAgKi9cblxuICAgIGNsYXNzIFNwaW5uZXIge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSAgb3B0aW9ucyAgICAgICAgICAgICAgICAgICDQntCx0YrQtdC60YIg0YEg0L/QsNGA0LDQvNC10YLRgNCw0LzQuC5cbiAgICAgICAgICogQHBhcmFtICB7alF1ZXJ5fSAgb3B0aW9ucy4kYmxvY2sgICAgICAgICAgICDQqNCw0LHQu9C+0L0uXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLnZhbHVlID0gMF0gICAgICAg0J3QsNGH0LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLm1pbiA9IC1JbmZpbml0eV0g0JzQuNC90LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5tYXggPSBJbmZpbml0eV0gINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5zdGVwID0gMV0gICAgICAgINCo0LDQsy5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMucHJlY2lzaW9uXSAgICAgICDQotC+0YfQvdC+0YHRgtGMICjQvdGD0LbQvdCwINC00LvRjyDQtNC10YHRj9GC0LjRh9C90L7Qs9C+INGI0LDQs9CwKS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHsgJGJsb2NrLCB2YWx1ZSA9IDAsIG1pbiA9IC1JbmZpbml0eSwgbWF4ID0gSW5maW5pdHksIHN0ZXAgPSAxLCBwcmVjaXNpb24gfSA9IHt9KSB7XG4gICAgICAgICAgICB0aGlzLiRibG9jayA9ICRibG9jaztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMgPSB7XG4gICAgICAgICAgICAgICAgJGRlYzogJCgnLnNwaW5uZXJfX2J0bi0tZGVjJywgdGhpcy4kYmxvY2spLFxuICAgICAgICAgICAgICAgICRpbmM6ICQoJy5zcGlubmVyX19idG4tLWluYycsIHRoaXMuJGJsb2NrKSxcbiAgICAgICAgICAgICAgICAkaW5wdXQ6ICQoJy5zcGlubmVyX19pbnB1dCcsIHRoaXMuJGJsb2NrKSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSArdmFsdWU7XG4gICAgICAgICAgICB0aGlzLm1pbiA9ICttaW47XG4gICAgICAgICAgICB0aGlzLm1heCA9ICttYXg7XG4gICAgICAgICAgICB0aGlzLnN0ZXAgPSArc3RlcDtcbiAgICAgICAgICAgIHRoaXMucHJlY2lzaW9uID0gK3ByZWNpc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQn9GA0LjQstC+0LTQuNGCINGA0LDQt9C80LXRgtC60YMg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC1INC/0LDRgNCw0LzQtdGC0YDQsNC8LlxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9ucygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDRgdC+0YHRgtC+0Y/QvdC40LUg0LHQu9C+0LrQuNGA0L7QstC60Lgg0LrQvdC+0L/QvtC6LlxuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlQnV0dG9ucygpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGRlYy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGluYy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPCB0aGlzLm1pbiArIHRoaXMuc3RlcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGRlYy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA+IHRoaXMubWF4IC0gdGhpcy5zdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5jLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0J7RgtC60LvRjtGH0LXQvdC40LUg0YHQv9C40L3QvdC10YDQsC5cbiAgICAgICAgICovXG4gICAgICAgIGRpc2FibGVTcGlubmVyKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kZGVjLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbmMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQktC60LvRjtGH0LXQvdC40LUg0YHQv9C40L3QvdC10YDQsC5cbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZVNwaW5uZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2sucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0J7QsdC90L7QstC70Y/QtdGCINC30L3QsNGH0LXQvdC40LUg0YHRh9GR0YLRh9C40LrQsC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICovXG4gICAgICAgIGNoYW5nZVZhbHVlKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hdHRyKCdkYXRhLXZhbHVlJywgdmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5wdXQuYXR0cigndmFsdWUnLCB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbnB1dC52YWwodmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCc0LXQvdGP0LXRgiDQt9C90LDRh9C10L3QuNC1INC80LjQvdC40LzRg9C80LAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gdmFsdWUg0J3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKi9cbiAgICAgICAgY2hhbmdlTWluKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm1pbiA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2suYXR0cignZGF0YS1taW4nLCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0JzQtdC90Y/QtdGCINC30L3QsNGH0LXQvdC40LUg0LzQsNC60YHQuNC80YPQvNCwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IHZhbHVlINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICovXG4gICAgICAgIGNoYW5nZU1heCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5tYXggPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLmF0dHIoJ2RhdGEtbWF4JywgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCc0LDRgdGB0LjQsiDRgdC+0LfQtNCw0L3QvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyBpbnN0YW5jZXMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog0J3QsNGF0L7QtNC40YIg0L7QsdGK0LXQutGCINC60LvQsNGB0YHQsCDQv9C+INGI0LDQsdC70L7QvdGDLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtqUXVlcnl9ICRibG9jayDQqNCw0LHQu9C+0L0uXG4gICAgICAgICAqIEByZXR1cm4ge1NwaW5uZXJ9ICAgICAgINCe0LHRitC10LrRgi5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgkYmxvY2spIHtcbiAgICAgICAgICAgIHJldHVybiBTcGlubmVyLmluc3RhbmNlcy5maW5kKHNwaW5uZXIgPT4gc3Bpbm5lci4kYmxvY2suaXMoJGJsb2NrKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0KHQvtC30LTQsNGR0YIg0L7QsdGK0LXQutGC0Ysg0L/QviDRiNCw0LHQu9C+0L3QsNC8LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gWyRzcGlubmVycyA9ICQoJy5zcGlubmVyJyldINCo0LDQsdC70L7QvdGLLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIGNyZWF0ZSgkc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpKSB7XG4gICAgICAgICAgICAkc3Bpbm5lcnMuZWFjaCgoaW5kZXgsIGJsb2NrKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGJsb2NrID0gJChibG9jayk7XG5cbiAgICAgICAgICAgICAgICBpZiAoU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzcGlubmVyID0gbmV3IFNwaW5uZXIoe1xuICAgICAgICAgICAgICAgICAgICAkYmxvY2ssXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAkYmxvY2suYXR0cignZGF0YS12YWx1ZScpLFxuICAgICAgICAgICAgICAgICAgICBtaW46ICRibG9jay5hdHRyKCdkYXRhLW1pbicpLFxuICAgICAgICAgICAgICAgICAgICBtYXg6ICRibG9jay5hdHRyKCdkYXRhLW1heCcpLFxuICAgICAgICAgICAgICAgICAgICBzdGVwOiAkYmxvY2suYXR0cignZGF0YS1zdGVwJyksXG4gICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbjogJGJsb2NrLmF0dHIoJ2RhdGEtcHJlY2lzaW9uJyksXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkYmxvY2suaGFzQ2xhc3MoJ2lzLWRpc2FibGVkJykgPyBzcGlubmVyLmRpc2FibGVTcGlubmVyKCkgOiBzcGlubmVyLmluaXQoKTtcblxuICAgICAgICAgICAgICAgIFNwaW5uZXIuaW5zdGFuY2VzLnB1c2goc3Bpbm5lcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQo9C00LDQu9GP0LXRgiDQvtCx0YrQtdC60YLRiyDQv9C+INGI0LDQsdC70L7QvdCw0LwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSBbJHNwaW5uZXJzID0gJCgnLnNwaW5uZXInKV0g0KjQsNCx0LvQvtC90YsuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgcmVtb3ZlKCRzcGlubmVycyA9ICQoJy5zcGlubmVyJykpIHtcbiAgICAgICAgICAgICRzcGlubmVycy5lYWNoKChpbmRleCwgYmxvY2spID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkYmxvY2sgPSAkKGJsb2NrKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNwaW5uZXJJbmRleCA9IFNwaW5uZXIuaW5zdGFuY2VzLmZpbmRJbmRleChzcGlubmVyID0+IHNwaW5uZXIuJGJsb2NrLmlzKCRibG9jaykpO1xuXG4gICAgICAgICAgICAgICAgU3Bpbm5lci5pbnN0YW5jZXMuc3BsaWNlKHNwaW5uZXJJbmRleCwgMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc3Bpbm5lcl9fYnRuLS1kZWMnLCBoYW5kbGVEZWNDbGljayk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5zcGlubmVyX19idG4tLWluYycsIGhhbmRsZUluY0NsaWNrKTtcbiAgICAkKGRvY3VtZW50KS5vbignaW5wdXQnLCAnLnNwaW5uZXJfX2lucHV0JywgaGFuZGxlSW5wdXQpO1xuXG4gICAgLyog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQv9C40L3QvdC10YDQvtCyICovXG4gICAgbGV0IHNwaW5uZXJzID0gU3Bpbm5lci5jcmVhdGUoKTtcblxuICAgIC8qKlxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INC60LvQuNC60LAg0L/QviDQutC90L7Qv9C60LUg0YPQvNC10L3RjNGI0LXQvdC40Y8uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZSDQntCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFuZGxlRGVjQ2xpY2soZSkge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRUYXJnZXQgfSA9IGU7XG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCAkYmxvY2sgPSAkdGFyZ2V0LmNsb3Nlc3QoJy5zcGlubmVyJyk7XG4gICAgICAgIGNvbnN0IHNwaW5uZXIgPSBTcGlubmVyLmdldEluc3RhbmNlKCRibG9jayk7XG5cbiAgICAgICAgbGV0IHZhbHVlID0gc3Bpbm5lci52YWx1ZSAtIHNwaW5uZXIuc3RlcDtcblxuICAgICAgICBpZiAoc3Bpbm5lci5wcmVjaXNpb24pIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZS50b0ZpeGVkKHNwaW5uZXIucHJlY2lzaW9uKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzcGlubmVyLmNoYW5nZVZhbHVlKHZhbHVlKTtcblxuICAgICAgICBzcGlubmVyLnVwZGF0ZUJ1dHRvbnMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQutC70LjQutCwINC/0L4g0LrQvdC+0L/QutC1INGD0LLQtdC70LjRh9C10L3QuNGPLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGUg0J7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZUluY0NsaWNrKGUpIHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VGFyZ2V0IH0gPSBlO1xuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChjdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgJGJsb2NrID0gJHRhcmdldC5jbG9zZXN0KCcuc3Bpbm5lcicpO1xuICAgICAgICBjb25zdCBzcGlubmVyID0gU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHNwaW5uZXIudmFsdWUgKyBzcGlubmVyLnN0ZXA7XG5cbiAgICAgICAgaWYgKHNwaW5uZXIucHJlY2lzaW9uKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUudG9GaXhlZChzcGlubmVyLnByZWNpc2lvbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Bpbm5lci5jaGFuZ2VWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgICAgc3Bpbm5lci51cGRhdGVCdXR0b25zKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0LLQstC+0LTQsCDQsiDQv9C+0LvQtS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlINCe0LHRitC10LrRgiDRgdC+0LHRi9GC0LjRjy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYW5kbGVJbnB1dChlKSB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudFRhcmdldCB9ID0gZTtcbiAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0ICRibG9jayA9ICR0YXJnZXQuY2xvc2VzdCgnLnNwaW5uZXInKTtcbiAgICAgICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcbiAgICAgICAgY29uc3QgeyAkaW5wdXQgfSA9IHNwaW5uZXIuZWxlbWVudHM7XG5cbiAgICAgICAgbGV0IHZhbHVlID0gKyRpbnB1dC52YWwoKTtcblxuICAgICAgICBpZiAoISRpbnB1dC52YWwoKS5sZW5ndGggfHwgdmFsdWUgPCBzcGlubmVyLm1pbiB8fCB2YWx1ZSA+IHNwaW5uZXIubWF4KSB7XG4gICAgICAgICAgICAoeyB2YWx1ZSB9ID0gc3Bpbm5lcik7XG4gICAgICAgIH1cblxuICAgICAgICBzcGlubmVyLmNoYW5nZVZhbHVlKHZhbHVlKTtcblxuICAgICAgICBzcGlubmVyLnVwZGF0ZUJ1dHRvbnMoKTtcbiAgICB9XG5cbiAgICBpbml0Q2Fyb3VzZWxzKCk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGluaXRDYXJvdXNlbHMpO1xuXG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQstGB0LUg0LrQsNGA0YPRgdC10LvQuFxuICAgIGZ1bmN0aW9uIGluaXRDYXJvdXNlbHMoKSB7XG4gICAgICAgIC8vICDQutCw0YDRg9GB0LXQu9GMINC90LAg0L/QtdGA0LLQvtC8INCx0LDQvdC90LXRgNC1INC90LAg0LPQu9Cw0LLQvdC+0Lkg0YHRgtGA0LDQvdC40YbQtVxuICAgICAgICBjb25zdCAkbmV3c0Nhcm91c2VsID0gJCgnLmpzLW5ld3MtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRuZXdzQ2Fyb3VzZWwubGVuZ3RoICYmICEkbmV3c0Nhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkbmV3c0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY3LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiAxMDIzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC/0L7QtNCx0L7RgNCwINCx0LDQudC60L7QslxuICAgICAgICBjb25zdCAkYmlrZXNDYXJvdXNlbCA9ICQoJy5qcy1iaWtlcy1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJGJpa2VzQ2Fyb3VzZWwubGVuZ3RoICYmICEkYmlrZXNDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJGJpa2VzQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiAndW5zbGljaycsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBiaWtlIGFmdGVyIGluaXRcbiAgICAgICAgICAgICRiaWtlc0Nhcm91c2VsXG4gICAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dCcpXG4gICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgYmlrZSBhZnRlciBjaGFuZ2VcbiAgICAgICAgICAgICRiaWtlc0Nhcm91c2VsLm9uKCdhZnRlckNoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAkYmlrZXNDYXJvdXNlbFxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnLnNsaWNrLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dCcpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vINC60LDRgNGD0YHQtdC70Ywg0LrQsNGC0LXQs9C+0YDQuNC5XG4gICAgICAgIGNvbnN0ICRjYXRlZ29yaWVzQ2Fyb3VzZWwgPSAkKCcuanMtY2F0ZWdvcmllcy1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJGNhdGVnb3JpZXNDYXJvdXNlbC5sZW5ndGggJiYgISRjYXRlZ29yaWVzQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRjYXRlZ29yaWVzQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICcwJyxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY3LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC90LAg0LPQu9Cw0LLQvdC+0LlcbiAgICAgICAgY29uc3QgJGluZGV4TWFpbkNhcm91c2VsID0gJCgnLmpzLWluZGV4LW1haW4tY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRpbmRleE1haW5DYXJvdXNlbC5sZW5ndGggJiYgISRpbmRleE1haW5DYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJGluZGV4TWFpbkNhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnMCcsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQutCw0YDRgtC40L3QvtC6INGC0L7QstCw0YDQsFxuICAgICAgICBjb25zdCAkcHJvZHVjdENhcm91c2VsID0gJCgnLmpzLXByb2R1Y3QtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRwcm9kdWN0Q2Fyb3VzZWwubGVuZ3RoICYmICEkcHJvZHVjdENhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkcHJvZHVjdENhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IHRydWUsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIHByZXZBcnJvdzpcbiAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWFycm93IGJ0bi1hcnJvdy0tcHJldiBwcm9kdWN0LXBhZ2VfX2Nhcm91c2VsLXByZXZcIj48c3ZnIGNsYXNzPVwiaWNvbiBpY29uLS1hcnJvdy1uZXh0XCI+PHVzZSB4bGluazpocmVmPVwiI2ljb24tYXJyb3dfbmV4dFwiPjwvdXNlPjwvc3ZnPjwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgbmV4dEFycm93OlxuICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4tYXJyb3cgcHJvZHVjdC1wYWdlX19jYXJvdXNlbC1uZXh0XCI+PHN2ZyBjbGFzcz1cImljb24gaWNvbi0tYXJyb3ctbmV4dFwiPjx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWFycm93X25leHRcIj48L3VzZT48L3N2Zz48L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY4LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vINC60LDRgNGD0YHQtdC70Ywg0L/QvtGF0L7QttC40YUg0YLQvtCy0LDRgNC+0LJcbiAgICAgICAgY29uc3QgJHNpbWlsYXJDYXJvdXNlbCA9ICQoJy5qcy1zaW1pbGFyLWNhcm91c2VsJyk7XG4gICAgICAgIGlmICgkc2ltaWxhckNhcm91c2VsLmxlbmd0aCAmJiAhJHNpbWlsYXJDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJHNpbWlsYXJDYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgY2VudGVyUGFkZGluZzogJzAnLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA2MzksXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogJ3Vuc2xpY2snLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vINC60LDRgNGD0YHQtdC70Ywg0LrQsNGA0YLQuNC90L7QulxuICAgICAgICBjb25zdCAkcGljdHVyZUNhcm91c2VsID0gJCgnLmpzLXBpY3R1cmUtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRwaWN0dXJlQ2Fyb3VzZWwubGVuZ3RoICYmICEkcGljdHVyZUNhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkcGljdHVyZUNhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJGJpa2VDYXJkQ2Fyb3VzZWwgPSAkKCcuanMtYmlrZS1jYXJkLWNhcm91c2VsJyk7XG4gICAgICAgIGlmICgkYmlrZUNhcmRDYXJvdXNlbC5sZW5ndGggJiYgISRiaWtlQ2FyZENhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkYmlrZUNhcmRDYXJvdXNlbC5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICQoaXRlbSkuc2xpY2soe1xuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZmFkZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDRgNC10LDQu9C40LfQvtCy0YvQstCw0LXQvCDQv9C10YDQtdC60LvRjtGH0LXQvdC40LUg0YHQu9Cw0LnQtNC+0LJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtYmlrZS1jYXJkLXNsaWRlLWJ0bicsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRidG4gPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICAgICAgY29uc3QgJHBhcmVudCA9ICRidG4uY2xvc2VzdCgnLmJpa2UtY2FyZCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRjYXJvdXNlbCA9ICRwYXJlbnQuZmluZCgnLmpzLWJpa2UtY2FyZC1jYXJvdXNlbCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNsaWRlSWQgPSAkYnRuLmRhdGEoJ3NsaWRlJyk7XG4gICAgICAgICAgICAgICAgJHBhcmVudC5maW5kKCcuanMtYmlrZS1jYXJkLXNsaWRlLWJ0bicpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkYnRuLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkY2Fyb3VzZWwuc2xpY2soJ3NsaWNrR29UbycsIHNsaWRlSWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCAkdXBCdG4gPSAkKCcuanMtYnRuLXVwJyk7XG5cbiAgICBpZiAoJHVwQnRuLmxlbmd0aCkge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWJ0bi11cCcsICgpID0+IHtcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPj0gZ2xvYmFsT3B0aW9ucy50YWJsZXRMZ1NpemUpIHtcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPiA1MCA/ICR1cEJ0bi5zaG93KCkgOiAkdXBCdG4uaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCAkZmlsdGVyTW9kYWwgPSAkKCcuanMtZmlsdGVyLW1vZGFsJyk7XG4gICAgaWYgKCRmaWx0ZXJNb2RhbC5sZW5ndGgpIHtcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1maWx0ZXItYnRuJywgZSA9PiB7XG4gICAgICAgICAgICAkZmlsdGVyTW9kYWwuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpLmFuaW1hdGVDc3MoJ3NsaWRlSW5SaWdodCcpO1xuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoYXMtb3ZlcmxheScpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWZpbHRlci1jbG9zZScsIGUgPT4ge1xuICAgICAgICAgICAgJGZpbHRlck1vZGFsLmFuaW1hdGVDc3MoJ3NsaWRlT3V0UmlnaHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJGZpbHRlck1vZGFsLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQkNC90LjQvNCw0YbQuNGPINGN0LvQtdC80LXQvdGC0LAgbGFiZWwg0L/RgNC4INGE0L7QutGD0YHQtSDQv9C+0LvQtdC5INGE0L7RgNC80YtcbiAgICAgICAgICovXG4gICAgICAgICQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgY29uc3QgZmllbGQgPSAkKGVsKS5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICQoZmllbGQpXG4gICAgICAgICAgICAgICAgICAgIC52YWwoKVxuICAgICAgICAgICAgICAgICAgICAudHJpbSgpICE9ICcnIHx8XG4gICAgICAgICAgICAgICAgJChmaWVsZCkuaXMoJzpwbGFjZWhvbGRlci1zaG93bicpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoZmllbGQpXG4gICAgICAgICAgICAgICAgLm9uKCdmb2N1cycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICQoZWwpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vbignYmx1cicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudmFsKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpID09PSAnJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgISQoZmllbGQpLmlzKCc6cGxhY2Vob2xkZXItc2hvd24nKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoZWwpLnJlbW92ZUNsYXNzKCdpcy1maWxsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiBAc2VlIGh0dHBzOi8vYXRvbWlrcy5naXRodWIuaW8vdGlwcHlqcy8gKi9cblxuICAgIGNvbnN0IHRvb2x0aXBTZXR0aW5ncyA9IHtcbiAgICAgICAgYXJyb3c6IGZhbHNlLFxuICAgICAgICBhbGxvd0hUTUw6IGZhbHNlLFxuICAgICAgICBhbmltYXRlRmlsbDogZmFsc2UsXG4gICAgICAgIHBsYWNlbWVudDogJ3JpZ2h0LWNlbnRlcicsXG4gICAgICAgIGRpc3RhbmNlOiAyMCxcbiAgICAgICAgdGhlbWU6ICd0b29sdGlwJyxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogIGluaXQgYWxsIHRvb2x0aXBzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdFRvb2x0aXBzKCkge1xuICAgICAgICAkKCdbZGF0YS10b29sdGlwXScpLmVhY2goKGluZGV4LCBlbGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsb2NhbFNldHRpbmdzID0ge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICQoZWxlbSkuYXR0cignZGF0YS10b29sdGlwJyksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKCQoZWxlbSkuZGF0YSgnY2xpY2snKSkge1xuICAgICAgICAgICAgICAgIGxvY2FsU2V0dGluZ3NbJ3RyaWdnZXInXSA9ICdjbGljayBrZXl1cCc7XG4gICAgICAgICAgICAgICAgbG9jYWxTZXR0aW5nc1snaW50ZXJhY3RpdmUnXSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRpcHB5KGVsZW0sIE9iamVjdC5hc3NpZ24oe30sIHRvb2x0aXBTZXR0aW5ncywgbG9jYWxTZXR0aW5ncykpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0VG9vbHRpcHMoKTtcblxuICAgIC8vIHNob3AgYWRkcmVzc1xuICAgIC8vINCc0L7RgdC60L7QstGB0LrQsNGPINC+0LHQu9Cw0YLRjCwg0KHQvtC70L3QtdGH0L3QvtCz0L7RgNGB0LrQuNC5INGA0LDQudC+0L0sINC0LiDQlNGD0YDRi9C60LjQvdC+LCAx0JQuXG4gICAgY29uc3Qgc2hvcCA9IHsgbGF0OiA1Ni4wNTk2OTUsIGxuZzogMzcuMTQ0MTQyIH07XG5cbiAgICAvLyBmb3IgYmxhY2sgbWFwXG4gICAgY29uc3QgbWFwU3R5bGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2dlb21ldHJ5JyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzIxMjEyMScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLmljb24nLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ29mZicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM3NTc1NzUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LnN0cm9rZScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMyMTIxMjEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ2FkbWluaXN0cmF0aXZlJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnZ2VvbWV0cnknLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNzU3NTc1JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdhZG1pbmlzdHJhdGl2ZS5jb3VudHJ5JyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5ZTllOWUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ2FkbWluaXN0cmF0aXZlLmxhbmRfcGFyY2VsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICdvZmYnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ2FkbWluaXN0cmF0aXZlLmxvY2FsaXR5JyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNiZGJkYmQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3BvaScsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNzU3NTc1JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdwb2kucGFyaycsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2dlb21ldHJ5JyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzE4MTgxOCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncG9pLnBhcmsnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzYxNjE2MScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncG9pLnBhcmsnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5zdHJva2UnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMWIxYjFiJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdyb2FkJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnZ2VvbWV0cnkuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMyYzJjMmMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3JvYWQnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzhhOGE4YScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncm9hZC5hcnRlcmlhbCcsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2dlb21ldHJ5JyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzM3MzczNycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncm9hZC5oaWdod2F5JyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnZ2VvbWV0cnknLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2MzYzNjJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdyb2FkLmhpZ2h3YXkuY29udHJvbGxlZF9hY2Nlc3MnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM0ZTRlNGUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3JvYWQubG9jYWwnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzYxNjE2MScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAndHJhbnNpdCcsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNzU3NTc1JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICd3YXRlcicsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2dlb21ldHJ5JyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAnd2F0ZXInLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNkM2QzZCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgXTtcblxuICAgIC8vIEluaXRpYWxpemUgYW5kIGFkZCB0aGUgbWFwXG4gICAgZnVuY3Rpb24gaW5pdE1hcCgpIHtcbiAgICAgICAgLy8gVGhlIG1hcCwgY2VudGVyZWQgYXQgU2hvcFxuICAgICAgICBjb25zdCBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgICAgICAgICAgem9vbTogMTQsXG4gICAgICAgICAgICBjZW50ZXI6IHNob3AsXG4gICAgICAgICAgICBzdHlsZXM6IG1hcFN0eWxlcyxcbiAgICAgICAgICAgIHpvb21Db250cm9sOiB0cnVlLFxuICAgICAgICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgICAgc2NhbGVDb250cm9sOiB0cnVlLFxuICAgICAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgICAgcm90YXRlQ29udHJvbDogZmFsc2UsXG4gICAgICAgICAgICBmdWxsc2NyZWVuQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcG9pbnRJY29uID0ge1xuICAgICAgICAgICAgdXJsOiAnaW1nL3N2Zy9wb2ludC5zdmcnLFxuICAgICAgICAgICAgLy8gVGhpcyBtYXJrZXIgaXMgNzIgcGl4ZWxzIHdpZGUgYnkgNzIgcGl4ZWxzIGhpZ2guXG4gICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSg3MiwgNzIpLFxuICAgICAgICAgICAgLy8gVGhlIG9yaWdpbiBmb3IgdGhpcyBpbWFnZSBpcyAoMCwgMCkuXG4gICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgIC8vIFRoZSBhbmNob3IgZm9yIHRoaXMgaW1hZ2UgaXMgdGhlIGNlbnRlciBhdCAoMCwgMzIpLlxuICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMzYsIDM2KSxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBUaGUgbWFya2VyLCBwb3NpdGlvbmVkIGF0IHNob3BcbiAgICAgICAgY29uc3QgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICBwb3NpdGlvbjogc2hvcCxcbiAgICAgICAgICAgIGljb246IHBvaW50SWNvbixcbiAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB3aW5kb3cuaW5pdE1hcCA9IGluaXRNYXA7XG5cbjtcbn0pO1xuIl0sImZpbGUiOiJpbnRlcm5hbC5qcyJ9

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
              fade: false,
              dots: true
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wTGdTaXplIiwiZGVza3RvcE1kU2l6ZSIsImRlc2t0b3BTaXplIiwiZGVza3RvcFNtU2l6ZSIsInRhYmxldExnU2l6ZSIsInRhYmxldFNpemUiLCJtb2JpbGVMZ1NpemUiLCJtb2JpbGVTaXplIiwibGFuZyIsImF0dHIiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnREZXNrdG9wTGciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYnJlYWtwb2ludERlc2t0b3BNZCIsImJyZWFrcG9pbnREZXNrdG9wIiwiYnJlYWtwb2ludERlc2t0b3BTbSIsImJyZWFrcG9pbnRUYWJsZXRMZyIsImJyZWFrcG9pbnRUYWJsZXQiLCJicmVha3BvaW50TW9iaWxlTGdTaXplIiwiYnJlYWtwb2ludE1vYmlsZSIsImV4dGVuZCIsIm9uIiwibGVuZ3RoIiwiYXV0b3NpemUiLCJmbiIsImFuaW1hdGVDc3MiLCJhbmltYXRpb25OYW1lIiwiY2FsbGJhY2siLCJhbmltYXRpb25FbmQiLCJlbCIsImFuaW1hdGlvbnMiLCJhbmltYXRpb24iLCJPQW5pbWF0aW9uIiwiTW96QW5pbWF0aW9uIiwiV2Via2l0QW5pbWF0aW9uIiwidCIsInN0eWxlIiwidW5kZWZpbmVkIiwiY3JlYXRlRWxlbWVudCIsImFkZENsYXNzIiwib25lIiwicmVtb3ZlQ2xhc3MiLCJpc051bWVyaWMiLCJuIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJyZW1vdmVOb3REaWdpdHMiLCJwYXJhbSIsInRvU3RyaW5nIiwicmVwbGFjZSIsImRpdmlkZUJ5RGlnaXRzIiwibG9jYWxlIiwiUGFyc2xleSIsInNldExvY2FsZSIsIm9wdGlvbnMiLCJ0cmlnZ2VyIiwidmFsaWRhdGlvblRocmVzaG9sZCIsImVycm9yc1dyYXBwZXIiLCJlcnJvclRlbXBsYXRlIiwiY2xhc3NIYW5kbGVyIiwiaW5zdGFuY2UiLCIkZWxlbWVudCIsInR5cGUiLCIkaGFuZGxlciIsImhhc0NsYXNzIiwibmV4dCIsImVycm9yc0NvbnRhaW5lciIsIiRjb250YWluZXIiLCJjbG9zZXN0IiwicGFyZW50IiwiYWRkVmFsaWRhdG9yIiwidmFsaWRhdGVTdHJpbmciLCJ2YWx1ZSIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJkYXRhIiwibWF4IiwibWluRGF0ZSIsIm1heERhdGUiLCJ2YWx1ZURhdGUiLCJyZXN1bHQiLCJtYXRjaCIsIkRhdGUiLCJtYXhTaXplIiwicGFyc2xleUluc3RhbmNlIiwiZmlsZXMiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsImkiLCIkYmxvY2siLCIkbGFzdCIsImFmdGVyIiwiZWxlbWVudCIsInBhcnNsZXkiLCJlIiwiJHNlbGYiLCJjdXJyZW50VGFyZ2V0IiwiJGNvbGxhcHNlQm9keSIsImZpbmQiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwiaW5wdXRtYXNrIiwiY2xlYXJNYXNrT25Mb3N0Rm9jdXMiLCJzaG93TWFza09uSG92ZXIiLCJDdXN0b21TZWxlY3QiLCIkZWxlbSIsInNlbGYiLCJpbml0IiwiJGluaXRFbGVtIiwiZWFjaCIsInNlbGVjdFNlYXJjaCIsIm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIiwiSW5maW5pdHkiLCJzZWxlY3QyIiwic2VsZWN0T25CbHVyIiwiZHJvcGRvd25Dc3NDbGFzcyIsImxhbmd1YWdlIiwibm9SZXN1bHRzIiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbVNlbGVjdCIsImRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyIsImRhdGVGb3JtYXQiLCJzaG93T3RoZXJNb250aHMiLCJEYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsInNob3dNWSIsImN1cnJlbnREYXRlIiwiY3VycmVudERheSIsImdldERhdGUiLCJuZXdEYXRlIiwiZ2V0TW9udGgiLCJnZXRGdWxsWWVhciIsIml0ZW1PcHRpb25zIiwib25TZWxlY3QiLCJjaGFuZ2UiLCJzZXRUaW1lb3V0IiwiJG1vYmlsZU1lbnUiLCIkY2FydE1vZGFsIiwib3Blbk1vZGFsIiwiaGlkZU1vZGFsIiwicHJldmVudERlZmF1bHQiLCIkbW9kYWxCbG9jayIsImxvY2tEb2N1bWVudCIsInVubG9ja0RvY3VtZW50IiwiJGhlYWRlciIsImNhdGVnb3J5IiwiJGNhdGVnb3J5RHJvcGRvd24iLCIkdGFicyIsIiR0YWJzTGlua3MiLCIkdGFic0l0ZW1zIiwiJGhpZGRlbkZvcm1GaWVsZHMiLCJwcm9wIiwidmFsIiwiJHNlbGZJdGVtIiwiU3Bpbm5lciIsInN0ZXAiLCJwcmVjaXNpb24iLCJlbGVtZW50cyIsIiRkZWMiLCIkaW5jIiwiJGlucHV0IiwidXBkYXRlQnV0dG9ucyIsImluc3RhbmNlcyIsInNwaW5uZXIiLCJpcyIsIiRzcGlubmVycyIsImluZGV4IiwiYmxvY2siLCJnZXRJbnN0YW5jZSIsImRpc2FibGVTcGlubmVyIiwicHVzaCIsInNwaW5uZXJJbmRleCIsImZpbmRJbmRleCIsInNwbGljZSIsImhhbmRsZURlY0NsaWNrIiwiaGFuZGxlSW5jQ2xpY2siLCJoYW5kbGVJbnB1dCIsInNwaW5uZXJzIiwiY3JlYXRlIiwiJHRhcmdldCIsInRvRml4ZWQiLCJjaGFuZ2VWYWx1ZSIsImluaXRDYXJvdXNlbHMiLCIkbmV3c0Nhcm91c2VsIiwic2xpY2siLCJhcnJvd3MiLCJpbmZpbml0ZSIsInNsaWRlc1RvU2hvdyIsImNlbnRlck1vZGUiLCJ2YXJpYWJsZVdpZHRoIiwibW9iaWxlRmlyc3QiLCJyZXNwb25zaXZlIiwiYnJlYWtwb2ludCIsInNldHRpbmdzIiwiJGJpa2VzQ2Fyb3VzZWwiLCIkY2F0ZWdvcmllc0Nhcm91c2VsIiwiY2VudGVyUGFkZGluZyIsImRvdHMiLCIkaW5kZXhNYWluQ2Fyb3VzZWwiLCIkcHJvZHVjdENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJHNpbWlsYXJDYXJvdXNlbCIsIiRwaWN0dXJlQ2Fyb3VzZWwiLCJzbGlkZXNUb1Njcm9sbCIsIiRiaWtlQ2FyZENhcm91c2VsIiwiaXRlbSIsImZhZGUiLCIkYnRuIiwiJHBhcmVudCIsIiRjYXJvdXNlbCIsInNsaWRlSWQiLCIkdXBCdG4iLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwid2lkdGgiLCJzaG93IiwiaGlkZSIsIiRmaWx0ZXJNb2RhbCIsImZpZWxkIiwidHJpbSIsImV2ZW50IiwidG9vbHRpcFNldHRpbmdzIiwiYXJyb3ciLCJhbGxvd0hUTUwiLCJhbmltYXRlRmlsbCIsInBsYWNlbWVudCIsImRpc3RhbmNlIiwidGhlbWUiLCJpbml0VG9vbHRpcHMiLCJlbGVtIiwibG9jYWxTZXR0aW5ncyIsImNvbnRlbnQiLCJ0aXBweSIsIk9iamVjdCIsImFzc2lnbiIsInNob3AiLCJsYXQiLCJsbmciLCJtYXBTdHlsZXMiLCJlbGVtZW50VHlwZSIsInN0eWxlcnMiLCJjb2xvciIsInZpc2liaWxpdHkiLCJmZWF0dXJlVHlwZSIsImluaXRNYXAiLCJtYXAiLCJnb29nbGUiLCJtYXBzIiwiTWFwIiwiZ2V0RWxlbWVudEJ5SWQiLCJ6b29tIiwiY2VudGVyIiwic3R5bGVzIiwiem9vbUNvbnRyb2wiLCJtYXBUeXBlQ29udHJvbCIsInNjYWxlQ29udHJvbCIsInN0cmVldFZpZXdDb250cm9sIiwicm90YXRlQ29udHJvbCIsImZ1bGxzY3JlZW5Db250cm9sIiwicG9pbnRJY29uIiwidXJsIiwiU2l6ZSIsIm9yaWdpbiIsIlBvaW50IiwiYW5jaG9yIiwibWFya2VyIiwiTWFya2VyIiwicG9zaXRpb24iLCJpY29uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBVztBQUN6Qjs7O0FBR0EsTUFBSUMsYUFBYSxHQUFHO0FBQ2hCO0FBQ0FDLElBQUFBLElB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QUUsSUFKK0M7QUFLNURDLE1BQUFBLGNBQWMsRUFBRSxLQUw0QztBQU01REMsTUFBQUEsWUFBWSxFQUFFLElBTjhDO0FBTzVEQyxNQUFBQSxpQkFBaUIsRUFBRSxLQVB5QztBQVE1REMsTUFBQUEsYUFBYSxFQUFFLEtBUjZDO0FBUzVEQyxNQUFBQSxpQkFBaUIsRUFBRTtBQVR5QyxLQUFwRCxDQUFaO0FBWUEsUUFBTUMsU0FBUyxHQUFHO0FBQ2RDLE1BQUFBLEdBQUcsRUFBRSxtQkFEUztBQUVkO0FBQ0F2TCxNQUFBQSxJQUFJLEVBQUUsSUFBSXlLLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZYyxJQUFoQixDQUFxQixFQUFyQixFQUF5QixFQUF6QixDQUhRO0FBSWQ7QUFDQUMsTUFBQUEsTUFBTSxFQUFFLElBQUloQixNQUFNLENBQUNDLElBQVAsQ0FBWWdCLEtBQWhCLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBTE07QUFNZDtBQUNBQyxNQUFBQSxNQUFNLEVBQUUsSUFBSWxCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZZ0IsS0FBaEIsQ0FBc0IsRUFBdEIsRUFBMEIsRUFBMUI7QUFQTSxLQUFsQixDQWRlLENBd0JmOztBQUNBLFFBQU1FLE1BQU0sR0FBRyxJQUFJbkIsTUFBTSxDQUFDQyxJQUFQLENBQVltQixNQUFoQixDQUF1QjtBQUNsQ0MsTUFBQUEsUUFBUSxFQUFFaEMsSUFEd0I7QUFFbENpQyxNQUFBQSxJQUFJLEVBQUVULFNBRjRCO0FBR2xDZCxNQUFBQSxHQUFHLEVBQUVBO0FBSDZCLEtBQXZCLENBQWY7QUFLSDs7QUFFRDFQLEVBQUFBLE1BQU0sQ0FBQ3lQLE9BQVAsR0FBaUJBLE9BQWpCO0FBRUo7QUFDQyxDQTkyQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiDQk9C70L7QsdCw0LvRjNC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtSwg0LrQvtGC0L7RgNGL0LUg0LjRgdC/0L7Qu9GM0LfRg9GO0YLRgdGPINC80L3QvtCz0L7QutGA0LDRgtC90L5cbiAgICAgKi9cbiAgICBsZXQgZ2xvYmFsT3B0aW9ucyA9IHtcbiAgICAgICAgLy8g0JLRgNC10LzRjyDQtNC70Y8g0LDQvdC40LzQsNGG0LjQuVxuICAgICAgICB0aW1lOiAgMjAwLFxuXG4gICAgICAgIC8vINCa0L7QvdGC0YDQvtC70YzQvdGL0LUg0YLQvtGH0LrQuCDQsNC00LDQv9GC0LjQstCwXG4gICAgICAgIGRlc2t0b3BMZ1NpemU6ICAxOTEwLFxuICAgICAgICBkZXNrdG9wTWRTaXplOiAgMTYwMCxcbiAgICAgICAgZGVza3RvcFNpemU6ICAgIDE0ODAsXG4gICAgICAgIGRlc2t0b3BTbVNpemU6ICAxMjgwLFxuICAgICAgICB0YWJsZXRMZ1NpemU6ICAgMTAyNCxcbiAgICAgICAgdGFibGV0U2l6ZTogICAgIDc2OCxcbiAgICAgICAgbW9iaWxlTGdTaXplOiAgIDY0MCxcbiAgICAgICAgbW9iaWxlU2l6ZTogICAgIDQ4MCxcblxuICAgICAgICBsYW5nOiAkKCdodG1sJykuYXR0cignbGFuZycpXG4gICAgfTtcblxuICAgIC8vINCR0YDQtdC50LrQv9C+0LjQvdGC0Ysg0LDQtNCw0L/RgtC40LLQsFxuICAgIC8vIEBleGFtcGxlIGlmIChnbG9iYWxPcHRpb25zLmJyZWFrcG9pbnRUYWJsZXQubWF0Y2hlcykge30gZWxzZSB7fVxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0ge1xuICAgICAgICBicmVha3BvaW50RGVza3RvcExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcE1kOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BNZFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wU206IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFNtU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXRMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50VGFibGV0OiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50TW9iaWxlTGdTaXplOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLm1vYmlsZUxnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlU2l6ZSAtIDF9cHgpYClcbiAgICB9O1xuXG4gICAgJC5leHRlbmQodHJ1ZSwgZ2xvYmFsT3B0aW9ucywgYnJlYWtwb2ludHMpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICBpZiAoJCgndGV4dGFyZWEnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhdXRvc2l6ZSgkKCd0ZXh0YXJlYScpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog0J/QvtC00LrQu9GO0YfQtdC90LjQtSBqcyBwYXJ0aWFsc1xuICAgICAqL1xuICAgIC8qKlxuICog0KDQsNGB0YjQuNGA0LXQvdC40LUgYW5pbWF0ZS5jc3NcbiAqIEBwYXJhbSAge1N0cmluZ30gYW5pbWF0aW9uTmFtZSDQvdCw0LfQstCw0L3QuNC1INCw0L3QuNC80LDRhtC40LhcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayDRhNGD0L3QutGG0LjRjywg0LrQvtGC0L7RgNCw0Y8g0L7RgtGA0LDQsdC+0YLQsNC10YIg0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XG4gKiBAcmV0dXJuIHtPYmplY3R9INC+0LHRitC10LrRgiDQsNC90LjQvNCw0YbQuNC4XG4gKlxuICogQHNlZSAgaHR0cHM6Ly9kYW5lZGVuLmdpdGh1Yi5pby9hbmltYXRlLmNzcy9cbiAqXG4gKiBAZXhhbXBsZVxuICogJCgnI3lvdXJFbGVtZW50JykuYW5pbWF0ZUNzcygnYm91bmNlJyk7XG4gKlxuICogJCgnI3lvdXJFbGVtZW50JykuYW5pbWF0ZUNzcygnYm91bmNlJywgZnVuY3Rpb24oKSB7XG4gKiAgICAgLy8g0JTQtdC70LDQtdC8INGH0YLQvi3RgtC+INC/0L7RgdC70LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxuICogfSk7XG4gKi9cbiQuZm4uZXh0ZW5kKHtcbiAgICBhbmltYXRlQ3NzOiBmdW5jdGlvbihhbmltYXRpb25OYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYW5pbWF0aW9uRW5kID0gKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdhbmltYXRpb25lbmQnLFxuICAgICAgICAgICAgICAgIE9BbmltYXRpb246ICdvQW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICBNb3pBbmltYXRpb246ICdtb3pBbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgICAgIFdlYmtpdEFuaW1hdGlvbjogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmb3IgKGxldCB0IGluIGFuaW1hdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uc1t0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcblxuICAgICAgICB0aGlzLmFkZENsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSkub25lKGFuaW1hdGlvbkVuZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG59KTtcblxuICAgIC8vINCd0LXQsdC+0LvRjNGI0LjQtSDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0LUg0YTRg9C90LrRhtC40LhcblxuICAgIC8qKlxuICAgICAqINCf0YDQvtCy0LXRgNGP0LXRgiDRh9C40YHQu9C+INC40LvQuCDQvdC10YJcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gbiDQm9GO0LHQvtC5INCw0YDQs9GD0LzQtdC90YJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWVyaWMobikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCj0LTQsNC70Y/QtdGCINCy0YHQtSDQvdC10YfQuNGB0LvQvtCy0YvQtSDRgdC40LzQstC+0LvRiyDQuCDQv9GA0LjQstC+0LTQuNGCINC6INGH0LjRgdC70YNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyfG51bWJlcn0gcGFyYW1cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlbW92ZU5vdERpZ2l0cyhwYXJhbSkge1xuICAgICAgICAvKiDRg9C00LDQu9GP0LXQvCDQstGB0LUg0YHQuNC80LLQvtC70Ysg0LrRgNC+0LzQtSDRhtC40YTRgCDQuCDQv9C10YDQtdCy0L7QtNC40Lwg0LIg0YfQuNGB0LvQviAqL1xuICAgICAgICByZXR1cm4gK3BhcmFtLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQoNCw0LfQtNC10LvRj9C10YIg0L3QsCDRgNCw0LfRgNGP0LTRi1xuICAgICAqINCd0LDQv9GA0LjQvNC10YAsIDM4MDAwMDAgLT4gMyA4MDAgMDAwXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cnxudW1iZXJ9IHBhcmFtXG4gICAgICogQHJldHVybnMge3N0cn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaXZpZGVCeURpZ2l0cyhwYXJhbSkge1xuICAgICAgICBpZiAocGFyYW0gPT09IG51bGwpIHBhcmFtID0gMDtcbiAgICAgICAgcmV0dXJuIHBhcmFtLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCkoPz0oXFxkXFxkXFxkKSsoW15cXGRdfCQpKS9nLCAnJDEgJyk7XG4gICAgfVxuXG4gICAgdmFyIGxvY2FsZSA9IGdsb2JhbE9wdGlvbnMubGFuZyA9PSAncnUtUlUnID8gJ3J1JyA6ICdlbic7XG5cbiAgICBQYXJzbGV5LnNldExvY2FsZShsb2NhbGUpO1xuXG4gICAgLyog0J3QsNGB0YLRgNC+0LnQutC4IFBhcnNsZXkgKi9cbiAgICAkLmV4dGVuZChQYXJzbGV5Lm9wdGlvbnMsIHtcbiAgICAgICAgdHJpZ2dlcjogJ2JsdXIgY2hhbmdlJywgLy8gY2hhbmdlINC90YPQttC10L0g0LTQu9GPIHNlbGVjdCfQsFxuICAgICAgICB2YWxpZGF0aW9uVGhyZXNob2xkOiAnMCcsXG4gICAgICAgIGVycm9yc1dyYXBwZXI6ICc8ZGl2PjwvZGl2PicsXG4gICAgICAgIGVycm9yVGVtcGxhdGU6ICc8cCBjbGFzcz1cInBhcnNsZXktZXJyb3ItbWVzc2FnZVwiPjwvcD4nLFxuICAgICAgICBjbGFzc0hhbmRsZXI6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xuICAgICAgICAgICAgbGV0IHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXG4gICAgICAgICAgICAgICAgJGhhbmRsZXI7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJGVsZW1lbnQ7IC8vINGC0L4g0LXRgdGC0Ywg0L3QuNGH0LXQs9C+INC90LUg0LLRi9C00LXQu9GP0LXQvCAoaW5wdXQg0YHQutGA0YvRgiksINC40L3QsNGH0LUg0LLRi9C00LXQu9GP0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0LHQu9C+0LpcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJCgnLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUnLCAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICRoYW5kbGVyO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcnNDb250YWluZXI6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xuICAgICAgICAgICAgbGV0IHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lcjtcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJChgW25hbWU9XCIkeyRlbGVtZW50LmF0dHIoJ25hbWUnKX1cIl06bGFzdCArIGxhYmVsYCkubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIC5wYXJlbnQoKVxuICAgICAgICAgICAgICAgICAgICAubmV4dCgnLmctcmVjYXB0Y2hhJylcbiAgICAgICAgICAgICAgICAgICAgLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmZpZWxkJyk7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJGNvbnRhaW5lcilcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgcmV0dXJuICRjb250YWluZXI7XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQmtCw0YHRgtC+0LzQvdGL0LUg0LLQsNC70LjQtNCw0YLQvtGA0YtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZVJ1Jywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRXFwtIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWVFbicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosIFwiIFwiLCBcIi1cIicsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0LvQsNGC0LjQvdGB0LrQuNC1INC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIicsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0Ysg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXJSdScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bMC050LAt0Y/RkV0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLINCQLdCvLCDQsC3RjywgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzINCQLdCvLCDQsC3RjywgMC05JyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLLCDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXInLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXowLTldKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05JyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCi0LXQu9C10YTQvtC90L3Ri9C5INC90L7QvNC10YBcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcigncGhvbmUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eWy0rMC05KCkgXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDRgtC10LvQtdGE0L7QvdC90YvQuSDQvdC+0LzQtdGAJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IHBob25lIG51bWJlcicsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1iZXInLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eWzAtOV0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIDAtOScsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyAwLTknLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0J/QvtGH0YLQsCDQsdC10Lcg0LrQuNGA0LjQu9C70LjRhtGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2VtYWlsJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXihbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0oXFwufF98LSl7MCwxfSkrW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dXFxAKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSkrKChcXC4pezAsMX1bQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pezEsfVxcLlthLXrQsC3RjzAtOVxcLV17Mix9JC8udGVzdChcbiAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INC/0L7Rh9GC0L7QstGL0Lkg0LDQtNGA0LXRgScsXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBlbWFpbCBhZGRyZXNzJyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCk0L7RgNC80LDRgiDQtNCw0YLRiyBERC5NTS5ZWVlZXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2RhdGUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgbGV0IHJlZ1Rlc3QgPSAvXig/Oig/OjMxKFxcLikoPzowP1sxMzU3OF18MVswMl0pKVxcMXwoPzooPzoyOXwzMCkoXFwuKSg/OjA/WzEsMy05XXwxWzAtMl0pXFwyKSkoPzooPzoxWzYtOV18WzItOV1cXGQpP1xcZHsyfSkkfF4oPzoyOShcXC4pMD8yXFwzKD86KD86KD86MVs2LTldfFsyLTldXFxkKT8oPzowWzQ4XXxbMjQ2OF1bMDQ4XXxbMTM1NzldWzI2XSl8KD86KD86MTZ8WzI0NjhdWzA0OF18WzM1NzldWzI2XSkwMCkpKSkkfF4oPzowP1sxLTldfDFcXGR8MlswLThdKShcXC4pKD86KD86MD9bMS05XSl8KD86MVswLTJdKSlcXDQoPzooPzoxWzYtOV18WzItOV1cXGQpP1xcZHs0fSkkLyxcbiAgICAgICAgICAgICAgICByZWdNYXRjaCA9IC8oXFxkezEsMn0pXFwuKFxcZHsxLDJ9KVxcLihcXGR7NH0pLyxcbiAgICAgICAgICAgICAgICBtaW4gPSBhcmd1bWVudHNbMl0uJGVsZW1lbnQuZGF0YSgnZGF0ZU1pbicpLFxuICAgICAgICAgICAgICAgIG1heCA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWF4JyksXG4gICAgICAgICAgICAgICAgbWluRGF0ZSxcbiAgICAgICAgICAgICAgICBtYXhEYXRlLFxuICAgICAgICAgICAgICAgIHZhbHVlRGF0ZSxcbiAgICAgICAgICAgICAgICByZXN1bHQ7XG5cbiAgICAgICAgICAgIGlmIChtaW4gJiYgKHJlc3VsdCA9IG1pbi5tYXRjaChyZWdNYXRjaCkpKSB7XG4gICAgICAgICAgICAgICAgbWluRGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1heCAmJiAocmVzdWx0ID0gbWF4Lm1hdGNoKHJlZ01hdGNoKSkpIHtcbiAgICAgICAgICAgICAgICBtYXhEYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHJlc3VsdCA9IHZhbHVlLm1hdGNoKHJlZ01hdGNoKSkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZURhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICByZWdUZXN0LnRlc3QodmFsdWUpICYmIChtaW5EYXRlID8gdmFsdWVEYXRlID49IG1pbkRhdGUgOiB0cnVlKSAmJiAobWF4RGF0ZSA/IHZhbHVlRGF0ZSA8PSBtYXhEYXRlIDogdHJ1ZSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90LDRjyDQtNCw0YLQsCcsXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBkYXRlJyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCk0LDQudC7INC+0LPRgNCw0L3QuNGH0LXQvdC90L7Qs9C+INGA0LDQt9C80LXRgNCwXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2ZpbGVNYXhTaXplJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIG1heFNpemUsIHBhcnNsZXlJbnN0YW5jZSkge1xuICAgICAgICAgICAgbGV0IGZpbGVzID0gcGFyc2xleUluc3RhbmNlLiRlbGVtZW50WzBdLmZpbGVzO1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVzLmxlbmd0aCAhPSAxIHx8IGZpbGVzWzBdLnNpemUgPD0gbWF4U2l6ZSAqIDEwMjQ7XG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVtZW50VHlwZTogJ2ludGVnZXInLFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQpNCw0LnQuyDQtNC+0LvQttC10L0g0LLQtdGB0LjRgtGMINC90LUg0LHQvtC70LXQtSwg0YfQtdC8ICVzIEtiJyxcbiAgICAgICAgICAgIGVuOiBcIkZpbGUgc2l6ZSBjYW4ndCBiZSBtb3JlIHRoZW4gJXMgS2JcIixcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCe0LPRgNCw0L3QuNGH0LXQvdC40Y8g0YDQsNGB0YjQuNGA0LXQvdC40Lkg0YTQsNC50LvQvtCyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2ZpbGVFeHRlbnNpb24nLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgZm9ybWF0cykge1xuICAgICAgICAgICAgbGV0IGZpbGVFeHRlbnNpb24gPSB2YWx1ZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICAgICAgbGV0IGZvcm1hdHNBcnIgPSBmb3JtYXRzLnNwbGl0KCcsICcpO1xuICAgICAgICAgICAgbGV0IHZhbGlkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9ybWF0c0Fyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlRXh0ZW5zaW9uID09PSBmb3JtYXRzQXJyW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9CU0L7Qv9GD0YHRgtC40LzRiyDRgtC+0LvRjNC60L4g0YTQsNC50LvRiyDRhNC+0YDQvNCw0YLQsCAlcycsXG4gICAgICAgICAgICBlbjogJ0F2YWlsYWJsZSBleHRlbnNpb25zIGFyZSAlcycsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQodC+0LfQtNCw0ZHRgiDQutC+0L3RgtC10LnQvdC10YDRiyDQtNC70Y8g0L7RiNC40LHQvtC6INGDINC90LXRgtC40L/QuNGH0L3Ri9GFINGN0LvQtdC80LXQvdGC0L7QslxuICAgIFBhcnNsZXkub24oJ2ZpZWxkOmluaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gdGhpcy4kZWxlbWVudCxcbiAgICAgICAgICAgIHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXG4gICAgICAgICAgICAkYmxvY2sgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygnZXJyb3JzLXBsYWNlbWVudCcpLFxuICAgICAgICAgICAgJGxhc3Q7XG5cbiAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJChgW25hbWU9XCIkeyRlbGVtZW50LmF0dHIoJ25hbWUnKX1cIl06bGFzdCArIGxhYmVsYCk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJyk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdmaWxlJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5jbG9zZXN0KCcuY3VzdG9tLWZpbGUnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJyk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5hdHRyKCduYW1lJykgPT0gJ2lzX3JlY2FwdGNoYV9zdWNjZXNzJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5wYXJlbnQoKS5uZXh0KCcuZy1yZWNhcHRjaGEnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQmNC90LjRhtC40LjRgNGD0LXRgiDQstCw0LvQuNC00LDRhtC40Y4g0L3QsCDQstGC0L7RgNC+0Lwg0LrQsNC70LXQtNCw0YDQvdC+0Lwg0L/QvtC70LUg0LTQuNCw0L/QsNC30L7QvdCwXG4gICAgUGFyc2xleS5vbignZmllbGQ6dmFsaWRhdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCAkZWxlbWVudCA9ICQodGhpcy5lbGVtZW50KTtcbiAgICB9KTtcblxuICAgICQoJ2Zvcm1bZGF0YS12YWxpZGF0ZT1cInRydWVcIl0nKS5wYXJzbGV5KCk7XG5cbiAgICAvLyDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0YLQvtC70YzQutC+INC90LAg0YHRgtGA0LDQvdC40YbQtSBjaGVja291dC5odG1sXG4gICAgaWYgKCQoJy5qcy1jb2xsYXBzZS1idG4nKS5sZW5ndGgpIHtcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1jb2xsYXBzZS1idG4nLCBlID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRzZWxmID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgICAgY29uc3QgJGNvbGxhcHNlQm9keSA9ICRzZWxmLmNsb3Nlc3QoJy5qcy1jb2xsYXBzZScpLmZpbmQoJy5qcy1jb2xsYXBzZS1ib2R5Jyk7XG4gICAgICAgICAgICBpZiAoJHNlbGYuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgJHNlbGYucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRjb2xsYXBzZUJvZHkuc2xpZGVVcCgnZmFzdCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkc2VsZi5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJGNvbGxhcHNlQm9keS5zbGlkZURvd24oJ2Zhc3QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JTQvtCx0LDQstC70Y/QtdGCINC80LDRgdC60Lgg0LIg0L/QvtC70Y8g0YTQvtGA0LxcbiAgICAgKiBAc2VlICBodHRwczovL2dpdGh1Yi5jb20vUm9iaW5IZXJib3RzL0lucHV0bWFza1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8aW5wdXQgY2xhc3M9XCJqcy1waG9uZS1tYXNrXCIgdHlwZT1cInRlbFwiIG5hbWU9XCJ0ZWxcIiBpZD1cInRlbFwiPlxuICAgICAqL1xuICAgICQoJy5qcy1waG9uZS1tYXNrJykuaW5wdXRtYXNrKCcrNyg5OTkpIDk5OS05OS05OScsIHtcbiAgICAgICAgY2xlYXJNYXNrT25Mb3N0Rm9jdXM6IHRydWUsXG4gICAgICAgIHNob3dNYXNrT25Ib3ZlcjogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDQodGC0LjQu9C40LfRg9C10YIg0YHQtdC70LXQutGC0Ysg0YEg0L/QvtC80L7RidGM0Y4g0L/Qu9Cw0LPQuNC90LAgc2VsZWN0MlxuICAgICAqIGh0dHBzOi8vc2VsZWN0Mi5naXRodWIuaW9cbiAgICAgKi9cbiAgICBsZXQgQ3VzdG9tU2VsZWN0ID0gZnVuY3Rpb24oJGVsZW0pIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uKCRpbml0RWxlbSkge1xuICAgICAgICAgICAgJGluaXRFbGVtLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdFNlYXJjaCA9ICQodGhpcykuZGF0YSgnc2VhcmNoJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0U2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IDE7IC8vINC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBJbmZpbml0eTsgLy8g0L3QtSDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogbWluaW11bVJlc3VsdHNGb3JTZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub1Jlc3VsdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ9Ch0L7QstC/0LDQtNC10L3QuNC5INC90LUg0L3QsNC50LTQtdC90L4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQvdGD0LbQvdC+INC00LvRjyDQstGL0LvQuNC00LDRhtC40Lgg0L3QsCDQu9C10YLRg1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKGBvcHRpb25bdmFsdWU9XCIkeyQodGhpcykudmFsdWV9XCJdYClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi51cGRhdGUgPSBmdW5jdGlvbigkdXBkYXRlRWxlbSkge1xuICAgICAgICAgICAgJHVwZGF0ZUVsZW0uc2VsZWN0MignZGVzdHJveScpO1xuICAgICAgICAgICAgc2VsZi5pbml0KCR1cGRhdGVFbGVtKTtcbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLmluaXQoJGVsZW0pO1xuICAgIH07XG5cbiAgICB2YXIgY3VzdG9tU2VsZWN0ID0gbmV3IEN1c3RvbVNlbGVjdCgkKCdzZWxlY3QnKSk7XG5cbiAgICBjb25zdCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIGRhdGVGb3JtYXQ6ICdkZC5tbS55eScsXG4gICAgICAgIHNob3dPdGhlck1vbnRoczogdHJ1ZSxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog0JTQtdC70LDQtdGCINCy0YvQv9Cw0LTRjtGJ0LjQtSDQutCw0LvQtdC90LTQsNGA0LjQutC4XG4gICAgICogQHNlZSAgaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vZGF0ZXBpY2tlci9cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8g0LIgZGF0YS1kYXRlLW1pbiDQuCBkYXRhLWRhdGUtbWF4INC80L7QttC90L4g0LfQsNC00LDRgtGMINC00LDRgtGDINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXlcbiAgICAgKiA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZGF0ZUlucHV0XCIgaWQ9XCJcIiBjbGFzcz1cImpzLWRhdGVwaWNrZXJcIiBkYXRhLWRhdGUtbWluPVwiMDYuMTEuMjAxNVwiIGRhdGEtZGF0ZS1tYXg9XCIxMC4xMi4yMDE1XCI+XG4gICAgICovXG4gICAgbGV0IERhdGVwaWNrZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgZGF0ZXBpY2tlciA9ICQoJy5qcy1kYXRlcGlja2VyJyk7XG5cbiAgICAgICAgZGF0ZXBpY2tlci5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IG1pbkRhdGUgPSAkKHRoaXMpLmRhdGEoJ2RhdGUtbWluJyk7XG4gICAgICAgICAgICBsZXQgbWF4RGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1tYXgnKTtcbiAgICAgICAgICAgIGNvbnN0IHNob3dNWSA9ICQodGhpcykuZGF0YSgnc2hvdy1tLXknKTtcblxuICAgICAgICAgICAgLyog0LXRgdC70Lgg0LIg0LDRgtGA0LjQsdGD0YLQtSDRg9C60LDQt9Cw0L3QviBjdXJyZW50LCDRgtC+INCy0YvQstC+0LTQuNC8INGC0LXQutGD0YnRg9GOINC00LDRgtGDICovXG4gICAgICAgICAgICBpZiAobWF4RGF0ZSA9PT0gJ2N1cnJlbnQnIHx8IG1pbkRhdGUgPT09ICdjdXJyZW50Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudERheSA9IGN1cnJlbnREYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF5IDwgMTAgPyAoY3VycmVudERheSA9ICcwJyArIGN1cnJlbnREYXkudG9TdHJpbmcoKSkgOiBjdXJyZW50RGF5O1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0RhdGUgPSBjdXJyZW50RGF5ICsgJy4nICsgKGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKSArICcuJyArIGN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICAgICAgbWF4RGF0ZSA9PT0gJ2N1cnJlbnQnID8gKG1heERhdGUgPSBuZXdEYXRlKSA6IChtaW5EYXRlID0gbmV3RGF0ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpdGVtT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlOiBtaW5EYXRlIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbWF4RGF0ZSB8fCBudWxsLFxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNsb3Nlc3QoJy5maWVsZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoc2hvd01ZKSB7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ2NoYW5nZVllYXInXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ3llYXJSYW5nZSddID0gJ2MtMTAwOmMnO1xuICAgICAgICAgICAgICAgIGl0ZW1PcHRpb25zWydjaGFuZ2VNb250aCddID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgaXRlbU9wdGlvbnMsIGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyk7XG5cbiAgICAgICAgICAgICQodGhpcykuZGF0ZXBpY2tlcihpdGVtT3B0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vINC00LXQu9Cw0LXQvCDQutGA0LDRgdC40LLRi9C8INGB0LXQu9C10Log0LzQtdGB0Y/RhtCwINC4INCz0L7QtNCwXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdmb2N1cycsICcuanMtZGF0ZXBpY2tlcicsICgpID0+IHtcbiAgICAgICAgICAgIC8vINC40YHQv9C+0LvRjNC30YPQtdC8INC30LDQtNC10YDQttC60YMsINGH0YLQvtCx0Ysg0LTQtdC50YLQv9C40LrQtdGAINGD0YHQv9C10Lsg0LjQvdC40YbQuNCw0LvQuNC30LjRgNC+0LLQsNGC0YzRgdGPXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoJCgnLnVpLWRhdGVwaWNrZXInKS5maW5kKCdzZWxlY3QnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnVpLWRhdGVwaWNrZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ3NlbGVjdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0T25CbHVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duQ3NzQ2xhc3M6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgbGV0IGRhdGVwaWNrZXIgPSBuZXcgRGF0ZXBpY2tlcigpO1xuXG4gICAgY29uc3QgJG1vYmlsZU1lbnUgPSAkKCcuanMtbW9iaWxlLW1lbnUnKTtcbiAgICBjb25zdCAkY2FydE1vZGFsID0gJCgnLmpzLWNhcnQtbW9kYWwnKTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtbWVudS1idG4nLCAoKSA9PiB7XG4gICAgICAgIG9wZW5Nb2RhbCgkbW9iaWxlTWVudSk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLW1lbnUtY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgIGhpZGVNb2RhbCgkbW9iaWxlTWVudSk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNhcnQtYnRuJywgZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgb3Blbk1vZGFsKCRjYXJ0TW9kYWwpO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1jYXJ0LWNsb3NlJywgKCkgPT4ge1xuICAgICAgICBoaWRlTW9kYWwoJGNhcnRNb2RhbCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBPcGVuIG1vZGFsIGJsb2NrXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRtb2RhbEJsb2NrIE1vZGFsIGJsb2NrXG4gICAgICovXG4gICAgZnVuY3Rpb24gb3Blbk1vZGFsKCRtb2RhbEJsb2NrKSB7XG4gICAgICAgICRtb2RhbEJsb2NrLmFkZENsYXNzKCdpcy1hY3RpdmUnKS5hbmltYXRlQ3NzKCdzbGlkZUluUmlnaHQnKTtcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoYXMtb3ZlcmxheScpO1xuICAgICAgICBsb2NrRG9jdW1lbnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIaWRlIG1vZGFsIGJsb2NrXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRtb2RhbEJsb2NrIE1vZGFsIGJsb2NrXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGlkZU1vZGFsKCRtb2RhbEJsb2NrKSB7XG4gICAgICAgICRtb2RhbEJsb2NrLmFuaW1hdGVDc3MoJ3NsaWRlT3V0UmlnaHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAkbW9kYWxCbG9jay5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgICAgICB1bmxvY2tEb2N1bWVudCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbmxvY2sgZG9jdW1lbnQgZm9yIHNjcm9sbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVubG9ja0RvY3VtZW50KCkge1xuICAgICAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ2lzLWxvY2tlZCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvY2sgZG9jdW1lbnQgZm9yIHNjcm9sbFxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkbG9ja0Jsb2NrIEJsb2NrIHdoaWNoIGRlZmluZSBkb2N1bWVudCBoZWlnaHRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2NrRG9jdW1lbnQoKSB7XG4gICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtbG9ja2VkJyk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tINC70L7Qs9C40LrQsCDQvtGC0LrRgNGL0YLQuNGPINCy0YvQv9Cw0LTQsNGI0LXQuiDRhdC10LTQtdGA0LAgLS0tLS0tXG4gICAgY29uc3QgJGhlYWRlciA9ICQoJy5qcy1oZWFkZXInKTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZW92ZXInLCAnLmpzLWhlYWRlci1kcm9wZG93bi1idG4nLCBlID0+IHtcbiAgICAgICAgY29uc3QgJHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IGNhdGVnb3J5ID0gJHNlbGYuYXR0cignZGF0YS1jYXRlZ29yeScpO1xuICAgICAgICAkKCcuanMtaGVhZGVyLWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdoYXMtb3ZlcmxheScpO1xuICAgICAgICBpZiAoY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgIGNvbnN0ICRjYXRlZ29yeURyb3Bkb3duID0gJChgW2RhdGEtZHJvcGRvd24tY2F0ZWdvcnk9JyR7Y2F0ZWdvcnl9J11gKTtcbiAgICAgICAgICAgICRjYXRlZ29yeURyb3Bkb3duLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICRoZWFkZXIuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoYXMtb3ZlcmxheScpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignbW91c2VsZWF2ZScsICcuanMtaGVhZGVyLWRyb3Bkb3duJywgZSA9PiB7XG4gICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICRoZWFkZXIucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgfSk7XG5cbiAgICAvLyDQvdC10LzQvdC+0LPQviDRgdC/0LXRhtC40YTQuNGH0L3Ri9C1INGC0LDQsdGLLiDQmNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8g0L3QsCDRgdGC0YDQsNC90LjRhtC1IGNoZWNrb3V0Lmh0bWwuINCf0YDQuCDQttC10LvQsNC90LjQuCDQvNC+0LbQvdC+INC00L7RgNCw0LHQvtGC0LDRgtGMXG5cbiAgICBpZiAoJCgnLmpzLXRhYnMtbGluaycpLmxlbmd0aCkge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLXRhYnMtbGluaycsIGUgPT4ge1xuICAgICAgICAgICAgLy8gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgJHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCk7XG5cbiAgICAgICAgICAgIGlmICgkc2VsZi5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgJHRhYnMgPSAkc2VsZi5jbG9zZXN0KCcuanMtdGFicycpO1xuICAgICAgICAgICAgY29uc3QgJHRhYnNMaW5rcyA9ICR0YWJzLmZpbmQoJy5qcy10YWJzLWxpbmsnKTtcbiAgICAgICAgICAgIGNvbnN0ICR0YWJzSXRlbXMgPSAkdGFicy5maW5kKCcuanMtdGFicy1pdGVtJyk7XG5cbiAgICAgICAgICAgIC8vINCy0YvQutC70Y7Rh9Cw0LXQvCDQstGB0LUg0LDQutGC0LjQstC90YvQtSDRgtCw0LHRiyDQuCDRgdGB0YvQu9C60LhcbiAgICAgICAgICAgICR0YWJzTGlua3MucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJHRhYnNJdGVtcy5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIC8vINCy0YvQutC70Y7Rh9Cw0LXQvCDQstCw0LvQuNC00LDRhtC40Y4g0YMg0YHQutGA0YvRgtGL0YUg0L/QvtC70LXQuSDQuCDQvtGH0LjRidCw0LXQvCDQuNGFXG4gICAgICAgICAgICBsZXQgJGhpZGRlbkZvcm1GaWVsZHMgPSAkdGFic0l0ZW1zLmZpbmQoJ1tkYXRhLXJlcXVpcmVkXScpO1xuICAgICAgICAgICAgaWYgKCRoaWRkZW5Gb3JtRmllbGRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRoaWRkZW5Gb3JtRmllbGRzLnByb3AoJ2RhdGEtcmVxdWlyZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgncmVxdWlyZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMudmFsKCcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0LLQutC70Y7Rh9Cw0LXQvCDQvdGD0LbQvdGL0Lkg0YLQsNCxINC4INC00LXQu9Cw0LXQvCDQvdGD0LbQvdGD0Y4g0YHRgdGL0LvQutGDINCw0LrRgtC40LLQvdC+0LlcbiAgICAgICAgICAgICRzZWxmLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIGNvbnN0ICRzZWxmSXRlbSA9ICQoJHNlbGYuZGF0YSgndGFiJykpO1xuICAgICAgICAgICAgJHNlbGZJdGVtLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8g0LLQutC70Y7Rh9Cw0LXQvCDQstCw0LvQuNC00LDRhtC40Y4g0YMg0YHQutGA0YvRgtGL0YUg0L/QvtC70LXQuVxuICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMgPSAkc2VsZkl0ZW0uZmluZCgnW2RhdGEtcmVxdWlyZWRdJyk7XG4gICAgICAgICAgICBpZiAoJGhpZGRlbkZvcm1GaWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgnZGF0YS1yZXF1aXJlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICRoaWRkZW5Gb3JtRmllbGRzLnByb3AoJ3JlcXVpcmVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICAg0JDQutGC0LjQstC40YDQvtCy0LDRgtGML9C00LXQt9Cw0LrRgtC40LLQuNGA0L7QstCw0YLRjCDRgdC/0LjQvdC90LXRgFxuICAgICAqICAgY29uc3QgJGJsb2NrID0gJCgnLnNwaW5uZXInKTtcbiAgICAgKiAgIGNvbnN0IHNwaW5uZXIgPSBTcGlubmVyLmdldEluc3RhbmNlKCRibG9jayk7XG4gICAgICogICBzcGlubmVyLmVuYWJsZVNwaW5uZXIoKTsvc3Bpbm5lci5kaXNhYmxlU3Bpbm5lcigpO1xuICAgICAqXG4gICAgICovXG5cbiAgICBjbGFzcyBTcGlubmVyIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gIG9wdGlvbnMgICAgICAgICAgICAgICAgICAg0J7QsdGK0LXQutGCINGBINC/0LDRgNCw0LzQtdGC0YDQsNC80LguXG4gICAgICAgICAqIEBwYXJhbSAge2pRdWVyeX0gIG9wdGlvbnMuJGJsb2NrICAgICAgICAgICAg0KjQsNCx0LvQvtC9LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy52YWx1ZSA9IDBdICAgICAgINCd0LDRh9Cw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5taW4gPSAtSW5maW5pdHldINCc0LjQvdC40LzQsNC70YzQvdC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMubWF4ID0gSW5maW5pdHldICDQnNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMuc3RlcCA9IDFdICAgICAgICDQqNCw0LMuXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLnByZWNpc2lvbl0gICAgICAg0KLQvtGH0L3QvtGB0YLRjCAo0L3Rg9C20L3QsCDQtNC70Y8g0LTQtdGB0Y/RgtC40YfQvdC+0LPQviDRiNCw0LPQsCkuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3Rvcih7ICRibG9jaywgdmFsdWUgPSAwLCBtaW4gPSAtSW5maW5pdHksIG1heCA9IEluZmluaXR5LCBzdGVwID0gMSwgcHJlY2lzaW9uIH0gPSB7fSkge1xuICAgICAgICAgICAgdGhpcy4kYmxvY2sgPSAkYmxvY2s7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzID0ge1xuICAgICAgICAgICAgICAgICRkZWM6ICQoJy5zcGlubmVyX19idG4tLWRlYycsIHRoaXMuJGJsb2NrKSxcbiAgICAgICAgICAgICAgICAkaW5jOiAkKCcuc3Bpbm5lcl9fYnRuLS1pbmMnLCB0aGlzLiRibG9jayksXG4gICAgICAgICAgICAgICAgJGlucHV0OiAkKCcuc3Bpbm5lcl9faW5wdXQnLCB0aGlzLiRibG9jayksXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gK3ZhbHVlO1xuICAgICAgICAgICAgdGhpcy5taW4gPSArbWluO1xuICAgICAgICAgICAgdGhpcy5tYXggPSArbWF4O1xuICAgICAgICAgICAgdGhpcy5zdGVwID0gK3N0ZXA7XG4gICAgICAgICAgICB0aGlzLnByZWNpc2lvbiA9ICtwcmVjaXNpb247XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0J/RgNC40LLQvtC00LjRgiDRgNCw0LfQvNC10YLQutGDINCyINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjQtSDQv9Cw0YDQsNC80LXRgtGA0LDQvC5cbiAgICAgICAgICovXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0YHQvtGB0YLQvtGP0L3QuNC1INCx0LvQvtC60LjRgNC+0LLQutC4INC60L3QvtC/0L7Qui5cbiAgICAgICAgICovXG4gICAgICAgIHVwZGF0ZUJ1dHRvbnMoKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRkZWMucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbmMucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlIDwgdGhpcy5taW4gKyB0aGlzLnN0ZXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRkZWMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPiB0aGlzLm1heCAtIHRoaXMuc3RlcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGluYy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCe0YLQutC70Y7Rh9C10L3QuNC1INGB0L/QuNC90L3QtdGA0LAuXG4gICAgICAgICAqL1xuICAgICAgICBkaXNhYmxlU3Bpbm5lcigpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGRlYy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5jLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbnB1dC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2suYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0JLQutC70Y7Rh9C10L3QuNC1INGB0L/QuNC90L3QtdGA0LAuXG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVTcGlubmVyKCkge1xuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbnB1dC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQt9C90LDRh9C10L3QuNC1INGB0YfRkdGC0YfQuNC60LAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VWYWx1ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2suYXR0cignZGF0YS12YWx1ZScsIHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LmF0dHIoJ3ZhbHVlJywgdmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQnNC10L3Rj9C10YIg0LfQvdCw0YfQtdC90LjQtSDQvNC40L3QuNC80YPQvNCwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IHZhbHVlINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICovXG4gICAgICAgIGNoYW5nZU1pbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5taW4gPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLmF0dHIoJ2RhdGEtbWluJywgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCc0LXQvdGP0LXRgiDQt9C90LDRh9C10L3QuNC1INC80LDQutGB0LjQvNGD0LzQsC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSB2YWx1ZSDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VNYXgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMubWF4ID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hdHRyKCdkYXRhLW1heCcsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQnNCw0YHRgdC40LIg0YHQvtC30LTQsNC90L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgaW5zdGFuY2VzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCd0LDRhdC+0LTQuNGCINC+0LHRitC10LrRgiDQutC70LDRgdGB0LAg0L/QviDRiNCw0LHQu9C+0L3Rgy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7alF1ZXJ5fSAkYmxvY2sg0KjQsNCx0LvQvtC9LlxuICAgICAgICAgKiBAcmV0dXJuIHtTcGlubmVyfSAgICAgICDQntCx0YrQtdC60YIuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoJGJsb2NrKSB7XG4gICAgICAgICAgICByZXR1cm4gU3Bpbm5lci5pbnN0YW5jZXMuZmluZChzcGlubmVyID0+IHNwaW5uZXIuJGJsb2NrLmlzKCRibG9jaykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCh0L7Qt9C00LDRkdGCINC+0LHRitC10LrRgtGLINC/0L4g0YjQsNCx0LvQvtC90LDQvC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9IFskc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpXSDQqNCw0LHQu9C+0L3Riy5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyBjcmVhdGUoJHNwaW5uZXJzID0gJCgnLnNwaW5uZXInKSkge1xuICAgICAgICAgICAgJHNwaW5uZXJzLmVhY2goKGluZGV4LCBibG9jaykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRibG9jayA9ICQoYmxvY2spO1xuXG4gICAgICAgICAgICAgICAgaWYgKFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3Bpbm5lciA9IG5ldyBTcGlubmVyKHtcbiAgICAgICAgICAgICAgICAgICAgJGJsb2NrLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJGJsb2NrLmF0dHIoJ2RhdGEtdmFsdWUnKSxcbiAgICAgICAgICAgICAgICAgICAgbWluOiAkYmxvY2suYXR0cignZGF0YS1taW4nKSxcbiAgICAgICAgICAgICAgICAgICAgbWF4OiAkYmxvY2suYXR0cignZGF0YS1tYXgnKSxcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogJGJsb2NrLmF0dHIoJ2RhdGEtc3RlcCcpLFxuICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb246ICRibG9jay5hdHRyKCdkYXRhLXByZWNpc2lvbicpLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJGJsb2NrLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpID8gc3Bpbm5lci5kaXNhYmxlU3Bpbm5lcigpIDogc3Bpbm5lci5pbml0KCk7XG5cbiAgICAgICAgICAgICAgICBTcGlubmVyLmluc3RhbmNlcy5wdXNoKHNwaW5uZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0KPQtNCw0LvRj9C10YIg0L7QsdGK0LXQutGC0Ysg0L/QviDRiNCw0LHQu9C+0L3QsNC8LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gWyRzcGlubmVycyA9ICQoJy5zcGlubmVyJyldINCo0LDQsdC70L7QvdGLLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIHJlbW92ZSgkc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpKSB7XG4gICAgICAgICAgICAkc3Bpbm5lcnMuZWFjaCgoaW5kZXgsIGJsb2NrKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGJsb2NrID0gJChibG9jayk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzcGlubmVySW5kZXggPSBTcGlubmVyLmluc3RhbmNlcy5maW5kSW5kZXgoc3Bpbm5lciA9PiBzcGlubmVyLiRibG9jay5pcygkYmxvY2spKTtcblxuICAgICAgICAgICAgICAgIFNwaW5uZXIuaW5zdGFuY2VzLnNwbGljZShzcGlubmVySW5kZXgsIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnNwaW5uZXJfX2J0bi0tZGVjJywgaGFuZGxlRGVjQ2xpY2spO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc3Bpbm5lcl9fYnRuLS1pbmMnLCBoYW5kbGVJbmNDbGljayk7XG4gICAgJChkb2N1bWVudCkub24oJ2lucHV0JywgJy5zcGlubmVyX19pbnB1dCcsIGhhbmRsZUlucHV0KTtcblxuICAgIC8qINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L/QuNC90L3QtdGA0L7QsiAqL1xuICAgIGxldCBzcGlubmVycyA9IFNwaW5uZXIuY3JlYXRlKCk7XG5cbiAgICAvKipcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQutC70LjQutCwINC/0L4g0LrQvdC+0L/QutC1INGD0LzQtdC90YzRiNC10L3QuNGPLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGUg0J7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZURlY0NsaWNrKGUpIHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VGFyZ2V0IH0gPSBlO1xuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChjdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgJGJsb2NrID0gJHRhcmdldC5jbG9zZXN0KCcuc3Bpbm5lcicpO1xuICAgICAgICBjb25zdCBzcGlubmVyID0gU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHNwaW5uZXIudmFsdWUgLSBzcGlubmVyLnN0ZXA7XG5cbiAgICAgICAgaWYgKHNwaW5uZXIucHJlY2lzaW9uKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUudG9GaXhlZChzcGlubmVyLnByZWNpc2lvbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Bpbm5lci5jaGFuZ2VWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgICAgc3Bpbm5lci51cGRhdGVCdXR0b25zKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0LrQu9C40LrQsCDQv9C+INC60L3QvtC/0LrQtSDRg9Cy0LXQu9C40YfQtdC90LjRjy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlINCe0LHRitC10LrRgiDRgdC+0LHRi9GC0LjRjy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYW5kbGVJbmNDbGljayhlKSB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudFRhcmdldCB9ID0gZTtcbiAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0ICRibG9jayA9ICR0YXJnZXQuY2xvc2VzdCgnLnNwaW5uZXInKTtcbiAgICAgICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBzcGlubmVyLnZhbHVlICsgc3Bpbm5lci5zdGVwO1xuXG4gICAgICAgIGlmIChzcGlubmVyLnByZWNpc2lvbikge1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlLnRvRml4ZWQoc3Bpbm5lci5wcmVjaXNpb24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW5uZXIuY2hhbmdlVmFsdWUodmFsdWUpO1xuXG4gICAgICAgIHNwaW5uZXIudXBkYXRlQnV0dG9ucygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INCy0LLQvtC00LAg0LIg0L/QvtC70LUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZSDQntCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFuZGxlSW5wdXQoZSkge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRUYXJnZXQgfSA9IGU7XG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCAkYmxvY2sgPSAkdGFyZ2V0LmNsb3Nlc3QoJy5zcGlubmVyJyk7XG4gICAgICAgIGNvbnN0IHNwaW5uZXIgPSBTcGlubmVyLmdldEluc3RhbmNlKCRibG9jayk7XG4gICAgICAgIGNvbnN0IHsgJGlucHV0IH0gPSBzcGlubmVyLmVsZW1lbnRzO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9ICskaW5wdXQudmFsKCk7XG5cbiAgICAgICAgaWYgKCEkaW5wdXQudmFsKCkubGVuZ3RoIHx8IHZhbHVlIDwgc3Bpbm5lci5taW4gfHwgdmFsdWUgPiBzcGlubmVyLm1heCkge1xuICAgICAgICAgICAgKHsgdmFsdWUgfSA9IHNwaW5uZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Bpbm5lci5jaGFuZ2VWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgICAgc3Bpbm5lci51cGRhdGVCdXR0b25zKCk7XG4gICAgfVxuXG4gICAgaW5pdENhcm91c2VscygpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBpbml0Q2Fyb3VzZWxzKTtcblxuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0LLRgdC1INC60LDRgNGD0YHQtdC70LhcbiAgICBmdW5jdGlvbiBpbml0Q2Fyb3VzZWxzKCkge1xuICAgICAgICAvLyAg0LrQsNGA0YPRgdC10LvRjCDQvdCwINC/0LXRgNCy0L7QvCDQsdCw0L3QvdC10YDQtSDQvdCwINCz0LvQsNCy0L3QvtC5INGB0YLRgNCw0L3QuNGG0LVcbiAgICAgICAgY29uc3QgJG5ld3NDYXJvdXNlbCA9ICQoJy5qcy1uZXdzLWNhcm91c2VsJyk7XG4gICAgICAgIGlmICgkbmV3c0Nhcm91c2VsLmxlbmd0aCAmJiAhJG5ld3NDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJG5ld3NDYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogMTAyMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiAndW5zbGljaycsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQv9C+0LTQsdC+0YDQsCDQsdCw0LnQutC+0LJcbiAgICAgICAgY29uc3QgJGJpa2VzQ2Fyb3VzZWwgPSAkKCcuanMtYmlrZXMtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRiaWtlc0Nhcm91c2VsLmxlbmd0aCAmJiAhJGJpa2VzQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRiaWtlc0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogJ3Vuc2xpY2snLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgYmlrZSBhZnRlciBpbml0XG4gICAgICAgICAgICAkYmlrZXNDYXJvdXNlbFxuICAgICAgICAgICAgICAgIC5maW5kKCcuc2xpY2stYWN0aXZlJylcbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXQnKVxuICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGJpa2UgYWZ0ZXIgY2hhbmdlXG4gICAgICAgICAgICAkYmlrZXNDYXJvdXNlbC5vbignYWZ0ZXJDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJGJpa2VzQ2Fyb3VzZWxcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXQnKVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC60LDRgtC10LPQvtGA0LjQuVxuICAgICAgICBjb25zdCAkY2F0ZWdvcmllc0Nhcm91c2VsID0gJCgnLmpzLWNhdGVnb3JpZXMtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRjYXRlZ29yaWVzQ2Fyb3VzZWwubGVuZ3RoICYmICEkY2F0ZWdvcmllc0Nhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkY2F0ZWdvcmllc0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnMCcsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiAndW5zbGljaycsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQvdCwINCz0LvQsNCy0L3QvtC5XG4gICAgICAgIGNvbnN0ICRpbmRleE1haW5DYXJvdXNlbCA9ICQoJy5qcy1pbmRleC1tYWluLWNhcm91c2VsJyk7XG4gICAgICAgIGlmICgkaW5kZXhNYWluQ2Fyb3VzZWwubGVuZ3RoICYmICEkaW5kZXhNYWluQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRpbmRleE1haW5DYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgY2VudGVyUGFkZGluZzogJzAnLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vINC60LDRgNGD0YHQtdC70Ywg0LrQsNGA0YLQuNC90L7QuiDRgtC+0LLQsNGA0LBcbiAgICAgICAgY29uc3QgJHByb2R1Y3RDYXJvdXNlbCA9ICQoJy5qcy1wcm9kdWN0LWNhcm91c2VsJyk7XG4gICAgICAgIGlmICgkcHJvZHVjdENhcm91c2VsLmxlbmd0aCAmJiAhJHByb2R1Y3RDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJHByb2R1Y3RDYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBwcmV2QXJyb3c6XG4gICAgICAgICAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1hcnJvdyBidG4tYXJyb3ctLXByZXYgcHJvZHVjdC1wYWdlX19jYXJvdXNlbC1wcmV2XCI+PHN2ZyBjbGFzcz1cImljb24gaWNvbi0tYXJyb3ctbmV4dFwiPjx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWFycm93X25leHRcIj48L3VzZT48L3N2Zz48L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgIG5leHRBcnJvdzpcbiAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWFycm93IHByb2R1Y3QtcGFnZV9fY2Fyb3VzZWwtbmV4dFwiPjxzdmcgY2xhc3M9XCJpY29uIGljb24tLWFycm93LW5leHRcIj48dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1hcnJvd19uZXh0XCI+PC91c2U+PC9zdmc+PC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC/0L7RhdC+0LbQuNGFINGC0L7QstCw0YDQvtCyXG4gICAgICAgIGNvbnN0ICRzaW1pbGFyQ2Fyb3VzZWwgPSAkKCcuanMtc2ltaWxhci1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJHNpbWlsYXJDYXJvdXNlbC5sZW5ndGggJiYgISRzaW1pbGFyQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRzaW1pbGFyQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICcwJyxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNjM5LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC60LDRgNGC0LjQvdC+0LpcbiAgICAgICAgY29uc3QgJHBpY3R1cmVDYXJvdXNlbCA9ICQoJy5qcy1waWN0dXJlLWNhcm91c2VsJyk7XG4gICAgICAgIGlmICgkcGljdHVyZUNhcm91c2VsLmxlbmd0aCAmJiAhJHBpY3R1cmVDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJHBpY3R1cmVDYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRiaWtlQ2FyZENhcm91c2VsID0gJCgnLmpzLWJpa2UtY2FyZC1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJGJpa2VDYXJkQ2Fyb3VzZWwubGVuZ3RoICYmICEkYmlrZUNhcmRDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJGJpa2VDYXJkQ2Fyb3VzZWwuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAkKGl0ZW0pLnNsaWNrKHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGZhZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFkZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g0YDQtdCw0LvQuNC30L7QstGL0LLQsNC10Lwg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INGB0LvQsNC50LTQvtCyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWJpa2UtY2FyZC1zbGlkZS1idG4nLCBlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkYnRuID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRwYXJlbnQgPSAkYnRuLmNsb3Nlc3QoJy5iaWtlLWNhcmQnKTtcbiAgICAgICAgICAgICAgICBjb25zdCAkY2Fyb3VzZWwgPSAkcGFyZW50LmZpbmQoJy5qcy1iaWtlLWNhcmQtY2Fyb3VzZWwnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzbGlkZUlkID0gJGJ0bi5kYXRhKCdzbGlkZScpO1xuICAgICAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLmpzLWJpa2UtY2FyZC1zbGlkZS1idG4nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJGJ0bi5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJGNhcm91c2VsLnNsaWNrKCdzbGlja0dvVG8nLCBzbGlkZUlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgJHVwQnRuID0gJCgnLmpzLWJ0bi11cCcpO1xuXG4gICAgaWYgKCR1cEJ0bi5sZW5ndGgpIHtcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1idG4tdXAnLCAoKSA9PiB7XG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID49IGdsb2JhbE9wdGlvbnMudGFibGV0TGdTaXplKSB7XG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gNTAgPyAkdXBCdG4uc2hvdygpIDogJHVwQnRuLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgJGZpbHRlck1vZGFsID0gJCgnLmpzLWZpbHRlci1tb2RhbCcpO1xuICAgIGlmICgkZmlsdGVyTW9kYWwubGVuZ3RoKSB7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtZmlsdGVyLWJ0bicsIGUgPT4ge1xuICAgICAgICAgICAgJGZpbHRlck1vZGFsLmFkZENsYXNzKCdpcy1hY3RpdmUnKS5hbmltYXRlQ3NzKCdzbGlkZUluUmlnaHQnKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1maWx0ZXItY2xvc2UnLCBlID0+IHtcbiAgICAgICAgICAgICRmaWx0ZXJNb2RhbC5hbmltYXRlQ3NzKCdzbGlkZU91dFJpZ2h0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICRmaWx0ZXJNb2RhbC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdoYXMtb3ZlcmxheScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykubGVuZ3RoID4gMCkge1xuICAgICAgICAvKipcbiAgICAgICAgICog0JDQvdC40LzQsNGG0LjRjyDRjdC70LXQvNC10L3RgtCwIGxhYmVsINC/0YDQuCDRhNC+0LrRg9GB0LUg0L/QvtC70LXQuSDRhNC+0YDQvNGLXG4gICAgICAgICAqL1xuICAgICAgICAkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gJChlbCkuZmluZCgnaW5wdXQsIHRleHRhcmVhJyk7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAkKGZpZWxkKVxuICAgICAgICAgICAgICAgICAgICAudmFsKClcbiAgICAgICAgICAgICAgICAgICAgLnRyaW0oKSAhPSAnJyB8fFxuICAgICAgICAgICAgICAgICQoZmllbGQpLmlzKCc6cGxhY2Vob2xkZXItc2hvd24nKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKGZpZWxkKVxuICAgICAgICAgICAgICAgIC5vbignZm9jdXMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub24oJ2JsdXInLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKSA9PT0gJycgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICEkKGZpZWxkKS5pcygnOnBsYWNlaG9sZGVyLXNob3duJylcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyogQHNlZSBodHRwczovL2F0b21pa3MuZ2l0aHViLmlvL3RpcHB5anMvICovXG5cbiAgICBjb25zdCB0b29sdGlwU2V0dGluZ3MgPSB7XG4gICAgICAgIGFycm93OiBmYWxzZSxcbiAgICAgICAgYWxsb3dIVE1MOiBmYWxzZSxcbiAgICAgICAgYW5pbWF0ZUZpbGw6IGZhbHNlLFxuICAgICAgICBwbGFjZW1lbnQ6ICdyaWdodC1jZW50ZXInLFxuICAgICAgICBkaXN0YW5jZTogMjAsXG4gICAgICAgIHRoZW1lOiAndG9vbHRpcCcsXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqICBpbml0IGFsbCB0b29sdGlwc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXRUb29sdGlwcygpIHtcbiAgICAgICAgJCgnW2RhdGEtdG9vbHRpcF0nKS5lYWNoKChpbmRleCwgZWxlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbG9jYWxTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAkKGVsZW0pLmF0dHIoJ2RhdGEtdG9vbHRpcCcpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICgkKGVsZW0pLmRhdGEoJ2NsaWNrJykpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFNldHRpbmdzWyd0cmlnZ2VyJ10gPSAnY2xpY2sga2V5dXAnO1xuICAgICAgICAgICAgICAgIGxvY2FsU2V0dGluZ3NbJ2ludGVyYWN0aXZlJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aXBweShlbGVtLCBPYmplY3QuYXNzaWduKHt9LCB0b29sdGlwU2V0dGluZ3MsIGxvY2FsU2V0dGluZ3MpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFRvb2x0aXBzKCk7XG5cbiAgICAvLyBzaG9wIGFkZHJlc3NcbiAgICAvLyDQnNC+0YHQutC+0LLRgdC60LDRjyDQvtCx0LvQsNGC0YwsINCh0L7Qu9C90LXRh9C90L7Qs9C+0YDRgdC60LjQuSDRgNCw0LnQvtC9LCDQtC4g0JTRg9GA0YvQutC40L3QviwgMdCULlxuICAgIGNvbnN0IHNob3AgPSB7IGxhdDogNTYuMDU5Njk1LCBsbmc6IDM3LjE0NDE0MiB9O1xuXG4gICAgLy8gZm9yIGJsYWNrIG1hcFxuICAgIGNvbnN0IG1hcFN0eWxlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMyMTIxMjEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy5pY29uJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICdvZmYnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNzU3NTc1JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5zdHJva2UnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMjEyMTIxJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdhZG1pbmlzdHJhdGl2ZScsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2dlb21ldHJ5JyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzc1NzU3NScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAnYWRtaW5pc3RyYXRpdmUuY291bnRyeScsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOWU5ZTllJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdhZG1pbmlzdHJhdGl2ZS5sYW5kX3BhcmNlbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAnb2ZmJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdhZG1pbmlzdHJhdGl2ZS5sb2NhbGl0eScsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjYmRiZGJkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdwb2knLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzc1NzU3NScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncG9pLnBhcmsnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMxODE4MTgnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3BvaS5wYXJrJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM2MTYxNjEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3BvaS5wYXJrJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuc3Ryb2tlJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzFiMWIxYicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncm9hZCcsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2dlb21ldHJ5LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMmMyYzJjJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdyb2FkJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM4YThhOGEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3JvYWQuYXJ0ZXJpYWwnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzNzM3MzcnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3JvYWQuaGlnaHdheScsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2dlb21ldHJ5JyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNjM2MzYycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncm9hZC5oaWdod2F5LmNvbnRyb2xsZWRfYWNjZXNzJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnZ2VvbWV0cnknLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNGU0ZTRlJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdyb2FkLmxvY2FsJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM2MTYxNjEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3RyYW5zaXQnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzc1NzU3NScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAnd2F0ZXInLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3dhdGVyJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZDNkM2QnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgIF07XG5cbiAgICAvLyBJbml0aWFsaXplIGFuZCBhZGQgdGhlIG1hcFxuICAgIGZ1bmN0aW9uIGluaXRNYXAoKSB7XG4gICAgICAgIC8vIFRoZSBtYXAsIGNlbnRlcmVkIGF0IFNob3BcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcbiAgICAgICAgICAgIHpvb206IDE0LFxuICAgICAgICAgICAgY2VudGVyOiBzaG9wLFxuICAgICAgICAgICAgc3R5bGVzOiBtYXBTdHlsZXMsXG4gICAgICAgICAgICB6b29tQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgIHNjYWxlQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgIHJvdGF0ZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgICAgZnVsbHNjcmVlbkNvbnRyb2w6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHBvaW50SWNvbiA9IHtcbiAgICAgICAgICAgIHVybDogJ2ltZy9zdmcvcG9pbnQuc3ZnJyxcbiAgICAgICAgICAgIC8vIFRoaXMgbWFya2VyIGlzIDcyIHBpeGVscyB3aWRlIGJ5IDcyIHBpeGVscyBoaWdoLlxuICAgICAgICAgICAgc2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoNzIsIDcyKSxcbiAgICAgICAgICAgIC8vIFRoZSBvcmlnaW4gZm9yIHRoaXMgaW1hZ2UgaXMgKDAsIDApLlxuICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAvLyBUaGUgYW5jaG9yIGZvciB0aGlzIGltYWdlIGlzIHRoZSBjZW50ZXIgYXQgKDAsIDMyKS5cbiAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDM2LCAzNiksXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVGhlIG1hcmtlciwgcG9zaXRpb25lZCBhdCBzaG9wXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgcG9zaXRpb246IHNob3AsXG4gICAgICAgICAgICBpY29uOiBwb2ludEljb24sXG4gICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgd2luZG93LmluaXRNYXAgPSBpbml0TWFwO1xuXG47XG59KTtcbiJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==

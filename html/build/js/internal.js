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
      en: 'File size can\'t be more then %s Kb'
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
  $('form[data-validate="true"]').parsley();
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
    lockDocument();
  }
  /**
   * Hide modal block
   * @param {jQuery} $modalBlock Modal block
   */


  function hideModal($modalBlock) {
    $modalBlock.animateCss('slideOutRight', function () {
      $modalBlock.removeClass('is-active');
      unlockDocument();
    });
  }
  /**
   * Unlock document for scroll
   */


  function unlockDocument() {
    $('html').removeClass('is-locked'); // .css('height', 'auto');
  }
  /**
   * Lock document for scroll
   * @param {jQuery} $lockBlock Block which define document height
   */


  function lockDocument() {
    $('html').addClass('is-locked');
  } // ------ логика открытия выпадашек хедера ------


  var $header = $('.js-header');
  $(document).on('click', '.js-header-dropdown-btn', function (e) {
    e.preventDefault();
    var $self = $(e.currentTarget);
    var category = $self.attr('data-category');
    var $categoryDropdown = $("[data-dropdown-category='".concat(category, "']"));

    if ($self.hasClass('is-chosen')) {
      $self.removeClass('is-chosen');
      $categoryDropdown.removeClass('is-active');
      $header.removeClass('is-active');
    } else {
      $('.js-header-dropdown-btn').removeClass('is-chosen');
      $('.js-header-dropdown').removeClass('is-active');
      $header.addClass('is-active');
      $self.addClass('is-chosen');
      $categoryDropdown.addClass('is-active');
      $(document).on('click', closeDropdownHandler);
    }
  });

  function closeDropdownHandler(e) {
    if ($(e.target).closest('.js-header').length === 0) {
      $('.js-header-dropdown-btn').removeClass('is-active');
      $('.js-header-dropdown').removeClass('is-active');
      $header.removeClass('is-active');
      $(document).off('click', closeDropdownHandler);
    }
  }

  $(document).on('click', '.js-tabs-link', function (e) {
    e.preventDefault();
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
    var $selfItem = $($self.attr('href'));
    $selfItem.addClass('is-active'); // включаем валидацию у скрытых полей

    $hiddenFormFields = $selfItem.find('[data-required]');

    if ($hiddenFormFields.length) {
      $hiddenFormFields.prop('data-required', true);
      $hiddenFormFields.prop('required', true);
    }
  });
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
  } //  карусель на первом баннере на главной странице


  var $newsCarousel = $('.js-news-carousel');

  if ($newsCarousel.length) {
    $newsCarousel.slick({
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      centerMode: false,
      variableWidth: true,
      mobileFirst: true,
      responsive: [{
        breakpoint: 767,
        settings: {
          infinite: false
        }
      }, {
        breakpoint: 1023,
        settings: 'unslick'
      }]
    });
  } // карусель подбора байков


  var $bikesCarousel = $('.js-bikes-carousel');

  if ($bikesCarousel.length) {
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

  if ($categoriesCarousel.length) {
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
  } // карусель картинок товара


  var $productCarousel = $('.js-product-carousel');

  if ($productCarousel.length) {
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

  if ($similarCarousel.length) {
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
    });
    $(document).on('click', '.js-filter-close', function (e) {
      $filterModal.animateCss('slideOutRight', function () {
        $filterModal.removeClass('is-active');
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
    /**
     *  init all tooltips
     */

  };

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
    "elementType": "geometry",
    "stylers": [{
      "color": "#212121"
    }]
  }, {
    "elementType": "labels.icon",
    "stylers": [{
      "visibility": "off"
    }]
  }, {
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#757575"
    }]
  }, {
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#212121"
    }]
  }, {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{
      "color": "#757575"
    }]
  }, {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#9e9e9e"
    }]
  }, {
    "featureType": "administrative.land_parcel",
    "stylers": [{
      "visibility": "off"
    }]
  }, {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#bdbdbd"
    }]
  }, {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#757575"
    }]
  }, {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{
      "color": "#181818"
    }]
  }, {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#616161"
    }]
  }, {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#1b1b1b"
    }]
  }, {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#2c2c2c"
    }]
  }, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#8a8a8a"
    }]
  }, {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{
      "color": "#373737"
    }]
  }, {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{
      "color": "#3c3c3c"
    }]
  }, {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [{
      "color": "#4e4e4e"
    }]
  }, {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#616161"
    }]
  }, {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#757575"
    }]
  }, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{
      "color": "#000000"
    }]
  }, {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#3d3d3d"
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wTGdTaXplIiwiZGVza3RvcE1kU2l6ZSIsImRlc2t0b3BTaXplIiwiZGVza3RvcFNtU2l6ZSIsInRhYmxldExnU2l6ZSIsInRhYmxldFNpemUiLCJtb2JpbGVMZ1NpemUiLCJtb2JpbGVTaXplIiwibGFuZyIsImF0dHIiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnREZXNrdG9wTGciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYnJlYWtwb2ludERlc2t0b3BNZCIsImJyZWFrcG9pbnREZXNrdG9wIiwiYnJlYWtwb2ludERlc2t0b3BTbSIsImJyZWFrcG9pbnRUYWJsZXRMZyIsImJyZWFrcG9pbnRUYWJsZXQiLCJicmVha3BvaW50TW9iaWxlTGdTaXplIiwiYnJlYWtwb2ludE1vYmlsZSIsImV4dGVuZCIsIm9uIiwibGVuZ3RoIiwiYXV0b3NpemUiLCJmbiIsImFuaW1hdGVDc3MiLCJhbmltYXRpb25OYW1lIiwiY2FsbGJhY2siLCJhbmltYXRpb25FbmQiLCJlbCIsImFuaW1hdGlvbnMiLCJhbmltYXRpb24iLCJPQW5pbWF0aW9uIiwiTW96QW5pbWF0aW9uIiwiV2Via2l0QW5pbWF0aW9uIiwidCIsInN0eWxlIiwidW5kZWZpbmVkIiwiY3JlYXRlRWxlbWVudCIsImFkZENsYXNzIiwib25lIiwicmVtb3ZlQ2xhc3MiLCJpc051bWVyaWMiLCJuIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJyZW1vdmVOb3REaWdpdHMiLCJwYXJhbSIsInRvU3RyaW5nIiwicmVwbGFjZSIsImRpdmlkZUJ5RGlnaXRzIiwibG9jYWxlIiwiUGFyc2xleSIsInNldExvY2FsZSIsIm9wdGlvbnMiLCJ0cmlnZ2VyIiwidmFsaWRhdGlvblRocmVzaG9sZCIsImVycm9yc1dyYXBwZXIiLCJlcnJvclRlbXBsYXRlIiwiY2xhc3NIYW5kbGVyIiwiaW5zdGFuY2UiLCIkZWxlbWVudCIsInR5cGUiLCIkaGFuZGxlciIsImhhc0NsYXNzIiwibmV4dCIsImVycm9yc0NvbnRhaW5lciIsIiRjb250YWluZXIiLCJjbG9zZXN0IiwicGFyZW50IiwiYWRkVmFsaWRhdG9yIiwidmFsaWRhdGVTdHJpbmciLCJ2YWx1ZSIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJkYXRhIiwibWF4IiwibWluRGF0ZSIsIm1heERhdGUiLCJ2YWx1ZURhdGUiLCJyZXN1bHQiLCJtYXRjaCIsIkRhdGUiLCJtYXhTaXplIiwicGFyc2xleUluc3RhbmNlIiwiZmlsZXMiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsImkiLCIkYmxvY2siLCIkbGFzdCIsImFmdGVyIiwiZWxlbWVudCIsInBhcnNsZXkiLCJpbnB1dG1hc2siLCJjbGVhck1hc2tPbkxvc3RGb2N1cyIsInNob3dNYXNrT25Ib3ZlciIsIkN1c3RvbVNlbGVjdCIsIiRlbGVtIiwic2VsZiIsImluaXQiLCIkaW5pdEVsZW0iLCJlYWNoIiwic2VsZWN0U2VhcmNoIiwibWluaW11bVJlc3VsdHNGb3JTZWFyY2giLCJJbmZpbml0eSIsInNlbGVjdDIiLCJzZWxlY3RPbkJsdXIiLCJkcm9wZG93bkNzc0NsYXNzIiwibGFuZ3VhZ2UiLCJub1Jlc3VsdHMiLCJlIiwiZmluZCIsImNsaWNrIiwidXBkYXRlIiwiJHVwZGF0ZUVsZW0iLCJjdXN0b21TZWxlY3QiLCJkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMiLCJkYXRlRm9ybWF0Iiwic2hvd090aGVyTW9udGhzIiwiRGF0ZXBpY2tlciIsImRhdGVwaWNrZXIiLCJzaG93TVkiLCJjdXJyZW50RGF0ZSIsImN1cnJlbnREYXkiLCJnZXREYXRlIiwibmV3RGF0ZSIsImdldE1vbnRoIiwiZ2V0RnVsbFllYXIiLCJpdGVtT3B0aW9ucyIsIm9uU2VsZWN0IiwiY2hhbmdlIiwic2V0VGltZW91dCIsIiRtb2JpbGVNZW51IiwiJGNhcnRNb2RhbCIsIm9wZW5Nb2RhbCIsImhpZGVNb2RhbCIsInByZXZlbnREZWZhdWx0IiwiJG1vZGFsQmxvY2siLCJsb2NrRG9jdW1lbnQiLCJ1bmxvY2tEb2N1bWVudCIsIiRoZWFkZXIiLCIkc2VsZiIsImN1cnJlbnRUYXJnZXQiLCJjYXRlZ29yeSIsIiRjYXRlZ29yeURyb3Bkb3duIiwiY2xvc2VEcm9wZG93bkhhbmRsZXIiLCJ0YXJnZXQiLCJvZmYiLCIkdGFicyIsIiR0YWJzTGlua3MiLCIkdGFic0l0ZW1zIiwiJGhpZGRlbkZvcm1GaWVsZHMiLCJwcm9wIiwidmFsIiwiJHNlbGZJdGVtIiwiU3Bpbm5lciIsInN0ZXAiLCJwcmVjaXNpb24iLCJlbGVtZW50cyIsIiRkZWMiLCIkaW5jIiwiJGlucHV0IiwidXBkYXRlQnV0dG9ucyIsImluc3RhbmNlcyIsInNwaW5uZXIiLCJpcyIsIiRzcGlubmVycyIsImluZGV4IiwiYmxvY2siLCJnZXRJbnN0YW5jZSIsImRpc2FibGVTcGlubmVyIiwicHVzaCIsInNwaW5uZXJJbmRleCIsImZpbmRJbmRleCIsInNwbGljZSIsImhhbmRsZURlY0NsaWNrIiwiaGFuZGxlSW5jQ2xpY2siLCJoYW5kbGVJbnB1dCIsInNwaW5uZXJzIiwiY3JlYXRlIiwiJHRhcmdldCIsInRvRml4ZWQiLCJjaGFuZ2VWYWx1ZSIsIiRuZXdzQ2Fyb3VzZWwiLCJzbGljayIsImFycm93cyIsImluZmluaXRlIiwic2xpZGVzVG9TaG93IiwiY2VudGVyTW9kZSIsInZhcmlhYmxlV2lkdGgiLCJtb2JpbGVGaXJzdCIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCIkYmlrZXNDYXJvdXNlbCIsIiRjYXRlZ29yaWVzQ2Fyb3VzZWwiLCJjZW50ZXJQYWRkaW5nIiwiZG90cyIsIiRwcm9kdWN0Q2Fyb3VzZWwiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCIkc2ltaWxhckNhcm91c2VsIiwiJHVwQnRuIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIndpZHRoIiwic2hvdyIsImhpZGUiLCIkZmlsdGVyTW9kYWwiLCJmaWVsZCIsInRyaW0iLCJldmVudCIsInRvb2x0aXBTZXR0aW5ncyIsImFycm93IiwiYWxsb3dIVE1MIiwiYW5pbWF0ZUZpbGwiLCJwbGFjZW1lbnQiLCJkaXN0YW5jZSIsInRoZW1lIiwiaW5pdFRvb2x0aXBzIiwiZWxlbSIsImxvY2FsU2V0dGluZ3MiLCJjb250ZW50IiwidGlwcHkiLCJPYmplY3QiLCJhc3NpZ24iLCJzaG9wIiwibGF0IiwibG5nIiwibWFwU3R5bGVzIiwiaW5pdE1hcCIsIm1hcCIsImdvb2dsZSIsIm1hcHMiLCJNYXAiLCJnZXRFbGVtZW50QnlJZCIsInpvb20iLCJjZW50ZXIiLCJzdHlsZXMiLCJ6b29tQ29udHJvbCIsIm1hcFR5cGVDb250cm9sIiwic2NhbGVDb250cm9sIiwic3RyZWV0Vmlld0NvbnRyb2wiLCJyb3RhdGVDb250cm9sIiwiZnVsbHNjcmVlbkNvbnRyb2wiLCJwb2ludEljb24iLCJ1cmwiLCJTaXplIiwib3JpZ2luIiwiUG9pbnQiLCJhbmNob3IiLCJtYXJrZXIiLCJNYXJrZXIiLCJwb3NpdGlvbiIsImljb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWUMsS0FBWixDQUFrQixZQUFXO0FBQ3pCOzs7QUFHQSxNQUFJQyxhQUFhLEdBQUc7QUFDaEI7QUFDQUMsSUFBQUEsSUFBSSxFQUFHLEdBRlM7QUFJaEI7QUFDQUMsSUFBQUEsYUFBYSxFQUFHLElBTEE7QUFNaEJDLElBQUFBLGFBQWEsRUFBRyxJQU5BO0FBT2hCQyxJQUFBQSxXQUFXLEVBQUssSUFQQTtBQVFoQkMsSUFBQUEsYUFBYSxFQUFHLElBUkE7QUFTaEJDLElBQUFBLFlBQVksRUFBSSxJQVRBO0FBVWhCQyxJQUFBQSxVQUFVLEVBQU0sR0FWQTtBQVdoQkMsSUFBQUEsWUFBWSxF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RUFBRSxLQVBTO0FBUTVCQyxNQUFBQSxhQUFhLEVBQUUsS0FSYTtBQVM1QkMsTUFBQUEsaUJBQWlCLEVBQUU7QUFUUyxLQUR4QixDQUFaO0FBYUEsUUFBTUMsU0FBUyxHQUFHO0FBQ2RDLE1BQUFBLEdBQUcsRUFBRSxtQkFEUztBQUVkO0FBQ0F2SyxNQUFBQSxJQUFJLEVBQUUsSUFBSXlKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZYyxJQUFoQixDQUFxQixFQUFyQixFQUF5QixFQUF6QixDQUhRO0FBSWQ7QUFDQUMsTUFBQUEsTUFBTSxFQUFFLElBQUloQixNQUFNLENBQUNDLElBQVAsQ0FBWWdCLEtBQWhCLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBTE07QUFNZDtBQUNBQyxNQUFBQSxNQUFNLEVBQUUsSUFBSWxCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZZ0IsS0FBaEIsQ0FBc0IsRUFBdEIsRUFBMEIsRUFBMUI7QUFQTSxLQUFsQixDQWZlLENBeUJmOztBQUNBLFFBQU1FLE1BQU0sR0FBRyxJQUFJbkIsTUFBTSxDQUFDQyxJQUFQLENBQVltQixNQUFoQixDQUF1QjtBQUNsQ0MsTUFBQUEsUUFBUSxFQUFFM0IsSUFEd0I7QUFFbEM0QixNQUFBQSxJQUFJLEVBQUVULFNBRjRCO0FBR2xDZCxNQUFBQSxHQUFHLEVBQUVBO0FBSDZCLEtBQXZCLENBQWY7QUFLSDs7QUFFRDFPLEVBQUFBLE1BQU0sQ0FBQ3lPLE9BQVAsR0FBaUJBLE9BQWpCO0FBRUo7QUFDQyxDQXR3Q0QiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiDQk9C70L7QsdCw0LvRjNC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtSwg0LrQvtGC0L7RgNGL0LUg0LjRgdC/0L7Qu9GM0LfRg9GO0YLRgdGPINC80L3QvtCz0L7QutGA0LDRgtC90L5cbiAgICAgKi9cbiAgICBsZXQgZ2xvYmFsT3B0aW9ucyA9IHtcbiAgICAgICAgLy8g0JLRgNC10LzRjyDQtNC70Y8g0LDQvdC40LzQsNGG0LjQuVxuICAgICAgICB0aW1lOiAgMjAwLFxuXG4gICAgICAgIC8vINCa0L7QvdGC0YDQvtC70YzQvdGL0LUg0YLQvtGH0LrQuCDQsNC00LDQv9GC0LjQstCwXG4gICAgICAgIGRlc2t0b3BMZ1NpemU6ICAxOTEwLFxuICAgICAgICBkZXNrdG9wTWRTaXplOiAgMTYwMCxcbiAgICAgICAgZGVza3RvcFNpemU6ICAgIDE0ODAsXG4gICAgICAgIGRlc2t0b3BTbVNpemU6ICAxMjgwLFxuICAgICAgICB0YWJsZXRMZ1NpemU6ICAgMTAyNCxcbiAgICAgICAgdGFibGV0U2l6ZTogICAgIDc2OCxcbiAgICAgICAgbW9iaWxlTGdTaXplOiAgIDY0MCxcbiAgICAgICAgbW9iaWxlU2l6ZTogICAgIDQ4MCxcblxuICAgICAgICBsYW5nOiAkKCdodG1sJykuYXR0cignbGFuZycpXG4gICAgfTtcblxuICAgIC8vINCR0YDQtdC50LrQv9C+0LjQvdGC0Ysg0LDQtNCw0L/RgtC40LLQsFxuICAgIC8vIEBleGFtcGxlIGlmIChnbG9iYWxPcHRpb25zLmJyZWFrcG9pbnRUYWJsZXQubWF0Y2hlcykge30gZWxzZSB7fVxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0ge1xuICAgICAgICBicmVha3BvaW50RGVza3RvcExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcE1kOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BNZFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wU206IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFNtU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXRMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50VGFibGV0OiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50TW9iaWxlTGdTaXplOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLm1vYmlsZUxnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlU2l6ZSAtIDF9cHgpYClcbiAgICB9O1xuXG4gICAgJC5leHRlbmQodHJ1ZSwgZ2xvYmFsT3B0aW9ucywgYnJlYWtwb2ludHMpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICBpZiAoJCgndGV4dGFyZWEnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhdXRvc2l6ZSgkKCd0ZXh0YXJlYScpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog0J/QvtC00LrQu9GO0YfQtdC90LjQtSBqcyBwYXJ0aWFsc1xuICAgICAqL1xuICAgIC8qKlxuICog0KDQsNGB0YjQuNGA0LXQvdC40LUgYW5pbWF0ZS5jc3NcbiAqIEBwYXJhbSAge1N0cmluZ30gYW5pbWF0aW9uTmFtZSDQvdCw0LfQstCw0L3QuNC1INCw0L3QuNC80LDRhtC40LhcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayDRhNGD0L3QutGG0LjRjywg0LrQvtGC0L7RgNCw0Y8g0L7RgtGA0LDQsdC+0YLQsNC10YIg0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XG4gKiBAcmV0dXJuIHtPYmplY3R9INC+0LHRitC10LrRgiDQsNC90LjQvNCw0YbQuNC4XG4gKiBcbiAqIEBzZWUgIGh0dHBzOi8vZGFuZWRlbi5naXRodWIuaW8vYW5pbWF0ZS5jc3MvXG4gKiBcbiAqIEBleGFtcGxlXG4gKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnKTtcbiAqIFxuICogJCgnI3lvdXJFbGVtZW50JykuYW5pbWF0ZUNzcygnYm91bmNlJywgZnVuY3Rpb24oKSB7XG4gKiAgICAgLy8g0JTQtdC70LDQtdC8INGH0YLQvi3RgtC+INC/0L7RgdC70LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxuICogfSk7XG4gKi9cbiQuZm4uZXh0ZW5kKHtcbiAgICBhbmltYXRlQ3NzOiBmdW5jdGlvbihhbmltYXRpb25OYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYW5pbWF0aW9uRW5kID0gKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdhbmltYXRpb25lbmQnLFxuICAgICAgICAgICAgICAgIE9BbmltYXRpb246ICdvQW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICBNb3pBbmltYXRpb246ICdtb3pBbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgICAgIFdlYmtpdEFuaW1hdGlvbjogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmb3IgKGxldCB0IGluIGFuaW1hdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uc1t0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcblxuICAgICAgICB0aGlzLmFkZENsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSkub25lKGFuaW1hdGlvbkVuZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0pO1xuICAgIC8vINCd0LXQsdC+0LvRjNGI0LjQtSDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0LUg0YTRg9C90LrRhtC40LhcblxuICAgIC8qKlxuICAgICAqINCf0YDQvtCy0LXRgNGP0LXRgiDRh9C40YHQu9C+INC40LvQuCDQvdC10YJcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gbiDQm9GO0LHQvtC5INCw0YDQs9GD0LzQtdC90YJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWVyaWMobikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvRj9C10YIg0LLRgdC1INC90LXRh9C40YHQu9C+0LLRi9C1INGB0LjQvNCy0L7Qu9GLINC4INC/0YDQuNCy0L7QtNC40YIg0Log0YfQuNGB0LvRg1xuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJ8bnVtYmVyfSBwYXJhbVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm90RGlnaXRzKHBhcmFtKSB7XG4gICAgICAgIC8qINGD0LTQsNC70Y/QtdC8INCy0YHQtSDRgdC40LzQstC+0LvRiyDQutGA0L7QvNC1INGG0LjRhNGAINC4INC/0LXRgNC10LLQvtC00LjQvCDQsiDRh9C40YHQu9C+ICovXG4gICAgICAgIHJldHVybiArcGFyYW0udG9TdHJpbmcoKS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCg0LDQt9C00LXQu9GP0LXRgiDQvdCwINGA0LDQt9GA0Y/QtNGLXG4gICAgICog0J3QsNC/0YDQuNC80LXRgCwgMzgwMDAwMCAtPiAzIDgwMCAwMDBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyfG51bWJlcn0gcGFyYW1cbiAgICAgKiBAcmV0dXJucyB7c3RyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpdmlkZUJ5RGlnaXRzKHBhcmFtKSB7XG4gICAgICAgIGlmIChwYXJhbSA9PT0gbnVsbCkgcGFyYW0gPSAwO1xuICAgICAgICByZXR1cm4gcGFyYW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9XG5cbiAgICB2YXIgbG9jYWxlID0gZ2xvYmFsT3B0aW9ucy5sYW5nID09ICdydS1SVScgPyAncnUnIDogJ2VuJztcblxuICAgIFBhcnNsZXkuc2V0TG9jYWxlKGxvY2FsZSk7XG5cbiAgICAvKiDQndCw0YHRgtGA0L7QudC60LggUGFyc2xleSAqL1xuICAgICQuZXh0ZW5kKFBhcnNsZXkub3B0aW9ucywge1xuICAgICAgICB0cmlnZ2VyOiAnYmx1ciBjaGFuZ2UnLCAvLyBjaGFuZ2Ug0L3Rg9C20LXQvSDQtNC70Y8gc2VsZWN0J9CwXG4gICAgICAgIHZhbGlkYXRpb25UaHJlc2hvbGQ6ICcwJyxcbiAgICAgICAgZXJyb3JzV3JhcHBlcjogJzxkaXY+PC9kaXY+JyxcbiAgICAgICAgZXJyb3JUZW1wbGF0ZTogJzxwIGNsYXNzPVwicGFyc2xleS1lcnJvci1tZXNzYWdlXCI+PC9wPicsXG4gICAgICAgIGNsYXNzSGFuZGxlcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICAgICAkaGFuZGxlcjtcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkZWxlbWVudDsgLy8g0YLQviDQtdGB0YLRjCDQvdC40YfQtdCz0L4g0L3QtSDQstGL0LTQtdC70Y/QtdC8IChpbnB1dCDRgdC60YDRi9GCKSwg0LjQvdCw0YfQtSDQstGL0LTQtdC70Y/QtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDQsdC70L7QulxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJCgnLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUnLCAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICRoYW5kbGVyO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcnNDb250YWluZXI6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xuICAgICAgICAgICAgbGV0IHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lcjtcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJChgW25hbWU9XCIkeyRlbGVtZW50LmF0dHIoJ25hbWUnKX1cIl06bGFzdCArIGxhYmVsYCkubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmN1c3RvbS1maWxlJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmZpZWxkJyk7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJGNvbnRhaW5lcilcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgcmV0dXJuICRjb250YWluZXI7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCa0LDRgdGC0L7QvNC90YvQtSDQstCw0LvQuNC00LDRgtC+0YDRi1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lUnUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWVFbicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosIFwiIFwiLCBcIi1cIidcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiyDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlclJ1Jywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlswLTnQsC3Rj9GRXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCAwLTknXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLLCDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXInLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXowLTldKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05J1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC10LvQtdGE0L7QvdC90YvQuSDQvdC+0LzQtdGAXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ3Bob25lJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlstKzAtOSgpIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0YLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgCcsXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBwaG9uZSBudW1iZXInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bWJlcicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bMC05XSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIDAtOSdcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0J/QvtGH0YLQsCDQsdC10Lcg0LrQuNGA0LjQu9C70LjRhtGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2VtYWlsJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXihbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0oXFwufF98LSl7MCwxfSkrW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dXFxAKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSkrKChcXC4pezAsMX1bQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pezEsfVxcLlthLXrQsC3RjzAtOVxcLV17Mix9JC8udGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9C+0YfRgtC+0LLRi9C5INCw0LTRgNC10YEnLFxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZW1haWwgYWRkcmVzcydcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KTQvtGA0LzQsNGCINC00LDRgtGLIERELk1NLllZWVlcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZGF0ZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgcmVnVGVzdCA9IC9eKD86KD86MzEoXFwuKSg/OjA/WzEzNTc4XXwxWzAyXSkpXFwxfCg/Oig/OjI5fDMwKShcXC4pKD86MD9bMSwzLTldfDFbMC0yXSlcXDIpKSg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezJ9KSR8Xig/OjI5KFxcLikwPzJcXDMoPzooPzooPzoxWzYtOV18WzItOV1cXGQpPyg/OjBbNDhdfFsyNDY4XVswNDhdfFsxMzU3OV1bMjZdKXwoPzooPzoxNnxbMjQ2OF1bMDQ4XXxbMzU3OV1bMjZdKTAwKSkpKSR8Xig/OjA/WzEtOV18MVxcZHwyWzAtOF0pKFxcLikoPzooPzowP1sxLTldKXwoPzoxWzAtMl0pKVxcNCg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezR9KSQvLFxuICAgICAgICAgICAgICAgIHJlZ01hdGNoID0gLyhcXGR7MSwyfSlcXC4oXFxkezEsMn0pXFwuKFxcZHs0fSkvLFxuICAgICAgICAgICAgICAgIG1pbiA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWluJyksXG4gICAgICAgICAgICAgICAgbWF4ID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNYXgnKSxcbiAgICAgICAgICAgICAgICBtaW5EYXRlLCBtYXhEYXRlLCB2YWx1ZURhdGUsIHJlc3VsdDtcblxuICAgICAgICAgICAgaWYgKG1pbiAmJiAocmVzdWx0ID0gbWluLm1hdGNoKHJlZ01hdGNoKSkpIHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF4ICYmIChyZXN1bHQgPSBtYXgubWF0Y2gocmVnTWF0Y2gpKSkge1xuICAgICAgICAgICAgICAgIG1heERhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQgPSB2YWx1ZS5tYXRjaChyZWdNYXRjaCkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZURhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlZ1Rlc3QudGVzdCh2YWx1ZSkgJiYgKG1pbkRhdGUgPyB2YWx1ZURhdGUgPj0gbWluRGF0ZSA6IHRydWUpICYmIChtYXhEYXRlID8gdmFsdWVEYXRlIDw9IG1heERhdGUgOiB0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3QsNGPINC00LDRgtCwJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGRhdGUnXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLy8g0KTQsNC50Lsg0L7Qs9GA0LDQvdC40YfQtdC90L3QvtCz0L4g0YDQsNC30LzQtdGA0LBcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZU1heFNpemUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgbWF4U2l6ZSwgcGFyc2xleUluc3RhbmNlKSB7XG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBwYXJzbGV5SW5zdGFuY2UuJGVsZW1lbnRbMF0uZmlsZXM7XG4gICAgICAgICAgICByZXR1cm4gZmlsZXMubGVuZ3RoICE9IDEgIHx8IGZpbGVzWzBdLnNpemUgPD0gbWF4U2l6ZSAqIDEwMjQ7XG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVtZW50VHlwZTogJ2ludGVnZXInLFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQpNCw0LnQuyDQtNC+0LvQttC10L0g0LLQtdGB0LjRgtGMINC90LUg0LHQvtC70LXQtSwg0YfQtdC8ICVzIEtiJyxcbiAgICAgICAgICAgIGVuOiAnRmlsZSBzaXplIGNhblxcJ3QgYmUgbW9yZSB0aGVuICVzIEtiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQntCz0YDQsNC90LjRh9C10L3QuNGPINGA0LDRgdGI0LjRgNC10L3QuNC5INGE0LDQudC70L7QslxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlRXh0ZW5zaW9uJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIGZvcm1hdHMpIHtcbiAgICAgICAgICAgIGxldCBmaWxlRXh0ZW5zaW9uID0gdmFsdWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgICAgIGxldCBmb3JtYXRzQXJyID0gZm9ybWF0cy5zcGxpdCgnLCAnKTtcbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcm1hdHNBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZUV4dGVuc2lvbiA9PT0gZm9ybWF0c0FycltpXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQlNC+0L/Rg9GB0YLQuNC80Ysg0YLQvtC70YzQutC+INGE0LDQudC70Ysg0YTQvtGA0LzQsNGC0LAgJXMnLFxuICAgICAgICAgICAgZW46ICdBdmFpbGFibGUgZXh0ZW5zaW9ucyBhcmUgJXMnXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCh0L7Qt9C00LDRkdGCINC60L7QvdGC0LXQudC90LXRgNGLINC00LvRjyDQvtGI0LjQsdC+0Log0YMg0L3QtdGC0LjQv9C40YfQvdGL0YUg0Y3Qu9C10LzQtdC90YLQvtCyXG4gICAgUGFyc2xleS5vbignZmllbGQ6aW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgJGVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICAgICAgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICRibG9jayA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdlcnJvcnMtcGxhY2VtZW50JyksXG4gICAgICAgICAgICAkbGFzdDtcblxuICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCY0L3QuNGG0LjQuNGA0YPQtdGCINCy0LDQu9C40LTQsNGG0LjRjiDQvdCwINCy0YLQvtGA0L7QvCDQutCw0LvQtdC00LDRgNC90L7QvCDQv9C+0LvQtSDQtNC40LDQv9Cw0LfQvtC90LBcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDp2YWxpZGF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgJCgnZm9ybVtkYXRhLXZhbGlkYXRlPVwidHJ1ZVwiXScpLnBhcnNsZXkoKTtcblxuICAgIC8qKlxuICAgICAqINCU0L7QsdCw0LLQu9GP0LXRgiDQvNCw0YHQutC4INCyINC/0L7Qu9GPINGE0L7RgNC8XG4gICAgICogQHNlZSAgaHR0cHM6Ly9naXRodWIuY29tL1JvYmluSGVyYm90cy9JbnB1dG1hc2tcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPGlucHV0IGNsYXNzPVwianMtcGhvbmUtbWFza1wiIHR5cGU9XCJ0ZWxcIiBuYW1lPVwidGVsXCIgaWQ9XCJ0ZWxcIj5cbiAgICAgKi9cbiAgICAkKCcuanMtcGhvbmUtbWFzaycpLmlucHV0bWFzaygnKzcoOTk5KSA5OTktOTktOTknLCB7XG4gICAgICAgIGNsZWFyTWFza09uTG9zdEZvY3VzOiB0cnVlLFxuICAgICAgICBzaG93TWFza09uSG92ZXI6IGZhbHNlXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDQodGC0LjQu9C40LfRg9C10YIg0YHQtdC70LXQutGC0Ysg0YEg0L/QvtC80L7RidGM0Y4g0L/Qu9Cw0LPQuNC90LAgc2VsZWN0MlxuICAgICAqIGh0dHBzOi8vc2VsZWN0Mi5naXRodWIuaW9cbiAgICAgKi9cbiAgICBsZXQgQ3VzdG9tU2VsZWN0ID0gZnVuY3Rpb24oJGVsZW0pIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uKCRpbml0RWxlbSkge1xuICAgICAgICAgICAgJGluaXRFbGVtLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdFNlYXJjaCA9ICQodGhpcykuZGF0YSgnc2VhcmNoJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0U2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IDE7IC8vINC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBJbmZpbml0eTsgLy8g0L3QtSDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogbWluaW11bVJlc3VsdHNGb3JTZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub1Jlc3VsdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICfQodC+0LLQv9Cw0LTQtdC90LjQuSDQvdC1INC90LDQudC00LXQvdC+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQvdGD0LbQvdC+INC00LvRjyDQstGL0LvQuNC00LDRhtC40Lgg0L3QsCDQu9C10YLRg1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKGBvcHRpb25bdmFsdWU9XCIkeyQodGhpcykudmFsdWV9XCJdYCkuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnVwZGF0ZSA9IGZ1bmN0aW9uKCR1cGRhdGVFbGVtKSB7XG4gICAgICAgICAgICAkdXBkYXRlRWxlbS5zZWxlY3QyKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBzZWxmLmluaXQoJHVwZGF0ZUVsZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuaW5pdCgkZWxlbSk7XG4gICAgfTtcblxuICAgIHZhciBjdXN0b21TZWxlY3QgPSBuZXcgQ3VzdG9tU2VsZWN0KCQoJ3NlbGVjdCcpKTtcblxuICAgIGNvbnN0IGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgZGF0ZUZvcm1hdDogJ2RkLm1tLnl5JyxcbiAgICAgICAgc2hvd090aGVyTW9udGhzOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqINCU0LXQu9Cw0LXRgiDQstGL0L/QsNC00Y7RidC40LUg0LrQsNC70LXQvdC00LDRgNC40LrQuFxuICAgICAqIEBzZWUgIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL2RhdGVwaWNrZXIvXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vINCyIGRhdGEtZGF0ZS1taW4g0LggZGF0YS1kYXRlLW1heCDQvNC+0LbQvdC+INC30LDQtNCw0YLRjCDQtNCw0YLRgyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5XG4gICAgICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRhdGVJbnB1dFwiIGlkPVwiXCIgY2xhc3M9XCJqcy1kYXRlcGlja2VyXCIgZGF0YS1kYXRlLW1pbj1cIjA2LjExLjIwMTVcIiBkYXRhLWRhdGUtbWF4PVwiMTAuMTIuMjAxNVwiPlxuICAgICAqL1xuICAgIGxldCBEYXRlcGlja2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGVwaWNrZXIgPSAkKCcuanMtZGF0ZXBpY2tlcicpO1xuXG4gICAgICAgIGRhdGVwaWNrZXIuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgbWluRGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1taW4nKTtcbiAgICAgICAgICAgIGxldCBtYXhEYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1heCcpO1xuICAgICAgICAgICAgY29uc3Qgc2hvd01ZID0gJCh0aGlzKS5kYXRhKCdzaG93LW0teScpO1xuXG4gICAgICAgICAgICAvKiDQtdGB0LvQuCDQsiDQsNGC0YDQuNCx0YPRgtC1INGD0LrQsNC30LDQvdC+IGN1cnJlbnQsINGC0L4g0LLRi9Cy0L7QtNC40Lwg0YLQtdC60YPRidGD0Y4g0LTQsNGC0YMgKi9cbiAgICAgICAgICAgIGlmICggbWF4RGF0ZSA9PT0gJ2N1cnJlbnQnIHx8IG1pbkRhdGUgPT09ICdjdXJyZW50Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudERheSA9IGN1cnJlbnREYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF5IDwgMTAgPyBjdXJyZW50RGF5ID0gJzAnICsgY3VycmVudERheS50b1N0cmluZygpIDogY3VycmVudERheTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdEYXRlID0gY3VycmVudERheSArICcuJyArIChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSkgKyAnLicgKyBjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgICAgIG1heERhdGUgPT09ICdjdXJyZW50JyA/IG1heERhdGUgPSBuZXdEYXRlIDogbWluRGF0ZSA9IG5ld0RhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpdGVtT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlOiBtaW5EYXRlIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbWF4RGF0ZSB8fCBudWxsLFxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuZmllbGQnKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoc2hvd01ZKSB7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ2NoYW5nZVllYXInXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ3llYXJSYW5nZSddID0gJ2MtMTAwOmMnO1xuICAgICAgICAgICAgICAgIGl0ZW1PcHRpb25zWydjaGFuZ2VNb250aCddID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgaXRlbU9wdGlvbnMsIGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyk7XG5cbiAgICAgICAgICAgICQodGhpcykuZGF0ZXBpY2tlcihpdGVtT3B0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICAvLyDQtNC10LvQsNC10Lwg0LrRgNCw0YHQuNCy0YvQvCDRgdC10LvQtdC6INC80LXRgdGP0YbQsCDQuCDQs9C+0LTQsFxuICAgICAgICAgJChkb2N1bWVudCkub24oJ2ZvY3VzJywgJy5qcy1kYXRlcGlja2VyJywgKCkgPT4ge1xuICAgICAgICAgICAgLy8g0LjRgdC/0L7Qu9GM0LfRg9C10Lwg0LfQsNC00LXRgNC20LrRgywg0YfRgtC+0LHRiyDQtNC10LnRgtC/0LjQutC10YAg0YPRgdC/0LXQuyDQuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0YLRjNGB0Y9cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCQoJy51aS1kYXRlcGlja2VyJykuZmluZCgnc2VsZWN0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy51aS1kYXRlcGlja2VyJykuZmluZCgnc2VsZWN0Jykuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGxldCBkYXRlcGlja2VyID0gbmV3IERhdGVwaWNrZXIoKTtcblxuICAgIGNvbnN0ICRtb2JpbGVNZW51ID0gJCgnLmpzLW1vYmlsZS1tZW51Jyk7XG4gICAgY29uc3QgJGNhcnRNb2RhbCA9ICQoJy5qcy1jYXJ0LW1vZGFsJyk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLW1lbnUtYnRuJywgKCkgPT4ge1xuICAgICAgICBvcGVuTW9kYWwoJG1vYmlsZU1lbnUpO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1tZW51LWNsb3NlJywgKCkgPT4ge1xuICAgICAgICBoaWRlTW9kYWwoJG1vYmlsZU1lbnUpXG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNhcnQtYnRuJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBvcGVuTW9kYWwoJGNhcnRNb2RhbCk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNhcnQtY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgIGhpZGVNb2RhbCgkY2FydE1vZGFsKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIE9wZW4gbW9kYWwgYmxvY2tcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJG1vZGFsQmxvY2sgTW9kYWwgYmxvY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvcGVuTW9kYWwoJG1vZGFsQmxvY2spIHtcbiAgICAgICAgJG1vZGFsQmxvY2suYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpLmFuaW1hdGVDc3MoJ3NsaWRlSW5SaWdodCcpO1xuICAgICAgICBsb2NrRG9jdW1lbnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIaWRlIG1vZGFsIGJsb2NrXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRtb2RhbEJsb2NrIE1vZGFsIGJsb2NrXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGlkZU1vZGFsKCRtb2RhbEJsb2NrKSB7XG4gICAgICAgICRtb2RhbEJsb2NrLmFuaW1hdGVDc3MoJ3NsaWRlT3V0UmlnaHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAkbW9kYWxCbG9jay5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICB1bmxvY2tEb2N1bWVudCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbmxvY2sgZG9jdW1lbnQgZm9yIHNjcm9sbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVubG9ja0RvY3VtZW50KCkge1xuICAgICAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ2lzLWxvY2tlZCcpO1xuICAgICAgICAvLyAuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvY2sgZG9jdW1lbnQgZm9yIHNjcm9sbFxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkbG9ja0Jsb2NrIEJsb2NrIHdoaWNoIGRlZmluZSBkb2N1bWVudCBoZWlnaHRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2NrRG9jdW1lbnQoKSB7XG4gICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtbG9ja2VkJyk7XG4gICAgfVxuXG5cbiAgICAvLyAtLS0tLS0g0LvQvtCz0LjQutCwINC+0YLQutGA0YvRgtC40Y8g0LLRi9C/0LDQtNCw0YjQtdC6INGF0LXQtNC10YDQsCAtLS0tLS1cbiAgICBjb25zdCAkaGVhZGVyID0gJCgnLmpzLWhlYWRlcicpO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1oZWFkZXItZHJvcGRvd24tYnRuJywgZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgJHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IGNhdGVnb3J5ID0gJHNlbGYuYXR0cignZGF0YS1jYXRlZ29yeScpO1xuICAgICAgICBjb25zdCAkY2F0ZWdvcnlEcm9wZG93biA9ICQoYFtkYXRhLWRyb3Bkb3duLWNhdGVnb3J5PScke2NhdGVnb3J5fSddYCk7XG5cbiAgICAgICAgaWYgKCRzZWxmLmhhc0NsYXNzKCdpcy1jaG9zZW4nKSkge1xuICAgICAgICAgICAgJHNlbGYucmVtb3ZlQ2xhc3MoJ2lzLWNob3NlbicpO1xuICAgICAgICAgICAgJGNhdGVnb3J5RHJvcGRvd24ucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuanMtaGVhZGVyLWRyb3Bkb3duLWJ0bicpLnJlbW92ZUNsYXNzKCdpcy1jaG9zZW4nKTtcbiAgICAgICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkaGVhZGVyLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICRzZWxmLmFkZENsYXNzKCdpcy1jaG9zZW4nKTtcbiAgICAgICAgICAgICRjYXRlZ29yeURyb3Bkb3duLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIGNsb3NlRHJvcGRvd25IYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiBjbG9zZURyb3Bkb3duSGFuZGxlcihlKSB7XG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCcuanMtaGVhZGVyJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAkKCcuanMtaGVhZGVyLWRyb3Bkb3duLWJ0bicpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9mZignY2xpY2snLCBjbG9zZURyb3Bkb3duSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLXRhYnMtbGluaycsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgJHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCk7XG5cbiAgICAgICAgaWYgKCRzZWxmLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0ICR0YWJzID0gJHNlbGYuY2xvc2VzdCgnLmpzLXRhYnMnKTtcbiAgICAgICAgY29uc3QgJHRhYnNMaW5rcyA9ICR0YWJzLmZpbmQoJy5qcy10YWJzLWxpbmsnKTtcbiAgICAgICAgY29uc3QgJHRhYnNJdGVtcyA9ICR0YWJzLmZpbmQoJy5qcy10YWJzLWl0ZW0nKTtcblxuICAgICAgICAvLyDQstGL0LrQu9GO0YfQsNC10Lwg0LLRgdC1INCw0LrRgtC40LLQvdGL0LUg0YLQsNCx0Ysg0Lgg0YHRgdGL0LvQutC4XG4gICAgICAgICR0YWJzTGlua3MucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAkdGFic0l0ZW1zLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgICAgICAvLyDQstGL0LrQu9GO0YfQsNC10Lwg0LLQsNC70LjQtNCw0YbQuNGOINGDINGB0LrRgNGL0YLRi9GFINC/0L7Qu9C10Lkg0Lgg0L7Rh9C40YnQsNC10Lwg0LjRhVxuICAgICAgICBsZXQgJGhpZGRlbkZvcm1GaWVsZHMgPSAkdGFic0l0ZW1zLmZpbmQoJ1tkYXRhLXJlcXVpcmVkXScpO1xuICAgICAgICBpZiAoJGhpZGRlbkZvcm1GaWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy5wcm9wKCdkYXRhLXJlcXVpcmVkJywgZmFsc2UpO1xuICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgncmVxdWlyZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy52YWwoJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LLQutC70Y7Rh9Cw0LXQvCDQvdGD0LbQvdGL0Lkg0YLQsNCxINC4INC00LXQu9Cw0LXQvCDQvdGD0LbQvdGD0Y4g0YHRgdGL0LvQutGDINCw0LrRgtC40LLQvdC+0LlcbiAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICBjb25zdCAkc2VsZkl0ZW0gPSAkKCRzZWxmLmF0dHIoJ2hyZWYnKSk7XG4gICAgICAgICRzZWxmSXRlbS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgLy8g0LLQutC70Y7Rh9Cw0LXQvCDQstCw0LvQuNC00LDRhtC40Y4g0YMg0YHQutGA0YvRgtGL0YUg0L/QvtC70LXQuVxuICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcyA9ICRzZWxmSXRlbS5maW5kKCdbZGF0YS1yZXF1aXJlZF0nKTtcbiAgICAgICAgaWYgKCRoaWRkZW5Gb3JtRmllbGRzLmxlbmd0aCkge1xuICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgnZGF0YS1yZXF1aXJlZCcsIHRydWUpO1xuICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgKiAgINCQ0LrRgtC40LLQuNGA0L7QstCw0YLRjC/QtNC10LfQsNC60YLQuNCy0LjRgNC+0LLQsNGC0Ywg0YHQv9C40L3QvdC10YBcbiAgICAqICAgY29uc3QgJGJsb2NrID0gJCgnLnNwaW5uZXInKTtcbiAgICAqICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcbiAgICAqICAgc3Bpbm5lci5lbmFibGVTcGlubmVyKCk7L3NwaW5uZXIuZGlzYWJsZVNwaW5uZXIoKTtcbiAgICAqXG4gICAgKi9cblxuICAgIGNsYXNzIFNwaW5uZXIge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSAgb3B0aW9ucyAgICAgICAgICAgICAgICAgICDQntCx0YrQtdC60YIg0YEg0L/QsNGA0LDQvNC10YLRgNCw0LzQuC5cbiAgICAgICAgICogQHBhcmFtICB7alF1ZXJ5fSAgb3B0aW9ucy4kYmxvY2sgICAgICAgICAgICDQqNCw0LHQu9C+0L0uXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLnZhbHVlID0gMF0gICAgICAg0J3QsNGH0LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLm1pbiA9IC1JbmZpbml0eV0g0JzQuNC90LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5tYXggPSBJbmZpbml0eV0gINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5zdGVwID0gMV0gICAgICAgINCo0LDQsy5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMucHJlY2lzaW9uXSAgICAgICDQotC+0YfQvdC+0YHRgtGMICjQvdGD0LbQvdCwINC00LvRjyDQtNC10YHRj9GC0LjRh9C90L7Qs9C+INGI0LDQs9CwKS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHsgJGJsb2NrLCB2YWx1ZSA9IDAsIG1pbiA9IC1JbmZpbml0eSwgbWF4ID0gSW5maW5pdHksIHN0ZXAgPSAxLCBwcmVjaXNpb24gfSA9IHt9KSB7XG4gICAgICAgICAgICB0aGlzLiRibG9jayA9ICRibG9jaztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMgPSB7XG4gICAgICAgICAgICAgICAgJGRlYzogJCgnLnNwaW5uZXJfX2J0bi0tZGVjJywgdGhpcy4kYmxvY2spLFxuICAgICAgICAgICAgICAgICRpbmM6ICQoJy5zcGlubmVyX19idG4tLWluYycsIHRoaXMuJGJsb2NrKSxcbiAgICAgICAgICAgICAgICAkaW5wdXQ6ICQoJy5zcGlubmVyX19pbnB1dCcsIHRoaXMuJGJsb2NrKSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSArdmFsdWU7XG4gICAgICAgICAgICB0aGlzLm1pbiA9ICttaW47XG4gICAgICAgICAgICB0aGlzLm1heCA9ICttYXg7XG4gICAgICAgICAgICB0aGlzLnN0ZXAgPSArc3RlcDtcbiAgICAgICAgICAgIHRoaXMucHJlY2lzaW9uID0gK3ByZWNpc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQn9GA0LjQstC+0LTQuNGCINGA0LDQt9C80LXRgtC60YMg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC1INC/0LDRgNCw0LzQtdGC0YDQsNC8LlxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9ucygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDRgdC+0YHRgtC+0Y/QvdC40LUg0LHQu9C+0LrQuNGA0L7QstC60Lgg0LrQvdC+0L/QvtC6LlxuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlQnV0dG9ucygpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGRlYy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGluYy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPCB0aGlzLm1pbiArIHRoaXMuc3RlcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGRlYy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA+IHRoaXMubWF4IC0gdGhpcy5zdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5jLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0J7RgtC60LvRjtGH0LXQvdC40LUg0YHQv9C40L3QvdC10YDQsC5cbiAgICAgICAgICovXG4gICAgICAgIGRpc2FibGVTcGlubmVyKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kZGVjLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbmMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQktC60LvRjtGH0LXQvdC40LUg0YHQv9C40L3QvdC10YDQsC5cbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZVNwaW5uZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2sucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0LfQvdCw0YfQtdC90LjQtSDRgdGH0ZHRgtGH0LjQutCwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUg0J3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKi9cbiAgICAgICAgY2hhbmdlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLmF0dHIoJ2RhdGEtdmFsdWUnLCB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbnB1dC5hdHRyKCd2YWx1ZScsIHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnZhbCh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0JzQtdC90Y/QtdGCINC30L3QsNGH0LXQvdC40LUg0LzQuNC90LjQvNGD0LzQsC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSB2YWx1ZSDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VNaW4odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMubWluID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hdHRyKCdkYXRhLW1pbicsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQnNC10L3Rj9C10YIg0LfQvdCw0YfQtdC90LjQtSDQvNCw0LrRgdC40LzRg9C80LAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gdmFsdWUg0J3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKi9cbiAgICAgICAgY2hhbmdlTWF4KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm1heCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2suYXR0cignZGF0YS1tYXgnLCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0JzQsNGB0YHQuNCyINGB0L7Qt9C00LDQvdC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIGluc3RhbmNlcyA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQndCw0YXQvtC00LjRgiDQvtCx0YrQtdC60YIg0LrQu9Cw0YHRgdCwINC/0L4g0YjQsNCx0LvQvtC90YMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge2pRdWVyeX0gJGJsb2NrINCo0LDQsdC70L7QvS5cbiAgICAgICAgICogQHJldHVybiB7U3Bpbm5lcn0gICAgICAg0J7QsdGK0LXQutGCLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIGdldEluc3RhbmNlKCRibG9jaykge1xuICAgICAgICAgICAgcmV0dXJuIFNwaW5uZXIuaW5zdGFuY2VzLmZpbmQoc3Bpbm5lciA9PiBzcGlubmVyLiRibG9jay5pcygkYmxvY2spKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQodC+0LfQtNCw0ZHRgiDQvtCx0YrQtdC60YLRiyDQv9C+INGI0LDQsdC70L7QvdCw0LwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSBbJHNwaW5uZXJzID0gJCgnLnNwaW5uZXInKV0g0KjQsNCx0LvQvtC90YsuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgY3JlYXRlKCRzcGlubmVycyA9ICQoJy5zcGlubmVyJykpIHtcbiAgICAgICAgICAgICRzcGlubmVycy5lYWNoKChpbmRleCwgYmxvY2spID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkYmxvY2sgPSAkKGJsb2NrKTtcblxuICAgICAgICAgICAgICAgIGlmIChTcGlubmVyLmdldEluc3RhbmNlKCRibG9jaykpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNwaW5uZXIgPSBuZXcgU3Bpbm5lcih7XG4gICAgICAgICAgICAgICAgICAgICRibG9jayxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICRibG9jay5hdHRyKCdkYXRhLXZhbHVlJyksXG4gICAgICAgICAgICAgICAgICAgIG1pbjogJGJsb2NrLmF0dHIoJ2RhdGEtbWluJyksXG4gICAgICAgICAgICAgICAgICAgIG1heDogJGJsb2NrLmF0dHIoJ2RhdGEtbWF4JyksXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA6ICRibG9jay5hdHRyKCdkYXRhLXN0ZXAnKSxcbiAgICAgICAgICAgICAgICAgICAgcHJlY2lzaW9uOiAkYmxvY2suYXR0cignZGF0YS1wcmVjaXNpb24nKSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICRibG9jay5oYXNDbGFzcygnaXMtZGlzYWJsZWQnKSA/IHNwaW5uZXIuZGlzYWJsZVNwaW5uZXIoKSA6IHNwaW5uZXIuaW5pdCgpO1xuXG4gICAgICAgICAgICAgICAgU3Bpbm5lci5pbnN0YW5jZXMucHVzaChzcGlubmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCj0LTQsNC70Y/QtdGCINC+0LHRitC10LrRgtGLINC/0L4g0YjQsNCx0LvQvtC90LDQvC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9IFskc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpXSDQqNCw0LHQu9C+0L3Riy5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyByZW1vdmUoJHNwaW5uZXJzID0gJCgnLnNwaW5uZXInKSkge1xuICAgICAgICAgICAgJHNwaW5uZXJzLmVhY2goKGluZGV4LCBibG9jaykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRibG9jayA9ICQoYmxvY2spO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3Bpbm5lckluZGV4ID0gU3Bpbm5lci5pbnN0YW5jZXMuZmluZEluZGV4KHNwaW5uZXIgPT4gc3Bpbm5lci4kYmxvY2suaXMoJGJsb2NrKSk7XG5cbiAgICAgICAgICAgICAgICBTcGlubmVyLmluc3RhbmNlcy5zcGxpY2Uoc3Bpbm5lckluZGV4LCAxKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5zcGlubmVyX19idG4tLWRlYycsIGhhbmRsZURlY0NsaWNrKTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnNwaW5uZXJfX2J0bi0taW5jJywgaGFuZGxlSW5jQ2xpY2spO1xuICAgICQoZG9jdW1lbnQpLm9uKCdpbnB1dCcsICcuc3Bpbm5lcl9faW5wdXQnLCBoYW5kbGVJbnB1dCk7XG5cbiAgICAvKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC/0LjQvdC90LXRgNC+0LIgKi9cbiAgICBsZXQgc3Bpbm5lcnMgPSBTcGlubmVyLmNyZWF0ZSgpO1xuXG4gICAgLyoqXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0LrQu9C40LrQsCDQv9C+INC60L3QvtC/0LrQtSDRg9C80LXQvdGM0YjQtdC90LjRjy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlINCe0LHRitC10LrRgiDRgdC+0LHRi9GC0LjRjy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYW5kbGVEZWNDbGljayhlKSB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudFRhcmdldCB9ID0gZTtcbiAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0ICRibG9jayA9ICR0YXJnZXQuY2xvc2VzdCgnLnNwaW5uZXInKTtcbiAgICAgICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBzcGlubmVyLnZhbHVlIC0gc3Bpbm5lci5zdGVwO1xuXG4gICAgICAgIGlmIChzcGlubmVyLnByZWNpc2lvbikge1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlLnRvRml4ZWQoc3Bpbm5lci5wcmVjaXNpb24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW5uZXIuY2hhbmdlVmFsdWUodmFsdWUpO1xuXG4gICAgICAgIHNwaW5uZXIudXBkYXRlQnV0dG9ucygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INC60LvQuNC60LAg0L/QviDQutC90L7Qv9C60LUg0YPQstC10LvQuNGH0LXQvdC40Y8uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZSDQntCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFuZGxlSW5jQ2xpY2soZSkge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRUYXJnZXQgfSA9IGU7XG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCAkYmxvY2sgPSAkdGFyZ2V0LmNsb3Nlc3QoJy5zcGlubmVyJyk7XG4gICAgICAgIGNvbnN0IHNwaW5uZXIgPSBTcGlubmVyLmdldEluc3RhbmNlKCRibG9jayk7XG5cbiAgICAgICAgbGV0IHZhbHVlID0gc3Bpbm5lci52YWx1ZSArIHNwaW5uZXIuc3RlcDtcblxuICAgICAgICBpZiAoc3Bpbm5lci5wcmVjaXNpb24pIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZS50b0ZpeGVkKHNwaW5uZXIucHJlY2lzaW9uKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzcGlubmVyLmNoYW5nZVZhbHVlKHZhbHVlKTtcblxuICAgICAgICBzcGlubmVyLnVwZGF0ZUJ1dHRvbnMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQstCy0L7QtNCwINCyINC/0L7Qu9C1LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGUg0J7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZUlucHV0KGUpIHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VGFyZ2V0IH0gPSBlO1xuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChjdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgJGJsb2NrID0gJHRhcmdldC5jbG9zZXN0KCcuc3Bpbm5lcicpO1xuICAgICAgICBjb25zdCBzcGlubmVyID0gU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spO1xuICAgICAgICBjb25zdCB7ICRpbnB1dCB9ID0gc3Bpbm5lci5lbGVtZW50cztcblxuICAgICAgICBsZXQgdmFsdWUgPSArJGlucHV0LnZhbCgpO1xuXG4gICAgICAgIGlmICghJGlucHV0LnZhbCgpLmxlbmd0aCB8fCB2YWx1ZSA8IHNwaW5uZXIubWluIHx8IHZhbHVlID4gc3Bpbm5lci5tYXgpIHtcbiAgICAgICAgICAgICh7IHZhbHVlIH0gPSBzcGlubmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW5uZXIuY2hhbmdlVmFsdWUodmFsdWUpO1xuXG4gICAgICAgIHNwaW5uZXIudXBkYXRlQnV0dG9ucygpO1xuICAgIH1cblxuICAgIC8vICDQutCw0YDRg9GB0LXQu9GMINC90LAg0L/QtdGA0LLQvtC8INCx0LDQvdC90LXRgNC1INC90LAg0LPQu9Cw0LLQvdC+0Lkg0YHRgtGA0LDQvdC40YbQtVxuICAgIGNvbnN0ICRuZXdzQ2Fyb3VzZWwgPSAkKCcuanMtbmV3cy1jYXJvdXNlbCcpO1xuICAgIGlmICgkbmV3c0Nhcm91c2VsLmxlbmd0aCkge1xuICAgICAgICAkbmV3c0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgIGNlbnRlck1vZGU6IGZhbHNlLFxuICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcbiAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY3LFxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiAxMDIzLFxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogJ3Vuc2xpY2snLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQv9C+0LTQsdC+0YDQsCDQsdCw0LnQutC+0LJcbiAgICBjb25zdCAkYmlrZXNDYXJvdXNlbCA9ICQoJy5qcy1iaWtlcy1jYXJvdXNlbCcpO1xuICAgIGlmICgkYmlrZXNDYXJvdXNlbC5sZW5ndGgpIHtcbiAgICAgICAgJGJpa2VzQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNoZWNrIGJpa2UgYWZ0ZXIgaW5pdFxuICAgICAgICAkYmlrZXNDYXJvdXNlbC5maW5kKCcuc2xpY2stYWN0aXZlJykuZmluZCgnaW5wdXQnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG5cbiAgICAgICAgLy8gY2hlY2sgYmlrZSBhZnRlciBjaGFuZ2VcbiAgICAgICAgJGJpa2VzQ2Fyb3VzZWwub24oJ2FmdGVyQ2hhbmdlJywgKCkgPT4ge1xuICAgICAgICAgICAgJGJpa2VzQ2Fyb3VzZWwuZmluZCgnLnNsaWNrLWFjdGl2ZScpLmZpbmQoJ2lucHV0JykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC60LDRgtC10LPQvtGA0LjQuVxuICAgIGNvbnN0ICRjYXRlZ29yaWVzQ2Fyb3VzZWwgPSAkKCcuanMtY2F0ZWdvcmllcy1jYXJvdXNlbCcpO1xuICAgIGlmICgkY2F0ZWdvcmllc0Nhcm91c2VsLmxlbmd0aCkge1xuICAgICAgICAkY2F0ZWdvcmllc0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgY2VudGVyUGFkZGluZzogJzAnLFxuICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjcsXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiAndW5zbGljaycsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC60LDRgNGC0LjQvdC+0Log0YLQvtCy0LDRgNCwXG4gICAgY29uc3QgJHByb2R1Y3RDYXJvdXNlbCA9ICQoJy5qcy1wcm9kdWN0LWNhcm91c2VsJyk7XG4gICAgaWYgKCRwcm9kdWN0Q2Fyb3VzZWwubGVuZ3RoKSB7XG4gICAgICAgICRwcm9kdWN0Q2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxuICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1hcnJvdyBidG4tYXJyb3ctLXByZXYgcHJvZHVjdC1wYWdlX19jYXJvdXNlbC1wcmV2XCI+PHN2ZyBjbGFzcz1cImljb24gaWNvbi0tYXJyb3ctbmV4dFwiPjx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWFycm93X25leHRcIj48L3VzZT48L3N2Zz48L2J1dHRvbj4nLFxuICAgICAgICAgICAgbmV4dEFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4tYXJyb3cgcHJvZHVjdC1wYWdlX19jYXJvdXNlbC1uZXh0XCI+PHN2ZyBjbGFzcz1cImljb24gaWNvbi0tYXJyb3ctbmV4dFwiPjx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWFycm93X25leHRcIj48L3VzZT48L3N2Zz48L2J1dHRvbj4nLFxuICAgICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjgsXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC/0L7RhdC+0LbQuNGFINGC0L7QstCw0YDQvtCyXG4gICAgY29uc3QgJHNpbWlsYXJDYXJvdXNlbCA9ICQoJy5qcy1zaW1pbGFyLWNhcm91c2VsJyk7XG4gICAgaWYgKCRzaW1pbGFyQ2Fyb3VzZWwubGVuZ3RoKSB7XG4gICAgICAgICRzaW1pbGFyQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnMCcsXG4gICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDYzOSxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0ICR1cEJ0biA9ICQoJy5qcy1idG4tdXAnKTtcblxuICAgIGlmICgkdXBCdG4ubGVuZ3RoKSB7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtYnRuLXVwJywgKCkgPT4ge1xuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPj0gZ2xvYmFsT3B0aW9ucy50YWJsZXRMZ1NpemUpIHtcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPiA1MCA/ICR1cEJ0bi5zaG93KCkgOiAkdXBCdG4uaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCAkZmlsdGVyTW9kYWwgPSAkKCcuanMtZmlsdGVyLW1vZGFsJyk7XG4gICAgaWYgKCRmaWx0ZXJNb2RhbC5sZW5ndGgpIHtcblxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWZpbHRlci1idG4nLCBlID0+IHtcbiAgICAgICAgICAgICRmaWx0ZXJNb2RhbC5hZGRDbGFzcygnaXMtYWN0aXZlJykuYW5pbWF0ZUNzcygnc2xpZGVJblJpZ2h0Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtZmlsdGVyLWNsb3NlJywgZSA9PiB7XG4gICAgICAgICAgICAkZmlsdGVyTW9kYWwuYW5pbWF0ZUNzcygnc2xpZGVPdXRSaWdodCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAkZmlsdGVyTW9kYWwucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykubGVuZ3RoID4gMCkge1xuICAgICAgICAvKipcbiAgICAgICAgICog0JDQvdC40LzQsNGG0LjRjyDRjdC70LXQvNC10L3RgtCwIGxhYmVsINC/0YDQuCDRhNC+0LrRg9GB0LUg0L/QvtC70LXQuSDRhNC+0YDQvNGLXG4gICAgICAgICAqL1xuICAgICAgICAkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gJChlbCkuZmluZCgnaW5wdXQsIHRleHRhcmVhJyk7XG5cbiAgICAgICAgICAgIGlmICgkKGZpZWxkKS52YWwoKS50cmltKCkgIT0gJycgfHwgJChmaWVsZCkuaXMoJzpwbGFjZWhvbGRlci1zaG93bicpKSB7XG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKGZpZWxkKS5vbignZm9jdXMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICQoZWwpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcbiAgICAgICAgICAgIH0pLm9uKCdibHVyJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKS50cmltKCkgPT09ICcnICYmICEkKGZpZWxkKS5pcygnOnBsYWNlaG9sZGVyLXNob3duJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJChlbCkucmVtb3ZlQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiBAc2VlIGh0dHBzOi8vYXRvbWlrcy5naXRodWIuaW8vdGlwcHlqcy8gKi9cblxuICAgIGNvbnN0IHRvb2x0aXBTZXR0aW5ncyA9IHtcbiAgICAgICAgYXJyb3c6IGZhbHNlLFxuICAgICAgICBhbGxvd0hUTUw6IGZhbHNlLFxuICAgICAgICBhbmltYXRlRmlsbDogZmFsc2UsXG4gICAgICAgIHBsYWNlbWVudDogJ3JpZ2h0LWNlbnRlcicsXG4gICAgICAgIGRpc3RhbmNlOiAyMCxcbiAgICAgICAgdGhlbWU6ICd0b29sdGlwJ1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBpbml0IGFsbCB0b29sdGlwc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXRUb29sdGlwcygpIHtcbiAgICAgICAgJCgnW2RhdGEtdG9vbHRpcF0nKS5lYWNoKChpbmRleCwgZWxlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbG9jYWxTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAkKGVsZW0pLmF0dHIoJ2RhdGEtdG9vbHRpcCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJChlbGVtKS5kYXRhKCdjbGljaycpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTZXR0aW5nc1sndHJpZ2dlciddID0gJ2NsaWNrIGtleXVwJztcbiAgICAgICAgICAgICAgICBsb2NhbFNldHRpbmdzWydpbnRlcmFjdGl2ZSddID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGlwcHkoZWxlbSwgT2JqZWN0LmFzc2lnbih7fSwgdG9vbHRpcFNldHRpbmdzLCBsb2NhbFNldHRpbmdzKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRUb29sdGlwcygpO1xuXG4gICAgLy8gc2hvcCBhZGRyZXNzXG4gICAgLy8g0JzQvtGB0LrQvtCy0YHQutCw0Y8g0L7QsdC70LDRgtGMLCDQodC+0LvQvdC10YfQvdC+0LPQvtGA0YHQutC40Lkg0YDQsNC50L7QvSwg0LQuINCU0YPRgNGL0LrQuNC90L4sIDHQlC5cbiAgICBjb25zdCBzaG9wID0ge2xhdDogNTYuMDU5Njk1LCBsbmc6IDM3LjE0NDE0Mn07XG5cbiAgICAvLyBmb3IgYmxhY2sgbWFwXG4gICAgY29uc3QgbWFwU3R5bGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMyMTIxMjFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLmljb25cIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM3NTc1NzVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuc3Ryb2tlXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjMjEyMTIxXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM3NTc1NzVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmUuY291bnRyeVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM5ZTllOWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmUubGFuZF9wYXJjZWxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlLmxvY2FsaXR5XCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiI2JkYmRiZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2lcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNzU3NTc1XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5wYXJrXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMxODE4MThcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLnBhcmtcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNjE2MTYxXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5wYXJrXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuc3Ryb2tlXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjMWIxYjFiXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWRcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjMmMyYzJjXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWRcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjOGE4YThhXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuYXJ0ZXJpYWxcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzM3MzczN1wiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXlcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzNjM2MzY1wiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXkuY29udHJvbGxlZF9hY2Nlc3NcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzRlNGU0ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmxvY2FsXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzYxNjE2MVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ0cmFuc2l0XCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzc1NzU3NVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjMDAwMDAwXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzNkM2QzZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdXG5cbiAgICAvLyBJbml0aWFsaXplIGFuZCBhZGQgdGhlIG1hcFxuICAgIGZ1bmN0aW9uIGluaXRNYXAoKSB7XG4gICAgICAgIC8vIFRoZSBtYXAsIGNlbnRlcmVkIGF0IFNob3BcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgICAgICAgICAgICAgIHpvb206IDE0LFxuICAgICAgICAgICAgICAgIGNlbnRlcjogc2hvcCxcbiAgICAgICAgICAgICAgICBzdHlsZXM6IG1hcFN0eWxlcyxcbiAgICAgICAgICAgICAgICB6b29tQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2NhbGVDb250cm9sOiB0cnVlLFxuICAgICAgICAgICAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByb3RhdGVDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBmdWxsc2NyZWVuQ29udHJvbDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcG9pbnRJY29uID0ge1xuICAgICAgICAgICAgdXJsOiAnaW1nL3N2Zy9wb2ludC5zdmcnLFxuICAgICAgICAgICAgLy8gVGhpcyBtYXJrZXIgaXMgNzIgcGl4ZWxzIHdpZGUgYnkgNzIgcGl4ZWxzIGhpZ2guXG4gICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSg3MiwgNzIpLFxuICAgICAgICAgICAgLy8gVGhlIG9yaWdpbiBmb3IgdGhpcyBpbWFnZSBpcyAoMCwgMCkuXG4gICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgIC8vIFRoZSBhbmNob3IgZm9yIHRoaXMgaW1hZ2UgaXMgdGhlIGNlbnRlciBhdCAoMCwgMzIpLlxuICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMzYsIDM2KVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRoZSBtYXJrZXIsIHBvc2l0aW9uZWQgYXQgc2hvcFxuICAgICAgICBjb25zdCBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBzaG9wLFxuICAgICAgICAgICAgaWNvbjogcG9pbnRJY29uLFxuICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHdpbmRvdy5pbml0TWFwID0gaW5pdE1hcDtcblxuO1xufSk7XG4iXSwiZmlsZSI6ImludGVybmFsLmpzIn0=

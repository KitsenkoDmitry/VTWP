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
    var $tabsItems = $tabs.find('.js-tabs-item');
    $tabsLinks.removeClass('is-active');
    $tabsItems.removeClass('is-active');
    $self.addClass('is-active');
    $($self.attr('href')).addClass('is-active');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wTGdTaXplIiwiZGVza3RvcE1kU2l6ZSIsImRlc2t0b3BTaXplIiwiZGVza3RvcFNtU2l6ZSIsInRhYmxldExnU2l6ZSIsInRhYmxldFNpemUiLCJtb2JpbGVMZ1NpemUiLCJtb2JpbGVTaXplIiwibGFuZyIsImF0dHIiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnREZXNrdG9wTGciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYnJlYWtwb2ludERlc2t0b3BNZCIsImJyZWFrcG9pbnREZXNrdG9wIiwiYnJlYWtwb2ludERlc2t0b3BTbSIsImJyZWFrcG9pbnRUYWJsZXRMZyIsImJyZWFrcG9pbnRUYWJsZXQiLCJicmVha3BvaW50TW9iaWxlTGdTaXplIiwiYnJlYWtwb2ludE1vYmlsZSIsImV4dGVuZCIsIm9uIiwibGVuZ3RoIiwiYXV0b3NpemUiLCJmbiIsImFuaW1hdGVDc3MiLCJhbmltYXRpb25OYW1lIiwiY2FsbGJhY2siLCJhbmltYXRpb25FbmQiLCJlbCIsImFuaW1hdGlvbnMiLCJhbmltYXRpb24iLCJPQW5pbWF0aW9uIiwiTW96QW5pbWF0aW9uIiwiV2Via2l0QW5pbWF0aW9uIiwidCIsInN0eWxlIiwidW5kZWZpbmVkIiwiY3JlYXRlRWxlbWVudCIsImFkZENsYXNzIiwib25lIiwicmVtb3ZlQ2xhc3MiLCJpc051bWVyaWMiLCJuIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJyZW1vdmVOb3REaWdpdHMiLCJwYXJhbSIsInRvU3RyaW5nIiwicmVwbGFjZSIsImRpdmlkZUJ5RGlnaXRzIiwibG9jYWxlIiwiUGFyc2xleSIsInNldExvY2FsZSIsIm9wdGlvbnMiLCJ0cmlnZ2VyIiwidmFsaWRhdGlvblRocmVzaG9sZCIsImVycm9yc1dyYXBwZXIiLCJlcnJvclRlbXBsYXRlIiwiY2xhc3NIYW5kbGVyIiwiaW5zdGFuY2UiLCIkZWxlbWVudCIsInR5cGUiLCIkaGFuZGxlciIsImhhc0NsYXNzIiwibmV4dCIsImVycm9yc0NvbnRhaW5lciIsIiRjb250YWluZXIiLCJjbG9zZXN0IiwicGFyZW50IiwiYWRkVmFsaWRhdG9yIiwidmFsaWRhdGVTdHJpbmciLCJ2YWx1ZSIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJkYXRhIiwibWF4IiwibWluRGF0ZSIsIm1heERhdGUiLCJ2YWx1ZURhdGUiLCJyZXN1bHQiLCJtYXRjaCIsIkRhdGUiLCJtYXhTaXplIiwicGFyc2xleUluc3RhbmNlIiwiZmlsZXMiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsImkiLCIkYmxvY2siLCIkbGFzdCIsImFmdGVyIiwiZWxlbWVudCIsInBhcnNsZXkiLCJpbnB1dG1hc2siLCJjbGVhck1hc2tPbkxvc3RGb2N1cyIsInNob3dNYXNrT25Ib3ZlciIsIkN1c3RvbVNlbGVjdCIsIiRlbGVtIiwic2VsZiIsImluaXQiLCIkaW5pdEVsZW0iLCJlYWNoIiwic2VsZWN0U2VhcmNoIiwibWluaW11bVJlc3VsdHNGb3JTZWFyY2giLCJJbmZpbml0eSIsInNlbGVjdDIiLCJzZWxlY3RPbkJsdXIiLCJkcm9wZG93bkNzc0NsYXNzIiwibGFuZ3VhZ2UiLCJub1Jlc3VsdHMiLCJlIiwiZmluZCIsImNsaWNrIiwidXBkYXRlIiwiJHVwZGF0ZUVsZW0iLCJjdXN0b21TZWxlY3QiLCJkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMiLCJkYXRlRm9ybWF0Iiwic2hvd090aGVyTW9udGhzIiwiRGF0ZXBpY2tlciIsImRhdGVwaWNrZXIiLCJzaG93TVkiLCJjdXJyZW50RGF0ZSIsImN1cnJlbnREYXkiLCJnZXREYXRlIiwibmV3RGF0ZSIsImdldE1vbnRoIiwiZ2V0RnVsbFllYXIiLCJpdGVtT3B0aW9ucyIsIm9uU2VsZWN0IiwiY2hhbmdlIiwic2V0VGltZW91dCIsIiRtb2JpbGVNZW51IiwiJGNhcnRNb2RhbCIsIm9wZW5Nb2RhbCIsImhpZGVNb2RhbCIsInByZXZlbnREZWZhdWx0IiwiJG1vZGFsQmxvY2siLCJsb2NrRG9jdW1lbnQiLCJ1bmxvY2tEb2N1bWVudCIsIiRoZWFkZXIiLCIkc2VsZiIsImN1cnJlbnRUYXJnZXQiLCJjYXRlZ29yeSIsIiRjYXRlZ29yeURyb3Bkb3duIiwiY2xvc2VEcm9wZG93bkhhbmRsZXIiLCJ0YXJnZXQiLCJvZmYiLCIkdGFicyIsIiR0YWJzTGlua3MiLCIkdGFic0l0ZW1zIiwiU3Bpbm5lciIsInN0ZXAiLCJwcmVjaXNpb24iLCJlbGVtZW50cyIsIiRkZWMiLCIkaW5jIiwiJGlucHV0IiwidXBkYXRlQnV0dG9ucyIsInByb3AiLCJ2YWwiLCJpbnN0YW5jZXMiLCJzcGlubmVyIiwiaXMiLCIkc3Bpbm5lcnMiLCJpbmRleCIsImJsb2NrIiwiZ2V0SW5zdGFuY2UiLCJkaXNhYmxlU3Bpbm5lciIsInB1c2giLCJzcGlubmVySW5kZXgiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJoYW5kbGVEZWNDbGljayIsImhhbmRsZUluY0NsaWNrIiwiaGFuZGxlSW5wdXQiLCJzcGlubmVycyIsImNyZWF0ZSIsIiR0YXJnZXQiLCJ0b0ZpeGVkIiwiY2hhbmdlVmFsdWUiLCIkbmV3c0Nhcm91c2VsIiwic2xpY2siLCJhcnJvd3MiLCJpbmZpbml0ZSIsInNsaWRlc1RvU2hvdyIsImNlbnRlck1vZGUiLCJ2YXJpYWJsZVdpZHRoIiwibW9iaWxlRmlyc3QiLCJyZXNwb25zaXZlIiwiYnJlYWtwb2ludCIsInNldHRpbmdzIiwiJGJpa2VzQ2Fyb3VzZWwiLCIkY2F0ZWdvcmllc0Nhcm91c2VsIiwiY2VudGVyUGFkZGluZyIsImRvdHMiLCIkcHJvZHVjdENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJHNpbWlsYXJDYXJvdXNlbCIsIiR1cEJ0biIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJ3aWR0aCIsInNob3ciLCJoaWRlIiwiJGZpbHRlck1vZGFsIiwiZmllbGQiLCJ0cmltIiwiZXZlbnQiLCJ0b29sdGlwU2V0dGluZ3MiLCJhcnJvdyIsImFsbG93SFRNTCIsImFuaW1hdGVGaWxsIiwicGxhY2VtZW50IiwiZGlzdGFuY2UiLCJ0aGVtZSIsImluaXRUb29sdGlwcyIsImVsZW0iLCJsb2NhbFNldHRpbmdzIiwiY29udGVudCIsInRpcHB5IiwiT2JqZWN0IiwiYXNzaWduIiwic2hvcCIsImxhdCIsImxuZyIsIm1hcFN0eWxlcyIsImluaXRNYXAiLCJtYXAiLCJnb29nbGUiLCJtYXBzIiwiTWFwIiwiZ2V0RWxlbWVudEJ5SWQiLCJ6b29tIiwiY2VudGVyIiwic3R5bGVzIiwiem9vbUNvbnRyb2wiLCJtYXBUeXBlQ29udHJvbCIsInNjYWxlQ29udHJvbCIsInN0cmVldFZpZXdDb250cm9sIiwicm90YXRlQ29udHJvbCIsImZ1bGxzY3JlZW5Db250cm9sIiwicG9pbnRJY29uIiwidXJsIiwiU2l6ZSIsIm9yaWdpbiIsIlBvaW50IiwiYW5jaG9yIiwibWFya2VyIiwiTWFya2VyIiwicG9zaXRpb24iLCJpY29uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBVztBQUN6Qjs7O0FBR0EsTUFBSUMsYUFBYSxHQUFHO0FBQ2hCO0FBQ0FDLElBQUFBLElBQUksRUFBRyxHQUZTO0FBSWhCO0FBQ0FDLElBQUFBLGFBQWEsRUFBRyxJQUxBO0FBTWhCQyxJQUFBQSxhQUFhLEVBQUcsSUFOQTtBQU9oQkMsSUFBQUEsV0FBVyxFQUFLLElBUEE7QUFRaEJDLElBQUFBLGFBQWEsRUFBRyxJQVJBO0FBU2hCQyxJQUFBQSxZQUFZLEVBQUksSUFUQTtBQVVoQkMsSUFBQUEsVUFBVSxFQUFNLEdBVkE7QUFXaEJDLElBQUFBLFlBQVksRUFBSSxHQVhBO0FBWWhCQyxJQUFBQSxVQUFVLEVBQU0s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ZjtBQUtIOztBQUVEeE8sRUFBQUEsTUFBTSxDQUFDdU8sT0FBUCxHQUFpQkEsT0FBakI7QUFFSjtBQUNDLENBcHZDRCIsInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqINCT0LvQvtCx0LDQu9GM0L3Ri9C1INC/0LXRgNC10LzQtdC90L3Ri9C1LCDQutC+0YLQvtGA0YvQtSDQuNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8g0LzQvdC+0LPQvtC60YDQsNGC0L3QvlxuICAgICAqL1xuICAgIGxldCBnbG9iYWxPcHRpb25zID0ge1xuICAgICAgICAvLyDQktGA0LXQvNGPINC00LvRjyDQsNC90LjQvNCw0YbQuNC5XG4gICAgICAgIHRpbWU6ICAyMDAsXG5cbiAgICAgICAgLy8g0JrQvtC90YLRgNC+0LvRjNC90YvQtSDRgtC+0YfQutC4INCw0LTQsNC/0YLQuNCy0LBcbiAgICAgICAgZGVza3RvcExnU2l6ZTogIDE5MTAsXG4gICAgICAgIGRlc2t0b3BNZFNpemU6ICAxNjAwLFxuICAgICAgICBkZXNrdG9wU2l6ZTogICAgMTQ4MCxcbiAgICAgICAgZGVza3RvcFNtU2l6ZTogIDEyODAsXG4gICAgICAgIHRhYmxldExnU2l6ZTogICAxMDI0LFxuICAgICAgICB0YWJsZXRTaXplOiAgICAgNzY4LFxuICAgICAgICBtb2JpbGVMZ1NpemU6ICAgNjQwLFxuICAgICAgICBtb2JpbGVTaXplOiAgICAgNDgwLFxuXG4gICAgICAgIGxhbmc6ICQoJ2h0bWwnKS5hdHRyKCdsYW5nJylcbiAgICB9O1xuXG4gICAgLy8g0JHRgNC10LnQutC/0L7QuNC90YLRiyDQsNC00LDQv9GC0LjQstCwXG4gICAgLy8gQGV4YW1wbGUgaWYgKGdsb2JhbE9wdGlvbnMuYnJlYWtwb2ludFRhYmxldC5tYXRjaGVzKSB7fSBlbHNlIHt9XG4gICAgY29uc3QgYnJlYWtwb2ludHMgPSB7XG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wTGc6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcExnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wTWQ6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcE1kU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BTbTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wU21TaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludFRhYmxldExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldExnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXQ6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMudGFibGV0U2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGVMZ1NpemU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlTGdTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludE1vYmlsZTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5tb2JpbGVTaXplIC0gMX1weClgKVxuICAgIH07XG5cbiAgICAkLmV4dGVuZCh0cnVlLCBnbG9iYWxPcHRpb25zLCBicmVha3BvaW50cyk7XG5cbiAgICAkKHdpbmRvdykub24oJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIGlmICgkKCd0ZXh0YXJlYScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGF1dG9zaXplKCQoJ3RleHRhcmVhJykpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LTQutC70Y7Rh9C10L3QuNC1IGpzIHBhcnRpYWxzXG4gICAgICovXG4gICAgLyoqXG4gKiDQoNCw0YHRiNC40YDQtdC90LjQtSBhbmltYXRlLmNzc1xuICogQHBhcmFtICB7U3RyaW5nfSBhbmltYXRpb25OYW1lINC90LDQt9Cy0LDQvdC40LUg0LDQvdC40LzQsNGG0LjQuFxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrINGE0YPQvdC60YbQuNGPLCDQutC+0YLQvtGA0LDRjyDQvtGC0YDQsNCx0L7RgtCw0LXRgiDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcbiAqIEByZXR1cm4ge09iamVjdH0g0L7QsdGK0LXQutGCINCw0L3QuNC80LDRhtC40LhcbiAqIFxuICogQHNlZSAgaHR0cHM6Ly9kYW5lZGVuLmdpdGh1Yi5pby9hbmltYXRlLmNzcy9cbiAqIFxuICogQGV4YW1wbGVcbiAqICQoJyN5b3VyRWxlbWVudCcpLmFuaW1hdGVDc3MoJ2JvdW5jZScpO1xuICogXG4gKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnLCBmdW5jdGlvbigpIHtcbiAqICAgICAvLyDQlNC10LvQsNC10Lwg0YfRgtC+LdGC0L4g0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XG4gKiB9KTtcbiAqL1xuJC5mbi5leHRlbmQoe1xuICAgIGFuaW1hdGVDc3M6IGZ1bmN0aW9uKGFuaW1hdGlvbk5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBhbmltYXRpb25FbmQgPSAoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25zID0ge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ2FuaW1hdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgT0FuaW1hdGlvbjogJ29BbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgICAgIE1vekFuaW1hdGlvbjogJ21vekFuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgV2Via2l0QW5pbWF0aW9uOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciAobGV0IHQgaW4gYW5pbWF0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25zW3RdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuXG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb25OYW1lKS5vbmUoYW5pbWF0aW9uRW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb25OYW1lKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSk7XG4gICAgLy8g0J3QtdCx0L7Qu9GM0YjQuNC1INCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvQtSDRhNGD0L3QutGG0LjQuFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0Y/QtdGCINGH0LjRgdC70L4g0LjQu9C4INC90LXRglxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSBuINCb0Y7QsdC+0Lkg0LDRgNCz0YPQvNC10L3RglxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzTnVtZXJpYyhuKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9GP0LXRgiDQstGB0LUg0L3QtdGH0LjRgdC70L7QstGL0LUg0YHQuNC80LLQvtC70Ysg0Lgg0L/RgNC40LLQvtC00LjRgiDQuiDRh9C40YHQu9GDXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cnxudW1iZXJ9IHBhcmFtXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZW1vdmVOb3REaWdpdHMocGFyYW0pIHtcbiAgICAgICAgLyog0YPQtNCw0LvRj9C10Lwg0LLRgdC1INGB0LjQvNCy0L7Qu9GLINC60YDQvtC80LUg0YbQuNGE0YAg0Lgg0L/QtdGA0LXQstC+0LTQuNC8INCyINGH0LjRgdC70L4gKi9cbiAgICAgICAgcmV0dXJuICtwYXJhbS50b1N0cmluZygpLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0KDQsNC30LTQtdC70Y/QtdGCINC90LAg0YDQsNC30YDRj9C00YtcbiAgICAgKiDQndCw0L/RgNC40LzQtdGALCAzODAwMDAwIC0+IDMgODAwIDAwMFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJ8bnVtYmVyfSBwYXJhbVxuICAgICAqIEByZXR1cm5zIHtzdHJ9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZGl2aWRlQnlEaWdpdHMocGFyYW0pIHtcbiAgICAgICAgaWYgKHBhcmFtID09PSBudWxsKSBwYXJhbSA9IDA7XG4gICAgICAgIHJldHVybiBwYXJhbS50b1N0cmluZygpLnJlcGxhY2UoLyhcXGQpKD89KFxcZFxcZFxcZCkrKFteXFxkXXwkKSkvZywgJyQxICcpO1xuICAgIH1cblxuICAgIHZhciBsb2NhbGUgPSBnbG9iYWxPcHRpb25zLmxhbmcgPT0gJ3J1LVJVJyA/ICdydScgOiAnZW4nO1xuXG4gICAgUGFyc2xleS5zZXRMb2NhbGUobG9jYWxlKTtcblxuICAgIC8qINCd0LDRgdGC0YDQvtC50LrQuCBQYXJzbGV5ICovXG4gICAgJC5leHRlbmQoUGFyc2xleS5vcHRpb25zLCB7XG4gICAgICAgIHRyaWdnZXI6ICdibHVyIGNoYW5nZScsIC8vIGNoYW5nZSDQvdGD0LbQtdC9INC00LvRjyBzZWxlY3Qn0LBcbiAgICAgICAgdmFsaWRhdGlvblRocmVzaG9sZDogJzAnLFxuICAgICAgICBlcnJvcnNXcmFwcGVyOiAnPGRpdj48L2Rpdj4nLFxuICAgICAgICBlcnJvclRlbXBsYXRlOiAnPHAgY2xhc3M9XCJwYXJzbGV5LWVycm9yLW1lc3NhZ2VcIj48L3A+JyxcbiAgICAgICAgY2xhc3NIYW5kbGVyOiBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSBpbnN0YW5jZS4kZWxlbWVudDtcbiAgICAgICAgICAgIGxldCB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxuICAgICAgICAgICAgICAgICRoYW5kbGVyO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICAgICAkaGFuZGxlciA9ICRlbGVtZW50OyAvLyDRgtC+INC10YHRgtGMINC90LjRh9C10LPQviDQvdC1INCy0YvQtNC10LvRj9C10LwgKGlucHV0INGB0LrRgNGL0YIpLCDQuNC90LDRh9C1INCy0YvQtNC10LvRj9C10YIg0YDQvtC00LjRgtC10LvRjNGB0LrQuNC5INCx0LvQvtC6XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkKCcuc2VsZWN0Mi1zZWxlY3Rpb24tLXNpbmdsZScsICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gJGhhbmRsZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yc0NvbnRhaW5lcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyO1xuXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09ICdmaWxlJykge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5jbG9zZXN0KCcuY3VzdG9tLWZpbGUnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpID09ICdpc19yZWNhcHRjaGFfc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQucGFyZW50KCkubmV4dCgnLmctcmVjYXB0Y2hhJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICRjb250YWluZXIgPSAkZWxlbWVudC5jbG9zZXN0KCcuZmllbGQnKTtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygkY29udGFpbmVyKVxuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICByZXR1cm4gJGNvbnRhaW5lcjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0JrQsNGB0YLQvtC80L3Ri9C1INCy0LDQu9C40LTQsNGC0L7RgNGLXG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YDRg9GB0YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWVSdScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkVxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIicsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIidcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZUVuJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlthLXpcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosIFwiIFwiLCBcIi1cIicsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwgXCIgXCIsIFwiLVwiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0LvQsNGC0LjQvdGB0LrQuNC1INC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIicsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLINC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtTGV0dGVyUnUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eWzAtOdCwLdGP0ZFdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyDQkC3Qrywg0LAt0Y8sIDAtOScsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyDQkC3Qrywg0LAt0Y8sIDAtOSdcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0YssINC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlcicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtejAtOV0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIDAtOScsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0LXQu9C10YTQvtC90L3Ri9C5INC90L7QvNC10YBcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcigncGhvbmUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eWy0rMC05KCkgXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDRgtC10LvQtdGE0L7QvdC90YvQuSDQvdC+0LzQtdGAJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IHBob25lIG51bWJlcidcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtYmVyJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlswLTldKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgMC05J1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQn9C+0YfRgtCwINCx0LXQtyDQutC40YDQuNC70LvQuNGG0YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZW1haWwnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXShcXC58X3wtKXswLDF9KStbQS1aYS160JAt0K/QsC3RjzAtOVxcLV1cXEAoW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKSsoKFxcLil7MCwxfVtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSl7MSx9XFwuW2EtetCwLdGPMC05XFwtXXsyLH0kLy50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INC/0L7Rh9GC0L7QstGL0Lkg0LDQtNGA0LXRgScsXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBlbWFpbCBhZGRyZXNzJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQpNC+0YDQvNCw0YIg0LTQsNGC0YsgREQuTU0uWVlZWVxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdkYXRlJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGxldCByZWdUZXN0ID0gL14oPzooPzozMShcXC4pKD86MD9bMTM1NzhdfDFbMDJdKSlcXDF8KD86KD86Mjl8MzApKFxcLikoPzowP1sxLDMtOV18MVswLTJdKVxcMikpKD86KD86MVs2LTldfFsyLTldXFxkKT9cXGR7Mn0pJHxeKD86MjkoXFwuKTA/MlxcMyg/Oig/Oig/OjFbNi05XXxbMi05XVxcZCk/KD86MFs0OF18WzI0NjhdWzA0OF18WzEzNTc5XVsyNl0pfCg/Oig/OjE2fFsyNDY4XVswNDhdfFszNTc5XVsyNl0pMDApKSkpJHxeKD86MD9bMS05XXwxXFxkfDJbMC04XSkoXFwuKSg/Oig/OjA/WzEtOV0pfCg/OjFbMC0yXSkpXFw0KD86KD86MVs2LTldfFsyLTldXFxkKT9cXGR7NH0pJC8sXG4gICAgICAgICAgICAgICAgcmVnTWF0Y2ggPSAvKFxcZHsxLDJ9KVxcLihcXGR7MSwyfSlcXC4oXFxkezR9KS8sXG4gICAgICAgICAgICAgICAgbWluID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNaW4nKSxcbiAgICAgICAgICAgICAgICBtYXggPSBhcmd1bWVudHNbMl0uJGVsZW1lbnQuZGF0YSgnZGF0ZU1heCcpLFxuICAgICAgICAgICAgICAgIG1pbkRhdGUsIG1heERhdGUsIHZhbHVlRGF0ZSwgcmVzdWx0O1xuXG4gICAgICAgICAgICBpZiAobWluICYmIChyZXN1bHQgPSBtaW4ubWF0Y2gocmVnTWF0Y2gpKSkge1xuICAgICAgICAgICAgICAgIG1pbkRhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXggJiYgKHJlc3VsdCA9IG1heC5tYXRjaChyZWdNYXRjaCkpKSB7XG4gICAgICAgICAgICAgICAgbWF4RGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9IHZhbHVlLm1hdGNoKHJlZ01hdGNoKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlRGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVnVGVzdC50ZXN0KHZhbHVlKSAmJiAobWluRGF0ZSA/IHZhbHVlRGF0ZSA+PSBtaW5EYXRlIDogdHJ1ZSkgJiYgKG1heERhdGUgPyB2YWx1ZURhdGUgPD0gbWF4RGF0ZSA6IHRydWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdCw0Y8g0LTQsNGC0LAnLFxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZGF0ZSdcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICAvLyDQpNCw0LnQuyDQvtCz0YDQsNC90LjRh9C10L3QvdC+0LPQviDRgNCw0LfQvNC10YDQsFxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlTWF4U2l6ZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlLCBtYXhTaXplLCBwYXJzbGV5SW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGxldCBmaWxlcyA9IHBhcnNsZXlJbnN0YW5jZS4kZWxlbWVudFswXS5maWxlcztcbiAgICAgICAgICAgIHJldHVybiBmaWxlcy5sZW5ndGggIT0gMSAgfHwgZmlsZXNbMF0uc2l6ZSA8PSBtYXhTaXplICogMTAyNDtcbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWlyZW1lbnRUeXBlOiAnaW50ZWdlcicsXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Ck0LDQudC7INC00L7Qu9C20LXQvSDQstC10YHQuNGC0Ywg0L3QtSDQsdC+0LvQtdC1LCDRh9C10LwgJXMgS2InLFxuICAgICAgICAgICAgZW46ICdGaWxlIHNpemUgY2FuXFwndCBiZSBtb3JlIHRoZW4gJXMgS2InXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCe0LPRgNCw0L3QuNGH0LXQvdC40Y8g0YDQsNGB0YjQuNGA0LXQvdC40Lkg0YTQsNC50LvQvtCyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2ZpbGVFeHRlbnNpb24nLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgZm9ybWF0cykge1xuICAgICAgICAgICAgbGV0IGZpbGVFeHRlbnNpb24gPSB2YWx1ZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICAgICAgbGV0IGZvcm1hdHNBcnIgPSBmb3JtYXRzLnNwbGl0KCcsICcpO1xuICAgICAgICAgICAgbGV0IHZhbGlkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9ybWF0c0Fyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlRXh0ZW5zaW9uID09PSBmb3JtYXRzQXJyW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9CU0L7Qv9GD0YHRgtC40LzRiyDRgtC+0LvRjNC60L4g0YTQsNC50LvRiyDRhNC+0YDQvNCw0YLQsCAlcycsXG4gICAgICAgICAgICBlbjogJ0F2YWlsYWJsZSBleHRlbnNpb25zIGFyZSAlcydcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KHQvtC30LTQsNGR0YIg0LrQvtC90YLQtdC50L3QtdGA0Ysg0LTQu9GPINC+0YjQuNCx0L7QuiDRgyDQvdC10YLQuNC/0LjRh9C90YvRhSDRjdC70LXQvNC10L3RgtC+0LJcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDppbml0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCAkZWxlbWVudCA9IHRoaXMuJGVsZW1lbnQsXG4gICAgICAgICAgICB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxuICAgICAgICAgICAgJGJsb2NrID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ2Vycm9ycy1wbGFjZW1lbnQnKSxcbiAgICAgICAgICAgICRsYXN0O1xuXG4gICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICQoYFtuYW1lPVwiJHskZWxlbWVudC5hdHRyKCduYW1lJyl9XCJdOmxhc3QgKyBsYWJlbGApO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmN1c3RvbS1maWxlJyk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpLmxlbmd0aCkge1xuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpID09ICdpc19yZWNhcHRjaGFfc3VjY2VzcycpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQucGFyZW50KCkubmV4dCgnLmctcmVjYXB0Y2hhJyk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0JjQvdC40YbQuNC40YDRg9C10YIg0LLQsNC70LjQtNCw0YbQuNGOINC90LAg0LLRgtC+0YDQvtC8INC60LDQu9C10LTQsNGA0L3QvtC8INC/0L7Qu9C1INC00LjQsNC/0LDQt9C+0L3QsFxuICAgIFBhcnNsZXkub24oJ2ZpZWxkOnZhbGlkYXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgJGVsZW1lbnQgPSAkKHRoaXMuZWxlbWVudCk7XG4gICAgfSk7XG5cbiAgICAkKCdmb3JtW2RhdGEtdmFsaWRhdGU9XCJ0cnVlXCJdJykucGFyc2xleSgpO1xuXG4gICAgLyoqXG4gICAgICog0JTQvtCx0LDQstC70Y/QtdGCINC80LDRgdC60Lgg0LIg0L/QvtC70Y8g0YTQvtGA0LxcbiAgICAgKiBAc2VlICBodHRwczovL2dpdGh1Yi5jb20vUm9iaW5IZXJib3RzL0lucHV0bWFza1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8aW5wdXQgY2xhc3M9XCJqcy1waG9uZS1tYXNrXCIgdHlwZT1cInRlbFwiIG5hbWU9XCJ0ZWxcIiBpZD1cInRlbFwiPlxuICAgICAqL1xuICAgICQoJy5qcy1waG9uZS1tYXNrJykuaW5wdXRtYXNrKCcrNyg5OTkpIDk5OS05OS05OScsIHtcbiAgICAgICAgY2xlYXJNYXNrT25Mb3N0Rm9jdXM6IHRydWUsXG4gICAgICAgIHNob3dNYXNrT25Ib3ZlcjogZmFsc2VcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqINCh0YLQuNC70LjQt9GD0LXRgiDRgdC10LvQtdC60YLRiyDRgSDQv9C+0LzQvtGJ0YzRjiDQv9C70LDQs9C40L3QsCBzZWxlY3QyXG4gICAgICogaHR0cHM6Ly9zZWxlY3QyLmdpdGh1Yi5pb1xuICAgICAqL1xuICAgIGxldCBDdXN0b21TZWxlY3QgPSBmdW5jdGlvbigkZWxlbSkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi5pbml0ID0gZnVuY3Rpb24oJGluaXRFbGVtKSB7XG4gICAgICAgICAgICAkaW5pdEVsZW0uZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0U2VhcmNoID0gJCh0aGlzKS5kYXRhKCdzZWFyY2gnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gMTsgLy8g0L/QvtC60LDQt9GL0LLQsNC10Lwg0L/QvtC70LUg0L/QvtC40YHQutCwXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IEluZmluaXR5OyAvLyDQvdC1INC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zZWxlY3QyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdE9uQmx1cjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duQ3NzQ2xhc3M6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vUmVzdWx0czogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ9Ch0L7QstC/0LDQtNC10L3QuNC5INC90LUg0L3QsNC50LTQtdC90L4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINC90YPQttC90L4g0LTQu9GPINCy0YvQu9C40LTQsNGG0LjQuCDQvdCwINC70LXRgtGDXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoYG9wdGlvblt2YWx1ZT1cIiR7JCh0aGlzKS52YWx1ZX1cIl1gKS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYudXBkYXRlID0gZnVuY3Rpb24oJHVwZGF0ZUVsZW0pIHtcbiAgICAgICAgICAgICR1cGRhdGVFbGVtLnNlbGVjdDIoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHNlbGYuaW5pdCgkdXBkYXRlRWxlbSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5pbml0KCRlbGVtKTtcbiAgICB9O1xuXG4gICAgdmFyIGN1c3RvbVNlbGVjdCA9IG5ldyBDdXN0b21TZWxlY3QoJCgnc2VsZWN0JykpO1xuXG4gICAgY29uc3QgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBkYXRlRm9ybWF0OiAnZGQubW0ueXknLFxuICAgICAgICBzaG93T3RoZXJNb250aHM6IHRydWVcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog0JTQtdC70LDQtdGCINCy0YvQv9Cw0LTRjtGJ0LjQtSDQutCw0LvQtdC90LTQsNGA0LjQutC4XG4gICAgICogQHNlZSAgaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vZGF0ZXBpY2tlci9cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8g0LIgZGF0YS1kYXRlLW1pbiDQuCBkYXRhLWRhdGUtbWF4INC80L7QttC90L4g0LfQsNC00LDRgtGMINC00LDRgtGDINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXlcbiAgICAgKiA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZGF0ZUlucHV0XCIgaWQ9XCJcIiBjbGFzcz1cImpzLWRhdGVwaWNrZXJcIiBkYXRhLWRhdGUtbWluPVwiMDYuMTEuMjAxNVwiIGRhdGEtZGF0ZS1tYXg9XCIxMC4xMi4yMDE1XCI+XG4gICAgICovXG4gICAgbGV0IERhdGVwaWNrZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgZGF0ZXBpY2tlciA9ICQoJy5qcy1kYXRlcGlja2VyJyk7XG5cbiAgICAgICAgZGF0ZXBpY2tlci5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBtaW5EYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1pbicpO1xuICAgICAgICAgICAgbGV0IG1heERhdGUgPSAkKHRoaXMpLmRhdGEoJ2RhdGUtbWF4Jyk7XG4gICAgICAgICAgICBjb25zdCBzaG93TVkgPSAkKHRoaXMpLmRhdGEoJ3Nob3ctbS15Jyk7XG5cbiAgICAgICAgICAgIC8qINC10YHQu9C4INCyINCw0YLRgNC40LHRg9GC0LUg0YPQutCw0LfQsNC90L4gY3VycmVudCwg0YLQviDQstGL0LLQvtC00LjQvCDRgtC10LrRg9GJ0YPRjiDQtNCw0YLRgyAqL1xuICAgICAgICAgICAgaWYgKCBtYXhEYXRlID09PSAnY3VycmVudCcgfHwgbWluRGF0ZSA9PT0gJ2N1cnJlbnQnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50RGF5ID0gY3VycmVudERhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnREYXkgPCAxMCA/IGN1cnJlbnREYXkgPSAnMCcgKyBjdXJyZW50RGF5LnRvU3RyaW5nKCkgOiBjdXJyZW50RGF5O1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0RhdGUgPSBjdXJyZW50RGF5ICsgJy4nICsgKGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKSArICcuJyArIGN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICAgICAgbWF4RGF0ZSA9PT0gJ2N1cnJlbnQnID8gbWF4RGF0ZSA9IG5ld0RhdGUgOiBtaW5EYXRlID0gbmV3RGF0ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGl0ZW1PcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIG1pbkRhdGU6IG1pbkRhdGUgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICBtYXhEYXRlOiBtYXhEYXRlIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoYW5nZSgpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5maWVsZCcpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZihzaG93TVkpIHtcbiAgICAgICAgICAgICAgICBpdGVtT3B0aW9uc1snY2hhbmdlWWVhciddID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpdGVtT3B0aW9uc1sneWVhclJhbmdlJ10gPSAnYy0xMDA6Yyc7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ2NoYW5nZU1vbnRoJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBpdGVtT3B0aW9ucywgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5kYXRlcGlja2VyKGl0ZW1PcHRpb25zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgIC8vINC00LXQu9Cw0LXQvCDQutGA0LDRgdC40LLRi9C8INGB0LXQu9C10Log0LzQtdGB0Y/RhtCwINC4INCz0L7QtNCwXG4gICAgICAgICAkKGRvY3VtZW50KS5vbignZm9jdXMnLCAnLmpzLWRhdGVwaWNrZXInLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyDQuNGB0L/QvtC70YzQt9GD0LXQvCDQt9Cw0LTQtdGA0LbQutGDLCDRh9GC0L7QsdGLINC00LXQudGC0L/QuNC60LXRgCDRg9GB0L/QtdC7INC40L3QuNGG0LjQsNC70LjQt9C40YDQvtCy0LDRgtGM0YHRj1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoJCgnLnVpLWRhdGVwaWNrZXInKS5maW5kKCdzZWxlY3QnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnVpLWRhdGVwaWNrZXInKS5maW5kKCdzZWxlY3QnKS5zZWxlY3QyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdE9uQmx1cjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duQ3NzQ2xhc3M6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgbGV0IGRhdGVwaWNrZXIgPSBuZXcgRGF0ZXBpY2tlcigpO1xuXG4gICAgY29uc3QgJG1vYmlsZU1lbnUgPSAkKCcuanMtbW9iaWxlLW1lbnUnKTtcbiAgICBjb25zdCAkY2FydE1vZGFsID0gJCgnLmpzLWNhcnQtbW9kYWwnKTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtbWVudS1idG4nLCAoKSA9PiB7XG4gICAgICAgIG9wZW5Nb2RhbCgkbW9iaWxlTWVudSk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLW1lbnUtY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgIGhpZGVNb2RhbCgkbW9iaWxlTWVudSlcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtY2FydC1idG4nLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9wZW5Nb2RhbCgkY2FydE1vZGFsKTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtY2FydC1jbG9zZScsICgpID0+IHtcbiAgICAgICAgaGlkZU1vZGFsKCRjYXJ0TW9kYWwpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogT3BlbiBtb2RhbCBibG9ja1xuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkbW9kYWxCbG9jayBNb2RhbCBibG9ja1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIG9wZW5Nb2RhbCgkbW9kYWxCbG9jaykge1xuICAgICAgICAkbW9kYWxCbG9jay5hZGRDbGFzcygnaXMtYWN0aXZlJykuYW5pbWF0ZUNzcygnc2xpZGVJblJpZ2h0Jyk7XG4gICAgICAgIGxvY2tEb2N1bWVudCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhpZGUgbW9kYWwgYmxvY2tcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJG1vZGFsQmxvY2sgTW9kYWwgYmxvY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoaWRlTW9kYWwoJG1vZGFsQmxvY2spIHtcbiAgICAgICAgJG1vZGFsQmxvY2suYW5pbWF0ZUNzcygnc2xpZGVPdXRSaWdodCcsICgpID0+IHtcbiAgICAgICAgICAgICRtb2RhbEJsb2NrLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIHVubG9ja0RvY3VtZW50KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVubG9jayBkb2N1bWVudCBmb3Igc2Nyb2xsXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5sb2NrRG9jdW1lbnQoKSB7XG4gICAgICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnaXMtbG9ja2VkJyk7XG4gICAgICAgIC8vIC5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9jayBkb2N1bWVudCBmb3Igc2Nyb2xsXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRsb2NrQmxvY2sgQmxvY2sgd2hpY2ggZGVmaW5lIGRvY3VtZW50IGhlaWdodFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvY2tEb2N1bWVudCgpIHtcbiAgICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpcy1sb2NrZWQnKTtcbiAgICB9XG5cblxuICAgIC8vIC0tLS0tLSDQu9C+0LPQuNC60LAg0L7RgtC60YDRi9GC0LjRjyDQstGL0L/QsNC00LDRiNC10Log0YXQtdC00LXRgNCwIC0tLS0tLVxuICAgIGNvbnN0ICRoZWFkZXIgPSAkKCcuanMtaGVhZGVyJyk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWhlYWRlci1kcm9wZG93bi1idG4nLCBlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCAkc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSAkc2VsZi5hdHRyKCdkYXRhLWNhdGVnb3J5Jyk7XG4gICAgICAgIGNvbnN0ICRjYXRlZ29yeURyb3Bkb3duID0gJChgW2RhdGEtZHJvcGRvd24tY2F0ZWdvcnk9JyR7Y2F0ZWdvcnl9J11gKTtcblxuICAgICAgICBpZiAoJHNlbGYuaGFzQ2xhc3MoJ2lzLWNob3NlbicpKSB7XG4gICAgICAgICAgICAkc2VsZi5yZW1vdmVDbGFzcygnaXMtY2hvc2VuJyk7XG4gICAgICAgICAgICAkY2F0ZWdvcnlEcm9wZG93bi5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24tYnRuJykucmVtb3ZlQ2xhc3MoJ2lzLWNob3NlbicpO1xuICAgICAgICAgICAgJCgnLmpzLWhlYWRlci1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICRoZWFkZXIuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ2lzLWNob3NlbicpO1xuICAgICAgICAgICAgJGNhdGVnb3J5RHJvcGRvd24uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgY2xvc2VEcm9wZG93bkhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIGZ1bmN0aW9uIGNsb3NlRHJvcGRvd25IYW5kbGVyKGUpIHtcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5qcy1oZWFkZXInKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24tYnRuJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmpzLWhlYWRlci1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICRoZWFkZXIucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJChkb2N1bWVudCkub2ZmKCdjbGljaycsIGNsb3NlRHJvcGRvd25IYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtdGFicy1saW5rJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCAkc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICBpZiAoJHNlbGYuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgJHRhYnMgPSAkc2VsZi5jbG9zZXN0KCcuanMtdGFicycpO1xuICAgICAgICBjb25zdCAkdGFic0xpbmtzID0gJHRhYnMuZmluZCgnLmpzLXRhYnMtbGluaycpO1xuICAgICAgICBjb25zdCAkdGFic0l0ZW1zID0gJHRhYnMuZmluZCgnLmpzLXRhYnMtaXRlbScpO1xuXG4gICAgICAgICR0YWJzTGlua3MucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAkdGFic0l0ZW1zLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgICAgICAkc2VsZi5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICQoJHNlbGYuYXR0cignaHJlZicpKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAqICAg0JDQutGC0LjQstC40YDQvtCy0LDRgtGML9C00LXQt9Cw0LrRgtC40LLQuNGA0L7QstCw0YLRjCDRgdC/0LjQvdC90LXRgFxuICAgICogICBjb25zdCAkYmxvY2sgPSAkKCcuc3Bpbm5lcicpO1xuICAgICogICBjb25zdCBzcGlubmVyID0gU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spO1xuICAgICogICBzcGlubmVyLmVuYWJsZVNwaW5uZXIoKTsvc3Bpbm5lci5kaXNhYmxlU3Bpbm5lcigpO1xuICAgICpcbiAgICAqL1xuXG4gICAgY2xhc3MgU3Bpbm5lciB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9ICBvcHRpb25zICAgICAgICAgICAgICAgICAgINCe0LHRitC10LrRgiDRgSDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4LlxuICAgICAgICAgKiBAcGFyYW0gIHtqUXVlcnl9ICBvcHRpb25zLiRibG9jayAgICAgICAgICAgINCo0LDQsdC70L7QvS5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMudmFsdWUgPSAwXSAgICAgICDQndCw0YfQsNC70YzQvdC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMubWluID0gLUluZmluaXR5XSDQnNC40L3QuNC80LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLm1heCA9IEluZmluaXR5XSAg0JzQsNC60YHQuNC80LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLnN0ZXAgPSAxXSAgICAgICAg0KjQsNCzLlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5wcmVjaXNpb25dICAgICAgINCi0L7Rh9C90L7RgdGC0YwgKNC90YPQttC90LAg0LTQu9GPINC00LXRgdGP0YLQuNGH0L3QvtCz0L4g0YjQsNCz0LApLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoeyAkYmxvY2ssIHZhbHVlID0gMCwgbWluID0gLUluZmluaXR5LCBtYXggPSBJbmZpbml0eSwgc3RlcCA9IDEsIHByZWNpc2lvbiB9ID0ge30pIHtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrID0gJGJsb2NrO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cyA9IHtcbiAgICAgICAgICAgICAgICAkZGVjOiAkKCcuc3Bpbm5lcl9fYnRuLS1kZWMnLCB0aGlzLiRibG9jayksXG4gICAgICAgICAgICAgICAgJGluYzogJCgnLnNwaW5uZXJfX2J0bi0taW5jJywgdGhpcy4kYmxvY2spLFxuICAgICAgICAgICAgICAgICRpbnB1dDogJCgnLnNwaW5uZXJfX2lucHV0JywgdGhpcy4kYmxvY2spLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9ICt2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMubWluID0gK21pbjtcbiAgICAgICAgICAgIHRoaXMubWF4ID0gK21heDtcbiAgICAgICAgICAgIHRoaXMuc3RlcCA9ICtzdGVwO1xuICAgICAgICAgICAgdGhpcy5wcmVjaXNpb24gPSArcHJlY2lzaW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCf0YDQuNCy0L7QtNC40YIg0YDQsNC30LzQtdGC0LrRgyDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40LUg0L/QsNGA0LDQvNC10YLRgNCw0LwuXG4gICAgICAgICAqL1xuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b25zKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0J7QsdC90L7QstC70Y/QtdGCINGB0L7RgdGC0L7Rj9C90LjQtSDQsdC70L7QutC40YDQvtCy0LrQuCDQutC90L7Qv9C+0LouXG4gICAgICAgICAqL1xuICAgICAgICB1cGRhdGVCdXR0b25zKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kZGVjLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5jLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA8IHRoaXMubWluICsgdGhpcy5zdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kZGVjLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlID4gdGhpcy5tYXggLSB0aGlzLnN0ZXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbmMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQntGC0LrQu9GO0YfQtdC90LjQtSDRgdC/0LjQvdC90LXRgNCwLlxuICAgICAgICAgKi9cbiAgICAgICAgZGlzYWJsZVNwaW5uZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRkZWMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGluYy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5wdXQucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCS0LrQu9GO0YfQtdC90LjQtSDRgdC/0LjQvdC90LXRgNCwLlxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlU3Bpbm5lcigpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5wdXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQt9C90LDRh9C10L3QuNC1INGB0YfRkdGC0YfQuNC60LAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VWYWx1ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2suYXR0cignZGF0YS12YWx1ZScsIHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LmF0dHIoJ3ZhbHVlJywgdmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQnNC10L3Rj9C10YIg0LfQvdCw0YfQtdC90LjQtSDQvNC40L3QuNC80YPQvNCwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IHZhbHVlINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICovXG4gICAgICAgIGNoYW5nZU1pbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5taW4gPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLmF0dHIoJ2RhdGEtbWluJywgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCc0LXQvdGP0LXRgiDQt9C90LDRh9C10L3QuNC1INC80LDQutGB0LjQvNGD0LzQsC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSB2YWx1ZSDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VNYXgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMubWF4ID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hdHRyKCdkYXRhLW1heCcsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQnNCw0YHRgdC40LIg0YHQvtC30LTQsNC90L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgaW5zdGFuY2VzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCd0LDRhdC+0LTQuNGCINC+0LHRitC10LrRgiDQutC70LDRgdGB0LAg0L/QviDRiNCw0LHQu9C+0L3Rgy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7alF1ZXJ5fSAkYmxvY2sg0KjQsNCx0LvQvtC9LlxuICAgICAgICAgKiBAcmV0dXJuIHtTcGlubmVyfSAgICAgICDQntCx0YrQtdC60YIuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoJGJsb2NrKSB7XG4gICAgICAgICAgICByZXR1cm4gU3Bpbm5lci5pbnN0YW5jZXMuZmluZChzcGlubmVyID0+IHNwaW5uZXIuJGJsb2NrLmlzKCRibG9jaykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCh0L7Qt9C00LDRkdGCINC+0LHRitC10LrRgtGLINC/0L4g0YjQsNCx0LvQvtC90LDQvC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9IFskc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpXSDQqNCw0LHQu9C+0L3Riy5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyBjcmVhdGUoJHNwaW5uZXJzID0gJCgnLnNwaW5uZXInKSkge1xuICAgICAgICAgICAgJHNwaW5uZXJzLmVhY2goKGluZGV4LCBibG9jaykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRibG9jayA9ICQoYmxvY2spO1xuXG4gICAgICAgICAgICAgICAgaWYgKFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3Bpbm5lciA9IG5ldyBTcGlubmVyKHtcbiAgICAgICAgICAgICAgICAgICAgJGJsb2NrLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJGJsb2NrLmF0dHIoJ2RhdGEtdmFsdWUnKSxcbiAgICAgICAgICAgICAgICAgICAgbWluOiAkYmxvY2suYXR0cignZGF0YS1taW4nKSxcbiAgICAgICAgICAgICAgICAgICAgbWF4OiAkYmxvY2suYXR0cignZGF0YS1tYXgnKSxcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogJGJsb2NrLmF0dHIoJ2RhdGEtc3RlcCcpLFxuICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb246ICRibG9jay5hdHRyKCdkYXRhLXByZWNpc2lvbicpLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJGJsb2NrLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpID8gc3Bpbm5lci5kaXNhYmxlU3Bpbm5lcigpIDogc3Bpbm5lci5pbml0KCk7XG5cbiAgICAgICAgICAgICAgICBTcGlubmVyLmluc3RhbmNlcy5wdXNoKHNwaW5uZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0KPQtNCw0LvRj9C10YIg0L7QsdGK0LXQutGC0Ysg0L/QviDRiNCw0LHQu9C+0L3QsNC8LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gWyRzcGlubmVycyA9ICQoJy5zcGlubmVyJyldINCo0LDQsdC70L7QvdGLLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIHJlbW92ZSgkc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpKSB7XG4gICAgICAgICAgICAkc3Bpbm5lcnMuZWFjaCgoaW5kZXgsIGJsb2NrKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGJsb2NrID0gJChibG9jayk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzcGlubmVySW5kZXggPSBTcGlubmVyLmluc3RhbmNlcy5maW5kSW5kZXgoc3Bpbm5lciA9PiBzcGlubmVyLiRibG9jay5pcygkYmxvY2spKTtcblxuICAgICAgICAgICAgICAgIFNwaW5uZXIuaW5zdGFuY2VzLnNwbGljZShzcGlubmVySW5kZXgsIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnNwaW5uZXJfX2J0bi0tZGVjJywgaGFuZGxlRGVjQ2xpY2spO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc3Bpbm5lcl9fYnRuLS1pbmMnLCBoYW5kbGVJbmNDbGljayk7XG4gICAgJChkb2N1bWVudCkub24oJ2lucHV0JywgJy5zcGlubmVyX19pbnB1dCcsIGhhbmRsZUlucHV0KTtcblxuICAgIC8qINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L/QuNC90L3QtdGA0L7QsiAqL1xuICAgIGxldCBzcGlubmVycyA9IFNwaW5uZXIuY3JlYXRlKCk7XG5cbiAgICAvKipcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQutC70LjQutCwINC/0L4g0LrQvdC+0L/QutC1INGD0LzQtdC90YzRiNC10L3QuNGPLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGUg0J7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZURlY0NsaWNrKGUpIHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VGFyZ2V0IH0gPSBlO1xuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChjdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgJGJsb2NrID0gJHRhcmdldC5jbG9zZXN0KCcuc3Bpbm5lcicpO1xuICAgICAgICBjb25zdCBzcGlubmVyID0gU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHNwaW5uZXIudmFsdWUgLSBzcGlubmVyLnN0ZXA7XG5cbiAgICAgICAgaWYgKHNwaW5uZXIucHJlY2lzaW9uKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUudG9GaXhlZChzcGlubmVyLnByZWNpc2lvbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Bpbm5lci5jaGFuZ2VWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgICAgc3Bpbm5lci51cGRhdGVCdXR0b25zKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0LrQu9C40LrQsCDQv9C+INC60L3QvtC/0LrQtSDRg9Cy0LXQu9C40YfQtdC90LjRjy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlINCe0LHRitC10LrRgiDRgdC+0LHRi9GC0LjRjy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYW5kbGVJbmNDbGljayhlKSB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudFRhcmdldCB9ID0gZTtcbiAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0ICRibG9jayA9ICR0YXJnZXQuY2xvc2VzdCgnLnNwaW5uZXInKTtcbiAgICAgICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBzcGlubmVyLnZhbHVlICsgc3Bpbm5lci5zdGVwO1xuXG4gICAgICAgIGlmIChzcGlubmVyLnByZWNpc2lvbikge1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlLnRvRml4ZWQoc3Bpbm5lci5wcmVjaXNpb24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW5uZXIuY2hhbmdlVmFsdWUodmFsdWUpO1xuXG4gICAgICAgIHNwaW5uZXIudXBkYXRlQnV0dG9ucygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INCy0LLQvtC00LAg0LIg0L/QvtC70LUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZSDQntCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFuZGxlSW5wdXQoZSkge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRUYXJnZXQgfSA9IGU7XG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCAkYmxvY2sgPSAkdGFyZ2V0LmNsb3Nlc3QoJy5zcGlubmVyJyk7XG4gICAgICAgIGNvbnN0IHNwaW5uZXIgPSBTcGlubmVyLmdldEluc3RhbmNlKCRibG9jayk7XG4gICAgICAgIGNvbnN0IHsgJGlucHV0IH0gPSBzcGlubmVyLmVsZW1lbnRzO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9ICskaW5wdXQudmFsKCk7XG5cbiAgICAgICAgaWYgKCEkaW5wdXQudmFsKCkubGVuZ3RoIHx8IHZhbHVlIDwgc3Bpbm5lci5taW4gfHwgdmFsdWUgPiBzcGlubmVyLm1heCkge1xuICAgICAgICAgICAgKHsgdmFsdWUgfSA9IHNwaW5uZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Bpbm5lci5jaGFuZ2VWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgICAgc3Bpbm5lci51cGRhdGVCdXR0b25zKCk7XG4gICAgfVxuXG4gICAgLy8gINC60LDRgNGD0YHQtdC70Ywg0L3QsCDQv9C10YDQstC+0Lwg0LHQsNC90L3QtdGA0LUg0L3QsCDQs9C70LDQstC90L7QuSDRgdGC0YDQsNC90LjRhtC1XG4gICAgY29uc3QgJG5ld3NDYXJvdXNlbCA9ICQoJy5qcy1uZXdzLWNhcm91c2VsJyk7XG4gICAgaWYgKCRuZXdzQ2Fyb3VzZWwubGVuZ3RoKSB7XG4gICAgICAgICRuZXdzQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXG4gICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjcsXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMjMsXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiAndW5zbGljaycsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC/0L7QtNCx0L7RgNCwINCx0LDQudC60L7QslxuICAgIGNvbnN0ICRiaWtlc0Nhcm91c2VsID0gJCgnLmpzLWJpa2VzLWNhcm91c2VsJyk7XG4gICAgaWYgKCRiaWtlc0Nhcm91c2VsLmxlbmd0aCkge1xuICAgICAgICAkYmlrZXNDYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcbiAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY3LFxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogJ3Vuc2xpY2snLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY2hlY2sgYmlrZSBhZnRlciBpbml0XG4gICAgICAgICRiaWtlc0Nhcm91c2VsLmZpbmQoJy5zbGljay1hY3RpdmUnKS5maW5kKCdpbnB1dCcpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcblxuICAgICAgICAvLyBjaGVjayBiaWtlIGFmdGVyIGNoYW5nZVxuICAgICAgICAkYmlrZXNDYXJvdXNlbC5vbignYWZ0ZXJDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICAkYmlrZXNDYXJvdXNlbC5maW5kKCcuc2xpY2stYWN0aXZlJykuZmluZCgnaW5wdXQnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vINC60LDRgNGD0YHQtdC70Ywg0LrQsNGC0LXQs9C+0YDQuNC5XG4gICAgY29uc3QgJGNhdGVnb3JpZXNDYXJvdXNlbCA9ICQoJy5qcy1jYXRlZ29yaWVzLWNhcm91c2VsJyk7XG4gICAgaWYgKCRjYXRlZ29yaWVzQ2Fyb3VzZWwubGVuZ3RoKSB7XG4gICAgICAgICRjYXRlZ29yaWVzQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnMCcsXG4gICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vINC60LDRgNGD0YHQtdC70Ywg0LrQsNGA0YLQuNC90L7QuiDRgtC+0LLQsNGA0LBcbiAgICBjb25zdCAkcHJvZHVjdENhcm91c2VsID0gJCgnLmpzLXByb2R1Y3QtY2Fyb3VzZWwnKTtcbiAgICBpZiAoJHByb2R1Y3RDYXJvdXNlbC5sZW5ndGgpIHtcbiAgICAgICAgJHByb2R1Y3RDYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICBhcnJvd3M6IHRydWUsXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgIHByZXZBcnJvdzogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWFycm93IGJ0bi1hcnJvdy0tcHJldiBwcm9kdWN0LXBhZ2VfX2Nhcm91c2VsLXByZXZcIj48c3ZnIGNsYXNzPVwiaWNvbiBpY29uLS1hcnJvdy1uZXh0XCI+PHVzZSB4bGluazpocmVmPVwiI2ljb24tYXJyb3dfbmV4dFwiPjwvdXNlPjwvc3ZnPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1hcnJvdyBwcm9kdWN0LXBhZ2VfX2Nhcm91c2VsLW5leHRcIj48c3ZnIGNsYXNzPVwiaWNvbiBpY29uLS1hcnJvdy1uZXh0XCI+PHVzZSB4bGluazpocmVmPVwiI2ljb24tYXJyb3dfbmV4dFwiPjwvdXNlPjwvc3ZnPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3RzOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vINC60LDRgNGD0YHQtdC70Ywg0L/QvtGF0L7QttC40YUg0YLQvtCy0LDRgNC+0LJcbiAgICBjb25zdCAkc2ltaWxhckNhcm91c2VsID0gJCgnLmpzLXNpbWlsYXItY2Fyb3VzZWwnKTtcbiAgICBpZiAoJHNpbWlsYXJDYXJvdXNlbC5sZW5ndGgpIHtcbiAgICAgICAgJHNpbWlsYXJDYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcbiAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICcwJyxcbiAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNjM5LFxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogJ3Vuc2xpY2snLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgJHVwQnRuID0gJCgnLmpzLWJ0bi11cCcpO1xuXG4gICAgaWYgKCR1cEJ0bi5sZW5ndGgpIHtcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1idG4tdXAnLCAoKSA9PiB7XG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+PSBnbG9iYWxPcHRpb25zLnRhYmxldExnU2l6ZSkge1xuICAgICAgICAgICAgICAgICQod2luZG93KS5zY3JvbGxUb3AoKSA+IDUwID8gJHVwQnRuLnNob3coKSA6ICR1cEJ0bi5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0ICRmaWx0ZXJNb2RhbCA9ICQoJy5qcy1maWx0ZXItbW9kYWwnKTtcbiAgICBpZiAoJGZpbHRlck1vZGFsLmxlbmd0aCkge1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtZmlsdGVyLWJ0bicsIGUgPT4ge1xuICAgICAgICAgICAgJGZpbHRlck1vZGFsLmFkZENsYXNzKCdpcy1hY3RpdmUnKS5hbmltYXRlQ3NzKCdzbGlkZUluUmlnaHQnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1maWx0ZXItY2xvc2UnLCBlID0+IHtcbiAgICAgICAgICAgICRmaWx0ZXJNb2RhbC5hbmltYXRlQ3NzKCdzbGlkZU91dFJpZ2h0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICRmaWx0ZXJNb2RhbC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQkNC90LjQvNCw0YbQuNGPINGN0LvQtdC80LXQvdGC0LAgbGFiZWwg0L/RgNC4INGE0L7QutGD0YHQtSDQv9C+0LvQtdC5INGE0L7RgNC80YtcbiAgICAgICAgICovXG4gICAgICAgICQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgY29uc3QgZmllbGQgPSAkKGVsKS5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKTtcblxuICAgICAgICAgICAgaWYgKCQoZmllbGQpLnZhbCgpLnRyaW0oKSAhPSAnJyB8fCAkKGZpZWxkKS5pcygnOnBsYWNlaG9sZGVyLXNob3duJykpIHtcbiAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoZmllbGQpLm9uKCdmb2N1cycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgfSkub24oJ2JsdXInLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLnRyaW0oKSA9PT0gJycgJiYgISQoZmllbGQpLmlzKCc6cGxhY2Vob2xkZXItc2hvd24nKSkge1xuICAgICAgICAgICAgICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qIEBzZWUgaHR0cHM6Ly9hdG9taWtzLmdpdGh1Yi5pby90aXBweWpzLyAqL1xuXG4gICAgY29uc3QgdG9vbHRpcFNldHRpbmdzID0ge1xuICAgICAgICBhcnJvdzogZmFsc2UsXG4gICAgICAgIGFsbG93SFRNTDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGVGaWxsOiBmYWxzZSxcbiAgICAgICAgcGxhY2VtZW50OiAncmlnaHQtY2VudGVyJyxcbiAgICAgICAgZGlzdGFuY2U6IDIwLFxuICAgICAgICB0aGVtZTogJ3Rvb2x0aXAnXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIGluaXQgYWxsIHRvb2x0aXBzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdFRvb2x0aXBzKCkge1xuICAgICAgICAkKCdbZGF0YS10b29sdGlwXScpLmVhY2goKGluZGV4LCBlbGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsb2NhbFNldHRpbmdzID0ge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICQoZWxlbSkuYXR0cignZGF0YS10b29sdGlwJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKGVsZW0pLmRhdGEoJ2NsaWNrJykpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFNldHRpbmdzWyd0cmlnZ2VyJ10gPSAnY2xpY2sga2V5dXAnO1xuICAgICAgICAgICAgICAgIGxvY2FsU2V0dGluZ3NbJ2ludGVyYWN0aXZlJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aXBweShlbGVtLCBPYmplY3QuYXNzaWduKHt9LCB0b29sdGlwU2V0dGluZ3MsIGxvY2FsU2V0dGluZ3MpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFRvb2x0aXBzKCk7XG5cbiAgICAvLyBzaG9wIGFkZHJlc3NcbiAgICAvLyDQnNC+0YHQutC+0LLRgdC60LDRjyDQvtCx0LvQsNGC0YwsINCh0L7Qu9C90LXRh9C90L7Qs9C+0YDRgdC60LjQuSDRgNCw0LnQvtC9LCDQtC4g0JTRg9GA0YvQutC40L3QviwgMdCULlxuICAgIGNvbnN0IHNob3AgPSB7bGF0OiA1Ni4wNTk2OTUsIGxuZzogMzcuMTQ0MTQyfTtcblxuICAgIC8vIGZvciBibGFjayBtYXBcbiAgICBjb25zdCBtYXBTdHlsZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzIxMjEyMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMuaWNvblwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzc1NzU3NVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5zdHJva2VcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMyMTIxMjFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzc1NzU3NVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZS5jb3VudHJ5XCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzllOWU5ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZS5sYW5kX3BhcmNlbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmUubG9jYWxpdHlcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjYmRiZGJkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM3NTc1NzVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLnBhcmtcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzE4MTgxOFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kucGFya1wiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM2MTYxNjFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLnBhcmtcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5zdHJva2VcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMxYjFiMWJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZFwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMyYzJjMmNcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZFwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM4YThhOGFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5hcnRlcmlhbFwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjMzczNzM3XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjM2MzYzNjXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheS5jb250cm9sbGVkX2FjY2Vzc1wiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNGU0ZTRlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQubG9jYWxcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNjE2MTYxXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInRyYW5zaXRcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNzU3NTc1XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMwMDAwMDBcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjM2QzZDNkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF1cblxuICAgIC8vIEluaXRpYWxpemUgYW5kIGFkZCB0aGUgbWFwXG4gICAgZnVuY3Rpb24gaW5pdE1hcCgpIHtcbiAgICAgICAgLy8gVGhlIG1hcCwgY2VudGVyZWQgYXQgU2hvcFxuICAgICAgICBjb25zdCBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgICAgICAgICAgem9vbTogMTQsXG4gICAgICAgICAgICAgICAgY2VudGVyOiBzaG9wLFxuICAgICAgICAgICAgICAgIHN0eWxlczogbWFwU3R5bGVzLFxuICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzY2FsZUNvbnRyb2w6IHRydWUsXG4gICAgICAgICAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJvdGF0ZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZ1bGxzY3JlZW5Db250cm9sOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBwb2ludEljb24gPSB7XG4gICAgICAgICAgICB1cmw6ICdpbWcvc3ZnL3BvaW50LnN2ZycsXG4gICAgICAgICAgICAvLyBUaGlzIG1hcmtlciBpcyA3MiBwaXhlbHMgd2lkZSBieSA3MiBwaXhlbHMgaGlnaC5cbiAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDcyLCA3MiksXG4gICAgICAgICAgICAvLyBUaGUgb3JpZ2luIGZvciB0aGlzIGltYWdlIGlzICgwLCAwKS5cbiAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgLy8gVGhlIGFuY2hvciBmb3IgdGhpcyBpbWFnZSBpcyB0aGUgY2VudGVyIGF0ICgwLCAzMikuXG4gICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgzNiwgMzYpXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVGhlIG1hcmtlciwgcG9zaXRpb25lZCBhdCBzaG9wXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgcG9zaXRpb246IHNob3AsXG4gICAgICAgICAgICBpY29uOiBwb2ludEljb24sXG4gICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgd2luZG93LmluaXRNYXAgPSBpbml0TWFwO1xuXG47XG59KTtcbiJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==

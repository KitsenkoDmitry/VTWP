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
  } // немного специфичные табы. Используются на странице checkout.html. При желании можно доработать


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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wTGdTaXplIiwiZGVza3RvcE1kU2l6ZSIsImRlc2t0b3BTaXplIiwiZGVza3RvcFNtU2l6ZSIsInRhYmxldExnU2l6ZSIsInRhYmxldFNpemUiLCJtb2JpbGVMZ1NpemUiLCJtb2JpbGVTaXplIiwibGFuZyIsImF0dHIiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnREZXNrdG9wTGciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYnJlYWtwb2ludERlc2t0b3BNZCIsImJyZWFrcG9pbnREZXNrdG9wIiwiYnJlYWtwb2ludERlc2t0b3BTbSIsImJyZWFrcG9pbnRUYWJsZXRMZyIsImJyZWFrcG9pbnRUYWJsZXQiLCJicmVha3BvaW50TW9iaWxlTGdTaXplIiwiYnJlYWtwb2ludE1vYmlsZSIsImV4dGVuZCIsIm9uIiwibGVuZ3RoIiwiYXV0b3NpemUiLCJmbiIsImFuaW1hdGVDc3MiLCJhbmltYXRpb25OYW1lIiwiY2FsbGJhY2siLCJhbmltYXRpb25FbmQiLCJlbCIsImFuaW1hdGlvbnMiLCJhbmltYXRpb24iLCJPQW5pbWF0aW9uIiwiTW96QW5pbWF0aW9uIiwiV2Via2l0QW5pbWF0aW9uIiwidCIsInN0eWxlIiwidW5kZWZpbmVkIiwiY3JlYXRlRWxlbWVudCIsImFkZENsYXNzIiwib25lIiwicmVtb3ZlQ2xhc3MiLCJpc051bWVyaWMiLCJuIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJyZW1vdmVOb3REaWdpdHMiLCJwYXJhbSIsInRvU3RyaW5nIiwicmVwbGFjZSIsImRpdmlkZUJ5RGlnaXRzIiwibG9jYWxlIiwiUGFyc2xleSIsInNldExvY2FsZSIsIm9wdGlvbnMiLCJ0cmlnZ2VyIiwidmFsaWRhdGlvblRocmVzaG9sZCIsImVycm9yc1dyYXBwZXIiLCJlcnJvclRlbXBsYXRlIiwiY2xhc3NIYW5kbGVyIiwiaW5zdGFuY2UiLCIkZWxlbWVudCIsInR5cGUiLCIkaGFuZGxlciIsImhhc0NsYXNzIiwibmV4dCIsImVycm9yc0NvbnRhaW5lciIsIiRjb250YWluZXIiLCJjbG9zZXN0IiwicGFyZW50IiwiYWRkVmFsaWRhdG9yIiwidmFsaWRhdGVTdHJpbmciLCJ2YWx1ZSIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJkYXRhIiwibWF4IiwibWluRGF0ZSIsIm1heERhdGUiLCJ2YWx1ZURhdGUiLCJyZXN1bHQiLCJtYXRjaCIsIkRhdGUiLCJtYXhTaXplIiwicGFyc2xleUluc3RhbmNlIiwiZmlsZXMiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsImkiLCIkYmxvY2siLCIkbGFzdCIsImFmdGVyIiwiZWxlbWVudCIsInBhcnNsZXkiLCJlIiwiJHNlbGYiLCJjdXJyZW50VGFyZ2V0IiwiJGNvbGxhcHNlQm9keSIsImZpbmQiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwiaW5wdXRtYXNrIiwiY2xlYXJNYXNrT25Mb3N0Rm9jdXMiLCJzaG93TWFza09uSG92ZXIiLCJDdXN0b21TZWxlY3QiLCIkZWxlbSIsInNlbGYiLCJpbml0IiwiJGluaXRFbGVtIiwiZWFjaCIsInNlbGVjdFNlYXJjaCIsIm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIiwiSW5maW5pdHkiLCJzZWxlY3QyIiwic2VsZWN0T25CbHVyIiwiZHJvcGRvd25Dc3NDbGFzcyIsImxhbmd1YWdlIiwibm9SZXN1bHRzIiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbVNlbGVjdCIsImRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyIsImRhdGVGb3JtYXQiLCJzaG93T3RoZXJNb250aHMiLCJEYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsInNob3dNWSIsImN1cnJlbnREYXRlIiwiY3VycmVudERheSIsImdldERhdGUiLCJuZXdEYXRlIiwiZ2V0TW9udGgiLCJnZXRGdWxsWWVhciIsIml0ZW1PcHRpb25zIiwib25TZWxlY3QiLCJjaGFuZ2UiLCJzZXRUaW1lb3V0IiwiJG1vYmlsZU1lbnUiLCIkY2FydE1vZGFsIiwib3Blbk1vZGFsIiwiaGlkZU1vZGFsIiwicHJldmVudERlZmF1bHQiLCIkbW9kYWxCbG9jayIsImxvY2tEb2N1bWVudCIsInVubG9ja0RvY3VtZW50IiwiJGhlYWRlciIsImNhdGVnb3J5IiwiJGNhdGVnb3J5RHJvcGRvd24iLCJjbG9zZURyb3Bkb3duSGFuZGxlciIsInRhcmdldCIsIm9mZiIsIiR0YWJzIiwiJHRhYnNMaW5rcyIsIiR0YWJzSXRlbXMiLCIkaGlkZGVuRm9ybUZpZWxkcyIsInByb3AiLCJ2YWwiLCIkc2VsZkl0ZW0iLCJTcGlubmVyIiwic3RlcCIsInByZWNpc2lvbiIsImVsZW1lbnRzIiwiJGRlYyIsIiRpbmMiLCIkaW5wdXQiLCJ1cGRhdGVCdXR0b25zIiwiaW5zdGFuY2VzIiwic3Bpbm5lciIsImlzIiwiJHNwaW5uZXJzIiwiaW5kZXgiLCJibG9jayIsImdldEluc3RhbmNlIiwiZGlzYWJsZVNwaW5uZXIiLCJwdXNoIiwic3Bpbm5lckluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwiaGFuZGxlRGVjQ2xpY2siLCJoYW5kbGVJbmNDbGljayIsImhhbmRsZUlucHV0Iiwic3Bpbm5lcnMiLCJjcmVhdGUiLCIkdGFyZ2V0IiwidG9GaXhlZCIsImNoYW5nZVZhbHVlIiwiJG5ld3NDYXJvdXNlbCIsInNsaWNrIiwiYXJyb3dzIiwiaW5maW5pdGUiLCJzbGlkZXNUb1Nob3ciLCJjZW50ZXJNb2RlIiwidmFyaWFibGVXaWR0aCIsIm1vYmlsZUZpcnN0IiwicmVzcG9uc2l2ZSIsImJyZWFrcG9pbnQiLCJzZXR0aW5ncyIsIiRiaWtlc0Nhcm91c2VsIiwiJGNhdGVnb3JpZXNDYXJvdXNlbCIsImNlbnRlclBhZGRpbmciLCJkb3RzIiwiJHByb2R1Y3RDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRzaW1pbGFyQ2Fyb3VzZWwiLCIkdXBCdG4iLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwid2lkdGgiLCJzaG93IiwiaGlkZSIsIiRmaWx0ZXJNb2RhbCIsImZpZWxkIiwidHJpbSIsImV2ZW50IiwidG9vbHRpcFNldHRpbmdzIiwiYXJyb3ciLCJhbGxvd0hUTUwiLCJhbmltYXRlRmlsbCIsInBsYWNlbWVudCIsImRpc3RhbmNlIiwidGhlbWUiLCJpbml0VG9vbHRpcHMiLCJlbGVtIiwibG9jYWxTZXR0aW5ncyIsImNvbnRlbnQiLCJ0aXBweSIsIk9iamVjdCIsImFzc2lnbiIsInNob3AiLCJsYXQiLCJsbmciLCJtYXBTdHlsZXMiLCJpbml0TWFwIiwibWFwIiwiZ29vZ2xlIiwibWFwcyIsIk1hcCIsImdldEVsZW1lbnRCeUlkIiwiem9vbSIsImNlbnRlciIsInN0eWxlcyIsInpvb21Db250cm9sIiwibWFwVHlwZUNvbnRyb2wiLCJzY2FsZUNvbnRyb2wiLCJzdHJlZXRWaWV3Q29udHJvbCIsInJvdGF0ZUNvbnRyb2wiLCJmdWxsc2NyZWVuQ29udHJvbCIsInBvaW50SWNvbiIsInVybCIsIlNpemUiLCJvcmlnaW4iLCJQb2ludCIsImFuY2hvciIsIm1hcmtlciIsIk1hcmtlciIsInBvc2l0aW9uIiwiaWNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZQyxLQUFaLENBQWtCLFlBQVc7QUFDekI7OztBQUdBLE1BQUlDLGFBQWEsR0FBRztBQUNoQjtBQUNBQyxJQUFBQSxJQUFJLEVBQUcsR0FGUztBQUloQjtBQUNBQyxJQUFBQSxhQUFhLEVBQUcsSUFMQTtBQU1oQkMsSUFBQUEsYUFBYSxFQUFHLElBTkE7QUFPaEJDLElBQUFBLFdBQVcsRUFBSyxJQVBBO0FBUWhCQyxJQUFBQSxhQUFhLEVBQUcsSUFSQTtBQVNoQkMsSUFBQUEsWUFBWSxFQUFJLElBVEE7QUFVaEJDLElB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Q0FBWWdCLEtBQWhCLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBTE07QUFNZDtBQUNBQyxNQUFBQSxNQUFNLEVBQUUsSUFBSWxCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZZ0IsS0FBaEIsQ0FBc0IsRUFBdEIsRUFBMEIsRUFBMUI7QUFQTSxLQUFsQixDQWZlLENBeUJmOztBQUNBLFFBQU1FLE1BQU0sR0FBRyxJQUFJbkIsTUFBTSxDQUFDQyxJQUFQLENBQVltQixNQUFoQixDQUF1QjtBQUNsQ0MsTUFBQUEsUUFBUSxFQUFFM0IsSUFEd0I7QUFFbEM0QixNQUFBQSxJQUFJLEVBQUVULFNBRjRCO0FBR2xDZCxNQUFBQSxHQUFHLEVBQUVBO0FBSDZCLEtBQXZCLENBQWY7QUFLSDs7QUFFRDdPLEVBQUFBLE1BQU0sQ0FBQzRPLE9BQVAsR0FBaUJBLE9BQWpCO0FBRUo7QUFDQyxDQXp4Q0QiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiDQk9C70L7QsdCw0LvRjNC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtSwg0LrQvtGC0L7RgNGL0LUg0LjRgdC/0L7Qu9GM0LfRg9GO0YLRgdGPINC80L3QvtCz0L7QutGA0LDRgtC90L5cbiAgICAgKi9cbiAgICBsZXQgZ2xvYmFsT3B0aW9ucyA9IHtcbiAgICAgICAgLy8g0JLRgNC10LzRjyDQtNC70Y8g0LDQvdC40LzQsNGG0LjQuVxuICAgICAgICB0aW1lOiAgMjAwLFxuXG4gICAgICAgIC8vINCa0L7QvdGC0YDQvtC70YzQvdGL0LUg0YLQvtGH0LrQuCDQsNC00LDQv9GC0LjQstCwXG4gICAgICAgIGRlc2t0b3BMZ1NpemU6ICAxOTEwLFxuICAgICAgICBkZXNrdG9wTWRTaXplOiAgMTYwMCxcbiAgICAgICAgZGVza3RvcFNpemU6ICAgIDE0ODAsXG4gICAgICAgIGRlc2t0b3BTbVNpemU6ICAxMjgwLFxuICAgICAgICB0YWJsZXRMZ1NpemU6ICAgMTAyNCxcbiAgICAgICAgdGFibGV0U2l6ZTogICAgIDc2OCxcbiAgICAgICAgbW9iaWxlTGdTaXplOiAgIDY0MCxcbiAgICAgICAgbW9iaWxlU2l6ZTogICAgIDQ4MCxcblxuICAgICAgICBsYW5nOiAkKCdodG1sJykuYXR0cignbGFuZycpXG4gICAgfTtcblxuICAgIC8vINCR0YDQtdC50LrQv9C+0LjQvdGC0Ysg0LDQtNCw0L/RgtC40LLQsFxuICAgIC8vIEBleGFtcGxlIGlmIChnbG9iYWxPcHRpb25zLmJyZWFrcG9pbnRUYWJsZXQubWF0Y2hlcykge30gZWxzZSB7fVxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0ge1xuICAgICAgICBicmVha3BvaW50RGVza3RvcExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcE1kOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BNZFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wU206IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFNtU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXRMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50VGFibGV0OiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50TW9iaWxlTGdTaXplOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLm1vYmlsZUxnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlU2l6ZSAtIDF9cHgpYClcbiAgICB9O1xuXG4gICAgJC5leHRlbmQodHJ1ZSwgZ2xvYmFsT3B0aW9ucywgYnJlYWtwb2ludHMpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICBpZiAoJCgndGV4dGFyZWEnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhdXRvc2l6ZSgkKCd0ZXh0YXJlYScpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog0J/QvtC00LrQu9GO0YfQtdC90LjQtSBqcyBwYXJ0aWFsc1xuICAgICAqL1xuICAgIC8qKlxuICog0KDQsNGB0YjQuNGA0LXQvdC40LUgYW5pbWF0ZS5jc3NcbiAqIEBwYXJhbSAge1N0cmluZ30gYW5pbWF0aW9uTmFtZSDQvdCw0LfQstCw0L3QuNC1INCw0L3QuNC80LDRhtC40LhcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayDRhNGD0L3QutGG0LjRjywg0LrQvtGC0L7RgNCw0Y8g0L7RgtGA0LDQsdC+0YLQsNC10YIg0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XG4gKiBAcmV0dXJuIHtPYmplY3R9INC+0LHRitC10LrRgiDQsNC90LjQvNCw0YbQuNC4XG4gKiBcbiAqIEBzZWUgIGh0dHBzOi8vZGFuZWRlbi5naXRodWIuaW8vYW5pbWF0ZS5jc3MvXG4gKiBcbiAqIEBleGFtcGxlXG4gKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnKTtcbiAqIFxuICogJCgnI3lvdXJFbGVtZW50JykuYW5pbWF0ZUNzcygnYm91bmNlJywgZnVuY3Rpb24oKSB7XG4gKiAgICAgLy8g0JTQtdC70LDQtdC8INGH0YLQvi3RgtC+INC/0L7RgdC70LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxuICogfSk7XG4gKi9cbiQuZm4uZXh0ZW5kKHtcbiAgICBhbmltYXRlQ3NzOiBmdW5jdGlvbihhbmltYXRpb25OYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYW5pbWF0aW9uRW5kID0gKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdhbmltYXRpb25lbmQnLFxuICAgICAgICAgICAgICAgIE9BbmltYXRpb246ICdvQW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICBNb3pBbmltYXRpb246ICdtb3pBbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgICAgIFdlYmtpdEFuaW1hdGlvbjogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmb3IgKGxldCB0IGluIGFuaW1hdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uc1t0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcblxuICAgICAgICB0aGlzLmFkZENsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSkub25lKGFuaW1hdGlvbkVuZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0pO1xuICAgIC8vINCd0LXQsdC+0LvRjNGI0LjQtSDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0LUg0YTRg9C90LrRhtC40LhcblxuICAgIC8qKlxuICAgICAqINCf0YDQvtCy0LXRgNGP0LXRgiDRh9C40YHQu9C+INC40LvQuCDQvdC10YJcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gbiDQm9GO0LHQvtC5INCw0YDQs9GD0LzQtdC90YJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWVyaWMobikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvRj9C10YIg0LLRgdC1INC90LXRh9C40YHQu9C+0LLRi9C1INGB0LjQvNCy0L7Qu9GLINC4INC/0YDQuNCy0L7QtNC40YIg0Log0YfQuNGB0LvRg1xuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJ8bnVtYmVyfSBwYXJhbVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm90RGlnaXRzKHBhcmFtKSB7XG4gICAgICAgIC8qINGD0LTQsNC70Y/QtdC8INCy0YHQtSDRgdC40LzQstC+0LvRiyDQutGA0L7QvNC1INGG0LjRhNGAINC4INC/0LXRgNC10LLQvtC00LjQvCDQsiDRh9C40YHQu9C+ICovXG4gICAgICAgIHJldHVybiArcGFyYW0udG9TdHJpbmcoKS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCg0LDQt9C00LXQu9GP0LXRgiDQvdCwINGA0LDQt9GA0Y/QtNGLXG4gICAgICog0J3QsNC/0YDQuNC80LXRgCwgMzgwMDAwMCAtPiAzIDgwMCAwMDBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyfG51bWJlcn0gcGFyYW1cbiAgICAgKiBAcmV0dXJucyB7c3RyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpdmlkZUJ5RGlnaXRzKHBhcmFtKSB7XG4gICAgICAgIGlmIChwYXJhbSA9PT0gbnVsbCkgcGFyYW0gPSAwO1xuICAgICAgICByZXR1cm4gcGFyYW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9XG5cbiAgICB2YXIgbG9jYWxlID0gZ2xvYmFsT3B0aW9ucy5sYW5nID09ICdydS1SVScgPyAncnUnIDogJ2VuJztcblxuICAgIFBhcnNsZXkuc2V0TG9jYWxlKGxvY2FsZSk7XG5cbiAgICAvKiDQndCw0YHRgtGA0L7QudC60LggUGFyc2xleSAqL1xuICAgICQuZXh0ZW5kKFBhcnNsZXkub3B0aW9ucywge1xuICAgICAgICB0cmlnZ2VyOiAnYmx1ciBjaGFuZ2UnLCAvLyBjaGFuZ2Ug0L3Rg9C20LXQvSDQtNC70Y8gc2VsZWN0J9CwXG4gICAgICAgIHZhbGlkYXRpb25UaHJlc2hvbGQ6ICcwJyxcbiAgICAgICAgZXJyb3JzV3JhcHBlcjogJzxkaXY+PC9kaXY+JyxcbiAgICAgICAgZXJyb3JUZW1wbGF0ZTogJzxwIGNsYXNzPVwicGFyc2xleS1lcnJvci1tZXNzYWdlXCI+PC9wPicsXG4gICAgICAgIGNsYXNzSGFuZGxlcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICAgICAkaGFuZGxlcjtcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkZWxlbWVudDsgLy8g0YLQviDQtdGB0YLRjCDQvdC40YfQtdCz0L4g0L3QtSDQstGL0LTQtdC70Y/QtdC8IChpbnB1dCDRgdC60YDRi9GCKSwg0LjQvdCw0YfQtSDQstGL0LTQtdC70Y/QtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDQsdC70L7QulxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJCgnLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUnLCAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICRoYW5kbGVyO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcnNDb250YWluZXI6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xuICAgICAgICAgICAgbGV0IHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lcjtcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJChgW25hbWU9XCIkeyRlbGVtZW50LmF0dHIoJ25hbWUnKX1cIl06bGFzdCArIGxhYmVsYCkubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmN1c3RvbS1maWxlJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmZpZWxkJyk7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJGNvbnRhaW5lcilcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgcmV0dXJuICRjb250YWluZXI7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCa0LDRgdGC0L7QvNC90YvQtSDQstCw0LvQuNC00LDRgtC+0YDRi1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lUnUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWVFbicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosIFwiIFwiLCBcIi1cIidcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiyDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlclJ1Jywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlswLTnQsC3Rj9GRXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCAwLTknXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLLCDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXInLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXowLTldKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05J1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC10LvQtdGE0L7QvdC90YvQuSDQvdC+0LzQtdGAXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ3Bob25lJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlstKzAtOSgpIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0YLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgCcsXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBwaG9uZSBudW1iZXInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bWJlcicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bMC05XSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIDAtOSdcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0J/QvtGH0YLQsCDQsdC10Lcg0LrQuNGA0LjQu9C70LjRhtGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2VtYWlsJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXihbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0oXFwufF98LSl7MCwxfSkrW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dXFxAKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSkrKChcXC4pezAsMX1bQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pezEsfVxcLlthLXrQsC3RjzAtOVxcLV17Mix9JC8udGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9C+0YfRgtC+0LLRi9C5INCw0LTRgNC10YEnLFxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZW1haWwgYWRkcmVzcydcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KTQvtGA0LzQsNGCINC00LDRgtGLIERELk1NLllZWVlcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZGF0ZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgcmVnVGVzdCA9IC9eKD86KD86MzEoXFwuKSg/OjA/WzEzNTc4XXwxWzAyXSkpXFwxfCg/Oig/OjI5fDMwKShcXC4pKD86MD9bMSwzLTldfDFbMC0yXSlcXDIpKSg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezJ9KSR8Xig/OjI5KFxcLikwPzJcXDMoPzooPzooPzoxWzYtOV18WzItOV1cXGQpPyg/OjBbNDhdfFsyNDY4XVswNDhdfFsxMzU3OV1bMjZdKXwoPzooPzoxNnxbMjQ2OF1bMDQ4XXxbMzU3OV1bMjZdKTAwKSkpKSR8Xig/OjA/WzEtOV18MVxcZHwyWzAtOF0pKFxcLikoPzooPzowP1sxLTldKXwoPzoxWzAtMl0pKVxcNCg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezR9KSQvLFxuICAgICAgICAgICAgICAgIHJlZ01hdGNoID0gLyhcXGR7MSwyfSlcXC4oXFxkezEsMn0pXFwuKFxcZHs0fSkvLFxuICAgICAgICAgICAgICAgIG1pbiA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWluJyksXG4gICAgICAgICAgICAgICAgbWF4ID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNYXgnKSxcbiAgICAgICAgICAgICAgICBtaW5EYXRlLCBtYXhEYXRlLCB2YWx1ZURhdGUsIHJlc3VsdDtcblxuICAgICAgICAgICAgaWYgKG1pbiAmJiAocmVzdWx0ID0gbWluLm1hdGNoKHJlZ01hdGNoKSkpIHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF4ICYmIChyZXN1bHQgPSBtYXgubWF0Y2gocmVnTWF0Y2gpKSkge1xuICAgICAgICAgICAgICAgIG1heERhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQgPSB2YWx1ZS5tYXRjaChyZWdNYXRjaCkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZURhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlZ1Rlc3QudGVzdCh2YWx1ZSkgJiYgKG1pbkRhdGUgPyB2YWx1ZURhdGUgPj0gbWluRGF0ZSA6IHRydWUpICYmIChtYXhEYXRlID8gdmFsdWVEYXRlIDw9IG1heERhdGUgOiB0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3QsNGPINC00LDRgtCwJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGRhdGUnXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLy8g0KTQsNC50Lsg0L7Qs9GA0LDQvdC40YfQtdC90L3QvtCz0L4g0YDQsNC30LzQtdGA0LBcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZU1heFNpemUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgbWF4U2l6ZSwgcGFyc2xleUluc3RhbmNlKSB7XG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBwYXJzbGV5SW5zdGFuY2UuJGVsZW1lbnRbMF0uZmlsZXM7XG4gICAgICAgICAgICByZXR1cm4gZmlsZXMubGVuZ3RoICE9IDEgIHx8IGZpbGVzWzBdLnNpemUgPD0gbWF4U2l6ZSAqIDEwMjQ7XG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVtZW50VHlwZTogJ2ludGVnZXInLFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQpNCw0LnQuyDQtNC+0LvQttC10L0g0LLQtdGB0LjRgtGMINC90LUg0LHQvtC70LXQtSwg0YfQtdC8ICVzIEtiJyxcbiAgICAgICAgICAgIGVuOiAnRmlsZSBzaXplIGNhblxcJ3QgYmUgbW9yZSB0aGVuICVzIEtiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQntCz0YDQsNC90LjRh9C10L3QuNGPINGA0LDRgdGI0LjRgNC10L3QuNC5INGE0LDQudC70L7QslxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlRXh0ZW5zaW9uJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIGZvcm1hdHMpIHtcbiAgICAgICAgICAgIGxldCBmaWxlRXh0ZW5zaW9uID0gdmFsdWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgICAgIGxldCBmb3JtYXRzQXJyID0gZm9ybWF0cy5zcGxpdCgnLCAnKTtcbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcm1hdHNBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZUV4dGVuc2lvbiA9PT0gZm9ybWF0c0FycltpXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQlNC+0L/Rg9GB0YLQuNC80Ysg0YLQvtC70YzQutC+INGE0LDQudC70Ysg0YTQvtGA0LzQsNGC0LAgJXMnLFxuICAgICAgICAgICAgZW46ICdBdmFpbGFibGUgZXh0ZW5zaW9ucyBhcmUgJXMnXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCh0L7Qt9C00LDRkdGCINC60L7QvdGC0LXQudC90LXRgNGLINC00LvRjyDQvtGI0LjQsdC+0Log0YMg0L3QtdGC0LjQv9C40YfQvdGL0YUg0Y3Qu9C10LzQtdC90YLQvtCyXG4gICAgUGFyc2xleS5vbignZmllbGQ6aW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgJGVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICAgICAgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICRibG9jayA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdlcnJvcnMtcGxhY2VtZW50JyksXG4gICAgICAgICAgICAkbGFzdDtcblxuICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCY0L3QuNGG0LjQuNGA0YPQtdGCINCy0LDQu9C40LTQsNGG0LjRjiDQvdCwINCy0YLQvtGA0L7QvCDQutCw0LvQtdC00LDRgNC90L7QvCDQv9C+0LvQtSDQtNC40LDQv9Cw0LfQvtC90LBcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDp2YWxpZGF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgJCgnZm9ybVtkYXRhLXZhbGlkYXRlPVwidHJ1ZVwiXScpLnBhcnNsZXkoKTtcblxuICAgIC8vINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDRgtC+0LvRjNC60L4g0L3QsCDRgdGC0YDQsNC90LjRhtC1IGNoZWNrb3V0Lmh0bWxcbiAgICBpZiAoJCgnLmpzLWNvbGxhcHNlLWJ0bicpLmxlbmd0aCkge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNvbGxhcHNlLWJ0bicsIChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICAgIGNvbnN0ICRjb2xsYXBzZUJvZHkgPSAkc2VsZi5jbG9zZXN0KCcuanMtY29sbGFwc2UnKS5maW5kKCcuanMtY29sbGFwc2UtYm9keScpO1xuICAgICAgICAgICAgaWYgKCRzZWxmLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgICRzZWxmLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkY29sbGFwc2VCb2R5LnNsaWRlVXAoJ2Zhc3QnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRjb2xsYXBzZUJvZHkuc2xpZGVEb3duKCdmYXN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCU0L7QsdCw0LLQu9GP0LXRgiDQvNCw0YHQutC4INCyINC/0L7Qu9GPINGE0L7RgNC8XG4gICAgICogQHNlZSAgaHR0cHM6Ly9naXRodWIuY29tL1JvYmluSGVyYm90cy9JbnB1dG1hc2tcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPGlucHV0IGNsYXNzPVwianMtcGhvbmUtbWFza1wiIHR5cGU9XCJ0ZWxcIiBuYW1lPVwidGVsXCIgaWQ9XCJ0ZWxcIj5cbiAgICAgKi9cbiAgICAkKCcuanMtcGhvbmUtbWFzaycpLmlucHV0bWFzaygnKzcoOTk5KSA5OTktOTktOTknLCB7XG4gICAgICAgIGNsZWFyTWFza09uTG9zdEZvY3VzOiB0cnVlLFxuICAgICAgICBzaG93TWFza09uSG92ZXI6IGZhbHNlXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDQodGC0LjQu9C40LfRg9C10YIg0YHQtdC70LXQutGC0Ysg0YEg0L/QvtC80L7RidGM0Y4g0L/Qu9Cw0LPQuNC90LAgc2VsZWN0MlxuICAgICAqIGh0dHBzOi8vc2VsZWN0Mi5naXRodWIuaW9cbiAgICAgKi9cbiAgICBsZXQgQ3VzdG9tU2VsZWN0ID0gZnVuY3Rpb24oJGVsZW0pIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uKCRpbml0RWxlbSkge1xuICAgICAgICAgICAgJGluaXRFbGVtLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdFNlYXJjaCA9ICQodGhpcykuZGF0YSgnc2VhcmNoJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0U2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IDE7IC8vINC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBJbmZpbml0eTsgLy8g0L3QtSDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogbWluaW11bVJlc3VsdHNGb3JTZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub1Jlc3VsdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICfQodC+0LLQv9Cw0LTQtdC90LjQuSDQvdC1INC90LDQudC00LXQvdC+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQvdGD0LbQvdC+INC00LvRjyDQstGL0LvQuNC00LDRhtC40Lgg0L3QsCDQu9C10YLRg1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKGBvcHRpb25bdmFsdWU9XCIkeyQodGhpcykudmFsdWV9XCJdYCkuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnVwZGF0ZSA9IGZ1bmN0aW9uKCR1cGRhdGVFbGVtKSB7XG4gICAgICAgICAgICAkdXBkYXRlRWxlbS5zZWxlY3QyKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBzZWxmLmluaXQoJHVwZGF0ZUVsZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuaW5pdCgkZWxlbSk7XG4gICAgfTtcblxuICAgIHZhciBjdXN0b21TZWxlY3QgPSBuZXcgQ3VzdG9tU2VsZWN0KCQoJ3NlbGVjdCcpKTtcblxuICAgIGNvbnN0IGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgZGF0ZUZvcm1hdDogJ2RkLm1tLnl5JyxcbiAgICAgICAgc2hvd090aGVyTW9udGhzOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqINCU0LXQu9Cw0LXRgiDQstGL0L/QsNC00Y7RidC40LUg0LrQsNC70LXQvdC00LDRgNC40LrQuFxuICAgICAqIEBzZWUgIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL2RhdGVwaWNrZXIvXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vINCyIGRhdGEtZGF0ZS1taW4g0LggZGF0YS1kYXRlLW1heCDQvNC+0LbQvdC+INC30LDQtNCw0YLRjCDQtNCw0YLRgyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5XG4gICAgICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRhdGVJbnB1dFwiIGlkPVwiXCIgY2xhc3M9XCJqcy1kYXRlcGlja2VyXCIgZGF0YS1kYXRlLW1pbj1cIjA2LjExLjIwMTVcIiBkYXRhLWRhdGUtbWF4PVwiMTAuMTIuMjAxNVwiPlxuICAgICAqL1xuICAgIGxldCBEYXRlcGlja2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGVwaWNrZXIgPSAkKCcuanMtZGF0ZXBpY2tlcicpO1xuXG4gICAgICAgIGRhdGVwaWNrZXIuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgbWluRGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1taW4nKTtcbiAgICAgICAgICAgIGxldCBtYXhEYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1heCcpO1xuICAgICAgICAgICAgY29uc3Qgc2hvd01ZID0gJCh0aGlzKS5kYXRhKCdzaG93LW0teScpO1xuXG4gICAgICAgICAgICAvKiDQtdGB0LvQuCDQsiDQsNGC0YDQuNCx0YPRgtC1INGD0LrQsNC30LDQvdC+IGN1cnJlbnQsINGC0L4g0LLRi9Cy0L7QtNC40Lwg0YLQtdC60YPRidGD0Y4g0LTQsNGC0YMgKi9cbiAgICAgICAgICAgIGlmICggbWF4RGF0ZSA9PT0gJ2N1cnJlbnQnIHx8IG1pbkRhdGUgPT09ICdjdXJyZW50Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudERheSA9IGN1cnJlbnREYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF5IDwgMTAgPyBjdXJyZW50RGF5ID0gJzAnICsgY3VycmVudERheS50b1N0cmluZygpIDogY3VycmVudERheTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdEYXRlID0gY3VycmVudERheSArICcuJyArIChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSkgKyAnLicgKyBjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgICAgIG1heERhdGUgPT09ICdjdXJyZW50JyA/IG1heERhdGUgPSBuZXdEYXRlIDogbWluRGF0ZSA9IG5ld0RhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpdGVtT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlOiBtaW5EYXRlIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbWF4RGF0ZSB8fCBudWxsLFxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuZmllbGQnKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoc2hvd01ZKSB7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ2NoYW5nZVllYXInXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ3llYXJSYW5nZSddID0gJ2MtMTAwOmMnO1xuICAgICAgICAgICAgICAgIGl0ZW1PcHRpb25zWydjaGFuZ2VNb250aCddID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgaXRlbU9wdGlvbnMsIGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyk7XG5cbiAgICAgICAgICAgICQodGhpcykuZGF0ZXBpY2tlcihpdGVtT3B0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICAvLyDQtNC10LvQsNC10Lwg0LrRgNCw0YHQuNCy0YvQvCDRgdC10LvQtdC6INC80LXRgdGP0YbQsCDQuCDQs9C+0LTQsFxuICAgICAgICAgJChkb2N1bWVudCkub24oJ2ZvY3VzJywgJy5qcy1kYXRlcGlja2VyJywgKCkgPT4ge1xuICAgICAgICAgICAgLy8g0LjRgdC/0L7Qu9GM0LfRg9C10Lwg0LfQsNC00LXRgNC20LrRgywg0YfRgtC+0LHRiyDQtNC10LnRgtC/0LjQutC10YAg0YPRgdC/0LXQuyDQuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0YLRjNGB0Y9cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCQoJy51aS1kYXRlcGlja2VyJykuZmluZCgnc2VsZWN0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy51aS1kYXRlcGlja2VyJykuZmluZCgnc2VsZWN0Jykuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGxldCBkYXRlcGlja2VyID0gbmV3IERhdGVwaWNrZXIoKTtcblxuICAgIGNvbnN0ICRtb2JpbGVNZW51ID0gJCgnLmpzLW1vYmlsZS1tZW51Jyk7XG4gICAgY29uc3QgJGNhcnRNb2RhbCA9ICQoJy5qcy1jYXJ0LW1vZGFsJyk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLW1lbnUtYnRuJywgKCkgPT4ge1xuICAgICAgICBvcGVuTW9kYWwoJG1vYmlsZU1lbnUpO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1tZW51LWNsb3NlJywgKCkgPT4ge1xuICAgICAgICBoaWRlTW9kYWwoJG1vYmlsZU1lbnUpXG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNhcnQtYnRuJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBvcGVuTW9kYWwoJGNhcnRNb2RhbCk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNhcnQtY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgIGhpZGVNb2RhbCgkY2FydE1vZGFsKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIE9wZW4gbW9kYWwgYmxvY2tcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJG1vZGFsQmxvY2sgTW9kYWwgYmxvY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvcGVuTW9kYWwoJG1vZGFsQmxvY2spIHtcbiAgICAgICAgJG1vZGFsQmxvY2suYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpLmFuaW1hdGVDc3MoJ3NsaWRlSW5SaWdodCcpO1xuICAgICAgICBsb2NrRG9jdW1lbnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIaWRlIG1vZGFsIGJsb2NrXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRtb2RhbEJsb2NrIE1vZGFsIGJsb2NrXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGlkZU1vZGFsKCRtb2RhbEJsb2NrKSB7XG4gICAgICAgICRtb2RhbEJsb2NrLmFuaW1hdGVDc3MoJ3NsaWRlT3V0UmlnaHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAkbW9kYWxCbG9jay5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICB1bmxvY2tEb2N1bWVudCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbmxvY2sgZG9jdW1lbnQgZm9yIHNjcm9sbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVubG9ja0RvY3VtZW50KCkge1xuICAgICAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ2lzLWxvY2tlZCcpO1xuICAgICAgICAvLyAuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvY2sgZG9jdW1lbnQgZm9yIHNjcm9sbFxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkbG9ja0Jsb2NrIEJsb2NrIHdoaWNoIGRlZmluZSBkb2N1bWVudCBoZWlnaHRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2NrRG9jdW1lbnQoKSB7XG4gICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtbG9ja2VkJyk7XG4gICAgfVxuXG5cbiAgICAvLyAtLS0tLS0g0LvQvtCz0LjQutCwINC+0YLQutGA0YvRgtC40Y8g0LLRi9C/0LDQtNCw0YjQtdC6INGF0LXQtNC10YDQsCAtLS0tLS1cbiAgICBjb25zdCAkaGVhZGVyID0gJCgnLmpzLWhlYWRlcicpO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1oZWFkZXItZHJvcGRvd24tYnRuJywgZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgJHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IGNhdGVnb3J5ID0gJHNlbGYuYXR0cignZGF0YS1jYXRlZ29yeScpO1xuICAgICAgICBjb25zdCAkY2F0ZWdvcnlEcm9wZG93biA9ICQoYFtkYXRhLWRyb3Bkb3duLWNhdGVnb3J5PScke2NhdGVnb3J5fSddYCk7XG5cbiAgICAgICAgaWYgKCRzZWxmLmhhc0NsYXNzKCdpcy1jaG9zZW4nKSkge1xuICAgICAgICAgICAgJHNlbGYucmVtb3ZlQ2xhc3MoJ2lzLWNob3NlbicpO1xuICAgICAgICAgICAgJGNhdGVnb3J5RHJvcGRvd24ucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuanMtaGVhZGVyLWRyb3Bkb3duLWJ0bicpLnJlbW92ZUNsYXNzKCdpcy1jaG9zZW4nKTtcbiAgICAgICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkaGVhZGVyLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICRzZWxmLmFkZENsYXNzKCdpcy1jaG9zZW4nKTtcbiAgICAgICAgICAgICRjYXRlZ29yeURyb3Bkb3duLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIGNsb3NlRHJvcGRvd25IYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiBjbG9zZURyb3Bkb3duSGFuZGxlcihlKSB7XG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCcuanMtaGVhZGVyJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAkKCcuanMtaGVhZGVyLWRyb3Bkb3duLWJ0bicpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9mZignY2xpY2snLCBjbG9zZURyb3Bkb3duSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDQvdC10LzQvdC+0LPQviDRgdC/0LXRhtC40YTQuNGH0L3Ri9C1INGC0LDQsdGLLiDQmNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8g0L3QsCDRgdGC0YDQsNC90LjRhtC1IGNoZWNrb3V0Lmh0bWwuINCf0YDQuCDQttC10LvQsNC90LjQuCDQvNC+0LbQvdC+INC00L7RgNCw0LHQvtGC0LDRgtGMXG5cbiAgICBpZiAoJCgnLmpzLXRhYnMtbGluaycpLmxlbmd0aCkge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLXRhYnMtbGluaycsIChlKSA9PiB7XG4gICAgICAgICAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCAkc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICAgICAgaWYgKCRzZWxmLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCAkdGFicyA9ICRzZWxmLmNsb3Nlc3QoJy5qcy10YWJzJyk7XG4gICAgICAgICAgICBjb25zdCAkdGFic0xpbmtzID0gJHRhYnMuZmluZCgnLmpzLXRhYnMtbGluaycpO1xuICAgICAgICAgICAgY29uc3QgJHRhYnNJdGVtcyA9ICR0YWJzLmZpbmQoJy5qcy10YWJzLWl0ZW0nKTtcblxuICAgICAgICAgICAgLy8g0LLRi9C60LvRjtGH0LDQtdC8INCy0YHQtSDQsNC60YLQuNCy0L3Ri9C1INGC0LDQsdGLINC4INGB0YHRi9C70LrQuFxuICAgICAgICAgICAgJHRhYnNMaW5rcy5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkdGFic0l0ZW1zLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8g0LLRi9C60LvRjtGH0LDQtdC8INCy0LDQu9C40LTQsNGG0LjRjiDRgyDRgdC60YDRi9GC0YvRhSDQv9C+0LvQtdC5INC4INC+0YfQuNGJ0LDQtdC8INC40YVcbiAgICAgICAgICAgIGxldCAkaGlkZGVuRm9ybUZpZWxkcyA9ICR0YWJzSXRlbXMuZmluZCgnW2RhdGEtcmVxdWlyZWRdJyk7XG4gICAgICAgICAgICBpZiAoJGhpZGRlbkZvcm1GaWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgnZGF0YS1yZXF1aXJlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy5wcm9wKCdyZXF1aXJlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy52YWwoJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQstC60LvRjtGH0LDQtdC8INC90YPQttC90YvQuSDRgtCw0LEg0Lgg0LTQtdC70LDQtdC8INC90YPQttC90YPRjiDRgdGB0YvQu9C60YMg0LDQutGC0LjQstC90L7QuVxuICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgY29uc3QgJHNlbGZJdGVtID0gJCgkc2VsZi5kYXRhKCd0YWInKSk7XG4gICAgICAgICAgICAkc2VsZkl0ZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLyDQstC60LvRjtGH0LDQtdC8INCy0LDQu9C40LTQsNGG0LjRjiDRgyDRgdC60YDRi9GC0YvRhSDQv9C+0LvQtdC5XG4gICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcyA9ICRzZWxmSXRlbS5maW5kKCdbZGF0YS1yZXF1aXJlZF0nKTtcbiAgICAgICAgICAgIGlmICgkaGlkZGVuRm9ybUZpZWxkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy5wcm9wKCdkYXRhLXJlcXVpcmVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiAgINCQ0LrRgtC40LLQuNGA0L7QstCw0YLRjC/QtNC10LfQsNC60YLQuNCy0LjRgNC+0LLQsNGC0Ywg0YHQv9C40L3QvdC10YBcbiAgICAqICAgY29uc3QgJGJsb2NrID0gJCgnLnNwaW5uZXInKTtcbiAgICAqICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcbiAgICAqICAgc3Bpbm5lci5lbmFibGVTcGlubmVyKCk7L3NwaW5uZXIuZGlzYWJsZVNwaW5uZXIoKTtcbiAgICAqXG4gICAgKi9cblxuICAgIGNsYXNzIFNwaW5uZXIge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSAgb3B0aW9ucyAgICAgICAgICAgICAgICAgICDQntCx0YrQtdC60YIg0YEg0L/QsNGA0LDQvNC10YLRgNCw0LzQuC5cbiAgICAgICAgICogQHBhcmFtICB7alF1ZXJ5fSAgb3B0aW9ucy4kYmxvY2sgICAgICAgICAgICDQqNCw0LHQu9C+0L0uXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLnZhbHVlID0gMF0gICAgICAg0J3QsNGH0LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLm1pbiA9IC1JbmZpbml0eV0g0JzQuNC90LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5tYXggPSBJbmZpbml0eV0gINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5zdGVwID0gMV0gICAgICAgINCo0LDQsy5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMucHJlY2lzaW9uXSAgICAgICDQotC+0YfQvdC+0YHRgtGMICjQvdGD0LbQvdCwINC00LvRjyDQtNC10YHRj9GC0LjRh9C90L7Qs9C+INGI0LDQs9CwKS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHsgJGJsb2NrLCB2YWx1ZSA9IDAsIG1pbiA9IC1JbmZpbml0eSwgbWF4ID0gSW5maW5pdHksIHN0ZXAgPSAxLCBwcmVjaXNpb24gfSA9IHt9KSB7XG4gICAgICAgICAgICB0aGlzLiRibG9jayA9ICRibG9jaztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMgPSB7XG4gICAgICAgICAgICAgICAgJGRlYzogJCgnLnNwaW5uZXJfX2J0bi0tZGVjJywgdGhpcy4kYmxvY2spLFxuICAgICAgICAgICAgICAgICRpbmM6ICQoJy5zcGlubmVyX19idG4tLWluYycsIHRoaXMuJGJsb2NrKSxcbiAgICAgICAgICAgICAgICAkaW5wdXQ6ICQoJy5zcGlubmVyX19pbnB1dCcsIHRoaXMuJGJsb2NrKSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSArdmFsdWU7XG4gICAgICAgICAgICB0aGlzLm1pbiA9ICttaW47XG4gICAgICAgICAgICB0aGlzLm1heCA9ICttYXg7XG4gICAgICAgICAgICB0aGlzLnN0ZXAgPSArc3RlcDtcbiAgICAgICAgICAgIHRoaXMucHJlY2lzaW9uID0gK3ByZWNpc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQn9GA0LjQstC+0LTQuNGCINGA0LDQt9C80LXRgtC60YMg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC1INC/0LDRgNCw0LzQtdGC0YDQsNC8LlxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9ucygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDRgdC+0YHRgtC+0Y/QvdC40LUg0LHQu9C+0LrQuNGA0L7QstC60Lgg0LrQvdC+0L/QvtC6LlxuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlQnV0dG9ucygpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGRlYy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGluYy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPCB0aGlzLm1pbiArIHRoaXMuc3RlcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGRlYy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA+IHRoaXMubWF4IC0gdGhpcy5zdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5jLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0J7RgtC60LvRjtGH0LXQvdC40LUg0YHQv9C40L3QvdC10YDQsC5cbiAgICAgICAgICovXG4gICAgICAgIGRpc2FibGVTcGlubmVyKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kZGVjLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbmMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQktC60LvRjtGH0LXQvdC40LUg0YHQv9C40L3QvdC10YDQsC5cbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZVNwaW5uZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2sucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0LfQvdCw0YfQtdC90LjQtSDRgdGH0ZHRgtGH0LjQutCwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUg0J3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKi9cbiAgICAgICAgY2hhbmdlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLmF0dHIoJ2RhdGEtdmFsdWUnLCB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbnB1dC5hdHRyKCd2YWx1ZScsIHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnZhbCh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0JzQtdC90Y/QtdGCINC30L3QsNGH0LXQvdC40LUg0LzQuNC90LjQvNGD0LzQsC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSB2YWx1ZSDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VNaW4odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMubWluID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hdHRyKCdkYXRhLW1pbicsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQnNC10L3Rj9C10YIg0LfQvdCw0YfQtdC90LjQtSDQvNCw0LrRgdC40LzRg9C80LAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gdmFsdWUg0J3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKi9cbiAgICAgICAgY2hhbmdlTWF4KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm1heCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2suYXR0cignZGF0YS1tYXgnLCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0JzQsNGB0YHQuNCyINGB0L7Qt9C00LDQvdC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIGluc3RhbmNlcyA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQndCw0YXQvtC00LjRgiDQvtCx0YrQtdC60YIg0LrQu9Cw0YHRgdCwINC/0L4g0YjQsNCx0LvQvtC90YMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge2pRdWVyeX0gJGJsb2NrINCo0LDQsdC70L7QvS5cbiAgICAgICAgICogQHJldHVybiB7U3Bpbm5lcn0gICAgICAg0J7QsdGK0LXQutGCLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIGdldEluc3RhbmNlKCRibG9jaykge1xuICAgICAgICAgICAgcmV0dXJuIFNwaW5uZXIuaW5zdGFuY2VzLmZpbmQoc3Bpbm5lciA9PiBzcGlubmVyLiRibG9jay5pcygkYmxvY2spKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQodC+0LfQtNCw0ZHRgiDQvtCx0YrQtdC60YLRiyDQv9C+INGI0LDQsdC70L7QvdCw0LwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSBbJHNwaW5uZXJzID0gJCgnLnNwaW5uZXInKV0g0KjQsNCx0LvQvtC90YsuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgY3JlYXRlKCRzcGlubmVycyA9ICQoJy5zcGlubmVyJykpIHtcbiAgICAgICAgICAgICRzcGlubmVycy5lYWNoKChpbmRleCwgYmxvY2spID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkYmxvY2sgPSAkKGJsb2NrKTtcblxuICAgICAgICAgICAgICAgIGlmIChTcGlubmVyLmdldEluc3RhbmNlKCRibG9jaykpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNwaW5uZXIgPSBuZXcgU3Bpbm5lcih7XG4gICAgICAgICAgICAgICAgICAgICRibG9jayxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICRibG9jay5hdHRyKCdkYXRhLXZhbHVlJyksXG4gICAgICAgICAgICAgICAgICAgIG1pbjogJGJsb2NrLmF0dHIoJ2RhdGEtbWluJyksXG4gICAgICAgICAgICAgICAgICAgIG1heDogJGJsb2NrLmF0dHIoJ2RhdGEtbWF4JyksXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA6ICRibG9jay5hdHRyKCdkYXRhLXN0ZXAnKSxcbiAgICAgICAgICAgICAgICAgICAgcHJlY2lzaW9uOiAkYmxvY2suYXR0cignZGF0YS1wcmVjaXNpb24nKSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICRibG9jay5oYXNDbGFzcygnaXMtZGlzYWJsZWQnKSA/IHNwaW5uZXIuZGlzYWJsZVNwaW5uZXIoKSA6IHNwaW5uZXIuaW5pdCgpO1xuXG4gICAgICAgICAgICAgICAgU3Bpbm5lci5pbnN0YW5jZXMucHVzaChzcGlubmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCj0LTQsNC70Y/QtdGCINC+0LHRitC10LrRgtGLINC/0L4g0YjQsNCx0LvQvtC90LDQvC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9IFskc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpXSDQqNCw0LHQu9C+0L3Riy5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyByZW1vdmUoJHNwaW5uZXJzID0gJCgnLnNwaW5uZXInKSkge1xuICAgICAgICAgICAgJHNwaW5uZXJzLmVhY2goKGluZGV4LCBibG9jaykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRibG9jayA9ICQoYmxvY2spO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3Bpbm5lckluZGV4ID0gU3Bpbm5lci5pbnN0YW5jZXMuZmluZEluZGV4KHNwaW5uZXIgPT4gc3Bpbm5lci4kYmxvY2suaXMoJGJsb2NrKSk7XG5cbiAgICAgICAgICAgICAgICBTcGlubmVyLmluc3RhbmNlcy5zcGxpY2Uoc3Bpbm5lckluZGV4LCAxKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5zcGlubmVyX19idG4tLWRlYycsIGhhbmRsZURlY0NsaWNrKTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnNwaW5uZXJfX2J0bi0taW5jJywgaGFuZGxlSW5jQ2xpY2spO1xuICAgICQoZG9jdW1lbnQpLm9uKCdpbnB1dCcsICcuc3Bpbm5lcl9faW5wdXQnLCBoYW5kbGVJbnB1dCk7XG5cbiAgICAvKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC/0LjQvdC90LXRgNC+0LIgKi9cbiAgICBsZXQgc3Bpbm5lcnMgPSBTcGlubmVyLmNyZWF0ZSgpO1xuXG4gICAgLyoqXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0LrQu9C40LrQsCDQv9C+INC60L3QvtC/0LrQtSDRg9C80LXQvdGM0YjQtdC90LjRjy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlINCe0LHRitC10LrRgiDRgdC+0LHRi9GC0LjRjy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYW5kbGVEZWNDbGljayhlKSB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudFRhcmdldCB9ID0gZTtcbiAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0ICRibG9jayA9ICR0YXJnZXQuY2xvc2VzdCgnLnNwaW5uZXInKTtcbiAgICAgICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBzcGlubmVyLnZhbHVlIC0gc3Bpbm5lci5zdGVwO1xuXG4gICAgICAgIGlmIChzcGlubmVyLnByZWNpc2lvbikge1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlLnRvRml4ZWQoc3Bpbm5lci5wcmVjaXNpb24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW5uZXIuY2hhbmdlVmFsdWUodmFsdWUpO1xuXG4gICAgICAgIHNwaW5uZXIudXBkYXRlQnV0dG9ucygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INC60LvQuNC60LAg0L/QviDQutC90L7Qv9C60LUg0YPQstC10LvQuNGH0LXQvdC40Y8uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZSDQntCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFuZGxlSW5jQ2xpY2soZSkge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRUYXJnZXQgfSA9IGU7XG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCAkYmxvY2sgPSAkdGFyZ2V0LmNsb3Nlc3QoJy5zcGlubmVyJyk7XG4gICAgICAgIGNvbnN0IHNwaW5uZXIgPSBTcGlubmVyLmdldEluc3RhbmNlKCRibG9jayk7XG5cbiAgICAgICAgbGV0IHZhbHVlID0gc3Bpbm5lci52YWx1ZSArIHNwaW5uZXIuc3RlcDtcblxuICAgICAgICBpZiAoc3Bpbm5lci5wcmVjaXNpb24pIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZS50b0ZpeGVkKHNwaW5uZXIucHJlY2lzaW9uKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzcGlubmVyLmNoYW5nZVZhbHVlKHZhbHVlKTtcblxuICAgICAgICBzcGlubmVyLnVwZGF0ZUJ1dHRvbnMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQstCy0L7QtNCwINCyINC/0L7Qu9C1LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGUg0J7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZUlucHV0KGUpIHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VGFyZ2V0IH0gPSBlO1xuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChjdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgJGJsb2NrID0gJHRhcmdldC5jbG9zZXN0KCcuc3Bpbm5lcicpO1xuICAgICAgICBjb25zdCBzcGlubmVyID0gU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spO1xuICAgICAgICBjb25zdCB7ICRpbnB1dCB9ID0gc3Bpbm5lci5lbGVtZW50cztcblxuICAgICAgICBsZXQgdmFsdWUgPSArJGlucHV0LnZhbCgpO1xuXG4gICAgICAgIGlmICghJGlucHV0LnZhbCgpLmxlbmd0aCB8fCB2YWx1ZSA8IHNwaW5uZXIubWluIHx8IHZhbHVlID4gc3Bpbm5lci5tYXgpIHtcbiAgICAgICAgICAgICh7IHZhbHVlIH0gPSBzcGlubmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW5uZXIuY2hhbmdlVmFsdWUodmFsdWUpO1xuXG4gICAgICAgIHNwaW5uZXIudXBkYXRlQnV0dG9ucygpO1xuICAgIH1cblxuICAgIC8vICDQutCw0YDRg9GB0LXQu9GMINC90LAg0L/QtdGA0LLQvtC8INCx0LDQvdC90LXRgNC1INC90LAg0LPQu9Cw0LLQvdC+0Lkg0YHRgtGA0LDQvdC40YbQtVxuICAgIGNvbnN0ICRuZXdzQ2Fyb3VzZWwgPSAkKCcuanMtbmV3cy1jYXJvdXNlbCcpO1xuICAgIGlmICgkbmV3c0Nhcm91c2VsLmxlbmd0aCkge1xuICAgICAgICAkbmV3c0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgIGNlbnRlck1vZGU6IGZhbHNlLFxuICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcbiAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY3LFxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiAxMDIzLFxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogJ3Vuc2xpY2snLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQv9C+0LTQsdC+0YDQsCDQsdCw0LnQutC+0LJcbiAgICBjb25zdCAkYmlrZXNDYXJvdXNlbCA9ICQoJy5qcy1iaWtlcy1jYXJvdXNlbCcpO1xuICAgIGlmICgkYmlrZXNDYXJvdXNlbC5sZW5ndGgpIHtcbiAgICAgICAgJGJpa2VzQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNoZWNrIGJpa2UgYWZ0ZXIgaW5pdFxuICAgICAgICAkYmlrZXNDYXJvdXNlbC5maW5kKCcuc2xpY2stYWN0aXZlJykuZmluZCgnaW5wdXQnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG5cbiAgICAgICAgLy8gY2hlY2sgYmlrZSBhZnRlciBjaGFuZ2VcbiAgICAgICAgJGJpa2VzQ2Fyb3VzZWwub24oJ2FmdGVyQ2hhbmdlJywgKCkgPT4ge1xuICAgICAgICAgICAgJGJpa2VzQ2Fyb3VzZWwuZmluZCgnLnNsaWNrLWFjdGl2ZScpLmZpbmQoJ2lucHV0JykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC60LDRgtC10LPQvtGA0LjQuVxuICAgIGNvbnN0ICRjYXRlZ29yaWVzQ2Fyb3VzZWwgPSAkKCcuanMtY2F0ZWdvcmllcy1jYXJvdXNlbCcpO1xuICAgIGlmICgkY2F0ZWdvcmllc0Nhcm91c2VsLmxlbmd0aCkge1xuICAgICAgICAkY2F0ZWdvcmllc0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgY2VudGVyUGFkZGluZzogJzAnLFxuICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjcsXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiAndW5zbGljaycsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC60LDRgNGC0LjQvdC+0Log0YLQvtCy0LDRgNCwXG4gICAgY29uc3QgJHByb2R1Y3RDYXJvdXNlbCA9ICQoJy5qcy1wcm9kdWN0LWNhcm91c2VsJyk7XG4gICAgaWYgKCRwcm9kdWN0Q2Fyb3VzZWwubGVuZ3RoKSB7XG4gICAgICAgICRwcm9kdWN0Q2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxuICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1hcnJvdyBidG4tYXJyb3ctLXByZXYgcHJvZHVjdC1wYWdlX19jYXJvdXNlbC1wcmV2XCI+PHN2ZyBjbGFzcz1cImljb24gaWNvbi0tYXJyb3ctbmV4dFwiPjx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWFycm93X25leHRcIj48L3VzZT48L3N2Zz48L2J1dHRvbj4nLFxuICAgICAgICAgICAgbmV4dEFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4tYXJyb3cgcHJvZHVjdC1wYWdlX19jYXJvdXNlbC1uZXh0XCI+PHN2ZyBjbGFzcz1cImljb24gaWNvbi0tYXJyb3ctbmV4dFwiPjx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWFycm93X25leHRcIj48L3VzZT48L3N2Zz48L2J1dHRvbj4nLFxuICAgICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjgsXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC/0L7RhdC+0LbQuNGFINGC0L7QstCw0YDQvtCyXG4gICAgY29uc3QgJHNpbWlsYXJDYXJvdXNlbCA9ICQoJy5qcy1zaW1pbGFyLWNhcm91c2VsJyk7XG4gICAgaWYgKCRzaW1pbGFyQ2Fyb3VzZWwubGVuZ3RoKSB7XG4gICAgICAgICRzaW1pbGFyQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnMCcsXG4gICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDYzOSxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0ICR1cEJ0biA9ICQoJy5qcy1idG4tdXAnKTtcblxuICAgIGlmICgkdXBCdG4ubGVuZ3RoKSB7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtYnRuLXVwJywgKCkgPT4ge1xuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPj0gZ2xvYmFsT3B0aW9ucy50YWJsZXRMZ1NpemUpIHtcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPiA1MCA/ICR1cEJ0bi5zaG93KCkgOiAkdXBCdG4uaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCAkZmlsdGVyTW9kYWwgPSAkKCcuanMtZmlsdGVyLW1vZGFsJyk7XG4gICAgaWYgKCRmaWx0ZXJNb2RhbC5sZW5ndGgpIHtcblxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWZpbHRlci1idG4nLCBlID0+IHtcbiAgICAgICAgICAgICRmaWx0ZXJNb2RhbC5hZGRDbGFzcygnaXMtYWN0aXZlJykuYW5pbWF0ZUNzcygnc2xpZGVJblJpZ2h0Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtZmlsdGVyLWNsb3NlJywgZSA9PiB7XG4gICAgICAgICAgICAkZmlsdGVyTW9kYWwuYW5pbWF0ZUNzcygnc2xpZGVPdXRSaWdodCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAkZmlsdGVyTW9kYWwucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykubGVuZ3RoID4gMCkge1xuICAgICAgICAvKipcbiAgICAgICAgICog0JDQvdC40LzQsNGG0LjRjyDRjdC70LXQvNC10L3RgtCwIGxhYmVsINC/0YDQuCDRhNC+0LrRg9GB0LUg0L/QvtC70LXQuSDRhNC+0YDQvNGLXG4gICAgICAgICAqL1xuICAgICAgICAkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gJChlbCkuZmluZCgnaW5wdXQsIHRleHRhcmVhJyk7XG5cbiAgICAgICAgICAgIGlmICgkKGZpZWxkKS52YWwoKS50cmltKCkgIT0gJycgfHwgJChmaWVsZCkuaXMoJzpwbGFjZWhvbGRlci1zaG93bicpKSB7XG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKGZpZWxkKS5vbignZm9jdXMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICQoZWwpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcbiAgICAgICAgICAgIH0pLm9uKCdibHVyJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKS50cmltKCkgPT09ICcnICYmICEkKGZpZWxkKS5pcygnOnBsYWNlaG9sZGVyLXNob3duJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJChlbCkucmVtb3ZlQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiBAc2VlIGh0dHBzOi8vYXRvbWlrcy5naXRodWIuaW8vdGlwcHlqcy8gKi9cblxuICAgIGNvbnN0IHRvb2x0aXBTZXR0aW5ncyA9IHtcbiAgICAgICAgYXJyb3c6IGZhbHNlLFxuICAgICAgICBhbGxvd0hUTUw6IGZhbHNlLFxuICAgICAgICBhbmltYXRlRmlsbDogZmFsc2UsXG4gICAgICAgIHBsYWNlbWVudDogJ3JpZ2h0LWNlbnRlcicsXG4gICAgICAgIGRpc3RhbmNlOiAyMCxcbiAgICAgICAgdGhlbWU6ICd0b29sdGlwJ1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBpbml0IGFsbCB0b29sdGlwc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXRUb29sdGlwcygpIHtcbiAgICAgICAgJCgnW2RhdGEtdG9vbHRpcF0nKS5lYWNoKChpbmRleCwgZWxlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbG9jYWxTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAkKGVsZW0pLmF0dHIoJ2RhdGEtdG9vbHRpcCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJChlbGVtKS5kYXRhKCdjbGljaycpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTZXR0aW5nc1sndHJpZ2dlciddID0gJ2NsaWNrIGtleXVwJztcbiAgICAgICAgICAgICAgICBsb2NhbFNldHRpbmdzWydpbnRlcmFjdGl2ZSddID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGlwcHkoZWxlbSwgT2JqZWN0LmFzc2lnbih7fSwgdG9vbHRpcFNldHRpbmdzLCBsb2NhbFNldHRpbmdzKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRUb29sdGlwcygpO1xuXG4gICAgLy8gc2hvcCBhZGRyZXNzXG4gICAgLy8g0JzQvtGB0LrQvtCy0YHQutCw0Y8g0L7QsdC70LDRgtGMLCDQodC+0LvQvdC10YfQvdC+0LPQvtGA0YHQutC40Lkg0YDQsNC50L7QvSwg0LQuINCU0YPRgNGL0LrQuNC90L4sIDHQlC5cbiAgICBjb25zdCBzaG9wID0ge2xhdDogNTYuMDU5Njk1LCBsbmc6IDM3LjE0NDE0Mn07XG5cbiAgICAvLyBmb3IgYmxhY2sgbWFwXG4gICAgY29uc3QgbWFwU3R5bGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMyMTIxMjFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLmljb25cIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM3NTc1NzVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuc3Ryb2tlXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjMjEyMTIxXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM3NTc1NzVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmUuY291bnRyeVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM5ZTllOWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmUubGFuZF9wYXJjZWxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlLmxvY2FsaXR5XCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiI2JkYmRiZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2lcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNzU3NTc1XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5wYXJrXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMxODE4MThcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLnBhcmtcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNjE2MTYxXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5wYXJrXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuc3Ryb2tlXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjMWIxYjFiXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWRcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjMmMyYzJjXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWRcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjOGE4YThhXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuYXJ0ZXJpYWxcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzM3MzczN1wiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXlcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzNjM2MzY1wiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXkuY29udHJvbGxlZF9hY2Nlc3NcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzRlNGU0ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmxvY2FsXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzYxNjE2MVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ0cmFuc2l0XCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzc1NzU3NVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjMDAwMDAwXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzNkM2QzZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdXG5cbiAgICAvLyBJbml0aWFsaXplIGFuZCBhZGQgdGhlIG1hcFxuICAgIGZ1bmN0aW9uIGluaXRNYXAoKSB7XG4gICAgICAgIC8vIFRoZSBtYXAsIGNlbnRlcmVkIGF0IFNob3BcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgICAgICAgICAgICAgIHpvb206IDE0LFxuICAgICAgICAgICAgICAgIGNlbnRlcjogc2hvcCxcbiAgICAgICAgICAgICAgICBzdHlsZXM6IG1hcFN0eWxlcyxcbiAgICAgICAgICAgICAgICB6b29tQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2NhbGVDb250cm9sOiB0cnVlLFxuICAgICAgICAgICAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByb3RhdGVDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBmdWxsc2NyZWVuQ29udHJvbDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcG9pbnRJY29uID0ge1xuICAgICAgICAgICAgdXJsOiAnaW1nL3N2Zy9wb2ludC5zdmcnLFxuICAgICAgICAgICAgLy8gVGhpcyBtYXJrZXIgaXMgNzIgcGl4ZWxzIHdpZGUgYnkgNzIgcGl4ZWxzIGhpZ2guXG4gICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSg3MiwgNzIpLFxuICAgICAgICAgICAgLy8gVGhlIG9yaWdpbiBmb3IgdGhpcyBpbWFnZSBpcyAoMCwgMCkuXG4gICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgIC8vIFRoZSBhbmNob3IgZm9yIHRoaXMgaW1hZ2UgaXMgdGhlIGNlbnRlciBhdCAoMCwgMzIpLlxuICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMzYsIDM2KVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRoZSBtYXJrZXIsIHBvc2l0aW9uZWQgYXQgc2hvcFxuICAgICAgICBjb25zdCBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBzaG9wLFxuICAgICAgICAgICAgaWNvbjogcG9pbnRJY29uLFxuICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHdpbmRvdy5pbml0TWFwID0gaW5pdE1hcDtcblxuO1xufSk7XG4iXSwiZmlsZSI6ImludGVybmFsLmpzIn0=

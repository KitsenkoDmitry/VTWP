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
  $(document).on('click', '.js-header-dropdown-btn', function (e) {
    e.preventDefault();
    var $self = $(e.currentTarget);
    var category = $self.attr('data-category');
    var $categoryDropdown = $("[data-dropdown-category='".concat(category, "']"));

    if ($self.hasClass('is-chosen')) {
      $self.removeClass('is-chosen');
      $categoryDropdown.removeClass('is-active');
      $header.removeClass('is-active');
      $('body').removeClass('has-overlay');
    } else {
      $('.js-header-dropdown-btn').removeClass('is-chosen');
      $('.js-header-dropdown').removeClass('is-active');
      $header.addClass('is-active');
      $self.addClass('is-chosen');
      $categoryDropdown.addClass('is-active');
      $('body').addClass('has-overlay');
      $(document).on('click', closeDropdownHandler);
    }
  });

  function closeDropdownHandler(e) {
    if ($(e.target).closest('.js-header').length === 0) {
      $('.js-header-dropdown-btn').removeClass('is-chosen');
      $('.js-header-dropdown').removeClass('is-active');
      $header.removeClass('is-active');
      $('body').removeClass('has-overlay');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wTGdTaXplIiwiZGVza3RvcE1kU2l6ZSIsImRlc2t0b3BTaXplIiwiZGVza3RvcFNtU2l6ZSIsInRhYmxldExnU2l6ZSIsInRhYmxldFNpemUiLCJtb2JpbGVMZ1NpemUiLCJtb2JpbGVTaXplIiwibGFuZyIsImF0dHIiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnREZXNrdG9wTGciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYnJlYWtwb2ludERlc2t0b3BNZCIsImJyZWFrcG9pbnREZXNrdG9wIiwiYnJlYWtwb2ludERlc2t0b3BTbSIsImJyZWFrcG9pbnRUYWJsZXRMZyIsImJyZWFrcG9pbnRUYWJsZXQiLCJicmVha3BvaW50TW9iaWxlTGdTaXplIiwiYnJlYWtwb2ludE1vYmlsZSIsImV4dGVuZCIsIm9uIiwibGVuZ3RoIiwiYXV0b3NpemUiLCJmbiIsImFuaW1hdGVDc3MiLCJhbmltYXRpb25OYW1lIiwiY2FsbGJhY2siLCJhbmltYXRpb25FbmQiLCJlbCIsImFuaW1hdGlvbnMiLCJhbmltYXRpb24iLCJPQW5pbWF0aW9uIiwiTW96QW5pbWF0aW9uIiwiV2Via2l0QW5pbWF0aW9uIiwidCIsInN0eWxlIiwidW5kZWZpbmVkIiwiY3JlYXRlRWxlbWVudCIsImFkZENsYXNzIiwib25lIiwicmVtb3ZlQ2xhc3MiLCJpc051bWVyaWMiLCJuIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJyZW1vdmVOb3REaWdpdHMiLCJwYXJhbSIsInRvU3RyaW5nIiwicmVwbGFjZSIsImRpdmlkZUJ5RGlnaXRzIiwibG9jYWxlIiwiUGFyc2xleSIsInNldExvY2FsZSIsIm9wdGlvbnMiLCJ0cmlnZ2VyIiwidmFsaWRhdGlvblRocmVzaG9sZCIsImVycm9yc1dyYXBwZXIiLCJlcnJvclRlbXBsYXRlIiwiY2xhc3NIYW5kbGVyIiwiaW5zdGFuY2UiLCIkZWxlbWVudCIsInR5cGUiLCIkaGFuZGxlciIsImhhc0NsYXNzIiwibmV4dCIsImVycm9yc0NvbnRhaW5lciIsIiRjb250YWluZXIiLCJjbG9zZXN0IiwicGFyZW50IiwiYWRkVmFsaWRhdG9yIiwidmFsaWRhdGVTdHJpbmciLCJ2YWx1ZSIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJkYXRhIiwibWF4IiwibWluRGF0ZSIsIm1heERhdGUiLCJ2YWx1ZURhdGUiLCJyZXN1bHQiLCJtYXRjaCIsIkRhdGUiLCJtYXhTaXplIiwicGFyc2xleUluc3RhbmNlIiwiZmlsZXMiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsImkiLCIkYmxvY2siLCIkbGFzdCIsImFmdGVyIiwiZWxlbWVudCIsInBhcnNsZXkiLCJlIiwiJHNlbGYiLCJjdXJyZW50VGFyZ2V0IiwiJGNvbGxhcHNlQm9keSIsImZpbmQiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwiaW5wdXRtYXNrIiwiY2xlYXJNYXNrT25Mb3N0Rm9jdXMiLCJzaG93TWFza09uSG92ZXIiLCJDdXN0b21TZWxlY3QiLCIkZWxlbSIsInNlbGYiLCJpbml0IiwiJGluaXRFbGVtIiwiZWFjaCIsInNlbGVjdFNlYXJjaCIsIm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIiwiSW5maW5pdHkiLCJzZWxlY3QyIiwic2VsZWN0T25CbHVyIiwiZHJvcGRvd25Dc3NDbGFzcyIsImxhbmd1YWdlIiwibm9SZXN1bHRzIiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbVNlbGVjdCIsImRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyIsImRhdGVGb3JtYXQiLCJzaG93T3RoZXJNb250aHMiLCJEYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsInNob3dNWSIsImN1cnJlbnREYXRlIiwiY3VycmVudERheSIsImdldERhdGUiLCJuZXdEYXRlIiwiZ2V0TW9udGgiLCJnZXRGdWxsWWVhciIsIml0ZW1PcHRpb25zIiwib25TZWxlY3QiLCJjaGFuZ2UiLCJzZXRUaW1lb3V0IiwiJG1vYmlsZU1lbnUiLCIkY2FydE1vZGFsIiwib3Blbk1vZGFsIiwiaGlkZU1vZGFsIiwicHJldmVudERlZmF1bHQiLCIkbW9kYWxCbG9jayIsImxvY2tEb2N1bWVudCIsInVubG9ja0RvY3VtZW50IiwiJGhlYWRlciIsImNhdGVnb3J5IiwiJGNhdGVnb3J5RHJvcGRvd24iLCJjbG9zZURyb3Bkb3duSGFuZGxlciIsInRhcmdldCIsIm9mZiIsIiR0YWJzIiwiJHRhYnNMaW5rcyIsIiR0YWJzSXRlbXMiLCIkaGlkZGVuRm9ybUZpZWxkcyIsInByb3AiLCJ2YWwiLCIkc2VsZkl0ZW0iLCJTcGlubmVyIiwic3RlcCIsInByZWNpc2lvbiIsImVsZW1lbnRzIiwiJGRlYyIsIiRpbmMiLCIkaW5wdXQiLCJ1cGRhdGVCdXR0b25zIiwiaW5zdGFuY2VzIiwic3Bpbm5lciIsImlzIiwiJHNwaW5uZXJzIiwiaW5kZXgiLCJibG9jayIsImdldEluc3RhbmNlIiwiZGlzYWJsZVNwaW5uZXIiLCJwdXNoIiwic3Bpbm5lckluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwiaGFuZGxlRGVjQ2xpY2siLCJoYW5kbGVJbmNDbGljayIsImhhbmRsZUlucHV0Iiwic3Bpbm5lcnMiLCJjcmVhdGUiLCIkdGFyZ2V0IiwidG9GaXhlZCIsImNoYW5nZVZhbHVlIiwiaW5pdENhcm91c2VscyIsIiRuZXdzQ2Fyb3VzZWwiLCJzbGljayIsImFycm93cyIsImluZmluaXRlIiwic2xpZGVzVG9TaG93IiwiY2VudGVyTW9kZSIsInZhcmlhYmxlV2lkdGgiLCJtb2JpbGVGaXJzdCIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCIkYmlrZXNDYXJvdXNlbCIsIiRjYXRlZ29yaWVzQ2Fyb3VzZWwiLCJjZW50ZXJQYWRkaW5nIiwiZG90cyIsIiRwcm9kdWN0Q2Fyb3VzZWwiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCIkc2ltaWxhckNhcm91c2VsIiwiJHBpY3R1cmVDYXJvdXNlbCIsInNsaWRlc1RvU2Nyb2xsIiwiJHVwQnRuIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIndpZHRoIiwic2hvdyIsImhpZGUiLCIkZmlsdGVyTW9kYWwiLCJmaWVsZCIsInRyaW0iLCJldmVudCIsInRvb2x0aXBTZXR0aW5ncyIsImFycm93IiwiYWxsb3dIVE1MIiwiYW5pbWF0ZUZpbGwiLCJwbGFjZW1lbnQiLCJkaXN0YW5jZSIsInRoZW1lIiwiaW5pdFRvb2x0aXBzIiwiZWxlbSIsImxvY2FsU2V0dGluZ3MiLCJjb250ZW50IiwidGlwcHkiLCJPYmplY3QiLCJhc3NpZ24iLCJzaG9wIiwibGF0IiwibG5nIiwibWFwU3R5bGVzIiwiaW5pdE1hcCIsIm1hcCIsImdvb2dsZSIsIm1hcHMiLCJNYXAiLCJnZXRFbGVtZW50QnlJZCIsInpvb20iLCJjZW50ZXIiLCJzdHlsZXMiLCJ6b29tQ29udHJvbCIsIm1hcFR5cGVDb250cm9sIiwic2NhbGVDb250cm9sIiwic3RyZWV0Vmlld0NvbnRyb2wiLCJyb3RhdGVDb250cm9sIiwiZnVsbHNjcmVlbkNvbnRyb2wiLCJwb2ludEljb24iLCJ1cmwiLCJTaXplIiwib3JpZ2luIiwiUG9pbnQiLCJhbmNob3IiLCJtYXJrZXIiLCJNYXJrZXIiLCJwb3NpdGlvbiIsImljb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWUMsS0FBWixDQUFrQixZQUFXO0FBQ3pCOzs7QUFHQSxNQUFJQyxhQUFhLEdBQUc7QUFDaEI7QUFDQUMsSUFBQUEsSUFBSSxFQUFHLEdBRlM7QUFJaEI7QUFDQUMsSUFBQUEsYUFBYSxFQUFHLElBTEE7QUFNaEJDLElBQUFBLGFBQWEsRUFBRyxJQU5BO0FBT2hCQyxJQUFBQSxXQUFXLEVBQUssSUFQQTtBQVFoQkMsSUFBQUEsYUFBYSxFQUFHLElBUkE7QUFTaEJDLElBQUFBLFlBQVksRUFBSSxJQVRBO0FBVWhCQyxJQUFBQSxVQUFVLEVBQU0sR0FWQTtBQVdoQkMsSUFBQUEsWUFBWSxFQUFJLEdBWEE7QUFZaEJDLElBQUFBLFVBQVUsRUFBTSxHQVpBO0FBY2hCQyxJQUFBQSxJQUFJLEVBQUViLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVWMsSUFBVixDQUFlLE1BQWY7QUFkVSxHQUFwQixDQUp5QixDQXFCekI7QUFDQTs7QUFDQSxNQUFNQyxXQUFXLEdBQUc7QUFDaEJDLElBQUFBLG1CQUFtQixFQUFFQyxNQUFNLENBQUNDLFVBQVAsdUJBQWlDZixhQUFhLENBQUNFLGFBQWQsR0FBOEIsQ0FBL0QsU0FETDtBQUVoQmMsSUFBQUEsbUJBQW1CLEVBQUVGLE1BQU0sQ0FBQ0MsVUFBUCx1QkFBaUNmLGFBQWEsQ0FBQ0csYUFBZCxHQUE4QixDQUEvRCxTQUZMO0FBR2hCYyxJQUFBQSxpQkFBaUIsRUFBRUgsTUFBTSxDQUFDQyxVQUFQLHVCQUFpQ2YsYUFBYSxDQUFDSSxXQUFkLEdBQTRCLENBQTdELFNBSEg7QUFJaEJjLElBQUFBLG1CQUFtQixFQUFFSixNQUFNLENBQUNDLFVBQVAsdUJBQWlDZixhQUFhLENBQUNLLGFBQWQsR0FBOEIsQ0FBL0QsU0FKTDtBQUtoQmMsSUFBQUEsa0JBQWtCLEVBQUVMLE1BQU0sQ0FBQ0MsVUFBUCx1QkFBaUNmLGFBQWEsQ0FBQ00sWUFBZCxHQUE2QixDQUE5RCxTQUxKO0FBTWhCYyxJQUFBQSxnQkFBZ0IsRUFBRU4sTUFBTSxDQUFDQyxVQUFQLHVCQUFpQ2YsYUFBYSxDQUFDTyxVQUFkLEdBQTJCLENBQTVELFNBTkY7QUFPaEJjLElBQUFBLHNCQUFzQixFQUFFUCxNQUFNLENBQUNDLFVBQVAsdUJBQWlDZixhQUFhLENBQUNRLFlBQWQsR0FBNkIsQ0FBOUQsU0FQUjtBQVFoQmMsSUFBQUEsZ0JBQWdCLEVBQUVSLE1BQU0sQ0FBQ0MsVUFBUCx1QkFBaUNmLGFBQWEsQ0FBQ1MsVUFBZCxHQUEyQixDQUE1RDtBQVJGLEdBQXBCO0FBV0FaLEVBQUFBLENBQUMsQ0FBQzBCLE1BQUYsQ0FBUyxJQUFULEVBQWV2QixhQUFmLEVBQThCWSxXQUE5QjtBQUVBZixFQUFBQSxDQUFDLENBQUNpQixNQUFELENBQUQsQ0FBVVUsRUFBVixDQUFhLE1BQWIsRUFBcUIsWUFBTTtBQUN2QixRQUFJM0IsQ0FBQyxDQUFDLFVBQUQsQ0FBRCxDQUFjNEIsTUFBZCxHQUF1QixDQUEzQixFQUE4QjtBQUMxQkMsTUFBQUEsUUFBUSxDQUFDN0IsQ0FBQyxDQUFDLFVBQUQsQ0FBRixDQUFSO0FBQ0g7QUFDSixHQUpEO0FBTUE7Ozs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7OztBQWVKQSxFQUFBQSxDQUFDLENBQUM4QixFQUFGLENBQUtKLE1BQUwsQ0FBWTtBQUNSSyxJQUFBQSxVQUFVLEVBQUUsb0JBQVNDLGFBQVQsRUFBd0JDLFFBQXhCLEVBQWtDO0FBQzFDLFVBQUlDLFlBQVksR0FBSSxVQUFTQyxFQUFULEVBQWE7QUFDN0IsWUFBSUMsVUFBVSxHQUFHO0FBQ2JDLFVBQUFBLFNBQVMsRUFBRSxjQURFO0FBRWJDLFVBQUFBLFVBQVUsRUFBRSxlQUZDO0FBR2JDLFVBQUFBLFlBQVksRUFBRSxpQkFIRDtBQUliQyxVQUFBQSxlQUFlLEVBQUU7QUFKSixTQUFqQjs7QUFPQSxhQUFLLElBQUlDLENBQVQsSUFBY0wsVUFBZCxFQUEwQjtBQUN0QixjQUFJRCxFQUFFLENBQUNPLEtBQUgsQ0FBU0QsQ0FBVCxNQUFnQkUsU0FBcEIsRUFBK0I7QUFDM0IsbUJBQU9QLFVBQVUsQ0FBQ0ssQ0FBRCxDQUFqQjtBQUNIO0FBQ0o7QUFDSixPQWJrQixDQWFoQnhDLFFBQVEsQ0FBQzJDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FiZ0IsQ0FBbkI7O0FBZUEsV0FBS0MsUUFBTCxDQUFjLGNBQWNiLGFBQTVCLEVBQTJDYyxHQUEzQyxDQUErQ1osWUFBL0MsRUFBNkQsWUFBVztBQUNwRWxDLFFBQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUStDLFdBQVIsQ0FBb0IsY0FBY2YsYUFBbEM7QUFFQSxZQUFJLE9BQU9DLFFBQVAsS0FBb0IsVUFBeEIsRUFBb0NBLFFBQVE7QUFDL0MsT0FKRDtBQU1BLGFBQU8sSUFBUDtBQUNIO0FBeEJPLEdBQVosRUE1RDZCLENBc0Z6Qjs7QUFFQTs7Ozs7OztBQU1BLFdBQVNlLFNBQVQsQ0FBbUJDLENBQW5CLEVBQXNCO0FBQ2xCLFdBQU8sQ0FBQ0MsS0FBSyxDQUFDQyxVQUFVLENBQUNGLENBQUQsQ0FBWCxDQUFOLElBQXlCRyxRQUFRLENBQUNILENBQUQsQ0FBeEM7QUFDSDtBQUdEOzs7Ozs7OztBQU1BLFdBQVNJLGVBQVQsQ0FBeUJDLEtBQXpCLEVBQWdDO0FBQzVCO0FBQ0EsV0FBTyxDQUFDQSxLQUFLLENBQUNDLFFBQU4sR0FBaUJDLE9BQWpCLENBQXlCLEtBQXpCLEVBQWdDLEVBQWhDLENBQVI7QUFDSDtBQUVEOzs7Ozs7Ozs7QUFPQSxXQUFTQyxjQUFULENBQXdCSCxLQUF4QixFQUErQjtBQUMzQixRQUFJQSxLQUFLLEtBQUssSUFBZCxFQUFvQkEsS0FBSyxHQUFHLENBQVI7QUFDcEIsV0FBT0EsS0FBSyxDQUFDQyxRQUFOLEdBQWlCQyxPQUFqQixDQUF5Qiw2QkFBekIsRUFBd0QsS0FBeEQsQ0FBUDtBQUNIOztBQUVELE1BQUlFLE1BQU0sR0FBR3ZELGFBQWEsQ0FBQ1UsSUFBZCxJQUFzQixPQUF0QixHQUFnQyxJQUFoQyxHQUF1QyxJQUFwRDtBQUVBOEMsRUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQWtCRixNQUFsQjtBQUVBOztBQUNBMUQsRUFBQUEsQ0FBQyxDQUFDMEIsTUFBRixDQUFTaUMsT0FBTyxDQUFDRSxPQUFqQixFQUEwQjtBQUN0QkMsSUFBQUEsT0FBTyxFQUFFLGFBRGE7QUFDRTtBQUN4QkMsSUFBQUEsbUJBQW1CLEVBQUUsR0FGQztBQUd0QkMsSUFBQUEsYUFBYSxFQUFFLGFBSE87QUFJdEJDLElBQUFBLGFBQWEsRUFBRSx1Q0FKTztBQUt0QkMsSUFBQUEsWUFBWSxFQUFFLHNCQUFTQyxRQUFULEVBQW1CO0FBQzdCLFVBQU1DLFFBQVEsR0FBR0QsUUFBUSxDQUFDQyxRQUExQjtBQUNBLFVBQUlDLElBQUksR0FBR0QsUUFBUSxDQUFDdEQsSUFBVCxDQUFjLE1BQWQsQ0FBWDtBQUFBLFVBQ0l3RCxRQURKOztBQUVBLFVBQUlELElBQUksSUFBSSxVQUFSLElBQXNCQSxJQUFJLElBQUksT0FBbEMsRUFBMkM7QUFDdkNDLFFBQUFBLFFBQVEsR0FBR0YsUUFBWCxDQUR1QyxDQUNsQjtBQUN4QixPQUZELE1BR0ssSUFBSUEsUUFBUSxDQUFDRyxRQUFULENBQWtCLDJCQUFsQixDQUFKLEVBQW9EO0FBQ3JERCxRQUFBQSxRQUFRLEdBQUd0RSxDQUFDLENBQUMsNEJBQUQsRUFBK0JvRSxRQUFRLENBQUNJLElBQVQsQ0FBYyxVQUFkLENBQS9CLENBQVo7QUFDSDs7QUFFRCxhQUFPRixRQUFQO0FBQ0gsS0FqQnFCO0FBa0J0QkcsSUFBQUEsZUFBZSxFQUFFLHlCQUFTTixRQUFULEVBQW1CO0FBQ2hDLFVBQU1DLFFBQVEsR0FBR0QsUUFBUSxDQUFDQyxRQUExQjtBQUNBLFVBQUlDLElBQUksR0FBR0QsUUFBUSxDQUFDdEQsSUFBVCxDQUFjLE1BQWQsQ0FBWDtBQUFBLFVBQ0k0RCxVQURKOztBQUdBLFVBQUlMLElBQUksSUFBSSxVQUFSLElBQXNCQSxJQUFJLElBQUksT0FBbEMsRUFBMkM7QUFDdkNLLFFBQUFBLFVBQVUsR0FBRzFFLENBQUMsbUJBQVdvRSxRQUFRLENBQUN0RCxJQUFULENBQWMsTUFBZCxDQUFYLHNCQUFELENBQW9EMEQsSUFBcEQsQ0FBeUQsbUJBQXpELENBQWI7QUFDSCxPQUZELE1BR0ssSUFBSUosUUFBUSxDQUFDRyxRQUFULENBQWtCLDJCQUFsQixDQUFKLEVBQW9EO0FBQ3JERyxRQUFBQSxVQUFVLEdBQUdOLFFBQVEsQ0FBQ0ksSUFBVCxDQUFjLFVBQWQsRUFBMEJBLElBQTFCLENBQStCLG1CQUEvQixDQUFiO0FBQ0gsT0FGSSxNQUdBLElBQUlILElBQUksSUFBSSxNQUFaLEVBQW9CO0FBQ3JCSyxRQUFBQSxVQUFVLEdBQUdOLFFBQVEsQ0FBQ08sT0FBVCxDQUFpQixjQUFqQixFQUFpQ0gsSUFBakMsQ0FBc0MsbUJBQXRDLENBQWI7QUFDSCxPQUZJLE1BR0EsSUFBSUosUUFBUSxDQUFDdEQsSUFBVCxDQUFjLE1BQWQsS0FBeUIsc0JBQTdCLEVBQXFEO0FBQ3RENEQsUUFBQUEsVUFBVSxHQUFHTixRQUFRLENBQUNRLE1BQVQsR0FBa0JKLElBQWxCLENBQXVCLGNBQXZCLEVBQXVDQSxJQUF2QyxDQUE0QyxtQkFBNUMsQ0FBYjtBQUNILE9BaEIrQixDQWlCaEM7QUFDQTtBQUNBO0FBQ0E7OztBQUVBLGFBQU9FLFVBQVA7QUFDSDtBQXpDcUIsR0FBMUIsRUEvSHlCLENBMkt6QjtBQUVBOztBQUNBZixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLFFBQXJCLEVBQStCO0FBQzNCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0I7QUFDNUIsYUFBTyxnQkFBZ0JDLElBQWhCLENBQXFCRCxLQUFyQixDQUFQO0FBQ0gsS0FIMEI7QUFJM0JFLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsNEJBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFKaUIsR0FBL0IsRUE5S3lCLENBd0x6Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2tCLFlBQVIsQ0FBcUIsUUFBckIsRUFBK0I7QUFDM0JDLElBQUFBLGNBQWMsRUFBRSx3QkFBU0MsS0FBVCxFQUFnQjtBQUM1QixhQUFPLGVBQWVDLElBQWYsQ0FBb0JELEtBQXBCLENBQVA7QUFDSCxLQUgwQjtBQUkzQkUsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSw0QkFERTtBQUVOQyxNQUFBQSxFQUFFLEVBQUU7QUFGRTtBQUppQixHQUEvQixFQXpMeUIsQ0FtTXpCOztBQUNBeEIsRUFBQUEsT0FBTyxDQUFDa0IsWUFBUixDQUFxQixNQUFyQixFQUE2QjtBQUN6QkMsSUFBQUEsY0FBYyxFQUFFLHdCQUFTQyxLQUFULEVBQWdCO0FBQzVCLGFBQU8sbUJBQW1CQyxJQUFuQixDQUF3QkQsS0FBeEIsQ0FBUDtBQUNILEtBSHdCO0FBSXpCRSxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLHNDQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBSmUsR0FBN0IsRUFwTXlCLENBOE16Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2tCLFlBQVIsQ0FBcUIsYUFBckIsRUFBb0M7QUFDaENDLElBQUFBLGNBQWMsRUFBRSx3QkFBU0MsS0FBVCxFQUFnQjtBQUM1QixhQUFPLGdCQUFnQkMsSUFBaEIsQ0FBcUJELEtBQXJCLENBQVA7QUFDSCxLQUgrQjtBQUloQ0UsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSx1QkFERTtBQUVOQyxNQUFBQSxFQUFFLEVBQUU7QUFGRTtBQUpzQixHQUFwQyxFQS9NeUIsQ0F5TnpCOztBQUNBeEIsRUFBQUEsT0FBTyxDQUFDa0IsWUFBUixDQUFxQixXQUFyQixFQUFrQztBQUM5QkMsSUFBQUEsY0FBYyxFQUFFLHdCQUFTQyxLQUFULEVBQWdCO0FBQzVCLGFBQU8sbUJBQW1CQyxJQUFuQixDQUF3QkQsS0FBeEIsQ0FBUDtBQUNILEtBSDZCO0FBSTlCRSxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLGlDQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBSm9CLEdBQWxDLEVBMU55QixDQW9PekI7O0FBQ0F4QixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLE9BQXJCLEVBQThCO0FBQzFCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0I7QUFDNUIsYUFBTyxpQkFBaUJDLElBQWpCLENBQXNCRCxLQUF0QixDQUFQO0FBQ0gsS0FIeUI7QUFJMUJFLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsK0JBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFKZ0IsR0FBOUIsRUFyT3lCLENBK096Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2tCLFlBQVIsQ0FBcUIsUUFBckIsRUFBK0I7QUFDM0JDLElBQUFBLGNBQWMsRUFBRSx3QkFBU0MsS0FBVCxFQUFnQjtBQUM1QixhQUFPLFlBQVlDLElBQVosQ0FBaUJELEtBQWpCLENBQVA7QUFDSCxLQUgwQjtBQUkzQkUsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSxhQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBSmlCLEdBQS9CLEVBaFB5QixDQTBQekI7O0FBQ0F4QixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLE9BQXJCLEVBQThCO0FBQzFCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0I7QUFDNUIsYUFBTyx3SUFBd0lDLElBQXhJLENBQTZJRCxLQUE3SSxDQUFQO0FBQ0gsS0FIeUI7QUFJMUJFLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsNkJBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFKZ0IsR0FBOUIsRUEzUHlCLENBcVF6Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2tCLFlBQVIsQ0FBcUIsTUFBckIsRUFBNkI7QUFDekJDLElBQUFBLGNBQWMsRUFBRSx3QkFBU0MsS0FBVCxFQUFnQjtBQUM1QixVQUFJSyxPQUFPLEdBQUcsa1RBQWQ7QUFBQSxVQUNJQyxRQUFRLEdBQUcsK0JBRGY7QUFBQSxVQUVJQyxHQUFHLEdBQUdDLFNBQVMsQ0FBQyxDQUFELENBQVQsQ0FBYW5CLFFBQWIsQ0FBc0JvQixJQUF0QixDQUEyQixTQUEzQixDQUZWO0FBQUEsVUFHSUMsR0FBRyxHQUFHRixTQUFTLENBQUMsQ0FBRCxDQUFULENBQWFuQixRQUFiLENBQXNCb0IsSUFBdEIsQ0FBMkIsU0FBM0IsQ0FIVjtBQUFBLFVBSUlFLE9BSko7QUFBQSxVQUlhQyxPQUpiO0FBQUEsVUFJc0JDLFNBSnRCO0FBQUEsVUFJaUNDLE1BSmpDOztBQU1BLFVBQUlQLEdBQUcsS0FBS08sTUFBTSxHQUFHUCxHQUFHLENBQUNRLEtBQUosQ0FBVVQsUUFBVixDQUFkLENBQVAsRUFBMkM7QUFDdkNLLFFBQUFBLE9BQU8sR0FBRyxJQUFJSyxJQUFKLENBQVMsQ0FBQ0YsTUFBTSxDQUFDLENBQUQsQ0FBaEIsRUFBcUJBLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWSxDQUFqQyxFQUFvQyxDQUFDQSxNQUFNLENBQUMsQ0FBRCxDQUEzQyxDQUFWO0FBQ0g7O0FBQ0QsVUFBSUosR0FBRyxLQUFLSSxNQUFNLEdBQUdKLEdBQUcsQ0FBQ0ssS0FBSixDQUFVVCxRQUFWLENBQWQsQ0FBUCxFQUEyQztBQUN2Q00sUUFBQUEsT0FBTyxHQUFHLElBQUlJLElBQUosQ0FBUyxDQUFDRixNQUFNLENBQUMsQ0FBRCxDQUFoQixFQUFxQkEsTUFBTSxDQUFDLENBQUQsQ0FBTixHQUFZLENBQWpDLEVBQW9DLENBQUNBLE1BQU0sQ0FBQyxDQUFELENBQTNDLENBQVY7QUFDSDs7QUFDRCxVQUFJQSxNQUFNLEdBQUdkLEtBQUssQ0FBQ2UsS0FBTixDQUFZVCxRQUFaLENBQWIsRUFBb0M7QUFDaENPLFFBQUFBLFNBQVMsR0FBRyxJQUFJRyxJQUFKLENBQVMsQ0FBQ0YsTUFBTSxDQUFDLENBQUQsQ0FBaEIsRUFBcUJBLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWSxDQUFqQyxFQUFvQyxDQUFDQSxNQUFNLENBQUMsQ0FBRCxDQUEzQyxDQUFaO0FBQ0g7O0FBRUQsYUFBT1QsT0FBTyxDQUFDSixJQUFSLENBQWFELEtBQWIsTUFBd0JXLE9BQU8sR0FBR0UsU0FBUyxJQUFJRixPQUFoQixHQUEwQixJQUF6RCxNQUFtRUMsT0FBTyxHQUFHQyxTQUFTLElBQUlELE9BQWhCLEdBQTBCLElBQXBHLENBQVA7QUFDSCxLQW5Cd0I7QUFvQnpCVixJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLG1CQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBcEJlLEdBQTdCLEVBdFF5QixDQWlTekI7O0FBQ0F4QixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLGFBQXJCLEVBQW9DO0FBQ2hDQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0JpQixPQUFoQixFQUF5QkMsZUFBekIsRUFBMEM7QUFDdEQsVUFBSUMsS0FBSyxHQUFHRCxlQUFlLENBQUM3QixRQUFoQixDQUF5QixDQUF6QixFQUE0QjhCLEtBQXhDO0FBQ0EsYUFBT0EsS0FBSyxDQUFDdEUsTUFBTixJQUFnQixDQUFoQixJQUFzQnNFLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBU0MsSUFBVCxJQUFpQkgsT0FBTyxHQUFHLElBQXhEO0FBQ0gsS0FKK0I7QUFLaENJLElBQUFBLGVBQWUsRUFBRSxTQUxlO0FBTWhDbkIsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSx3Q0FERTtBQUVOQyxNQUFBQSxFQUFFLEVBQUU7QUFGRTtBQU5zQixHQUFwQyxFQWxTeUIsQ0E4U3pCOztBQUNBeEIsRUFBQUEsT0FBTyxDQUFDa0IsWUFBUixDQUFxQixlQUFyQixFQUFzQztBQUNsQ0MsSUFBQUEsY0FBYyxFQUFFLHdCQUFTQyxLQUFULEVBQWdCc0IsT0FBaEIsRUFBeUI7QUFDckMsVUFBSUMsYUFBYSxHQUFHdkIsS0FBSyxDQUFDd0IsS0FBTixDQUFZLEdBQVosRUFBaUJDLEdBQWpCLEVBQXBCO0FBQ0EsVUFBSUMsVUFBVSxHQUFHSixPQUFPLENBQUNFLEtBQVIsQ0FBYyxJQUFkLENBQWpCO0FBQ0EsVUFBSUcsS0FBSyxHQUFHLEtBQVo7O0FBRUEsV0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixVQUFVLENBQUM3RSxNQUEvQixFQUF1QytFLENBQUMsRUFBeEMsRUFBNEM7QUFDeEMsWUFBSUwsYUFBYSxLQUFLRyxVQUFVLENBQUNFLENBQUQsQ0FBaEMsRUFBcUM7QUFDakNELFVBQUFBLEtBQUssR0FBRyxJQUFSO0FBQ0E7QUFDSDtBQUNKOztBQUVELGFBQU9BLEtBQVA7QUFDSCxLQWRpQztBQWVsQ3pCLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsbUNBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFmd0IsR0FBdEMsRUEvU3lCLENBb1V6Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2hDLEVBQVIsQ0FBVyxZQUFYLEVBQXlCLFlBQVc7QUFDaEMsUUFBSXlDLFFBQVEsR0FBRyxLQUFLQSxRQUFwQjtBQUFBLFFBQ0lDLElBQUksR0FBR0QsUUFBUSxDQUFDdEQsSUFBVCxDQUFjLE1BQWQsQ0FEWDtBQUFBLFFBRUk4RixNQUFNLEdBQUc1RyxDQUFDLENBQUMsUUFBRCxDQUFELENBQVk2QyxRQUFaLENBQXFCLGtCQUFyQixDQUZiO0FBQUEsUUFHSWdFLEtBSEo7O0FBS0EsUUFBSXhDLElBQUksSUFBSSxVQUFSLElBQXNCQSxJQUFJLElBQUksT0FBbEMsRUFBMkM7QUFDdkN3QyxNQUFBQSxLQUFLLEdBQUc3RyxDQUFDLG1CQUFXb0UsUUFBUSxDQUFDdEQsSUFBVCxDQUFjLE1BQWQsQ0FBWCxzQkFBVDs7QUFDQSxVQUFJLENBQUMrRixLQUFLLENBQUNyQyxJQUFOLENBQVcsbUJBQVgsRUFBZ0M1QyxNQUFyQyxFQUE2QztBQUN6Q2lGLFFBQUFBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRixNQUFaO0FBQ0g7QUFDSixLQUxELE1BS08sSUFBSXhDLFFBQVEsQ0FBQ0csUUFBVCxDQUFrQiwyQkFBbEIsQ0FBSixFQUFvRDtBQUN2RHNDLE1BQUFBLEtBQUssR0FBR3pDLFFBQVEsQ0FBQ0ksSUFBVCxDQUFjLFVBQWQsQ0FBUjs7QUFDQSxVQUFJLENBQUNxQyxLQUFLLENBQUNyQyxJQUFOLENBQVcsbUJBQVgsRUFBZ0M1QyxNQUFyQyxFQUE2QztBQUN6Q2lGLFFBQUFBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRixNQUFaO0FBQ0g7QUFDSixLQUxNLE1BS0EsSUFBSXZDLElBQUksSUFBSSxNQUFaLEVBQW9CO0FBQ3ZCd0MsTUFBQUEsS0FBSyxHQUFHekMsUUFBUSxDQUFDTyxPQUFULENBQWlCLGNBQWpCLENBQVI7O0FBQ0EsVUFBSSxDQUFDa0MsS0FBSyxDQUFDckMsSUFBTixDQUFXLG1CQUFYLEVBQWdDNUMsTUFBckMsRUFBNkM7QUFDekNpRixRQUFBQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUYsTUFBWjtBQUNIO0FBQ0osS0FMTSxNQUtBLElBQUl4QyxRQUFRLENBQUNPLE9BQVQsQ0FBaUIsc0JBQWpCLEVBQXlDL0MsTUFBN0MsRUFBcUQ7QUFDeERpRixNQUFBQSxLQUFLLEdBQUd6QyxRQUFRLENBQUNPLE9BQVQsQ0FBaUIsc0JBQWpCLENBQVI7O0FBQ0EsVUFBSSxDQUFDa0MsS0FBSyxDQUFDckMsSUFBTixDQUFXLG1CQUFYLEVBQWdDNUMsTUFBckMsRUFBNkM7QUFDekNpRixRQUFBQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUYsTUFBWjtBQUNIO0FBQ0osS0FMTSxNQUtBLElBQUl4QyxRQUFRLENBQUN0RCxJQUFULENBQWMsTUFBZCxLQUF5QixzQkFBN0IsRUFBcUQ7QUFDeEQrRixNQUFBQSxLQUFLLEdBQUd6QyxRQUFRLENBQUNRLE1BQVQsR0FBa0JKLElBQWxCLENBQXVCLGNBQXZCLENBQVI7O0FBQ0EsVUFBSSxDQUFDcUMsS0FBSyxDQUFDckMsSUFBTixDQUFXLG1CQUFYLEVBQWdDNUMsTUFBckMsRUFBNkM7QUFDekNpRixRQUFBQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUYsTUFBWjtBQUNIO0FBQ0o7QUFDSixHQWhDRCxFQXJVeUIsQ0F1V3pCOztBQUNBakQsRUFBQUEsT0FBTyxDQUFDaEMsRUFBUixDQUFXLGlCQUFYLEVBQThCLFlBQVc7QUFDckMsUUFBSXlDLFFBQVEsR0FBR3BFLENBQUMsQ0FBQyxLQUFLK0csT0FBTixDQUFoQjtBQUNILEdBRkQ7QUFJQS9HLEVBQUFBLENBQUMsQ0FBQyw0QkFBRCxDQUFELENBQWdDZ0gsT0FBaEMsR0E1V3lCLENBOFd6Qjs7QUFDQSxNQUFJaEgsQ0FBQyxDQUFDLGtCQUFELENBQUQsQ0FBc0I0QixNQUExQixFQUFrQztBQUM5QjVCLElBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixrQkFBeEIsRUFBNEMsVUFBQ3NGLENBQUQsRUFBTztBQUMvQyxVQUFNQyxLQUFLLEdBQUdsSCxDQUFDLENBQUNpSCxDQUFDLENBQUNFLGFBQUgsQ0FBZjtBQUNBLFVBQU1DLGFBQWEsR0FBR0YsS0FBSyxDQUFDdkMsT0FBTixDQUFjLGNBQWQsRUFBOEIwQyxJQUE5QixDQUFtQyxtQkFBbkMsQ0FBdEI7O0FBQ0EsVUFBSUgsS0FBSyxDQUFDM0MsUUFBTixDQUFlLFdBQWYsQ0FBSixFQUFpQztBQUM3QjJDLFFBQUFBLEtBQUssQ0FBQ25FLFdBQU4sQ0FBa0IsV0FBbEI7QUFDQXFFLFFBQUFBLGFBQWEsQ0FBQ0UsT0FBZCxDQUFzQixNQUF0QjtBQUNILE9BSEQsTUFHTztBQUNISixRQUFBQSxLQUFLLENBQUNyRSxRQUFOLENBQWUsV0FBZjtBQUNBdUUsUUFBQUEsYUFBYSxDQUFDRyxTQUFkLENBQXdCLE1BQXhCO0FBQ0g7QUFDSixLQVZEO0FBV0g7QUFFRDs7Ozs7Ozs7O0FBT0F2SCxFQUFBQSxDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQndILFNBQXBCLENBQThCLG1CQUE5QixFQUFtRDtBQUMvQ0MsSUFBQUEsb0JBQW9CLEVBQUUsSUFEeUI7QUFFL0NDLElBQUFBLGVBQWUsRUFBRTtBQUY4QixHQUFuRDtBQUtBOzs7OztBQUlBLE1BQUlDLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQVNDLEtBQVQsRUFBZ0I7QUFDL0IsUUFBSUMsSUFBSSxHQUFHLElBQVg7O0FBRUFBLElBQUFBLElBQUksQ0FBQ0MsSUFBTCxHQUFZLFVBQVNDLFNBQVQsRUFBb0I7QUFDNUJBLE1BQUFBLFNBQVMsQ0FBQ0MsSUFBVixDQUFlLFlBQVc7QUFDdEIsWUFBSWhJLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXVFLFFBQVIsQ0FBaUIsMkJBQWpCLENBQUosRUFBbUQ7QUFDL0M7QUFDSCxTQUZELE1BRU87QUFDSCxjQUFJMEQsWUFBWSxHQUFHakksQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRd0YsSUFBUixDQUFhLFFBQWIsQ0FBbkI7QUFDQSxjQUFJMEMsdUJBQUo7O0FBRUEsY0FBSUQsWUFBSixFQUFrQjtBQUNkQyxZQUFBQSx1QkFBdUIsR0FBRyxDQUExQixDQURjLENBQ2U7QUFDaEMsV0FGRCxNQUVPO0FBQ0hBLFlBQUFBLHVCQUF1QixHQUFHQyxRQUExQixDQURHLENBQ2lDO0FBQ3ZDOztBQUVEbkksVUFBQUEsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRb0ksT0FBUixDQUFnQjtBQUNaRixZQUFBQSx1QkFBdUIsRUFBRUEsdUJBRGI7QUFFWkcsWUFBQUEsWUFBWSxFQUFFLElBRkY7QUFHWkMsWUFBQUEsZ0JBQWdCLEVBQUUsT0FITjtBQUlaQyxZQUFBQSxRQUFRLEVBQUU7QUFDTkMsY0FBQUEsU0FBUyxFQUFFLHFCQUFZO0FBQ25CLHVCQUFPLHVCQUFQO0FBQ0g7QUFISztBQUpFLFdBQWhCO0FBV0F4SSxVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVEyQixFQUFSLENBQVcsUUFBWCxFQUFxQixVQUFTc0YsQ0FBVCxFQUFZO0FBQzdCO0FBQ0FqSCxZQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFxSCxJQUFSLDBCQUE4QnJILENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUStFLEtBQXRDLFVBQWlEMEQsS0FBakQ7QUFDSCxXQUhEO0FBSUg7QUFDSixPQTdCRDtBQStCSCxLQWhDRDs7QUFrQ0FaLElBQUFBLElBQUksQ0FBQ2EsTUFBTCxHQUFjLFVBQVNDLFdBQVQsRUFBc0I7QUFDaENBLE1BQUFBLFdBQVcsQ0FBQ1AsT0FBWixDQUFvQixTQUFwQjtBQUNBUCxNQUFBQSxJQUFJLENBQUNDLElBQUwsQ0FBVWEsV0FBVjtBQUNILEtBSEQ7O0FBS0FkLElBQUFBLElBQUksQ0FBQ0MsSUFBTCxDQUFVRixLQUFWO0FBQ0gsR0EzQ0Q7O0FBNkNBLE1BQUlnQixZQUFZLEdBQUcsSUFBSWpCLFlBQUosQ0FBaUIzSCxDQUFDLENBQUMsUUFBRCxDQUFsQixDQUFuQjtBQUVBLE1BQU02SSx3QkFBd0IsR0FBRztBQUM3QkMsSUFBQUEsVUFBVSxFQUFFLFVBRGlCO0FBRTdCQyxJQUFBQSxlQUFlLEVBQUU7QUFGWSxHQUFqQztBQUtBOzs7Ozs7Ozs7QUFRQSxNQUFJQyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxHQUFXO0FBQ3hCLFFBQU1DLFVBQVUsR0FBR2pKLENBQUMsQ0FBQyxnQkFBRCxDQUFwQjtBQUVBaUosSUFBQUEsVUFBVSxDQUFDakIsSUFBWCxDQUFnQixZQUFZO0FBQ3hCLFVBQUl0QyxPQUFPLEdBQUcxRixDQUFDLENBQUMsSUFBRCxDQUFELENBQVF3RixJQUFSLENBQWEsVUFBYixDQUFkO0FBQ0EsVUFBSUcsT0FBTyxHQUFHM0YsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRd0YsSUFBUixDQUFhLFVBQWIsQ0FBZDtBQUNBLFVBQU0wRCxNQUFNLEdBQUdsSixDQUFDLENBQUMsSUFBRCxDQUFELENBQVF3RixJQUFSLENBQWEsVUFBYixDQUFmO0FBRUE7O0FBQ0EsVUFBS0csT0FBTyxLQUFLLFNBQVosSUFBeUJELE9BQU8sS0FBSyxTQUExQyxFQUFxRDtBQUNqRCxZQUFNeUQsV0FBVyxHQUFHLElBQUlwRCxJQUFKLEVBQXBCO0FBQ0EsWUFBSXFELFVBQVUsR0FBR0QsV0FBVyxDQUFDRSxPQUFaLEVBQWpCO0FBQ0FELFFBQUFBLFVBQVUsR0FBRyxFQUFiLEdBQWtCQSxVQUFVLEdBQUcsTUFBTUEsVUFBVSxDQUFDN0YsUUFBWCxFQUFyQyxHQUE2RDZGLFVBQTdEO0FBQ0EsWUFBTUUsT0FBTyxHQUFHRixVQUFVLEdBQUcsR0FBYixJQUFvQkQsV0FBVyxDQUFDSSxRQUFaLEtBQXlCLENBQTdDLElBQWtELEdBQWxELEdBQXdESixXQUFXLENBQUNLLFdBQVosRUFBeEU7QUFDQTdELFFBQUFBLE9BQU8sS0FBSyxTQUFaLEdBQXdCQSxPQUFPLEdBQUcyRCxPQUFsQyxHQUE0QzVELE9BQU8sR0FBRzRELE9BQXREO0FBQ0g7O0FBRUQsVUFBSUcsV0FBVyxHQUFHO0FBQ2QvRCxRQUFBQSxPQUFPLEVBQUVBLE9BQU8sSUFBSSxJQUROO0FBRWRDLFFBQUFBLE9BQU8sRUFBRUEsT0FBTyxJQUFJLElBRk47QUFHZCtELFFBQUFBLFFBQVEsRUFBRSxvQkFBVztBQUNqQjFKLFVBQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUTJKLE1BQVI7QUFDQTNKLFVBQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUTJFLE9BQVIsQ0FBZ0IsUUFBaEIsRUFBMEI5QixRQUExQixDQUFtQyxXQUFuQztBQUNIO0FBTmEsT0FBbEI7O0FBU0EsVUFBR3FHLE1BQUgsRUFBVztBQUNQTyxRQUFBQSxXQUFXLENBQUMsWUFBRCxDQUFYLEdBQTRCLElBQTVCO0FBQ0FBLFFBQUFBLFdBQVcsQ0FBQyxXQUFELENBQVgsR0FBMkIsU0FBM0I7QUFDQUEsUUFBQUEsV0FBVyxDQUFDLGFBQUQsQ0FBWCxHQUE2QixJQUE3QjtBQUNIOztBQUVEekosTUFBQUEsQ0FBQyxDQUFDMEIsTUFBRixDQUFTLElBQVQsRUFBZStILFdBQWYsRUFBNEJaLHdCQUE1QjtBQUVBN0ksTUFBQUEsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRaUosVUFBUixDQUFtQlEsV0FBbkI7QUFDSCxLQWhDRCxFQUh3QixDQXFDdkI7O0FBQ0F6SixJQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsZ0JBQXhCLEVBQTBDLFlBQU07QUFDN0M7QUFDQWlJLE1BQUFBLFVBQVUsQ0FBQyxZQUFNO0FBQ2IsWUFBRzVKLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CcUgsSUFBcEIsQ0FBeUIsUUFBekIsRUFBbUN6RixNQUF0QyxFQUE4QztBQUMxQzVCLFVBQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CcUgsSUFBcEIsQ0FBeUIsUUFBekIsRUFBbUNlLE9BQW5DLENBQTJDO0FBQ3ZDQyxZQUFBQSxZQUFZLEVBQUUsSUFEeUI7QUFFdkNDLFlBQUFBLGdCQUFnQixFQUFFLE9BRnFCO0FBR3ZDSixZQUFBQSx1QkFBdUIsRUFBRUM7QUFIYyxXQUEzQztBQUtIO0FBQ0osT0FSUyxFQVFQLEVBUk8sQ0FBVjtBQVNILEtBWEE7QUFZSixHQWxERDs7QUFvREEsTUFBSWMsVUFBVSxHQUFHLElBQUlELFVBQUosRUFBakI7QUFFQSxNQUFNYSxXQUFXLEdBQUc3SixDQUFDLENBQUMsaUJBQUQsQ0FBckI7QUFDQSxNQUFNOEosVUFBVSxHQUFHOUosQ0FBQyxDQUFDLGdCQUFELENBQXBCO0FBRUFBLEVBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixjQUF4QixFQUF3QyxZQUFNO0FBQzFDb0ksSUFBQUEsU0FBUyxDQUFDRixXQUFELENBQVQ7QUFDSCxHQUZEO0FBSUE3SixFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsZ0JBQXhCLEVBQTBDLFlBQU07QUFDNUNxSSxJQUFBQSxTQUFTLENBQUNILFdBQUQsQ0FBVDtBQUNILEdBRkQ7QUFJQTdKLEVBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixjQUF4QixFQUF3QyxVQUFDc0YsQ0FBRCxFQUFPO0FBQzNDQSxJQUFBQSxDQUFDLENBQUNnRCxjQUFGO0FBQ0FGLElBQUFBLFNBQVMsQ0FBQ0QsVUFBRCxDQUFUO0FBQ0gsR0FIRDtBQUtBOUosRUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWTBCLEVBQVosQ0FBZSxPQUFmLEVBQXdCLGdCQUF4QixFQUEwQyxZQUFNO0FBQzVDcUksSUFBQUEsU0FBUyxDQUFDRixVQUFELENBQVQ7QUFDSCxHQUZEO0FBSUE7Ozs7O0FBSUEsV0FBU0MsU0FBVCxDQUFtQkcsV0FBbkIsRUFBZ0M7QUFDNUJBLElBQUFBLFdBQVcsQ0FBQ3JILFFBQVosQ0FBcUIsV0FBckIsRUFBa0NkLFVBQWxDLENBQTZDLGNBQTdDO0FBQ0EvQixJQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVU2QyxRQUFWLENBQW1CLGFBQW5CO0FBQ0FzSCxJQUFBQSxZQUFZO0FBQ2Y7QUFFRDs7Ozs7O0FBSUEsV0FBU0gsU0FBVCxDQUFtQkUsV0FBbkIsRUFBZ0M7QUFDNUJBLElBQUFBLFdBQVcsQ0FBQ25JLFVBQVosQ0FBdUIsZUFBdkIsRUFBd0MsWUFBTTtBQUMxQ21JLE1BQUFBLFdBQVcsQ0FBQ25ILFdBQVosQ0FBd0IsV0FBeEI7QUFDQS9DLE1BQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVStDLFdBQVYsQ0FBc0IsYUFBdEI7QUFDQXFILE1BQUFBLGNBQWM7QUFDakIsS0FKRDtBQUtIO0FBRUQ7Ozs7O0FBR0EsV0FBU0EsY0FBVCxHQUEwQjtBQUN0QnBLLElBQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVStDLFdBQVYsQ0FBc0IsV0FBdEI7QUFDSDtBQUVEOzs7Ozs7QUFJQSxXQUFTb0gsWUFBVCxHQUF3QjtBQUNwQm5LLElBQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVTZDLFFBQVYsQ0FBbUIsV0FBbkI7QUFDSCxHQXRqQndCLENBeWpCekI7OztBQUNBLE1BQU13SCxPQUFPLEdBQUdySyxDQUFDLENBQUMsWUFBRCxDQUFqQjtBQUVBQSxFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IseUJBQXhCLEVBQW1ELFVBQUFzRixDQUFDLEVBQUk7QUFDcERBLElBQUFBLENBQUMsQ0FBQ2dELGNBQUY7QUFDQSxRQUFNL0MsS0FBSyxHQUFHbEgsQ0FBQyxDQUFDaUgsQ0FBQyxDQUFDRSxhQUFILENBQWY7QUFDQSxRQUFNbUQsUUFBUSxHQUFHcEQsS0FBSyxDQUFDcEcsSUFBTixDQUFXLGVBQVgsQ0FBakI7QUFDQSxRQUFNeUosaUJBQWlCLEdBQUd2SyxDQUFDLG9DQUE2QnNLLFFBQTdCLFFBQTNCOztBQUVBLFFBQUlwRCxLQUFLLENBQUMzQyxRQUFOLENBQWUsV0FBZixDQUFKLEVBQWlDO0FBQzdCMkMsTUFBQUEsS0FBSyxDQUFDbkUsV0FBTixDQUFrQixXQUFsQjtBQUNBd0gsTUFBQUEsaUJBQWlCLENBQUN4SCxXQUFsQixDQUE4QixXQUE5QjtBQUNBc0gsTUFBQUEsT0FBTyxDQUFDdEgsV0FBUixDQUFvQixXQUFwQjtBQUNBL0MsTUFBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVK0MsV0FBVixDQUFzQixhQUF0QjtBQUNILEtBTEQsTUFLTztBQUNIL0MsTUFBQUEsQ0FBQyxDQUFDLHlCQUFELENBQUQsQ0FBNkIrQyxXQUE3QixDQUF5QyxXQUF6QztBQUNBL0MsTUFBQUEsQ0FBQyxDQUFDLHFCQUFELENBQUQsQ0FBeUIrQyxXQUF6QixDQUFxQyxXQUFyQztBQUNBc0gsTUFBQUEsT0FBTyxDQUFDeEgsUUFBUixDQUFpQixXQUFqQjtBQUNBcUUsTUFBQUEsS0FBSyxDQUFDckUsUUFBTixDQUFlLFdBQWY7QUFDQTBILE1BQUFBLGlCQUFpQixDQUFDMUgsUUFBbEIsQ0FBMkIsV0FBM0I7QUFDQTdDLE1BQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVTZDLFFBQVYsQ0FBbUIsYUFBbkI7QUFDQTdDLE1BQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QjZJLG9CQUF4QjtBQUNIO0FBQ0osR0FwQkQ7O0FBdUJBLFdBQVNBLG9CQUFULENBQThCdkQsQ0FBOUIsRUFBaUM7QUFDN0IsUUFBSWpILENBQUMsQ0FBQ2lILENBQUMsQ0FBQ3dELE1BQUgsQ0FBRCxDQUFZOUYsT0FBWixDQUFvQixZQUFwQixFQUFrQy9DLE1BQWxDLEtBQTZDLENBQWpELEVBQW9EO0FBQ2hENUIsTUFBQUEsQ0FBQyxDQUFDLHlCQUFELENBQUQsQ0FBNkIrQyxXQUE3QixDQUF5QyxXQUF6QztBQUNBL0MsTUFBQUEsQ0FBQyxDQUFDLHFCQUFELENBQUQsQ0FBeUIrQyxXQUF6QixDQUFxQyxXQUFyQztBQUNBc0gsTUFBQUEsT0FBTyxDQUFDdEgsV0FBUixDQUFvQixXQUFwQjtBQUNBL0MsTUFBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVK0MsV0FBVixDQUFzQixhQUF0QjtBQUNBL0MsTUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWXlLLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUJGLG9CQUF6QjtBQUNIO0FBQ0osR0EzbEJ3QixDQTZsQnpCOzs7QUFFQSxNQUFJeEssQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQjRCLE1BQXZCLEVBQStCO0FBQzNCNUIsSUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWTBCLEVBQVosQ0FBZSxPQUFmLEVBQXdCLGVBQXhCLEVBQXlDLFVBQUNzRixDQUFELEVBQU87QUFDNUM7QUFDQSxVQUFNQyxLQUFLLEdBQUdsSCxDQUFDLENBQUNpSCxDQUFDLENBQUNFLGFBQUgsQ0FBZjtBQUVBLFVBQUlELEtBQUssQ0FBQzNDLFFBQU4sQ0FBZSxXQUFmLENBQUosRUFBaUM7QUFFakMsVUFBTW9HLEtBQUssR0FBR3pELEtBQUssQ0FBQ3ZDLE9BQU4sQ0FBYyxVQUFkLENBQWQ7QUFDQSxVQUFNaUcsVUFBVSxHQUFHRCxLQUFLLENBQUN0RCxJQUFOLENBQVcsZUFBWCxDQUFuQjtBQUNBLFVBQU13RCxVQUFVLEdBQUdGLEtBQUssQ0FBQ3RELElBQU4sQ0FBVyxlQUFYLENBQW5CLENBUjRDLENBVTVDOztBQUNBdUQsTUFBQUEsVUFBVSxDQUFDN0gsV0FBWCxDQUF1QixXQUF2QjtBQUNBOEgsTUFBQUEsVUFBVSxDQUFDOUgsV0FBWCxDQUF1QixXQUF2QixFQVo0QyxDQWM1Qzs7QUFDQSxVQUFJK0gsaUJBQWlCLEdBQUdELFVBQVUsQ0FBQ3hELElBQVgsQ0FBZ0IsaUJBQWhCLENBQXhCOztBQUNBLFVBQUl5RCxpQkFBaUIsQ0FBQ2xKLE1BQXRCLEVBQThCO0FBQzFCa0osUUFBQUEsaUJBQWlCLENBQUNDLElBQWxCLENBQXVCLGVBQXZCLEVBQXdDLEtBQXhDO0FBQ0FELFFBQUFBLGlCQUFpQixDQUFDQyxJQUFsQixDQUF1QixVQUF2QixFQUFtQyxLQUFuQztBQUNBRCxRQUFBQSxpQkFBaUIsQ0FBQ0UsR0FBbEIsQ0FBc0IsRUFBdEI7QUFDSCxPQXBCMkMsQ0FzQjVDOzs7QUFDQTlELE1BQUFBLEtBQUssQ0FBQ3JFLFFBQU4sQ0FBZSxXQUFmO0FBQ0EsVUFBTW9JLFNBQVMsR0FBR2pMLENBQUMsQ0FBQ2tILEtBQUssQ0FBQzFCLElBQU4sQ0FBVyxLQUFYLENBQUQsQ0FBbkI7QUFDQXlGLE1BQUFBLFNBQVMsQ0FBQ3BJLFFBQVYsQ0FBbUIsV0FBbkIsRUF6QjRDLENBMkI1Qzs7QUFDQWlJLE1BQUFBLGlCQUFpQixHQUFHRyxTQUFTLENBQUM1RCxJQUFWLENBQWUsaUJBQWYsQ0FBcEI7O0FBQ0EsVUFBSXlELGlCQUFpQixDQUFDbEosTUFBdEIsRUFBOEI7QUFDMUJrSixRQUFBQSxpQkFBaUIsQ0FBQ0MsSUFBbEIsQ0FBdUIsZUFBdkIsRUFBd0MsSUFBeEM7QUFDQUQsUUFBQUEsaUJBQWlCLENBQUNDLElBQWxCLENBQXVCLFVBQXZCLEVBQW1DLElBQW5DO0FBQ0g7QUFDSixLQWpDRDtBQWtDSDtBQUVEOzs7Ozs7Ozs7QUFwb0J5QixNQTRvQm5CRyxPQTVvQm1CO0FBQUE7QUFBQTtBQTZvQnJCOzs7Ozs7Ozs7QUFTQSx1QkFBOEY7QUFBQSxxRkFBSixFQUFJO0FBQUEsVUFBaEZ0RSxNQUFnRixRQUFoRkEsTUFBZ0Y7QUFBQSw0QkFBeEU3QixLQUF3RTtBQUFBLFVBQXhFQSxLQUF3RSwyQkFBaEUsQ0FBZ0U7QUFBQSwwQkFBN0RPLEdBQTZEO0FBQUEsVUFBN0RBLEdBQTZELHlCQUF2RCxDQUFDNkMsUUFBc0Q7QUFBQSwwQkFBNUMxQyxHQUE0QztBQUFBLFVBQTVDQSxHQUE0Qyx5QkFBdEMwQyxRQUFzQztBQUFBLDJCQUE1QmdELElBQTRCO0FBQUEsVUFBNUJBLElBQTRCLDBCQUFyQixDQUFxQjtBQUFBLFVBQWxCQyxTQUFrQixRQUFsQkEsU0FBa0I7O0FBQUE7O0FBQzFGLFdBQUt4RSxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxXQUFLeUUsUUFBTCxHQUFnQjtBQUNaQyxRQUFBQSxJQUFJLEVBQUV0TCxDQUFDLENBQUMsb0JBQUQsRUFBdUIsS0FBSzRHLE1BQTVCLENBREs7QUFFWjJFLFFBQUFBLElBQUksRUFBRXZMLENBQUMsQ0FBQyxvQkFBRCxFQUF1QixLQUFLNEcsTUFBNUIsQ0FGSztBQUdaNEUsUUFBQUEsTUFBTSxFQUFFeEwsQ0FBQyxDQUFDLGlCQUFELEVBQW9CLEtBQUs0RyxNQUF6QjtBQUhHLE9BQWhCO0FBTUEsV0FBSzdCLEtBQUwsR0FBYSxDQUFDQSxLQUFkO0FBQ0EsV0FBS08sR0FBTCxHQUFXLENBQUNBLEdBQVo7QUFDQSxXQUFLRyxHQUFMLEdBQVcsQ0FBQ0EsR0FBWjtBQUNBLFdBQUswRixJQUFMLEdBQVksQ0FBQ0EsSUFBYjtBQUNBLFdBQUtDLFNBQUwsR0FBaUIsQ0FBQ0EsU0FBbEI7QUFDSDtBQUVEOzs7OztBQXJxQnFCO0FBQUE7QUFBQSw2QkF3cUJkO0FBQ0gsYUFBS0ssYUFBTDtBQUNIO0FBRUQ7Ozs7QUE1cUJxQjtBQUFBO0FBQUEsc0NBK3FCTDtBQUNaLGFBQUtKLFFBQUwsQ0FBY0MsSUFBZCxDQUFtQlAsSUFBbkIsQ0FBd0IsVUFBeEIsRUFBb0MsS0FBcEM7QUFDQSxhQUFLTSxRQUFMLENBQWNFLElBQWQsQ0FBbUJSLElBQW5CLENBQXdCLFVBQXhCLEVBQW9DLEtBQXBDOztBQUVBLFlBQUksS0FBS2hHLEtBQUwsR0FBYSxLQUFLTyxHQUFMLEdBQVcsS0FBSzZGLElBQWpDLEVBQXVDO0FBQ25DLGVBQUtFLFFBQUwsQ0FBY0MsSUFBZCxDQUFtQlAsSUFBbkIsQ0FBd0IsVUFBeEIsRUFBb0MsSUFBcEM7QUFDSDs7QUFFRCxZQUFJLEtBQUtoRyxLQUFMLEdBQWEsS0FBS1UsR0FBTCxHQUFXLEtBQUswRixJQUFqQyxFQUF1QztBQUNuQyxlQUFLRSxRQUFMLENBQWNFLElBQWQsQ0FBbUJSLElBQW5CLENBQXdCLFVBQXhCLEVBQW9DLElBQXBDO0FBQ0g7QUFDSjtBQUVEOzs7O0FBNXJCcUI7QUFBQTtBQUFBLHVDQStyQko7QUFDYixhQUFLTSxRQUFMLENBQWNDLElBQWQsQ0FBbUJQLElBQW5CLENBQXdCLFVBQXhCLEVBQW9DLElBQXBDO0FBQ0EsYUFBS00sUUFBTCxDQUFjRSxJQUFkLENBQW1CUixJQUFuQixDQUF3QixVQUF4QixFQUFvQyxJQUFwQztBQUNBLGFBQUtNLFFBQUwsQ0FBY0csTUFBZCxDQUFxQlQsSUFBckIsQ0FBMEIsVUFBMUIsRUFBc0MsSUFBdEM7QUFDQSxhQUFLbkUsTUFBTCxDQUFZL0QsUUFBWixDQUFxQixhQUFyQjtBQUNIO0FBRUQ7Ozs7QUF0c0JxQjtBQUFBO0FBQUEsc0NBeXNCTDtBQUNaLGFBQUtpRixJQUFMO0FBQ0EsYUFBS3VELFFBQUwsQ0FBY0csTUFBZCxDQUFxQlQsSUFBckIsQ0FBMEIsVUFBMUIsRUFBc0MsS0FBdEM7QUFDQSxhQUFLbkUsTUFBTCxDQUFZN0QsV0FBWixDQUF3QixhQUF4QjtBQUNIO0FBR0Q7Ozs7OztBQWh0QnFCO0FBQUE7QUFBQSxrQ0FxdEJUZ0MsS0FydEJTLEVBcXRCRjtBQUNmLGFBQUtBLEtBQUwsR0FBYUEsS0FBYjtBQUNBLGFBQUs2QixNQUFMLENBQVk5RixJQUFaLENBQWlCLFlBQWpCLEVBQStCaUUsS0FBL0I7QUFDQSxhQUFLc0csUUFBTCxDQUFjRyxNQUFkLENBQXFCMUssSUFBckIsQ0FBMEIsT0FBMUIsRUFBbUNpRSxLQUFuQztBQUNBLGFBQUtzRyxRQUFMLENBQWNHLE1BQWQsQ0FBcUJSLEdBQXJCLENBQXlCakcsS0FBekI7QUFDSDtBQUVEOzs7Ozs7QUE1dEJxQjtBQUFBO0FBQUEsZ0NBaXVCWEEsS0FqdUJXLEVBaXVCSjtBQUNiLGFBQUtPLEdBQUwsR0FBV1AsS0FBWDtBQUNBLGFBQUs2QixNQUFMLENBQVk5RixJQUFaLENBQWlCLFVBQWpCLEVBQTZCaUUsS0FBN0I7QUFDSDtBQUVEOzs7Ozs7QUF0dUJxQjtBQUFBO0FBQUEsZ0NBMnVCWEEsS0EzdUJXLEVBMnVCSjtBQUNiLGFBQUtVLEdBQUwsR0FBV1YsS0FBWDtBQUNBLGFBQUs2QixNQUFMLENBQVk5RixJQUFaLENBQWlCLFVBQWpCLEVBQTZCaUUsS0FBN0I7QUFDSDtBQUVEOzs7O0FBaHZCcUI7QUFBQTs7QUFxdkJyQjs7Ozs7O0FBcnZCcUIsa0NBMnZCRjZCLE1BM3ZCRSxFQTJ2Qk07QUFDdkIsZUFBT3NFLE9BQU8sQ0FBQ1EsU0FBUixDQUFrQnJFLElBQWxCLENBQXVCLFVBQUFzRSxPQUFPO0FBQUEsaUJBQUlBLE9BQU8sQ0FBQy9FLE1BQVIsQ0FBZWdGLEVBQWYsQ0FBa0JoRixNQUFsQixDQUFKO0FBQUEsU0FBOUIsQ0FBUDtBQUNIO0FBRUQ7Ozs7OztBQS92QnFCO0FBQUE7QUFBQSwrQkFvd0JvQjtBQUFBLFlBQTNCaUYsU0FBMkIsdUVBQWY3TCxDQUFDLENBQUMsVUFBRCxDQUFjO0FBQ3JDNkwsUUFBQUEsU0FBUyxDQUFDN0QsSUFBVixDQUFlLFVBQUM4RCxLQUFELEVBQVFDLEtBQVIsRUFBa0I7QUFDN0IsY0FBTW5GLE1BQU0sR0FBRzVHLENBQUMsQ0FBQytMLEtBQUQsQ0FBaEI7QUFFQSxjQUFJYixPQUFPLENBQUNjLFdBQVIsQ0FBb0JwRixNQUFwQixDQUFKLEVBQWlDO0FBRWpDLGNBQU0rRSxPQUFPLEdBQUcsSUFBSVQsT0FBSixDQUFZO0FBQ3hCdEUsWUFBQUEsTUFBTSxFQUFOQSxNQUR3QjtBQUV4QjdCLFlBQUFBLEtBQUssRUFBRTZCLE1BQU0sQ0FBQzlGLElBQVAsQ0FBWSxZQUFaLENBRmlCO0FBR3hCd0UsWUFBQUEsR0FBRyxFQUFFc0IsTUFBTSxDQUFDOUYsSUFBUCxDQUFZLFVBQVosQ0FIbUI7QUFJeEIyRSxZQUFBQSxHQUFHLEVBQUVtQixNQUFNLENBQUM5RixJQUFQLENBQVksVUFBWixDQUptQjtBQUt4QnFLLFlBQUFBLElBQUksRUFBRXZFLE1BQU0sQ0FBQzlGLElBQVAsQ0FBWSxXQUFaLENBTGtCO0FBTXhCc0ssWUFBQUEsU0FBUyxFQUFFeEUsTUFBTSxDQUFDOUYsSUFBUCxDQUFZLGdCQUFaO0FBTmEsV0FBWixDQUFoQjtBQVNBOEYsVUFBQUEsTUFBTSxDQUFDckMsUUFBUCxDQUFnQixhQUFoQixJQUFpQ29ILE9BQU8sQ0FBQ00sY0FBUixFQUFqQyxHQUE0RE4sT0FBTyxDQUFDN0QsSUFBUixFQUE1RDtBQUVBb0QsVUFBQUEsT0FBTyxDQUFDUSxTQUFSLENBQWtCUSxJQUFsQixDQUF1QlAsT0FBdkI7QUFDSCxTQWpCRDtBQWtCSDtBQUVEOzs7Ozs7QUF6eEJxQjtBQUFBO0FBQUEsK0JBOHhCb0I7QUFBQSxZQUEzQkUsU0FBMkIsdUVBQWY3TCxDQUFDLENBQUMsVUFBRCxDQUFjO0FBQ3JDNkwsUUFBQUEsU0FBUyxDQUFDN0QsSUFBVixDQUFlLFVBQUM4RCxLQUFELEVBQVFDLEtBQVIsRUFBa0I7QUFDN0IsY0FBTW5GLE1BQU0sR0FBRzVHLENBQUMsQ0FBQytMLEtBQUQsQ0FBaEI7QUFFQSxjQUFNSSxZQUFZLEdBQUdqQixPQUFPLENBQUNRLFNBQVIsQ0FBa0JVLFNBQWxCLENBQTRCLFVBQUFULE9BQU87QUFBQSxtQkFBSUEsT0FBTyxDQUFDL0UsTUFBUixDQUFlZ0YsRUFBZixDQUFrQmhGLE1BQWxCLENBQUo7QUFBQSxXQUFuQyxDQUFyQjtBQUVBc0UsVUFBQUEsT0FBTyxDQUFDUSxTQUFSLENBQWtCVyxNQUFsQixDQUF5QkYsWUFBekIsRUFBdUMsQ0FBdkM7QUFDSCxTQU5EO0FBT0g7QUF0eUJvQjs7QUFBQTtBQUFBOztBQUFBLGtCQTRvQm5CakIsT0E1b0JtQixlQW12QkYsRUFudkJFOztBQXl5QnpCbEwsRUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWTBCLEVBQVosQ0FBZSxPQUFmLEVBQXdCLG9CQUF4QixFQUE4QzJLLGNBQTlDO0FBQ0F0TSxFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0Isb0JBQXhCLEVBQThDNEssY0FBOUM7QUFDQXZNLEVBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixpQkFBeEIsRUFBMkM2SyxXQUEzQztBQUVBOztBQUNBLE1BQUlDLFFBQVEsR0FBR3ZCLE9BQU8sQ0FBQ3dCLE1BQVIsRUFBZjtBQUVBOzs7Ozs7QUFLQSxXQUFTSixjQUFULENBQXdCckYsQ0FBeEIsRUFBMkI7QUFBQSxRQUNmRSxhQURlLEdBQ0dGLENBREgsQ0FDZkUsYUFEZTtBQUV2QixRQUFNd0YsT0FBTyxHQUFHM00sQ0FBQyxDQUFDbUgsYUFBRCxDQUFqQjtBQUNBLFFBQU1QLE1BQU0sR0FBRytGLE9BQU8sQ0FBQ2hJLE9BQVIsQ0FBZ0IsVUFBaEIsQ0FBZjtBQUNBLFFBQU1nSCxPQUFPLEdBQUdULE9BQU8sQ0FBQ2MsV0FBUixDQUFvQnBGLE1BQXBCLENBQWhCO0FBRUEsUUFBSTdCLEtBQUssR0FBRzRHLE9BQU8sQ0FBQzVHLEtBQVIsR0FBZ0I0RyxPQUFPLENBQUNSLElBQXBDOztBQUVBLFFBQUlRLE9BQU8sQ0FBQ1AsU0FBWixFQUF1QjtBQUNuQnJHLE1BQUFBLEtBQUssR0FBRzVCLFVBQVUsQ0FBQzRCLEtBQUssQ0FBQzZILE9BQU4sQ0FBY2pCLE9BQU8sQ0FBQ1AsU0FBdEIsQ0FBRCxDQUFsQjtBQUNIOztBQUVETyxJQUFBQSxPQUFPLENBQUNrQixXQUFSLENBQW9COUgsS0FBcEI7QUFFQTRHLElBQUFBLE9BQU8sQ0FBQ0YsYUFBUjtBQUNIO0FBRUQ7Ozs7Ozs7QUFLQSxXQUFTYyxjQUFULENBQXdCdEYsQ0FBeEIsRUFBMkI7QUFBQSxRQUNmRSxhQURlLEdBQ0dGLENBREgsQ0FDZkUsYUFEZTtBQUV2QixRQUFNd0YsT0FBTyxHQUFHM00sQ0FBQyxDQUFDbUgsYUFBRCxDQUFqQjtBQUNBLFFBQU1QLE1BQU0sR0FBRytGLE9BQU8sQ0FBQ2hJLE9BQVIsQ0FBZ0IsVUFBaEIsQ0FBZjtBQUNBLFFBQU1nSCxPQUFPLEdBQUdULE9BQU8sQ0FBQ2MsV0FBUixDQUFvQnBGLE1BQXBCLENBQWhCO0FBRUEsUUFBSTdCLEtBQUssR0FBRzRHLE9BQU8sQ0FBQzVHLEtBQVIsR0FBZ0I0RyxPQUFPLENBQUNSLElBQXBDOztBQUVBLFFBQUlRLE9BQU8sQ0FBQ1AsU0FBWixFQUF1QjtBQUNuQnJHLE1BQUFBLEtBQUssR0FBRzVCLFVBQVUsQ0FBQzRCLEtBQUssQ0FBQzZILE9BQU4sQ0FBY2pCLE9BQU8sQ0FBQ1AsU0FBdEIsQ0FBRCxDQUFsQjtBQUNIOztBQUVETyxJQUFBQSxPQUFPLENBQUNrQixXQUFSLENBQW9COUgsS0FBcEI7QUFFQTRHLElBQUFBLE9BQU8sQ0FBQ0YsYUFBUjtBQUNIO0FBRUQ7Ozs7Ozs7QUFLQSxXQUFTZSxXQUFULENBQXFCdkYsQ0FBckIsRUFBd0I7QUFBQSxRQUNaRSxhQURZLEdBQ01GLENBRE4sQ0FDWkUsYUFEWTtBQUVwQixRQUFNd0YsT0FBTyxHQUFHM00sQ0FBQyxDQUFDbUgsYUFBRCxDQUFqQjtBQUNBLFFBQU1QLE1BQU0sR0FBRytGLE9BQU8sQ0FBQ2hJLE9BQVIsQ0FBZ0IsVUFBaEIsQ0FBZjtBQUNBLFFBQU1nSCxPQUFPLEdBQUdULE9BQU8sQ0FBQ2MsV0FBUixDQUFvQnBGLE1BQXBCLENBQWhCO0FBSm9CLFFBS1o0RSxNQUxZLEdBS0RHLE9BQU8sQ0FBQ04sUUFMUCxDQUtaRyxNQUxZO0FBT3BCLFFBQUl6RyxLQUFLLEdBQUcsQ0FBQ3lHLE1BQU0sQ0FBQ1IsR0FBUCxFQUFiOztBQUVBLFFBQUksQ0FBQ1EsTUFBTSxDQUFDUixHQUFQLEdBQWFwSixNQUFkLElBQXdCbUQsS0FBSyxHQUFHNEcsT0FBTyxDQUFDckcsR0FBeEMsSUFBK0NQLEtBQUssR0FBRzRHLE9BQU8sQ0FBQ2xHLEdBQW5FLEVBQXdFO0FBQ2pFVixNQUFBQSxLQURpRSxHQUN2RDRHLE9BRHVELENBQ2pFNUcsS0FEaUU7QUFFdkU7O0FBRUQ0RyxJQUFBQSxPQUFPLENBQUNrQixXQUFSLENBQW9COUgsS0FBcEI7QUFFQTRHLElBQUFBLE9BQU8sQ0FBQ0YsYUFBUjtBQUNIOztBQUVEcUIsRUFBQUEsYUFBYTtBQUViOU0sRUFBQUEsQ0FBQyxDQUFDaUIsTUFBRCxDQUFELENBQVVVLEVBQVYsQ0FBYSxRQUFiLEVBQXVCbUwsYUFBdkIsRUFyM0J5QixDQXUzQnpCOztBQUNBLFdBQVNBLGFBQVQsR0FBMEI7QUFDdEI7QUFDQSxRQUFNQyxhQUFhLEdBQUcvTSxDQUFDLENBQUMsbUJBQUQsQ0FBdkI7O0FBQ0EsUUFBSStNLGFBQWEsQ0FBQ25MLE1BQWQsSUFBd0IsQ0FBQ21MLGFBQWEsQ0FBQ3hJLFFBQWQsQ0FBdUIsbUJBQXZCLENBQTdCLEVBQTBFO0FBQ3RFd0ksTUFBQUEsYUFBYSxDQUFDQyxLQUFkLENBQW9CO0FBQ2hCQyxRQUFBQSxNQUFNLEVBQUUsS0FEUTtBQUVoQkMsUUFBQUEsUUFBUSxFQUFFLElBRk07QUFHaEJDLFFBQUFBLFlBQVksRUFBRSxDQUhFO0FBSWhCQyxRQUFBQSxVQUFVLEVBQUUsS0FKSTtBQUtoQkMsUUFBQUEsYUFBYSxFQUFFLElBTEM7QUFNaEJDLFFBQUFBLFdBQVcsRUFBRSxJQU5HO0FBT2hCQyxRQUFBQSxVQUFVLEVBQUUsQ0FDUjtBQUNJQyxVQUFBQSxVQUFVLEVBQUUsR0FEaEI7QUFFSUMsVUFBQUEsUUFBUSxFQUFFLENBQ047QUFETTtBQUZkLFNBRFEsRUFPUjtBQUNJRCxVQUFBQSxVQUFVLEVBQUUsSUFEaEI7QUFFSUMsVUFBQUEsUUFBUSxFQUFFO0FBRmQsU0FQUTtBQVBJLE9BQXBCO0FBb0JILEtBeEJxQixDQTBCdEI7OztBQUNBLFFBQU1DLGNBQWMsR0FBRzFOLENBQUMsQ0FBQyxvQkFBRCxDQUF4Qjs7QUFDQSxRQUFJME4sY0FBYyxDQUFDOUwsTUFBZixJQUF5QixDQUFDOEwsY0FBYyxDQUFDbkosUUFBZixDQUF3QixtQkFBeEIsQ0FBOUIsRUFBNEU7QUFDeEVtSixNQUFBQSxjQUFjLENBQUNWLEtBQWYsQ0FBcUI7QUFDakJDLFFBQUFBLE1BQU0sRUFBRSxLQURTO0FBRWpCQyxRQUFBQSxRQUFRLEVBQUUsSUFGTztBQUdqQkMsUUFBQUEsWUFBWSxFQUFFLENBSEc7QUFJakJDLFFBQUFBLFVBQVUsRUFBRSxJQUpLO0FBS2pCQyxRQUFBQSxhQUFhLEVBQUUsSUFMRTtBQU1qQkMsUUFBQUEsV0FBVyxFQUFFLElBTkk7QUFPakJDLFFBQUFBLFVBQVUsRUFBRSxDQUNSO0FBQ0lDLFVBQUFBLFVBQVUsRUFBRSxHQURoQjtBQUVJQyxVQUFBQSxRQUFRLEVBQUU7QUFGZCxTQURRO0FBUEssT0FBckIsRUFEd0UsQ0FnQnhFOztBQUNBQyxNQUFBQSxjQUFjLENBQUNyRyxJQUFmLENBQW9CLGVBQXBCLEVBQXFDQSxJQUFyQyxDQUEwQyxPQUExQyxFQUFtRDBELElBQW5ELENBQXdELFNBQXhELEVBQW1FLElBQW5FLEVBakJ3RSxDQW1CeEU7O0FBQ0EyQyxNQUFBQSxjQUFjLENBQUMvTCxFQUFmLENBQWtCLGFBQWxCLEVBQWlDLFlBQU07QUFDbkMrTCxRQUFBQSxjQUFjLENBQUNyRyxJQUFmLENBQW9CLGVBQXBCLEVBQXFDQSxJQUFyQyxDQUEwQyxPQUExQyxFQUFtRDBELElBQW5ELENBQXdELFNBQXhELEVBQW1FLElBQW5FO0FBQ0gsT0FGRDtBQUdILEtBbkRxQixDQXFEdEI7OztBQUNBLFFBQU00QyxtQkFBbUIsR0FBRzNOLENBQUMsQ0FBQyx5QkFBRCxDQUE3Qjs7QUFDQSxRQUFJMk4sbUJBQW1CLENBQUMvTCxNQUFwQixJQUE4QixDQUFDK0wsbUJBQW1CLENBQUNwSixRQUFwQixDQUE2QixtQkFBN0IsQ0FBbkMsRUFBc0Y7QUFDbEZvSixNQUFBQSxtQkFBbUIsQ0FBQ1gsS0FBcEIsQ0FBMEI7QUFDdEJDLFFBQUFBLE1BQU0sRUFBRSxLQURjO0FBRXRCQyxRQUFBQSxRQUFRLEVBQUUsS0FGWTtBQUd0QkMsUUFBQUEsWUFBWSxFQUFFLENBSFE7QUFJdEJDLFFBQUFBLFVBQVUsRUFBRSxJQUpVO0FBS3RCUSxRQUFBQSxhQUFhLEVBQUUsR0FMTztBQU10QlAsUUFBQUEsYUFBYSxFQUFFLEtBTk87QUFPdEJRLFFBQUFBLElBQUksRUFBRSxJQVBnQjtBQVF0QlAsUUFBQUEsV0FBVyxFQUFFLElBUlM7QUFTdEJDLFFBQUFBLFVBQVUsRUFBRSxDQUNSO0FBQ0lDLFVBQUFBLFVBQVUsRUFBRSxHQURoQjtBQUVJQyxVQUFBQSxRQUFRLEVBQUU7QUFGZCxTQURRO0FBVFUsT0FBMUI7QUFnQkgsS0F4RXFCLENBMEV0Qjs7O0FBQ0EsUUFBTUssZ0JBQWdCLEdBQUc5TixDQUFDLENBQUMsc0JBQUQsQ0FBMUI7O0FBQ0EsUUFBSThOLGdCQUFnQixDQUFDbE0sTUFBakIsSUFBMkIsQ0FBQ2tNLGdCQUFnQixDQUFDdkosUUFBakIsQ0FBMEIsbUJBQTFCLENBQWhDLEVBQWdGO0FBQzVFdUosTUFBQUEsZ0JBQWdCLENBQUNkLEtBQWpCLENBQXVCO0FBQ25CQyxRQUFBQSxNQUFNLEVBQUUsSUFEVztBQUVuQkMsUUFBQUEsUUFBUSxFQUFFLElBRlM7QUFHbkJDLFFBQUFBLFlBQVksRUFBRSxDQUhLO0FBSW5CWSxRQUFBQSxTQUFTLEVBQUUsaUxBSlE7QUFLbkJDLFFBQUFBLFNBQVMsRUFBRSxpS0FMUTtBQU1uQkgsUUFBQUEsSUFBSSxFQUFFLEtBTmE7QUFPbkJOLFFBQUFBLFVBQVUsRUFBRSxDQUNSO0FBQ0lDLFVBQUFBLFVBQVUsRUFBRSxHQURoQjtBQUVJQyxVQUFBQSxRQUFRLEVBQUU7QUFDTlIsWUFBQUEsTUFBTSxFQUFFLEtBREY7QUFFTlksWUFBQUEsSUFBSSxFQUFFO0FBRkE7QUFGZCxTQURRO0FBUE8sT0FBdkI7QUFpQkgsS0E5RnFCLENBZ0d0Qjs7O0FBQ0EsUUFBTUksZ0JBQWdCLEdBQUdqTyxDQUFDLENBQUMsc0JBQUQsQ0FBMUI7O0FBQ0EsUUFBSWlPLGdCQUFnQixDQUFDck0sTUFBakIsSUFBMkIsQ0FBQ3FNLGdCQUFnQixDQUFDMUosUUFBakIsQ0FBMEIsbUJBQTFCLENBQWhDLEVBQWdGO0FBQzVFMEosTUFBQUEsZ0JBQWdCLENBQUNqQixLQUFqQixDQUF1QjtBQUNuQkMsUUFBQUEsTUFBTSxFQUFFLEtBRFc7QUFFbkJDLFFBQUFBLFFBQVEsRUFBRSxLQUZTO0FBR25CQyxRQUFBQSxZQUFZLEVBQUUsQ0FISztBQUluQkMsUUFBQUEsVUFBVSxFQUFFLElBSk87QUFLbkJRLFFBQUFBLGFBQWEsRUFBRSxHQUxJO0FBTW5CUCxRQUFBQSxhQUFhLEVBQUUsS0FOSTtBQU9uQlEsUUFBQUEsSUFBSSxFQUFFLElBUGE7QUFRbkJQLFFBQUFBLFdBQVcsRUFBRSxJQVJNO0FBU25CQyxRQUFBQSxVQUFVLEVBQUUsQ0FDUjtBQUNJQyxVQUFBQSxVQUFVLEVBQUUsR0FEaEI7QUFFSUMsVUFBQUEsUUFBUSxFQUFFO0FBRmQsU0FEUTtBQVRPLE9BQXZCO0FBZ0JILEtBbkhxQixDQXFIdEI7OztBQUNBLFFBQU1TLGdCQUFnQixHQUFHbE8sQ0FBQyxDQUFDLHNCQUFELENBQTFCOztBQUNBLFFBQUlrTyxnQkFBZ0IsQ0FBQ3RNLE1BQWpCLElBQTJCLENBQUNzTSxnQkFBZ0IsQ0FBQzNKLFFBQWpCLENBQTBCLG1CQUExQixDQUFoQyxFQUFnRjtBQUM1RTJKLE1BQUFBLGdCQUFnQixDQUFDbEIsS0FBakIsQ0FBdUI7QUFDbkJDLFFBQUFBLE1BQU0sRUFBRSxLQURXO0FBRW5CQyxRQUFBQSxRQUFRLEVBQUUsS0FGUztBQUduQkMsUUFBQUEsWUFBWSxFQUFFLENBSEs7QUFJbkJnQixRQUFBQSxjQUFjLEVBQUUsQ0FKRztBQUtuQmQsUUFBQUEsYUFBYSxFQUFFO0FBTEksT0FBdkI7QUFPSDtBQUNKOztBQUVELE1BQU1lLE1BQU0sR0FBR3BPLENBQUMsQ0FBQyxZQUFELENBQWhCOztBQUVBLE1BQUlvTyxNQUFNLENBQUN4TSxNQUFYLEVBQW1CO0FBQ2Y1QixJQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsWUFBeEIsRUFBc0MsWUFBTTtBQUN4QzNCLE1BQUFBLENBQUMsQ0FBQyxZQUFELENBQUQsQ0FBZ0JxTyxPQUFoQixDQUF3QjtBQUNwQkMsUUFBQUEsU0FBUyxFQUFFO0FBRFMsT0FBeEI7QUFHSCxLQUpEO0FBTUF0TyxJQUFBQSxDQUFDLENBQUNpQixNQUFELENBQUQsQ0FBVVUsRUFBVixDQUFhLFFBQWIsRUFBdUIsWUFBTTtBQUN6QixVQUFJM0IsQ0FBQyxDQUFDaUIsTUFBRCxDQUFELENBQVVzTixLQUFWLE1BQXFCcE8sYUFBYSxDQUFDTSxZQUF2QyxFQUFxRDtBQUNqRFQsUUFBQUEsQ0FBQyxDQUFDaUIsTUFBRCxDQUFELENBQVVxTixTQUFWLEtBQXdCLEVBQXhCLEdBQTZCRixNQUFNLENBQUNJLElBQVAsRUFBN0IsR0FBNkNKLE1BQU0sQ0FBQ0ssSUFBUCxFQUE3QztBQUNIO0FBQ0osS0FKRDtBQUtIOztBQUVELE1BQU1DLFlBQVksR0FBRzFPLENBQUMsQ0FBQyxrQkFBRCxDQUF0Qjs7QUFDQSxNQUFJME8sWUFBWSxDQUFDOU0sTUFBakIsRUFBeUI7QUFFckI1QixJQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsZ0JBQXhCLEVBQTBDLFVBQUFzRixDQUFDLEVBQUk7QUFDM0N5SCxNQUFBQSxZQUFZLENBQUM3TCxRQUFiLENBQXNCLFdBQXRCLEVBQW1DZCxVQUFuQyxDQUE4QyxjQUE5QztBQUNBL0IsTUFBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVNkMsUUFBVixDQUFtQixhQUFuQjtBQUNILEtBSEQ7QUFLQTdDLElBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixrQkFBeEIsRUFBNEMsVUFBQXNGLENBQUMsRUFBSTtBQUM3Q3lILE1BQUFBLFlBQVksQ0FBQzNNLFVBQWIsQ0FBd0IsZUFBeEIsRUFBeUMsWUFBTTtBQUMzQzJNLFFBQUFBLFlBQVksQ0FBQzNMLFdBQWIsQ0FBeUIsV0FBekI7QUFDQS9DLFFBQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVStDLFdBQVYsQ0FBc0IsYUFBdEI7QUFDSCxPQUhEO0FBSUgsS0FMRDtBQU1IOztBQUVELE1BQUkvQyxDQUFDLENBQUMscUJBQUQsQ0FBRCxDQUF5QjRCLE1BQXpCLEdBQWtDLENBQXRDLEVBQXlDO0FBQ3JDOzs7QUFHQTVCLElBQUFBLENBQUMsQ0FBQyxxQkFBRCxDQUFELENBQXlCZ0ksSUFBekIsQ0FBOEIsVUFBUzhELEtBQVQsRUFBZ0IzSixFQUFoQixFQUFvQjtBQUM5QyxVQUFNd00sS0FBSyxHQUFHM08sQ0FBQyxDQUFDbUMsRUFBRCxDQUFELENBQU1rRixJQUFOLENBQVcsaUJBQVgsQ0FBZDs7QUFFQSxVQUFJckgsQ0FBQyxDQUFDMk8sS0FBRCxDQUFELENBQVMzRCxHQUFULEdBQWU0RCxJQUFmLE1BQXlCLEVBQXpCLElBQStCNU8sQ0FBQyxDQUFDMk8sS0FBRCxDQUFELENBQVMvQyxFQUFULENBQVksb0JBQVosQ0FBbkMsRUFBc0U7QUFDbEU1TCxRQUFBQSxDQUFDLENBQUNtQyxFQUFELENBQUQsQ0FBTVUsUUFBTixDQUFlLFdBQWY7QUFDSDs7QUFFRDdDLE1BQUFBLENBQUMsQ0FBQzJPLEtBQUQsQ0FBRCxDQUFTaE4sRUFBVCxDQUFZLE9BQVosRUFBcUIsVUFBU2tOLEtBQVQsRUFBZ0I7QUFDakM3TyxRQUFBQSxDQUFDLENBQUNtQyxFQUFELENBQUQsQ0FBTVUsUUFBTixDQUFlLFdBQWY7QUFDSCxPQUZELEVBRUdsQixFQUZILENBRU0sTUFGTixFQUVjLFVBQVNrTixLQUFULEVBQWdCO0FBQzFCLFlBQUk3TyxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFnTCxHQUFSLEdBQWM0RCxJQUFkLE9BQXlCLEVBQXpCLElBQStCLENBQUM1TyxDQUFDLENBQUMyTyxLQUFELENBQUQsQ0FBUy9DLEVBQVQsQ0FBWSxvQkFBWixDQUFwQyxFQUF1RTtBQUNuRTVMLFVBQUFBLENBQUMsQ0FBQ21DLEVBQUQsQ0FBRCxDQUFNWSxXQUFOLENBQWtCLFdBQWxCO0FBQ0g7QUFDSixPQU5EO0FBT0gsS0FkRDtBQWVIO0FBRUQ7OztBQUVBLE1BQU0rTCxlQUFlLEdBQUc7QUFDcEJDLElBQUFBLEtBQUssRUFBRSxLQURhO0FBRXBCQyxJQUFBQSxTQUFTLEVBQUUsS0FGUztBQUdwQkMsSUFBQUEsV0FBVyxFQUFFLEtBSE87QUFJcEJDLElBQUFBLFNBQVMsRUFBRSxjQUpTO0FBS3BCQyxJQUFBQSxRQUFRLEVBQUUsRUFMVTtBQU1wQkMsSUFBQUEsS0FBSyxFQUFFO0FBR1g7Ozs7QUFUd0IsR0FBeEI7O0FBWUEsV0FBU0MsWUFBVCxHQUF3QjtBQUNwQnJQLElBQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CZ0ksSUFBcEIsQ0FBeUIsVUFBQzhELEtBQUQsRUFBUXdELElBQVIsRUFBaUI7QUFDdEMsVUFBTUMsYUFBYSxHQUFHO0FBQ2xCQyxRQUFBQSxPQUFPLEVBQUV4UCxDQUFDLENBQUNzUCxJQUFELENBQUQsQ0FBUXhPLElBQVIsQ0FBYSxjQUFiO0FBRFMsT0FBdEI7O0FBR0EsVUFBSWQsQ0FBQyxDQUFDc1AsSUFBRCxDQUFELENBQVE5SixJQUFSLENBQWEsT0FBYixDQUFKLEVBQTJCO0FBQ3ZCK0osUUFBQUEsYUFBYSxDQUFDLFNBQUQsQ0FBYixHQUEyQixhQUEzQjtBQUNBQSxRQUFBQSxhQUFhLENBQUMsYUFBRCxDQUFiLEdBQStCLElBQS9CO0FBQ0g7O0FBRURFLE1BQUFBLEtBQUssQ0FBQ0gsSUFBRCxFQUFPSSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCYixlQUFsQixFQUFtQ1MsYUFBbkMsQ0FBUCxDQUFMO0FBQ0gsS0FWRDtBQVdIOztBQUVERixFQUFBQSxZQUFZLEdBM2tDYSxDQTZrQ3pCO0FBQ0E7O0FBQ0EsTUFBTU8sSUFBSSxHQUFHO0FBQUNDLElBQUFBLEdBQUcsRUFBRSxTQUFOO0FBQWlCQyxJQUFBQSxHQUFHLEVBQUU7QUFBdEIsR0FBYixDQS9rQ3lCLENBaWxDekI7O0FBQ0EsTUFBTUMsU0FBUyxHQUFHLENBQ2Q7QUFDSSxtQkFBZSxVQURuQjtBQUVJLGVBQVcsQ0FDWDtBQUNJLGVBQVM7QUFEYixLQURXO0FBRmYsR0FEYyxFQVNkO0FBQ0ksbUJBQWUsYUFEbkI7QUFFSSxlQUFXLENBQ1g7QUFDSSxvQkFBYztBQURsQixLQURXO0FBRmYsR0FUYyxFQWlCZDtBQUNJLG1CQUFlLGtCQURuQjtBQUVJLGVBQVcsQ0FDWDtBQUNJLGVBQVM7QUFEYixLQURXO0FBRmYsR0FqQmMsRUF5QmQ7QUFDSSxtQkFBZSxvQkFEbkI7QUFFSSxlQUFXLENBQ1g7QUFDSSxlQUFTO0FBRGIsS0FEVztBQUZmLEdBekJjLEVBaUNkO0FBQ0ksbUJBQWUsZ0JBRG5CO0FBRUksbUJBQWUsVUFGbkI7QUFHSSxlQUFXLENBQ1g7QUFDSSxlQUFTO0FBRGIsS0FEVztBQUhmLEdBakNjLEVBMENkO0FBQ0ksbUJBQWUsd0JBRG5CO0FBRUksbUJBQWUsa0JBRm5CO0FBR0ksZUFBVyxDQUNYO0FBQ0ksZUFBUztBQURiLEtBRFc7QUFIZixHQTFDYyxFQW1EZDtBQUNJLG1CQUFlLDRCQURuQjtBQUVJLGVBQVcsQ0FDWDtBQUNJLG9CQUFjO0FBRGxCLEtBRFc7QUFGZixHQW5EYyxFQTJEZDtBQUNJLG1CQUFlLHlCQURuQjtBQUVJLG1CQUFlLGtCQUZuQjtBQUdJLGVBQVcsQ0FDWDtBQUNJLGVBQVM7QUFEYixLQURXO0FBSGYsR0EzRGMsRUFvRWQ7QUFDSSxtQkFBZSxLQURuQjtBQUVJLG1CQUFlLGtCQUZuQjtBQUdJLGVBQVcsQ0FDWDtBQUNJLGVBQVM7QUFEYixLQURXO0FBSGYsR0FwRWMsRUE2RWQ7QUFDSSxtQkFBZSxVQURuQjtBQUVJLG1CQUFlLFVBRm5CO0FBR0ksZUFBVyxDQUNYO0FBQ0ksZUFBUztBQURiLEtBRFc7QUFIZixHQTdFYyxFQXNGZDtBQUNJLG1CQUFlLFVBRG5CO0FBRUksbUJBQWUsa0JBRm5CO0FBR0ksZUFBVyxDQUNYO0FBQ0ksZUFBUztBQURiLEtBRFc7QUFIZixHQXRGYyxFQStGZDtBQUNJLG1CQUFlLFVBRG5CO0FBRUksbUJBQWUsb0JBRm5CO0FBR0ksZUFBVyxDQUNYO0FBQ0ksZUFBUztBQURiLEtBRFc7QUFIZixHQS9GYyxFQXdHZDtBQUNJLG1CQUFlLE1BRG5CO0FBRUksbUJBQWUsZUFGbkI7QUFHSSxlQUFXLENBQ1g7QUFDSSxlQUFTO0FBRGIsS0FEVztBQUhmLEdBeEdjLEVBaUhkO0FBQ0ksbUJBQWUsTUFEbkI7QUFFSSxtQkFBZSxrQkFGbkI7QUFHSSxlQUFXLENBQ1g7QUFDSSxlQUFTO0FBRGIsS0FEVztBQUhmLEdBakhjLEVBMEhkO0FBQ0ksbUJBQWUsZUFEbkI7QUFFSSxtQkFBZSxVQUZuQjtBQUdJLGVBQVcsQ0FDWDtBQUNJLGVBQVM7QUFEYixLQURXO0FBSGYsR0ExSGMsRUFtSWQ7QUFDSSxtQkFBZSxjQURuQjtBQUVJLG1CQUFlLFVBRm5CO0FBR0ksZUFBVyxDQUNYO0FBQ0ksZUFBUztBQURiLEtBRFc7QUFIZixHQW5JYyxFQTRJZDtBQUNJLG1CQUFlLGdDQURuQjtBQUVJLG1CQUFlLFVBRm5CO0FBR0ksZUFBVyxDQUNYO0FBQ0ksZUFBUztBQURiLEtBRFc7QUFIZixHQTVJYyxFQXFKZDtBQUNJLG1CQUFlLFlBRG5CO0FBRUksbUJBQWUsa0JBRm5CO0FBR0ksZUFBVyxDQUNYO0FBQ0ksZUFBUztBQURiLEtBRFc7QUFIZixHQXJKYyxFQThKZDtBQUNJLG1CQUFlLFNBRG5CO0FBRUksbUJBQWUsa0JBRm5CO0FBR0ksZUFBVyxDQUNYO0FBQ0ksZUFBUztBQURiLEtBRFc7QUFIZixHQTlKYyxFQXVLZDtBQUNJLG1CQUFlLE9BRG5CO0FBRUksbUJBQWUsVUFGbkI7QUFHSSxlQUFXLENBQ1g7QUFDSSxlQUFTO0FBRGIsS0FEVztBQUhmLEdBdktjLEVBZ0xkO0FBQ0ksbUJBQWUsT0FEbkI7QUFFSSxtQkFBZSxrQkFGbkI7QUFHSSxlQUFXLENBQ1g7QUFDSSxlQUFTO0FBRGIsS0FEVztBQUhmLEdBaExjLENBQWxCLENBbGxDeUIsQ0E2d0N6Qjs7QUFDQSxXQUFTQyxPQUFULEdBQW1CO0FBQ2Y7QUFDQSxRQUFNQyxHQUFHLEdBQUcsSUFBSUMsTUFBTSxDQUFDQyxJQUFQLENBQVlDLEdBQWhCLENBQ1JuUSxRQUFRLENBQUNvUSxjQUFULENBQXdCLEtBQXhCLENBRFEsRUFDd0I7QUFDNUJDLE1BQUFBLElBQUksRUFBRSxFQURzQjtBQUU1QkMsTUFBQUEsTUFBTSxFQUFFWCxJQUZvQjtBQUc1QlksTUFBQUEsTUFBTSxFQUFFVCxTQUhvQjtBQUk1QlUsTUFBQUEsV0FBVyxFQUFFLElBSmU7QUFLNUJDLE1BQUFBLGNBQWMsRUFBRSxLQUxZO0FBTTVCQyxNQUFBQSxZQUFZLEVBQUUsSUFOYztBQU81QkMsTUFBQUEsaUJBQWlCLEVBQUUsS0FQUztBQVE1QkMsTUFBQUEsYUFBYSxFQUFFLEtBUmE7QUFTNUJDLE1BQUFBLGlCQUFpQixFQUFFO0FBVFMsS0FEeEIsQ0FBWjtBQWFBLFFBQU1DLFNBQVMsR0FBRztBQUNkQyxNQUFBQSxHQUFHLEVBQUUsbUJBRFM7QUFFZDtBQUNBN0ssTUFBQUEsSUFBSSxFQUFFLElBQUkrSixNQUFNLENBQUNDLElBQVAsQ0FBWWMsSUFBaEIsQ0FBcUIsRUFBckIsRUFBeUIsRUFBekIsQ0FIUTtBQUlkO0FBQ0FDLE1BQUFBLE1BQU0sRUFBRSxJQUFJaEIsTUFBTSxDQUFDQyxJQUFQLENBQVlnQixLQUFoQixDQUFzQixDQUF0QixFQUF5QixDQUF6QixDQUxNO0FBTWQ7QUFDQUMsTUFBQUEsTUFBTSxFQUFFLElBQUlsQixNQUFNLENBQUNDLElBQVAsQ0FBWWdCLEtBQWhCLENBQXNCLEVBQXRCLEVBQTBCLEVBQTFCO0FBUE0sS0FBbEIsQ0FmZSxDQXlCZjs7QUFDQSxRQUFNRSxNQUFNLEdBQUcsSUFBSW5CLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZbUIsTUFBaEIsQ0FBdUI7QUFDbENDLE1BQUFBLFFBQVEsRUFBRTNCLElBRHdCO0FBRWxDNEIsTUFBQUEsSUFBSSxFQUFFVCxTQUY0QjtBQUdsQ2QsTUFBQUEsR0FBRyxFQUFFQTtBQUg2QixLQUF2QixDQUFmO0FBS0g7O0FBRURoUCxFQUFBQSxNQUFNLENBQUMrTyxPQUFQLEdBQWlCQSxPQUFqQjtBQUVKO0FBQ0MsQ0FsekNEIiwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICog0JPQu9C+0LHQsNC70YzQvdGL0LUg0L/QtdGA0LXQvNC10L3QvdGL0LUsINC60L7RgtC+0YDRi9C1INC40YHQv9C+0LvRjNC30YPRjtGC0YHRjyDQvNC90L7Qs9C+0LrRgNCw0YLQvdC+XG4gICAgICovXG4gICAgbGV0IGdsb2JhbE9wdGlvbnMgPSB7XG4gICAgICAgIC8vINCS0YDQtdC80Y8g0LTQu9GPINCw0L3QuNC80LDRhtC40LlcbiAgICAgICAgdGltZTogIDIwMCxcblxuICAgICAgICAvLyDQmtC+0L3RgtGA0L7Qu9GM0L3Ri9C1INGC0L7Rh9C60Lgg0LDQtNCw0L/RgtC40LLQsFxuICAgICAgICBkZXNrdG9wTGdTaXplOiAgMTkxMCxcbiAgICAgICAgZGVza3RvcE1kU2l6ZTogIDE2MDAsXG4gICAgICAgIGRlc2t0b3BTaXplOiAgICAxNDgwLFxuICAgICAgICBkZXNrdG9wU21TaXplOiAgMTI4MCxcbiAgICAgICAgdGFibGV0TGdTaXplOiAgIDEwMjQsXG4gICAgICAgIHRhYmxldFNpemU6ICAgICA3NjgsXG4gICAgICAgIG1vYmlsZUxnU2l6ZTogICA2NDAsXG4gICAgICAgIG1vYmlsZVNpemU6ICAgICA0ODAsXG5cbiAgICAgICAgbGFuZzogJCgnaHRtbCcpLmF0dHIoJ2xhbmcnKVxuICAgIH07XG5cbiAgICAvLyDQkdGA0LXQudC60L/QvtC40L3RgtGLINCw0LTQsNC/0YLQuNCy0LBcbiAgICAvLyBAZXhhbXBsZSBpZiAoZ2xvYmFsT3B0aW9ucy5icmVha3BvaW50VGFibGV0Lm1hdGNoZXMpIHt9IGVsc2Uge31cbiAgICBjb25zdCBicmVha3BvaW50cyA9IHtcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wTGdTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BNZDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wTWRTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3A6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcFNtOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BTbVNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50VGFibGV0TGc6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMudGFibGV0TGdTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludFRhYmxldDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludE1vYmlsZUxnU2l6ZTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5tb2JpbGVMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50TW9iaWxlOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLm1vYmlsZVNpemUgLSAxfXB4KWApXG4gICAgfTtcblxuICAgICQuZXh0ZW5kKHRydWUsIGdsb2JhbE9wdGlvbnMsIGJyZWFrcG9pbnRzKTtcblxuICAgICQod2luZG93KS5vbignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKCQoJ3RleHRhcmVhJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXV0b3NpemUoJCgndGV4dGFyZWEnKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqINCf0L7QtNC60LvRjtGH0LXQvdC40LUganMgcGFydGlhbHNcbiAgICAgKi9cbiAgICAvKipcbiAqINCg0LDRgdGI0LjRgNC10L3QuNC1IGFuaW1hdGUuY3NzXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGFuaW1hdGlvbk5hbWUg0L3QsNC30LLQsNC90LjQtSDQsNC90LjQvNCw0YbQuNC4XG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sg0YTRg9C90LrRhtC40Y8sINC60L7RgtC+0YDQsNGPINC+0YLRgNCw0LHQvtGC0LDQtdGCINC/0L7RgdC70LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxuICogQHJldHVybiB7T2JqZWN0fSDQvtCx0YrQtdC60YIg0LDQvdC40LzQsNGG0LjQuFxuICogXG4gKiBAc2VlICBodHRwczovL2RhbmVkZW4uZ2l0aHViLmlvL2FuaW1hdGUuY3NzL1xuICogXG4gKiBAZXhhbXBsZVxuICogJCgnI3lvdXJFbGVtZW50JykuYW5pbWF0ZUNzcygnYm91bmNlJyk7XG4gKiBcbiAqICQoJyN5b3VyRWxlbWVudCcpLmFuaW1hdGVDc3MoJ2JvdW5jZScsIGZ1bmN0aW9uKCkge1xuICogICAgIC8vINCU0LXQu9Cw0LXQvCDRh9GC0L4t0YLQviDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcbiAqIH0pO1xuICovXG4kLmZuLmV4dGVuZCh7XG4gICAgYW5pbWF0ZUNzczogZnVuY3Rpb24oYW5pbWF0aW9uTmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGFuaW1hdGlvbkVuZCA9IChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnYW5pbWF0aW9uZW5kJyxcbiAgICAgICAgICAgICAgICBPQW5pbWF0aW9uOiAnb0FuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgTW96QW5pbWF0aW9uOiAnbW96QW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICBXZWJraXRBbmltYXRpb246ICd3ZWJraXRBbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZm9yIChsZXQgdCBpbiBhbmltYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbnNbdF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG5cbiAgICAgICAgdGhpcy5hZGRDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1hdGlvbk5hbWUpLm9uZShhbmltYXRpb25FbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1hdGlvbk5hbWUpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59KTtcbiAgICAvLyDQndC10LHQvtC70YzRiNC40LUg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9C1INGE0YPQvdC60YbQuNC4XG5cbiAgICAvKipcbiAgICAgKiDQn9GA0L7QstC10YDRj9C10YIg0YfQuNGB0LvQviDQuNC70Lgg0L3QtdGCXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IG4g0JvRjtCx0L7QuSDQsNGA0LPRg9C80LXQvdGCXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNOdW1lcmljKG4pIHtcbiAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqINCj0LTQsNC70Y/QtdGCINCy0YHQtSDQvdC10YfQuNGB0LvQvtCy0YvQtSDRgdC40LzQstC+0LvRiyDQuCDQv9GA0LjQstC+0LTQuNGCINC6INGH0LjRgdC70YNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyfG51bWJlcn0gcGFyYW1cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlbW92ZU5vdERpZ2l0cyhwYXJhbSkge1xuICAgICAgICAvKiDRg9C00LDQu9GP0LXQvCDQstGB0LUg0YHQuNC80LLQvtC70Ysg0LrRgNC+0LzQtSDRhtC40YTRgCDQuCDQv9C10YDQtdCy0L7QtNC40Lwg0LIg0YfQuNGB0LvQviAqL1xuICAgICAgICByZXR1cm4gK3BhcmFtLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQoNCw0LfQtNC10LvRj9C10YIg0L3QsCDRgNCw0LfRgNGP0LTRi1xuICAgICAqINCd0LDQv9GA0LjQvNC10YAsIDM4MDAwMDAgLT4gMyA4MDAgMDAwXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cnxudW1iZXJ9IHBhcmFtXG4gICAgICogQHJldHVybnMge3N0cn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaXZpZGVCeURpZ2l0cyhwYXJhbSkge1xuICAgICAgICBpZiAocGFyYW0gPT09IG51bGwpIHBhcmFtID0gMDtcbiAgICAgICAgcmV0dXJuIHBhcmFtLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCkoPz0oXFxkXFxkXFxkKSsoW15cXGRdfCQpKS9nLCAnJDEgJyk7XG4gICAgfVxuXG4gICAgdmFyIGxvY2FsZSA9IGdsb2JhbE9wdGlvbnMubGFuZyA9PSAncnUtUlUnID8gJ3J1JyA6ICdlbic7XG5cbiAgICBQYXJzbGV5LnNldExvY2FsZShsb2NhbGUpO1xuXG4gICAgLyog0J3QsNGB0YLRgNC+0LnQutC4IFBhcnNsZXkgKi9cbiAgICAkLmV4dGVuZChQYXJzbGV5Lm9wdGlvbnMsIHtcbiAgICAgICAgdHJpZ2dlcjogJ2JsdXIgY2hhbmdlJywgLy8gY2hhbmdlINC90YPQttC10L0g0LTQu9GPIHNlbGVjdCfQsFxuICAgICAgICB2YWxpZGF0aW9uVGhyZXNob2xkOiAnMCcsXG4gICAgICAgIGVycm9yc1dyYXBwZXI6ICc8ZGl2PjwvZGl2PicsXG4gICAgICAgIGVycm9yVGVtcGxhdGU6ICc8cCBjbGFzcz1cInBhcnNsZXktZXJyb3ItbWVzc2FnZVwiPjwvcD4nLFxuICAgICAgICBjbGFzc0hhbmRsZXI6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xuICAgICAgICAgICAgbGV0IHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXG4gICAgICAgICAgICAgICAgJGhhbmRsZXI7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJGVsZW1lbnQ7IC8vINGC0L4g0LXRgdGC0Ywg0L3QuNGH0LXQs9C+INC90LUg0LLRi9C00LXQu9GP0LXQvCAoaW5wdXQg0YHQutGA0YvRgiksINC40L3QsNGH0LUg0LLRi9C00LXQu9GP0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0LHQu9C+0LpcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAkaGFuZGxlciA9ICQoJy5zZWxlY3QyLXNlbGVjdGlvbi0tc2luZ2xlJywgJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAkaGFuZGxlcjtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3JzQ29udGFpbmVyOiBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSBpbnN0YW5jZS4kZWxlbWVudDtcbiAgICAgICAgICAgIGxldCB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxuICAgICAgICAgICAgICAgICRjb250YWluZXI7XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICQoYFtuYW1lPVwiJHskZWxlbWVudC5hdHRyKCduYW1lJyl9XCJdOmxhc3QgKyBsYWJlbGApLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5hdHRyKCduYW1lJykgPT0gJ2lzX3JlY2FwdGNoYV9zdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5wYXJlbnQoKS5uZXh0KCcuZy1yZWNhcHRjaGEnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LmNsb3Nlc3QoJy5maWVsZCcpO1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCRjb250YWluZXIpXG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIHJldHVybiAkY29udGFpbmVyO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQmtCw0YHRgtC+0LzQvdGL0LUg0LLQsNC70LjQtNCw0YLQvtGA0YtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZVJ1Jywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRXFwtIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0LvQsNGC0LjQvdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lRW4nLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW2EtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCBcIiBcIiwgXCItXCInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXpcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIidcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0Ysg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXJSdScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bMC050LAt0Y/RkV0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLINCQLdCvLCDQsC3RjywgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzINCQLdCvLCDQsC3RjywgMC05J1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiywg0LvQsNGC0LjQvdGB0LrQuNC1INC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtTGV0dGVyJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRYS16MC05XSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIDAtOSdcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgFxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdwaG9uZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bLSswLTkoKSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INGC0LXQu9C10YTQvtC90L3Ri9C5INC90L7QvNC10YAnLFxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgcGhvbmUgbnVtYmVyJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1iZXInLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eWzAtOV0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIDAtOScsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyAwLTknXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCf0L7Rh9GC0LAg0LHQtdC3INC60LjRgNC40LvQu9C40YbRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdlbWFpbCcsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL14oW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKFxcLnxffC0pezAsMX0pK1tBLVphLXrQkC3Qr9CwLdGPMC05XFwtXVxcQChbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pKygoXFwuKXswLDF9W0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKXsxLH1cXC5bYS160LAt0Y8wLTlcXC1dezIsfSQvLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L/QvtGH0YLQvtCy0YvQuSDQsNC00YDQtdGBJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGVtYWlsIGFkZHJlc3MnXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCk0L7RgNC80LDRgiDQtNCw0YLRiyBERC5NTS5ZWVlZXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2RhdGUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgbGV0IHJlZ1Rlc3QgPSAvXig/Oig/OjMxKFxcLikoPzowP1sxMzU3OF18MVswMl0pKVxcMXwoPzooPzoyOXwzMCkoXFwuKSg/OjA/WzEsMy05XXwxWzAtMl0pXFwyKSkoPzooPzoxWzYtOV18WzItOV1cXGQpP1xcZHsyfSkkfF4oPzoyOShcXC4pMD8yXFwzKD86KD86KD86MVs2LTldfFsyLTldXFxkKT8oPzowWzQ4XXxbMjQ2OF1bMDQ4XXxbMTM1NzldWzI2XSl8KD86KD86MTZ8WzI0NjhdWzA0OF18WzM1NzldWzI2XSkwMCkpKSkkfF4oPzowP1sxLTldfDFcXGR8MlswLThdKShcXC4pKD86KD86MD9bMS05XSl8KD86MVswLTJdKSlcXDQoPzooPzoxWzYtOV18WzItOV1cXGQpP1xcZHs0fSkkLyxcbiAgICAgICAgICAgICAgICByZWdNYXRjaCA9IC8oXFxkezEsMn0pXFwuKFxcZHsxLDJ9KVxcLihcXGR7NH0pLyxcbiAgICAgICAgICAgICAgICBtaW4gPSBhcmd1bWVudHNbMl0uJGVsZW1lbnQuZGF0YSgnZGF0ZU1pbicpLFxuICAgICAgICAgICAgICAgIG1heCA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWF4JyksXG4gICAgICAgICAgICAgICAgbWluRGF0ZSwgbWF4RGF0ZSwgdmFsdWVEYXRlLCByZXN1bHQ7XG5cbiAgICAgICAgICAgIGlmIChtaW4gJiYgKHJlc3VsdCA9IG1pbi5tYXRjaChyZWdNYXRjaCkpKSB7XG4gICAgICAgICAgICAgICAgbWluRGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1heCAmJiAocmVzdWx0ID0gbWF4Lm1hdGNoKHJlZ01hdGNoKSkpIHtcbiAgICAgICAgICAgICAgICBtYXhEYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0ID0gdmFsdWUubWF0Y2gocmVnTWF0Y2gpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVEYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZWdUZXN0LnRlc3QodmFsdWUpICYmIChtaW5EYXRlID8gdmFsdWVEYXRlID49IG1pbkRhdGUgOiB0cnVlKSAmJiAobWF4RGF0ZSA/IHZhbHVlRGF0ZSA8PSBtYXhEYXRlIDogdHJ1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90LDRjyDQtNCw0YLQsCcsXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBkYXRlJ1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIC8vINCk0LDQudC7INC+0LPRgNCw0L3QuNGH0LXQvdC90L7Qs9C+INGA0LDQt9C80LXRgNCwXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2ZpbGVNYXhTaXplJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIG1heFNpemUsIHBhcnNsZXlJbnN0YW5jZSkge1xuICAgICAgICAgICAgbGV0IGZpbGVzID0gcGFyc2xleUluc3RhbmNlLiRlbGVtZW50WzBdLmZpbGVzO1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVzLmxlbmd0aCAhPSAxICB8fCBmaWxlc1swXS5zaXplIDw9IG1heFNpemUgKiAxMDI0O1xuICAgICAgICB9LFxuICAgICAgICByZXF1aXJlbWVudFR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0KTQsNC50Lsg0LTQvtC70LbQtdC9INCy0LXRgdC40YLRjCDQvdC1INCx0L7Qu9C10LUsINGH0LXQvCAlcyBLYicsXG4gICAgICAgICAgICBlbjogJ0ZpbGUgc2l6ZSBjYW5cXCd0IGJlIG1vcmUgdGhlbiAlcyBLYidcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0J7Qs9GA0LDQvdC40YfQtdC90LjRjyDRgNCw0YHRiNC40YDQtdC90LjQuSDRhNCw0LnQu9C+0LJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZUV4dGVuc2lvbicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlLCBmb3JtYXRzKSB7XG4gICAgICAgICAgICBsZXQgZmlsZUV4dGVuc2lvbiA9IHZhbHVlLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgICAgICBsZXQgZm9ybWF0c0FyciA9IGZvcm1hdHMuc3BsaXQoJywgJyk7XG4gICAgICAgICAgICBsZXQgdmFsaWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JtYXRzQXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVFeHRlbnNpb24gPT09IGZvcm1hdHNBcnJbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWxpZDtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0JTQvtC/0YPRgdGC0LjQvNGLINGC0L7Qu9GM0LrQviDRhNCw0LnQu9GLINGE0L7RgNC80LDRgtCwICVzJyxcbiAgICAgICAgICAgIGVuOiAnQXZhaWxhYmxlIGV4dGVuc2lvbnMgYXJlICVzJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQodC+0LfQtNCw0ZHRgiDQutC+0L3RgtC10LnQvdC10YDRiyDQtNC70Y8g0L7RiNC40LHQvtC6INGDINC90LXRgtC40L/QuNGH0L3Ri9GFINGN0LvQtdC80LXQvdGC0L7QslxuICAgIFBhcnNsZXkub24oJ2ZpZWxkOmluaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gdGhpcy4kZWxlbWVudCxcbiAgICAgICAgICAgIHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXG4gICAgICAgICAgICAkYmxvY2sgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygnZXJyb3JzLXBsYWNlbWVudCcpLFxuICAgICAgICAgICAgJGxhc3Q7XG5cbiAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJChgW25hbWU9XCIkeyRlbGVtZW50LmF0dHIoJ25hbWUnKX1cIl06bGFzdCArIGxhYmVsYCk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJyk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdmaWxlJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5jbG9zZXN0KCcuY3VzdG9tLWZpbGUnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJyk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5hdHRyKCduYW1lJykgPT0gJ2lzX3JlY2FwdGNoYV9zdWNjZXNzJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5wYXJlbnQoKS5uZXh0KCcuZy1yZWNhcHRjaGEnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQmNC90LjRhtC40LjRgNGD0LXRgiDQstCw0LvQuNC00LDRhtC40Y4g0L3QsCDQstGC0L7RgNC+0Lwg0LrQsNC70LXQtNCw0YDQvdC+0Lwg0L/QvtC70LUg0LTQuNCw0L/QsNC30L7QvdCwXG4gICAgUGFyc2xleS5vbignZmllbGQ6dmFsaWRhdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCAkZWxlbWVudCA9ICQodGhpcy5lbGVtZW50KTtcbiAgICB9KTtcblxuICAgICQoJ2Zvcm1bZGF0YS12YWxpZGF0ZT1cInRydWVcIl0nKS5wYXJzbGV5KCk7XG5cbiAgICAvLyDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0YLQvtC70YzQutC+INC90LAg0YHRgtGA0LDQvdC40YbQtSBjaGVja291dC5odG1sXG4gICAgaWYgKCQoJy5qcy1jb2xsYXBzZS1idG4nKS5sZW5ndGgpIHtcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1jb2xsYXBzZS1idG4nLCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCAkY29sbGFwc2VCb2R5ID0gJHNlbGYuY2xvc2VzdCgnLmpzLWNvbGxhcHNlJykuZmluZCgnLmpzLWNvbGxhcHNlLWJvZHknKTtcbiAgICAgICAgICAgIGlmICgkc2VsZi5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcbiAgICAgICAgICAgICAgICAkc2VsZi5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJGNvbGxhcHNlQm9keS5zbGlkZVVwKCdmYXN0Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRzZWxmLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkY29sbGFwc2VCb2R5LnNsaWRlRG93bignZmFzdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQlNC+0LHQsNCy0LvRj9C10YIg0LzQsNGB0LrQuCDQsiDQv9C+0LvRjyDRhNC+0YDQvFxuICAgICAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9Sb2JpbkhlcmJvdHMvSW5wdXRtYXNrXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxpbnB1dCBjbGFzcz1cImpzLXBob25lLW1hc2tcIiB0eXBlPVwidGVsXCIgbmFtZT1cInRlbFwiIGlkPVwidGVsXCI+XG4gICAgICovXG4gICAgJCgnLmpzLXBob25lLW1hc2snKS5pbnB1dG1hc2soJys3KDk5OSkgOTk5LTk5LTk5Jywge1xuICAgICAgICBjbGVhck1hc2tPbkxvc3RGb2N1czogdHJ1ZSxcbiAgICAgICAgc2hvd01hc2tPbkhvdmVyOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog0KHRgtC40LvQuNC30YPQtdGCINGB0LXQu9C10LrRgtGLINGBINC/0L7QvNC+0YnRjNGOINC/0LvQsNCz0LjQvdCwIHNlbGVjdDJcbiAgICAgKiBodHRwczovL3NlbGVjdDIuZ2l0aHViLmlvXG4gICAgICovXG4gICAgbGV0IEN1c3RvbVNlbGVjdCA9IGZ1bmN0aW9uKCRlbGVtKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLmluaXQgPSBmdW5jdGlvbigkaW5pdEVsZW0pIHtcbiAgICAgICAgICAgICRpbml0RWxlbS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RTZWFyY2ggPSAkKHRoaXMpLmRhdGEoJ3NlYXJjaCcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdFNlYXJjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSAxOyAvLyDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gSW5maW5pdHk7IC8vINC90LUg0L/QvtC60LDQt9GL0LLQsNC10Lwg0L/QvtC70LUg0L/QvtC40YHQutCwXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNlbGVjdDIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0T25CbHVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd25Dc3NDbGFzczogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9SZXN1bHRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAn0KHQvtCy0L/QsNC00LXQvdC40Lkg0L3QtSDQvdCw0LnQtNC10L3Qvic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3Rg9C20L3QviDQtNC70Y8g0LLRi9C70LjQtNCw0YbQuNC4INC90LAg0LvQtdGC0YNcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZChgb3B0aW9uW3ZhbHVlPVwiJHskKHRoaXMpLnZhbHVlfVwiXWApLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi51cGRhdGUgPSBmdW5jdGlvbigkdXBkYXRlRWxlbSkge1xuICAgICAgICAgICAgJHVwZGF0ZUVsZW0uc2VsZWN0MignZGVzdHJveScpO1xuICAgICAgICAgICAgc2VsZi5pbml0KCR1cGRhdGVFbGVtKTtcbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLmluaXQoJGVsZW0pO1xuICAgIH07XG5cbiAgICB2YXIgY3VzdG9tU2VsZWN0ID0gbmV3IEN1c3RvbVNlbGVjdCgkKCdzZWxlY3QnKSk7XG5cbiAgICBjb25zdCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIGRhdGVGb3JtYXQ6ICdkZC5tbS55eScsXG4gICAgICAgIHNob3dPdGhlck1vbnRoczogdHJ1ZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDQlNC10LvQsNC10YIg0LLRi9C/0LDQtNGO0YnQuNC1INC60LDQu9C10L3QtNCw0YDQuNC60LhcbiAgICAgKiBAc2VlICBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9kYXRlcGlja2VyL1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyDQsiBkYXRhLWRhdGUtbWluINC4IGRhdGEtZGF0ZS1tYXgg0LzQvtC20L3QviDQt9Cw0LTQsNGC0Ywg0LTQsNGC0YMg0LIg0YTQvtGA0LzQsNGC0LUgZGQubW0ueXl5eVxuICAgICAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJkYXRlSW5wdXRcIiBpZD1cIlwiIGNsYXNzPVwianMtZGF0ZXBpY2tlclwiIGRhdGEtZGF0ZS1taW49XCIwNi4xMS4yMDE1XCIgZGF0YS1kYXRlLW1heD1cIjEwLjEyLjIwMTVcIj5cbiAgICAgKi9cbiAgICBsZXQgRGF0ZXBpY2tlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBkYXRlcGlja2VyID0gJCgnLmpzLWRhdGVwaWNrZXInKTtcblxuICAgICAgICBkYXRlcGlja2VyLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IG1pbkRhdGUgPSAkKHRoaXMpLmRhdGEoJ2RhdGUtbWluJyk7XG4gICAgICAgICAgICBsZXQgbWF4RGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1tYXgnKTtcbiAgICAgICAgICAgIGNvbnN0IHNob3dNWSA9ICQodGhpcykuZGF0YSgnc2hvdy1tLXknKTtcblxuICAgICAgICAgICAgLyog0LXRgdC70Lgg0LIg0LDRgtGA0LjQsdGD0YLQtSDRg9C60LDQt9Cw0L3QviBjdXJyZW50LCDRgtC+INCy0YvQstC+0LTQuNC8INGC0LXQutGD0YnRg9GOINC00LDRgtGDICovXG4gICAgICAgICAgICBpZiAoIG1heERhdGUgPT09ICdjdXJyZW50JyB8fCBtaW5EYXRlID09PSAnY3VycmVudCcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnREYXkgPSBjdXJyZW50RGF0ZS5nZXREYXRlKCk7XG4gICAgICAgICAgICAgICAgY3VycmVudERheSA8IDEwID8gY3VycmVudERheSA9ICcwJyArIGN1cnJlbnREYXkudG9TdHJpbmcoKSA6IGN1cnJlbnREYXk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3RGF0ZSA9IGN1cnJlbnREYXkgKyAnLicgKyAoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpICsgJy4nICsgY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICBtYXhEYXRlID09PSAnY3VycmVudCcgPyBtYXhEYXRlID0gbmV3RGF0ZSA6IG1pbkRhdGUgPSBuZXdEYXRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaXRlbU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgbWluRGF0ZTogbWluRGF0ZSB8fCBudWxsLFxuICAgICAgICAgICAgICAgIG1heERhdGU6IG1heERhdGUgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY2hhbmdlKCk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLmZpZWxkJykuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmKHNob3dNWSkge1xuICAgICAgICAgICAgICAgIGl0ZW1PcHRpb25zWydjaGFuZ2VZZWFyJ10gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGl0ZW1PcHRpb25zWyd5ZWFyUmFuZ2UnXSA9ICdjLTEwMDpjJztcbiAgICAgICAgICAgICAgICBpdGVtT3B0aW9uc1snY2hhbmdlTW9udGgnXSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIGl0ZW1PcHRpb25zLCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMpO1xuXG4gICAgICAgICAgICAkKHRoaXMpLmRhdGVwaWNrZXIoaXRlbU9wdGlvbnMpO1xuICAgICAgICB9KTtcblxuICAgICAgICAgLy8g0LTQtdC70LDQtdC8INC60YDQsNGB0LjQstGL0Lwg0YHQtdC70LXQuiDQvNC10YHRj9GG0LAg0Lgg0LPQvtC00LBcbiAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdmb2N1cycsICcuanMtZGF0ZXBpY2tlcicsICgpID0+IHtcbiAgICAgICAgICAgIC8vINC40YHQv9C+0LvRjNC30YPQtdC8INC30LDQtNC10YDQttC60YMsINGH0YLQvtCx0Ysg0LTQtdC50YLQv9C40LrQtdGAINGD0YHQv9C10Lsg0LjQvdC40YbQuNCw0LvQuNC30LjRgNC+0LLQsNGC0YzRgdGPXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZigkKCcudWktZGF0ZXBpY2tlcicpLmZpbmQoJ3NlbGVjdCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcudWktZGF0ZXBpY2tlcicpLmZpbmQoJ3NlbGVjdCcpLnNlbGVjdDIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0T25CbHVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd25Dc3NDbGFzczogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBsZXQgZGF0ZXBpY2tlciA9IG5ldyBEYXRlcGlja2VyKCk7XG5cbiAgICBjb25zdCAkbW9iaWxlTWVudSA9ICQoJy5qcy1tb2JpbGUtbWVudScpO1xuICAgIGNvbnN0ICRjYXJ0TW9kYWwgPSAkKCcuanMtY2FydC1tb2RhbCcpO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1tZW51LWJ0bicsICgpID0+IHtcbiAgICAgICAgb3Blbk1vZGFsKCRtb2JpbGVNZW51KTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtbWVudS1jbG9zZScsICgpID0+IHtcbiAgICAgICAgaGlkZU1vZGFsKCRtb2JpbGVNZW51KVxuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1jYXJ0LWJ0bicsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgb3Blbk1vZGFsKCRjYXJ0TW9kYWwpO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1jYXJ0LWNsb3NlJywgKCkgPT4ge1xuICAgICAgICBoaWRlTW9kYWwoJGNhcnRNb2RhbCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBPcGVuIG1vZGFsIGJsb2NrXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRtb2RhbEJsb2NrIE1vZGFsIGJsb2NrXG4gICAgICovXG4gICAgZnVuY3Rpb24gb3Blbk1vZGFsKCRtb2RhbEJsb2NrKSB7XG4gICAgICAgICRtb2RhbEJsb2NrLmFkZENsYXNzKCdpcy1hY3RpdmUnKS5hbmltYXRlQ3NzKCdzbGlkZUluUmlnaHQnKTtcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoYXMtb3ZlcmxheScpO1xuICAgICAgICBsb2NrRG9jdW1lbnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIaWRlIG1vZGFsIGJsb2NrXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRtb2RhbEJsb2NrIE1vZGFsIGJsb2NrXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGlkZU1vZGFsKCRtb2RhbEJsb2NrKSB7XG4gICAgICAgICRtb2RhbEJsb2NrLmFuaW1hdGVDc3MoJ3NsaWRlT3V0UmlnaHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAkbW9kYWxCbG9jay5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgICAgICB1bmxvY2tEb2N1bWVudCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbmxvY2sgZG9jdW1lbnQgZm9yIHNjcm9sbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVubG9ja0RvY3VtZW50KCkge1xuICAgICAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ2lzLWxvY2tlZCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvY2sgZG9jdW1lbnQgZm9yIHNjcm9sbFxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkbG9ja0Jsb2NrIEJsb2NrIHdoaWNoIGRlZmluZSBkb2N1bWVudCBoZWlnaHRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2NrRG9jdW1lbnQoKSB7XG4gICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtbG9ja2VkJyk7XG4gICAgfVxuXG5cbiAgICAvLyAtLS0tLS0g0LvQvtCz0LjQutCwINC+0YLQutGA0YvRgtC40Y8g0LLRi9C/0LDQtNCw0YjQtdC6INGF0LXQtNC10YDQsCAtLS0tLS1cbiAgICBjb25zdCAkaGVhZGVyID0gJCgnLmpzLWhlYWRlcicpO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1oZWFkZXItZHJvcGRvd24tYnRuJywgZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgJHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IGNhdGVnb3J5ID0gJHNlbGYuYXR0cignZGF0YS1jYXRlZ29yeScpO1xuICAgICAgICBjb25zdCAkY2F0ZWdvcnlEcm9wZG93biA9ICQoYFtkYXRhLWRyb3Bkb3duLWNhdGVnb3J5PScke2NhdGVnb3J5fSddYCk7XG5cbiAgICAgICAgaWYgKCRzZWxmLmhhc0NsYXNzKCdpcy1jaG9zZW4nKSkge1xuICAgICAgICAgICAgJHNlbGYucmVtb3ZlQ2xhc3MoJ2lzLWNob3NlbicpO1xuICAgICAgICAgICAgJGNhdGVnb3J5RHJvcGRvd24ucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuanMtaGVhZGVyLWRyb3Bkb3duLWJ0bicpLnJlbW92ZUNsYXNzKCdpcy1jaG9zZW4nKTtcbiAgICAgICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkaGVhZGVyLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICRzZWxmLmFkZENsYXNzKCdpcy1jaG9zZW4nKTtcbiAgICAgICAgICAgICRjYXRlZ29yeURyb3Bkb3duLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIGNsb3NlRHJvcGRvd25IYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiBjbG9zZURyb3Bkb3duSGFuZGxlcihlKSB7XG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCcuanMtaGVhZGVyJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAkKCcuanMtaGVhZGVyLWRyb3Bkb3duLWJ0bicpLnJlbW92ZUNsYXNzKCdpcy1jaG9zZW4nKTtcbiAgICAgICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9mZignY2xpY2snLCBjbG9zZURyb3Bkb3duSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDQvdC10LzQvdC+0LPQviDRgdC/0LXRhtC40YTQuNGH0L3Ri9C1INGC0LDQsdGLLiDQmNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8g0L3QsCDRgdGC0YDQsNC90LjRhtC1IGNoZWNrb3V0Lmh0bWwuINCf0YDQuCDQttC10LvQsNC90LjQuCDQvNC+0LbQvdC+INC00L7RgNCw0LHQvtGC0LDRgtGMXG5cbiAgICBpZiAoJCgnLmpzLXRhYnMtbGluaycpLmxlbmd0aCkge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLXRhYnMtbGluaycsIChlKSA9PiB7XG4gICAgICAgICAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCAkc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICAgICAgaWYgKCRzZWxmLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCAkdGFicyA9ICRzZWxmLmNsb3Nlc3QoJy5qcy10YWJzJyk7XG4gICAgICAgICAgICBjb25zdCAkdGFic0xpbmtzID0gJHRhYnMuZmluZCgnLmpzLXRhYnMtbGluaycpO1xuICAgICAgICAgICAgY29uc3QgJHRhYnNJdGVtcyA9ICR0YWJzLmZpbmQoJy5qcy10YWJzLWl0ZW0nKTtcblxuICAgICAgICAgICAgLy8g0LLRi9C60LvRjtGH0LDQtdC8INCy0YHQtSDQsNC60YLQuNCy0L3Ri9C1INGC0LDQsdGLINC4INGB0YHRi9C70LrQuFxuICAgICAgICAgICAgJHRhYnNMaW5rcy5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkdGFic0l0ZW1zLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8g0LLRi9C60LvRjtGH0LDQtdC8INCy0LDQu9C40LTQsNGG0LjRjiDRgyDRgdC60YDRi9GC0YvRhSDQv9C+0LvQtdC5INC4INC+0YfQuNGJ0LDQtdC8INC40YVcbiAgICAgICAgICAgIGxldCAkaGlkZGVuRm9ybUZpZWxkcyA9ICR0YWJzSXRlbXMuZmluZCgnW2RhdGEtcmVxdWlyZWRdJyk7XG4gICAgICAgICAgICBpZiAoJGhpZGRlbkZvcm1GaWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgnZGF0YS1yZXF1aXJlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy5wcm9wKCdyZXF1aXJlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy52YWwoJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQstC60LvRjtGH0LDQtdC8INC90YPQttC90YvQuSDRgtCw0LEg0Lgg0LTQtdC70LDQtdC8INC90YPQttC90YPRjiDRgdGB0YvQu9C60YMg0LDQutGC0LjQstC90L7QuVxuICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgY29uc3QgJHNlbGZJdGVtID0gJCgkc2VsZi5kYXRhKCd0YWInKSk7XG4gICAgICAgICAgICAkc2VsZkl0ZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLyDQstC60LvRjtGH0LDQtdC8INCy0LDQu9C40LTQsNGG0LjRjiDRgyDRgdC60YDRi9GC0YvRhSDQv9C+0LvQtdC5XG4gICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcyA9ICRzZWxmSXRlbS5maW5kKCdbZGF0YS1yZXF1aXJlZF0nKTtcbiAgICAgICAgICAgIGlmICgkaGlkZGVuRm9ybUZpZWxkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy5wcm9wKCdkYXRhLXJlcXVpcmVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiAgINCQ0LrRgtC40LLQuNGA0L7QstCw0YLRjC/QtNC10LfQsNC60YLQuNCy0LjRgNC+0LLQsNGC0Ywg0YHQv9C40L3QvdC10YBcbiAgICAqICAgY29uc3QgJGJsb2NrID0gJCgnLnNwaW5uZXInKTtcbiAgICAqICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcbiAgICAqICAgc3Bpbm5lci5lbmFibGVTcGlubmVyKCk7L3NwaW5uZXIuZGlzYWJsZVNwaW5uZXIoKTtcbiAgICAqXG4gICAgKi9cblxuICAgIGNsYXNzIFNwaW5uZXIge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSAgb3B0aW9ucyAgICAgICAgICAgICAgICAgICDQntCx0YrQtdC60YIg0YEg0L/QsNGA0LDQvNC10YLRgNCw0LzQuC5cbiAgICAgICAgICogQHBhcmFtICB7alF1ZXJ5fSAgb3B0aW9ucy4kYmxvY2sgICAgICAgICAgICDQqNCw0LHQu9C+0L0uXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLnZhbHVlID0gMF0gICAgICAg0J3QsNGH0LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLm1pbiA9IC1JbmZpbml0eV0g0JzQuNC90LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5tYXggPSBJbmZpbml0eV0gINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5zdGVwID0gMV0gICAgICAgINCo0LDQsy5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMucHJlY2lzaW9uXSAgICAgICDQotC+0YfQvdC+0YHRgtGMICjQvdGD0LbQvdCwINC00LvRjyDQtNC10YHRj9GC0LjRh9C90L7Qs9C+INGI0LDQs9CwKS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHsgJGJsb2NrLCB2YWx1ZSA9IDAsIG1pbiA9IC1JbmZpbml0eSwgbWF4ID0gSW5maW5pdHksIHN0ZXAgPSAxLCBwcmVjaXNpb24gfSA9IHt9KSB7XG4gICAgICAgICAgICB0aGlzLiRibG9jayA9ICRibG9jaztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMgPSB7XG4gICAgICAgICAgICAgICAgJGRlYzogJCgnLnNwaW5uZXJfX2J0bi0tZGVjJywgdGhpcy4kYmxvY2spLFxuICAgICAgICAgICAgICAgICRpbmM6ICQoJy5zcGlubmVyX19idG4tLWluYycsIHRoaXMuJGJsb2NrKSxcbiAgICAgICAgICAgICAgICAkaW5wdXQ6ICQoJy5zcGlubmVyX19pbnB1dCcsIHRoaXMuJGJsb2NrKSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSArdmFsdWU7XG4gICAgICAgICAgICB0aGlzLm1pbiA9ICttaW47XG4gICAgICAgICAgICB0aGlzLm1heCA9ICttYXg7XG4gICAgICAgICAgICB0aGlzLnN0ZXAgPSArc3RlcDtcbiAgICAgICAgICAgIHRoaXMucHJlY2lzaW9uID0gK3ByZWNpc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQn9GA0LjQstC+0LTQuNGCINGA0LDQt9C80LXRgtC60YMg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC1INC/0LDRgNCw0LzQtdGC0YDQsNC8LlxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9ucygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDRgdC+0YHRgtC+0Y/QvdC40LUg0LHQu9C+0LrQuNGA0L7QstC60Lgg0LrQvdC+0L/QvtC6LlxuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlQnV0dG9ucygpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGRlYy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGluYy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPCB0aGlzLm1pbiArIHRoaXMuc3RlcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGRlYy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA+IHRoaXMubWF4IC0gdGhpcy5zdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5jLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0J7RgtC60LvRjtGH0LXQvdC40LUg0YHQv9C40L3QvdC10YDQsC5cbiAgICAgICAgICovXG4gICAgICAgIGRpc2FibGVTcGlubmVyKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kZGVjLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbmMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQktC60LvRjtGH0LXQvdC40LUg0YHQv9C40L3QvdC10YDQsC5cbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZVNwaW5uZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2sucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0LfQvdCw0YfQtdC90LjQtSDRgdGH0ZHRgtGH0LjQutCwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUg0J3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKi9cbiAgICAgICAgY2hhbmdlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLmF0dHIoJ2RhdGEtdmFsdWUnLCB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbnB1dC5hdHRyKCd2YWx1ZScsIHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnZhbCh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0JzQtdC90Y/QtdGCINC30L3QsNGH0LXQvdC40LUg0LzQuNC90LjQvNGD0LzQsC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSB2YWx1ZSDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VNaW4odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMubWluID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hdHRyKCdkYXRhLW1pbicsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQnNC10L3Rj9C10YIg0LfQvdCw0YfQtdC90LjQtSDQvNCw0LrRgdC40LzRg9C80LAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gdmFsdWUg0J3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKi9cbiAgICAgICAgY2hhbmdlTWF4KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm1heCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2suYXR0cignZGF0YS1tYXgnLCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0JzQsNGB0YHQuNCyINGB0L7Qt9C00LDQvdC90YvRhSDQvtCx0YrQtdC60YLQvtCyLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIGluc3RhbmNlcyA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQndCw0YXQvtC00LjRgiDQvtCx0YrQtdC60YIg0LrQu9Cw0YHRgdCwINC/0L4g0YjQsNCx0LvQvtC90YMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge2pRdWVyeX0gJGJsb2NrINCo0LDQsdC70L7QvS5cbiAgICAgICAgICogQHJldHVybiB7U3Bpbm5lcn0gICAgICAg0J7QsdGK0LXQutGCLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIGdldEluc3RhbmNlKCRibG9jaykge1xuICAgICAgICAgICAgcmV0dXJuIFNwaW5uZXIuaW5zdGFuY2VzLmZpbmQoc3Bpbm5lciA9PiBzcGlubmVyLiRibG9jay5pcygkYmxvY2spKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQodC+0LfQtNCw0ZHRgiDQvtCx0YrQtdC60YLRiyDQv9C+INGI0LDQsdC70L7QvdCw0LwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSBbJHNwaW5uZXJzID0gJCgnLnNwaW5uZXInKV0g0KjQsNCx0LvQvtC90YsuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgY3JlYXRlKCRzcGlubmVycyA9ICQoJy5zcGlubmVyJykpIHtcbiAgICAgICAgICAgICRzcGlubmVycy5lYWNoKChpbmRleCwgYmxvY2spID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkYmxvY2sgPSAkKGJsb2NrKTtcblxuICAgICAgICAgICAgICAgIGlmIChTcGlubmVyLmdldEluc3RhbmNlKCRibG9jaykpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNwaW5uZXIgPSBuZXcgU3Bpbm5lcih7XG4gICAgICAgICAgICAgICAgICAgICRibG9jayxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICRibG9jay5hdHRyKCdkYXRhLXZhbHVlJyksXG4gICAgICAgICAgICAgICAgICAgIG1pbjogJGJsb2NrLmF0dHIoJ2RhdGEtbWluJyksXG4gICAgICAgICAgICAgICAgICAgIG1heDogJGJsb2NrLmF0dHIoJ2RhdGEtbWF4JyksXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA6ICRibG9jay5hdHRyKCdkYXRhLXN0ZXAnKSxcbiAgICAgICAgICAgICAgICAgICAgcHJlY2lzaW9uOiAkYmxvY2suYXR0cignZGF0YS1wcmVjaXNpb24nKSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICRibG9jay5oYXNDbGFzcygnaXMtZGlzYWJsZWQnKSA/IHNwaW5uZXIuZGlzYWJsZVNwaW5uZXIoKSA6IHNwaW5uZXIuaW5pdCgpO1xuXG4gICAgICAgICAgICAgICAgU3Bpbm5lci5pbnN0YW5jZXMucHVzaChzcGlubmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCj0LTQsNC70Y/QtdGCINC+0LHRitC10LrRgtGLINC/0L4g0YjQsNCx0LvQvtC90LDQvC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9IFskc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpXSDQqNCw0LHQu9C+0L3Riy5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyByZW1vdmUoJHNwaW5uZXJzID0gJCgnLnNwaW5uZXInKSkge1xuICAgICAgICAgICAgJHNwaW5uZXJzLmVhY2goKGluZGV4LCBibG9jaykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRibG9jayA9ICQoYmxvY2spO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3Bpbm5lckluZGV4ID0gU3Bpbm5lci5pbnN0YW5jZXMuZmluZEluZGV4KHNwaW5uZXIgPT4gc3Bpbm5lci4kYmxvY2suaXMoJGJsb2NrKSk7XG5cbiAgICAgICAgICAgICAgICBTcGlubmVyLmluc3RhbmNlcy5zcGxpY2Uoc3Bpbm5lckluZGV4LCAxKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5zcGlubmVyX19idG4tLWRlYycsIGhhbmRsZURlY0NsaWNrKTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnNwaW5uZXJfX2J0bi0taW5jJywgaGFuZGxlSW5jQ2xpY2spO1xuICAgICQoZG9jdW1lbnQpLm9uKCdpbnB1dCcsICcuc3Bpbm5lcl9faW5wdXQnLCBoYW5kbGVJbnB1dCk7XG5cbiAgICAvKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC/0LjQvdC90LXRgNC+0LIgKi9cbiAgICBsZXQgc3Bpbm5lcnMgPSBTcGlubmVyLmNyZWF0ZSgpO1xuXG4gICAgLyoqXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0LrQu9C40LrQsCDQv9C+INC60L3QvtC/0LrQtSDRg9C80LXQvdGM0YjQtdC90LjRjy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlINCe0LHRitC10LrRgiDRgdC+0LHRi9GC0LjRjy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYW5kbGVEZWNDbGljayhlKSB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudFRhcmdldCB9ID0gZTtcbiAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0ICRibG9jayA9ICR0YXJnZXQuY2xvc2VzdCgnLnNwaW5uZXInKTtcbiAgICAgICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBzcGlubmVyLnZhbHVlIC0gc3Bpbm5lci5zdGVwO1xuXG4gICAgICAgIGlmIChzcGlubmVyLnByZWNpc2lvbikge1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlLnRvRml4ZWQoc3Bpbm5lci5wcmVjaXNpb24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW5uZXIuY2hhbmdlVmFsdWUodmFsdWUpO1xuXG4gICAgICAgIHNwaW5uZXIudXBkYXRlQnV0dG9ucygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INC60LvQuNC60LAg0L/QviDQutC90L7Qv9C60LUg0YPQstC10LvQuNGH0LXQvdC40Y8uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZSDQntCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFuZGxlSW5jQ2xpY2soZSkge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRUYXJnZXQgfSA9IGU7XG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCAkYmxvY2sgPSAkdGFyZ2V0LmNsb3Nlc3QoJy5zcGlubmVyJyk7XG4gICAgICAgIGNvbnN0IHNwaW5uZXIgPSBTcGlubmVyLmdldEluc3RhbmNlKCRibG9jayk7XG5cbiAgICAgICAgbGV0IHZhbHVlID0gc3Bpbm5lci52YWx1ZSArIHNwaW5uZXIuc3RlcDtcblxuICAgICAgICBpZiAoc3Bpbm5lci5wcmVjaXNpb24pIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZS50b0ZpeGVkKHNwaW5uZXIucHJlY2lzaW9uKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzcGlubmVyLmNoYW5nZVZhbHVlKHZhbHVlKTtcblxuICAgICAgICBzcGlubmVyLnVwZGF0ZUJ1dHRvbnMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQstCy0L7QtNCwINCyINC/0L7Qu9C1LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGUg0J7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZUlucHV0KGUpIHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VGFyZ2V0IH0gPSBlO1xuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChjdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgJGJsb2NrID0gJHRhcmdldC5jbG9zZXN0KCcuc3Bpbm5lcicpO1xuICAgICAgICBjb25zdCBzcGlubmVyID0gU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spO1xuICAgICAgICBjb25zdCB7ICRpbnB1dCB9ID0gc3Bpbm5lci5lbGVtZW50cztcblxuICAgICAgICBsZXQgdmFsdWUgPSArJGlucHV0LnZhbCgpO1xuXG4gICAgICAgIGlmICghJGlucHV0LnZhbCgpLmxlbmd0aCB8fCB2YWx1ZSA8IHNwaW5uZXIubWluIHx8IHZhbHVlID4gc3Bpbm5lci5tYXgpIHtcbiAgICAgICAgICAgICh7IHZhbHVlIH0gPSBzcGlubmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW5uZXIuY2hhbmdlVmFsdWUodmFsdWUpO1xuXG4gICAgICAgIHNwaW5uZXIudXBkYXRlQnV0dG9ucygpO1xuICAgIH1cblxuICAgIGluaXRDYXJvdXNlbHMoKTtcblxuICAgICQod2luZG93KS5vbigncmVzaXplJywgaW5pdENhcm91c2Vscyk7XG5cbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdGCINCy0YHQtSDQutCw0YDRg9GB0LXQu9C4XG4gICAgZnVuY3Rpb24gaW5pdENhcm91c2VscyAoKSB7XG4gICAgICAgIC8vICDQutCw0YDRg9GB0LXQu9GMINC90LAg0L/QtdGA0LLQvtC8INCx0LDQvdC90LXRgNC1INC90LAg0LPQu9Cw0LLQvdC+0Lkg0YHRgtGA0LDQvdC40YbQtVxuICAgICAgICBjb25zdCAkbmV3c0Nhcm91c2VsID0gJCgnLmpzLW5ld3MtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRuZXdzQ2Fyb3VzZWwubGVuZ3RoICYmICEkbmV3c0Nhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkbmV3c0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY3LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiAxMDIzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQv9C+0LTQsdC+0YDQsCDQsdCw0LnQutC+0LJcbiAgICAgICAgY29uc3QgJGJpa2VzQ2Fyb3VzZWwgPSAkKCcuanMtYmlrZXMtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRiaWtlc0Nhcm91c2VsLmxlbmd0aCAmJiAhJGJpa2VzQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRiaWtlc0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogJ3Vuc2xpY2snLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGJpa2UgYWZ0ZXIgaW5pdFxuICAgICAgICAgICAgJGJpa2VzQ2Fyb3VzZWwuZmluZCgnLnNsaWNrLWFjdGl2ZScpLmZpbmQoJ2lucHV0JykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBiaWtlIGFmdGVyIGNoYW5nZVxuICAgICAgICAgICAgJGJpa2VzQ2Fyb3VzZWwub24oJ2FmdGVyQ2hhbmdlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICRiaWtlc0Nhcm91c2VsLmZpbmQoJy5zbGljay1hY3RpdmUnKS5maW5kKCdpbnB1dCcpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQutCw0YLQtdCz0L7RgNC40LlcbiAgICAgICAgY29uc3QgJGNhdGVnb3JpZXNDYXJvdXNlbCA9ICQoJy5qcy1jYXRlZ29yaWVzLWNhcm91c2VsJyk7XG4gICAgICAgIGlmICgkY2F0ZWdvcmllc0Nhcm91c2VsLmxlbmd0aCAmJiAhJGNhdGVnb3JpZXNDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJGNhdGVnb3JpZXNDYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgY2VudGVyUGFkZGluZzogJzAnLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogJ3Vuc2xpY2snLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC60LDRgNGC0LjQvdC+0Log0YLQvtCy0LDRgNCwXG4gICAgICAgIGNvbnN0ICRwcm9kdWN0Q2Fyb3VzZWwgPSAkKCcuanMtcHJvZHVjdC1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJHByb2R1Y3RDYXJvdXNlbC5sZW5ndGggJiYgISRwcm9kdWN0Q2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRwcm9kdWN0Q2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4tYXJyb3cgYnRuLWFycm93LS1wcmV2IHByb2R1Y3QtcGFnZV9fY2Fyb3VzZWwtcHJldlwiPjxzdmcgY2xhc3M9XCJpY29uIGljb24tLWFycm93LW5leHRcIj48dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1hcnJvd19uZXh0XCI+PC91c2U+PC9zdmc+PC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1hcnJvdyBwcm9kdWN0LXBhZ2VfX2Nhcm91c2VsLW5leHRcIj48c3ZnIGNsYXNzPVwiaWNvbiBpY29uLS1hcnJvdy1uZXh0XCI+PHVzZSB4bGluazpocmVmPVwiI2ljb24tYXJyb3dfbmV4dFwiPjwvdXNlPjwvc3ZnPjwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjgsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC/0L7RhdC+0LbQuNGFINGC0L7QstCw0YDQvtCyXG4gICAgICAgIGNvbnN0ICRzaW1pbGFyQ2Fyb3VzZWwgPSAkKCcuanMtc2ltaWxhci1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJHNpbWlsYXJDYXJvdXNlbC5sZW5ndGggJiYgISRzaW1pbGFyQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRzaW1pbGFyQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICcwJyxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNjM5LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQutCw0YDRgtC40L3QvtC6XG4gICAgICAgIGNvbnN0ICRwaWN0dXJlQ2Fyb3VzZWwgPSAkKCcuanMtcGljdHVyZS1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJHBpY3R1cmVDYXJvdXNlbC5sZW5ndGggJiYgISRwaWN0dXJlQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRwaWN0dXJlQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCAkdXBCdG4gPSAkKCcuanMtYnRuLXVwJyk7XG5cbiAgICBpZiAoJHVwQnRuLmxlbmd0aCkge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWJ0bi11cCcsICgpID0+IHtcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID49IGdsb2JhbE9wdGlvbnMudGFibGV0TGdTaXplKSB7XG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gNTAgPyAkdXBCdG4uc2hvdygpIDogJHVwQnRuLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgJGZpbHRlck1vZGFsID0gJCgnLmpzLWZpbHRlci1tb2RhbCcpO1xuICAgIGlmICgkZmlsdGVyTW9kYWwubGVuZ3RoKSB7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1maWx0ZXItYnRuJywgZSA9PiB7XG4gICAgICAgICAgICAkZmlsdGVyTW9kYWwuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpLmFuaW1hdGVDc3MoJ3NsaWRlSW5SaWdodCcpO1xuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoYXMtb3ZlcmxheScpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWZpbHRlci1jbG9zZScsIGUgPT4ge1xuICAgICAgICAgICAgJGZpbHRlck1vZGFsLmFuaW1hdGVDc3MoJ3NsaWRlT3V0UmlnaHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJGZpbHRlck1vZGFsLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQkNC90LjQvNCw0YbQuNGPINGN0LvQtdC80LXQvdGC0LAgbGFiZWwg0L/RgNC4INGE0L7QutGD0YHQtSDQv9C+0LvQtdC5INGE0L7RgNC80YtcbiAgICAgICAgICovXG4gICAgICAgICQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgY29uc3QgZmllbGQgPSAkKGVsKS5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKTtcblxuICAgICAgICAgICAgaWYgKCQoZmllbGQpLnZhbCgpLnRyaW0oKSAhPSAnJyB8fCAkKGZpZWxkKS5pcygnOnBsYWNlaG9sZGVyLXNob3duJykpIHtcbiAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoZmllbGQpLm9uKCdmb2N1cycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgfSkub24oJ2JsdXInLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLnRyaW0oKSA9PT0gJycgJiYgISQoZmllbGQpLmlzKCc6cGxhY2Vob2xkZXItc2hvd24nKSkge1xuICAgICAgICAgICAgICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qIEBzZWUgaHR0cHM6Ly9hdG9taWtzLmdpdGh1Yi5pby90aXBweWpzLyAqL1xuXG4gICAgY29uc3QgdG9vbHRpcFNldHRpbmdzID0ge1xuICAgICAgICBhcnJvdzogZmFsc2UsXG4gICAgICAgIGFsbG93SFRNTDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGVGaWxsOiBmYWxzZSxcbiAgICAgICAgcGxhY2VtZW50OiAncmlnaHQtY2VudGVyJyxcbiAgICAgICAgZGlzdGFuY2U6IDIwLFxuICAgICAgICB0aGVtZTogJ3Rvb2x0aXAnXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIGluaXQgYWxsIHRvb2x0aXBzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdFRvb2x0aXBzKCkge1xuICAgICAgICAkKCdbZGF0YS10b29sdGlwXScpLmVhY2goKGluZGV4LCBlbGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsb2NhbFNldHRpbmdzID0ge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICQoZWxlbSkuYXR0cignZGF0YS10b29sdGlwJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKGVsZW0pLmRhdGEoJ2NsaWNrJykpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFNldHRpbmdzWyd0cmlnZ2VyJ10gPSAnY2xpY2sga2V5dXAnO1xuICAgICAgICAgICAgICAgIGxvY2FsU2V0dGluZ3NbJ2ludGVyYWN0aXZlJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aXBweShlbGVtLCBPYmplY3QuYXNzaWduKHt9LCB0b29sdGlwU2V0dGluZ3MsIGxvY2FsU2V0dGluZ3MpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFRvb2x0aXBzKCk7XG5cbiAgICAvLyBzaG9wIGFkZHJlc3NcbiAgICAvLyDQnNC+0YHQutC+0LLRgdC60LDRjyDQvtCx0LvQsNGC0YwsINCh0L7Qu9C90LXRh9C90L7Qs9C+0YDRgdC60LjQuSDRgNCw0LnQvtC9LCDQtC4g0JTRg9GA0YvQutC40L3QviwgMdCULlxuICAgIGNvbnN0IHNob3AgPSB7bGF0OiA1Ni4wNTk2OTUsIGxuZzogMzcuMTQ0MTQyfTtcblxuICAgIC8vIGZvciBibGFjayBtYXBcbiAgICBjb25zdCBtYXBTdHlsZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzIxMjEyMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMuaWNvblwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzc1NzU3NVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5zdHJva2VcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMyMTIxMjFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzc1NzU3NVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZS5jb3VudHJ5XCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzllOWU5ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZS5sYW5kX3BhcmNlbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmUubG9jYWxpdHlcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjYmRiZGJkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM3NTc1NzVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLnBhcmtcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzE4MTgxOFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kucGFya1wiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM2MTYxNjFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLnBhcmtcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5zdHJva2VcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMxYjFiMWJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZFwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMyYzJjMmNcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZFwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM4YThhOGFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5hcnRlcmlhbFwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjMzczNzM3XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjM2MzYzNjXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheS5jb250cm9sbGVkX2FjY2Vzc1wiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNGU0ZTRlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQubG9jYWxcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNjE2MTYxXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInRyYW5zaXRcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNzU3NTc1XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMwMDAwMDBcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjM2QzZDNkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF1cblxuICAgIC8vIEluaXRpYWxpemUgYW5kIGFkZCB0aGUgbWFwXG4gICAgZnVuY3Rpb24gaW5pdE1hcCgpIHtcbiAgICAgICAgLy8gVGhlIG1hcCwgY2VudGVyZWQgYXQgU2hvcFxuICAgICAgICBjb25zdCBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgICAgICAgICAgem9vbTogMTQsXG4gICAgICAgICAgICAgICAgY2VudGVyOiBzaG9wLFxuICAgICAgICAgICAgICAgIHN0eWxlczogbWFwU3R5bGVzLFxuICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzY2FsZUNvbnRyb2w6IHRydWUsXG4gICAgICAgICAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJvdGF0ZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZ1bGxzY3JlZW5Db250cm9sOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBwb2ludEljb24gPSB7XG4gICAgICAgICAgICB1cmw6ICdpbWcvc3ZnL3BvaW50LnN2ZycsXG4gICAgICAgICAgICAvLyBUaGlzIG1hcmtlciBpcyA3MiBwaXhlbHMgd2lkZSBieSA3MiBwaXhlbHMgaGlnaC5cbiAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDcyLCA3MiksXG4gICAgICAgICAgICAvLyBUaGUgb3JpZ2luIGZvciB0aGlzIGltYWdlIGlzICgwLCAwKS5cbiAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgLy8gVGhlIGFuY2hvciBmb3IgdGhpcyBpbWFnZSBpcyB0aGUgY2VudGVyIGF0ICgwLCAzMikuXG4gICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgzNiwgMzYpXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVGhlIG1hcmtlciwgcG9zaXRpb25lZCBhdCBzaG9wXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgcG9zaXRpb246IHNob3AsXG4gICAgICAgICAgICBpY29uOiBwb2ludEljb24sXG4gICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgd2luZG93LmluaXRNYXAgPSBpbml0TWFwO1xuXG47XG59KTtcbiJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==

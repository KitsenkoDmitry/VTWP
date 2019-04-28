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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wTGdTaXplIiwiZGVza3RvcE1kU2l6ZSIsImRlc2t0b3BTaXplIiwiZGVza3RvcFNtU2l6ZSIsInRhYmxldExnU2l6ZSIsInRhYmxldFNpemUiLCJtb2JpbGVMZ1NpemUiLCJtb2JpbGVTaXplIiwibGFuZyIsImF0dHIiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnREZXNrdG9wTGciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYnJlYWtwb2ludERlc2t0b3BNZCIsImJyZWFrcG9pbnREZXNrdG9wIiwiYnJlYWtwb2ludERlc2t0b3BTbSIsImJyZWFrcG9pbnRUYWJsZXRMZyIsImJyZWFrcG9pbnRUYWJsZXQiLCJicmVha3BvaW50TW9iaWxlTGdTaXplIiwiYnJlYWtwb2ludE1vYmlsZSIsImV4dGVuZCIsIm9uIiwibGVuZ3RoIiwiYXV0b3NpemUiLCJmbiIsImFuaW1hdGVDc3MiLCJhbmltYXRpb25OYW1lIiwiY2FsbGJhY2siLCJhbmltYXRpb25FbmQiLCJlbCIsImFuaW1hdGlvbnMiLCJhbmltYXRpb24iLCJPQW5pbWF0aW9uIiwiTW96QW5pbWF0aW9uIiwiV2Via2l0QW5pbWF0aW9uIiwidCIsInN0eWxlIiwidW5kZWZpbmVkIiwiY3JlYXRlRWxlbWVudCIsImFkZENsYXNzIiwib25lIiwicmVtb3ZlQ2xhc3MiLCJpc051bWVyaWMiLCJuIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJyZW1vdmVOb3REaWdpdHMiLCJwYXJhbSIsInRvU3RyaW5nIiwicmVwbGFjZSIsImRpdmlkZUJ5RGlnaXRzIiwibG9jYWxlIiwiUGFyc2xleSIsInNldExvY2FsZSIsIm9wdGlvbnMiLCJ0cmlnZ2VyIiwidmFsaWRhdGlvblRocmVzaG9sZCIsImVycm9yc1dyYXBwZXIiLCJlcnJvclRlbXBsYXRlIiwiY2xhc3NIYW5kbGVyIiwiaW5zdGFuY2UiLCIkZWxlbWVudCIsInR5cGUiLCIkaGFuZGxlciIsImhhc0NsYXNzIiwibmV4dCIsImVycm9yc0NvbnRhaW5lciIsIiRjb250YWluZXIiLCJjbG9zZXN0IiwicGFyZW50IiwiYWRkVmFsaWRhdG9yIiwidmFsaWRhdGVTdHJpbmciLCJ2YWx1ZSIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJkYXRhIiwibWF4IiwibWluRGF0ZSIsIm1heERhdGUiLCJ2YWx1ZURhdGUiLCJyZXN1bHQiLCJtYXRjaCIsIkRhdGUiLCJtYXhTaXplIiwicGFyc2xleUluc3RhbmNlIiwiZmlsZXMiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsImkiLCIkYmxvY2siLCIkbGFzdCIsImFmdGVyIiwiZWxlbWVudCIsInBhcnNsZXkiLCJlIiwiJHNlbGYiLCJjdXJyZW50VGFyZ2V0IiwiJGNvbGxhcHNlQm9keSIsImZpbmQiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwiaW5wdXRtYXNrIiwiY2xlYXJNYXNrT25Mb3N0Rm9jdXMiLCJzaG93TWFza09uSG92ZXIiLCJDdXN0b21TZWxlY3QiLCIkZWxlbSIsInNlbGYiLCJpbml0IiwiJGluaXRFbGVtIiwiZWFjaCIsInNlbGVjdFNlYXJjaCIsIm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIiwiSW5maW5pdHkiLCJzZWxlY3QyIiwic2VsZWN0T25CbHVyIiwiZHJvcGRvd25Dc3NDbGFzcyIsImxhbmd1YWdlIiwibm9SZXN1bHRzIiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbVNlbGVjdCIsImRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyIsImRhdGVGb3JtYXQiLCJzaG93T3RoZXJNb250aHMiLCJEYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsInNob3dNWSIsImN1cnJlbnREYXRlIiwiY3VycmVudERheSIsImdldERhdGUiLCJuZXdEYXRlIiwiZ2V0TW9udGgiLCJnZXRGdWxsWWVhciIsIml0ZW1PcHRpb25zIiwib25TZWxlY3QiLCJjaGFuZ2UiLCJzZXRUaW1lb3V0IiwiJG1vYmlsZU1lbnUiLCIkY2FydE1vZGFsIiwib3Blbk1vZGFsIiwiaGlkZU1vZGFsIiwicHJldmVudERlZmF1bHQiLCIkbW9kYWxCbG9jayIsImxvY2tEb2N1bWVudCIsInVubG9ja0RvY3VtZW50IiwiJGhlYWRlciIsImNhdGVnb3J5IiwiJGNhdGVnb3J5RHJvcGRvd24iLCJjbG9zZURyb3Bkb3duSGFuZGxlciIsInRhcmdldCIsIm9mZiIsIiR0YWJzIiwiJHRhYnNMaW5rcyIsIiR0YWJzSXRlbXMiLCIkaGlkZGVuRm9ybUZpZWxkcyIsInByb3AiLCJ2YWwiLCIkc2VsZkl0ZW0iLCJTcGlubmVyIiwic3RlcCIsInByZWNpc2lvbiIsImVsZW1lbnRzIiwiJGRlYyIsIiRpbmMiLCIkaW5wdXQiLCJ1cGRhdGVCdXR0b25zIiwiaW5zdGFuY2VzIiwic3Bpbm5lciIsImlzIiwiJHNwaW5uZXJzIiwiaW5kZXgiLCJibG9jayIsImdldEluc3RhbmNlIiwiZGlzYWJsZVNwaW5uZXIiLCJwdXNoIiwic3Bpbm5lckluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwiaGFuZGxlRGVjQ2xpY2siLCJoYW5kbGVJbmNDbGljayIsImhhbmRsZUlucHV0Iiwic3Bpbm5lcnMiLCJjcmVhdGUiLCIkdGFyZ2V0IiwidG9GaXhlZCIsImNoYW5nZVZhbHVlIiwiaW5pdENhcm91c2VscyIsIiRuZXdzQ2Fyb3VzZWwiLCJzbGljayIsImFycm93cyIsImluZmluaXRlIiwic2xpZGVzVG9TaG93IiwiY2VudGVyTW9kZSIsInZhcmlhYmxlV2lkdGgiLCJtb2JpbGVGaXJzdCIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCIkYmlrZXNDYXJvdXNlbCIsIiRjYXRlZ29yaWVzQ2Fyb3VzZWwiLCJjZW50ZXJQYWRkaW5nIiwiZG90cyIsIiRpbmRleE1haW5DYXJvdXNlbCIsIiRwcm9kdWN0Q2Fyb3VzZWwiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCIkc2ltaWxhckNhcm91c2VsIiwiJHBpY3R1cmVDYXJvdXNlbCIsInNsaWRlc1RvU2Nyb2xsIiwiJHVwQnRuIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIndpZHRoIiwic2hvdyIsImhpZGUiLCIkZmlsdGVyTW9kYWwiLCJmaWVsZCIsInRyaW0iLCJldmVudCIsInRvb2x0aXBTZXR0aW5ncyIsImFycm93IiwiYWxsb3dIVE1MIiwiYW5pbWF0ZUZpbGwiLCJwbGFjZW1lbnQiLCJkaXN0YW5jZSIsInRoZW1lIiwiaW5pdFRvb2x0aXBzIiwiZWxlbSIsImxvY2FsU2V0dGluZ3MiLCJjb250ZW50IiwidGlwcHkiLCJPYmplY3QiLCJhc3NpZ24iLCJzaG9wIiwibGF0IiwibG5nIiwibWFwU3R5bGVzIiwiaW5pdE1hcCIsIm1hcCIsImdvb2dsZSIsIm1hcHMiLCJNYXAiLCJnZXRFbGVtZW50QnlJZCIsInpvb20iLCJjZW50ZXIiLCJzdHlsZXMiLCJ6b29tQ29udHJvbCIsIm1hcFR5cGVDb250cm9sIiwic2NhbGVDb250cm9sIiwic3RyZWV0Vmlld0NvbnRyb2wiLCJyb3RhdGVDb250cm9sIiwiZnVsbHNjcmVlbkNvbnRyb2wiLCJwb2ludEljb24iLCJ1cmwiLCJTaXplIiwib3JpZ2luIiwiUG9pbnQiLCJhbmNob3IiLCJtYXJrZXIiLCJNYXJrZXIiLCJwb3NpdGlvbiIsImljb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWUMsS0FBWixDQUFrQixZQUFXO0FBQ3pCOzs7QUFHQSxNQUFJQyxhQUFhLEdBQUc7QUFDaEI7QUFDQUMsSUFBQUEsSUFBSSxFQUFHLEdBRlM7QUFJaEI7QUFDQUMsSUFBQUEsYUFBYSxFQUFHLElBTEE7QUFNaEJDLElBQUFBLGFBQWEsRUFBRyxJQU5BO0FBT2hCQyxJQUFBQSxXQUFXLEVB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QUFFbEM0QixNQUFBQSxJQUFJLEVBQUVULFNBRjRCO0FBR2xDZCxNQUFBQSxHQUFHLEVBQUVBO0FBSDZCLEtBQXZCLENBQWY7QUFLSDs7QUFFRGpQLEVBQUFBLE1BQU0sQ0FBQ2dQLE9BQVAsR0FBaUJBLE9BQWpCO0FBRUo7QUFDQyxDQWgwQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiDQk9C70L7QsdCw0LvRjNC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtSwg0LrQvtGC0L7RgNGL0LUg0LjRgdC/0L7Qu9GM0LfRg9GO0YLRgdGPINC80L3QvtCz0L7QutGA0LDRgtC90L5cbiAgICAgKi9cbiAgICBsZXQgZ2xvYmFsT3B0aW9ucyA9IHtcbiAgICAgICAgLy8g0JLRgNC10LzRjyDQtNC70Y8g0LDQvdC40LzQsNGG0LjQuVxuICAgICAgICB0aW1lOiAgMjAwLFxuXG4gICAgICAgIC8vINCa0L7QvdGC0YDQvtC70YzQvdGL0LUg0YLQvtGH0LrQuCDQsNC00LDQv9GC0LjQstCwXG4gICAgICAgIGRlc2t0b3BMZ1NpemU6ICAxOTEwLFxuICAgICAgICBkZXNrdG9wTWRTaXplOiAgMTYwMCxcbiAgICAgICAgZGVza3RvcFNpemU6ICAgIDE0ODAsXG4gICAgICAgIGRlc2t0b3BTbVNpemU6ICAxMjgwLFxuICAgICAgICB0YWJsZXRMZ1NpemU6ICAgMTAyNCxcbiAgICAgICAgdGFibGV0U2l6ZTogICAgIDc2OCxcbiAgICAgICAgbW9iaWxlTGdTaXplOiAgIDY0MCxcbiAgICAgICAgbW9iaWxlU2l6ZTogICAgIDQ4MCxcblxuICAgICAgICBsYW5nOiAkKCdodG1sJykuYXR0cignbGFuZycpXG4gICAgfTtcblxuICAgIC8vINCR0YDQtdC50LrQv9C+0LjQvdGC0Ysg0LDQtNCw0L/RgtC40LLQsFxuICAgIC8vIEBleGFtcGxlIGlmIChnbG9iYWxPcHRpb25zLmJyZWFrcG9pbnRUYWJsZXQubWF0Y2hlcykge30gZWxzZSB7fVxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0ge1xuICAgICAgICBicmVha3BvaW50RGVza3RvcExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcE1kOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BNZFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wU206IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFNtU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXRMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50VGFibGV0OiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50TW9iaWxlTGdTaXplOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLm1vYmlsZUxnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlU2l6ZSAtIDF9cHgpYClcbiAgICB9O1xuXG4gICAgJC5leHRlbmQodHJ1ZSwgZ2xvYmFsT3B0aW9ucywgYnJlYWtwb2ludHMpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICBpZiAoJCgndGV4dGFyZWEnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhdXRvc2l6ZSgkKCd0ZXh0YXJlYScpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog0J/QvtC00LrQu9GO0YfQtdC90LjQtSBqcyBwYXJ0aWFsc1xuICAgICAqL1xuICAgIC8qKlxuICog0KDQsNGB0YjQuNGA0LXQvdC40LUgYW5pbWF0ZS5jc3NcbiAqIEBwYXJhbSAge1N0cmluZ30gYW5pbWF0aW9uTmFtZSDQvdCw0LfQstCw0L3QuNC1INCw0L3QuNC80LDRhtC40LhcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayDRhNGD0L3QutGG0LjRjywg0LrQvtGC0L7RgNCw0Y8g0L7RgtGA0LDQsdC+0YLQsNC10YIg0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XG4gKiBAcmV0dXJuIHtPYmplY3R9INC+0LHRitC10LrRgiDQsNC90LjQvNCw0YbQuNC4XG4gKiBcbiAqIEBzZWUgIGh0dHBzOi8vZGFuZWRlbi5naXRodWIuaW8vYW5pbWF0ZS5jc3MvXG4gKiBcbiAqIEBleGFtcGxlXG4gKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnKTtcbiAqIFxuICogJCgnI3lvdXJFbGVtZW50JykuYW5pbWF0ZUNzcygnYm91bmNlJywgZnVuY3Rpb24oKSB7XG4gKiAgICAgLy8g0JTQtdC70LDQtdC8INGH0YLQvi3RgtC+INC/0L7RgdC70LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxuICogfSk7XG4gKi9cbiQuZm4uZXh0ZW5kKHtcbiAgICBhbmltYXRlQ3NzOiBmdW5jdGlvbihhbmltYXRpb25OYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYW5pbWF0aW9uRW5kID0gKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdhbmltYXRpb25lbmQnLFxuICAgICAgICAgICAgICAgIE9BbmltYXRpb246ICdvQW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICBNb3pBbmltYXRpb246ICdtb3pBbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgICAgIFdlYmtpdEFuaW1hdGlvbjogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmb3IgKGxldCB0IGluIGFuaW1hdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uc1t0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcblxuICAgICAgICB0aGlzLmFkZENsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSkub25lKGFuaW1hdGlvbkVuZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0pO1xuICAgIC8vINCd0LXQsdC+0LvRjNGI0LjQtSDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0LUg0YTRg9C90LrRhtC40LhcblxuICAgIC8qKlxuICAgICAqINCf0YDQvtCy0LXRgNGP0LXRgiDRh9C40YHQu9C+INC40LvQuCDQvdC10YJcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gbiDQm9GO0LHQvtC5INCw0YDQs9GD0LzQtdC90YJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWVyaWMobikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvRj9C10YIg0LLRgdC1INC90LXRh9C40YHQu9C+0LLRi9C1INGB0LjQvNCy0L7Qu9GLINC4INC/0YDQuNCy0L7QtNC40YIg0Log0YfQuNGB0LvRg1xuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJ8bnVtYmVyfSBwYXJhbVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm90RGlnaXRzKHBhcmFtKSB7XG4gICAgICAgIC8qINGD0LTQsNC70Y/QtdC8INCy0YHQtSDRgdC40LzQstC+0LvRiyDQutGA0L7QvNC1INGG0LjRhNGAINC4INC/0LXRgNC10LLQvtC00LjQvCDQsiDRh9C40YHQu9C+ICovXG4gICAgICAgIHJldHVybiArcGFyYW0udG9TdHJpbmcoKS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCg0LDQt9C00LXQu9GP0LXRgiDQvdCwINGA0LDQt9GA0Y/QtNGLXG4gICAgICog0J3QsNC/0YDQuNC80LXRgCwgMzgwMDAwMCAtPiAzIDgwMCAwMDBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyfG51bWJlcn0gcGFyYW1cbiAgICAgKiBAcmV0dXJucyB7c3RyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpdmlkZUJ5RGlnaXRzKHBhcmFtKSB7XG4gICAgICAgIGlmIChwYXJhbSA9PT0gbnVsbCkgcGFyYW0gPSAwO1xuICAgICAgICByZXR1cm4gcGFyYW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9XG5cbiAgICB2YXIgbG9jYWxlID0gZ2xvYmFsT3B0aW9ucy5sYW5nID09ICdydS1SVScgPyAncnUnIDogJ2VuJztcblxuICAgIFBhcnNsZXkuc2V0TG9jYWxlKGxvY2FsZSk7XG5cbiAgICAvKiDQndCw0YHRgtGA0L7QudC60LggUGFyc2xleSAqL1xuICAgICQuZXh0ZW5kKFBhcnNsZXkub3B0aW9ucywge1xuICAgICAgICB0cmlnZ2VyOiAnYmx1ciBjaGFuZ2UnLCAvLyBjaGFuZ2Ug0L3Rg9C20LXQvSDQtNC70Y8gc2VsZWN0J9CwXG4gICAgICAgIHZhbGlkYXRpb25UaHJlc2hvbGQ6ICcwJyxcbiAgICAgICAgZXJyb3JzV3JhcHBlcjogJzxkaXY+PC9kaXY+JyxcbiAgICAgICAgZXJyb3JUZW1wbGF0ZTogJzxwIGNsYXNzPVwicGFyc2xleS1lcnJvci1tZXNzYWdlXCI+PC9wPicsXG4gICAgICAgIGNsYXNzSGFuZGxlcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICAgICAkaGFuZGxlcjtcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkZWxlbWVudDsgLy8g0YLQviDQtdGB0YLRjCDQvdC40YfQtdCz0L4g0L3QtSDQstGL0LTQtdC70Y/QtdC8IChpbnB1dCDRgdC60YDRi9GCKSwg0LjQvdCw0YfQtSDQstGL0LTQtdC70Y/QtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDQsdC70L7QulxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJCgnLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUnLCAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICRoYW5kbGVyO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcnNDb250YWluZXI6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xuICAgICAgICAgICAgbGV0IHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lcjtcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJChgW25hbWU9XCIkeyRlbGVtZW50LmF0dHIoJ25hbWUnKX1cIl06bGFzdCArIGxhYmVsYCkubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmN1c3RvbS1maWxlJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmZpZWxkJyk7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJGNvbnRhaW5lcilcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgcmV0dXJuICRjb250YWluZXI7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCa0LDRgdGC0L7QvNC90YvQtSDQstCw0LvQuNC00LDRgtC+0YDRi1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lUnUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWVFbicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosIFwiIFwiLCBcIi1cIidcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiyDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlclJ1Jywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlswLTnQsC3Rj9GRXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCAwLTknXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLLCDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXInLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXowLTldKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05J1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC10LvQtdGE0L7QvdC90YvQuSDQvdC+0LzQtdGAXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ3Bob25lJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlstKzAtOSgpIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0YLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgCcsXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBwaG9uZSBudW1iZXInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bWJlcicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bMC05XSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIDAtOSdcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0J/QvtGH0YLQsCDQsdC10Lcg0LrQuNGA0LjQu9C70LjRhtGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2VtYWlsJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXihbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0oXFwufF98LSl7MCwxfSkrW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dXFxAKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSkrKChcXC4pezAsMX1bQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pezEsfVxcLlthLXrQsC3RjzAtOVxcLV17Mix9JC8udGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9C+0YfRgtC+0LLRi9C5INCw0LTRgNC10YEnLFxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZW1haWwgYWRkcmVzcydcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KTQvtGA0LzQsNGCINC00LDRgtGLIERELk1NLllZWVlcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZGF0ZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgcmVnVGVzdCA9IC9eKD86KD86MzEoXFwuKSg/OjA/WzEzNTc4XXwxWzAyXSkpXFwxfCg/Oig/OjI5fDMwKShcXC4pKD86MD9bMSwzLTldfDFbMC0yXSlcXDIpKSg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezJ9KSR8Xig/OjI5KFxcLikwPzJcXDMoPzooPzooPzoxWzYtOV18WzItOV1cXGQpPyg/OjBbNDhdfFsyNDY4XVswNDhdfFsxMzU3OV1bMjZdKXwoPzooPzoxNnxbMjQ2OF1bMDQ4XXxbMzU3OV1bMjZdKTAwKSkpKSR8Xig/OjA/WzEtOV18MVxcZHwyWzAtOF0pKFxcLikoPzooPzowP1sxLTldKXwoPzoxWzAtMl0pKVxcNCg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezR9KSQvLFxuICAgICAgICAgICAgICAgIHJlZ01hdGNoID0gLyhcXGR7MSwyfSlcXC4oXFxkezEsMn0pXFwuKFxcZHs0fSkvLFxuICAgICAgICAgICAgICAgIG1pbiA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWluJyksXG4gICAgICAgICAgICAgICAgbWF4ID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNYXgnKSxcbiAgICAgICAgICAgICAgICBtaW5EYXRlLCBtYXhEYXRlLCB2YWx1ZURhdGUsIHJlc3VsdDtcblxuICAgICAgICAgICAgaWYgKG1pbiAmJiAocmVzdWx0ID0gbWluLm1hdGNoKHJlZ01hdGNoKSkpIHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF4ICYmIChyZXN1bHQgPSBtYXgubWF0Y2gocmVnTWF0Y2gpKSkge1xuICAgICAgICAgICAgICAgIG1heERhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQgPSB2YWx1ZS5tYXRjaChyZWdNYXRjaCkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZURhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlZ1Rlc3QudGVzdCh2YWx1ZSkgJiYgKG1pbkRhdGUgPyB2YWx1ZURhdGUgPj0gbWluRGF0ZSA6IHRydWUpICYmIChtYXhEYXRlID8gdmFsdWVEYXRlIDw9IG1heERhdGUgOiB0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3QsNGPINC00LDRgtCwJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGRhdGUnXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLy8g0KTQsNC50Lsg0L7Qs9GA0LDQvdC40YfQtdC90L3QvtCz0L4g0YDQsNC30LzQtdGA0LBcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZU1heFNpemUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgbWF4U2l6ZSwgcGFyc2xleUluc3RhbmNlKSB7XG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBwYXJzbGV5SW5zdGFuY2UuJGVsZW1lbnRbMF0uZmlsZXM7XG4gICAgICAgICAgICByZXR1cm4gZmlsZXMubGVuZ3RoICE9IDEgIHx8IGZpbGVzWzBdLnNpemUgPD0gbWF4U2l6ZSAqIDEwMjQ7XG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVtZW50VHlwZTogJ2ludGVnZXInLFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQpNCw0LnQuyDQtNC+0LvQttC10L0g0LLQtdGB0LjRgtGMINC90LUg0LHQvtC70LXQtSwg0YfQtdC8ICVzIEtiJyxcbiAgICAgICAgICAgIGVuOiAnRmlsZSBzaXplIGNhblxcJ3QgYmUgbW9yZSB0aGVuICVzIEtiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQntCz0YDQsNC90LjRh9C10L3QuNGPINGA0LDRgdGI0LjRgNC10L3QuNC5INGE0LDQudC70L7QslxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlRXh0ZW5zaW9uJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIGZvcm1hdHMpIHtcbiAgICAgICAgICAgIGxldCBmaWxlRXh0ZW5zaW9uID0gdmFsdWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgICAgIGxldCBmb3JtYXRzQXJyID0gZm9ybWF0cy5zcGxpdCgnLCAnKTtcbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcm1hdHNBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZUV4dGVuc2lvbiA9PT0gZm9ybWF0c0FycltpXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQlNC+0L/Rg9GB0YLQuNC80Ysg0YLQvtC70YzQutC+INGE0LDQudC70Ysg0YTQvtGA0LzQsNGC0LAgJXMnLFxuICAgICAgICAgICAgZW46ICdBdmFpbGFibGUgZXh0ZW5zaW9ucyBhcmUgJXMnXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCh0L7Qt9C00LDRkdGCINC60L7QvdGC0LXQudC90LXRgNGLINC00LvRjyDQvtGI0LjQsdC+0Log0YMg0L3QtdGC0LjQv9C40YfQvdGL0YUg0Y3Qu9C10LzQtdC90YLQvtCyXG4gICAgUGFyc2xleS5vbignZmllbGQ6aW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgJGVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICAgICAgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICRibG9jayA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdlcnJvcnMtcGxhY2VtZW50JyksXG4gICAgICAgICAgICAkbGFzdDtcblxuICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCY0L3QuNGG0LjQuNGA0YPQtdGCINCy0LDQu9C40LTQsNGG0LjRjiDQvdCwINCy0YLQvtGA0L7QvCDQutCw0LvQtdC00LDRgNC90L7QvCDQv9C+0LvQtSDQtNC40LDQv9Cw0LfQvtC90LBcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDp2YWxpZGF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgJCgnZm9ybVtkYXRhLXZhbGlkYXRlPVwidHJ1ZVwiXScpLnBhcnNsZXkoKTtcblxuICAgIC8vINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDRgtC+0LvRjNC60L4g0L3QsCDRgdGC0YDQsNC90LjRhtC1IGNoZWNrb3V0Lmh0bWxcbiAgICBpZiAoJCgnLmpzLWNvbGxhcHNlLWJ0bicpLmxlbmd0aCkge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNvbGxhcHNlLWJ0bicsIChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICAgIGNvbnN0ICRjb2xsYXBzZUJvZHkgPSAkc2VsZi5jbG9zZXN0KCcuanMtY29sbGFwc2UnKS5maW5kKCcuanMtY29sbGFwc2UtYm9keScpO1xuICAgICAgICAgICAgaWYgKCRzZWxmLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgICRzZWxmLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkY29sbGFwc2VCb2R5LnNsaWRlVXAoJ2Zhc3QnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRjb2xsYXBzZUJvZHkuc2xpZGVEb3duKCdmYXN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCU0L7QsdCw0LLQu9GP0LXRgiDQvNCw0YHQutC4INCyINC/0L7Qu9GPINGE0L7RgNC8XG4gICAgICogQHNlZSAgaHR0cHM6Ly9naXRodWIuY29tL1JvYmluSGVyYm90cy9JbnB1dG1hc2tcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPGlucHV0IGNsYXNzPVwianMtcGhvbmUtbWFza1wiIHR5cGU9XCJ0ZWxcIiBuYW1lPVwidGVsXCIgaWQ9XCJ0ZWxcIj5cbiAgICAgKi9cbiAgICAkKCcuanMtcGhvbmUtbWFzaycpLmlucHV0bWFzaygnKzcoOTk5KSA5OTktOTktOTknLCB7XG4gICAgICAgIGNsZWFyTWFza09uTG9zdEZvY3VzOiB0cnVlLFxuICAgICAgICBzaG93TWFza09uSG92ZXI6IGZhbHNlXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDQodGC0LjQu9C40LfRg9C10YIg0YHQtdC70LXQutGC0Ysg0YEg0L/QvtC80L7RidGM0Y4g0L/Qu9Cw0LPQuNC90LAgc2VsZWN0MlxuICAgICAqIGh0dHBzOi8vc2VsZWN0Mi5naXRodWIuaW9cbiAgICAgKi9cbiAgICBsZXQgQ3VzdG9tU2VsZWN0ID0gZnVuY3Rpb24oJGVsZW0pIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uKCRpbml0RWxlbSkge1xuICAgICAgICAgICAgJGluaXRFbGVtLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdFNlYXJjaCA9ICQodGhpcykuZGF0YSgnc2VhcmNoJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0U2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IDE7IC8vINC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBJbmZpbml0eTsgLy8g0L3QtSDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogbWluaW11bVJlc3VsdHNGb3JTZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub1Jlc3VsdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICfQodC+0LLQv9Cw0LTQtdC90LjQuSDQvdC1INC90LDQudC00LXQvdC+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQvdGD0LbQvdC+INC00LvRjyDQstGL0LvQuNC00LDRhtC40Lgg0L3QsCDQu9C10YLRg1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKGBvcHRpb25bdmFsdWU9XCIkeyQodGhpcykudmFsdWV9XCJdYCkuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnVwZGF0ZSA9IGZ1bmN0aW9uKCR1cGRhdGVFbGVtKSB7XG4gICAgICAgICAgICAkdXBkYXRlRWxlbS5zZWxlY3QyKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBzZWxmLmluaXQoJHVwZGF0ZUVsZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuaW5pdCgkZWxlbSk7XG4gICAgfTtcblxuICAgIHZhciBjdXN0b21TZWxlY3QgPSBuZXcgQ3VzdG9tU2VsZWN0KCQoJ3NlbGVjdCcpKTtcblxuICAgIGNvbnN0IGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgZGF0ZUZvcm1hdDogJ2RkLm1tLnl5JyxcbiAgICAgICAgc2hvd090aGVyTW9udGhzOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqINCU0LXQu9Cw0LXRgiDQstGL0L/QsNC00Y7RidC40LUg0LrQsNC70LXQvdC00LDRgNC40LrQuFxuICAgICAqIEBzZWUgIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL2RhdGVwaWNrZXIvXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vINCyIGRhdGEtZGF0ZS1taW4g0LggZGF0YS1kYXRlLW1heCDQvNC+0LbQvdC+INC30LDQtNCw0YLRjCDQtNCw0YLRgyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5XG4gICAgICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRhdGVJbnB1dFwiIGlkPVwiXCIgY2xhc3M9XCJqcy1kYXRlcGlja2VyXCIgZGF0YS1kYXRlLW1pbj1cIjA2LjExLjIwMTVcIiBkYXRhLWRhdGUtbWF4PVwiMTAuMTIuMjAxNVwiPlxuICAgICAqL1xuICAgIGxldCBEYXRlcGlja2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGVwaWNrZXIgPSAkKCcuanMtZGF0ZXBpY2tlcicpO1xuXG4gICAgICAgIGRhdGVwaWNrZXIuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgbWluRGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1taW4nKTtcbiAgICAgICAgICAgIGxldCBtYXhEYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1heCcpO1xuICAgICAgICAgICAgY29uc3Qgc2hvd01ZID0gJCh0aGlzKS5kYXRhKCdzaG93LW0teScpO1xuXG4gICAgICAgICAgICAvKiDQtdGB0LvQuCDQsiDQsNGC0YDQuNCx0YPRgtC1INGD0LrQsNC30LDQvdC+IGN1cnJlbnQsINGC0L4g0LLRi9Cy0L7QtNC40Lwg0YLQtdC60YPRidGD0Y4g0LTQsNGC0YMgKi9cbiAgICAgICAgICAgIGlmICggbWF4RGF0ZSA9PT0gJ2N1cnJlbnQnIHx8IG1pbkRhdGUgPT09ICdjdXJyZW50Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudERheSA9IGN1cnJlbnREYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF5IDwgMTAgPyBjdXJyZW50RGF5ID0gJzAnICsgY3VycmVudERheS50b1N0cmluZygpIDogY3VycmVudERheTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdEYXRlID0gY3VycmVudERheSArICcuJyArIChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSkgKyAnLicgKyBjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgICAgIG1heERhdGUgPT09ICdjdXJyZW50JyA/IG1heERhdGUgPSBuZXdEYXRlIDogbWluRGF0ZSA9IG5ld0RhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpdGVtT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlOiBtaW5EYXRlIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbWF4RGF0ZSB8fCBudWxsLFxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuZmllbGQnKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoc2hvd01ZKSB7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ2NoYW5nZVllYXInXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ3llYXJSYW5nZSddID0gJ2MtMTAwOmMnO1xuICAgICAgICAgICAgICAgIGl0ZW1PcHRpb25zWydjaGFuZ2VNb250aCddID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgaXRlbU9wdGlvbnMsIGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyk7XG5cbiAgICAgICAgICAgICQodGhpcykuZGF0ZXBpY2tlcihpdGVtT3B0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICAvLyDQtNC10LvQsNC10Lwg0LrRgNCw0YHQuNCy0YvQvCDRgdC10LvQtdC6INC80LXRgdGP0YbQsCDQuCDQs9C+0LTQsFxuICAgICAgICAgJChkb2N1bWVudCkub24oJ2ZvY3VzJywgJy5qcy1kYXRlcGlja2VyJywgKCkgPT4ge1xuICAgICAgICAgICAgLy8g0LjRgdC/0L7Qu9GM0LfRg9C10Lwg0LfQsNC00LXRgNC20LrRgywg0YfRgtC+0LHRiyDQtNC10LnRgtC/0LjQutC10YAg0YPRgdC/0LXQuyDQuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0YLRjNGB0Y9cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCQoJy51aS1kYXRlcGlja2VyJykuZmluZCgnc2VsZWN0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy51aS1kYXRlcGlja2VyJykuZmluZCgnc2VsZWN0Jykuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGxldCBkYXRlcGlja2VyID0gbmV3IERhdGVwaWNrZXIoKTtcblxuICAgIGNvbnN0ICRtb2JpbGVNZW51ID0gJCgnLmpzLW1vYmlsZS1tZW51Jyk7XG4gICAgY29uc3QgJGNhcnRNb2RhbCA9ICQoJy5qcy1jYXJ0LW1vZGFsJyk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLW1lbnUtYnRuJywgKCkgPT4ge1xuICAgICAgICBvcGVuTW9kYWwoJG1vYmlsZU1lbnUpO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1tZW51LWNsb3NlJywgKCkgPT4ge1xuICAgICAgICBoaWRlTW9kYWwoJG1vYmlsZU1lbnUpXG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNhcnQtYnRuJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBvcGVuTW9kYWwoJGNhcnRNb2RhbCk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNhcnQtY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgIGhpZGVNb2RhbCgkY2FydE1vZGFsKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIE9wZW4gbW9kYWwgYmxvY2tcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJG1vZGFsQmxvY2sgTW9kYWwgYmxvY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvcGVuTW9kYWwoJG1vZGFsQmxvY2spIHtcbiAgICAgICAgJG1vZGFsQmxvY2suYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpLmFuaW1hdGVDc3MoJ3NsaWRlSW5SaWdodCcpO1xuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgIGxvY2tEb2N1bWVudCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhpZGUgbW9kYWwgYmxvY2tcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJG1vZGFsQmxvY2sgTW9kYWwgYmxvY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoaWRlTW9kYWwoJG1vZGFsQmxvY2spIHtcbiAgICAgICAgJG1vZGFsQmxvY2suYW5pbWF0ZUNzcygnc2xpZGVPdXRSaWdodCcsICgpID0+IHtcbiAgICAgICAgICAgICRtb2RhbEJsb2NrLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgICAgIHVubG9ja0RvY3VtZW50KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVubG9jayBkb2N1bWVudCBmb3Igc2Nyb2xsXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5sb2NrRG9jdW1lbnQoKSB7XG4gICAgICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnaXMtbG9ja2VkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9jayBkb2N1bWVudCBmb3Igc2Nyb2xsXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRsb2NrQmxvY2sgQmxvY2sgd2hpY2ggZGVmaW5lIGRvY3VtZW50IGhlaWdodFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvY2tEb2N1bWVudCgpIHtcbiAgICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpcy1sb2NrZWQnKTtcbiAgICB9XG5cblxuICAgIC8vIC0tLS0tLSDQu9C+0LPQuNC60LAg0L7RgtC60YDRi9GC0LjRjyDQstGL0L/QsNC00LDRiNC10Log0YXQtdC00LXRgNCwIC0tLS0tLVxuICAgIGNvbnN0ICRoZWFkZXIgPSAkKCcuanMtaGVhZGVyJyk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWhlYWRlci1kcm9wZG93bi1idG4nLCBlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCAkc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSAkc2VsZi5hdHRyKCdkYXRhLWNhdGVnb3J5Jyk7XG4gICAgICAgIGNvbnN0ICRjYXRlZ29yeURyb3Bkb3duID0gJChgW2RhdGEtZHJvcGRvd24tY2F0ZWdvcnk9JyR7Y2F0ZWdvcnl9J11gKTtcblxuICAgICAgICBpZiAoJHNlbGYuaGFzQ2xhc3MoJ2lzLWNob3NlbicpKSB7XG4gICAgICAgICAgICAkc2VsZi5yZW1vdmVDbGFzcygnaXMtY2hvc2VuJyk7XG4gICAgICAgICAgICAkY2F0ZWdvcnlEcm9wZG93bi5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24tYnRuJykucmVtb3ZlQ2xhc3MoJ2lzLWNob3NlbicpO1xuICAgICAgICAgICAgJCgnLmpzLWhlYWRlci1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICRoZWFkZXIuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ2lzLWNob3NlbicpO1xuICAgICAgICAgICAgJGNhdGVnb3J5RHJvcGRvd24uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoYXMtb3ZlcmxheScpO1xuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgY2xvc2VEcm9wZG93bkhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIGZ1bmN0aW9uIGNsb3NlRHJvcGRvd25IYW5kbGVyKGUpIHtcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5qcy1oZWFkZXInKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24tYnRuJykucmVtb3ZlQ2xhc3MoJ2lzLWNob3NlbicpO1xuICAgICAgICAgICAgJCgnLmpzLWhlYWRlci1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICRoZWFkZXIucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdoYXMtb3ZlcmxheScpO1xuICAgICAgICAgICAgJChkb2N1bWVudCkub2ZmKCdjbGljaycsIGNsb3NlRHJvcGRvd25IYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vINC90LXQvNC90L7Qs9C+INGB0L/QtdGG0LjRhNC40YfQvdGL0LUg0YLQsNCx0YsuINCY0YHQv9C+0LvRjNC30YPRjtGC0YHRjyDQvdCwINGB0YLRgNCw0L3QuNGG0LUgY2hlY2tvdXQuaHRtbC4g0J/RgNC4INC20LXQu9Cw0L3QuNC4INC80L7QttC90L4g0LTQvtGA0LDQsdC+0YLQsNGC0YxcblxuICAgIGlmICgkKCcuanMtdGFicy1saW5rJykubGVuZ3RoKSB7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtdGFicy1saW5rJywgKGUpID0+IHtcbiAgICAgICAgICAgIC8vIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0ICRzZWxmID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgICAgICAgICBpZiAoJHNlbGYuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0ICR0YWJzID0gJHNlbGYuY2xvc2VzdCgnLmpzLXRhYnMnKTtcbiAgICAgICAgICAgIGNvbnN0ICR0YWJzTGlua3MgPSAkdGFicy5maW5kKCcuanMtdGFicy1saW5rJyk7XG4gICAgICAgICAgICBjb25zdCAkdGFic0l0ZW1zID0gJHRhYnMuZmluZCgnLmpzLXRhYnMtaXRlbScpO1xuXG4gICAgICAgICAgICAvLyDQstGL0LrQu9GO0YfQsNC10Lwg0LLRgdC1INCw0LrRgtC40LLQvdGL0LUg0YLQsNCx0Ysg0Lgg0YHRgdGL0LvQutC4XG4gICAgICAgICAgICAkdGFic0xpbmtzLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICR0YWJzSXRlbXMucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLyDQstGL0LrQu9GO0YfQsNC10Lwg0LLQsNC70LjQtNCw0YbQuNGOINGDINGB0LrRgNGL0YLRi9GFINC/0L7Qu9C10Lkg0Lgg0L7Rh9C40YnQsNC10Lwg0LjRhVxuICAgICAgICAgICAgbGV0ICRoaWRkZW5Gb3JtRmllbGRzID0gJHRhYnNJdGVtcy5maW5kKCdbZGF0YS1yZXF1aXJlZF0nKTtcbiAgICAgICAgICAgIGlmICgkaGlkZGVuRm9ybUZpZWxkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy5wcm9wKCdkYXRhLXJlcXVpcmVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICRoaWRkZW5Gb3JtRmllbGRzLnByb3AoJ3JlcXVpcmVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICRoaWRkZW5Gb3JtRmllbGRzLnZhbCgnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vINCy0LrQu9GO0YfQsNC10Lwg0L3Rg9C20L3Ri9C5INGC0LDQsSDQuCDQtNC10LvQsNC10Lwg0L3Rg9C20L3Rg9GOINGB0YHRi9C70LrRgyDQsNC60YLQuNCy0L3QvtC5XG4gICAgICAgICAgICAkc2VsZi5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICBjb25zdCAkc2VsZkl0ZW0gPSAkKCRzZWxmLmRhdGEoJ3RhYicpKTtcbiAgICAgICAgICAgICRzZWxmSXRlbS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIC8vINCy0LrQu9GO0YfQsNC10Lwg0LLQsNC70LjQtNCw0YbQuNGOINGDINGB0LrRgNGL0YLRi9GFINC/0L7Qu9C10LlcbiAgICAgICAgICAgICRoaWRkZW5Gb3JtRmllbGRzID0gJHNlbGZJdGVtLmZpbmQoJ1tkYXRhLXJlcXVpcmVkXScpO1xuICAgICAgICAgICAgaWYgKCRoaWRkZW5Gb3JtRmllbGRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRoaWRkZW5Gb3JtRmllbGRzLnByb3AoJ2RhdGEtcmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy5wcm9wKCdyZXF1aXJlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqICAg0JDQutGC0LjQstC40YDQvtCy0LDRgtGML9C00LXQt9Cw0LrRgtC40LLQuNGA0L7QstCw0YLRjCDRgdC/0LjQvdC90LXRgFxuICAgICogICBjb25zdCAkYmxvY2sgPSAkKCcuc3Bpbm5lcicpO1xuICAgICogICBjb25zdCBzcGlubmVyID0gU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spO1xuICAgICogICBzcGlubmVyLmVuYWJsZVNwaW5uZXIoKTsvc3Bpbm5lci5kaXNhYmxlU3Bpbm5lcigpO1xuICAgICpcbiAgICAqL1xuXG4gICAgY2xhc3MgU3Bpbm5lciB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9ICBvcHRpb25zICAgICAgICAgICAgICAgICAgINCe0LHRitC10LrRgiDRgSDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4LlxuICAgICAgICAgKiBAcGFyYW0gIHtqUXVlcnl9ICBvcHRpb25zLiRibG9jayAgICAgICAgICAgINCo0LDQsdC70L7QvS5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMudmFsdWUgPSAwXSAgICAgICDQndCw0YfQsNC70YzQvdC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMubWluID0gLUluZmluaXR5XSDQnNC40L3QuNC80LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLm1heCA9IEluZmluaXR5XSAg0JzQsNC60YHQuNC80LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLnN0ZXAgPSAxXSAgICAgICAg0KjQsNCzLlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5wcmVjaXNpb25dICAgICAgINCi0L7Rh9C90L7RgdGC0YwgKNC90YPQttC90LAg0LTQu9GPINC00LXRgdGP0YLQuNGH0L3QvtCz0L4g0YjQsNCz0LApLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoeyAkYmxvY2ssIHZhbHVlID0gMCwgbWluID0gLUluZmluaXR5LCBtYXggPSBJbmZpbml0eSwgc3RlcCA9IDEsIHByZWNpc2lvbiB9ID0ge30pIHtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrID0gJGJsb2NrO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cyA9IHtcbiAgICAgICAgICAgICAgICAkZGVjOiAkKCcuc3Bpbm5lcl9fYnRuLS1kZWMnLCB0aGlzLiRibG9jayksXG4gICAgICAgICAgICAgICAgJGluYzogJCgnLnNwaW5uZXJfX2J0bi0taW5jJywgdGhpcy4kYmxvY2spLFxuICAgICAgICAgICAgICAgICRpbnB1dDogJCgnLnNwaW5uZXJfX2lucHV0JywgdGhpcy4kYmxvY2spLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9ICt2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMubWluID0gK21pbjtcbiAgICAgICAgICAgIHRoaXMubWF4ID0gK21heDtcbiAgICAgICAgICAgIHRoaXMuc3RlcCA9ICtzdGVwO1xuICAgICAgICAgICAgdGhpcy5wcmVjaXNpb24gPSArcHJlY2lzaW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCf0YDQuNCy0L7QtNC40YIg0YDQsNC30LzQtdGC0LrRgyDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40LUg0L/QsNGA0LDQvNC10YLRgNCw0LwuXG4gICAgICAgICAqL1xuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b25zKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0J7QsdC90L7QstC70Y/QtdGCINGB0L7RgdGC0L7Rj9C90LjQtSDQsdC70L7QutC40YDQvtCy0LrQuCDQutC90L7Qv9C+0LouXG4gICAgICAgICAqL1xuICAgICAgICB1cGRhdGVCdXR0b25zKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kZGVjLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5jLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA8IHRoaXMubWluICsgdGhpcy5zdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kZGVjLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlID4gdGhpcy5tYXggLSB0aGlzLnN0ZXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbmMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQntGC0LrQu9GO0YfQtdC90LjQtSDRgdC/0LjQvdC90LXRgNCwLlxuICAgICAgICAgKi9cbiAgICAgICAgZGlzYWJsZVNwaW5uZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRkZWMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGluYy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5wdXQucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCS0LrQu9GO0YfQtdC90LjQtSDRgdC/0LjQvdC90LXRgNCwLlxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlU3Bpbm5lcigpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5wdXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQt9C90LDRh9C10L3QuNC1INGB0YfRkdGC0YfQuNC60LAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VWYWx1ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2suYXR0cignZGF0YS12YWx1ZScsIHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LmF0dHIoJ3ZhbHVlJywgdmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQnNC10L3Rj9C10YIg0LfQvdCw0YfQtdC90LjQtSDQvNC40L3QuNC80YPQvNCwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IHZhbHVlINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICovXG4gICAgICAgIGNoYW5nZU1pbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5taW4gPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLmF0dHIoJ2RhdGEtbWluJywgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCc0LXQvdGP0LXRgiDQt9C90LDRh9C10L3QuNC1INC80LDQutGB0LjQvNGD0LzQsC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSB2YWx1ZSDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VNYXgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMubWF4ID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hdHRyKCdkYXRhLW1heCcsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQnNCw0YHRgdC40LIg0YHQvtC30LTQsNC90L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgaW5zdGFuY2VzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCd0LDRhdC+0LTQuNGCINC+0LHRitC10LrRgiDQutC70LDRgdGB0LAg0L/QviDRiNCw0LHQu9C+0L3Rgy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7alF1ZXJ5fSAkYmxvY2sg0KjQsNCx0LvQvtC9LlxuICAgICAgICAgKiBAcmV0dXJuIHtTcGlubmVyfSAgICAgICDQntCx0YrQtdC60YIuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoJGJsb2NrKSB7XG4gICAgICAgICAgICByZXR1cm4gU3Bpbm5lci5pbnN0YW5jZXMuZmluZChzcGlubmVyID0+IHNwaW5uZXIuJGJsb2NrLmlzKCRibG9jaykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCh0L7Qt9C00LDRkdGCINC+0LHRitC10LrRgtGLINC/0L4g0YjQsNCx0LvQvtC90LDQvC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9IFskc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpXSDQqNCw0LHQu9C+0L3Riy5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyBjcmVhdGUoJHNwaW5uZXJzID0gJCgnLnNwaW5uZXInKSkge1xuICAgICAgICAgICAgJHNwaW5uZXJzLmVhY2goKGluZGV4LCBibG9jaykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRibG9jayA9ICQoYmxvY2spO1xuXG4gICAgICAgICAgICAgICAgaWYgKFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3Bpbm5lciA9IG5ldyBTcGlubmVyKHtcbiAgICAgICAgICAgICAgICAgICAgJGJsb2NrLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJGJsb2NrLmF0dHIoJ2RhdGEtdmFsdWUnKSxcbiAgICAgICAgICAgICAgICAgICAgbWluOiAkYmxvY2suYXR0cignZGF0YS1taW4nKSxcbiAgICAgICAgICAgICAgICAgICAgbWF4OiAkYmxvY2suYXR0cignZGF0YS1tYXgnKSxcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogJGJsb2NrLmF0dHIoJ2RhdGEtc3RlcCcpLFxuICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb246ICRibG9jay5hdHRyKCdkYXRhLXByZWNpc2lvbicpLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJGJsb2NrLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpID8gc3Bpbm5lci5kaXNhYmxlU3Bpbm5lcigpIDogc3Bpbm5lci5pbml0KCk7XG5cbiAgICAgICAgICAgICAgICBTcGlubmVyLmluc3RhbmNlcy5wdXNoKHNwaW5uZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0KPQtNCw0LvRj9C10YIg0L7QsdGK0LXQutGC0Ysg0L/QviDRiNCw0LHQu9C+0L3QsNC8LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gWyRzcGlubmVycyA9ICQoJy5zcGlubmVyJyldINCo0LDQsdC70L7QvdGLLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIHJlbW92ZSgkc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpKSB7XG4gICAgICAgICAgICAkc3Bpbm5lcnMuZWFjaCgoaW5kZXgsIGJsb2NrKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGJsb2NrID0gJChibG9jayk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzcGlubmVySW5kZXggPSBTcGlubmVyLmluc3RhbmNlcy5maW5kSW5kZXgoc3Bpbm5lciA9PiBzcGlubmVyLiRibG9jay5pcygkYmxvY2spKTtcblxuICAgICAgICAgICAgICAgIFNwaW5uZXIuaW5zdGFuY2VzLnNwbGljZShzcGlubmVySW5kZXgsIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnNwaW5uZXJfX2J0bi0tZGVjJywgaGFuZGxlRGVjQ2xpY2spO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc3Bpbm5lcl9fYnRuLS1pbmMnLCBoYW5kbGVJbmNDbGljayk7XG4gICAgJChkb2N1bWVudCkub24oJ2lucHV0JywgJy5zcGlubmVyX19pbnB1dCcsIGhhbmRsZUlucHV0KTtcblxuICAgIC8qINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L/QuNC90L3QtdGA0L7QsiAqL1xuICAgIGxldCBzcGlubmVycyA9IFNwaW5uZXIuY3JlYXRlKCk7XG5cbiAgICAvKipcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQutC70LjQutCwINC/0L4g0LrQvdC+0L/QutC1INGD0LzQtdC90YzRiNC10L3QuNGPLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGUg0J7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZURlY0NsaWNrKGUpIHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VGFyZ2V0IH0gPSBlO1xuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChjdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgJGJsb2NrID0gJHRhcmdldC5jbG9zZXN0KCcuc3Bpbm5lcicpO1xuICAgICAgICBjb25zdCBzcGlubmVyID0gU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHNwaW5uZXIudmFsdWUgLSBzcGlubmVyLnN0ZXA7XG5cbiAgICAgICAgaWYgKHNwaW5uZXIucHJlY2lzaW9uKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUudG9GaXhlZChzcGlubmVyLnByZWNpc2lvbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Bpbm5lci5jaGFuZ2VWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgICAgc3Bpbm5lci51cGRhdGVCdXR0b25zKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0LrQu9C40LrQsCDQv9C+INC60L3QvtC/0LrQtSDRg9Cy0LXQu9C40YfQtdC90LjRjy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlINCe0LHRitC10LrRgiDRgdC+0LHRi9GC0LjRjy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYW5kbGVJbmNDbGljayhlKSB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudFRhcmdldCB9ID0gZTtcbiAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0ICRibG9jayA9ICR0YXJnZXQuY2xvc2VzdCgnLnNwaW5uZXInKTtcbiAgICAgICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBzcGlubmVyLnZhbHVlICsgc3Bpbm5lci5zdGVwO1xuXG4gICAgICAgIGlmIChzcGlubmVyLnByZWNpc2lvbikge1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlLnRvRml4ZWQoc3Bpbm5lci5wcmVjaXNpb24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW5uZXIuY2hhbmdlVmFsdWUodmFsdWUpO1xuXG4gICAgICAgIHNwaW5uZXIudXBkYXRlQnV0dG9ucygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INCy0LLQvtC00LAg0LIg0L/QvtC70LUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZSDQntCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFuZGxlSW5wdXQoZSkge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRUYXJnZXQgfSA9IGU7XG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCAkYmxvY2sgPSAkdGFyZ2V0LmNsb3Nlc3QoJy5zcGlubmVyJyk7XG4gICAgICAgIGNvbnN0IHNwaW5uZXIgPSBTcGlubmVyLmdldEluc3RhbmNlKCRibG9jayk7XG4gICAgICAgIGNvbnN0IHsgJGlucHV0IH0gPSBzcGlubmVyLmVsZW1lbnRzO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9ICskaW5wdXQudmFsKCk7XG5cbiAgICAgICAgaWYgKCEkaW5wdXQudmFsKCkubGVuZ3RoIHx8IHZhbHVlIDwgc3Bpbm5lci5taW4gfHwgdmFsdWUgPiBzcGlubmVyLm1heCkge1xuICAgICAgICAgICAgKHsgdmFsdWUgfSA9IHNwaW5uZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Bpbm5lci5jaGFuZ2VWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgICAgc3Bpbm5lci51cGRhdGVCdXR0b25zKCk7XG4gICAgfVxuXG4gICAgaW5pdENhcm91c2VscygpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBpbml0Q2Fyb3VzZWxzKTtcblxuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0LLRgdC1INC60LDRgNGD0YHQtdC70LhcbiAgICBmdW5jdGlvbiBpbml0Q2Fyb3VzZWxzICgpIHtcbiAgICAgICAgLy8gINC60LDRgNGD0YHQtdC70Ywg0L3QsCDQv9C10YDQstC+0Lwg0LHQsNC90L3QtdGA0LUg0L3QsCDQs9C70LDQstC90L7QuSDRgdGC0YDQsNC90LjRhtC1XG4gICAgICAgIGNvbnN0ICRuZXdzQ2Fyb3VzZWwgPSAkKCcuanMtbmV3cy1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJG5ld3NDYXJvdXNlbC5sZW5ndGggJiYgISRuZXdzQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRuZXdzQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMjMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogJ3Vuc2xpY2snLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC/0L7QtNCx0L7RgNCwINCx0LDQudC60L7QslxuICAgICAgICBjb25zdCAkYmlrZXNDYXJvdXNlbCA9ICQoJy5qcy1iaWtlcy1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJGJpa2VzQ2Fyb3VzZWwubGVuZ3RoICYmICEkYmlrZXNDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJGJpa2VzQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiAndW5zbGljaycsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgYmlrZSBhZnRlciBpbml0XG4gICAgICAgICAgICAkYmlrZXNDYXJvdXNlbC5maW5kKCcuc2xpY2stYWN0aXZlJykuZmluZCgnaW5wdXQnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGJpa2UgYWZ0ZXIgY2hhbmdlXG4gICAgICAgICAgICAkYmlrZXNDYXJvdXNlbC5vbignYWZ0ZXJDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJGJpa2VzQ2Fyb3VzZWwuZmluZCgnLnNsaWNrLWFjdGl2ZScpLmZpbmQoJ2lucHV0JykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC60LDRgtC10LPQvtGA0LjQuVxuICAgICAgICBjb25zdCAkY2F0ZWdvcmllc0Nhcm91c2VsID0gJCgnLmpzLWNhdGVnb3JpZXMtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRjYXRlZ29yaWVzQ2Fyb3VzZWwubGVuZ3RoICYmICEkY2F0ZWdvcmllc0Nhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkY2F0ZWdvcmllc0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnMCcsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiAndW5zbGljaycsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vINC60LDRgNGD0YHQtdC70Ywg0L3QsCDQs9C70LDQstC90L7QuVxuICAgICAgICBjb25zdCAkaW5kZXhNYWluQ2Fyb3VzZWwgPSAkKCcuanMtaW5kZXgtbWFpbi1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJGluZGV4TWFpbkNhcm91c2VsLmxlbmd0aCAmJiAhJGluZGV4TWFpbkNhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkaW5kZXhNYWluQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICcwJyxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC60LDRgNGC0LjQvdC+0Log0YLQvtCy0LDRgNCwXG4gICAgICAgIGNvbnN0ICRwcm9kdWN0Q2Fyb3VzZWwgPSAkKCcuanMtcHJvZHVjdC1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJHByb2R1Y3RDYXJvdXNlbC5sZW5ndGggJiYgISRwcm9kdWN0Q2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRwcm9kdWN0Q2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4tYXJyb3cgYnRuLWFycm93LS1wcmV2IHByb2R1Y3QtcGFnZV9fY2Fyb3VzZWwtcHJldlwiPjxzdmcgY2xhc3M9XCJpY29uIGljb24tLWFycm93LW5leHRcIj48dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1hcnJvd19uZXh0XCI+PC91c2U+PC9zdmc+PC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1hcnJvdyBwcm9kdWN0LXBhZ2VfX2Nhcm91c2VsLW5leHRcIj48c3ZnIGNsYXNzPVwiaWNvbiBpY29uLS1hcnJvdy1uZXh0XCI+PHVzZSB4bGluazpocmVmPVwiI2ljb24tYXJyb3dfbmV4dFwiPjwvdXNlPjwvc3ZnPjwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjgsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC/0L7RhdC+0LbQuNGFINGC0L7QstCw0YDQvtCyXG4gICAgICAgIGNvbnN0ICRzaW1pbGFyQ2Fyb3VzZWwgPSAkKCcuanMtc2ltaWxhci1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJHNpbWlsYXJDYXJvdXNlbC5sZW5ndGggJiYgISRzaW1pbGFyQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRzaW1pbGFyQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICcwJyxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNjM5LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQutCw0YDRgtC40L3QvtC6XG4gICAgICAgIGNvbnN0ICRwaWN0dXJlQ2Fyb3VzZWwgPSAkKCcuanMtcGljdHVyZS1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJHBpY3R1cmVDYXJvdXNlbC5sZW5ndGggJiYgISRwaWN0dXJlQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRwaWN0dXJlQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCAkdXBCdG4gPSAkKCcuanMtYnRuLXVwJyk7XG5cbiAgICBpZiAoJHVwQnRuLmxlbmd0aCkge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWJ0bi11cCcsICgpID0+IHtcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID49IGdsb2JhbE9wdGlvbnMudGFibGV0TGdTaXplKSB7XG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gNTAgPyAkdXBCdG4uc2hvdygpIDogJHVwQnRuLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgJGZpbHRlck1vZGFsID0gJCgnLmpzLWZpbHRlci1tb2RhbCcpO1xuICAgIGlmICgkZmlsdGVyTW9kYWwubGVuZ3RoKSB7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1maWx0ZXItYnRuJywgZSA9PiB7XG4gICAgICAgICAgICAkZmlsdGVyTW9kYWwuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpLmFuaW1hdGVDc3MoJ3NsaWRlSW5SaWdodCcpO1xuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoYXMtb3ZlcmxheScpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWZpbHRlci1jbG9zZScsIGUgPT4ge1xuICAgICAgICAgICAgJGZpbHRlck1vZGFsLmFuaW1hdGVDc3MoJ3NsaWRlT3V0UmlnaHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJGZpbHRlck1vZGFsLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQkNC90LjQvNCw0YbQuNGPINGN0LvQtdC80LXQvdGC0LAgbGFiZWwg0L/RgNC4INGE0L7QutGD0YHQtSDQv9C+0LvQtdC5INGE0L7RgNC80YtcbiAgICAgICAgICovXG4gICAgICAgICQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgY29uc3QgZmllbGQgPSAkKGVsKS5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKTtcblxuICAgICAgICAgICAgaWYgKCQoZmllbGQpLnZhbCgpLnRyaW0oKSAhPSAnJyB8fCAkKGZpZWxkKS5pcygnOnBsYWNlaG9sZGVyLXNob3duJykpIHtcbiAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoZmllbGQpLm9uKCdmb2N1cycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgfSkub24oJ2JsdXInLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLnRyaW0oKSA9PT0gJycgJiYgISQoZmllbGQpLmlzKCc6cGxhY2Vob2xkZXItc2hvd24nKSkge1xuICAgICAgICAgICAgICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qIEBzZWUgaHR0cHM6Ly9hdG9taWtzLmdpdGh1Yi5pby90aXBweWpzLyAqL1xuXG4gICAgY29uc3QgdG9vbHRpcFNldHRpbmdzID0ge1xuICAgICAgICBhcnJvdzogZmFsc2UsXG4gICAgICAgIGFsbG93SFRNTDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGVGaWxsOiBmYWxzZSxcbiAgICAgICAgcGxhY2VtZW50OiAncmlnaHQtY2VudGVyJyxcbiAgICAgICAgZGlzdGFuY2U6IDIwLFxuICAgICAgICB0aGVtZTogJ3Rvb2x0aXAnXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIGluaXQgYWxsIHRvb2x0aXBzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdFRvb2x0aXBzKCkge1xuICAgICAgICAkKCdbZGF0YS10b29sdGlwXScpLmVhY2goKGluZGV4LCBlbGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsb2NhbFNldHRpbmdzID0ge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICQoZWxlbSkuYXR0cignZGF0YS10b29sdGlwJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKGVsZW0pLmRhdGEoJ2NsaWNrJykpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFNldHRpbmdzWyd0cmlnZ2VyJ10gPSAnY2xpY2sga2V5dXAnO1xuICAgICAgICAgICAgICAgIGxvY2FsU2V0dGluZ3NbJ2ludGVyYWN0aXZlJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aXBweShlbGVtLCBPYmplY3QuYXNzaWduKHt9LCB0b29sdGlwU2V0dGluZ3MsIGxvY2FsU2V0dGluZ3MpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFRvb2x0aXBzKCk7XG5cbiAgICAvLyBzaG9wIGFkZHJlc3NcbiAgICAvLyDQnNC+0YHQutC+0LLRgdC60LDRjyDQvtCx0LvQsNGC0YwsINCh0L7Qu9C90LXRh9C90L7Qs9C+0YDRgdC60LjQuSDRgNCw0LnQvtC9LCDQtC4g0JTRg9GA0YvQutC40L3QviwgMdCULlxuICAgIGNvbnN0IHNob3AgPSB7bGF0OiA1Ni4wNTk2OTUsIGxuZzogMzcuMTQ0MTQyfTtcblxuICAgIC8vIGZvciBibGFjayBtYXBcbiAgICBjb25zdCBtYXBTdHlsZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzIxMjEyMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMuaWNvblwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzc1NzU3NVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5zdHJva2VcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMyMTIxMjFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzc1NzU3NVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZS5jb3VudHJ5XCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzllOWU5ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZS5sYW5kX3BhcmNlbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmUubG9jYWxpdHlcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjYmRiZGJkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM3NTc1NzVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLnBhcmtcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzE4MTgxOFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kucGFya1wiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM2MTYxNjFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLnBhcmtcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5zdHJva2VcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMxYjFiMWJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZFwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMyYzJjMmNcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZFwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM4YThhOGFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5hcnRlcmlhbFwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjMzczNzM3XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjM2MzYzNjXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheS5jb250cm9sbGVkX2FjY2Vzc1wiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNGU0ZTRlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQubG9jYWxcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNjE2MTYxXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInRyYW5zaXRcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNzU3NTc1XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMwMDAwMDBcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjM2QzZDNkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF1cblxuICAgIC8vIEluaXRpYWxpemUgYW5kIGFkZCB0aGUgbWFwXG4gICAgZnVuY3Rpb24gaW5pdE1hcCgpIHtcbiAgICAgICAgLy8gVGhlIG1hcCwgY2VudGVyZWQgYXQgU2hvcFxuICAgICAgICBjb25zdCBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgICAgICAgICAgem9vbTogMTQsXG4gICAgICAgICAgICAgICAgY2VudGVyOiBzaG9wLFxuICAgICAgICAgICAgICAgIHN0eWxlczogbWFwU3R5bGVzLFxuICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzY2FsZUNvbnRyb2w6IHRydWUsXG4gICAgICAgICAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJvdGF0ZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZ1bGxzY3JlZW5Db250cm9sOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBwb2ludEljb24gPSB7XG4gICAgICAgICAgICB1cmw6ICdpbWcvc3ZnL3BvaW50LnN2ZycsXG4gICAgICAgICAgICAvLyBUaGlzIG1hcmtlciBpcyA3MiBwaXhlbHMgd2lkZSBieSA3MiBwaXhlbHMgaGlnaC5cbiAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDcyLCA3MiksXG4gICAgICAgICAgICAvLyBUaGUgb3JpZ2luIGZvciB0aGlzIGltYWdlIGlzICgwLCAwKS5cbiAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgLy8gVGhlIGFuY2hvciBmb3IgdGhpcyBpbWFnZSBpcyB0aGUgY2VudGVyIGF0ICgwLCAzMikuXG4gICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgzNiwgMzYpXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVGhlIG1hcmtlciwgcG9zaXRpb25lZCBhdCBzaG9wXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgcG9zaXRpb246IHNob3AsXG4gICAgICAgICAgICBpY29uOiBwb2ludEljb24sXG4gICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgd2luZG93LmluaXRNYXAgPSBpbml0TWFwO1xuXG47XG59KTtcbiJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==

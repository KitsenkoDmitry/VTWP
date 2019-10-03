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
      rerenderHeader();
    }
  });
  $(document).on('mouseleave', '.js-header', function (e) {
    if ($('.js-header-dropdown').hasClass('is-active')) {
      $('.js-header-dropdown').removeClass('is-active');
      $header.removeClass('is-active');
      $('body').removeClass('has-overlay');
      rerenderHeader();
    }
  }); // fix bug for safari

  function rerenderHeader() {
    $header.hide();
    setTimeout(function () {
      $header.show();
    }, 0);
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
    } // карусель проектов и/или событий


    var $projectsCarousel = $('.js-projects-carousel');

    if ($projectsCarousel.length && !$projectsCarousel.hasClass('slick-initialized')) {
      $projectsCarousel.slick({
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
        }, {
          breakpoint: 639,
          settings: {
            slidesToShow: 2,
            centerMode: false
          }
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
        infinite: false,
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
      $productCarousel.on('afterChange', function (slick, currentSlide) {
        var $parent = $(slick.currentTarget).closest('.product-page__carousel-wrapper');
        $parent.find('.product-page__carousel-btns-pic').removeClass('is-active');
        $parent.find("[data-slide=".concat(currentSlide.currentSlide, "]")).addClass('is-active');
      }); // реализовываем переключение слайдов

      $(document).on('click', '.product-page__carousel-btns-pic', function (e) {
        var $btn = $(e.currentTarget);
        var $parent = $btn.closest('.product-page__carousel-wrapper');
        var $productCarousel = $parent.find('.js-product-carousel');
        var slideId = $btn.data('slide');
        $parent.find('.product-page__carousel-btns-pic').removeClass('is-active');
        $btn.addClass('is-active');
        $productCarousel.slick('slickGoTo', slideId);
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
    } // карусель картинок товара


    var $picturesCarousel = $('.js-pictures-carousel');

    if ($picturesCarousel.length && !$picturesCarousel.hasClass('slick-initialized')) {
      $picturesCarousel.slick({
        arrows: true,
        infinite: false,
        variableWidth: true,
        prevArrow: '<button type="button" class="btn-arrow btn-arrow--prev pictures__carousel-btn-prev"><svg class="icon icon--arrow-next"><use xlink:href="#icon-arrow_next"></use></svg></button>',
        nextArrow: '<button type="button" class="btn-arrow pictures__carousel-btn-next"><svg class="icon icon--arrow-next"><use xlink:href="#icon-arrow_next"></use></svg></button>',
        dots: false,
        responsive: [{
          breakpoint: 768,
          settings: {
            arrows: false,
            dots: true,
            variableWidth: false
          }
        }]
      });
      $picturesCarousel.on('afterChange', function (slick, currentSlide) {
        var $parent = $(slick.currentTarget).closest('.pictures');
        $parent.find('.pictures__thumbs-item').removeClass('is-active');
        $parent.find("[data-slide=".concat(currentSlide.currentSlide, "]")).addClass('is-active');
      }); // реализовываем переключение слайдов

      $(document).on('click', '.pictures__thumbs-item', function (e) {
        var $btn = $(e.currentTarget);
        var $parent = $btn.closest('.pictures');
        var $picturesCarousel = $parent.find('.js-pictures-carousel');
        var slideId = $btn.data('slide');
        $parent.find('.pictures__thumbs-item').removeClass('is-active');
        $btn.addClass('is-active');
        $picturesCarousel.slick('slickGoTo', slideId);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wTGdTaXplIiwiZGVza3RvcE1kU2l6ZSIsImRlc2t0b3BTaXplIiwiZGVza3RvcFNtU2l6ZSIsInRhYmxldExnU2l6ZSIsInRhYmxldFNpemUiLCJtb2JpbGVMZ1NpemUiLCJtb2JpbGVTaXplIiwibGFuZyIsImF0dHIiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnREZXNrdG9wTGciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYnJlYWtwb2ludERlc2t0b3BNZCIsImJyZWFrcG9pbnREZXNrdG9wIiwiYnJlYWtwb2ludERlc2t0b3BTbSIsImJyZWFrcG9pbnRUYWJsZXRMZyIsImJyZWFrcG9pbnRUYWJsZXQiLCJicmVha3BvaW50TW9iaWxlTGdTaXplIiwiYnJlYWtwb2ludE1vYmlsZSIsImV4dGVuZCIsIm9uIiwibGVuZ3RoIiwiYXV0b3NpemUiLCJmbiIsImFuaW1hdGVDc3MiLCJhbmltYXRpb25OYW1lIiwiY2FsbGJhY2siLCJhbmltYXRpb25FbmQiLCJlbCIsImFuaW1hdGlvbnMiLCJhbmltYXRpb24iLCJPQW5pbWF0aW9uIiwiTW96QW5pbWF0aW9uIiwiV2Via2l0QW5pbWF0aW9uIiwidCIsInN0eWxlIiwidW5kZWZpbmVkIiwiY3JlYXRlRWxlbWVudCIsImFkZENsYXNzIiwib25lIiwicmVtb3ZlQ2xhc3MiLCJpc051bWVyaWMiLCJuIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJyZW1vdmVOb3REaWdpdHMiLCJwYXJhbSIsInRvU3RyaW5nIiwicmVwbGFjZSIsImRpdmlkZUJ5RGlnaXRzIiwibG9jYWxlIiwiUGFyc2xleSIsInNldExvY2FsZSIsIm9wdGlvbnMiLCJ0cmlnZ2VyIiwidmFsaWRhdGlvblRocmVzaG9sZCIsImVycm9yc1dyYXBwZXIiLCJlcnJvclRlbXBsYXRlIiwiY2xhc3NIYW5kbGVyIiwiaW5zdGFuY2UiLCIkZWxlbWVudCIsInR5cGUiLCIkaGFuZGxlciIsImhhc0NsYXNzIiwibmV4dCIsImVycm9yc0NvbnRhaW5lciIsIiRjb250YWluZXIiLCJjbG9zZXN0IiwicGFyZW50IiwiYWRkVmFsaWRhdG9yIiwidmFsaWRhdGVTdHJpbmciLCJ2YWx1ZSIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJkYXRhIiwibWF4IiwibWluRGF0ZSIsIm1heERhdGUiLCJ2YWx1ZURhdGUiLCJyZXN1bHQiLCJtYXRjaCIsIkRhdGUiLCJtYXhTaXplIiwicGFyc2xleUluc3RhbmNlIiwiZmlsZXMiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsImkiLCIkYmxvY2siLCIkbGFzdCIsImFmdGVyIiwiZWxlbWVudCIsInBhcnNsZXkiLCJlIiwiJHNlbGYiLCJjdXJyZW50VGFyZ2V0IiwiJGNvbGxhcHNlQm9keSIsImZpbmQiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwiaW5wdXRtYXNrIiwiY2xlYXJNYXNrT25Mb3N0Rm9jdXMiLCJzaG93TWFza09uSG92ZXIiLCJDdXN0b21TZWxlY3QiLCIkZWxlbSIsInNlbGYiLCJpbml0IiwiJGluaXRFbGVtIiwiZWFjaCIsInNlbGVjdFNlYXJjaCIsIm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIiwiSW5maW5pdHkiLCJzZWxlY3QyIiwic2VsZWN0T25CbHVyIiwiZHJvcGRvd25Dc3NDbGFzcyIsImxhbmd1YWdlIiwibm9SZXN1bHRzIiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbVNlbGVjdCIsImRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyIsImRhdGVGb3JtYXQiLCJzaG93T3RoZXJNb250aHMiLCJEYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsInNob3dNWSIsImN1cnJlbnREYXRlIiwiY3VycmVudERheSIsImdldERhdGUiLCJuZXdEYXRlIiwiZ2V0TW9udGgiLCJnZXRGdWxsWWVhciIsIml0ZW1PcHRpb25zIiwib25TZWxlY3QiLCJjaGFuZ2UiLCJzZXRUaW1lb3V0IiwiJG1vYmlsZU1lbnUiLCIkY2FydE1vZGFsIiwib3Blbk1vZGFsIiwiaGlkZU1vZGFsIiwicHJldmVudERlZmF1bHQiLCIkbW9kYWxCbG9jayIsImxvY2tEb2N1bWVudCIsInVubG9ja0RvY3VtZW50IiwiJGhlYWRlciIsImNhdGVnb3J5IiwiJGNhdGVnb3J5RHJvcGRvd24iLCJyZXJlbmRlckhlYWRlciIsImhpZGUiLCJzaG93IiwiJHRhYnMiLCIkdGFic0xpbmtzIiwiJHRhYnNJdGVtcyIsIiRoaWRkZW5Gb3JtRmllbGRzIiwicHJvcCIsInZhbCIsIiRzZWxmSXRlbSIsIlNwaW5uZXIiLCJzdGVwIiwicHJlY2lzaW9uIiwiZWxlbWVudHMiLCIkZGVjIiwiJGluYyIsIiRpbnB1dCIsInVwZGF0ZUJ1dHRvbnMiLCJpbnN0YW5jZXMiLCJzcGlubmVyIiwiaXMiLCIkc3Bpbm5lcnMiLCJpbmRleCIsImJsb2NrIiwiZ2V0SW5zdGFuY2UiLCJkaXNhYmxlU3Bpbm5lciIsInB1c2giLCJzcGlubmVySW5kZXgiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJoYW5kbGVEZWNDbGljayIsImhhbmRsZUluY0NsaWNrIiwiaGFuZGxlSW5wdXQiLCJzcGlubmVycyIsImNyZWF0ZSIsIiR0YXJnZXQiLCJ0b0ZpeGVkIiwiY2hhbmdlVmFsdWUiLCJpbml0Q2Fyb3VzZWxzIiwiJG5ld3NDYXJvdXNlbCIsInNsaWNrIiwiYXJyb3dzIiwiaW5maW5pdGUiLCJzbGlkZXNUb1Nob3ciLCJjZW50ZXJNb2RlIiwidmFyaWFibGVXaWR0aCIsIm1vYmlsZUZpcnN0IiwicmVzcG9uc2l2ZSIsImJyZWFrcG9pbnQiLCJzZXR0aW5ncyIsIiRiaWtlc0Nhcm91c2VsIiwiJGNhdGVnb3JpZXNDYXJvdXNlbCIsImNlbnRlclBhZGRpbmciLCJkb3RzIiwiJHByb2plY3RzQ2Fyb3VzZWwiLCIkaW5kZXhNYWluQ2Fyb3VzZWwiLCIkcHJvZHVjdENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiY3VycmVudFNsaWRlIiwiJHBhcmVudCIsIiRidG4iLCJzbGlkZUlkIiwiJHNpbWlsYXJDYXJvdXNlbCIsIiRwaWN0dXJlQ2Fyb3VzZWwiLCJzbGlkZXNUb1Njcm9sbCIsIiRiaWtlQ2FyZENhcm91c2VsIiwiaXRlbSIsImZhZGUiLCIkY2Fyb3VzZWwiLCIkcGljdHVyZXNDYXJvdXNlbCIsIiR1cEJ0biIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJ3aWR0aCIsIiRmaWx0ZXJNb2RhbCIsImZpZWxkIiwidHJpbSIsImV2ZW50IiwidG9vbHRpcFNldHRpbmdzIiwiYXJyb3ciLCJhbGxvd0hUTUwiLCJhbmltYXRlRmlsbCIsInBsYWNlbWVudCIsImRpc3RhbmNlIiwidGhlbWUiLCJpbml0VG9vbHRpcHMiLCJlbGVtIiwibG9jYWxTZXR0aW5ncyIsImNvbnRlbnQiLCJ0aXBweSIsIk9iamVjdCIsImFzc2lnbiIsInNob3AiLCJsYXQiLCJsbmciLCJtYXBTdHlsZXMiLCJlbGVtZW50VHlwZSIsInN0eWxlcnMiLCJjb2xvciIsInZpc2liaWxpdHkiLCJmZWF0dXJlVHlwZSIsImluaXRNYXAiLCJtYXAiLCJnb29nbGUiLCJtYXBzIiwiTWFwIiwiZ2V0RWxlbWVudEJ5SWQiLCJ6b29tIiwiY2VudGVyIiwic3R5bGVzIiwiem9vbUNvbnRyb2wiLCJtYXBUeXBlQ29udHJvbCIsInNjYWxlQ29udHJvbCIsInN0cmVldFZpZXdDb250cm9sIiwicm90YXRlQ29udHJvbCIsImZ1bGxzY3JlZW5Db250cm9sIiwicG9pbnRJY29uIiwidXJsIiwiU2l6ZSIsIm9yaWdpbiIsIlBvaW50IiwiYW5jaG9yIiwibWFya2VyIiwiTWFya2VyIiwicG9zaXRpb24iLCJpY29uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBVztBQUN6Qjs7O0FBR0EsTUFBSUMsYUFBYSxHQUFHO0FBQ2hCO0FBQ0FDLElBQUFBLElBQUksRUFBRyxHQUZTO0FBSWhCO0FBQ0FDLElBQUFBLGFBQWEsRUFBRyxJQUxBO0FBTWhCQyxJQUFBQSxhQUFhLEVBQUcsSUFOQTtBQU9oQkMsSUFBQUEsV0FBVyxFQUFLLElBUEE7QUFRaEJDLElBQUFBLGFBQWEsRUFBRyxJQVJBO0FBU2hCQyxJQUFBQSxZQUFZLEVBQUksSUFUQTtBQVVoQkMsSUFBQUEsVUFBVSxFQUFNLEdBVkE7QUFXaEJDLElBQUFBLFlBQVksRUFBSSxHQVhBO0FBWWhCQyxJQUFBQSxVQUFVLEVBQU0sR0FaQTtBQWNoQkMsSUFBQUEsSUFBSSxFQUFFYixDQUFDLENBQUMsTUFBRCxDQUFELENBQVVjLElBQVYsQ0FBZSxNQUFmO0FBZFUsR0FBcEIsQ0FKeUIsQ0FxQnpCO0FBQ0E7O0FBQ0EsTUFBTUMsV0FBVyxHQUFHO0FBQ2hCQyxJQUFBQSxtQkFBbUIsRUFBRUMsTUFBTSxDQUFDQyxVQUFQLHVCQUFpQ2YsYUFBYSxDQUFDRSxhQUFkLEdBQThCLENBQS9ELFNBREw7QUFFaEJjLElBQUFBLG1CQUFtQixFQUFFRixNQUFNLENBQUNDLFVBQVAsdUJBQWlDZixhQUFhLENBQUNHLGFBQWQsR0FBOEIsQ0FBL0QsU0FGTDtBQUdoQmMsSUFBQUEsaUJBQWlCLEVBQUVILE1BQU0sQ0FBQ0MsVUFBUCx1QkFBaUNmLGFBQWEsQ0FBQ0ksV0FBZCxHQUE0QixDQUE3RCxTQUhIO0FBSWhCYyxJQUFBQSxtQkFBbUIsRUFBRUosTUFBTSxDQUFDQyxVQUFQLHVCQUFpQ2YsYUFBYSxDQUFDSyxhQUFkLEdBQThCLENBQS9ELFNBSkw7QUFLaEJjLElBQUFBLGtCQUFrQixFQUFFTCxNQUFNLENBQUNDLFVBQVAsdUJBQWlDZixhQUFhLENBQUNNLFlBQWQsR0FBNkIsQ0FBOUQsU0FMSjtBQU1oQmMsSUFBQUEsZ0JBQWdCLEVBQUVOLE1BQU0sQ0FBQ0MsVUFBUCx1QkFBaUNmLGFBQWEsQ0FBQ08sVUFBZCxHQUEyQixDQUE1RCxTQU5GO0FBT2hCYyxJQUFBQSxzQkFBc0IsRUFBRVAsTUFBTSxDQUFDQyxVQUFQLHVCQUFpQ2YsYUFBYSxDQUFDUSxZQUFkLEdBQTZCLENBQTlELFNBUFI7QUFRaEJjLElBQUFBLGdCQUFnQixFQUFFUixNQUFNLENBQUNDLFVBQVAsdUJBQWlDZixhQUFhLENBQUNTLFVBQWQsR0FBMkIsQ0FBNUQ7QUFSRixHQUFwQjtBQVdBWixFQUFBQSxDQUFDLENBQUMwQixNQUFGLENBQVMsSUFBVCxFQUFldkIsYUFBZixFQUE4QlksV0FBOUI7QUFFQWYsRUFBQUEsQ0FBQyxDQUFDaUIsTUFBRCxDQUFELENBQVVVLEVBQVYsQ0FBYSxNQUFiLEVBQXFCLFlBQU07QUFDdkIsUUFBSTNCLENBQUMsQ0FBQyxVQUFELENBQUQsQ0FBYzRCLE1BQWQsR0FBdUIsQ0FBM0IsRUFBOEI7QUFDMUJDLE1BQUFBLFFBQVEsQ0FBQzdCLENBQUMsQ0FBQyxVQUFELENBQUYsQ0FBUjtBQUNIO0FBQ0osR0FKRDtBQU1BOzs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlSkEsRUFBQUEsQ0FBQyxDQUFDOEIsRUFBRixDQUFLSixNQUFMLENBQVk7QUFDUkssSUFBQUEsVUFBVSxFQUFFLG9CQUFTQyxhQUFULEVBQXdCQyxRQUF4QixFQUFrQztBQUMxQyxVQUFJQyxZQUFZLEdBQUksVUFBU0MsRUFBVCxFQUFhO0FBQzdCLFlBQUlDLFVBQVUsR0FBRztBQUNiQyxVQUFBQSxTQUFTLEVBQUUsY0FERTtBQUViQyxVQUFBQSxVQUFVLEVBQUUsZUFGQztBQUdiQyxVQUFBQSxZQUFZLEVBQUUsaUJBSEQ7QUFJYkMsVUFBQUEsZUFBZSxFQUFFO0FBSkosU0FBakI7O0FBT0EsYUFBSyxJQUFJQyxDQUFULElBQWNMLFVBQWQsRUFBMEI7QUFDdEIsY0FBSUQsRUFBRSxDQUFDTyxLQUFILENBQVNELENBQVQsTUFBZ0JFLFNBQXBCLEVBQStCO0FBQzNCLG1CQUFPUCxVQUFVLENBQUNLLENBQUQsQ0FBakI7QUFDSDtBQUNKO0FBQ0osT0Fia0IsQ0FhaEJ4QyxRQUFRLENBQUMyQyxhQUFULENBQXVCLEtBQXZCLENBYmdCLENBQW5COztBQWVBLFdBQUtDLFFBQUwsQ0FBYyxjQUFjYixhQUE1QixFQUEyQ2MsR0FBM0MsQ0FBK0NaLFlBQS9DLEVBQTZELFlBQVc7QUFDcEVsQyxRQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVErQyxXQUFSLENBQW9CLGNBQWNmLGFBQWxDO0FBRUEsWUFBSSxPQUFPQyxRQUFQLEtBQW9CLFVBQXhCLEVBQW9DQSxRQUFRO0FBQy9DLE9BSkQ7QUFNQSxhQUFPLElBQVA7QUFDSDtBQXhCTyxHQUFaLEVBNUQ2QixDQXVGekI7O0FBRUE7Ozs7Ozs7QUFNQSxXQUFTZSxTQUFULENBQW1CQyxDQUFuQixFQUFzQjtBQUNsQixXQUFPLENBQUNDLEtBQUssQ0FBQ0MsVUFBVSxDQUFDRixDQUFELENBQVgsQ0FBTixJQUF5QkcsUUFBUSxDQUFDSCxDQUFELENBQXhDO0FBQ0g7QUFFRDs7Ozs7Ozs7QUFNQSxXQUFTSSxlQUFULENBQXlCQyxLQUF6QixFQUFnQztBQUM1QjtBQUNBLFdBQU8sQ0FBQ0EsS0FBSyxDQUFDQyxRQUFOLEdBQWlCQyxPQUFqQixDQUF5QixLQUF6QixFQUFnQyxFQUFoQyxDQUFSO0FBQ0g7QUFFRDs7Ozs7Ozs7O0FBT0EsV0FBU0MsY0FBVCxDQUF3QkgsS0FBeEIsRUFBK0I7QUFDM0IsUUFBSUEsS0FBSyxLQUFLLElBQWQsRUFBb0JBLEtBQUssR0FBRyxDQUFSO0FBQ3BCLFdBQU9BLEtBQUssQ0FBQ0MsUUFBTixHQUFpQkMsT0FBakIsQ0FBeUIsNkJBQXpCLEVBQXdELEtBQXhELENBQVA7QUFDSDs7QUFFRCxNQUFJRSxNQUFNLEdBQUd2RCxhQUFhLENBQUNVLElBQWQsSUFBc0IsT0FBdEIsR0FBZ0MsSUFBaEMsR0FBdUMsSUFBcEQ7QUFFQThDLEVBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkYsTUFBbEI7QUFFQTs7QUFDQTFELEVBQUFBLENBQUMsQ0FBQzBCLE1BQUYsQ0FBU2lDLE9BQU8sQ0FBQ0UsT0FBakIsRUFBMEI7QUFDdEJDLElBQUFBLE9BQU8sRUFBRSxhQURhO0FBQ0U7QUFDeEJDLElBQUFBLG1CQUFtQixFQUFFLEdBRkM7QUFHdEJDLElBQUFBLGFBQWEsRUFBRSxhQUhPO0FBSXRCQyxJQUFBQSxhQUFhLEVBQUUsdUNBSk87QUFLdEJDLElBQUFBLFlBQVksRUFBRSxzQkFBU0MsUUFBVCxFQUFtQjtBQUM3QixVQUFNQyxRQUFRLEdBQUdELFFBQVEsQ0FBQ0MsUUFBMUI7QUFDQSxVQUFJQyxJQUFJLEdBQUdELFFBQVEsQ0FBQ3RELElBQVQsQ0FBYyxNQUFkLENBQVg7QUFBQSxVQUNJd0QsUUFESjs7QUFFQSxVQUFJRCxJQUFJLElBQUksVUFBUixJQUFzQkEsSUFBSSxJQUFJLE9BQWxDLEVBQTJDO0FBQ3ZDQyxRQUFBQSxRQUFRLEdBQUdGLFFBQVgsQ0FEdUMsQ0FDbEI7QUFDeEIsT0FGRCxNQUVPLElBQUlBLFFBQVEsQ0FBQ0csUUFBVCxDQUFrQiwyQkFBbEIsQ0FBSixFQUFvRDtBQUN2REQsUUFBQUEsUUFBUSxHQUFHdEUsQ0FBQyxDQUFDLDRCQUFELEVBQStCb0UsUUFBUSxDQUFDSSxJQUFULENBQWMsVUFBZCxDQUEvQixDQUFaO0FBQ0g7O0FBRUQsYUFBT0YsUUFBUDtBQUNILEtBaEJxQjtBQWlCdEJHLElBQUFBLGVBQWUsRUFBRSx5QkFBU04sUUFBVCxFQUFtQjtBQUNoQyxVQUFNQyxRQUFRLEdBQUdELFFBQVEsQ0FBQ0MsUUFBMUI7QUFDQSxVQUFJQyxJQUFJLEdBQUdELFFBQVEsQ0FBQ3RELElBQVQsQ0FBYyxNQUFkLENBQVg7QUFBQSxVQUNJNEQsVUFESjs7QUFHQSxVQUFJTCxJQUFJLElBQUksVUFBUixJQUFzQkEsSUFBSSxJQUFJLE9BQWxDLEVBQTJDO0FBQ3ZDSyxRQUFBQSxVQUFVLEdBQUcxRSxDQUFDLG1CQUFXb0UsUUFBUSxDQUFDdEQsSUFBVCxDQUFjLE1BQWQsQ0FBWCxzQkFBRCxDQUFvRDBELElBQXBELENBQXlELG1CQUF6RCxDQUFiO0FBQ0gsT0FGRCxNQUVPLElBQUlKLFFBQVEsQ0FBQ0csUUFBVCxDQUFrQiwyQkFBbEIsQ0FBSixFQUFvRDtBQUN2REcsUUFBQUEsVUFBVSxHQUFHTixRQUFRLENBQUNJLElBQVQsQ0FBYyxVQUFkLEVBQTBCQSxJQUExQixDQUErQixtQkFBL0IsQ0FBYjtBQUNILE9BRk0sTUFFQSxJQUFJSCxJQUFJLElBQUksTUFBWixFQUFvQjtBQUN2QkssUUFBQUEsVUFBVSxHQUFHTixRQUFRLENBQUNPLE9BQVQsQ0FBaUIsY0FBakIsRUFBaUNILElBQWpDLENBQXNDLG1CQUF0QyxDQUFiO0FBQ0gsT0FGTSxNQUVBLElBQUlKLFFBQVEsQ0FBQ3RELElBQVQsQ0FBYyxNQUFkLEtBQXlCLHNCQUE3QixFQUFxRDtBQUN4RDRELFFBQUFBLFVBQVUsR0FBR04sUUFBUSxDQUNoQlEsTUFEUSxHQUVSSixJQUZRLENBRUgsY0FGRyxFQUdSQSxJQUhRLENBR0gsbUJBSEcsQ0FBYjtBQUlILE9BaEIrQixDQWlCaEM7QUFDQTtBQUNBO0FBQ0E7OztBQUVBLGFBQU9FLFVBQVA7QUFDSDtBQXhDcUIsR0FBMUIsRUEvSHlCLENBMEt6QjtBQUVBOztBQUNBZixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLFFBQXJCLEVBQStCO0FBQzNCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0I7QUFDNUIsYUFBTyxnQkFBZ0JDLElBQWhCLENBQXFCRCxLQUFyQixDQUFQO0FBQ0gsS0FIMEI7QUFJM0JFLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsNEJBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFKaUIsR0FBL0IsRUE3S3lCLENBdUx6Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2tCLFlBQVIsQ0FBcUIsUUFBckIsRUFBK0I7QUFDM0JDLElBQUFBLGNBQWMsRUFBRSx3QkFBU0MsS0FBVCxFQUFnQjtBQUM1QixhQUFPLGVBQWVDLElBQWYsQ0FBb0JELEtBQXBCLENBQVA7QUFDSCxLQUgwQjtBQUkzQkUsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSw0QkFERTtBQUVOQyxNQUFBQSxFQUFFLEVBQUU7QUFGRTtBQUppQixHQUEvQixFQXhMeUIsQ0FrTXpCOztBQUNBeEIsRUFBQUEsT0FBTyxDQUFDa0IsWUFBUixDQUFxQixNQUFyQixFQUE2QjtBQUN6QkMsSUFBQUEsY0FBYyxFQUFFLHdCQUFTQyxLQUFULEVBQWdCO0FBQzVCLGFBQU8sbUJBQW1CQyxJQUFuQixDQUF3QkQsS0FBeEIsQ0FBUDtBQUNILEtBSHdCO0FBSXpCRSxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLHNDQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBSmUsR0FBN0IsRUFuTXlCLENBNk16Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2tCLFlBQVIsQ0FBcUIsYUFBckIsRUFBb0M7QUFDaENDLElBQUFBLGNBQWMsRUFBRSx3QkFBU0MsS0FBVCxFQUFnQjtBQUM1QixhQUFPLGdCQUFnQkMsSUFBaEIsQ0FBcUJELEtBQXJCLENBQVA7QUFDSCxLQUgrQjtBQUloQ0UsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSx1QkFERTtBQUVOQyxNQUFBQSxFQUFFLEVBQUU7QUFGRTtBQUpzQixHQUFwQyxFQTlNeUIsQ0F3TnpCOztBQUNBeEIsRUFBQUEsT0FBTyxDQUFDa0IsWUFBUixDQUFxQixXQUFyQixFQUFrQztBQUM5QkMsSUFBQUEsY0FBYyxFQUFFLHdCQUFTQyxLQUFULEVBQWdCO0FBQzVCLGFBQU8sbUJBQW1CQyxJQUFuQixDQUF3QkQsS0FBeEIsQ0FBUDtBQUNILEtBSDZCO0FBSTlCRSxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLGlDQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBSm9CLEdBQWxDLEVBek55QixDQW1PekI7O0FBQ0F4QixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLE9BQXJCLEVBQThCO0FBQzFCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0I7QUFDNUIsYUFBTyxpQkFBaUJDLElBQWpCLENBQXNCRCxLQUF0QixDQUFQO0FBQ0gsS0FIeUI7QUFJMUJFLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsK0JBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFKZ0IsR0FBOUIsRUFwT3lCLENBOE96Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2tCLFlBQVIsQ0FBcUIsUUFBckIsRUFBK0I7QUFDM0JDLElBQUFBLGNBQWMsRUFBRSx3QkFBU0MsS0FBVCxFQUFnQjtBQUM1QixhQUFPLFlBQVlDLElBQVosQ0FBaUJELEtBQWpCLENBQVA7QUFDSCxLQUgwQjtBQUkzQkUsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSxhQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBSmlCLEdBQS9CLEVBL095QixDQXlQekI7O0FBQ0F4QixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLE9BQXJCLEVBQThCO0FBQzFCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0I7QUFDNUIsYUFBTyx3SUFBd0lDLElBQXhJLENBQ0hELEtBREcsQ0FBUDtBQUdILEtBTHlCO0FBTTFCRSxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLDZCQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBTmdCLEdBQTlCLEVBMVB5QixDQXNRekI7O0FBQ0F4QixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLE1BQXJCLEVBQTZCO0FBQ3pCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0I7QUFDNUIsVUFBSUssT0FBTyxHQUFHLGtUQUFkO0FBQUEsVUFDSUMsUUFBUSxHQUFHLCtCQURmO0FBQUEsVUFFSUMsR0FBRyxHQUFHQyxTQUFTLENBQUMsQ0FBRCxDQUFULENBQWFuQixRQUFiLENBQXNCb0IsSUFBdEIsQ0FBMkIsU0FBM0IsQ0FGVjtBQUFBLFVBR0lDLEdBQUcsR0FBR0YsU0FBUyxDQUFDLENBQUQsQ0FBVCxDQUFhbkIsUUFBYixDQUFzQm9CLElBQXRCLENBQTJCLFNBQTNCLENBSFY7QUFBQSxVQUlJRSxPQUpKO0FBQUEsVUFLSUMsT0FMSjtBQUFBLFVBTUlDLFNBTko7QUFBQSxVQU9JQyxNQVBKOztBQVNBLFVBQUlQLEdBQUcsS0FBS08sTUFBTSxHQUFHUCxHQUFHLENBQUNRLEtBQUosQ0FBVVQsUUFBVixDQUFkLENBQVAsRUFBMkM7QUFDdkNLLFFBQUFBLE9BQU8sR0FBRyxJQUFJSyxJQUFKLENBQVMsQ0FBQ0YsTUFBTSxDQUFDLENBQUQsQ0FBaEIsRUFBcUJBLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWSxDQUFqQyxFQUFvQyxDQUFDQSxNQUFNLENBQUMsQ0FBRCxDQUEzQyxDQUFWO0FBQ0g7O0FBQ0QsVUFBSUosR0FBRyxLQUFLSSxNQUFNLEdBQUdKLEdBQUcsQ0FBQ0ssS0FBSixDQUFVVCxRQUFWLENBQWQsQ0FBUCxFQUEyQztBQUN2Q00sUUFBQUEsT0FBTyxHQUFHLElBQUlJLElBQUosQ0FBUyxDQUFDRixNQUFNLENBQUMsQ0FBRCxDQUFoQixFQUFxQkEsTUFBTSxDQUFDLENBQUQsQ0FBTixHQUFZLENBQWpDLEVBQW9DLENBQUNBLE1BQU0sQ0FBQyxDQUFELENBQTNDLENBQVY7QUFDSDs7QUFDRCxVQUFLQSxNQUFNLEdBQUdkLEtBQUssQ0FBQ2UsS0FBTixDQUFZVCxRQUFaLENBQWQsRUFBc0M7QUFDbENPLFFBQUFBLFNBQVMsR0FBRyxJQUFJRyxJQUFKLENBQVMsQ0FBQ0YsTUFBTSxDQUFDLENBQUQsQ0FBaEIsRUFBcUJBLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWSxDQUFqQyxFQUFvQyxDQUFDQSxNQUFNLENBQUMsQ0FBRCxDQUEzQyxDQUFaO0FBQ0g7O0FBRUQsYUFDSVQsT0FBTyxDQUFDSixJQUFSLENBQWFELEtBQWIsTUFBd0JXLE9BQU8sR0FBR0UsU0FBUyxJQUFJRixPQUFoQixHQUEwQixJQUF6RCxNQUFtRUMsT0FBTyxHQUFHQyxTQUFTLElBQUlELE9BQWhCLEdBQTBCLElBQXBHLENBREo7QUFHSCxLQXhCd0I7QUF5QnpCVixJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLG1CQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBekJlLEdBQTdCLEVBdlF5QixDQXNTekI7O0FBQ0F4QixFQUFBQSxPQUFPLENBQUNrQixZQUFSLENBQXFCLGFBQXJCLEVBQW9DO0FBQ2hDQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNDLEtBQVQsRUFBZ0JpQixPQUFoQixFQUF5QkMsZUFBekIsRUFBMEM7QUFDdEQsVUFBSUMsS0FBSyxHQUFHRCxlQUFlLENBQUM3QixRQUFoQixDQUF5QixDQUF6QixFQUE0QjhCLEtBQXhDO0FBQ0EsYUFBT0EsS0FBSyxDQUFDdEUsTUFBTixJQUFnQixDQUFoQixJQUFxQnNFLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBU0MsSUFBVCxJQUFpQkgsT0FBTyxHQUFHLElBQXZEO0FBQ0gsS0FKK0I7QUFLaENJLElBQUFBLGVBQWUsRUFBRSxTQUxlO0FBTWhDbkIsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSx3Q0FERTtBQUVOQyxNQUFBQSxFQUFFLEVBQUU7QUFGRTtBQU5zQixHQUFwQyxFQXZTeUIsQ0FtVHpCOztBQUNBeEIsRUFBQUEsT0FBTyxDQUFDa0IsWUFBUixDQUFxQixlQUFyQixFQUFzQztBQUNsQ0MsSUFBQUEsY0FBYyxFQUFFLHdCQUFTQyxLQUFULEVBQWdCc0IsT0FBaEIsRUFBeUI7QUFDckMsVUFBSUMsYUFBYSxHQUFHdkIsS0FBSyxDQUFDd0IsS0FBTixDQUFZLEdBQVosRUFBaUJDLEdBQWpCLEVBQXBCO0FBQ0EsVUFBSUMsVUFBVSxHQUFHSixPQUFPLENBQUNFLEtBQVIsQ0FBYyxJQUFkLENBQWpCO0FBQ0EsVUFBSUcsS0FBSyxHQUFHLEtBQVo7O0FBRUEsV0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixVQUFVLENBQUM3RSxNQUEvQixFQUF1QytFLENBQUMsRUFBeEMsRUFBNEM7QUFDeEMsWUFBSUwsYUFBYSxLQUFLRyxVQUFVLENBQUNFLENBQUQsQ0FBaEMsRUFBcUM7QUFDakNELFVBQUFBLEtBQUssR0FBRyxJQUFSO0FBQ0E7QUFDSDtBQUNKOztBQUVELGFBQU9BLEtBQVA7QUFDSCxLQWRpQztBQWVsQ3pCLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsbUNBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFmd0IsR0FBdEMsRUFwVHlCLENBeVV6Qjs7QUFDQXhCLEVBQUFBLE9BQU8sQ0FBQ2hDLEVBQVIsQ0FBVyxZQUFYLEVBQXlCLFlBQVc7QUFDaEMsUUFBSXlDLFFBQVEsR0FBRyxLQUFLQSxRQUFwQjtBQUFBLFFBQ0lDLElBQUksR0FBR0QsUUFBUSxDQUFDdEQsSUFBVCxDQUFjLE1BQWQsQ0FEWDtBQUFBLFFBRUk4RixNQUFNLEdBQUc1RyxDQUFDLENBQUMsUUFBRCxDQUFELENBQVk2QyxRQUFaLENBQXFCLGtCQUFyQixDQUZiO0FBQUEsUUFHSWdFLEtBSEo7O0FBS0EsUUFBSXhDLElBQUksSUFBSSxVQUFSLElBQXNCQSxJQUFJLElBQUksT0FBbEMsRUFBMkM7QUFDdkN3QyxNQUFBQSxLQUFLLEdBQUc3RyxDQUFDLG1CQUFXb0UsUUFBUSxDQUFDdEQsSUFBVCxDQUFjLE1BQWQsQ0FBWCxzQkFBVDs7QUFDQSxVQUFJLENBQUMrRixLQUFLLENBQUNyQyxJQUFOLENBQVcsbUJBQVgsRUFBZ0M1QyxNQUFyQyxFQUE2QztBQUN6Q2lGLFFBQUFBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRixNQUFaO0FBQ0g7QUFDSixLQUxELE1BS08sSUFBSXhDLFFBQVEsQ0FBQ0csUUFBVCxDQUFrQiwyQkFBbEIsQ0FBSixFQUFvRDtBQUN2RHNDLE1BQUFBLEtBQUssR0FBR3pDLFFBQVEsQ0FBQ0ksSUFBVCxDQUFjLFVBQWQsQ0FBUjs7QUFDQSxVQUFJLENBQUNxQyxLQUFLLENBQUNyQyxJQUFOLENBQVcsbUJBQVgsRUFBZ0M1QyxNQUFyQyxFQUE2QztBQUN6Q2lGLFFBQUFBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRixNQUFaO0FBQ0g7QUFDSixLQUxNLE1BS0EsSUFBSXZDLElBQUksSUFBSSxNQUFaLEVBQW9CO0FBQ3ZCd0MsTUFBQUEsS0FBSyxHQUFHekMsUUFBUSxDQUFDTyxPQUFULENBQWlCLGNBQWpCLENBQVI7O0FBQ0EsVUFBSSxDQUFDa0MsS0FBSyxDQUFDckMsSUFBTixDQUFXLG1CQUFYLEVBQWdDNUMsTUFBckMsRUFBNkM7QUFDekNpRixRQUFBQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUYsTUFBWjtBQUNIO0FBQ0osS0FMTSxNQUtBLElBQUl4QyxRQUFRLENBQUNPLE9BQVQsQ0FBaUIsc0JBQWpCLEVBQXlDL0MsTUFBN0MsRUFBcUQ7QUFDeERpRixNQUFBQSxLQUFLLEdBQUd6QyxRQUFRLENBQUNPLE9BQVQsQ0FBaUIsc0JBQWpCLENBQVI7O0FBQ0EsVUFBSSxDQUFDa0MsS0FBSyxDQUFDckMsSUFBTixDQUFXLG1CQUFYLEVBQWdDNUMsTUFBckMsRUFBNkM7QUFDekNpRixRQUFBQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUYsTUFBWjtBQUNIO0FBQ0osS0FMTSxNQUtBLElBQUl4QyxRQUFRLENBQUN0RCxJQUFULENBQWMsTUFBZCxLQUF5QixzQkFBN0IsRUFBcUQ7QUFDeEQrRixNQUFBQSxLQUFLLEdBQUd6QyxRQUFRLENBQUNRLE1BQVQsR0FBa0JKLElBQWxCLENBQXVCLGNBQXZCLENBQVI7O0FBQ0EsVUFBSSxDQUFDcUMsS0FBSyxDQUFDckMsSUFBTixDQUFXLG1CQUFYLEVBQWdDNUMsTUFBckMsRUFBNkM7QUFDekNpRixRQUFBQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUYsTUFBWjtBQUNIO0FBQ0o7QUFDSixHQWhDRCxFQTFVeUIsQ0E0V3pCOztBQUNBakQsRUFBQUEsT0FBTyxDQUFDaEMsRUFBUixDQUFXLGlCQUFYLEVBQThCLFlBQVc7QUFDckMsUUFBSXlDLFFBQVEsR0FBR3BFLENBQUMsQ0FBQyxLQUFLK0csT0FBTixDQUFoQjtBQUNILEdBRkQ7QUFJQS9HLEVBQUFBLENBQUMsQ0FBQyw0QkFBRCxDQUFELENBQWdDZ0gsT0FBaEMsR0FqWHlCLENBbVh6Qjs7QUFDQSxNQUFJaEgsQ0FBQyxDQUFDLGtCQUFELENBQUQsQ0FBc0I0QixNQUExQixFQUFrQztBQUM5QjVCLElBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixrQkFBeEIsRUFBNEMsVUFBQXNGLENBQUMsRUFBSTtBQUM3QyxVQUFNQyxLQUFLLEdBQUdsSCxDQUFDLENBQUNpSCxDQUFDLENBQUNFLGFBQUgsQ0FBZjtBQUNBLFVBQU1DLGFBQWEsR0FBR0YsS0FBSyxDQUFDdkMsT0FBTixDQUFjLGNBQWQsRUFBOEIwQyxJQUE5QixDQUFtQyxtQkFBbkMsQ0FBdEI7O0FBQ0EsVUFBSUgsS0FBSyxDQUFDM0MsUUFBTixDQUFlLFdBQWYsQ0FBSixFQUFpQztBQUM3QjJDLFFBQUFBLEtBQUssQ0FBQ25FLFdBQU4sQ0FBa0IsV0FBbEI7QUFDQXFFLFFBQUFBLGFBQWEsQ0FBQ0UsT0FBZCxDQUFzQixNQUF0QjtBQUNILE9BSEQsTUFHTztBQUNISixRQUFBQSxLQUFLLENBQUNyRSxRQUFOLENBQWUsV0FBZjtBQUNBdUUsUUFBQUEsYUFBYSxDQUFDRyxTQUFkLENBQXdCLE1BQXhCO0FBQ0g7QUFDSixLQVZEO0FBV0g7QUFFRDs7Ozs7Ozs7O0FBT0F2SCxFQUFBQSxDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQndILFNBQXBCLENBQThCLG1CQUE5QixFQUFtRDtBQUMvQ0MsSUFBQUEsb0JBQW9CLEVBQUUsSUFEeUI7QUFFL0NDLElBQUFBLGVBQWUsRUFBRTtBQUY4QixHQUFuRDtBQUtBOzs7OztBQUlBLE1BQUlDLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQVNDLEtBQVQsRUFBZ0I7QUFDL0IsUUFBSUMsSUFBSSxHQUFHLElBQVg7O0FBRUFBLElBQUFBLElBQUksQ0FBQ0MsSUFBTCxHQUFZLFVBQVNDLFNBQVQsRUFBb0I7QUFDNUJBLE1BQUFBLFNBQVMsQ0FBQ0MsSUFBVixDQUFlLFlBQVc7QUFDdEIsWUFBSWhJLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXVFLFFBQVIsQ0FBaUIsMkJBQWpCLENBQUosRUFBbUQ7QUFDL0M7QUFDSCxTQUZELE1BRU87QUFDSCxjQUFJMEQsWUFBWSxHQUFHakksQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRd0YsSUFBUixDQUFhLFFBQWIsQ0FBbkI7QUFDQSxjQUFJMEMsdUJBQUo7O0FBRUEsY0FBSUQsWUFBSixFQUFrQjtBQUNkQyxZQUFBQSx1QkFBdUIsR0FBRyxDQUExQixDQURjLENBQ2U7QUFDaEMsV0FGRCxNQUVPO0FBQ0hBLFlBQUFBLHVCQUF1QixHQUFHQyxRQUExQixDQURHLENBQ2lDO0FBQ3ZDOztBQUVEbkksVUFBQUEsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRb0ksT0FBUixDQUFnQjtBQUNaRixZQUFBQSx1QkFBdUIsRUFBRUEsdUJBRGI7QUFFWkcsWUFBQUEsWUFBWSxFQUFFLElBRkY7QUFHWkMsWUFBQUEsZ0JBQWdCLEVBQUUsT0FITjtBQUlaQyxZQUFBQSxRQUFRLEVBQUU7QUFDTkMsY0FBQUEsU0FBUyxFQUFFLHFCQUFXO0FBQ2xCLHVCQUFPLHVCQUFQO0FBQ0g7QUFISztBQUpFLFdBQWhCO0FBV0F4SSxVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVEyQixFQUFSLENBQVcsUUFBWCxFQUFxQixVQUFTc0YsQ0FBVCxFQUFZO0FBQzdCO0FBQ0FqSCxZQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQ0txSCxJQURMLDBCQUMyQnJILENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUStFLEtBRG5DLFVBRUswRCxLQUZMO0FBR0gsV0FMRDtBQU1IO0FBQ0osT0EvQkQ7QUFnQ0gsS0FqQ0Q7O0FBbUNBWixJQUFBQSxJQUFJLENBQUNhLE1BQUwsR0FBYyxVQUFTQyxXQUFULEVBQXNCO0FBQ2hDQSxNQUFBQSxXQUFXLENBQUNQLE9BQVosQ0FBb0IsU0FBcEI7QUFDQVAsTUFBQUEsSUFBSSxDQUFDQyxJQUFMLENBQVVhLFdBQVY7QUFDSCxLQUhEOztBQUtBZCxJQUFBQSxJQUFJLENBQUNDLElBQUwsQ0FBVUYsS0FBVjtBQUNILEdBNUNEOztBQThDQSxNQUFJZ0IsWUFBWSxHQUFHLElBQUlqQixZQUFKLENBQWlCM0gsQ0FBQyxDQUFDLFFBQUQsQ0FBbEIsQ0FBbkI7QUFFQSxNQUFNNkksd0JBQXdCLEdBQUc7QUFDN0JDLElBQUFBLFVBQVUsRUFBRSxVQURpQjtBQUU3QkMsSUFBQUEsZUFBZSxFQUFFO0FBRlksR0FBakM7QUFLQTs7Ozs7Ozs7O0FBUUEsTUFBSUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsR0FBVztBQUN4QixRQUFNQyxVQUFVLEdBQUdqSixDQUFDLENBQUMsZ0JBQUQsQ0FBcEI7QUFFQWlKLElBQUFBLFVBQVUsQ0FBQ2pCLElBQVgsQ0FBZ0IsWUFBVztBQUN2QixVQUFJdEMsT0FBTyxHQUFHMUYsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRd0YsSUFBUixDQUFhLFVBQWIsQ0FBZDtBQUNBLFVBQUlHLE9BQU8sR0FBRzNGLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXdGLElBQVIsQ0FBYSxVQUFiLENBQWQ7QUFDQSxVQUFNMEQsTUFBTSxHQUFHbEosQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRd0YsSUFBUixDQUFhLFVBQWIsQ0FBZjtBQUVBOztBQUNBLFVBQUlHLE9BQU8sS0FBSyxTQUFaLElBQXlCRCxPQUFPLEtBQUssU0FBekMsRUFBb0Q7QUFDaEQsWUFBTXlELFdBQVcsR0FBRyxJQUFJcEQsSUFBSixFQUFwQjtBQUNBLFlBQUlxRCxVQUFVLEdBQUdELFdBQVcsQ0FBQ0UsT0FBWixFQUFqQjtBQUNBRCxRQUFBQSxVQUFVLEdBQUcsRUFBYixHQUFtQkEsVUFBVSxHQUFHLE1BQU1BLFVBQVUsQ0FBQzdGLFFBQVgsRUFBdEMsR0FBK0Q2RixVQUEvRDtBQUNBLFlBQU1FLE9BQU8sR0FBR0YsVUFBVSxHQUFHLEdBQWIsSUFBb0JELFdBQVcsQ0FBQ0ksUUFBWixLQUF5QixDQUE3QyxJQUFrRCxHQUFsRCxHQUF3REosV0FBVyxDQUFDSyxXQUFaLEVBQXhFO0FBQ0E3RCxRQUFBQSxPQUFPLEtBQUssU0FBWixHQUF5QkEsT0FBTyxHQUFHMkQsT0FBbkMsR0FBK0M1RCxPQUFPLEdBQUc0RCxPQUF6RDtBQUNIOztBQUVELFVBQUlHLFdBQVcsR0FBRztBQUNkL0QsUUFBQUEsT0FBTyxFQUFFQSxPQUFPLElBQUksSUFETjtBQUVkQyxRQUFBQSxPQUFPLEVBQUVBLE9BQU8sSUFBSSxJQUZOO0FBR2QrRCxRQUFBQSxRQUFRLEVBQUUsb0JBQVc7QUFDakIxSixVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVEySixNQUFSO0FBQ0EzSixVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQ0syRSxPQURMLENBQ2EsUUFEYixFQUVLOUIsUUFGTCxDQUVjLFdBRmQ7QUFHSDtBQVJhLE9BQWxCOztBQVdBLFVBQUlxRyxNQUFKLEVBQVk7QUFDUk8sUUFBQUEsV0FBVyxDQUFDLFlBQUQsQ0FBWCxHQUE0QixJQUE1QjtBQUNBQSxRQUFBQSxXQUFXLENBQUMsV0FBRCxDQUFYLEdBQTJCLFNBQTNCO0FBQ0FBLFFBQUFBLFdBQVcsQ0FBQyxhQUFELENBQVgsR0FBNkIsSUFBN0I7QUFDSDs7QUFFRHpKLE1BQUFBLENBQUMsQ0FBQzBCLE1BQUYsQ0FBUyxJQUFULEVBQWUrSCxXQUFmLEVBQTRCWix3QkFBNUI7QUFFQTdJLE1BQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUWlKLFVBQVIsQ0FBbUJRLFdBQW5CO0FBQ0gsS0FsQ0QsRUFId0IsQ0F1Q3hCOztBQUNBekosSUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWTBCLEVBQVosQ0FBZSxPQUFmLEVBQXdCLGdCQUF4QixFQUEwQyxZQUFNO0FBQzVDO0FBQ0FpSSxNQUFBQSxVQUFVLENBQUMsWUFBTTtBQUNiLFlBQUk1SixDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQnFILElBQXBCLENBQXlCLFFBQXpCLEVBQW1DekYsTUFBdkMsRUFBK0M7QUFDM0M1QixVQUFBQSxDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUNLcUgsSUFETCxDQUNVLFFBRFYsRUFFS2UsT0FGTCxDQUVhO0FBQ0xDLFlBQUFBLFlBQVksRUFBRSxJQURUO0FBRUxDLFlBQUFBLGdCQUFnQixFQUFFLE9BRmI7QUFHTEosWUFBQUEsdUJBQXVCLEVBQUVDO0FBSHBCLFdBRmI7QUFPSDtBQUNKLE9BVlMsRUFVUCxFQVZPLENBQVY7QUFXSCxLQWJEO0FBY0gsR0F0REQ7O0FBd0RBLE1BQUljLFVBQVUsR0FBRyxJQUFJRCxVQUFKLEVBQWpCO0FBRUEsTUFBTWEsV0FBVyxHQUFHN0osQ0FBQyxDQUFDLGlCQUFELENBQXJCO0FBQ0EsTUFBTThKLFVBQVUsR0FBRzlKLENBQUMsQ0FBQyxnQkFBRCxDQUFwQjtBQUVBQSxFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsY0FBeEIsRUFBd0MsWUFBTTtBQUMxQ29JLElBQUFBLFNBQVMsQ0FBQ0YsV0FBRCxDQUFUO0FBQ0gsR0FGRDtBQUlBN0osRUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWTBCLEVBQVosQ0FBZSxPQUFmLEVBQXdCLGdCQUF4QixFQUEwQyxZQUFNO0FBQzVDcUksSUFBQUEsU0FBUyxDQUFDSCxXQUFELENBQVQ7QUFDSCxHQUZEO0FBSUE3SixFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsY0FBeEIsRUFBd0MsVUFBQXNGLENBQUMsRUFBSTtBQUN6Q0EsSUFBQUEsQ0FBQyxDQUFDZ0QsY0FBRjtBQUNBRixJQUFBQSxTQUFTLENBQUNELFVBQUQsQ0FBVDtBQUNILEdBSEQ7QUFLQTlKLEVBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixnQkFBeEIsRUFBMEMsWUFBTTtBQUM1Q3FJLElBQUFBLFNBQVMsQ0FBQ0YsVUFBRCxDQUFUO0FBQ0gsR0FGRDtBQUlBOzs7OztBQUlBLFdBQVNDLFNBQVQsQ0FBbUJHLFdBQW5CLEVBQWdDO0FBQzVCQSxJQUFBQSxXQUFXLENBQUNySCxRQUFaLENBQXFCLFdBQXJCLEVBQWtDZCxVQUFsQyxDQUE2QyxjQUE3QztBQUNBL0IsSUFBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVNkMsUUFBVixDQUFtQixhQUFuQjtBQUNBc0gsSUFBQUEsWUFBWTtBQUNmO0FBRUQ7Ozs7OztBQUlBLFdBQVNILFNBQVQsQ0FBbUJFLFdBQW5CLEVBQWdDO0FBQzVCQSxJQUFBQSxXQUFXLENBQUNuSSxVQUFaLENBQXVCLGVBQXZCLEVBQXdDLFlBQU07QUFDMUNtSSxNQUFBQSxXQUFXLENBQUNuSCxXQUFaLENBQXdCLFdBQXhCO0FBQ0EvQyxNQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVUrQyxXQUFWLENBQXNCLGFBQXRCO0FBQ0FxSCxNQUFBQSxjQUFjO0FBQ2pCLEtBSkQ7QUFLSDtBQUVEOzs7OztBQUdBLFdBQVNBLGNBQVQsR0FBMEI7QUFDdEJwSyxJQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVUrQyxXQUFWLENBQXNCLFdBQXRCO0FBQ0g7QUFFRDs7Ozs7O0FBSUEsV0FBU29ILFlBQVQsR0FBd0I7QUFDcEJuSyxJQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVU2QyxRQUFWLENBQW1CLFdBQW5CO0FBQ0gsR0Foa0J3QixDQWtrQnpCOzs7QUFDQSxNQUFNd0gsT0FBTyxHQUFHckssQ0FBQyxDQUFDLFlBQUQsQ0FBakI7QUFFQUEsRUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWTBCLEVBQVosQ0FBZSxXQUFmLEVBQTRCLHlCQUE1QixFQUF1RCxVQUFBc0YsQ0FBQyxFQUFJO0FBQ3hELFFBQU1DLEtBQUssR0FBR2xILENBQUMsQ0FBQ2lILENBQUMsQ0FBQ0UsYUFBSCxDQUFmO0FBQ0EsUUFBTW1ELFFBQVEsR0FBR3BELEtBQUssQ0FBQ3BHLElBQU4sQ0FBVyxlQUFYLENBQWpCO0FBQ0FkLElBQUFBLENBQUMsQ0FBQyxxQkFBRCxDQUFELENBQXlCK0MsV0FBekIsQ0FBcUMsV0FBckM7QUFDQXNILElBQUFBLE9BQU8sQ0FBQ3RILFdBQVIsQ0FBb0IsV0FBcEI7QUFDQS9DLElBQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVStDLFdBQVYsQ0FBc0IsYUFBdEI7O0FBQ0EsUUFBSXVILFFBQUosRUFBYztBQUNWLFVBQU1DLGlCQUFpQixHQUFHdkssQ0FBQyxvQ0FBNkJzSyxRQUE3QixRQUEzQjtBQUNBQyxNQUFBQSxpQkFBaUIsQ0FBQzFILFFBQWxCLENBQTJCLFdBQTNCO0FBQ0F3SCxNQUFBQSxPQUFPLENBQUN4SCxRQUFSLENBQWlCLFdBQWpCO0FBQ0E3QyxNQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVU2QyxRQUFWLENBQW1CLGFBQW5CO0FBQ0EySCxNQUFBQSxjQUFjO0FBQ2pCO0FBQ0osR0FiRDtBQWVBeEssRUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWTBCLEVBQVosQ0FBZSxZQUFmLEVBQTZCLFlBQTdCLEVBQTJDLFVBQUFzRixDQUFDLEVBQUk7QUFDNUMsUUFBSWpILENBQUMsQ0FBQyxxQkFBRCxDQUFELENBQXlCdUUsUUFBekIsQ0FBa0MsV0FBbEMsQ0FBSixFQUFvRDtBQUNoRHZFLE1BQUFBLENBQUMsQ0FBQyxxQkFBRCxDQUFELENBQXlCK0MsV0FBekIsQ0FBcUMsV0FBckM7QUFDQXNILE1BQUFBLE9BQU8sQ0FBQ3RILFdBQVIsQ0FBb0IsV0FBcEI7QUFDQS9DLE1BQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVStDLFdBQVYsQ0FBc0IsYUFBdEI7QUFDQXlILE1BQUFBLGNBQWM7QUFDakI7QUFDSixHQVBELEVBcGxCeUIsQ0E2bEJ6Qjs7QUFDQSxXQUFTQSxjQUFULEdBQTBCO0FBQ3RCSCxJQUFBQSxPQUFPLENBQUNJLElBQVI7QUFDQWIsSUFBQUEsVUFBVSxDQUFDLFlBQU07QUFBQ1MsTUFBQUEsT0FBTyxDQUFDSyxJQUFSO0FBQWUsS0FBdkIsRUFBeUIsQ0FBekIsQ0FBVjtBQUNILEdBam1Cd0IsQ0FtbUJ6Qjs7O0FBRUEsTUFBSTFLLENBQUMsQ0FBQyxlQUFELENBQUQsQ0FBbUI0QixNQUF2QixFQUErQjtBQUMzQjVCLElBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixlQUF4QixFQUF5QyxVQUFBc0YsQ0FBQyxFQUFJO0FBQzFDO0FBQ0EsVUFBTUMsS0FBSyxHQUFHbEgsQ0FBQyxDQUFDaUgsQ0FBQyxDQUFDRSxhQUFILENBQWY7QUFFQSxVQUFJRCxLQUFLLENBQUMzQyxRQUFOLENBQWUsV0FBZixDQUFKLEVBQWlDO0FBRWpDLFVBQU1vRyxLQUFLLEdBQUd6RCxLQUFLLENBQUN2QyxPQUFOLENBQWMsVUFBZCxDQUFkO0FBQ0EsVUFBTWlHLFVBQVUsR0FBR0QsS0FBSyxDQUFDdEQsSUFBTixDQUFXLGVBQVgsQ0FBbkI7QUFDQSxVQUFNd0QsVUFBVSxHQUFHRixLQUFLLENBQUN0RCxJQUFOLENBQVcsZUFBWCxDQUFuQixDQVIwQyxDQVUxQzs7QUFDQXVELE1BQUFBLFVBQVUsQ0FBQzdILFdBQVgsQ0FBdUIsV0FBdkI7QUFDQThILE1BQUFBLFVBQVUsQ0FBQzlILFdBQVgsQ0FBdUIsV0FBdkIsRUFaMEMsQ0FjMUM7O0FBQ0EsVUFBSStILGlCQUFpQixHQUFHRCxVQUFVLENBQUN4RCxJQUFYLENBQWdCLGlCQUFoQixDQUF4Qjs7QUFDQSxVQUFJeUQsaUJBQWlCLENBQUNsSixNQUF0QixFQUE4QjtBQUMxQmtKLFFBQUFBLGlCQUFpQixDQUFDQyxJQUFsQixDQUF1QixlQUF2QixFQUF3QyxLQUF4QztBQUNBRCxRQUFBQSxpQkFBaUIsQ0FBQ0MsSUFBbEIsQ0FBdUIsVUFBdkIsRUFBbUMsS0FBbkM7QUFDQUQsUUFBQUEsaUJBQWlCLENBQUNFLEdBQWxCLENBQXNCLEVBQXRCO0FBQ0gsT0FwQnlDLENBc0IxQzs7O0FBQ0E5RCxNQUFBQSxLQUFLLENBQUNyRSxRQUFOLENBQWUsV0FBZjtBQUNBLFVBQU1vSSxTQUFTLEdBQUdqTCxDQUFDLENBQUNrSCxLQUFLLENBQUMxQixJQUFOLENBQVcsS0FBWCxDQUFELENBQW5CO0FBQ0F5RixNQUFBQSxTQUFTLENBQUNwSSxRQUFWLENBQW1CLFdBQW5CLEVBekIwQyxDQTJCMUM7O0FBQ0FpSSxNQUFBQSxpQkFBaUIsR0FBR0csU0FBUyxDQUFDNUQsSUFBVixDQUFlLGlCQUFmLENBQXBCOztBQUNBLFVBQUl5RCxpQkFBaUIsQ0FBQ2xKLE1BQXRCLEVBQThCO0FBQzFCa0osUUFBQUEsaUJBQWlCLENBQUNDLElBQWxCLENBQXVCLGVBQXZCLEVBQXdDLElBQXhDO0FBQ0FELFFBQUFBLGlCQUFpQixDQUFDQyxJQUFsQixDQUF1QixVQUF2QixFQUFtQyxJQUFuQztBQUNIO0FBQ0osS0FqQ0Q7QUFrQ0g7QUFFRDs7Ozs7Ozs7O0FBMW9CeUIsTUFrcEJuQkcsT0FscEJtQjtBQUFBO0FBQUE7QUFtcEJyQjs7Ozs7Ozs7O0FBU0EsdUJBQThGO0FBQUEscUZBQUosRUFBSTtBQUFBLFVBQWhGdEUsTUFBZ0YsUUFBaEZBLE1BQWdGO0FBQUEsNEJBQXhFN0IsS0FBd0U7QUFBQSxVQUF4RUEsS0FBd0UsMkJBQWhFLENBQWdFO0FBQUEsMEJBQTdETyxHQUE2RDtBQUFBLFVBQTdEQSxHQUE2RCx5QkFBdkQsQ0FBQzZDLFFBQXNEO0FBQUEsMEJBQTVDMUMsR0FBNEM7QUFBQSxVQUE1Q0EsR0FBNEMseUJBQXRDMEMsUUFBc0M7QUFBQSwyQkFBNUJnRCxJQUE0QjtBQUFBLFVBQTVCQSxJQUE0QiwwQkFBckIsQ0FBcUI7QUFBQSxVQUFsQkMsU0FBa0IsUUFBbEJBLFNBQWtCOztBQUFBOztBQUMxRixXQUFLeEUsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsV0FBS3lFLFFBQUwsR0FBZ0I7QUFDWkMsUUFBQUEsSUFBSSxFQUFFdEwsQ0FBQyxDQUFDLG9CQUFELEVBQXVCLEtBQUs0RyxNQUE1QixDQURLO0FBRVoyRSxRQUFBQSxJQUFJLEVBQUV2TCxDQUFDLENBQUMsb0JBQUQsRUFBdUIsS0FBSzRHLE1BQTVCLENBRks7QUFHWjRFLFFBQUFBLE1BQU0sRUFBRXhMLENBQUMsQ0FBQyxpQkFBRCxFQUFvQixLQUFLNEcsTUFBekI7QUFIRyxPQUFoQjtBQU1BLFdBQUs3QixLQUFMLEdBQWEsQ0FBQ0EsS0FBZDtBQUNBLFdBQUtPLEdBQUwsR0FBVyxDQUFDQSxHQUFaO0FBQ0EsV0FBS0csR0FBTCxHQUFXLENBQUNBLEdBQVo7QUFDQSxXQUFLMEYsSUFBTCxHQUFZLENBQUNBLElBQWI7QUFDQSxXQUFLQyxTQUFMLEdBQWlCLENBQUNBLFNBQWxCO0FBQ0g7QUFFRDs7Ozs7QUEzcUJxQjtBQUFBO0FBQUEsNkJBOHFCZDtBQUNILGFBQUtLLGFBQUw7QUFDSDtBQUVEOzs7O0FBbHJCcUI7QUFBQTtBQUFBLHNDQXFyQkw7QUFDWixhQUFLSixRQUFMLENBQWNDLElBQWQsQ0FBbUJQLElBQW5CLENBQXdCLFVBQXhCLEVBQW9DLEtBQXBDO0FBQ0EsYUFBS00sUUFBTCxDQUFjRSxJQUFkLENBQW1CUixJQUFuQixDQUF3QixVQUF4QixFQUFvQyxLQUFwQzs7QUFFQSxZQUFJLEtBQUtoRyxLQUFMLEdBQWEsS0FBS08sR0FBTCxHQUFXLEtBQUs2RixJQUFqQyxFQUF1QztBQUNuQyxlQUFLRSxRQUFMLENBQWNDLElBQWQsQ0FBbUJQLElBQW5CLENBQXdCLFVBQXhCLEVBQW9DLElBQXBDO0FBQ0g7O0FBRUQsWUFBSSxLQUFLaEcsS0FBTCxHQUFhLEtBQUtVLEdBQUwsR0FBVyxLQUFLMEYsSUFBakMsRUFBdUM7QUFDbkMsZUFBS0UsUUFBTCxDQUFjRSxJQUFkLENBQW1CUixJQUFuQixDQUF3QixVQUF4QixFQUFvQyxJQUFwQztBQUNIO0FBQ0o7QUFFRDs7OztBQWxzQnFCO0FBQUE7QUFBQSx1Q0Fxc0JKO0FBQ2IsYUFBS00sUUFBTCxDQUFjQyxJQUFkLENBQW1CUCxJQUFuQixDQUF3QixVQUF4QixFQUFvQyxJQUFwQztBQUNBLGFBQUtNLFFBQUwsQ0FBY0UsSUFBZCxDQUFtQlIsSUFBbkIsQ0FBd0IsVUFBeEIsRUFBb0MsSUFBcEM7QUFDQSxhQUFLTSxRQUFMLENBQWNHLE1BQWQsQ0FBcUJULElBQXJCLENBQTBCLFVBQTFCLEVBQXNDLElBQXRDO0FBQ0EsYUFBS25FLE1BQUwsQ0FBWS9ELFFBQVosQ0FBcUIsYUFBckI7QUFDSDtBQUVEOzs7O0FBNXNCcUI7QUFBQTtBQUFBLHNDQStzQkw7QUFDWixhQUFLaUYsSUFBTDtBQUNBLGFBQUt1RCxRQUFMLENBQWNHLE1BQWQsQ0FBcUJULElBQXJCLENBQTBCLFVBQTFCLEVBQXNDLEtBQXRDO0FBQ0EsYUFBS25FLE1BQUwsQ0FBWTdELFdBQVosQ0FBd0IsYUFBeEI7QUFDSDtBQUVEOzs7Ozs7QUFydEJxQjtBQUFBO0FBQUEsa0NBMHRCVGdDLEtBMXRCUyxFQTB0QkY7QUFDZixhQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDQSxhQUFLNkIsTUFBTCxDQUFZOUYsSUFBWixDQUFpQixZQUFqQixFQUErQmlFLEtBQS9CO0FBQ0EsYUFBS3NHLFFBQUwsQ0FBY0csTUFBZCxDQUFxQjFLLElBQXJCLENBQTBCLE9BQTFCLEVBQW1DaUUsS0FBbkM7QUFDQSxhQUFLc0csUUFBTCxDQUFjRyxNQUFkLENBQXFCUixHQUFyQixDQUF5QmpHLEtBQXpCO0FBQ0g7QUFFRDs7Ozs7O0FBanVCcUI7QUFBQTtBQUFBLGdDQXN1QlhBLEtBdHVCVyxFQXN1Qko7QUFDYixhQUFLTyxHQUFMLEdBQVdQLEtBQVg7QUFDQSxhQUFLNkIsTUFBTCxDQUFZOUYsSUFBWixDQUFpQixVQUFqQixFQUE2QmlFLEtBQTdCO0FBQ0g7QUFFRDs7Ozs7O0FBM3VCcUI7QUFBQTtBQUFBLGdDQWd2QlhBLEtBaHZCVyxFQWd2Qko7QUFDYixhQUFLVSxHQUFMLEdBQVdWLEtBQVg7QUFDQSxhQUFLNkIsTUFBTCxDQUFZOUYsSUFBWixDQUFpQixVQUFqQixFQUE2QmlFLEtBQTdCO0FBQ0g7QUFFRDs7OztBQXJ2QnFCO0FBQUE7O0FBMHZCckI7Ozs7OztBQTF2QnFCLGtDQWd3QkY2QixNQWh3QkUsRUFnd0JNO0FBQ3ZCLGVBQU9zRSxPQUFPLENBQUNRLFNBQVIsQ0FBa0JyRSxJQUFsQixDQUF1QixVQUFBc0UsT0FBTztBQUFBLGlCQUFJQSxPQUFPLENBQUMvRSxNQUFSLENBQWVnRixFQUFmLENBQWtCaEYsTUFBbEIsQ0FBSjtBQUFBLFNBQTlCLENBQVA7QUFDSDtBQUVEOzs7Ozs7QUFwd0JxQjtBQUFBO0FBQUEsK0JBeXdCb0I7QUFBQSxZQUEzQmlGLFNBQTJCLHVFQUFmN0wsQ0FBQyxDQUFDLFVBQUQsQ0FBYztBQUNyQzZMLFFBQUFBLFNBQVMsQ0FBQzdELElBQVYsQ0FBZSxVQUFDOEQsS0FBRCxFQUFRQyxLQUFSLEVBQWtCO0FBQzdCLGNBQU1uRixNQUFNLEdBQUc1RyxDQUFDLENBQUMrTCxLQUFELENBQWhCO0FBRUEsY0FBSWIsT0FBTyxDQUFDYyxXQUFSLENBQW9CcEYsTUFBcEIsQ0FBSixFQUFpQztBQUVqQyxjQUFNK0UsT0FBTyxHQUFHLElBQUlULE9BQUosQ0FBWTtBQUN4QnRFLFlBQUFBLE1BQU0sRUFBTkEsTUFEd0I7QUFFeEI3QixZQUFBQSxLQUFLLEVBQUU2QixNQUFNLENBQUM5RixJQUFQLENBQVksWUFBWixDQUZpQjtBQUd4QndFLFlBQUFBLEdBQUcsRUFBRXNCLE1BQU0sQ0FBQzlGLElBQVAsQ0FBWSxVQUFaLENBSG1CO0FBSXhCMkUsWUFBQUEsR0FBRyxFQUFFbUIsTUFBTSxDQUFDOUYsSUFBUCxDQUFZLFVBQVosQ0FKbUI7QUFLeEJxSyxZQUFBQSxJQUFJLEVBQUV2RSxNQUFNLENBQUM5RixJQUFQLENBQVksV0FBWixDQUxrQjtBQU14QnNLLFlBQUFBLFNBQVMsRUFBRXhFLE1BQU0sQ0FBQzlGLElBQVAsQ0FBWSxnQkFBWjtBQU5hLFdBQVosQ0FBaEI7QUFTQThGLFVBQUFBLE1BQU0sQ0FBQ3JDLFFBQVAsQ0FBZ0IsYUFBaEIsSUFBaUNvSCxPQUFPLENBQUNNLGNBQVIsRUFBakMsR0FBNEROLE9BQU8sQ0FBQzdELElBQVIsRUFBNUQ7QUFFQW9ELFVBQUFBLE9BQU8sQ0FBQ1EsU0FBUixDQUFrQlEsSUFBbEIsQ0FBdUJQLE9BQXZCO0FBQ0gsU0FqQkQ7QUFrQkg7QUFFRDs7Ozs7O0FBOXhCcUI7QUFBQTtBQUFBLCtCQW15Qm9CO0FBQUEsWUFBM0JFLFNBQTJCLHVFQUFmN0wsQ0FBQyxDQUFDLFVBQUQsQ0FBYztBQUNyQzZMLFFBQUFBLFNBQVMsQ0FBQzdELElBQVYsQ0FBZSxVQUFDOEQsS0FBRCxFQUFRQyxLQUFSLEVBQWtCO0FBQzdCLGNBQU1uRixNQUFNLEdBQUc1RyxDQUFDLENBQUMrTCxLQUFELENBQWhCO0FBRUEsY0FBTUksWUFBWSxHQUFHakIsT0FBTyxDQUFDUSxTQUFSLENBQWtCVSxTQUFsQixDQUE0QixVQUFBVCxPQUFPO0FBQUEsbUJBQUlBLE9BQU8sQ0FBQy9FLE1BQVIsQ0FBZWdGLEVBQWYsQ0FBa0JoRixNQUFsQixDQUFKO0FBQUEsV0FBbkMsQ0FBckI7QUFFQXNFLFVBQUFBLE9BQU8sQ0FBQ1EsU0FBUixDQUFrQlcsTUFBbEIsQ0FBeUJGLFlBQXpCLEVBQXVDLENBQXZDO0FBQ0gsU0FORDtBQU9IO0FBM3lCb0I7O0FBQUE7QUFBQTs7QUFBQSxrQkFrcEJuQmpCLE9BbHBCbUIsZUF3dkJGLEVBeHZCRTs7QUE4eUJ6QmxMLEVBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixvQkFBeEIsRUFBOEMySyxjQUE5QztBQUNBdE0sRUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWTBCLEVBQVosQ0FBZSxPQUFmLEVBQXdCLG9CQUF4QixFQUE4QzRLLGNBQTlDO0FBQ0F2TSxFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsaUJBQXhCLEVBQTJDNkssV0FBM0M7QUFFQTs7QUFDQSxNQUFJQyxRQUFRLEdBQUd2QixPQUFPLENBQUN3QixNQUFSLEVBQWY7QUFFQTs7Ozs7O0FBS0EsV0FBU0osY0FBVCxDQUF3QnJGLENBQXhCLEVBQTJCO0FBQUEsUUFDZkUsYUFEZSxHQUNHRixDQURILENBQ2ZFLGFBRGU7QUFFdkIsUUFBTXdGLE9BQU8sR0FBRzNNLENBQUMsQ0FBQ21ILGFBQUQsQ0FBakI7QUFDQSxRQUFNUCxNQUFNLEdBQUcrRixPQUFPLENBQUNoSSxPQUFSLENBQWdCLFVBQWhCLENBQWY7QUFDQSxRQUFNZ0gsT0FBTyxHQUFHVCxPQUFPLENBQUNjLFdBQVIsQ0FBb0JwRixNQUFwQixDQUFoQjtBQUVBLFFBQUk3QixLQUFLLEdBQUc0RyxPQUFPLENBQUM1RyxLQUFSLEdBQWdCNEcsT0FBTyxDQUFDUixJQUFwQzs7QUFFQSxRQUFJUSxPQUFPLENBQUNQLFNBQVosRUFBdUI7QUFDbkJyRyxNQUFBQSxLQUFLLEdBQUc1QixVQUFVLENBQUM0QixLQUFLLENBQUM2SCxPQUFOLENBQWNqQixPQUFPLENBQUNQLFNBQXRCLENBQUQsQ0FBbEI7QUFDSDs7QUFFRE8sSUFBQUEsT0FBTyxDQUFDa0IsV0FBUixDQUFvQjlILEtBQXBCO0FBRUE0RyxJQUFBQSxPQUFPLENBQUNGLGFBQVI7QUFDSDtBQUVEOzs7Ozs7O0FBS0EsV0FBU2MsY0FBVCxDQUF3QnRGLENBQXhCLEVBQTJCO0FBQUEsUUFDZkUsYUFEZSxHQUNHRixDQURILENBQ2ZFLGFBRGU7QUFFdkIsUUFBTXdGLE9BQU8sR0FBRzNNLENBQUMsQ0FBQ21ILGFBQUQsQ0FBakI7QUFDQSxRQUFNUCxNQUFNLEdBQUcrRixPQUFPLENBQUNoSSxPQUFSLENBQWdCLFVBQWhCLENBQWY7QUFDQSxRQUFNZ0gsT0FBTyxHQUFHVCxPQUFPLENBQUNjLFdBQVIsQ0FBb0JwRixNQUFwQixDQUFoQjtBQUVBLFFBQUk3QixLQUFLLEdBQUc0RyxPQUFPLENBQUM1RyxLQUFSLEdBQWdCNEcsT0FBTyxDQUFDUixJQUFwQzs7QUFFQSxRQUFJUSxPQUFPLENBQUNQLFNBQVosRUFBdUI7QUFDbkJyRyxNQUFBQSxLQUFLLEdBQUc1QixVQUFVLENBQUM0QixLQUFLLENBQUM2SCxPQUFOLENBQWNqQixPQUFPLENBQUNQLFNBQXRCLENBQUQsQ0FBbEI7QUFDSDs7QUFFRE8sSUFBQUEsT0FBTyxDQUFDa0IsV0FBUixDQUFvQjlILEtBQXBCO0FBRUE0RyxJQUFBQSxPQUFPLENBQUNGLGFBQVI7QUFDSDtBQUVEOzs7Ozs7O0FBS0EsV0FBU2UsV0FBVCxDQUFxQnZGLENBQXJCLEVBQXdCO0FBQUEsUUFDWkUsYUFEWSxHQUNNRixDQUROLENBQ1pFLGFBRFk7QUFFcEIsUUFBTXdGLE9BQU8sR0FBRzNNLENBQUMsQ0FBQ21ILGFBQUQsQ0FBakI7QUFDQSxRQUFNUCxNQUFNLEdBQUcrRixPQUFPLENBQUNoSSxPQUFSLENBQWdCLFVBQWhCLENBQWY7QUFDQSxRQUFNZ0gsT0FBTyxHQUFHVCxPQUFPLENBQUNjLFdBQVIsQ0FBb0JwRixNQUFwQixDQUFoQjtBQUpvQixRQUtaNEUsTUFMWSxHQUtERyxPQUFPLENBQUNOLFFBTFAsQ0FLWkcsTUFMWTtBQU9wQixRQUFJekcsS0FBSyxHQUFHLENBQUN5RyxNQUFNLENBQUNSLEdBQVAsRUFBYjs7QUFFQSxRQUFJLENBQUNRLE1BQU0sQ0FBQ1IsR0FBUCxHQUFhcEosTUFBZCxJQUF3Qm1ELEtBQUssR0FBRzRHLE9BQU8sQ0FBQ3JHLEdBQXhDLElBQStDUCxLQUFLLEdBQUc0RyxPQUFPLENBQUNsRyxHQUFuRSxFQUF3RTtBQUNqRVYsTUFBQUEsS0FEaUUsR0FDdkQ0RyxPQUR1RCxDQUNqRTVHLEtBRGlFO0FBRXZFOztBQUVENEcsSUFBQUEsT0FBTyxDQUFDa0IsV0FBUixDQUFvQjlILEtBQXBCO0FBRUE0RyxJQUFBQSxPQUFPLENBQUNGLGFBQVI7QUFDSDs7QUFFRHFCLEVBQUFBLGFBQWE7QUFFYjlNLEVBQUFBLENBQUMsQ0FBQ2lCLE1BQUQsQ0FBRCxDQUFVVSxFQUFWLENBQWEsUUFBYixFQUF1Qm1MLGFBQXZCLEVBMTNCeUIsQ0E0M0J6Qjs7QUFDQSxXQUFTQSxhQUFULEdBQXlCO0FBQ3JCO0FBQ0EsUUFBTUMsYUFBYSxHQUFHL00sQ0FBQyxDQUFDLG1CQUFELENBQXZCOztBQUNBLFFBQUkrTSxhQUFhLENBQUNuTCxNQUFkLElBQXdCLENBQUNtTCxhQUFhLENBQUN4SSxRQUFkLENBQXVCLG1CQUF2QixDQUE3QixFQUEwRTtBQUN0RXdJLE1BQUFBLGFBQWEsQ0FBQ0MsS0FBZCxDQUFvQjtBQUNoQkMsUUFBQUEsTUFBTSxFQUFFLEtBRFE7QUFFaEJDLFFBQUFBLFFBQVEsRUFBRSxJQUZNO0FBR2hCQyxRQUFBQSxZQUFZLEVBQUUsQ0FIRTtBQUloQkMsUUFBQUEsVUFBVSxFQUFFLEtBSkk7QUFLaEJDLFFBQUFBLGFBQWEsRUFBRSxJQUxDO0FBTWhCQyxRQUFBQSxXQUFXLEVBQUUsSUFORztBQU9oQkMsUUFBQUEsVUFBVSxFQUFFLENBQ1I7QUFDSUMsVUFBQUEsVUFBVSxFQUFFLEdBRGhCO0FBRUlDLFVBQUFBLFFBQVEsRUFBRSxDQUNOO0FBRE07QUFGZCxTQURRLEVBT1I7QUFDSUQsVUFBQUEsVUFBVSxFQUFFLElBRGhCO0FBRUlDLFVBQUFBLFFBQVEsRUFBRTtBQUZkLFNBUFE7QUFQSSxPQUFwQjtBQW9CSCxLQXhCb0IsQ0EwQnJCOzs7QUFDQSxRQUFNQyxjQUFjLEdBQUcxTixDQUFDLENBQUMsb0JBQUQsQ0FBeEI7O0FBQ0EsUUFBSTBOLGNBQWMsQ0FBQzlMLE1BQWYsSUFBeUIsQ0FBQzhMLGNBQWMsQ0FBQ25KLFFBQWYsQ0FBd0IsbUJBQXhCLENBQTlCLEVBQTRFO0FBQ3hFbUosTUFBQUEsY0FBYyxDQUFDVixLQUFmLENBQXFCO0FBQ2pCQyxRQUFBQSxNQUFNLEVBQUUsS0FEUztBQUVqQkMsUUFBQUEsUUFBUSxFQUFFLElBRk87QUFHakJDLFFBQUFBLFlBQVksRUFBRSxDQUhHO0FBSWpCQyxRQUFBQSxVQUFVLEVBQUUsSUFKSztBQUtqQkMsUUFBQUEsYUFBYSxFQUFFLElBTEU7QUFNakJDLFFBQUFBLFdBQVcsRUFBRSxJQU5JO0FBT2pCQyxRQUFBQSxVQUFVLEVBQUUsQ0FDUjtBQUNJQyxVQUFBQSxVQUFVLEVBQUUsR0FEaEI7QUFFSUMsVUFBQUEsUUFBUSxFQUFFO0FBRmQsU0FEUTtBQVBLLE9BQXJCLEVBRHdFLENBZ0J4RTs7QUFDQUMsTUFBQUEsY0FBYyxDQUNUckcsSUFETCxDQUNVLGVBRFYsRUFFS0EsSUFGTCxDQUVVLE9BRlYsRUFHSzBELElBSEwsQ0FHVSxTQUhWLEVBR3FCLElBSHJCLEVBakJ3RSxDQXNCeEU7O0FBQ0EyQyxNQUFBQSxjQUFjLENBQUMvTCxFQUFmLENBQWtCLGFBQWxCLEVBQWlDLFlBQU07QUFDbkMrTCxRQUFBQSxjQUFjLENBQ1RyRyxJQURMLENBQ1UsZUFEVixFQUVLQSxJQUZMLENBRVUsT0FGVixFQUdLMEQsSUFITCxDQUdVLFNBSFYsRUFHcUIsSUFIckI7QUFJSCxPQUxEO0FBTUgsS0F6RG9CLENBMkRyQjs7O0FBQ0EsUUFBTTRDLG1CQUFtQixHQUFHM04sQ0FBQyxDQUFDLHlCQUFELENBQTdCOztBQUNBLFFBQUkyTixtQkFBbUIsQ0FBQy9MLE1BQXBCLElBQThCLENBQUMrTCxtQkFBbUIsQ0FBQ3BKLFFBQXBCLENBQTZCLG1CQUE3QixDQUFuQyxFQUFzRjtBQUNsRm9KLE1BQUFBLG1CQUFtQixDQUFDWCxLQUFwQixDQUEwQjtBQUN0QkMsUUFBQUEsTUFBTSxFQUFFLEtBRGM7QUFFdEJDLFFBQUFBLFFBQVEsRUFBRSxLQUZZO0FBR3RCQyxRQUFBQSxZQUFZLEVBQUUsQ0FIUTtBQUl0QkMsUUFBQUEsVUFBVSxFQUFFLElBSlU7QUFLdEJRLFFBQUFBLGFBQWEsRUFBRSxHQUxPO0FBTXRCUCxRQUFBQSxhQUFhLEVBQUUsS0FOTztBQU90QlEsUUFBQUEsSUFBSSxFQUFFLElBUGdCO0FBUXRCUCxRQUFBQSxXQUFXLEVBQUUsSUFSUztBQVN0QkMsUUFBQUEsVUFBVSxFQUFFLENBQ1I7QUFDSUMsVUFBQUEsVUFBVSxFQUFFLEdBRGhCO0FBRUlDLFVBQUFBLFFBQVEsRUFBRTtBQUZkLFNBRFE7QUFUVSxPQUExQjtBQWdCSCxLQTlFb0IsQ0FnRnJCOzs7QUFDQSxRQUFNSyxpQkFBaUIsR0FBRzlOLENBQUMsQ0FBQyx1QkFBRCxDQUEzQjs7QUFDQSxRQUFJOE4saUJBQWlCLENBQUNsTSxNQUFsQixJQUE0QixDQUFDa00saUJBQWlCLENBQUN2SixRQUFsQixDQUEyQixtQkFBM0IsQ0FBakMsRUFBa0Y7QUFDOUV1SixNQUFBQSxpQkFBaUIsQ0FBQ2QsS0FBbEIsQ0FBd0I7QUFDcEJDLFFBQUFBLE1BQU0sRUFBRSxLQURZO0FBRXBCQyxRQUFBQSxRQUFRLEVBQUUsS0FGVTtBQUdwQkMsUUFBQUEsWUFBWSxFQUFFLENBSE07QUFJcEJDLFFBQUFBLFVBQVUsRUFBRSxJQUpRO0FBS3BCUSxRQUFBQSxhQUFhLEVBQUUsR0FMSztBQU1wQlAsUUFBQUEsYUFBYSxFQUFFLEtBTks7QUFPcEJRLFFBQUFBLElBQUksRUFBRSxJQVBjO0FBUXBCUCxRQUFBQSxXQUFXLEVBQUUsSUFSTztBQVNwQkMsUUFBQUEsVUFBVSxFQUFFLENBQ1I7QUFDSUMsVUFBQUEsVUFBVSxFQUFFLEdBRGhCO0FBRUlDLFVBQUFBLFFBQVEsRUFBRTtBQUZkLFNBRFEsRUFLUjtBQUNJRCxVQUFBQSxVQUFVLEVBQUUsR0FEaEI7QUFFSUMsVUFBQUEsUUFBUSxFQUFFO0FBQ05OLFlBQUFBLFlBQVksRUFBRSxDQURSO0FBRU5DLFlBQUFBLFVBQVUsRUFBRTtBQUZOO0FBRmQsU0FMUTtBQVRRLE9BQXhCO0FBdUJILEtBMUdvQixDQTRHckI7OztBQUNBLFFBQU1XLGtCQUFrQixHQUFHL04sQ0FBQyxDQUFDLHlCQUFELENBQTVCOztBQUNBLFFBQUkrTixrQkFBa0IsQ0FBQ25NLE1BQW5CLElBQTZCLENBQUNtTSxrQkFBa0IsQ0FBQ3hKLFFBQW5CLENBQTRCLG1CQUE1QixDQUFsQyxFQUFvRjtBQUNoRndKLE1BQUFBLGtCQUFrQixDQUFDZixLQUFuQixDQUF5QjtBQUNyQkMsUUFBQUEsTUFBTSxFQUFFLEtBRGE7QUFFckJDLFFBQUFBLFFBQVEsRUFBRSxLQUZXO0FBR3JCQyxRQUFBQSxZQUFZLEVBQUUsQ0FITztBQUlyQkMsUUFBQUEsVUFBVSxFQUFFLElBSlM7QUFLckJRLFFBQUFBLGFBQWEsRUFBRSxHQUxNO0FBTXJCUCxRQUFBQSxhQUFhLEVBQUUsS0FOTTtBQU9yQlEsUUFBQUEsSUFBSSxFQUFFO0FBUGUsT0FBekI7QUFTSCxLQXhIb0IsQ0EwSHJCOzs7QUFDQSxRQUFNRyxnQkFBZ0IsR0FBR2hPLENBQUMsQ0FBQyxzQkFBRCxDQUExQjs7QUFDQSxRQUFJZ08sZ0JBQWdCLENBQUNwTSxNQUFqQixJQUEyQixDQUFDb00sZ0JBQWdCLENBQUN6SixRQUFqQixDQUEwQixtQkFBMUIsQ0FBaEMsRUFBZ0Y7QUFDNUV5SixNQUFBQSxnQkFBZ0IsQ0FBQ2hCLEtBQWpCLENBQXVCO0FBQ25CQyxRQUFBQSxNQUFNLEVBQUUsSUFEVztBQUVuQkMsUUFBQUEsUUFBUSxFQUFFLEtBRlM7QUFHbkJDLFFBQUFBLFlBQVksRUFBRSxDQUhLO0FBSW5CYyxRQUFBQSxTQUFTLEVBQ0wsaUxBTGU7QUFNbkJDLFFBQUFBLFNBQVMsRUFDTCxpS0FQZTtBQVFuQkwsUUFBQUEsSUFBSSxFQUFFLEtBUmE7QUFTbkJOLFFBQUFBLFVBQVUsRUFBRSxDQUNSO0FBQ0lDLFVBQUFBLFVBQVUsRUFBRSxHQURoQjtBQUVJQyxVQUFBQSxRQUFRLEVBQUU7QUFDTlIsWUFBQUEsTUFBTSxFQUFFLEtBREY7QUFFTlksWUFBQUEsSUFBSSxFQUFFO0FBRkE7QUFGZCxTQURRO0FBVE8sT0FBdkI7QUFvQkFHLE1BQUFBLGdCQUFnQixDQUFDck0sRUFBakIsQ0FBb0IsYUFBcEIsRUFBbUMsVUFBQ3FMLEtBQUQsRUFBUW1CLFlBQVIsRUFBeUI7QUFDeEQsWUFBTUMsT0FBTyxHQUFHcE8sQ0FBQyxDQUFDZ04sS0FBSyxDQUFDN0YsYUFBUCxDQUFELENBQXVCeEMsT0FBdkIsQ0FBK0IsaUNBQS9CLENBQWhCO0FBQ0F5SixRQUFBQSxPQUFPLENBQUMvRyxJQUFSLENBQWEsa0NBQWIsRUFBaUR0RSxXQUFqRCxDQUE2RCxXQUE3RDtBQUNBcUwsUUFBQUEsT0FBTyxDQUFDL0csSUFBUix1QkFBNEI4RyxZQUFZLENBQUNBLFlBQXpDLFFBQTBEdEwsUUFBMUQsQ0FBbUUsV0FBbkU7QUFDSCxPQUpELEVBckI0RSxDQTJCNUU7O0FBQ0E3QyxNQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0Isa0NBQXhCLEVBQTRELFVBQUFzRixDQUFDLEVBQUk7QUFDN0QsWUFBTW9ILElBQUksR0FBR3JPLENBQUMsQ0FBQ2lILENBQUMsQ0FBQ0UsYUFBSCxDQUFkO0FBQ0EsWUFBTWlILE9BQU8sR0FBR0MsSUFBSSxDQUFDMUosT0FBTCxDQUFhLGlDQUFiLENBQWhCO0FBQ0EsWUFBTXFKLGdCQUFnQixHQUFHSSxPQUFPLENBQUMvRyxJQUFSLENBQWEsc0JBQWIsQ0FBekI7QUFDQSxZQUFNaUgsT0FBTyxHQUFHRCxJQUFJLENBQUM3SSxJQUFMLENBQVUsT0FBVixDQUFoQjtBQUNBNEksUUFBQUEsT0FBTyxDQUFDL0csSUFBUixDQUFhLGtDQUFiLEVBQWlEdEUsV0FBakQsQ0FBNkQsV0FBN0Q7QUFDQXNMLFFBQUFBLElBQUksQ0FBQ3hMLFFBQUwsQ0FBYyxXQUFkO0FBQ0FtTCxRQUFBQSxnQkFBZ0IsQ0FBQ2hCLEtBQWpCLENBQXVCLFdBQXZCLEVBQW9Dc0IsT0FBcEM7QUFDSCxPQVJEO0FBU0gsS0FqS29CLENBbUtyQjs7O0FBQ0EsUUFBTUMsZ0JBQWdCLEdBQUd2TyxDQUFDLENBQUMsc0JBQUQsQ0FBMUI7O0FBQ0EsUUFBSXVPLGdCQUFnQixDQUFDM00sTUFBakIsSUFBMkIsQ0FBQzJNLGdCQUFnQixDQUFDaEssUUFBakIsQ0FBMEIsbUJBQTFCLENBQWhDLEVBQWdGO0FBQzVFZ0ssTUFBQUEsZ0JBQWdCLENBQUN2QixLQUFqQixDQUF1QjtBQUNuQkMsUUFBQUEsTUFBTSxFQUFFLEtBRFc7QUFFbkJDLFFBQUFBLFFBQVEsRUFBRSxLQUZTO0FBR25CQyxRQUFBQSxZQUFZLEVBQUUsQ0FISztBQUluQkMsUUFBQUEsVUFBVSxFQUFFLElBSk87QUFLbkJRLFFBQUFBLGFBQWEsRUFBRSxHQUxJO0FBTW5CUCxRQUFBQSxhQUFhLEVBQUUsS0FOSTtBQU9uQlEsUUFBQUEsSUFBSSxFQUFFLElBUGE7QUFRbkJQLFFBQUFBLFdBQVcsRUFBRSxJQVJNO0FBU25CQyxRQUFBQSxVQUFVLEVBQUUsQ0FDUjtBQUNJQyxVQUFBQSxVQUFVLEVBQUUsR0FEaEI7QUFFSUMsVUFBQUEsUUFBUSxFQUFFO0FBRmQsU0FEUTtBQVRPLE9BQXZCO0FBZ0JILEtBdExvQixDQXdMckI7OztBQUNBLFFBQU1lLGdCQUFnQixHQUFHeE8sQ0FBQyxDQUFDLHNCQUFELENBQTFCOztBQUNBLFFBQUl3TyxnQkFBZ0IsQ0FBQzVNLE1BQWpCLElBQTJCLENBQUM0TSxnQkFBZ0IsQ0FBQ2pLLFFBQWpCLENBQTBCLG1CQUExQixDQUFoQyxFQUFnRjtBQUM1RWlLLE1BQUFBLGdCQUFnQixDQUFDeEIsS0FBakIsQ0FBdUI7QUFDbkJDLFFBQUFBLE1BQU0sRUFBRSxLQURXO0FBRW5CQyxRQUFBQSxRQUFRLEVBQUUsS0FGUztBQUduQkMsUUFBQUEsWUFBWSxFQUFFLENBSEs7QUFJbkJzQixRQUFBQSxjQUFjLEVBQUUsQ0FKRztBQUtuQnBCLFFBQUFBLGFBQWEsRUFBRTtBQUxJLE9BQXZCO0FBT0g7O0FBRUQsUUFBTXFCLGlCQUFpQixHQUFHMU8sQ0FBQyxDQUFDLHdCQUFELENBQTNCOztBQUNBLFFBQUkwTyxpQkFBaUIsQ0FBQzlNLE1BQWxCLElBQTRCLENBQUM4TSxpQkFBaUIsQ0FBQ25LLFFBQWxCLENBQTJCLG1CQUEzQixDQUFqQyxFQUFrRjtBQUM5RW1LLE1BQUFBLGlCQUFpQixDQUFDMUcsSUFBbEIsQ0FBdUIsVUFBQzhELEtBQUQsRUFBUTZDLElBQVIsRUFBaUI7QUFDcEMzTyxRQUFBQSxDQUFDLENBQUMyTyxJQUFELENBQUQsQ0FBUTNCLEtBQVIsQ0FBYztBQUNWeUIsVUFBQUEsY0FBYyxFQUFFLENBRE47QUFFVnRCLFVBQUFBLFlBQVksRUFBRSxDQUZKO0FBR1ZGLFVBQUFBLE1BQU0sRUFBRSxLQUhFO0FBSVZZLFVBQUFBLElBQUksRUFBRSxLQUpJO0FBS1ZlLFVBQUFBLElBQUksRUFBRSxJQUxJO0FBTVZyQixVQUFBQSxVQUFVLEVBQUUsQ0FDUjtBQUNJQyxZQUFBQSxVQUFVLEVBQUUsR0FEaEI7QUFFSUMsWUFBQUEsUUFBUSxFQUFFO0FBQ05tQixjQUFBQSxJQUFJLEVBQUUsS0FEQTtBQUVOZixjQUFBQSxJQUFJLEVBQUU7QUFGQTtBQUZkLFdBRFE7QUFORixTQUFkO0FBZ0JILE9BakJELEVBRDhFLENBb0I5RTs7QUFDQTdOLE1BQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3Qix5QkFBeEIsRUFBbUQsVUFBQXNGLENBQUMsRUFBSTtBQUNwRCxZQUFNb0gsSUFBSSxHQUFHck8sQ0FBQyxDQUFDaUgsQ0FBQyxDQUFDRSxhQUFILENBQWQ7QUFDQSxZQUFNaUgsT0FBTyxHQUFHQyxJQUFJLENBQUMxSixPQUFMLENBQWEsWUFBYixDQUFoQjtBQUNBLFlBQU1rSyxTQUFTLEdBQUdULE9BQU8sQ0FBQy9HLElBQVIsQ0FBYSx3QkFBYixDQUFsQjtBQUNBLFlBQU1pSCxPQUFPLEdBQUdELElBQUksQ0FBQzdJLElBQUwsQ0FBVSxPQUFWLENBQWhCO0FBQ0E0SSxRQUFBQSxPQUFPLENBQUMvRyxJQUFSLENBQWEseUJBQWIsRUFBd0N0RSxXQUF4QyxDQUFvRCxXQUFwRDtBQUNBc0wsUUFBQUEsSUFBSSxDQUFDeEwsUUFBTCxDQUFjLFdBQWQ7QUFDQWdNLFFBQUFBLFNBQVMsQ0FBQzdCLEtBQVYsQ0FBZ0IsV0FBaEIsRUFBNkJzQixPQUE3QjtBQUNILE9BUkQ7QUFTSCxLQW5Pb0IsQ0FxT3JCOzs7QUFDQSxRQUFNUSxpQkFBaUIsR0FBRzlPLENBQUMsQ0FBQyx1QkFBRCxDQUEzQjs7QUFDQSxRQUFJOE8saUJBQWlCLENBQUNsTixNQUFsQixJQUE0QixDQUFDa04saUJBQWlCLENBQUN2SyxRQUFsQixDQUEyQixtQkFBM0IsQ0FBakMsRUFBa0Y7QUFDOUV1SyxNQUFBQSxpQkFBaUIsQ0FBQzlCLEtBQWxCLENBQXdCO0FBQ3BCQyxRQUFBQSxNQUFNLEVBQUUsSUFEWTtBQUVwQkMsUUFBQUEsUUFBUSxFQUFFLEtBRlU7QUFHcEJHLFFBQUFBLGFBQWEsRUFBRSxJQUhLO0FBSXBCWSxRQUFBQSxTQUFTLEVBQ0wsaUxBTGdCO0FBTXBCQyxRQUFBQSxTQUFTLEVBQ0wsaUtBUGdCO0FBUXBCTCxRQUFBQSxJQUFJLEVBQUUsS0FSYztBQVNwQk4sUUFBQUEsVUFBVSxFQUFFLENBQ1I7QUFDSUMsVUFBQUEsVUFBVSxFQUFFLEdBRGhCO0FBRUlDLFVBQUFBLFFBQVEsRUFBRTtBQUNOUixZQUFBQSxNQUFNLEVBQUUsS0FERjtBQUVOWSxZQUFBQSxJQUFJLEVBQUUsSUFGQTtBQUdOUixZQUFBQSxhQUFhLEVBQUU7QUFIVDtBQUZkLFNBRFE7QUFUUSxPQUF4QjtBQXFCQXlCLE1BQUFBLGlCQUFpQixDQUFDbk4sRUFBbEIsQ0FBcUIsYUFBckIsRUFBb0MsVUFBQ3FMLEtBQUQsRUFBUW1CLFlBQVIsRUFBeUI7QUFDekQsWUFBTUMsT0FBTyxHQUFHcE8sQ0FBQyxDQUFDZ04sS0FBSyxDQUFDN0YsYUFBUCxDQUFELENBQXVCeEMsT0FBdkIsQ0FBK0IsV0FBL0IsQ0FBaEI7QUFDQXlKLFFBQUFBLE9BQU8sQ0FBQy9HLElBQVIsQ0FBYSx3QkFBYixFQUF1Q3RFLFdBQXZDLENBQW1ELFdBQW5EO0FBQ0FxTCxRQUFBQSxPQUFPLENBQUMvRyxJQUFSLHVCQUE0QjhHLFlBQVksQ0FBQ0EsWUFBekMsUUFBMER0TCxRQUExRCxDQUFtRSxXQUFuRTtBQUNILE9BSkQsRUF0QjhFLENBNEI5RTs7QUFDQTdDLE1BQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3Qix3QkFBeEIsRUFBa0QsVUFBQXNGLENBQUMsRUFBSTtBQUNuRCxZQUFNb0gsSUFBSSxHQUFHck8sQ0FBQyxDQUFDaUgsQ0FBQyxDQUFDRSxhQUFILENBQWQ7QUFDQSxZQUFNaUgsT0FBTyxHQUFHQyxJQUFJLENBQUMxSixPQUFMLENBQWEsV0FBYixDQUFoQjtBQUNBLFlBQU1tSyxpQkFBaUIsR0FBR1YsT0FBTyxDQUFDL0csSUFBUixDQUFhLHVCQUFiLENBQTFCO0FBQ0EsWUFBTWlILE9BQU8sR0FBR0QsSUFBSSxDQUFDN0ksSUFBTCxDQUFVLE9BQVYsQ0FBaEI7QUFDQTRJLFFBQUFBLE9BQU8sQ0FBQy9HLElBQVIsQ0FBYSx3QkFBYixFQUF1Q3RFLFdBQXZDLENBQW1ELFdBQW5EO0FBQ0FzTCxRQUFBQSxJQUFJLENBQUN4TCxRQUFMLENBQWMsV0FBZDtBQUNBaU0sUUFBQUEsaUJBQWlCLENBQUM5QixLQUFsQixDQUF3QixXQUF4QixFQUFxQ3NCLE9BQXJDO0FBQ0gsT0FSRDtBQVNIO0FBQ0o7O0FBRUQsTUFBTVMsTUFBTSxHQUFHL08sQ0FBQyxDQUFDLFlBQUQsQ0FBaEI7O0FBRUEsTUFBSStPLE1BQU0sQ0FBQ25OLE1BQVgsRUFBbUI7QUFDZjVCLElBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixZQUF4QixFQUFzQyxZQUFNO0FBQ3hDM0IsTUFBQUEsQ0FBQyxDQUFDLFlBQUQsQ0FBRCxDQUFnQmdQLE9BQWhCLENBQXdCO0FBQ3BCQyxRQUFBQSxTQUFTLEVBQUU7QUFEUyxPQUF4QjtBQUdILEtBSkQ7QUFNQWpQLElBQUFBLENBQUMsQ0FBQ2lCLE1BQUQsQ0FBRCxDQUFVVSxFQUFWLENBQWEsUUFBYixFQUF1QixZQUFNO0FBQ3pCLFVBQUkzQixDQUFDLENBQUNpQixNQUFELENBQUQsQ0FBVWlPLEtBQVYsTUFBcUIvTyxhQUFhLENBQUNNLFlBQXZDLEVBQXFEO0FBQ2pEVCxRQUFBQSxDQUFDLENBQUNpQixNQUFELENBQUQsQ0FBVWdPLFNBQVYsS0FBd0IsRUFBeEIsR0FBNkJGLE1BQU0sQ0FBQ3JFLElBQVAsRUFBN0IsR0FBNkNxRSxNQUFNLENBQUN0RSxJQUFQLEVBQTdDO0FBQ0g7QUFDSixLQUpEO0FBS0g7O0FBRUQsTUFBTTBFLFlBQVksR0FBR25QLENBQUMsQ0FBQyxrQkFBRCxDQUF0Qjs7QUFDQSxNQUFJbVAsWUFBWSxDQUFDdk4sTUFBakIsRUFBeUI7QUFDckI1QixJQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZMEIsRUFBWixDQUFlLE9BQWYsRUFBd0IsZ0JBQXhCLEVBQTBDLFVBQUFzRixDQUFDLEVBQUk7QUFDM0NrSSxNQUFBQSxZQUFZLENBQUN0TSxRQUFiLENBQXNCLFdBQXRCLEVBQW1DZCxVQUFuQyxDQUE4QyxjQUE5QztBQUNBL0IsTUFBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVNkMsUUFBVixDQUFtQixhQUFuQjtBQUNILEtBSEQ7QUFLQTdDLElBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVkwQixFQUFaLENBQWUsT0FBZixFQUF3QixrQkFBeEIsRUFBNEMsVUFBQXNGLENBQUMsRUFBSTtBQUM3Q2tJLE1BQUFBLFlBQVksQ0FBQ3BOLFVBQWIsQ0FBd0IsZUFBeEIsRUFBeUMsWUFBTTtBQUMzQ29OLFFBQUFBLFlBQVksQ0FBQ3BNLFdBQWIsQ0FBeUIsV0FBekI7QUFDQS9DLFFBQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVStDLFdBQVYsQ0FBc0IsYUFBdEI7QUFDSCxPQUhEO0FBSUgsS0FMRDtBQU1IOztBQUVELE1BQUkvQyxDQUFDLENBQUMscUJBQUQsQ0FBRCxDQUF5QjRCLE1BQXpCLEdBQWtDLENBQXRDLEVBQXlDO0FBQ3JDOzs7QUFHQTVCLElBQUFBLENBQUMsQ0FBQyxxQkFBRCxDQUFELENBQXlCZ0ksSUFBekIsQ0FBOEIsVUFBUzhELEtBQVQsRUFBZ0IzSixFQUFoQixFQUFvQjtBQUM5QyxVQUFNaU4sS0FBSyxHQUFHcFAsQ0FBQyxDQUFDbUMsRUFBRCxDQUFELENBQU1rRixJQUFOLENBQVcsaUJBQVgsQ0FBZDs7QUFFQSxVQUNJckgsQ0FBQyxDQUFDb1AsS0FBRCxDQUFELENBQ0twRSxHQURMLEdBRUtxRSxJQUZMLE1BRWUsRUFGZixJQUdBclAsQ0FBQyxDQUFDb1AsS0FBRCxDQUFELENBQVN4RCxFQUFULENBQVksb0JBQVosQ0FKSixFQUtFO0FBQ0U1TCxRQUFBQSxDQUFDLENBQUNtQyxFQUFELENBQUQsQ0FBTVUsUUFBTixDQUFlLFdBQWY7QUFDSDs7QUFFRDdDLE1BQUFBLENBQUMsQ0FBQ29QLEtBQUQsQ0FBRCxDQUNLek4sRUFETCxDQUNRLE9BRFIsRUFDaUIsVUFBUzJOLEtBQVQsRUFBZ0I7QUFDekJ0UCxRQUFBQSxDQUFDLENBQUNtQyxFQUFELENBQUQsQ0FBTVUsUUFBTixDQUFlLFdBQWY7QUFDSCxPQUhMLEVBSUtsQixFQUpMLENBSVEsTUFKUixFQUlnQixVQUFTMk4sS0FBVCxFQUFnQjtBQUN4QixZQUNJdFAsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUNLZ0wsR0FETCxHQUVLcUUsSUFGTCxPQUVnQixFQUZoQixJQUdBLENBQUNyUCxDQUFDLENBQUNvUCxLQUFELENBQUQsQ0FBU3hELEVBQVQsQ0FBWSxvQkFBWixDQUpMLEVBS0U7QUFDRTVMLFVBQUFBLENBQUMsQ0FBQ21DLEVBQUQsQ0FBRCxDQUFNWSxXQUFOLENBQWtCLFdBQWxCO0FBQ0g7QUFDSixPQWJMO0FBY0gsS0ExQkQ7QUEyQkg7QUFFRDs7O0FBRUEsTUFBTXdNLGVBQWUsR0FBRztBQUNwQkMsSUFBQUEsS0FBSyxFQUFFLEtBRGE7QUFFcEJDLElBQUFBLFNBQVMsRUFBRSxLQUZTO0FBR3BCQyxJQUFBQSxXQUFXLEVBQUUsS0FITztBQUlwQkMsSUFBQUEsU0FBUyxFQUFFLGNBSlM7QUFLcEJDLElBQUFBLFFBQVEsRUFBRSxFQUxVO0FBTXBCQyxJQUFBQSxLQUFLLEVBQUU7QUFOYSxHQUF4QjtBQVNBOzs7O0FBR0EsV0FBU0MsWUFBVCxHQUF3QjtBQUNwQjlQLElBQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CZ0ksSUFBcEIsQ0FBeUIsVUFBQzhELEtBQUQsRUFBUWlFLElBQVIsRUFBaUI7QUFDdEMsVUFBTUMsYUFBYSxHQUFHO0FBQ2xCQyxRQUFBQSxPQUFPLEVBQUVqUSxDQUFDLENBQUMrUCxJQUFELENBQUQsQ0FBUWpQLElBQVIsQ0FBYSxjQUFiO0FBRFMsT0FBdEI7O0FBR0EsVUFBSWQsQ0FBQyxDQUFDK1AsSUFBRCxDQUFELENBQVF2SyxJQUFSLENBQWEsT0FBYixDQUFKLEVBQTJCO0FBQ3ZCd0ssUUFBQUEsYUFBYSxDQUFDLFNBQUQsQ0FBYixHQUEyQixhQUEzQjtBQUNBQSxRQUFBQSxhQUFhLENBQUMsYUFBRCxDQUFiLEdBQStCLElBQS9CO0FBQ0g7O0FBRURFLE1BQUFBLEtBQUssQ0FBQ0gsSUFBRCxFQUFPSSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCYixlQUFsQixFQUFtQ1MsYUFBbkMsQ0FBUCxDQUFMO0FBQ0gsS0FWRDtBQVdIOztBQUVERixFQUFBQSxZQUFZLEdBenVDYSxDQTJ1Q3pCO0FBQ0E7O0FBQ0EsTUFBTU8sSUFBSSxHQUFHO0FBQUVDLElBQUFBLEdBQUcsRUFBRSxTQUFQO0FBQWtCQyxJQUFBQSxHQUFHLEVBQUU7QUFBdkIsR0FBYixDQTd1Q3lCLENBK3VDekI7O0FBQ0EsTUFBTUMsU0FBUyxHQUFHLENBQ2Q7QUFDSUMsSUFBQUEsV0FBVyxFQUFFLFVBRGpCO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFGYixHQURjLEVBU2Q7QUFDSUYsSUFBQUEsV0FBVyxFQUFFLGFBRGpCO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lFLE1BQUFBLFVBQVUsRUFBRTtBQURoQixLQURLO0FBRmIsR0FUYyxFQWlCZDtBQUNJSCxJQUFBQSxXQUFXLEVBQUUsa0JBRGpCO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFGYixHQWpCYyxFQXlCZDtBQUNJRixJQUFBQSxXQUFXLEVBQUUsb0JBRGpCO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFGYixHQXpCYyxFQWlDZDtBQUNJRSxJQUFBQSxXQUFXLEVBQUUsZ0JBRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxVQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0FqQ2MsRUEwQ2Q7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLHdCQURqQjtBQUVJSixJQUFBQSxXQUFXLEVBQUUsa0JBRmpCO0FBR0lDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFIYixHQTFDYyxFQW1EZDtBQUNJRSxJQUFBQSxXQUFXLEVBQUUsNEJBRGpCO0FBRUlILElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lFLE1BQUFBLFVBQVUsRUFBRTtBQURoQixLQURLO0FBRmIsR0FuRGMsRUEyRGQ7QUFDSUMsSUFBQUEsV0FBVyxFQUFFLHlCQURqQjtBQUVJSixJQUFBQSxXQUFXLEVBQUUsa0JBRmpCO0FBR0lDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFIYixHQTNEYyxFQW9FZDtBQUNJRSxJQUFBQSxXQUFXLEVBQUUsS0FEakI7QUFFSUosSUFBQUEsV0FBVyxFQUFFLGtCQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0FwRWMsRUE2RWQ7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLFVBRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxVQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0E3RWMsRUFzRmQ7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLFVBRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxrQkFGakI7QUFHSUMsSUFBQUEsT0FBTyxFQUFFLENBQ0w7QUFDSUMsTUFBQUEsS0FBSyxFQUFFO0FBRFgsS0FESztBQUhiLEdBdEZjLEVBK0ZkO0FBQ0lFLElBQUFBLFdBQVcsRUFBRSxVQURqQjtBQUVJSixJQUFBQSxXQUFXLEVBQUUsb0JBRmpCO0FBR0lDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFIYixHQS9GYyxFQXdHZDtBQUNJRSxJQUFBQSxXQUFXLEVBQUUsTUFEakI7QUFFSUosSUFBQUEsV0FBVyxFQUFFLGVBRmpCO0FBR0lDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFIYixHQXhHYyxFQWlIZDtBQUNJRSxJQUFBQSxXQUFXLEVBQUUsTUFEakI7QUFFSUosSUFBQUEsV0FBVyxFQUFFLGtCQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0FqSGMsRUEwSGQ7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLGVBRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxVQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0ExSGMsRUFtSWQ7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLGNBRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxVQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0FuSWMsRUE0SWQ7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLGdDQURqQjtBQUVJSixJQUFBQSxXQUFXLEVBQUUsVUFGakI7QUFHSUMsSUFBQUEsT0FBTyxFQUFFLENBQ0w7QUFDSUMsTUFBQUEsS0FBSyxFQUFFO0FBRFgsS0FESztBQUhiLEdBNUljLEVBcUpkO0FBQ0lFLElBQUFBLFdBQVcsRUFBRSxZQURqQjtBQUVJSixJQUFBQSxXQUFXLEVBQUUsa0JBRmpCO0FBR0lDLElBQUFBLE9BQU8sRUFBRSxDQUNMO0FBQ0lDLE1BQUFBLEtBQUssRUFBRTtBQURYLEtBREs7QUFIYixHQXJKYyxFQThKZDtBQUNJRSxJQUFBQSxXQUFXLEVBQUUsU0FEakI7QUFFSUosSUFBQUEsV0FBVyxFQUFFLGtCQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0E5SmMsRUF1S2Q7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLE9BRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxVQUZqQjtBQUdJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxLQUFLLEVBQUU7QUFEWCxLQURLO0FBSGIsR0F2S2MsRUFnTGQ7QUFDSUUsSUFBQUEsV0FBVyxFQUFFLE9BRGpCO0FBRUlKLElBQUFBLFdBQVcsRUFBRSxrQkFGakI7QUFHSUMsSUFBQUEsT0FBTyxFQUFFLENBQ0w7QUFDSUMsTUFBQUEsS0FBSyxFQUFFO0FBRFgsS0FESztBQUhiLEdBaExjLENBQWxCLENBaHZDeUIsQ0EyNkN6Qjs7QUFDQSxXQUFTRyxPQUFULEdBQW1CO0FBQ2Y7QUFDQSxRQUFNQyxHQUFHLEdBQUcsSUFBSUMsTUFBTSxDQUFDQyxJQUFQLENBQVlDLEdBQWhCLENBQW9CalIsUUFBUSxDQUFDa1IsY0FBVCxDQUF3QixLQUF4QixDQUFwQixFQUFvRDtBQUM1REMsTUFBQUEsSUFBSSxFQUFFLEVBRHNEO0FBRTVEQyxNQUFBQSxNQUFNLEVBQUVoQixJQUZvRDtBQUc1RGlCLE1BQUFBLE1BQU0sRUFBRWQsU0FIb0Q7QUFJNURlLE1BQUFBLFdBQVcsRUFBRSxJQUorQztBQUs1REMsTUFBQUEsY0FBYyxFQUFFLEtBTDRDO0FBTTVEQyxNQUFBQSxZQUFZLEVBQUUsSUFOOEM7QUFPNURDLE1BQUFBLGlCQUFpQixFQUFFLEtBUHlDO0FBUTVEQyxNQUFBQSxhQUFhLEVBQUUsS0FSNkM7QUFTNURDLE1BQUFBLGlCQUFpQixFQUFFO0FBVHlDLEtBQXBELENBQVo7QUFZQSxRQUFNQyxTQUFTLEdBQUc7QUFDZEMsTUFBQUEsR0FBRyxFQUFFLG1CQURTO0FBRWQ7QUFDQTNMLE1BQUFBLElBQUksRUFBRSxJQUFJNkssTUFBTSxDQUFDQyxJQUFQLENBQVljLElBQWhCLENBQXFCLEVBQXJCLEVBQXlCLEVBQXpCLENBSFE7QUFJZDtBQUNBQyxNQUFBQSxNQUFNLEVBQUUsSUFBSWhCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZZ0IsS0FBaEIsQ0FBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsQ0FMTTtBQU1kO0FBQ0FDLE1BQUFBLE1BQU0sRUFBRSxJQUFJbEIsTUFBTSxDQUFDQyxJQUFQLENBQVlnQixLQUFoQixDQUFzQixFQUF0QixFQUEwQixFQUExQjtBQVBNLEtBQWxCLENBZGUsQ0F3QmY7O0FBQ0EsUUFBTUUsTUFBTSxHQUFHLElBQUluQixNQUFNLENBQUNDLElBQVAsQ0FBWW1CLE1BQWhCLENBQXVCO0FBQ2xDQyxNQUFBQSxRQUFRLEVBQUVoQyxJQUR3QjtBQUVsQ2lDLE1BQUFBLElBQUksRUFBRVQsU0FGNEI7QUFHbENkLE1BQUFBLEdBQUcsRUFBRUE7QUFINkIsS0FBdkIsQ0FBZjtBQUtIOztBQUVEOVAsRUFBQUEsTUFBTSxDQUFDNlAsT0FBUCxHQUFpQkEsT0FBakI7QUFFSjtBQUNDLENBLzhDRCIsInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqINCT0LvQvtCx0LDQu9GM0L3Ri9C1INC/0LXRgNC10LzQtdC90L3Ri9C1LCDQutC+0YLQvtGA0YvQtSDQuNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8g0LzQvdC+0LPQvtC60YDQsNGC0L3QvlxuICAgICAqL1xuICAgIGxldCBnbG9iYWxPcHRpb25zID0ge1xuICAgICAgICAvLyDQktGA0LXQvNGPINC00LvRjyDQsNC90LjQvNCw0YbQuNC5XG4gICAgICAgIHRpbWU6ICAyMDAsXG5cbiAgICAgICAgLy8g0JrQvtC90YLRgNC+0LvRjNC90YvQtSDRgtC+0YfQutC4INCw0LTQsNC/0YLQuNCy0LBcbiAgICAgICAgZGVza3RvcExnU2l6ZTogIDE5MTAsXG4gICAgICAgIGRlc2t0b3BNZFNpemU6ICAxNjAwLFxuICAgICAgICBkZXNrdG9wU2l6ZTogICAgMTQ4MCxcbiAgICAgICAgZGVza3RvcFNtU2l6ZTogIDEyODAsXG4gICAgICAgIHRhYmxldExnU2l6ZTogICAxMDI0LFxuICAgICAgICB0YWJsZXRTaXplOiAgICAgNzY4LFxuICAgICAgICBtb2JpbGVMZ1NpemU6ICAgNjQwLFxuICAgICAgICBtb2JpbGVTaXplOiAgICAgNDgwLFxuXG4gICAgICAgIGxhbmc6ICQoJ2h0bWwnKS5hdHRyKCdsYW5nJylcbiAgICB9O1xuXG4gICAgLy8g0JHRgNC10LnQutC/0L7QuNC90YLRiyDQsNC00LDQv9GC0LjQstCwXG4gICAgLy8gQGV4YW1wbGUgaWYgKGdsb2JhbE9wdGlvbnMuYnJlYWtwb2ludFRhYmxldC5tYXRjaGVzKSB7fSBlbHNlIHt9XG4gICAgY29uc3QgYnJlYWtwb2ludHMgPSB7XG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wTGc6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcExnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wTWQ6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcE1kU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BTbTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wU21TaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludFRhYmxldExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldExnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXQ6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMudGFibGV0U2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGVMZ1NpemU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlTGdTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludE1vYmlsZTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5tb2JpbGVTaXplIC0gMX1weClgKVxuICAgIH07XG5cbiAgICAkLmV4dGVuZCh0cnVlLCBnbG9iYWxPcHRpb25zLCBicmVha3BvaW50cyk7XG5cbiAgICAkKHdpbmRvdykub24oJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIGlmICgkKCd0ZXh0YXJlYScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGF1dG9zaXplKCQoJ3RleHRhcmVhJykpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LTQutC70Y7Rh9C10L3QuNC1IGpzIHBhcnRpYWxzXG4gICAgICovXG4gICAgLyoqXG4gKiDQoNCw0YHRiNC40YDQtdC90LjQtSBhbmltYXRlLmNzc1xuICogQHBhcmFtICB7U3RyaW5nfSBhbmltYXRpb25OYW1lINC90LDQt9Cy0LDQvdC40LUg0LDQvdC40LzQsNGG0LjQuFxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrINGE0YPQvdC60YbQuNGPLCDQutC+0YLQvtGA0LDRjyDQvtGC0YDQsNCx0L7RgtCw0LXRgiDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcbiAqIEByZXR1cm4ge09iamVjdH0g0L7QsdGK0LXQutGCINCw0L3QuNC80LDRhtC40LhcbiAqXG4gKiBAc2VlICBodHRwczovL2RhbmVkZW4uZ2l0aHViLmlvL2FuaW1hdGUuY3NzL1xuICpcbiAqIEBleGFtcGxlXG4gKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnKTtcbiAqXG4gKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnLCBmdW5jdGlvbigpIHtcbiAqICAgICAvLyDQlNC10LvQsNC10Lwg0YfRgtC+LdGC0L4g0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XG4gKiB9KTtcbiAqL1xuJC5mbi5leHRlbmQoe1xuICAgIGFuaW1hdGVDc3M6IGZ1bmN0aW9uKGFuaW1hdGlvbk5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBhbmltYXRpb25FbmQgPSAoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25zID0ge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ2FuaW1hdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgT0FuaW1hdGlvbjogJ29BbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgICAgIE1vekFuaW1hdGlvbjogJ21vekFuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgV2Via2l0QW5pbWF0aW9uOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciAobGV0IHQgaW4gYW5pbWF0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25zW3RdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuXG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb25OYW1lKS5vbmUoYW5pbWF0aW9uRW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb25OYW1lKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbn0pO1xuXG4gICAgLy8g0J3QtdCx0L7Qu9GM0YjQuNC1INCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvQtSDRhNGD0L3QutGG0LjQuFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0Y/QtdGCINGH0LjRgdC70L4g0LjQu9C4INC90LXRglxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSBuINCb0Y7QsdC+0Lkg0LDRgNCz0YPQvNC10L3RglxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzTnVtZXJpYyhuKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvRj9C10YIg0LLRgdC1INC90LXRh9C40YHQu9C+0LLRi9C1INGB0LjQvNCy0L7Qu9GLINC4INC/0YDQuNCy0L7QtNC40YIg0Log0YfQuNGB0LvRg1xuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJ8bnVtYmVyfSBwYXJhbVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm90RGlnaXRzKHBhcmFtKSB7XG4gICAgICAgIC8qINGD0LTQsNC70Y/QtdC8INCy0YHQtSDRgdC40LzQstC+0LvRiyDQutGA0L7QvNC1INGG0LjRhNGAINC4INC/0LXRgNC10LLQvtC00LjQvCDQsiDRh9C40YHQu9C+ICovXG4gICAgICAgIHJldHVybiArcGFyYW0udG9TdHJpbmcoKS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCg0LDQt9C00LXQu9GP0LXRgiDQvdCwINGA0LDQt9GA0Y/QtNGLXG4gICAgICog0J3QsNC/0YDQuNC80LXRgCwgMzgwMDAwMCAtPiAzIDgwMCAwMDBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyfG51bWJlcn0gcGFyYW1cbiAgICAgKiBAcmV0dXJucyB7c3RyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpdmlkZUJ5RGlnaXRzKHBhcmFtKSB7XG4gICAgICAgIGlmIChwYXJhbSA9PT0gbnVsbCkgcGFyYW0gPSAwO1xuICAgICAgICByZXR1cm4gcGFyYW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9XG5cbiAgICB2YXIgbG9jYWxlID0gZ2xvYmFsT3B0aW9ucy5sYW5nID09ICdydS1SVScgPyAncnUnIDogJ2VuJztcblxuICAgIFBhcnNsZXkuc2V0TG9jYWxlKGxvY2FsZSk7XG5cbiAgICAvKiDQndCw0YHRgtGA0L7QudC60LggUGFyc2xleSAqL1xuICAgICQuZXh0ZW5kKFBhcnNsZXkub3B0aW9ucywge1xuICAgICAgICB0cmlnZ2VyOiAnYmx1ciBjaGFuZ2UnLCAvLyBjaGFuZ2Ug0L3Rg9C20LXQvSDQtNC70Y8gc2VsZWN0J9CwXG4gICAgICAgIHZhbGlkYXRpb25UaHJlc2hvbGQ6ICcwJyxcbiAgICAgICAgZXJyb3JzV3JhcHBlcjogJzxkaXY+PC9kaXY+JyxcbiAgICAgICAgZXJyb3JUZW1wbGF0ZTogJzxwIGNsYXNzPVwicGFyc2xleS1lcnJvci1tZXNzYWdlXCI+PC9wPicsXG4gICAgICAgIGNsYXNzSGFuZGxlcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICAgICAkaGFuZGxlcjtcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkZWxlbWVudDsgLy8g0YLQviDQtdGB0YLRjCDQvdC40YfQtdCz0L4g0L3QtSDQstGL0LTQtdC70Y/QtdC8IChpbnB1dCDRgdC60YDRi9GCKSwg0LjQvdCw0YfQtSDQstGL0LTQtdC70Y/QtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDQsdC70L7QulxuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkKCcuc2VsZWN0Mi1zZWxlY3Rpb24tLXNpbmdsZScsICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gJGhhbmRsZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yc0NvbnRhaW5lcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyO1xuXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmN1c3RvbS1maWxlJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpID09ICdpc19yZWNhcHRjaGFfc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgICAgIC5uZXh0KCcuZy1yZWNhcHRjaGEnKVxuICAgICAgICAgICAgICAgICAgICAubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICRjb250YWluZXIgPSAkZWxlbWVudC5jbG9zZXN0KCcuZmllbGQnKTtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygkY29udGFpbmVyKVxuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICByZXR1cm4gJGNvbnRhaW5lcjtcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCa0LDRgdGC0L7QvNC90YvQtSDQstCw0LvQuNC00LDRgtC+0YDRi1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lUnUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZUVuJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlthLXpcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosIFwiIFwiLCBcIi1cIicsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXpcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIicsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiyDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlclJ1Jywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlswLTnQsC3Rj9GRXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0YssINC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlcicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtejAtOV0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIDAtOScsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgFxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdwaG9uZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bLSswLTkoKSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INGC0LXQu9C10YTQvtC90L3Ri9C5INC90L7QvNC10YAnLFxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgcGhvbmUgbnVtYmVyJyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bWJlcicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bMC05XSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIDAtOScsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQn9C+0YfRgtCwINCx0LXQtyDQutC40YDQuNC70LvQuNGG0YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZW1haWwnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXShcXC58X3wtKXswLDF9KStbQS1aYS160JAt0K/QsC3RjzAtOVxcLV1cXEAoW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKSsoKFxcLil7MCwxfVtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSl7MSx9XFwuW2EtetCwLdGPMC05XFwtXXsyLH0kLy50ZXN0KFxuICAgICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L/QvtGH0YLQvtCy0YvQuSDQsNC00YDQtdGBJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGVtYWlsIGFkZHJlc3MnLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KTQvtGA0LzQsNGCINC00LDRgtGLIERELk1NLllZWVlcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZGF0ZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgcmVnVGVzdCA9IC9eKD86KD86MzEoXFwuKSg/OjA/WzEzNTc4XXwxWzAyXSkpXFwxfCg/Oig/OjI5fDMwKShcXC4pKD86MD9bMSwzLTldfDFbMC0yXSlcXDIpKSg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezJ9KSR8Xig/OjI5KFxcLikwPzJcXDMoPzooPzooPzoxWzYtOV18WzItOV1cXGQpPyg/OjBbNDhdfFsyNDY4XVswNDhdfFsxMzU3OV1bMjZdKXwoPzooPzoxNnxbMjQ2OF1bMDQ4XXxbMzU3OV1bMjZdKTAwKSkpKSR8Xig/OjA/WzEtOV18MVxcZHwyWzAtOF0pKFxcLikoPzooPzowP1sxLTldKXwoPzoxWzAtMl0pKVxcNCg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezR9KSQvLFxuICAgICAgICAgICAgICAgIHJlZ01hdGNoID0gLyhcXGR7MSwyfSlcXC4oXFxkezEsMn0pXFwuKFxcZHs0fSkvLFxuICAgICAgICAgICAgICAgIG1pbiA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWluJyksXG4gICAgICAgICAgICAgICAgbWF4ID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNYXgnKSxcbiAgICAgICAgICAgICAgICBtaW5EYXRlLFxuICAgICAgICAgICAgICAgIG1heERhdGUsXG4gICAgICAgICAgICAgICAgdmFsdWVEYXRlLFxuICAgICAgICAgICAgICAgIHJlc3VsdDtcblxuICAgICAgICAgICAgaWYgKG1pbiAmJiAocmVzdWx0ID0gbWluLm1hdGNoKHJlZ01hdGNoKSkpIHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF4ICYmIChyZXN1bHQgPSBtYXgubWF0Y2gocmVnTWF0Y2gpKSkge1xuICAgICAgICAgICAgICAgIG1heERhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgocmVzdWx0ID0gdmFsdWUubWF0Y2gocmVnTWF0Y2gpKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlRGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIHJlZ1Rlc3QudGVzdCh2YWx1ZSkgJiYgKG1pbkRhdGUgPyB2YWx1ZURhdGUgPj0gbWluRGF0ZSA6IHRydWUpICYmIChtYXhEYXRlID8gdmFsdWVEYXRlIDw9IG1heERhdGUgOiB0cnVlKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3QsNGPINC00LDRgtCwJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGRhdGUnLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KTQsNC50Lsg0L7Qs9GA0LDQvdC40YfQtdC90L3QvtCz0L4g0YDQsNC30LzQtdGA0LBcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZU1heFNpemUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgbWF4U2l6ZSwgcGFyc2xleUluc3RhbmNlKSB7XG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBwYXJzbGV5SW5zdGFuY2UuJGVsZW1lbnRbMF0uZmlsZXM7XG4gICAgICAgICAgICByZXR1cm4gZmlsZXMubGVuZ3RoICE9IDEgfHwgZmlsZXNbMF0uc2l6ZSA8PSBtYXhTaXplICogMTAyNDtcbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWlyZW1lbnRUeXBlOiAnaW50ZWdlcicsXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Ck0LDQudC7INC00L7Qu9C20LXQvSDQstC10YHQuNGC0Ywg0L3QtSDQsdC+0LvQtdC1LCDRh9C10LwgJXMgS2InLFxuICAgICAgICAgICAgZW46IFwiRmlsZSBzaXplIGNhbid0IGJlIG1vcmUgdGhlbiAlcyBLYlwiLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0J7Qs9GA0LDQvdC40YfQtdC90LjRjyDRgNCw0YHRiNC40YDQtdC90LjQuSDRhNCw0LnQu9C+0LJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZUV4dGVuc2lvbicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlLCBmb3JtYXRzKSB7XG4gICAgICAgICAgICBsZXQgZmlsZUV4dGVuc2lvbiA9IHZhbHVlLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgICAgICBsZXQgZm9ybWF0c0FyciA9IGZvcm1hdHMuc3BsaXQoJywgJyk7XG4gICAgICAgICAgICBsZXQgdmFsaWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JtYXRzQXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVFeHRlbnNpb24gPT09IGZvcm1hdHNBcnJbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWxpZDtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0JTQvtC/0YPRgdGC0LjQvNGLINGC0L7Qu9GM0LrQviDRhNCw0LnQu9GLINGE0L7RgNC80LDRgtCwICVzJyxcbiAgICAgICAgICAgIGVuOiAnQXZhaWxhYmxlIGV4dGVuc2lvbnMgYXJlICVzJyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCh0L7Qt9C00LDRkdGCINC60L7QvdGC0LXQudC90LXRgNGLINC00LvRjyDQvtGI0LjQsdC+0Log0YMg0L3QtdGC0LjQv9C40YfQvdGL0YUg0Y3Qu9C10LzQtdC90YLQvtCyXG4gICAgUGFyc2xleS5vbignZmllbGQ6aW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgJGVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICAgICAgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICRibG9jayA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdlcnJvcnMtcGxhY2VtZW50JyksXG4gICAgICAgICAgICAkbGFzdDtcblxuICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCY0L3QuNGG0LjQuNGA0YPQtdGCINCy0LDQu9C40LTQsNGG0LjRjiDQvdCwINCy0YLQvtGA0L7QvCDQutCw0LvQtdC00LDRgNC90L7QvCDQv9C+0LvQtSDQtNC40LDQv9Cw0LfQvtC90LBcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDp2YWxpZGF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgJCgnZm9ybVtkYXRhLXZhbGlkYXRlPVwidHJ1ZVwiXScpLnBhcnNsZXkoKTtcblxuICAgIC8vINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDRgtC+0LvRjNC60L4g0L3QsCDRgdGC0YDQsNC90LjRhtC1IGNoZWNrb3V0Lmh0bWxcbiAgICBpZiAoJCgnLmpzLWNvbGxhcHNlLWJ0bicpLmxlbmd0aCkge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNvbGxhcHNlLWJ0bicsIGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgJHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCAkY29sbGFwc2VCb2R5ID0gJHNlbGYuY2xvc2VzdCgnLmpzLWNvbGxhcHNlJykuZmluZCgnLmpzLWNvbGxhcHNlLWJvZHknKTtcbiAgICAgICAgICAgIGlmICgkc2VsZi5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcbiAgICAgICAgICAgICAgICAkc2VsZi5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJGNvbGxhcHNlQm9keS5zbGlkZVVwKCdmYXN0Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRzZWxmLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkY29sbGFwc2VCb2R5LnNsaWRlRG93bignZmFzdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQlNC+0LHQsNCy0LvRj9C10YIg0LzQsNGB0LrQuCDQsiDQv9C+0LvRjyDRhNC+0YDQvFxuICAgICAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9Sb2JpbkhlcmJvdHMvSW5wdXRtYXNrXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxpbnB1dCBjbGFzcz1cImpzLXBob25lLW1hc2tcIiB0eXBlPVwidGVsXCIgbmFtZT1cInRlbFwiIGlkPVwidGVsXCI+XG4gICAgICovXG4gICAgJCgnLmpzLXBob25lLW1hc2snKS5pbnB1dG1hc2soJys3KDk5OSkgOTk5LTk5LTk5Jywge1xuICAgICAgICBjbGVhck1hc2tPbkxvc3RGb2N1czogdHJ1ZSxcbiAgICAgICAgc2hvd01hc2tPbkhvdmVyOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqINCh0YLQuNC70LjQt9GD0LXRgiDRgdC10LvQtdC60YLRiyDRgSDQv9C+0LzQvtGJ0YzRjiDQv9C70LDQs9C40L3QsCBzZWxlY3QyXG4gICAgICogaHR0cHM6Ly9zZWxlY3QyLmdpdGh1Yi5pb1xuICAgICAqL1xuICAgIGxldCBDdXN0b21TZWxlY3QgPSBmdW5jdGlvbigkZWxlbSkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi5pbml0ID0gZnVuY3Rpb24oJGluaXRFbGVtKSB7XG4gICAgICAgICAgICAkaW5pdEVsZW0uZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0U2VhcmNoID0gJCh0aGlzKS5kYXRhKCdzZWFyY2gnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gMTsgLy8g0L/QvtC60LDQt9GL0LLQsNC10Lwg0L/QvtC70LUg0L/QvtC40YHQutCwXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IEluZmluaXR5OyAvLyDQvdC1INC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zZWxlY3QyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdE9uQmx1cjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duQ3NzQ2xhc3M6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vUmVzdWx0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAn0KHQvtCy0L/QsNC00LXQvdC40Lkg0L3QtSDQvdCw0LnQtNC10L3Qvic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINC90YPQttC90L4g0LTQu9GPINCy0YvQu9C40LTQsNGG0LjQuCDQvdCwINC70LXRgtGDXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoYG9wdGlvblt2YWx1ZT1cIiR7JCh0aGlzKS52YWx1ZX1cIl1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnVwZGF0ZSA9IGZ1bmN0aW9uKCR1cGRhdGVFbGVtKSB7XG4gICAgICAgICAgICAkdXBkYXRlRWxlbS5zZWxlY3QyKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBzZWxmLmluaXQoJHVwZGF0ZUVsZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuaW5pdCgkZWxlbSk7XG4gICAgfTtcblxuICAgIHZhciBjdXN0b21TZWxlY3QgPSBuZXcgQ3VzdG9tU2VsZWN0KCQoJ3NlbGVjdCcpKTtcblxuICAgIGNvbnN0IGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgZGF0ZUZvcm1hdDogJ2RkLm1tLnl5JyxcbiAgICAgICAgc2hvd090aGVyTW9udGhzOiB0cnVlLFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDQlNC10LvQsNC10YIg0LLRi9C/0LDQtNGO0YnQuNC1INC60LDQu9C10L3QtNCw0YDQuNC60LhcbiAgICAgKiBAc2VlICBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9kYXRlcGlja2VyL1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyDQsiBkYXRhLWRhdGUtbWluINC4IGRhdGEtZGF0ZS1tYXgg0LzQvtC20L3QviDQt9Cw0LTQsNGC0Ywg0LTQsNGC0YMg0LIg0YTQvtGA0LzQsNGC0LUgZGQubW0ueXl5eVxuICAgICAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJkYXRlSW5wdXRcIiBpZD1cIlwiIGNsYXNzPVwianMtZGF0ZXBpY2tlclwiIGRhdGEtZGF0ZS1taW49XCIwNi4xMS4yMDE1XCIgZGF0YS1kYXRlLW1heD1cIjEwLjEyLjIwMTVcIj5cbiAgICAgKi9cbiAgICBsZXQgRGF0ZXBpY2tlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBkYXRlcGlja2VyID0gJCgnLmpzLWRhdGVwaWNrZXInKTtcblxuICAgICAgICBkYXRlcGlja2VyLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgbWluRGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1taW4nKTtcbiAgICAgICAgICAgIGxldCBtYXhEYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1heCcpO1xuICAgICAgICAgICAgY29uc3Qgc2hvd01ZID0gJCh0aGlzKS5kYXRhKCdzaG93LW0teScpO1xuXG4gICAgICAgICAgICAvKiDQtdGB0LvQuCDQsiDQsNGC0YDQuNCx0YPRgtC1INGD0LrQsNC30LDQvdC+IGN1cnJlbnQsINGC0L4g0LLRi9Cy0L7QtNC40Lwg0YLQtdC60YPRidGD0Y4g0LTQsNGC0YMgKi9cbiAgICAgICAgICAgIGlmIChtYXhEYXRlID09PSAnY3VycmVudCcgfHwgbWluRGF0ZSA9PT0gJ2N1cnJlbnQnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50RGF5ID0gY3VycmVudERhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnREYXkgPCAxMCA/IChjdXJyZW50RGF5ID0gJzAnICsgY3VycmVudERheS50b1N0cmluZygpKSA6IGN1cnJlbnREYXk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3RGF0ZSA9IGN1cnJlbnREYXkgKyAnLicgKyAoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpICsgJy4nICsgY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICBtYXhEYXRlID09PSAnY3VycmVudCcgPyAobWF4RGF0ZSA9IG5ld0RhdGUpIDogKG1pbkRhdGUgPSBuZXdEYXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGl0ZW1PcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIG1pbkRhdGU6IG1pbkRhdGUgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICBtYXhEYXRlOiBtYXhEYXRlIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoYW5nZSgpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLmZpZWxkJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChzaG93TVkpIHtcbiAgICAgICAgICAgICAgICBpdGVtT3B0aW9uc1snY2hhbmdlWWVhciddID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpdGVtT3B0aW9uc1sneWVhclJhbmdlJ10gPSAnYy0xMDA6Yyc7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ2NoYW5nZU1vbnRoJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBpdGVtT3B0aW9ucywgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5kYXRlcGlja2VyKGl0ZW1PcHRpb25zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g0LTQtdC70LDQtdC8INC60YDQsNGB0LjQstGL0Lwg0YHQtdC70LXQuiDQvNC10YHRj9GG0LAg0Lgg0LPQvtC00LBcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2ZvY3VzJywgJy5qcy1kYXRlcGlja2VyJywgKCkgPT4ge1xuICAgICAgICAgICAgLy8g0LjRgdC/0L7Qu9GM0LfRg9C10Lwg0LfQsNC00LXRgNC20LrRgywg0YfRgtC+0LHRiyDQtNC10LnRgtC/0LjQutC10YAg0YPRgdC/0LXQuyDQuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0YLRjNGB0Y9cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgkKCcudWktZGF0ZXBpY2tlcicpLmZpbmQoJ3NlbGVjdCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcudWktZGF0ZXBpY2tlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnc2VsZWN0JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZWxlY3QyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd25Dc3NDbGFzczogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBsZXQgZGF0ZXBpY2tlciA9IG5ldyBEYXRlcGlja2VyKCk7XG5cbiAgICBjb25zdCAkbW9iaWxlTWVudSA9ICQoJy5qcy1tb2JpbGUtbWVudScpO1xuICAgIGNvbnN0ICRjYXJ0TW9kYWwgPSAkKCcuanMtY2FydC1tb2RhbCcpO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1tZW51LWJ0bicsICgpID0+IHtcbiAgICAgICAgb3Blbk1vZGFsKCRtb2JpbGVNZW51KTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtbWVudS1jbG9zZScsICgpID0+IHtcbiAgICAgICAgaGlkZU1vZGFsKCRtb2JpbGVNZW51KTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtY2FydC1idG4nLCBlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBvcGVuTW9kYWwoJGNhcnRNb2RhbCk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNhcnQtY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgIGhpZGVNb2RhbCgkY2FydE1vZGFsKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIE9wZW4gbW9kYWwgYmxvY2tcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJG1vZGFsQmxvY2sgTW9kYWwgYmxvY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvcGVuTW9kYWwoJG1vZGFsQmxvY2spIHtcbiAgICAgICAgJG1vZGFsQmxvY2suYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpLmFuaW1hdGVDc3MoJ3NsaWRlSW5SaWdodCcpO1xuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgIGxvY2tEb2N1bWVudCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhpZGUgbW9kYWwgYmxvY2tcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJG1vZGFsQmxvY2sgTW9kYWwgYmxvY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoaWRlTW9kYWwoJG1vZGFsQmxvY2spIHtcbiAgICAgICAgJG1vZGFsQmxvY2suYW5pbWF0ZUNzcygnc2xpZGVPdXRSaWdodCcsICgpID0+IHtcbiAgICAgICAgICAgICRtb2RhbEJsb2NrLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgICAgIHVubG9ja0RvY3VtZW50KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVubG9jayBkb2N1bWVudCBmb3Igc2Nyb2xsXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5sb2NrRG9jdW1lbnQoKSB7XG4gICAgICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnaXMtbG9ja2VkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9jayBkb2N1bWVudCBmb3Igc2Nyb2xsXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRsb2NrQmxvY2sgQmxvY2sgd2hpY2ggZGVmaW5lIGRvY3VtZW50IGhlaWdodFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvY2tEb2N1bWVudCgpIHtcbiAgICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpcy1sb2NrZWQnKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0g0LvQvtCz0LjQutCwINC+0YLQutGA0YvRgtC40Y8g0LLRi9C/0LDQtNCw0YjQtdC6INGF0LXQtNC10YDQsCAtLS0tLS1cbiAgICBjb25zdCAkaGVhZGVyID0gJCgnLmpzLWhlYWRlcicpO1xuXG4gICAgJChkb2N1bWVudCkub24oJ21vdXNlb3ZlcicsICcuanMtaGVhZGVyLWRyb3Bkb3duLWJ0bicsIGUgPT4ge1xuICAgICAgICBjb25zdCAkc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSAkc2VsZi5hdHRyKCdkYXRhLWNhdGVnb3J5Jyk7XG4gICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICRoZWFkZXIucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgIGlmIChjYXRlZ29yeSkge1xuICAgICAgICAgICAgY29uc3QgJGNhdGVnb3J5RHJvcGRvd24gPSAkKGBbZGF0YS1kcm9wZG93bi1jYXRlZ29yeT0nJHtjYXRlZ29yeX0nXWApO1xuICAgICAgICAgICAgJGNhdGVnb3J5RHJvcGRvd24uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJGhlYWRlci5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgICAgICByZXJlbmRlckhlYWRlcigpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignbW91c2VsZWF2ZScsICcuanMtaGVhZGVyJywgZSA9PiB7XG4gICAgICAgIGlmICgkKCcuanMtaGVhZGVyLWRyb3Bkb3duJykuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpKSB7XG4gICAgICAgICAgICAkKCcuanMtaGVhZGVyLWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgICAgICByZXJlbmRlckhlYWRlcigpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBmaXggYnVnIGZvciBzYWZhcmlcbiAgICBmdW5jdGlvbiByZXJlbmRlckhlYWRlcigpIHtcbiAgICAgICAgJGhlYWRlci5oaWRlKCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyRoZWFkZXIuc2hvdygpfSwgMClcbiAgICB9XG5cbiAgICAvLyDQvdC10LzQvdC+0LPQviDRgdC/0LXRhtC40YTQuNGH0L3Ri9C1INGC0LDQsdGLLiDQmNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8g0L3QsCDRgdGC0YDQsNC90LjRhtC1IGNoZWNrb3V0Lmh0bWwuINCf0YDQuCDQttC10LvQsNC90LjQuCDQvNC+0LbQvdC+INC00L7RgNCw0LHQvtGC0LDRgtGMXG5cbiAgICBpZiAoJCgnLmpzLXRhYnMtbGluaycpLmxlbmd0aCkge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLXRhYnMtbGluaycsIGUgPT4ge1xuICAgICAgICAgICAgLy8gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgJHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCk7XG5cbiAgICAgICAgICAgIGlmICgkc2VsZi5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgJHRhYnMgPSAkc2VsZi5jbG9zZXN0KCcuanMtdGFicycpO1xuICAgICAgICAgICAgY29uc3QgJHRhYnNMaW5rcyA9ICR0YWJzLmZpbmQoJy5qcy10YWJzLWxpbmsnKTtcbiAgICAgICAgICAgIGNvbnN0ICR0YWJzSXRlbXMgPSAkdGFicy5maW5kKCcuanMtdGFicy1pdGVtJyk7XG5cbiAgICAgICAgICAgIC8vINCy0YvQutC70Y7Rh9Cw0LXQvCDQstGB0LUg0LDQutGC0LjQstC90YvQtSDRgtCw0LHRiyDQuCDRgdGB0YvQu9C60LhcbiAgICAgICAgICAgICR0YWJzTGlua3MucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJHRhYnNJdGVtcy5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIC8vINCy0YvQutC70Y7Rh9Cw0LXQvCDQstCw0LvQuNC00LDRhtC40Y4g0YMg0YHQutGA0YvRgtGL0YUg0L/QvtC70LXQuSDQuCDQvtGH0LjRidCw0LXQvCDQuNGFXG4gICAgICAgICAgICBsZXQgJGhpZGRlbkZvcm1GaWVsZHMgPSAkdGFic0l0ZW1zLmZpbmQoJ1tkYXRhLXJlcXVpcmVkXScpO1xuICAgICAgICAgICAgaWYgKCRoaWRkZW5Gb3JtRmllbGRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRoaWRkZW5Gb3JtRmllbGRzLnByb3AoJ2RhdGEtcmVxdWlyZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgncmVxdWlyZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMudmFsKCcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0LLQutC70Y7Rh9Cw0LXQvCDQvdGD0LbQvdGL0Lkg0YLQsNCxINC4INC00LXQu9Cw0LXQvCDQvdGD0LbQvdGD0Y4g0YHRgdGL0LvQutGDINCw0LrRgtC40LLQvdC+0LlcbiAgICAgICAgICAgICRzZWxmLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIGNvbnN0ICRzZWxmSXRlbSA9ICQoJHNlbGYuZGF0YSgndGFiJykpO1xuICAgICAgICAgICAgJHNlbGZJdGVtLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8g0LLQutC70Y7Rh9Cw0LXQvCDQstCw0LvQuNC00LDRhtC40Y4g0YMg0YHQutGA0YvRgtGL0YUg0L/QvtC70LXQuVxuICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMgPSAkc2VsZkl0ZW0uZmluZCgnW2RhdGEtcmVxdWlyZWRdJyk7XG4gICAgICAgICAgICBpZiAoJGhpZGRlbkZvcm1GaWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgnZGF0YS1yZXF1aXJlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICRoaWRkZW5Gb3JtRmllbGRzLnByb3AoJ3JlcXVpcmVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICAg0JDQutGC0LjQstC40YDQvtCy0LDRgtGML9C00LXQt9Cw0LrRgtC40LLQuNGA0L7QstCw0YLRjCDRgdC/0LjQvdC90LXRgFxuICAgICAqICAgY29uc3QgJGJsb2NrID0gJCgnLnNwaW5uZXInKTtcbiAgICAgKiAgIGNvbnN0IHNwaW5uZXIgPSBTcGlubmVyLmdldEluc3RhbmNlKCRibG9jayk7XG4gICAgICogICBzcGlubmVyLmVuYWJsZVNwaW5uZXIoKTsvc3Bpbm5lci5kaXNhYmxlU3Bpbm5lcigpO1xuICAgICAqXG4gICAgICovXG5cbiAgICBjbGFzcyBTcGlubmVyIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gIG9wdGlvbnMgICAgICAgICAgICAgICAgICAg0J7QsdGK0LXQutGCINGBINC/0LDRgNCw0LzQtdGC0YDQsNC80LguXG4gICAgICAgICAqIEBwYXJhbSAge2pRdWVyeX0gIG9wdGlvbnMuJGJsb2NrICAgICAgICAgICAg0KjQsNCx0LvQvtC9LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy52YWx1ZSA9IDBdICAgICAgINCd0LDRh9Cw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5taW4gPSAtSW5maW5pdHldINCc0LjQvdC40LzQsNC70YzQvdC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMubWF4ID0gSW5maW5pdHldICDQnNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMuc3RlcCA9IDFdICAgICAgICDQqNCw0LMuXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLnByZWNpc2lvbl0gICAgICAg0KLQvtGH0L3QvtGB0YLRjCAo0L3Rg9C20L3QsCDQtNC70Y8g0LTQtdGB0Y/RgtC40YfQvdC+0LPQviDRiNCw0LPQsCkuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3Rvcih7ICRibG9jaywgdmFsdWUgPSAwLCBtaW4gPSAtSW5maW5pdHksIG1heCA9IEluZmluaXR5LCBzdGVwID0gMSwgcHJlY2lzaW9uIH0gPSB7fSkge1xuICAgICAgICAgICAgdGhpcy4kYmxvY2sgPSAkYmxvY2s7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzID0ge1xuICAgICAgICAgICAgICAgICRkZWM6ICQoJy5zcGlubmVyX19idG4tLWRlYycsIHRoaXMuJGJsb2NrKSxcbiAgICAgICAgICAgICAgICAkaW5jOiAkKCcuc3Bpbm5lcl9fYnRuLS1pbmMnLCB0aGlzLiRibG9jayksXG4gICAgICAgICAgICAgICAgJGlucHV0OiAkKCcuc3Bpbm5lcl9faW5wdXQnLCB0aGlzLiRibG9jayksXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gK3ZhbHVlO1xuICAgICAgICAgICAgdGhpcy5taW4gPSArbWluO1xuICAgICAgICAgICAgdGhpcy5tYXggPSArbWF4O1xuICAgICAgICAgICAgdGhpcy5zdGVwID0gK3N0ZXA7XG4gICAgICAgICAgICB0aGlzLnByZWNpc2lvbiA9ICtwcmVjaXNpb247XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0J/RgNC40LLQvtC00LjRgiDRgNCw0LfQvNC10YLQutGDINCyINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjQtSDQv9Cw0YDQsNC80LXRgtGA0LDQvC5cbiAgICAgICAgICovXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvbnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0YHQvtGB0YLQvtGP0L3QuNC1INCx0LvQvtC60LjRgNC+0LLQutC4INC60L3QvtC/0L7Qui5cbiAgICAgICAgICovXG4gICAgICAgIHVwZGF0ZUJ1dHRvbnMoKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRkZWMucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbmMucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlIDwgdGhpcy5taW4gKyB0aGlzLnN0ZXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRkZWMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPiB0aGlzLm1heCAtIHRoaXMuc3RlcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGluYy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCe0YLQutC70Y7Rh9C10L3QuNC1INGB0L/QuNC90L3QtdGA0LAuXG4gICAgICAgICAqL1xuICAgICAgICBkaXNhYmxlU3Bpbm5lcigpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGRlYy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5jLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbnB1dC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2suYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0JLQutC70Y7Rh9C10L3QuNC1INGB0L/QuNC90L3QtdGA0LAuXG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVTcGlubmVyKCkge1xuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbnB1dC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQt9C90LDRh9C10L3QuNC1INGB0YfRkdGC0YfQuNC60LAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VWYWx1ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2suYXR0cignZGF0YS12YWx1ZScsIHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LmF0dHIoJ3ZhbHVlJywgdmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQnNC10L3Rj9C10YIg0LfQvdCw0YfQtdC90LjQtSDQvNC40L3QuNC80YPQvNCwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IHZhbHVlINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICovXG4gICAgICAgIGNoYW5nZU1pbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5taW4gPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLmF0dHIoJ2RhdGEtbWluJywgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCc0LXQvdGP0LXRgiDQt9C90LDRh9C10L3QuNC1INC80LDQutGB0LjQvNGD0LzQsC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSB2YWx1ZSDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VNYXgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMubWF4ID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hdHRyKCdkYXRhLW1heCcsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQnNCw0YHRgdC40LIg0YHQvtC30LTQsNC90L3Ri9GFINC+0LHRitC10LrRgtC+0LIuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgaW5zdGFuY2VzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCd0LDRhdC+0LTQuNGCINC+0LHRitC10LrRgiDQutC70LDRgdGB0LAg0L/QviDRiNCw0LHQu9C+0L3Rgy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7alF1ZXJ5fSAkYmxvY2sg0KjQsNCx0LvQvtC9LlxuICAgICAgICAgKiBAcmV0dXJuIHtTcGlubmVyfSAgICAgICDQntCx0YrQtdC60YIuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoJGJsb2NrKSB7XG4gICAgICAgICAgICByZXR1cm4gU3Bpbm5lci5pbnN0YW5jZXMuZmluZChzcGlubmVyID0+IHNwaW5uZXIuJGJsb2NrLmlzKCRibG9jaykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCh0L7Qt9C00LDRkdGCINC+0LHRitC10LrRgtGLINC/0L4g0YjQsNCx0LvQvtC90LDQvC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9IFskc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpXSDQqNCw0LHQu9C+0L3Riy5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyBjcmVhdGUoJHNwaW5uZXJzID0gJCgnLnNwaW5uZXInKSkge1xuICAgICAgICAgICAgJHNwaW5uZXJzLmVhY2goKGluZGV4LCBibG9jaykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRibG9jayA9ICQoYmxvY2spO1xuXG4gICAgICAgICAgICAgICAgaWYgKFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3Bpbm5lciA9IG5ldyBTcGlubmVyKHtcbiAgICAgICAgICAgICAgICAgICAgJGJsb2NrLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJGJsb2NrLmF0dHIoJ2RhdGEtdmFsdWUnKSxcbiAgICAgICAgICAgICAgICAgICAgbWluOiAkYmxvY2suYXR0cignZGF0YS1taW4nKSxcbiAgICAgICAgICAgICAgICAgICAgbWF4OiAkYmxvY2suYXR0cignZGF0YS1tYXgnKSxcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogJGJsb2NrLmF0dHIoJ2RhdGEtc3RlcCcpLFxuICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb246ICRibG9jay5hdHRyKCdkYXRhLXByZWNpc2lvbicpLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJGJsb2NrLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpID8gc3Bpbm5lci5kaXNhYmxlU3Bpbm5lcigpIDogc3Bpbm5lci5pbml0KCk7XG5cbiAgICAgICAgICAgICAgICBTcGlubmVyLmluc3RhbmNlcy5wdXNoKHNwaW5uZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0KPQtNCw0LvRj9C10YIg0L7QsdGK0LXQutGC0Ysg0L/QviDRiNCw0LHQu9C+0L3QsNC8LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gWyRzcGlubmVycyA9ICQoJy5zcGlubmVyJyldINCo0LDQsdC70L7QvdGLLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIHJlbW92ZSgkc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpKSB7XG4gICAgICAgICAgICAkc3Bpbm5lcnMuZWFjaCgoaW5kZXgsIGJsb2NrKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGJsb2NrID0gJChibG9jayk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzcGlubmVySW5kZXggPSBTcGlubmVyLmluc3RhbmNlcy5maW5kSW5kZXgoc3Bpbm5lciA9PiBzcGlubmVyLiRibG9jay5pcygkYmxvY2spKTtcblxuICAgICAgICAgICAgICAgIFNwaW5uZXIuaW5zdGFuY2VzLnNwbGljZShzcGlubmVySW5kZXgsIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnNwaW5uZXJfX2J0bi0tZGVjJywgaGFuZGxlRGVjQ2xpY2spO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc3Bpbm5lcl9fYnRuLS1pbmMnLCBoYW5kbGVJbmNDbGljayk7XG4gICAgJChkb2N1bWVudCkub24oJ2lucHV0JywgJy5zcGlubmVyX19pbnB1dCcsIGhhbmRsZUlucHV0KTtcblxuICAgIC8qINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L/QuNC90L3QtdGA0L7QsiAqL1xuICAgIGxldCBzcGlubmVycyA9IFNwaW5uZXIuY3JlYXRlKCk7XG5cbiAgICAvKipcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQutC70LjQutCwINC/0L4g0LrQvdC+0L/QutC1INGD0LzQtdC90YzRiNC10L3QuNGPLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGUg0J7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZURlY0NsaWNrKGUpIHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VGFyZ2V0IH0gPSBlO1xuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChjdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgJGJsb2NrID0gJHRhcmdldC5jbG9zZXN0KCcuc3Bpbm5lcicpO1xuICAgICAgICBjb25zdCBzcGlubmVyID0gU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHNwaW5uZXIudmFsdWUgLSBzcGlubmVyLnN0ZXA7XG5cbiAgICAgICAgaWYgKHNwaW5uZXIucHJlY2lzaW9uKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUudG9GaXhlZChzcGlubmVyLnByZWNpc2lvbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Bpbm5lci5jaGFuZ2VWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgICAgc3Bpbm5lci51cGRhdGVCdXR0b25zKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0LrQu9C40LrQsCDQv9C+INC60L3QvtC/0LrQtSDRg9Cy0LXQu9C40YfQtdC90LjRjy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlINCe0LHRitC10LrRgiDRgdC+0LHRi9GC0LjRjy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYW5kbGVJbmNDbGljayhlKSB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudFRhcmdldCB9ID0gZTtcbiAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0ICRibG9jayA9ICR0YXJnZXQuY2xvc2VzdCgnLnNwaW5uZXInKTtcbiAgICAgICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBzcGlubmVyLnZhbHVlICsgc3Bpbm5lci5zdGVwO1xuXG4gICAgICAgIGlmIChzcGlubmVyLnByZWNpc2lvbikge1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlLnRvRml4ZWQoc3Bpbm5lci5wcmVjaXNpb24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW5uZXIuY2hhbmdlVmFsdWUodmFsdWUpO1xuXG4gICAgICAgIHNwaW5uZXIudXBkYXRlQnV0dG9ucygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INCy0LLQvtC00LAg0LIg0L/QvtC70LUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZSDQntCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFuZGxlSW5wdXQoZSkge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRUYXJnZXQgfSA9IGU7XG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCAkYmxvY2sgPSAkdGFyZ2V0LmNsb3Nlc3QoJy5zcGlubmVyJyk7XG4gICAgICAgIGNvbnN0IHNwaW5uZXIgPSBTcGlubmVyLmdldEluc3RhbmNlKCRibG9jayk7XG4gICAgICAgIGNvbnN0IHsgJGlucHV0IH0gPSBzcGlubmVyLmVsZW1lbnRzO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9ICskaW5wdXQudmFsKCk7XG5cbiAgICAgICAgaWYgKCEkaW5wdXQudmFsKCkubGVuZ3RoIHx8IHZhbHVlIDwgc3Bpbm5lci5taW4gfHwgdmFsdWUgPiBzcGlubmVyLm1heCkge1xuICAgICAgICAgICAgKHsgdmFsdWUgfSA9IHNwaW5uZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Bpbm5lci5jaGFuZ2VWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgICAgc3Bpbm5lci51cGRhdGVCdXR0b25zKCk7XG4gICAgfVxuXG4gICAgaW5pdENhcm91c2VscygpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBpbml0Q2Fyb3VzZWxzKTtcblxuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10YIg0LLRgdC1INC60LDRgNGD0YHQtdC70LhcbiAgICBmdW5jdGlvbiBpbml0Q2Fyb3VzZWxzKCkge1xuICAgICAgICAvLyAg0LrQsNGA0YPRgdC10LvRjCDQvdCwINC/0LXRgNCy0L7QvCDQsdCw0L3QvdC10YDQtSDQvdCwINCz0LvQsNCy0L3QvtC5INGB0YLRgNCw0L3QuNGG0LVcbiAgICAgICAgY29uc3QgJG5ld3NDYXJvdXNlbCA9ICQoJy5qcy1uZXdzLWNhcm91c2VsJyk7XG4gICAgICAgIGlmICgkbmV3c0Nhcm91c2VsLmxlbmd0aCAmJiAhJG5ld3NDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJG5ld3NDYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogMTAyMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiAndW5zbGljaycsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQv9C+0LTQsdC+0YDQsCDQsdCw0LnQutC+0LJcbiAgICAgICAgY29uc3QgJGJpa2VzQ2Fyb3VzZWwgPSAkKCcuanMtYmlrZXMtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRiaWtlc0Nhcm91c2VsLmxlbmd0aCAmJiAhJGJpa2VzQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRiaWtlc0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogJ3Vuc2xpY2snLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgYmlrZSBhZnRlciBpbml0XG4gICAgICAgICAgICAkYmlrZXNDYXJvdXNlbFxuICAgICAgICAgICAgICAgIC5maW5kKCcuc2xpY2stYWN0aXZlJylcbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXQnKVxuICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGJpa2UgYWZ0ZXIgY2hhbmdlXG4gICAgICAgICAgICAkYmlrZXNDYXJvdXNlbC5vbignYWZ0ZXJDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJGJpa2VzQ2Fyb3VzZWxcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXQnKVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC60LDRgtC10LPQvtGA0LjQuVxuICAgICAgICBjb25zdCAkY2F0ZWdvcmllc0Nhcm91c2VsID0gJCgnLmpzLWNhdGVnb3JpZXMtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRjYXRlZ29yaWVzQ2Fyb3VzZWwubGVuZ3RoICYmICEkY2F0ZWdvcmllc0Nhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkY2F0ZWdvcmllc0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnMCcsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiAndW5zbGljaycsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQv9GA0L7QtdC60YLQvtCyINC4L9C40LvQuCDRgdC+0LHRi9GC0LjQuVxuICAgICAgICBjb25zdCAkcHJvamVjdHNDYXJvdXNlbCA9ICQoJy5qcy1wcm9qZWN0cy1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJHByb2plY3RzQ2Fyb3VzZWwubGVuZ3RoICYmICEkcHJvamVjdHNDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJHByb2plY3RzQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICcwJyxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY3LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNjM5LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vINC60LDRgNGD0YHQtdC70Ywg0L3QsCDQs9C70LDQstC90L7QuVxuICAgICAgICBjb25zdCAkaW5kZXhNYWluQ2Fyb3VzZWwgPSAkKCcuanMtaW5kZXgtbWFpbi1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJGluZGV4TWFpbkNhcm91c2VsLmxlbmd0aCAmJiAhJGluZGV4TWFpbkNhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkaW5kZXhNYWluQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICcwJyxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC60LDRgNGC0LjQvdC+0Log0YLQvtCy0LDRgNCwXG4gICAgICAgIGNvbnN0ICRwcm9kdWN0Q2Fyb3VzZWwgPSAkKCcuanMtcHJvZHVjdC1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJHByb2R1Y3RDYXJvdXNlbC5sZW5ndGggJiYgISRwcm9kdWN0Q2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRwcm9kdWN0Q2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIHByZXZBcnJvdzpcbiAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWFycm93IGJ0bi1hcnJvdy0tcHJldiBwcm9kdWN0LXBhZ2VfX2Nhcm91c2VsLXByZXZcIj48c3ZnIGNsYXNzPVwiaWNvbiBpY29uLS1hcnJvdy1uZXh0XCI+PHVzZSB4bGluazpocmVmPVwiI2ljb24tYXJyb3dfbmV4dFwiPjwvdXNlPjwvc3ZnPjwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgbmV4dEFycm93OlxuICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4tYXJyb3cgcHJvZHVjdC1wYWdlX19jYXJvdXNlbC1uZXh0XCI+PHN2ZyBjbGFzcz1cImljb24gaWNvbi0tYXJyb3ctbmV4dFwiPjx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWFycm93X25leHRcIj48L3VzZT48L3N2Zz48L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY4LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHByb2R1Y3RDYXJvdXNlbC5vbignYWZ0ZXJDaGFuZ2UnLCAoc2xpY2ssIGN1cnJlbnRTbGlkZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRwYXJlbnQgPSAkKHNsaWNrLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJy5wcm9kdWN0LXBhZ2VfX2Nhcm91c2VsLXdyYXBwZXInKTtcbiAgICAgICAgICAgICAgICAkcGFyZW50LmZpbmQoJy5wcm9kdWN0LXBhZ2VfX2Nhcm91c2VsLWJ0bnMtcGljJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRwYXJlbnQuZmluZChgW2RhdGEtc2xpZGU9JHtjdXJyZW50U2xpZGUuY3VycmVudFNsaWRlfV1gKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g0YDQtdCw0LvQuNC30L7QstGL0LLQsNC10Lwg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INGB0LvQsNC50LTQvtCyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnByb2R1Y3QtcGFnZV9fY2Fyb3VzZWwtYnRucy1waWMnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkYnRuID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRwYXJlbnQgPSAkYnRuLmNsb3Nlc3QoJy5wcm9kdWN0LXBhZ2VfX2Nhcm91c2VsLXdyYXBwZXInKTtcbiAgICAgICAgICAgICAgICBjb25zdCAkcHJvZHVjdENhcm91c2VsID0gJHBhcmVudC5maW5kKCcuanMtcHJvZHVjdC1jYXJvdXNlbCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNsaWRlSWQgPSAkYnRuLmRhdGEoJ3NsaWRlJyk7XG4gICAgICAgICAgICAgICAgJHBhcmVudC5maW5kKCcucHJvZHVjdC1wYWdlX19jYXJvdXNlbC1idG5zLXBpYycpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkYnRuLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkcHJvZHVjdENhcm91c2VsLnNsaWNrKCdzbGlja0dvVG8nLCBzbGlkZUlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQv9C+0YXQvtC20LjRhSDRgtC+0LLQsNGA0L7QslxuICAgICAgICBjb25zdCAkc2ltaWxhckNhcm91c2VsID0gJCgnLmpzLXNpbWlsYXItY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRzaW1pbGFyQ2Fyb3VzZWwubGVuZ3RoICYmICEkc2ltaWxhckNhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkc2ltaWxhckNhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnMCcsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDYzOSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiAndW5zbGljaycsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQutCw0YDRgtC40L3QvtC6XG4gICAgICAgIGNvbnN0ICRwaWN0dXJlQ2Fyb3VzZWwgPSAkKCcuanMtcGljdHVyZS1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJHBpY3R1cmVDYXJvdXNlbC5sZW5ndGggJiYgISRwaWN0dXJlQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRwaWN0dXJlQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCAkYmlrZUNhcmRDYXJvdXNlbCA9ICQoJy5qcy1iaWtlLWNhcmQtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRiaWtlQ2FyZENhcm91c2VsLmxlbmd0aCAmJiAhJGJpa2VDYXJkQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRiaWtlQ2FyZENhcm91c2VsLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgJChpdGVtKS5zbGljayh7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBmYWRlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vINGA0LXQsNC70LjQt9C+0LLRi9Cy0LDQtdC8INC/0LXRgNC10LrQu9GO0YfQtdC90LjQtSDRgdC70LDQudC00L7QslxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1iaWtlLWNhcmQtc2xpZGUtYnRuJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGJ0biA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBjb25zdCAkcGFyZW50ID0gJGJ0bi5jbG9zZXN0KCcuYmlrZS1jYXJkJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgJGNhcm91c2VsID0gJHBhcmVudC5maW5kKCcuanMtYmlrZS1jYXJkLWNhcm91c2VsJyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2xpZGVJZCA9ICRidG4uZGF0YSgnc2xpZGUnKTtcbiAgICAgICAgICAgICAgICAkcGFyZW50LmZpbmQoJy5qcy1iaWtlLWNhcmQtc2xpZGUtYnRuJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRidG4uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRjYXJvdXNlbC5zbGljaygnc2xpY2tHb1RvJywgc2xpZGVJZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vINC60LDRgNGD0YHQtdC70Ywg0LrQsNGA0YLQuNC90L7QuiDRgtC+0LLQsNGA0LBcbiAgICAgICAgY29uc3QgJHBpY3R1cmVzQ2Fyb3VzZWwgPSAkKCcuanMtcGljdHVyZXMtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRwaWN0dXJlc0Nhcm91c2VsLmxlbmd0aCAmJiAhJHBpY3R1cmVzQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRwaWN0dXJlc0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IHRydWUsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXG4gICAgICAgICAgICAgICAgcHJldkFycm93OlxuICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4tYXJyb3cgYnRuLWFycm93LS1wcmV2IHBpY3R1cmVzX19jYXJvdXNlbC1idG4tcHJldlwiPjxzdmcgY2xhc3M9XCJpY29uIGljb24tLWFycm93LW5leHRcIj48dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1hcnJvd19uZXh0XCI+PC91c2U+PC9zdmc+PC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICBuZXh0QXJyb3c6XG4gICAgICAgICAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1hcnJvdyBwaWN0dXJlc19fY2Fyb3VzZWwtYnRuLW5leHRcIj48c3ZnIGNsYXNzPVwiaWNvbiBpY29uLS1hcnJvdy1uZXh0XCI+PHVzZSB4bGluazpocmVmPVwiI2ljb24tYXJyb3dfbmV4dFwiPjwvdXNlPjwvc3ZnPjwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjgsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkcGljdHVyZXNDYXJvdXNlbC5vbignYWZ0ZXJDaGFuZ2UnLCAoc2xpY2ssIGN1cnJlbnRTbGlkZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRwYXJlbnQgPSAkKHNsaWNrLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJy5waWN0dXJlcycpO1xuICAgICAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLnBpY3R1cmVzX190aHVtYnMtaXRlbScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkcGFyZW50LmZpbmQoYFtkYXRhLXNsaWRlPSR7Y3VycmVudFNsaWRlLmN1cnJlbnRTbGlkZX1dYCkuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vINGA0LXQsNC70LjQt9C+0LLRi9Cy0LDQtdC8INC/0LXRgNC10LrQu9GO0YfQtdC90LjQtSDRgdC70LDQudC00L7QslxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5waWN0dXJlc19fdGh1bWJzLWl0ZW0nLCBlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkYnRuID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRwYXJlbnQgPSAkYnRuLmNsb3Nlc3QoJy5waWN0dXJlcycpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRwaWN0dXJlc0Nhcm91c2VsID0gJHBhcmVudC5maW5kKCcuanMtcGljdHVyZXMtY2Fyb3VzZWwnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzbGlkZUlkID0gJGJ0bi5kYXRhKCdzbGlkZScpO1xuICAgICAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLnBpY3R1cmVzX190aHVtYnMtaXRlbScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkYnRuLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkcGljdHVyZXNDYXJvdXNlbC5zbGljaygnc2xpY2tHb1RvJywgc2xpZGVJZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0ICR1cEJ0biA9ICQoJy5qcy1idG4tdXAnKTtcblxuICAgIGlmICgkdXBCdG4ubGVuZ3RoKSB7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtYnRuLXVwJywgKCkgPT4ge1xuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+PSBnbG9iYWxPcHRpb25zLnRhYmxldExnU2l6ZSkge1xuICAgICAgICAgICAgICAgICQod2luZG93KS5zY3JvbGxUb3AoKSA+IDUwID8gJHVwQnRuLnNob3coKSA6ICR1cEJ0bi5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0ICRmaWx0ZXJNb2RhbCA9ICQoJy5qcy1maWx0ZXItbW9kYWwnKTtcbiAgICBpZiAoJGZpbHRlck1vZGFsLmxlbmd0aCkge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWZpbHRlci1idG4nLCBlID0+IHtcbiAgICAgICAgICAgICRmaWx0ZXJNb2RhbC5hZGRDbGFzcygnaXMtYWN0aXZlJykuYW5pbWF0ZUNzcygnc2xpZGVJblJpZ2h0Jyk7XG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hhcy1vdmVybGF5Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtZmlsdGVyLWNsb3NlJywgZSA9PiB7XG4gICAgICAgICAgICAkZmlsdGVyTW9kYWwuYW5pbWF0ZUNzcygnc2xpZGVPdXRSaWdodCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAkZmlsdGVyTW9kYWwucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLmpzLWxhYmVsLWFuaW1hdGlvbicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqINCQ0L3QuNC80LDRhtC40Y8g0Y3Qu9C10LzQtdC90YLQsCBsYWJlbCDQv9GA0Lgg0YTQvtC60YPRgdC1INC/0L7Qu9C10Lkg0YTQvtGA0LzRi1xuICAgICAgICAgKi9cbiAgICAgICAgJCgnLmpzLWxhYmVsLWFuaW1hdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9ICQoZWwpLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYScpO1xuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgJChmaWVsZClcbiAgICAgICAgICAgICAgICAgICAgLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgIC50cmltKCkgIT0gJycgfHxcbiAgICAgICAgICAgICAgICAkKGZpZWxkKS5pcygnOnBsYWNlaG9sZGVyLXNob3duJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICQoZWwpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJChmaWVsZClcbiAgICAgICAgICAgICAgICAub24oJ2ZvY3VzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKCdibHVyJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCkgPT09ICcnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhJChmaWVsZCkuaXMoJzpwbGFjZWhvbGRlci1zaG93bicpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChlbCkucmVtb3ZlQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qIEBzZWUgaHR0cHM6Ly9hdG9taWtzLmdpdGh1Yi5pby90aXBweWpzLyAqL1xuXG4gICAgY29uc3QgdG9vbHRpcFNldHRpbmdzID0ge1xuICAgICAgICBhcnJvdzogZmFsc2UsXG4gICAgICAgIGFsbG93SFRNTDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGVGaWxsOiBmYWxzZSxcbiAgICAgICAgcGxhY2VtZW50OiAncmlnaHQtY2VudGVyJyxcbiAgICAgICAgZGlzdGFuY2U6IDIwLFxuICAgICAgICB0aGVtZTogJ3Rvb2x0aXAnLFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiAgaW5pdCBhbGwgdG9vbHRpcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0VG9vbHRpcHMoKSB7XG4gICAgICAgICQoJ1tkYXRhLXRvb2x0aXBdJykuZWFjaCgoaW5kZXgsIGVsZW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2FsU2V0dGluZ3MgPSB7XG4gICAgICAgICAgICAgICAgY29udGVudDogJChlbGVtKS5hdHRyKCdkYXRhLXRvb2x0aXAnKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoJChlbGVtKS5kYXRhKCdjbGljaycpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTZXR0aW5nc1sndHJpZ2dlciddID0gJ2NsaWNrIGtleXVwJztcbiAgICAgICAgICAgICAgICBsb2NhbFNldHRpbmdzWydpbnRlcmFjdGl2ZSddID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGlwcHkoZWxlbSwgT2JqZWN0LmFzc2lnbih7fSwgdG9vbHRpcFNldHRpbmdzLCBsb2NhbFNldHRpbmdzKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRUb29sdGlwcygpO1xuXG4gICAgLy8gc2hvcCBhZGRyZXNzXG4gICAgLy8g0JzQvtGB0LrQvtCy0YHQutCw0Y8g0L7QsdC70LDRgtGMLCDQodC+0LvQvdC10YfQvdC+0LPQvtGA0YHQutC40Lkg0YDQsNC50L7QvSwg0LQuINCU0YPRgNGL0LrQuNC90L4sIDHQlC5cbiAgICBjb25zdCBzaG9wID0geyBsYXQ6IDU2LjA1OTY5NSwgbG5nOiAzNy4xNDQxNDIgfTtcblxuICAgIC8vIGZvciBibGFjayBtYXBcbiAgICBjb25zdCBtYXBTdHlsZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnZ2VvbWV0cnknLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMjEyMTIxJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMuaWNvbicsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAnb2ZmJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzc1NzU3NScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuc3Ryb2tlJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzIxMjEyMScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAnYWRtaW5pc3RyYXRpdmUnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM3NTc1NzUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ2FkbWluaXN0cmF0aXZlLmNvdW50cnknLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzllOWU5ZScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAnYWRtaW5pc3RyYXRpdmUubGFuZF9wYXJjZWwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ29mZicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAnYWRtaW5pc3RyYXRpdmUubG9jYWxpdHknLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2JkYmRiZCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncG9pJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM3NTc1NzUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3BvaS5wYXJrJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnZ2VvbWV0cnknLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMTgxODE4JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdwb2kucGFyaycsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNjE2MTYxJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdwb2kucGFyaycsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LnN0cm9rZScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMxYjFiMWInLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3JvYWQnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdnZW9tZXRyeS5maWxsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzJjMmMyYycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncm9hZCcsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOGE4YThhJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdyb2FkLmFydGVyaWFsJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnZ2VvbWV0cnknLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMzczNzM3JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdyb2FkLmhpZ2h3YXknLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzYzNjM2MnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3JvYWQuaGlnaHdheS5jb250cm9sbGVkX2FjY2VzcycsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2dlb21ldHJ5JyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzRlNGU0ZScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncm9hZC5sb2NhbCcsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNjE2MTYxJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICd0cmFuc2l0JyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM3NTc1NzUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3dhdGVyJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnZ2VvbWV0cnknLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICd3YXRlcicsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2QzZDNkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICBdO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBhbmQgYWRkIHRoZSBtYXBcbiAgICBmdW5jdGlvbiBpbml0TWFwKCkge1xuICAgICAgICAvLyBUaGUgbWFwLCBjZW50ZXJlZCBhdCBTaG9wXG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgICAgICB6b29tOiAxNCxcbiAgICAgICAgICAgIGNlbnRlcjogc2hvcCxcbiAgICAgICAgICAgIHN0eWxlczogbWFwU3R5bGVzLFxuICAgICAgICAgICAgem9vbUNvbnRyb2w6IHRydWUsXG4gICAgICAgICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2UsXG4gICAgICAgICAgICBzY2FsZUNvbnRyb2w6IHRydWUsXG4gICAgICAgICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2UsXG4gICAgICAgICAgICByb3RhdGVDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgIGZ1bGxzY3JlZW5Db250cm9sOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBwb2ludEljb24gPSB7XG4gICAgICAgICAgICB1cmw6ICdpbWcvc3ZnL3BvaW50LnN2ZycsXG4gICAgICAgICAgICAvLyBUaGlzIG1hcmtlciBpcyA3MiBwaXhlbHMgd2lkZSBieSA3MiBwaXhlbHMgaGlnaC5cbiAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDcyLCA3MiksXG4gICAgICAgICAgICAvLyBUaGUgb3JpZ2luIGZvciB0aGlzIGltYWdlIGlzICgwLCAwKS5cbiAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgLy8gVGhlIGFuY2hvciBmb3IgdGhpcyBpbWFnZSBpcyB0aGUgY2VudGVyIGF0ICgwLCAzMikuXG4gICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgzNiwgMzYpLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRoZSBtYXJrZXIsIHBvc2l0aW9uZWQgYXQgc2hvcFxuICAgICAgICBjb25zdCBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBzaG9wLFxuICAgICAgICAgICAgaWNvbjogcG9pbnRJY29uLFxuICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHdpbmRvdy5pbml0TWFwID0gaW5pdE1hcDtcblxuO1xufSk7XG4iXSwiZmlsZSI6ImludGVybmFsLmpzIn0=

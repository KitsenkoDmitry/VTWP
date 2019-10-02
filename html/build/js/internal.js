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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wTGdTaXplIiwiZGVza3RvcE1kU2l6ZSIsImRlc2t0b3BTaXplIiwiZGVza3RvcFNtU2l6ZSIsInRhYmxldExnU2l6ZSIsInRhYmxldFNpemUiLCJtb2JpbGVMZ1NpemUiLCJtb2JpbGVTaXplIiwibGFuZyIsImF0dHIiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnREZXNrdG9wTGciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYnJlYWtwb2ludERlc2t0b3BNZCIsImJyZWFrcG9pbnREZXNrdG9wIiwiYnJlYWtwb2ludERlc2t0b3BTbSIsImJyZWFrcG9pbnRUYWJsZXRMZyIsImJyZWFrcG9pbnRUYWJsZXQiLCJicmVha3BvaW50TW9iaWxlTGdTaXplIiwiYnJlYWtwb2ludE1vYmlsZSIsImV4dGVuZCIsIm9uIiwibGVuZ3RoIiwiYXV0b3NpemUiLCJmbiIsImFuaW1hdGVDc3MiLCJhbmltYXRpb25OYW1lIiwiY2FsbGJhY2siLCJhbmltYXRpb25FbmQiLCJlbCIsImFuaW1hdGlvbnMiLCJhbmltYXRpb24iLCJPQW5pbWF0aW9uIiwiTW96QW5pbWF0aW9uIiwiV2Via2l0QW5pbWF0aW9uIiwidCIsInN0eWxlIiwidW5kZWZpbmVkIiwiY3JlYXRlRWxlbWVudCIsImFkZENsYXNzIiwib25lIiwicmVtb3ZlQ2xhc3MiLCJpc051bWVyaWMiLCJuIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJyZW1vdmVOb3REaWdpdHMiLCJwYXJhbSIsInRvU3RyaW5nIiwicmVwbGFjZSIsImRpdmlkZUJ5RGlnaXRzIiwibG9jYWxlIiwiUGFyc2xleSIsInNldExvY2FsZSIsIm9wdGlvbnMiLCJ0cmlnZ2VyIiwidmFsaWRhdGlvblRocmVzaG9sZCIsImVycm9yc1dyYXBwZXIiLCJlcnJvclRlbXBsYXRlIiwiY2xhc3NIYW5kbGVyIiwiaW5zdGFuY2UiLCIkZWxlbWVudCIsInR5cGUiLCIkaGFuZGxlciIsImhhc0NsYXNzIiwibmV4dCIsImVycm9yc0NvbnRhaW5lciIsIiRjb250YWluZXIiLCJjbG9zZXN0IiwicGFyZW50IiwiYWRkVmFsaWRhdG9yIiwidmFsaWRhdGVTdHJpbmciLCJ2YWx1ZSIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJkYXRhIiwibWF4IiwibWluRGF0ZSIsIm1heERhdGUiLCJ2YWx1ZURhdGUiLCJyZXN1bHQiLCJtYXRjaCIsIkRhdGUiLCJtYXhTaXplIiwicGFyc2xleUluc3RhbmNlIiwiZmlsZXMiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsImkiLCIkYmxvY2siLCIkbGFzdCIsImFmdGVyIiwiZWxlbWVudCIsInBhcnNsZXkiLCJlIiwiJHNlbGYiLCJjdXJyZW50VGFyZ2V0IiwiJGNvbGxhcHNlQm9keSIsImZpbmQiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwiaW5wdXRtYXNrIiwiY2xlYXJNYXNrT25Mb3N0Rm9jdXMiLCJzaG93TWFza09uSG92ZXIiLCJDdXN0b21TZWxlY3QiLCIkZWxlbSIsInNlbGYiLCJpbml0IiwiJGluaXRFbGVtIiwiZWFjaCIsInNlbGVjdFNlYXJjaCIsIm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIiwiSW5maW5pdHkiLCJzZWxlY3QyIiwic2VsZWN0T25CbHVyIiwiZHJvcGRvd25Dc3NDbGFzcyIsImxhbmd1YWdlIiwibm9SZXN1bHRzIiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbVNlbGVjdCIsImRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyIsImRhdGVGb3JtYXQiLCJzaG93T3RoZXJNb250aHMiLCJEYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsInNob3dNWSIsImN1cnJlbnREYXRlIiwiY3VycmVudERheSIsImdldERhdGUiLCJuZXdEYXRlIiwiZ2V0TW9udGgiLCJnZXRGdWxsWWVhciIsIml0ZW1PcHRpb25zIiwib25TZWxlY3QiLCJjaGFuZ2UiLCJzZXRUaW1lb3V0IiwiJG1vYmlsZU1lbnUiLCIkY2FydE1vZGFsIiwib3Blbk1vZGFsIiwiaGlkZU1vZGFsIiwicHJldmVudERlZmF1bHQiLCIkbW9kYWxCbG9jayIsImxvY2tEb2N1bWVudCIsInVubG9ja0RvY3VtZW50IiwiJGhlYWRlciIsImNhdGVnb3J5IiwiJGNhdGVnb3J5RHJvcGRvd24iLCJyZXJlbmRlckhlYWRlciIsImhpZGUiLCJzaG93IiwiJHRhYnMiLCIkdGFic0xpbmtzIiwiJHRhYnNJdGVtcyIsIiRoaWRkZW5Gb3JtRmllbGRzIiwicHJvcCIsInZhbCIsIiRzZWxmSXRlbSIsIlNwaW5uZXIiLCJzdGVwIiwicHJlY2lzaW9uIiwiZWxlbWVudHMiLCIkZGVjIiwiJGluYyIsIiRpbnB1dCIsInVwZGF0ZUJ1dHRvbnMiLCJpbnN0YW5jZXMiLCJzcGlubmVyIiwiaXMiLCIkc3Bpbm5lcnMiLCJpbmRleCIsImJsb2NrIiwiZ2V0SW5zdGFuY2UiLCJkaXNhYmxlU3Bpbm5lciIsInB1c2giLCJzcGlubmVySW5kZXgiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJoYW5kbGVEZWNDbGljayIsImhhbmRsZUluY0NsaWNrIiwiaGFuZGxlSW5wdXQiLCJzcGlubmVycyIsImNyZWF0ZSIsIiR0YXJnZXQiLCJ0b0ZpeGVkIiwiY2hhbmdlVmFsdWUiLCJpbml0Q2Fyb3VzZWxzIiwiJG5ld3NDYXJvdXNlbCIsInNsaWNrIiwiYXJyb3dzIiwiaW5maW5pdGUiLCJzbGlkZXNUb1Nob3ciLCJjZW50ZXJNb2RlIiwidmFyaWFibGVXaWR0aCIsIm1vYmlsZUZpcnN0IiwicmVzcG9uc2l2ZSIsImJyZWFrcG9pbnQiLCJzZXR0aW5ncyIsIiRiaWtlc0Nhcm91c2VsIiwiJGNhdGVnb3JpZXNDYXJvdXNlbCIsImNlbnRlclBhZGRpbmciLCJkb3RzIiwiJHByb2plY3RzQ2Fyb3VzZWwiLCIkaW5kZXhNYWluQ2Fyb3VzZWwiLCIkcHJvZHVjdENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiY3VycmVudFNsaWRlIiwiJHBhcmVudCIsIiRidG4iLCJzbGlkZUlkIiwiJHNpbWlsYXJDYXJvdXNlbCIsIiRwaWN0dXJlQ2Fyb3VzZWwiLCJzbGlkZXNUb1Njcm9sbCIsIiRiaWtlQ2FyZENhcm91c2VsIiwiaXRlbSIsImZhZGUiLCIkY2Fyb3VzZWwiLCIkdXBCdG4iLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwid2lkdGgiLCIkZmlsdGVyTW9kYWwiLCJmaWVsZCIsInRyaW0iLCJldmVudCIsInRvb2x0aXBTZXR0aW5ncyIsImFycm93IiwiYWxsb3dIVE1MIiwiYW5pbWF0ZUZpbGwiLCJwbGFjZW1lbnQiLCJkaXN0YW5jZSIsInRoZW1lIiwiaW5pdFRvb2x0aXBzIiwiZWxlbSIsImxvY2FsU2V0dGluZ3MiLCJjb250ZW50IiwidGlwcHkiLCJPYmplY3QiLCJhc3NpZ24iLCJzaG9wIiwibGF0IiwibG5nIiwibWFwU3R5bGVzIiwiZWxlbWVudFR5cGUiLCJzdHlsZXJzIiwiY29sb3IiLCJ2aXNpYmlsaXR5IiwiZmVhdHVyZVR5cGUiLCJpbml0TWFwIiwibWFwIiwiZ29vZ2xlIiwibWFwcyIsIk1hcCIsImdldEVsZW1lbnRCeUlkIiwiem9vbSIsImNlbnRlciIsInN0eWxlcyIsInpvb21Db250cm9sIiwibWFwVHlwZUNvbnRyb2wiLCJzY2FsZUNvbnRyb2wiLCJzdHJlZXRWaWV3Q29udHJvbCIsInJvdGF0ZUNvbnRyb2wiLCJmdWxsc2NyZWVuQ29udHJvbCIsInBvaW50SWNvbiIsInVybCIsIlNpemUiLCJvcmlnaW4iLCJQb2ludCIsImFuY2hvciIsIm1hcmtlciIsIk1hcmtlciIsInBvc2l0aW9uIiwiaWNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZQyxLQUFaLENBQWtCLFlB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TUFBQUEsV0FBVyxFQUFFLElBSitDO0FBSzVEQyxNQUFBQSxjQUFjLEVBQUUsS0FMNEM7QUFNNURDLE1BQUFBLFlBQVksRUFBRSxJQU44QztBQU81REMsTUFBQUEsaUJBQWlCLEVBQUUsS0FQeUM7QUFRNURDLE1BQUFBLGFBQWEsRUFBRSxLQVI2QztBQVM1REMsTUFBQUEsaUJBQWlCLEVBQUU7QUFUeUMsS0FBcEQsQ0FBWjtBQVlBLFFBQU1DLFNBQVMsR0FBRztBQUNkQyxNQUFBQSxHQUFHLEVBQUUsbUJBRFM7QUFFZDtBQUNBMUwsTUFBQUEsSUFBSSxFQUFFLElBQUk0SyxNQUFNLENBQUNDLElBQVAsQ0FBWWMsSUFBaEIsQ0FBcUIsRUFBckIsRUFBeUIsRUFBekIsQ0FIUTtBQUlkO0FBQ0FDLE1BQUFBLE1BQU0sRUFBRSxJQUFJaEIsTUFBTSxDQUFDQyxJQUFQLENBQVlnQixLQUFoQixDQUFzQixDQUF0QixFQUF5QixDQUF6QixDQUxNO0FBTWQ7QUFDQUMsTUFBQUEsTUFBTSxFQUFFLElBQUlsQixNQUFNLENBQUNDLElBQVAsQ0FBWWdCLEtBQWhCLENBQXNCLEVBQXRCLEVBQTBCLEVBQTFCO0FBUE0sS0FBbEIsQ0FkZSxDQXdCZjs7QUFDQSxRQUFNRSxNQUFNLEdBQUcsSUFBSW5CLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZbUIsTUFBaEIsQ0FBdUI7QUFDbENDLE1BQUFBLFFBQVEsRUFBRWhDLElBRHdCO0FBRWxDaUMsTUFBQUEsSUFBSSxFQUFFVCxTQUY0QjtBQUdsQ2QsTUFBQUEsR0FBRyxFQUFFQTtBQUg2QixLQUF2QixDQUFmO0FBS0g7O0FBRUQ3UCxFQUFBQSxNQUFNLENBQUM0UCxPQUFQLEdBQWlCQSxPQUFqQjtBQUVKO0FBQ0MsQ0FyNkNEIiwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICog0JPQu9C+0LHQsNC70YzQvdGL0LUg0L/QtdGA0LXQvNC10L3QvdGL0LUsINC60L7RgtC+0YDRi9C1INC40YHQv9C+0LvRjNC30YPRjtGC0YHRjyDQvNC90L7Qs9C+0LrRgNCw0YLQvdC+XG4gICAgICovXG4gICAgbGV0IGdsb2JhbE9wdGlvbnMgPSB7XG4gICAgICAgIC8vINCS0YDQtdC80Y8g0LTQu9GPINCw0L3QuNC80LDRhtC40LlcbiAgICAgICAgdGltZTogIDIwMCxcblxuICAgICAgICAvLyDQmtC+0L3RgtGA0L7Qu9GM0L3Ri9C1INGC0L7Rh9C60Lgg0LDQtNCw0L/RgtC40LLQsFxuICAgICAgICBkZXNrdG9wTGdTaXplOiAgMTkxMCxcbiAgICAgICAgZGVza3RvcE1kU2l6ZTogIDE2MDAsXG4gICAgICAgIGRlc2t0b3BTaXplOiAgICAxNDgwLFxuICAgICAgICBkZXNrdG9wU21TaXplOiAgMTI4MCxcbiAgICAgICAgdGFibGV0TGdTaXplOiAgIDEwMjQsXG4gICAgICAgIHRhYmxldFNpemU6ICAgICA3NjgsXG4gICAgICAgIG1vYmlsZUxnU2l6ZTogICA2NDAsXG4gICAgICAgIG1vYmlsZVNpemU6ICAgICA0ODAsXG5cbiAgICAgICAgbGFuZzogJCgnaHRtbCcpLmF0dHIoJ2xhbmcnKVxuICAgIH07XG5cbiAgICAvLyDQkdGA0LXQudC60L/QvtC40L3RgtGLINCw0LTQsNC/0YLQuNCy0LBcbiAgICAvLyBAZXhhbXBsZSBpZiAoZ2xvYmFsT3B0aW9ucy5icmVha3BvaW50VGFibGV0Lm1hdGNoZXMpIHt9IGVsc2Uge31cbiAgICBjb25zdCBicmVha3BvaW50cyA9IHtcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wTGdTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BNZDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wTWRTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3A6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcFNtOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BTbVNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50VGFibGV0TGc6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMudGFibGV0TGdTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludFRhYmxldDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludE1vYmlsZUxnU2l6ZTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5tb2JpbGVMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50TW9iaWxlOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLm1vYmlsZVNpemUgLSAxfXB4KWApXG4gICAgfTtcblxuICAgICQuZXh0ZW5kKHRydWUsIGdsb2JhbE9wdGlvbnMsIGJyZWFrcG9pbnRzKTtcblxuICAgICQod2luZG93KS5vbignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKCQoJ3RleHRhcmVhJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXV0b3NpemUoJCgndGV4dGFyZWEnKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqINCf0L7QtNC60LvRjtGH0LXQvdC40LUganMgcGFydGlhbHNcbiAgICAgKi9cbiAgICAvKipcbiAqINCg0LDRgdGI0LjRgNC10L3QuNC1IGFuaW1hdGUuY3NzXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGFuaW1hdGlvbk5hbWUg0L3QsNC30LLQsNC90LjQtSDQsNC90LjQvNCw0YbQuNC4XG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sg0YTRg9C90LrRhtC40Y8sINC60L7RgtC+0YDQsNGPINC+0YLRgNCw0LHQvtGC0LDQtdGCINC/0L7RgdC70LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxuICogQHJldHVybiB7T2JqZWN0fSDQvtCx0YrQtdC60YIg0LDQvdC40LzQsNGG0LjQuFxuICpcbiAqIEBzZWUgIGh0dHBzOi8vZGFuZWRlbi5naXRodWIuaW8vYW5pbWF0ZS5jc3MvXG4gKlxuICogQGV4YW1wbGVcbiAqICQoJyN5b3VyRWxlbWVudCcpLmFuaW1hdGVDc3MoJ2JvdW5jZScpO1xuICpcbiAqICQoJyN5b3VyRWxlbWVudCcpLmFuaW1hdGVDc3MoJ2JvdW5jZScsIGZ1bmN0aW9uKCkge1xuICogICAgIC8vINCU0LXQu9Cw0LXQvCDRh9GC0L4t0YLQviDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcbiAqIH0pO1xuICovXG4kLmZuLmV4dGVuZCh7XG4gICAgYW5pbWF0ZUNzczogZnVuY3Rpb24oYW5pbWF0aW9uTmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGFuaW1hdGlvbkVuZCA9IChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnYW5pbWF0aW9uZW5kJyxcbiAgICAgICAgICAgICAgICBPQW5pbWF0aW9uOiAnb0FuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgTW96QW5pbWF0aW9uOiAnbW96QW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICBXZWJraXRBbmltYXRpb246ICd3ZWJraXRBbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZm9yIChsZXQgdCBpbiBhbmltYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbnNbdF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG5cbiAgICAgICAgdGhpcy5hZGRDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1hdGlvbk5hbWUpLm9uZShhbmltYXRpb25FbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1hdGlvbk5hbWUpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxufSk7XG5cbiAgICAvLyDQndC10LHQvtC70YzRiNC40LUg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9C1INGE0YPQvdC60YbQuNC4XG5cbiAgICAvKipcbiAgICAgKiDQn9GA0L7QstC10YDRj9C10YIg0YfQuNGB0LvQviDQuNC70Lgg0L3QtdGCXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IG4g0JvRjtCx0L7QuSDQsNGA0LPRg9C80LXQvdGCXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNOdW1lcmljKG4pIHtcbiAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9GP0LXRgiDQstGB0LUg0L3QtdGH0LjRgdC70L7QstGL0LUg0YHQuNC80LLQvtC70Ysg0Lgg0L/RgNC40LLQvtC00LjRgiDQuiDRh9C40YHQu9GDXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cnxudW1iZXJ9IHBhcmFtXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZW1vdmVOb3REaWdpdHMocGFyYW0pIHtcbiAgICAgICAgLyog0YPQtNCw0LvRj9C10Lwg0LLRgdC1INGB0LjQvNCy0L7Qu9GLINC60YDQvtC80LUg0YbQuNGE0YAg0Lgg0L/QtdGA0LXQstC+0LTQuNC8INCyINGH0LjRgdC70L4gKi9cbiAgICAgICAgcmV0dXJuICtwYXJhbS50b1N0cmluZygpLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0KDQsNC30LTQtdC70Y/QtdGCINC90LAg0YDQsNC30YDRj9C00YtcbiAgICAgKiDQndCw0L/RgNC40LzQtdGALCAzODAwMDAwIC0+IDMgODAwIDAwMFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJ8bnVtYmVyfSBwYXJhbVxuICAgICAqIEByZXR1cm5zIHtzdHJ9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZGl2aWRlQnlEaWdpdHMocGFyYW0pIHtcbiAgICAgICAgaWYgKHBhcmFtID09PSBudWxsKSBwYXJhbSA9IDA7XG4gICAgICAgIHJldHVybiBwYXJhbS50b1N0cmluZygpLnJlcGxhY2UoLyhcXGQpKD89KFxcZFxcZFxcZCkrKFteXFxkXXwkKSkvZywgJyQxICcpO1xuICAgIH1cblxuICAgIHZhciBsb2NhbGUgPSBnbG9iYWxPcHRpb25zLmxhbmcgPT0gJ3J1LVJVJyA/ICdydScgOiAnZW4nO1xuXG4gICAgUGFyc2xleS5zZXRMb2NhbGUobG9jYWxlKTtcblxuICAgIC8qINCd0LDRgdGC0YDQvtC50LrQuCBQYXJzbGV5ICovXG4gICAgJC5leHRlbmQoUGFyc2xleS5vcHRpb25zLCB7XG4gICAgICAgIHRyaWdnZXI6ICdibHVyIGNoYW5nZScsIC8vIGNoYW5nZSDQvdGD0LbQtdC9INC00LvRjyBzZWxlY3Qn0LBcbiAgICAgICAgdmFsaWRhdGlvblRocmVzaG9sZDogJzAnLFxuICAgICAgICBlcnJvcnNXcmFwcGVyOiAnPGRpdj48L2Rpdj4nLFxuICAgICAgICBlcnJvclRlbXBsYXRlOiAnPHAgY2xhc3M9XCJwYXJzbGV5LWVycm9yLW1lc3NhZ2VcIj48L3A+JyxcbiAgICAgICAgY2xhc3NIYW5kbGVyOiBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSBpbnN0YW5jZS4kZWxlbWVudDtcbiAgICAgICAgICAgIGxldCB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxuICAgICAgICAgICAgICAgICRoYW5kbGVyO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICAgICAkaGFuZGxlciA9ICRlbGVtZW50OyAvLyDRgtC+INC10YHRgtGMINC90LjRh9C10LPQviDQvdC1INCy0YvQtNC10LvRj9C10LwgKGlucHV0INGB0LrRgNGL0YIpLCDQuNC90LDRh9C1INCy0YvQtNC10LvRj9C10YIg0YDQvtC00LjRgtC10LvRjNGB0LrQuNC5INCx0LvQvtC6XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAkaGFuZGxlciA9ICQoJy5zZWxlY3QyLXNlbGVjdGlvbi0tc2luZ2xlJywgJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAkaGFuZGxlcjtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3JzQ29udGFpbmVyOiBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSBpbnN0YW5jZS4kZWxlbWVudDtcbiAgICAgICAgICAgIGxldCB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxuICAgICAgICAgICAgICAgICRjb250YWluZXI7XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICQoYFtuYW1lPVwiJHskZWxlbWVudC5hdHRyKCduYW1lJyl9XCJdOmxhc3QgKyBsYWJlbGApLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdmaWxlJykge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5jbG9zZXN0KCcuY3VzdG9tLWZpbGUnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5hdHRyKCduYW1lJykgPT0gJ2lzX3JlY2FwdGNoYV9zdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAucGFyZW50KClcbiAgICAgICAgICAgICAgICAgICAgLm5leHQoJy5nLXJlY2FwdGNoYScpXG4gICAgICAgICAgICAgICAgICAgIC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LmNsb3Nlc3QoJy5maWVsZCcpO1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCRjb250YWluZXIpXG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIHJldHVybiAkY29udGFpbmVyO1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0JrQsNGB0YLQvtC80L3Ri9C1INCy0LDQu9C40LTQsNGC0L7RgNGLXG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YDRg9GB0YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWVSdScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkVxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIicsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIicsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0LvQsNGC0LjQvdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lRW4nLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW2EtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCBcIiBcIiwgXCItXCInLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLINC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtTGV0dGVyUnUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eWzAtOdCwLdGP0ZFdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyDQkC3Qrywg0LAt0Y8sIDAtOScsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyDQkC3Qrywg0LAt0Y8sIDAtOScsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiywg0LvQsNGC0LjQvdGB0LrQuNC1INC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtTGV0dGVyJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRYS16MC05XSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIDAtOScsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQotC10LvQtdGE0L7QvdC90YvQuSDQvdC+0LzQtdGAXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ3Bob25lJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlstKzAtOSgpIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0YLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgCcsXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBwaG9uZSBudW1iZXInLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtYmVyJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlswLTldKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgMC05JyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vINCf0L7Rh9GC0LAg0LHQtdC3INC60LjRgNC40LvQu9C40YbRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdlbWFpbCcsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL14oW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKFxcLnxffC0pezAsMX0pK1tBLVphLXrQkC3Qr9CwLdGPMC05XFwtXVxcQChbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pKygoXFwuKXswLDF9W0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKXsxLH1cXC5bYS160LAt0Y8wLTlcXC1dezIsfSQvLnRlc3QoXG4gICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9C+0YfRgtC+0LLRi9C5INCw0LTRgNC10YEnLFxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZW1haWwgYWRkcmVzcycsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQpNC+0YDQvNCw0YIg0LTQsNGC0YsgREQuTU0uWVlZWVxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdkYXRlJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGxldCByZWdUZXN0ID0gL14oPzooPzozMShcXC4pKD86MD9bMTM1NzhdfDFbMDJdKSlcXDF8KD86KD86Mjl8MzApKFxcLikoPzowP1sxLDMtOV18MVswLTJdKVxcMikpKD86KD86MVs2LTldfFsyLTldXFxkKT9cXGR7Mn0pJHxeKD86MjkoXFwuKTA/MlxcMyg/Oig/Oig/OjFbNi05XXxbMi05XVxcZCk/KD86MFs0OF18WzI0NjhdWzA0OF18WzEzNTc5XVsyNl0pfCg/Oig/OjE2fFsyNDY4XVswNDhdfFszNTc5XVsyNl0pMDApKSkpJHxeKD86MD9bMS05XXwxXFxkfDJbMC04XSkoXFwuKSg/Oig/OjA/WzEtOV0pfCg/OjFbMC0yXSkpXFw0KD86KD86MVs2LTldfFsyLTldXFxkKT9cXGR7NH0pJC8sXG4gICAgICAgICAgICAgICAgcmVnTWF0Y2ggPSAvKFxcZHsxLDJ9KVxcLihcXGR7MSwyfSlcXC4oXFxkezR9KS8sXG4gICAgICAgICAgICAgICAgbWluID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNaW4nKSxcbiAgICAgICAgICAgICAgICBtYXggPSBhcmd1bWVudHNbMl0uJGVsZW1lbnQuZGF0YSgnZGF0ZU1heCcpLFxuICAgICAgICAgICAgICAgIG1pbkRhdGUsXG4gICAgICAgICAgICAgICAgbWF4RGF0ZSxcbiAgICAgICAgICAgICAgICB2YWx1ZURhdGUsXG4gICAgICAgICAgICAgICAgcmVzdWx0O1xuXG4gICAgICAgICAgICBpZiAobWluICYmIChyZXN1bHQgPSBtaW4ubWF0Y2gocmVnTWF0Y2gpKSkge1xuICAgICAgICAgICAgICAgIG1pbkRhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXggJiYgKHJlc3VsdCA9IG1heC5tYXRjaChyZWdNYXRjaCkpKSB7XG4gICAgICAgICAgICAgICAgbWF4RGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChyZXN1bHQgPSB2YWx1ZS5tYXRjaChyZWdNYXRjaCkpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVEYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgcmVnVGVzdC50ZXN0KHZhbHVlKSAmJiAobWluRGF0ZSA/IHZhbHVlRGF0ZSA+PSBtaW5EYXRlIDogdHJ1ZSkgJiYgKG1heERhdGUgPyB2YWx1ZURhdGUgPD0gbWF4RGF0ZSA6IHRydWUpXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdCw0Y8g0LTQsNGC0LAnLFxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZGF0ZScsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQpNCw0LnQuyDQvtCz0YDQsNC90LjRh9C10L3QvdC+0LPQviDRgNCw0LfQvNC10YDQsFxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlTWF4U2l6ZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlLCBtYXhTaXplLCBwYXJzbGV5SW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGxldCBmaWxlcyA9IHBhcnNsZXlJbnN0YW5jZS4kZWxlbWVudFswXS5maWxlcztcbiAgICAgICAgICAgIHJldHVybiBmaWxlcy5sZW5ndGggIT0gMSB8fCBmaWxlc1swXS5zaXplIDw9IG1heFNpemUgKiAxMDI0O1xuICAgICAgICB9LFxuICAgICAgICByZXF1aXJlbWVudFR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0KTQsNC50Lsg0LTQvtC70LbQtdC9INCy0LXRgdC40YLRjCDQvdC1INCx0L7Qu9C10LUsINGH0LXQvCAlcyBLYicsXG4gICAgICAgICAgICBlbjogXCJGaWxlIHNpemUgY2FuJ3QgYmUgbW9yZSB0aGVuICVzIEtiXCIsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDQntCz0YDQsNC90LjRh9C10L3QuNGPINGA0LDRgdGI0LjRgNC10L3QuNC5INGE0LDQudC70L7QslxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlRXh0ZW5zaW9uJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIGZvcm1hdHMpIHtcbiAgICAgICAgICAgIGxldCBmaWxlRXh0ZW5zaW9uID0gdmFsdWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgICAgIGxldCBmb3JtYXRzQXJyID0gZm9ybWF0cy5zcGxpdCgnLCAnKTtcbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcm1hdHNBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZUV4dGVuc2lvbiA9PT0gZm9ybWF0c0FycltpXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQlNC+0L/Rg9GB0YLQuNC80Ysg0YLQvtC70YzQutC+INGE0LDQudC70Ysg0YTQvtGA0LzQsNGC0LAgJXMnLFxuICAgICAgICAgICAgZW46ICdBdmFpbGFibGUgZXh0ZW5zaW9ucyBhcmUgJXMnLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g0KHQvtC30LTQsNGR0YIg0LrQvtC90YLQtdC50L3QtdGA0Ysg0LTQu9GPINC+0YjQuNCx0L7QuiDRgyDQvdC10YLQuNC/0LjRh9C90YvRhSDRjdC70LXQvNC10L3RgtC+0LJcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDppbml0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCAkZWxlbWVudCA9IHRoaXMuJGVsZW1lbnQsXG4gICAgICAgICAgICB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxuICAgICAgICAgICAgJGJsb2NrID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ2Vycm9ycy1wbGFjZW1lbnQnKSxcbiAgICAgICAgICAgICRsYXN0O1xuXG4gICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICQoYFtuYW1lPVwiJHskZWxlbWVudC5hdHRyKCduYW1lJyl9XCJdOmxhc3QgKyBsYWJlbGApO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmN1c3RvbS1maWxlJyk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpLmxlbmd0aCkge1xuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpID09ICdpc19yZWNhcHRjaGFfc3VjY2VzcycpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQucGFyZW50KCkubmV4dCgnLmctcmVjYXB0Y2hhJyk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0JjQvdC40YbQuNC40YDRg9C10YIg0LLQsNC70LjQtNCw0YbQuNGOINC90LAg0LLRgtC+0YDQvtC8INC60LDQu9C10LTQsNGA0L3QvtC8INC/0L7Qu9C1INC00LjQsNC/0LDQt9C+0L3QsFxuICAgIFBhcnNsZXkub24oJ2ZpZWxkOnZhbGlkYXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgJGVsZW1lbnQgPSAkKHRoaXMuZWxlbWVudCk7XG4gICAgfSk7XG5cbiAgICAkKCdmb3JtW2RhdGEtdmFsaWRhdGU9XCJ0cnVlXCJdJykucGFyc2xleSgpO1xuXG4gICAgLy8g0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINGC0L7Qu9GM0LrQviDQvdCwINGB0YLRgNCw0L3QuNGG0LUgY2hlY2tvdXQuaHRtbFxuICAgIGlmICgkKCcuanMtY29sbGFwc2UtYnRuJykubGVuZ3RoKSB7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtY29sbGFwc2UtYnRuJywgZSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICAgIGNvbnN0ICRjb2xsYXBzZUJvZHkgPSAkc2VsZi5jbG9zZXN0KCcuanMtY29sbGFwc2UnKS5maW5kKCcuanMtY29sbGFwc2UtYm9keScpO1xuICAgICAgICAgICAgaWYgKCRzZWxmLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgICRzZWxmLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkY29sbGFwc2VCb2R5LnNsaWRlVXAoJ2Zhc3QnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRjb2xsYXBzZUJvZHkuc2xpZGVEb3duKCdmYXN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCU0L7QsdCw0LLQu9GP0LXRgiDQvNCw0YHQutC4INCyINC/0L7Qu9GPINGE0L7RgNC8XG4gICAgICogQHNlZSAgaHR0cHM6Ly9naXRodWIuY29tL1JvYmluSGVyYm90cy9JbnB1dG1hc2tcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPGlucHV0IGNsYXNzPVwianMtcGhvbmUtbWFza1wiIHR5cGU9XCJ0ZWxcIiBuYW1lPVwidGVsXCIgaWQ9XCJ0ZWxcIj5cbiAgICAgKi9cbiAgICAkKCcuanMtcGhvbmUtbWFzaycpLmlucHV0bWFzaygnKzcoOTk5KSA5OTktOTktOTknLCB7XG4gICAgICAgIGNsZWFyTWFza09uTG9zdEZvY3VzOiB0cnVlLFxuICAgICAgICBzaG93TWFza09uSG92ZXI6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog0KHRgtC40LvQuNC30YPQtdGCINGB0LXQu9C10LrRgtGLINGBINC/0L7QvNC+0YnRjNGOINC/0LvQsNCz0LjQvdCwIHNlbGVjdDJcbiAgICAgKiBodHRwczovL3NlbGVjdDIuZ2l0aHViLmlvXG4gICAgICovXG4gICAgbGV0IEN1c3RvbVNlbGVjdCA9IGZ1bmN0aW9uKCRlbGVtKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLmluaXQgPSBmdW5jdGlvbigkaW5pdEVsZW0pIHtcbiAgICAgICAgICAgICRpbml0RWxlbS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RTZWFyY2ggPSAkKHRoaXMpLmRhdGEoJ3NlYXJjaCcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdFNlYXJjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSAxOyAvLyDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gSW5maW5pdHk7IC8vINC90LUg0L/QvtC60LDQt9GL0LLQsNC10Lwg0L/QvtC70LUg0L/QvtC40YHQutCwXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNlbGVjdDIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0T25CbHVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd25Dc3NDbGFzczogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9SZXN1bHRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICfQodC+0LLQv9Cw0LTQtdC90LjQuSDQvdC1INC90LDQudC00LXQvdC+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3Rg9C20L3QviDQtNC70Y8g0LLRi9C70LjQtNCw0YbQuNC4INC90LAg0LvQtdGC0YNcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZChgb3B0aW9uW3ZhbHVlPVwiJHskKHRoaXMpLnZhbHVlfVwiXWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYudXBkYXRlID0gZnVuY3Rpb24oJHVwZGF0ZUVsZW0pIHtcbiAgICAgICAgICAgICR1cGRhdGVFbGVtLnNlbGVjdDIoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHNlbGYuaW5pdCgkdXBkYXRlRWxlbSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5pbml0KCRlbGVtKTtcbiAgICB9O1xuXG4gICAgdmFyIGN1c3RvbVNlbGVjdCA9IG5ldyBDdXN0b21TZWxlY3QoJCgnc2VsZWN0JykpO1xuXG4gICAgY29uc3QgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBkYXRlRm9ybWF0OiAnZGQubW0ueXknLFxuICAgICAgICBzaG93T3RoZXJNb250aHM6IHRydWUsXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqINCU0LXQu9Cw0LXRgiDQstGL0L/QsNC00Y7RidC40LUg0LrQsNC70LXQvdC00LDRgNC40LrQuFxuICAgICAqIEBzZWUgIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL2RhdGVwaWNrZXIvXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vINCyIGRhdGEtZGF0ZS1taW4g0LggZGF0YS1kYXRlLW1heCDQvNC+0LbQvdC+INC30LDQtNCw0YLRjCDQtNCw0YLRgyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5XG4gICAgICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRhdGVJbnB1dFwiIGlkPVwiXCIgY2xhc3M9XCJqcy1kYXRlcGlja2VyXCIgZGF0YS1kYXRlLW1pbj1cIjA2LjExLjIwMTVcIiBkYXRhLWRhdGUtbWF4PVwiMTAuMTIuMjAxNVwiPlxuICAgICAqL1xuICAgIGxldCBEYXRlcGlja2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGVwaWNrZXIgPSAkKCcuanMtZGF0ZXBpY2tlcicpO1xuXG4gICAgICAgIGRhdGVwaWNrZXIuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBtaW5EYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1pbicpO1xuICAgICAgICAgICAgbGV0IG1heERhdGUgPSAkKHRoaXMpLmRhdGEoJ2RhdGUtbWF4Jyk7XG4gICAgICAgICAgICBjb25zdCBzaG93TVkgPSAkKHRoaXMpLmRhdGEoJ3Nob3ctbS15Jyk7XG5cbiAgICAgICAgICAgIC8qINC10YHQu9C4INCyINCw0YLRgNC40LHRg9GC0LUg0YPQutCw0LfQsNC90L4gY3VycmVudCwg0YLQviDQstGL0LLQvtC00LjQvCDRgtC10LrRg9GJ0YPRjiDQtNCw0YLRgyAqL1xuICAgICAgICAgICAgaWYgKG1heERhdGUgPT09ICdjdXJyZW50JyB8fCBtaW5EYXRlID09PSAnY3VycmVudCcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnREYXkgPSBjdXJyZW50RGF0ZS5nZXREYXRlKCk7XG4gICAgICAgICAgICAgICAgY3VycmVudERheSA8IDEwID8gKGN1cnJlbnREYXkgPSAnMCcgKyBjdXJyZW50RGF5LnRvU3RyaW5nKCkpIDogY3VycmVudERheTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdEYXRlID0gY3VycmVudERheSArICcuJyArIChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSkgKyAnLicgKyBjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgICAgIG1heERhdGUgPT09ICdjdXJyZW50JyA/IChtYXhEYXRlID0gbmV3RGF0ZSkgOiAobWluRGF0ZSA9IG5ld0RhdGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaXRlbU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgbWluRGF0ZTogbWluRGF0ZSB8fCBudWxsLFxuICAgICAgICAgICAgICAgIG1heERhdGU6IG1heERhdGUgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY2hhbmdlKCk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcuZmllbGQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHNob3dNWSkge1xuICAgICAgICAgICAgICAgIGl0ZW1PcHRpb25zWydjaGFuZ2VZZWFyJ10gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGl0ZW1PcHRpb25zWyd5ZWFyUmFuZ2UnXSA9ICdjLTEwMDpjJztcbiAgICAgICAgICAgICAgICBpdGVtT3B0aW9uc1snY2hhbmdlTW9udGgnXSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIGl0ZW1PcHRpb25zLCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMpO1xuXG4gICAgICAgICAgICAkKHRoaXMpLmRhdGVwaWNrZXIoaXRlbU9wdGlvbnMpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDQtNC10LvQsNC10Lwg0LrRgNCw0YHQuNCy0YvQvCDRgdC10LvQtdC6INC80LXRgdGP0YbQsCDQuCDQs9C+0LTQsFxuICAgICAgICAkKGRvY3VtZW50KS5vbignZm9jdXMnLCAnLmpzLWRhdGVwaWNrZXInLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyDQuNGB0L/QvtC70YzQt9GD0LXQvCDQt9Cw0LTQtdGA0LbQutGDLCDRh9GC0L7QsdGLINC00LXQudGC0L/QuNC60LXRgCDRg9GB0L/QtdC7INC40L3QuNGG0LjQsNC70LjQt9C40YDQvtCy0LDRgtGM0YHRj1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJy51aS1kYXRlcGlja2VyJykuZmluZCgnc2VsZWN0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy51aS1kYXRlcGlja2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCdzZWxlY3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNlbGVjdDIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdE9uQmx1cjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGxldCBkYXRlcGlja2VyID0gbmV3IERhdGVwaWNrZXIoKTtcblxuICAgIGNvbnN0ICRtb2JpbGVNZW51ID0gJCgnLmpzLW1vYmlsZS1tZW51Jyk7XG4gICAgY29uc3QgJGNhcnRNb2RhbCA9ICQoJy5qcy1jYXJ0LW1vZGFsJyk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLW1lbnUtYnRuJywgKCkgPT4ge1xuICAgICAgICBvcGVuTW9kYWwoJG1vYmlsZU1lbnUpO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1tZW51LWNsb3NlJywgKCkgPT4ge1xuICAgICAgICBoaWRlTW9kYWwoJG1vYmlsZU1lbnUpO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1jYXJ0LWJ0bicsIGUgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9wZW5Nb2RhbCgkY2FydE1vZGFsKTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtY2FydC1jbG9zZScsICgpID0+IHtcbiAgICAgICAgaGlkZU1vZGFsKCRjYXJ0TW9kYWwpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogT3BlbiBtb2RhbCBibG9ja1xuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkbW9kYWxCbG9jayBNb2RhbCBibG9ja1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIG9wZW5Nb2RhbCgkbW9kYWxCbG9jaykge1xuICAgICAgICAkbW9kYWxCbG9jay5hZGRDbGFzcygnaXMtYWN0aXZlJykuYW5pbWF0ZUNzcygnc2xpZGVJblJpZ2h0Jyk7XG4gICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgbG9ja0RvY3VtZW50KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGlkZSBtb2RhbCBibG9ja1xuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkbW9kYWxCbG9jayBNb2RhbCBibG9ja1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhpZGVNb2RhbCgkbW9kYWxCbG9jaykge1xuICAgICAgICAkbW9kYWxCbG9jay5hbmltYXRlQ3NzKCdzbGlkZU91dFJpZ2h0JywgKCkgPT4ge1xuICAgICAgICAgICAgJG1vZGFsQmxvY2sucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdoYXMtb3ZlcmxheScpO1xuICAgICAgICAgICAgdW5sb2NrRG9jdW1lbnQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVW5sb2NrIGRvY3VtZW50IGZvciBzY3JvbGxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmxvY2tEb2N1bWVudCgpIHtcbiAgICAgICAgJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCdpcy1sb2NrZWQnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2NrIGRvY3VtZW50IGZvciBzY3JvbGxcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGxvY2tCbG9jayBCbG9jayB3aGljaCBkZWZpbmUgZG9jdW1lbnQgaGVpZ2h0XG4gICAgICovXG4gICAgZnVuY3Rpb24gbG9ja0RvY3VtZW50KCkge1xuICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2lzLWxvY2tlZCcpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLSDQu9C+0LPQuNC60LAg0L7RgtC60YDRi9GC0LjRjyDQstGL0L/QsNC00LDRiNC10Log0YXQtdC00LXRgNCwIC0tLS0tLVxuICAgIGNvbnN0ICRoZWFkZXIgPSAkKCcuanMtaGVhZGVyJyk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignbW91c2VvdmVyJywgJy5qcy1oZWFkZXItZHJvcGRvd24tYnRuJywgZSA9PiB7XG4gICAgICAgIGNvbnN0ICRzZWxmID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCBjYXRlZ29yeSA9ICRzZWxmLmF0dHIoJ2RhdGEtY2F0ZWdvcnknKTtcbiAgICAgICAgJCgnLmpzLWhlYWRlci1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgaWYgKGNhdGVnb3J5KSB7XG4gICAgICAgICAgICBjb25zdCAkY2F0ZWdvcnlEcm9wZG93biA9ICQoYFtkYXRhLWRyb3Bkb3duLWNhdGVnb3J5PScke2NhdGVnb3J5fSddYCk7XG4gICAgICAgICAgICAkY2F0ZWdvcnlEcm9wZG93bi5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkaGVhZGVyLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgICAgIHJlcmVuZGVySGVhZGVyKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZWxlYXZlJywgJy5qcy1oZWFkZXInLCBlID0+IHtcbiAgICAgICAgaWYgKCQoJy5qcy1oZWFkZXItZHJvcGRvd24nKS5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcbiAgICAgICAgICAgICQoJy5qcy1oZWFkZXItZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgICAgIHJlcmVuZGVySGVhZGVyKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGZpeCBidWcgZm9yIHNhZmFyaVxuICAgIGZ1bmN0aW9uIHJlcmVuZGVySGVhZGVyKCkge1xuICAgICAgICAkaGVhZGVyLmhpZGUoKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7JGhlYWRlci5zaG93KCl9LCAwKVxuICAgIH1cblxuICAgIC8vINC90LXQvNC90L7Qs9C+INGB0L/QtdGG0LjRhNC40YfQvdGL0LUg0YLQsNCx0YsuINCY0YHQv9C+0LvRjNC30YPRjtGC0YHRjyDQvdCwINGB0YLRgNCw0L3QuNGG0LUgY2hlY2tvdXQuaHRtbC4g0J/RgNC4INC20LXQu9Cw0L3QuNC4INC80L7QttC90L4g0LTQvtGA0LDQsdC+0YLQsNGC0YxcblxuICAgIGlmICgkKCcuanMtdGFicy1saW5rJykubGVuZ3RoKSB7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtdGFicy1saW5rJywgZSA9PiB7XG4gICAgICAgICAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCAkc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICAgICAgaWYgKCRzZWxmLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCAkdGFicyA9ICRzZWxmLmNsb3Nlc3QoJy5qcy10YWJzJyk7XG4gICAgICAgICAgICBjb25zdCAkdGFic0xpbmtzID0gJHRhYnMuZmluZCgnLmpzLXRhYnMtbGluaycpO1xuICAgICAgICAgICAgY29uc3QgJHRhYnNJdGVtcyA9ICR0YWJzLmZpbmQoJy5qcy10YWJzLWl0ZW0nKTtcblxuICAgICAgICAgICAgLy8g0LLRi9C60LvRjtGH0LDQtdC8INCy0YHQtSDQsNC60YLQuNCy0L3Ri9C1INGC0LDQsdGLINC4INGB0YHRi9C70LrQuFxuICAgICAgICAgICAgJHRhYnNMaW5rcy5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkdGFic0l0ZW1zLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8g0LLRi9C60LvRjtGH0LDQtdC8INCy0LDQu9C40LTQsNGG0LjRjiDRgyDRgdC60YDRi9GC0YvRhSDQv9C+0LvQtdC5INC4INC+0YfQuNGJ0LDQtdC8INC40YVcbiAgICAgICAgICAgIGxldCAkaGlkZGVuRm9ybUZpZWxkcyA9ICR0YWJzSXRlbXMuZmluZCgnW2RhdGEtcmVxdWlyZWRdJyk7XG4gICAgICAgICAgICBpZiAoJGhpZGRlbkZvcm1GaWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgnZGF0YS1yZXF1aXJlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy5wcm9wKCdyZXF1aXJlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy52YWwoJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQstC60LvRjtGH0LDQtdC8INC90YPQttC90YvQuSDRgtCw0LEg0Lgg0LTQtdC70LDQtdC8INC90YPQttC90YPRjiDRgdGB0YvQu9C60YMg0LDQutGC0LjQstC90L7QuVxuICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgY29uc3QgJHNlbGZJdGVtID0gJCgkc2VsZi5kYXRhKCd0YWInKSk7XG4gICAgICAgICAgICAkc2VsZkl0ZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLyDQstC60LvRjtGH0LDQtdC8INCy0LDQu9C40LTQsNGG0LjRjiDRgyDRgdC60YDRi9GC0YvRhSDQv9C+0LvQtdC5XG4gICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcyA9ICRzZWxmSXRlbS5maW5kKCdbZGF0YS1yZXF1aXJlZF0nKTtcbiAgICAgICAgICAgIGlmICgkaGlkZGVuRm9ybUZpZWxkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRm9ybUZpZWxkcy5wcm9wKCdkYXRhLXJlcXVpcmVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkZvcm1GaWVsZHMucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogICDQkNC60YLQuNCy0LjRgNC+0LLQsNGC0Ywv0LTQtdC30LDQutGC0LjQstC40YDQvtCy0LDRgtGMINGB0L/QuNC90L3QtdGAXG4gICAgICogICBjb25zdCAkYmxvY2sgPSAkKCcuc3Bpbm5lcicpO1xuICAgICAqICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcbiAgICAgKiAgIHNwaW5uZXIuZW5hYmxlU3Bpbm5lcigpOy9zcGlubmVyLmRpc2FibGVTcGlubmVyKCk7XG4gICAgICpcbiAgICAgKi9cblxuICAgIGNsYXNzIFNwaW5uZXIge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSAgb3B0aW9ucyAgICAgICAgICAgICAgICAgICDQntCx0YrQtdC60YIg0YEg0L/QsNGA0LDQvNC10YLRgNCw0LzQuC5cbiAgICAgICAgICogQHBhcmFtICB7alF1ZXJ5fSAgb3B0aW9ucy4kYmxvY2sgICAgICAgICAgICDQqNCw0LHQu9C+0L0uXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLnZhbHVlID0gMF0gICAgICAg0J3QsNGH0LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40LUuXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gIFtvcHRpb25zLm1pbiA9IC1JbmZpbml0eV0g0JzQuNC90LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5tYXggPSBJbmZpbml0eV0gINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9ICBbb3B0aW9ucy5zdGVwID0gMV0gICAgICAgINCo0LDQsy5cbiAgICAgICAgICogQHBhcmFtICB7bnVtYmVyfSAgW29wdGlvbnMucHJlY2lzaW9uXSAgICAgICDQotC+0YfQvdC+0YHRgtGMICjQvdGD0LbQvdCwINC00LvRjyDQtNC10YHRj9GC0LjRh9C90L7Qs9C+INGI0LDQs9CwKS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHsgJGJsb2NrLCB2YWx1ZSA9IDAsIG1pbiA9IC1JbmZpbml0eSwgbWF4ID0gSW5maW5pdHksIHN0ZXAgPSAxLCBwcmVjaXNpb24gfSA9IHt9KSB7XG4gICAgICAgICAgICB0aGlzLiRibG9jayA9ICRibG9jaztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMgPSB7XG4gICAgICAgICAgICAgICAgJGRlYzogJCgnLnNwaW5uZXJfX2J0bi0tZGVjJywgdGhpcy4kYmxvY2spLFxuICAgICAgICAgICAgICAgICRpbmM6ICQoJy5zcGlubmVyX19idG4tLWluYycsIHRoaXMuJGJsb2NrKSxcbiAgICAgICAgICAgICAgICAkaW5wdXQ6ICQoJy5zcGlubmVyX19pbnB1dCcsIHRoaXMuJGJsb2NrKSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSArdmFsdWU7XG4gICAgICAgICAgICB0aGlzLm1pbiA9ICttaW47XG4gICAgICAgICAgICB0aGlzLm1heCA9ICttYXg7XG4gICAgICAgICAgICB0aGlzLnN0ZXAgPSArc3RlcDtcbiAgICAgICAgICAgIHRoaXMucHJlY2lzaW9uID0gK3ByZWNpc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQn9GA0LjQstC+0LTQuNGCINGA0LDQt9C80LXRgtC60YMg0LIg0YHQvtC+0YLQstC10YLRgdGC0LLQuNC1INC/0LDRgNCw0LzQtdGC0YDQsNC8LlxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnV0dG9ucygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDRgdC+0YHRgtC+0Y/QvdC40LUg0LHQu9C+0LrQuNGA0L7QstC60Lgg0LrQvdC+0L/QvtC6LlxuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlQnV0dG9ucygpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGRlYy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGluYy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPCB0aGlzLm1pbiArIHRoaXMuc3RlcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGRlYy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA+IHRoaXMubWF4IC0gdGhpcy5zdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5jLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0J7RgtC60LvRjtGH0LXQvdC40LUg0YHQv9C40L3QvdC10YDQsC5cbiAgICAgICAgICovXG4gICAgICAgIGRpc2FibGVTcGlubmVyKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kZGVjLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbmMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQktC60LvRjtGH0LXQvdC40LUg0YHQv9C40L3QvdC10YDQsC5cbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZVNwaW5uZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGlucHV0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2sucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0J7QsdC90L7QstC70Y/QtdGCINC30L3QsNGH0LXQvdC40LUg0YHRh9GR0YLRh9C40LrQsC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICovXG4gICAgICAgIGNoYW5nZVZhbHVlKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLiRibG9jay5hdHRyKCdkYXRhLXZhbHVlJywgdmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kaW5wdXQuYXR0cigndmFsdWUnLCB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRpbnB1dC52YWwodmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCc0LXQvdGP0LXRgiDQt9C90LDRh9C10L3QuNC1INC80LjQvdC40LzRg9C80LAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gdmFsdWUg0J3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1LlxuICAgICAgICAgKi9cbiAgICAgICAgY2hhbmdlTWluKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm1pbiA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy4kYmxvY2suYXR0cignZGF0YS1taW4nLCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0JzQtdC90Y/QtdGCINC30L3QsNGH0LXQvdC40LUg0LzQsNC60YHQuNC80YPQvNCwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IHZhbHVlINCd0L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtS5cbiAgICAgICAgICovXG4gICAgICAgIGNoYW5nZU1heCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5tYXggPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuJGJsb2NrLmF0dHIoJ2RhdGEtbWF4JywgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCc0LDRgdGB0LjQsiDRgdC+0LfQtNCw0L3QvdGL0YUg0L7QsdGK0LXQutGC0L7Qsi5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyBpbnN0YW5jZXMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog0J3QsNGF0L7QtNC40YIg0L7QsdGK0LXQutGCINC60LvQsNGB0YHQsCDQv9C+INGI0LDQsdC70L7QvdGDLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtqUXVlcnl9ICRibG9jayDQqNCw0LHQu9C+0L0uXG4gICAgICAgICAqIEByZXR1cm4ge1NwaW5uZXJ9ICAgICAgINCe0LHRitC10LrRgi5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgkYmxvY2spIHtcbiAgICAgICAgICAgIHJldHVybiBTcGlubmVyLmluc3RhbmNlcy5maW5kKHNwaW5uZXIgPT4gc3Bpbm5lci4kYmxvY2suaXMoJGJsb2NrKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0KHQvtC30LTQsNGR0YIg0L7QsdGK0LXQutGC0Ysg0L/QviDRiNCw0LHQu9C+0L3QsNC8LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gWyRzcGlubmVycyA9ICQoJy5zcGlubmVyJyldINCo0LDQsdC70L7QvdGLLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIGNyZWF0ZSgkc3Bpbm5lcnMgPSAkKCcuc3Bpbm5lcicpKSB7XG4gICAgICAgICAgICAkc3Bpbm5lcnMuZWFjaCgoaW5kZXgsIGJsb2NrKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGJsb2NrID0gJChibG9jayk7XG5cbiAgICAgICAgICAgICAgICBpZiAoU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzcGlubmVyID0gbmV3IFNwaW5uZXIoe1xuICAgICAgICAgICAgICAgICAgICAkYmxvY2ssXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAkYmxvY2suYXR0cignZGF0YS12YWx1ZScpLFxuICAgICAgICAgICAgICAgICAgICBtaW46ICRibG9jay5hdHRyKCdkYXRhLW1pbicpLFxuICAgICAgICAgICAgICAgICAgICBtYXg6ICRibG9jay5hdHRyKCdkYXRhLW1heCcpLFxuICAgICAgICAgICAgICAgICAgICBzdGVwOiAkYmxvY2suYXR0cignZGF0YS1zdGVwJyksXG4gICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbjogJGJsb2NrLmF0dHIoJ2RhdGEtcHJlY2lzaW9uJyksXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkYmxvY2suaGFzQ2xhc3MoJ2lzLWRpc2FibGVkJykgPyBzcGlubmVyLmRpc2FibGVTcGlubmVyKCkgOiBzcGlubmVyLmluaXQoKTtcblxuICAgICAgICAgICAgICAgIFNwaW5uZXIuaW5zdGFuY2VzLnB1c2goc3Bpbm5lcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQo9C00LDQu9GP0LXRgiDQvtCx0YrQtdC60YLRiyDQv9C+INGI0LDQsdC70L7QvdCw0LwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSBbJHNwaW5uZXJzID0gJCgnLnNwaW5uZXInKV0g0KjQsNCx0LvQvtC90YsuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgcmVtb3ZlKCRzcGlubmVycyA9ICQoJy5zcGlubmVyJykpIHtcbiAgICAgICAgICAgICRzcGlubmVycy5lYWNoKChpbmRleCwgYmxvY2spID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkYmxvY2sgPSAkKGJsb2NrKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNwaW5uZXJJbmRleCA9IFNwaW5uZXIuaW5zdGFuY2VzLmZpbmRJbmRleChzcGlubmVyID0+IHNwaW5uZXIuJGJsb2NrLmlzKCRibG9jaykpO1xuXG4gICAgICAgICAgICAgICAgU3Bpbm5lci5pbnN0YW5jZXMuc3BsaWNlKHNwaW5uZXJJbmRleCwgMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc3Bpbm5lcl9fYnRuLS1kZWMnLCBoYW5kbGVEZWNDbGljayk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5zcGlubmVyX19idG4tLWluYycsIGhhbmRsZUluY0NsaWNrKTtcbiAgICAkKGRvY3VtZW50KS5vbignaW5wdXQnLCAnLnNwaW5uZXJfX2lucHV0JywgaGFuZGxlSW5wdXQpO1xuXG4gICAgLyog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQv9C40L3QvdC10YDQvtCyICovXG4gICAgbGV0IHNwaW5uZXJzID0gU3Bpbm5lci5jcmVhdGUoKTtcblxuICAgIC8qKlxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INC60LvQuNC60LAg0L/QviDQutC90L7Qv9C60LUg0YPQvNC10L3RjNGI0LXQvdC40Y8uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZSDQntCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFuZGxlRGVjQ2xpY2soZSkge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRUYXJnZXQgfSA9IGU7XG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBjb25zdCAkYmxvY2sgPSAkdGFyZ2V0LmNsb3Nlc3QoJy5zcGlubmVyJyk7XG4gICAgICAgIGNvbnN0IHNwaW5uZXIgPSBTcGlubmVyLmdldEluc3RhbmNlKCRibG9jayk7XG5cbiAgICAgICAgbGV0IHZhbHVlID0gc3Bpbm5lci52YWx1ZSAtIHNwaW5uZXIuc3RlcDtcblxuICAgICAgICBpZiAoc3Bpbm5lci5wcmVjaXNpb24pIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZS50b0ZpeGVkKHNwaW5uZXIucHJlY2lzaW9uKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzcGlubmVyLmNoYW5nZVZhbHVlKHZhbHVlKTtcblxuICAgICAgICBzcGlubmVyLnVwZGF0ZUJ1dHRvbnMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQutC70LjQutCwINC/0L4g0LrQvdC+0L/QutC1INGD0LLQtdC70LjRh9C10L3QuNGPLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGUg0J7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZUluY0NsaWNrKGUpIHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VGFyZ2V0IH0gPSBlO1xuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChjdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgJGJsb2NrID0gJHRhcmdldC5jbG9zZXN0KCcuc3Bpbm5lcicpO1xuICAgICAgICBjb25zdCBzcGlubmVyID0gU3Bpbm5lci5nZXRJbnN0YW5jZSgkYmxvY2spO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHNwaW5uZXIudmFsdWUgKyBzcGlubmVyLnN0ZXA7XG5cbiAgICAgICAgaWYgKHNwaW5uZXIucHJlY2lzaW9uKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUudG9GaXhlZChzcGlubmVyLnByZWNpc2lvbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Bpbm5lci5jaGFuZ2VWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgICAgc3Bpbm5lci51cGRhdGVCdXR0b25zKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0LLQstC+0LTQsCDQsiDQv9C+0LvQtS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlINCe0LHRitC10LrRgiDRgdC+0LHRi9GC0LjRjy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYW5kbGVJbnB1dChlKSB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudFRhcmdldCB9ID0gZTtcbiAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0ICRibG9jayA9ICR0YXJnZXQuY2xvc2VzdCgnLnNwaW5uZXInKTtcbiAgICAgICAgY29uc3Qgc3Bpbm5lciA9IFNwaW5uZXIuZ2V0SW5zdGFuY2UoJGJsb2NrKTtcbiAgICAgICAgY29uc3QgeyAkaW5wdXQgfSA9IHNwaW5uZXIuZWxlbWVudHM7XG5cbiAgICAgICAgbGV0IHZhbHVlID0gKyRpbnB1dC52YWwoKTtcblxuICAgICAgICBpZiAoISRpbnB1dC52YWwoKS5sZW5ndGggfHwgdmFsdWUgPCBzcGlubmVyLm1pbiB8fCB2YWx1ZSA+IHNwaW5uZXIubWF4KSB7XG4gICAgICAgICAgICAoeyB2YWx1ZSB9ID0gc3Bpbm5lcik7XG4gICAgICAgIH1cblxuICAgICAgICBzcGlubmVyLmNoYW5nZVZhbHVlKHZhbHVlKTtcblxuICAgICAgICBzcGlubmVyLnVwZGF0ZUJ1dHRvbnMoKTtcbiAgICB9XG5cbiAgICBpbml0Q2Fyb3VzZWxzKCk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGluaXRDYXJvdXNlbHMpO1xuXG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXRgiDQstGB0LUg0LrQsNGA0YPRgdC10LvQuFxuICAgIGZ1bmN0aW9uIGluaXRDYXJvdXNlbHMoKSB7XG4gICAgICAgIC8vICDQutCw0YDRg9GB0LXQu9GMINC90LAg0L/QtdGA0LLQvtC8INCx0LDQvdC90LXRgNC1INC90LAg0LPQu9Cw0LLQvdC+0Lkg0YHRgtGA0LDQvdC40YbQtVxuICAgICAgICBjb25zdCAkbmV3c0Nhcm91c2VsID0gJCgnLmpzLW5ld3MtY2Fyb3VzZWwnKTtcbiAgICAgICAgaWYgKCRuZXdzQ2Fyb3VzZWwubGVuZ3RoICYmICEkbmV3c0Nhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkbmV3c0Nhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY3LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiAxMDIzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC/0L7QtNCx0L7RgNCwINCx0LDQudC60L7QslxuICAgICAgICBjb25zdCAkYmlrZXNDYXJvdXNlbCA9ICQoJy5qcy1iaWtlcy1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJGJpa2VzQ2Fyb3VzZWwubGVuZ3RoICYmICEkYmlrZXNDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJGJpa2VzQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiAndW5zbGljaycsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBiaWtlIGFmdGVyIGluaXRcbiAgICAgICAgICAgICRiaWtlc0Nhcm91c2VsXG4gICAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dCcpXG4gICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgYmlrZSBhZnRlciBjaGFuZ2VcbiAgICAgICAgICAgICRiaWtlc0Nhcm91c2VsLm9uKCdhZnRlckNoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAkYmlrZXNDYXJvdXNlbFxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnLnNsaWNrLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dCcpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vINC60LDRgNGD0YHQtdC70Ywg0LrQsNGC0LXQs9C+0YDQuNC5XG4gICAgICAgIGNvbnN0ICRjYXRlZ29yaWVzQ2Fyb3VzZWwgPSAkKCcuanMtY2F0ZWdvcmllcy1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJGNhdGVnb3JpZXNDYXJvdXNlbC5sZW5ndGggJiYgISRjYXRlZ29yaWVzQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRjYXRlZ29yaWVzQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICcwJyxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY3LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC/0YDQvtC10LrRgtC+0LIg0Lgv0LjQu9C4INGB0L7QsdGL0YLQuNC5XG4gICAgICAgIGNvbnN0ICRwcm9qZWN0c0Nhcm91c2VsID0gJCgnLmpzLXByb2plY3RzLWNhcm91c2VsJyk7XG4gICAgICAgIGlmICgkcHJvamVjdHNDYXJvdXNlbC5sZW5ndGggJiYgISRwcm9qZWN0c0Nhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG4gICAgICAgICAgICAkcHJvamVjdHNDYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgY2VudGVyUGFkZGluZzogJzAnLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogJ3Vuc2xpY2snLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA2MzksXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0LrQsNGA0YPRgdC10LvRjCDQvdCwINCz0LvQsNCy0L3QvtC5XG4gICAgICAgIGNvbnN0ICRpbmRleE1haW5DYXJvdXNlbCA9ICQoJy5qcy1pbmRleC1tYWluLWNhcm91c2VsJyk7XG4gICAgICAgIGlmICgkaW5kZXhNYWluQ2Fyb3VzZWwubGVuZ3RoICYmICEkaW5kZXhNYWluQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRpbmRleE1haW5DYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgY2VudGVyUGFkZGluZzogJzAnLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vINC60LDRgNGD0YHQtdC70Ywg0LrQsNGA0YLQuNC90L7QuiDRgtC+0LLQsNGA0LBcbiAgICAgICAgY29uc3QgJHByb2R1Y3RDYXJvdXNlbCA9ICQoJy5qcy1wcm9kdWN0LWNhcm91c2VsJyk7XG4gICAgICAgIGlmICgkcHJvZHVjdENhcm91c2VsLmxlbmd0aCAmJiAhJHByb2R1Y3RDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJHByb2R1Y3RDYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgcHJldkFycm93OlxuICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4tYXJyb3cgYnRuLWFycm93LS1wcmV2IHByb2R1Y3QtcGFnZV9fY2Fyb3VzZWwtcHJldlwiPjxzdmcgY2xhc3M9XCJpY29uIGljb24tLWFycm93LW5leHRcIj48dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1hcnJvd19uZXh0XCI+PC91c2U+PC9zdmc+PC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICBuZXh0QXJyb3c6XG4gICAgICAgICAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1hcnJvdyBwcm9kdWN0LXBhZ2VfX2Nhcm91c2VsLW5leHRcIj48c3ZnIGNsYXNzPVwiaWNvbiBpY29uLS1hcnJvdy1uZXh0XCI+PHVzZSB4bGluazpocmVmPVwiI2ljb24tYXJyb3dfbmV4dFwiPjwvdXNlPjwvc3ZnPjwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjgsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkcHJvZHVjdENhcm91c2VsLm9uKCdhZnRlckNoYW5nZScsIChzbGljaywgY3VycmVudFNsaWRlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgJHBhcmVudCA9ICQoc2xpY2suY3VycmVudFRhcmdldCkuY2xvc2VzdCgnLnByb2R1Y3QtcGFnZV9fY2Fyb3VzZWwtd3JhcHBlcicpO1xuICAgICAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLnByb2R1Y3QtcGFnZV9fY2Fyb3VzZWwtYnRucy1waWMnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJHBhcmVudC5maW5kKGBbZGF0YS1zbGlkZT0ke2N1cnJlbnRTbGlkZS5jdXJyZW50U2xpZGV9XWApLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDRgNC10LDQu9C40LfQvtCy0YvQstCw0LXQvCDQv9C10YDQtdC60LvRjtGH0LXQvdC40LUg0YHQu9Cw0LnQtNC+0LJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcucHJvZHVjdC1wYWdlX19jYXJvdXNlbC1idG5zLXBpYycsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRidG4gPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICAgICAgY29uc3QgJHBhcmVudCA9ICRidG4uY2xvc2VzdCgnLnByb2R1Y3QtcGFnZV9fY2Fyb3VzZWwtd3JhcHBlcicpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRwcm9kdWN0Q2Fyb3VzZWwgPSAkcGFyZW50LmZpbmQoJy5qcy1wcm9kdWN0LWNhcm91c2VsJyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2xpZGVJZCA9ICRidG4uZGF0YSgnc2xpZGUnKTtcbiAgICAgICAgICAgICAgICAkcGFyZW50LmZpbmQoJy5wcm9kdWN0LXBhZ2VfX2Nhcm91c2VsLWJ0bnMtcGljJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRidG4uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRwcm9kdWN0Q2Fyb3VzZWwuc2xpY2soJ3NsaWNrR29UbycsIHNsaWRlSWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC/0L7RhdC+0LbQuNGFINGC0L7QstCw0YDQvtCyXG4gICAgICAgIGNvbnN0ICRzaW1pbGFyQ2Fyb3VzZWwgPSAkKCcuanMtc2ltaWxhci1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJHNpbWlsYXJDYXJvdXNlbC5sZW5ndGggJiYgISRzaW1pbGFyQ2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgICAgICRzaW1pbGFyQ2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICcwJyxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNjM5LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6ICd1bnNsaWNrJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQutCw0YDRg9GB0LXQu9GMINC60LDRgNGC0LjQvdC+0LpcbiAgICAgICAgY29uc3QgJHBpY3R1cmVDYXJvdXNlbCA9ICQoJy5qcy1waWN0dXJlLWNhcm91c2VsJyk7XG4gICAgICAgIGlmICgkcGljdHVyZUNhcm91c2VsLmxlbmd0aCAmJiAhJHBpY3R1cmVDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJHBpY3R1cmVDYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRiaWtlQ2FyZENhcm91c2VsID0gJCgnLmpzLWJpa2UtY2FyZC1jYXJvdXNlbCcpO1xuICAgICAgICBpZiAoJGJpa2VDYXJkQ2Fyb3VzZWwubGVuZ3RoICYmICEkYmlrZUNhcmRDYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAgICAgJGJpa2VDYXJkQ2Fyb3VzZWwuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAkKGl0ZW0pLnNsaWNrKHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGZhZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFkZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g0YDQtdCw0LvQuNC30L7QstGL0LLQsNC10Lwg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INGB0LvQsNC50LTQvtCyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWJpa2UtY2FyZC1zbGlkZS1idG4nLCBlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkYnRuID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRwYXJlbnQgPSAkYnRuLmNsb3Nlc3QoJy5iaWtlLWNhcmQnKTtcbiAgICAgICAgICAgICAgICBjb25zdCAkY2Fyb3VzZWwgPSAkcGFyZW50LmZpbmQoJy5qcy1iaWtlLWNhcmQtY2Fyb3VzZWwnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzbGlkZUlkID0gJGJ0bi5kYXRhKCdzbGlkZScpO1xuICAgICAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLmpzLWJpa2UtY2FyZC1zbGlkZS1idG4nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJGJ0bi5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJGNhcm91c2VsLnNsaWNrKCdzbGlja0dvVG8nLCBzbGlkZUlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgJHVwQnRuID0gJCgnLmpzLWJ0bi11cCcpO1xuXG4gICAgaWYgKCR1cEJ0bi5sZW5ndGgpIHtcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1idG4tdXAnLCAoKSA9PiB7XG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID49IGdsb2JhbE9wdGlvbnMudGFibGV0TGdTaXplKSB7XG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gNTAgPyAkdXBCdG4uc2hvdygpIDogJHVwQnRuLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgJGZpbHRlck1vZGFsID0gJCgnLmpzLWZpbHRlci1tb2RhbCcpO1xuICAgIGlmICgkZmlsdGVyTW9kYWwubGVuZ3RoKSB7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtZmlsdGVyLWJ0bicsIGUgPT4ge1xuICAgICAgICAgICAgJGZpbHRlck1vZGFsLmFkZENsYXNzKCdpcy1hY3RpdmUnKS5hbmltYXRlQ3NzKCdzbGlkZUluUmlnaHQnKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGFzLW92ZXJsYXknKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1maWx0ZXItY2xvc2UnLCBlID0+IHtcbiAgICAgICAgICAgICRmaWx0ZXJNb2RhbC5hbmltYXRlQ3NzKCdzbGlkZU91dFJpZ2h0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICRmaWx0ZXJNb2RhbC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdoYXMtb3ZlcmxheScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykubGVuZ3RoID4gMCkge1xuICAgICAgICAvKipcbiAgICAgICAgICog0JDQvdC40LzQsNGG0LjRjyDRjdC70LXQvNC10L3RgtCwIGxhYmVsINC/0YDQuCDRhNC+0LrRg9GB0LUg0L/QvtC70LXQuSDRhNC+0YDQvNGLXG4gICAgICAgICAqL1xuICAgICAgICAkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gJChlbCkuZmluZCgnaW5wdXQsIHRleHRhcmVhJyk7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAkKGZpZWxkKVxuICAgICAgICAgICAgICAgICAgICAudmFsKClcbiAgICAgICAgICAgICAgICAgICAgLnRyaW0oKSAhPSAnJyB8fFxuICAgICAgICAgICAgICAgICQoZmllbGQpLmlzKCc6cGxhY2Vob2xkZXItc2hvd24nKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKGZpZWxkKVxuICAgICAgICAgICAgICAgIC5vbignZm9jdXMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub24oJ2JsdXInLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKSA9PT0gJycgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICEkKGZpZWxkKS5pcygnOnBsYWNlaG9sZGVyLXNob3duJylcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyogQHNlZSBodHRwczovL2F0b21pa3MuZ2l0aHViLmlvL3RpcHB5anMvICovXG5cbiAgICBjb25zdCB0b29sdGlwU2V0dGluZ3MgPSB7XG4gICAgICAgIGFycm93OiBmYWxzZSxcbiAgICAgICAgYWxsb3dIVE1MOiBmYWxzZSxcbiAgICAgICAgYW5pbWF0ZUZpbGw6IGZhbHNlLFxuICAgICAgICBwbGFjZW1lbnQ6ICdyaWdodC1jZW50ZXInLFxuICAgICAgICBkaXN0YW5jZTogMjAsXG4gICAgICAgIHRoZW1lOiAndG9vbHRpcCcsXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqICBpbml0IGFsbCB0b29sdGlwc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXRUb29sdGlwcygpIHtcbiAgICAgICAgJCgnW2RhdGEtdG9vbHRpcF0nKS5lYWNoKChpbmRleCwgZWxlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbG9jYWxTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAkKGVsZW0pLmF0dHIoJ2RhdGEtdG9vbHRpcCcpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICgkKGVsZW0pLmRhdGEoJ2NsaWNrJykpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFNldHRpbmdzWyd0cmlnZ2VyJ10gPSAnY2xpY2sga2V5dXAnO1xuICAgICAgICAgICAgICAgIGxvY2FsU2V0dGluZ3NbJ2ludGVyYWN0aXZlJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aXBweShlbGVtLCBPYmplY3QuYXNzaWduKHt9LCB0b29sdGlwU2V0dGluZ3MsIGxvY2FsU2V0dGluZ3MpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFRvb2x0aXBzKCk7XG5cbiAgICAvLyBzaG9wIGFkZHJlc3NcbiAgICAvLyDQnNC+0YHQutC+0LLRgdC60LDRjyDQvtCx0LvQsNGC0YwsINCh0L7Qu9C90LXRh9C90L7Qs9C+0YDRgdC60LjQuSDRgNCw0LnQvtC9LCDQtC4g0JTRg9GA0YvQutC40L3QviwgMdCULlxuICAgIGNvbnN0IHNob3AgPSB7IGxhdDogNTYuMDU5Njk1LCBsbmc6IDM3LjE0NDE0MiB9O1xuXG4gICAgLy8gZm9yIGJsYWNrIG1hcFxuICAgIGNvbnN0IG1hcFN0eWxlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMyMTIxMjEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy5pY29uJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICdvZmYnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNzU3NTc1JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5zdHJva2UnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMjEyMTIxJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdhZG1pbmlzdHJhdGl2ZScsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2dlb21ldHJ5JyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzc1NzU3NScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAnYWRtaW5pc3RyYXRpdmUuY291bnRyeScsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOWU5ZTllJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdhZG1pbmlzdHJhdGl2ZS5sYW5kX3BhcmNlbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAnb2ZmJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdhZG1pbmlzdHJhdGl2ZS5sb2NhbGl0eScsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjYmRiZGJkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdwb2knLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzc1NzU3NScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncG9pLnBhcmsnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMxODE4MTgnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3BvaS5wYXJrJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM2MTYxNjEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3BvaS5wYXJrJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuc3Ryb2tlJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzFiMWIxYicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncm9hZCcsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2dlb21ldHJ5LmZpbGwnLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMmMyYzJjJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdyb2FkJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM4YThhOGEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3JvYWQuYXJ0ZXJpYWwnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzNzM3MzcnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3JvYWQuaGlnaHdheScsXG4gICAgICAgICAgICBlbGVtZW50VHlwZTogJ2dlb21ldHJ5JyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNjM2MzYycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAncm9hZC5oaWdod2F5LmNvbnRyb2xsZWRfYWNjZXNzJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnZ2VvbWV0cnknLFxuICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNGU0ZTRlJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICdyb2FkLmxvY2FsJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM2MTYxNjEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3RyYW5zaXQnLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzc1NzU3NScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVUeXBlOiAnd2F0ZXInLFxuICAgICAgICAgICAgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3dhdGVyJyxcbiAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZDNkM2QnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgIF07XG5cbiAgICAvLyBJbml0aWFsaXplIGFuZCBhZGQgdGhlIG1hcFxuICAgIGZ1bmN0aW9uIGluaXRNYXAoKSB7XG4gICAgICAgIC8vIFRoZSBtYXAsIGNlbnRlcmVkIGF0IFNob3BcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcbiAgICAgICAgICAgIHpvb206IDE0LFxuICAgICAgICAgICAgY2VudGVyOiBzaG9wLFxuICAgICAgICAgICAgc3R5bGVzOiBtYXBTdHlsZXMsXG4gICAgICAgICAgICB6b29tQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgIHNjYWxlQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICAgIHJvdGF0ZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgICAgZnVsbHNjcmVlbkNvbnRyb2w6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHBvaW50SWNvbiA9IHtcbiAgICAgICAgICAgIHVybDogJ2ltZy9zdmcvcG9pbnQuc3ZnJyxcbiAgICAgICAgICAgIC8vIFRoaXMgbWFya2VyIGlzIDcyIHBpeGVscyB3aWRlIGJ5IDcyIHBpeGVscyBoaWdoLlxuICAgICAgICAgICAgc2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoNzIsIDcyKSxcbiAgICAgICAgICAgIC8vIFRoZSBvcmlnaW4gZm9yIHRoaXMgaW1hZ2UgaXMgKDAsIDApLlxuICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAvLyBUaGUgYW5jaG9yIGZvciB0aGlzIGltYWdlIGlzIHRoZSBjZW50ZXIgYXQgKDAsIDMyKS5cbiAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDM2LCAzNiksXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVGhlIG1hcmtlciwgcG9zaXRpb25lZCBhdCBzaG9wXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgcG9zaXRpb246IHNob3AsXG4gICAgICAgICAgICBpY29uOiBwb2ludEljb24sXG4gICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgd2luZG93LmluaXRNYXAgPSBpbml0TWFwO1xuXG47XG59KTtcbiJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==

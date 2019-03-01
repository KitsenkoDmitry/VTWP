"use strict";

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
    // Проверка touch устройств
    // isTouch: $.browser.mobile,
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
  $(window).load(function () {
    // const { name } = $.browser;
    // if (name) {
    //     $('html').addClass(`browser-${name}`);
    // }
    // if (globalOptions.isTouch) {
    //     $('html').addClass('touch').removeClass('no-touch');
    // } else {
    //     $('html').addClass('no-touch').removeClass('touch');
    // }
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
            $(this).find("option[value=\"".concat($(this).context.value, "\"]")).click();
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

  initTooltips();
  ;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wTGdTaXplIiwiZGVza3RvcE1kU2l6ZSIsImRlc2t0b3BTaXplIiwiZGVza3RvcFNtU2l6ZSIsInRhYmxldExnU2l6ZSIsInRhYmxldFNpemUiLCJtb2JpbGVMZ1NpemUiLCJtb2JpbGVTaXplIiwibGFuZyIsImF0dHIiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnREZXNrdG9wTGciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYnJlYWtwb2ludERlc2t0b3BNZCIsImJyZWFrcG9pbnREZXNrdG9wIiwiYnJlYWtwb2ludERlc2t0b3BTbSIsImJyZWFrcG9pbnRUYWJsZXRMZyIsImJyZWFrcG9pbnRUYWJsZXQiLCJicmVha3BvaW50TW9iaWxlTGdTaXplIiwiYnJlYWtwb2ludE1vYmlsZSIsImV4dGVuZCIsImxvYWQiLCJsZW5ndGgiLCJhdXRvc2l6ZSIsImZuIiwiYW5pbWF0ZUNzcyIsImFuaW1hdGlvbk5hbWUiLCJjYWxsYmFjayIsImFuaW1hdGlvbkVuZCIsImVsIiwiYW5pbWF0aW9ucyIsImFuaW1hdGlvbiIsIk9BbmltYXRpb24iLCJNb3pBbmltYXRpb24iLCJXZWJraXRBbmltYXRpb24iLCJ0Iiwic3R5bGUiLCJ1bmRlZmluZWQiLCJjcmVhdGVFbGVtZW50IiwiYWRkQ2xhc3MiLCJvbmUiLCJyZW1vdmVDbGFzcyIsImlzTnVtZXJpYyIsIm4iLCJpc05hTiIsInBhcnNlRmxvYXQiLCJpc0Zpbml0ZSIsInJlbW92ZU5vdERpZ2l0cyIsInBhcmFtIiwidG9TdHJpbmciLCJyZXBsYWNlIiwiZGl2aWRlQnlEaWdpdHMiLCJsb2NhbGUiLCJQYXJzbGV5Iiwic2V0TG9jYWxlIiwib3B0aW9ucyIsInRyaWdnZXIiLCJ2YWxpZGF0aW9uVGhyZXNob2xkIiwiZXJyb3JzV3JhcHBlciIsImVycm9yVGVtcGxhdGUiLCJjbGFzc0hhbmRsZXIiLCJpbnN0YW5jZSIsIiRlbGVtZW50IiwidHlwZSIsIiRoYW5kbGVyIiwiaGFzQ2xhc3MiLCJuZXh0IiwiZXJyb3JzQ29udGFpbmVyIiwiJGNvbnRhaW5lciIsImNsb3Nlc3QiLCJwYXJlbnQiLCJhZGRWYWxpZGF0b3IiLCJ2YWxpZGF0ZVN0cmluZyIsInZhbHVlIiwidGVzdCIsIm1lc3NhZ2VzIiwicnUiLCJlbiIsInJlZ1Rlc3QiLCJyZWdNYXRjaCIsIm1pbiIsImFyZ3VtZW50cyIsImRhdGEiLCJtYXgiLCJtaW5EYXRlIiwibWF4RGF0ZSIsInZhbHVlRGF0ZSIsInJlc3VsdCIsIm1hdGNoIiwiRGF0ZSIsIm1heFNpemUiLCJwYXJzbGV5SW5zdGFuY2UiLCJmaWxlcyIsInNpemUiLCJyZXF1aXJlbWVudFR5cGUiLCJmb3JtYXRzIiwiZmlsZUV4dGVuc2lvbiIsInNwbGl0IiwicG9wIiwiZm9ybWF0c0FyciIsInZhbGlkIiwiaSIsIm9uIiwiJGJsb2NrIiwiJGxhc3QiLCJhZnRlciIsImVsZW1lbnQiLCJwYXJzbGV5IiwiaW5wdXRtYXNrIiwiY2xlYXJNYXNrT25Mb3N0Rm9jdXMiLCJzaG93TWFza09uSG92ZXIiLCJDdXN0b21TZWxlY3QiLCIkZWxlbSIsInNlbGYiLCJpbml0IiwiJGluaXRFbGVtIiwiZWFjaCIsInNlbGVjdFNlYXJjaCIsIm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIiwiSW5maW5pdHkiLCJzZWxlY3QyIiwic2VsZWN0T25CbHVyIiwiZHJvcGRvd25Dc3NDbGFzcyIsImxhbmd1YWdlIiwibm9SZXN1bHRzIiwiZSIsImZpbmQiLCJjb250ZXh0IiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbVNlbGVjdCIsImRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyIsImRhdGVGb3JtYXQiLCJzaG93T3RoZXJNb250aHMiLCJEYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsInNob3dNWSIsImN1cnJlbnREYXRlIiwiY3VycmVudERheSIsImdldERhdGUiLCJuZXdEYXRlIiwiZ2V0TW9udGgiLCJnZXRGdWxsWWVhciIsIml0ZW1PcHRpb25zIiwib25TZWxlY3QiLCJjaGFuZ2UiLCJzZXRUaW1lb3V0IiwiJG1vYmlsZU1lbnUiLCIkY2FydE1vZGFsIiwib3Blbk1vZGFsIiwiaGlkZU1vZGFsIiwicHJldmVudERlZmF1bHQiLCIkbW9kYWxCbG9jayIsImxvY2tEb2N1bWVudCIsInVubG9ja0RvY3VtZW50IiwiaW5kZXgiLCJmaWVsZCIsInZhbCIsInRyaW0iLCJpcyIsImV2ZW50IiwidG9vbHRpcFNldHRpbmdzIiwiYXJyb3ciLCJhbGxvd0hUTUwiLCJhbmltYXRlRmlsbCIsInBsYWNlbWVudCIsImRpc3RhbmNlIiwidGhlbWUiLCJpbml0VG9vbHRpcHMiLCJlbGVtIiwibG9jYWxTZXR0aW5ncyIsImNvbnRlbnQiLCJ0aXBweSIsIk9iamVjdCIsImFzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWUMsS0FBWixDQUFrQixZQUFXO0FBQ3pCOzs7QUFHQSxNQUFJQyxhQUFhLEdBQUc7QUFDaEI7QUFDQUMsSUFBQUEsSUFBSSxFQUFHLEdBRlM7QUFJaEI7QUFDQUMsSUFBQUEsYUFBYSxFQUFHLElBTEE7QUFNaEJDLElBQUFBLGFBQWEsRUFBRyxJQU5BO0FBT2hCQyxJQUFBQSxXQUFXLEVBQUssSUFQQTtBQVFoQkMsSUFBQUEsYUFBYSxFQUFHLElBUkE7QUFTaEJDLElBQUFBLFlBQVksRUFBSSxJQVRBO0FBVWhCQyxJQUFBQSxVQUFVLEVBQU0sR0FWQTtBQVdoQkMsSUFBQUEsWUFBWSxFQUFJLEdBWEE7QUFZaEJDLElBQUFBLFVBQVUsRUFBTSxHQVpBO0FBZWhCO0FBQ0E7QUFFQUMsSUFBQUEsSUFBSSxFQUFFYixDQUFDLENBQUMsTUFBRCxDQUFELENBQVVjLElBQVYsQ0FBZSxNQUFmO0FBbEJVLEdBQXBCLENBSnlCLENBeUJ6QjtBQUNBOztBQUNBLE1BQU1DLFdBQVcsR0FBRztBQUNoQkMsSUFBQUEsbUJBQW1CLEVBQUVDLE1BQU0s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LE9BQWIsQ0FBSixFQUEyQjtBQUN2QnlGLFFBQUFBLGFBQWEsQ0FBQyxTQUFELENBQWIsR0FBMkIsYUFBM0I7QUFDQUEsUUFBQUEsYUFBYSxDQUFDLGFBQUQsQ0FBYixHQUErQixJQUEvQjtBQUNIOztBQUVERSxNQUFBQSxLQUFLLENBQUNILElBQUQsRUFBT0ksTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQmIsZUFBbEIsRUFBbUNTLGFBQW5DLENBQVAsQ0FBTDtBQUNILEtBVkQ7QUFXSDs7QUFFREYsRUFBQUEsWUFBWTtBQUVoQjtBQUNDLENBaG5CRCIsInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqINCT0LvQvtCx0LDQu9GM0L3Ri9C1INC/0LXRgNC10LzQtdC90L3Ri9C1LCDQutC+0YLQvtGA0YvQtSDQuNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8g0LzQvdC+0LPQvtC60YDQsNGC0L3QvlxuICAgICAqL1xuICAgIGxldCBnbG9iYWxPcHRpb25zID0ge1xuICAgICAgICAvLyDQktGA0LXQvNGPINC00LvRjyDQsNC90LjQvNCw0YbQuNC5XG4gICAgICAgIHRpbWU6ICAyMDAsXG5cbiAgICAgICAgLy8g0JrQvtC90YLRgNC+0LvRjNC90YvQtSDRgtC+0YfQutC4INCw0LTQsNC/0YLQuNCy0LBcbiAgICAgICAgZGVza3RvcExnU2l6ZTogIDE5MTAsXG4gICAgICAgIGRlc2t0b3BNZFNpemU6ICAxNjAwLFxuICAgICAgICBkZXNrdG9wU2l6ZTogICAgMTQ4MCxcbiAgICAgICAgZGVza3RvcFNtU2l6ZTogIDEyODAsXG4gICAgICAgIHRhYmxldExnU2l6ZTogICAxMDI0LFxuICAgICAgICB0YWJsZXRTaXplOiAgICAgNzY4LFxuICAgICAgICBtb2JpbGVMZ1NpemU6ICAgNjQwLFxuICAgICAgICBtb2JpbGVTaXplOiAgICAgNDgwLFxuXG5cbiAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsCB0b3VjaCDRg9GB0YLRgNC+0LnRgdGC0LJcbiAgICAgICAgLy8gaXNUb3VjaDogJC5icm93c2VyLm1vYmlsZSxcblxuICAgICAgICBsYW5nOiAkKCdodG1sJykuYXR0cignbGFuZycpXG4gICAgfTtcblxuICAgIC8vINCR0YDQtdC50LrQv9C+0LjQvdGC0Ysg0LDQtNCw0L/RgtC40LLQsFxuICAgIC8vIEBleGFtcGxlIGlmIChnbG9iYWxPcHRpb25zLmJyZWFrcG9pbnRUYWJsZXQubWF0Y2hlcykge30gZWxzZSB7fVxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0ge1xuICAgICAgICBicmVha3BvaW50RGVza3RvcExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcE1kOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BNZFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wU206IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFNtU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXRMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50VGFibGV0OiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50TW9iaWxlTGdTaXplOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLm1vYmlsZUxnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlU2l6ZSAtIDF9cHgpYClcbiAgICB9O1xuXG4gICAgJC5leHRlbmQodHJ1ZSwgZ2xvYmFsT3B0aW9ucywgYnJlYWtwb2ludHMpO1xuXG5cblxuXG4gICAgJCh3aW5kb3cpLmxvYWQoKCkgPT4ge1xuICAgICAgICAvLyBjb25zdCB7IG5hbWUgfSA9ICQuYnJvd3NlcjtcblxuICAgICAgICAvLyBpZiAobmFtZSkge1xuICAgICAgICAvLyAgICAgJCgnaHRtbCcpLmFkZENsYXNzKGBicm93c2VyLSR7bmFtZX1gKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIGlmIChnbG9iYWxPcHRpb25zLmlzVG91Y2gpIHtcbiAgICAgICAgLy8gICAgICQoJ2h0bWwnKS5hZGRDbGFzcygndG91Y2gnKS5yZW1vdmVDbGFzcygnbm8tdG91Y2gnKTtcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnbm8tdG91Y2gnKS5yZW1vdmVDbGFzcygndG91Y2gnKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGlmICgkKCd0ZXh0YXJlYScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGF1dG9zaXplKCQoJ3RleHRhcmVhJykpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIC8qKlxuICAgICAqINCf0L7QtNC60LvRjtGH0LXQvdC40LUganMgcGFydGlhbHNcbiAgICAgKi9cbiAgICAvKipcbiAqINCg0LDRgdGI0LjRgNC10L3QuNC1IGFuaW1hdGUuY3NzXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGFuaW1hdGlvbk5hbWUg0L3QsNC30LLQsNC90LjQtSDQsNC90LjQvNCw0YbQuNC4XG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sg0YTRg9C90LrRhtC40Y8sINC60L7RgtC+0YDQsNGPINC+0YLRgNCw0LHQvtGC0LDQtdGCINC/0L7RgdC70LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxuICogQHJldHVybiB7T2JqZWN0fSDQvtCx0YrQtdC60YIg0LDQvdC40LzQsNGG0LjQuFxuICogXG4gKiBAc2VlICBodHRwczovL2RhbmVkZW4uZ2l0aHViLmlvL2FuaW1hdGUuY3NzL1xuICogXG4gKiBAZXhhbXBsZVxuICogJCgnI3lvdXJFbGVtZW50JykuYW5pbWF0ZUNzcygnYm91bmNlJyk7XG4gKiBcbiAqICQoJyN5b3VyRWxlbWVudCcpLmFuaW1hdGVDc3MoJ2JvdW5jZScsIGZ1bmN0aW9uKCkge1xuICogICAgIC8vINCU0LXQu9Cw0LXQvCDRh9GC0L4t0YLQviDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcbiAqIH0pO1xuICovXG4kLmZuLmV4dGVuZCh7XG4gICAgYW5pbWF0ZUNzczogZnVuY3Rpb24oYW5pbWF0aW9uTmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGFuaW1hdGlvbkVuZCA9IChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnYW5pbWF0aW9uZW5kJyxcbiAgICAgICAgICAgICAgICBPQW5pbWF0aW9uOiAnb0FuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgTW96QW5pbWF0aW9uOiAnbW96QW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICBXZWJraXRBbmltYXRpb246ICd3ZWJraXRBbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZm9yIChsZXQgdCBpbiBhbmltYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbnNbdF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG5cbiAgICAgICAgdGhpcy5hZGRDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1hdGlvbk5hbWUpLm9uZShhbmltYXRpb25FbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1hdGlvbk5hbWUpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59KTtcbiAgICAvLyDQndC10LHQvtC70YzRiNC40LUg0LLRgdC/0L7QvNC+0LPQsNGC0LXQu9GM0L3Ri9C1INGE0YPQvdC60YbQuNC4XG5cbiAgICAvKipcbiAgICAgKiDQn9GA0L7QstC10YDRj9C10YIg0YfQuNGB0LvQviDQuNC70Lgg0L3QtdGCXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IG4g0JvRjtCx0L7QuSDQsNGA0LPRg9C80LXQvdGCXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNOdW1lcmljKG4pIHtcbiAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqINCj0LTQsNC70Y/QtdGCINCy0YHQtSDQvdC10YfQuNGB0LvQvtCy0YvQtSDRgdC40LzQstC+0LvRiyDQuCDQv9GA0LjQstC+0LTQuNGCINC6INGH0LjRgdC70YNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyfG51bWJlcn0gcGFyYW1cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlbW92ZU5vdERpZ2l0cyhwYXJhbSkge1xuICAgICAgICAvKiDRg9C00LDQu9GP0LXQvCDQstGB0LUg0YHQuNC80LLQvtC70Ysg0LrRgNC+0LzQtSDRhtC40YTRgCDQuCDQv9C10YDQtdCy0L7QtNC40Lwg0LIg0YfQuNGB0LvQviAqL1xuICAgICAgICByZXR1cm4gK3BhcmFtLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQoNCw0LfQtNC10LvRj9C10YIg0L3QsCDRgNCw0LfRgNGP0LTRi1xuICAgICAqINCd0LDQv9GA0LjQvNC10YAsIDM4MDAwMDAgLT4gMyA4MDAgMDAwXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cnxudW1iZXJ9IHBhcmFtXG4gICAgICogQHJldHVybnMge3N0cn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaXZpZGVCeURpZ2l0cyhwYXJhbSkge1xuICAgICAgICBpZiAocGFyYW0gPT09IG51bGwpIHBhcmFtID0gMDtcbiAgICAgICAgcmV0dXJuIHBhcmFtLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCkoPz0oXFxkXFxkXFxkKSsoW15cXGRdfCQpKS9nLCAnJDEgJyk7XG4gICAgfVxuXG4gICAgdmFyIGxvY2FsZSA9IGdsb2JhbE9wdGlvbnMubGFuZyA9PSAncnUtUlUnID8gJ3J1JyA6ICdlbic7XG5cbiAgICBQYXJzbGV5LnNldExvY2FsZShsb2NhbGUpO1xuXG4gICAgLyog0J3QsNGB0YLRgNC+0LnQutC4IFBhcnNsZXkgKi9cbiAgICAkLmV4dGVuZChQYXJzbGV5Lm9wdGlvbnMsIHtcbiAgICAgICAgdHJpZ2dlcjogJ2JsdXIgY2hhbmdlJywgLy8gY2hhbmdlINC90YPQttC10L0g0LTQu9GPIHNlbGVjdCfQsFxuICAgICAgICB2YWxpZGF0aW9uVGhyZXNob2xkOiAnMCcsXG4gICAgICAgIGVycm9yc1dyYXBwZXI6ICc8ZGl2PjwvZGl2PicsXG4gICAgICAgIGVycm9yVGVtcGxhdGU6ICc8cCBjbGFzcz1cInBhcnNsZXktZXJyb3ItbWVzc2FnZVwiPjwvcD4nLFxuICAgICAgICBjbGFzc0hhbmRsZXI6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xuICAgICAgICAgICAgbGV0IHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXG4gICAgICAgICAgICAgICAgJGhhbmRsZXI7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJGVsZW1lbnQ7IC8vINGC0L4g0LXRgdGC0Ywg0L3QuNGH0LXQs9C+INC90LUg0LLRi9C00LXQu9GP0LXQvCAoaW5wdXQg0YHQutGA0YvRgiksINC40L3QsNGH0LUg0LLRi9C00LXQu9GP0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0LHQu9C+0LpcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAkaGFuZGxlciA9ICQoJy5zZWxlY3QyLXNlbGVjdGlvbi0tc2luZ2xlJywgJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAkaGFuZGxlcjtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3JzQ29udGFpbmVyOiBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSBpbnN0YW5jZS4kZWxlbWVudDtcbiAgICAgICAgICAgIGxldCB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxuICAgICAgICAgICAgICAgICRjb250YWluZXI7XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICQoYFtuYW1lPVwiJHskZWxlbWVudC5hdHRyKCduYW1lJyl9XCJdOmxhc3QgKyBsYWJlbGApLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5hdHRyKCduYW1lJykgPT0gJ2lzX3JlY2FwdGNoYV9zdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5wYXJlbnQoKS5uZXh0KCcuZy1yZWNhcHRjaGEnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LmNsb3Nlc3QoJy5maWVsZCcpO1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCRjb250YWluZXIpXG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIHJldHVybiAkY29udGFpbmVyO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQmtCw0YHRgtC+0LzQvdGL0LUg0LLQsNC70LjQtNCw0YLQvtGA0YtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZVJ1Jywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRXFwtIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0LvQsNGC0LjQvdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lRW4nLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW2EtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCBcIiBcIiwgXCItXCInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXpcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIidcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0Ysg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXJSdScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bMC050LAt0Y/RkV0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLINCQLdCvLCDQsC3RjywgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzINCQLdCvLCDQsC3RjywgMC05J1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiywg0LvQsNGC0LjQvdGB0LrQuNC1INC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtTGV0dGVyJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRYS16MC05XSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIDAtOSdcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgFxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdwaG9uZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bLSswLTkoKSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INGC0LXQu9C10YTQvtC90L3Ri9C5INC90L7QvNC10YAnLFxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgcGhvbmUgbnVtYmVyJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1iZXInLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eWzAtOV0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIDAtOScsXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyAwLTknXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCf0L7Rh9GC0LAg0LHQtdC3INC60LjRgNC40LvQu9C40YbRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdlbWFpbCcsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL14oW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKFxcLnxffC0pezAsMX0pK1tBLVphLXrQkC3Qr9CwLdGPMC05XFwtXVxcQChbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pKygoXFwuKXswLDF9W0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKXsxLH1cXC5bYS160LAt0Y8wLTlcXC1dezIsfSQvLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L/QvtGH0YLQvtCy0YvQuSDQsNC00YDQtdGBJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGVtYWlsIGFkZHJlc3MnXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCk0L7RgNC80LDRgiDQtNCw0YLRiyBERC5NTS5ZWVlZXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2RhdGUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgbGV0IHJlZ1Rlc3QgPSAvXig/Oig/OjMxKFxcLikoPzowP1sxMzU3OF18MVswMl0pKVxcMXwoPzooPzoyOXwzMCkoXFwuKSg/OjA/WzEsMy05XXwxWzAtMl0pXFwyKSkoPzooPzoxWzYtOV18WzItOV1cXGQpP1xcZHsyfSkkfF4oPzoyOShcXC4pMD8yXFwzKD86KD86KD86MVs2LTldfFsyLTldXFxkKT8oPzowWzQ4XXxbMjQ2OF1bMDQ4XXxbMTM1NzldWzI2XSl8KD86KD86MTZ8WzI0NjhdWzA0OF18WzM1NzldWzI2XSkwMCkpKSkkfF4oPzowP1sxLTldfDFcXGR8MlswLThdKShcXC4pKD86KD86MD9bMS05XSl8KD86MVswLTJdKSlcXDQoPzooPzoxWzYtOV18WzItOV1cXGQpP1xcZHs0fSkkLyxcbiAgICAgICAgICAgICAgICByZWdNYXRjaCA9IC8oXFxkezEsMn0pXFwuKFxcZHsxLDJ9KVxcLihcXGR7NH0pLyxcbiAgICAgICAgICAgICAgICBtaW4gPSBhcmd1bWVudHNbMl0uJGVsZW1lbnQuZGF0YSgnZGF0ZU1pbicpLFxuICAgICAgICAgICAgICAgIG1heCA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWF4JyksXG4gICAgICAgICAgICAgICAgbWluRGF0ZSwgbWF4RGF0ZSwgdmFsdWVEYXRlLCByZXN1bHQ7XG5cbiAgICAgICAgICAgIGlmIChtaW4gJiYgKHJlc3VsdCA9IG1pbi5tYXRjaChyZWdNYXRjaCkpKSB7XG4gICAgICAgICAgICAgICAgbWluRGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1heCAmJiAocmVzdWx0ID0gbWF4Lm1hdGNoKHJlZ01hdGNoKSkpIHtcbiAgICAgICAgICAgICAgICBtYXhEYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0ID0gdmFsdWUubWF0Y2gocmVnTWF0Y2gpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVEYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZWdUZXN0LnRlc3QodmFsdWUpICYmIChtaW5EYXRlID8gdmFsdWVEYXRlID49IG1pbkRhdGUgOiB0cnVlKSAmJiAobWF4RGF0ZSA/IHZhbHVlRGF0ZSA8PSBtYXhEYXRlIDogdHJ1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90LDRjyDQtNCw0YLQsCcsXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBkYXRlJ1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIC8vINCk0LDQudC7INC+0LPRgNCw0L3QuNGH0LXQvdC90L7Qs9C+INGA0LDQt9C80LXRgNCwXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2ZpbGVNYXhTaXplJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIG1heFNpemUsIHBhcnNsZXlJbnN0YW5jZSkge1xuICAgICAgICAgICAgbGV0IGZpbGVzID0gcGFyc2xleUluc3RhbmNlLiRlbGVtZW50WzBdLmZpbGVzO1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVzLmxlbmd0aCAhPSAxICB8fCBmaWxlc1swXS5zaXplIDw9IG1heFNpemUgKiAxMDI0O1xuICAgICAgICB9LFxuICAgICAgICByZXF1aXJlbWVudFR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0KTQsNC50Lsg0LTQvtC70LbQtdC9INCy0LXRgdC40YLRjCDQvdC1INCx0L7Qu9C10LUsINGH0LXQvCAlcyBLYicsXG4gICAgICAgICAgICBlbjogJ0ZpbGUgc2l6ZSBjYW5cXCd0IGJlIG1vcmUgdGhlbiAlcyBLYidcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0J7Qs9GA0LDQvdC40YfQtdC90LjRjyDRgNCw0YHRiNC40YDQtdC90LjQuSDRhNCw0LnQu9C+0LJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZUV4dGVuc2lvbicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlLCBmb3JtYXRzKSB7XG4gICAgICAgICAgICBsZXQgZmlsZUV4dGVuc2lvbiA9IHZhbHVlLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgICAgICBsZXQgZm9ybWF0c0FyciA9IGZvcm1hdHMuc3BsaXQoJywgJyk7XG4gICAgICAgICAgICBsZXQgdmFsaWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JtYXRzQXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVFeHRlbnNpb24gPT09IGZvcm1hdHNBcnJbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWxpZDtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0JTQvtC/0YPRgdGC0LjQvNGLINGC0L7Qu9GM0LrQviDRhNCw0LnQu9GLINGE0L7RgNC80LDRgtCwICVzJyxcbiAgICAgICAgICAgIGVuOiAnQXZhaWxhYmxlIGV4dGVuc2lvbnMgYXJlICVzJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQodC+0LfQtNCw0ZHRgiDQutC+0L3RgtC10LnQvdC10YDRiyDQtNC70Y8g0L7RiNC40LHQvtC6INGDINC90LXRgtC40L/QuNGH0L3Ri9GFINGN0LvQtdC80LXQvdGC0L7QslxuICAgIFBhcnNsZXkub24oJ2ZpZWxkOmluaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gdGhpcy4kZWxlbWVudCxcbiAgICAgICAgICAgIHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXG4gICAgICAgICAgICAkYmxvY2sgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygnZXJyb3JzLXBsYWNlbWVudCcpLFxuICAgICAgICAgICAgJGxhc3Q7XG5cbiAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJChgW25hbWU9XCIkeyRlbGVtZW50LmF0dHIoJ25hbWUnKX1cIl06bGFzdCArIGxhYmVsYCk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJyk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdmaWxlJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5jbG9zZXN0KCcuY3VzdG9tLWZpbGUnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJyk7XG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5hdHRyKCduYW1lJykgPT0gJ2lzX3JlY2FwdGNoYV9zdWNjZXNzJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5wYXJlbnQoKS5uZXh0KCcuZy1yZWNhcHRjaGEnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQmNC90LjRhtC40LjRgNGD0LXRgiDQstCw0LvQuNC00LDRhtC40Y4g0L3QsCDQstGC0L7RgNC+0Lwg0LrQsNC70LXQtNCw0YDQvdC+0Lwg0L/QvtC70LUg0LTQuNCw0L/QsNC30L7QvdCwXG4gICAgUGFyc2xleS5vbignZmllbGQ6dmFsaWRhdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCAkZWxlbWVudCA9ICQodGhpcy5lbGVtZW50KTtcbiAgICB9KTtcblxuICAgICQoJ2Zvcm1bZGF0YS12YWxpZGF0ZT1cInRydWVcIl0nKS5wYXJzbGV5KCk7XG5cbiAgICAvKipcbiAgICAgKiDQlNC+0LHQsNCy0LvRj9C10YIg0LzQsNGB0LrQuCDQsiDQv9C+0LvRjyDRhNC+0YDQvFxuICAgICAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9Sb2JpbkhlcmJvdHMvSW5wdXRtYXNrXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxpbnB1dCBjbGFzcz1cImpzLXBob25lLW1hc2tcIiB0eXBlPVwidGVsXCIgbmFtZT1cInRlbFwiIGlkPVwidGVsXCI+XG4gICAgICovXG4gICAgJCgnLmpzLXBob25lLW1hc2snKS5pbnB1dG1hc2soJys3KDk5OSkgOTk5LTk5LTk5Jywge1xuICAgICAgICBjbGVhck1hc2tPbkxvc3RGb2N1czogdHJ1ZSxcbiAgICAgICAgc2hvd01hc2tPbkhvdmVyOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog0KHRgtC40LvQuNC30YPQtdGCINGB0LXQu9C10LrRgtGLINGBINC/0L7QvNC+0YnRjNGOINC/0LvQsNCz0LjQvdCwIHNlbGVjdDJcbiAgICAgKiBodHRwczovL3NlbGVjdDIuZ2l0aHViLmlvXG4gICAgICovXG4gICAgbGV0IEN1c3RvbVNlbGVjdCA9IGZ1bmN0aW9uKCRlbGVtKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLmluaXQgPSBmdW5jdGlvbigkaW5pdEVsZW0pIHtcbiAgICAgICAgICAgICRpbml0RWxlbS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RTZWFyY2ggPSAkKHRoaXMpLmRhdGEoJ3NlYXJjaCcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdFNlYXJjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSAxOyAvLyDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gSW5maW5pdHk7IC8vINC90LUg0L/QvtC60LDQt9GL0LLQsNC10Lwg0L/QvtC70LUg0L/QvtC40YHQutCwXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNlbGVjdDIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0T25CbHVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd25Dc3NDbGFzczogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9SZXN1bHRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAn0KHQvtCy0L/QsNC00LXQvdC40Lkg0L3QtSDQvdCw0LnQtNC10L3Qvic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3Rg9C20L3QviDQtNC70Y8g0LLRi9C70LjQtNCw0YbQuNC4INC90LAg0LvQtdGC0YNcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZChgb3B0aW9uW3ZhbHVlPVwiJHskKHRoaXMpLmNvbnRleHQudmFsdWV9XCJdYCkuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnVwZGF0ZSA9IGZ1bmN0aW9uKCR1cGRhdGVFbGVtKSB7XG4gICAgICAgICAgICAkdXBkYXRlRWxlbS5zZWxlY3QyKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBzZWxmLmluaXQoJHVwZGF0ZUVsZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuaW5pdCgkZWxlbSk7XG4gICAgfTtcblxuICAgIHZhciBjdXN0b21TZWxlY3QgPSBuZXcgQ3VzdG9tU2VsZWN0KCQoJ3NlbGVjdCcpKTtcblxuICAgIGNvbnN0IGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgZGF0ZUZvcm1hdDogJ2RkLm1tLnl5JyxcbiAgICAgICAgc2hvd090aGVyTW9udGhzOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqINCU0LXQu9Cw0LXRgiDQstGL0L/QsNC00Y7RidC40LUg0LrQsNC70LXQvdC00LDRgNC40LrQuFxuICAgICAqIEBzZWUgIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL2RhdGVwaWNrZXIvXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vINCyIGRhdGEtZGF0ZS1taW4g0LggZGF0YS1kYXRlLW1heCDQvNC+0LbQvdC+INC30LDQtNCw0YLRjCDQtNCw0YLRgyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5XG4gICAgICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRhdGVJbnB1dFwiIGlkPVwiXCIgY2xhc3M9XCJqcy1kYXRlcGlja2VyXCIgZGF0YS1kYXRlLW1pbj1cIjA2LjExLjIwMTVcIiBkYXRhLWRhdGUtbWF4PVwiMTAuMTIuMjAxNVwiPlxuICAgICAqL1xuICAgIGxldCBEYXRlcGlja2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGVwaWNrZXIgPSAkKCcuanMtZGF0ZXBpY2tlcicpO1xuXG4gICAgICAgIGRhdGVwaWNrZXIuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgbWluRGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1taW4nKTtcbiAgICAgICAgICAgIGxldCBtYXhEYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1heCcpO1xuICAgICAgICAgICAgY29uc3Qgc2hvd01ZID0gJCh0aGlzKS5kYXRhKCdzaG93LW0teScpO1xuXG4gICAgICAgICAgICAvKiDQtdGB0LvQuCDQsiDQsNGC0YDQuNCx0YPRgtC1INGD0LrQsNC30LDQvdC+IGN1cnJlbnQsINGC0L4g0LLRi9Cy0L7QtNC40Lwg0YLQtdC60YPRidGD0Y4g0LTQsNGC0YMgKi9cbiAgICAgICAgICAgIGlmICggbWF4RGF0ZSA9PT0gJ2N1cnJlbnQnIHx8IG1pbkRhdGUgPT09ICdjdXJyZW50Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudERheSA9IGN1cnJlbnREYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF5IDwgMTAgPyBjdXJyZW50RGF5ID0gJzAnICsgY3VycmVudERheS50b1N0cmluZygpIDogY3VycmVudERheTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdEYXRlID0gY3VycmVudERheSArICcuJyArIChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSkgKyAnLicgKyBjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgICAgIG1heERhdGUgPT09ICdjdXJyZW50JyA/IG1heERhdGUgPSBuZXdEYXRlIDogbWluRGF0ZSA9IG5ld0RhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpdGVtT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlOiBtaW5EYXRlIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbWF4RGF0ZSB8fCBudWxsLFxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuZmllbGQnKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoc2hvd01ZKSB7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ2NoYW5nZVllYXInXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ3llYXJSYW5nZSddID0gJ2MtMTAwOmMnO1xuICAgICAgICAgICAgICAgIGl0ZW1PcHRpb25zWydjaGFuZ2VNb250aCddID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgaXRlbU9wdGlvbnMsIGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyk7XG5cbiAgICAgICAgICAgICQodGhpcykuZGF0ZXBpY2tlcihpdGVtT3B0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICAvLyDQtNC10LvQsNC10Lwg0LrRgNCw0YHQuNCy0YvQvCDRgdC10LvQtdC6INC80LXRgdGP0YbQsCDQuCDQs9C+0LTQsFxuICAgICAgICAgJChkb2N1bWVudCkub24oJ2ZvY3VzJywgJy5qcy1kYXRlcGlja2VyJywgKCkgPT4ge1xuICAgICAgICAgICAgLy8g0LjRgdC/0L7Qu9GM0LfRg9C10Lwg0LfQsNC00LXRgNC20LrRgywg0YfRgtC+0LHRiyDQtNC10LnRgtC/0LjQutC10YAg0YPRgdC/0LXQuyDQuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0YLRjNGB0Y9cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCQoJy51aS1kYXRlcGlja2VyJykuZmluZCgnc2VsZWN0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy51aS1kYXRlcGlja2VyJykuZmluZCgnc2VsZWN0Jykuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGxldCBkYXRlcGlja2VyID0gbmV3IERhdGVwaWNrZXIoKTtcblxuICAgIGNvbnN0ICRtb2JpbGVNZW51ID0gJCgnLmpzLW1vYmlsZS1tZW51Jyk7XG4gICAgY29uc3QgJGNhcnRNb2RhbCA9ICQoJy5qcy1jYXJ0LW1vZGFsJyk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLW1lbnUtYnRuJywgKCkgPT4ge1xuICAgICAgICBvcGVuTW9kYWwoJG1vYmlsZU1lbnUpO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1tZW51LWNsb3NlJywgKCkgPT4ge1xuICAgICAgICBoaWRlTW9kYWwoJG1vYmlsZU1lbnUpXG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNhcnQtYnRuJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBvcGVuTW9kYWwoJGNhcnRNb2RhbCk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWNhcnQtY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgIGhpZGVNb2RhbCgkY2FydE1vZGFsKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIE9wZW4gbW9kYWwgYmxvY2tcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJG1vZGFsQmxvY2sgTW9kYWwgYmxvY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvcGVuTW9kYWwoJG1vZGFsQmxvY2spIHtcbiAgICAgICAgJG1vZGFsQmxvY2suYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpLmFuaW1hdGVDc3MoJ3NsaWRlSW5SaWdodCcpO1xuICAgICAgICBsb2NrRG9jdW1lbnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIaWRlIG1vZGFsIGJsb2NrXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRtb2RhbEJsb2NrIE1vZGFsIGJsb2NrXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGlkZU1vZGFsKCRtb2RhbEJsb2NrKSB7XG4gICAgICAgICRtb2RhbEJsb2NrLmFuaW1hdGVDc3MoJ3NsaWRlT3V0UmlnaHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAkbW9kYWxCbG9jay5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICB1bmxvY2tEb2N1bWVudCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbmxvY2sgZG9jdW1lbnQgZm9yIHNjcm9sbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVubG9ja0RvY3VtZW50KCkge1xuICAgICAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ2lzLWxvY2tlZCcpO1xuICAgICAgICAvLyAuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvY2sgZG9jdW1lbnQgZm9yIHNjcm9sbFxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkbG9ja0Jsb2NrIEJsb2NrIHdoaWNoIGRlZmluZSBkb2N1bWVudCBoZWlnaHRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2NrRG9jdW1lbnQoKSB7XG4gICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtbG9ja2VkJyk7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQkNC90LjQvNCw0YbQuNGPINGN0LvQtdC80LXQvdGC0LAgbGFiZWwg0L/RgNC4INGE0L7QutGD0YHQtSDQv9C+0LvQtdC5INGE0L7RgNC80YtcbiAgICAgICAgICovXG4gICAgICAgICQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgY29uc3QgZmllbGQgPSAkKGVsKS5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKTtcblxuICAgICAgICAgICAgaWYgKCQoZmllbGQpLnZhbCgpLnRyaW0oKSAhPSAnJyB8fCAkKGZpZWxkKS5pcygnOnBsYWNlaG9sZGVyLXNob3duJykpIHtcbiAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoZmllbGQpLm9uKCdmb2N1cycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xuICAgICAgICAgICAgfSkub24oJ2JsdXInLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLnRyaW0oKSA9PT0gJycgJiYgISQoZmllbGQpLmlzKCc6cGxhY2Vob2xkZXItc2hvd24nKSkge1xuICAgICAgICAgICAgICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qIEBzZWUgaHR0cHM6Ly9hdG9taWtzLmdpdGh1Yi5pby90aXBweWpzLyAqL1xuXG4gICAgY29uc3QgdG9vbHRpcFNldHRpbmdzID0ge1xuICAgICAgICBhcnJvdzogZmFsc2UsXG4gICAgICAgIGFsbG93SFRNTDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGVGaWxsOiBmYWxzZSxcbiAgICAgICAgcGxhY2VtZW50OiAncmlnaHQtY2VudGVyJyxcbiAgICAgICAgZGlzdGFuY2U6IDIwLFxuICAgICAgICB0aGVtZTogJ3Rvb2x0aXAnXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIGluaXQgYWxsIHRvb2x0aXBzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdFRvb2x0aXBzKCkge1xuICAgICAgICAkKCdbZGF0YS10b29sdGlwXScpLmVhY2goKGluZGV4LCBlbGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsb2NhbFNldHRpbmdzID0ge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICQoZWxlbSkuYXR0cignZGF0YS10b29sdGlwJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKGVsZW0pLmRhdGEoJ2NsaWNrJykpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFNldHRpbmdzWyd0cmlnZ2VyJ10gPSAnY2xpY2sga2V5dXAnO1xuICAgICAgICAgICAgICAgIGxvY2FsU2V0dGluZ3NbJ2ludGVyYWN0aXZlJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aXBweShlbGVtLCBPYmplY3QuYXNzaWduKHt9LCB0b29sdGlwU2V0dGluZ3MsIGxvY2FsU2V0dGluZ3MpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFRvb2x0aXBzKCk7XG5cbjtcbn0pO1xuIl0sImZpbGUiOiJpbnRlcm5hbC5qcyJ9

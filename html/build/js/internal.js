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
      } else if ($element.closest('.js-datepicker-range').length) {
        $container = $element.closest('.js-datepicker-range').next('.errors-placement');
      } else if ($element.attr('name') == 'is_recaptcha_success') {
        $container = $element.parent().next('.g-recaptcha').next('.errors-placement');
      }

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
  $(document).on('click', '.js-menu-btn', function () {
    $mobileMenu.addClass('is-active').animateCss('slideInRight');
    $('body').addClass('is-locked').css('height', $mobileMenu.outerHeight() + 'px');
  });
  $(document).on('click', '.js-menu-close', function () {
    $mobileMenu.animateCss('slideOutRight', function () {
      $mobileMenu.removeClass('is-active');
      $('body').removeClass('is-locked').css('height', 'auto');
    });
  });
  /* @see https://atomiks.github.io/tippyjs/ */

  var tooltipSettings = {
    arrow: true,
    allowHTML: true,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wTGdTaXplIiwiZGVza3RvcE1kU2l6ZSIsImRlc2t0b3BTaXplIiwiZGVza3RvcFNtU2l6ZSIsInRhYmxldExnU2l6ZSIsInRhYmxldFNpemUiLCJtb2JpbGVMZ1NpemUiLCJtb2JpbGVTaXplIiwibGFuZyIsImF0dHIiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnREZXNrdG9wTGciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYnJlYWtwb2ludERlc2t0b3BNZCIsImJyZWFrcG9pbnREZXNrdG9wIiwiYnJlYWtwb2ludERlc2t0b3BTbSIsImJyZWFrcG9pbnRUYWJsZXRMZyIsImJyZWFrcG9pbnRUYWJsZXQiLCJicmVha3BvaW50TW9iaWxlTGdTaXplIiwiYnJlYWtwb2ludE1vYmlsZSIsImV4dGVuZCIsImxvYWQiLCJsZW5ndGgiLCJhdXRvc2l6ZSIsImZuIiwiYW5pbWF0ZUNzcyIsImFuaW1hdGlvbk5hbWUiLCJjYWxsYmFjayIsImFuaW1hdGlvbkVuZCIsImVsIiwiYW5pbWF0aW9ucyIsImFuaW1hdGlvbiIsIk9BbmltYXRpb24iLCJNb3pBbmltYXRpb24iLCJXZWJraXRBbmltYXRpb24iLCJ0Iiwic3R5bGUiLCJ1bmRlZmluZWQiLCJjcmVhdGVFbGVtZW50IiwiYWRkQ2xhc3MiLCJvbmUiLCJyZW1vdmVDbGFzcyIsImlzTnVtZXJpYyIsIm4iLCJpc05hTiIsInBhcnNlRmxvYXQiLCJpc0Zpbml0ZSIsInJlbW92ZU5vdERpZ2l0cyIsInBhcmFtIiwidG9TdHJpbmciLCJyZXBsYWNlIiwiZGl2aWRlQnlEaWdpdHMiLCJsb2NhbGUiLCJQYXJzbGV5Iiwic2V0TG9jYWxlIiwib3B0aW9ucyIsInRyaWdnZXIiLCJ2YWxpZGF0aW9uVGhyZXNob2xkIiwiZXJyb3JzV3JhcHBlciIsImVycm9yVGVtcGxhdGUiLCJjbGFzc0hhbmRsZXIiLCJpbnN0YW5jZSIsIiRlbGVtZW50IiwidHlwZSIsIiRoYW5kbGVyIiwiaGFzQ2xhc3MiLCJuZXh0IiwiZXJyb3JzQ29udGFpbmVyIiwiJGNvbnRhaW5lciIsImNsb3Nlc3QiLCJwYXJlbnQiLCJhZGRWYWxpZGF0b3IiLCJ2YWxpZGF0ZVN0cmluZyIsInZhbHVlIiwidGVzdCIsIm1lc3NhZ2VzIiwicnUiLCJlbiIsInJlZ1Rlc3QiLCJyZWdNYXRjaCIsIm1pbiIsImFyZ3VtZW50cyIsImRhdGEiLCJtYXgiLCJtaW5EYXRlIiwibWF4RGF0ZSIsInZhbHVlRGF0ZSIsInJlc3VsdCIsIm1hdGNoIiwiRGF0ZSIsIm1heFNpemUiLCJwYXJzbGV5SW5zdGFuY2UiLCJmaWxlcyIsInNpemUiLCJyZXF1aXJlbWVudFR5cGUiLCJmb3JtYXRzIiwiZmlsZUV4dGVuc2lvbiIsInNwbGl0IiwicG9wIiwiZm9ybWF0c0FyciIsInZhbGlkIiwiaSIsIm9uIiwiJGJsb2NrIiwiJGxhc3QiLCJhZnRlciIsImVsZW1lbnQiLCJwYXJzbGV5IiwiaW5wdXRtYXNrIiwiY2xlYXJNYXNrT25Mb3N0Rm9jdXMiLCJzaG93TWFza09uSG92ZXIiLCJDdXN0b21TZWxlY3QiLCIkZWxlbSIsInNlbGYiLCJpbml0IiwiJGluaXRFbGVtIiwiZWFjaCIsInNlbGVjdFNlYXJjaCIsIm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIiwiSW5maW5pdHkiLCJzZWxlY3QyIiwic2VsZWN0T25CbHVyIiwiZHJvcGRvd25Dc3NDbGFzcyIsImxhbmd1YWdlIiwibm9SZXN1bHRzIiwiZSIsImZpbmQiLCJjb250ZXh0IiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbVNlbGVjdCIsImRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyIsImRhdGVGb3JtYXQiLCJzaG93T3RoZXJNb250aHMiLCJEYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsInNob3dNWSIsImN1cnJlbnREYXRlIiwiY3VycmVudERheSIsImdldERhdGUiLCJuZXdEYXRlIiwiZ2V0TW9udGgiLCJnZXRGdWxsWWVhciIsIml0ZW1PcHRpb25zIiwib25TZWxlY3QiLCJjaGFuZ2UiLCJzZXRUaW1lb3V0IiwiJG1vYmlsZU1lbnUiLCJjc3MiLCJvdXRlckhlaWdodCIsInRvb2x0aXBTZXR0aW5ncyIsImFycm93IiwiYWxsb3dIVE1MIiwidGhlbWUiLCJpbml0VG9vbHRpcHMiLCJpbmRleCIsImVsZW0iLCJsb2NhbFNldHRpbmdzIiwiY29udGVudCIsInRpcHB5IiwiT2JqZWN0IiwiYXNzaWduIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZQyxLQUFaLENBQWtCLFlBQVc7QUFDekI7OztBQUdBLE1BQUlDLGFBQWEsR0FBRztBQUNoQjtBQUNBQyxJQUFBQSxJQUFJLEVBQUcsR0FGUztBQUloQjtBQUNBQyxJQUFBQSxhQUFhLEVBQUcsSUFMQTtBQU1oQkMsSUFBQUEsYUFBYSxFQUFHLElBTkE7QUFPaEJDLElBQUFBLFdBQVcsRUFBSyxJQVBBO0FBUWhCQyxJQUFBQSxhQUFhLEVBQUcsSUFSQTtBQVNoQkMsSUFBQUEsWUFBWSxFQUFJLElBVEE7QUFVaEJDLElBQUFBLFVBQVUsRUFBTSxHQVZBO0FBV2hCQyxJQUFBQSxZQUFZLEVBQUksR0FYQTtBQVloQkMsSUFBQUEsVUFBVSxFQUFNLEdBWkE7QUFlaEI7QUFDQTtBQUVBQyxJQUFBQSxJQUFJLEVBQUViLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVWMsSUFBVixDQUFlLE1BQWY7QUFsQlUsR0FBcEIsQ0FKeUIsQ0F5QnpCO0FBQ0E7O0FBQ0EsTUFBTUMsV0FBVyxHQUFHO0FBQ2hCQyxJQUFBQSxtQkFBbUIsRUFBRUMsTUFBTSxDQUFDQyxVQUFQLHVCQUFpQ2YsYUFBYSxDQUFDRSxhQUFkLEdBQThCLENBQS9ELFNBREw7QUFFaEJjLElBQUFBLG1CQUFtQixFQUFFRixNQUFNLENBQUNDLFVBQVAsdUJBQWlDZixhQUFhLENBQUNHLGFBQWQsR0FBOEIsQ0FBL0QsU0FGTDtBQUdoQmMsSUFBQUEsaUJB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QUUsSUFGUztBQUdwQkMsSUFBQUEsS0FBSyxFQUFFO0FBR1g7Ozs7QUFOd0IsR0FBeEI7O0FBU0EsV0FBU0MsWUFBVCxHQUF3QjtBQUNwQmpLLElBQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CMEgsSUFBcEIsQ0FBeUIsVUFBQ3dDLEtBQUQsRUFBUUMsSUFBUixFQUFpQjtBQUN0QyxVQUFNQyxhQUFhLEdBQUc7QUFDbEJDLFFBQUFBLE9BQU8sRUFBRXJLLENBQUMsQ0FBQ21LLElBQUQsQ0FBRCxDQUFRckosSUFBUixDQUFhLGNBQWI7QUFEUyxPQUF0Qjs7QUFHQSxVQUFJZCxDQUFDLENBQUNtSyxJQUFELENBQUQsQ0FBUTNFLElBQVIsQ0FBYSxPQUFiLENBQUosRUFBMkI7QUFDdkI0RSxRQUFBQSxhQUFhLENBQUMsU0FBRCxDQUFiLEdBQTJCLGFBQTNCO0FBQ0FBLFFBQUFBLGFBQWEsQ0FBQyxhQUFELENBQWIsR0FBK0IsSUFBL0I7QUFDSDs7QUFFREUsTUFBQUEsS0FBSyxDQUFDSCxJQUFELEVBQU9JLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JYLGVBQWxCLEVBQW1DTyxhQUFuQyxDQUFQLENBQUw7QUFDSCxLQVZEO0FBV0g7O0FBRURILEVBQUFBLFlBQVk7QUFFaEI7QUFDQyxDQTVpQkQiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiDQk9C70L7QsdCw0LvRjNC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtSwg0LrQvtGC0L7RgNGL0LUg0LjRgdC/0L7Qu9GM0LfRg9GO0YLRgdGPINC80L3QvtCz0L7QutGA0LDRgtC90L5cbiAgICAgKi9cbiAgICBsZXQgZ2xvYmFsT3B0aW9ucyA9IHtcbiAgICAgICAgLy8g0JLRgNC10LzRjyDQtNC70Y8g0LDQvdC40LzQsNGG0LjQuVxuICAgICAgICB0aW1lOiAgMjAwLFxuXG4gICAgICAgIC8vINCa0L7QvdGC0YDQvtC70YzQvdGL0LUg0YLQvtGH0LrQuCDQsNC00LDQv9GC0LjQstCwXG4gICAgICAgIGRlc2t0b3BMZ1NpemU6ICAxOTEwLFxuICAgICAgICBkZXNrdG9wTWRTaXplOiAgMTYwMCxcbiAgICAgICAgZGVza3RvcFNpemU6ICAgIDE0ODAsXG4gICAgICAgIGRlc2t0b3BTbVNpemU6ICAxMjgwLFxuICAgICAgICB0YWJsZXRMZ1NpemU6ICAgMTAyNCxcbiAgICAgICAgdGFibGV0U2l6ZTogICAgIDc2OCxcbiAgICAgICAgbW9iaWxlTGdTaXplOiAgIDY0MCxcbiAgICAgICAgbW9iaWxlU2l6ZTogICAgIDQ4MCxcblxuXG4gICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAgdG91Y2gg0YPRgdGC0YDQvtC50YHRgtCyXG4gICAgICAgIC8vIGlzVG91Y2g6ICQuYnJvd3Nlci5tb2JpbGUsXG5cbiAgICAgICAgbGFuZzogJCgnaHRtbCcpLmF0dHIoJ2xhbmcnKVxuICAgIH07XG5cbiAgICAvLyDQkdGA0LXQudC60L/QvtC40L3RgtGLINCw0LTQsNC/0YLQuNCy0LBcbiAgICAvLyBAZXhhbXBsZSBpZiAoZ2xvYmFsT3B0aW9ucy5icmVha3BvaW50VGFibGV0Lm1hdGNoZXMpIHt9IGVsc2Uge31cbiAgICBjb25zdCBicmVha3BvaW50cyA9IHtcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wTGdTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BNZDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wTWRTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3A6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50RGVza3RvcFNtOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BTbVNpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50VGFibGV0TGc6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMudGFibGV0TGdTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludFRhYmxldDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludE1vYmlsZUxnU2l6ZTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5tb2JpbGVMZ1NpemUgLSAxfXB4KWApLFxuICAgICAgICBicmVha3BvaW50TW9iaWxlOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLm1vYmlsZVNpemUgLSAxfXB4KWApXG4gICAgfTtcblxuICAgICQuZXh0ZW5kKHRydWUsIGdsb2JhbE9wdGlvbnMsIGJyZWFrcG9pbnRzKTtcblxuXG5cblxuICAgICQod2luZG93KS5sb2FkKCgpID0+IHtcbiAgICAgICAgLy8gY29uc3QgeyBuYW1lIH0gPSAkLmJyb3dzZXI7XG5cbiAgICAgICAgLy8gaWYgKG5hbWUpIHtcbiAgICAgICAgLy8gICAgICQoJ2h0bWwnKS5hZGRDbGFzcyhgYnJvd3Nlci0ke25hbWV9YCk7XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyBpZiAoZ2xvYmFsT3B0aW9ucy5pc1RvdWNoKSB7XG4gICAgICAgIC8vICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ3RvdWNoJykucmVtb3ZlQ2xhc3MoJ25vLXRvdWNoJyk7XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ25vLXRvdWNoJykucmVtb3ZlQ2xhc3MoJ3RvdWNoJyk7XG4gICAgICAgIC8vIH1cblxuICAgICAgICBpZiAoJCgndGV4dGFyZWEnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhdXRvc2l6ZSgkKCd0ZXh0YXJlYScpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LTQutC70Y7Rh9C10L3QuNC1IGpzIHBhcnRpYWxzXG4gICAgICovXG4gICAgLyoqXG4gKiDQoNCw0YHRiNC40YDQtdC90LjQtSBhbmltYXRlLmNzc1xuICogQHBhcmFtICB7U3RyaW5nfSBhbmltYXRpb25OYW1lINC90LDQt9Cy0LDQvdC40LUg0LDQvdC40LzQsNGG0LjQuFxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrINGE0YPQvdC60YbQuNGPLCDQutC+0YLQvtGA0LDRjyDQvtGC0YDQsNCx0L7RgtCw0LXRgiDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcbiAqIEByZXR1cm4ge09iamVjdH0g0L7QsdGK0LXQutGCINCw0L3QuNC80LDRhtC40LhcbiAqIFxuICogQHNlZSAgaHR0cHM6Ly9kYW5lZGVuLmdpdGh1Yi5pby9hbmltYXRlLmNzcy9cbiAqIFxuICogQGV4YW1wbGVcbiAqICQoJyN5b3VyRWxlbWVudCcpLmFuaW1hdGVDc3MoJ2JvdW5jZScpO1xuICogXG4gKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnLCBmdW5jdGlvbigpIHtcbiAqICAgICAvLyDQlNC10LvQsNC10Lwg0YfRgtC+LdGC0L4g0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XG4gKiB9KTtcbiAqL1xuJC5mbi5leHRlbmQoe1xuICAgIGFuaW1hdGVDc3M6IGZ1bmN0aW9uKGFuaW1hdGlvbk5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBhbmltYXRpb25FbmQgPSAoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25zID0ge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ2FuaW1hdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgT0FuaW1hdGlvbjogJ29BbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgICAgIE1vekFuaW1hdGlvbjogJ21vekFuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgV2Via2l0QW5pbWF0aW9uOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciAobGV0IHQgaW4gYW5pbWF0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25zW3RdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuXG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb25OYW1lKS5vbmUoYW5pbWF0aW9uRW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb25OYW1lKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSk7XG4gICAgLy8g0J3QtdCx0L7Qu9GM0YjQuNC1INCy0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvQtSDRhNGD0L3QutGG0LjQuFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0Y/QtdGCINGH0LjRgdC70L4g0LjQu9C4INC90LXRglxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSBuINCb0Y7QsdC+0Lkg0LDRgNCz0YPQvNC10L3RglxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzTnVtZXJpYyhuKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9GP0LXRgiDQstGB0LUg0L3QtdGH0LjRgdC70L7QstGL0LUg0YHQuNC80LLQvtC70Ysg0Lgg0L/RgNC40LLQvtC00LjRgiDQuiDRh9C40YHQu9GDXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cnxudW1iZXJ9IHBhcmFtXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZW1vdmVOb3REaWdpdHMocGFyYW0pIHtcbiAgICAgICAgLyog0YPQtNCw0LvRj9C10Lwg0LLRgdC1INGB0LjQvNCy0L7Qu9GLINC60YDQvtC80LUg0YbQuNGE0YAg0Lgg0L/QtdGA0LXQstC+0LTQuNC8INCyINGH0LjRgdC70L4gKi9cbiAgICAgICAgcmV0dXJuICtwYXJhbS50b1N0cmluZygpLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0KDQsNC30LTQtdC70Y/QtdGCINC90LAg0YDQsNC30YDRj9C00YtcbiAgICAgKiDQndCw0L/RgNC40LzQtdGALCAzODAwMDAwIC0+IDMgODAwIDAwMFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJ8bnVtYmVyfSBwYXJhbVxuICAgICAqIEByZXR1cm5zIHtzdHJ9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZGl2aWRlQnlEaWdpdHMocGFyYW0pIHtcbiAgICAgICAgaWYgKHBhcmFtID09PSBudWxsKSBwYXJhbSA9IDA7XG4gICAgICAgIHJldHVybiBwYXJhbS50b1N0cmluZygpLnJlcGxhY2UoLyhcXGQpKD89KFxcZFxcZFxcZCkrKFteXFxkXXwkKSkvZywgJyQxICcpO1xuICAgIH1cblxuICAgIHZhciBsb2NhbGUgPSBnbG9iYWxPcHRpb25zLmxhbmcgPT0gJ3J1LVJVJyA/ICdydScgOiAnZW4nO1xuXG4gICAgUGFyc2xleS5zZXRMb2NhbGUobG9jYWxlKTtcblxuICAgIC8qINCd0LDRgdGC0YDQvtC50LrQuCBQYXJzbGV5ICovXG4gICAgJC5leHRlbmQoUGFyc2xleS5vcHRpb25zLCB7XG4gICAgICAgIHRyaWdnZXI6ICdibHVyIGNoYW5nZScsIC8vIGNoYW5nZSDQvdGD0LbQtdC9INC00LvRjyBzZWxlY3Qn0LBcbiAgICAgICAgdmFsaWRhdGlvblRocmVzaG9sZDogJzAnLFxuICAgICAgICBlcnJvcnNXcmFwcGVyOiAnPGRpdj48L2Rpdj4nLFxuICAgICAgICBlcnJvclRlbXBsYXRlOiAnPHAgY2xhc3M9XCJwYXJzbGV5LWVycm9yLW1lc3NhZ2VcIj48L3A+JyxcbiAgICAgICAgY2xhc3NIYW5kbGVyOiBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSBpbnN0YW5jZS4kZWxlbWVudDtcbiAgICAgICAgICAgIGxldCB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxuICAgICAgICAgICAgICAgICRoYW5kbGVyO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICAgICAkaGFuZGxlciA9ICRlbGVtZW50OyAvLyDRgtC+INC10YHRgtGMINC90LjRh9C10LPQviDQvdC1INCy0YvQtNC10LvRj9C10LwgKGlucHV0INGB0LrRgNGL0YIpLCDQuNC90LDRh9C1INCy0YvQtNC10LvRj9C10YIg0YDQvtC00LjRgtC10LvRjNGB0LrQuNC5INCx0LvQvtC6XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkKCcuc2VsZWN0Mi1zZWxlY3Rpb24tLXNpbmdsZScsICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gJGhhbmRsZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yc0NvbnRhaW5lcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09ICdmaWxlJykge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5jbG9zZXN0KCcuY3VzdG9tLWZpbGUnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpID09ICdpc19yZWNhcHRjaGFfc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQucGFyZW50KCkubmV4dCgnLmctcmVjYXB0Y2hhJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICRjb250YWluZXI7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCa0LDRgdGC0L7QvNC90YvQtSDQstCw0LvQuNC00LDRgtC+0YDRi1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lUnUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWVFbicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosIFwiIFwiLCBcIi1cIidcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiyDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlclJ1Jywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlswLTnQsC3Rj9GRXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCAwLTknXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLLCDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXInLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXowLTldKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05J1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC10LvQtdGE0L7QvdC90YvQuSDQvdC+0LzQtdGAXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ3Bob25lJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlstKzAtOSgpIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0YLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgCcsXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBwaG9uZSBudW1iZXInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bWJlcicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bMC05XSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIDAtOSdcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0J/QvtGH0YLQsCDQsdC10Lcg0LrQuNGA0LjQu9C70LjRhtGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2VtYWlsJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXihbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0oXFwufF98LSl7MCwxfSkrW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dXFxAKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSkrKChcXC4pezAsMX1bQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pezEsfVxcLlthLXrQsC3RjzAtOVxcLV17Mix9JC8udGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9C+0YfRgtC+0LLRi9C5INCw0LTRgNC10YEnLFxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZW1haWwgYWRkcmVzcydcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KTQvtGA0LzQsNGCINC00LDRgtGLIERELk1NLllZWVlcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZGF0ZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgcmVnVGVzdCA9IC9eKD86KD86MzEoXFwuKSg/OjA/WzEzNTc4XXwxWzAyXSkpXFwxfCg/Oig/OjI5fDMwKShcXC4pKD86MD9bMSwzLTldfDFbMC0yXSlcXDIpKSg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezJ9KSR8Xig/OjI5KFxcLikwPzJcXDMoPzooPzooPzoxWzYtOV18WzItOV1cXGQpPyg/OjBbNDhdfFsyNDY4XVswNDhdfFsxMzU3OV1bMjZdKXwoPzooPzoxNnxbMjQ2OF1bMDQ4XXxbMzU3OV1bMjZdKTAwKSkpKSR8Xig/OjA/WzEtOV18MVxcZHwyWzAtOF0pKFxcLikoPzooPzowP1sxLTldKXwoPzoxWzAtMl0pKVxcNCg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezR9KSQvLFxuICAgICAgICAgICAgICAgIHJlZ01hdGNoID0gLyhcXGR7MSwyfSlcXC4oXFxkezEsMn0pXFwuKFxcZHs0fSkvLFxuICAgICAgICAgICAgICAgIG1pbiA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWluJyksXG4gICAgICAgICAgICAgICAgbWF4ID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNYXgnKSxcbiAgICAgICAgICAgICAgICBtaW5EYXRlLCBtYXhEYXRlLCB2YWx1ZURhdGUsIHJlc3VsdDtcblxuICAgICAgICAgICAgaWYgKG1pbiAmJiAocmVzdWx0ID0gbWluLm1hdGNoKHJlZ01hdGNoKSkpIHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF4ICYmIChyZXN1bHQgPSBtYXgubWF0Y2gocmVnTWF0Y2gpKSkge1xuICAgICAgICAgICAgICAgIG1heERhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQgPSB2YWx1ZS5tYXRjaChyZWdNYXRjaCkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZURhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlZ1Rlc3QudGVzdCh2YWx1ZSkgJiYgKG1pbkRhdGUgPyB2YWx1ZURhdGUgPj0gbWluRGF0ZSA6IHRydWUpICYmIChtYXhEYXRlID8gdmFsdWVEYXRlIDw9IG1heERhdGUgOiB0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3QsNGPINC00LDRgtCwJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGRhdGUnXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLy8g0KTQsNC50Lsg0L7Qs9GA0LDQvdC40YfQtdC90L3QvtCz0L4g0YDQsNC30LzQtdGA0LBcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZU1heFNpemUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgbWF4U2l6ZSwgcGFyc2xleUluc3RhbmNlKSB7XG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBwYXJzbGV5SW5zdGFuY2UuJGVsZW1lbnRbMF0uZmlsZXM7XG4gICAgICAgICAgICByZXR1cm4gZmlsZXMubGVuZ3RoICE9IDEgIHx8IGZpbGVzWzBdLnNpemUgPD0gbWF4U2l6ZSAqIDEwMjQ7XG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVtZW50VHlwZTogJ2ludGVnZXInLFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQpNCw0LnQuyDQtNC+0LvQttC10L0g0LLQtdGB0LjRgtGMINC90LUg0LHQvtC70LXQtSwg0YfQtdC8ICVzIEtiJyxcbiAgICAgICAgICAgIGVuOiAnRmlsZSBzaXplIGNhblxcJ3QgYmUgbW9yZSB0aGVuICVzIEtiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQntCz0YDQsNC90LjRh9C10L3QuNGPINGA0LDRgdGI0LjRgNC10L3QuNC5INGE0LDQudC70L7QslxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlRXh0ZW5zaW9uJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIGZvcm1hdHMpIHtcbiAgICAgICAgICAgIGxldCBmaWxlRXh0ZW5zaW9uID0gdmFsdWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgICAgIGxldCBmb3JtYXRzQXJyID0gZm9ybWF0cy5zcGxpdCgnLCAnKTtcbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcm1hdHNBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZUV4dGVuc2lvbiA9PT0gZm9ybWF0c0FycltpXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQlNC+0L/Rg9GB0YLQuNC80Ysg0YLQvtC70YzQutC+INGE0LDQudC70Ysg0YTQvtGA0LzQsNGC0LAgJXMnLFxuICAgICAgICAgICAgZW46ICdBdmFpbGFibGUgZXh0ZW5zaW9ucyBhcmUgJXMnXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCh0L7Qt9C00LDRkdGCINC60L7QvdGC0LXQudC90LXRgNGLINC00LvRjyDQvtGI0LjQsdC+0Log0YMg0L3QtdGC0LjQv9C40YfQvdGL0YUg0Y3Qu9C10LzQtdC90YLQvtCyXG4gICAgUGFyc2xleS5vbignZmllbGQ6aW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgJGVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICAgICAgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICRibG9jayA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdlcnJvcnMtcGxhY2VtZW50JyksXG4gICAgICAgICAgICAkbGFzdDtcblxuICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCY0L3QuNGG0LjQuNGA0YPQtdGCINCy0LDQu9C40LTQsNGG0LjRjiDQvdCwINCy0YLQvtGA0L7QvCDQutCw0LvQtdC00LDRgNC90L7QvCDQv9C+0LvQtSDQtNC40LDQv9Cw0LfQvtC90LBcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDp2YWxpZGF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgJCgnZm9ybVtkYXRhLXZhbGlkYXRlPVwidHJ1ZVwiXScpLnBhcnNsZXkoKTtcbiAgICAvKipcbiAgICAgKiDQlNC+0LHQsNCy0LvRj9C10YIg0LzQsNGB0LrQuCDQsiDQv9C+0LvRjyDRhNC+0YDQvFxuICAgICAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9Sb2JpbkhlcmJvdHMvSW5wdXRtYXNrXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxpbnB1dCBjbGFzcz1cImpzLXBob25lLW1hc2tcIiB0eXBlPVwidGVsXCIgbmFtZT1cInRlbFwiIGlkPVwidGVsXCI+XG4gICAgICovXG4gICAgJCgnLmpzLXBob25lLW1hc2snKS5pbnB1dG1hc2soJys3KDk5OSkgOTk5LTk5LTk5Jywge1xuICAgICAgICBjbGVhck1hc2tPbkxvc3RGb2N1czogdHJ1ZSxcbiAgICAgICAgc2hvd01hc2tPbkhvdmVyOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog0KHRgtC40LvQuNC30YPQtdGCINGB0LXQu9C10LrRgtGLINGBINC/0L7QvNC+0YnRjNGOINC/0LvQsNCz0LjQvdCwIHNlbGVjdDJcbiAgICAgKiBodHRwczovL3NlbGVjdDIuZ2l0aHViLmlvXG4gICAgICovXG4gICAgbGV0IEN1c3RvbVNlbGVjdCA9IGZ1bmN0aW9uKCRlbGVtKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLmluaXQgPSBmdW5jdGlvbigkaW5pdEVsZW0pIHtcbiAgICAgICAgICAgICRpbml0RWxlbS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RTZWFyY2ggPSAkKHRoaXMpLmRhdGEoJ3NlYXJjaCcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdFNlYXJjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSAxOyAvLyDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gSW5maW5pdHk7IC8vINC90LUg0L/QvtC60LDQt9GL0LLQsNC10Lwg0L/QvtC70LUg0L/QvtC40YHQutCwXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNlbGVjdDIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0T25CbHVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd25Dc3NDbGFzczogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9SZXN1bHRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAn0KHQvtCy0L/QsNC00LXQvdC40Lkg0L3QtSDQvdCw0LnQtNC10L3Qvic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3Rg9C20L3QviDQtNC70Y8g0LLRi9C70LjQtNCw0YbQuNC4INC90LAg0LvQtdGC0YNcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZChgb3B0aW9uW3ZhbHVlPVwiJHskKHRoaXMpLmNvbnRleHQudmFsdWV9XCJdYCkuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnVwZGF0ZSA9IGZ1bmN0aW9uKCR1cGRhdGVFbGVtKSB7XG4gICAgICAgICAgICAkdXBkYXRlRWxlbS5zZWxlY3QyKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBzZWxmLmluaXQoJHVwZGF0ZUVsZW0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuaW5pdCgkZWxlbSk7XG4gICAgfTtcblxuICAgIHZhciBjdXN0b21TZWxlY3QgPSBuZXcgQ3VzdG9tU2VsZWN0KCQoJ3NlbGVjdCcpKTtcblxuICAgIGNvbnN0IGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgZGF0ZUZvcm1hdDogJ2RkLm1tLnl5JyxcbiAgICAgICAgc2hvd090aGVyTW9udGhzOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqINCU0LXQu9Cw0LXRgiDQstGL0L/QsNC00Y7RidC40LUg0LrQsNC70LXQvdC00LDRgNC40LrQuFxuICAgICAqIEBzZWUgIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL2RhdGVwaWNrZXIvXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vINCyIGRhdGEtZGF0ZS1taW4g0LggZGF0YS1kYXRlLW1heCDQvNC+0LbQvdC+INC30LDQtNCw0YLRjCDQtNCw0YLRgyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5XG4gICAgICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRhdGVJbnB1dFwiIGlkPVwiXCIgY2xhc3M9XCJqcy1kYXRlcGlja2VyXCIgZGF0YS1kYXRlLW1pbj1cIjA2LjExLjIwMTVcIiBkYXRhLWRhdGUtbWF4PVwiMTAuMTIuMjAxNVwiPlxuICAgICAqL1xuICAgIGxldCBEYXRlcGlja2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGVwaWNrZXIgPSAkKCcuanMtZGF0ZXBpY2tlcicpO1xuXG4gICAgICAgIGRhdGVwaWNrZXIuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgbWluRGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1taW4nKTtcbiAgICAgICAgICAgIGxldCBtYXhEYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1heCcpO1xuICAgICAgICAgICAgY29uc3Qgc2hvd01ZID0gJCh0aGlzKS5kYXRhKCdzaG93LW0teScpO1xuXG4gICAgICAgICAgICAvKiDQtdGB0LvQuCDQsiDQsNGC0YDQuNCx0YPRgtC1INGD0LrQsNC30LDQvdC+IGN1cnJlbnQsINGC0L4g0LLRi9Cy0L7QtNC40Lwg0YLQtdC60YPRidGD0Y4g0LTQsNGC0YMgKi9cbiAgICAgICAgICAgIGlmICggbWF4RGF0ZSA9PT0gJ2N1cnJlbnQnIHx8IG1pbkRhdGUgPT09ICdjdXJyZW50Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudERheSA9IGN1cnJlbnREYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF5IDwgMTAgPyBjdXJyZW50RGF5ID0gJzAnICsgY3VycmVudERheS50b1N0cmluZygpIDogY3VycmVudERheTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdEYXRlID0gY3VycmVudERheSArICcuJyArIChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSkgKyAnLicgKyBjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgICAgIG1heERhdGUgPT09ICdjdXJyZW50JyA/IG1heERhdGUgPSBuZXdEYXRlIDogbWluRGF0ZSA9IG5ld0RhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpdGVtT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlOiBtaW5EYXRlIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbWF4RGF0ZSB8fCBudWxsLFxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuZmllbGQnKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoc2hvd01ZKSB7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ2NoYW5nZVllYXInXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ3llYXJSYW5nZSddID0gJ2MtMTAwOmMnO1xuICAgICAgICAgICAgICAgIGl0ZW1PcHRpb25zWydjaGFuZ2VNb250aCddID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgaXRlbU9wdGlvbnMsIGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyk7XG5cbiAgICAgICAgICAgICQodGhpcykuZGF0ZXBpY2tlcihpdGVtT3B0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICAvLyDQtNC10LvQsNC10Lwg0LrRgNCw0YHQuNCy0YvQvCDRgdC10LvQtdC6INC80LXRgdGP0YbQsCDQuCDQs9C+0LTQsFxuICAgICAgICAgJChkb2N1bWVudCkub24oJ2ZvY3VzJywgJy5qcy1kYXRlcGlja2VyJywgKCkgPT4ge1xuICAgICAgICAgICAgLy8g0LjRgdC/0L7Qu9GM0LfRg9C10Lwg0LfQsNC00LXRgNC20LrRgywg0YfRgtC+0LHRiyDQtNC10LnRgtC/0LjQutC10YAg0YPRgdC/0LXQuyDQuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0YLRjNGB0Y9cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCQoJy51aS1kYXRlcGlja2VyJykuZmluZCgnc2VsZWN0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy51aS1kYXRlcGlja2VyJykuZmluZCgnc2VsZWN0Jykuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGxldCBkYXRlcGlja2VyID0gbmV3IERhdGVwaWNrZXIoKTtcblxuICAgIGNvbnN0ICRtb2JpbGVNZW51ID0gJCgnLmpzLW1vYmlsZS1tZW51Jyk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLW1lbnUtYnRuJywgKCkgPT4ge1xuICAgICAgICAkbW9iaWxlTWVudS5hZGRDbGFzcygnaXMtYWN0aXZlJykuYW5pbWF0ZUNzcygnc2xpZGVJblJpZ2h0Jyk7XG4gICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtbG9ja2VkJykuY3NzKCdoZWlnaHQnLCAkbW9iaWxlTWVudS5vdXRlckhlaWdodCgpICsgJ3B4Jyk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLW1lbnUtY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgICRtb2JpbGVNZW51LmFuaW1hdGVDc3MoJ3NsaWRlT3V0UmlnaHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAkbW9iaWxlTWVudS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLWxvY2tlZCcpLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvKiBAc2VlIGh0dHBzOi8vYXRvbWlrcy5naXRodWIuaW8vdGlwcHlqcy8gKi9cblxuICAgIGNvbnN0IHRvb2x0aXBTZXR0aW5ncyA9IHtcbiAgICAgICAgYXJyb3c6IHRydWUsXG4gICAgICAgIGFsbG93SFRNTDogdHJ1ZSxcbiAgICAgICAgdGhlbWU6ICd0b29sdGlwJ1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBpbml0IGFsbCB0b29sdGlwc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXRUb29sdGlwcygpIHtcbiAgICAgICAgJCgnW2RhdGEtdG9vbHRpcF0nKS5lYWNoKChpbmRleCwgZWxlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbG9jYWxTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAkKGVsZW0pLmF0dHIoJ2RhdGEtdG9vbHRpcCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJChlbGVtKS5kYXRhKCdjbGljaycpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTZXR0aW5nc1sndHJpZ2dlciddID0gJ2NsaWNrIGtleXVwJztcbiAgICAgICAgICAgICAgICBsb2NhbFNldHRpbmdzWydpbnRlcmFjdGl2ZSddID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGlwcHkoZWxlbSwgT2JqZWN0LmFzc2lnbih7fSwgdG9vbHRpcFNldHRpbmdzLCBsb2NhbFNldHRpbmdzKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRUb29sdGlwcygpO1xuXG47XG59KTtcbiJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==

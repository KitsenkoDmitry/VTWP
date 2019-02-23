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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wTGdTaXplIiwiZGVza3RvcE1kU2l6ZSIsImRlc2t0b3BTaXplIiwiZGVza3RvcFNtU2l6ZSIsInRhYmxldExnU2l6ZSIsInRhYmxldFNpemUiLCJtb2JpbGVMZ1NpemUiLCJtb2JpbGVTaXplIiwibGFuZyIsImF0dHIiLCJicmVha3BvaW50cyIsImJyZWFrcG9pbnREZXNrdG9wTGciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYnJlYWtwb2ludERlc2t0b3BNZCIsImJyZWFrcG9pbnREZXNrdG9wIiwiYnJlYWtwb2ludERlc2t0b3BTbSIsImJyZWFrcG9pbnRUYWJsZXRMZyIsImJyZWFrcG9pbnRUYWJsZXQiLCJicmVha3BvaW50TW9iaWxlTGdTaXplIiwiYnJlYWtwb2ludE1vYmlsZSIsImV4dGVuZCIsImxvYWQiLCJsZW5ndGgiLCJhdXRvc2l6ZSIsImZuIiwiYW5pbWF0ZUNzcyIsImFuaW1hdGlvbk5hbWUiLCJjYWxsYmFjayIsImFuaW1hdGlvbkVuZCIsImVsIiwiYW5pbWF0aW9ucyIsImFuaW1hdGlvbiIsIk9BbmltYXRpb24iLCJNb3pBbmltYXRpb24iLCJXZWJraXRBbmltYXRpb24iLCJ0Iiwic3R5bGUiLCJ1bmRlZmluZWQiLCJjcmVhdGVFbGVtZW50IiwiYWRkQ2xhc3MiLCJvbmUiLCJyZW1vdmVDbGFzcyIsImlzTnVtZXJpYyIsIm4iLCJpc05hTiIsInBhcnNlRmxvYXQiLCJpc0Zpbml0ZSIsInJlbW92ZU5vdERpZ2l0cyIsInBhcmFtIiwidG9TdHJpbmciLCJyZXBsYWNlIiwiZGl2aWRlQnlEaWdpdHMiLCJsb2NhbGUiLCJQYXJzbGV5Iiwic2V0TG9jYWxlIiwib3B0aW9ucyIsInRyaWdnZXIiLCJ2YWxpZGF0aW9uVGhyZXNob2xkIiwiZXJyb3JzV3JhcHBlciIsImVycm9yVGVtcGxhdGUiLCJjbGFzc0hhbmRsZXIiLCJpbnN0YW5jZSIsIiRlbGVtZW50IiwidHlwZSIsIiRoYW5kbGVyIiwiaGFzQ2xhc3MiLCJuZXh0IiwiZXJyb3JzQ29udGFpbmVyIiwiJGNvbnRhaW5lciIsImNsb3Nlc3QiLCJwYXJlbnQiLCJhZGRWYWxpZGF0b3IiLCJ2YWxpZGF0ZVN0cmluZyIsInZhbHVlIiwidGVzdCIsIm1lc3NhZ2VzIiwicnUiLCJlbiIsInJlZ1Rlc3QiLCJyZWdNYXRjaCIsIm1pbiIsImFyZ3VtZW50cyIsImRhdGEiLCJtYXgiLCJtaW5EYXRlIiwibWF4RGF0ZSIsInZhbHVlRGF0ZSIsInJlc3VsdCIsIm1hdGNoIiwiRGF0ZSIsIm1heFNpemUiLCJwYXJzbGV5SW5zdGFuY2UiLCJmaWxlcyIsInNpemUiLCJyZXF1aXJlbWVudFR5cGUiLCJmb3JtYXRzIiwiZmlsZUV4dGVuc2lvbiIsInNwbGl0IiwicG9wIiwiZm9ybWF0c0FyciIsInZhbGlkIiwiaSIsIm9uIiwiJGJsb2NrIiwiJGxhc3QiLCJhZnRlciIsImVsZW1lbnQiLCJwYXJzbGV5IiwiaW5wdXRtYXNrIiwiY2xlYXJNYXNrT25Mb3N0Rm9jdXMiLCJzaG93TWFza09uSG92ZXIiLCJDdXN0b21TZWxlY3QiLCIkZWxlbSIsInNlbGYiLCJpbml0IiwiJGluaXRFbGVtIiwiZWFjaCIsInNlbGVjdFNlYXJjaCIsIm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIiwiSW5maW5pdHkiLCJzZWxlY3QyIiwic2VsZWN0T25CbHVyIiwiZHJvcGRvd25Dc3NDbGFzcyIsImxhbmd1YWdlIiwibm9SZXN1bHRzIiwiZSIsImZpbmQiLCJjb250ZXh0IiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbVNlbGVjdCIsImRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyIsImRhdGVGb3JtYXQiLCJzaG93T3RoZXJNb250aHMiLCJEYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsInNob3dNWSIsImN1cnJlbnREYXRlIiwiY3VycmVudERheSIsImdldERhdGUiLCJuZXdEYXRlIiwiZ2V0TW9udGgiLCJnZXRGdWxsWWVhciIsIml0ZW1PcHRpb25zIiwib25TZWxlY3QiLCJjaGFuZ2UiLCJzZXRUaW1lb3V0IiwiJG1vYmlsZU1lbnUiLCJjc3MiLCJvdXRlckhlaWdodCIsImluZGV4IiwiZmllbGQiLCJ2YWwiLCJ0cmltIiwiaXMiLCJldmVudCIsInRvb2x0aXBTZXR0aW5ncyIsImFycm93IiwiYWxsb3dIVE1MIiwidGhlbWUiLCJpbml0VG9vbHRpcHMiLCJlbGVtIiwibG9jYWxTZXR0aW5ncyIsImNvbnRlbnQiLCJ0aXBweSIsIk9iamVjdCIsImFzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWUMsS0FBWixDQUFrQixZQUFXO0FBQ3pCOzs7QUFHQSxNQUFJQyxhQUFhLEdBQUc7QUFDaEI7QUFDQUMsSUFBQUEsSUFBSSxFQUFHLEdBRlM7QUFJaEI7QUFDQUMsSUFBQUEsYUFBYSxFQUFHLElBTEE7QUFNaEJDLElBQUFBLGFBQWEsRUFBRyxJQU5BO0FBT2hCQyxJQUFBQSxXQUFXLEVBQUssSUFQQTtBQVFoQkMsSUFBQUEsYUFBYSxFQUFHLElBUkE7QUFTaEJDLElBQUFBLFlBQVksRUFBSSxJQVRBO0FBVWhCQyxJQUFBQSxVQUFVLEVBQU0sR0FWQTtBQVdoQkMsSUFBQUEsWUFBWSxFQUFJLEdBWEE7QUFZaEJDLElBQUFBLFVBQVUsRUFBTSxHQVpBO0FBZWhCO0FBQ0E7QUFFQUMsSUFBQUEsSUFBSSxFQUFFYixDQUFDLENBQUMsTUFBRCxDQUFELENBQVVjLElBQVYsQ0FBZSxNQUFmO0FBbEJVLEdBQXBCLENBSnlCLENBeUJ6QjtBQUNBOztBQUNBLE1BQU1DLFdBQVcsR0FBRztBQUNoQkMsSUFBQUEsbUJBQW1CLEVBQUVDLE1BQU0sQ0FBQ0MsVUFBUCx1QkFBaUNmLGFBQWEsQ0FBQ0UsYUFBZCxHQUE4QixDQUEvRCxTQURMO0FBRWhCYyxJQUFBQSxtQkFBbUIsRUFBRUYsTUFBTSxDQUFDQyxVQUFQLHVCQUFpQ2YsYUFBYSxDQUFDRyxhQUFk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QVIsRUFBaUI7QUFDdEMsVUFBTUMsYUFBYSxHQUFHO0FBQ2xCQyxRQUFBQSxPQUFPLEVBQUUxSyxDQUFDLENBQUN3SyxJQUFELENBQUQsQ0FBUTFKLElBQVIsQ0FBYSxjQUFiO0FBRFMsT0FBdEI7O0FBR0EsVUFBSWQsQ0FBQyxDQUFDd0ssSUFBRCxDQUFELENBQVFoRixJQUFSLENBQWEsT0FBYixDQUFKLEVBQTJCO0FBQ3ZCaUYsUUFBQUEsYUFBYSxDQUFDLFNBQUQsQ0FBYixHQUEyQixhQUEzQjtBQUNBQSxRQUFBQSxhQUFhLENBQUMsYUFBRCxDQUFiLEdBQStCLElBQS9CO0FBQ0g7O0FBRURFLE1BQUFBLEtBQUssQ0FBQ0gsSUFBRCxFQUFPSSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCVixlQUFsQixFQUFtQ00sYUFBbkMsQ0FBUCxDQUFMO0FBQ0gsS0FWRDtBQVdIOztBQUVERixFQUFBQSxZQUFZO0FBRWhCO0FBQ0MsQ0F2a0JEIiwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICog0JPQu9C+0LHQsNC70YzQvdGL0LUg0L/QtdGA0LXQvNC10L3QvdGL0LUsINC60L7RgtC+0YDRi9C1INC40YHQv9C+0LvRjNC30YPRjtGC0YHRjyDQvNC90L7Qs9C+0LrRgNCw0YLQvdC+XG4gICAgICovXG4gICAgbGV0IGdsb2JhbE9wdGlvbnMgPSB7XG4gICAgICAgIC8vINCS0YDQtdC80Y8g0LTQu9GPINCw0L3QuNC80LDRhtC40LlcbiAgICAgICAgdGltZTogIDIwMCxcblxuICAgICAgICAvLyDQmtC+0L3RgtGA0L7Qu9GM0L3Ri9C1INGC0L7Rh9C60Lgg0LDQtNCw0L/RgtC40LLQsFxuICAgICAgICBkZXNrdG9wTGdTaXplOiAgMTkxMCxcbiAgICAgICAgZGVza3RvcE1kU2l6ZTogIDE2MDAsXG4gICAgICAgIGRlc2t0b3BTaXplOiAgICAxNDgwLFxuICAgICAgICBkZXNrdG9wU21TaXplOiAgMTI4MCxcbiAgICAgICAgdGFibGV0TGdTaXplOiAgIDEwMjQsXG4gICAgICAgIHRhYmxldFNpemU6ICAgICA3NjgsXG4gICAgICAgIG1vYmlsZUxnU2l6ZTogICA2NDAsXG4gICAgICAgIG1vYmlsZVNpemU6ICAgICA0ODAsXG5cblxuICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwIHRvdWNoINGD0YHRgtGA0L7QudGB0YLQslxuICAgICAgICAvLyBpc1RvdWNoOiAkLmJyb3dzZXIubW9iaWxlLFxuXG4gICAgICAgIGxhbmc6ICQoJ2h0bWwnKS5hdHRyKCdsYW5nJylcbiAgICB9O1xuXG4gICAgLy8g0JHRgNC10LnQutC/0L7QuNC90YLRiyDQsNC00LDQv9GC0LjQstCwXG4gICAgLy8gQGV4YW1wbGUgaWYgKGdsb2JhbE9wdGlvbnMuYnJlYWtwb2ludFRhYmxldC5tYXRjaGVzKSB7fSBlbHNlIHt9XG4gICAgY29uc3QgYnJlYWtwb2ludHMgPSB7XG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wTGc6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcExnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wTWQ6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcE1kU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BTbTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wU21TaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludFRhYmxldExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldExnU2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXQ6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMudGFibGV0U2l6ZSAtIDF9cHgpYCksXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGVMZ1NpemU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlTGdTaXplIC0gMX1weClgKSxcbiAgICAgICAgYnJlYWtwb2ludE1vYmlsZTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5tb2JpbGVTaXplIC0gMX1weClgKVxuICAgIH07XG5cbiAgICAkLmV4dGVuZCh0cnVlLCBnbG9iYWxPcHRpb25zLCBicmVha3BvaW50cyk7XG5cblxuXG5cbiAgICAkKHdpbmRvdykubG9hZCgoKSA9PiB7XG4gICAgICAgIC8vIGNvbnN0IHsgbmFtZSB9ID0gJC5icm93c2VyO1xuXG4gICAgICAgIC8vIGlmIChuYW1lKSB7XG4gICAgICAgIC8vICAgICAkKCdodG1sJykuYWRkQ2xhc3MoYGJyb3dzZXItJHtuYW1lfWApO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gaWYgKGdsb2JhbE9wdGlvbnMuaXNUb3VjaCkge1xuICAgICAgICAvLyAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCd0b3VjaCcpLnJlbW92ZUNsYXNzKCduby10b3VjaCcpO1xuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCduby10b3VjaCcpLnJlbW92ZUNsYXNzKCd0b3VjaCcpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgaWYgKCQoJ3RleHRhcmVhJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXV0b3NpemUoJCgndGV4dGFyZWEnKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLyoqXG4gICAgICog0J/QvtC00LrQu9GO0YfQtdC90LjQtSBqcyBwYXJ0aWFsc1xuICAgICAqL1xuICAgIC8qKlxuICog0KDQsNGB0YjQuNGA0LXQvdC40LUgYW5pbWF0ZS5jc3NcbiAqIEBwYXJhbSAge1N0cmluZ30gYW5pbWF0aW9uTmFtZSDQvdCw0LfQstCw0L3QuNC1INCw0L3QuNC80LDRhtC40LhcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayDRhNGD0L3QutGG0LjRjywg0LrQvtGC0L7RgNCw0Y8g0L7RgtGA0LDQsdC+0YLQsNC10YIg0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XG4gKiBAcmV0dXJuIHtPYmplY3R9INC+0LHRitC10LrRgiDQsNC90LjQvNCw0YbQuNC4XG4gKiBcbiAqIEBzZWUgIGh0dHBzOi8vZGFuZWRlbi5naXRodWIuaW8vYW5pbWF0ZS5jc3MvXG4gKiBcbiAqIEBleGFtcGxlXG4gKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnKTtcbiAqIFxuICogJCgnI3lvdXJFbGVtZW50JykuYW5pbWF0ZUNzcygnYm91bmNlJywgZnVuY3Rpb24oKSB7XG4gKiAgICAgLy8g0JTQtdC70LDQtdC8INGH0YLQvi3RgtC+INC/0L7RgdC70LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxuICogfSk7XG4gKi9cbiQuZm4uZXh0ZW5kKHtcbiAgICBhbmltYXRlQ3NzOiBmdW5jdGlvbihhbmltYXRpb25OYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYW5pbWF0aW9uRW5kID0gKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdhbmltYXRpb25lbmQnLFxuICAgICAgICAgICAgICAgIE9BbmltYXRpb246ICdvQW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICBNb3pBbmltYXRpb246ICdtb3pBbmltYXRpb25FbmQnLFxuICAgICAgICAgICAgICAgIFdlYmtpdEFuaW1hdGlvbjogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmb3IgKGxldCB0IGluIGFuaW1hdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uc1t0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcblxuICAgICAgICB0aGlzLmFkZENsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSkub25lKGFuaW1hdGlvbkVuZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0pO1xuICAgIC8vINCd0LXQsdC+0LvRjNGI0LjQtSDQstGB0L/QvtC80L7Qs9Cw0YLQtdC70YzQvdGL0LUg0YTRg9C90LrRhtC40LhcblxuICAgIC8qKlxuICAgICAqINCf0YDQvtCy0LXRgNGP0LXRgiDRh9C40YHQu9C+INC40LvQuCDQvdC10YJcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gbiDQm9GO0LHQvtC5INCw0YDQs9GD0LzQtdC90YJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWVyaWMobikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvRj9C10YIg0LLRgdC1INC90LXRh9C40YHQu9C+0LLRi9C1INGB0LjQvNCy0L7Qu9GLINC4INC/0YDQuNCy0L7QtNC40YIg0Log0YfQuNGB0LvRg1xuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJ8bnVtYmVyfSBwYXJhbVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm90RGlnaXRzKHBhcmFtKSB7XG4gICAgICAgIC8qINGD0LTQsNC70Y/QtdC8INCy0YHQtSDRgdC40LzQstC+0LvRiyDQutGA0L7QvNC1INGG0LjRhNGAINC4INC/0LXRgNC10LLQvtC00LjQvCDQsiDRh9C40YHQu9C+ICovXG4gICAgICAgIHJldHVybiArcGFyYW0udG9TdHJpbmcoKS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCg0LDQt9C00LXQu9GP0LXRgiDQvdCwINGA0LDQt9GA0Y/QtNGLXG4gICAgICog0J3QsNC/0YDQuNC80LXRgCwgMzgwMDAwMCAtPiAzIDgwMCAwMDBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyfG51bWJlcn0gcGFyYW1cbiAgICAgKiBAcmV0dXJucyB7c3RyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpdmlkZUJ5RGlnaXRzKHBhcmFtKSB7XG4gICAgICAgIGlmIChwYXJhbSA9PT0gbnVsbCkgcGFyYW0gPSAwO1xuICAgICAgICByZXR1cm4gcGFyYW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9XG5cbiAgICB2YXIgbG9jYWxlID0gZ2xvYmFsT3B0aW9ucy5sYW5nID09ICdydS1SVScgPyAncnUnIDogJ2VuJztcblxuICAgIFBhcnNsZXkuc2V0TG9jYWxlKGxvY2FsZSk7XG5cbiAgICAvKiDQndCw0YHRgtGA0L7QudC60LggUGFyc2xleSAqL1xuICAgICQuZXh0ZW5kKFBhcnNsZXkub3B0aW9ucywge1xuICAgICAgICB0cmlnZ2VyOiAnYmx1ciBjaGFuZ2UnLCAvLyBjaGFuZ2Ug0L3Rg9C20LXQvSDQtNC70Y8gc2VsZWN0J9CwXG4gICAgICAgIHZhbGlkYXRpb25UaHJlc2hvbGQ6ICcwJyxcbiAgICAgICAgZXJyb3JzV3JhcHBlcjogJzxkaXY+PC9kaXY+JyxcbiAgICAgICAgZXJyb3JUZW1wbGF0ZTogJzxwIGNsYXNzPVwicGFyc2xleS1lcnJvci1tZXNzYWdlXCI+PC9wPicsXG4gICAgICAgIGNsYXNzSGFuZGxlcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICAgICAkaGFuZGxlcjtcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkZWxlbWVudDsgLy8g0YLQviDQtdGB0YLRjCDQvdC40YfQtdCz0L4g0L3QtSDQstGL0LTQtdC70Y/QtdC8IChpbnB1dCDRgdC60YDRi9GCKSwg0LjQvdCw0YfQtSDQstGL0LTQtdC70Y/QtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDQsdC70L7QulxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJCgnLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUnLCAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICRoYW5kbGVyO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcnNDb250YWluZXI6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xuICAgICAgICAgICAgbGV0IHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lcjtcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJChgW25hbWU9XCIkeyRlbGVtZW50LmF0dHIoJ25hbWUnKX1cIl06bGFzdCArIGxhYmVsYCkubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmN1c3RvbS1maWxlJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmZpZWxkJyk7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJGNvbnRhaW5lcilcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgcmV0dXJuICRjb250YWluZXI7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCa0LDRgdGC0L7QvNC90YvQtSDQstCw0LvQuNC00LDRgtC+0YDRi1xuXG4gICAgLy8g0KLQvtC70YzQutC+INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lUnUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFcXC0gXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWVFbicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosIFwiIFwiLCBcIi1cIidcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiyDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlclJ1Jywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlswLTnQsC3Rj9GRXSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCAwLTknXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLLCDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXInLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXowLTldKiQvaS50ZXN0KHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknLFxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05J1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQotC10LvQtdGE0L7QvdC90YvQuSDQvdC+0LzQtdGAXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ3Bob25lJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlstKzAtOSgpIF0qJC9pLnRlc3QodmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0YLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgCcsXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBwaG9uZSBudW1iZXInXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bWJlcicsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bMC05XSokL2kudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgMC05JyxcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIDAtOSdcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0J/QvtGH0YLQsCDQsdC10Lcg0LrQuNGA0LjQu9C70LjRhtGLXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2VtYWlsJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAvXihbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0oXFwufF98LSl7MCwxfSkrW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dXFxAKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSkrKChcXC4pezAsMX1bQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pezEsfVxcLlthLXrQsC3RjzAtOVxcLV17Mix9JC8udGVzdCh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9C+0YfRgtC+0LLRi9C5INCw0LTRgNC10YEnLFxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZW1haWwgYWRkcmVzcydcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0KTQvtGA0LzQsNGCINC00LDRgtGLIERELk1NLllZWVlcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZGF0ZScsIHtcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgcmVnVGVzdCA9IC9eKD86KD86MzEoXFwuKSg/OjA/WzEzNTc4XXwxWzAyXSkpXFwxfCg/Oig/OjI5fDMwKShcXC4pKD86MD9bMSwzLTldfDFbMC0yXSlcXDIpKSg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezJ9KSR8Xig/OjI5KFxcLikwPzJcXDMoPzooPzooPzoxWzYtOV18WzItOV1cXGQpPyg/OjBbNDhdfFsyNDY4XVswNDhdfFsxMzU3OV1bMjZdKXwoPzooPzoxNnxbMjQ2OF1bMDQ4XXxbMzU3OV1bMjZdKTAwKSkpKSR8Xig/OjA/WzEtOV18MVxcZHwyWzAtOF0pKFxcLikoPzooPzowP1sxLTldKXwoPzoxWzAtMl0pKVxcNCg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezR9KSQvLFxuICAgICAgICAgICAgICAgIHJlZ01hdGNoID0gLyhcXGR7MSwyfSlcXC4oXFxkezEsMn0pXFwuKFxcZHs0fSkvLFxuICAgICAgICAgICAgICAgIG1pbiA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWluJyksXG4gICAgICAgICAgICAgICAgbWF4ID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNYXgnKSxcbiAgICAgICAgICAgICAgICBtaW5EYXRlLCBtYXhEYXRlLCB2YWx1ZURhdGUsIHJlc3VsdDtcblxuICAgICAgICAgICAgaWYgKG1pbiAmJiAocmVzdWx0ID0gbWluLm1hdGNoKHJlZ01hdGNoKSkpIHtcbiAgICAgICAgICAgICAgICBtaW5EYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF4ICYmIChyZXN1bHQgPSBtYXgubWF0Y2gocmVnTWF0Y2gpKSkge1xuICAgICAgICAgICAgICAgIG1heERhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQgPSB2YWx1ZS5tYXRjaChyZWdNYXRjaCkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZURhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlZ1Rlc3QudGVzdCh2YWx1ZSkgJiYgKG1pbkRhdGUgPyB2YWx1ZURhdGUgPj0gbWluRGF0ZSA6IHRydWUpICYmIChtYXhEYXRlID8gdmFsdWVEYXRlIDw9IG1heERhdGUgOiB0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3QsNGPINC00LDRgtCwJyxcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGRhdGUnXG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLy8g0KTQsNC50Lsg0L7Qs9GA0LDQvdC40YfQtdC90L3QvtCz0L4g0YDQsNC30LzQtdGA0LBcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZU1heFNpemUnLCB7XG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgbWF4U2l6ZSwgcGFyc2xleUluc3RhbmNlKSB7XG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBwYXJzbGV5SW5zdGFuY2UuJGVsZW1lbnRbMF0uZmlsZXM7XG4gICAgICAgICAgICByZXR1cm4gZmlsZXMubGVuZ3RoICE9IDEgIHx8IGZpbGVzWzBdLnNpemUgPD0gbWF4U2l6ZSAqIDEwMjQ7XG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVtZW50VHlwZTogJ2ludGVnZXInLFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQpNCw0LnQuyDQtNC+0LvQttC10L0g0LLQtdGB0LjRgtGMINC90LUg0LHQvtC70LXQtSwg0YfQtdC8ICVzIEtiJyxcbiAgICAgICAgICAgIGVuOiAnRmlsZSBzaXplIGNhblxcJ3QgYmUgbW9yZSB0aGVuICVzIEtiJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDQntCz0YDQsNC90LjRh9C10L3QuNGPINGA0LDRgdGI0LjRgNC10L3QuNC5INGE0LDQudC70L7QslxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlRXh0ZW5zaW9uJywge1xuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIGZvcm1hdHMpIHtcbiAgICAgICAgICAgIGxldCBmaWxlRXh0ZW5zaW9uID0gdmFsdWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgICAgIGxldCBmb3JtYXRzQXJyID0gZm9ybWF0cy5zcGxpdCgnLCAnKTtcbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcm1hdHNBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZUV4dGVuc2lvbiA9PT0gZm9ybWF0c0FycltpXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlczoge1xuICAgICAgICAgICAgcnU6ICfQlNC+0L/Rg9GB0YLQuNC80Ysg0YLQvtC70YzQutC+INGE0LDQudC70Ysg0YTQvtGA0LzQsNGC0LAgJXMnLFxuICAgICAgICAgICAgZW46ICdBdmFpbGFibGUgZXh0ZW5zaW9ucyBhcmUgJXMnXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCh0L7Qt9C00LDRkdGCINC60L7QvdGC0LXQudC90LXRgNGLINC00LvRjyDQvtGI0LjQsdC+0Log0YMg0L3QtdGC0LjQv9C40YfQvdGL0YUg0Y3Qu9C10LzQtdC90YLQvtCyXG4gICAgUGFyc2xleS5vbignZmllbGQ6aW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgJGVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICAgICAgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcbiAgICAgICAgICAgICRibG9jayA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdlcnJvcnMtcGxhY2VtZW50JyksXG4gICAgICAgICAgICAkbGFzdDtcblxuICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgJGxhc3QgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKTtcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpO1xuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCY0L3QuNGG0LjQuNGA0YPQtdGCINCy0LDQu9C40LTQsNGG0LjRjiDQvdCwINCy0YLQvtGA0L7QvCDQutCw0LvQtdC00LDRgNC90L7QvCDQv9C+0LvQtSDQtNC40LDQv9Cw0LfQvtC90LBcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDp2YWxpZGF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgJCgnZm9ybVtkYXRhLXZhbGlkYXRlPVwidHJ1ZVwiXScpLnBhcnNsZXkoKTtcblxuICAgIC8qKlxuICAgICAqINCU0L7QsdCw0LLQu9GP0LXRgiDQvNCw0YHQutC4INCyINC/0L7Qu9GPINGE0L7RgNC8XG4gICAgICogQHNlZSAgaHR0cHM6Ly9naXRodWIuY29tL1JvYmluSGVyYm90cy9JbnB1dG1hc2tcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPGlucHV0IGNsYXNzPVwianMtcGhvbmUtbWFza1wiIHR5cGU9XCJ0ZWxcIiBuYW1lPVwidGVsXCIgaWQ9XCJ0ZWxcIj5cbiAgICAgKi9cbiAgICAkKCcuanMtcGhvbmUtbWFzaycpLmlucHV0bWFzaygnKzcoOTk5KSA5OTktOTktOTknLCB7XG4gICAgICAgIGNsZWFyTWFza09uTG9zdEZvY3VzOiB0cnVlLFxuICAgICAgICBzaG93TWFza09uSG92ZXI6IGZhbHNlXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDQodGC0LjQu9C40LfRg9C10YIg0YHQtdC70LXQutGC0Ysg0YEg0L/QvtC80L7RidGM0Y4g0L/Qu9Cw0LPQuNC90LAgc2VsZWN0MlxuICAgICAqIGh0dHBzOi8vc2VsZWN0Mi5naXRodWIuaW9cbiAgICAgKi9cbiAgICBsZXQgQ3VzdG9tU2VsZWN0ID0gZnVuY3Rpb24oJGVsZW0pIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uKCRpbml0RWxlbSkge1xuICAgICAgICAgICAgJGluaXRFbGVtLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdFNlYXJjaCA9ICQodGhpcykuZGF0YSgnc2VhcmNoJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0U2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IDE7IC8vINC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBJbmZpbml0eTsgLy8g0L3QtSDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogbWluaW11bVJlc3VsdHNGb3JTZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub1Jlc3VsdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICfQodC+0LLQv9Cw0LTQtdC90LjQuSDQvdC1INC90LDQudC00LXQvdC+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQvdGD0LbQvdC+INC00LvRjyDQstGL0LvQuNC00LDRhtC40Lgg0L3QsCDQu9C10YLRg1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKGBvcHRpb25bdmFsdWU9XCIkeyQodGhpcykuY29udGV4dC52YWx1ZX1cIl1gKS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYudXBkYXRlID0gZnVuY3Rpb24oJHVwZGF0ZUVsZW0pIHtcbiAgICAgICAgICAgICR1cGRhdGVFbGVtLnNlbGVjdDIoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHNlbGYuaW5pdCgkdXBkYXRlRWxlbSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5pbml0KCRlbGVtKTtcbiAgICB9O1xuXG4gICAgdmFyIGN1c3RvbVNlbGVjdCA9IG5ldyBDdXN0b21TZWxlY3QoJCgnc2VsZWN0JykpO1xuXG4gICAgY29uc3QgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBkYXRlRm9ybWF0OiAnZGQubW0ueXknLFxuICAgICAgICBzaG93T3RoZXJNb250aHM6IHRydWVcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog0JTQtdC70LDQtdGCINCy0YvQv9Cw0LTRjtGJ0LjQtSDQutCw0LvQtdC90LTQsNGA0LjQutC4XG4gICAgICogQHNlZSAgaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vZGF0ZXBpY2tlci9cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8g0LIgZGF0YS1kYXRlLW1pbiDQuCBkYXRhLWRhdGUtbWF4INC80L7QttC90L4g0LfQsNC00LDRgtGMINC00LDRgtGDINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXlcbiAgICAgKiA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZGF0ZUlucHV0XCIgaWQ9XCJcIiBjbGFzcz1cImpzLWRhdGVwaWNrZXJcIiBkYXRhLWRhdGUtbWluPVwiMDYuMTEuMjAxNVwiIGRhdGEtZGF0ZS1tYXg9XCIxMC4xMi4yMDE1XCI+XG4gICAgICovXG4gICAgbGV0IERhdGVwaWNrZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgZGF0ZXBpY2tlciA9ICQoJy5qcy1kYXRlcGlja2VyJyk7XG5cbiAgICAgICAgZGF0ZXBpY2tlci5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBtaW5EYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1pbicpO1xuICAgICAgICAgICAgbGV0IG1heERhdGUgPSAkKHRoaXMpLmRhdGEoJ2RhdGUtbWF4Jyk7XG4gICAgICAgICAgICBjb25zdCBzaG93TVkgPSAkKHRoaXMpLmRhdGEoJ3Nob3ctbS15Jyk7XG5cbiAgICAgICAgICAgIC8qINC10YHQu9C4INCyINCw0YLRgNC40LHRg9GC0LUg0YPQutCw0LfQsNC90L4gY3VycmVudCwg0YLQviDQstGL0LLQvtC00LjQvCDRgtC10LrRg9GJ0YPRjiDQtNCw0YLRgyAqL1xuICAgICAgICAgICAgaWYgKCBtYXhEYXRlID09PSAnY3VycmVudCcgfHwgbWluRGF0ZSA9PT0gJ2N1cnJlbnQnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50RGF5ID0gY3VycmVudERhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnREYXkgPCAxMCA/IGN1cnJlbnREYXkgPSAnMCcgKyBjdXJyZW50RGF5LnRvU3RyaW5nKCkgOiBjdXJyZW50RGF5O1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0RhdGUgPSBjdXJyZW50RGF5ICsgJy4nICsgKGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKSArICcuJyArIGN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICAgICAgbWF4RGF0ZSA9PT0gJ2N1cnJlbnQnID8gbWF4RGF0ZSA9IG5ld0RhdGUgOiBtaW5EYXRlID0gbmV3RGF0ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGl0ZW1PcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIG1pbkRhdGU6IG1pbkRhdGUgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICBtYXhEYXRlOiBtYXhEYXRlIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoYW5nZSgpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5maWVsZCcpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZihzaG93TVkpIHtcbiAgICAgICAgICAgICAgICBpdGVtT3B0aW9uc1snY2hhbmdlWWVhciddID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpdGVtT3B0aW9uc1sneWVhclJhbmdlJ10gPSAnYy0xMDA6Yyc7XG4gICAgICAgICAgICAgICAgaXRlbU9wdGlvbnNbJ2NoYW5nZU1vbnRoJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBpdGVtT3B0aW9ucywgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5kYXRlcGlja2VyKGl0ZW1PcHRpb25zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgIC8vINC00LXQu9Cw0LXQvCDQutGA0LDRgdC40LLRi9C8INGB0LXQu9C10Log0LzQtdGB0Y/RhtCwINC4INCz0L7QtNCwXG4gICAgICAgICAkKGRvY3VtZW50KS5vbignZm9jdXMnLCAnLmpzLWRhdGVwaWNrZXInLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyDQuNGB0L/QvtC70YzQt9GD0LXQvCDQt9Cw0LTQtdGA0LbQutGDLCDRh9GC0L7QsdGLINC00LXQudGC0L/QuNC60LXRgCDRg9GB0L/QtdC7INC40L3QuNGG0LjQsNC70LjQt9C40YDQvtCy0LDRgtGM0YHRj1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoJCgnLnVpLWRhdGVwaWNrZXInKS5maW5kKCdzZWxlY3QnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnVpLWRhdGVwaWNrZXInKS5maW5kKCdzZWxlY3QnKS5zZWxlY3QyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdE9uQmx1cjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duQ3NzQ2xhc3M6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgbGV0IGRhdGVwaWNrZXIgPSBuZXcgRGF0ZXBpY2tlcigpO1xuXG4gICAgY29uc3QgJG1vYmlsZU1lbnUgPSAkKCcuanMtbW9iaWxlLW1lbnUnKTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtbWVudS1idG4nLCAoKSA9PiB7XG4gICAgICAgICRtb2JpbGVNZW51LmFkZENsYXNzKCdpcy1hY3RpdmUnKS5hbmltYXRlQ3NzKCdzbGlkZUluUmlnaHQnKTtcbiAgICAgICAgJCgnYm9keScpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2lzLWxvY2tlZCcpXG4gICAgICAgICAgICAuY3NzKCdoZWlnaHQnLCAkbW9iaWxlTWVudS5vdXRlckhlaWdodCgpICsgJ3B4Jyk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLW1lbnUtY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgICRtb2JpbGVNZW51LmFuaW1hdGVDc3MoJ3NsaWRlT3V0UmlnaHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAkbW9iaWxlTWVudS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCdib2R5JylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2lzLWxvY2tlZCcpXG4gICAgICAgICAgICAgICAgLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpZiAoJCgnLmpzLWxhYmVsLWFuaW1hdGlvbicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqINCQ0L3QuNC80LDRhtC40Y8g0Y3Qu9C10LzQtdC90YLQsCBsYWJlbCDQv9GA0Lgg0YTQvtC60YPRgdC1INC/0L7Qu9C10Lkg0YTQvtGA0LzRi1xuICAgICAgICAgKi9cbiAgICAgICAgJCgnLmpzLWxhYmVsLWFuaW1hdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9ICQoZWwpLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYScpO1xuXG4gICAgICAgICAgICBpZiAoJChmaWVsZCkudmFsKCkudHJpbSgpICE9ICcnIHx8ICQoZmllbGQpLmlzKCc6cGxhY2Vob2xkZXItc2hvd24nKSkge1xuICAgICAgICAgICAgICAgICQoZWwpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJChmaWVsZCkub24oJ2ZvY3VzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XG4gICAgICAgICAgICB9KS5vbignYmx1cicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkudHJpbSgpID09PSAnJyAmJiAhJChmaWVsZCkuaXMoJzpwbGFjZWhvbGRlci1zaG93bicpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoZWwpLnJlbW92ZUNsYXNzKCdpcy1maWxsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyogQHNlZSBodHRwczovL2F0b21pa3MuZ2l0aHViLmlvL3RpcHB5anMvICovXG5cbiAgICBjb25zdCB0b29sdGlwU2V0dGluZ3MgPSB7XG4gICAgICAgIGFycm93OiB0cnVlLFxuICAgICAgICBhbGxvd0hUTUw6IHRydWUsXG4gICAgICAgIHRoZW1lOiAndG9vbHRpcCdcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAgaW5pdCBhbGwgdG9vbHRpcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0VG9vbHRpcHMoKSB7XG4gICAgICAgICQoJ1tkYXRhLXRvb2x0aXBdJykuZWFjaCgoaW5kZXgsIGVsZW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2FsU2V0dGluZ3MgPSB7XG4gICAgICAgICAgICAgICAgY29udGVudDogJChlbGVtKS5hdHRyKCdkYXRhLXRvb2x0aXAnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCQoZWxlbSkuZGF0YSgnY2xpY2snKSkge1xuICAgICAgICAgICAgICAgIGxvY2FsU2V0dGluZ3NbJ3RyaWdnZXInXSA9ICdjbGljayBrZXl1cCc7XG4gICAgICAgICAgICAgICAgbG9jYWxTZXR0aW5nc1snaW50ZXJhY3RpdmUnXSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRpcHB5KGVsZW0sIE9iamVjdC5hc3NpZ24oe30sIHRvb2x0aXBTZXR0aW5ncywgbG9jYWxTZXR0aW5ncykpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0VG9vbHRpcHMoKTtcblxuO1xufSk7XG4iXSwiZmlsZSI6ImludGVybmFsLmpzIn0=

const $mobileMenu = $('.js-mobile-menu');

$(document).on('click', '.js-menu-btn', () => {
    $mobileMenu.addClass('is-active').animateCss('slideInRight');
    $('body').addClass('is-locked').css('height', $mobileMenu.outerHeight() + 'px');
});

$(document).on('click', '.js-menu-close', () => {
    $mobileMenu.animateCss('slideOutRight', () => {
        $mobileMenu.removeClass('is-active');
        $('body').removeClass('is-locked').css('height', 'auto');
    });
});

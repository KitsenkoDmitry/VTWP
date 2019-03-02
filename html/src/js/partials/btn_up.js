const $upBtn = $('.js-btn-up');

if ($upBtn.length) {
    $(document).on('click', '.js-btn-up', () => {
        $('html, body').animate({
            scrollTop: 0
        })
    });

    $(window).on('scroll', () => {
        if ($(window).width() >= globalOptions.tabletLgSize) {
            $(window).scrollTop() > 50 ? $upBtn.show() : $upBtn.hide();
        }
    });
}

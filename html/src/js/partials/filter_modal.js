const $filterModal = $('.js-filter-modal');
if ($filterModal.length) {

    $(document).on('click', '.js-filter-btn', e => {
        $filterModal.addClass('is-active').animateCss('slideInRight');
    });

    $(document).on('click', '.js-filter-close', e => {
        $filterModal.animateCss('slideOutRight', () => {
            $filterModal.removeClass('is-active');
        });
    });
}

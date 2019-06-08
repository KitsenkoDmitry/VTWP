// используется только на странице checkout.html
if ($('.js-collapse-btn').length) {
    $(document).on('click', '.js-collapse-btn', e => {
        const $self = $(e.currentTarget);
        const $collapseBody = $self.closest('.js-collapse').find('.js-collapse-body');
        if ($self.hasClass('is-active')) {
            $self.removeClass('is-active');
            $collapseBody.slideUp('fast');
        } else {
            $self.addClass('is-active');
            $collapseBody.slideDown('fast');
        }
    });
}

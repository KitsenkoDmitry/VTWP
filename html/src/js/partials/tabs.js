$(document).on('click', '.js-tabs-link', (e) => {
    e.preventDefault();
    const $self = $(e.currentTarget);

    if ($self.hasClass('is-active')) return;

    const $tabs = $self.closest('.js-tabs');
    const $tabsLinks = $tabs.find('.js-tabs-link');
    const $tabsItems = $tabs.find('.js-tabs-item');

    $tabsLinks.removeClass('is-active');
    $tabsItems.removeClass('is-active');

    $self.addClass('is-active');
    $($self.attr('href')).addClass('is-active');
});

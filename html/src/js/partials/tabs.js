$(document).on('click', '.js-tabs-link', (e) => {
    e.preventDefault();
    const $self = $(e.currentTarget);

    if ($self.hasClass('is-active')) return;

    const $tabs = $self.closest('.js-tabs');
    const $tabsLinks = $tabs.find('.js-tabs-link');
    const $tabsItems = $tabs.find('.js-tabs-item');

    // выключаем все активные табы и ссылки
    $tabsLinks.removeClass('is-active');
    $tabsItems.removeClass('is-active');

    // выключаем валидацию у скрытых полей и очищаем их
    let $hiddenFormFields = $tabsItems.find('[data-required]');
    if ($hiddenFormFields.length) {
        $hiddenFormFields.prop('data-required', false);
        $hiddenFormFields.prop('required', false);
        $hiddenFormFields.val('');
    }

    // включаем нужный таб и делаем нужную ссылку активной
    $self.addClass('is-active');
    const $selfItem = $($self.attr('href'));
    $selfItem.addClass('is-active');

    // включаем валидацию у скрытых полей
    $hiddenFormFields = $selfItem.find('[data-required]');
    if ($hiddenFormFields.length) {
        $hiddenFormFields.prop('data-required', true);
        $hiddenFormFields.prop('required', true);
    }
});

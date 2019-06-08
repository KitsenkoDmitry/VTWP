const $mobileMenu = $('.js-mobile-menu');
const $cartModal = $('.js-cart-modal');

$(document).on('click', '.js-menu-btn', () => {
    openModal($mobileMenu);
});

$(document).on('click', '.js-menu-close', () => {
    hideModal($mobileMenu);
});

$(document).on('click', '.js-cart-btn', e => {
    e.preventDefault();
    openModal($cartModal);
});

$(document).on('click', '.js-cart-close', () => {
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
    $modalBlock.animateCss('slideOutRight', () => {
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
}

// ------ логика открытия выпадашек хедера ------
const $header = $('.js-header');

$(document).on('click', '.js-header-dropdown-btn', e => {
    e.preventDefault();
    const $self = $(e.currentTarget);
    const category = $self.attr('data-category');
    const $categoryDropdown = $(`[data-dropdown-category='${category}']`);

    if ($self.hasClass('is-chosen')) {
        $self.removeClass('is-chosen');
        $categoryDropdown.removeClass('is-active');
        $header.removeClass('is-active');
        $('body').removeClass('has-overlay');
    } else {
        $('.js-header-dropdown-btn').removeClass('is-chosen');
        $('.js-header-dropdown').removeClass('is-active');
        $header.addClass('is-active');
        $self.addClass('is-chosen');
        $categoryDropdown.addClass('is-active');
        $('body').addClass('has-overlay');
        $(document).on('click', closeDropdownHandler);
    }
});

function closeDropdownHandler(e) {
    if ($(e.target).closest('.js-header').length === 0) {
        $('.js-header-dropdown-btn').removeClass('is-chosen');
        $('.js-header-dropdown').removeClass('is-active');
        $header.removeClass('is-active');
        $('body').removeClass('has-overlay');
        $(document).off('click', closeDropdownHandler);
    }
}

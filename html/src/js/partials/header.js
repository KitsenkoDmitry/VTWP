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

$(document).on('mouseover', '.js-header-dropdown-btn', e => {
    const $self = $(e.currentTarget);
    const category = $self.attr('data-category');
    $('.js-header-dropdown').removeClass('is-active');
    $header.removeClass('is-active');
    $('body').removeClass('has-overlay');
    if (category) {
        const $categoryDropdown = $(`[data-dropdown-category='${category}']`);
        $categoryDropdown.addClass('is-active');
        $header.addClass('is-active');
        $('body').addClass('has-overlay');
    }
});

$(document).on('mouseleave', '.js-header-dropdown', e => {
    $('.js-header-dropdown').removeClass('is-active');
    $header.removeClass('is-active');
    $('body').removeClass('has-overlay');
});

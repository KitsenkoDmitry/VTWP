const $mobileMenu = $('.js-mobile-menu');
const $cartModal = $('.js-cart-modal');

$(document).on('click', '.js-menu-btn', () => {
    openModal($mobileMenu);
});

$(document).on('click', '.js-menu-close', () => {
    hideModal($mobileMenu)
});

$(document).on('click', '.js-cart-btn', (e) => {
    e.preventDefault();
    openModal($cartModal);
});

$(document).on('click', '.js-cart-close', () => {
    hideModal($cartModal)
});

/**
 * Open modal block
 * @param {jQuery} $modalBlock Modal block
 */
function openModal($modalBlock) {
    $modalBlock.addClass('is-active').animateCss('slideInRight');
    lockBody($modalBlock)
}

/**
 * Hide modal block
 * @param {jQuery} $modalBlock Modal block
 */
function hideModal($modalBlock) {
    $modalBlock.animateCss('slideOutRight', () => {
        $modalBlock.removeClass('is-active');
        unlockBody();
    });
}

/**
 * Unlock body for scroll
 */
function unlockBody() {
    $('body').removeClass('is-locked').css('height', 'auto');
}

/**
 * Lock body for scroll
 * @param {jQuery} $lockBlock Block which define body height
 */
function lockBody($lockBlock) {
    $('body').addClass('is-locked').css('height', $lockBlock.outerHeight() + 'px');
}

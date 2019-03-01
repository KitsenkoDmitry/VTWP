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
    hideModal($cartModal);
});

/**
 * Open modal block
 * @param {jQuery} $modalBlock Modal block
 */
function openModal($modalBlock) {
    $modalBlock.addClass('is-active').animateCss('slideInRight');
    lockDocument();
}

/**
 * Hide modal block
 * @param {jQuery} $modalBlock Modal block
 */
function hideModal($modalBlock) {
    $modalBlock.animateCss('slideOutRight', () => {
        $modalBlock.removeClass('is-active');
        unlockDocument();
    });
}

/**
 * Unlock document for scroll
 */
function unlockDocument() {
    $('html').removeClass('is-locked');
    // .css('height', 'auto');
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

    if ($self.hasClass('is-active')) {
        $self.removeClass('is-active');
        $categoryDropdown.removeClass('is-active');
        $header.removeClass('is-active');
    } else {
        $('.js-header-dropdown-btn').removeClass('is-active');
        $('.js-header-dropdown').removeClass('is-active');
        $header.addClass('is-active');
        $self.addClass('is-active');
        $categoryDropdown.addClass('is-active');
        $(document).on('click', closeDropdownHandler);
    }
});


function closeDropdownHandler(e) {
    if ($(e.target).closest('.js-header').length === 0) {
        $('.js-header-dropdown-btn').removeClass('is-active');
        $('.js-header-dropdown').removeClass('is-active');
        $header.removeClass('is-active');
        $(document).off('click', closeDropdownHandler);
    }
}

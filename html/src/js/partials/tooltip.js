/* @see https://atomiks.github.io/tippyjs/ */

const tooltipSettings = {
    arrow: true,
    allowHTML: true,
    theme: 'tooltip'
}

/**
 *  init all tooltips
 */
function initTooltips() {
    $('[data-tooltip]').each((index, elem) => {
        const localSettings = {
            content: $(elem).attr('data-tooltip')
        }
        if ($(elem).data('click')) {
            localSettings['trigger'] = 'click keyup';
            localSettings['interactive'] = true;
        }

        tippy(elem, Object.assign({}, tooltipSettings, localSettings));
    });
}

initTooltips();

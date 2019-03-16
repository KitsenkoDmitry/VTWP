//  карусель на первом баннере на главной странице
const $newsCarousel = $('.js-news-carousel');

if ($newsCarousel.length) {
    $newsCarousel.slick({
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        centerMode: false,
        variableWidth: true,
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    infinite: false,
                },
            },
            {
                breakpoint: 1023,
                settings: 'unslick',
            }
        ]
    });
}

// карусель подбора байков
const $bikesCarousel = $('.js-bikes-carousel');

if ($bikesCarousel.length) {
    $bikesCarousel.slick({
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 767,
                settings: 'unslick',
            }
        ]
    });

    // check bike after init
    $bikesCarousel.find('.slick-active').find('input').prop('checked', true);

    // check bike after change
    $bikesCarousel.on('afterChange', () => {
        $bikesCarousel.find('.slick-active').find('input').prop('checked', true);
    });
}

// карусель категорий
const $categoriesCarousel = $('.js-categories-carousel');

if ($categoriesCarousel.length) {
    const categoriesOptions = {
        arrows: false,
        infinite: false,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: '0',
        variableWidth: false,
        dots: true,
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 767,
                settings: 'unslick',
            }
        ]
    };
    $categoriesCarousel.slick(categoriesOptions);


}

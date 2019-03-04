//  карусель на главной странице
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

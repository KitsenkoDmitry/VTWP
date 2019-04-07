initCarousels();

$(window).on('resize', initCarousels);

// инициализирует все карусели
function initCarousels () {
    //  карусель на первом баннере на главной странице
    const $newsCarousel = $('.js-news-carousel');
    if ($newsCarousel.length && !$newsCarousel.hasClass('slick-initialized')) {
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
    if ($bikesCarousel.length && !$bikesCarousel.hasClass('slick-initialized')) {
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
    if ($categoriesCarousel.length && !$categoriesCarousel.hasClass('slick-initialized')) {
        $categoriesCarousel.slick({
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
        });
    }

    // карусель картинок товара
    const $productCarousel = $('.js-product-carousel');
    if ($productCarousel.length && !$productCarousel.hasClass('slick-initialized')) {
        $productCarousel.slick({
            arrows: true,
            infinite: true,
            slidesToShow: 1,
            prevArrow: '<button type="button" class="btn-arrow btn-arrow--prev product-page__carousel-prev"><svg class="icon icon--arrow-next"><use xlink:href="#icon-arrow_next"></use></svg></button>',
            nextArrow: '<button type="button" class="btn-arrow product-page__carousel-next"><svg class="icon icon--arrow-next"><use xlink:href="#icon-arrow_next"></use></svg></button>',
            dots: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        dots: true
                    }
                }
            ]
        });
    }

    // карусель похожих товаров
    const $similarCarousel = $('.js-similar-carousel');
    if ($similarCarousel.length && !$similarCarousel.hasClass('slick-initialized')) {
        $similarCarousel.slick({
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
                    breakpoint: 639,
                    settings: 'unslick',
                }
            ]
        });
    }

    // карусель картинок
    const $pictureCarousel = $('.js-picture-carousel');
    if ($pictureCarousel.length && !$pictureCarousel.hasClass('slick-initialized')) {
        $pictureCarousel.slick({
            arrows: false,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
        });
    }
}

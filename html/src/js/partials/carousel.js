initCarousels();

$(window).on('resize', initCarousels);

// инициализирует все карусели
function initCarousels() {
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
                        // infinite: false,
                    },
                },
                {
                    breakpoint: 1023,
                    settings: 'unslick',
                },
            ],
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
                },
            ],
        });

        // check bike after init
        $bikesCarousel
            .find('.slick-active')
            .find('input')
            .prop('checked', true);

        // check bike after change
        $bikesCarousel.on('afterChange', () => {
            $bikesCarousel
                .find('.slick-active')
                .find('input')
                .prop('checked', true);
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
                },
            ],
        });
    }

    // карусель проектов и/или событий
    const $projectsCarousel = $('.js-projects-carousel');
    if ($projectsCarousel.length && !$projectsCarousel.hasClass('slick-initialized')) {
        $projectsCarousel.slick({
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
                },
                {
                    breakpoint: 639,
                    settings: {
                        slidesToShow: 2,
                        centerMode: false,
                    },
                },
            ],
        });
    }

    // карусель на главной
    const $indexMainCarousel = $('.js-index-main-carousel');
    if ($indexMainCarousel.length && !$indexMainCarousel.hasClass('slick-initialized')) {
        $indexMainCarousel.slick({
            arrows: false,
            infinite: false,
            slidesToShow: 1,
            centerMode: true,
            centerPadding: '0',
            variableWidth: false,
            dots: true,
        });
    }

    // карусель картинок товара
    const $productCarousel = $('.js-product-carousel');
    if ($productCarousel.length && !$productCarousel.hasClass('slick-initialized')) {
        $productCarousel.slick({
            arrows: true,
            infinite: false,
            slidesToShow: 1,
            prevArrow:
                '<button type="button" class="btn-arrow btn-arrow--prev product-page__carousel-prev"><svg class="icon icon--arrow-next"><use xlink:href="#icon-arrow_next"></use></svg></button>',
            nextArrow:
                '<button type="button" class="btn-arrow product-page__carousel-next"><svg class="icon icon--arrow-next"><use xlink:href="#icon-arrow_next"></use></svg></button>',
            dots: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        dots: true,
                    },
                },
            ],
        });

        $productCarousel.on('afterChange', (slick, currentSlide) => {
            const $parent = $(slick.currentTarget).closest('.product-page__carousel-wrapper');
            $parent.find('.product-page__carousel-btns-pic').removeClass('is-active');
            $parent.find(`[data-slide=${currentSlide.currentSlide}]`).addClass('is-active');
        });

        // реализовываем переключение слайдов
        $(document).on('click', '.product-page__carousel-btns-pic', e => {
            const $btn = $(e.currentTarget);
            const $parent = $btn.closest('.product-page__carousel-wrapper');
            const $productCarousel = $parent.find('.js-product-carousel');
            const slideId = $btn.data('slide');
            $parent.find('.product-page__carousel-btns-pic').removeClass('is-active');
            $btn.addClass('is-active');
            $productCarousel.slick('slickGoTo', slideId);
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
                },
            ],
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

    const $bikeCardCarousel = $('.js-bike-card-carousel');
    if ($bikeCardCarousel.length && !$bikeCardCarousel.hasClass('slick-initialized')) {
        $bikeCardCarousel.each((index, item) => {
            $(item).slick({
                slidesToScroll: 1,
                slidesToShow: 1,
                arrows: false,
                dots: false,
                fade: true,
                responsive: [
                    {
                        breakpoint: 767,
                        settings: {
                            fade: false,
                            dots: true,
                        },
                    },
                ],
            });
        });

        // реализовываем переключение слайдов
        $(document).on('click', '.js-bike-card-slide-btn', e => {
            const $btn = $(e.currentTarget);
            const $parent = $btn.closest('.bike-card');
            const $carousel = $parent.find('.js-bike-card-carousel');
            const slideId = $btn.data('slide');
            $parent.find('.js-bike-card-slide-btn').removeClass('is-active');
            $btn.addClass('is-active');
            $carousel.slick('slickGoTo', slideId);
        });
    }

    // карусель картинок товара
    const $picturesCarousel = $('.js-pictures-carousel');
    if ($picturesCarousel.length && !$picturesCarousel.hasClass('slick-initialized')) {
        $picturesCarousel.slick({
            arrows: true,
            infinite: false,
            variableWidth: true,
            prevArrow:
                '<button type="button" class="btn-arrow btn-arrow--prev pictures__carousel-btn-prev"><svg class="icon icon--arrow-next"><use xlink:href="#icon-arrow_next"></use></svg></button>',
            nextArrow:
                '<button type="button" class="btn-arrow pictures__carousel-btn-next"><svg class="icon icon--arrow-next"><use xlink:href="#icon-arrow_next"></use></svg></button>',
            dots: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        dots: true,
                        variableWidth: false,
                    },
                },
            ],
        });

        $picturesCarousel.on('afterChange', (slick, currentSlide) => {
            const $parent = $(slick.currentTarget).closest('.pictures');
            $parent.find('.pictures__thumbs-item').removeClass('is-active');
            $parent.find(`[data-slide=${currentSlide.currentSlide}]`).addClass('is-active');
        });

        // реализовываем переключение слайдов
        $(document).on('click', '.pictures__thumbs-item', e => {
            const $btn = $(e.currentTarget);
            const $parent = $btn.closest('.pictures');
            const $picturesCarousel = $parent.find('.js-pictures-carousel');
            const slideId = $btn.data('slide');
            $parent.find('.pictures__thumbs-item').removeClass('is-active');
            $btn.addClass('is-active');
            $picturesCarousel.slick('slickGoTo', slideId);
        });

        $('[data-fancybox="pictures"]').fancybox({});
    }
}

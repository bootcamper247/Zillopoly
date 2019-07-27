$(document).ready(function () {
    
    let APIimages = "<img src='" + imgArr + "'alt='Image of home from Zillow API'/>"
    $(".slider-for").slick("slickAdd", APIimages);
    $('#images').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear'
    });
});
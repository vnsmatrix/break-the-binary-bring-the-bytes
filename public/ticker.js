var ticker = $('#ticker')
var links = $('#xf')
var left = ticker.offset().left;
var myReq

links.on('mouseover.myevents', function() {
    // ticker.css({
    //     backgroundColor: 'antiquewhite'
    // });
    cancelAnimationFrame(myReq)
});

links.on('mouseout.myevents', function() {
    ticker.css({
        backgroundColor: 'transparent'
    });
    requestAnimationFrame(moveNews);
});

function moveNews() {
    left--
    left--
    if (left <= -links.eq(0).outerWidth()){
        left = left + links.eq(0).outerWidth()
        ticker.append(links.eq(0));
        links = $('#xf')
    }
    ticker.css({
        left: left + 'px'
    });

    myReq = requestAnimationFrame(moveNews)
}

moveNews()

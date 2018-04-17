$("h2").on("mouseover", function() {
    $("#h2").css("cursor", "cell");
}).on("click", function() {
    $("#info").toggle();
})
$("#info").on("click", function() {
    $("#info").css("display", "none");
}).on("mouseover", function () {
    $("#info").css("cursor", "cell");
})

$(".heart").on("click", function() {
    console.log("<3");
    $("#menu").toggle();
})

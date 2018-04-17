var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')


$("#canvas").mousedown(function(e) {
    ctx.beginPath();
    $(document).on("mousemove", function mouseDraw(e){
        e.preventDefault();
        ctx.strokeStyle = '#C5EAD2';
        ctx.lineWidth = 1;
        ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
        ctx.stroke();
    }).on("mouseup", function() {
        $(document).off("mousemove").off("mouseup");
        $("#sig").val(canvas.toDataURL())
    })
})

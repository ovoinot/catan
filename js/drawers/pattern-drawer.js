function drawPattern(img, size) {
    var canvas = document.getElementById('canvas');

    canvas.height = 500;
    canvas.width = 500;

    var tempCanvas = document.createElement("canvas"),
        tCtx = tempCanvas.getContext("2d");

    tempCanvas.width = size;
    tempCanvas.height = size;
    tCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, size, size);

    // use getContext to use the canvas for drawing
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = ctx.createPattern(tempCanvas, 'repeat');

    ctx.beginPath();
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.fill();

}
function setup() {
  canvas = createCanvas(450,450);
  canvas.parent();
  textFont("Verdana");
  textSize(14);
  noStroke();
  //noLoop();
  background('lavender');
}

function draw() {
  fill("wheat")
  rect(0,0, width,30)
  fill('black');
  text("mouseX:" + round(mouseX) + " mouseY:"+round(mouseY),15,20);
  fill('indianred');
  ellipse(mouseX, mouseY,10);
}
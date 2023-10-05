
function setup() {
  canvas = createCanvas(450,450);
  background('cornflowerblue');
  canvas.parent();
  noLoop();
}

function draw() {
  noStroke();
  fill('wheat');
  rect(00,350,450,100);
  translate(90,-10);
  strokeWeight(4);
  stroke('darkgrey');
  fill('lightgray');
  rect(100,280,100,100);
  fill('gray');
  stroke("darkgrey")
  fill("grey")
  triangle(100,280,150,200,200,280)
  noStroke();
  rect(115,330,30,50);
  fill('khaki');
  circle(350,95,150)
  fill('sienna');
  rect(300,250,40,130);
  fill('olive');
  ellipse(320,230,100,150)
}

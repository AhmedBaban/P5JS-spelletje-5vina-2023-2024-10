var levens = 2;
var kolommenMetBom = [];

class Raster {
  constructor(r,k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }
  
  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }
  
  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        rect(kolom*this.celGrootte,rij*this.celGrootte,
            this.celGrootte,this.celGrootte);
        
        if (rij == 5 || kolom == 5) {    
          fill('orange'); 
          rect(kolom * this.celGrootte, rij * this.celGrootte, this.celGrootte, this.celGrootte);
          noFill();
       }
      }
    }  
    pop();
  }
}


class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
    this.staOpBom = false;
  }
  
  eetAppel(appel) {
    const afstand = dist(this.x, this.y, appel.x, appel.y);
    if (afstand < this.stapGrootte / 2) {
      appel.verplaats();
      levens++; 
    
      return true;  
    }
    return false;
  }
  
  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }
    
    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
    
    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }
  
  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    }
    else {
      return false;
    }
  }
  

  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}  

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }
  
  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}



class Bom {
  constructor(grootteStap, x, y,snelheid){
    this.x = x;
    this.y = y;
    this.grootteStap = grootteStap;
    this.snelheid = snelheid;
    this.omhoog = true;
    this.sprite = null;
  }  

  beweeg() {
    if (this.omhoog) {
      this.y -= this.snelheid;
    } else {
      this.y += this.snelheid;
    }

    if (this.y <= 0) {
      this.omhoog = false;
    } else if (this.y >= canvas.height - raster.celGrootte) {
      this.omhoog = true;
    }
  }     
  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte ,raster.celGrootte); 
  }

  wordtGeraakt(jos) {
    const afstand = dist(this.x, this.y, jos.x, jos.y);
    if (afstand < jos.stapGrootte / 2) {
      levens--;
      this.reset();
      return true;
    }
    return false;
  }

  reset() {
    var kolom;
    do {
      kolom = floor(random(raster.aantalKolommen / 2, raster.aantalKolommen - 1));
    } while (kolommenMetBom.includes(kolom));
    kolommenMetBom.push(kolom);

    this.x = kolom * raster.celGrootte + 5;
    this.y = floor(random(0, raster.aantalRijen)) * raster.celGrootte + 4;
  }
}


class Appel {
  constructor() {
    this.x = floor(random(1,raster.aantalKolommen))*raster.celGrootte + 5;
    this.y = floor(random(0,raster.aantalRijen))*raster.celGrootte + 4;
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte - 10,raster.celGrootte - 10);   
  }

  verplaats() {
  this.x = 900
  this.y = floor(random(0, raster.aantalRijen - 1)) * raster.celGrootte + 4;
  }
  
raakJos (jos) {
  const afstand = dist(this.x, this.y, jos.x, jos.y);
  if (afstand < jos.stapGrootte / 2) {
    this.x = floor(random(1, raster.aantalKolommen)) * raster.celGrootte + 5;
    this.y = floor(random(0, raster.aantalRijen)) * raster.celGrootte + 4;
    return true;
   }
  return false;
 }

}


function toonEindScherm() {
  background('red');
    fill('white');
    textSize(80);
    text("Helaas", 300, 250); 
    text("je hebt verloren", 130, 350); 
}  

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);
  
  raster = new Raster(12,18);
  
  raster.berekenCelGrootte();
  
  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }
  
  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png"); 

  Appel = new Appel();
  Appel.sprite = loadImage("images/sprites/appel_1.png");


  bommenLijst = [];
  
  for (var i = 0; i < 5; i++) {
    var kolom;
    do {
      kolom = floor(random(raster.aantalKolommen / 2, raster.aantalKolommen - 1));
    } while (kolommenMetBom.includes(kolom)); 
    kolommenMetBom.push(kolom);

    var x = kolom * raster.celGrootte + 5;
    var y = floor(random(0, raster.aantalRijen)) * raster.celGrootte + 4;
    var snelheid = random(10, 20);
    var bom = new Bom(raster.celGrootte, x, y, snelheid);
    bom.sprite = loadImage("images/sprites/bom.png");
    bommenLijst.push(bom);
  }

  }
  



function draw() {
  background(brug);
  raster.teken();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  Appel.toon();
  
  for (var i = 0; i < bommenLijst.length; i++) {
    var bom = bommenLijst[i];
    bom.beweeg();
    bom.toon();
    
    if (bom.wordtGeraakt(eve)) {
    }
    
  }


  
  fill("black");
  textSize(24);
  text("Levens: " + levens, 30, 30);
  
  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob)) {
    if (levens > 2) {
      levens--;
    } else { 
      background('red');
      fill('white');
      textSize(80);
      text("Helaas", 300, 250); 
      text("je hebt verloren", 130, 350); 
      noLoop();
    }
  }
  
  if (eve.gehaald) {
    background('green');
    fill('white'); 
    textSize(80);
    text("Gefeliciteerd", 220,250); 
    text("je hebt gewonnen!", 110,340); 
    noLoop();
   }
  
  if (eve.eetAppel(Appel)) {
    }  
}   
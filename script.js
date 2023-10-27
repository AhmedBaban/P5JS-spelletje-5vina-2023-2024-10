var levens = 2;
var kolommenMetBom = [];
var spelActief = true;

//var levens geeft het aantal levens aan (begin is 2 levens), kolommenMetBom is een lijst waar de kollomen in staan waar een bom zich op de x waarde bevind, spelActief is om te bepalen of het spel actief is of niet 

class Raster {
  constructor(r,k) {
  this.aantalRijen = r;
  this.aantalKolommen = k;
  this.celGrootte = null;
  }
  
berekenCelGrootte() {
 this.celGrootte = canvas.width / this.aantalKolommen;
  }
  // berekent de grootte van de cel
  
  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0;rij < this.aantalRijen;rij++) {
    for (var kolom = 0;kolom < this.aantalKolommen;kolom++) 
    { 
      rect(kolom*this.celGrootte,rij*this.celGrootte,
            this.celGrootte,this.celGrootte);
          // Het raster is grijs en 12x18
      
    if (rij == 5 || kolom == 5) {    
          fill('orange'); 
          rect(kolom * this.celGrootte, rij * 
    this.celGrootte, this.celGrootte, this.celGrootte);
          noFill();
       } // Maakt rij en kolom 5 oranje
  
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
  }  // Kenmerken van Jos, x en y coordinaten, reeks van animaties in array
  
  eetAppel(appel) {
    const afstand = dist(this.x, this.y, appel.x, appel.y);
    if (afstand < this.stapGrootte / 2) {
      appel.verplaats();
      levens++; 
    
      return true;  
    }
    return false;
  }
  // zorgt ervoor dat wanneer de appel gegeten wordt er een leven bij komt( er komt + 1 bij de variabele levens). En
  
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
  //zorgt ervoor dat wasd wordt gebruit als input om jos te laten bewegen, constrain wordt gebruikt om jos zijn beweging te limiteren tot de randen van het canvas.                                                                                 
  
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
//de gegevens hoe jos wordt afgebeeld

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
  }    // Bewegen van de vijand is random met steeds stappen van 1 rasterhokje, ook is de beweging gelimiteerd tot slechts het canvas
  
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
// 
  
  beweeg() {
    if (this.omhoog) 
    {
      this.y -= this.snelheid;
    } else 
    
    {
      this.y += this.snelheid;
    }

    if (this.y <= 0) {
      this.omhoog = false;
    } else if (this.y >= canvas.height - raster.celGrootte) {
      this.omhoog = true;
    }
  }     
  // methode beweeg wordt gebruikt om de bommen over de y-as op en neer te laten bewegen binnen de randen van het canvas.
  
 toon() {
image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte); 
  }

  wordtGeraakt(jos) {
    // Bereken de afstand tussen de huidige bom en de speler 'jos'.
    const afstand = dist(this.x, this.y, jos.x, jos.y);

     // Als de afstand tussen de bom en 'jos' kleiner is dan de helft van de stapgrootte van 'jos',
    if (afstand < jos.stapGrootte / 2) { levens--;
    this.reset();
    return true;
    }
    return false;
  }
// als de bom wordt geraakt door jos zal er 1 leven van de speler af gaan

  reset() {
    var kolom;
    do {
      kolom = floor(random(raster.aantalKolommen / 2, raster.aantalKolommen - 1));
    } 
      while (kolommenMetBom.includes(kolom));
    kolommenMetBom.push(kolom);

    this.x = kolom * raster.celGrootte + 5;
    this.y = floor(random(0, raster.aantalRijen)) * raster.celGrootte + 4;
  }
}
// checkt of de kolom een bom bevat, zo ja wordt de kolom bij de array kolommenMetBom toegevoegd, vervolgens wordt de positie van de bom op basis van de nieuw toegevoegde kolom ingesteld. Dit zorgt ervoor dat de bom op een nieuwe locatie wordt geplaatst als de gekozen kolom al een bom bevatte.


class Appel {
  constructor() {
    this.x = floor(random(1,raster.aantalKolommen))*raster.celGrootte + 5;
    this.y = floor(random(0,raster.aantalRijen))*raster.celGrootte + 4;
  }
//de appel wordt perfect in een hokje geplaatst

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte - 10,raster.celGrootte - 10);   
  }   // Appel die zorgt voor +1 leven na het eten.

  verplaats() {
  this.x = 900
  this.y = floor(random(0, raster.aantalRijen - 1)) * raster.celGrootte + 4;
  }
  //nadat de appel wordt gegeten verdwijnt de appel buiten het canvas
  
  raakJos (jos) {
     // Bereken de afstand tussen de huidige bom en de speler 'jos'.
    const afstand = dist(this.x, this.y, jos.x, jos.y);
     // Als de afstand tussen de bom en 'jos' kleiner is dan de helft van de stapgrootte van 'jos',
    if (afstand < jos.stapGrootte / 2) {
      
      // Genereer een nieuwe positie voor de bom na de botsing.
    this.x = floor(random(1, raster.aantalKolommen)) * raster.celGrootte + 5;
    this.y = floor(random(0, raster.aantalRijen)) * raster.celGrootte + 4;
    return true;
   }
  return false;
 
  }
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
         // Code van de Canvas   
  
eve = new Jos();
eve.stapGrootte = 1*raster.celGrootte;
for (var b = 0;b < 6;b++) {
frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
  eve.animatie.push(frameEve);
  }    // Plaatje van Eve/Jos afgebeeld op grootte gebaseerd op het hokje van het raster

alice = new Vijand(700,200);
alice.stapGrootte = 1*eve.stapGrootte;
alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");
        // Plaatje van vijand Alice 
  
bob = new Vijand(600,400);
bob.stapGrootte = 1*eve.stapGrootte;
bob.sprite = loadImage("images/sprites/Bob100px/Bob.png"); 
        // Plaatje van vijand Bob 
  
Appel = new Appel();
Appel.sprite = loadImage("images/sprites/appel_1.png");
        // Plaatje van de groene appel. 

    bommenLijst = [];
  //lijst met bommen
  
  // Een lus die vijf keer wordt uitgevoerd om vijf bommen aan het spel toe te voegen.
  for (var i = 0; i < 5; i++) { 
    // Genereert willekeurig een kolom waarin de bom wordt geplaatst.
    var kolom;
    do {
      kolom = floor(random(raster.aantalKolommen / 2, raster.aantalKolommen - 1));
    } while (kolommenMetBom.includes(kolom)); // // Zorg ervoor dat de kolom nog geen bom bevat.
    kolommenMetBom.push(kolom);  // Voeg de gekozen kolom toe aan de lijst van kolommen met bommen.

     // Bereken de x- en y-coördinaten waar de bom zal worden geplaatst.
    var x = kolom * raster.celGrootte + 5;
    var y = floor(random(0, raster.aantalRijen)) * raster.celGrootte + 4;
    // Genereer een willekeurige snelheid voor de bom tussen 10 en 20.
    var snelheid = random(10, 20);
    // Maak een nieuw 'Bom'-object aan met de berekende eigenschappen.  
    var bom = new Bom(raster.celGrootte, x, y, snelheid);
    bom.sprite = loadImage("images/sprites/bom.png"); //gegeven plaatje en file path
    bommenLijst.push(bom); // Voeg de bom toe aan de lijst van bommen in het spel.

  }
  

  }
  



function draw() {
  background(brug);
  raster.teken();
  //raster en achtergrond wordt getekend

  if (spelActief) {
    eve.beweeg();
    alice.beweeg();
    bob.beweeg();
    eve.toon();
    alice.toon();
    bob.toon();
    Appel.toon();
    //eve alice bob en hun beweging en de appel worden getekend als spelactief true is 

    //loop door de lijst van de bommen in het spel
  for (var i = 0; i < bommenLijst.length; i++) {
    //haalt de bommen uit de lijst  
    var bom = bommenLijst[i];
    bom.beweeg();
    bom.toon();
       // laat de bom tonen en bewegen
    
  if (bom.wordtGeraakt(eve)) {
      if (levens > 0) {
        levens - 1;
      }
      else { 
        spelActief = false; 
      }
     }  
    }
  }   // -1 leven elke keer dat je geraakt wordt door een bom 


  
  fill("black");
  textSize(24);
  text("Levens: " + levens, 30, 30);
  //tekst van levens
  
  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob)) {
    if (levens > 1) {
      levens--;
    } else { 
      spelActief = false;
    }
  }  //Als de levens groter is dan 1 is blijft het spel actief en gaat er 1 leven van de speler af, is de levens minder dan 1 is spelactief false en gaat het spel af en stopt de loop.
  
  if (eve.gehaald) {
    background('green');
    fill('white'); 
    textSize(80);
    text("Gefeliciteerd", 210,250); 
    text("je hebt gewonnen!", 100,340); 
    noLoop();
   }  // Groene achtergrond nadat je gewonnen hebt en winnende tekst( win scherm). 
  
  if (!spelActief) {
    background('red');
    fill('white');
    textSize(80);
    text("Helaas", 300, 250);
    text("je hebt verloren", 130, 350);
  }  // Rode achtergrond nadat je verloren hebt. 
  
  if (eve.eetAppel(Appel)) {
    }
}
  // Zorgt er voor dat de appel gegeten wordt
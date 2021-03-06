thisCatBox = 0;

function initChoiceBoxes() {
  choosingChibi = true;
  labels[0].visible = true;
  labels[1].visible = true;
  buttons[1].available = false;
  buttons[1].visible = true;
  currentChibis = chibis.length;
  boxes = [];
  if (selection !== null && selection.dragging) {
    selection.dragging = false;
    selection.focus = selection.findClosestFireFly();
  }
  selection = null;
}

function initLitter(mParent, fParent) {
  parentBoxes = [];
  parentBoxes.push(new CatBox((canvasWidth/2)-(boxSize*3), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) - (boxSize/2), boxSize, boxThickness));
  parentBoxes.push(new CatBox((canvasWidth/2)+(boxSize*2), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) - (boxSize/2), boxSize, boxThickness));
  fParent.inCatBox = parentBoxes[0];
  mParent.inCatBox = parentBoxes[1];
  fParent.x = parentBoxes[0].x + (boxSize/2);
  fParent.y = parentBoxes[0].y + (boxSize/2);
  mParent.x = parentBoxes[1].x + (boxSize/2);
  mParent.y = parentBoxes[1].y + (boxSize/2);
  fParent.speedX = 0;
  fParent.speedY = 0;
  mParent.speedX = 0;
  mParent.speedY = 0;
  fParent.findClosestFireFly();
  mParent.findClosestFireFly();
  parentBoxes[0].colour = genderPink;
  parentBoxes[1].colour = genderBlue;
  buttons[10].available = false;
  buttons[11].available = false;
  buttons[12].available = false;
  buttons[6].available = false;
  initChoiceBoxes();
  choiceTimer = 1000;
  labels[2].visible = true;
  sendMessage('\u2764 '+fParent.name+' gave birth to '+mParent.name+'\'s chittens');
  labels[0] = new Button(canvasWidth/2, (trueBottom/2) - ((3*(boxSize+boxPadding))/2) - 120, 'Choose one of '+fParent.name+' and '+mParent.name+'\'s litter to keep', '');
  labels[1] = new Button(canvasWidth/2, (trueBottom/2) - ((3*(boxSize+boxPadding))/2) - 50, 'The rest will be adopted by nice people', '');
  maleParent = mParent;
  femaleParent = fParent;
  chosenKitten = false;
  maleParent.litters++;
  femaleParent.litters++;
  buttons[2].visible = true;
  // random number of chittens (6-9)
  let numberInLitter = Math.round(6 + (Math.random()*3));
  let count = 0;
  for (let j = 0; j < boxRows; j++) {
    for (let i = 0; i < boxColumns && count < numberInLitter; i++) {
      boxes.push(new CatBox((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize), boxSize, boxThickness));
      generateBaby(maleParent, femaleParent, generateChildBreedText(maleParent, femaleParent));
      thisCatBox = (j*3) + i;
      boxes[thisCatBox].id = thisCatBox + currentChibis;
      chibis[thisCatBox+currentChibis].inCatBox = boxes[thisCatBox];
      chibis[thisCatBox+currentChibis].name = generateBabyName(maleParent.name, femaleParent.name, chibis[thisCatBox+currentChibis].gender);
      chibis[thisCatBox+currentChibis].mother = fParent;
      chibis[thisCatBox+currentChibis].size *= 2;
      chibis[thisCatBox+currentChibis].reinitSizeAndColour();
      chibis[thisCatBox+currentChibis].x = (canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2);
      chibis[thisCatBox+currentChibis].y = (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + (boxSize/2);
      count++;
      // setting the box colour
      if (chibis[thisCatBox+currentChibis].gender == 'Female') {
        boxes[thisCatBox].colour = genderPink;
      } else if (chibis[thisCatBox+currentChibis].gender == 'Male') {
        boxes[thisCatBox].colour = genderBlue;
      } else {
        boxes[thisCatBox].colour = genderPurple;
      }
      // don't mutate the pick of the litter, or the runt
      if (thisCatBox !== 0 && thisCatBox !== boxes.length-1) {
        mutate(chibis[thisCatBox+currentChibis]);
      }
    }
  }
  // Pick of litter
  chibis[currentChibis].size *= 1.2;
  chibis[currentChibis].reinitSizeAndColour();
  boxes[0].text = 'Pick';
  // Runt of litter
  chibis[chibis.length-1].size *= 0.85;
  chibis[chibis.length-1].maxSize *= 0.85;
  chibis[chibis.length-1].health *= 0.85;
  chibis[chibis.length-1].firstColour = mixTwoColours(randomColour(), chibis[chibis.length-1].firstColour, Math.random()*0.15);
  chibis[chibis.length-1].secondColour = mixTwoColours(randomColour(), chibis[chibis.length-1].secondColour, Math.random()*0.15);
  chibis[chibis.length-1].thirdColour = mixTwoColours(randomColour(), chibis[chibis.length-1].thirdColour, Math.random()*0.15);
  boxes[boxes.length-1].text = 'Runt';
  chibis[chibis.length-1].reinitSizeAndColour();
}

function randomiseGenetics(who) {
  who.age = Math.round(Math.random()*5) + maturesAt;
  who.size = (who.maxSize*0.75) + (Math.random()*0.25*who.maxSize);
  who.coatMod[0] = Math.random();
  who.coatMod[1] = Math.random();
  who.thickness = (Math.random()*0.5)+0.5;
  who.legginess = (Math.random()*0.9)+0.1;
  let colourArray = generateRealisticCoat();
  who.firstColour = colourArray[0];
  who.secondColour = colourArray[1];
  who.thirdColour = colourArray[2];
  who.inCatBox = boxes[thisCatBox];
  who.birthday = Math.round(Math.random()*1000);
  who.love = 50 + Math.round((Math.random()*50));
  who.tailLength = (Math.random()*0.75)+0.25;
  who.bodypartCode = randomBodyPartCode();
  who.nosePos = Math.random();
  who.eyePosX = Math.random();
  who.eyePosY = Math.random();
  who.headWidth = Math.random();
  who.headHeight = Math.random();
  who.eyeColour = getRandomEyeColour();
  who.eyeColour2 = who.eyeColour;
  who.eyeSize = Math.random();
  who.maxAge = 12 + (Math.random()*8);
  who.fangs = Math.random();
  who.earHeight = 0.25 + (Math.random()*0.75);
  who.earLength = 0.25 + (Math.random()*0.75);
  if (who !== experiment) {
    applyBreedTemplate(who);
  }
  who.eyeColour2 = who.eyeColour;
  if (who !== experiment) {
    mutate(who);
  }
  who.reinitSizeAndColour();
}

function initFemaleCattery() {
  initChoiceBoxes();
  buttons[13].visible = true;
  chosenChibiF = false;
  labels[0] = new Button(canvasWidth/2, (trueBottom/2) - ((3*(boxSize+boxPadding))/2) - 85, 'Welcome to the Cattery', '');
  labels[1] = new Button(canvasWidth/2, (trueBottom/2) - ((3*(boxSize+boxPadding))/2) - 50, 'Choose a girl', '');
  buttons[0].visible = true;
  buttons[6].visible = true;
  for (let i = 0; i < boxColumns; i++) {
    for (let j = 0; j < boxRows; j++) {
      boxes.push(new CatBox((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize), boxSize, boxThickness));
      chibis.push(new Chibi((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + (boxSize/2), 6, ((Math.random()*9) + 7)/1.1, 'Female'));
      thisCatBox = (i*3) + j;
      boxes[thisCatBox].id = thisCatBox + currentChibis;
      boxes[thisCatBox].colour = genderPink;
      while (chibis[thisCatBox+currentChibis].name == null) {
        chibis[thisCatBox+currentChibis].name = getFemaleName(Math.floor(Math.random()*numlibs*namesinlib));
      }
      randomiseGenetics(chibis[thisCatBox+currentChibis]);
    }
  }
}

function initMaleCattery() {
  initChoiceBoxes();
  buttons[13].visible = true;
  chosenChibiM = false;
  labels[0] = new Button(canvasWidth/2, (trueBottom/2) - ((3*(boxSize+boxPadding))/2) - 85, 'Welcome to the Cattery', '');
  labels[1] = new Button(canvasWidth/2, (trueBottom/2) - ((3*(boxSize+boxPadding))/2) - 50, 'Choose a boy', '');
  buttons[0].visible = true;
  buttons[6].visible = true;
  for (let i = 0; i < boxColumns; i++) {
    for (let j = 0; j < boxRows; j++) {
      boxes.push(new CatBox((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize), boxSize, boxThickness));
      chibis.push(new Chibi((canvasWidth/2)-(((boxSize*3)+(boxPadding*2))/2) + (i*boxPadding) + (i*boxSize) + (boxSize/2), (trueBottom/2) - ((boxColumns*(boxSize+boxPadding))/2) + (j*boxPadding) + (j*boxSize) + (boxSize/2), 6, ((Math.random()*9) + 7)*1.1, 'Male'));
      thisCatBox = (i*3) + j;
      boxes[thisCatBox].id = thisCatBox + currentChibis;
      boxes[thisCatBox].colour = genderBlue;
      while (chibis[thisCatBox+currentChibis].name == null) {
        chibis[thisCatBox+currentChibis].name = getMaleName(Math.floor(Math.random()*numlibs*namesinlib));
      }
      randomiseGenetics(chibis[thisCatBox+currentChibis]);
    }
  }
}

/**
* function to describe a box
*/
function CatBox(x, y, size, thickness) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.thickness = thickness;
  this.selected = false;
  this.highlighted = false;
  this.id = 0;
  this.text = '';
  this.colour = '#000000';
  this.update = function() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = trueWhite;
    ctx.fillText(this.text, this.x+5, this.y+15);
    ctx.lineWidth = this.thickness;
    if (this.highlighted || this.selected) {
      ctx.save();
      ctx.translate(30, 125);
      ctx.strokeStyle = mixTwoColours(this.colour, trueWhite, 0.5);
      if (this.highlighted) {
        ctx.fillText(chibis[this.id].name, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2)+10);
        ctx.fillText('Breed '+chibis[this.id].breed, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 25);
        ctx.fillText('Age '+ chibis[this.id].age, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 40);
        ctx.fillText('Gender '+chibis[this.id].gender, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 55);
        let cString = '';
        if (chibis[this.id].albino || chibis[this.id].sphynx) {
          if (chibis[this.id].albino) {
            cString = 'Albino ';
          }
          if (chibis[this.id].sphynx) {
            cString += 'Sphynx';
          }
        } else {
          let c1 = ntc.name(chibis[this.id].firstColour)[1];
          let c2 = ntc.name(chibis[this.id].secondColour)[1];
          let c3 = ntc.name(chibis[this.id].thirdColour)[1];
          if (c1 == c2 & c1 == c3) {
            cString = c1;
          } else if (c1 == c2) {
            cString = c1 + ' & '+ c3;
          } else if (c1 == c3) {
            cString = c1 + ' & '+ c2;
          } else if (c2 == c3) {
            cString = c1 + ' & '+ c2;
          } else {
            cString = c1 +', '+c2+' & '+c3;
          }
        }
        ctx.fillText('Colour '+cString, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 70);
        let eString = '';
        if (chibis[this.id].eyeColour == chibis[this.id].eyeColour2 && !chibis[this.id].albino) {
          eString = ntc.name(chibis[this.id].eyeColour)[1];
        } else if (chibis[this.id].albino) {
          eString = 'Albino';
        } else {
          eString = 'Heterochromia';
        }
        ctx.fillText('Eye colour '+eString, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 85);
        ctx.fillText('Max size '+Math.round((chibis[this.id].maxSize)), (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 100);
        let ag = 'Negative';
        if (chibis[this.id].albinoGene) {
          ag = 'Positive';
        }
        ctx.fillText('Albino Gene '+ag, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 115);
        let sg = 'Negative';
        if (chibis[this.id].sphynxGene) {
          sg = 'Positive';
        }
        ctx.fillText('Sphynx Gene '+sg, (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 130);
        ctx.fillText('Name type '+getLibraryName(chibis[this.id].name, chibis[this.id].gender), (canvasWidth/2) + (((boxSize+boxPadding)*3)/2)+10, (trueBottom/2) - (((boxSize+boxPadding)*3)/2) + 145);
      }
    } else {
      ctx.strokeStyle = this.colour;
    }
    ctx.restore();
    ctx.save();
    if (!this.selected) {
      ctx.globalAlpha = 0.5;
    }
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.size, 0);
    ctx.lineTo(this.size, this.size);
    ctx.lineTo(0, this.size);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.restore();
  };
  this.checkBounce = function(what) {
    if (what.inCatBox == this) {
      // if we bounce off a side wall
      if (what.x < this.x + what.size || what.x >= this.x + this.size - what.size) {
        what.speedX *= -0.9;
        let targetangle = Math.atan2(what.y, this.y);
        what.spin += elasticity*targetangle/10;
        if (what.x < this.x + what.size) {
          what.x = this.x + what.size;
        } else {
          what.x = this.x + this.size - what.size;
        }
      }
      if (what.y < this.y + what.size) {
        what.speedY *= -0.99;
        what.y = this.y + what.size;
      }
      if (what.y >= this.y + this.size -(what.size)-(what.limbLength/2.5)) {
        what.y = this.y + this.size -(what.size)-(what.limbLength/2.5);
        what.hitAFloor();
      }
    }
  };
}

/**
* function to return a random gender
* @return {string} the gender
*/
function randomGender() {
  if (Math.random() < 0.004) {
    return 'Non Binary';
  } else {
    let base = Math.round(Math.random());
    if (base == 0) {
      return 'Male';
    }
    return 'Female';
  }
}

function generateChildBreedText(parent1, parent2) {
  // put the two strings into an array
  let specBreed = 'None';
  let parentStrings = [parent1.breed, parent2.breed];
  // split each string by spaces
  let p1split = parent1.breed.split(' ');
  let p2split = parent2.breed.split(' ');
  // remove the albino tag if present
  if (p1split[p1split.length-1] == 'albino' || p1split[p1split.length-1] == 'Albino') {
    p1split.splice(p1split.length-1, 1);
  }
  if (p2split[p2split.length-1] == 'albino' || p2split[p2split.length-1] == 'Albino') {
    p2split.splice(p2split.length-1, 1);
  }
  // reconstruct the strings
  parentStrings[0] = p1split[0];
  for (let i = 1; i < p1split.length; i++) {
    parentStrings[0] += ' '+p1split[i];
  }
  parentStrings[1] = p2split[0];
  for (let i = 1; i < p2split.length; i++) {
    parentStrings[1] += ' '+p2split[i];
  }
  // if they are the same breed, the offspring is this as well
  if (parentStrings[0] == parentStrings[1]) {
    specBreed = parentStrings[0];
  } else {
    // calculate what to call this cross breed. ALlow for up to two breed names from each parent
    // set default weight on each breed (assuming neither is a cross)
    let breedScore1 = 2;
    let breedScore2 = 0;
    let breedScore3 = 2;
    let breedScore4 = 0;
    let breed1 = '';
    let breed2 = '';
    let breed3 = '';
    let breed4 = '';
    // split the strings around ' x ' this time to get each breed
    let p1split = parentStrings[0].split(' x ');
    let p2split = parentStrings[1].split(' x ');
    breed1 = p1split[0];
    breed3 = p2split[0];
    // if parent one is an 'x' cross breed reassign weights and string
    if (p1split.length > 1) {
      breed2 = p1split[1];
      breedScore1 = 1;
      breedScore2 = 1;
    } else {
      breedScore2 = 0;
      breed2 = '';
    }
    // if parent one is a cross breed reassign weights and string
    if (p2split.length > 1) {
      breed4 = p2split[1];
      breedScore3 = 1;
      breedScore4 = 1;
    } else {
      breedScore4 = 0;
      breed2 = '';
    }
    // if one of the breeds is 'None' remove it's weight
    if (breed1 == 'None') {
      breedScore1 = 0;
      breed1 = '';
    }
    if (breed3 == 'None') {
      breedScore3 = 0;
      breed3 = '';
    }

    // split again to remove 'cross' from any breed name and dock half it's breed score
    let b1Split = breed1.split(' ');
    if (b1Split[b1Split.length-1] == 'cross') {
      b1Split.splice(b1Split.length-1, 1);
      breedScore1 -= 1;
    }
    let b2Split = breed2.split(' ');
    if (b2Split[b2Split.length-1] == 'cross') {
      b2Split.splice(b2Split.length-1, 1);
      breedScore2 -= 1;
    }
    let b3Split = breed3.split(' ');
    if (b3Split[b3Split.length-1] == 'cross') {
      b3Split.splice(b3Split.length-1, 1);
      breedScore3 -= 1;
    }
    let b4Split = breed4.split(' ');
    if (b4Split[b4Split.length-1] == 'cross') {
      b4Split.splice(b4Split.length-1, 1);
      breedScore4 -= 1;
    }

    // reconstruct the strings
    breed1 = b1Split[0];
    for (let i = 1; i < b1Split.length; i++) {
      breed1 += ' '+b1Split[i];
    }
    breed2 = b2Split[0];
    for (let i = 1; i < b2Split.length; i++) {
      breed2 += ' '+b2Split[i];
    }

    breed3 = b3Split[0];
    for (let i = 1; i < b3Split.length; i++) {
      breed3 += ' '+b3Split[i];
    }

    breed4 = b4Split[0];
    for (let i = 1; i < b4Split.length; i++) {
      breed4 += ' '+b4Split[i];
    }

    // tidy up any duplicates
    if (breed1 == breed3 && breed3 !== '') {
      breedScore1 += 1;
      breedScore3 = 0;
    } else if (breed1 == breed4 && breed4 !== '') {
      breedScore1 += 1;
      breedScore4 = 0;
    }

    if (breed2 == breed3 && breed3 !== '') {
      breedScore2 += 1;
      breedScore3 = 0;
    } else if (breed2 == breed4 && breed4 !== '') {
      breedScore2 += 1;
      breedScore4 = 0;
    }

    // now calculate the weights
    let breedsWith2Points = [];
    if (breedScore1 >= 2) {
      breedsWith2Points.push(breed1);
    }
    if (breedScore2 >= 2) {
      breedsWith2Points.push(breed2);
    }
    if (breedScore3 >= 2) {
      breedsWith2Points.push(breed3);
    }
    if (breedScore4 >= 2) {
      breedsWith2Points.push(breed4);
    }

    if (breedsWith2Points.length == 1) {
      specBreed = breedsWith2Points[0] + ' cross';
    } else if (breedsWith2Points.length == 2) {
      // let lastsplit1 = breedsWith2Points[0].split(' ');
      // if (lastsplit1[lastsplit1.length-1] == 'cross') {
      //   lastsplit1.splice(lastsplit1.length-1, 1);
      //   // reconstruct the string
      //   breedsWith2Points[0] = lastsplit1[0];
      //   for (let i = 1; i < lastsplit1.length; i++) {
      //     breedsWith2Points[0] += ' '+lastsplit1[i];
      //   }
      // }
      // let lastsplit2 = breedsWith2Points[1].split(' ');
      // if (lastsplit2[lastsplit2.length-1] == 'cross') {
      //   lastsplit2.splice(lastsplit2.length-1, 1);
      //   // reconstruct the string
      //   breedsWith2Points[1] = lastsplit2[0];
      //   for (let i = 1; i < lastsplit2.length; i++) {
      //     breedsWith2Points[1] += ' '+lastsplit2[i];
      //   }
      // }
      if (breedsWith2Points[0].charAt(0) < breedsWith2Points[1].charAt(0)) {
        specBreed = breedsWith2Points[0] + ' x ' + breedsWith2Points[1];
      } else {
        specBreed = breedsWith2Points[1] + ' x ' + breedsWith2Points[0];
      }
    }
  }
  return specBreed;
}

/**
* function to collide two objects using physics
* @param {object} parent1 - the first parent
* @param {object} parent2 - the second parent
* @return {string} the gender of the baby
*/
function generateBaby(parent1, parent2, specBreed) {
  // male is parent1
  // female is parent2
  let babyGender = randomGender();

  // max age logic
  let ageSwitch = Math.round(Math.random()*2); // 0 to 2
  let specMaxAge = 1;
  if (ageSwitch == 0) {
    specMaxAge = ((parent1.maxAge*9) + Math.random())/10;
  } else if (ageSwitch == 1) {
    specMaxAge = ((parent2.maxAge*9) + Math.random())/10;
  } else {
    specMaxAge = (parent1.maxAge + parent2.maxAge + 12 + (Math.random()*8))/3;
  }
  // max size logic
  let sizeSwitch = Math.round(Math.random()*2); // 0 to 2
  let specSize = 1;
  if (sizeSwitch == 0) {
    specSize = ((parent1.maxSize*9) + ((Math.random()*9) + 7))/10;
  } else if (sizeSwitch == 1) {
    specSize = ((parent2.maxSize*9) + ((Math.random()*9) + 7))/10;
  } else {
    specSize = (parent1.maxSize + parent2.maxSize + ((Math.random()*9) + 7))/3;
  }
  // thickness logic
  let thickSwitch = Math.round(Math.random()*2); // 0 to 2
  let specThickness = 1;
  if (thickSwitch == 0) {
    specThickness = ((parent1.thickness*9) + Math.random())/10;
  } else if (thickSwitch == 1) {
    specThickness = ((parent2.thickness*9) + Math.random())/10;
  } else {
    specThickness = (parent1.thickness + parent2.thickness + Math.random())/3;
  }
  // legginess logic
  let legSwitch = Math.round(Math.random()*2); // 0 to 2
  let specLegginess = 1;
  if (legSwitch == 0) {
    specLegginess = ((parent1.legginess*9) + Math.random())/10;
  } else if (legSwitch == 1) {
    specLegginess = ((parent2.legginess*9) + Math.random())/10;
  } else {
    specLegginess = (parent1.legginess + parent2.legginess + Math.random())/3;
  }

  // tail logic
  let tailSwitch = Math.round(Math.random()*2);
  let specTail = 1;
  if (tailSwitch == 0) {
    specTail = ((parent1.tailLength*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (tailSwitch == 1) {
    specTail = ((parent2.tailLength*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specTail = (parent1.tailLength + parent2.tailLength + ((Math.random()*0.75)+0.25))/3;
  }

  // fang logic
  let fangSwitch = Math.round(Math.random()*2);
  let specFang = 1;
  if (fangSwitch == 0) {
    specFang = ((parent1.fangs*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (fangSwitch == 1) {
    specFang = ((parent2.fangs*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specFang = (parent1.fangs + parent2.fangs + ((Math.random()*0.75)+0.25))/3;
  }

  // nose position logic
  let noseSwitch = Math.round(Math.random()*2);
  let specNose = 1;
  if (noseSwitch == 0) {
    specNose = ((parent1.nosePos*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (noseSwitch == 1) {
    specNose = ((parent2.nosePos*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specNose = (parent1.nosePos + parent2.nosePos + ((Math.random()*0.75)+0.25))/3;
  }

  // eye size logic
  let eyeSwitch = Math.round(Math.random()*2);
  let specEyeSize = 1;
  if (eyeSwitch == 0) {
    specEyeSize = ((parent1.eyeSize*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (eyeSwitch == 1) {
    specEyeSize = ((parent2.eyeSize*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specEyeSize = (parent1.eyeSize + parent2.eyeSize + ((Math.random()*0.75)+0.25))/3;
  }

  // eye position logic X
  eyeSwitch = Math.round(Math.random()*2);
  let specEyeX = 1;
  if (eyeSwitch == 0) {
    specEyeX = ((parent1.eyePosX*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (eyeSwitch == 1) {
    specEyeX = ((parent2.eyePosX*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specEyeX = (parent1.eyePosX + parent2.eyePosX + ((Math.random()*0.75)+0.25))/3;
  }

  // eye position logic Y
  eyeSwitch = Math.round(Math.random()*2);
  let specEyeY = 1;
  if (eyeSwitch == 0) {
    specEyeY = ((parent1.eyePosY*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (eyeSwitch == 1) {
    specEyeY = ((parent2.eyePosY*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specEyeY = (parent1.eyePosY + parent2.eyePosY + ((Math.random()*0.75)+0.25))/3;
  }

  // head width
  let headSwitch = Math.round(Math.random()*2);
  let specHeadW = 1;
  if (headSwitch == 0) {
    specHeadW = ((parent1.headWidth*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (headSwitch == 1) {
    specHeadW = ((parent2.headWidth*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specHeadW = (parent1.headWidth + parent2.headWidth + ((Math.random()*0.75)+0.25))/3;
  }

  // head height
  headSwitch = Math.round(Math.random()*2);
  let specHeadH = 1;
  if (headSwitch == 0) {
    specHeadH = ((parent1.headHeight*9) + ((Math.random()*0.75)+0.25))/10;
  } else if (headSwitch == 1) {
    specHeadH = ((parent2.headHeight*9) + ((Math.random()*0.75)+0.25))/10;
  } else {
    specHeadH = (parent1.headHeight + parent2.headHeight + ((Math.random()*0.75)+0.25))/3;
  }

  // ear Width logic
  let earSwitch = Math.round(Math.random()*2); // 0 to 2
  let babyEars = 1;
  if (earSwitch == 0) {
    babyEars = ((parent1.earWidth*9) + Math.random())/10;
  } else if (earSwitch == 1) {
    babyEars = ((parent2.earWidth*9) + Math.random())/10;
  } else {
    babyEars = (parent1.earWidth + parent2.earWidth + Math.random())/3;
  }

  // ear Height logic
  earSwitch = Math.round(Math.random()*2); // 0 to 2
  babyEars2 = 1;
  if (earSwitch == 0) {
    babyEars2 = ((parent1.earHeight*9) + Math.random())/10;
  } else if (earSwitch == 1) {
    babyEars2 = ((parent2.earHeight*9) + Math.random())/10;
  } else {
    babyEars2 = (parent1.earHeight + parent2.earHeight + Math.random())/3;
  }
  chibis.push(new Chibi(parent1.x + ((parent2.x - parent1.x)/2), parent1.y + ((parent2.y - parent1.y)/2), specSize/3, specSize, babyGender));
  // set the baby's ears
  // set the baby's genetic colour
  let colour1 = 'red'; // for debug
  let colour2 = 'blue';
  let colour3 = 'green';
  // decide which method of colour logic to use for the genetic colour
  let seed = Math.round(Math.random()*2);
  if (seed == 0) {
    colour1 = parent1.firstColour;
  } else if (seed == 1) {
    colour1 = parent2.firstColour;
  } else {
    colour1 = mixTwoColours(parent1.firstColour, parent2.firstColour, Math.random());
  }
  // decide which method of colour logic to use for the second colour
  seed = Math.round(Math.random()*2);
  if (seed == 0) {
    colour2 = parent1.secondColour;
  } else if (seed == 1) {
    colour2 = parent2.secondColour;
  } else {
    colour2 = mixTwoColours(parent1.secondColour, parent2.secondColour, Math.random());
  }
  // decide which method of colour logic to use for the third colour
  seed = Math.round(Math.random()*2);
  if (seed == 0) {
    colour3 = parent1.thirdColour;
  } else if (seed == 1) {
    colour3 = parent2.thirdColour;
  } else {
    colour3 = mixTwoColours(parent1.thirdColour, parent2.thirdColour, Math.random());
  }
  // decide which method of colour logic to use for the eyes
  seed = Math.round(Math.random()*2);
  let eyeColour;
  if (seed == 0) {
    eyeColour = parent1.eyeColour;
  } else if (seed == 1) {
    eyeColour = parent2.eyeColour;
  } else {
    eyeColour = mixTwoColours(parent1.eyeColour, parent2.eyeColour, Math.random());
  }

  // pattern logic
  let patternSwitch = Math.round(Math.random()*2); // 0 to 2.
  if (patternSwitch == 0) {
    chibis[chibis.length-1].patternAlpha = ((parent1.patternAlpha*9) + Math.random())/10;
  } else if (patternSwitch == 1) {
    chibis[chibis.length-1].patternAlpha = ((parent2.patternAlpha*9) + Math.random())/10;
  } else {
    chibis[chibis.length-1].patternAlpha = (parent1.patternAlpha + parent2.patternAlpha + Math.random())/3;
  }

  patternSwitch = Math.round(Math.random()); // 0 to 1.
  if (patternSwitch == 0) {
    chibis[chibis.length-1].pattern = parent1.pattern;
  } else {
    chibis[chibis.length-1].pattern = parent2.pattern;
  }

  // coat logic
  let coatSwitch = Math.round(Math.random()*2); // 0 to 2
  if (coatSwitch == 0) {
    chibis[chibis.length-1].coatMod[0] = ((parent1.coatMod[0]*9) + Math.random())/10;
  } else if (coatSwitch == 1) {
    chibis[chibis.length-1].coatMod[0] = ((parent2.coatMod[0]*9) + Math.random())/10;
  } else {
    chibis[chibis.length-1].coatMod[0] = (parent1.coatMod[0] + parent2.coatMod[0] + Math.random())/3;
  }
  coatSwitch = Math.round(Math.random()*2); // 0 to 2
  if (coatSwitch == 0) {
    chibis[chibis.length-1].coatMod[1] = ((parent1.coatMod[1]*9) + Math.random())/10;
  } else if (coatSwitch == 1) {
    chibis[chibis.length-1].coatMod[1] = ((parent2.coatMod[1]*9) + Math.random())/10;
  } else {
    chibis[chibis.length-1].coatMod[1] = (parent1.coatMod[1] + parent2.coatMod[1] + Math.random())/3;
  }
  // check for genetic conditions being passed down
  // albino
  let albinoChance = 0;
  if (parent1.albinoGene && parent2.albinoGene) {
    albinoChance = 0.5;
  } else if (parent1.albinoGene || parent2.albinoGene) {
    albinoChance = 0.25;
  }
  if (albinoChance >= Math.random()) {
    chibis[chibis.length-1].albinoGene = true;
    chibis[chibis.length-1].pattern = 2;
    if (0.5 <= Math.random()) {
      breedAlbino(chibis[chibis.length-1]);
      if (chibis[chibis.length-1].breed == 'None') {
        chibis[chibis.length-1].breed = 'Albino';
      } else {
        chibis[chibis.length-1].breed += ' albino';
      }
    }
  }

  // sphynx
  let sphynxGene = 0;
  if (parent1.sphynxGene && parent2.sphynxGene) {
    sphynxGene = 0.25;
  } else if (parent1.sphynxGene || parent2.sphynxGene) {
    sphynxGene = 0.125;
  }
  if (sphynxGene > 0) {
    if ((sphynxGene*2) >= Math.random()) {
      chibis[chibis.length-1].sphynxGene = true;
      if (0.5 <= Math.random()) {
        chibis[chibis.length-1].sphynx = true;
      }
    }
  }
  if (chibis[chibis.length-1].breed == 'Sphynx' && !chibis[chibis.length-1].sphynx) {
    chibis[chibis.length-1].breed = 'None';
  }

  // mixing in a little randomness to the colours
  let seedC = Math.random();
  if (seedC < 0.0625) {
    // rotate the colour positions 1/8 of the time
    chibis[chibis.length-1].firstColour = mixTwoColours(randomColour(), colour3, Math.random()*0.025);
    chibis[chibis.length-1].secondColour = mixTwoColours(randomColour(), colour1, Math.random()*0.025);
    chibis[chibis.length-1].thirdColour = mixTwoColours(randomColour(), colour2, Math.random()*0.025);
  } else if (seedC < 0.125) {
    chibis[chibis.length-1].firstColour = mixTwoColours(randomColour(), colour2, Math.random()*0.025);
    chibis[chibis.length-1].secondColour = mixTwoColours(randomColour(), colour3, Math.random()*0.025);
    chibis[chibis.length-1].thirdColour = mixTwoColours(randomColour(), colour1, Math.random()*0.025);
  } else {
    chibis[chibis.length-1].firstColour = mixTwoColours(randomColour(), colour1, Math.random()*0.025);
    chibis[chibis.length-1].secondColour = mixTwoColours(randomColour(), colour2, Math.random()*0.025);
    chibis[chibis.length-1].thirdColour = mixTwoColours(randomColour(), colour3, Math.random()*0.025);
  }
  chibis[chibis.length-1].eyeColour = mixTwoColours(randomColour(), eyeColour, Math.random()*0.025);

  let heterochromiaChance = 0;
  if (parent1.eyeColour !== parent1.eyeColour2) {
    heterochromiaChance ++;
  }
  if (parent2.eyeColour !== parent2.eyeColour2) {
    heterochromiaChance ++;
  }
  if (heterochromiaChance > Math.random()*4) {
    breedHeteroChromia(chibis[chibis.length-1], 0);
  } else {
    chibis[chibis.length-1].eyeColour2 = chibis[chibis.length-1].eyeColour;
  }

  if (chibis[chibis.length-1].gender == 'Male' && Math.random() > 1/3000) {
    chibis[chibis.length-1].thirdColour = chibis[chibis.length-1].firstColour;
  }
  let tmpBodypartCode = [];
  for (let i = 0; i < parent1.bodypartCode.length; i++) {
    if (Math.random() < 0.5) {
      tmpBodypartCode.push(parent1.bodypartCode[i]);
    } else {
      tmpBodypartCode.push(parent2.bodypartCode[i]);
    }
  }
  chibis[chibis.length-1].breed = specBreed;
  chibis[chibis.length-1].thickness = specThickness;
  chibis[chibis.length-1].legginess = specLegginess;
  chibis[chibis.length-1].tailLength = specTail;
  chibis[chibis.length-1].bodypartCode = tmpBodypartCode;
  chibis[chibis.length-1].nosePos = specNose;
  chibis[chibis.length-1].eyePosX = specEyeX;
  chibis[chibis.length-1].eyePosY = specEyeY;
  chibis[chibis.length-1].eyeSize = specEyeSize;
  chibis[chibis.length-1].headWidth = specHeadW;
  chibis[chibis.length-1].headHeight = specHeadH;
  chibis[chibis.length-1].maxAge = specMaxAge;
  chibis[chibis.length-1].speedY = -10;
  chibis[chibis.length-1].fangs = specFang;
  chibis[chibis.length-1].earWidth = babyEars;
  chibis[chibis.length-1].earHeight = babyEars2;
  return babyGender;
}

/**
* function to describe a Chibi
* @param {int} x - the x pos
* @param {int} y - the y pos
* @param {int} bodySize - the size
* @param {int} maxSize - the maximum possible size
* @param {string} gender - the sex of the mate
* @param {int} ears - the ear modifier (cat -> fox);
*/
function Chibi(x, y, bodySize, maxSize, gender) {
  this.id = ('0000' + guyID).slice(-4);
  guyID++;
  this.breed = 'None';
  this.inCatBox = null;
  this.i = ''; // temp for debug
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.rotation = 0;
  this.spin = 0;
  this.gender = gender;
  this.firstColour = trueWhite;
  this.secondColour = trueWhite;
  this.thirdColour = trueWhite;
  this.skinColour1 = trueWhite;
  this.skinColour2 = trueWhite;
  this.skinColour3 = trueWhite;
  this.eyeColour = trueWhite;
  this.eyeColour2 = trueWhite;
  this.nosePos = 0;
  this.eyePosX = 0;
  this.eyePosY = 0;
  this.eyeSize = 0;
  this.headWidth = 0;
  this.headHeight = 0;
  this.coatMod = [1, 1];
  this.patternAlpha = 0;
  this.pattern = 0;
  this.bodypartCode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.fangs = 0.5; // [style, length]
  this.earWidth = 0.5; // 0.5 is average
  this.earHeight = 0.5;
  this.thickness = 0; // 0.5 is average
  this.legginess = 0;
  this.angleToFocus = 0;
  this.size = bodySize;
  this.cellShadeThickness = this.size/10;
  this.cellShadeLine = '';
  this.limbLength = (this.size)+(1.5*this.legginess*this.size); // 10 to 16 + 0 to 6 == 16 to 6
  this.tailLength = 0;
  this.maxSize = maxSize;
  this.maxAge = 14;
  this.hitBottom = false;
  this.sitting = false;
  this.health = 100;
  this.love = 50;
  this.energy = 100;
  this.hunger = 1000;
  this.snuggling = -1; // start at -1 so they dont try to give birth when they are not truly snuggling
  this.nomnomnom = -1; // as above
  this.awake = true;
  this.litters = 0;
  this.birthday = daytimeCounter;
  this.age = 0;
  this.name = null;
  this.elder = false;
  this.reachedNirvana = false;
  this.focus = fireflies[0];
  this.hitFocus = false;
  this.partner = null;
  this.mother = null;
  this.jumpY = trueBottom;
  this.facingForwards = true;
  // interaction
  this.dragging = false;
  // genetic conditions
  this.albino = false;
  this.albinoGene = false;
  this.sphynx = false;
  this.sphynxGene = false;
  this.kill = function() {
    removeFocusFrom(this);
    chibis.splice(findIndex(this, chibis), 1);
  };
  // function to reinitialisae sizes (for growth)
  this.reinitSizeAndColour = function() {
    this.limbLength = (this.size)+(1.5*this.legginess*this.size);
    this.cellShadeThickness = this.size/10;
    if (this.albino && !this.sphynx) {
      this.cellShadeLine = mixTwoColours(trueWhite, trueBlack, 0.7);
    } else if (this.sphynx || this.pattern == 5) {
      this.cellShadeLine = mixTwoColours(nosePink, noseBlack, 0.5);
    } else {
      this.cellShadeLine = mixTwoColours(mixThreeColours(this.firstColour, this.secondColour, this.thirdColour), trueBlack, 0.7);
    }
    if (this.albino) {
      this.skinColour1 = nosePink;
    } else {
      this.skinColour1 = skinColourCheck(this.firstColour);
      this.skinColour2 = skinColourCheck(this.secondColour);
      this.skinColour3 = skinColourCheck(this.thirdColour);
    }
  };
  // reset rotation
  this.resetRotation = function(fastest) {
    // if we are close enough, just stop
    // if we want to do this the quickest way
    if (fastest) {
      if (this.rotation > 3) {
        this.rotation += 0.1;
      } else if (this.rotation < -3) {
        this.rotation -= 0.1;
      } else if (this.rotation > 0) {
        this.rotation -= 0.1;
      } else {
        this.rotation += 0.1;
      }
      // if we want to spin down
    } else {
      if (this.spin < 0) {
        this.rotation -= 0.1;
      } else {
        this.rotation += 0.1;
      }
    }
    if (Math.abs(this.rotation) <= 0.5 || Math.abs(this.rotation) >= 5.5) {
      this.spin = 0;
      this.rotation = 0;
    }
  };

  this.focusIsFirefly = function() {
    isFireFly = false;
    for (let i = 0; i < fireflies.length; i++) {
      if (this.focus == fireflies[i]) {
        isFireFly = true;
      }
    }
    return isFireFly;
  };
  // act
  // @return {boolean} - whether the action has a cost
  this.act = function() {
    if (choosingChibi && this.snuggling == 0 && this.gender == 'Female') {
      if (!chosenKitten) {
        if (selection == null) {
          selection = chibis[Math.round(Math.random()*(boxes.length-1))+currentChibis];
        }
        handleButton(1);
      } else {
        handleButton(13);
      }
    }
    // giving birth
    if (!choosingChibi && this.snuggling == 0 && this.gender == 'Female') {
      if (this.partner !== null) {
        this.partner.snuggling = -1;
        this.partner.partner = null;
        createGlyphs((this.x - (this.x - this.partner.x)/2), (this.y - (this.y - this.partner.y)/2), '\u2764');
        initLitter(this.partner, this);
        // take snuggling to -1 so that it doesn't give birth forever
      } else {
        sendMessage(this.name + ' had a phantom pregnancy');
      }
      this.snuggling = -1;
      this.partner = null;
    } else if ((this.snuggling >= 0)) {
      this.snuggling --;
    } else if (this.inCatBox == null && this.nomnomnom >= 0) {
      // if you're eating, decrease the eating timer
      this.nomnomnom --;
    } else {
      // deciding what the focus is
      // decide whether to act this frame
      let chanceToAct = Math.random();
      // twice as likely to act if infant
      if (this.age < maturesAt) {
        chanceToAct *= 0.5;
      }
      if (chanceToAct <= 0.03) {
        // decide what to target
        let target = null;
        // if not an adult, just follow mother
        if (this.age < maturesAt && this.mother !== null) {
          this.focus = this.mother;
          target = this.mother;
        }
        // are we hungry?
        if (target == null && this.inCatBox == null && this.hunger <= 250 && fruits.length > 0) {
          let closestFruit = this.findClosestFruit();
          if (closestFruit !== 'X') {
            this.focus = closestFruit;
            target = closestFruit;
          }
        }
        // are we gonna pick a mate?
        if (target == null && !choosingChibi && !this.elder && this.gender == 'Male' && this.age >= maturesAt && chibis.length <= maxPop && this.health >= 50
        && this.energy >= 50) {
          for (let j = 0; j < chibis.length && target == null; j++) {
            if (this !== chibis[j] && chibis[j].snuggling == -1 && chibis[j].awake && this.love + chibis[j].love >= 100 && !chibis[j].elder && chibis[j].gender == 'Female'
            && chibis[j].age >= maturesAt && chibis[j].health >= 50
            && chibis[j].energy >= 50) {
              this.partner = chibis[j];
              chibis[j].partner = this;
              target = chibis[j];
            }
          }
        }
        if (target == null) {
          // default action - jump at firefly
          this.focus = fireflies[this.findClosestFireFly()];
        }
        // actually jumping now
        // one in ten chance of speaking
        if (Math.random() <= 0.05) {
          speech.push(new Speak(this, neutralWord()));
        }

        // kittens sitting down near their mothers
        if (this.age < maturesAt && this.mother !== null && (Math.abs(this.x - this.mother.x) < (this.size + this.mother.size)*4) && (Math.abs(this.y - this.mother.y) < (this.size + this.mother.size)*4)) {
          if (this.mother.awake) {
            this.sitting = true;
            this.facingForwards = true;
          } else if (this.nomnomnom == -1) {
            this.energy = this.mother.energy - (Math.random()*5);
            this.awake = false;
            this.sitting = false;
            this.facingForwards = true;
          }
        } else {
          if (this.focus.y <= this.y + this.size) {
            this.speedY = -this.size;
            let targetangle = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
            this.speedX += Math.cos(targetangle)*40;
            this.speedY += Math.sin(targetangle)*40;
            if (this.age < maturesAt) {
              this.speedX *= 0.5;
              this.speedY *= 0.5;
            } else {
              // it doesn't cost kittens energy or health to jump
              this.energy -= 7;
              this.health -= 1;
              if (this.energy <= 0) {
                this.facingForwards = false;
              }
            }
            this.y--;
            this.sitting = false;
            // one in ten jumps is facing backwards
            if (Math.random() < 1/10) {
              this.facingForwards = false;
            }
            // this.hitBottom = false;
          }
        }
      } else if (chanceToAct < 0.06) {
        this.sitting = true;
      }
    }
  };
  this.findClosestFruit = function() {
    let tmp = maxDistance;
    let target = 'X';
    for (let f = 0; f < fruits.length; f++) {
      let tmpX = this.x-fruits[f].x;
      let tmpY = this.y-fruits[f].y;
      let distance = Math.sqrt((tmpX*tmpX)+(tmpY*tmpY));
      // only jump for fruits within your range
      if (fruits[f].eaterId == null && distance < tmp && fruits[f].y >= trueBottom - (trueBottom - this.jumpY - this.size) && fruits[f].y < trueBottom - this.size) {
        tmp = distance;
        target = fruits[f];
      }
    }
    return target;
  };
  this.findClosestFireFly = function() {
    let tmp = maxDistance;
    let target = 'X';
    for (let i = 0; i < fireflies.length; i++) {
      let tmpX = this.x-fireflies[i].x;
      let tmpY = this.y-fireflies[i].y;
      let distance = Math.sqrt((tmpX*tmpX)+(tmpY*tmpY));
      if (distance < tmp) {
        tmp = distance;
        target = i;
      }
    }
    if (target == 'X') {
      console.log('no FireFly to target');
      return 0;
    }
    return target;
  };

  // check for bounces on walls and landing on trees
  this.physicsCheck = function() {
    this.hitBottom = false;
    // check if mate hit a Tree
    let hitTree = false;
    for (let i = 0; i < trees.length && !hitTree; i++) {
      if (this.x >= trees[i].x + (this.size/2) - (trees[i].width/2) && this.x <= trees[i].x - (this.size/2) + (trees[i].width/2) && this.y >= trees[i].y - (this.size) - (this.limbLength/2.5) - (this.size/2) && this.y <= trees[i].y+ trees[i].height && this.speedY >= 0) {
        this.y = trees[i].y-(this.size)-(this.limbLength/2.5);
        trees[i].loadthisframe += this.size;
        hitTree = true;
        this.hitAFloor();
        if (this.nomnomnom <= 0 && this.snuggling <= 0) {
          this.energy -= 0.01;
        }
        if (this.y > trueBottom-(this.size)-(this.limbLength/2.5)) {
          this.y = trueBottom-(this.size)-(this.limbLength/2.5);
        }
      }
    }
    checkBounceSides(this);
    checkBounceTop(this);
    if (choosingChibi) {
      for (let i = 0; i < boxes.length; i++) {
        boxes[i].checkBounce(this);
      }
      if (!chosenKitten) {
        for (let i = 0; i < parentBoxes.length; i++) {
          parentBoxes[i].checkBounce(this);
        }
      }
    }

    // check if chibi hit the floor, come to a rest if so
    if (!this.hitBottom && this.y >= trueBottom-(this.size)-(this.limbLength/2.5)) {
      this.y = trueBottom-(this.size)-(this.limbLength/2.5);
      this.hitAFloor();
    }
  };
  this.hitAFloor = function() {
    this.speedY = 0;
    if (this.energy <= 0 && this.nomnomnom == -1 && this.snuggling == -1) {
      // fall asleep when tired
      this.sitting = false;
      this.awake = false;
      this.facingForwards = true;
      this.speedX = 0;
      this.rotation = 0;
      this.spin = 0;
    } else {
      this.hitBottom = true;
      this.facingForwards = true;
      // apply floor forces
      this.speedX *= 0.92;
      this.resetRotation(false);
      // jump occasionally
      if (!this.dragging && this.rotation == 0 && this.awake && this.inCatBox == null) {
        this.act();
        // this.hitBottom = false;
      }
    }
  };

  this.drawTail = function(pat, backendShiftX, backendShiftY, sleepshift) {
    // tail
    // make it wag
    let tmp = Math.abs(daytimeCounter-this.birthday);
    while (tmp > 30 && tmp > 0) {
      tmp -= 30; // 0 to 30
    }
    tmp = Math.abs(tmp-15); // 0 to 15 to 0 to 15
    ctx.save();
    if (this.sitting && this.awake && !this.facingForwards) {
      ctx.translate(0, -this.size);
    }
    if (!this.hitBottom && this.awake) {
      tmp = 0;
      ctx.translate(-backendShiftX, -backendShiftY);
      ctx.rotate(90 * Math.PI / 180);
      ctx.rotate(Math.atan2(-this.speedY, -this.speedX));
    }
    if (this.hitBottom || !this.awake) {
      ctx.translate(0, sleepshift - this.size);
    }
    let tailGradient = trueWhite;
    if (this.sphynx) {
      if (this.bodypartCode[6] == 0) {
        tailGradient = this.skinColour1;
      } else if (this.bodypartCode[6] == 1) {
        tailGradient = this.skinColour2;
      } else {
        tailGradient = this.skinColour3;
      }
    } else if (!this.albino && !this.sphynx) {
      tailGradient = ctx.createRadialGradient(0, this.size, 1, 0, 0, this.size*4);
      tailGradient.addColorStop(0, trueBlack);
      if (this.bodypartCode[6] == 0) {
        tailGradient.addColorStop(0, this.secondColour);
        tailGradient.addColorStop(this.coatMod[0], this.firstColour);
        tailGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[6] == 1) {
        tailGradient.addColorStop(0, this.thirdColour);
        tailGradient.addColorStop(this.coatMod[0], this.secondColour);
        tailGradient.addColorStop(1, this.secondColour);
      } else {
        tailGradient.addColorStop(0, this.firstColour);
        tailGradient.addColorStop(this.coatMod[0], this.thirdColour);
        tailGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino) {
      tailGradient = trueWhite;
    } else {
      tailGradient = nosePink;
    }
    ctx.fillStyle = tailGradient;
    ctx.lineWidth = 2*this.cellShadeThickness;
    ctx.strokeStyle = this.cellShadeLine;
    ctx.beginPath();
    ctx.moveTo(+this.size/3, (this.size/3));
    ctx.arc((this.size*(-tmp+7.5)*this.tailLength/8*this.thickness)-(this.size/32), (this.size/3)-(2*this.tailLength*this.size), (this.size/3*this.thickness*2), 0, Math.PI, true);// Mouth (clockwise)
    ctx.lineTo(-this.size/3, this.size/3);
    ctx.stroke();
    ctx.fill();
    if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
      ctx.fillStyle = pat;
      ctx.globalAlpha = this.patternAlpha;
      ctx.beginPath();
      ctx.moveTo(+this.size/3, (this.size/3));
      ctx.arc((this.size*(-tmp+7.5)*this.tailLength/8*this.thickness)-(this.size/32), (this.size/3)-(2*this.tailLength*this.size), (this.size/3*this.thickness*2), 0, Math.PI, true);// Mouth (clockwise)
      ctx.lineTo(-this.size/3, this.size/3);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    // if (!this.hitBottom && this.awake) {
    //   ctx.rotate(-Math.atan2(-this.speedY, -this.speedX));
    // }

    // butthole
    if (!this.facingForwards) {
      ctx.translate(0, this.size);
      ctx.globalAlpha = 0.3;
      ctx.drawImage(butthole, -(this.size/3), -this.size/3, this.size/1.5, this.size/1.5);
      ctx.globalAlpha = 1;
    }

    ctx.restore(); // 0 - rotated
  };

  this.drawBackLegs = function(pat, backendShiftX, backendShiftY, bodyGradient, sameDirection, legAngle) {
    let footPat = pat;
    if (this.awake && this.energy > 0) {
      let leftFootColour = trueWhite;
      let rightFootColour = trueWhite;
      if (this.sphynx) {
        if (this.bodypartCode[7] == 0) {
          leftFootColour = this.skinColour1;
        } else if (this.bodypartCode[7] == 1 ) {
          leftFootColour = this.skinColour2;
        } else {
          leftFootColour = this.skinColour3;
        }
        if (this.bodypartCode[8] == 0) {
          rightFootColour = this.skinColour1;
        } else if (this.bodypartCode[8] == 1 ) {
          rightFootColour = this.skinColour2;
        } else {
          rightFootColour = this.skinColour3;
        }
      }
      if (!this.albino && !this.sphynx) {
        leftFootColour = this.firstColour;
        rightFootColour = this.firstColour;
        if (this.bodypartCode[7] == 0) {
          leftFootColour = this.firstColour;
        } else if (this.bodypartCode[7] ==1 ) {
          leftFootColour = this.secondColour;
        } else {
          leftFootColour = this.thirdColour;
        }

        if (this.bodypartCode[8] == 0) {
          rightFootColour = this.firstColour;
        } else if (this.bodypartCode[8] ==1 ) {
          rightFootColour = this.secondColour;
        } else {
          rightFootColour = this.thirdColour;
        }
      } else if (this.albino && this.sphynx) {
        leftFootColour = nosePink;
        rightFootColour = nosePink;
      }
      ctx.lineWidth = (this.size/2.5)*this.thickness*2;
      ctx.save(); // 0 open - rotated
      ctx.translate(this.x - backendShiftX, this.y - backendShiftY);
      if (!this.hitBottom) {
        ctx.rotate(this.rotation);
      }
      // back legs
      // CELL SHADING
      ctx.fillStyle = this.cellShadeLine;
      ctx.strokeStyle = this.cellShadeLine;
      ctx.lineWidth += this.cellShadeThickness;

      ctx.save(); // 1 open
      ctx.translate(-(this.size/2.5), (this.size/2));
      if (!this.hitBottom) {
        if (sameDirection) {
          ctx.rotate(this.angleToFocus);
          ctx.rotate(90 * Math.PI / 180);
        } else {
          ctx.rotate(legAngle);
        }
      }
      ctx.beginPath();
      if (this.awake && this.sitting) {
        ctx.moveTo(0, - (this.size/2));
      } else {
        ctx.moveTo(0, 0);
      }
      ctx.lineTo(0, this.limbLength*0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, this.limbLength*0.6, (this.size/3.5*this.thickness*2) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore(); // 1 close

      ctx.save(); // 1 open
      ctx.translate((this.size/2.5), (this.size/2));
      if (!this.hitBottom) {
        if (sameDirection) {
          ctx.rotate(this.angleToFocus);
          ctx.rotate(90 * Math.PI / 180);
        } else {
          ctx.rotate(-legAngle);
        }
      }
      ctx.beginPath();
      if (this.awake && this.sitting) {
        ctx.moveTo(0, - (this.size/2));
      } else {
        ctx.moveTo(0, 0);
      }
      ctx.lineTo(0, this.limbLength*0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, this.limbLength*0.6, (this.size/3.5*this.thickness*2) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore(); // 1 close
      ctx.lineWidth -= this.cellShadeThickness;
      // REAL DRAWING
      ctx.strokeStyle = bodyGradient;
      ctx.fillStyle = bodyGradient;
      // don't rotate if we have hit the bottom
      ctx.save(); // 1 open
      ctx.translate(-(this.size/2.5), (this.size/2));
      if (!this.hitBottom) {
        if (sameDirection) {
          ctx.rotate(this.angleToFocus);
          ctx.rotate(90 * Math.PI / 180);
        } else {
          ctx.rotate(legAngle);
        }
      }
      ctx.beginPath();
      if (this.awake && this.sitting) {
        ctx.moveTo(0, - (this.size/2));
      } else {
        ctx.moveTo(0, 0);
      }
      ctx.lineTo(0, this.limbLength*0.6);
      ctx.stroke();
      ctx.fillStyle = leftFootColour;
      ctx.beginPath();
      ctx.arc(0, this.limbLength*0.6, this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = footPat;
        ctx.strokeStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        if (this.awake && this.sitting) {
          ctx.moveTo(- backendShiftX, - (this.size/2) - backendShiftY);
        } else {
          ctx.moveTo(0, 0);
        }
        ctx.lineTo(0, this.limbLength*0.6);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, this.limbLength*0.6, this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.restore(); // 1 close
      ctx.save(); // 1 open
      ctx.translate((this.size/2.5), (this.size/2));
      if (!this.hitBottom) {
        if (sameDirection) {
          ctx.rotate(this.angleToFocus);
          ctx.rotate(90 * Math.PI / 180);
        } else {
          ctx.rotate(-legAngle);
        }
      }
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      if (this.awake && this.sitting) {
        ctx.moveTo(0, - (this.size/2));
      } else {
        ctx.moveTo(0, 0);
      }
      ctx.lineTo(0, this.limbLength*0.6);
      ctx.stroke();
      ctx.fillStyle = rightFootColour;
      ctx.beginPath();
      ctx.arc(0, this.limbLength*0.6, this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = footPat;
        ctx.strokeStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        if (this.awake && this.sitting) {
          ctx.moveTo(0, - this.size);
        } else {
          ctx.moveTo(0, 0);
        }
        ctx.lineTo(0, this.limbLength*0.6);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, this.limbLength*0.6, this.size/3.5*this.thickness*2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.restore(); // 1 close
      ctx.restore(); // 0 close
    }
  };

  this.drawIcons = function() {
    ctx.save(); // 0
    ctx.translate(this.x, this.y);
    // zzzzs
    if (!this.awake) {
      ctx.fillStyle = trueWhite;
      ctx.font = '10px' + ' ' + globalFont;
      let amntToMove = this.energy; // 0 to 10
      while (amntToMove > 10) {
        amntToMove -= 10;
      }
      while (amntToMove < 0) {
        amntToMove += 10;
      }
      ctx.globalAlpha = (1 - (amntToMove/10))/2;
      amntToMove *= 2;
      ctx.fillText('z', 0, this.size-amntToMove);
      ctx.font = '7px' + ' ' + globalFont;
      ctx.fillText('z', 6, this.size-7-amntToMove);
      ctx.font = '3px' + ' ' + globalFont;
      ctx.fillText('z', 12, this.size-14-amntToMove);
    }

    // hearts
    if (this.snuggling > 0) {
      ctx.fillStyle = '#e94db5';
      ctx.font = '20px' + ' ' + globalFont;
      let amntToMove = this.snuggling; // 0 to 250
      while (amntToMove > 40) {
        amntToMove -= 40;
      }
      while (amntToMove < 0) {
        amntToMove += 40;
      }
      ctx.globalAlpha = (1 - (amntToMove/40))/2;
      amntToMove *= 1;
      ctx.fillText('\u2764', -10, -(this.size*4)+amntToMove);
    }

    // eating noms
    if (this.nomnomnom > 0) {
      ctx.fillStyle = trueWhite;
      ctx.font = '10px' + ' ' + globalFont;
      let alphaShift = this.nomnomnom; // 0 to 250
      while (alphaShift > 40) {
        alphaShift -= 40;
      }
      while (alphaShift < 0) {
        alphaShift += 40;
      }
      ctx.globalAlpha = (1 - (alphaShift/40))/2;
      if (ctx.globalAlpha >= 0.25) {
        ctx.save();
        ctx.rotate(0.5);
        ctx.fillText('*nom*', -25, -this.size);
        ctx.restore();
      }
      ctx.globalAlpha = alphaShift/40/2;
      if (ctx.globalAlpha >= 0.25) {
        ctx.save();
        ctx.rotate(-0.5);
        ctx.fillText('*nom*', -2, -this.size);
        ctx.restore();
      }
    }

    ctx.globalAlpha = 1;
    ctx.restore(); // 0
  };

  this.drawBody = function(pat, backendShiftX, backendShiftY, bodyGradient) {
    // body balls
    let tmp = Math.abs(daytimeCounter-this.birthday);
    while (tmp > 15 && tmp > 0) {
      tmp -= 15; // 0 to 30
    }
    tmp *= 0.5;
    tmp = Math.abs(tmp-3.75); // -0 to -3.75 to 0 to 3.75
    // bum sticking in the air
    ctx.fillStyle = bodyGradient;
    ctx.strokeStyle = this.cellShadeLine;
    ctx.lineWidth = 2*this.cellShadeThickness;
    ctx.beginPath();
    if (this.sitting && this.awake) {
      // make the butt wag
      ctx.beginPath();
      ctx.arc(-tmp+1.875, -this.size, this.thickness*this.size*1.8, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      // belly piece
      ctx.beginPath();
      ctx.arc(-backendShiftX/4, -this.size - this.backendShiftY/4, this.thickness*this.size*1.8, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        // butt
        ctx.beginPath();
        ctx.arc(-tmp+1.875, -this.size, this.thickness*this.size*1.8, 0, 2 * Math.PI);
        ctx.fill();
        // belly
        ctx.beginPath();
        ctx.arc(-backendShiftX/4, -this.size - this.backendShiftY/4, this.thickness*this.size*1.8, 0, 2 * Math.PI);
        ctx.fill();

        if (this.pattern == 3) {
          let fadeGrad = ctx.createLinearGradient(0, -this.thickness*this.size*1.8/2, 0, this.thickness*this.size*1.8);
          fadeGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
          fadeGrad.addColorStop(1, this.firstColour);
          ctx.fillStyle = fadeGrad;
          ctx.beginPath();
          ctx.arc(-tmp+1.875, -this.size, this.thickness*this.size*1.8, 0, 2 * Math.PI);
          ctx.fill();
        }
        if (this.pattern == 6) { // pattern6
          let bGradient = ctx.createRadialGradient(0, this.size, 0, 0, 0, this.size*3);
          ctx.globalAlpha = 0.5;
          bGradient.addColorStop(0, this.thirdColour);
          bGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = bGradient;
          ctx.arc(-backendShiftX/4, -this.size - this.backendShiftY/4, this.thickness*this.size*1.8, 0, 2 * Math.PI);
          ctx.arc(-tmp+1.875, -this.size, this.thickness*this.size*1.8, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    } else if (this.awake) {
      // butt
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.arc(-(this.size/32) - backendShiftX, - backendShiftY, this.thickness*this.size*1.8, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      // belly piece
      ctx.beginPath();
      ctx.arc(-(this.size/32) - backendShiftX/4, - backendShiftY/4, this.thickness*this.size*1.8, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc(-(this.size/32) - backendShiftX/4, - backendShiftY/4, this.thickness*this.size*1.8, 0, 2 * Math.PI);
        ctx.arc(-(this.size/32) - backendShiftX, - backendShiftY, this.thickness*this.size*1.8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (this.pattern == 3) {
          let fadeGrad = ctx.createLinearGradient(0, -this.thickness*this.size*1.8/2, 0, this.thickness*this.size*1.8);
          fadeGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
          fadeGrad.addColorStop(1, this.firstColour);
          ctx.fillStyle = fadeGrad;
          ctx.beginPath();
          ctx.arc(-(this.size/32) - backendShiftX, - backendShiftY, this.thickness*this.size*1.8, 0, 2 * Math.PI);
          ctx.fill();
        }
        if (this.pattern == 6) { // pattern6
          let bGradient = ctx.createRadialGradient(0, this.size, 0, 0, 0, this.size*3);
          ctx.globalAlpha = 0.5;
          bGradient.addColorStop(0, this.thirdColour);
          bGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = bGradient;
          ctx.arc(-(this.size/32) - backendShiftX, - backendShiftY, this.thickness*this.size*1.8, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  };

  this.drawChest = function(pat, backendShiftX, backendShiftY, bodyGradient) {
    if (this.awake && !this.sitting) {
      ctx.globalAlpha = 1;
      // Chest
      // REAL DRAWING
      ctx.fillStyle = bodyGradient;
      ctx.strokeStyle = this.cellShadeLine;
      this.lineWidth = 2*this.cellShadeThickness;
      ctx.beginPath();
      ctx.arc(0, (this.size/2), this.size+(this.thickness*this.size/5), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      // chest coloured piece
      // default works for albino
      let chestColour = bodyGradient;
      if (this.albino && this.sphynx) {
        chestColour = nosePink;
      } else if (this.sphynx) {
        if (this.bodypartCode[12] == 0) {
          chestColour = this.skinColour1;
        } else if (this.bodypartCode[12] == 1) {
          chestColour = this.skinColour2;
        } else {
          chestColour = this.skinColour3;
        }
      } else if (!this.albino && !this.sphynx) {
        // lykoi just get body coloured piece
        // if (!this.pattern == 5) {
          if (this.bodypartCode[12] == 0) {
            chestColour.addColorStop(0, this.secondColour);
            chestColour.addColorStop(this.coatMod[0], this.firstColour);
            chestColour.addColorStop(0.5, this.firstColour);
          } else if (this.bodypartCode[12] == 1) {
            chestColour.addColorStop(0, this.thirdColour);
            chestColour.addColorStop(this.coatMod[0], this.secondColour);
            chestColour.addColorStop(0.5, this.secondColour);
          } else {
            chestColour.addColorStop(0, this.firstColour);
            chestColour.addColorStop(this.coatMod[0], this.thirdColour);
            chestColour.addColorStop(0.5, this.thirdColour);
          }
        // }

        // if (this.bodypartCode[12] == 0) {
        //   chestColour = this.firstColour;
        // } else if (this.bodypartCode[12] == 1) {
        //   chestColour = this.secondColour;
        // } else if (this.bodypartCode[12] == 2) {
        //   chestColour = this.thirdColour;
        // }
      }
      ctx.fillStyle = chestColour;
      ctx.beginPath();
      ctx.arc(0, this.size*0.9, (this.size+(this.thickness*this.size/5))/1.5, 0, 2 * Math.PI);
      ctx.fill();

      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5 && this.pattern !== 3) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.arc(0, (this.size/2), this.size+(this.thickness*this.size/5), 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.rotate(this.rotation);
    }
  };

  this.drawHead = function(pat, sleepshift) {
    let jowlPat = pat;
    // ears
    ctx.globalAlpha = 1;
    ctx.save(); // 0
    if (this.awake) {
      ctx.translate(-this.size, -this.size/2);
    } else {
      ctx.translate(-this.size, sleepshift);
    }
    oneq = this.size/2;
    let leftEarGradient = trueWhite;
    let rightEarGradient = trueWhite;
    if (this.sphynx) {
      if (this.bodypartCode[3] == 0) {
        leftEarGradient = this.skinColour1;
      } else if (this.bodypartCode[3] == 1) {
        leftEarGradient = this.skinColour2;
      } else {
        leftEarGradient = this.skinColour3;
      }
      if (this.bodypartCode[4] == 0) {
        rightEarGradient = this.skinColour1;
      } else if (this.bodypartCode[4] == 1) {
        rightEarGradient = this.skinColour2;
      } else {
        rightEarGradient = this.skinColour3;
      }
    }
    if (!this.albino && !this.sphynx) {
      leftEarGradient = ctx.createLinearGradient(0, -this.size-(this.size*this.earWidth/2), 0, this.limbLength/4);
      rightEarGradient = ctx.createLinearGradient(0, -this.size-(this.size*this.earWidth/2), 0, this.limbLength/4);
      if (this.bodypartCode[3] == 0) {
        leftEarGradient.addColorStop(0, this.secondColour);
        leftEarGradient.addColorStop(this.coatMod[0], this.firstColour);
        leftEarGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[3] == 1) {
        leftEarGradient.addColorStop(0, this.thirdColour);
        leftEarGradient.addColorStop(this.coatMod[0], this.secondColour);
        leftEarGradient.addColorStop(1, this.secondColour);
      } else {
        leftEarGradient.addColorStop(0, this.firstColour);
        leftEarGradient.addColorStop(this.coatMod[0], this.thirdColour);
        leftEarGradient.addColorStop(1, this.thirdColour);
      }
      if (this.bodypartCode[4] == 0) {
        rightEarGradient.addColorStop(0, this.secondColour);
        rightEarGradient.addColorStop(this.coatMod[0], this.firstColour);
        rightEarGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[4] == 1) {
        rightEarGradient.addColorStop(0, this.thirdColour);
        rightEarGradient.addColorStop(this.coatMod[0], this.secondColour);
        rightEarGradient.addColorStop(1, this.secondColour);
      } else {
        rightEarGradient.addColorStop(0, this.firstColour);
        rightEarGradient.addColorStop(this.coatMod[0], this.thirdColour);
        rightEarGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino && this.sphynx) {
      leftEarGradient = nosePink;
      rightEarGradient = nosePink;
    }
    ctx.fillStyle = leftEarGradient;
    ctx.strokeStyle = this.cellShadeLine;
    ctx.lineWidth = this.cellShadeThickness;
    ctx.beginPath();
    ctx.moveTo(0, +this.size/2);
    ctx.lineTo(-(this.earWidth*this.size), -(this.thickness*this.size/2) - this.earHeight * (this.size));
    ctx.lineTo(oneq*2, -(this.size*this.earWidth)/4);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = rightEarGradient;
    ctx.beginPath();
    ctx.moveTo(oneq*2, -(this.size*this.earWidth)/4);
    ctx.lineTo((oneq*4)+(this.earWidth*this.size), -(this.thickness*this.size/2) - this.earHeight * (this.size));
    ctx.lineTo(oneq*4, +this.size/2);
    ctx.stroke();
    ctx.fill();
    if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
      ctx.fillStyle = pat;
      ctx.globalAlpha = this.patternAlpha;
      ctx.beginPath();
      ctx.moveTo(0, +this.size/2);
      ctx.lineTo(-(this.earWidth*this.size), -(this.thickness*this.size/2) - this.earHeight * (this.size));
      ctx.lineTo(oneq*2, -(this.size*this.earWidth)/4);
      ctx.lineTo((oneq*4)+(this.earWidth*this.size), -(this.thickness*this.size/2) - this.earHeight * (this.size));
      ctx.lineTo(oneq*4, +this.size/2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    // skin inside the ear
    if (this.facingForwards && this.awake) {
      ctx.fillStyle = this.skinColour1;
      ctx.strokeStyle = this.cellShadeLine;
      ctx.lineWidth = this.size/10;
      ctx.beginPath();
      ctx.moveTo(0, +(this.size/2) + (this.earWidth*this.size/2));
      ctx.lineTo(-(this.earWidth*this.size*0.5), -(this.thickness*this.size/4) - (this.earHeight * this.size * 0.5));
      ctx.lineTo(oneq*2, (this.earHeight * this.size * 0.25));
      ctx.stroke();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(oneq*2, (this.earHeight * this.size * 0.25));
      ctx.lineTo((oneq*4)+(this.earWidth*this.size*0.5), -(this.thickness*this.size/4) - (this.earHeight * this.size * 0.5));
      ctx.lineTo(oneq*4, +(this.size/2) + (this.earWidth*this.size/2));
      ctx.stroke();
      ctx.fill();
    }
    ctx.restore(); // 0

    // head
    if (this.sitting && this.awake) {
      ctx.translate(0, (this.limbLength+(this.size/4))/2);
    } else if (!this.awake) {
      ctx.translate(0, sleepshift);
    }
    let s = this.size*6;
    let maxWidth = Math.sqrt(s * s + s * s) / 2;
    let headGradient = trueWhite;
    if (this.sphynx) {
      if (this.bodypartCode[2] == 0) {
        headGradient = this.skinColour1;
      } else if (this.bodypartCode[2] == 1) {
        headGradient = this.skinColour2;
      } else {
        headGradient = this.skinColour3;
      }
    }
    if (!this.albino && !this.sphynx) {
      headGradient = ctx.createLinearGradient(
        + Math.cos(this.coatMod[1]*6.3) * maxWidth, // start pos
        + Math.sin(this.coatMod[1]*6.3) * maxWidth,
        - Math.cos(this.coatMod[1]*6.3) * maxWidth, // end pos
        - Math.sin(this.coatMod[1]*6.3) * maxWidth
      );
      if (this.bodypartCode[2] == 0) {
        headGradient.addColorStop(0, this.secondColour);
        headGradient.addColorStop(this.coatMod[0], this.firstColour);
        headGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[2] == 1) {
        headGradient.addColorStop(0, this.thirdColour);
        headGradient.addColorStop(this.coatMod[0], this.secondColour);
        headGradient.addColorStop(1, this.secondColour);
      } else {
        headGradient.addColorStop(0, this.firstColour);
        headGradient.addColorStop(this.coatMod[0], this.thirdColour);
        headGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino && this.sphynx) {
      headGradient = nosePink;
    }
    if (this.sitting && this.awake) {
      ctx.translate(0, -(this.limbLength+(this.size/4))/2);
    } else if (!this.awake) {
      ctx.translate(0, -sleepshift);
    }
    if (this.awake) {
      // awake mode
      ctx.save();
      ctx.scale(1+(this.headWidth/3), 1 + (this.headHeight/5));
      // REAL DRAWING
      ctx.fillStyle = headGradient;
      ctx.lineWidth = 2*this.cellShadeThickness;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(0, 0, this.size+(this.thickness*this.size/5), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.arc(0, 0, this.size+(this.thickness*this.size/5), 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
        if (this.pattern == 3) {
          let fadeGrad = ctx.createLinearGradient(0, -this.size/2, 0, this.size);
          fadeGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
          fadeGrad.addColorStop(1, this.firstColour);
          ctx.fillStyle = fadeGrad;
          ctx.beginPath();
          ctx.arc(0, 0, this.size+(this.thickness*this.size/5), 0, 2 * Math.PI);
          ctx.fill();
        }
      } else if (this.pattern == 4 || this.pattern == 5) {
        let faceGradient = ctx.createRadialGradient(0, 0, this.size/2*this.patternAlpha, 0, 0, this.size*this.patternAlpha);
        if (this.pattern == 4) {
          faceGradient.addColorStop(0, this.firstColour);
        } else {
          faceGradient.addColorStop(0, nosePink);
        }
        faceGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = faceGradient;
        ctx.arc(0, 0, this.size+(this.thickness*this.size/5), 0, 2 * Math.PI);
        ctx.fill();
      }
      if (this.pattern == 6) { // pattern6
        let faceGradient = ctx.createRadialGradient(0, this.size, 0, 0, 0, this.size*3);
        ctx.globalAlpha = 0.5;
        faceGradient.addColorStop(0, this.thirdColour);
        faceGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = faceGradient;
        ctx.arc(0, 0, this.size+(this.thickness*this.size/5), 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.restore();

      if (this.facingForwards && this.inCatBox == null && this !== experiment) {
        // smile
        if (this.health >= 50 && !this.elder && this.energy > 0) {
          ctx.globalAlpha = this.love/100;
          if (this.gender == 'Female') {
            ctx.drawImage(smile, -(this.size)*0.8, this.size/8, this.size*1.6, this.size*0.8);
          } else if (this.gender == 'Male') {
            ctx.drawImage(smile2, -(this.size)*0.8, this.size/8, this.size*1.6, this.size*0.8);
          } else if (this.gender == 'Non Binary') {
            ctx.drawImage(smile3, -(this.size)*0.8, this.size/8, this.size*1.6, this.size*0.8);
          }
          ctx.globalAlpha = 1;
        }
      }
    } else {
      // sleep mode
      // CELL SHADING
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(0, this.limbLength+(this.size/2), this.size+this.cellShadeThickness, 3.15, 2 * Math.PI);
      ctx.fill();
      // REAL DRAWING
      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.arc(0, this.limbLength+(this.size*0.6), this.size, 3.15, 2 * Math.PI);
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc(0, this.limbLength+(this.size*0.6), this.size, 3.15, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    ctx.globalAlpha = 1;
    // eyes
    if (this.awake && this.facingForwards) {
      let temp = daytimeCounter;
      while (temp > 100) {
          temp -= 100;
      }
      let temp2 = this.birthday;
      while (temp2 > 100) {
        temp2 -= 100;
      }
      if (((this.snuggling >= 0 || this.nomnomnom >= 0) && this.age >= maturesAt) || (temp > temp2-1.5 && temp < temp2+1.5)) {
        ctx.save();
        ctx.scale(1+(this.headWidth/3), 1 + (this.headHeight/5));
        ctx.drawImage(content, -this.size, -this.size, this.size*2, this.size*2);
        ctx.restore();
      } else {
        diffy = 0.5;
        ctx.save(); // 0 open
        if (this.energy > 0) {
          let glowingeyes = false;
          let glowalpha = 0;
          let closestfly = fireflies[this.findClosestFireFly()];
          let diffx = Math.abs(this.x - closestfly.x);
          let diffy = Math.abs(this.y - closestfly.y);
          if (diffx <= 100 && diffy <= 100) {
            glowingeyes = true;
            let absolute = Math.sqrt((diffy*diffy) + (diffx*diffx)); // 0 to 100
            glowalpha = 0.6*(1 - (absolute/(Math.sqrt(20000))));
          }
          // REAL DRAWING
          // left eye
          ctx.beginPath();
          if (!this.albino) {
            ctx.fillStyle = trueBlack;
            if (this.albinoGene) {
              ctx.fillStyle = mixTwoColours(trueBlack, albinoRed, 0.7);
            }
          } else {
            ctx.fillStyle = mixTwoColours(trueBlack, albinoRed, 0.5);
          }
          ctx.strokeStyle = this.cellShadeLine;
          ctx.lineWidth = this.size/4;
          ctx.translate(-(this.size*this.eyePosX*0.3) - this.size/1.5, - (this.size/2) + (this.eyePosY*this.size*0.75));
          ctx.arc(0, 0, (this.size/2) + (this.eyeSize * this.size/6), 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
          if (glowingeyes) {
            ctx.globalAlpha = 1 - glowalpha;
          }
          // eye colour
          ctx.lineWidth = this.size / 7;
          if (!this.albino) {
            ctx.strokeStyle = this.eyeColour;
          } else {
            ctx.strokeStyle = albinoRed;
          }
          ctx.beginPath();
          ctx.arc(0, 0, (this.size/2.25) + (this.eyeSize * this.size/6), 0, 2 * Math.PI);
          ctx.stroke();
          // draw highlights
          ctx.beginPath();
          ctx.fillStyle = trueWhite;
          ctx.rotate(-this.rotation);
          ctx.arc(0, -this.size/7, this.size/6, 0, 2 * Math.PI);
          ctx.arc(-this.size/7, this.size/5, this.size/12, 0, 2 * Math.PI);
          ctx.fill();
          ctx.rotate(this.rotation);
          // glowing at night
          if (glowingeyes) {
            let glow = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size*this.eyeSize);
            glow.addColorStop(0, closestfly.firstColour);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.globalAlpha = glowalpha/2;
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, this.size*this.eyeSize, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = trueWhite;
            ctx.globalAlpha = glowalpha/1.5;
            ctx.beginPath();
            ctx.arc(0, 0, 0.6*((this.size/2) + (this.eyeSize * this.size/6)), 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          ctx.restore(); // 0 closed
          // right eye
          ctx.beginPath();
          if (!this.albino) {
            ctx.fillStyle = trueBlack;
            if (this.albinoGene) {
              ctx.fillStyle = mixTwoColours(trueBlack, albinoRed, 0.7);
            }
          } else {
            ctx.fillStyle = mixTwoColours(trueBlack, albinoRed, 0.5);
          }
          ctx.strokeStyle = this.cellShadeLine;
          ctx.lineWidth = this.size/4;
          ctx.save(); // 0 open
          ctx.translate((this.size*this.eyePosX*0.3) + this.size/1.5, - (this.size/2) + (this.eyePosY*this.size*0.75));
          ctx.arc(0, 0, (this.size/2) + (this.eyeSize * this.size/6), 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
          // eye colour
          if (glowingeyes) {
            ctx.globalAlpha = (1 - glowalpha);
          }
          ctx.lineWidth = this.size / 7;
          if (!this.albino) {
            ctx.strokeStyle = this.eyeColour2;
          } else {
            ctx.strokeStyle = albinoRed;
          }
          ctx.beginPath();
          ctx.arc(0, 0, (this.size/2.25) + (this.eyeSize * this.size/6), 0, 2 * Math.PI);
          ctx.stroke();

          // draw highlights
          ctx.beginPath();
          ctx.fillStyle = trueWhite;
          ctx.rotate(-this.rotation);
          ctx.arc(0, -this.size/7, this.size/6, 0, 2 * Math.PI);
          ctx.arc(this.size/6, this.size/5, this.size/12, 0, 2 * Math.PI);
          ctx.fill();
          ctx.rotate(this.rotation);

          // glowing at night
          if (glowingeyes) {
            let glow = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size);
            glow.addColorStop(0, closestfly.firstColour);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.globalAlpha = glowalpha/4;
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = trueWhite;
            ctx.globalAlpha = glowalpha/1.5;
            ctx.beginPath();
            ctx.arc(0, 0, 0.6*((this.size/2) + (this.eyeSize * this.size/6)), 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
        ctx.restore(); // 0 closed
      }
    }

    // jowl
    if (this.awake && this.facingForwards) {
      // chin
      // cellshading
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(0, (this.size*(this.nosePos-0.5)/2) + this.size/1.5, (this.size/3.5) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();
      // real drawing
      ctx.fillStyle = trueWhite;
      if ((!this.albino && this.pattern == 5)) {
        ctx.fillStyle = nosePink;
      } else if (this.sphynx) {
        if (this.bodypartCode[11] == 0) {
          ctx.fillStyle = this.skinColour1;
        } else if (this.bodypartCode[11] == 1) {
          ctx.fillStyle = this.skinColour2;
        } else {
          ctx.fillStyle = this.skinColour3;
        }
      } else if (!this.albino && !this.sphynx) {
        if (this.bodypartCode[11] == 0) {
          ctx.fillStyle = this.firstColour;
        } else if (this.bodypartCode[11] == 1) {
          ctx.fillStyle = this.secondColour;
        } else {
          ctx.fillStyle = this.thirdColour;
        }
      }
      ctx.beginPath();
      ctx.arc(0, (this.size*(this.nosePos-0.5)/2) + this.size/1.5, (this.size/3.5), 0, 2 * Math.PI);
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5 && this.pattern !== 3) {
        ctx.fillStyle = jowlPat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc(0, (this.size*(this.nosePos-0.5)/2) + this.size/1.5, (this.size/3.5), 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // fangs
      // cellshading
      ctx.strokeStyle = this.cellShadeLine;
      ctx.lineWidth = this.size/10;
      // real drawing
      ctx.fillStyle = trueWhite;
      ctx.beginPath();
      ctx.moveTo(-this.size/5, (this.size*(this.nosePos-0.5)/2) + (this.size/1.45));
      ctx.lineTo(-this.size/4, (this.size*(this.nosePos-0.5)/2) + (this.size/1.45) + (this.size*(this.fangs)/2));
      ctx.lineTo(-this.size/2.5, (this.size*(this.nosePos-0.5)/2) + (this.size/1.45));
      ctx.moveTo(+this.size/5, (this.size*(this.nosePos-0.5)/2) + (this.size/1.45));
      ctx.lineTo(+this.size/4, (this.size*(this.nosePos-0.5)/2) + (this.size/1.45) + (this.size*(this.fangs)/2));
      ctx.lineTo(+this.size/2.5, (this.size*(this.nosePos-0.5)/2) + (this.size/1.45));
      ctx.stroke();
      ctx.fill();

      // jowls
      // cellshading
      ctx.fillStyle = this.cellShadeLine;
      ctx.beginPath();
      ctx.arc(-(this.size/4), (this.size*(this.nosePos-0.5)/2) + this.size/2.5, (this.size/3.5) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.arc((this.size/4), (this.size*(this.nosePos-0.5)/2) + this.size/2.5, (this.size/3.5) + this.cellShadeThickness, 0, 2 * Math.PI);
      ctx.fill();

      // real drawing
      ctx.fillStyle = trueWhite;
      if ((!this.albino && this.pattern == 5)) {
        ctx.fillStyle = nosePink;
      } else if (this.sphynx) {
        if (this.bodypartCode[9] == 0) {
          ctx.fillStyle = this.skinColour1;
        } else if (this.bodypartCode[9] == 1) {
          ctx.fillStyle = this.skinColour2;
        } else {
          ctx.fillStyle = this.skinColour3;
        }
      } else if (!this.albino && !this.sphynx) {
        if (this.bodypartCode[9] == 0) {
          ctx.fillStyle = this.firstColour;
        } else if (this.bodypartCode[9] == 1) {
          ctx.fillStyle = this.secondColour;
        } else {
          ctx.fillStyle = this.thirdColour;
        }
      }
      ctx.beginPath();
      ctx.arc(-(this.size/4), (this.size*(this.nosePos-0.5)/2) + this.size/2.5, this.size/3.5, 0, 2 * Math.PI);
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5  && this.pattern !== 3) {
        ctx.fillStyle = jowlPat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc(-(this.size/4), (this.size*(this.nosePos-0.5)/2) + this.size/2.5, this.size/3.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = trueWhite;
      if ((!this.albino && this.pattern == 5)) {
        ctx.fillStyle = nosePink;
      } else if (this.sphynx) {
        if (this.bodypartCode[10] == 0) {
          ctx.fillStyle = this.skinColour1;
        } else if (this.bodypartCode[10] == 1) {
          ctx.fillStyle = this.skinColour2;
        } else {
          ctx.fillStyle = this.skinColour3;
        }
      } else if (!this.albino && !this.sphynx) {
        if (this.bodypartCode[10] == 0) {
          ctx.fillStyle = this.firstColour;
        } else if (this.bodypartCode[10] == 1) {
          ctx.fillStyle = this.secondColour;
        } else {
          ctx.fillStyle = this.thirdColour;
        }
      }
      ctx.beginPath();
      ctx.arc((this.size/4), (this.size*(this.nosePos-0.5)/2) + this.size/2.5, this.size/3.5, 0, 2 * Math.PI);
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5 && this.pattern !== 3) {
        ctx.fillStyle = jowlPat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc((this.size/4), (this.size*(this.nosePos-0.5)/2) + this.size/2.5, this.size/3.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // nose
      // cell cellshading
      ctx.fillStyle = this.cellShadeLine;
      ctx.fillRect(-(this.size/3.5) - this.cellShadeThickness, (this.size*(this.nosePos-0.5)/2) + (this.size/2.5) - (this.size/3) - this.cellShadeThickness, (this.size/1.75) + (this.cellShadeThickness*2), (this.size/4) + (this.cellShadeThickness*2));
      ctx.fillRect(-(this.size/12) - this.cellShadeThickness, (this.size*(this.nosePos-0.5)/2) + (this.size/2.5) - (this.size/3) - this.cellShadeThickness, (this.size/6) + (this.cellShadeThickness*2), (this.size/2.5) + (this.cellShadeThickness*2));
      // real drawing
      ctx.fillStyle = this.skinColour1;
      ctx.fillRect(-(this.size/3.5), (this.size*(this.nosePos-0.5)/2) + (this.size/2.5) - (this.size/3), this.size/1.75, this.size/4);
      ctx.fillRect(-(this.size/12), (this.size*(this.nosePos-0.5)/2) + (this.size/2.5) - (this.size/3), this.size/6, this.size/2.5);
    }
  };

  this.drawFrontFeet = function(pat) {
    let footPat = pat;
    let footSize = this.size/3.5*this.thickness*2.25;
    let leftHandGradient = trueWhite;
    let rightHandGradient = trueWhite;
    // sphynx
    if (this.sphynx) {
      if (this.bodypartCode[0] == 0) {
        leftHandGradient = this.skinColour1;
      } else if (this.bodypartCode[0] == 1) {
        leftHandGradient = this.skinColour2;
      } else {
        leftHandGradient = this.skinColour3;
      }
      if (this.bodypartCode[1] == 0) {
        rightHandGradient = this.skinColour1;
      } else if (this.bodypartCode[1] == 1) {
        rightHandGradient = this.skinColour2;
      } else {
        rightHandGradient = this.skinColour3;
      }
    }
    if (!this.albino && !this.sphynx) {
      if (this.bodypartCode[0] == 0) {
        leftHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5) + (footSize*2));
        leftHandGradient.addColorStop(0, this.secondColour);
        leftHandGradient.addColorStop(this.coatMod[0], this.firstColour);
        leftHandGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[0] == 1) {
        leftHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5) + (footSize*2));
        leftHandGradient.addColorStop(0, this.thirdColour);
        leftHandGradient.addColorStop(this.coatMod[0], this.secondColour);
        leftHandGradient.addColorStop(1, this.secondColour);
      } else {
        leftHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5) + (footSize*2));
        leftHandGradient.addColorStop(0, this.firstColour);
        leftHandGradient.addColorStop(this.coatMod[0], this.thirdColour);
        leftHandGradient.addColorStop(1, this.thirdColour);
      }

      if (this.bodypartCode[1] == 0) {
        rightHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5) + (footSize*2));
        rightHandGradient.addColorStop(0, this.secondColour);
        rightHandGradient.addColorStop(this.coatMod[0], this.firstColour);
        rightHandGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[1] == 1) {
        rightHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5) + (footSize*2));
        rightHandGradient.addColorStop(0, this.thirdColour);
        rightHandGradient.addColorStop(this.coatMod[0], this.secondColour);
        rightHandGradient.addColorStop(1, this.secondColour);
      } else {
        rightHandGradient = ctx.createRadialGradient(0, 0, 1, 0, 0, (this.size)+(this.limbLength/2.5) + (footSize*2));
        rightHandGradient.addColorStop(0, this.firstColour);
        rightHandGradient.addColorStop(this.coatMod[0], this.thirdColour);
        rightHandGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino && this.sphynx) {
      leftHandGradient = nosePink;
      rightHandGradient = nosePink;
    }
    ctx.lineWidth = 2*this.cellShadeThickness;
    ctx.strokeStyle = this.cellShadeLine;

    // if we are awake on a floor
    if (this.awake && this.hitBottom) {
      if (!this.facingForwards) {
        ctx.translate(0, -this.size*1.5);
      }
      ctx.save();
      ctx.translate(this.x, this.y);
      // REAL DRAWING
      ctx.fillStyle = leftHandGradient;
      ctx.beginPath();
      ctx.arc(-(this.size/1.6), (this.size)+(this.limbLength/2.5), footSize, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.fillStyle = rightHandGradient;
      ctx.beginPath();
      ctx.arc((this.size/1.6), (this.size)+(this.limbLength/2.5), footSize, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.fillStyle = footPat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.arc(-(this.size/1.6), (this.size)+(this.limbLength/2.5), footSize, 0, 2 * Math.PI);
        ctx.arc((this.size/1.6), (this.size)+(this.limbLength/2.5), footSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    } else if (!this.awake || !this.hitBottom) {
      // if we are holding something
      if (this.awake && this.hitFocus) {
        ctx.fillStyle = leftHandGradient;
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, footSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = rightHandGradient;
        ctx.beginPath();
        ctx.arc(this.focus.x, this.focus.y, footSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
          ctx.fillStyle = footPat;
          ctx.globalAlpha = this.patternAlpha;
          ctx.beginPath();
          ctx.arc(this.focus.x, this.focus.y, footSize, 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        // if we are not holding anything
      } else if (this.awake && this.energy > 0) {
        // CELL SHADING
        ctx.fillStyle = this.cellShadeLine;
        // REAL DRAWING
        // left arm
        ctx.fillStyle = leftHandGradient;
        ctx.save();
        ctx.translate(this.x - this.size + (this.size/3), this.y + (this.size/1.5) - (footSize/2));
        ctx.beginPath();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
          ctx.fillStyle = footPat;
          ctx.globalAlpha = this.patternAlpha;
          ctx.beginPath();
          ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        // jelly beans
        if (this.facingForwards && this.y > this.focus.y) {
          // uniformly scale the pads
          ctx.save();
          ctx.translate(this.limbLength * Math.cos(this.angleToFocus), (footSize/2) + (this.limbLength * Math.sin(this.angleToFocus)));
          let scaleY = 1;
          if (this.y - (this.size*10) < this.focus.y) {
            scaleY = (this.y - this.focus.y)/this.size/10;
            ctx.scale(1, scaleY);
          }
          ctx.fillStyle = this.skinColour1;
          ctx.strokeStyle = this.cellShadeLine;
          ctx.lineWidth = this.size/10;
          ctx.beginPath();
          ctx.arc(0, -(footSize), footSize/3.5, 0, 2 * Math.PI); // mid
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-footSize/2, -(footSize), footSize/3.5, 0, 2 * Math.PI); // left
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(footSize/2, -(footSize), footSize/3.5, 0, 2 * Math.PI); // right
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, footSize/10, footSize/1.5, 0, 3 * Math.PI); // main
          ctx.stroke();
          ctx.fill();
          ctx.restore();
        }

        ctx.restore(); // closed

        // right arm
        ctx.fillStyle = rightHandGradient;
        ctx.save();
        ctx.translate(this.x + this.size - (this.size/3), this.y + (this.size/1.5) - (footSize/2));
        ctx.beginPath();
        ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
          ctx.fillStyle = footPat;
          ctx.globalAlpha = this.patternAlpha;
          ctx.beginPath();
          ctx.arc(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus), footSize, 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        // jelly beans
        if (this.facingForwards && this.y > this.focus.y) {
          ctx.save();
          // uniformly scale the pads
          ctx.translate(this.limbLength * Math.cos(this.angleToFocus), (footSize/2) + (this.limbLength * Math.sin(this.angleToFocus)));
          let scaleY = 1;
          if (this.y - (this.size*10) < this.focus.y) {
            scaleY = (this.y - this.focus.y)/this.size/10;
            ctx.scale(1, scaleY);
          }
          ctx.fillStyle = this.skinColour1;
          ctx.strokeStyle = this.cellShadeLine;
          ctx.lineWidth = this.size/10;
          ctx.beginPath();
          ctx.arc(0, -(footSize), footSize/3.5, 0, 2 * Math.PI); // mid
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-footSize/2, -(footSize), footSize/3.5, 0, 2 * Math.PI); // left
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(footSize/2, -(footSize), footSize/3.5, 0, 2 * Math.PI); // right
          ctx.stroke();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, footSize/10, footSize/1.5, 0, 3 * Math.PI); // main
          ctx.stroke();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore(); // closed
      }
    }
  };

  this.drawFrontLegs = function(bodyGradient, pat) {
    ctx.globalAlpha = 1;
    let footSize = this.size/3.5*this.thickness*2.25;
    // front legs
    ctx.lineWidth = (this.size/2.5)*this.thickness*2;
    // if we are awake on a floor
    if (this.awake && this.hitBottom && !this.sitting) {
      ctx.save();
      ctx.translate(this.x, this.y);
      // cell shading
      ctx.strokeStyle = this.cellShadeLine;
      ctx.lineWidth += this.cellShadeThickness;
      ctx.beginPath();
      ctx.moveTo(-this.size*1/2, (this.size/4));
      ctx.lineTo(-this.size*1/2, this.limbLength - footSize/2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.size*1/2, (this.size/4));
      ctx.lineTo(this.size*1/2, this.limbLength - footSize/2);
      ctx.stroke();
      // real drawing
      ctx.lineWidth -= this.cellShadeThickness;
      ctx.strokeStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(-this.size*1/2, (this.size/4));
      ctx.lineTo(-this.size*1/2, this.limbLength - footSize/2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.size*1/2, (this.size/4));
      ctx.lineTo(this.size*1/2, this.limbLength - footSize/2);
      ctx.stroke();
      // pattern
      if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
        ctx.strokeStyle = pat;
        ctx.globalAlpha = this.patternAlpha;
        ctx.beginPath();
        ctx.moveTo(-this.size*1/2, (this.size/4));
        ctx.lineTo(-this.size*1/2, this.limbLength - footSize/2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.size*1/2, (this.size/4));
        ctx.lineTo(this.size*1/2, this.limbLength - footSize/2);
        ctx.stroke();
      }
      ctx.restore();
    } else if (!this.awake || !this.hitBottom) {
      // if we are holding something
      if (this.awake && this.hitFocus) {
        // CELL SHADING
        ctx.strokeStyle = this.cellShadeLine;
        ctx.lineWidth += this.cellShadeThickness;
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.lineWidth -= this.cellShadeThickness;
        // REAL DRAWING
        ctx.strokeStyle = bodyGradient;
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.lineTo(this.focus.x, this.focus.y);
        ctx.stroke();
        if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
          ctx.strokeStyle = pat;
          ctx.globalAlpha = this.patternAlpha;
          ctx.save(); // 0 open
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(-this.size*2/3, (this.size/4));
          ctx.restore();
          ctx.lineTo(this.focus.x, this.focus.y);
          ctx.stroke();
          ctx.save(); // 0 open
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(this.size*2/3, (this.size/4));
          ctx.restore();
          ctx.lineTo(this.focus.x, this.focus.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // if we are not holding anything
      } else if (this.awake && this.energy > 0) {
        // CELL SHADING
        ctx.fillStyle = this.cellShadeLine;
        ctx.strokeStyle = this.cellShadeLine;
        ctx.lineWidth += this.cellShadeThickness;
        // left arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x-this.size+(this.size/3), this.y + (this.size/1.5) - (footSize/2));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        // right arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x+this.size-(this.size/3), this.y + (this.size/1.5) - (footSize/2));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        ctx.lineWidth -= this.cellShadeThickness;
        // REAL DRAWING
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = bodyGradient;
        // left arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(-this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x - this.size+(this.size/3), this.y + (this.size/1.5) - (footSize/2));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        // right arm
        ctx.save(); // 0 open
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.size*2/3, (this.size/4));
        ctx.restore();
        ctx.save();
        ctx.translate(this.x + this.size - (this.size/3), this.y + (this.size/1.5) - (footSize/2));
        ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
        ctx.stroke();
        ctx.restore(); // closed
        if (this.pattern !== 0 && this.pattern !== 4 && this.pattern !== 5) {
          ctx.strokeStyle = pat;
          ctx.globalAlpha = this.patternAlpha;
          // left arm
          ctx.save(); // 0 open
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(-this.size*2/3, (this.size/4));
          ctx.restore();
          ctx.save();
          ctx.translate(this.x - this.size+(this.size/3), this.y + (this.size/1.5) - (footSize/2));
          ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
          ctx.stroke();
          ctx.restore(); // closed
          // right arm
          ctx.save(); // 0 open
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(this.size*2/3, (this.size/4));
          ctx.restore();
          ctx.save();
          ctx.translate(this.x + this.size - (this.size/3), this.y + (this.size/1.5) - (footSize/2));
          ctx.lineTo(this.limbLength * Math.cos(this.angleToFocus), this.limbLength * Math.sin(this.angleToFocus));
          ctx.stroke();
          ctx.restore(); // closed
          ctx.globalAlpha = 1;
        }
      }
    }
  };
  this.update = function() {
    ctx.save();
    let pat = pat0;
    if (this.pattern == 1) {
      pat = pat1;
    } else if (this.pattern == 2) {
      pat = pat2;
    } else if (this.pattern == 3) {
      pat = pat3;
    } else if (this.pattern == 6) {
      pat = pat6;
    }
    ctx.setTransform(100/this.size, 0, 0, 100/this.size, 0, 0);
    ctx.restore();
    /* new gradient opps */
    ctx.save();
    ctx.translate(this.x, this.y);
    let bodyGradient = trueWhite;
    // sphynx
    if (this.sphynx) {
      if (this.bodypartCode[5] == 0) {
        bodyGradient = this.skinColour1;
      } else if (this.bodypartCode[5] == 1) {
        bodyGradient = this.skinColour2;
      } else {
        bodyGradient = this.skinColour3;
      }
    }
    if (!this.albino && !this.sphynx) {
      let s = this.size*6;
      let maxWidth = Math.sqrt(s * s + s * s) / 2;
      bodyGradient = ctx.createLinearGradient(
        + Math.cos(this.coatMod[1]*6) * maxWidth, // start pos
        + Math.sin(this.coatMod[1]*6) * maxWidth,
        - Math.cos(this.coatMod[1]*6) * maxWidth, // end pos
        - Math.sin(this.coatMod[1]*6) * maxWidth
      );
      if (this.bodypartCode[5] == 0) {
        bodyGradient.addColorStop(0, this.secondColour);
        bodyGradient.addColorStop(this.coatMod[0], this.firstColour);
        bodyGradient.addColorStop(1, this.firstColour);
      } else if (this.bodypartCode[5] == 1) {
        bodyGradient.addColorStop(0, this.thirdColour);
        bodyGradient.addColorStop(this.coatMod[0], this.secondColour);
        bodyGradient.addColorStop(1, this.secondColour);
      } else {
        bodyGradient.addColorStop(0, this.firstColour);
        bodyGradient.addColorStop(this.coatMod[0], this.thirdColour);
        bodyGradient.addColorStop(1, this.thirdColour);
      }
    } else if (this.albino && this.sphynx) {
      bodyGradient = nosePink;
    }
    ctx.restore();


    /* focus lines */
    // if (this.focus !== null) {
    // ctx.strokeStyle = trueWhite;
    // ctx.lineWidth = 1;
    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.lineTo(this.focus.x, this.focus.y);
    // ctx.stroke();
    // }
    this.hitFocus = detectCollision(this, this.focus);
    let backendShiftX = this.size * this.speedX / 30;
    let backendShiftY = this.size * this.speedY / 30;
    if (backendShiftY > trueBottom - this.y) {
      backendShiftY = trueBottom - this.y;
    }
    if (this.awake && !this.hitBottom && this.hitFocus) {
      backendShiftY = -this.size/4;
    }
    // calculate angle to focus
    this.angleToFocus = Math.atan2(this.focus.y - this.y, this.focus.x - this.x);
    diffx = Math.cos(this.angleToFocus)*4;
    diffy = Math.sin(this.angleToFocus)*4;
    // setting leg angle
    let sameDirection = false;
    let offsetX = Math.abs(this.focus.x - this.x);
    let legAngle = Math.atan2(this.speedY, this.speedX);

    if (this.inCatBox == null && this.awake && this.mother !== null && this.age < maturesAt && this.hitBottom && this.mother.snuggling == -1 && detectCollision(this, this.mother)) {
      this.speedX = 0;
      this.speedY = 0;
      if (this.mother.awake && this.nomnomnom == -1 && this.health < 50) {
        this.mother.energy -= 5;
        this.mother.love += 5;
        this.mother.speedX = 0;
        this.mother.speedY = 0;
        this.mother.sitting = true;
        this.nomnomnom = 50;
        this.mother.facingForwards = true;
        // sendMessage(this.mother.name + ' fed '+ this.name);
        gainMeter(this);
      }
    }
    for (let f = 0; f < fireflies.length; f++) {
      if (this.inCatBox == null && this.focus == fireflies[f] && !this.hitBottom && !fireflies[f].touchedThisFrame && this.awake && this.energy > 0 && this.snuggling == -1 && this.nomnomnom == -1 && detectCollision(this, fireflies[f])) {
        fireflies[f].touchedThisFrame = true;
        this.resetRotation(true);
        fireflies[f].speedX += (this.speedX*this.size)/1500;
        fireflies[f].speedY += (this.speedY*this.size)/2000;// + (0.002 * this.size);
        gainMeter(this);
        this.facingForwards = true;
        if (this.health >= 100 && this.love >= 100 && this.energy >= 100) {
          // let go of the FireFly
          this.speedY = -this.size*2;
        } else {
          let thisMiddleX = this.x;
          let thisMiddleY = this.y;
          let otherMiddleX = this.focus.x;
          let otherMiddleY = this.focus.y;
          let diffx = otherMiddleX - thisMiddleX;
          let diffy = otherMiddleY - thisMiddleY;

          if ((diffx > 0 && this.speedX > 0) || (diffx < 0 && this.speedX < 0)) {
            // if we are going right and it's to our right
            // if we are going left and it's to our left
          } else {
            this.speedX *= 0.1;
          }
          if ((diffy > 0 && this.speedY > 0) || (diffy < 0 && this.speedY < 0)) {
            // if we are going up and it's above
            // if we are going down and it's below
          } else {
            this.speedY *= 0.1;
          }
          let targetangle = Math.atan2(otherMiddleY - thisMiddleY, otherMiddleX - thisMiddleX);
          this.speedX += Math.cos(targetangle);
          this.speedY += Math.sin(targetangle);
          if (this.speedX < 10 && this.speedX > -10 && this.speedY < 10 & this.speedY > -10) {
            // legAngle = -1.6;
          }
        }
      }
    }
    legAngle = Math.atan2(this.focus.y - this.y, offsetX);
    if (legAngle < -0.2) {
      sameDirection = true;
    }

    // drawing
    ctx = myGameArea.context;
    ctx.globalAlpha = 1;
    let shift = (2+this.name.length)*6.72/2;
    let sleepshift = 0;
    if (!this.awake) {
      sleepshift = this.limbLength+(this.size/4);
    }
    if (this.facingForwards) {
      this.drawBackLegs(pat, backendShiftX, backendShiftY, bodyGradient, sameDirection, legAngle);
    }
    // translate before drawing again
    ctx.save(); // 0 open - rotated
    ctx.translate(this.x, this.y);
    if (this.facingForwards) {
      this.drawTail(pat, backendShiftX, backendShiftY, sleepshift);
    }
    if (this.sitting && this.hitBottom) {
      ctx.translate(0, (this.limbLength+(this.size/4))/2);
    }
    if (!this.facingForwards) {
      ctx.translate(0, this.size);
    }
    if (this.facingForwards) {
      this.drawBody(pat, backendShiftX, backendShiftY, bodyGradient);
    }
    ctx.save();
    ctx.translate(-this.x, -this.y);
    this.drawFrontLegs(bodyGradient, pat);
    ctx.restore();
    // rotate around axis and move a bit before drawing head parts
    ctx.translate(0, -this.size/2);
    if (!this.facingForwards) {
      ctx.translate(-this.x, -this.y);
      this.drawFrontFeet(pat);
      ctx.translate(this.x, this.y);
    }
    if (this.facingForwards) {
      this.drawChest(pat, backendShiftX, backendShiftY, bodyGradient);
    }
    ctx.rotate(this.rotation);

    if (this.facingForwards) {
      this.drawHead(pat, sleepshift);
    } else {
      this.drawHead(pat, sleepshift);
    }
    ctx.rotate(-this.rotation);
    if (!this.facingForwards) {
      this.drawChest(pat, backendShiftX, backendShiftY, bodyGradient);
    }

    // ctx.fillStyle = trueWhite;
    // ctx.font = '10px' + ' ' + globalFont;
    // ctx.fillText(trueBottom-(this.jumpY), 0, -10 - (this.size*2));

    if (!this.facingForwards) {
      ctx.translate(-this.x, -this.y);
      this.drawBackLegs(pat, backendShiftX, backendShiftY, bodyGradient, sameDirection, legAngle);
      ctx.translate(this.x, this.y);
      bodyGradient = trueWhite;
      // sphynx
      if (this.sphynx) {
        if (this.bodypartCode[5] == 0) {
          bodyGradient = this.skinColour1;
        } else if (this.bodypartCode[5] == 1) {
          bodyGradient = this.skinColour2;
        } else {
          bodyGradient = this.skinColour3;
        }
      }
      if (!this.albino && !this.sphynx) {
        let s = this.size*6;
        let maxWidth = Math.sqrt(s * s + s * s) / 2;
        bodyGradient = ctx.createLinearGradient(
          + Math.cos(this.coatMod[1]*6) * maxWidth, // start pos
          + Math.sin(this.coatMod[1]*6) * maxWidth,
          - Math.cos(this.coatMod[1]*6) * maxWidth, // end pos
          - Math.sin(this.coatMod[1]*6) * maxWidth
        );
        if (this.bodypartCode[5] == 0) {
          bodyGradient.addColorStop(0, this.secondColour);
          bodyGradient.addColorStop(this.coatMod[0], this.firstColour);
          bodyGradient.addColorStop(1, this.firstColour);
        } else if (this.bodypartCode[5] == 1) {
          bodyGradient.addColorStop(0, this.thirdColour);
          bodyGradient.addColorStop(this.coatMod[0], this.secondColour);
          bodyGradient.addColorStop(1, this.secondColour);
        } else {
          bodyGradient.addColorStop(0, this.firstColour);
          bodyGradient.addColorStop(this.coatMod[0], this.thirdColour);
          bodyGradient.addColorStop(1, this.thirdColour);
        }
      } else if (this.albino && this.sphynx) {
        bodyGradient = nosePink;
      }

      this.drawBody(pat, backendShiftX, backendShiftY, bodyGradient);
      this.drawTail(pat, backendShiftX, backendShiftY, sleepshift);
    }


    ctx.restore(); // close
    if (this.facingForwards) {
      this.drawFrontFeet(pat);
    }

    this.drawIcons();
    ctx.globalAlpha = 1;

    // label
    ctx.save();
    ctx.translate(this.x, this.y);
    if ((selection == this || this.inCatBox !== null) && this !== experiment) {
      // ctx.save();
      // ctx.translate(0, -(this.size*3) -35);
      //
      // ctx.fillStyle = mixTwoColours(outputArray[2], trueBlack, 0.5);
      // ctx.fillRect(-50 - 10, -25-10, 100 + (2*10), 50 + (2*10));
      // ctx.globalAlpha = 0.7;
      //
      // ctx.lineWidth = 2;
      // ctx.strokeStyle = trueWhite;
      // ctx.strokeRect(-50, -25, 100, 10);
      // ctx.strokeRect(-50, -25 + (1 * 12.5), 100, 10);
      // ctx.strokeRect(-50, -25 + (2 * 12.5), 100, 10);
      // ctx.strokeRect(-50, -25 + (3 * 12.5), 100, 10);
      //
      // ctx.fillStyle = healthGreen;
      // ctx.fillRect(-50, -25, this.health, 10);
      // ctx.fillStyle = lovePink;
      // ctx.fillRect(-50, -25 + (1 * 12.5), this.love, 10);
      // ctx.fillStyle = energyBlue;
      // ctx.fillRect(-50, -25 + (2 * 12.5), this.energy, 10);
      // ctx.fillStyle = hungerOrange;
      // ctx.fillRect(-50, -25 + (3 * 12.5), this.hunger/10, 10);
      // ctx.restore();

      // label
      ctx.fillStyle = mixTwoColours(outputArray[2], trueBlack, 0.5);
      ctx.fillRect(-shift - 10, sleepshift -15 -(this.size*2.75), (shift*2) + 20, 20);

      ctx.globalAlpha = 1;
      ctx.fillStyle = trueWhite;
      ctx.font = '12px' + ' ' + globalFont;
      if (this.gender == 'Female') {
        ctx.fillText(this.name + ' \u2640', -shift, sleepshift-(this.size*2.75));
      } else if (this.gender == 'Male') {
        ctx.fillText(this.name + ' \u2642', -shift, sleepshift-(this.size*2.75));
      } else {
        ctx.fillText(this.name + ' \u26A5', -shift, sleepshift-(this.size*2.75));
      }
    }
    ctx.restore();
  };
}

/**
* function to add meters to a chibi
* @param {Chibi} who - the chibi
*/
gainMeter = function(who) {
  if (who.energy < 100) {
    who.energy += 1;
  }
  if (who.love < 100) {
    who.love += 3;
  }
  if (who.health < 100) {
    who.health += 3;
  }
};

/**
* function to remove relationships from a chibi and compensate for death
* @param {Chibi} who - the chibi
*/
removeRelationships = function(who) {
  // remove mother and partner
  for (let i = 0; i < chibis.length; i++) {
    if (chibis[i].mother == who) {
      chibis[i].mother = null;
    }
    if (chibis[i].partner == who) {
      chibis[i].partner = null;
      // remove any snuggling status
      chibis[i].snuggling = -1;
    }
  }
  // kill fruit that is being consumed
  for (let i = 0; i < fruits.length; i++) {
    if (fruits[i].eater == who) {
      fruits.splice(i, 1);
      i--;
    }
  }
  // decrease currentchibis if chosing a chibi to compensate for losing this one
  if (choosingChibi) {
    currentChibis --;
    // shift all catbox IDs down by 1
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].id --;
    }
  }
  // make sure this chibi is no longer selected
  if (selection == who) {
    selection = null;
  }
  removeFocusFrom(who);
};

applyBreedTemplate = function(who) {
  // using breed templates
  let breedSwitch = Math.random();
  if (breedSwitch < 0.05) {
    breedSiamese(who);
  } else if (breedSwitch < 0.1) {
    breedBurmese(who);
  } else if (breedSwitch < 0.2) {
    breedRussianBlue(who);
  } else if (breedSwitch < 0.3) {
    breedPersian(who);
  } else if (breedSwitch < 0.35) {
    breedManx(who);
  } else if (breedSwitch < 0.45) {
    breedTabby(who);
  } else if (breedSwitch < 0.5) {
    breedBobtail(who);
  } else if (breedSwitch < 0.55) {
    breedScottishFold(who);
  } else if (breedSwitch < 0.6) {
    breedLykoi(who);
  } else if (breedSwitch < 0.65) {
    breedSphynx(who);
  } else if (breedSwitch < 0.7) {
    breedBengal(who);
  } else if (breedSwitch < 0.75) {
    breedEgyptianMau(who);
  } else if ((who.gender !== 'Male' && breedSwitch < 0.8) || (who.gender == 'Male' && Math.random() < 1/3000)) {
    breedCalico(who);
  } else if ((who.gender !== 'Male' && breedSwitch < 0.85) || (who.gender == 'Male' && Math.random() < 1/3000)) {
    breedTortoiseShell(who);
  } else if (breedSwitch < 0.9) {
    breedTwoTone(who);
  }
};

/** function to apply genetics and disorders to Chibis
* @param {Chibi} who - the chibi
*/
mutate = function(who) {
  // albino
  let albinoChance = Math.random();
  if (albinoChance <= 0.04) {
    who.albinoGene = true;
    who.pattern = 2;
  }
  if (who.albinoGene && 0.5 < Math.random()) {
    breedAlbino(who);
  }

  // sphynx
  let sphynxChance = Math.random();
  if (sphynxChance <= 0.04) {
    who.sphynxGene = true;
  }

  if (!who.albino && who.eyeColour == who.eyeColour2) {
    breedHeteroChromia(who, Math.random());
  }
};

skinColourCheck = function(theColour) {
  let c1 = hexToRgb(theColour).r + hexToRgb(theColour).g + hexToRgb(theColour).b;
  if (c1 > 382.5) {
    return nosePink;
  } else {
    return noseBlack;
  }
};

/** function to create a random bodypartCode
* this code is used to denote the zones of colour on a Chibi
* @return {array} - the bodypart code
*/
randomBodyPartCode = function() {
  let tmpArray = [];
  for (let i = 0; i < 13; i++) {
    tmpArray.push(Math.round(Math.random()*2));
  }
  return tmpArray;
};

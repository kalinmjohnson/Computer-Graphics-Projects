import { vec4 } from "./helperfunctions.js";
export function getCirclePoints(numOfPoints) {
    let circlePoints = 0;
    for (var i = 0; i <= numOfPoints; i++) {
        if (i > 0) {
            circlePoints += 12;
        }
    }
    return circlePoints;
}
export function ScenePoints(numOfPoints) {
    let waterpoints = [];
    //Data is packed in groups of 4 floats which are 4 bytes each, 32 bytes total for position and color
    // position            color
    //  x   y   z     w       r    g     b    a
    // 0-3 4-7 8-11 12-15  16-19 20-23 24-27 28-31
    // Here are all the different values that are used to set the side of different parts of the boat and scene
    let boatsidex = 0.03;
    let boatsidey = 0.04;
    let boatsidez = 0.05;
    let boatSlant = 0.03;
    let ruddery = 0.09;
    let rudderz1 = 0.035;
    let rudderz2 = 0.015;
    let fanSlant = 0.008;
    let fanw1 = 0.005;
    let fanh1 = 0.005;
    let fanw2 = 0.05;
    let fancenterx = 0;
    let fancentery = 0; // 0.05
    let fanz = 0.065;
    let watersize = 1.0;
    // Below are the different color options
    let water = new vec4(0.3, 0.3, 1.0, 1);
    let boatTop = new vec4(222 / 255, 184 / 255, 135 / 255, 1.0);
    let boatRight = new vec4(119 / 255, 136 / 255, 153 / 255, 1.0);
    let boatLeft = new vec4(72 / 255, 61 / 255, 139 / 255, 1.0);
    let boatFront = new vec4(143 / 255, 188 / 255, 143 / 255, 1.0);
    let boatBack = new vec4(85 / 255, 107 / 255, 47 / 255, 1.0);
    let boatSpoiler = new vec4(0 / 255, 206 / 255, 209 / 255, 1.0);
    let boatFan1 = new vec4(245 / 255, 222 / 255, 179 / 255, 1.0);
    let boatFan2 = new vec4(176 / 255, 196 / 255, 222 / 255, 1.0);
    let boatRudder1 = new vec4(139 / 255, 0 / 255, 0 / 255, 1.0);
    let boatRudder2 = new vec4(178 / 255, 34 / 255, 34 / 255, 1.0);
    let boatRudder3 = new vec4(205 / 255, 92 / 255, 92 / 255, 1.0);
    let dockTop = new vec4(101 / 255, 56 / 255, 24 / 255, 1.0);
    let dockSides = new vec4(139 / 255, 69 / 255, 19 / 255, 1.0);
    let dockLegs = new vec4(105 / 255, 105 / 255, 105 / 255, 1.0);
    let dockLegsTop = new vec4(150 / 255, 150 / 255, 150 / 255, 1.0);
    let insideBarrel = new vec4(57 / 255, 61 / 255, 71 / 255, 1.0);
    let outsideBarrel = new vec4(129 / 255, 97 / 255, 62 / 255, 1.0);
    let insideCrate = new vec4(174 / 255, 115 / 255, 78 / 255, 1.0);
    let outsideCrate = new vec4(195 / 255, 176 / 255, 145 / 255, 1.0);
    // water base
    waterpoints.push(new vec4(watersize, 0, -watersize, 1.0));
    waterpoints.push(water);
    waterpoints.push(new vec4(watersize, 0, watersize, 1.0));
    waterpoints.push(water);
    waterpoints.push(new vec4(-watersize, 0, watersize, 1.0));
    waterpoints.push(water);
    waterpoints.push(new vec4(-watersize, 0, watersize, 1.0));
    waterpoints.push(water);
    waterpoints.push(new vec4(-watersize, 0, -watersize, 1.0));
    waterpoints.push(water);
    waterpoints.push(new vec4(watersize, 0, -watersize, 1.0));
    waterpoints.push(water);
    // This is the base of the boat
    //front face = 6 verts, position then color
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatFront);
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(boatFront);
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(boatFront);
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(boatFront);
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatFront);
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatFront);
    //back face
    waterpoints.push(new vec4(-boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(boatBack);
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(boatBack);
    waterpoints.push(new vec4(boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(boatBack);
    waterpoints.push(new vec4(boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(boatBack);
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(boatBack);
    waterpoints.push(new vec4(-boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(boatBack);
    //left face
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(boatLeft);
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatLeft);
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(boatLeft);
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(boatLeft);
    waterpoints.push(new vec4(boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(boatLeft);
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(boatLeft);
    //right face
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(boatRight);
    waterpoints.push(new vec4(-boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(boatRight);
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatRight);
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatRight);
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(boatRight);
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(boatRight);
    //top
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(boatTop);
    waterpoints.push(new vec4(boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(boatTop);
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(boatTop);
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(boatTop);
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(boatTop);
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(boatTop);
    //bottom
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(boatBack);
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatBack);
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatBack);
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatBack);
    waterpoints.push(new vec4(-boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(boatBack);
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(boatBack);
    // This is the slanted front part of the boat
    //front face = 6 verts, position then color
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatFront);
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(boatFront);
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(boatFront);
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(boatFront);
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatFront);
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatFront);
    //right face
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(boatRight);
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(boatRight);
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatRight);
    //left face
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(boatLeft);
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(boatLeft);
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(boatLeft);
    // Here are the fan rotors
    //top fan
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery + fanw1, -fanz, 1.0));
    waterpoints.push(boatFan1);
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery + fanw2, -fanz, 1.0));
    waterpoints.push(boatFan1);
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery + fanw2, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan1);
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery + fanw2, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan1);
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery + fanw1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan1);
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery + fanw1, -fanz, 1.0));
    waterpoints.push(boatFan1);
    //bottom fan
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery - fanw1, -fanz, 1.0));
    waterpoints.push(boatFan1);
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery - fanw2, -fanz, 1.0));
    waterpoints.push(boatFan1);
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery - fanw2, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan1);
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery - fanw2, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan1);
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery - fanw1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan1);
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery - fanw1, -fanz, 1.0));
    waterpoints.push(boatFan1);
    //right fan
    waterpoints.push(new vec4(fancenterx - fanw1, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx - fanw2, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx - fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx - fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx - fanw1, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx - fanw1, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(boatFan2);
    //left fan
    waterpoints.push(new vec4(fancenterx + fanw1, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx + fanw2, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx + fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx + fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx + fanw1, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx + fanw1, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(boatFan2);
    // These are the three rudders
    //one rudder
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(boatRudder1);
    waterpoints.push(new vec4(0, 0, -rudderz1, 1.0));
    waterpoints.push(boatRudder1);
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(boatRudder1);
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(boatRudder1);
    waterpoints.push(new vec4(0, ruddery, -rudderz2, 1.0));
    waterpoints.push(boatRudder1);
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(boatRudder1);
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(boatRudder2);
    waterpoints.push(new vec4(0, 0, -rudderz1, 1.0));
    waterpoints.push(boatRudder2);
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(boatRudder2);
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(boatRudder2);
    waterpoints.push(new vec4(0, ruddery, -rudderz2, 1.0));
    waterpoints.push(boatRudder2);
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(boatRudder2);
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(boatRudder3);
    waterpoints.push(new vec4(0, 0, -rudderz1, 1.0));
    waterpoints.push(boatRudder3);
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(boatRudder3);
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(boatRudder3);
    waterpoints.push(new vec4(0, ruddery, -rudderz2, 1.0));
    waterpoints.push(boatRudder3);
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(boatRudder3);
    // Adding some extra stuff to my boat
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez - 0.03, 1.0));
    waterpoints.push(boatLeft);
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez - 0.08, 1.0));
    waterpoints.push(boatLeft);
    waterpoints.push(new vec4(boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(boatLeft);
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez - 0.03, 1.0));
    waterpoints.push(boatRight);
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez - 0.08, 1.0));
    waterpoints.push(boatRight);
    waterpoints.push(new vec4(-boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(boatRight);
    waterpoints.push(new vec4(-boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(boatSpoiler);
    waterpoints.push(new vec4(boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(boatSpoiler);
    waterpoints.push(new vec4(-boatsidex, boatsidey + 0.02, boatsidez - 0.08, 1.0));
    waterpoints.push(boatSpoiler);
    waterpoints.push(new vec4(boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(boatSpoiler);
    waterpoints.push(new vec4(-boatsidex, boatsidey + 0.02, boatsidez - 0.08, 1.0));
    waterpoints.push(boatSpoiler);
    waterpoints.push(new vec4(boatsidex, boatsidey + 0.02, boatsidez - 0.08, 1.0));
    waterpoints.push(boatSpoiler);
    // This is for the spotlight
    let percentAroundCircle = 2 * Math.PI / numOfPoints;
    let radius = 0.015;
    let oldX;
    let oldY;
    let angle;
    let originX = 0;
    let originY = boatsidey + radius;
    let x;
    let y;
    let CylLength = 0.02;
    for (var i = 0; i <= numOfPoints; i++) {
        angle = percentAroundCircle * i;
        x = (originX + radius * Math.cos(angle));
        y = (originY + radius * Math.sin(angle));
        if (i > 0) {
            waterpoints.push(new vec4(originX, originY, CylLength, 1.0));
            waterpoints.push(new vec4(1.0, 1.0, 0.5, 1.0)); //yellow
            waterpoints.push(new vec4(oldX, oldY, CylLength, 1.0));
            waterpoints.push(new vec4(1.0, 1.0, 0.5, 1.0)); //yellow
            waterpoints.push(new vec4(x, y, CylLength, 1.0));
            waterpoints.push(new vec4(1.0, 1.0, 0.5, 1.0)); //yellow
            waterpoints.push(new vec4(originX, originY, -CylLength, 1.0));
            waterpoints.push(new vec4(0.5, 0.5, 0.5, 1.0)); //yellow
            waterpoints.push(new vec4(oldX, oldY, -CylLength, 1.0));
            waterpoints.push(new vec4(0.5, 0.5, 0.5, 1.0)); //yellow
            waterpoints.push(new vec4(x, y, -CylLength, 1.0));
            waterpoints.push(new vec4(0.5, 0.5, 0.5, 1.0)); //yellow
            waterpoints.push(new vec4(oldX, oldY, CylLength, 1.0));
            waterpoints.push(new vec4(0.5, 0.5, 0.5, 1.0)); //yellow
            waterpoints.push(new vec4(oldX, oldY, -CylLength, 1.0));
            waterpoints.push(new vec4(0.5, 0.5, 0.5, 1.0)); //yellow
            waterpoints.push(new vec4(x, y, CylLength, 1.0));
            waterpoints.push(new vec4(0.5, 0.5, 0.5, 1.0)); //yellow
            waterpoints.push(new vec4(oldX, oldY, -CylLength, 1.0));
            waterpoints.push(new vec4(0.5, 0.5, 0.5, 1.0)); //yellow
            waterpoints.push(new vec4(x, y, CylLength, 1.0));
            waterpoints.push(new vec4(0.5, 0.5, 0.5, 1.0)); //yellow
            waterpoints.push(new vec4(x, y, -CylLength, 1.0));
            waterpoints.push(new vec4(0.5, 0.5, 0.5, 1.0)); //yellow
        }
        oldX = x;
        oldY = y;
    }
    // This is the barrels
    radius = 0.02;
    originX = 0;
    originY = 0;
    CylLength = 0.035;
    for (var j = 0; j <= numOfPoints; j++) {
        angle = percentAroundCircle * j;
        x = (originX + radius * Math.cos(angle));
        y = (originY + radius * Math.sin(angle));
        if (j > 0) {
            waterpoints.push(new vec4(originX, originY, CylLength, 1.0));
            waterpoints.push(insideBarrel);
            waterpoints.push(new vec4(oldX, oldY, CylLength, 1.0));
            waterpoints.push(insideBarrel);
            waterpoints.push(new vec4(x, y, CylLength, 1.0));
            waterpoints.push(insideBarrel);
            waterpoints.push(new vec4(originX, originY, -CylLength, 1.0));
            waterpoints.push(outsideBarrel);
            waterpoints.push(new vec4(oldX, oldY, -CylLength, 1.0));
            waterpoints.push(outsideBarrel);
            waterpoints.push(new vec4(x, y, -CylLength, 1.0));
            waterpoints.push(outsideBarrel);
            waterpoints.push(new vec4(oldX, oldY, CylLength, 1.0));
            waterpoints.push(outsideBarrel);
            waterpoints.push(new vec4(oldX, oldY, -CylLength, 1.0));
            waterpoints.push(outsideBarrel);
            waterpoints.push(new vec4(x, y, CylLength, 1.0));
            waterpoints.push(outsideBarrel);
            waterpoints.push(new vec4(oldX, oldY, -CylLength, 1.0));
            waterpoints.push(outsideBarrel);
            waterpoints.push(new vec4(x, y, CylLength, 1.0));
            waterpoints.push(outsideBarrel);
            waterpoints.push(new vec4(x, y, -CylLength, 1.0));
            waterpoints.push(outsideBarrel);
        }
        oldX = x;
        oldY = y;
    }
    // Here are the docks
    let sides = [0.1, 0.02, 0.3];
    //front face = 6 verts, position then color
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockSides);
    //back face
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockSides);
    //left face
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockSides);
    //right face
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockSides);
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockSides);
    //top
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockTop);
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockTop);
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockTop);
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockTop);
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockTop);
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockTop);
    //bottom
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockTop);
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockTop);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockTop);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockTop);
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockTop);
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockTop);
    // Here are the dock legs
    sides = [0.01, 0.3, 0.01];
    //front face = 6 verts, position then color
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockLegs);
    //back face
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockLegs);
    //left face
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockLegs);
    //right face
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockLegs);
    //top
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockLegsTop);
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockLegsTop);
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockLegsTop);
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(dockLegsTop);
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockLegsTop);
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(dockLegsTop);
    //bottom
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockLegs);
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(dockLegs);
    // Here is a crate
    sides = [0.02, 0.02, 0.02];
    //front face = 6 verts, position then color
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(outsideCrate);
    //back face
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    //left face
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(outsideCrate);
    //right face
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    //top
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(insideCrate);
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(insideCrate);
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(insideCrate);
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(insideCrate);
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(insideCrate);
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(insideCrate);
    //bottom
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(outsideCrate);
    return waterpoints;
}
//# sourceMappingURL=SetUpFunctions.js.map
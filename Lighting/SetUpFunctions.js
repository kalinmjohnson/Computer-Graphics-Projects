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
export function getSpherePoints(numOfPoints) {
    let spherePoints = 0;
    let step = (360.0 / numOfPoints) * (Math.PI / 180.0);
    for (let lat = 0; lat <= Math.PI; lat += step) { //latitude
        for (let lon = 0; lon + step <= 2 * Math.PI; lon += step) { //longitude
            //triangle 1
            spherePoints += 6;
        }
    }
    return spherePoints;
}
export function ScenePoints(numOfPoints, originX, originY, radius, boatsidey) {
    let waterpoints = [];
    //Data is packed in groups of 4 floats which are 4 bytes each, 32 bytes total for position and color
    // position            normal vector
    //  x   y   z     w       r    g     b    a
    // 0-3 4-7 8-11 12-15  16-19 20-23 24-27 28-31
    // Here are all the different values that are used to set the side of different parts of the boat and scene
    let boatsidex = 0.03;
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
    let watersize = 1.0; // Below are the different color options
    let insideCrate = new vec4(174 / 255, 115 / 255, 78 / 255, 1.0);
    let outsideCrate = new vec4(195 / 255, 176 / 255, 145 / 255, 1.0);
    // water base
    waterpoints.push(new vec4(watersize, 0, -watersize, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(watersize, 0, watersize, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-watersize, 0, watersize, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-watersize, 0, watersize, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-watersize, 0, -watersize, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(watersize, 0, -watersize, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    // This is the base of the boat
    //front face = 6 verts, position then color
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    // This is the slanted front part of the boat
    //front face = 6 verts, position then color
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push((new vec4(boatsidex, 0, boatsidez, 1.0).subtract(new vec4(boatsidex, boatsidey, boatsidez + boatSlant)).cross(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0).subtract(new vec4(boatsidex, boatsidey, boatsidez + boatSlant))).normalize()));
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push((new vec4(boatsidex, 0, boatsidez, 1.0).subtract(new vec4(boatsidex, boatsidey, boatsidez + boatSlant)).cross(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0).subtract(new vec4(boatsidex, boatsidey, boatsidez + boatSlant))).normalize()));
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push((new vec4(boatsidex, 0, boatsidez, 1.0).subtract(new vec4(boatsidex, boatsidey, boatsidez + boatSlant)).cross(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0).subtract(new vec4(boatsidex, boatsidey, boatsidez + boatSlant))).normalize()));
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push((new vec4(boatsidex, 0, boatsidez, 1.0).subtract(new vec4(boatsidex, boatsidey, boatsidez + boatSlant)).cross(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0).subtract(new vec4(boatsidex, boatsidey, boatsidez + boatSlant))).normalize()));
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push((new vec4(boatsidex, 0, boatsidez, 1.0).subtract(new vec4(boatsidex, boatsidey, boatsidez + boatSlant)).cross(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0).subtract(new vec4(boatsidex, boatsidey, boatsidez + boatSlant))).normalize()));
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push((new vec4(boatsidex, 0, boatsidez, 1.0).subtract(new vec4(boatsidex, boatsidey, boatsidez + boatSlant)).cross(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0).subtract(new vec4(boatsidex, boatsidey, boatsidez + boatSlant))).normalize()));
    //back face
    waterpoints.push(new vec4(-boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    //bottom
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    //left face
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez - 0.03, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    //left face
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    //right face
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    //right face
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez - 0.03, 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    //top
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    // Here are the fan rotors
    //top fan
    let boatFan1 = (new vec4(fancenterx + fanh1, fancentery + fanw1, -fanz, 1.0).subtract(new vec4(fancenterx - fanh1, fancentery + fanw2, -fanz + fanSlant, 1.0)).cross(new vec4(fancenterx + fanh1, fancentery + fanw1, -fanz, 1.0).subtract(new vec4(fancenterx + fanh1, fancentery + fanw2, -fanz, 1.0))));
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
    let boatFan2 = (new vec4(fancenterx + fanh1, fancentery - fanw1, -fanz, 1.0).subtract(new vec4(fancenterx + fanh1, fancentery - fanw2, -fanz, 1.0)).cross(new vec4(fancenterx + fanh1, fancentery - fanw1, -fanz, 1.0).subtract(new vec4(fancenterx - fanh1, fancentery - fanw2, -fanz + fanSlant, 1.0))));
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery - fanw1, -fanz, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery - fanw2, -fanz, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery - fanw2, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery - fanw2, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery - fanw1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan2);
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery - fanw1, -fanz, 1.0));
    waterpoints.push(boatFan2);
    //right fan
    let boatFan3 = (new vec4(fancenterx - fanw1, fancentery + fanh1, -fanz, 1.0).subtract(new vec4(fancenterx - fanw2, fancentery + fanh1, -fanz, 1.0)).cross(new vec4(fancenterx - fanw1, fancentery + fanh1, -fanz, 1.0).subtract(new vec4(fancenterx - fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0))));
    waterpoints.push(new vec4(fancenterx - fanw1, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(boatFan3);
    waterpoints.push(new vec4(fancenterx - fanw2, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(boatFan3);
    waterpoints.push(new vec4(fancenterx - fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan3);
    waterpoints.push(new vec4(fancenterx - fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan3);
    waterpoints.push(new vec4(fancenterx - fanw1, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan3);
    waterpoints.push(new vec4(fancenterx - fanw1, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(boatFan3);
    //left fan
    let boatFan4 = (new vec4(fancenterx + fanw1, fancentery + fanh1, -fanz, 1.0).subtract(new vec4(fancenterx + fanw2, fancentery + fanh1, -fanz, 1.0)).cross(new vec4(fancenterx + fanw1, fancentery + fanh1, -fanz, 1.0).subtract(new vec4(fancenterx + fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0))));
    waterpoints.push(new vec4(fancenterx + fanw1, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(boatFan4);
    waterpoints.push(new vec4(fancenterx + fanw2, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(boatFan4);
    waterpoints.push(new vec4(fancenterx + fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan4);
    waterpoints.push(new vec4(fancenterx + fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan4);
    waterpoints.push(new vec4(fancenterx + fanw1, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(boatFan4);
    waterpoints.push(new vec4(fancenterx + fanw1, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(boatFan4);
    // These are the three rudders
    //one rudder
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, 0, -rudderz1, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, ruddery, -rudderz2, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, 0, -rudderz1, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, ruddery, -rudderz2, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, 0, -rudderz1, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, ruddery, -rudderz2, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    // Adding some extra stuff to my boat
    waterpoints.push(new vec4(-boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey + 0.02, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-boatsidex, boatsidey + 0.02, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(boatsidex, boatsidey + 0.02, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    // This is for the spotlight
    let percentAroundCircle = 2 * Math.PI / numOfPoints;
    let oldX = originX + radius * Math.cos(0);
    let oldY = originY + radius * Math.sin(0);
    let angle;
    let x;
    let y;
    let CylLength = 0.02;
    for (var i = 0; i <= numOfPoints; i++) {
        angle = percentAroundCircle * i;
        x = (originX + radius * Math.cos(angle));
        y = (originY + radius * Math.sin(angle));
        if (i > 0) {
            waterpoints.push(new vec4(originX, originY, CylLength, 1.0));
            waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0)); //yellow
            waterpoints.push(new vec4(oldX, oldY, CylLength, 1.0));
            waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0)); //yellow
            waterpoints.push(new vec4(x, y, CylLength, 1.0));
            waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0)); //yellow
            waterpoints.push(new vec4(originX, originY, -CylLength, 1.0));
            waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0)); //yellow
            waterpoints.push(new vec4(oldX, oldY, -CylLength, 1.0));
            waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0)); //yellow
            waterpoints.push(new vec4(x, y, -CylLength, 1.0));
            waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0)); //yellow
            waterpoints.push(new vec4(oldX, oldY, CylLength, 1.0));
            waterpoints.push(new vec4(oldX, oldY, 0.0, 0.0)); //yellow
            waterpoints.push(new vec4(oldX, oldY, -CylLength, 1.0));
            waterpoints.push(new vec4(oldX, oldY, 0.0, 0.0)); //yellow
            waterpoints.push(new vec4(x, y, CylLength, 1.0));
            waterpoints.push(new vec4(x, y, 0.0, 0.0)); //yellow
            waterpoints.push(new vec4(oldX, oldY, -CylLength, 1.0));
            waterpoints.push(new vec4(oldX, oldY, 0.0, 0.0)); //yellow
            waterpoints.push(new vec4(x, y, CylLength, 1.0));
            waterpoints.push(new vec4(x, y, 0.0, 0.0)); //yellow
            waterpoints.push(new vec4(x, y, -CylLength, 1.0));
            waterpoints.push(new vec4(x, y, 0.0, 0.0)); //yellow
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
            waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
            waterpoints.push(new vec4(oldX, oldY, CylLength, 1.0));
            waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
            waterpoints.push(new vec4(x, y, CylLength, 1.0));
            waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
            waterpoints.push(new vec4(originX, originY, -CylLength, 1.0));
            waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
            waterpoints.push(new vec4(oldX, oldY, -CylLength, 1.0));
            waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
            waterpoints.push(new vec4(x, y, -CylLength, 1.0));
            waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
            waterpoints.push(new vec4(oldX, oldY, CylLength, 1.0));
            waterpoints.push(new vec4(oldX, oldY, 0, 0.0));
            waterpoints.push(new vec4(oldX, oldY, -CylLength, 1.0));
            waterpoints.push(new vec4(oldX, oldY, 0, 0.0));
            waterpoints.push(new vec4(x, y, CylLength, 1.0));
            waterpoints.push(new vec4(x, y, 0, 0.0));
            waterpoints.push(new vec4(oldX, oldY, -CylLength, 1.0));
            waterpoints.push(new vec4(oldX, oldY, 0, 0.0));
            waterpoints.push(new vec4(x, y, CylLength, 1.0));
            waterpoints.push(new vec4(x, y, 0, 0.0));
            waterpoints.push(new vec4(x, y, -CylLength, 1.0));
            waterpoints.push(new vec4(x, y, 0, 0.0));
        }
        oldX = x;
        oldY = y;
    }
    // Here are the docks
    let sides = [0.1, 0.02, 0.3];
    //front face = 6 verts, position then color
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    //back face
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    //left face
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    //right face
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    //top
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    //bottom
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    // Here are the dock legs
    sides = [0.01, 0.3, 0.01];
    //front face = 6 verts, position then color
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0));
    //back face
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0));
    //left face
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 0.0));
    //right face
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(-1.0, 0.0, 0.0, 0.0));
    //top
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], sides[1], sides[2], 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
    //bottom
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, sides[2], 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(-sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
    waterpoints.push(new vec4(sides[0], 0, -sides[2], 1.0));
    waterpoints.push(new vec4(0.0, -1.0, 0.0, 0.0));
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
    // Here are the lightbulbs
    originX = -0.001;
    originY = boatsidey;
    radius = 0.001;
    for (i = 0; i <= numOfPoints; i++) {
        angle = percentAroundCircle * i;
        x = (originX + radius * Math.cos(angle));
        y = (originY + radius * Math.sin(angle));
        if (i > 0) {
            waterpoints.push(new vec4(-0.031, originY, originX, 1.0));
            waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0)); //yellow
            waterpoints.push(new vec4(-0.031, oldY, oldX, 1.0));
            waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0)); //yellow
            waterpoints.push(new vec4(-0.031, y, x, 1.0));
            waterpoints.push(new vec4(0.0, 0.0, 1.0, 0.0)); //yellow
        }
        oldX = x;
        oldY = y;
    }
    originX = 0.001;
    for (i = 0; i <= numOfPoints; i++) {
        angle = percentAroundCircle * i;
        x = (originX + radius * Math.cos(angle));
        y = (originY + radius * Math.sin(angle));
        if (i > 0) {
            waterpoints.push(new vec4(0.031, originY, originX, 1.0));
            waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0)); //yellow
            waterpoints.push(new vec4(0.031, oldY, oldX, 1.0));
            waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0)); //yellow
            waterpoints.push(new vec4(0.031, y, x, 1.0));
            waterpoints.push(new vec4(0.0, 0.0, -1.0, 0.0)); //yellow
        }
        oldX = x;
        oldY = y;
    }
    // These are the hazard lights
    radius = 0.003;
    let step = (360.0 / numOfPoints) * (Math.PI / 180.0);
    for (let lat = 0; lat <= Math.PI + step; lat += step) { //latitude
        for (let lon = 0; lon + step <= 2 * Math.PI + step; lon += step) { //longitude
            //triangle 1
            waterpoints.push(new vec4(radius * Math.sin(lat) * Math.sin(lon), radius * Math.cos(lat), radius * Math.cos(lon) * Math.sin(lat), 1.0));
            waterpoints.push(new vec4(-radius * Math.sin(lat) * Math.sin(lon), -radius * Math.cos(lat), Math.cos(lon) * -radius * Math.sin(lat), 0.0));
            waterpoints.push(new vec4(radius * Math.sin(lat) * Math.sin(lon + step), radius * Math.cos(lat), Math.sin(lat) * radius * Math.cos(lon + step), 1.0));
            waterpoints.push(new vec4(-radius * Math.sin(lat) * Math.sin(lon + step), -radius * Math.cos(lat), Math.sin(lat) * -radius * Math.cos(lon + step), 0.0));
            waterpoints.push(new vec4(radius * Math.sin(lat + step) * Math.sin(lon + step), radius * Math.cos(lat + step), radius * Math.cos(lon + step) * Math.sin(lat + step), 1.0));
            waterpoints.push(new vec4(-radius * Math.sin(lat + step) * Math.sin(lon + step), -radius * Math.cos(lat + step), -radius * Math.cos(lon + step) * Math.sin(lat + step), 0.0));
            //triangle 2
            waterpoints.push(new vec4(radius * Math.sin(lat + step) * Math.sin(lon + step), radius * Math.cos(lat + step), radius * Math.cos(lon + step) * Math.sin(lat + step), 1.0));
            waterpoints.push(new vec4(-radius * Math.sin(lat + step) * Math.sin(lon + step), -radius * Math.cos(lat + step), -radius * Math.cos(lon + step) * Math.sin(lat + step), 0.0));
            waterpoints.push(new vec4(radius * Math.sin(lat + step) * Math.sin(lon), radius * Math.cos(lat + step), radius * Math.sin(lat + step) * Math.cos(lon), 1.0));
            waterpoints.push(new vec4(-radius * Math.sin(lat + step) * Math.sin(lon), -radius * Math.cos(lat + step), -radius * Math.sin(lat + step) * Math.cos(lon), 0.0));
            waterpoints.push(new vec4(radius * Math.sin(lat) * Math.sin(lon), radius * Math.cos(lat), radius * Math.cos(lon) * Math.sin(lat), 1.0));
            waterpoints.push(new vec4(-radius * Math.sin(lat) * Math.sin(lon), -radius * Math.cos(lat), -radius * Math.cos(lon) * Math.sin(lat), 0.0));
        }
    }
    // these are the red dots in the middle of the scene
    radius = 0.01;
    for (let lat = 0; lat <= Math.PI + step; lat += step) { //latitude
        for (let lon = 0; lon + step <= 2 * Math.PI + step; lon += step) { //longitude
            //triangle 1
            waterpoints.push(new vec4(radius * Math.sin(lat) * Math.sin(lon), radius * Math.cos(lat), radius * Math.cos(lon) * Math.sin(lat), 1.0));
            waterpoints.push(new vec4(radius * Math.sin(lat) * Math.sin(lon), radius * Math.cos(lat), Math.cos(lon) * radius * Math.sin(lat), 0.0));
            waterpoints.push(new vec4(radius * Math.sin(lat) * Math.sin(lon + step), radius * Math.cos(lat), Math.sin(lat) * radius * Math.cos(lon + step), 1.0));
            waterpoints.push(new vec4(radius * Math.sin(lat) * Math.sin(lon + step), radius * Math.cos(lat), Math.sin(lat) * radius * Math.cos(lon + step), 0.0));
            waterpoints.push(new vec4(radius * Math.sin(lat + step) * Math.sin(lon + step), radius * Math.cos(lat + step), radius * Math.cos(lon + step) * Math.sin(lat + step), 1.0));
            waterpoints.push(new vec4(radius * Math.sin(lat + step) * Math.sin(lon + step), radius * Math.cos(lat + step), radius * Math.cos(lon + step) * Math.sin(lat + step), 0.0));
            //triangle 2
            waterpoints.push(new vec4(radius * Math.sin(lat + step) * Math.sin(lon + step), radius * Math.cos(lat + step), radius * Math.cos(lon + step) * Math.sin(lat + step), 1.0));
            waterpoints.push(new vec4(radius * Math.sin(lat + step) * Math.sin(lon + step), radius * Math.cos(lat + step), radius * Math.cos(lon + step) * Math.sin(lat + step), 0.0));
            waterpoints.push(new vec4(radius * Math.sin(lat + step) * Math.sin(lon), radius * Math.cos(lat + step), radius * Math.sin(lat + step) * Math.cos(lon), 1.0));
            waterpoints.push(new vec4(radius * Math.sin(lat + step) * Math.sin(lon), radius * Math.cos(lat + step), radius * Math.sin(lat + step) * Math.cos(lon), 0.0));
            waterpoints.push(new vec4(radius * Math.sin(lat) * Math.sin(lon), radius * Math.cos(lat), radius * Math.cos(lon) * Math.sin(lat), 1.0));
            waterpoints.push(new vec4(radius * Math.sin(lat) * Math.sin(lon), radius * Math.cos(lat), radius * Math.cos(lon) * Math.sin(lat), 0.0));
        }
    }
    return waterpoints;
}
//# sourceMappingURL=SetUpFunctions.js.map
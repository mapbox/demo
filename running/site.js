/*
 * This is just an experiment with rotating and tilting 2d maps
 *
 * next steps:
 * - allow variable maps
 * - precalculate entire path to enable prefetching of tiles and moving forwards/backwards
 * - time-based animation accuracy
 */

// Start everything
MM.addEvent(container, 'click', go);

// Adjust direction you're looking from
// 0 for back, 180 for front, etc
var cameraAngle = 0;

// Zoom level for main animation
var zoomLevel = 16;

// Milliseconds between points
var interval = 150;

// Create basic MM map
var retina = new MM.TemplatedLayer('http://c.tiles.mapbox.com/v3/aibram.map-3kz5m8d5/{Z}/{X}/{Y}.png');
var regular = new MM.TemplatedLayer('http://c.tiles.mapbox.com/v3/aibram.map-or4n7qof/{Z}/{X}/{Y}.png');
var map = new MM.Map('rot', [retina, regular]);

map.setCenterZoom({
    lat: 38.88194668656299,
    lon: -77.02857971191406
}, 12);

// Easing for easing (hacked up version with support for easing rotations and scales)
var ea = easey().map(map);

// Keep track of map's angle and scale
map.angle = 0;
map.scale = 1;

// This does does all the actual scaling and rotating work
map.transform = function(angle, scale) {
    if (typeof angle !== 'undefined') this.angle = angle;
    if (typeof scale !== 'undefined') this.scale = scale;
    var rotate = 'rotate(' + this.angle + 'deg)';
    rot.style.webkitTransform = rotate;
    rot.style.MozTransform = rotate;
    rot.style.msTransform = rotate;
    rot.style.OTransform = rotate;
    rot.style.transform = rotate;
    var scale = 'scaleY(' + this.scale + ')';
    skw.style.webkitTransform = scale;
    skw.style.MozTransform = scale;
    skw.style.msTransform = scale;
    skw.style.OTransform = scale;
    skw.style.transform = scale;
    map.setSize({x: 1200, y: 900 / this.scale});
    map.parent.style.top = -250 / this.scale + 'px';
}


var n = 6; 

function run(i) {


    // Stop running and move onto end sequence
    if (i >= points.features.length - n - 1) {
        map.enableLayerAt(1);
        return ea.to(map.coordinate).zoom(map.zoom() - 2).angle(0).scale(1).run(4000);
    }

    // Calclate distance, time, speed
    var distance = MM.Location.distance(
            { lat: points.features[i].geometry.coordinates[1], lon: points.features[i].geometry.coordinates[0]},
            { lat: points.features[i+1].geometry.coordinates[1], lon: points.features[i+1].geometry.coordinates[0]});
    var dt = points.features[i+1].properties.time - points.features[i].properties.time;
    var speeed = distance / 1000 / dt * 60 * 60;

    // Calculating direction, very basic smoothing, could use work
    var basedir = getdir(i);
    var totaldir = 0;
    totaldir += (getdir(i - 6) - basedir) * 0.3;
    totaldir += (getdir(i - 5) - basedir) * 0.3;
    totaldir += (getdir(i - 4) - basedir) * 0.3;
    totaldir += (getdir(i - 3) - basedir) * 0.3;
    totaldir += (getdir(i - 2) - basedir) * 0.3;
    totaldir += (getdir(i - 1) - basedir) * 0.7;
    totaldir += (getdir(i + 1) - basedir) * 0.7;
    totaldir += (getdir(i + 2) - basedir) * 0.3;
    totaldir += (getdir(i + 3) - basedir) * 0.3;
    totaldir += (getdir(i + 4) - basedir) * 0.3;
    totaldir += (getdir(i + 5) - basedir) * 0.3;
    totaldir += (getdir(i + 6) - basedir) * 0.3;
    totaldir = totaldir / 5.4;
    totaldir += basedir;
    dir = totaldir;
    dir += cameraAngle;

    // Get angle between
    function getdir(i) {
        var c1 = getCoord(i);
        var c2 = getCoord(i + 1);
        var dx = c2.row - c1.row;
        var dy = c2.column - c1.column;
        var dir = (Math.atan(-dx/dy) * 180 / Math.PI) + (dy >= 0 ? -90 : 90);
        return dir;
    }

    // Euclidean distance
    function dist (a, b) {
        return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.comlumn - b.comlumn, 2));
    }

    function getCoord(i) {
        return map.locationCoordinate({ lat: points.features[i].geometry.coordinates[1], lon: points.features[i].geometry.coordinates[0]});
    }

    // Update sidebar
    speed.innerHTML = Math.round(speeed) + ' <span class="label">km/hour</span>';
    alt.style.width = 3 * dat.length + 'px';
    altext.innerHTML = Math.round(points.features[i].properties.alt) + ' <span class="label">m</span>';

    // Update d3 graph
    dat[dat.length - 1] = (points.features[i].properties.alt);
    dat.push(0);
    p.attr("d", line(dat));

    // Actually ease to location/rotation/scale
    ea.to(getCoord(i)).zoom(zoomLevel).easing('linear').angle(dir).run(interval, function() {
        run(i + 1);
    });
}


// Initialize d3 graph
var dat = [0, 0];
var vis = d3.select("#alt")
.append("svg:svg")
.attr("width", 800)
.attr("height", 100)
.append("svg:g") 
var line = d3.svg.line().x(function(d, i) { return i * 2; }).y(function(d) { return 80 - d * 0.74; }).interpolate('basis'); 
var p = vis.append("svg:path");


// Cheesy running man animation
var frame = 0;
function walkingmancycle() {
    frame ++;
    frame = frame % 8;
    document.getElementById('person-marker').className = 'dir-up frame-' + frame;
    window.setTimeout(walkingmancycle, 80);
}


// Start everything
function go() {
    document.getElementById('rot').className = '';
    var startn = 30; // Lets start at datapoint #30 for this example
    var start = map.locationCoordinate({ lat: points.features[startn].geometry.coordinates[1], lon: points.features[startn].geometry.coordinates[0]});
    map.disableLayerAt(1);
    ea.to(start).zoom(zoomLevel).angle(89.55418593241524).easing('easeOut').scale(0.6).optimal(null, null, function() {
        center.style.display = 'block';
        heartbeat.innerHTML = '128 <span class="label">bpm</span>';
        run(startn);
    });
    walkingmancycle();
}

wax = wax || {};
wax.mm = wax.mm || {};

// Box Selector
// ------------
//
// This control lets people click and draw a box on a map
// to select a geographical area, and calls a callback function with the
// bounding box selected as an argument.
wax.mm.periscope = function(map, tilejson, opts) {
    var mouseDownPoint = null,
        MM = com.modestmaps,
        // callback = ((typeof opts === 'function') ?
        //     opts :
        //     opts.callback),
        boxDiv,
        boxes = [],
        periscope = {};

    function drawboxes(map, e) {
        for (var i = 0; i < boxes.length; i++) {
            if (!boxes[i].d) {
                boxes[i].d = document.createElement('div');
                var l = document.createElement('span');
                var fill = document.createElement('div');
                boxes[i].d.className = 'periscope-box';
                l.innerHTML = boxes[i].l.name;
                l.style.fontSize = Math.sqrt(boxes[i].s) * 4 + 'px';
                map.parent.appendChild(boxes[i].d);
                boxes[i].d.appendChild(fill);
                boxes[i].d.appendChild(l);
            }

            var boxDiv = boxes[i].d;

            var br = map.locationPoint(boxes[i][0]),
                tl = map.locationPoint(boxes[i][1]);

            var left = Math.max(0, Math.min(tl.x, br.x));
            var top = Math.max(0, Math.min(tl.y, br.y));

            var right = Math.min(map.dimensions.x, Math.max(tl.x, br.x));
            var bottom = Math.min(map.dimensions.y, Math.max(tl.y, br.y));

            boxDiv.style.left = left + 'px';
            boxDiv.style.top = top + 'px';
            if ((right - left) < 0 || (bottom - top) < 0) { boxDiv.style.display = 'none'; }
            boxDiv.style.width = (right - left) + 'px';
            boxDiv.style.height = (bottom - top) + 'px';
        }
    }

    periscope.hide = function() {
        for (var i = 0; i < boxes.length; i++) {
            boxes[i].d.style.display = 'none';
        }
    };

    periscope.show = function() {
        for (var i = 0; i < boxes.length; i++) {
            boxes[i].d.style.display = 'block';
        }
    };

    periscope.addBox = function(box) {
        boxes.push(box);
    };

    periscope.add = function(map) {
        map.addCallback('drawn', drawboxes);
        return this;
    };

    periscope.remove = function() {
        map.parent.removeChild(boxDiv);
        map.removeCallback('drawn', drawbox);
    };

    return periscope.add(map);
};


var MM = com.modestmaps, map, worldwide, regional, p, basecounter = 0;

function setTileset(tj) {
    map.setProvider(new wax.mm.connector(tj));
    $('#region_header').html(region_header(tj));
}

var region_link = _.template('<a href="#<%= id %>"><%= name %></a>');
var region_header = _.template('<h1><a href="http://tiles.mapbox.com/mapbox/map/<%= id.replace("mapbox.", "") %>"><%= name %></a></h1>');

$(function() {
    map = new MM.Map('map');
    wax.mm.zoomer(map).appendTo(map.parent);
    wax.request.get(
        'http://api.tiles.mapbox.com/v2/mapbox/tilesets.jsonp',
        function(err, tilesets) {
            worldwide = _(tilesets).select(function(ts) {
                var b = ts.bounds;
                return b[0] < -170 &&
                    b[1] < -70 &&
                    b[2] > 170 &&
                    b[3] > 70;
            });

            regional = _(tilesets).select(function(ts) {
                var b = ts.bounds;
                return !(b[0] < -170 &&
                    b[1] < -70 &&
                    b[2] > 170 &&
                    b[3] > 70);
            });

            worldwide[basecounter].maxzoom = 25;
            setTileset(worldwide[basecounter]);
            map.setExtent([
                new MM.Location(-60, 140),
                new MM.Location(60, -140)
            ]);

            _.each(regional, function(l) {
                $('#links').append(region_link(l));
            });

            $('#nextbase').click(function(e) {
                basecounter++;
                if (basecounter > (worldwide.length - 1)) {
                    basecounter = 0;
                }
                worldwide[basecounter].maxzoom = 25;
                setTileset(worldwide[basecounter]);
            });


            $('#links a').click(function(e) {
                var id = $(this).attr('href').substring(1);

                var layer = _.select(regional, function(l) {
                    return l.id == id;
                })[0];
                worldwide[basecounter].maxzoom = 25;
                setTileset(worldwide[basecounter]);
                easey.slow(map, {
                    time:500,
                    extent: [
                        new MM.Location(-60, 140),
                        new MM.Location(60, -140)
                    ],
                    callback: function() {
                        easey.slow(map, {
                            time:4000,
                            extent: [
                                new MM.Location(layer.bounds[1], layer.bounds[0]),
                                new MM.Location(layer.bounds[3], layer.bounds[2])
                            ],
                            callback: function() {
                                setTileset(layer);
                                map.setZoom(~~map.getZoom());
                            }
                        });
                    }
                });
            });
    });
});

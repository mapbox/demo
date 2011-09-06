function resolveCode(key) {
    if (key >= 93) key--;
    if (key >= 35) key--;
    key -= 32;
    return key;
}

var MM = com.modestmaps;
$(function() {
    wax.tilejson(
        'http://d.tiles.mapbox.com/mapbox/1.0.0/geography-class/layer.json',
        function(tilejson) {
        var map = new MM.Map('map', new wax.mm.connector(tilejson));
        map.setCenterZoom(new MM.Location(0, 0), 1);
        wax.mm.interaction(map, tilejson);
        map.requestManager.addCallback('requestcomplete', function(map, img) {
            var x = $(img).attr('src');
            $('<img src="' + x + '" />')
                .addClass('request-image')
                .prependTo('#downloaded-tiles');
            if ($('#downloaded-tiles img').length > 4) {
                $('#downloaded-tiles img:last').remove();
            }
        });

        instrumentHub.addCallback('grid', function(x, g) {
            $('<a href="' + g.url + '"></a>')
                .text(g.url.replace('http://', ''))
                .prependTo('#downloaded-grids');
            if ($('#downloaded-grids a').length > 1) {
                $('#downloaded-grids a:last').remove();
            }
        });

        instrumentHub.addCallback('offset', function(x, g) {
            $('#tile-offset').text(
                g.left + ' x ' + g.top);
        });

        instrumentHub.addCallback('mouseOffset', function(x, g) {
            $('#mouse-offset').text(
                g[0] + ' x ' + g[1]);
        });

        instrumentHub.addCallback('key', function(x, g) {
            $('#key').text(g);
            $('#key-charcode').text(g.charCodeAt(0));
            $('#key-resolvedcode').text(resolveCode(g.charCodeAt(0)));
        });

        instrumentHub.addCallback('feature', function(x, g) {
            $('#feature-json').text(JSON.stringify(g, null, 4));
        });

        instrumentHub.addCallback('featureHTML', function(x, g) {
            $('#feature-html').html(g);
        });
    });
});
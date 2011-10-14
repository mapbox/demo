function periscope(resp) {
    byName = _(resp).chain().filter(function(l) { return !!!l.api; }).groupBy(function(l) { return l.name; }).value();
    var m = new mm.Map('periscope', new wax.mm.connector(byName['World Blank Bright'][0]));
    var p = wax.mm.periscope(m);
    m.setCenterZoom(new mm.Location(0, 0), 3);

    _.each(byName, function(l, k) {
        l = l[0];
        var box = [
            new mm.Location(l.bounds[1], l.bounds[0]),
            new mm.Location(l.bounds[3], l.bounds[2])
        ];
        var size = (l.bounds[3] - l.bounds[1]) + (l.bounds[2] - l.bounds[0]);
        box.l = l;
        box.s = size;
        if (size < 500) {
            p.addBox(box);
        }
    });
}

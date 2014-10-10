/*jslint plusplus: true */
require({
	async : true,
	packages : [{
		name : "jrc",
		location : "/darios_lcc/scripts"
	}]
}, ["dojo/date/stamp", "dijit/registry", "dojo/ready", "dojo/parser", "dojo/_base/array", "esri/geometry/Extent", "esri/SpatialReference", "dojo/on", "jrc/GeeLayer", "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/Calendar", "dijit/form/Button", "dijit/form/Select", "dijit/form/CheckBox"], function(stamp, registry, ready, parser, array, Extent, SpatialReference, on, GeeLayer) {
	ready(function() {
		var map, rgbLayer;
		parser.parse().then(function() {
			on(registry.byId("updateButton"), "click", getMap);
			on(registry.byId("collectionSelect"), "click", getMap);
			on(registry.byId("toggleRGB"), "change", function(value) {
				rgbLayer.setVisibility(!rgbLayer.visible);
			});
			on(registry.byId("toggleWater"), "change", function(value) {
				lccLayer.setVisibility(!lccLayer.visible);
			});
		});
		initExtent = new Extent(3801000,-783000,4095000,-644000, new SpatialReference({
			wkid : 102100
		}));
		map = new esri.Map("map", {
			extent : initExtent,
			basemap : "topo",
			sliderStyle : "large"
		});
		on(map, "extent-change", extentChange);
		map.on("load", function() {
			rgbLayer = new GeeLayer('rgbLayer', {
				visible : true
			});
			rgbLayer.set("sceneid", "collection");
			lccLayer = new GeeLayer('lccLayer', {
				startDate : stamp.toISOString(registry.byId("startcal").value).substr(0, 10),
				endDate : stamp.toISOString(registry.byId("endcal").value).substr(0, 10),
				collectionid : registry.byId("collectionSelect").value,
				visible : true
			});
			lccLayer.set("sceneid", "dario");
			map.addLayers([rgbLayer, lccLayer]);
		});
		function extentChange(event) {
			console.log("extentChange (x=" + map.extent.getCenter().x + " y=" + map.extent.getCenter().y + ")");
			array.forEach(map.layerIds, function(item) {
				var layer = map.getLayer(item);
				if (layer.declaredClass === 'jrc/GeeLayer') {
					layer.set("extent", map.extent);
				};
			});
		}

		function getMap() {
			array.forEach(map.layerIds, function(item) {
				var layer = map.getLayer(item);
				if (layer.declaredClass === 'jrc/GeeLayer') {
					layer.refresh();
				};
			});
		}

	});
});
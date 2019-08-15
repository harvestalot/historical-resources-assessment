//文化资源评估--物质文化遗产
function MaterialCulturalHeritage() {
}
MaterialCulturalHeritage.prototype.init = function(){
	this.sidebar_polygonLayer();
}
//添加图层
MaterialCulturalHeritage.prototype.sidebar_polygonLayer = function(){
	var _this = this;
	sidebar_polygonLayer = new Loca.PolygonLayer({
        map: map,
        // zIndex: 15,
        fitView: true,
        // eventSupport:true,
    });
    sidebar_polygonLayer.setData(material_cultural_heritage_data, {
        lnglat: 'lnglat'
    });

    sidebar_polygonLayer.setOptions({
        style: {
            // opacity: 0.5,
            color: "#FF7F7F",
            height: function () {
                return Math.random() * 500 + 100;
            }
        }
    });
    sidebar_polygonLayer.render();
    sidebar_polygonLayer.show();
}
var start_material_cultural_heritage_rendering = new MaterialCulturalHeritage();
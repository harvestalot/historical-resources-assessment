//文化资源评估--文物保护单位
function CulturalRelicPtection() {
}
CulturalRelicPtection.prototype.init = function(){
	this.sidebar_polygonLayer();
    this.render_point_layer();
}
//添加图层
CulturalRelicPtection.prototype.sidebar_polygonLayer = function(){
	var _this = this;
	sidebar_polygonLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 20,
        fitView: true,
        // eventSupport:true,
    });
    sidebar_polygonLayer.setData(cultural_relic_protection_area_data, {
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
//添加设施点标识图层
CulturalRelicPtection.prototype.render_point_layer = function(){
    var _this = this;
    point_layer = new Loca.IconLayer({
        map: map,
        zIndex: 100,
        eventSupport:true,
    });
    point_layer.setData(cultural_relic_protection_point_data, {
        lnglat: 'lnglat'
    });
    point_layer.setOptions({
        source: function(res) {
            var src = point_icon_server_url+ '/beixinqiao/baohudanwei.png';
            return src;
        },
        style: {
            size: 32
        }
    });
    point_layer.render();
    point_layer.on('click', function (ev) {
        var properties = ev.rawData.properties;
        //渲染信息窗体
        openInfo(properties.OBJNAME, "", ev.lnglat);
    });
}
var start_cultural_relic_protection_rendering = new CulturalRelicPtection();
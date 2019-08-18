//文化资源评估--历史建筑
function HistoricalBuilding() {
}
HistoricalBuilding.prototype.init = function(){
	this.render_point_layer();
}
//添加设施点标识图层
HistoricalBuilding.prototype.render_point_layer = function(){
    var _this = this;
    point_layer = new Loca.IconLayer({
        map: map,
        zIndex: 100,
        eventSupport:true,
    });
    point_layer.setData(historical_building_data, {
        lnglat: 'lnglat'
    });
    point_layer.setOptions({
        source: function(res) {
            var src = point_icon_server_url+ '/beixinqiao/lishijianzhu.png';
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
        openInfo(properties.name, properties.addres, ev.lnglat);
    });
}
var start_historical_building_rendering = new HistoricalBuilding();
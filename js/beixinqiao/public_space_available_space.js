//公共空间评估--可利用空间资源
function PublicSpaceAvailableApace() {
}
PublicSpaceAvailableApace.prototype.init = function(){
	this.sidebar_polygonLayer();
    this.render_point_layer();
}
//添加图层
PublicSpaceAvailableApace.prototype.sidebar_polygonLayer = function(){
	var _this = this;
	sidebar_polygonLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 20,
        fitView: true,
        // eventSupport:true,
    });
    sidebar_polygonLayer.setData(public_space_available_space_data, {
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
//添加图层
PublicSpaceAvailableApace.prototype.render_point_layer = function(){
    var _this = this;
    point_layer = new Loca.IconLayer({
        map: map,
        zIndex: 100,
        fitView: true,
        eventSupport:true,
    });
    point_layer.setData(public_space_available_space_point_data, {
        lnglat: 'lnglat'
    });
    point_layer.setOptions({
        source: function(res) {
            var src = point_icon_server_url+ '/beixinqiao/industry/keliyongkongjian.png';
            return src;
        },
        style: {
            size: 20
        }
    });
    point_layer.render();
    // point_layer.show();
    point_layer.on('click', function (ev) {
        var properties = ev.rawData;
        //渲染信息窗体
        openInfo(properties.name, "", properties.lnglat);
    });
}
var start_available_space_rendering = new PublicSpaceAvailableApace();
//公共空间评估--公共空间共享
function PublicSpaceShare() {
}
PublicSpaceShare.prototype.init = function(){
	this.load_line_layer();
    this.sidebar_polygonLayer();
}
//添加图层
PublicSpaceShare.prototype.load_line_layer = function(){
	var _this = this;
	line_layer = new Loca.LineLayer({
        map: map,
        zIndex: 20,
        fitView: true,
        // eventSupport:true,
    });
    line_layer.setData(public_space_share_line_data, {
        lnglat: 'lnglat'
    });

    line_layer.setOptions({
        style: {
            // opacity: 0.5,
            color: "#07F707",
            height: function () {
                return Math.random() * 500 + 100;
            }
        }
    });
    line_layer.render();
    line_layer.show();
}
//添加图层
PublicSpaceShare.prototype.sidebar_polygonLayer = function(){
    var _this = this;
    sidebar_polygonLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 20,
        fitView: true,
        // eventSupport:true,
    });
    sidebar_polygonLayer.setData(public_space_share_area_data, {
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
var start_public_space_share_rendering = new PublicSpaceShare();
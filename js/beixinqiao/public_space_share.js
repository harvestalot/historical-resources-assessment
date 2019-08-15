//公共空间评估--公共空间共享
function PublicSpaceShare() {
}
PublicSpaceShare.prototype.init = function(){
	this.sidebar_polygonLayer();
}
//添加图层
PublicSpaceShare.prototype.sidebar_polygonLayer = function(){
	var _this = this;
	sidebar_polygonLayer = new Loca.PolygonLayer({
        map: map,
        // zIndex: 15,
        fitView: true,
        // eventSupport:true,
    });
    sidebar_polygonLayer.setData(actuality_greenbelt_data, {
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
//公共空间评估--绿地资源
function PublicSpaceGreenbelt() {
}
PublicSpaceGreenbelt.prototype.init = function(){
	this.sidebar_polygonLayer();
}
//添加图层
PublicSpaceGreenbelt.prototype.sidebar_polygonLayer = function(){
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
var start_greenbelt_rendering = new PublicSpaceGreenbelt();
//公共空间评估--公共空间共享
function PublicSpaceShare() {
}
PublicSpaceShare.prototype.init = function(){
    this.load_dom();
	this.load_line_layer();
    this.sidebar_polygonLayer();
}
//生产dom元素
PublicSpaceShare.prototype.load_dom = function(){
    var public_service_dom_str = '<div>'+
    '<p class="message">更新策略：</p>'+
    '<p class="message">在控规中落实功能政策区，明确功能发育的可能区域，提供政策开放期，进行产权功能的变更。</p>'+
    '</div>';
    $("#visualization_echarts_content").append(public_service_dom_str);
};
//添加图层
PublicSpaceShare.prototype.load_line_layer = function(){
	var _this = this;
    $.get(file_server_url+'public_space_share.js', function (public_space_share_data) {
    	line_layer = new Loca.LineLayer({
            map: map,
            zIndex: 20,
            fitView: true,
            // eventSupport:true,
        });
        line_layer.setData(public_space_share_data.public_space_share_line_data, {
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
    })
}
//添加图层
PublicSpaceShare.prototype.sidebar_polygonLayer = function(){
    var _this = this;
    var round_point_color = echarts_color;
    $.get(file_server_url+'public_space_share.js', function (public_space_share_data) {
        sidebar_polygonLayer = new Loca.PolygonLayer({
            map: map,
            zIndex: 20,
            fitView: true,
            // eventSupport:true,
        });
        sidebar_polygonLayer.setData(public_space_share_data.public_space_share_area_data, {
            lnglat: 'lnglat'
        });

        sidebar_polygonLayer.setOptions({
            style: {
                // opacity: 0.5,
                // color: "#FF7F7F",
                color: function (data) {
                    var type = data.value.name;
                    var color = round_point_color[0];
                    switch (type){
                        case "底层空间公共化区域" :
                            color = round_point_color[0];
                            break;
                        case "公共空间共享" :
                            color = round_point_color[1];
                            break;
                        case "文创产业鼓励区域" :
                            color = round_point_color[2];
                            break;
                        case "社区服务共享区域" :
                            color = round_point_color[3];
                            break;
                    }
                    return color;
                },
                height: function () {
                    return Math.random() * 500 + 100;
                }
            }
        });
        sidebar_polygonLayer.render();
        sidebar_polygonLayer.show();
    })
}
var start_public_space_share_rendering = new PublicSpaceShare();
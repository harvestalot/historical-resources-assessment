//公共空间评估--可利用空间资源
function PublicSpaceAvailableApace() {
}
PublicSpaceAvailableApace.prototype.init = function(){
    this.load_dom();
	this.sidebar_polygonLayer();
    this.render_point_layer();
}
//生产dom元素
PublicSpaceAvailableApace.prototype.load_dom = function(){
    const public_service_dom_str = '<div>'+
    '<p class="message">梳理可利用空间资源：</p>'+
    '<p class="message">将单元内的可利用空间资源按类别梳理明确，为将来公共设施的合理配置打好空间基础。</p>'+
    '<p class="legend_item message"><span style="background-color: #d66349"></span>已收回直管公房：目前有约800平使用面积公房已回收，可为后期的公共设施配置提供部分合理空间资源。</p>'+
    '<p class="legend_item message"><span style="background-color: #579dcb"></span>意向腾退文物地：目前意向以柏林寺、北新仓为主，建议腾退使用。</p>'+
    '<p class="legend_item message"><span style="background-color: #5cba89"></span>可利用闲置区：后永康胡同16号煤场闲置地。可作为大型集中公共服务用地。</p>'+
    '<p class="legend_item message"><span style="background-color: #a57ec0"></span>可统一调配公共服务设施单元：以社区居委会，综合服务站点为主，作为可供置换的潜力空间。</p>'+
    '<p class="legend_item message"><span style="background-color: #768189"></span>地下空间：以楼房社区低效使用地下室空间为主体，可作为社区服务配套的备选空间。</p>'+
    '</div>';
    $("#visualization_echarts_content").append(public_service_dom_str);
};
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
            color: "#768189",
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
    // var round_point_color = this.round_point_color;
    round_point_layer = new Loca.RoundPointLayer({
        map: map,
        zIndex: 100,
        eventSupport:true,
    });
    round_point_layer.setData(public_space_available_space_point_data, {
        lnglat: 'lnglat'
    });
    round_point_layer.setOptions({
        style: {
            radius: 6,
            color: function (data) {
                var type = data.value.name;
                var color = echarts_color[0];
                switch (type){
                    case "可统一调配公共服务设施单元" :
                        color = echarts_color[0];
                        break;
                    case "意向腾退文物地" :
                        color = echarts_color[4];
                        break;
                    case "已收回直管公房" :
                        color = echarts_color[5];
                        break;
                    case "产权不明空地" :
                        color = echarts_color[3];
                        break;
                }
                return color;
            }
        }
    });
    round_point_layer.render();
    round_point_layer.on('click', function (ev) {
        var properties = ev.rawData;
        //渲染信息窗体
        openInfo(properties.name, "", properties.lnglat);
    });
}
var start_available_space_rendering = new PublicSpaceAvailableApace();
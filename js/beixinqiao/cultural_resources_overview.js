//文化资源--概览
function CulturalResourcesOverview(){
    this.round_point_color = ["#3ba0f3",'#ff9921',"#00FFFF",'#E0F319',"#00FF59","#DE61FA","#F51B04"];
	this.legend_data = ["物质文化遗产","文物保护的那位","历史建筑"];
	this.cultural_resources_data = [];
	this.bar_series_data = [];
}
CulturalResourcesOverview.prototype.init = function(){
	var _this = this;
	_this.load_dom();
	_this.sidebar_polygonLayer();
	_this.render_point_layer();
	// _this.render_historical_building_point_layer();
	serveRequest("get", server_url+ "/PopulationInfo/getPopulationInfo",{},function(result){
		const population_data = result.data.resultKey;
		_this.cultural_resources_data = population_data;
		_this.load_bar_chart();
	});
}
//分类拆分数据
CulturalResourcesOverview.prototype.get_view_data = function(result_data){
	for(var i = 0; i < result_data.length; i++){
	}
}
//渲染dom元素
CulturalResourcesOverview.prototype.load_dom = function(){
    const cultural_resources_dom_str = '<div id="cultural_resources_overview_bar_content" style="width: 100%; height: 100%;"></div>';
    $("#visualization_echarts_content").append(cultural_resources_dom_str);
};
//添加图层
CulturalResourcesOverview.prototype.sidebar_polygonLayer = function(){
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
            color: "#f0b33c",
            height: function () {
                return Math.random() * 500 + 100;
            }
        }
    });
    sidebar_polygonLayer.render();
    sidebar_polygonLayer.show();
}
// //添加文物保护单位点标识图层
// CulturalResourcesOverview.prototype.render_point_layer = function(){
//     var _this = this;
//     point_layer = new Loca.IconLayer({
//         map: map,
//         zIndex: 100,
//         eventSupport:true,
//     });
//     point_layer.setData(cultural_relic_protection_point_data, {
//         lnglat: 'lnglat'
//     });
//     point_layer.setOptions({
//         source: function(res) {
//             var src = point_icon_server_url+ '/beixinqiao/baohudanwei.png';
//             return src;
//         },
//         style: {
//             size: 32
//         }
//     });
//     point_layer.render();
//     point_layer.on('click', function (ev) {
//         var properties = ev.rawData.properties;
//         //渲染信息窗体
//         openInfo(properties.OBJNAME, "", ev.lnglat);
//     });
// }
//添加历史建筑点标识图层
CulturalResourcesOverview.prototype.render_point_layer = function(){
    var round_point_color = this.round_point_color;
    round_point_layer = new Loca.RoundPointLayer({
        map: map,
        zIndex: 100,
        eventSupport:true,
    });
    round_point_layer.setData(historical_building_data.concat(cultural_relic_protection_point_data), {
        lnglat: 'lnglat'
    });
    round_point_layer.setOptions({
        style: {
            radius: 6,
            color: function (data) {
                // console.log(data.value.properties)
                var type = data.value.properties.type;
                var color = round_point_color[0];
                switch (type){
                    case "故居" :
                        color = round_point_color[0];
                        break;
                    case "寺庙宫观" :
                        color = round_point_color[1];
                        break;
                    case "王府" :
                        color = round_point_color[2];
                        break;
                    case "使馆" :
                        color = round_point_color[3];
                        break;
                    case "官署" :
                        color = round_point_color[4];
                        break;
                    case "古树名木" :
                        color = round_point_color[5];
                        break;
                    default:
                        color = round_point_color[6];
                }
                return color;
            }
        }
    })
    round_point_layer.render();
    round_point_layer.on('click', function (ev) {
        var properties = ev.rawData.properties;
        //渲染信息窗体
        openInfo(properties.name?properties.name:properties.OBJNAME, properties.addres, ev.lnglat);
    });
}
//柱状图渲染
CulturalResourcesOverview.prototype.load_bar_chart = function(){
	var cultural_resources_overview_bar_chart = echarts.init(document.getElementById("cultural_resources_overview_bar_content"));
	var seriesLabel = {
	    normal: {
	        show: true,
	        textBorderColor: '#333',
	        textBorderWidth: 2
	    }
	}
	var bar_option = {
        color: echarts_color,
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow'
	        }
	    },
	    legend: {
	    	top:10,
	    	textStyle:{
	    		color:"#FFF",
	    	},
	        data: this.legend_data
	    },
	    grid: {
	        left: 50
	    },
	    xAxis: {
	        type: 'value',
	        axisLabel: coordinate_axis_style.axisLabel,
	        axisLine: coordinate_axis_style.axisLine,
	        splitLine: coordinate_axis_style.splitLine,
	    },
	    yAxis: {
	        type: 'category',
	        axisLabel: coordinate_axis_style.axisLabel,
	        axisLine: coordinate_axis_style.axisLine,
	        splitLine: coordinate_axis_style.splitLine,
	        inverse: true,
	        data: [],
	    },
	    series: [
	        {
	            name: '户籍人口',
	            type: 'bar',
	            // label: seriesLabel,
	            data: [],
	        },
	        {
	            name: '常驻人口',
	            type: 'bar',
	            // label: seriesLabel,
	            data: []
	        },
	        {
	            name: '流动人口',
	            type: 'bar',
	            // label: seriesLabel,
	            data: []
	        }
	    ]
	};
	for(var i = 0; i < this.cultural_resources_data.length; i++){
		var item = this.cultural_resources_data[i];
		bar_option.yAxis.data.push(item.NAME); 
		bar_option.series[0].data.push(item.REGISTER); 
		bar_option.series[1].data.push(item.RESIDENT); 
		bar_option.series[2].data.push(item.FLOATING); 
	}
    cultural_resources_overview_bar_chart.setOption(bar_option, true);
}

var start_cultural_resources_overview_rendering = new CulturalResourcesOverview();
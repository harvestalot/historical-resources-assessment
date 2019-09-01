//文化资源评估--文物保护单位
function CulturalRelicPtection() {
    this.lenged_data = ["国家级", "市级", "区级","普查登记", "其它"];
    this.community_name = [];
    this.radar_chart_indicator_data = [];
    this.comprehensive_data = {
        "国家级":[0,0,0,0,0,0,0,0,0,0,0,0],
        "市级":[0,0,0,0,0,0,0,0,0,0,0,0],
        "区级":[0,0,0,0,0,0,0,0,0,0,0,0],
        "普查登记":[0,0,0,0,0,0,0,0,0,0,0,0],
        "其它":[0,0,0,0,0,0,0,0,0,0,0,0],
    };
}
CulturalRelicPtection.prototype.init = function(){
	this.sidebar_polygonLayer();
    this.render_point_layer();
    this.load_dom();
    var _this = this;
    serveRequest("get", server_url+ "/culturaheritage/getCoverage",{ category: "stylistic" },function(result){
        _this.get_view_data(JSON.parse(Decrypt(result.data.resultKey)));
        _this.load_radar_chart();
        _this.load_bar_chart();
    });
}
//生产dom元素
CulturalRelicPtection.prototype.load_dom = function(){
    var cultural_relic_dom_str = '<div id="cultural_relic_coverage_content" style="width: 100%; height: 50%;"></div>'+
        '<div id="cultural_relic_bar_content" style="width: 100%; height: 50%;"></div>';
    $("#visualization_echarts_content").append(cultural_relic_dom_str);
};
//分类拆分数据
CulturalRelicPtection.prototype.get_view_data = function(result_data){
    for(var i = 0; i < result_data.length; i++){
        for(var key in result_data[i]){
            this.community_name.push(key);
            this.radar_chart_indicator_data.push({
                name: key,
                // max:100,
                color:'#fff'
            })
            if(result_data[i][key].length > 0){
                for(var j = 0; j < result_data[i][key].length; j++){
                    // console.log(result_data[i][key][j].COVERAGE)
                    this.comprehensive_data[result_data[i][key][j].LEVELS][i] = result_data[i][key][j].TOTAL;
                }
            }
        }
    }
}
//添加图层
CulturalRelicPtection.prototype.sidebar_polygonLayer = function(){
    $.get(file_server_url+'cultural_relic_protection.js', function (cultural_relic_protection_data) {
    	var _this = this;
    	sidebar_polygonLayer = new Loca.PolygonLayer({
            map: map,
            zIndex: 20,
            fitView: true,
            // eventSupport:true,
        });
        sidebar_polygonLayer.setData(cultural_relic_protection_data.cultural_relic_protection_area_data, {
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
    })
}
//添加设施点标识图层
CulturalRelicPtection.prototype.render_point_layer = function(){
    $.get(file_server_url+'cultural_relic_protection.js', function (cultural_relic_protection_data) {
        var _this = this;
        point_layer = new Loca.IconLayer({
            map: map,
            zIndex: 100,
            eventSupport:true,
        });
        point_layer.setData(cultural_relic_protection_data.cultural_relic_protection_point_data, {
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
    })
}
//加载设施覆盖率雷达图图表数据
CulturalRelicPtection.prototype.load_radar_chart = function(){
    var radarChart = echarts.init(document.getElementById("cultural_relic_coverage_content"));
    var radar_option = {
        color: echarts_color,
        title:get_object_assign({
            text:"各社区文保单位占比",
        }, echart_title),
        legend: {
            show: true,
            right:"10%",
            bottom:"1%",
            textStyle: {
                "fontSize": 14,
                "color": "#fff"
            },
            "data": this.lenged_data
        },
        tooltip: {
            show: true,
            trigger: "item"
        },
        radar: {
            center: ["50%", "50%"],
            radius: "70%",
            startAngle: 90,
            splitNumber: 4,
            shape: "circle",
            splitArea: {
                "areaStyle": {
                    "color": ["transparent"]
                }
            },
            axisLabel: {
                "show": false,
                "fontSize": 18,
                "color": "#fff",
                "fontStyle": "normal",
                "fontWeight": "normal"
            },
            axisLine: {
                "show": true,
                "lineStyle": {
                    "color": "grey"//
                }
            },
            splitLine: {
                "show": true,
                "lineStyle": {
                    "color": "grey"//
                }
            },
            indicator: this.radar_chart_indicator_data
        },
        "series": [
            get_object_assign(rader_color[0], {
                "name": this.lenged_data[0],
                "data": [
                    this.comprehensive_data[this.lenged_data[0]]
                ]
            }),
            get_object_assign(rader_color[1], {
                "name": this.lenged_data[1],
                "data": [
                    this.comprehensive_data[this.lenged_data[1]]
                ]
            }),
            get_object_assign(rader_color[2], {
                "name": this.lenged_data[2],
                "data": [
                    this.comprehensive_data[this.lenged_data[2]]
                ]
            }),
            get_object_assign(rader_color[3], {
                "name": this.lenged_data[3],
                "data": [
                    this.comprehensive_data[this.lenged_data[3]]
                ]
            }),
            get_object_assign(rader_color[4], {
                "name": this.lenged_data[4],
                "data": [
                    this.comprehensive_data[this.lenged_data[4]]
                ]
            })
        ]
    };
    radarChart.setOption(radar_option, true);
}
//加载柱状统计图
CulturalRelicPtection.prototype.load_bar_chart = function(){
    var _this = this;
    var myChart = echarts.init(document.getElementById("cultural_relic_bar_content"));
    var option = {
        color: echarts_color,
        title:get_object_assign({
            text:"各社区文保单位数量对比图",
        }, echart_title),
        legend: {
            show:false,
        },
        tooltip: {
            "trigger": "axis"
        },
        xAxis: {
            type: "category",
            axisLabel: get_object_assign(
                coordinate_axis_style.axisLabel,
                {
                    formatter:function(val){
                        return val.split("").join("\n");
                    }
            }),
            axisLine: coordinate_axis_style.axisLine,
            splitLine: coordinate_axis_style.splitLine,
            data: this.community_name
        },
        yAxis: {
            type: "value",
            axisLabel: coordinate_axis_style.axisLabel,
            axisLine: coordinate_axis_style.axisLine,
            splitLine: coordinate_axis_style.splitLine,
        },
        series: [
            {
            name: this.lenged_data[0],
            type: 'bar',
            stack: 'a',
            barWidth: 15,
            data: this.comprehensive_data[this.lenged_data[0]]
            },
            {
            name: this.lenged_data[1],
            type: 'bar',
            stack: 'a',
            barWidth: 15,
            data: this.comprehensive_data[this.lenged_data[1]]
            },
            {
            name: this.lenged_data[2],
            type: 'bar',
            stack: 'a',
            barWidth: 15,
            data: this.comprehensive_data[this.lenged_data[2]]
            },
            {
            name: this.lenged_data[3],
            type: 'bar',
            stack: 'a',
            barWidth: 15,
            data: this.comprehensive_data[this.lenged_data[3]]
            },
            {
            name: this.lenged_data[4],
            type: 'bar',
            stack: 'a',
            barWidth: 15,
            data: this.comprehensive_data[this.lenged_data[4]]
            }
        ]
    };
    myChart.setOption(option, true);
}
//重置数据
CulturalRelicPtection.prototype.reset_data = function(){
    this.community_name = [];
    this.radar_chart_indicator_data = [];
    this.comprehensive_data = {
        "国家级":[0,0,0,0,0,0,0,0,0,0,0,0],
        "市级":[0,0,0,0,0,0,0,0,0,0,0,0],
        "区级":[0,0,0,0,0,0,0,0,0,0,0,0],
        "普查登记":[0,0,0,0,0,0,0,0,0,0,0,0],
        "其它":[0,0,0,0,0,0,0,0,0,0,0,0],
    };
}
var start_cultural_relic_protection_rendering = new CulturalRelicPtection();
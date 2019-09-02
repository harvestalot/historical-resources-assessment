//文化资源评估--历史建筑
function HistoricalBuilding() {
    this.lenged_data = ["故居", "寺庙宫观", "王府", "使馆","官署","古树名木"];
    this.community_name = [];
    this.radar_chart_indicator_data = [];
    this.comprehensive_data = {
        "故居":[0,0,0,0,0,0,0,0,0,0,0,0],
        "寺庙宫观":[0,0,0,0,0,0,0,0,0,0,0,0],
        "王府":[0,0,0,0,0,0,0,0,0,0,0,0],
        "使馆":[0,0,0,0,0,0,0,0,0,0,0,0],
        "官署":[0,0,0,0,0,0,0,0,0,0,0,0],
        "古树名木":[0,0,0,0,0,0,0,0,0,0,0,0],
    };
}
HistoricalBuilding.prototype.init = function(){
    this.reset_data();
	this.render_point_layer();
    this.load_dom();
    var _this = this;
    serveRequest("get", server_url+ "/architecture/getCoverage",{ },function(result){
        _this.get_view_data(JSON.parse(Decrypt(result.data.resultKey)));
        _this.load_radar_chart();
        _this.load_bar_chart();
    });
}
//生产dom元素
HistoricalBuilding.prototype.load_dom = function(){
    var cultural_relic_dom_str = '<div id="cultural_relic_coverage_content" style="width: 100%; height: 50%;"></div>'+
        '<div id="cultural_relic_bar_content" style="width: 100%; height: 50%;"></div>';
    $("#visualization_echarts_content").append(cultural_relic_dom_str);
};
//分类拆分数据
HistoricalBuilding.prototype.get_view_data = function(result_data){
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
                    this.comprehensive_data[result_data[i][key][j].TYPE][i] = result_data[i][key][j].TOTAL;
                }
            }
        }
    }
}
//添加设施点标识图层
HistoricalBuilding.prototype.render_point_layer = function(){
        var round_point_color = echarts_color;
    $.get(file_server_url+'historical_building.js', function (historical_building_data) {
        round_point_layer = new Loca.RoundPointLayer({
            map: map,
            zIndex: 100,
            eventSupport:true,
        });
        round_point_layer.setData(JSON.parse(Decrypt(historical_building_data)), {
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
                    }
                    return color;
                }
            }
        })
        round_point_layer.render();
        round_point_layer.on('click', function (ev) {
            var properties = ev.rawData.properties;
            //渲染信息窗体
            openInfo(properties.name, properties.addres, ev.lnglat);
        });
    })
}
//加载设施覆盖率雷达图图表数据
HistoricalBuilding.prototype.load_radar_chart = function(){
    var radarChart = echarts.init(document.getElementById("cultural_relic_coverage_content"));
    var radar_option = {
        color: echarts_color,
        title:get_object_assign({
            text:"各社区历史建筑数量占比图",
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
HistoricalBuilding.prototype.load_bar_chart = function(){
    var _this = this;
    var myChart = echarts.init(document.getElementById("cultural_relic_bar_content"));
    var option = {
        color: echarts_color,
        title:get_object_assign({
            text:"各社区历史建筑数量对比图",
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
HistoricalBuilding.prototype.reset_data = function(){
    this.community_name = [];
    this.radar_chart_indicator_data = [];
    this.comprehensive_data = {
        "故居":[0,0,0,0,0,0,0,0,0,0,0,0],
        "寺庙宫观":[0,0,0,0,0,0,0,0,0,0,0,0],
        "王府":[0,0,0,0,0,0,0,0,0,0,0,0],
        "使馆":[0,0,0,0,0,0,0,0,0,0,0,0],
        "官署":[0,0,0,0,0,0,0,0,0,0,0,0],
        "古树名木":[0,0,0,0,0,0,0,0,0,0,0,0],
    };
}
var start_historical_building_rendering = new HistoricalBuilding();
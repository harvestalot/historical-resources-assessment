//公共空间评估--绿地资源
function PublicSpaceGreenbelt() {
    this.community_name = [];
    this.community_greenbelt_area = [];
    this.per_capita_greenbelt_area = [];
    this.ranking_list = [
        { type:"绿地覆盖率", name: "民安", value: 5.2 },
        { type:"人均绿地面积", name: "民安", value: 44.61 },
        { type:"社区绿地面积", name: "民安", value: 400000 },
    ];
}
PublicSpaceGreenbelt.prototype.init = function(){
    this.reset_data();
    this.load_dom();
	this.sidebar_polygonLayer();
    var _this = this;
    serveRequest("get", server_url+ "/Greenland/getCoverage",{ },function(result){
        _this.get_view_data(result.data.resultKey);
        _this.load_bar_chart();
        _this.load_radar_chart();
        _this.load_ranking_list(_this.ranking_list);
    });
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
            color: "#0BF319",
            height: function () {
                return Math.random() * 500 + 100;
            }
        }
    });
    sidebar_polygonLayer.render();
    sidebar_polygonLayer.show();
}
//渲染dom元素
PublicSpaceGreenbelt.prototype.load_dom = function(){
    const public_service_dom_str = '<div id="community_greenbelt_pie_content" class="chart_view" style="width: 100%; height: 50%;"></div>'+
        '<div id="community_greenbelt_bar_content" class="chart_view" style="width: 100%; height: 30%;"></div>'+
        '<div id="community_greenbelt_list_content" class="chart_view" style="width: 100%; height: 20%;"></div>';
    $("#visualization_echarts_content").append(public_service_dom_str);
};
//分类拆分数据
PublicSpaceGreenbelt.prototype.get_view_data = function(result_data){
    for(var i = 0; i < result_data.length; i++){
        var item = result_data[i];
        this.community_name.push(item.NAME);
        this.community_greenbelt_area.push(item.AREA);
        this.per_capita_greenbelt_area.push(item.PRESON_GREENLAND.toFixed(2));
    }
}
//加载人均绿地柱状图表数据
PublicSpaceGreenbelt.prototype.load_bar_chart = function(){
    var barChart = echarts.init(document.getElementById("community_greenbelt_bar_content"));
    var bar_option = {
        title : {
            text: '各社区绿地面积',
            subtext: '数据来源：中规院',
            textStyle:{
                color:"#FFF",
                fontSize:16,
            },
        },
        grid:{
            left:"16%",
            right:30,
        },
        tooltip: {
            trigger: "axis",
            // axisPointer: {
            //     type: "shadow",
            //     label: {
            //         show: true
            //     }
            // }
        },
        legend: {
            right:10,
            top:25,
            selectedMode:false,
            textStyle:{
                color:"#FFF",
            },
            data:['绿地面积', '人均绿地面积']
        },
        xAxis: {
            axisLabel: {
                ...coordinate_axis_style.axisLabel,
                ...{
                    formatter:function(val){
                        return val.split("").join("\n");
                    }
            }},
            axisLine: coordinate_axis_style.axisLine,
            splitLine: coordinate_axis_style.splitLine,
            data : this.community_name
        },
        yAxis: [{
                type: "value",
                axisLabel: coordinate_axis_style.axisLabel,
                axisLine: coordinate_axis_style.axisLine,
                splitLine: coordinate_axis_style.splitLine,
                splitLine:{
                    show: false,
                }
            },
            {
                type: "value",
                position: "right",
                axisLabel: coordinate_axis_style.axisLabel,
                axisLine: coordinate_axis_style.axisLine,
                splitLine: coordinate_axis_style.splitLine,
                axisLabel: {
                    show: true,
                    formatter: "{value}", //右侧Y轴文字显示
                    textStyle: {
                        color: "#ebf8ac"
                    }
                },
                splitLine:{
                    show: false,
                }
            },
            {
                type: "value",
                axisLine: coordinate_axis_style.axisLine,
            }
        ],
        series: [{
                name: "绿地面积",
                type: "bar",
                barWidth: 10,
                barCategoryGap: '50%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: "#00FFE3"
                            },
                            {
                                offset: 1,
                                color: "#4693EC"
                            }
                        ])
                    }
                },
                data: this.community_greenbelt_area
            },
            {
                name: "人均绿地面积",
                type: "line",
                yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
                smooth: true, //平滑曲线显示
                showAllSymbol: true, //显示所有图形。
                symbol: "circle", //标记的图形为实心圆
                symbolSize: 10, //标记的大小
                itemStyle: {
                    //折线拐点标志的样式
                    color: "#058cff"
                },
                lineStyle: {
                    color: "#058cff"
                },
                areaStyle:{
                    color: "rgba(5,140,255, 0.2)"
                },
                data: this.per_capita_greenbelt_area
            }
        ]
    };
    barChart.setOption(bar_option, true);
}
//加载设施覆盖率雷达图图表数据
PublicSpaceGreenbelt.prototype.load_radar_chart = function(){
    var radarChart = echarts.init(document.getElementById("community_greenbelt_pie_content"));
    var radar_option = {
        color: echarts_color,
        title:{
            text:"各社区绿地覆盖率",
            top:10,
            textStyle:{
                color: '#FFF',
                fontSize: 16
            }
        },
        // legend: {
        //     show: true,
        //     right:"10%",
        //     bottom:"1%",
        //     textStyle: {
        //         "fontSize": 14,
        //         "color": "#fff"
        //     },
        //     "data": this.lenged_data
        // },
        tooltip: {
            show: true,
            trigger: "item"
        },
        // radar: {
        //     center: ["50%", "50%"],
        //     radius: "70%",
        //     startAngle: 90,
        //     splitNumber: 4,
        //     shape: "circle",
        //     splitArea: {
        //         "areaStyle": {
        //             "color": ["transparent"]
        //         }
        //     },
        //     axisLabel: {
        //         "show": false,
        //         "fontSize": 18,
        //         "color": "#fff",
        //         "fontStyle": "normal",
        //         "fontWeight": "normal"
        //     },
        //     axisLine: {
        //         "show": true,
        //         "lineStyle": {
        //             "color": "grey"//
        //         }
        //     },
        //     splitLine: {
        //         "show": true,
        //         "lineStyle": {
        //             "color": "grey"//
        //         }
        //     },
        //     indicator: this.radar_chart_indicator_data
        // },
        // 
        angleAxis: {
            type: 'category',
            data: [{
                value: '一',
                textStyle: {
                    fontSize: 25,
                }
            }, '二', '三', '四', '五', '六', '日'],
            z: 10
        },
        polar: {
            center: ['50%', '50%'],
            // radius: ['20%', '80%'],
        },
        radiusAxis: {},
        "series": [{
        type: 'bar',
        data: [3, 4, 5, 8, 2, 9, 10],
        coordinateSystem: 'polar',
        name: 'b',
        stack: 'a',
        itemStyle: {
            normal: {
                borderWidth: 4,
                borderColor: '#ffffff',
            },
            emphasis: {
                borderWidth: 0,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }
        ]
    };
    radarChart.setOption(radar_option, true);
}
//重置数据
PublicSpaceGreenbelt.prototype.reset_data = function(){
    this.community_name = [];
    this.community_greenbelt_area = [];
    this.per_capita_greenbelt_area = [];
    // this.ranking_list = [];
}
//加载排行榜统计
PublicSpaceGreenbelt.prototype.load_ranking_list = function(data){
    for(var i = 0; i < data.length; i++){
        $("#community_greenbelt_list_content").append('<p class="ranking_list"><span class="type_name">'
            +data[i].type+'：&nbsp;&nbsp;</span><span class="name_value">'+data[i].name+'（'+data[i].value+'%）</span></p>')
    }
}
var start_greenbelt_rendering = new PublicSpaceGreenbelt();
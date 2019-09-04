//公共空间评估--绿地资源
function PublicSpaceGreenbelt() {
    this.community_name = [];
    this.community_greenbelt_coverage = [];
    this.community_greenbelt_area = [];
    this.per_capita_greenbelt_area = [];
    this.ranking_list = [
        { type:"绿地覆盖率", name: "", value: 0 },
        { type:"人均绿地面积", name: "", value: 0 },
        { type:"社区绿地面积", name: "", value: 0 },
    ];
}
PublicSpaceGreenbelt.prototype.init = function(){
    this.reset_data();
    this.load_dom();
	this.sidebar_polygonLayer();
    var _this = this;
    serveRequest("get", server_url+ "/Greenland/getCoverage",{ },function(result){
        console.log(JSON.parse(Decrypt(result.data.resultKey)))
        _this.get_view_data(JSON.parse(Decrypt(result.data.resultKey)));
        _this.load_radar_chart();
        _this.load_bar_chart();
    });
    serveRequest("get", server_url+ "/Greenland/getRanking",{ },function(result){
        var data = JSON.parse(Decrypt(result.data.resultKey));
        console.log(data)
        _this.ranking_list = [
            { type:"绿地覆盖率", name: data.maxCoverage.NAME, value: data.maxCoverage.GREENLAND_RATE.toFixed(2)+"%" },
            { type:"人均绿地面积", name: data.maxPersion.NAME, value: data.maxPersion.PRESON_GREENLAND.toFixed(2) },
            { type:"社区绿地面积", name: data.maxArea.NAME, value: data.maxArea.AREA.toFixed(2) },
        ]
        _this.load_ranking_list(_this.ranking_list);
    });
}
//添加图层
PublicSpaceGreenbelt.prototype.sidebar_polygonLayer = function(){
	var _this = this;
    $.get(file_server_url+'public_space_greenbelt.js', function (actuality_greenbelt_data) {
    	sidebar_polygonLayer = new Loca.PolygonLayer({
            map: map,
            // zIndex: 15,
            // fitView: true,
            // eventSupport:true,
        });
        sidebar_polygonLayer.setData(JSON.parse(Decrypt(actuality_greenbelt_data)), {
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
    })
}
//渲染dom元素
PublicSpaceGreenbelt.prototype.load_dom = function(){
    var public_service_dom_str = '<div id="community_greenbelt_pie_content" class="chart_view" style="width: 100%; height: 50%;"></div>'+
        '<div id="community_greenbelt_bar_content" class="chart_view" style="width: 100%; height: 30%;"></div>'+
        '<div id="community_greenbelt_list_content" class="chart_view" style="width: 100%; height: 20%;"></div>';
    $("#visualization_echarts_content").append(public_service_dom_str);
};
//分类拆分数据
PublicSpaceGreenbelt.prototype.get_view_data = function(result_data){
    for(var i = 0; i < result_data.length; i++){
        var item = result_data[i];
        this.community_name.push(item.NAME);
        this.community_greenbelt_coverage.push(item.GREENLAND_RATE.toFixed(2));
        this.community_greenbelt_area.push(item.AREA.toFixed(2));
        this.per_capita_greenbelt_area.push(item.PRESON_GREENLAND.toFixed(2));
    }
}
//加载人均绿地柱状图表数据
PublicSpaceGreenbelt.prototype.load_bar_chart = function(){
    var barChart = echarts.init(document.getElementById("community_greenbelt_bar_content"));
    var bar_option = {
        color: echarts_color,
        title : {
            text: '各社区绿地情况',
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
            axisLabel: get_object_assign(
                coordinate_axis_style.axisLabel,
                {
                    formatter:function(val){
                        return val.split("").join("\n");
                    }
            }),
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
                },
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
                // itemStyle: {
                //     normal: {
                //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //                 offset: 0,
                //                 color: "#00FFE3"
                //             },
                //             {
                //                 offset: 1,
                //                 color: "#4693EC"
                //             }
                //         ])
                //     }
                // },
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
                // lineStyle: {
                //     color: "#058cff"
                // },
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
            text:"各社区绿地覆盖率对比图",
            top:10,
            textStyle:{
                color: '#FFF',
                fontSize: 16
            }
        },
        tooltip: {
            show: true,
            trigger: "item"
        },
        angleAxis: {
            interval: 1,
            type: 'category',
            data: this.community_name,
            z: 10,
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#999",
                    width: 1,
                    type: "solid"
                },
            },
            axisLabel: {
                interval: 0,
                show: true,
                color: "#fff",
                margin: 8,
                fontSize: 14
            },
        },
        radiusAxis: {
            min: 0,
            // max: 400000,
            interval: 50000,
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#999",
                    width: 1,
                    type: "solid"
                },
            },
            axisLabel: {
                formatter: '{value} %',
                show: false,
                padding: [0, 0, 10, 0],
                color: "#00c7ff",
                fontSize: 14
            },
            splitLine: {
                lineStyle: {
                    color: "#999",
                    width: 1,
                    type: "solid"
                }
            }
        },
        polar: {
            center:["50%", "50%"],
            radius:"60%"
        },
        series: [{
            type: 'bar',
            data: this.community_greenbelt_coverage,
            coordinateSystem: 'polar',
        }],
    };
    radarChart.setOption(radar_option, true);
}
//重置数据
PublicSpaceGreenbelt.prototype.reset_data = function(){
    this.community_name = [];
    this.community_greenbelt_coverage = [];
    this.community_greenbelt_area = [];
    this.per_capita_greenbelt_area = [];
    this.ranking_list = [
        { type:"绿地覆盖率", name: "", value: 0 },
        { type:"人均绿地面积", name: "", value: 0 },
        { type:"社区绿地面积", name: "", value: 0 },
    ];
}
//加载排行榜统计
PublicSpaceGreenbelt.prototype.load_ranking_list = function(data){
    for(var i = 0; i < data.length; i++){
        if(i !== 0){
        $("#community_greenbelt_list_content").append('<p class="ranking_list"><span class="type_name">'
            +data[i].type+'：&nbsp;&nbsp;</span><span class="name_value">'+data[i].name+' '+data[i].value+'</span><span class="c_fff"> 平方米</span></p>');
        }else{
        $("#community_greenbelt_list_content").append('<p class="ranking_list"><span class="type_name">'
            +data[i].type+'：&nbsp;&nbsp;</span><span class="name_value">'+data[i].name+' '+data[i].value+'</span></p>');   
        }
    }
}
var start_greenbelt_rendering = new PublicSpaceGreenbelt();
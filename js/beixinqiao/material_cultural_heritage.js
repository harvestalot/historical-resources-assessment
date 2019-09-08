//文化资源评估--物质文化遗产
function MaterialCulturalHeritage() {
    this.level_data = [];
    this.years_ring_data = [];
    this.level_data_total = 0;
}
MaterialCulturalHeritage.prototype.init = function(){
    this.level_data = [];
    this.years_ring_data = [];
	this.sidebar_polygonLayer();
    this.render_point_layer();
    this.load_dom();
    var _this = this;
    serveRequest("get", server_url+ "/culturaheritage/getCoverageByLevels",{ },function(result){
        _this.get_view_data(JSON.parse(Decrypt(result.data.resultKey)));
        _this.pie_chart();
    });
    serveRequest("get", server_url+ "/culturaheritage/getCoverageByYears",{ },function(result){
        _this.years_ring_data = JSON.parse(Decrypt(result.data.resultKey)).list;
        setTimeout(function(){
            _this.years_ring_chart();
        },100)
    });
}
//生产dom元素
MaterialCulturalHeritage.prototype.load_dom = function(){
    var cultural_relic_dom_str = '<div id="cultural_relic_coverage_content" style="width: 100%; height: 50%;"></div>'+
        '<div id="cultural_relic_ring_content" style="width: 100%; height: 50%;"></div>';
    $("#visualization_echarts_content").append(cultural_relic_dom_str);
};
//分类拆分数据
MaterialCulturalHeritage.prototype.get_view_data = function(result_data){
        console.log(result_data)
    this.level_data_total = result_data.totalNumber;
    this.level_data.push({
        name:result_data.list[2].LEVELS,
        value:result_data.list[2].TOTAL
    });
    this.level_data.push({
        name:result_data.list[4].LEVELS,
        value:result_data.list[4].TOTAL
    });
    this.level_data.push({
        name:result_data.list[3].LEVELS,
        value:result_data.list[3].TOTAL
    });
    this.level_data.push({
        name:result_data.list[1].LEVELS,
        value:result_data.list[1].TOTAL
    });
    this.level_data.push({
        name:result_data.list[0].LEVELS,
        value:result_data.list[0].TOTAL
    });
    // for(var i = 0; i < result_data.list.length; i++){
    //     this.level_data.push({
    //         name:result_data.list[i].LEVELS,
    //         value:result_data.list[i].TOTAL
    //     })
    // }
}
//添加图层
MaterialCulturalHeritage.prototype.sidebar_polygonLayer = function(){
	var _this = this;
    $.get(file_server_url+'material_cultural_heritage.js', function (material_cultural_heritage_data) {
    	sidebar_polygonLayer = new Loca.PolygonLayer({
            map: map,
            zIndex: 20,
            // fitView: true,
            // eventSupport:true,
        });
        sidebar_polygonLayer.setData(JSON.parse(Decrypt(material_cultural_heritage_data)), {
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
    })
}
//添加设施点标识图层
MaterialCulturalHeritage.prototype.render_point_layer = function(){
    var round_point_color = echarts_color;
    $.get(file_server_url+'cultural_relic_protection.js', function (cultural_relic_protection_data) {
        round_point_layer = new Loca.RoundPointLayer({
            map: map,
            zIndex: 100,
            eventSupport:true,
        });
        round_point_layer.setData(JSON.parse(Decrypt(cultural_relic_protection_data)).cultural_relic_protection_point_data, {
            lnglat: 'lnglat'
        });
        round_point_layer.setOptions({
            style: {
                radius: 6,
                color: function (data) {
                    // console.log(data.value.properties)
                    var type = data.value.properties['±£»¤µÈ¼¶'];
                    var color = round_point_color[0];
                    switch (type){
                        case "其他" :
                            color = round_point_color[0];
                            break;
                        case "普查登记" :
                            color = round_point_color[1];
                            break;
                        case "国家级" :
                            color = round_point_color[2];
                            break;
                        case "区级" :
                            color = round_point_color[3];
                            break;
                        case "市级" :
                            color = round_point_color[4];
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
            openInfo(properties.OBJNAME, properties.addres, ev.lnglat);
        });
    })
}
//加载3/4饼状图
MaterialCulturalHeritage.prototype.pie_chart = function(){
    var data = this.level_data;
    var myChart = echarts.init(document.getElementById("cultural_relic_coverage_content"));
    arrName = getArrayValue(data, "name");
    arrValue = getArrayValue(data, "value");
    sumValue = this.level_data_total;
    objData = array2obj(data, "name");
    optionData = getData(data)
    function getArrayValue(array, key) {
        var key = key || "value";
        var res = [];
        if (array) {
            array.forEach(function(t) {
                res.push(t[key]);
            });
        }
        return res;
    }

    function array2obj(array,key) {
        var resObj = {};
        for(var i=0;i<array.length;i++){
            resObj[array[i][key]] = array[i];
        }
        return resObj;
    }

    function getData(data) {
        var res = {
            series: [],
            yAxis: []
        };
        for (let i = 0; i < data.length; i++) {
            // console.log([70 - i * 15 + '%', 67 - i * 15 + '%']);
            res.series.push({
                name: '',
                type: 'pie',
                clockWise: false, //顺时加载
                hoverAnimation: false, //鼠标移入变大
                radius: [68 - i * 15 + '%', 63 - i * 15 + '%'],
                center: ["35%", "55%"],
                label: {
                    show: false
                },
                itemStyle: {
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false
                    },
                    borderWidth: 5,
                },
                data: [{
                    value: data[i].value,
                    name: data[i].name
                }, {
                    value: sumValue - data[i].value,
                    name: '',
                    itemStyle: {
                        color: "rgba(0,0,0,0)",
                        borderWidth: 0
                    },
                    tooltip: {
                        show: false
                    },
                    hoverAnimation: false
                }]
            });
            res.series.push({
                name: '',
                type: 'pie',
                silent: true,
                z: 1,
                clockWise: false, //顺时加载
                hoverAnimation: false, //鼠标移入变大
                radius: [68 - i * 15 + '%', 63 - i * 15 + '%'],
                center: ["35%", "55%"],
                label: {
                    show: false
                },
                itemStyle: {
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false
                    },
                    borderWidth: 5,
                },
                data: [{
                    value: 7.5,
                    itemStyle: {
                        color: "rgb(3, 31, 62)",
                        borderWidth: 0
                    },
                    tooltip: {
                        show: false
                    },
                    hoverAnimation: false
                }, {
                    value: 2.5,
                    name: '',
                    itemStyle: {
                        color: "rgba(0,0,0,0)",
                        borderWidth: 0
                    },
                    tooltip: {
                        show: false
                    },
                    hoverAnimation: false
                }]
            });
            res.yAxis.push((data[i].value / sumValue * 100).toFixed(2) + "%");
        }
        return res;
    }

    var option = {
        color: echarts_color,
        title:get_object_assign({
            text:"物质文化遗产(按保护等级)",
        }, echart_title),
        legend: {
            show: true,
            icon:"circle",
            top: "center",
            left: '70%',
            data: arrName,
            width:50,
            // padding: [0, 2],
            itemGap: 10,
            formatter: function(name) {
                return "{title|" + name + "}\n{value|" + (objData[name].value) +"}  {title|个}"
            },
            textStyle: {
                rich: {
                    title: {
                        fontSize: 16,
                        lineHeight: 15,
                        color: "rgb(0, 178, 246)"
                    },
                    value: {
                        fontSize: 18,
                        lineHeight: 20,
                        color: "#fff"
                    }
                }
            },
        },
        tooltip: {
            show: true,
            trigger: "item",
            formatter: "{a}<br>{b}:{c}({d}%)"
        },
        grid: {
            top: '19%',
            bottom: '46%',
            left: "35%",
            containLabel: false
        },
        yAxis: [{
            type: 'category',
            inverse: true,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0,
                inside: true,
                textStyle: {
                    color: "#fff",
                    fontSize: 16,
                },
                show: true
            },
            data: optionData.yAxis
        }],
        xAxis: [{
            show: false
        }],
        series: optionData.series
    };
    myChart.setOption(option, true);
}
//加载圆环图
MaterialCulturalHeritage.prototype.years_ring_chart = function(){
    var myChart = echarts.init(document.getElementById("cultural_relic_ring_content"));
    var dataStyle = {
        normal: {
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            shadowBlur: 0,
            shadowColor: '#203665'
        }
    };
    var option = {
        title:get_object_assign({
            text:"物质文化遗产(按年代)",
        }, echart_title),
        series: []
    };
    for(var i = 0; i < this.years_ring_data.length; i++){
        var item = this.years_ring_data[i];
        option.series.push({
            name: item.YEARS,
            type: 'pie',
            clockWise: false,
            radius: [50, 60],
            itemStyle: dataStyle,
            hoverAnimation: false,
            center: ( i === 0? ['25%', '75%']:
                (i === 2? ['25%', '30%']:['75%', '30%'])),
            data: [
            {
                value: item.TOTAL,
                label: {
                    normal: {
                        rich: {
                            a: {
                                color: '#3a7ad5',
                                align: 'center',
                                fontSize: 20,
                                fontWeight: "bold"
                            },
                            b: {
                                color: '#fff',
                                align: 'center',
                                fontSize: 16
                            }
                        },
                        formatter: function(params){
                            var formatter_str = "";
                            if(params.seriesName === "其他"){
                                formatter_str = "{b|其他}\n\n"+"{a|"+params.value+"个}";
                            }else if(params.seriesName === "明"){
                                formatter_str = "{b|明}\n\n"+"{a|"+params.value+"个}";
                            }else if(params.seriesName === "清"){
                                formatter_str = "{b|清}\n\n"+"{a|"+params.value+"个}";
                            }else if(params.seriesName === "民国"){
                                formatter_str = "{b|民国}\n\n"+"{a|"+params.value+"个}";
                            }
                            return formatter_str;
                        },
                        position: 'center',
                        show: true,
                        textStyle: {
                            fontSize: '14',
                            fontWeight: 'normal',
                            color: '#fff'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#2c6cc4',
                        shadowColor: '#2c6cc4',
                        shadowBlur: 0
                    }
                }
            }, {
                value: this.level_data_total,
                name: 'invisible',
                itemStyle: {
                    normal: {
                        color: '#24375c'
                    },
                    emphasis: {
                        color: '#24375c'
                    }
                }
            }]
        });
    }
    myChart.setOption(option, true);

}
var start_material_cultural_heritage_rendering = new MaterialCulturalHeritage();
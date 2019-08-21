//文化资源评估--物质文化遗产
function MaterialCulturalHeritage() {
    this.data = [{
            name: "使用中资源量",
            value: 754
        },
        {
            name: "维修中资源量",
            value: 611
        },
        {
            name: "保养中资源量",
            value: 400
        },
        {
            name: "已损坏资源量",
            value: 200
        }
    ];
}
MaterialCulturalHeritage.prototype.init = function(){
	this.sidebar_polygonLayer();
    this.load_dom();
    this.pie_chart();
    this.years_ring_chart();
}
//生产dom元素
MaterialCulturalHeritage.prototype.load_dom = function(){
    const cultural_relic_dom_str = '<div id="cultural_relic_coverage_content" style="width: 100%; height: 50%;"></div>'+
        '<div id="cultural_relic_ring_content" style="width: 100%; height: 50%;"></div>';
    $("#visualization_echarts_content").append(cultural_relic_dom_str);
};
//添加图层
MaterialCulturalHeritage.prototype.sidebar_polygonLayer = function(){
	var _this = this;
	sidebar_polygonLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 20,
        fitView: true,
        // eventSupport:true,
    });
    sidebar_polygonLayer.setData(material_cultural_heritage_data, {
        lnglat: 'lnglat'
    });

    sidebar_polygonLayer.setOptions({
        style: {
            // opacity: 0.5,
            color: "#F70707",
            height: function () {
                return Math.random() * 500 + 100;
            }
        }
    });
    sidebar_polygonLayer.render();
    sidebar_polygonLayer.show();
}
//加载3/4饼状图
MaterialCulturalHeritage.prototype.pie_chart = function(){
    const data = this.data;
    var myChart = echarts.init(document.getElementById("cultural_relic_coverage_content"));
    arrName = getArrayValue(data, "name");
    arrValue = getArrayValue(data, "value");
    sumValue = eval(arrValue.join('+'));
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
                radius: [73 - i * 15 + '%', 68 - i * 15 + '%'],
                center: ["30%", "55%"],
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
                radius: [73 - i * 15 + '%', 68 - i * 15 + '%'],
                center: ["30%", "55%"],
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
        title:{...{
            text:"物质文化遗产等级占比",
        }, ...echart_title},
        legend: {
            show: true,
            icon:"circle",
            top: "center",
            left: '70%',
            data: arrName,
            width:50,
            padding: [0, 5],
            itemGap: 25,
            formatter: function(name) {
                return "{title|" + name + "}\n{value|" + (objData[name].value) +"}  {title|人}"
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
            top: '16%',
            bottom: '53%',
            left: "30%",
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
        series: [{
            name: '第一个圆环',
            type: 'pie',
            clockWise: false,
            radius: [70, 80],
            itemStyle: dataStyle,
            hoverAnimation: false,
            // center: ['25%', '30%'],
            center: ['15%', '50%'],
            data: [
            {
                value: 25,
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
                            return "{b|明朝}\n\n"+"{a|"+params.value+"个}"+"\n\n{b|增长2%}";
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
                value: 75,
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
        }, {
            name: '第二个圆环',
            type: 'pie',
            clockWise: false,
            radius: [70, 80],
            itemStyle: dataStyle,
            hoverAnimation: false,
            // center: ['25%', '30%'],
            center: ['50%', '50%'],
            data: [
            {
                value: 25,
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
                            return "{b|明朝}\n\n"+"{a|"+params.value+"个}"+"\n\n{b|增长2%}";
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
                value: 75,
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
        },
        {
            name: '第三个圆环',
            type: 'pie',
            clockWise: false,
            radius: [70, 80],
            itemStyle: dataStyle,
            hoverAnimation: false,
            // center: ['50%', '75%'],
            center: ['85%', '50%'],
            data: [{
                value: 75,
                label: {
                    normal: {
                        rich: {
                            a: {
                                color: '#603dd0',
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
                            return "{b|民国}\n\n"+"{a|"+params.value+"个}"+"\n\n{b|增长2%}";
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
                        color: '#613fd1',
                        shadowColor: '#613fd1',
                        shadowBlur: 0
                    }
                }
            }, {
                value: 25,
                name: 'invisible',
                itemStyle: {
                    normal: {
                        color: '#453284'
                    },
                    emphasis: {
                        color: '#453284'
                    }
                }
            }]
        }]
    }
    myChart.setOption(option, true);

}
var start_material_cultural_heritage_rendering = new MaterialCulturalHeritage();
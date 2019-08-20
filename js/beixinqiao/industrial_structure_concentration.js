// 产业结构--产业聚集度
function IndustrialStructureConcentration() {
	this.all_pio_type = ["餐饮服务", "购物服务", "生活服务", "体育休闲服务",
		"商务住宅", "科教文化服务", "交通设施服务", "金融保险服务", "公共设施"];
	this.pio_type = "餐饮服务";
	this.count = [459,3,369,136,476,269,262,47,217];//2238
}
IndustrialStructureConcentration.prototype.init = function(){
	this.load_pio_point();
	this.load_dom();
	this.load_pie_chart();
	var _this = this;
	$("#selecte").on("change",function(){
		var index = $(this).children('option:selected').val() * 1;
		_this.pio_type = _this.all_pio_type[index]
		_this.load_pio_point();
	});
}
//生产dom元素
IndustrialStructureConcentration.prototype.load_dom = function(){
	const industrial_structure_dom_str = '<div class="clearfix chart_view" style="width: 100%; height: 100%;">'+
		'<div id="industrial_structure_pie_content" class="fl" style="width: 40%; height:100%;"></div>'+
		'<div id="industrial_structure_description" class="fl po_re" style="width: 60%; height:100%;">'+
		'<div class="industrial_description po_ab"><p>文化产业</p><p>办公租金较高，低成本办公空间不足，缺少小企业孵化场所。</p></div>'+
		'<div class="industrial_description po_ab"><p>特色餐饮</p><p>通过对大众点评数据分析发现，北新桥餐饮主要沿街布局，包括崇雍大街、东直门南北小街、东直门内大街、东四十条和北新桥三条。</p></div>'+
		'<div class="industrial_description po_ab"><p>商务办公</p><p>总部集聚区通过硬质栏杆或软质绿化与周边割裂开来。</p></div>'+
		'</div>'+
		'</div>';
	$("#visualization_echarts_content").append(industrial_structure_dom_str);
};
//渲染九种服务类型pio点
IndustrialStructureConcentration.prototype.load_pio_point = function(){
	var _this = this;
	var placeSearch = new AMap.PlaceSearch({});
    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
            pageSize: 5, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: "010", // 兴趣点城市
            citylimit: true,  //是否强制限制在设置的城市内搜索
            map: map, // 展现结果的地图实例
            panel: "pio_point_list", // 结果列表将在此容器中进行展示。
            autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
	    var polygon = new AMap.Polygon({
	        path: beixinqiao_subdistict_data[0].coordinates,//设置多边形边界路径
	        // strokeColor: "#FF33FF", //线颜色
	        // strokeOpacity: 0.2, //线透明度
	        // strokeWeight: 3,    //线宽
	        // fillColor: "#1791fc", //填充色
	        // fillOpacity: 0.35//填充透明度
	    });
	    placeSearch.searchInBounds(_this.pio_type, polygon, function (status, result){
	    	// console.log(result)
	    })
	})
}
//加载饼状圆环图表
IndustrialStructureConcentration.prototype.load_pie_chart = function(){
	var pieChart = echarts.init(document.getElementById("industrial_structure_pie_content"));
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
	var pie_option =  {
	    series: [{
	        name: '文化产业',
	        type: 'pie',
	        clockWise: false,
	        radius: [70, 80],
	        itemStyle: dataStyle,
	        hoverAnimation: false,
	        center: ['50%', '20%'],
	        data: [{
	            value: 18.1,
	            label: {
	                normal: {
	                    show: true,
	                    position: 'center',
	                    rich: {
	                        a: {
	                            color: '#f0b33c',
	                            align: 'center',
	                            fontSize: 32,
	                            fontWeight: "bold",
	                            lineHeight:50,
	                        },
	                        b: {
	                            color: '#fff',
	                            align: 'center',
	                            fontSize: 16
	                        }
	                    },
	                    formatter: function(params){
	                        return "{a|"+params.value+"%}"+"\n\n{b|文化产业}";
	                    },
	                }
	            },
	            itemStyle: {
	                normal: {
	                    color: '#f0b33c',
	                    shadowColor: '#f0b33c',
	                    shadowBlur: 0
	                }
	            }
	        }, {
	            value: 81.9,
	            name: 'invisible',
	            itemStyle: {
	                normal: {
	                    color: '#DCDCDC'
	                },
	                emphasis: {
	                    color: '#DCDCDC'
	                }
	            }
	        }]
	    }, 
	    {
	        name: '特色餐饮',
	        type: 'pie',
	        clockWise: false,
	        radius: [70, 80],
	        itemStyle: dataStyle,
	        hoverAnimation: false,
	        center: ['50%', '51%'],
	        data: [{
	            value: 20.51,
	            label: {
	                normal: {
	                    show: true,
	                    position: 'center',
	                    rich: {
	                        a: {
	                            color: '#f0b33c',
	                            align: 'center',
	                            fontSize: 32,
	                            fontWeight: "bold",
	                            lineHeight:50,
	                        },
	                        b: {
	                            color: '#fff',
	                            align: 'center',
	                            fontSize: 16
	                        }
	                    },
	                    formatter: function(params){
	                        return "{a|"+params.value+"%}"+"\n\n{b|特色餐饮}";
	                    },
	                }
	            },
	            itemStyle: {
	                normal: {
	                    color: '#f0b33c',
	                    shadowColor: '#f0b33c',
	                    shadowBlur: 0
	                }
	            }
	        }, {
	            value: 79.49,
	            name: 'invisible',
	            itemStyle: {
	                normal: {
	                    color: '#DCDCDC'
	                },
	                emphasis: {
	                    color: '#DCDCDC'
	                }
	            }
	        }]
	    }, 
	    {
	        name: '商务办公',
	        type: 'pie',
	        clockWise: false,
	        radius: [70, 80],
	        itemStyle: dataStyle,
	        hoverAnimation: false,
	        center: ['50%', '80%'],
	        data: [{
	            value: 2.1,
	            label: {
	                normal: {
	                    show: true,
	                    position: 'center',
	                    rich: {
	                        a: {
	                            color: '#f0b33c',
	                            align: 'center',
	                            fontSize: 32,
	                            fontWeight: "bold",
	                            lineHeight:50,
	                        },
	                        b: {
	                            color: '#fff',
	                            align: 'center',
	                            fontSize: 16
	                        }
	                    },
	                    formatter: function(params){
	                        return "{a|"+params.value+"%}"+"\n\n{b|商务办公}";
	                    },
	                }
	            },
	            itemStyle: {
	                normal: {
	                    color: '#f0b33c',
	                    shadowColor: '#f0b33c',
	                    shadowBlur: 0
	                }
	            }
	        }, {
	            value: 97.9,
	            name: 'invisible',
	            itemStyle: {
	                normal: {
	                    color: '#DCDCDC'
	                },
	                emphasis: {
	                    color: '#DCDCDC'
	                }
	            }
	        }]
	    }]
	}
    pieChart.setOption(pie_option, true);
}

var start_industry_concentration_rendering = new IndustrialStructureConcentration();
// 产业结构--产业聚集度
function IndustrialStructureConcentration() {
	
}
IndustrialStructureConcentration.prototype.init = function(){
	this.load_dom();
	this.load_pie_chart();
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
	            value: 25,
	            label: {
	                normal: {
	                    show: true,
	                    position: 'center',
	                    rich: {
	                        a: {
	                            color: '#3a7ad5',
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
	                    color: '#00FCFF',
	                    shadowColor: '#00FCFF',
	                    shadowBlur: 0
	                }
	            }
	        }, {
	            value: 75,
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
	            value: 45,
	            label: {
	                normal: {
	                    show: true,
	                    position: 'center',
	                    rich: {
	                        a: {
	                            color: '#3a7ad5',
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
	                    color: '#00FCFF',
	                    shadowColor: '#00FCFF',
	                    shadowBlur: 0
	                }
	            }
	        }, {
	            value: 55,
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
	            value: 75,
	            label: {
	                normal: {
	                    show: true,
	                    position: 'center',
	                    rich: {
	                        a: {
	                            color: '#3a7ad5',
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
	                    color: '#00FCFF',
	                    shadowColor: '#00FCFF',
	                    shadowBlur: 0
	                }
	            }
	        }, {
	            value: 25,
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
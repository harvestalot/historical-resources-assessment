//人口
var population_bar_chart;
function population(){
	var population_statistics_dom_str = '<div class="chart_view clearfix" style="width: 100%; height: 70%; ">'+
		'<div id="population_statistics_content" class="fl" style="width: 70%; height: 100%;"></div>'+
		'<div id="population_graphic_content" class="fl" style="width: 30%; height: 100%;padding:50px 0;box-sizing: border-box;">'+
		'</div>'+
		'</div>';
	var population_size_dom_str = '<div class="chart_view" style="width: 100%; height: 30%;">'+
		'<div id="population_type" class="clearfix statistics_type">'+
		'<a href="javascript:void(0)" class="active_checked">60岁以上</a>'+
		'<a href="javascript:void(0)">下岗失业</a>'+
		'<a href="javascript:void(0)">学龄前</a>'+
		'<a href="javascript:void(0)" class="w_21">在校小学生</a>'+
		'<a href="javascript:void(0)" class="w_21">在校中学生</a>'+
		'</div>'+
		'<div id="population_size_content" style="width: 100%; height: 88%;"></div>'+
		'</div>';
	$("#visualization_echarts_content").append(population_statistics_dom_str);
	$("#visualization_echarts_content").append(population_size_dom_str);
	//人口信息请求
	serveRequest("get", server_url+ "/PopulationInfo/getPopulationInfo",{},function(result){
		var population_data = JSON.parse(Decrypt(result.data.resultKey));
		load_population_statistics("population_statistics_content", population_data);//人口统计
		for(var i = 0; i < population_data.length; i++){
			var item = population_data[i];
			$("#population_graphic_content").append('<div id="population_graphic_content_'+(i+1)+'" style="width: 100%; height: 8.2%;"></div>');
			load_graphic_statistics("population_graphic_content_"+(i+1), item.MALE, item.FEMALE, (item.MALE+item.FEMALE));//人口统计(特殊图形)
		}
		load_population_radar("population_size_content", "60岁以上", population_data);//不同类型人口统计（雷达图）
		$("#population_type a").click(function(){
			$(this).addClass("active_checked").siblings("a").removeClass("active_checked");
			load_population_radar("population_size_content", $(this).html(), population_data);//不同类型人口统计（雷达图）
		});
	});
}

//各区人口统计情况
function load_population_statistics(eleId, population_data){
	population_bar_chart = echarts.init(document.getElementById(eleId));
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
	        data: ['户籍人口', '常住人口', '流动人口']
	    },
	    grid: {
	        left: 50
	    },
	    xAxis: {
	        type: 'value',
	        name: '人',
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
	            name: '常住人口',
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
	for(var i = 0; i < population_data.length; i++){
		var item = population_data[i];
		bar_option.yAxis.data.push(item.NAME); 
		bar_option.series[0].data.push(item.REGISTER); 
		bar_option.series[1].data.push(item.RESIDENT); 
		bar_option.series[2].data.push(item.FLOATING); 
	}
    population_bar_chart.setOption(bar_option, true);
	window.onresize = function(){
	    population_bar_chart.resize();
	}
};
//各区人口统计情况(特殊图形展示)
function load_graphic_statistics(eleId, male, female, total){
	var graphicChart = echarts.init(document.getElementById(eleId));
	var symbols = [
    	'path://M18.2629891,11.7131596 L6.8091608,11.7131596 C1.6685112,11.7131596 0,13.032145 0,18.6237673 L0,34.9928467 C0,38.1719847 4.28388932,38.1719847 4.28388932,34.9928467 L4.65591984,20.0216948 L5.74941883,20.0216948 L5.74941883,61.000787 C5.74941883,65.2508314 11.5891201,65.1268798 11.5891201,61.000787 L11.9611506,37.2137775 L13.1110872,37.2137775 L13.4831177,61.000787 C13.4831177,65.1268798 19.3114787,65.2508314 19.3114787,61.000787 L19.3114787,20.0216948 L20.4162301,20.0216948 L20.7882606,34.9928467 C20.7882606,38.1719847 25.0721499,38.1719847 25.0721499,34.9928467 L25.0721499,18.6237673 C25.0721499,13.032145 23.4038145,11.7131596 18.2629891,11.7131596 M12.5361629,1.11022302e-13 C15.4784742,1.11022302e-13 17.8684539,2.38997966 17.8684539,5.33237894 C17.8684539,8.27469031 15.4784742,10.66467 12.5361629,10.66467 C9.59376358,10.66467 7.20378392,8.27469031 7.20378392,5.33237894 C7.20378392,2.38997966 9.59376358,1.11022302e-13 12.5361629,1.11022302e-13',
    	'path://M28.9624207,31.5315864 L24.4142575,16.4793596 C23.5227152,13.8063773 20.8817445,11.7111088 17.0107398,11.7111088 L12.112691,11.7111088 C8.24168636,11.7111088 5.60080331,13.8064652 4.70917331,16.4793596 L0.149791395,31.5315864 C-0.786976655,34.7595013 2.9373074,35.9147532 3.9192135,32.890727 L8.72689855,19.1296485 L9.2799493,19.1296485 C9.2799493,19.1296485 2.95992025,43.7750224 2.70031069,44.6924335 C2.56498417,45.1567684 2.74553639,45.4852068 3.24205501,45.4852068 L8.704461,45.4852068 L8.704461,61.6700801 C8.704461,64.9659872 13.625035,64.9659872 13.625035,61.6700801 L13.625035,45.360657 L15.5097899,45.360657 L15.4984835,61.6700801 C15.4984835,64.9659872 20.4191451,64.9659872 20.4191451,61.6700801 L20.4191451,45.4852068 L25.8814635,45.4852068 C26.3667633,45.4852068 26.5586219,45.1567684 26.4345142,44.6924335 C26.1636859,43.7750224 19.8436568,19.1296485 19.8436568,19.1296485 L20.3966199,19.1296485 L25.2043926,32.890727 C26.1862111,35.9147532 29.9105828,34.7595013 28.9625083,31.5315864 L28.9624207,31.5315864 Z M14.5617154,0 C17.4960397,0 19.8773132,2.3898427 19.8773132,5.33453001 C19.8773132,8.27930527 17.4960397,10.66906 14.5617154,10.66906 C11.6274788,10.66906 9.24611767,8.27930527 9.24611767,5.33453001 C9.24611767,2.3898427 11.6274788,0 14.5617154,0 L14.5617154,0 Z',
    	'path://M512 292.205897c80.855572 0 146.358821-65.503248 146.358821-146.358821C658.358821 65.503248 592.855572 0 512 0 431.144428 0 365.641179 65.503248 365.641179 146.358821 365.641179 227.214393 431.144428 292.205897 512 292.205897zM512 731.282359c-80.855572 0-146.358821 65.503248-146.358821 146.358821 0 80.855572 65.503248 146.358821 146.358821 146.358821 80.855572 0 146.358821-65.503248 146.358821-146.358821C658.358821 796.273863 592.855572 731.282359 512 731.282359z'
	];
	var labelSetting = {
	    normal: {
	        show: false,
	        position: 'bottom',
	        offset: [0, 10],
	        formatter: function(param) {
	            return (param.value / total * 100).toFixed(0) + '%';
	        },
	        textStyle: {
	            fontSize: 18,
	            fontFamily: 'Arial',
	            color: '#686868'
	        }
	    }
	};

	var markLineSetting = { //设置标线
	    symbol: 'none',
	    lineStyle: {
	        normal: {
	            opacity: 0.3
	        }
	    },
	    data: [{
	        type: 'max',
	        label: {
	            normal: {
	                formatter: 'max: {c}'
	            }
	        }
	    }, {
	        type: 'min',
	        label: {
	            normal: {
	                formatter: 'min: {c}'
	            }
	        }
	    }]
	};

	var graphic_option = {
		// title:{
		// 	top:10,
		// 	text:"户籍人口",
		// 	// textAlign:"center",
		// 	textStyle:{
		// 		fontSize:14,
		// 		color:"#fff",
		// 	}
		// },
	    tooltip: {
	        show: true, //鼠标放上去显示悬浮数据
	        formatter: function(param) {
	            return (param.dataIndex!==1?(param.seriesName +": "+param.value)+ '人':"");
	        },
	    },
	    // legend: {
     //    	show:false,
	    //     data: ['typeA', 'typeB'],
	    //     selectedMode: 'single',
	    //     itemWidth: 10, //图例的宽度
	    //     itemHeight: 10, //图例的高度
	    //     itemGap: 30,
	    //     orient: 'horizontal',
	    //     left: 'center',
	    //     // top: '20px',
	    //     icon: 'rect',
	    //     // selectedMode: false, //取消图例上的点击事件
	    //     textStyle: {
	    //         color: '#808492'
	    //     },
	    // },
	    grid: {
	        top: '20%',
	        bottom: '20%',
	        containLabel: true
	    },
	    xAxis: {
	        data: ['a', 'x', 'b'],
	        axisTick: {
	            show: false
	        },
	        axisLine: {
	            show: false
	        },
	        axisLabel: {
	            show: false
	        }
	    },
	    yAxis: {
	        max: total,
	        splitLine: {
	            show: false
	        },
	        axisTick: {
	            // 刻度线
	            show: false
	        },
	        axisLine: {
	            // 轴线
	            show: false
	        },
	        axisLabel: {
	            // 轴坐标文字
	            show: false
	        }
	    },
	    series: [{
	            name: 'typeA',
	            type: 'pictorialBar',
	            symbolClip: true,
	            symbolBoundingData: total,
	            label: labelSetting,
	            data: [{
	                    value: male,
	                    symbol: symbols[0],
	                    itemStyle: {
	                        normal: {
	                            color: 'rgba(105,204,230)' //单独控制颜色
	                        }
	                    },
	                },
	                {

	                },
	                {
	                    value: female,
	                    symbol: symbols[1],
	                    itemStyle: {
	                        normal: {
	                            color: 'rgba(255,130,130)' //单独控制颜色
	                        }
	                    },
	                }
	            ],
	            // markLine: markLineSetting,
	            z: 10
	        },
	        {
	            // 设置背景底色，不同的情况用这个
	            name: '人数',
	            type: 'pictorialBar', //异型柱状图 图片、SVG PathData
	            symbolBoundingData: total,
	            animationDuration: 0,
	            itemStyle: {
	                normal: {
	                    color: '#ccc' //设置全部颜色，统一设置
	                }
	            },
	            z: 10,
	            data: [{
	                    itemStyle: {
	                        normal: {
	                            color: 'rgba(105,204,230,0.40)' //单独控制颜色
	                        }
	                    },
	                    value: male,
	                    symbol: symbols[0]
	                },
	                {
	                    // 设置中间冒号
	                    itemStyle: {
	                        normal: {
	                            color: '#1DA1F2' //单独控制颜色
	                        }
	                    },
	                    value: 100,
	                    symbol: symbols[2],
	                    symbolSize: [8, '18%'],
	                    symbolOffset: [0, '-200%']
	                },
	                {
	                    itemStyle: {
	                        normal: {
	                            color: 'rgba(255,130,130,0.40)' //单独控制颜色
	                        }
	                    },
	                    value: female,
	                    symbol: symbols[1]
	                }
	            ]
	        }
	    ]
	}
    graphicChart.setOption(graphic_option, true);
	window.onresize = function(){
	    graphicChart.resize();
	}
}
//不同类型人口统计(雷达图)
function load_population_radar(eleId, type_name, population_data){
	var radarChart = echarts.init(document.getElementById(eleId));
	var radar_option = {
        color: echarts_color,
	    "tooltip": {
	        "show": true,
	        "trigger": "item"
	    },
	    "radar": {
	        "center": ["50%", "50%"],
	        "radius": "70%",
	        "startAngle": 90,
	        "splitNumber": 4,
	        "shape": "circle",
	        "splitArea": {
	            "areaStyle": {
	                "color": ["transparent"]
	            }
	        },
	        "axisLabel": {
	            "show": false,
	            "fontSize": 18,
	            "color": "#fff",
	            "fontStyle": "normal",
	            "fontWeight": "normal"
	        },
	        "axisLine": {
	            "show": true,
	            "lineStyle": {
	                "color": "grey"//
	            }
	        },
	        "splitLine": {
	            "show": true,
	            "lineStyle": {
	                "color": "grey"//
	            }
	        },
	        "indicator": []
	    },
	    "series": [
	    {
	        name: type_name,
	        type: "radar",
	        symbol: "circle",
	        symbolSize: 3,
	        areaStyle: {
	            normal: {
	                color: "rgba(214,99,73, 1)"
	            }
	        },
	        itemStyle:{
	            color:'rgba(214,99,73, 1)',
	            borderColor:'rgba(214,99,73, 0.3)',
	            borderWidth:5,
	        },
	        lineStyle: {
	            normal: {
	                type: "dashed",
	                color: "rgba(214,99,73, 1)",
	                width: 1
	            }
	        },
	        data:[[]]
	    }]
	};
	for(var i = 0; i < population_data.length; i++){
		var item = population_data[i];
		radar_option.radar.indicator.push({ name: item.NAME, 
			max:(type_name === "60岁以上"?3000: 
				(type_name === "下岗失业"?300:
				(type_name === "学龄前"?700:
				(type_name === "在校小学生"?500:350))))
		});
		switch (type_name) {
			case "60岁以上": //60岁以上
				radar_option.series[0].data[0].push(item.OLDER_OVER_60);
	    		break;
			case "下岗失业": //下岗失业
				radar_option.series[0].data[0].push(item.UNEMPLOYED);
	    		break;
			case "学龄前": //学龄前
				radar_option.series[0].data[0].push(item.KID_PRESCHOOL);
	    		break;
			case "在校小学生": //在校小学生
				radar_option.series[0].data[0].push(item.PRIMARY_SCHOOL_STUDENT);
	    		break;
			case "在校中学生": //在校中学生
				radar_option.series[0].data[0].push(item.MIDDLE_SCHOOL_STUDENT);
	    		break;
		}
	}
    radarChart.setOption(radar_option, true);
	window.onresize = function(){
	    radarChart.resize();
	}
}
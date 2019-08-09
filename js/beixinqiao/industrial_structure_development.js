// 产业结构--产业发展
function IndustrialDevelopmentConcentration() {
	this.provide_data = [
		{ name: "民安", A: 85, B: 68 },
		{ name: "民安1", A: 90, B: 88 },
		{ name: "民安2", A: 70, B: 78 },
		{ name: "民安3", A: 35, B: 50 },
		{ name: "民安4", A: 55, B: 28 },
		{ name: "民安5", A: 78, B: 98 },
		{ name: "民安6", A: 30, B: 50 },
		{ name: "民安7", A: 80, B: 40 },
	];
	this.radar_chart_indicator_data = [];

}
IndustrialDevelopmentConcentration.prototype.init = function(){
	var _this = this;
	_this.reset_data();
	_this.load_dom();
	serveRequest("get", server_url+ "/FacilityEducation/getFacilityEducation",{},function(result){
		for(var i = 0; i < _this.provide_data.length; i++){
			var item = _this.provide_data[i];
			_this.radar_chart_indicator_data.push({
				name: item.name,
				max: 100,
			});
		}
		_this.load_pie_chart();
		_this.load_radar_chart([80, 50, 55, 80, 50, 80, 48, 43]);
	});
}
//生产dom元素
IndustrialDevelopmentConcentration.prototype.load_dom = function(){
	const industrial_structure_dom_str = '<div id="industrial_development_pie_content" style="width: 100%; height:50%;"></div>'+
		'<div id="industrial_development_radar_content" style="width: 100%; height:50%;"></div>';
	$("#visualization_echarts_content").append(industrial_structure_dom_str);
};
//加载饼状圆环图表
IndustrialDevelopmentConcentration.prototype.load_pie_chart = function(){
	var _this = this;
	var pieChart = echarts.init(document.getElementById("industrial_development_pie_content"));
	var m2R2Data= [
       {value:335, legendname:'种类01',name:"种类01  335",itemStyle:{color:"#8d7fec"}},
       {value:310, legendname:'种类02',name:"种类02  310",itemStyle:{color:"#5085f2"}},
       {value:234, legendname:'种类03',name:"种类03  234",itemStyle:{color:"#e75fc3"}},
       {value:154, legendname:'种类04',name:"种类04  154",itemStyle:{color:"#f87be2"}},
       {value:335, legendname:'种类05',name:"种类05  335",itemStyle:{color:"#f2719a"}},
       {value:335, legendname:'种类06',name:"种类06  335",itemStyle:{color:"#fca4bb"}},
       {value:335, legendname:'种类07',name:"种类07  335",itemStyle:{color:"#f59a8f"}},
       {value:335, legendname:'种类08',name:"种类08  335",itemStyle:{color:"#fdb301"}},
       {value:335, legendname:'种类09',name:"种类09  335",itemStyle:{color:"#57e7ec"}},
       {value:335, legendname:'种类10',name:"种类10  335",itemStyle:{color:"#cf9ef1"}},   
       {value:335, legendname:'种类09',name:"种类11  335",itemStyle:{color:"#57e7ec"}},
       {value:335, legendname:'种类10',name:"种类12  335",itemStyle:{color:"#cf9ef1"}}, 
    ];
	var pie_option =  {
	    title: [
	    {
	        text: '街道各类企业占比数',
	        textStyle: {
	            fontSize: 18,
	            color: "#287EB7"
	        },
	        left: "5%",
	        top: "3%"
	    },    
	    {
	        text: '企业共计',
	        subtext: 12312+'个',
	        textStyle:{
	            fontSize:28,
	            color:"#287EB7"
	        },
	        subtextStyle: {
	            fontSize: 20,
	            color: '#287EB7'
	        },
	        textAlign:"center",
	        x: '34.5%',
	        y: '44%',
	    }],
	    tooltip: {
	        trigger: 'item',
	        formatter:function (parms){
	          var str=  parms.seriesName+"</br>"+
	            parms.marker+""+parms.data.legendname+"</br>"+
	            "数量："+ parms.data.value+"</br>"+
	            "占比："+ parms.percent+"%";
	            return  str ;
	        }
	    },
	    legend: {
	        type:"scroll",
	        orient: 'vertical',
	        right:'2%',
	        align:'left',
	        top:'middle',
	        textStyle: {
	            color:'#8C8C8C'
	        },
	        height:200
	    },
	    series: [
	        {
	            name:'企业',
	            type:'pie',
	            center: ['35%', '50%'],
	            radius: ['35%', '60%'],
	            clockwise: false, //饼图的扇区是否是顺时针排布
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: true,
	                    position: 'outter',
	                     formatter:function (parms){
	                         return parms.data.legendname
	                     }
	                }
	            },
	            labelLine: {
	                normal: {
	                  length:5,
	                  length2:3,
	                  smooth:true,
	                }
	            },
	            data:m2R2Data
	        }
	    ]
	};
    pieChart.setOption(pie_option, true);
    pieChart.on("click",function(event){
    	console.log(event)
    	_this.load_radar_chart([60, 78, 60, 40, 42, 44, 65,80]);
    })
}
//加载设施覆盖率雷达图图表数据
IndustrialDevelopmentConcentration.prototype.load_radar_chart = function(series_data){
	var radarChart = echarts.init(document.getElementById("industrial_development_radar_content"));
	var radar_option = {
		color:["#4748FF", "#D18930"],
		title:{
			text:"各社区中对应该类型的企业占比图",
			left:'5%',
			textStyle:{
				color: '#287EB7',
				fontSize: 18
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
	    //     "data": ["数据1", "数据2"]
	    // },
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
	    "series": [{
	        // "name": "数据1",
	        "type": "radar",
	        "symbol": "circle",
	        "symbolSize": 10,
	        "areaStyle": {
	            "normal": {
	                "color": "rgba(245, 166, 35, 0.4)"
	            }
	        },
	        itemStyle:{
	            color:'rgba(245, 166, 35, 1)',
	            borderColor:'rgba(245, 166, 35, 0.3)',
	            borderWidth:10,
	        },
	        "lineStyle": {
	            "normal": {
	                "type": "dashed",
	                "color": "rgba(245, 166, 35, 1)",
	                "width": 2
	            }
	        },
	        "data": [series_data]
	    }]
	};
    radarChart.setOption(radar_option, true);
}
//重置数据
IndustrialDevelopmentConcentration.prototype.reset_data = function(){
	this.radar_chart_indicator_data = [];
}
var start_industry_development_rendering = new IndustrialDevelopmentConcentration();
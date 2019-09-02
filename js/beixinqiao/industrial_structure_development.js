// 产业结构--产业发展
function IndustrialDevelopmentConcentration() {
	this.round_point_color = ["#3ba0f3",'#ff9921',"#00FFFF",'#E0F319',"#00FF59",
		"#DE61FA","#3A8281","#F51B04","#630B7C","#C2B6F2","#05534F","#055317","#51C46C",
		"#BFDC3F","#C88A78","#F702A4"];
	this.community_name = [];
	this.pie_chart_data = [];
	this.radar_chart_indicator_data = [];
	this.series_data = [0,0,0,0,0,0,0,0,0,0,0,0];
	this.current_enterprise_type = "";
	this.company_tatol = 0;

}
IndustrialDevelopmentConcentration.prototype.init = function(){
	var _this = this;
	_this.reset_data();
	_this.load_dom();
	_this.render_point_layer();
	serveRequest("get", server_url+ "/Enterprise/getNumberByType",{},function(result){
		var data = JSON.parse(Decrypt(result.data.resultKey));
		for(var i = 0; i < data.length; i++){
			var item = data[i];
			_this.company_tatol += item.TOTAL_NYUMBER;
			_this.pie_chart_data.push({
				name: item.TYPE,
				value: item.TOTAL_NYUMBER,
			});
		}
		_this.current_enterprise_type = _this.pie_chart_data[0].name;
		_this.load_pie_chart();
	    _this.get_community_enterprise();
	});
}
//分类拆分数据
IndustrialDevelopmentConcentration.prototype.get_view_data = function(result_data){
	var new_data = [
		{九道湾: []},
		{小菊: []},
 		{藏经馆: []},
 		{草园: []},
 		{青龙: []},
 		{民安: []},
 		{门楼: []},
	 	{海运仓: []},
	 	{北官厅: []},
	 	{十三条: []},,
	 	{北新仓: []},
	 	{前永康: []}
	];
	for(var key in result_data){
		for(var i = 0; i < new_data.length; i++){
			for(var item in new_data[i]){
				if(item === key){
					new_data[i][key] = result_data[key];
				}
			}
		}
	}
	for(var i = 0; i < new_data.length; i++){
	    for(var key in new_data[i]){
	        this.community_name.push(key);
			this.radar_chart_indicator_data.push({
				name: key,
				max:60,
			});
	        if(new_data[i][key].length > 0){
	            for(var j = 0; j < new_data[i][key].length; j++){
	            	if(new_data[i][key][j].COMMUNITY_NAME === key){
						this.series_data[i] = new_data[i][key][j].TOTAL_NUMBER;
						break;
	            	}
	            }
	        }
	    }
	}
}
//生产dom元素
IndustrialDevelopmentConcentration.prototype.load_dom = function(){
	var industrial_structure_dom_str = '<div id="industrial_development_pie_content" style="width: 100%; height:50%;"></div>'+
		'<div id="industrial_development_radar_content" style="width: 100%; height:50%;"></div>';
	$("#visualization_echarts_content").append(industrial_structure_dom_str);
};
//添加产业发展点标识图层
IndustrialDevelopmentConcentration.prototype.render_point_layer = function(){
	var round_point_color = this.round_point_color;
	$.get(file_server_url+'industrial_structure_development.js', function (industrial_structure_development_data) {
		round_point_layer = new Loca.RoundPointLayer({
		    map: map,
		    // zIndex: 100,
	        eventSupport:true,
		});
	    round_point_layer.setData(JSON.parse(Decrypt(industrial_structure_development_data)), {
	        lnglat: 'lnglat'
	    });
	    round_point_layer.setOptions({
	        style: {
	            radius: 6,
	            color: function (data) {
	            	// console.log(data.value.properties)
	                var type = data.value.properties["ÀàÐÍ"];
	                var color = round_point_color[0];
	                switch (type){
	                	case "L 租赁和商务服务业" :
	                		color = round_point_color[0];
	                		break;
	                	case "C 制造业" :
	                		color = round_point_color[1];
	                		break;
	                	case "↵S 公共管理、社会保障和社会组织" :
	                		color = round_point_color[2];
	                		break;
	                	case "R 文化、体育和娱乐业" :
	                		color = round_point_color[3];
	                		break;
	                	case "J 金融业" :
	                		color = round_point_color[4];
	                		break;
	                	case "Q 卫生和社会工作" :
	                		color = round_point_color[5];
	                		break;
	                	case "P 教育" :
	                		color = round_point_color[6];
	                		break;
	                	case "O 居民服务、修理和其他服务业" :
	                		color = round_point_color[7];
	                		break;
	                	case "M 科学研究和技术服务业" :
	                		color = round_point_color[8];
	                		break;
	                	case "N 水利、环境和公共设施管理业" :
	                		color = round_point_color[9];
	                		break;
	                	case "G 交通运输、仓储和邮政业 " :
	                		color = round_point_color[10];
	                		break;
	                	case "I 信息传输、软件和信息技术服务业" :
	                		color = round_point_color[11];
	                		break;
	                	case "E 建筑业" :
	                		color = round_point_color[12];
	                		break;
	                	case "S 公共管理、社会保障和社会组织" :
	                		color = round_point_color[13];
	                		break;
	                	case "H 住宿和餐饮业" :
	                		color = round_point_color[14];
	                		break;
	                }
	                return color;
	            },
	            // opacity: 0.6,
	            borderWidth: 0,
	            // borderColor: '#eee'
	        }
	    });
	    round_point_layer.render();
	    round_point_layer.on('click', function (ev) {
	        var properties = ev.rawData.properties;
	        //渲染信息窗体
	        openInfo(properties["ÀàÐÍ"].split(" ")[1], properties["µ¥Î»µØÖ·"], ev.lnglat);
	    });
	})
}
//加载饼状圆环图表
IndustrialDevelopmentConcentration.prototype.load_pie_chart = function(){
	var _this = this;
	var pieChart = echarts.init(document.getElementById("industrial_development_pie_content"));
	var pie_option =  {
		color:this.round_point_color,
	    title: [
		    get_object_assign({
	            text:"街道各类企业占比数",
	        }, echart_title),   
	    {
	        text: '企业共计',
	        subtext: this.company_tatol+'个',
	        textStyle:{
	            fontSize:24,
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
	            parms.marker+""+parms.data.name+"</br>"+
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
	        height:200,
			formatter: function (name) {
			    return name.split(" ")[1].slice(0, 3)+"...";
			}
	    },
	    series: [
	        {
	            name:'企业',
	            type:'pie',
	            center: ['35%', '50%'],
	            radius: ['30%', '45%'],
	            clockwise: false, //饼图的扇区是否是顺时针排布
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: true,
	                    position: 'outter',
	                     formatter:function (parms){
	                         return parms.data.name.split(" ")[1].slice(0, 3)+"..."
	                     }
	                }
	            },
	            labelLine: {
	                normal: {
	                  show: true,
	                  length:5,
	                  length2:3,
	                  smooth:true,
	                }
	            },
	            data:this.pie_chart_data
	        }
	    ]
	};
    pieChart.setOption(pie_option, true);
    pieChart.dispatchAction({
        type: 'pieSelect',
        seriesIndex:0,
        dataIndex:0
    }); 
    pieChart.dispatchAction({
        type: 'showTip',
        seriesIndex:0,
        dataIndex:0
    }); 
    pieChart.on("click",function(event){
	    pieChart.dispatchAction({
	        type: 'pieUnSelect',
	        seriesIndex:0,
	        dataIndex:0
	    }); 
	    pieChart.dispatchAction({
	        type: 'hideTip',
	        seriesIndex:0,
	        dataIndex:0
	    }); 
		_this.community_name = [];
		_this.radar_chart_indicator_data = [];
		_this.series_data = [0,0,0,0,0,0,0,0,0,0,0,0];
	    _this.current_enterprise_type = event.name;
	    _this.get_community_enterprise();
    })
	window.onresize = function(){
	    pieChart.resize();
	}
}
//根据点击的企业类型获取各社区的数量
IndustrialDevelopmentConcentration.prototype.get_community_enterprise = function(){
	var _this = this;
	serveRequest("get", server_url+ "/Enterprise/getCommunityNumberByType",
		{ type: _this.current_enterprise_type },function(result){
		_this.get_view_data(JSON.parse(Decrypt(result.data.resultKey)));
		_this.load_radar_chart();
	});
}
//加载设施覆盖率雷达图图表数据
IndustrialDevelopmentConcentration.prototype.load_radar_chart = function(){
	var radarChart = echarts.init(document.getElementById("industrial_development_radar_content"));
	var radar_option = {
	    color: echarts_color,
		title: get_object_assign({
	            text:"各社区中对应该类型的企业占比图",
	    }, echart_title),
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
		        "name": this.current_enterprise_type,
		        "data": [
					this.series_data
		        ]
		    })]
	};
    radarChart.setOption(radar_option, true);
	window.onresize = function(){
	    radarChart.resize();
	}
}
//重置数据
IndustrialDevelopmentConcentration.prototype.reset_data = function(){
	this.community_name = [];
	this.pie_chart_data = [];
	this.radar_chart_indicator_data = [];
	this.series_data = [0,0,0,0,0,0,0,0,0,0,0,0];
	this.current_enterprise_type = "";
	this.company_tatol = 0;
}
var start_industry_development_rendering = new IndustrialDevelopmentConcentration();
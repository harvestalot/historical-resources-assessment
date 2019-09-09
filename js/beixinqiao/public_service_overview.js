// 公共服务设施--概览
var radarChart;
function PublicServiceOverview() {
    this.round_point_color = ["#3ba0f3",'#ff9921',"#00FFFF",'#E0F319',"#00FF59","#DE61FA","#F51B04"];
	this.lenged_data = ["便民设施", "教育设施", "医疗设施", "养老设施", "文体设施", "交通设施", "街道管理设施"];
	this.community_name = [];
	this.radar_chart_indicator_data = [];
	this.comprehensive_data = {
        "便民设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "教育设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "医疗设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "文体设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "养老设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "交通设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "街道管理设施":[0,0,0,0,0,0,0,0,0,0,0,0],
    };
    this.type_transform = {
    	"education":"教育设施",
    	"medical_care":"医疗设施",
    	"stylistic":"文体设施",
    	"street_manager":"街道管理设施",
    	"convenient":"便民设施",
    	"transport":"交通设施",
    	"pension":"养老设施",
    };
    this.current_series_data = [];
	this.ranking_list = [];
	this.facilities_all_point_data = [];
}
PublicServiceOverview.prototype.init = function(){
	this.reset_data();
	this.load_dom();
	this.click_dom();
	this.render_point_layer();
	var _this = this;
	serveRequest("get", server_url+ "/Coverage/getCoverageOverview",{ },function(result){
		_this.get_view_data(JSON.parse(Decrypt(result.data.resultKey)));
		_this.load_chart("全部");
	});
	//设施排行榜no.1
	serveRequest("get", server_url+ "/Coverage/getCoverageOrder",{ },function(result){
		var ranking_list = JSON.parse(Decrypt(result.data.resultKey));
		for(var i = 0; i < ranking_list.length; i++){
			var item = ranking_list[i];
			_this.ranking_list.push(
				{ type: _this.type_transform[item.TYPE], name: item.COMMUNITY_NAME, value: item.COVERAGE*100 }
			);
		}
		_this.load_ranking_list(_this.ranking_list);
	});
}
//合并设施所有点
PublicServiceOverview.prototype.get_facilities_all_point_data = function(){

}
//分类拆分数据
PublicServiceOverview.prototype.get_view_data = function(result_data){
	for(var i = 0; i < result_data.length; i++){
	    for(var key in result_data[i]){
	        this.community_name.push(key);
	        this.radar_chart_indicator_data.push({
	            name: key,
	            max: 100,
	            color:"#fff"
	        })
	        if(result_data[i][key].length > 0){
	            for(var j = 0; j < result_data[i][key].length; j++){
	                this.comprehensive_data[result_data[i][key][j].CATEGORY_NAME][i] = (result_data[i][key][j].TOTAL_COVERAGE*100).toFixed(2);
	            }
	        }
	    }
	}
}
//生产dom元素
PublicServiceOverview.prototype.load_dom = function(){
	//雷达统计图
	var public_service_dom_str = '<div class="chart_view" style="width: 100%; height: 55%;padding-top:10px;box-sizing: border-box;">'+
	'<div id="public_service_type" class="clearfix statistics_type public_service_type">'+
	'<a href="javascript:void(0)" class="active_checked">全部</a>'+
	'<a href="javascript:void(0)">便民</a>'+
	'<a href="javascript:void(0)">教育</a>'+
	'<a href="javascript:void(0)">医疗</a>'+
	'<a href="javascript:void(0)">养老</a>'+
	'<a href="javascript:void(0)">文体</a>'+
	'<a href="javascript:void(0)">交通</a>'+
	'<a href="javascript:void(0)">街道管理</a>'+
	'</div>'+
	'<div id="public_service_radar_content" style="width: 100%; height: 88%;"></div>'+
	'</div>'+
	'<div class="chart_view" style="width: 100%; height: 45%;">'+
	'<div class="ranking_title">各项设施评估No.1表</div>'+
	'<div id="public_service_ranking_content">'+
	'</div>'+
	'</div>';
	$("#visualization_echarts_content").append(public_service_dom_str);
};
//添加所有设施类型的点标识图层_convenient_people
PublicServiceOverview.prototype.render_point_layer = function(){
    var round_point_color = echarts_color;
    $.get(file_server_url+'public_service_all_facilities.js', function (result) {
    	var data = JSON.parse(Decrypt(result));
    	var public_service_all_facilities_data = [];
		for(var i = 0; i < data.length; i++){
			for(var j = 0; j < data.length; j++){
				public_service_all_facilities_data.push(data[i][j]);
			}
		}
	    round_point_layer = new Loca.RoundPointLayer({
	        map: map,
	        zIndex: 100,
	        eventSupport:true,
	    });
	    round_point_layer.setData(public_service_all_facilities_data, {
	        lnglat: 'lnglat'
	    });
	    round_point_layer.setOptions({
	        style: {
	            radius: 6,
	            color: function (data) {
	                // console.log(data.value.properties)
	                var type = data.value.properties["Ò»¼¶²Ëµ¥"];
	                var color = round_point_color[0];
	                switch (type){
	                    case "便民设施" :
	                        color = round_point_color[0];
	                        break;
	                    case "教育设施" :
	                        color = round_point_color[1];
	                        break;
	                    case "医疗设施" :
	                        color = round_point_color[2];
	                        break;
	                    case "文体设施" :
	                        color = round_point_color[3];
	                        break;
	                    case "交通设施" :
	                        color = round_point_color[4];
	                        break;
	                    case "养老设施" :
	                        color = round_point_color[5];
	                        break;
	                    case "街道管理设施" :
	                        color = round_point_color[6];
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
	        openInfo(properties.hasOwnProperty("name")?properties.name:properties.address, properties.addres, ev.lnglat);
	    });
	})
}
//点击类型触发
PublicServiceOverview.prototype.click_dom = function(){
	var _this = this;
	$("#public_service_type a").click(function(){
		$(this).addClass("active_checked").siblings("a").removeClass("active_checked");
		_this.load_chart($(this).html());
	});
}
//加载图表数据
PublicServiceOverview.prototype.load_chart = function(type){
	this.current_series_data = [];
	switch (type){
		case "便民" :
			this.current_series_data.push(get_object_assign(rader_color[0],{
		        "name": this.lenged_data[0],
		        "data": [
					this.comprehensive_data[this.lenged_data[0]]
		        ]
		    }));
			break;
		case "教育" :
			this.current_series_data.push(get_object_assign(rader_color[1],{
		        "name": this.lenged_data[1],
		        "data": [
					this.comprehensive_data[this.lenged_data[1]]
		        ]
		    }));
			break;
		case "医疗" :
			this.current_series_data.push(get_object_assign(rader_color[2],{
		        "name": this.lenged_data[2],
		        "data": [
					this.comprehensive_data[this.lenged_data[2]]
		        ]
		    }));
			break;
		case "养老" :
			this.current_series_data.push(get_object_assign(rader_color[3],{
		        "name": this.lenged_data[3],
		        "data": [
					this.comprehensive_data[this.lenged_data[3]]
		        ]
		    }));
			break;
		case "文体" :
			this.current_series_data.push(get_object_assign(rader_color[4],{
		        "name": this.lenged_data[4],
		        "data": [
					this.comprehensive_data[this.lenged_data[4]]
		        ]
		    }));
			break;
		case "交通" :
			this.current_series_data.push(get_object_assign(rader_color[5],{
		        "name": this.lenged_data[5],
		        "data": [
					this.comprehensive_data[this.lenged_data[5]]
		        ]
		    }));
			break;
		case "街道管理" :
			this.current_series_data.push(get_object_assign(rader_color[6],{
		        "name": this.lenged_data[6],
		        "data": [
					this.comprehensive_data[this.lenged_data[6]]
		        ]
		    }));
			break;
		case "全部" :
			for(var i = 0; i < this.lenged_data.length; i++){
				this.current_series_data.push(get_object_assign(rader_color[i],{
			        "name": this.lenged_data[i],
			        "data": [
						this.comprehensive_data[this.lenged_data[i]]
			        ]
			    }));
			}
			break;
	}
	this.load_radar_chart();
}
//加载雷达图表数据
PublicServiceOverview.prototype.load_radar_chart = function(type_name){
	radarChart = echarts.init(document.getElementById("public_service_radar_content"));
	var radar_option = {
		color: echarts_color,
		title:get_object_assign(echart_title,{
			text:"各社区公共设施设施覆盖率对比图",
		}),
	    "tooltip": {
	        "show": true,
	        "trigger": "item"
	    },
	    "radar": {
	        "center": ["50%", "50%"],
	        "radius": "60%",
	        "startAngle": 90,
	        "splitNumber": 4,
	        "shape": "circle",
	        "splitArea": {
	            "areaStyle": {
	                "color": ["transparent"]
	            }
	        },
	        // "axisLabel": {
	        //     "show": false,
	        //     "fontSize": 18,
	        //     "color": "#fff",
	        //     "fontStyle": "normal",
	        //     "fontWeight": "normal"
	        // },
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
	        "indicator": this.radar_chart_indicator_data
	    },
	    "series": this.current_series_data
	};
    radarChart.setOption(radar_option, true);
	window.onresize = function(){
	    radarChart.resize();
	}
}
//重置数据
PublicServiceOverview.prototype.reset_data = function(){
	this.community_name = [];
	this.radar_chart_indicator_data = [];
	this.comprehensive_data = {
        "便民设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "教育设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "医疗设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "文体设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "养老设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "交通设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "街道管理设施":[0,0,0,0,0,0,0,0,0,0,0,0],
    };
    this.current_series_data = [];
    this.ranking_list = [];
}
//加载排行榜统计
PublicServiceOverview.prototype.load_ranking_list = function(data){
	for(var i = 0; i < data.length; i++){
		$("#public_service_ranking_content").append('<p class="ranking_list"><span class="type_name">'
			+data[i].type+'：&nbsp;&nbsp;</span><span class="name_value">'+data[i].name+'（'+data[i].value+'%）</span></p>')
	}
}

var start_overview_rendering = new PublicServiceOverview();
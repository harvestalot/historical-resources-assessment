//公共服务设施--养老设置
function PublicServiceProvide() {
	this.lenged_data = ["社区机构养老设施", "社区助残养老设施"];
	this.community_name = [];
	this.radar_chart_indicator_data = [];
	this.comprehensive_data = {
        "社区机构养老设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "社区助残养老设施":[0,0,0,0,0,0,0,0,0,0,0,0],
    }

}
PublicServiceProvide.prototype.init = function(){
	this.reset_data();
	this.render_point_layer();
	this.load_dom();
	var _this = this;
	//养老设施总覆盖率
	serveRequest("get", server_url+ "/Coverage/getCoverageTotal",{ categoryCode: "pension" },function(result){
		$("#total_coverage").html(JSON.parse(Decrypt(result.data.resultKey))+" %");
	});
	//教育设施请求
	serveRequest("get", server_url+ "/Coverage/getCoverageByCategory",{ category: "pension",},function(result){
		_this.get_view_data(JSON.parse(Decrypt(result.data.resultKey)));
		_this.load_radar_chart();
	});
	//看板请求
	serveRequest("get", server_url+ "/PensionFacility/getPensionFacility",{ },function(result){
		_this.render_spectaculars_list(JSON.parse(Decrypt(result.data.resultKey)));
		$("#spectaculars_content p").click(function(){
			$(this).addClass("active_checked").siblings("p").removeClass("active_checked");
			_this.click_dom($(this).attr("data_lnglat"), 15);
	        //渲染信息窗体
			infoWindow? map.remove(infoWindow):"";//清除信息窗体
	        openInfo($(this).attr("data_name"), "", $(this).attr("data_lnglat").split(","));
		});
	});
}
//分类拆分数据
PublicServiceProvide.prototype.get_view_data = function(result_data){
	for(var i = 0; i < result_data.length; i++){
	    for(var key in result_data[i]){
	        this.community_name.push(key);
	        this.radar_chart_indicator_data.push({
	            name: key,
	            max:100,
	            color:'#fff'
	        })
	        if(result_data[i][key].length > 0){
	            for(var j = 0; j < result_data[i][key].length; j++){
	                this.comprehensive_data[result_data[i][key][j].CATEGORY_NAME][i] = result_data[i][key][j].COVERAGE.toFixed(2);
	            }
	        }
	    }
	}
}
//添加设施类型的点标识图层
PublicServiceProvide.prototype.render_point_layer = function(){
	var _this = this;
    var round_point_color = echarts_color;
    $.get(file_server_url+'endowment_facilities.js', function (endowment_facilities_point_data) {
	    round_point_layer = new Loca.RoundPointLayer({
	        map: map,
	        zIndex: 100,
	        eventSupport:true,
	    });
	    round_point_layer.setData(JSON.parse(Decrypt(endowment_facilities_point_data)), {
	        lnglat: 'lnglat'
	    });
	    round_point_layer.setOptions({
	        style: {
	            radius: 6,
	            color: function (data) {
	                var type = data.value.properties["¶þ¼¶²Ëµ¥"];
	                var color = round_point_color[0];
	                switch (type){
	                    case "社区机构养老设施" :
	                        color = round_point_color[0];
	                        break;
	                    case "社区助残服务中心" :
	                        color = round_point_color[1];
	                        break;
	                }
	                return color;
	            }
	        }
	    })
	    round_point_layer.render();
	    round_point_layer.on('click', function (ev) {
	    	$("#spectaculars_content p").removeClass("active_checked");
	        var properties = ev.rawData.properties;
	        //渲染信息窗体
	        openInfo(properties.name, properties['¾­ÓªµØ'], ev.lnglat);
			// _this.click_dom(ev.lnglat.join(), 15);
	    });
	})
}
//生产dom元素
PublicServiceProvide.prototype.load_dom = function(){
	var public_service_dom_str = '<div class="chart_view" style="width: 100%; height: 60%;">'+
		'<div class="public_service_total_coverage">'+
		'<p >街道养老设施覆盖率：<span id="total_coverage">0%</span></p>'+
		'</div>'+
		'<div id="fraction_coverage_content" style="width: 100%; height: 87%;"></div></div>'+
		'<div class="chart_view" style="width: 100%; height: 40%;overflow-y: auto;">'+
		'<p style="padding:10px 0 10px 12px;font-size:14px;color:#fff;font-weight:700;">养老设施看板</p>'+
		'<div id="spectaculars_content" class="chart_view spectaculars_content" style="width: 100%; height: 40%;">'+
		'</div>'+
		'</div>';
	$("#visualization_echarts_content").append(public_service_dom_str);
};
//点击养老设施点或者看板触发可达性覆盖范围请求
PublicServiceProvide.prototype.click_dom = function(centerpoint, time){
	var _this = this;
	$.get(reachability_url+"?centerpoint="+centerpoint+"&time="+time,function(result){
		var reachability_data = [];
		for(var i = 0; i < JSON.parse(result).result.split(";").length; i++){
			var item = JSON.parse(result).result.split(";")[i];
			reachability_data.push([item.split(",")[0],item.split(",")[1]])
		};
		_this.load_reachability_layer(reachability_data);
	});
}
// 加载可达性区域范围图层
PublicServiceProvide.prototype.load_reachability_layer = function(reachability_data){
	reachabilityLayer?map.remove(reachabilityLayer):"";
    reachabilityLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 1,
        fitView: true,
        eventSupport:false,
    });
    reachabilityLayer.setData([{lnglat: reachability_data}], {
        lnglat: 'lnglat'
    });
    reachabilityLayer.setOptions({
        style: {
            color: "#35F8BA",
            height: function () {
                return Math.random() * 500 + 100;
            }
        }
    });
    reachabilityLayer.render();
}
//加载养老设施覆盖率雷达图图表数据
PublicServiceProvide.prototype.load_radar_chart = function(){
	var radarChart = echarts.init(document.getElementById("fraction_coverage_content"));
	var radar_option = {
		color: echarts_color,
		title:get_object_assign({
			text:"各社区养老设施覆盖率对比图",
		}, echart_title),
	    legend: {
	        show: true,
	        right:"10%",
	        bottom:"1%",
	        textStyle: {
	            "fontSize": 14,
	            "color": "#fff"
	        },
	        "data": this.lenged_data
	    },
	    tooltip: {
	        show: true,
	        trigger: "item"
	    },
	    radar: {
	        center: ["50%", "50%"],
	        radius: "60%",
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
		        "name": this.lenged_data[0],
		        "data": [
					this.comprehensive_data[this.lenged_data[0]]
		        ]
		    }),
	    	get_object_assign(rader_color[1], {
		        "name": this.lenged_data[1],
		        "data": [
					this.comprehensive_data[this.lenged_data[1]]
		        ]
		    })
		]
	};
    radarChart.setOption(radar_option, true);
	window.onresize = function(){
	    radarChart.resize();
	}
}
//渲染看板列表DOM元素
PublicServiceProvide.prototype.render_spectaculars_list = function(data){
	for(var i = 0; i < data.length; i++){
		var item = data[i];
		$("#spectaculars_content").append('<p data_name='+item.NAME+' data_lnglat='+item.LONGITUDE+","+item.LATITUDE+'><span>'+item.NAME+
			'</span><span>'+item.COMMUNITY_NAME+'</span><span class="second_level_color">'+item.COVERAGE.toFixed(0)+'%</span></p>')
	}
}
//重置数据
PublicServiceProvide.prototype.reset_data = function(){
	this.radar_chart_indicator_data = [];
}
var start_provide_rendering = new PublicServiceProvide();
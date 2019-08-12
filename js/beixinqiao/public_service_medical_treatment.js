//公共服务设施--医疗设置
function PublicServiceMedicalTreatment() {
	this.hospital_data = [];//医院
	this.health_service_station_data = [];//卫生服务站
	this.radar_chart_indicator_data = [];

}
PublicServiceMedicalTreatment.prototype.init = function(){
	this.reset_data();
	this.render_point_layer();
	this.load_dom();
	const _this = this;
	//教育设施请求
	serveRequest("get", server_url+ "/Coverage/getCoverageByCategory",{ category: "medical_care",},function(result){
		const data_1 = [], data_2 = [];
		for(var i = 0; i < result.data.resultKey.length; i++){
			var item = result.data.resultKey[i];
			if(_this.radar_chart_indicator_data.length > 0){
				for(var j = 0; j < _this.radar_chart_indicator_data.length; j++){
					if(_this.radar_chart_indicator_data[j].name !== item.COMMUNITY_NAME){
						_this.radar_chart_indicator_data.push({
							name: item.COMMUNITY_NAME,
							max:1000,
						})
						if(item.CATEGORY === "医院"){
							_this.hospital_data.push(item.COVERAGE);
							_this.health_service_station_data.push(0);
						}else{
							_this.health_service_station_data.push(item.COVERAGE);
							_this.hospital_data.push(0);
						}
						break;
					}
				}
			}else{
				_this.radar_chart_indicator_data.push({
					name: item.COMMUNITY_NAME,
					max:1000,
				})
				if(item.CATEGORY === "医院"){
					_this.hospital_data.push(item.COVERAGE);
					_this.health_service_station_data.push(0);
				}else{
					_this.health_service_station_data.push(item.COVERAGE);
					_this.hospital_data.push(0);
				}
			}
			// if(item.CATEGORY === "医院"){
			// 	_this.hospital_data.push(item.COVERAGE);
			// }else{
			// 	_this.health_service_station_data.push(item.COVERAGE);
			// }
		}
		_this.load_radar_chart();
	});
	$("#spectaculars_content p").click(function(){
		$(this).addClass("active_checked").siblings("p").removeClass("active_checked");
		_this.click_dom("116.42437454,39.93425622", 15);
	});
}
//添加养老设施点标识图层
PublicServiceMedicalTreatment.prototype.render_point_layer = function(){
	var _this = this;
	point_layer = new Loca.IconLayer({
	    map: map,
	    zIndex: 100,
        eventSupport:true,
	});
    point_layer.setData(medical_treatment_facilities_point_data, {
        lnglat: 'lnglat'
    });
    point_layer.setOptions({
        source: function(res) {
            var value = res.value;
            var typecode = value.typecode;
            // 这里需要写上 http 协议，不能忽略
            // var src = 'http://webapi.amap.com/theme/v1.3/markers/n/mid.png';
            var src = point_icon_server_url+ '/beixinqiao/yiliao.svg';
            return src;
        },
        style: {
            size: 32
        }
    });
    point_layer.render();
    point_layer.on('click', function (ev) {
    	$("#spectaculars_content p").removeClass("active_checked");
    	// ev.rawData.properties.
		_this.click_dom(ev.lnglat.join(), 15);
    });
}
//生产dom元素
PublicServiceMedicalTreatment.prototype.load_dom = function(){
	const public_service_dom_str = '<div class="chart_view" style="width: 100%; height: 60%;">'+
		'<div style="width: 100%; height: 13%;padding-top:20px;box-sizing: border-box;">'+
		'<p style="padding-left:21%;box-sizing: border-box;">街道医疗设施覆盖率：<span style="font-size:36px;color:#F7C370;">81%</span></p>'+
		'</div>'+
		'<div id="fraction_coverage_content" style="width: 100%; height: 87%;"></div></div>'+
		'<div class="chart_view" style="width: 100%; height: 40%;">'+
		'<p style="padding:10px 0 10px 21%;font-size:16px;color:#1E78B2;font-weight:700;">医疗设施看板</p>'+
		'<div id="spectaculars_content" class="chart_view spectaculars_content" style="width: 100%; height: 40%;">'+
		'<p><span>炮局胡同养老驿站</span><span>海运仓</span><span>50%</span></p>'+
		'<p><span>海运仓社区养老服务驿站</span><span>民安</span><span>87%</span></p>'+
		'</div>'+
		'</div>';
	$("#visualization_echarts_content").append(public_service_dom_str);
};
//点击养老设施点或者看板触发可达性覆盖范围请求
PublicServiceMedicalTreatment.prototype.click_dom = function(centerpoint, time){
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
PublicServiceMedicalTreatment.prototype.load_reachability_layer = function(reachability_data){
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
PublicServiceMedicalTreatment.prototype.load_radar_chart = function(){
	var radarChart = echarts.init(document.getElementById("fraction_coverage_content"));
	var radar_option = {
		color:["#4748FF", "#D18930"],
		title:{
			text:"各社区养老设施对比图",
			left:'20%',
			textStyle:{
				color: '#1E78B2',
				fontSize: 16
			}
		},
	    legend: {
	        show: true,
	        right:"10%",
	        bottom:"1%",
	        textStyle: {
	            "fontSize": 14,
	            "color": "#fff"
	        },
	        "data": ["医院", "社区卫生服务站"]
	    },
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
	        "name": "医院",
	        "type": "radar",
	        "symbol": "circle",
	        "symbolSize": 3,
	        "areaStyle": {
	            "normal": {
	                "color": "rgba(245, 166, 35, 0.4)"
	            }
	        },
	        itemStyle:{
	            color:'rgba(245, 166, 35, 1)',
	            borderColor:'rgba(245, 166, 35, 0.3)',
	            borderWidth:5,
	        },
	        "lineStyle": {
	            "normal": {
	                "type": "dashed",
	                "color": "rgba(245, 166, 35, 1)",
	                "width": 1
	            }
	        },
	        "data": [
	            this.hospital_data
	        ]
	    }, {
	        "name": "社区卫生服务站",
	        "type": "radar",
	        "symbol": "circle",
	        "symbolSize": 3,
	        "itemStyle": {
	            "normal": {
	                color:'rgba(19, 173, 255, 1)',
	                "borderColor": "rgba(19, 173, 255, 0.4)",
	                "borderWidth": 5
	            }
	        },
	        "areaStyle": {
	            "normal": {
	                "color": "rgba(19, 173, 255, 0.5)"
	            }
	        },
	        "lineStyle": {
	            "normal": {
	                "color": "rgba(19, 173, 255, 1)",
	                "width": 1,
	                "type": "dashed"
	            }
	        },
	        "data": [
	           	this.health_service_station_data
	        ]
	    }]
	};
    radarChart.setOption(radar_option, true);
}
//重置数据
PublicServiceMedicalTreatment.prototype.reset_data = function(){
	this.hospital_data = [];//医院
	this.health_service_station_data = [];//卫生服务站
	this.radar_chart_indicator_data = [];
}
var start_medical_treatment_rendering = new PublicServiceMedicalTreatment();
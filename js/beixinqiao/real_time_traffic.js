//街区活力监测--交通路况监测
function RealTimeTraffic(){
	
}
RealTimeTraffic.prototype.init = function(){
	this.real_time_traffic_layer();
}
//实时交通路况图层
RealTimeTraffic.prototype.real_time_traffic_layer = function(){
    trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 11,
        autoRefresh:true,
        interval:3600,
    });
    trafficLayer.setMap(map);
    trafficLayer.show();

}
var start_real_time_traffic_rendering = new RealTimeTraffic();
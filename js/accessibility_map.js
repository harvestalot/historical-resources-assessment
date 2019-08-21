$(function(){
	//初始化地图
	var accessibility_map = new AMap.Map("accessibility_map", {
	    // 隐藏默认楼块--区域面（bg）/道路（road）/建筑物（building）/标注（point）
	    features: ['bg', 'road',"building"],
	    center: [116.425768,39.940966],
	    zoom: 12,
	});
	accessibility_map.on('mapload', function () {
	    accessibility_map.getMap().plugin(['AMap.ControlBar'], function () {
	        var controlBar = new AMap.ControlBar();
	        accessibility_map.getMap().addControl(controlBar);
	    });
	});

        accessibility_map.setDefaultCursor("url('https://lbs.amap.com/webapi/static/Images//0.png'),pointer");
	accessibility_map.on('click', function(event){
		console.log(event)
	});
});

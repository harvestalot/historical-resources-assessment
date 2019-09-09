(function(win) {
        var doc = win.document;
        var docEl = doc.documentElement;
        var tid;
        function refreshRem() {
            var width = docEl.getBoundingClientRect().width;
            if (width > 1920) { // 最大宽度
                width = 1920;
            }else if(width < 1200){
                width = 1200;
            }
            var rem = width / 113.8; // 将1366屏幕宽度分成136.6份， 1份为1rem
            docEl.style.fontSize = rem + 'px';
        }
        win.addEventListener('resize', function() {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }, false);
        win.addEventListener('pageshow', function(e) {
            if (e.persisted) {
                clearTimeout(tid);
                tid = setTimeout(refreshRem, 300);
            }
        }, false);

        refreshRem();

})(window);
//外部css、js库
document.write('<link rel="stylesheet" type="text/css" href="./lib/animate.css">');
document.write('<link rel="stylesheet" href="https://cache.amap.com/lbs/static/main1119.css"/>');
document.write('<script type="text/javascript" src="./lib/jquery-3.3.1.min.js"></script>');
document.write('<script type="text/javascript" src="./lib/template.js"></script>');
document.write('<script type="text/javascript" src="./lib/echarts.min.js"></script>');
document.write('<script type="text/javascript" src= "./lib/aes.js"></script>');
document.write('<script type="text/javascript" src= "./lib/pad-zeropadding.js"></script>');
document.write('<script type="text/javascript" src= "./lib/security.js"></script>');
document.write('<script type="text/javascript" src="//webapi.amap.com/maps?v=1.4.15&key=ecde469412ea3b8c4b8a640687c68c2b&plugin=AMap.PlaceSearch"></script>');
document.write('<script type="text/javascript" src="//webapi.amap.com/loca?v=1.3.0&key=ecde469412ea3b8c4b8a640687c68c2b"></script>');
document.write('<script type="text/javascript" src="https://cache.amap.com/lbs/static/PlaceSearchRender.js"></script>');
document.write('<script type="text/javascript" src="https://cache.amap.com/lbs/static/addToolbar.js"></script>');
// document.write('<script src="//a.amap.com/Loca/static/manual/example/script/demo.js"></script>');//openInfoWin封装

var trafficLayer;//实时路况交通图层
var point_layer;//社区服务设施Icon标记图层
var reachabilityLayer;//可达性覆盖范围图层
var heatmapLayer;//街区活力热力图图层
var infoWindow;//信息窗体标示
var sidebar_polygonLayer;//侧边导航触发的图层
var line_layer;//线图层
var round_point_layer;//圆点图层
// icon点标记图片地址
var reachability_url = "http://114.64.228.103/reachcircle/walkServlet";//可达性覆盖范围服务地址
var point_icon_server_url = "http://peking.caupdcloud.com/bxq/images";
var server_url = "http://peking.caupdcloud.com:8081";
var file_server_url = "http://peking.caupdcloud.com:8089/";
// var point_icon_server_url = "http://116.62.222.106:8080/images";
// var server_url = "http://116.62.222.106:8081";
// var file_server_url = "http://116.62.222.106:8089/";
/**
 *ajax请求通用方法
 *
 * @param type           请求类型
 * @param url            请求服务的地址
 * @param params_arguments      传递的参数对象
 * @param callBack       请求成功的回调函数
 */
function serveRequest(type,url,params_arguments,callBack){
    $.ajax({
        type:type,
        url:url,
        // data: Encrypt(JSON.stringify(params_arguments)),
        data: params_arguments,
        success: function (result) {
        	if(result.resultCode === "10000"){
            	callBack(result);
        	}else{
        		alert(result.resultMessage);
        	}
        },
    });
};
//信息窗体
function openInfo(facility_type, address, center) {
    var info = [];
    info.push('<div class="info_window">'+facility_type+'</div>');
    // info.push('<div class="info_window">地址：'+address+'</div>');
    infoWindow = new AMap.InfoWindow({
        content: info.join(""),  //使用默认信息窗体框样式，显示信息内容
    });
    infoWindow.open(map, center);
}
//地图图例
function map_legend(current_land_legend_data){
    $("#map_legend").fadeIn(300);
    var html = template("map_legend_tmp",current_land_legend_data);
    document.getElementById('map_legend').innerHTML = html;
}
// 对象合并
function get_object_assign(obj1, obj2){
    var obj3 = {};
    for(var attr in obj1){
        obj3[attr] = obj1[attr];
    }
    for(var attr in obj2){
        obj3[attr] = obj2[attr];
    }
    return obj3;
}


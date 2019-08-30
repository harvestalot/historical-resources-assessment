
// (function(window) {
//     var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
//     var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
//     var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
//     var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
//     if(isIE) {
//         window.location.href = "https://www.so.com";
//         var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
//         reIE.test(userAgent);
//         var fIEVersion = parseFloat(RegExp["$1"]);
//         alert(fIEVersion);
//         if(fIEVersion == 7) {
//             return 7;
//         } else if(fIEVersion == 8) {
//             window.location.href = "https://www.so.com";
//             return 8;
//         } else if(fIEVersion == 9) {
//             return 9;
//         } else if(fIEVersion == 10) {
//             return 10;
//         } else {
//             return 6;//IE版本<=7
//         }   
//     } else if(isEdge) {
//         return 'edge';//edge
//     } else if(isIE11) {
//         return 11; //IE11  
//     }else{
//         return -1;//不是ie浏览器
//     }
// })(window);
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
var point_icon_server_url = "http://localhost:8080/historical-resources-assessment/images";
var reachability_url = "http://114.64.228.103/reachcircle/walkServlet";//可达性覆盖范围服务地址
// var server_url = "http://116.62.222.106:8081";
// var server_url = "127.0.0.1";
// var server_url = "127.0.0.1:8089/";
var file_server_url = "http://116.62.222.106:8089/";
var server_url = "http://192.168.1.43:8081";
/**
 *ajax请求通用方法
 *
 * @param type           请求类型
 * @param url            请求服务的地址
 * @param arguments      传递的参数对象
 * @param callBack       请求成功的回调函数
 */
function serveRequest(type,url,arguments,callBack){
    $.ajax({
        type:type,
        url:url,
        // data: Encrypt(JSON.stringify(arguments)),
        data: arguments,
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


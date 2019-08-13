//外部css、js库
document.write('<link rel="stylesheet" type="text/css" href="./lib/animate.css">');
document.write('<script type="text/javascript" src="./lib/jquery-3.3.1.min.js"></script>');
document.write('<script type="text/javascript" src="./lib/template.js"></script>');
document.write('<script type="text/javascript" src="./lib/echarts.min.js"></script>');
document.write('<script src="//webapi.amap.com/maps?v=1.4.15&key=ecde469412ea3b8c4b8a640687c68c2b"></script>');
document.write('<script src="//webapi.amap.com/loca?v=1.3.0&key=ecde469412ea3b8c4b8a640687c68c2b"></script>');
document.write('<script src="//a.amap.com/Loca/static/manual/example/script/demo.js"></script>');//openInfoWin封装


var point_layer;//社区服务设施Icon标记图层
var reachabilityLayer;//可达性覆盖范围图层
var heatmapLayer;//街区活力热力图图层
var infoWindow;//信息窗体标示
// icon点标记图片地址
const point_icon_server_url = "http://localhost:8080/historical-resources-assessment/images";
const reachability_url = "http://114.64.228.103/reachcircle/walkServlet";//可达性覆盖范围服务地址
// const server_url = "http://116.62.222.106:8081";
const server_url = "http://192.168.1.43:8081";
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
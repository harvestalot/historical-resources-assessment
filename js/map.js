function load_map(mapId){
    map.on('mapload', function () {
        map.getMap().plugin(['AMap.ControlBar'], function () {
            var controlBar = new AMap.ControlBar();
            map.getMap().addControl(controlBar);
        });
    });
    //实时路况图层
    var trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 11
    });
    //街道区域边界图层
    var streetLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 12,
        // fitView: true,
        eventSupport:false,
    });
    //加载街道范围边界图层
    street_boundary(map,streetLayer);

    //街道各个社区边界图层
    var streetCommunityLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 13,
        fitView: true,
        eventSupport:true,
    });
    //街道管控单元边界图层
    var streetControlUnitLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 14,
        fitView: true,
        eventSupport:true,
    });
    //街道现状用地图层
    var streetCurrentSituationLandLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 15,
        fitView: true,
        eventSupport:true,
    });
    //街道道路图层
    var streetRoadLandLayer = new Loca.LineLayer({
        map: map,
        zIndex: 16,
        fitView: true,
        eventSupport:true,
    });


    $("#map-features input").each(function(i){
        $(this).click(function(){
            if(this.checked){
                if($(this).val() === "boundary"){
                    street_community_boundary(map,streetCommunityLayer);
                }else if($(this).val() === "real_time_traffic"){
                    trafficLayer.setMap(map);
                    trafficLayer.show();
                }else if($(this).val() === "land"){
                    street_current_situation_land(map,streetCurrentSituationLandLayer)
                }else if($(this).val() === "control_unit"){
                    street_control_unit_boundary (map,streetControlUnitLayer)
                }else if($(this).val() === "road"){
                    street_road (map,streetRoadLandLayer)
                }
            }else{
                if($(this).val() === "boundary"){
                    streetCommunityLayer.hide();
                }else if($(this).val() === "real_time_traffic"){
                    trafficLayer.hide();
                }else if($(this).val() === "land"){
                    streetCurrentSituationLandLayer.hide()
                }else if($(this).val() === "control_unit"){
                    streetControlUnitLayer.hide();
                }else if($(this).val() === "road"){
                    streetRoadLandLayer.hide();
                }
            }
        })
    });
}
// 街道区域边界图层
function street_boundary (map,layer){
    // var colors = ['#13EFDC', '#73D9E3', '#0FF5E1', '#C7EEE3'];
    $.get('https://a.amap.com/Loca/static/mock/bj_district_wkt.json', function (data) {
        // layer.on('click', function (ev) {
        //     // 事件类型
        //     var type = ev.type;
        //     // 当前元素的原始数据
        //     var rawData = ev.rawData;
        //     // 原始鼠标事件
        //     var originalEvent = ev.originalEvent;

        //     openInfoWin(map, originalEvent, {
        //         '名称': rawData.name,
        //         '位置': rawData.center
        //     });
        // });
        layer.setData(beixinqiao_subdistict_data, {
            lnglat: 'coordinates'
        });

        var idx = 0;
        layer.setOptions({
            style: {
                height: function () {
                    return Math.random() * 20000;
                },
                opacity: 0.2,
                color:"#3ba0f3",
                // color: function () {
                //     return colors[idx++ % colors.length];
                // }
            },
            // selectStyle:{
            //     color:"#13EFDC",
            // }
        });
        layer.render();
    }); 
}
// 街道各个社区边界图层
function street_community_boundary (map,layer){
    var colors = ['#13EFDC', '#73D9E3', '#0FF5E1', '#C7EEE3'];
    $.get('https://a.amap.com/Loca/static/mock/bj_district_wkt.json', function (data) {
        layer.on('click', function (ev) {
            // 事件类型
            var type = ev.type;
            // 当前元素的原始数据
            var rawData = ev.rawData;
            // 原始鼠标事件
            var originalEvent = ev.originalEvent;

            openInfoWin(map, originalEvent, {
                '名称': rawData.name+"社区",
                // '位置': rawData.center
            });
        });
        layer.setData(beixinqiao_community_data, {
            lnglat: 'coordinates'
        });

        var idx = 0;
        layer.setOptions({
            style: {
                height: function () {
                    return Math.random() * 20000;
                },
                opacity: 0.8,
                color: function () {
                    return colors[idx++ % colors.length];
                }
            },
            selectStyle:{
                color:"#3ba0f3",
            }
        });
        layer.render();
        layer.show()
    }); 
}
// 街道管控单元边界图层
function street_control_unit_boundary (map,layer){
    var colors = ['#13EFDC', '#73D9E3', '#0FF5E1', '#C7EEE3'];
    $.get('https://a.amap.com/Loca/static/mock/bj_district_wkt.json', function (data) {
        layer.on('click', function (ev) {
            // 事件类型
            var type = ev.type;
            // 当前元素的原始数据
            var rawData = ev.rawData;
            // 原始鼠标事件
            var originalEvent = ev.originalEvent;

            openInfoWin(map, originalEvent, {
                '名称': rawData.name+"社区",
                // '位置': rawData.center
            });
        });
        layer.setData(control_unit_data, {
            lnglat: 'coordinates'
        });

        var idx = 0;
        layer.setOptions({
            style: {
                height: function () {
                    return Math.random() * 20000;
                },
                opacity: 0.8,
                color: function () {
                    return colors[idx++ % colors.length];
                }
            },
            selectStyle:{
                color:"#3ba0f3",
            }
        });
        layer.render();
        layer.show()
    }); 
}
//街道现状用地图层
function street_current_situation_land(map,layer){
    var colors = ["#A900E6", "#FF0000", "#0084A8", "#FFFF00", "#730000", "#9C9C9C","#FFAA00", 
        "#FF73DF", "#FF7F7F", "#004C73", '#00FFFF', "#00A884", "#4E4E4E", "#005CE6", "#73DFFF","#4C0073", "#fff"];
    layer.setData(current_situation_land_data, {
        lnglat: 'lnglat'
    });

    layer.setOptions({
        style: {
            // opacity: 0.5,
            color: function (res) {
                var land_name = res.value.name;
                var color = colors[0];
                switch (land_name){
                    case "宗教用地" :
                        color = colors[0];
                        break;
                    case "商业用地" :
                        color = colors[1];
                        break;
                    case "科研用地" :
                        color = colors[2];
                        break;
                    case "居住用地" :
                        color = colors[3];
                        break;
                    case "商务用地" :
                        color = colors[4];
                        break;
                    case "交通设施用地" :
                        color = colors[5];
                        break;
                    case "行政办公用地" :
                        color = colors[6];
                        break;
                    case "社区服务用地" :
                        color = colors[7];
                        break;
                    case "基础教育用地" :
                        color = colors[8];
                        break;
                    case "公用设施用地" :
                        color = colors[9];
                        break;
                    case "公建混合用地" :
                        color = colors[10];
                        break;
                    case "社会福利用地" :
                        color = colors[11];
                        break;
                    case "外事用地" :
                        color = colors[12];
                        break;
                    case "医疗卫生用地" :
                        color = colors[13];
                        break;
                    case "高等院校用地" :
                        color = colors[14];
                        break;
                    case "文物古迹用地" :
                        color = colors[15];
                        break;
                    case "待研究用地" :
                        color = colors[16];
                        break;
                    default:
                        color = colors[0];
                }
                return color;
            },
            height: function () {
                return Math.random() * 500 + 100;
            }
        }
    });

    layer.render();
    layer.show();
}
//街道道路图层
function street_road(map,layer){
    layer.setData(beixinqiao_road_data, {
        lnglat: 'lnglat'
    });
    layer.setOptions({
        style: {
            color: "#F8F735",
            height: function () {
                return Math.random() * 500 + 100;
            }
        }
    });

    layer.render();
    layer.show();
}
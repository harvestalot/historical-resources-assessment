
var streetLayer;
var streetCommunityLayer;
var streetCommunityAreaLayer;
var handle_community_introduction;
var streetControlUnitLayer;
var streetCurrentSituationLandLayer;
var streetRoadLandLayer;
var layerLabels;
function load_map(mapId){
    map.on('mapload', function () {
        map.getMap().plugin(['AMap.ControlBar'], function () {
            var controlBar = new AMap.ControlBar();
            map.getMap().addControl(controlBar);
        });
    });
    // //实时路况图层
    // trafficLayer = new AMap.TileLayer.Traffic({
    //     zIndex: 11
    // });
    //街道区域边界图层
    streetLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 12,
        // fitView: true,
        eventSupport:false,
    });
    //街道各个社区边界图层
    streetCommunityLayer = new Loca.LineLayer({
        map: map,
        zIndex: 13,
        // fitView: true,
        eventSupport:true,
    });
    //街道各个社区区域面图层
    streetCommunityAreaLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 14,
        // fitView: true,
        eventSupport:true,
    });
    //街道管控单元边界图层
    streetControlUnitLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 14,
        // fitView: true,
        eventSupport:true,
    });
    //街道现状用地图层
    streetCurrentSituationLandLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 15,
        // fitView: true,
        eventSupport:true,
    });
    //街道道路图层
    streetRoadLandLayer = new Loca.LineLayer({
        map: map,
        zIndex: 16,
        // fitView: true,
        eventSupport:true,
    });
    //社区名字文字图层
    layerLabels = new Loca.LabelsLayer({
        // fitView: true,
        map: map,
        collision: true
    });

    //默认加载街道范围边界、社区边界图层
    street_boundary(map,streetLayer);
    street_community_boundary(map,streetCommunityLayer,streetCommunityAreaLayer,layerLabels);

    $("#map-features input").each(function(i){
        $(this).click(function(){
            if(this.checked){
                if($(this).val() === "boundary"){
                    street_community_boundary(map, streetCommunityLayer,streetCommunityAreaLayer, layerLabels);
                }else if($(this).val() === "real_time_traffic"){
                    // trafficLayer.setMap(map);
                    // trafficLayer.show();
                }else if($(this).val() === "land"){
                    street_current_situation_land(map,streetCurrentSituationLandLayer)
                    map_legend(current_land_legend_data);
                }else if($(this).val() === "control_unit"){
                    street_control_unit_boundary (map,streetControlUnitLayer,layerLabels)
                }else if($(this).val() === "road"){
                    street_road (map,streetRoadLandLayer)
                }
            }else{
                if($(this).val() === "boundary"){
                    // streetCommunityLayer?map.remove(streetCommunityLayer):"";
                    // streetCommunityAreaLayer?map.remove(streetCommunityAreaLayer):"";
                    // layerLabels?map.remove(layerLabels):"";
                    streetCommunityLayer.hide();
                    streetCommunityAreaLayer.hide();
                    streetCommunityAreaLayer.off("click",handle_community_introduction);
                    layerLabels.hide();
                }else if($(this).val() === "real_time_traffic"){
                    // trafficLayer.hide();
                }else if($(this).val() === "land"){
                    streetCurrentSituationLandLayer?map.remove(streetCurrentSituationLandLayer):"";
                    // streetCurrentSituationLandLayer.hide();
                    $("#map_legend").fadeOut(300);
                }else if($(this).val() === "control_unit"){
                    streetControlUnitLayer?map.remove(streetControlUnitLayer):"";
                    layerLabels?map.remove(layerLabels):"";
                    // streetControlUnitLayer.hide();
                    // layerLabels.hide();
                }else if($(this).val() === "road"){
                    streetCommunityLayer?map.remove(streetCommunityLayer):"";
                    // streetRoadLandLayer.hide();
                }
            }
        })
    });
}
// 街道区域边界图层
function street_boundary (map,layer){
    // var colors = ['#13EFDC', '#73D9E3', '#0FF5E1', '#C7EEE3'];
    $.get(file_server_url+'beixinqiao_subdistrict.js', function (beixinqiao_subdistict_data) {
        layer.setData(JSON.parse(Decrypt(beixinqiao_subdistict_data)), {
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
function street_community_boundary (map,layer, streetCommunityAreaLayer, layerLabels){//
    var colors = ["#3ba0f3",'#ff9921',"#00FFFF",'#E0F319',"#DE61FA",
        "#3A8281","#00FF59","#EA376F","#BFEA37","#EAB437","#EA6F37","#37EA37"];
    $.get(file_server_url+'beixinqiao_community.js', function (beixinqiao_community_data) {
        var datas = [
            {
                name:"北官厅",
                lnglat:[116.426256, 39.949192]
            },
            {
                name:"民安",
                lnglat:[116.428959, 39.944617]
            },
            {
                name:"北新仓",
                lnglat:[116.428552, 39.939576]
            },
            {
                name:"海运仓",
                lnglat:[116.427655, 39.935208]
            },
            {
                name:"青龙",
                lnglat:[116.423004, 39.947672]
            },
            {
                name:"藏经馆",
                lnglat:[116.417152, 39.94789]
            },
            {
                name:"前永康",
                lnglat:[116.417825, 39.943566]
            },
            {
                name:"九道湾",
                lnglat:[116.417643, 39.940019]
            },
            {
                name:"草园",
                lnglat:[116.418024, 39.941818]
            },
            {
                name:"门楼",
                lnglat:[116.419486, 39.935441]
            },
            {
                name:"十三条",
                lnglat:[116.419456, 39.93689]
            },
            {
                name:"小菊",
                lnglat:[116.4234, 39.940235]
            },
        ] 
        layer.setData(JSON.parse(Decrypt(beixinqiao_community_data)), {
            lnglat: 'coordinates'
        });

        var idx = 0;
        layer.setOptions({
            style: {
                height: function () {
                    return Math.random() * 20000;
                },
                opacity: 0.8,
                color:"#044608",
                // color: function () {
                //     return colors[idx++];
                // }
            },
            // selectStyle:{
            //     opacity:1,
            //     color:"#3A8281",
            // }
        });
        layer.render();
        layer.show();
        //社区区域面图层
        streetCommunityAreaLayer.setData(JSON.parse(Decrypt(beixinqiao_community_data)), {
            lnglat: 'coordinates'
        });
        streetCommunityAreaLayer.setOptions({
            style: {
                opacity: 0,
                color:"#3ba0f3",
            },
            selectStyle:{
                opacity:1,
                color:"#3A8281",
            }
        });
        streetCommunityAreaLayer.render();
        streetCommunityAreaLayer.show();
        handle_community_introduction = function(ev){
            //渲染信息窗体
            openInfo(community_introduction[ev.rawData.name].info, "", community_introduction[ev.rawData.name].lnglat);
            if(population_bar_chart){
                var population_bar_yAxis_data = population_bar_chart.getOption().yAxis[0].data;
                var dataIndex = 0;
                for(var i = 0; i < population_bar_yAxis_data.length; i++){
                    population_bar_yAxis_data[i] === ev.rawData.name? (dataIndex = i):"";
                }
                population_bar_chart.dispatchAction({
                    type: 'showTip',
                    seriesIndex:0,
                    dataIndex: dataIndex
                }); 
            }
        }
        streetCommunityAreaLayer.on('click',handle_community_introduction);
        // streetCommunityAreaLayer.on('click', function (ev) {
        //     //渲染信息窗体
        //     openInfo(community_introduction[ev.rawData.name].info, "", community_introduction[ev.rawData.name].lnglat);
        //     if(population_bar_chart){
        //         var population_bar_yAxis_data = population_bar_chart.getOption().yAxis[0].data;
        //         var dataIndex = 0;
        //         for(var i = 0; i < population_bar_yAxis_data.length; i++){
        //             population_bar_yAxis_data[i] === ev.rawData.name? (dataIndex = i):"";
        //         }
        //         population_bar_chart.dispatchAction({
        //             type: 'showTip',
        //             seriesIndex:0,
        //             dataIndex: dataIndex
        //         }); 
        //     }
        // });
        //添加文字标记图层
        layerLabels.setData(datas, {
            lnglat: 'lnglat'
        }).setOptions({
            style: {
                direction: 'center',
                offset: [0, 0],
                text: function (item) {
                    return item.value.name;
                },
                fillColor: "#F319A0",
                fontSize: 18,
                strokeWidth: 0
            }
        }).render();
        layerLabels.setzIndex(100);
        layerLabels.show();
        
    }); 
}
// 街道管控单元边界图层
function street_control_unit_boundary (map,layer,layerLabels){
    var colors = ["#3ba0f3",'#ff9921',"#00FFFF",'#E0F319',"#DE61FA"];
    $.get(file_server_url+ 'control_unit.js', function (control_unit_data) {
        var datas = [
            {
                name:"簋街单元",
                lnglat:[116.419431, 39.941022]
            },
            {
                name:"雍和宫单元",
                lnglat:[116.421246, 39.945955]
            },
            {
                name:"民安单元",
                lnglat:[116.427701, 39.944497]
            },
            {
                name:"北新仓单元",
                lnglat:[116.428552, 39.939576]
            },
            {
                name:"新太仓单元",
                lnglat:[116.418891, 39.937131]
            },
        ] 
        layer.setData(JSON.parse(Decrypt(control_unit_data)), {
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
                    return colors[idx++];
                }
            },
            selectStyle:{
                color:"#3ba0f3",
            }
        });
        layer.render();
        layer.show()
        //添加文字标记图层
        layerLabels.setData(datas, {
            lnglat: 'lnglat'
        }).setOptions({
            style: {
                direction: 'center',
                offset: [0, 0],
                text: function (item) {
                    return item.value.name;
                },
                fillColor: "#1a9850",
                fontSize: 18,
                strokeWidth: 0
            }
        }).render();
        layerLabels.setzIndex(100);
        layerLabels.show();
    }); 
}
//街道现状用地图层
function street_current_situation_land(map,layer){
    var colors = ["#A900E6", "#FF0000", "#0084A8", "#FFFF00", "#730000", "#9C9C9C","#FFAA00", 
        "#FF73DF", "#FF7F7F", "#004C73", '#00FFFF', "#00A884", "#4E4E4E", "#005CE6", "#73DFFF",
        "#4C0073", "#fff"];
    $.get(file_server_url+ 'current_situation_land.js', function (current_situation_land_data) {
        layer.setData(JSON.parse(Decrypt(current_situation_land_data)), {
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

    })
}
//街道道路图层
function street_road(map,layer){
    $.get(file_server_url+ 'road.js', function (beixinqiao_road_data) {
        layer.setData(JSON.parse(Decrypt(beixinqiao_road_data)), {
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
    })
}
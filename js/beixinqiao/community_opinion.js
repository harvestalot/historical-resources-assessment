//社区舆情
function CommunityOpinion(){
    this.community_opinion_type = ["道路交通","房屋土地","服务项目","公共设施","公共卫生类","街面秩序","扩展事件","垃圾不落地",
    "垃圾分类","劳动与社会保障","矛盾纠纷","社会安全类","社会面防控","社会事业","社会治安","施工管理","市容环境",
    "市容设施","事故灾难类","特殊行业监管","特种行业","突发事件","宣传广告","园林绿化","自然灾害类"];
    this.type_heatmap_data = [];
	
}
CommunityOpinion.prototype.init = function(){
    this.load_dom();
    var _this = this;
    // serveRequest("get", server_url+ "/lawCase/getBigType",{ },function(result){
    // });
    serveRequest("get", server_url+ "/lawCase/getListByBigType",{ bigType:"道路交通" },function(result){
        _this.get_view_data(result.data.resultKey);
    });
    $("#community_opinion_select").on("change",function(){
        var type_name = $(this).children('option:selected').val();
        serveRequest("get", server_url+ "/lawCase/getListByBigType",{ bigType: type_name },function(result){
            _this.get_view_data(result.data.resultKey);
        });
    });
}
//生产dom元素
CommunityOpinion.prototype.load_dom = function(){
    var community_opinion_select_str = "";
    for(var i = 0; i < this.community_opinion_type.length; i++){
        if(i === 0){
            community_opinion_select_str += '<option value='+this.community_opinion_type[i]+' selected="selected">'+this.community_opinion_type[i]+'</option>';
        }else{
            community_opinion_select_str += '<option value='+this.community_opinion_type[i]+'>'+this.community_opinion_type[i]+'</option>';
        }
    }
    $("#community_opinion_select").html(community_opinion_select_str);
};
//分类拆分数据
CommunityOpinion.prototype.get_view_data = function(result_data){
    this.type_heatmap_data = [];
    for(var i = 0; i < result_data.length; i++){
        var item = result_data[i];
        this.type_heatmap_data.push({
            value: item.TOTAL_NUMBER,
            lnglat:wgs84togcj02(item.LONGITUDE, item.LATITUDE),
        })
    }
    this.load_heatmap_layer();
}
//加载热力图图层
CommunityOpinion.prototype.load_heatmap_layer = function(current_year){
    heatmapLayer? map.remove(heatmapLayer):"";//清除热力图图层
    heatmapLayer = new Loca.HeatmapLayer({
        map: map,
    });
    heatmapLayer.setData(this.type_heatmap_data, {
        lnglat: 'lnglat',
        value: 'value'
    });
    heatmapLayer.setOptions({
        style: {
            radius: 30,
            color: {
                0.5: '#2c7bb6',
                0.65: '#abd9e9',
                0.7: '#ffffbf',
                0.9: '#fde468',
                1.0: '#d7191c',
                // 0.8: '#2c7bb6',
                // 0.95: "#FDEEA2",
                // 1.0: "#F80E00"
            },
            // opacity:[0.1,0.3]
        }
    });

    heatmapLayer.render();
    heatmapLayer.show();
}

var start_community_opinion_rendering = new CommunityOpinion();
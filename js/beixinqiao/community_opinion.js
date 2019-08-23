//社区舆情
function CommunityOpinion(){
    this.community_opinion_type = ["道路交通","房屋土地","服务项目","公共设施","公共卫生类","街面秩序","扩展事件","垃圾不落地",
    "垃圾分类","劳动与社会保障","矛盾纠纷","社区安全类","社会面防控","社会事业","社会治安","施工管理","市容环境",
    "市容设施","事故灾难类","特殊行业监管","特种行业","突发事件","宣传广告","园林绿化","自然灾害类"];
	
}
CommunityOpinion.prototype.init = function(){
    this.load_dom();
	this.load_heatmap_layer("2016");
    var _this = this;
    $("#community_opinion_select").on("change",function(){
        var index = $(this).children('option:selected').val() * 1;
        // _this.pio_type = _this.all_poi_type[index]
        // _this.load_poi_point();
    });
}
//生产dom元素
CommunityOpinion.prototype.load_dom = function(){
    var community_opinion_select_str = "";
    for(var i = 0; i < this.community_opinion_type.length; i++){
        if(i === 0){
            community_opinion_select_str += '<option value='+i+' selected="selected">'+this.community_opinion_type[i]+'</option>';
        }else{
            community_opinion_select_str += '<option value='+i+'>'+this.community_opinion_type[i]+'</option>';
        }
    }
    $("#community_opinion_select").html(community_opinion_select_str);
};
//加载热力图图层
CommunityOpinion.prototype.load_heatmap_layer = function(current_year){
    heatmapLayer = new Loca.HeatmapLayer({
        map: map,
    });
    heatmapLayer.setData(visitors_flow_rate_data, {
        lnglat: 'lnglat',
        value: current_year === "2016"?'count_2016':( current_year === "2017"?'count_2017':'count_2018')
    });
    heatmapLayer.setOptions({
        style: {
            radius: 30,
            color: {
                0.8: '#2c7bb6',
                0.95: "#FDEEA2",
                1.0: "#F80E00"
            },
            opacity:[0.1,0.5]
        }
    });

    heatmapLayer.render();
    heatmapLayer.show();
}

var start_community_opinion_rendering = new CommunityOpinion();
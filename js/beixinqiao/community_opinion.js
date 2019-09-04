//社区舆情
function CommunityOpinion(){
    this.community_opinion_type = ["道路交通","房屋土地","服务项目","公共设施","公共卫生类","街面秩序","扩展事件","垃圾不落地",
    "垃圾分类","劳动与社会保障","矛盾纠纷","社会安全类","社会面防控","社会事业","社会治安","施工管理","市容环境",
    "市容设施","事故灾难类","特殊行业监管","特种行业","突发事件","宣传广告","园林绿化","自然灾害类"];
    this.type_heatmap_data = [];
    this.ranking_list_data = {};
	
}
CommunityOpinion.prototype.init = function(){
    this.load_dom();
    var _this = this;
    serveRequest("get", server_url+ "/lawCase/getListByBigType",{ bigType:"道路交通" },function(result){
        _this.get_view_data(JSON.parse(Decrypt(result.data.resultKey)));
    });
    serveRequest("get", server_url+ "/lawCase/getTopByType",{ },function(result){
        console.log(JSON.parse(Decrypt(result.data.resultKey)))
        _this.ranking_list_data = JSON.parse(Decrypt(result.data.resultKey));
        _this.render_spectaculars_list();
    });
    // $("#community_opinion_select").on("change",function(){
    //     var type_name = $(this).children('option:selected').val();
    //     serveRequest("get", server_url+ "/lawCase/getListByBigType",{ bigType: type_name },function(result){
    //         _this.get_view_data(JSON.parse(Decrypt(result.data.resultKey)));
    //     });
    // });
     $('[name="nice-select"]').click(function(e){

            $('[name="nice-select"]').find('ul').hide();

            $(this).find('ul').show();

            e.stopPropagation();

        });

        $('[name="nice-select"] li').hover(function(e){

            $(this).toggleClass('on');

            e.stopPropagation();

        });

        $('[name="nice-select"] li').click(function(e){

            var val = $(this).text();

            $(this).parents('[name="nice-select"]').find('input').val(val);

            $('[name="nice-select"] ul').hide();

            e.stopPropagation();

            var type_name = $(this).attr("data-value");
            serveRequest("get", server_url+ "/lawCase/getListByBigType",{ bigType: type_name },function(result){
                _this.get_view_data(JSON.parse(Decrypt(result.data.resultKey)));
            });

        });

        $(document).click(function(){

            $('[name="nice-select"] ul').hide();

        });
}
//生产dom元素
CommunityOpinion.prototype.load_dom = function(){
    var community_opinion_select_str = "";
    for(var i = 0; i < this.community_opinion_type.length; i++){
        if(i === 0){
            community_opinion_select_str += '<li data-value='+this.community_opinion_type[i]+'>'+this.community_opinion_type[i]+'</li>';
        }else{
            community_opinion_select_str += '<li data-value='+this.community_opinion_type[i]+'>'+this.community_opinion_type[i]+'</li>';
        }
    }
    $("#community_opinion_select").html(community_opinion_select_str);
    var public_service_dom_str = '<p style="padding:10px 0 10px 12px;font-size:14px;color:#fff;font-weight:700;">各类型的案件看板</p>'+
    '<div id="ranking_list_content" class="chart_view ranking_list_content" style="width: 100%; height: 90%;overflow-y: auto;"></div>'+
    '<p  class="c_fff" style="padding-left:12px">说明：仅列出同类案件类型中，数量前三的社区。</p>';
    $("#visualization_echarts_content").append(public_service_dom_str);
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
            radius: 50,
            color: {
                0.5: '#2c7bb6',
                0.65: '#abd9e9',
                0.8: '#abd9e9',
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

//渲染看板列表DOM元素
CommunityOpinion.prototype.render_spectaculars_list = function(){
    var str = '';
    for(var key in this.ranking_list_data){
        var item = this.ranking_list_data[key];
        str += '<p><span title='+key+'>'+key.slice(0,4)+'</span>';
        for(var i = 0; i < item.length; i++){
            str += '<span>'+item[i].COMMUNITY_NAME+'&nbsp;&nbsp;'+(item[i]["COUNT_NUMBER/TOTAL"]*100).toFixed(2)+'%</span>';
        }
        str += '</p>';
    }    
    $("#ranking_list_content").html(str);
}
var start_community_opinion_rendering = new CommunityOpinion();
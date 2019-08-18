//街区活力监测--人流量监测
function VisitorsFlowRate(){
	
}
VisitorsFlowRate.prototype.init = function(){
    // this.load_dom();
	this.load_heatmap_layer("2016");
    var _this = this;
    $("#year_switcher a").on("click",function(){
        $(this).addClass("checked_active").siblings("a").removeClass("checked_active");
        _this.load_heatmap_layer($(this).attr("data_year"));
    });
}
//生产dom元素
// VisitorsFlowRate.prototype.load_dom = function(){
//     const visitors_dom_str = '<div id="year_switcher" class="clearfix year_switcher" style="width: 100%; height: 100%;">'+
//         '<a href="javascript:void(0)" class="checked_active" data_year="2016">2016年</a>'+
//         '<a href="javascript:void(0)" data_year="2017">2017年</a>'+
//         '<a href="javascript:void(0)" data_year="2018">2018年</a>'+
//         '</div>';
//     $("#visualization_echarts_content").append(visitors_dom_str);
// };
//加载热力图图层
VisitorsFlowRate.prototype.load_heatmap_layer = function(current_year){
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
                    // 0.5: '#2c7bb6',
                    // 0.65: '#abd9e9',
                    // 0.7: '#ffffbf',
                    // 0.9: '#fde468',
                    // 1.0: '#d7191c'
                        0.8: '#2c7bb6',
                        0.95: "#FDEEA2",
                        1.0: "#F80E00"
                },
                opacity:[0.1,0.5]
            }
        });

        heatmapLayer.render();
}

var start_visitors_flow_rate_rendering = new VisitorsFlowRate();
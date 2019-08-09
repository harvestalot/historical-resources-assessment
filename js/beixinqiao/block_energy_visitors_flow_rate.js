//街区活力监测--人流量监测
function VisitorsFlowRate(){
	
}
VisitorsFlowRate.prototype.init = function(){
	this.load_heatmap_layer();
}
//加载热力图图层
VisitorsFlowRate.prototype.load_heatmap_layer = function(){
	heatmapLayer = new Loca.HeatmapLayer({
        map: map,
    });

    heatmapLayer.setData(visitors_flow_rate_data, {
        lnglat: 'lnglat',
        value: 'count_2017'
    });

    heatmapLayer.setOptions({
        style: {
            radius: 30,
            color: {
                0.5: '#2c7bb6',
                0.65: '#abd9e9',
                0.7: '#ffffbf',
                0.9: '#fde468',
                1.0: '#d7191c'
            }
        }
    });

    heatmapLayer.render();
}

var start_visitors_flow_rate_rendering = new VisitorsFlowRate();
//文化资源--概览
function CulturalResourcesOverview(){
	this.legend_data = ["物质文化遗产","文物保护的那位","历史建筑"];
	this.cultural_resources_data = [];
	this.bar_series_data = [];
}
CulturalResourcesOverview.prototype.init = function(){
	var _this = this;
	_this.load_dom();
	serveRequest("get", server_url+ "/PopulationInfo/getPopulationInfo",{},function(result){
		const population_data = result.data.resultKey;
		_this.cultural_resources_data = population_data;
		_this.load_bar_chart();
	});
}
//分类拆分数据
CulturalResourcesOverview.prototype.get_view_data = function(result_data){
	for(var i = 0; i < result_data.length; i++){
	}
}
//渲染dom元素
CulturalResourcesOverview.prototype.load_dom = function(){
    const cultural_resources_dom_str = '<div id="cultural_resources_overview_bar_content" style="width: 100%; height: 100%;"></div>';
    $("#visualization_echarts_content").append(cultural_resources_dom_str);
};
//柱状图渲染
CulturalResourcesOverview.prototype.load_bar_chart = function(){
	var cultural_resources_overview_bar_chart = echarts.init(document.getElementById("cultural_resources_overview_bar_content"));
	var seriesLabel = {
	    normal: {
	        show: true,
	        textBorderColor: '#333',
	        textBorderWidth: 2
	    }
	}
	var bar_option = {
        color: echarts_color,
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow'
	        }
	    },
	    legend: {
	    	top:10,
	    	textStyle:{
	    		color:"#FFF",
	    	},
	        data: this.legend_data
	    },
	    grid: {
	        left: 50
	    },
	    xAxis: {
	        type: 'value',
	        axisLabel: coordinate_axis_style.axisLabel,
	        axisLine: coordinate_axis_style.axisLine,
	        splitLine: coordinate_axis_style.splitLine,
	    },
	    yAxis: {
	        type: 'category',
	        axisLabel: coordinate_axis_style.axisLabel,
	        axisLine: coordinate_axis_style.axisLine,
	        splitLine: coordinate_axis_style.splitLine,
	        inverse: true,
	        data: [],
	    },
	    series: [
	        {
	            name: '户籍人口',
	            type: 'bar',
	            // label: seriesLabel,
	            data: [],
	        },
	        {
	            name: '常驻人口',
	            type: 'bar',
	            // label: seriesLabel,
	            data: []
	        },
	        {
	            name: '流动人口',
	            type: 'bar',
	            // label: seriesLabel,
	            data: []
	        }
	    ]
	};
	for(var i = 0; i < this.cultural_resources_data.length; i++){
		var item = this.cultural_resources_data[i];
		bar_option.yAxis.data.push(item.NAME); 
		bar_option.series[0].data.push(item.REGISTER); 
		bar_option.series[1].data.push(item.RESIDENT); 
		bar_option.series[2].data.push(item.FLOATING); 
	}
    cultural_resources_overview_bar_chart.setOption(bar_option, true);
}

var start_cultural_resources_overview_rendering = new CulturalResourcesOverview();
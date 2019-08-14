//各个社区名称
const community_name = ["北宫厅", "北新仓", "藏经馆", "草园", "海运仓", "九道湾",
	"门楼", "民安", "前永康", "青龙", "十三条", "小菊"];

//简介
const brief_introduction = {
	title:"北新桥街道简介",
	img_url:"./images/1.png",
	content: "北新桥街道（Beixinqiao Jiedao）位于北京市东城区东北部。辖区面积2.62平方千米，常住人口82273人（2010年）。"+
		"辖12个社区（2014年末）。境内有雍和宫、北新仓、柏林寺、通教寺、梁启超故居等名胜古迹。1955年设观音寺、瓦岔、羊管和东颂年4个小街道，"+
		"1958年并置为北新桥街道。1997年，面积2.2平方千米，人口8.2万，辖三条、二条、草园、戏楼、青龙、育树、北新、后永康、藏经馆、前永康、"+
		"雍大、炮局、南小街、北新仓、海运仓、西颂年、南顺、北弓、东内东、北门仓、南颂年、九道湾、板桥、小菊、新太仓、十四条、东内中、东内西、"+
		"东西北、罗车、十二条、十四东、十三条、十一条、门楼、大楼、北中街、北小街、民安、东羊管、东手帕、北顺、针线、侨办、勘察院、中研、东直门、"+
		"住宅合作社、民政局等50个居（家）委会。"
}

//片区历史发展图片
const district_history_img_data = {
    img_list:[
        './images/beixinqiao/h1.jpg',
        './images/beixinqiao/h2.jpg',
        './images/beixinqiao/h3.jpg',
        './images/beixinqiao/h4.jpg',
        './images/beixinqiao/h5.jpg',
        './images/beixinqiao/h6.jpg',
    ]
}
//历史资源发展图片
const resource_history_img_data = {
    img_list:[
        './images/beixinqiao/h6.jpg',
        './images/beixinqiao/h5.jpg',
        './images/beixinqiao/h4.jpg',
        './images/beixinqiao/h3.jpg',
        './images/beixinqiao/h2.jpg',
        './images/beixinqiao/h1.jpg',
    ]
}

// echarts颜色配置
const echarts_color = ["#3ba0f3",'#ff9921',"#00FFFF",'#E0F319',"#00FF59","#DE61FA","#3A8281"];
// 雷达图各类型颜色配置
const rader_color = [
	{
        type: "radar",
        symbol: "circle",
        symbolSize: 3,
        areaStyle: {
            normal: {
                color: "rgba(59,160,243, 1)"
            }
        },
        itemStyle:{
            color:'rgba(59,160,243, 1)',
            borderColor:'rgba(59,160,243, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(59,160,243, 1)",
                width: 1
            }
        },
	},
	{
        type: "radar",
        symbol: "circle",
        symbolSize: 3,
        areaStyle: {
            normal: {
                color: "rgba(255,153,33, 0.4)"
            }
        },
        itemStyle:{
            color:'rgba(255,153,33, 1)',
            borderColor:'rgba(255,153,33, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(255,153,33, 1)",
                width: 1
            }
        },
	},
	{
        type: "radar",
        symbol: "circle",
        symbolSize: 3,
        areaStyle: {
            normal: {
                color: "rgba(0,255,255, 0.4)"
            }
        },
        itemStyle:{
            color:'rgba(0,255,255, 1)',
            borderColor:'rgba(0,255,255, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(0,255,255, 1)",
                width: 1
            }
        },
	},
	{
        type: "radar",
        symbol: "circle",
        symbolSize: 3,
        areaStyle: {
            normal: {
                color: "rgba(224,243,25, 0.4)"
            }
        },
        itemStyle:{
            color:'rgba(224,243,25, 1)',
            borderColor:'rgba(224,243,25, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(224,243,25, 1)",
                width: 1
            }
        },
	},
	{
        type: "radar",
        symbol: "circle",
        symbolSize: 3,
        areaStyle: {
            normal: {
                color: "rgba(0,255,89, 0.4)"
            }
        },
        itemStyle:{
            color:'rgba(0,255,89, 1)',
            borderColor:'rgba(0,255,89, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(0,255,89, 1)",
                width: 1
            }
        },
	},
	{
        type: "radar",
        symbol: "circle",
        symbolSize: 3,
        areaStyle: {
            normal: {
                color: "rgba(222,97,250, 0.4)"
            }
        },
        itemStyle:{
            color:'rgba(222,97,250, 1)',
            borderColor:'rgba(222,97,250, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(222,97,250, 1)",
                width: 1
            }
        },
	},
	{
        type: "radar",
        symbol: "circle",
        symbolSize: 3,
        areaStyle: {
            normal: {
                color: "rgba(58,130,129, 0.4)"
            }
        },
        itemStyle:{
            color:'rgba(58,130,129, 1)',
            borderColor:'rgba(58,130,129, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(58,130,129, 1)",
                width: 1
            }
        },
	},
];


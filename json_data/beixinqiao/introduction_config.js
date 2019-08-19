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
//现状用地图例
const current_land_legend_data = {
    list:[
        {
            name:"宗教",
            legend_color:"#A900E6"
        },
        {
            name:"商业",
            legend_color:"#FF0000"
        },
        {
            name:"科研",
            legend_color:"#0084A8"
        },
        {
            name:"居住",
            legend_color:"#FFFF00"
        },
        {
            name:"商务",
            legend_color:"#730000"
        },
        {
            name:"交通设施",
            legend_color:"#9C9C9C"
        },
        {
            name:"行政办公",
            legend_color:"#FFAA00"
        },
        {
            name:"社区服务",
            legend_color:"#FF73DF"
        },
        {
            name:"基础教育",
            legend_color:"#FF7F7F"
        },
        {
            name:"公用设施",
            legend_color:"#004C73"
        },
        {
            name:"公建混合",
            legend_color:"#00FFFF"
        },
        {
            name:"社会福利",
            legend_color:"#00A884"
        },
        {
            name:"外事",
            legend_color:"#4E4E4E"
        },
        {
            name:"医疗卫生",
            legend_color:"#005CE6"
        },
        {
            name:"高等院校",
            legend_color:"#73DFFF"
        },
        {
            name:"文物古迹",
            legend_color:"#4C0073"
        },
        {
            name:"待研究用地",
            legend_color:"#fff"
        },
    ]
}
//产业发展企业图例
const industry_legend_data = {
    list:[
        {
            name:"租赁和商务服务业",
            legend_color:"#3ba0f3"
        },
        {
            name:"制造业",
            legend_color:"#ff9921"
        },
        {
            name:"公共管理、社会保障和社会组织",
            legend_color:"#00FFFF"
        },
        {
            name:"文化、体育和娱乐业",
            legend_color:"#E0F319"
        },
        {
            name:"金融业",
            legend_color:"#00FF59"
        },
        {
            name:"卫生和社会工作",
            legend_color:"#DE61FA"
        },
        {
            name:"教育",
            legend_color:"#3A8281"
        },
        {
            name:"居民服务、修理和其他服务业",
            legend_color:"#F51B04"
        },
        {
            name:"科学研究和技术服务业",
            legend_color:"#630B7C"
        },
        {
            name:"水利、环境和公共设施管理业",
            legend_color:"#C2B6F2"
        },
        {
            name:"交通运输、仓储和邮政业 ",
            legend_color:"#05534F"
        },
        {
            name:"信息传输、软件和信息技术服务业",
            legend_color:"#055317"
        },
        {
            name:"建筑业",
            legend_color:"#51C46C"
        },
        {
            name:"公共管理、社会保障和社会组织",
            legend_color:"#BFDC3F"
        },
        {
            name:"住宿和餐饮业",
            legend_color:"#C88A78"
        },
    ]
}
// echarts颜色配置
// const echarts_color = ["#3ba0f3",'#ff9921',"#00FFFF",'#E0F319',"#00FF59","#DE61FA","#3A8281"];
const echarts_color = ["#d66349",'#768189',"#f0993c",'#a57ec0',"#579dcb","#5cba89","#7758b0"];
// 雷达图各类型颜色配置
const rader_color = [
	{
        type: "radar",
        symbol: "circle",
        symbolSize: 3,
        areaStyle: {
            normal: {
                color: "rgba(214,99,73, 1)"
            }
        },
        itemStyle:{
            color:'rgba(214,99,73, 1)',
            borderColor:'rgba(214,99,73, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(214,99,73, 1)",
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
                color: "rgba(118,129,137, 0.4)"
            }
        },
        itemStyle:{
            color:'rgba(118,129,137, 1)',
            borderColor:'rgba(118,129,137, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(118,129,137, 1)",
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
                color: "rgba(240,153,60, 0.4)"
            }
        },
        itemStyle:{
            color:'rgba(240,153,60, 1)',
            borderColor:'rgba(240,153,60, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(240,153,60, 1)",
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
                color: "rgba(165,126,192, 0.4)"
            }
        },
        itemStyle:{
            color:'rgba(165,126,192, 1)',
            borderColor:'rgba(165,126,192, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(165,126,192, 1)",
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
                color: "rgba(87,157,203, 0.4)"
            }
        },
        itemStyle:{
            color:'rgba(87,157,203, 1)',
            borderColor:'rgba(87,157,203, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(87,157,203, 1)",
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
                color: "rgba(92,186,137, 0.4)"
            }
        },
        itemStyle:{
            color:'rgba(92,186,137, 1)',
            borderColor:'rgba(92,186,137, 0.3)',
            borderWidth:5,
        },
        lineStyle: {
            normal: {
                type: "dashed",
                color: "rgba(92,186,137, 1)",
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
                color: "rgba(119,88,176, 0.4)"
            }
        },
        itemStyle:{
            color:'rgba(119,88,176, 1)',
            borderColor:'rgba(119,88,176, 0.3)',
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


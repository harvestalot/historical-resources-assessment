//各个社区名称
var community_name = ["北宫厅", "北新仓", "藏经馆", "草园", "海运仓", "九道湾",
	"门楼", "民安", "前永康", "青龙", "十三条", "小菊"];

// 数据源出处
var data_origin = {
    home:"北新桥街道街区更新项目组",
    population: "北新桥街道办事处",
    overview:"北新桥街道办事处",
    convenience:"北新桥街道办事处",
    education:"北新桥街道办事处",
    medical:"北新桥街道办事处",
    recreation_sports:"北新桥街道办事处",
    traffic:"北新桥街道办事处",
    provide:"北新桥街道办事处",
    street_management:"北新桥街道办事处",
    industry_concentration:"高德地图",
    industry_development:"北新桥街道办事处",
    real_time_traffic:"高德地图",
    visitors_flow_rate:"百度",
    greenbelt:"中规院",
    public_space:"北新桥街道街区更新项目组",
    available_space:"北新桥街道街区更新项目组",
    culture_overview:"中规院",
    material_cultural_heritage:"中规院",
    historical_building:"中规院",
    community_opinion:"北新桥街道办事处",
}
//各社区简介
var community_introduction = {
    "北宫厅":{
        lnglat:[116.426256, 39.949192],
        info:"北官厅社区隶属于北京市东城区北新桥街道，坐落在北新桥街道的东北角。社区东起俄罗斯大使馆，西至东直门内北小街，南起民安街，北至北二环路。辖区面积0.2平方公里，有2条主要大街（安定门东大街、东内北小街）和1条胡同（北官厅胡同）。现有户籍人口2005户5819人，常住人口1920户5804人，其中流动人口921人。辖区内现有3处健身场所、12块共计1850平米自管绿地。",
    },
    "民安":{
        lnglat:[116.428959, 39.944617],
        info:"民安社区隶属于北京市东城区北新桥街道, 东起二环路沿线，西至北小街，南起东直门内大街，北至民安街。辖区面积0.4平方公里，有5条主要街巷（东扬威街、北小街、东内大街、北中街、民安街）和1条胡同（东羊管胡同）。现有户籍人口3426户9502人，常住人口3523户8054人，其中流动人口2430人。辖区内现有4处健身场所、20块共计8000平米自管绿地以及 3株古树名木。",
    },
    "北新仓":{
        lnglat:[116.428552, 39.939576],
        info:"北新仓社区隶属于北京市东城区北新桥街道, 东起东二环，西至东内南小街，南起海运仓胡同，北至东内大街。辖区面积0.3平方公里，有3条主要街巷（东内大街、东内南小街、东内南大街）和2条胡同（北新仓胡同、海运仓胡同）。现有户籍人口2433户8663人，常住人口1812户5164人，其中流动人口1100人。辖区内现有3处健身场所、6块共计500平米自管绿地以及 3株古树名木。",
    },
    "海运仓":{
        lnglat:[116.427655, 39.935208],
        info:"海运仓社区隶属于北京市东城区北新桥街道, 东起东二环，西至东直门南小街，南起平安大街，北至海运仓胡同。辖区面积0.26平方公里，有1条主要街巷（海运南里街）和5条胡同（海运仓胡同、南颂年胡同、北门仓胡同、仓夹道胡同、南小街胡同）。现有户籍人口2448户6923人，常住人口2613户7186人，其中流动人口1140人。辖区内现有2处健身场所、34块共计16089平米自管绿地以及 6株古树名木。",
    },
    "青龙":{
        lnglat:[116.423004, 39.947672],
        info:"青龙社区隶属于北京市东城区北新桥街道, 东起北小街，西至柏林胡同东端，南起永康胡同，北至北二环路。辖区面积0.3平方公里，有12条主要街巷（北小街、育树头条、育树二条、育树四条、北利民、炮局头条、炮局二条、炮局三条、炮局四条、后永康1巷、后永康2巷、后永康北巷）和5条胡同（育树胡同、青龙胡同、炮局胡同、后永康胡同、柏林胡同）。现有户籍人口3023户8455人，常住人口2095户5636人，其中流动人口1200人。辖区内现有3块共计800平米自管绿地以及 1株古树名木。",
    },
    "藏经馆":{
        lnglat:[116.417152, 39.94789],
        info:"藏经馆社区隶属于北京市东城区北新桥街道, 东起青龙胡同，西至雍和宫大街，南起戏楼胡同，北至北二环。辖区面积0.12平方公里，有4条主要街巷（戏楼一巷、戏楼二巷、雍和宫大街、安定门东大街）和3条胡同（ 戏楼胡同、柏林胡同、藏经馆胡同）。现有户籍人口1528户4001人，常住人口985户2735人，其中流动人口248人。辖区内现有2处健身场所、6块共计420平米自管绿地以及 10株古树名木。",
    },
    "前永康":{
        lnglat:[116.417825, 39.943566],
        info:"前永康社区隶属于北京市东城区北新桥街道，位于北新桥地区西北部。社区东起北小街西墙一线，西至雍大151号院西墙一线，南起三条62号内南墙一线，北至柏林胡同南墙一线。辖区面积0.15平方公里，有13条主要街巷（北新一巷、北新二巷、北新三巷、北新四巷、北新五巷、合作巷、前永康一巷、前永康二巷、前永康三巷、前永康四巷、前永康五巷、雍和宫大街、三条）和2条胡同（北新胡同、前永康胡同）。现有户籍人口2649户5930人，常住人口1908户4559人，其中流动人口796人。辖区内现有1块共计60平米自管绿地以及 2株古树名木。",
    },
    "九道湾":{
        lnglat:[116.417643, 39.940019],
        info:"九道湾社区隶属于北京市东城区北新桥街道，位于北新桥地区西南部。社区东起新太仓胡同，西至东四北大街，南起板桥胡同南口，北至东内大街。辖区面积0.205平方公里，有8条主要街巷（九道湾东巷、九道湾西巷、九道湾南巷、九道湾中巷、九道湾北巷、板桥南巷、东四北大街、东内大街）和4条胡同（石雀胡同、板桥胡同、西仓门胡同、八宝坑胡同）。现有户籍人口2028户5070人，常住人口1982户4862人，其中流动人口704人。辖区内现有1块共计60平米自管绿地。",
    },
    "草园":{
        lnglat:[116.418024, 39.941818],
        info:"草园社区隶属于北京市东城区北新桥街道, 东起东内北小街，西至雍和宫大街，南起东内大街，北至草园胡同。辖区面积0.17平方公里，有8条主要街巷（北新桥头条、北新桥二条、酱房东夹道、酱房西夹道、东直门内大街、东内北小街、雍和宫大街）和1条胡同（草园胡同）。现有户籍人口2529户6602人，常住人口1686户3465人，其中流动人口1203人。辖区内现有7块共计110平米自管绿地以及1株古树名木。",
    },
    "门楼":{
        lnglat:[116.419486, 39.935441],
        info:"门楼社区隶属于北京市东城区北新桥街道, 东起南小街39-161号，西至东四北大街145-199，南起东四十一条2-84号，北至门楼胡同3-55号、辛寺胡同1-51号。辖区面积0.25平方公里，有4条主要街巷（东四十一条、东四十二条、东四北大街、南小街 ）和3条胡同（辛寺胡同、横街胡同、门楼胡同）。现有户籍人口3090户7547人，常住人口2240户5840人，其中流动人口780人。辖区内现有1处健身场所以及5株古树名木。",
    },
    "十三条":{
        lnglat:[116.419456, 39.93689],
        info:"十三条社区隶属于北京市东城区北新桥街道, 东起东直门内南小街，西至东四北大街，南起东四十二条胡同，北至大菊胡同。辖区面积0.14平方公里，有3条主要街巷（十三、十四、横街）。现有户籍人口1770户4682人，常住人口1700户4135人，其中流动人口875人。辖区内现有1处健身场所以及 7株古树名木。",
    },
    "小菊":{
        lnglat:[116.4234, 39.940235],
        info:"小菊社区隶属于北京市东城区北新桥街道, 东起东直门南小街以西，西至新太仓胡同，南起十四条胡同以北，北至东内大街以南。 辖区面积0.205平方公里，有条主要街巷（ 新太仓一巷、新太仓二巷、东内南小街、东内大街）和条胡同（北沿沟胡同、大菊胡同、小菊胡同、新太仓胡同、罗车胡同）。现有户籍人口2596户6750人，常住人口1409户4725人，其中流动人口1303人。辖区内现有2株古树名木。",
    }
}
//简介
var brief_introduction = {
	title:"简介",
	img_url:[],
	content: "北新桥街道位于东城区东北部，东起东二环路，西至崇雍大街，南起平安大街，北至北二环路。辖区面积2.62平方公里，有5条主要大街，79条胡同。现有户籍人口28751户77593人，常住人口31293户86860人，其中流动人口21469人。辖12个社区，其中楼房社区4个、平房社区8个。有7处国家市区级文保单位（国家级的雍和宫，市级的柏林寺、通教寺、北新仓、四合院，区级的当铺旧址、慧照寺修建碑）、一条国际知名的餐饮特色街——簋街。辖区内现有4900平方米自管绿地及4349株自管树木（其中包括44株古树）。北护城河从雍和宫至东直门流过，全长1.57公里；辖区东北处有南馆公园一处，水域面积约5000平方米。"
}
//规划和目标
var planning_target = {
    title:"平台规划目标",
    img_url:["./images/beixinqiao/goal_programming_1.jpg", "./images/beixinqiao/goal_programming_2.jpg", "./images/beixinqiao/goal_programming_3.jpg", "./images/beixinqiao/goal_programming_4.jpg"],
    content: ""
}
//片区历史发展图片
var district_history_img_data = {
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
var resource_history_img_data = {
    img_list:[
        './images/beixinqiao/resource_history/1.jpg',
        './images/beixinqiao/resource_history/2.jpg',
        './images/beixinqiao/resource_history/3.jpg',
        './images/beixinqiao/resource_history/4.jpg',
        './images/beixinqiao/resource_history/5.jpg',
    ]
}
// echarts颜色配置
var echarts_color = ["#d66349",'#768189',"#f0993c",'#a57ec0',"#579dcb","#5cba89","#7758b0"];

//现状用地图例
var current_land_legend_data = {
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
//街道公共设施概览图例
var public_service_overview_legend_data = {
    list:[
        {
            name:"便民设施",
            legend_color:echarts_color[0]  
        },
        {
            name:"教育设施",
            legend_color:echarts_color[1]  
        },
        {
            name:"医疗设施",
            legend_color:echarts_color[2]  
        },
        {
            name:"文体设施",
            legend_color:echarts_color[3]  
        },
        {
            name:"交通设施",
            legend_color:echarts_color[4]  
        },
        {
            name:"养老设施",
            legend_color:echarts_color[5]  
        },
        {
            name:"街道管理设施",
            legend_color:echarts_color[6]  
        },
    ]
}
//街道公共设施--便民设施图例
var public_service_convenience_people_legend_data = {
    list:[
        {
            name:"超市",
            legend_color:echarts_color[0]  
        },
        {
            name:"便利店",
            legend_color:echarts_color[1]  
        },
        {
            name:"菜站",
            legend_color:echarts_color[2]  
        },
        {
            name:"综合服务站",
            legend_color:echarts_color[3]  
        }
    ]
}
//街道公共设施--教育设施图例
var public_service_education_legend_data = {
    list:[
        {
            name:"幼儿园",
            legend_color:echarts_color[0]  
        },
        {
            name:"小学",
            legend_color:echarts_color[1]  
        },
        {
            name:"中学",
            legend_color:echarts_color[2]  
        },
        {
            name:"九年一贯制",
            legend_color:echarts_color[3]  
        }
    ]
}
//街道公共设施--医疗设施图例
var public_service_medical_legend_data = {
    list:[
        {
            name:"医院",
            legend_color:echarts_color[0]  
        },
        {
            name:"社区卫生服务站",
            legend_color:echarts_color[1]  
        },
    ]
}
//街道公共设施--文体设施图例
var public_service_sports_legend_data = {
    list:[
        {
            name:"健身设施",
            legend_color:echarts_color[0]  
        },
        {
            name:"室内体育设施",
            legend_color:echarts_color[1]  
        },
        {
            name:"室外活动场所",
            legend_color:echarts_color[2]  
        },
        {
            name:"综合文体设施",
            legend_color:echarts_color[3]  
        },
        {
            name:"街道文化服务中心",
            legend_color:echarts_color[4]  
        }
    ]
}
//街道公共设施--交通设施图例
var public_service_traffic_legend_data = {
    list:[
        {
            name:"公交站",
            legend_color:echarts_color[0]  
        },
        {
            name:"地铁站",
            legend_color:echarts_color[1]  
        },
        {
            name:"停车场",
            legend_color:echarts_color[2]  
        },
    ]
}
//街道公共设施--养老设施图例
var public_service_provide_legend_data = {
    list:[
        {
            name:"社区机构养老设施",
            legend_color:echarts_color[0]  
        },
        {
            name:"社区助残服务中心",
            legend_color:echarts_color[1]  
        },
    ]
}
//街道公共设施--养老设施图例
var public_service_street_legend_data = {
    list:[
        {
            name:"社区服务管理用房",
            legend_color:echarts_color[0]  
        },
        {
            name:"社区服务中心",
            legend_color:echarts_color[1]  
        },
        {
            name:"街道办事处",
            legend_color:echarts_color[2]  
        },
        {
            name:"派出所",
            legend_color:echarts_color[3]  
        },
    ]
}

//公共空间评估--公共空间共享图例
var public_space_share_legend_data = {
    list:[
        {
            name:"底层空间公共化区域",
            legend_color:echarts_color[0]  
        },
        {
            name:"公共空间共享",
            legend_color:echarts_color[1]  
        },
        {
            name:"文创产业鼓励区域",
            legend_color:echarts_color[2]  
        },
        {
            name:"社区服务共享区域",
            legend_color:echarts_color[3]  
        },
    ]
}
//产业发展企业图例
var industry_legend_data = {
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
//历史建筑图例
var historical_building_legend_data = {
    list:[
        {
            name:"故居",
            legend_color:echarts_color[0]  
        },
        {
            name:"寺庙宫观",
            legend_color:echarts_color[1]  
        },
        {
            name:"王府",
            legend_color:echarts_color[2]  
        },
        {
            name:"使馆",
            legend_color:echarts_color[3]  
        },
        {
            name:"官署",
            legend_color:echarts_color[4]  
        },
        {
            name:"古树名木",
            legend_color:echarts_color[5]  
        },
    ]
}
//文化资源概览图例
var cultural_resources_overview_legend_data = {
    list:[
        {
            name:"故居",
            legend_color:echarts_color[0]  
        },
        {
            name:"寺庙宫观",
            legend_color:echarts_color[1]  
        },
        {
            name:"王府",
            legend_color:echarts_color[2]  
        },
        {
            name:"使馆",
            legend_color:echarts_color[3]  
        },
        {
            name:"官署",
            legend_color:echarts_color[4]  
        },
        {
            name:"古树名木",
            legend_color:echarts_color[5]  
        },
        {
            name:"文化遗产",
            legend_color:echarts_color[6]  
        },
    ]
}
//文化遗迹
var cultural_heritage_legend_data = {
    list:[
        {
            name:"国家级",
            legend_color:echarts_color[2]  
        },
        {
            name:"市级",
            legend_color:echarts_color[4]  
        },
        {
            name:"区级",
            legend_color:echarts_color[3]  
        },
        {
            name:"普查登记",
            legend_color:echarts_color[1]  
        },
        {
            name:"其他",
            legend_color:echarts_color[0]  
        },
    ]
}
//公共空间资源图例
var available_space_legend_data = {
    list:[
        {
            name:"可统一调配公共服务设施单元",
            legend_color:echarts_color[0]
        },
        {
            name:"意向腾退文物地",
            legend_color:echarts_color[4]
        },
        {
            name:"已收回直管公房",
            legend_color:echarts_color[5]
        },
        {
            name:"产权不明空地",
            legend_color:echarts_color[3]
        },
        {
            name:"地下空间",
            legend_color:echarts_color[1]
        },
    ]
}
//图表title
var echart_title = {
    left:10,
    top:10,
    textStyle:{
        color: '#fff',
        fontSize: 15
    }
}
// 雷达图各类型颜色配置
var rader_color = [
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


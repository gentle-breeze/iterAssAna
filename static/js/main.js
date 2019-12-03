var graph;
var x0 = null, x0old = null, x1 = null, dims = [];
var attrNoTotal = null, attrTotal = null, attr2 = [], index = 0;
var numIndex =-1;
var X = [], Y = [];
// var attrTable1 = ["全部车辆","高危车辆","中危车辆","低危车辆","已标注车辆","推荐车辆","与标注不一致车辆"];
var attrTable1 = ["全部车辆","高危车辆","中危车辆","低危车辆","推荐车辆"];
var attrTable2 = ["T-SNE降维","LDA降维"];
var datatypeselect = ["全部车辆","classifyRes1","classifyRes0","markRes1","markRes0"]
var showMarkRes = ["用户的标记","自动分类的结果"]
var choice_num = 2;
var showdata = 0;   //用户选中车辆数据选择下拉框的索引
var loaddata = [];
var coord = [];
var choice_che = ["低危","中危","高危","取消标记"];
var isShowSymbol = ["显示符号","不显示符号"];
var choiceClick = true;
var showSymbol = false;
var TypeOfSign = 0;
// 降维方法的选择 当前有tsne 和 LDA
var methodRedim = "tsne";
// 车辆类型的选择 选择列表为 attrTable1
var typeOfVehi = "全部车辆"
var listFiles = [];
var accuRate1 = 0;
var symbol = d3.svg.symbol()
        .type(function (d) {
          if(showSymbol&&d["markRes"] != -1){
            return d3.svg.symbolTypes[3];
          }
          else{
            return d3.svg.symbolTypes[0];
          }
        })
        .size(function (d, i) {
          if(showSymbol&&d["markRes"] != -1){
            return 300;
          }
          else{
            return 150;
          }
          });
var xAxis;
var yAxis;
function init(){
    var totalHeight = document.body.clientHeight;  
    var ctrlHeight = document.getElementById("totalControlPanel").clientHeight;
    console.log(totalHeight,ctrlHeight);
    d3.select("#totalGraph")
      .attr("height",totalHeight-ctrlHeight);
    d3.select(".classifyGraph")
    .attr("height",(totalHeight-ctrlHeight)/2)
    d3.select("#totalRankGraph")
    .attr("height",(totalHeight-ctrlHeight)/2)
    // d3.select("#totalRankGraph #tablePanel")
    // .attr("height",(totalHeight-ctrlHeight)/2)
    d3.select("#totalModelGraph")
    .attr("height",(totalHeight-ctrlHeight)/2)
    initRecomPanel();
    // d3.select(".classifyGraph")
    // .attr("height",(totalHeight-ctrlHeight)/2)
    linkJsTSNE();
      attrTotal = Object.keys(loaddata[0]["detail"]);//传入对象，返回属性名
      attrNoTotal = attrTotal.length;
      console.log(attrTotal);
    //保存tsne坐标
    console.log(loaddata[0]["raw"])
    for (var i = 0;i<loaddata.length;i++){
      var item = {"x":null,"y":null};
      item["x"] = loaddata[i]["raw"][0];
      item["y"] = loaddata[i]["raw"][1];
      coord[i] = item
    } 
    loadVis(loaddata);
    initCtrlPanel();
}

function initCtrlPanel(){
  // console.log("here is init panel!!!!!!!!!!")
  appendOption("classDropDown","medthDeDim",attrTable2,updatabycby);
  appendOption("classDropDown","vehicleType",attrTable1,updatebycb);
  appendOption("publicDropDown","restoreModel",listFiles,selectFile);
  appendOption("classDropDown","markByUser",choice_che,updatebychoice);
  appendOption("classDropDown","showMarkRes",showMarkRes,selectShowRes);
  appendOption("classDropDown","showSymbol",isShowSymbol,isShowSyb);
}
// Main function
function loadVis(data,flaginit=true) {
  console.log("here is loadVis")
  drawScatterPlot(data,flaginit);
  //右侧属性栏展示
  tabulate(loaddata[0]);
}

function drawScatterPlot(data,flaginit=true) {
  console.log("here is drawScatterPlot")
  data.forEach(function(d) {
    d.x = d["raw"][0];
    d.y = d["raw"][1];
  });
  
  updateAxis();
  graph = new SimpleGraph("scplot", data, {
    "init": flaginit,
    "flag": true,
  });
  // getScatterCentrePoint(10);
  // console.log(graph);
}
updateAxis = function(){
    // console.log(this.size);
    var xmax = d3.max(loaddata, function(d) { return +d["x"]; }) 
    var xmin = d3.min(loaddata, function(d) { return +d["x"]; }) 
    var ymax = d3.max(loaddata, function(d) { return +d["y"]; }) 
    var ymin = d3.min(loaddata, function(d) { return +d["y"]; }) 
    var width = document.getElementById("scplot").clientWidth-200;
    var totalHeight = d3.select("#totalClassifyGraph").attr("height")-20
    console.log(width,totalHeight);
    xAxis = d3.scale.linear()
    .domain([xmin, xmax])
    .range([0, width]);
    yAxis = d3.scale.linear()
    .domain([ymax, ymin])
    .range([0, totalHeight]);
  }

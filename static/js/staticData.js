dataSrc = []
// showAttrName = ["Abs","Rel","RankScore","XH","SYXZ","SFYXQN","SFBXQN","HBDBQK",
//                     "WF","QWSG","YBSG","ZDSG","TDSG"]
showAttrName = [];
// 因为class不能为中文 所以这里需要做一个映射
// classMap = {"Abs":"Abs","Rel":"Rel","RankScore":"RankScore","序号":"XH"}
classMap = {"Abs":"Abs","trueRank":"true","Rel":"Rel","RankScore":"RankScore","XH":"XH"}
color = ["black","green","yellow","red","black","blue"];
var maxHtRow = 15;
var selectedIDs = [];
var isShowClassData = false;
var isRanking = true;
// var isMarkDanger=true;
var markDangerRank = 2;
var scatterSelectId = 0;
var weight = {};
// 这里需要将过滤条件保存为一个全局变量
var filterCon = "所有车辆";
var optionList=["排序","取消相对排序","标记高危","标记中危","标记低危","取消标记"];
var typeOfVehicle = ["所有车辆","推荐车辆","高危车辆","中危车辆","低危车辆"];
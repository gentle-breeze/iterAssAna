// 用于显示在推荐图上面的数据
var recomData = [];
// 发送给后台的数据
var relPairIDs = [];
// 一些控制信息
var isRankingRecom = true;
var markDangerRecom =2;
recomSelectId = 0;
var optionRecomList=["排序","取消相对排序","标记高危","标记中危","标记低危","取消标记"];
// initRecomPanel();
// 从后台重新获取推荐数据 在获取推荐数据后 才能再画MDS降维图
function getRecomData(){
    var svmURL = "/getRecom/"
    new Promise(function(resolve, reject) {
        $.ajax({
            type: "post", 
            async: false,
            url: svmURL, 
            data: {
                key: JSON.stringify([])
            }, 
            dataType: "json",
            success: function(dataRes) {
                var data1 = dataRes["recomData"];
                recomData = data1;
                // console.log(recomData);
                getRecomShowData(recomData);
                console.log("here is redimData")
                // getRecomRedimData();
                getRecomDisData();
                console.log(recomData);
            }
        })
    })
}
function updateShowRecom(){
    getRecomData();
    updataRecomGraph();
}
// 添加单选框
recomOptionFunc1 = function(temp){
    if(temp == "排序"){
        isRankingRecom = true;
        markDangerRecom = 2;
        $("#recomTablePanel tbody").sortable("enable");
    }
    else if(temp == "标记高危"){
        $("#recomTablePanel tbody").sortable("disable");
        markDangerRecom = 2;
        isRankingRecom = false;
    }
    else if(temp == "标记中危"){
        $("#recomTablePanel tbody").sortable("disable");
        markDangerRecom = 1;
        isRankingRecom = false;
    }
    else if(temp == "标记低危"){
        $("#recomTablePanel tbody").sortable("disable");
        markDangerRecom = 0;
        isRankingRecom = false;
    }
    else if(temp == "取消相对排序"){
        $("#recomTablePanel tbody").sortable("disable");
        markDangerRecom = -2;
        isRankingRecom = true;
    }
    else if(temp == "取消标记"){
        $("#recomTablePanel tbody").sortable("disable");
        markDangerRecom = -1;
        isRankingRecom = false;
    }
}
function initRecomPanel(){
    console.log(optionRecomList);
    // console.log(recomOptionFunc1)
    appendOption("recomDropDown","optionType",optionRecomList,recomOptionFunc1);
}

function getRecomShowData(srcRecomData){
    // showAttrName
    recomData = [];
    for(var i = 0; i<srcRecomData.length;){
        for(var i1 = 1; i1>-2 ; i1-=2,i++){
            var temp = {};
            // 这些是未放入detail里作为控制的
            temp["classifyRes"] = srcRecomData[i]["classifyRes"];
            temp["markRes"] = srcRecomData[i]["markRes"];
            temp["recomRes"] = srcRecomData[i]["recomRes"];
            temp["ID"] = srcRecomData[i]["ID"];
            temp["relID"] = srcRecomData[i+i1]["ID"];
            temp["标注"] = srcRecomData[i]["标注"];
            temp["Rank"] = srcRecomData[i]["Abs"];
            // console.log(i+i1);
            temp["showID"] = srcRecomData[i]["showID"];
            temp["relShowID"] = srcRecomData[i+i1]["showID"];
            
            var detail = [];
            var indexAttr = 0;
            // 这里面放入的是 用来显示的信息
            for(var i2 = 0; i2<showAttrName.length; i2++){
                var tempObj = {};
                var key = showAttrName[i2];
                tempObj["head"] = key;
                tempObj["showData"] = srcRecomData[i][key];
                if(classMap[key]){
                    tempObj["class"] = classMap[key];
                }
                else{
                    tempObj["class"] = "attr"+indexAttr;
                    indexAttr++;
                }
                // if(key == "RankScore" || key == "WF"||key == "QWSG"||key == "YBSG"||key == "ZDSG"||key == "TDSG"){
                if(key!="Rel"&&key!="XH"){
                    if(srcRecomData[i][key]%1 === 0){
                        tempObj["showData"] = srcRecomData[i][key]
                    }
                    else{
                        tempObj["showData"] = srcRecomData[i][key].toFixed(2);
                    }
                    // tempObj["showData"] = srcRecomData[i][key].toFixed(2);
                }
                if(key == "RankScore"){
                    tempObj["color"] = temp["classifyRes"];
                }
                // else if(key == "XH"){
                else if(key == "XH"){
                    tempObj["color"] = temp["markRes"];
                }
                else if(key == "Rel"){
                    tempObj["color"] = -1;
                }
                else if(key == "Abs"||key==="trueRank"){
                    tempObj["color"] = -1;
                    // tempObj["color"] = temp["标注"]
                }
                else{
                    tempObj["color"] = (i+1)%2+3;
                }
                detail.push(tempObj);
            }
            temp["detail"] = detail;
            recomData.push(temp);
        }
        
    }
}
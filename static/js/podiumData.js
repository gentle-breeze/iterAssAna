function getSrcData(){
    var svmURL = "/getSrcData/"
    console.log("here is getSrcData");
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
                console.log("here is getSrcData");
                var data1 = dataRes["initData"];
                showAttrName = dataRes["attrName"];
                dataSrc = data1;
                console.log(dataSrc);
                alterDetailAttr();
                // console.log(dataSrc);
                displayPage(dataSrc);
                var initWeight = (1/(showAttrName.length-4)) + 0.1;
                for(var i =0;i<showAttrName.length;i++){
                    if(showAttrName[i]!="XH"&&showAttrName[i]!="RankScore"&&showAttrName[i]!="Rel"&&showAttrName[i]!="Abs"){
                        weight[showAttrName[i]] = initWeight;
                    }
                }
                initRankPanel();
                // getRecomData();
                // displayRecomGraph();
                // addInputWeight();
            },
            error: function(error) {
                console.log(error);
            }
        })
    })
}
function initRankPanel(){
    appendOption("rankDropDown","optionType",optionList,optionFunc);
    appendOption("rankDropDown","vehicleType",typeOfVehicle,filterFunc);
}
function addInputWeight(){
    weightArray = objToList(weight);
    var length = weightArray.length;
    d3
    .select("#controlPanel")
    .selectAll(".weight")
    .data(weightArray)
    .enter()
    .append("input")
    .attr("id",function(d){
        console.log("here is weight")
        return d["code"];
    })
    .attr("class","weight")
    // .attr("transform",function(d,i){
    //     return "position: absolute;left:" + i*50 + ";top:" + 0 + ";";
    // })
    .style("position","absolute")
    .style("left",function(d,i){
        return (i*120)%(120*5)+200;
    })
    .style("top",function(d,i){
        var value = 50;
        value+=15*parseInt(i/5)
        return value;
    })
    .style("width",35)
    .style("height",15)
    .attr("value",function(d,i){
        return d["value"];
    });
    d3
    .select("#controlPanel")
    .selectAll(".weightText")
    .data(weightArray)
    .enter()
    .append("p")
    .text(function(d,i){
        var value = " * "+d["code"];
        if(i!=length-1){
            value+="+"
        }
        return value;
    })
    .style("Font-size", "15px")
    .style("position","absolute")
    .style("left",function(d,i){
        return (i*120)%(120*5)+240;
    })
    .style("top",function(d,i){
        var value = 50;
        value+=15*parseInt(i/5);
        return value;
    });
    d3
    .select("#controlPanel")
    .append("button")
    .attr("type","button")
    .style("position","absolute")
    .style("left",120*5+0)
    .style("top",50+15*5)
    .on("click",updateWeightValue)
    .text("上传权重");
}
function updateWeightValue(){
    var res = d3.select("#controlPanel")
    .selectAll(".weight")
    .classed("test",function(d,i){
        // var value = d3.select(this).attr("value");
        // console.log( d3.select(this).value());
        value = $(this).val();
        d["value"] = value;
        weight[d["code"]] = value;
    });
    console.log(weight);
    updateWeight();
}
let objToList = (obj,code='code',value='value')=>{
    const keys = Object.keys(obj)
    const result = keys.map(it=>{
        return { [code]: it, [value]: obj[it] }
    })
    return result
}
function alterDetailAttr(){
    dataDest = []
    for(var i =0;i<dataSrc.length;i++){
        var temp = {};
        temp["classifyRes"] = dataSrc[i]["classifyRes"];
        temp["markRes"] = dataSrc[i]["markRes"];
        temp["recomRes"] = dataSrc[i]["recomRes"];
        temp["ID"] = dataSrc[i]["ID"];
        // temp["标注"] = dataSrc[i]["标注"]
        temp["Rank"] = dataSrc[i]["Abs"];
        resDetail = [];
        indexAttr = 0;
        // console.log(showAttrName);
        for(var i2 = 0; i2<showAttrName.length; i2++){
            var tempObj = {};
            var key = showAttrName[i2];
            tempObj["head"] = key;
            if(classMap[key]){
                tempObj["class"] = classMap[key];
            }
            else{
                tempObj["class"] = "attr"+indexAttr;
                indexAttr++;
            }
            // console.log(key);
            tempObj["showData"] = dataSrc[i][key];
            // if(key == "RankScore" || key == "WF"||key == "QWSG"||key == "YBSG"||key == "ZDSG"||key == "TDSG"){
            if(key!="Rel"&&key!="XH"){
                if(dataSrc[i][key]%1 === 0){
                    tempObj["showData"] = dataSrc[i][key]
                }
                else{
                    tempObj["showData"] = dataSrc[i][key].toFixed(2);
                }
            }
            if(key == "RankScore"){
                tempObj["color"] = temp["classifyRes"];
            }
            // else if(key == "序号"){
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
            resDetail.push(tempObj);
        }
        temp["detail"] = resDetail;
        dataDest.push(temp);
    }
    dataSrc = dataDest;
    // console.log(dataSrc);
}
function getDiffDegree(){
    new Promise(function(resolve, reject){
      console.log("here is accuRate")
      var svm = "/getDiffDegree/";
      $.ajax({
        type: "post", 
        async: false,
          url: svm,
        data: {
              key: JSON.stringify()
          }, 
          dataType: "json",
          success: function(data) {
            console.log(data["diff"])
  
            var accuRate1 = document.getElementById("diff")
            accuRate1.innerHTML=data["diff"];
            
            },
          error: function(error) {
            console.log(error);
          }
        });
      });
  }

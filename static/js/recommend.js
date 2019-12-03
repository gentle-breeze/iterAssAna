
function displayRecomGraph(){
    console.log("here is recomGra")
    displayRecomTable();
    addRecomFunctionality();
}
function scrollToRecomPos(betterID,worseID) {
    var showID1 = "";
    var showID2 = "";
    d3.select("#recomTableId")
        .select("tbody")
        .selectAll("tr")
        .style("background-color", function (d,i){
            if(d["ID"]==betterID&&d["relID"]==worseID){
                showID1 = d["showID"];
                showID2 = d["relShowID"];
            }
            if(i%4==0||i%4==1){
                return "rgba(90, 150, 150, 0.1)";
            }
            else{
                return "rgba(150, 150, 150, 0.8)";
            }
        });
        var container = $('#recomTableId tbody');
        var scrollTo = $('#trRecom' + showID1);
        offset = scrollTo.offset().top - container.offset().top - 250;
        container.scrollTop(
            offset + container.scrollTop()
        );
    d3.select("#recomTableId")
        .select("tbody")
        .select("#trRecom" + showID1)
        .style("background-color", "rgba(80, 80, 80, 0.8)");
    d3.select("#recomTableId")
        .select("tbody")
        .select("#trRecom" + showID2)
        .style("background-color", "rgba(80, 80, 80, 0.8)");
}
function displayRecomTable(){
    table = d3.select("#recomTablePanel")
        .insert("table", ":first-child")
        .attr("id", "recomTableId")
        .attr("class", "table");
    var totalWidth = document.getElementById("recomTablePanel").clientWidth - 40;
    // var totalWidth = document.body.clientWidth/2-15;
    var width = totalWidth/showAttrName.length;
    header = table.append("thead")
        .attr("class", "header")
        .attr("id","recomHead")
        .append("tr")
        .selectAll("th")
        .data(showAttrName)
        .enter()
        .append("th")
        .attr("class", function(d){
            return d;
        })
        .style("min-width", width)
        .style("max-width", width)
        .style("display", function(d) {
            if (d.displayStyle != undefined) return d.displayStyle;
            else return "";
        }).style("text-align", function(d) {
            return "center"; 
        }).text(function(d) {
            if (d == "Abs") return "Rank";
            else return d;
        });
    table.append("tbody");
    updataRecomGraph();
}
function updataRecomGraph(){
    // console.log(dataSrc);
    var totalHeight = document.getElementById("recomTablePanel").clientHeight;
    var headHeight = document.getElementById("recomHead").clientHeight;
    var height = totalHeight-headHeight-20;
    // var totalWidth = document.body.clientWidth/2-15;
    var totalWidth = document.getElementById("recomTablePanel").clientWidth - 40;
    var width = totalWidth/showAttrName.length;
    console.log(width)
    rows = d3.select("#recomTableId")
        .select("tbody")
        .style("max-height", height)
        .selectAll("tr")
        .data(recomData)
    rows.exit()
        .remove();
    rows.attr("id", function(d, i) {
        return "trRecom" + d["showID"];
    })
    .attr("class","ui-state-default")
    .style("background-color",function(d,i){
        // if(d["recomRes"]==1){
        //     return "rgba(90, 150, 150, 0.1)";
        // }
        // else{
        //     return "rgba(150, 150, 150, 0.8)";
        // }
        if(i%4==0||i%4==1){
            return "rgba(90, 150, 150, 0.1)";
        }
        else{
            return "rgba(150, 150, 150, 0.8)";
        }
    })
    ;
    rows.enter()
        .append("tr")
        .attr("id", function(d, i) {
            return "trRecom" + d["showID"];
        })
        .attr("class","ui-state-default")
        // .attr("class","ui-state-disabled")
        .style("background-color",function(d,i){
            // if(d["recomRes"]==1){
            //     return "rgba(90, 150, 150, 0.1)";
            // }
            // else{
            //     return "rgba(150, 150, 150, 0.8)";
            // }
            if(i%4==0||i%4==1){
                return "rgba(90, 150, 150, 0.1)";
            }
            else{
                return "rgba(150, 150, 150, 0.8)";
            }
        });
    updateRecomClickedItem();
    cells = rows.selectAll("td")
        .data(function(d) {
            return d["detail"];})
    cells.exit()
        .remove();
    cells.style("display", function(d) {
        // console.log(d);
        if (d.displayStyle != undefined) return d.displayStyle;
        else return "";
        })
        .attr("class",function(d){
            return d["class"];
            // return d["head"];
        })
        .style("text-align","center")
        .select("font")
        .text(function(d){
            return d["showData"];
        })
        .attr("color",function(d,i){
            return color[d["color"]+1];
        });
    cells = cells.enter()
        .append("td")
        .style("display", function(d) {
            if (d.displayStyle != undefined) return d.displayStyle;
            else return "";
        })
        .attr("class",function(d){
            return d["class"];
            // return d["head"];
        })
        .style("text-align","center")
        .append("font")
        .text(function(d,i){
            return d["showData"];
        })
        .attr("color",function(d,i){
            // console.log(color[d["color"]+1]);
            return color[d["color"]+1];
        });
    d3.select("#recomTableId")
        .select("tbody")
        .selectAll("td")
        .style("min-width", width)
        .style("max-width", width)
        .style("max-height", 20);
        // .style("class",function(d){
        //     console.log("here is recom td");
        // });
}
// 添加一些功能
function addRecomFunctionality() {
    dragRecomRow();
    // addRecomRadio();
    updateRecomClickedItem();
    // addRadioFunction();
    // updateClickedItem();
}
// 添加移动事件
function dragRecomRow(){
    var updateIndex = function(e, ui) {
        var isFirst = true;
        var tempObj = {};
        // 这里只能通过在选择器里面进行修改数据
        d3.select("#recomTableId")
        .select("tbody")
        .selectAll(".test1")
        .attr("class",function(d){
            var detail = d["detail"];
            relId = d["relShowID"];
            console.log(d["showID"],d["relShowID"]);
            for(var i1 =0;i1<detail.length;i1++){
                if(detail[i1]["head"] == "Rel"){
                    if(isFirst){
                        detail[i1]["showData"] = 1;
                        tempObj["first"] = d["ID"];
                    }
                    else{
                        detail[i1]["showData"] = 2;
                        tempObj["second"] = d["ID"];
                    }
                }
                // else if((detail[i1]["head"]!="Rel")&&detail[i1]["head"]!="RankScore"&&detail[i1]["head"]!="序号"){
                else if((detail[i1]["head"]!="Rel")&&detail[i1]["head"]!="RankScore"&&detail[i1]["head"]!="XH"){
                    if(isFirst){
                        detail[i1]["color"]=4;
                    }
                    else{
                        detail[i1]["color"]=3;
                    }
                }
            }
            isFirst = false;
            return "ui-state-default";
        });
        // 数据修改好之后,更新排序的那个数组
        
        for(var i =0; i<relPairIDs.length; i++){
            console.log(relPairIDs);
            var nowObj = relPairIDs[i];
            console.log(nowObj)
            if((tempObj["first"]==nowObj["first"])&&(tempObj["second"]==nowObj["second"])){
                relPairIDs.splice(i,1);
            }
            else if((tempObj["first"]==nowObj["second"])&&(tempObj["first"]==nowObj["second"])){
                relPairIDs.splice(i,1);
            }
        }
        relPairIDs.push(tempObj);
        // console.log(relPairIDs);
        // 最后更新视图并进行一些扫尾工作
        d3.select("#recomTableId")
        .select("tbody")
        .selectAll(".Rel")
        .select("font")
        .text(function(d,i){
            console.log("here is recom text")
            return d["showData"];
        });
        d3.select("#recomTableId")
        .select("tbody")
        .selectAll("td")
        .select("font")
        .attr("color",function(d,i){
            return color[d["color"]+1];
        });
        $("#recomTableId tbody").sortable( "option", "items", ">*" );
        d3.select("#recomTableId")
        .select("tbody")
        .selectAll("tr")
        .classed("ui-state-disabled",function(d){
            return false;
        });
    }
    $("#recomTableId tbody").sortable({
        stop: updateIndex,
    }).disableSelection();
}

// function addRecomRadio(){
//     d3.selectAll(".recomInputInfo")
//     .on("click",function(){
//         temp=d3.select(this).attr("value");
        

//     });
// }
// 在鼠标单击后的操作
function updateRecomClickedItem(){
    d3.select("#recomTableId")
    .select("tbody")
    .selectAll("tr")
    .on("mousedown",function(d,i){
        console.log("here is mouse down")
        if(isRankingRecom){
            id = d["showID"];
            relId = d["relShowID"];
            if(markDangerRecom != -2){

                console.log(id,relId);
                var value = "#trRecom"+id +",#trRecom"+relId;
                $("#recomTableId tbody").sortable( "option", "items", value );
                d3.select("#recomTableId")
                .select("tbody")
                .selectAll("tr")
                .classed("ui-state-disabled",function(d){
                    if(d["showID"] == id || d["showID"] == relId){
                        return false;
                    }
                    else{
                        return true;
                    }
                })
                .classed("test1",function(d){
                    if(d["showID"] == id || d["showID"] == relId){
                        return true;
                    }
                    else{
                        return false;
                    }
                })
            }
            else{
                var temp = [];
                d3.select("#recomTableId")
                .select("tbody")
                .selectAll("tr")
                .classed("ui-state-disabled",function(d){
                    if(d["showID"] == id || d["showID"] == relId){
                        detail = d["detail"];
                        var nowID = d["ID"]; 
                        for(var i1 =0;i1<detail.length;i1++){
                            if(detail[i1]["head"] == "Rel"){
                                detail[i1]["showData"] = "";
                                temp.push(nowID);
                            }
                        }
                    }
                    d3.select("#recomTableId")
                    .select("tbody")
                    .selectAll(".Rel")
                    .select("font")
                    .text(function(d,i){
                        return d["showData"];
                    })
                    return false;
                });
                for(var i = 0;i<relPairIDs.length;i++){
                    if(temp.length!=0){
                        var id1= temp[0];
                        var id2= temp[1];
                        var flag = relPairIDs[i]["first"]==id1||relPairIDs[i]["second"]==id1;
                        flag = flag ||relPairIDs[i]["first"]==id2||relPairIDs[i]["second"]==id2;
                        if(flag){
                            relPairIDs.splice(i,1);
                        }
                    }
                }
            }
        }
        else{
            res = markDangerRecom;
            d["markRes"] = res;
            updataRecomShowColorData();
            updataRecomShowColor();
        }
        console.log(relPairIDs);
    });
}
// 更新颜色的数据
function updataRecomShowColorData(){
    for(var i =0;i<recomData.length;i++){
        var detail = recomData[i]["detail"];
        var color;
        // console.log(detail)
        for(var i1 = 0;i1<detail.length;i1++){
            // if(detail[i1]["head"] == "序号"){
            if(detail[i1]["head"] == "XH"){
                detail[i1]["color"] = recomData[i]["markRes"];
            }
            else if(detail[i1]["head"] == "RankScore"){
                // console.log("here is update color")
                detail[i1]["color"] = recomData[i]["classifyRes"];
            }
        }
    }
}
// 更新视图的颜色
function updataRecomShowColor(){

    d3.select("#recomTableId")
    .select("tbody")
    .selectAll(".XH")
    .select("font")
    .attr("color",function(d,i){
        return color[d["color"]+1];
    });
    d3.select("#recomTableId")
    .select("tbody")
    .selectAll(".RankScore")
    .select("font")
    .attr("color",function(d,i){
        return color[d["color"]+1];
    });
    d3.select("#recomTableId")
    .select("tbody")
    .selectAll(".Abs")
    .select("font")
    .attr("color",function(d,i){
        return color[d["color"]+1];
    });d3.select("#recomTableId")
    .select("tbody")
    .selectAll(".Abs")
    .select("font")
    .attr("color",function(d,i){
        return color[d["color"]+1];
    });
}
// 刷新视图 主要干两件事 
// 一是将标志数据写入后台并更新其他视图
// 二是将相对排序信息写入后台文件中
function freshRecomGra(){
    var flags = getRecomFlags();
    console.log(flags);
    new Promise(function(resolve, reject){
        var svm = "/freshRecomData/";
        $.ajax({
            type: "post", 
            async: false,
            url: svm,
            data: {
                // key: JSON.stringify(loaddata["raw"])
                "flags": JSON.stringify(flags),
                "relRank":JSON.stringify(relPairIDs),
            },
            dataType: "json",
            success: function(data) {
                console.log(data["temp"]);
                updataAllView(data["temp"]);
            }
        })
    })
}
function getRecomFlags(){
    var flags = [];
    for(var i = 0; i<recomData.length;i++){
        temp = {};
        id = recomData[i]["ID"]
        // console.log(id);
        temp["ID"] = id
        temp["markRes"] = recomData[i]["markRes"];
        temp["classifyRes"] = recomData[i]["classifyRes"];
        temp["recomRes"] = recomData[i]["recomRes"];
        flags.push(temp);
    }
    return flags;
}
function updataShowRecomFlags(flags){
    for(var i =0;i<recomData.length;i++){
        var id = recomData[i]["ID"];
        recomData[i]["markRes"] = flags[id]["markRes"];
        recomData[i]["classifyRes"] = flags[id]["classifyRes"];
        recomData[i]["recomRes"] = flags[id]["recomRes"];
    }
    updataRecomShowColorData();
    updataRecomShowColor();
    // updataRecomShow();
}

//取消相对排序和标记
function cancelOpera(){
    
}
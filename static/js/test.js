function displayPage(displayData) {
    // console.log(displayData[0]);
    if (displayData != undefined && displayData.length != 0) {
        displayTable();
        addFunctionality();
        scrollToPos(0);
    }
}
//初始化table
function displayTable() {
    var totalWidth = document.getElementById("tablePanel").clientWidth - 19;
    var totalHeight = d3.select("#totalRankGraph").attr("height");
    console.log(totalHeight);
    var width = totalWidth / showAttrName.length;
    console.log("here is rank width!!!!!!!!!!", width);
    table = d3.select("#tablePanel")
        .attr("height",totalHeight)
        .insert("table", ":first-child")
        .attr("id", "tableId")
        .attr("height",totalHeight)
        .attr("class", "table");
    header = table.append("thead")
        .attr("class", "header")
        .attr("id","rankHead")
        .append("tr")
        .selectAll("th")
        .data(showAttrName)
        .enter()
        .append("th")
        // .attr("colspan", function(d) {
        //     if (d == "Abs") return 1;
        //     else return;
        // })
        // .attr("rowspan", function(d) {
        //     if (d != "Abs") return 1;
        //     else return;
        // })
        .attr("class", function (d) {
            return d;
        })
        .style("min-width", width)
        .style("max-width", width)
        .style("display", function (d) {
            if (d.displayStyle != undefined) return d.displayStyle;
            else return "";
        }).style("text-align", function (d) {
            return "center";
        }).text(function (d) {
            if (d == "Abs.") return "Rank";
            else return d;
        });
    // d3.select("#tableId")
    // .select("tbody")
    // .selectAll(".Abs")
    // .select("font")
    // .attr("color",function(d,i){
    //     return color[d["color"]+1];
    // });
    table.append("tbody");
    updataRankGraph();
}


function scrollToPos(id) {
    d3.select("#tableId")
        .select("tbody")
        .select("#tr" + scatterSelectId)
        .style("background-color", function (d) {
            // console.log(d["ID"]);
            if (d["recomRes"] == 1) {
                return "rgba(90, 150, 150, 0.1)";
            }
            else {
                return "rgba(150, 150, 150, 0.8)";
            }
        });

    // var container = $('#tableId tbody');
    console.log(compareId(id));
    if (compareId(id)) {
        // var container = $('#tableId');
        var container = $('#tableId tbody');

        var scrollTo = $('#tr' + id);

        offset = scrollTo.offset().top - container.offset().top - 250;
        // console.log(offset)
        container.scrollTop(
            offset + container.scrollTop()
        );
    }
    d3.select("#tableId")
        .select("tbody")
        .select("#tr" + id)
        .style("background-color", "rgba(80, 80, 80, 0.8)");
    scatterSelectId = id;
}

// 比较id号的存在
function compareId(id) {
    for (var i = 0; i < dataSrc.length; i++) {
        // console.log(id,dataSrc[i]["ID"]);
        if (id == dataSrc[i]["ID"]) {
            return true;
        }
    }
    return false;
}

function addFunctionality() {
    clickAndDragRows();
    updateClickedItem();
}
function verifyRankModel() {
    var svmURL = "/verifyRankModel/";
    var trainRows = []
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "post",
            async: false,
            url: svmURL,
            data: {
                key: JSON.stringify(trainRows),
            },
            dataType: "json",
            success: function (rankSvmRes) {
                dataSrc = rankSvmRes["updateData"];
                console.log(dataSrc)
                flags = rankSvmRes["flags"];
                console.log(flags)
                alterDetailAttr();
                updataRankGraph();
                updataAllView(flags);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
}
// function 
// 在拖动结束后触发的事件
function clickAndDragRows() {
    var updateIndex = function (e, ui) {
        // var beginTime = +new Date();
        //所谓的ui.item就像当于是d3.select的结果
        id = ui.item["0"]["id"];
        id = parseInt(id.replace(/[^0-9]/ig, ""));
        // var endTime = +new Date();
        // console.log("1用时共计"+(endTime-beginTime)+"ms");
        updataSrcDataIndex(id);
        // var endTime = +new Date();
        // console.log("1用时共计"+(endTime-beginTime)+"ms");
    };
    var updataSrcDataIndex = function (id) {
        // var beginTime = +new Date();
        var nowRel = 1;
        console.log(id);
        d3.select("#tableId").select("tbody")
            .selectAll("tr")
            .attr("class", function (d, i) {
                // console.log(i);
                var nowID = d["ID"];
                var detail = d["detail"];
                for (var i1 = 0; i1 < detail.length; i1++) {
                    if (detail[i1]["head"] == "Abs") {
                        // console.log(i);
                        detail[i1]["showData"] = i + 1;
                        d["Rank"] = i + 1;
                    }
                    else if ((detail[i1]["head"] != "Rel") && detail[i1]["head"] != "RankScore" && detail[i1]["head"] != "XH") {
                        detail[i1]["color"] = (i + 1) % 2 + 3;
                    }
                    else if (detail[i1]["head"] == "Rel") {
                        if (id == nowID || detail[i1]["showData"] != "") {
                            detail[i1]["showData"] = nowRel;
                            nowRel++;
                        }
                    }
                }
            });
        // var beginTime = +new Date();
        //最后更新图即可
        d3.select("#tableId")
            .select("tbody")
            .selectAll("td")
            .select("font")
            .text(function (d, i) {
                return d["showData"];
            })
            .attr("color", function (d, i) {
                return color[d["color"] + 1];
            });
        // var endTime = +new Date();
        // console.log("4用时共计"+(endTime-beginTime)+"ms");
    }
    $("#tablePanel tbody").sortable({
        stop: updateIndex,
    }).disableSelection();
}


function updateClickedItem() {
    d3.select("#tableId")
        .select("tbody")
        .selectAll("tr")
        .on("click", function (d, i) {
            id = d["ID"];
            clickItemAction(id);
        })
        .on("dblclick", function (d) {
            // console.log("here is mouseover!!")
            getScatterCentrePoint(d["ID"]);
        })
}

function clickItemAction(id) {
    if (!isRanking) {
        res = markDangerRank;
        var dataItem = getDataByID(id);
        dataItem["markRes"] = res;
        updataShowColorData();
        updataShowColor();
    }
    else if (markDangerRank == -2) {
        var nowRel = 1;
        d3.select("#tableId").select("tbody")
            .selectAll("tr")
            .attr("class", function (d, i) {
                var nowID = d["ID"];
                var detail = d["detail"];
                for (var i1 = 0; i1 < detail.length; i1++) {
                    if (detail[i1]["head"] == "Rel") {
                        if (id == nowID) {
                            detail[i1]["showData"] = ""
                        }
                        if (detail[i1]["showData"] != "") {
                            detail[i1]["showData"] = nowRel;
                            nowRel++;
                        }

                    }
                }
            });
        d3.select("#tableId")
            .select("tbody")
            .selectAll("td")
            .select("font")
            .text(function (d, i) {
                return d["showData"];
            })
            .attr("color", function (d, i) {
                return color[d["color"] + 1];
            });
    }
}

function getDataByID(id) {
    for (var i = 0; i < dataSrc.length; i++) {
        if (id == dataSrc[i]["ID"]) {
            return dataSrc[i];
        }
    }
}
// markDangerRank==-2时代表取消排序的标记
optionFunc = function (temp) {
    console.log(temp);
    if (temp == "排序") {
        isRanking = true;
        $("#tablePanel tbody").sortable("enable");
    }
    else if (temp == "标记高危") {
        $("#tablePanel tbody").sortable("disable");
        markDangerRank = 2;
        isRanking = false;
    }
    else if (temp == "标记中危") {
        $("#tablePanel tbody").sortable("disable");
        markDangerRank = 1;
        isRanking = false;
    }
    else if (temp == "标记低危") {
        $("#tablePanel tbody").sortable("disable");
        markDangerRank = 0;
        isRanking = false;
    }
    else if (temp == "取消标记") {
        $("#tablePanel tbody").sortable("disable");
        markDangerRank = -1;
        isRanking = false;
    }
    else if (temp == "取消相对排序") {
        $("#tablePanel tbody").sortable("disable");
        markDangerRank = -2;
        isRanking = true;
    }
}
filterFunc = function (condtion) {
    filterCon = condtion;
    getFiltData();
}
function updataShowColorData() {
    // console.log(dataSrc)
    for (var i = 0; i < dataSrc.length; i++) {
        var detail = dataSrc[i]["detail"];
        var color;
        // console.log(detail)
        for (var i1 = 0; i1 < detail.length; i1++) {
            // if(detail[i1]["head"] == "序号"){
            if (detail[i1]["head"] == "XH") {
                // console.log("here is update XH color")
                detail[i1]["color"] = dataSrc[i]["markRes"];
            }
            else if (detail[i1]["head"] == "RankScore") {
                // console.log("here is update color")
                detail[i1]["color"] = dataSrc[i]["classifyRes"];
            }
            // else if(detail[i1]["head"] == "Abs"){
            //     detail[i1]["color"] = dataSrc[i]["标注"];
            // }

        }
    }
}
// 这里有个情况需要注意 在移动某条记录后 
// dataSrc可能和以前有些不一样了，
// 所以这时不能直接去绑定dataSrc而应该直接去改变值即可
// 绑定dataSrc会造成以前移动的信息全部丢失了
function updataShowColor() {
    d3.select("#tableId")
        .select("tbody")
        .selectAll(".XH")
        .select("font")
        .attr("color", function (d, i) {
            // console.log("here is update show color")
            return color[d["color"] + 1];
        });
    d3.select("#tableId")
        .select("tbody")
        .selectAll(".RankScore")
        .select("font")
        .attr("color", function (d, i) {
            return color[d["color"] + 1];
        });
    d3.select("#tableId")
        .select("tbody")
        .selectAll(".Abs")
        .select("font")
        .attr("color", function (d, i) {
            return color[d["color"] + 1];
        }); d3.select("#tableId")
            .select("tbody")
            .selectAll(".Abs")
            .select("font")
            .attr("color", function (d, i) {
                return color[d["color"] + 1];
            });
}
// 在计算SVM排序结果之后
// 应该将之前的selectedIDs置空
function getSVMRes() {
    console.log("here is SVM");
    var temp = Array(dataSrc.length);
    var countTrain = 0;
    d3.select("#tableId").select("tbody")
        .selectAll("tr")
        .attr("class", function (d, i) {
            var nowID = d["ID"];
            var detail = d["detail"];
            for (var i1 = 0; i1 < detail.length; i1++) {
                if (detail[i1]["head"] == "Rel") {
                    if (detail[i1]["showData"] != "") {
                        var nowRel = detail[i1]["showData"].toString();
                        var nowRel = parseInt(nowRel) - 1;
                        temp[nowRel] = nowID;
                        countTrain++;
                    }
                }
            }
        });
    var trainRows = temp.slice(0, countTrain);
    console.log(trainRows);
    var svmURL = "/svm_ranking/";
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "post",
            async: false,
            url: svmURL,
            data: {
                key: JSON.stringify(trainRows),
            },
            dataType: "json",
            success: function (rankSvmRes) {
                // console.log(rankSvmRes["updateData"]);
                dataSrc = rankSvmRes["updateData"];
                flags = rankSvmRes["flags"];
                alterDetailAttr();
                // for(var i = 0;i<dataSrc.length;i++){
                //     // console.log(dataSrc[i]["ID"]);
                // }
                newRank = getTrainNowRank(trainRows);
                // console.log(newRank);
                res = sortTrainData(trainRows, newRank);
                // console.log(res);
                for (var i = 0; i < dataSrc.length; i++) {
                    var idNum = dataSrc[i]["ID"];
                    var index = isSelectPoint(idNum, res);
                    if (index != -1) {
                        newRank = res[index]["newRank"];
                        oldRank = res[index]["oldRank"];
                        var value = ""
                        if (oldRank != newRank) {
                            value = newRank + "<-" + oldRank;
                        }
                        else {
                            value = newRank + ".";
                        }
                        setDetailValue(i, "Rel", value);
                    }
                }
                updataRankGraph();
                updataAllView(flags);
                for (var i = 0; i < dataSrc.length; i++) {
                    setDetailValue(i, "Rel", "");
                }
                selectedIDs = [];
                accuRate();
                // getDiffDegree();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
}
function setDetailValue(index, head, value) {
    detail = dataSrc[index]["detail"];
    for (var i = 0; i < detail.length; i++) {
        if (detail[i]["head"] == head) {
            detail[i]["showData"] = value;
            break;
        }
    }
}
function isSelectPoint(id, resShow) {
    for (var i = 0; i < resShow.length; i++) {
        if (id == resShow[i]["id"]) {
            return i;
        }
    }
    return -1;
}
function getTrainNowRank(trainIds) {
    var res = [];
    // console.log(trainIds.length);
    for (var i = 0; i < trainIds.length; i++) {
        console.log("here is trainids");
        var nowId = trainIds[i];
        var newRank = -1;
        for (var i1 = 0; i1 < dataSrc.length; i1++) {
            if (nowId == dataSrc[i1]["ID"]) {
                newRank = i1;
                break;
            }
        }
        res.push(newRank);
    }
    return res;
}
function sortTrainData(trainIds, newIndex) {
    res = [];
    sortList1 = [];
    for (var i = 0; i < trainIds.length; i++) {
        temp = {};
        temp["id"] = trainIds[i];
        temp["index"] = newIndex[i];
        sortList1.push(temp);
    }
    sortRes = sortList1.sort(function (a, b) {
        return (a["index"] - b["index"]);
    });
    for (var i = 0; i < trainIds.length; i++) {
        newRank = getNewRank(trainIds[i], sortRes);
        temp1 = {}
        temp1["id"] = trainIds[i];
        temp1["oldRank"] = i;
        temp1["newRank"] = newRank;
        res.push(temp1);
    }
    // console.log(res);
    return res;
}
function getNewRank(id, sortRes) {
    for (var i = 0; i < sortRes.length; i++) {
        if (id == sortRes[i]["id"]) {
            return i;
        }
    }
    return -1;
}
function updataShowRankFlags(flags) {
    for (var i = 0; i < dataSrc.length; i++) {
        var id = dataSrc[i]["ID"];
        dataSrc[i]["markRes"] = flags[id]["markRes"];
        dataSrc[i]["classifyRes"] = flags[id]["classifyRes"];
        dataSrc[i]["recomRes"] = flags[id]["recomRes"];
    }
    updataShowColorData();
    updataShowColor();
    updataRecomShow();
}
function updataRecomShow() {
    d3.select("#tableId")
        .select("tbody")
        .selectAll("tr")
        .style("background-color", function (d) {
            // console.log(d["ID"]);
            if (d["recomRes"] == 1) {
                return "rgba(90, 150, 150, 0.1)";
            }
            else {
                return "rgba(150, 150, 150, 0.8)";
            }
        });
}
function refreshGraExpRank() {
    getRankFlags();
}
function getRankFlags() {
    flags = [];
    for (var i = 0; i < dataSrc.length; i++) {
        temp = {};
        id = dataSrc[i]["ID"]
        // console.log(id);
        temp["ID"] = id
        temp["markRes"] = dataSrc[i]["markRes"];
        temp["classifyRes"] = dataSrc[i]["classifyRes"];
        temp["recomRes"] = dataSrc[i]["recomRes"];
        // temp["标注"] = dataSrc[i]["标注"];
        flags.push(temp);
    }
    new Promise(function (resolve, reject) {
        var svm = "/freshRankData/";
        $.ajax({
            type: "post",
            async: false,
            url: svm,
            data: {
                // key: JSON.stringify(loaddata["raw"])
                key: JSON.stringify(flags),
            },
            dataType: "json",
            success: function (data) {
                // console.log(data["temp"]);
                updataAllView(data["temp"]);
            }
        })
    })
}
function getFiltData() {
    condition = filterCon;
    var temp = Array(dataSrc.length);
    var countTrain = 0;
    d3.select("#tableId").select("tbody")
        .selectAll("tr")
        .attr("class", function (d, i) {
            var nowID = d["ID"];
            var detail = d["detail"];
            for (var i1 = 0; i1 < detail.length; i1++) {
                if (detail[i1]["head"] == "Rel") {
                    if (detail[i1]["showData"] != "") {
                        var nowRel = detail[i1]["showData"].toString();
                        var nowRel = parseInt(nowRel) - 1;
                        temp[nowRel] = nowID;
                        countTrain++;
                    }
                }
            }
        });
    var trainRows = temp.slice(0, countTrain);
    var svmURL = "/svm_filt/";
    // console.log(trainRows);
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "post",
            async: false,
            url: svmURL,
            data: {
                key: JSON.stringify(trainRows),
                "condition": JSON.stringify(condition),
            },
            dataType: "json",
            success: function (rankSvmRes) {
                dataSrc = rankSvmRes["partData"];
                // console.log(dataSrc);
                // 这里需要根据trainrow更新selectedid的值
                for (var i = 0; i < selectedIDs.length; i++) {
                    // console.log(trainRows[i]);
                    selectedIDs[i] = getIndexOfSelect(trainRows[i]);
                }
                alterDetailAttr();
                updataRankGraph();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
}
function getIndexOfSelect(idNum) {
    for (var i = 0; i < dataSrc.length; i++) {
        if (dataSrc[i]["ID"] == idNum) {
            return i;
        }
    }
}
function updataRankGraph() {
    var totalWidth = document.getElementById("tablePanel").clientWidth - 19;
    var totalHeight = d3.select("#totalRankGraph").attr("height");
    var headHeight = d3.select("#rankHead").clientHeight;
    var height = totalHeight-headHeight-100;
    // var totalWidth = document.body.;
    var width = totalWidth / showAttrName.length;
    // console.log(dataSrc);
    rows = d3.select("#tableId")
        .select("tbody")
        .style("max-height", height)
        .selectAll("tr")
        .data(dataSrc)
    rows.exit()
        .remove();
    rows.attr("id", function (d, i) {
        return "tr" + d["ID"];
    })
        .style("background-color", function (d) {
            if (d["recomRes"] == 1) {
                return "rgba(90, 150, 150, 0.1)";
            }
            else {
                return "rgba(150, 150, 150, 0.8)";
            }
        });
    rows.enter()
        .append("tr")
        .attr("id", function (d, i) {
            return "tr" + d["ID"];
        })
        .style("background-color", function (d) {
            if (d["recomRes"] == 1) {
                return "rgba(90, 150, 150, 0.1)";
            }
            else {
                return "rgba(150, 150, 150, 0.8)";
            }
        });

    cells = rows.selectAll("td")
        .data(function (d) {
            return d["detail"];
        })
    cells.exit()
        .remove();
    cells.style("display", function (d) {
        if (d.displayStyle != undefined) return d.displayStyle;
        else return "";
    })
        .attr("class", function (d) {
            // return d["head"];
            return d["class"];
        })
        .style("text-align", "center")
        .select("font")
        .text(function (d) {
            return d["showData"];
        })
        .attr("color", function (d, i) {
            return color[d["color"] + 1];
        });
    cells = cells.enter()
        .append("td")
        .style("display", function (d) {
            if (d.displayStyle != undefined) return d.displayStyle;
            else return "";
        })
        .attr("class", function (d) {
            // return d["head"];
            // console.log(d["class"])
            return d["class"];
        })
        .style("text-align", "center")
        .append("font")
        .text(function (d, i) {
            return d["showData"];
        })
        .attr("color", function (d, i) {
            // console.log(color[d["color"]+1]);
            return color[d["color"] + 1];
        });
    d3.select("#tableId")
        .selectAll("th")
    // .style("min-width", 50)
    // .style("height", maxHtRow);
    d3.select("#tableId")
        .selectAll("td")
        .style("min-width", width)
        .style("max-width", width)
        .style("height", maxHtRow);
    updateClickedItem();
}
function updateWeight() {
    // console.log(flags);
    new Promise(function (resolve, reject) {
        var svm = "/updateWeight/";
        $.ajax({
            type: "post",
            async: false,
            url: svm,
            data: {
                // key: JSON.stringify(loaddata["raw"])
                "weight": JSON.stringify(weight),
            },
            dataType: "json",
            success: function (data) {
                dataSrc = data["updateData"];
                // console.log(dataSrc)
                // console.log(flags)
                alterDetailAttr();
                updataRankGraph();
            }
        })
    })
}
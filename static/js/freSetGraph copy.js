function getFreSetViewData(freSet){
    var svmURL = "/getFreSetViewData/"
    new Promise(function(resolve, reject) {
        $.ajax({
            type: "post", 
            async: false,
            url: svmURL, 
            data: {
                key: JSON.stringify(freSet)
            }, 
            dataType: "json",
            success: function(dataRes) {
                var dataRecive = dataRes["freSetData"];
                var freSetData = [];
                var keys = {};
                var maxDataLength = 0;
                for(var i = 0; i<dataRecive.length; i++){
                    if(Object.keys(dataRecive[i]).length > maxDataLength){
                        maxDataLength = Object.keys(dataRecive[i]).length;
                        keys = Object.keys(dataRecive[i]);
                    }
                }
                // var keys = Object.keys(dataRes["freSetData"][0])
                var rankArray = [];
                for (var i = 0; i<keys.length; i++){
                    var key = keys[i];
                    if(key.substr(0,4)=="rank"){
                        rankArray.push(key);
                    }
                }
                console.log(rankArray);
                for (var i = 0; i<rankArray.length; i++){
                    var key = rankArray[i];
                    var temp = {};
                    temp["name"] = key;
                    var temp1 = [];
                    // var data = dataRes["freSetData"];
                    for(var i1=0; i1< dataRecive.length; i1++ ){
                        record = dataRecive[i1];
                        var temp2 = {};
                        temp2["name"] = record["WF_name"];
                        if(record.hasOwnProperty(key)){
                            // console.log(record,key)
                            temp2["num"] = record[key]["num"];
                            temp2["interval"] = record[key]["interval"];
                        }
                        else{
                            temp2["num"] = 0;
                            temp2["interval"] = null;
                        }
                        temp1.push(temp2);
                    }
                    temp["numArray"] = temp1;
                    freSetData.push(temp);
                }
                var overallData = [];
                for (var i = 0;i<dataRes["freSetData"].length;i++){
                    var temp = {};
                    temp["name"] = dataRes["freSetData"][i]["WF_name"];
                    temp["num"] = dataRes["freSetData"][i]["total"];
                    overallData.push(temp);
                }
                var data = {};
                data["freSetData"] = freSetData;
                data["overallData"] = overallData;
                freSetGraph.freSet = freSet;
                freSetGraph.srcData = dataRecive;
                freSetGraph.updataView(data);
                console.log(data);
                console.log(dataRecive);
                // console.log(dataRes);
            }
        })
    })
}
freSetView = function(data = null){
    this.srcData = null;
    this.freSet = null;
    this.id = "freSetGraph"
    this.chart = document.getElementById(this.id);
    this.width = this.chart.clientWidth;
    this.height = this.chart.clientHeight;
    this.svg = d3.select("#"+this.id)
                .append("svg")
                .attr("width", this.width)
                .attr("height",this.height);
    var padding = {"left":50,
                "right":100,
                "top":30,
                "bottom":30};
    var yRangeWidth = this.height - padding["top"] - padding["bottom"];
    var xRangeWidth = this.width - padding["left"] - padding["right"];
    this.svg.append("g")
            .attr("class","strackRect");
    this.svg.append("g")
            .attr("class","overallRect");
    var X_axis = this.svg.append("g")
                        .attr("class","axis")
                        .attr("transform","translate(" + padding.left + "," + (this.height - padding.bottom) +  ")")
    var Y_axis = this.svg.append("g")
                        .attr("class","axis")
                        .attr("transform","translate(" + padding.left + "," + (this.height - padding.bottom - yRangeWidth) +  ")");
    this.updataView = function(data, srcData){
        console.log(srcData);
        var freSetData = data["freSetData"];
        var overallData = data["overallData"];
        var stack = d3.layout.stack()
                            .values(function(d){return d["numArray"]})
                            .x(function(d){return d["name"]})
                            .y(function(d){return d["num"]});
        var stackData = stack(freSetData);

        var xScale = d3.scale.ordinal()
                            .domain(stackData[0]["numArray"].map(function(d){
                                return d["name"];
                            }))
                            .rangeBands([0,xRangeWidth]);
        // var maxNum = d3.max(stackData[stackData.length-1]["numArray"],function(d){
        //     return d.y0 + d.y;
        // });
        var maxNum = d3.max(overallData,function(d){return d["num"];});
        var yScale = d3.scale
                        // .log().base(2)
                        .linear()
                        .domain([0,maxNum])
                        .range([0,yRangeWidth]);
        var color = d3.scale.category10();


        // console.log(yScale(5954));

        var groupsStrack = this.svg.selectAll(".strackRect")
                        .selectAll("g").data(stackData);
        groupsStrack.style("fill",function(d,i){return color(i);});               
        groupsStrack.enter()
                    .append("g")
                    .style("fill",function(d,i){return color(i);});
        groupsStrack.exit().remove()
        var rectsStack = groupsStrack.selectAll("rect")
                        .data(function(d){return d["numArray"];})
        rectsStack.attr("x",function(d){return xScale(d["name"])+xScale.rangeBand()/2;})
                .attr("y",function(d){
                    return yRangeWidth - yScale(d.y0 + d.y);
                })
                .attr("width",function(d){
                    return xScale.rangeBand()/4;
                })
                .attr("height",function(d){
                    return yScale(d.y);
                })
        rectsStack.enter()
                .append("rect")
                .attr("x",function(d){return xScale(d["name"])+xScale.rangeBand()/2;})
                .attr("y",function(d){
                    // console.log(d["name"]);
                    return yRangeWidth - yScale(d.y0 + d.y);
                })
                .attr("width",function(d){
                    return xScale.rangeBand()/4;
                })
                .attr("height",function(d){
                    return yScale(d.y);
                })
                .attr("transform","translate(" + padding["left"] + ","
                    + padding["top"] + ")")
                .on("click",function(d){
                    var index = getIndexSelect(ctrlViewGraph.selectSet, freSetGraph.freSet);
                    var maxInterval = getMaxInterval(d["name"]);
                    ctrlViewGraph.selectSet[index]["items"].push([d["name"], maxInterval]);
                    ctrlViewGraph.selectSet[index]["selected"] = "checked";
                    ctrlViewGraph.updataSelectSet();
                });
        rectsStack.exit().remove();
        
        var groupOverall = this.svg.selectAll(".overallRect")
                            .style("fill",function(d,i){return color(i);});
        var rectsOverall = groupOverall.selectAll("rect")
                            .data(overallData)
        rectsOverall.attr("x",function(d,i){return xScale.rangeBand()*(i+0.25);})
                    .attr("y",function(d){
                        return yRangeWidth - yScale(d["num"]);
                    })
                    .attr("width",function(d){
                        return xScale.rangeBand()/4;
                    })
                    .attr("height",function(d){
                        return yScale(d["num"]);
                    });
        rectsOverall.enter()
                    .append("rect")
                    .attr("x",function(d,i){return xScale.rangeBand()*(i+0.25);})
                    .attr("y",function(d){
                        return yRangeWidth - yScale(d["num"]);
                    })
                    .attr("width",function(d){
                        return xScale.rangeBand()/4;
                    })
                    .attr("height",function(d){
                        return yScale(d["num"]);
                    })
                    .attr("transform","translate(" + padding["left"] + ","
                                + padding["top"] + ")")
                    .on("click",function(d){
                        var index = getIndexSelect(ctrlViewGraph.selectSet, freSetGraph.freSet);
                        var maxInterval = getMaxInterval(d["name"]);
                        ctrlViewGraph.selectSet[index]["items"].push([d["name"], maxInterval]);
                        ctrlViewGraph.selectSet[index]["selected"] = "checked";
                        ctrlViewGraph.updataSelectSet();
                    });

        rectsOverall.exit().remove();

        var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
	    yScale.range([yRangeWidth, 0]);
        var yAxis = d3.svg.axis()
					.scale(yScale)
                    .orient("left");
        
        X_axis.call(xAxis);
        Y_axis.call(yAxis); 
        // console.log(stackData);
    }
    var getMaxInterval = function(destName){
        var srcData = freSetGraph.srcData;
        var maxNum = 0;
        var maxInterval = [];
        for(var i = 0; i<srcData.length; i++){
            // console.log(srcData[i][]);
            if(srcData[i]["WF_name"] == destName){
                var keys = Object.keys(srcData[i]);
                for(var i1 = 0; i1<keys.length; i1++){
                    key = keys[i1];
                    if(key.substring(0,4) == "rank" && srcData[i][key]["num"]>maxNum ){
                        maxNum = srcData[i][key]["num"];
                        maxInterval = srcData[i][key]["interval"];
                    }
                }
                break;
            }
        }
        return maxInterval;
    } 
    function getIndexSelect(selectSet, freSet){
        var res = -1;
        for(var i = 0; i < selectSet.length; i++){
            if(freSet == selectSet[i]["freSet"]){
                res = i;
                break;
            }
        }
        return res;
    }
}
ctrlViewGraph = new ctrlView()
overViewGraph = new overView();
freSetGraph = new freSetView();
console.log("here is fresh page!!!");
// temp = []
// temp.push({"freSet": "{'1344A', 'SG_1'}", 
//             "items": "[['1344A', [1, 1]]]"})
// temp.push({"freSet": "{'1344A', 'SG_1', '1039'}", 
//             "items": "[['1344A', [1, 1]]]"})

str = [{'freSet': "{'1344A', 'SG_1'}", 'items': [['1344A', [1, 1]]]}, 
        {'freSet': "{'1344A', 'SG_1', '1039'}", 'items': [['1344A', [1, 1]]]},
        {'freSet': "{'SG_2', '1344A_1_33', '1018A'}", 'items': [['1344A_1_33', [1, 7]]]}
    ]
getOverViewData();

// getFreSetViewData();
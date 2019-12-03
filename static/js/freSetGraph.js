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
                var data = reComputeFreSetData(dataRecive);
                freSetGraph.freSet = freSet;
                freSetGraph.updataView(data);
                // console.log(dataRes);
            }
        })
    })
}
function reComputeFreSetData(srcData){
    var res = [];
    for(var i = 0; i<srcData.length; i++){
        var WF_src = srcData[i];
        var WF_dest = {};
        WF_dest["WF_Name"] = WF_src["WF_name"];
        WF_dest["overallNum"] = WF_src["overallNum"];
        WF_dest["freSetNum"] = WF_src["freSetNum"];
        WF_dest["rate"] = [];
        var overall = WF_src["overall"];
        var freSet = WF_src["freSet"];
        var keys = Object.keys(overall);
        for(var i1 = 0; i1<keys.length; i1++){
            temp = {}
            key = keys[i1];
            var overallPartNum = overall[key]["num"];
            var freSetPartNum = freSet[key]["num"];
            if(overallPartNum == 0){
                temp["overallRate"] = 0;
            }
            else{
                temp["overallRate"] = freSetPartNum / overallPartNum;
            }
            temp["intervalRate"] = freSetPartNum / WF_dest["freSetNum"];
            temp["WF_Name"] = WF_dest["WF_Name"];
            temp["index"] = i1;
            temp["interval"] = freSet[key]["interval"];
            temp["overallNum"] = WF_dest["overallNum"];
            WF_dest["rate"].push(temp);
        }
        res.push(WF_dest);
    }
    res = guaraMinWidth(res);
    console.log(res);
    return res;
}
// 如果小于0.05则画出0.05，如果大于0.05则把剩下的那部分再按比例分配
function guaraMinWidth(srcData){
    for(var i =0; i<srcData.length; i++){
        var rate = srcData[i]["rate"];
        var rateList = [];
        for(var i1 = 0; i1<rate.length; i1++){
            rateList.push(rate[i1]["intervalRate"]);
        }
        rateList.sort(function(a,b){
			return a - b;
        })
        console.log(rateList);
        var tempList = {};
        var total = 1;
        var totalPart = 1;
        var minRate = 0.05;
        for(var i1 = 0; i1<rateList.length; i1++){
            if(rateList[i1]<minRate){
                tempList[(rateList[i1]).toString()] = minRate;
                total -= minRate;
                totalPart -= rateList[i1];
            }
            else{
                tempList[(rateList[i1]).toString()] = total * rateList[i1]/totalPart;
            }
        }
        var x = 0;
        for(var i1 = 0; i1<rate.length; i1++){
            var newRate = tempList[(rate[i1]["intervalRate"]).toString()];
            rate[i1]["x"] = newRate;
            rate[i1]["x0"] = x;
            x += newRate;
        }
        srcData[i]["rate"] = rate;
    }
    return srcData;
}
freSetView = function(data = null){
    // this.srcData = null;
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
            .attr("class","overallRect");
    this.svg.append("g")
            .attr("class","rateRect")
            .attr("transform","translate(" + padding["left"] + ","
                                + padding["top"] + ")");
    this.svg.append("g")
            .attr("class","rateLine")
            .attr("transform","translate(" + padding.left + "," + ( padding.top) +  ")");
    var X_axis = this.svg.append("g")
                        .attr("class","axis")
                        .attr("transform","translate(" + padding.left + "," + (this.height - padding.bottom) +  ")")
    var Y_axis = this.svg.append("g")
                        .attr("class","axis")
                        .attr("transform","translate(" + padding.left + "," + (this.height - padding.bottom - yRangeWidth) +  ")");
    this.updataView = function(data){
        var color = d3.scale.category10();
        var domain = data.map(function(d){
            return d["WF_Name"];
        });
        domain.unshift("overall");
        color.domain(domain);
        var xScale = d3.scale.ordinal()
                    .domain(data.map(function(d){
                        return d["WF_Name"];
                    }))
                    .rangeBands([0,xRangeWidth]);
        var maxNum = d3.max(data,function(d){return d["overallNum"];});
        var yScale = d3.scale.linear()
                            .domain([0,maxNum])
                            .range([0,yRangeWidth]);
        var overallRects = this.svg
                            .select(".overallRect")
                            .selectAll("rect")
                            .data(data);
        overallRects.attr("x",function(d,i){return xScale.rangeBand()*(i+0.25);})
                    .attr("y",function(d){
                        return yRangeWidth - yScale(d["overallNum"]);
                    })
                    .attr("width",function(d){
                        return xScale.rangeBand()/2;
                    })
                    .attr("height",function(d){
                        return yScale(d["overallNum"]);
                    });
        overallRects.enter()
                    .append("rect")
                    .attr("x",function(d,i){return xScale.rangeBand()*(i+0.25);})
                    .attr("y",function(d){
                        return yRangeWidth - yScale(d["overallNum"]);
                    })
                    .attr("width",function(d){
                        return xScale.rangeBand()/2;
                    })
                    .attr("height",function(d){
                        return yScale(d["overallNum"]);
                    })
                    .attr("fill",function(d,i){
                        return color("overall");
                        // return color(0);
                    })
                    .attr("fill-opacity",0.5)
                    .attr("transform","translate(" + padding["left"] + ","
                                + padding["top"] + ")");
        overallRects.exit().remove();
        var rateLinesGs = this.svg
                            .select(".rateLine")
                            .selectAll("g")
                            .data(data)
        rateLinesGs.enter()
                .append("g")
        rateLinesGs.exit().remove()
        var rateLines = rateLinesGs.selectAll("line")
                                .data(function(d){
                                    return d["rate"];
                                });
        rateLines.attr("x1",function(d){
                    var rangeWidth = xScale.rangeBand();
                    var x = d["x"] + d["x0"];
                    return xScale(d["WF_Name"]) + rangeWidth/4 + ((rangeWidth/2) * x);
                })
                .attr("x2",function(d){
                    var rangeWidth = xScale.rangeBand();
                    var x = d["x"] + d["x0"];
                    return xScale(d["WF_Name"]) + rangeWidth/4 + ((rangeWidth/2) * x);
                })
                .attr("y1",function(d){
                    return yRangeWidth - yScale(d["overallNum"]);
                })
                .attr("y2",function(d){
                    return yRangeWidth;
                });
        rateLines.enter()
                .append("line")
                .attr("x1",function(d){
                    var rangeWidth = xScale.rangeBand();
                    var x = d["x"] + d["x0"];
                    return xScale(d["WF_Name"]) + rangeWidth/4 + ((rangeWidth/2) *  x);
                })
                .attr("x2",function(d){
                    var rangeWidth = xScale.rangeBand();
                    var x = d["x"] + d["x0"];
                    return xScale(d["WF_Name"]) + rangeWidth/4 + ((rangeWidth/2) *  x);
                })
                .attr("y1",function(d){
                    console.log(yScale(d["overallNum"]));
                    return yRangeWidth - yScale(d["overallNum"]);
                })
                .attr("y2",function(d){
                    return yRangeWidth;
                })
                .attr("stroke", "black")
                .attr("stroke-width", "1");
        rateLines.exit().remove();
        var rateRectsGs = this.svg
                            .select(".rateRect")
                            .selectAll("g")
                            .data(data);
        rateRectsGs.enter()
                .append("g");
        rateRectsGs.exit().remove();
        var rateRects = rateRectsGs.selectAll("Rect")
                                .data(function(d){
                                    return d["rate"];
                                });

        rateRects.attr("x",function(d,i){
                    console.log(d["x0"]);
                    var rangeWidth = xScale.rangeBand();
                    return xScale(d["WF_Name"]) + rangeWidth/4 + ((rangeWidth/2) *  d["x0"]);
                })
                .attr("y",function(d){
                    return yRangeWidth - yScale(d["overallNum"]) * d["overallRate"];
                })
                .attr("width",function(d){
                    var rangeWidth = xScale.rangeBand();
                    return (rangeWidth/2) * d["x"];
                })
                .attr("height",function(d){
                    return yScale(d["overallNum"]) * d["overallRate"];
                })
                .attr("fill",function(d){
                    return color(d["WF_Name"]);
                });
        rateRects.enter()
                .append("rect")
                .attr("x",function(d,i){
                    var rangeWidth = xScale.rangeBand();
                    return xScale(d["WF_Name"]) + rangeWidth/4 + ((rangeWidth/2) *  d["x0"]);
                })
                .attr("y",function(d){
                    return yRangeWidth - yScale(d["overallNum"]) * d["overallRate"];
                })
                .attr("width",function(d){
                    var rangeWidth = xScale.rangeBand();
                    return (rangeWidth/2) * d["x"];
                })
                .attr("height",function(d){
                    return yScale(d["overallNum"]) * d["overallRate"];
                })
                .attr("fill",function(d,i){
                    return color(d["WF_Name"]);
                })
                .on('mouseover', function (d, i) {
                    return tooltip.style('visibility', 'visible').text(d["interval"]);
                })
                .on('mousemove', function (d, i) {
                    return tooltip.style('top', (event.pageY-10)+'px').style('left',(event.pageX+10)+'px')
                })
                .on('mouseout', function (d, i) {
                    return tooltip.style('visibility', 'hidden')
                })
                .on("click",function(d){
                    var index = getIndexSelect(ctrlViewGraph.selectSet, freSetGraph.freSet);
                    ctrlViewGraph.selectSet[index]["items"].push([d["WF_Name"], d["interval"]]);
                    ctrlViewGraph.selectSet[index]["selected"] = "checked";
                    ctrlViewGraph.updataSelectSet();
                });
        rateRects.exit().remove();

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
    function getIndexSelect(selectSet, freSet){
        var res = -1;
        for(var i = 0; i < selectSet.length; i++){
            if(freSet == selectSet[i]["freSet"]){
                res = i;
                break;
            }
        }
        // 如果发现没有，则将其加入
        if(res == -1){
            var temp = {};
            // console.log(this.freSet);
            temp["freSet"] = freSetGraph.freSet;
            temp["items"] = [];
            temp["selected"] = null;
            ctrlViewGraph.selectSet.push(temp);
            ctrlViewGraph.updataSelectSet();
            res = ctrlViewGraph.selectSet.length-1;
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
let tooltip = d3.select('body')
                .append('div')
                .style('position', 'absolute')
                .style('z-index', '10')
                .style('color', '#3497db')
                .style('visibility', 'hidden')   // 是否可见（一开始设置为隐藏）
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text('');
str = [{'freSet': "{'1344A', 'SG_1'}", 'items': [['1344A', [1, 1]]]}, 
        {'freSet': "{'1344A', 'SG_1', '1039'}", 'items': [['1344A', [1, 1]]]},
        {'freSet': "{'SG_2', '1344A_1_33', '1018A'}", 'items': [['1344A_1_33', [1, 7]]]}
    ]
getOverViewData();

// getFreSetViewData();
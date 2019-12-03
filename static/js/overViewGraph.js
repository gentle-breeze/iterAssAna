function getOverViewData(request = []){
    var svmURL = "/getOverViewData/"
    new Promise(function(resolve, reject) {
        $.ajax({
            type: "post", 
            async: false,
            url: svmURL, 
            data: {
                key: JSON.stringify(request)
            }, 
            dataType: "json",
            success: function(dataRes) {
                overViewGraph.updataView(dataRes["overviewData"]);
                // console.log(dataRes["overviewData"][0]);
                getFreSetViewData(dataRes["overviewData"][0]["freSet"]);
                // overView();
                // console.log(dataRes);
            }
        })
    })
}
overView = function(data = null){
    this.id = "overViewGraph"
    this.chart = document.getElementById(this.id);
    // this.chart = d3.select("#overViewGraph");
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
    var xRangeWidth = this.width - padding["left"] - padding["right"];
    var yRangeWidth = this.height - padding["top"] - padding["bottom"];
    var X_axis = this.svg.append("g")
                    .attr("class","axis")
                    .attr("transform","translate(" + padding.left + "," + (this.height - padding.bottom) +  ")");
    var Y_axis = this.svg.append("g")
                    .attr("class","axis")
                    .attr("transform","translate(" + padding.left + "," + (this.height - padding.bottom - yRangeWidth) +  ")");
    this.updataView = function(data){
        

        var minX = d3.min(data,function(d){return d["MDS"][0];});
        var maxX = d3.max(data,function(d){return d["MDS"][0];});

        var minY = d3.min(data,function(d){return d["MDS"][1];});
        var maxY = d3.max(data,function(d){return d["MDS"][1];});

        var minSupp = d3.min(data,function(d){return d["support"];});
        var maxSupp = d3.max(data,function(d){return d["support"];});

        var maxCon = d3.rgb(255,0,0);	//红色
        var minCon = d3.rgb(255,255,255);	//绿色

        var scaleX = d3.scale.linear()
                            .domain([minX,maxX])
                            .range([0,xRangeWidth]);
        var scaleY = d3.scale.linear()
                            .domain([maxY,minY])
                            .range([0,yRangeWidth]);
        var scaleSupp = d3.scale.linear()
                            .domain([minSupp,maxSupp])
                            .range([5,20]);
        var scaleCon = d3.interpolate(minCon,maxCon);
        // var scaleCon = d3.interpolateReds;
        
        var svg = this.svg;
        var updata = svg.selectAll("circle")
                        .data(data);
        
        updata.attr("cx",function(d){
            return scaleX(d["MDS"][0]);
        })
        .attr("cy",function(d){
            return scaleY(d["MDS"][1]);
        })
        .attr("r",function(d){
            return scaleSupp(d["support"]);
        })
        .attr("fill",function(d){
            return scaleCon(d["confid"]);
        })
        .attr("transform","translate(" + padding["left"] + ","
                            + padding["top"] + ")");
        // .on('mouseover', function (d, i) {
        //     return tooltip.style('visibility', 'visible').text(d["freSet"])
        // })
        // .on('mousemove', function (d, i) {
        //     return tooltip.style('top', (event.pageY-10)+'px').style('left',(event.pageX+10)+'px')
        // })
        // .on('mouseout', function (d, i) {
        //     return tooltip.style('visibility', 'hidden')
        // });
        updata.enter()
            .append("circle")
            .attr("cx",function(d){
                return scaleX(d["MDS"][0]);
            })
            .attr("cy",function(d){
                return scaleY(d["MDS"][1]);
            })
            .attr("r",function(d){
                return scaleSupp(d["support"]);
            })
            .attr("fill",function(d){
                return scaleCon(d["confid"]);
            })
            .attr("transform","translate(" + padding["left"] + ","
                                            + padding["top"] + ")")
            .on('mouseover', function (d, i) {
                return tooltip.style('visibility', 'visible').text(d["freSet"])
            })
            .on('mousemove', function (d, i) {
                return tooltip.style('top', (event.pageY-10)+'px').style('left',(event.pageX+10)+'px')
            })
            .on('mouseout', function (d, i) {
                return tooltip.style('visibility', 'hidden')
            })
            .on("click",function(d,i){
                getFreSetViewData(d["freSet"]);
                var temp = {};
                temp["freSet"] = d["freSet"];
                temp["items"] = [];
                temp["selected"] = null;
                ctrlViewGraph.selectSet.push(temp);
                ctrlViewGraph.updataSelectSet();
            });
      
        updata.exit().remove();
        var xAxis = d3.svg.axis()
                    .scale(scaleX)
                    .orient("bottom");
        scaleY.range([yRangeWidth, 0]);
        var yAxis = d3.svg.axis()
					.scale(scaleY)
                    .orient("left");
        // console.log("here1");
        X_axis.call(xAxis);          
        Y_axis.call(yAxis);
    }
}


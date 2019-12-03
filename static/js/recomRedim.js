function updataRecomRedimGra(){
    var zoom = d3.behavior.zoom()
            .x(reRedimAxisX)
            .y(reRedimAxisY)
            .scaleExtent([0.1, 10]).on("zoom", zoomed);
    var width = d3.select("#recomRecomRedim")
            .select("svg")
            .attr("width");
    var height = d3.select("#recomRecomRedim")
            .select("svg")
            .attr("height");
    var xAxis = d3.svg.axis()
            .scale(reRedimAxisX)
            .orient("bottom")
            .ticks(10)
            .tickSize(-height);
    var yAxis = d3.svg.axis()
            .scale(reRedimAxisY)
            .orient("left")
            .ticks(10)
            .tickSize(-width);

    function zoomed() {
        console.log("here is zoom")
        graSvg.attr("transform",
        "translate(" + zoom.translate() + ")" +
        "scale(" + zoom.scale() + ")"
        );
        graSvg1.select(".x.axis").call(xAxis);
        graSvg1.select(".y.axis").call(yAxis);
    }
    // 后面添加的那个G可以有效解决抖动问题 
    var graSvg1 = d3.select("#recomRecomRedim")
                    .select(".totalSvg")
                    .call(zoom);
    graSvg1.select("rect")
            .attr("x",recReMargin["left"])
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "none")
            .attr("pointer-events", "all");            
    graSvg = graSvg1
            .select(".circleG");
    graSvg1.select(".x.axis")
            .attr("transform", "translate(0," + (height) + ")")
            .call(xAxis);
    graSvg1.select(".y.axis")
            .attr("class", "y axis") 
            .attr("transform", "translate("+recReMargin["left"]+",0)")
            .call(yAxis);
    
    var gra = graSvg.selectAll("circle")
                .data(recomRedimData);
    gra.attr("cx",function(d){
        return reRedimAxisX(d.x)
    })
    .attr("cy",function(d){
        return reRedimAxisY(d.y)
    })
    .attr("r",6)
    .attr("fill",function(d,i){
        return colorRedim[d["category"]];
    });
    gra.enter()
    .append("circle")
    .attr("cx",function(d){
        console.log(d["x"]);
        return reRedimAxisX(d["x"]);
    })
    .attr("cy",function(d){

        return reRedimAxisY(d["y"]);
    })
    .attr("r",6)
    .attr("fill",function(d,i){
        return colorRedim[d["category"]];
    })
    .on("mouseover",function(d){
        // console.log("here is mouseover");
        scrollToRecomPos(d["better"],d["worse"]);
    });
    gra.exit().remove();
    
}
function updateRecomDisGra(id,data,text){
    var width = d3.select("#"+id).attr("width");
    var height = d3.select("#"+id).attr("height");
    if(width == 0){
        width = 50;
    }
    d3.select("#"+id)
        .append("svg")
        .style("background-color","white")
        .attr("transform","translate(15,15)")
        .attr("width",width-25)
        .attr("height",height-25);
    var eachWidth = (width)/data.length-2;
    var svg = d3.select("#"+id).select("svg");
    var rects = svg.selectAll("rect")
                .data(data);
    rects.enter()
        .append("circle")
        .attr("r",6)
        .attr("cy",function(d,i){
            return redisAxisY(d["coor"][0]);
        })
        .attr("cx",function(d,i){
            return redisAxisX(d["coor"][1]);
        })
        .style("fill",function(d){
            console.log(d["score"]);
            return colorRecomDis(1-d["score"]);
        })
        .on("mouseover",function(d,i){
            console.log(d["better"],d["worse"]);
            scrollToRecomPos(d["better"],d["worse"]);
        });
    // rects.attr("width",eachWidth)
    //     .attr("height",height-50)
    //     .attr("y",50)
    //     .attr("x",function(d,i){
    //         return i*(eachWidth+1);
    //     })
    //     .style("fill",function(d){
    //         console.log(d["score"]);
    //         return colorRecomDis(1-d["score"]);
    //     });
    // rects.exit().remove();
    // d3.select("#"+id)
    //     .select("svg")
    //     .append("text")
    //     .text(text)
    //     .attr("x",5)
    //     .attr("y",15)
    //     .style("fill","red")
    //     .style("font-size",15);
}
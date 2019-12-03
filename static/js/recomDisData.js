var reDisWidth = document.getElementById("recomDis").clientWidth;
var reDisHeight =document.getElementById("recomDis").clientHeight;
var colorRecomDis = d3.interpolateRdYlBu;
var textArray = ["低到中","中到高","低到高"];
var redisAxisX = d3.scale.linear()
                .domain([0, 1])
                .range([35, reDisWidth/2-90]);
var redisAxisY = d3.scale.linear()
                .domain([0, 1])
                .range([reDisHeight/2-30,25]);
// d3.select("#recomDis")
//     .select("svg")
//     .attr("fill","black")
//     .attr("width",reDisWidth)
//     .attr("height",reDisHeight);
function getRecomDisData(){
    var svmURL = "/getRecomDisData/"
    console.log("here is recomDisDara");
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
                console.log("here is recomDisDATA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                console.log(dataRes["recomData"]);
                var data = dataRes["recomData"];
                var count = data.length;
                var showData = getRecomDisShowData(data);
                recomDisGra(showData,count);
                // updateRecomDisGra(data);
            }
        })
    })
}
// getRecomDisData();
function recomDisGra(data,countSrc){
    d3.select("#recomDis")
    .selectAll("svg")
    .remove();
    d3.select("#totalRecomDisSVG")
    .selectAll("line")
    .remove()
    console.log(data);
    var margin=10;
    var padding = 2;
    var eachWidth = (reDisWidth - margin*2*(data.length))/countSrc;
    var svg =d3.select("#recomDis")
        .append("svg")
        .attr("id","totalRecomDisSVG")
        .attr("width",reDisWidth)
        .attr("height",reDisHeight);
    svg.append("text")
        // .attr("x",reDisWidth/2-18)
        .attr("x",reDisWidth/4)
        // .attr("y",reDisHeight/2-5)
        .attr("y",15)
        .text("低危车辆")
        .style("fill","red")
        .style("font-size",15);
    svg.append("text")
        // .attr("x",reDisWidth/2+3)
        // .attr("y",reDisHeight/2-5)
        .attr("x",reDisWidth/4*3)
        .attr("y",15)
        .text("中危车辆")
        .style("fill","red")
        .style("font-size",15);
    svg.append("text")
        // .attr("x",reDisWidth/2-18)
        // .attr("y",reDisHeight/2+15)
        .attr("x",15)
        .attr("y",reDisHeight/4*3-reDisHeight/8)
        .text("高危车辆")
        .style("fill","red")
        .style("font-size",15)
        .style("transform","rotate(90deg)")
        .style("transform-origin","15px "+(reDisHeight/4*3-reDisHeight/8)+"px");
    svg.append("text")
        // .attr("x",reDisWidth/2+3)
        // .attr("y",reDisHeight/2+15)
        .attr("x",15)
        .attr("y",reDisHeight/4-reDisHeight/8)
        .text("中危车辆")
        .style("fill","red")
        .style("font-size",15)
        .style("transform","rotate(90deg)")
        .style("transform-origin","15px "+(reDisHeight/4-reDisHeight/8)+"px");;
    svg.append("text")
        // .attr("x",reDisWidth/2+3)
        // .attr("y",reDisHeight/2+15)
        .attr("x",20+reDisWidth/2)
        .attr("y",reDisHeight/4)
        .attr("id","accuRate")
        .text("模型一致度:"+accuRate1+"%")
        .style("fill","red")
        .style("font-size",40);
    svg.append("line")
        .style("stroke", "rgb(99,99,99)")
        .attr("x1", 10)
        .attr("x2", reDisWidth)
        .attr("y1", reDisHeight/2)
        .attr("y2", reDisHeight/2);
    svg.append("line")
        .style("stroke", "rgb(99,99,99)")
        .attr("x1", reDisWidth/2)
        .attr("x2", reDisWidth/2)
        .attr("y1", 0)
        .attr("y2", reDisHeight-10);
        
    for(var i =0; i<data.length; i++){
        var count = data[i].length;
        var divWidth = eachWidth * count
        d3.select("#totalRecomDisSVG")
        .append("g")
        // .append("div")
        .attr("transform", function(d){
            var left = (i)%2;
            var top = Math.ceil((i)/2);
            console.log(left,top)
            return "translate(" + (left*reDisWidth/2) + "," + (top*reDisHeight/2) + ")";
        })
        .attr("id","svg"+i)
        .style("padding",margin+"px")
        .style("float","right")
        .attr("width",reDisWidth/2)
        .attr("height",reDisHeight/2);
        updateRecomDisGra("svg"+i,data[i],textArray[i]);
    }
}
function getRecomDisShowData(data){
    // var category = 0;
    resData = Array(3)
    resData[0]=[];
    resData[1]=[];
    resData[2]=[];
    for(var i = 0; i<data.length; i++){
        resData[data[i]["category"]].push(data[i]);
    }
    console.log(resData);
    return resData;
}
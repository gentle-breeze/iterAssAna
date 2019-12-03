var recomRedimData = [];
var reRedimWidth = document.getElementById("recomRecomRedim").clientWidth;
var reRedimHeight =document.getElementById("recomRecomRedim").clientHeight
recReMargin={
    top:40,
    bottom:40,
    left:40,
    right:40,
}
d3.select("#recomRecomRedim")
    .select("svg")
    .attr("width",reRedimWidth-recReMargin["left"]-recReMargin["right"])
    .attr("height",reRedimHeight-recReMargin["top"]-recReMargin["bottom"]);
var reRedimSVG = d3.select("#recomRecomRedim")
                    .select("svg")
                    .append("g")
                    .attr("class","totalSvg");
reRedimSVG.append("rect");
reRedimSVG.append("g").attr("class", "circleG");
reRedimSVG.append("g").attr("class", "x axis");
reRedimSVG.append("g").attr("class", "y axis") 
var colorRedim = ["green","blue","red"];
var reRedimAxisX = d3.scale.linear()
                .domain([0, 1])
                .range([recReMargin["left"], reRedimWidth-recReMargin["left"]-recReMargin["right"]]);
var reRedimAxisY = d3.scale.linear()
                .domain([0, 1])
                .range([reRedimHeight-recReMargin["top"]-recReMargin["bottom"], recReMargin["top"]]);
function getRecomRedimData(){
    var svmURL = "/getRecomRedimData/"
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
                var data1 = dataRes["data"];
                var coor = data1;
                console.log(coor);
                getRecomScatterData(coor);
                updataRecomRedimGra();
                // console.log(recomData);
            }
        })
    })
}
function getRecomScatterData(coors){
    console.log("here is  recomScatterData!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    for(var i = 0;i<coors.length;i++){
        var coor = coors[i]["coor"];
        console.log(coor)
        temp = {};
        temp["x"] = coor[0];
        temp["y"] = coor[1];
        temp["better"] = coors[i]["better"];
        temp["worse"] = coors[i]["worse"];
        console.log(coors[i]["category"]);
        temp["category"] = coors[i]["category"];
        recomRedimData.push(temp);
    }
}
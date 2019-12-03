ctrlView = function(){
    this.id = "freSetCtrlPanel"
    this.selectSet = [];
    this.chart = document.getElementById(this.id)
    this.width = this.chart.clientWidth;
    this.height = this.chart.clientHeight;
    this.selectList = d3.select("#"+this.id)
                        // .append("form");
    this.selectList.append("g")
                .attr("class","selectList")
                // .attr("action","")
                // .attr("method","get");
    this.selectList.append("g")
                    .append("input")
                    .attr("type", "submit")
                    .attr("value","提交")
                    .on("click",function(d){
                        var request = [];
                        for(var i = 0; i<ctrlViewGraph.selectSet.length; i++){
                            var temp = ctrlViewGraph.selectSet[i];
                            if(temp["selected"]!=null){
                                var each = {};
                                console.log(temp["freSet"]);
                                each["freSet"] = temp["freSet"];
                                each["items"] = temp["items"];
                                request.push(each)
                            }
                        }
                        getOverViewData(request);
                    });
    this.updataSelectSet = function(data = this.selectSet){
        console.log(data);
        var showlist = d3.select(".selectList")
                    .selectAll("p")
                    .data(data);
        showlist.enter()
                .append("p")
                .text(function(d){
                    var res = d["freSet"];
                    var items = d["items"];
                    for(var i = 0; i<items.length; i++){
                        res += (" " + items[i]);
                    }
                    return res;
                });
        showlist.text(function(d){
                    var res = d["freSet"];
                    var items = d["items"];
                    console.log(res,items);
                    for(var i = 0; i<items.length; i++){
                        res += (" " + items[i]);
                    }
                    return res;
                });
        showlist.exit().remove();

        showlist.select("input").remove();
        showlist.append("input")
                .attr("type","checkbox")
                .attr("checked",function(d){
                    return d["selected"];
                });
    }

}
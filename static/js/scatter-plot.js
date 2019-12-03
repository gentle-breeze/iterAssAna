
registerKeyboardHandler = function(callback) {
  var callback = callback;
  d3.select(window).on("keydown", callback);  
};

SimpleGraph = function(elemid, data, options) {
  var self = this;
  this.chart = document.getElementById(elemid);
  this.cx = this.chart.clientWidth-100;
  // this.cy = this.chart.clientHeight;
  var totalHeight = d3.select("#totalClassifyGraph").attr("height")
  this.cy = totalHeight;
  d3.select("#"+elemid).attr("height",totalHeight)
  console.log(this.chart.clientWidth);
  console.log(totalHeight);
  // this.cx = 480;
  // this.cy = 500;
  this.options = options || {};
  this.points = data;
  this.padding = {
      "top":    0,
      "right":  0,
      "left":   30,
      "bottom": 20,
  };
  this.size = {
    "width":  this.cx - this.padding.left - this.padding.right,
    "height": this.cy - this.padding.top  - this.padding.bottom
  };
  console.log(this.size);
  if (this.options.flag==true) {
  this.options.xmax = d3.max(data, function(d) { return +d["x"]; }) 
  this.options.xmin = d3.min(data, function(d) { return +d["x"]; }) 
  this.options.ymax = d3.max(data, function(d) { return +d["y"]; }) 
  this.options.ymin = d3.min(data, function(d) { return +d["y"]; }) 
  }
  else{
    this.options.xmax = options.xmax;
    this.options.xmin = options.xmin;
    this.options.ymax = options.ymax;
    this.options.ymin = options.ymin;
  }
  // SimpleGraph.prototype.
  this.dragged = this.selected = null;
  // this.updateAxis(this.options.xmax,this.options.xmin,this.options.ymax,this.options.ymin);
  //初始化界面
  console.log(this.cx);
  console.log(this.cy);
  console.log(this.options.init);
  this.SC = d3.select(this.chart).select("svg")
  .attr("width", this.size.width-20)
  .attr("height", this.size.height+30);
  console.log(this.SC);
  this.vis = this.SC.append("g")
        .attr("id", "SC")
        .attr("transform", "translate(" + this.padding.left + "," + this.padding.top + ")")
        .attr("background","#EEEEEE");
  // this.plot = this.vis.append("rect")
  //     .attr("width", this.size.width)
  //     .attr("height", this.size.height)
  //     .style("fill", "#EEEEEE")
  //     .attr("pointer-events", "all")
  console.log(this.vis);
  this.vis.call(d3.behavior.zoom().x(xAxis).y(yAxis).on("zoom", this.redraw()));
  this.SC.call(d3.behavior.zoom().x(xAxis).y(yAxis).on("zoom", this.redraw()));
  console.log(this.size.height);
  this.vis.append("svg")
      .attr("width", this.size.width)
      .attr("height", this.size.height)
      .attr("viewBox", "0 0 "+(this.size.width)+" "+(this.size.height));

  // d3.selectAll(".readData1")
  //     .on("click",function(){
  //         temp=d3.select(this).attr("value");
  //         console.log("here")
  //         if(temp == "markData"){
  //           console.log("here")
  //           TypeOfSign = 0;
  //         } 
  //         else if(temp == "classData"){
  //           TypeOfSign = 1;
  //           console.log("here")
  //         }
  //         else if(temp == "NormData"){
  //           TypeOfSign = 2;
  //           console.log("here")
  //         } 

  //         graph.update();
  //     })

      

  // d3.selectAll(".inputInfo1")
  //     .on("click",function(){
  //         temp=d3.select(this).attr("value");
  //          updatebychoice("高危")
  //         if(temp == "markDanger"){
  //           updatebychoice("高危")
  //         }
  //         else if(temp == "markSafe"){
  //           updatebychoice("低危")
  //         } 
  //         else if(temp == "markRisk"){
  //           updatebychoice("中危")
  //         }
  //         else if(temp == "cancelMark"){
  //           updatebychoice("取消标记")
  //         }
  //         graph.update();
  //     })
      
  d3.selectAll(".inputInfo2")
      .on("click",function(){
          temp=d3.select(this).attr("value");
          if(temp == "showSyb"){
            showSyb("显示符号")
          }
          else if(temp == "donotShowSyb"){
            donotShowSyb("不显示符号")
          } 
          graph.update();
      })  

  d3.select(this.chart)
      .on("mouseup.drag",   self.mouseup())
      .on("touchend.drag",  self.mouseup());
  this.redraw()();
};

//更新图
SimpleGraph.prototype.update = function() {
  var self = this;
  console.log("here is update");
  // console.log(this.points)
  var symbols = this.vis.select("svg").selectAll("path").data(loaddata);
  symbols.enter().append("path")
      .attr("transform",function(d,i){
        // console.log(d["x"]);
        var x1 = xAxis(d["x"]);
        var y1 = yAxis(d["y"]);
        return "translate(" + x1 +"," + y1+")";
      })
      .attr("id",function(d,i){
        return "symbol"+d["ID"];
      })
      .attr("d",symbol)
      .attr("fill",function(d,i){
        // if(d["recomRes"]==1){
        //   return "black";
        // }
        var tempOfDataSign;
        if(TypeOfSign ==0){
          console.log("TypeOfSign ==0")
          tempOfDataSign = d["markRes"];
        }
        else if(TypeOfSign ==1){
          console.log("TypeOfSign ==1")
          tempOfDataSign = d["classifyRes"];
        }
        // else{
        //   console.log("TypeOfSign ==2")
        //   tempOfDataSign = d["标注"]
        // }
        if (tempOfDataSign == 2){
          return "red";
        }
        else if(tempOfDataSign == 1){
          return "yellow";
        }
        else if(tempOfDataSign == 0){
          return "green";
        }
        else{
          return "rgba(3, 213, 250, 0.8)";
          }
        })
        .style("opacity",function(d){
          if((d["classifyRes"]!=-1)&&(TypeOfSign==1)){
            return 1;
          }
          else if((d["markRes"]!=-1)&&(TypeOfSign==0)){
            return 1
          }
          else if(d["recomRes"]!=-1){
            return 1;
          }
          else{
            return 0.5;
          }
          // 有标注的情况
          // if(d["classifyRes"]!=d["标注"]){
          //   return 1;
          // }
          // else{
          //   return 0.5
          // }
        })
      .attr("stroke","black")
      // .attr("stroke-width",function(d){
      //   if(d["recomRes"]==1){
      //    return 4;
      //   }
      //   // if(d["classifyRes"]!=d["标注"]){
      //   //   return 4;
      //   // }
      //   // else return 1;
      // })
      .on("mouseover", function(d,i) {//mouseover：光标放在某元素上。
        // console.log(d["ID"]);
        scrollToPos(d["ID"]);
        tabulate(d);//显示元素右侧属性栏
        d3.select("#DROP").selectAll("circle").filter(function(c) {return c==d;}).attr("class", "highlighted");
      })
      .on("mouseout", function(d) {//mouseout：光标从某元素上移出来时。
        d3.select("#DROP").selectAll("path").filter(function(c) {return c==d;}).attr("class", null);
      })
      .on("click", function(d,i){tabulate(d,"click"); sglclick(d)})
//      .on("dblclick", function(d){dblclick(d)})  
      .on("mousedown.drag",  self.datapoint_drag())//mousedown：鼠标按钮被按下。
      .on("touchstart.drag", self.datapoint_drag());

    symbols
    .attr("d",symbol)
    .attr("fill",function(d,i){
      // if(d["recomRes"]==1){
      //   return "black";
      // }
      var tempOfDataSign;
      if(TypeOfSign ==0){
        tempOfDataSign = d["markRes"]
      }
      else if(TypeOfSign ==1){
        tempOfDataSign = d["classifyRes"]
      }
      // else{
      //   tempOfDataSign = d["标注"]
      // }
      // console.log(TypeOfSign);
      // console.log(tempOfDataSign);
      if (tempOfDataSign == 2){
        return "red";
      }
      else if(tempOfDataSign == 1){
        return "yellow";
      }
      else if(tempOfDataSign == 0){
        return "green";
      }
      else{
        return "rgba(3, 213, 250, 0.8)";
        }
     
      })
    .attr("id",function(d,i){
        return "symbol"+d["ID"];
      })
    // .attr("stroke-width",function(d){
    //   if(d["recomRes"]==1){
    //     return 4;
    //   }
    //   // if(d["classifyRes"]!=d["标注"]){
    //   //   return 4;
    //   // }
    //   // else return 1;
    // })
    .style("opacity",function(d){
      if((d["classifyRes"]!=-1)&&(TypeOfSign==1)){
        return 1;
      }
      else if((d["markRes"]!=-1)&&(TypeOfSign==0)){
        return 1
      }
      else if(d["recomRes"]!=-1){
        return 1;
      }
      else{
        return 0.5;
      }
      // 有标注的情况
      // if(d["classifyRes"]!=d["标注"]){
      //   return 1;
      // }
      // else{
      //   return 0.5
      // }
    })
    .attr("transform",function(d,i){
      var x1 = xAxis(d["x"]);
      var y1 = yAxis(d["y"]);
      return "translate(" + x1 +"," + y1+")";
    })
  choiceClick = false;
  // console.log(choiceClick);
  symbols.exit().remove();

  if (d3.event && d3.event.keyCode) {
    d3.event.preventDefault();
    d3.event.stopPropagation();
  }
}

selectShowRes = function(res){
  if(res == "用户的标记"){
    console.log("here")
    TypeOfSign = 0;
  } 
  else if(res == "自动分类的结果"){
    TypeOfSign = 1;
    console.log("here")
  }
  else if(res == "标注结果"){
    TypeOfSign = 2;
    console.log("here")
  } 

  graph.update();
}
isShowSyb = function(d){
  if(d == "显示符号"){
    showSymbol = true;
  }
  else{
    showSymbol = false;
  }
  graph.update();
}
// showSyb = function(d){
  
//   graph.update();
// }


sglclick = function(d) {
  if (x0!=d) {
    x0old = x0;
    x0 = d;
  }
};


//拖动数据点,鼠标点击点时响应
SimpleGraph.prototype.datapoint_drag = function() {
  choiceClick  = true;
  var self = this;
  return function(d,index) {
    // 0为低危；1为中危；2为高危
    d["markRes"] = choice_num;
    // if(d["recomRes"] == 1){
    //   d["recomRes"] = -1;
    // }
    console.log(choice_num);
    console.log("datapoint_drag");
    registerKeyboardHandler(self.keydown());
    document.onselectstart = function() { return false; };
    numIndex = index;
    self.selected = self.dragged = d;
    self.dragged.oldy = d.y;
    self.dragged.oldx = d.x;
    self.update();
  }
};

//鼠标将点拖到矩形内,mouseup：鼠标按钮被松开。
SimpleGraph.prototype.mouseup = function() {
  var self = this;
  return function() {
    document.onselectstart = function() { return true; };
    console.log("here is mouseup")
    d3.select('body').style("cursor", "auto");
    d3.select('body').style("cursor", "auto");
    if (self.dragged) { 
      self.dragged.y = self.dragged.oldy;
      self.dragged.x = self.dragged.oldx;
      self.dragged = null;
      self.redraw()();
    }
  }
}

//选择标注车辆类型
updatebychoice = function(choice){
  for(var i =0;i<choice_che.length;i++){
    if(choice=="取消标记"){
      choice_num = -1;
      break;
    }
    if(choice==choice_che[i]){
      choice_num = i;
    }
  }
  
}

//这是删除选中的数据点
SimpleGraph.prototype.keydown = function() {
  var self = this;
  return function() {
    if (!self.selected) return;
    switch (d3.event.keyCode) {
      case 8: // backspace
      case 46: { // delete
        var i = self.points.indexOf(self.selected);
        self.points.splice(i, 1);
        self.selected = self.points.length ? self.points[i > 0 ? i - 1 : 0] : null;
        self.update();
        break;
      }
    }
  }
};

SimpleGraph.prototype.redraw = function() {
   console.log("here is redraw");
  var self = this;
  return function() {
    console.log("here is redraw1");
    var tx = function(d) { 
      return "translate(" + xAxis(d) + ",0)";
    },
    ty = function(d) { 
      return "translate(0," + yAxis(d) + ")";
    },
    stroke = function(d) {
      return d ? "#ccc" : "#666"; 
    },
    fx = xAxis.tickFormat(10),
    fy = yAxis.tickFormat(10);

    // Regenerate x-ticks…
    var gx = self.vis.selectAll("g.x")
        .data(xAxis.ticks(10), String)
        .attr("transform", tx);

    gx.select("text")
        // .text("here");
        .text(fx);

    var gxe = gx.enter().insert("g", "a")
        .attr("class", "x")
        .attr("transform", tx);

    gxe.append("line")
        .attr("stroke", stroke)
        .attr("y1", 0)
        .attr("y2", self.size.height);

    gxe.append("text")
        .attr("class", "axis")
        .attr("y", self.size.height)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text(fx)
        .style("cursor", "ew-resize")
        .on("mouseover", function(d) { d3.select(this).style("font-weight", "bold");})
        .on("mouseout",  function(d) { d3.select(this).style("font-weight", "normal");})
    gx.exit().remove();

    // Regenerate y-ticks…
    var gy = self.vis.selectAll("g.y")
        .data(yAxis.ticks(10), String)
        .attr("transform", ty);

    gy.select("text")
        .text(fy);

    var gye = gy.enter().insert("g", "a")
        .attr("class", "y")
        .attr("transform", ty)
        .attr("background-fill", "#FFEEB6");

    gye.append("line")
        .attr("stroke", stroke)
        .attr("x1", 0)
        .attr("x2", self.size.width-20);
    gye.append("text")
        .attr("class", "axis")
        .attr("x", -3)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(fy)
        .style("cursor", "ns-resize")
        .on("mouseover", function(d) { d3.select(this).style("font-weight", "bold");})
        .on("mouseout",  function(d) { d3.select(this).style("font-weight", "normal");});
    gy.exit().remove();
    self.vis.call(d3.behavior.zoom().x(xAxis).y(yAxis).on("zoom", self.redraw()));
    self.SC.call(d3.behavior.zoom().x(xAxis).y(yAxis).on("zoom", self.redraw()));
    self.update();
  }  
}


//车辆类型选择
updatebycb = function(selectedattr) {
  console.log("here is updatebycb");
    typeOfVehi = selectedattr;
    updateScatGra();
    graph.update();
}

linkTypeOfCar = function(sendData){
  new Promise(function(resolve, reject){
    console.log("here is TypeOfCar")
    var svm = "/TypeOfCar/";
    $.ajax({
      type: "post", 
      async: false,
        url: svm,
      data: {
            key: JSON.stringify(sendData)
        }, 
        dataType: "json",
        success: function(data) {
          // console.log(data);
          loaddata = data["nowData"];
          // loaddata = res;
          console.log(loaddata);
          // console.log(loaddata[i]["raw"]);
          // console.log(loaddata);
        },
        error: function(error) {
          console.log(error);
        }
      });
    });
  }

// 选择降维方法
// 再从后台拿数据
// 更新坐标轴之后更新图
updatabycby = function(select){
  console.log("here is updatabycby");
  if(select == attrTable2[0]){
    methodRedim = "tsne";
  }
  else if(select == attrTable2[1]){
    methodRedim = "LDA";
  }
  updateScatGra();
  // updateAxis();
  graph.update();
}
function updateShowScatter(){
  updateScatGra();
  graph.update();
}
// 根据发送的参数来决定从后台拿什么样的数据
function updateScatGra(){
  new Promise(function(resolve, reject){
    console.log("here is TypeOfCar")
    var svm = "/TypeOfCar/";
    $.ajax({
      type: "post", 
      async: false,
        url: svm,
      data: {
            "methodRedim":JSON.stringify(methodRedim),
            "typeOfVehi": JSON.stringify(typeOfVehi),
        }, 
        dataType: "json",
        success: function(data) {
          loaddata = data["nowData"];
          console.log(loaddata);
          loaddata.forEach(function(d) {
            if((typeof(d["raw"])=='string')&&d["raw"].constructor==String){
              d["raw"] = JSON.parse(d["raw"]);
            }
              d.x = d["raw"][0];
              d.y = d["raw"][1];
          });
        },
        error: function(error) {
          console.log(error);
        }
      });
    });
}
//这个函数是针对于右侧展示的表格的
function tabulate(dataitem, option) {
  console.log("here is tabulate")
  var tid = "#datapanel";
  d3.select(tid).selectAll("table").remove();

  var columns = [dataitem["XH"],""];
  
  var table = d3.select(tid).append("table")
          // .attr("style", "margin-left: 5px"),
      thead = table.append("thead"),
      tbody = table.append("tbody");
      

  // append the header row
  thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
          .text(function(column) { return column; });
  var height = 380/attrTotal.length;
  // console.log(height);
  var data = [];
  columns = ["key", "value"];
  for (var i = 0; i<attrNoTotal; i++) {
      var item = {"key":null, "value":null};
      item["key"] = attrTotal[i];
      item["value"] = dataitem["detail"][attrTotal[i]];
      data[i] = item;
  }

  // create a row for each object in the data
  var rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr");

  // create a cell in each row for each column
  var cells = rows.selectAll("td")
      .data(function(row) {
          return columns.map(function(column) {
              return {column: column, value: row[column]};
          });
      })
      .enter()
      .append("td")
      .html(function(d) { 
        var res = "";
        if(parseFloat(d.value).toString()== "NaN"){
          res = d.value;
        }
        else{
          res = parseFloat(d.value).toFixed(2);
        }
        return res });
  d3.select(tid).selectAll("td")
  .style("width", 30)
  .style("height", height)
  .style("font-size","10px");
  return table;
}
function getSymbolData(){
  resSymbol = [];
  for(var i = 0; i<loaddata.length;i++){
    if(loaddata[i].classify==1){
      res.push(loaddata[i]);
    }
  }
  return resSymbol;
}

linkJs = function(){
  var flags = [];
  for(var i =0;i<loaddata.length;i++){
    temp={};
    temp["ID"] = loaddata[i]["ID"];
    temp["markRes"] = loaddata[i]["markRes"];
    temp["classifyRes"] = loaddata[i]["classifyRes"];
    temp["recomRes"] = loaddata[i]["recomRes"];
    flags.push(temp);
  }
new Promise(function(resolve, reject){
  var svm = "/svm/";
  $.ajax({
    type: "post", 
    async: false,
      url: svm, 
    data: {
          // key: JSON.stringify(addNewData()),
          "methodRedim":JSON.stringify(methodRedim),
          "typeOfVehi": JSON.stringify(typeOfVehi),
          "flags":JSON.stringify(flags),
      }, 
      
      dataType: "json",
      success: function(data) {
        loaddata = data["nowData"];
        loaddata.forEach(function(d) {
          d.x = d["raw"][0];
          d.y = d["raw"][1];
        });
        graph.update();
        res = data["flags"]
        updataAllView(res);
        accuRate();
        // getDiffDegree();
      },
      error: function(error) {
        console.log(error);
      }
    });
  });
}

linkJsTSNE = function(){
  new Promise(function(resolve, reject){
    console.log("here is tsne")
    var svm = "/TSNE/";
    $.ajax({
      type: "post", 
      async: false,
        url: svm,
      data: {
            key: JSON.stringify()
        }, 
        dataType: "json",
        success: function(data) {
          // console.log(data);
          res = data["temp"]
          listFiles = data["filesName"]
          selectFiles = d3.select("#selectLoadFile")
                        .selectAll("option")
                        .data(listFiles);
          selectFiles.attr("value",function(d){return d;})
                    .text(function(d) {return d;});
          selectFiles.enter()
                    .append("option")
                    .attr("value", function(d) {
                      // if (d != "降维方法") 
                      return d;
                    })
                    .text(function(d) { return d;});
          selectFiles.exit()
                      .remove();
          loaddata = res;
          // console.log(loaddata);
            // console.log(loaddata[i]["raw"]);
            getSrcData();
            getRecomData();
            displayRecomGraph();
            accuRate();
            // getDiffDegree();
          //  console.log(loaddata);
        },
        error: function(error) {
          console.log(error);
        }
      });
    });
  }
function showTestRes(data_csv){
  sendData={}
  sendData["dataOfCsv"] = data_csv
  new Promise(function(resolve, reject){
    // console.log("here is TypeOfCar")
    var svm = "/showTestRes/";
    $.ajax({
      type: "post", 
      async: false,
        url: svm,
      data: {
            key: JSON.stringify(sendData)
        }, 
        dataType: "json",
        success: function(data) {
          console.log(data)
          loaddata = data["testRes"];

          d3.select("#SC").remove();//删除一个元素时，对于选择的元素，使用 remove即可删除指定 id 的段落元素。
          loaddata.forEach(function(d) {
            d.x = d["raw"][0];
            d.y = d["raw"][1];
          });
          graph = new SimpleGraph("scplot", loaddata,
                    {
                      "init": false,
                      "flag":false,
                      "xmax":d3.max(loaddata, function(d) { return +d["x"]; }),
                      "xmin":d3.min(loaddata, function(d) { return +d["x"]; }),
                      "ymax":d3.max(loaddata, function(d) { return +d["y"]; }),
                      "ymin": d3.min(loaddata, function(d) { return +d["y"]; }),
                    }
              
                );
          verifyRankModel();
          },
        error: function(error) {
          console.log(error);
        }
      });
    });
}
function selectFile(select){
  console.log("here is selectFile")
  sendData={"fileName":select};
  new Promise(function(resolve, reject){
    // console.log("here is loadFile")
    var svm = "/loadData/";
    $.ajax({
      type: "post", 
      async: false,
      url: svm,
      data: {
            key: JSON.stringify(sendData)
        }, 
      dataType: "json",
      success: function(data) {
        console.log(data)
          loaddata = data["nowData"];
          // d3.select("#SC").remove();//删除一个元素时，对于选择的元素，使用 remove即可删除指定 id 的段落元素。
          loaddata.forEach(function(d) {
            // console.log(d["raw"]);
            json = JSON.parse(d["raw"]);
            d.x = json[0];
            d.y = json[1];
          });
          graph.update();
        verifyRankModel();
        accuRate();
        // getDiffDegree();
      },
      error: function(error) {
        console.log(error);
      }
    });
  });
}
function updataShowScatterFlags(flags){
  console.log("updataShowScatterFlags")
  console.log(flags);
  for(var i =0;i<loaddata.length;i++){
    id = loaddata[i]["ID"];
    loaddata[i]["markRes"] =  flags[id]["markRes"];
    loaddata[i]["classifyRes"] = flags[id]["classifyRes"];
    loaddata[i]["recomRes"] = flags[id]["recomRes"];
  }
  graph.update();
}

function refreshGraExpScatter(){
  getScatterFlags()
}


function getScatterFlags(){
  listRankFlags = [];
  for(var i = 0;i<loaddata.length;i++){
    console.log(loaddata[i])
    temp = {};
    temp["ID"] = loaddata[i]["ID"];
    temp["markRes"] = loaddata[i]["markRes"];
    temp["classifyRes"] = loaddata[i]["classifyRes"];
    temp["recomRes"] = loaddata[i]["recomRes"];
    listRankFlags.push(temp);
  }
  console.log(listRankFlags);
  new Promise(function(resolve, reject){
    var svm = "/freshRankData/";
    $.ajax({
        type: "post", 
        async: false,
        url: svm,
        data: {
            // key: JSON.stringify(loaddata["raw"])
            key: JSON.stringify(listRankFlags),
        },
        dataType: "json",
        success: function(data) {
            // console.log(data["temp"]);
            updataAllView(data["temp"]);
        }
    })
});
}
function saveModel(){
  var fileName = document.getElementById("saveFile").value;
  // console.log(fileName);
  new Promise(function(resolve, reject){
    var svm = "/saveModel/";
    $.ajax({
        type: "post", 
        async: false,
        url: svm,
        data: {
            "fileName": JSON.stringify(fileName),
        },
        dataType: "json",
        success: function(data) {
          // console.log(data["filesName"]);
          listFiles = data["filesName"];
          selectFiles = d3.select("#selectLoadFile")
                        .selectAll("option")
                        .data(listFiles);
          selectFiles.attr("value",function(d){return d;})
                    .text(function(d) {return d;});
          selectFiles.enter()
                    .append("option")
                    .attr("value", function(d) {
                      // if (d != "降维方法") 
                      return d;
                    })
                    .text(function(d) { return d;});
          selectFiles.exit()
                      .remove();
        }
    })
  });
}
//给定数据，计算缩放比例，让周围存在合适的数据点
getScatterCentrePoint = function(centreID){
  // d3.select("#symbol")
  // .attr("fill","black")
  
  console.log("here is updata gra")
  // centreID = 10;
  var sortarrTemp = new Array();
  //sortarrtemp存储所有点与中心点的距离的平方和
  for(var i =0;i<loaddata.length;i++){
    if (centreID == loaddata[i]["ID"]){
      centreX = loaddata[i]["raw"][0];
      centreY = loaddata[i]["raw"][1];
    }
  }
  for(var i =0;i<loaddata.length;i++){
    temp_X = loaddata[i]["raw"][0]
    temp_Y = loaddata[i]["raw"][1]
    sortarrTemp[i] = Math.pow((centreX-temp_X),2) + Math.pow((centreY-temp_Y),2)
  }

  //  console.log(sortarrTemp);
  var sortArr = sortarrTemp.concat();//保存未排序前的结果
  sortarrTemp.sort(function(a,b){return a>b?1:-1});//从小到大排序
  console.log(sortarrTemp);
  var xMax = 0;var xMin = 10000;
  var yMax = 0;var yMin = 10000;
  // console.log(sortArr);
  // console.log(sortarrTemp);
  for(var i =0;i<sortArr.length;i++){
    // console.log(sortarrTemp[50]);
    if (sortArr[i] <= sortarrTemp[10]){
      temp_X = loaddata[i]["raw"][0];
      temp_Y = loaddata[i]["raw"][1];
      // console.log(temp_X,temp_Y);
      if(temp_X>xMax){
        xMax = temp_X;
      }
      else if(temp_X<xMin){
        xMin = temp_X;
      }
      if(temp_Y>yMax){
        yMax = temp_Y;
      }
      else if(temp_Y<yMin){
        yMin = temp_Y;
      }
    }
  } 
  xAxis = d3.scale.linear()
  .domain([xMin, xMax])
  .range([0, graph.size.width]);
  yAxis = d3.scale.linear()
  .domain([yMax, yMin])
  .range([0, graph.size.height]);
  graph.redraw()();
  d3.select("#symbol"+centreID)
  .attr("fill","black")
}

// 双击改变点的

function exportClaResult(){
  sendData={}
  new Promise(function(resolve, reject){
    console.log("here is TypeOfCar")
    var svm = "/exportClaResult/";
    $.ajax({
      type: "post", 
      async: false,
        url: svm,
      data: {
            key: JSON.stringify()
        }, 
        dataType: "json",
        success: function(content) {
          // console.log(content)
          // var blob = new Blob(['\uFEFF' + content["classifyResToCsvData"]], {type: "text/plain;charset=utf-8"});
          // console.log(blob)
          // saveAs(blob, "exportClaResult.csv");//saveAs(blob,filename)
          
          // onload=function(){   
          //   // var iframe=document.createElement("iframe");   
          //   // iframe.src=URL.createObjectURL(blob);   
          //   // document.body.appendChild(iframe);   
          //   console.log(this.result);
          // };
          exportCsv(content["classifyResToCsvData"], filename = "exportClaResult.csv") 
          },
        error: function(error) {
          console.log(error);
        }
      });
    });
}

function accuRate(){
  // var res = 0;
  new Promise(function(resolve, reject){
    console.log("here is accuRate")
    var svm = "/accuRate/";
    $.ajax({
      type: "post", 
      async: false,
        url: svm,
      data: {
            key: JSON.stringify()
        }, 
        dataType: "json",
        success: function(data) {
          console.log(data["rate"])
          accuRate1 = (1-data["rate"].toFixed(2))*100;
          console.log(accuRate1);
          d3.select("#accuRate")
          .text("模型一致度:"+accuRate1+"%");
          // var accuRate1 = document.getElementById("accuRate");
          // res = data["rate"].toFixed(2);
          // accuRate1.innerHTML=data["rate"].toFixed(2);
          
          },
        error: function(error) {
          console.log(error);
        }
      });
    });
}

// $("#fileImport").click(function () {
//   
// })
function fileImport() {
  $("#files").click();
  //获取读取我文件的File对象
  var selectedFile = document.getElementById('files').files[0];
  var name = selectedFile.name;//读取选中文件的文件名
  var size = selectedFile.size;//读取选中文件的大小
  console.log("文件名:"+name+"大小:"+size);

  var reader = new FileReader();//这是核心,读取操作就是由它完成.
  file = reader.readAsText(selectedFile);//读取文件的内容,也可以读取文件的URL
  
  reader.onload = function () {
    console.log("here is onload")
      //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
      console.log(this.result);
      showTestRes(this.result)
  }
}

// $("#export").click(function(){
//   exportClaResult()
// })

function arrayToCsv(data, args = {}) {
  let columnDelimiter = args.columnDelimiter || ',';
  let lineDelimiter = args.lineDelimiter || '\n';

   return data.reduce((csv, row) => {
    const rowContent = Array.isArray(row)
      ? row.reduce((rowTemp, col) => {
          let ret = rowTemp ? rowTemp + columnDelimiter : rowTemp;
          if (true) {
            console.log(col);
            let formatedCol = col.toString().replace(new RegExp(lineDelimiter, 'g'), ' ');
            ret += /,/.test(formatedCol) ? `"${formatedCol}"` : formatedCol;
          }
          return ret;
        }, '')
      : row;
    return (csv ? csv + lineDelimiter : '') + rowContent;
  }, '');
}

const BOM = '\uFEFF'; 
function exportCsv(inputData, filename = 'export.csv') {
  const csv = arrayToCsv(inputData);

  if (navigator.msSaveOrOpenBlob) {
    let blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    let uri = encodeURI(`data:text/csv;charset=utf-8,${BOM}${csv}`);
    let downloadLink = document.createElement('a');
    downloadLink.href = uri;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}


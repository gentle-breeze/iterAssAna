// 在更新所有的视图时 以前是只需要根据flags变就可以了 因为显示的都是所有的数据
// 现在需要每个视图自己去请求数据
function updataAllView(flags1){
  // console.log(flags1);
  updateShowScatter();
  getFiltData();
  updateShowRecom();
}
function appendOption(idName,className,data, funcName){
  // console.log(funcName);
  d3.select("#"+idName)
  .select("."+className)
  .append("ul")
  .attr("class","dropdown-menu")
  .selectAll("ul")
  .data(data)
  .enter()
  .append("li")
  .append("a")
  .text(function(d) {
    return d;
  })
  .on("click",function(text1){
    d3.select("#"+idName)
    .select("."+className)
    .selectAll("li")
    .select("a")
    .text(function(d){
      if(d === text1){
        return d+"  *"
      }
      else{
        return d;
      }
    })
    console.log(funcName);
    funcName(text1);
  });
}

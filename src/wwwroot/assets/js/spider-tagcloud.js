function ajax_changeHobbytagCloud(username) {
  $.get("ajax_spider", {
    command: "getHobbyCloudJSON",
    value: [username],
  },
    function (raw, status) {
      let rawJSON = JSON.parse(raw)
      let cloudJSON = []
      let maxTimes = 0
      let maxCount = 0
      //这里写的特别蠢。。。
      for (let word in rawJSON) {
        if (rawJSON[word] > maxTimes) maxTimes = rawJSON[word]
      }
      for (let word in rawJSON) {
        if (rawJSON[word] == maxTimes) maxCount++
      }
      for (let word in rawJSON) {
        let size = 130*(rawJSON[word]/maxTimes) 
        if (maxCount > 0) size = Math.min(40, size)
        let data = {"text": word, "size": size, "times": rawJSON[word]}
        cloudJSON.push(data)
      }
      cloudJSON.sort((a,b)=>{
        return b.times - a.times
      })
      cloudJSON.splice(60)
      //生成回答数Top10
      let element_html = ''
      let element_top10List = $('#tagCloudTop10')
      for (let i = 0; i < 10; i++) {
        element_html += `<li>${i+1}.${cloudJSON[i].text} (${cloudJSON[i].times} 次)</li>`
      }
      element_top10List.html(element_html)
      $('.tagCloudUsername').html(username)
  
      var fill = d3.scale.category20();
      d3.layout.cloud().size([600, 400])
        .words(cloudJSON)
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function (d) { return d.size; })
        .on("end", draw)
        .start();
  
      function draw(words) {
        $('svg').remove()
        let svg = d3.select("#tagCloudCanvas").append("svg")
        svg.attr("width", 650)
          .attr("height", 600)
          .append("g")
          .attr("transform", "translate(300,300)")
          .style("fill", "gray")
          .selectAll("text")
          .data(words)
          .enter().append("text")
          .style("border", "1px solid blue")
          .style("font-size", function (d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .style("fill", function (d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function (d) { return d.text; })
      }
    }
  )
  
}

ajax_changeHobbytagCloud(window.location.href.split('?')[1])
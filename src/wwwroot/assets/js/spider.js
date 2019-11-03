function ajax_updateTaskList() {
  $.get("ajax_spider", {
    command: "getTaskList",
    value: []
  },
    function (data, status) {
      let element_html = ''
      let element_taskList = $('#taskList')
      for (let i = 0; i < 9; i++) {
        if (data[i]) {
          let element_status = ''
          if (data[i][1] == -2) element_status = `<span class="am-badge am-badge-warning"><i class="am-icon-cog am-icon-spin"></i> 初始化中</span>`
          if (data[i][1] == -1) element_status = '<span class="am-badge am-badge-danger"><i class="am-icon-remove"></i> 抓取失败</span>'
          if (data[i][1] == 1) element_status = `<span class="am-badge am-badge-primary"><i class="am-icon-refresh am-icon-spin"></i> ${data[i][3]}</span>`
          if (data[i][1] == 2) element_status = `<span class="am-badge am-badge-success"><i class="am-icon-check"></i> 抓取成功</span>`
          if (data[i][1] == 3) element_status = `<span class="am-badge am-badge-warning"><i class="am-icon-cog am-icon-spin"></i>数据处理中</span>`
          if (data[i][1] == 4) element_status = `<span class="am-badge am-badge-success"><i class="am-icon-check"></i> 任务完成</span>`
          element_html += `<li>${i + 1}.用户爱好采集 -> ${data[i][2]} ${element_status}</li></lo>`
        } else
          element_html += `<li>${i + 1}.Task Free</li>`
      }
      element_taskList.html(element_html)
    }
  )
}

function ajax_getHobbyTagList() {
  $.get("ajax_spider", {
    command: "getHobbyCloudList",
    value: [0]
  },
    function (data, status) {
      data = JSON.parse(data)
      let element_html = ''
      let element_taskList = $('#dataList')
      for (let i in data) {
        element_html += `
        <tr id="list-${data[i][0]}">
          <td class="am-text-middle">${data[i][0]}</td>
          <td class="am-text-middle">${data[i][2]}</td>
          <td class="am-text-middle">${data[i][1]}</td>
          <td class="am-text-middle"><button type="button" class="am-btn am-btn-primary" onclick="window.location.href='/tagCloud?${data[i][0]}'">查看</button></td>
        </tr>`
      }
      element_taskList.html(element_html)
    }
  )
}

$('#addNewTask').click(function () {
  let targetUserIDInput = $('#targetUserID')
  let targetUserID = targetUserIDInput.val().trim()
  if (targetUserID == '') {
    targetUserIDInput.popover({
      theme: 'danger',
      content: '请输入目标ID，请勿留空'
    }).popover('open')
    return
  }
  //按钮加载动画
  $btn = $(this)
  $btn.button('loading')
  //提交任务请求
  $.get("ajax_spider", {
    command: "addNewTask",
    value: [targetUserID]
  },
    function (data, status) {
      setTimeout(function () {
        $btn.button('reset')
      }, 500)
      console.log(data)
    }
  )
  ajax_updateTaskList()
})
$('#rmOneTask').click(function () {
  // alert('删除任务')
})

ajax_updateTaskList()
ajax_getHobbyTagList()
setInterval(ajax_updateTaskList, 2000)


const fs = require('fs')
const path = require('path')
const spider = require('./src/spider')
const express = require('express')

//Spiderman
let spiderman = new spider()

// Express
let app = express()
app.use('/assets', express.static('./src/wwwroot/assets'))

let pages = {
  INDEX: './src/wwwroot/index.html',
  CENTER: './src/wwwroot/center.html',
  TAGCLOUD: './src/wwwroot/tagCloud.html'
}
app.get('/', function(req, res) {
  let page_file = fs.readFileSync(pages.INDEX).toString()
  res.send(page_file)
})

app.get('/center', function(req, res) {
  let page_file = fs.readFileSync(pages.CENTER).toString()
  res.send(page_file)
})

app.get('/tagCloud', function(req, res) {
  let page_file = fs.readFileSync(pages.TAGCLOUD).toString()
  res.send(page_file)
})

app.get('/ajax_spider', function(req, res) {
  let query = req.query  
  if (!query.command) return
  switch (query.command) {
    case 'addNewTask':
      if (query.value.length < 1) return
      spiderman.addNewTask(0, query.value[0])
      res.send({success: 1})
      break

    case 'getTaskList':
      let task_list = spiderman.getTaskList()
      res.send(task_list)
      break

    case 'getHobbyCloudList':
      if (query.value.length < 1) return
      let list = []
      let pa = fs.readdirSync('./saves/')
      pa.forEach((file_name, index) => {
        let info = fs.statSync('./saves/' + file_name)
        let file_change_time = new Date(info.ctime)
        let file_size = Math.ceil(100*info.size/1024)/100 + 'KB'
        list.push([file_name.split('.')[0], file_change_time, file_size])
      })
      res.send(JSON.stringify(list))
      break;

    case 'getHobbyCloudJSON':
      if(query.value.length < 1) return
      let username = query.value[0]
      let file_name = `./saves/${username}.json`
      let cloudJSON = ''
      if (fs.existsSync(file_name))
        cloudJSON = fs.readFileSync(file_name)
      res.send(cloudJSON)
    default:
      break
  }
})
app.listen(8080);
//spiderman.run()

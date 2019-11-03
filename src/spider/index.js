// // Core Module
// const rp = require('request-promise')
// const Promise = require('bluebird')
// // ZhiHu APIs
// const ZHu = require('../lib/ZHapi')
// const API = new ZHu()
//Spider Tasks
const task_hobbyTagCloud = require('./tasks/hobbyTagCloud')

class spider {
  constructor() {
    this.tasks = []
  }
  addNewTask(tasktype = 0) {
    if (tasktype == 0) {
      if (arguments.length < 2) return
      let task = new task_hobbyTagCloud(arguments[1])
      this.tasks.push(task)
      //task.runTask()
    }
  }
  getTaskList() {
    let list = []
    for (let i in this.tasks)
      list.push([this.tasks[i].type, this.tasks[i].state, this.tasks[i].targetUserID, this.tasks[i].getTaskProgress()])
    return list
  }
  run() {

  }
  pause() {

  }
}
module.exports = spider

// let start_time = Date.now();
// let offsets = []
// let id = 'excited-vczh';
// let self = this    
// for (let i = 0; i < 10000; i += 20) {
//   offsets.push(i)
// }
// Promise.map(offsets, function (offset, index) {
//   return API.fetchAnswersByID(id, offset, 20).then(function (answers) {
//     for (let key in answers) {
//       self.saves.push(answers[key])
//     }
//     self.task_now = self.saves.length
//     self.task_all = offsets.length*20
//     console.log(`offset:${offset}-抓取成功:(${self.saves.length} / ${offsets.length*20})`)            
//   }).catch(function(err) {
//   })
// }, { concurrency: 10 }).then(function() {
//   console.log(`${self.saves.length}条数据抓取完毕，总耗时${(Date.now()-start_time)/1000}秒`)          
// })    
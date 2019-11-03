// Core Module
const fs = require('fs')
const Promise = require('bluebird')
const taskBasic = require('../taskBasic')
// ZhiHu APIs
const ZHu = require('../../lib/ZHapi')
const API = new ZHu()

class task extends taskBasic{
  constructor(targetUserID) {
    super(0)    
    this.type = 0
    this.saves = []
    this.targetUserID = targetUserID
    this.offsets = []

    //10秒还未抓取用户回答数，任务失败并丢弃
    setTimeout(()=> { this.dropTask() }, 10000)
    API.fetchUserByID(targetUserID).then((user) => {
      //如果用户回答数为0，任务失败并丢弃
      if (user.answersNum * 1.0 > 0) {
        for (let i = 0; i < user.answersNum * 1.0; i++) 
          this.offsets.push(i)
        this.setMaxStep(Math.ceil(user.answersNum * 1 / (20 * 3)))
        this.runTask()
      } else this.dropTask()
    }).catch((err) => {
      //如无法获取用户信息，任务失败并丢弃
      this.dropTask()
    })
  }
  
  analyzeData() {
    super.analyzeData()

    //统计所有tag出现的次数
    this.C_count = 0
    let C_tag_times = {}
    for (let i in this.saves) {
      let answer = this.saves[i]
      let tags = answer.tags
      for(let j in tags) {
        let tag_id = tags[j].id
        let tag_name = tags[j].name
        if (!C_tag_times[tag_name]) C_tag_times[tag_name] = 0
        C_tag_times[tag_name]++
      }
      this.C_count++
    }
    fs.writeFile(`./saves/${this.targetUserID}.json`, JSON.stringify(C_tag_times), (err)=>{
      console.log(err)
    })
    this.state = 4
  }

  taskTick(suc, err) {
    //异步 (每次同时下载3个)
    let now_offsets = []
    let now_saves = []
    for (let i = 0; i < 3; i++) {
      now_offsets.push(this.offsets[this.step*60 + i*20])
    }
    Promise.map(now_offsets, (offset, index) => {
      return API.fetchAnswersByID(this.targetUserID, offset, 20).then((answers) => {
        if (offset != undefined) {
          let data_one_times = []
          for (let i in answers) {
            let data = {
              tags: [],
              id: answers[i].question.id,
              title: answers[i].question.title,
              voteup: answers[i].voteup_count,
            }
            now_saves.push(data)
            data_one_times.push(data)
          }
          return data_one_times
        }
       }).catch((err) => {
         console.log('err')
       })
    }, {
      concurrency: 1
    }).then(() => {
      return Promise.map(now_saves, (answer, index) => {
        return API.fetchQuestionByID(answer.id).then((q) => {
          if(q != undefined) {
            if (q != {})
              if (q.tags != undefined) {
                answer.tags = q.tags 
                console.log(answer.tags)
              }
          }
        })
      }, { concurrency: 5 })
    }).then(() => {
      for (let i in now_saves) this.saves.push(now_saves[i])
      console.log('progress:'+this.saves.length)
      suc()
    }).catch((error) => {
      for (let i in now_saves) this.saves.push(now_saves[i])
      console.log('progress:'+this.saves.length)
      console.log(error)
      err()
    })
  }

  getTaskProgress() {
    let progress0 = Math.round((this.step / (this.maxStep))*100) + ' %'
    let progress1 = `${this.step} / ${this.maxStep}`
    if (this.state == 1) return progress0
    if (this.state == 3) return `${this.C_count} / ${this.saves.length}`
  }
}
module.exports = task
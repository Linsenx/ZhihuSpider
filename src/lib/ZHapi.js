const rp = require('request-promise')
const api_fetchUserByID = require('./fetchUserByID')
const api_fetchAnswersByID = require('./fetchAnswersByID')
const api_fetchLoginCookie = require('./fetchLoginCookie')
const api_fetchQuestionByID = require('./fetchQuestionByID')
const api_fetchFolloweesByID = require('./fetchFolloweesByID')

class ZHapi {
  constructor (cookie) {
    //this.cookie = cookie
    this.proxies_pool = []
    //this.updateProxiesPool()
    //setInterval(this.updateProxiesPool.bind(this), 6000)
  }
  getProxy() {
    let random_id = parseInt((this.proxies_pool.length-1)*Math.random())
    return this.proxies_pool[random_id]
  }
  updateProxiesPool() {
    let local_pool = []
    rp({url:'http://api.ip.data5u.com/dynamic/get.html?order=ef6d61250a1709dd9bc9e9a569119828&sep=3'}).then((html) => {
      // for (let i in json.data) {
      //   let proxy = [json.data[i].ip, json.data[i].port]
      //   local_pool.push(proxy)
      // }
      //this.proxies_pool = local_pool.slice()
      this.proxies_pool[0] = html.trim()
    })
  }
  fetchAnswersByID(id, offset = 0, limit = 20) {
    if (id)
      return api_fetchAnswersByID(this.cookie, id, offset, limit)
    else 
      return 0
  }
  fetchFolloweesByID(id, offset = 0, limit = 20) {
    if (id)
      return api_fetchFolloweesByID(this.cookie, id, offset, limit)
    else 
      return 0
  }
  fetchLoginCookie(email, password) {
    if (email && password)
      return api_fetchLoginCookie(email, password)
    else 
      return 0
  }
  fetchUserByID(id) {
    if (id)
      return api_fetchUserByID(this.cookie, id)
    else 
      return 0
  }
  fetchQuestionByID(id) {
    if (id)
      return api_fetchQuestionByID(this.cookie, id, this.getProxy())
    else
      return 0
  }
}
module.exports = ZHapi
// module.exports.fetchAnswersByID = api_fetchAnswersByID;
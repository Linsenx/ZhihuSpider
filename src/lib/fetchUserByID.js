const cheerio = require('cheerio')
const Promise = require('bluebird')
const rp = require('request-promise')
const Config = require('../../spider.conf')

function fetch(cookie, id) {
  let opts = {
    url: 'https://www.zhihu.com/people/{id}/',
    headers: {
      'User-Agent': Config.UserAgent,
      'Cookie': Config.Cookie
    },
    json: true
  }
  opts.url = opts.url.replace('{id}', id)
  opts.url = encodeURI(opts.url)

  let elements_selector = {
    //回答数
    answersNum: '[href="/people/{id}/answers"] > span',
    //提问数
    asksNum: '[href="/people/{id}/asks"] > span',
    //文章数
    postsNum: '[href="/people/{id}/posts"] > span',
    //专栏数
    columnsNum: '[href="/people/{id}/columns"] > span',
    //想法数
    pinsNum: '[href="/people/{id}/pins"] > span'
  }

  return new Promise((resolve, reject) => {
    rp(opts)
    .then((html) => {      
      let userData = {}
      let $ = cheerio.load(html)
      for (let key in elements_selector) {
        let selector = elements_selector[key].replace('{id}', id)
        userData[key] = $(selector).html()
      }
      resolve(userData)
    })
    .catch((err) => {
      reject(opts.url)
    })
  })
}
module.exports = fetch;
const cheerio = require('cheerio')
const Promise = require('bluebird')
const rp = require('request-promise')
const Agent = require('socks5-http-client/lib/Agent')
const Config = require('../../spider.conf')

// 代理服务器
const proxyHost = "http-dyn.abuyun.com";
const proxyPort = "9020";

// 代理隧道验证信息
const proxyUser = "HMR7947987613U6D";
const proxyPass = "CD7A0DEE0229D12C";
const proxyUrl = "http://" + proxyUser + ":" + proxyPass + "@" + proxyHost + ":" + proxyPort;

function fetch(cookie, id, proxy) {
  let opts = {
    url: 'https://www.zhihu.com/question/{id}/',
    headers: {
      'User-Agent': Config.UserAgent,
      'Cookie': Config.Cookie
    },
    json: true
  }
  //随机选择是否使用proxy（减少错误率）
  let random_use_proxy = Math.random()*100
  if (random_use_proxy > 20) opts.proxy = proxyUrl

  opts.url = opts.url.replace('{id}', id)
  opts.url = encodeURI(opts.url)
  return new Promise((resolve, reject) => {
    rp(opts)
    .then((html) => {
      let questionData = {}
      let $ = cheerio.load(html)
      let tags_json_text = $('[data-zop-question]').attr('data-zop-question')
      if (tags_json_text) questionData.tags = JSON.parse(tags_json_text).topics
      resolve(questionData)
    })
    .catch((err) => {
      // console.log(err)
      reject(err)
    })
  })
}
module.exports = fetch;
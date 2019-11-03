const Promise = require('bluebird')
const rp = require('request-promise')
const Config = require('../../spider.conf')
const cheerio = require('cheerio')
const fs = require('fs')

function _xsrf() {
  let opts = {
    url: 'https://www.zhihu.com/',
    headers: {
      'User-Agent': Config.UserAgent
    }
  }
  opts.url = encodeURI(opts.url)
  return new Promise((resolve, reject) => {
    rp(opts)
      .then((html) => {
        let $ = cheerio.load(html)
        let _xsrf = $("[name='_xsrf']").val()
        if (_xsrf) resolve(_xsrf)
        else reject('error')
      })
      .catch((err) => {
        reject('error')
      })
  })
}

function captcha() {
  let opts = {
    url: 'https://www.zhihu.com/captcha.gif?type=login',
    headers: {
      'User-Agent': Config.UserAgent
    },
    encoding: null
  }
  return new Promise((resolve, reject) => {
    rp(opts)
      .then((img) => {
        fs.writeFileSync('./1.gif', img)
      })
      .catch((err) => {

      })
  })
}


function fetch(email, password) {
  let opts = {
    method: 'POST',
    url: 'https://www.zhihu.com/login/email',
    headers: {
      'User-Agent': Config.UserAgent,
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
    },
    formData: {
      email: email,
      password: password,
      captcha_type: 'cn',
      captcha: 'YGDA'
    },
    json: true
  }
  opts.url = encodeURI(opts.url)
  return _xsrf().then((xsrf) => {
    // 获取到xsrf之后登录
    opts.formData._xsrf = xsrf;
    return new Promise((resolve, reject) => {
      rp(opts)
      .then((res) => {
        console.log(res)
        if (res.msg == '验证码错误') {
          reject(opts.url)
        }
        else {
          resolve()
        }
      })
      .catch((err) => {
        reject(opts.url)
      })
    })
  })
}
module.exports = fetch;
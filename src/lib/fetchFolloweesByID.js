const Promise = require('bluebird')
const rp = require('request-promise')
const Config = require('../../spider.conf')

function fetch(cookie, id, offset, limit) {
  let opts = {
    url: 'https://www.zhihu.com/api/v4/members/{id}/followees?include=data[*].answer_count,articles_count,gender,follower_count,is_followed,is_following,badge[?(type=best_answerer)].topics&offset={offset}&limit={limit}}',
    headers: {
      'User-Agent': Config.UserAgent,
      'Cookie': Config.Cookie
    },
    json: true
  }
  opts.url = opts.url.replace('{id}', id)
  opts.url = opts.url.replace('{limit}', limit)
  opts.url = opts.url.replace('{offset}', offset)
  opts.url = encodeURI(opts.url)
  
  return new Promise((resolve, reject) => {
    rp(opts)
    .then((json) => {
      let answers = json.data;
      resolve(answers)
    })
    .catch((err) => {
      reject(opts.url)
      //fetch(cookie, id, offset, limit)
    })
  })
}
module.exports = fetch;
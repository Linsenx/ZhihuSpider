const Promise = require('bluebird')
const rp = require('request-promise')
const Config = require('../../spider.conf')

function fetch(cookie, id, offset, limit) {
  let proxies_length = Config.proxies.length
  let proxy_id = Math.round(Math.random() * proxies_length)
  let opts = {
    url: 'https://www.zhihu.com/api/v4/members/{id}/answers?include=data[*].is_normal,voteup_count,question;&offset={offset}&limit={limit}&sort_by=created',
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
      reject(err)
      //fetch(cookie, id, offset, limit)
    })
  })
}
module.exports = fetch;

// url: 'https://www.zhihu.com/api/v4/members/{id}/answers?include=data[*].is_normal,admin_closed_comment,reward_info,is_collapsed,annotation_action,annotation_detail,collapse_reason,collapsed_by,suggest_edit,comment_count,can_comment,content,voteup_count,reshipment_settings,comment_permission,mark_infos,created_time,updated_time,review_info,question,excerpt,relationship.is_authorized,voting,is_author,is_thanked,is_nothelp,upvoted_followees;data[*].author.badge[?(type=best_answerer)].topics&offset={offset}&limit={limit}&sort_by=created',
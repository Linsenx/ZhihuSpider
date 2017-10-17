const superagent = require('superagent')
const mongoose = require('mongoose')
const cheerio = require('cheerio')
// const Answer = require('./module/answer')
const options = {
  url: 'https://www.zhihu.com/api/v4/members/excited-vczh/answers?include=data[*].is_normal,admin_closed_comment,reward_info,is_collapsed,annotation_action,annotation_detail,collapse_reason,collapsed_by,suggest_edit,comment_count,can_comment,content,voteup_count,reshipment_settings,comment_permission,mark_infos,created_time,updated_time,review_info,question,excerpt,relationship.is_authorized,voting,is_author,is_thanked,is_nothelp,upvoted_followees;data[*].author.badge[?(type=best_answerer)].topics&offset={offset}&limit=20&sort_by=created  ',
  cookie: 'd_c0="AHACaDn-BgyPTuOtT09_MDM8XrzDcyt1F8U=|1499407726"; _zap=0421ff69-5627-4603-a543-e40da888c64a; q_c1=f24da852078949449f72049eaa9d589b|1506777474000|1503102526000; aliyungf_tc=AQAAAI3pMng2XgEAQrxd30uH0//rnqSI; _xsrf=5ee9e38560232689394b5bb533ceea86; q_c1=40d7866ca9254112a040d3793b1a5c0a|1508149083000|1503102526000; capsion_ticket="2|1:0|10:1508149528|14:capsion_ticket|44:Mjc3NzU0MmMyOWNhNDIyYTk5YjZhMGMxNzc5NmQxODc=|c3b745a0019d0904b1b050ec6a6092fe26ec8ad0925ed7103f4c830028c38d2d"; r_cap_id="NDY3ZGVhMTJiNmY5NGM2Y2FhOGM1NWU0YTVlODJlOWQ=|1508149762|a634d6af9947a3435980c128a4e0def15c4179a9"; cap_id="OTcwZmI4ZWRlMzg4NDYwZGEwMDQxMTBkN2ExMTJhMWU=|1508149762|6f51da22093581c9619bd9de452b5def2e0aa1b8"; z_c0=Mi4xVkVKdkFBQUFBQUFBY0FKb09mNEdEQmNBQUFCaEFsVk5SQmNNV2dBbVFyY216eTA5YkpVZ2FreWdZYlhWMmEwWElB|1508149828|dd664329e403970e5421c0dc1267bc28df313039; s-q=vczh; s-i=1; sid=tm1oqvve; __utma=51854390.1097967496.1499407727.1508148169.1508235739.7; __utmb=51854390.0.10.1508235739; __utmc=51854390; __utmz=51854390.1508235739.7.4.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmv=51854390.100-1|2=registration_date=20140730=1^3=entry_date=20140730=1; _xsrf=5ee9e38560232689394b5bb533ceea86'
}
function Unicode2Utf8(source) {
  return unescape(source.replace(/\\u/g, '%u'));
}

let db = mongoose.connect('mongodb://root:3802985434@localhost:27017/game', {useMongoClient: true} , function (err) {
  console.log(err)
})

let answerSchema = new mongoose.Schema({
  id: String,
  title: String
})
let answerModel = db.model('answer0', answerSchema)

let testAnswer = new answerModel({
  id: '1212',
  title: '121212'
})
testAnswer.save();

answerModel.findOne({'id':'1'},function(err, a) {
  console.log(a)
});

// function spider_fetch_user_answers(offset) {
//   superagent
//     .get(encodeURI(options.url.replace('{offset}', offset)))
//     .set('Cookie', options.cookie)
//     .end(function (err, res) {
//       let answers = JSON.parse(Unicode2Utf8(res.text)).data
//       if (answers.length > 0) {
//         for (let i = 0; i < answers.length; i++) {
//           if (answers[i].question != undefined) {
//             let q_id = answers[i].question.id
//             let q_title = answers[i].question.title
//             saved.push([q_id, q_title])
//           }
//         }
//         console.log(`data-length: ${saved.length} answers`)
//         spider_fetch_user_answers(offset + 20)
//       } else {
//         //end
//       }
//     })
// }

// spider_fetch_user_answers();


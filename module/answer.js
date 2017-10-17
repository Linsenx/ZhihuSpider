const mongoose = require('mongoose')
const Schema = mongoose.Schema
let answerSchema = new Schema({
  id: String,
  title: String
})
module.exports = mongoose.model('answer0', answerSchema)
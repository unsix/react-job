const mongoose = require('mongoose')
//链接
const DB_URL = 'mongodb://localhost:27017'
mongoose.connect(DB_URL)
mongoose.connection.on('connected',function(){
  console.log("123")
})

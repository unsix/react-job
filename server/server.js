const express = require("express");
const utils = require('utility')
const userRouter = require('./user')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const model = require('./model')
const Chat = model.getModel('chat')

const app = express()

// work with express
const server = require('http').Server(app)

const io = require('socket.io')(server)
io.on('connection',function(socket){
	console.log('user login')
	socket.on('sendmsg',function(data){
		console.log(data)
		const {from, to, msg} = data
		const chatid = [from,to].sort().join('_')
		Chat.create({chatid,from,to,content:msg},function(err,doc){
			io.emit('recvmsg', Object.assign({},doc._doc))
		})
		// io.emit('recvmsg',data)
	})
})
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user',userRouter)


server.listen(9093,function(){
  console.log("start at port 9093")
})

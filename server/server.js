const express = require("express");
const utils = require('utility')
const userRouter = require('./user')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const model = require('./model')
const Chat = model.getModel('chat')

const path = require('path')
const app = express()

// work with express
const server = require('http').Server(app)

const io = require('socket.io')(server)
// io.on('connection',function(socket){
// 	console.log('user login')
// 	socket.on('sendmsg',function(data){
// 		console.log(data)
// 		const {from, to, msg} = data
// 		const chatid = [from,to].sort().join('_')
// 		Chat.create({chatid,from,to,content:msg},function(err,doc){
// 			io.emit('recvmsg', Object.assign({},doc._doc))
// 		})
// 		// io.emit('recvmsg',data)
// 	})
// })
io.on('connection',function(socket){
	console.log('user login')
	socket.on('sendmsg',function(data){
		console.log(data)
		const {from, to, msg} = data
		const chatid = [from,to].sort().join('_')
		Chat.create({chatid,from,to,content:msg},function(err,doc){
			io.emit('recvmsg', Object.assign({},doc._doc))
		})
		// console.log(data)
		// io.emit('recvmsg',data)
	})
})

app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user',userRouter)
//1.购买域名
//2.dns解析到你服务器到Ip
//3.按照nginx
//4.使用pm2管理node进程
app.use(function(req,res,next){
	if(req.url.startsWith('/user/')||req.url.startsWith('/static/')){
		return next()
	}
	console.log('path resolve',path.resolve('build/index.html'))
	return res.sendFile(path.resolve('build/index.html'))
})
//拦截路由转发
app.use('/',express.static(path.resolve('build')))

server.listen(9093,function(){
  console.log("start at port 9093")
})

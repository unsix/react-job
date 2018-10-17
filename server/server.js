import express from 'express'
// const express = require("express");
// const utils = require('utility')
const userRouter = require('./user')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const model = require('./model')
const Chat = model.getModel('chat')

const path = require('path')
const app = express()
import assethook from 'asset-require-hook'
assethook({
	extensions:['png']
})
import csshook from 'css-modules-require-hook/preset'
import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import App from '../src/App'
import reducers from '../src/reducers'
import {renderToString,renderToStaticMackup} from 'react-dom/server'
import staticPath from '../build/asset-manifest.json'
// console.log(staticPath)
// React组件=>div
// function App(){
// 	return (
// 		<div>
// 			<p>1</p>
// 			<p>2</p>
// 		</div>
// 	)
// }
// console.log(renderToString(<App></App>))
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

	const store = createStore(reducers, compose(
		applyMiddleware(thunk),
	))
	let context ={}
	const markup = renderToString(
		(
			<Provider store={store}>
				<StaticRouter
					location={req.url}
					context={context}      //react有跳转 会提示我们有跳转
				>
					<App></App>
				</StaticRouter>
			</Provider>	
		)
	)
	//服务端渲染App
	// const htmlRes = (<App></App>)
	const pageHtml = `
	<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
			<meta name="theme-color" content="#000000">
			<link rel="manifest" href="/manifest.json">
			<link rel="shortcut icon" href="/favicon.ico">
			<link rel="stylesheet" href="/${staticPath['main.css']}"
			<title>React App</title>
		</head>
		<body>
			<noscript>
			You need to enable JavaScript to run this app.
			</noscript>
			<div id="root">${markup}</div>
			<script src="/${staticPath['main.js']}"></script>
			<script type="text/javascript" src="/static/js/bundle.js"></script>
		</body>
	</html>
	`
	// res.send(pageHtml)
	// console.log('path resolve',path.resolve('build/index.html'))
	// return res.sendFile(path.resolve('build/index.html'))
})
//拦截路由转发
app.use('/',express.static(path.resolve('build')))

server.listen(9093,function(){
  console.log("start at port 9093")
})


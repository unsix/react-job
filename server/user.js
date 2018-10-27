
const express = require('express')
const utils = require('utility')
const Router = express.Router()
const model = require('./model')
const User = model.getModel('user')
const Chat = model.getModel('chat')
const path = require('path')
const fs = require('fs')
const multiparty = require('multiparty');  //解析器
Chat.remove({},function(e,d){

})

const _filter = {'pwd':0,'__v':0}

Router.post('/uploadimg',function(req,res){
  // User.remove({},function(e,d){})
  console.log("进入readImage");
 
  // 解析一个文件上传
  var form = new multiparty.Form();

  form.parse(req, function (err, fields, files) {
      //同步重命名文件名
      // fs.rename(files.file[0].path, path.resolve('写入图片的路径'+'图片或文件的名字，可以在files中取出来'))
      fs.rename(files.file[0].path, path.resolve('../uploadimg',`${files.file[0].originalFilename}`))
      res.write('received upload:\n\n')
      res.end()
})
})
Router.get('/list',function(req,res){
  // User.remove({},function(e,d){})
  const {type} = req.query

  User.find({type},function(err,doc){
    return res.json({code:0,data:doc})
  })
})

Router.get('/getmsglist',function(req,res){
  const user = req.cookies.userid
  User.find({},function(e,userdoc){
		let users = {}
		userdoc.forEach(v=>{
			users[v._id] = {name:v.user, avatar:v.avatar}
		})
		Chat.find({'$or':[{from:user},{to:user}]},function(err,doc){
			if (!err) {
				return res.json({code:0,msgs:doc, users:users})
			}
		})

	})
})
Router.post('/readmsg', function(req, res){
	const userid = req.cookies.userid
	const {from} = req.body
	Chat.update(
		{from,to:userid},
		{'$set':{read:true}},
		{'multi':true},//所有
		function(err,doc){
		console.log(doc)
		if (!err) {
			return res.json({code:0,num:doc.nModified})
		}
		return res.json({code:1,msg:'修改失败'})
	})
})
Router.post('/update',function(req,res){
	const userid = req.cookies.userid
	if (!userid) {
		return json.dumps({code:1})
	}
	const body = req.body
	User.findByIdAndUpdate(userid,body,function(err,doc){
		const data = Object.assign({},{
			user:doc.user,
			type:doc.type
		},body)
		return res.json({code:0,data})
	})
})
Router.post('/login',function(req,res){
  const {user,pwd} = req.body
  User.findOne({user,pwd:md5Pwd(pwd)},_filter,function(err,doc){
    if(!doc) {
      return res.json({code:1,msg:'用户名或者密码错误2'})
    }
    res.cookie('userid',doc._id)
    return res.json({code:0,data:doc})
  })
})

Router.post('/register',function(req,res){
  console.log(req.body)
  const {user,pwd,type} = req.body
  User.findOne({user:user},function(err,doc){
    if(doc){
      return res.json({code:1,msg:'用户名重复'})
    }
    const unserModel = new User({user,type,pwd:md5Pwd(pwd)})
    unserModel.save(function(err,doc){
      if(err) {
        return res.json({code:1,msg:'后端出错了'})
      }
      const {user,type,_id} = doc
      res.cookie('userid',_id)
      return res.json({code:0,data:{user,type, _id}})
    })
    // User.create({user,pwd:md5Pwd(pwd),type},function(e,d){
    //   if(e){
    //     return res.json({code:1,msg:'后端出错了'})
    //   }
    //   // res.cookie('userid',doc._id)
    //   return res.json({code:0})
    // })
  })
})
Router.get('/info',function(req,res){
  const {userid} = req.cookies
  if(!userid) {
    return res.json({code:1})
  }
  User.findOne({_id:userid}, _filter, function(err,doc){
    if(err) {
      return res.json({code:1, msg:'后端出错了'})
    }
    if(doc) {
      return res.json({code:0,data:doc})
    }
  })
})

function md5Pwd(pwd){
  const salt = "wanghaitao_is_good**@unwelt"
  return utils.md5(utils.md5(pwd+salt))
}

module.exports = Router

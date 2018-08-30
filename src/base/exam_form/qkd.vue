<template>
	<div>
    <div class="form" name="请款单" v-if="form_show">
      <div class="top">
        <el-button size="small" type="info" plain @click="return_">返回列表</el-button>
        <p class="title">请款单</p>
        <a v-if="form_approval_id && down_show" style="color: black" :href="downUrl" target="_blank" download="" mce_href='#'><i class="el-icon-download"></i></a>
      </div>
      <div v-if="form_Lista.contract_name">
        <span>工程名称：</span><span>{{form_Lista.contract_name}}</span>
      </div>
      <div v-if="form_Lista.contract_name_new">
        <span>合同名称：</span><span>{{form_Lista.contract_name_new}}</span>
        <b v-if="form_Lista.contract_request_id" style="font-size: 14px;margin-left: 330px;line-height: 23px;cursor: pointer" @click="show_html">查看附件</b>
      </div>
      <div v-if="form_Lista.worker_type">
        <span>工种：</span><span>{{form_Lista.worker_type}}</span>
      </div>
      <div v-if="form_Lista.request_name">
        <span>请款人姓名：</span><span>{{form_Lista.request_name}}</span>
      </div>
      <div v-if="form_Lista.phone">
        <span>联系方式：</span><span>{{form_Lista.phone}}</span>
      </div>
      <div v-if="form_Lista.account_name">
        <span>账户名：</span><span>{{form_Lista.account_name}}</span>
      </div>
      <div v-if="form_Lista.bank_address">
        <span>开户行：</span><span>{{form_Lista.bank_address}}</span>
      </div>
      <div v-if="form_Lista.bank_card">
        <span>银行卡号：</span><span>{{form_Lista.bank_card}}</span>
      </div>
      <div v-if="form_Lista.contract_state">
        <span>合同执行进度：</span><span>{{form_Lista.contract_state}}</span>
      </div>
      <div v-if="change_type != 2">
        <span>请款次数：</span><span>{{form_Lista.request_num}}</span>
      </div>
      <div v-if="change_type != 2">
        <span>合同金额￥：</span><span>{{form_Lista.subtotal}}</span>
      </div>
      <div v-if="change_type != 2">
        <span>增减金额￥：</span><span>{{form_Lista.gain_reduction_subtotal}}</span>
      </div>
      <div v-if="change_type != 2">
        <span>已领工程款￥：</span><span>{{form_Lista.balance_subtotal}}</span>
      </div>
      <div v-if="change_type != 2">
        <span>本次请款￥：</span><span>{{form_Lista.request_subtotal}}</span>
      </div>
      <div v-if="form_Lista.request_content">
        <span>请款内容：</span><span>{{form_Lista.request_content}}</span>
      </div>
      <div v-if="file_arr">
        <span>附件列表：</span>
        <a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
      </div>
      <div>
        <span>图片附件：</span>
        <a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list" class="img1">
          <img :src="item" alt="" @click="ctrl_pic_show(form_Lista.img_list,index)" />
        </a>
      </div>
      <div v-if="form_Listb.found_name">
        <span>发起人：</span><span>{{form_Listb.found_name}}</span>
      </div>
      <div v-if="form_Listb.list">
        <span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444;">{{item}}</span>
      </div>
      <div>
        <span>审批：</span>
        <div v-for="item in form_Listb.content" v-show="form_Listb.content.length > 0" class="exam_info">
          <b><span>{{item.department_name}}</span><span>{{item.name}}</span><span>{{item.is_agree}}</span></b>
          <p v-for="(val, key, index) in item.form_result">{{key}}:{{val}}</p>
          <p>意见:<span>{{item.opinion}}</span></p>
          <p v-show="item.many_enclosure" class="enclosure">
            <span style="display: block">附件列表</span>
            <a v-for="link in item.files" :href="link.address">{{link.name}}</a>
            <img :src="res" v-for="(res,index) in item.imgs" @click="cl_pic(item.imgs,index)">
            <img :src="list" v-for="(list,index) in item.picture" @click="cl_pic(item.picture,index)" />
          </p>
          <div style="width: 530px;margin-left: 50px;background: #e3e4e9;" v-if="item.replys">
            <div class="reply" v-for="res in item.replys" style="margin: 10px 20px;line-height: 22px">
              <div class="avatar">
                <span>{{res.name}}</span><span v-show="res.name != res.return_person_name">回复{{res.return_person_name}}</span><i v-show="status == 2" @click="reply_other(res.uid,item.participation_id,res.name)" style="float: right" class="iconfont icon-xiaoxi"></i>
              </div>
              <div class="tel">
                <span>{{res.add_time}}</span>
              </div>
              <div class="operation">
                <span>{{res.reply_content}}</span>
              </div>
              <div class="img">
                <img style="width: 50px" :src="es" alt="" v-for="(es,index) in res.imgs" @click="cl_pic(res.imgs,index)">
              </div>
              <div>
                <a class="file" :href="es.address" v-for="(es,index) in res.files">{{es.name}}</a>
              </div>
            </div>
          </div>
          <p>审批时间:{{item.add_time}}</p>
        </div>
      </div>
      <div v-if="form_Listb.finance">
        <span>表单回执：</span>
        <br />
        <span style="color: #444444;">
						<span v-html="form_Listb.finance.finance_state"></span> {{form_Listb.finance.name}} {{form_Listb.finance.receipt_content}} {{form_Listb.finance.save_time}}
			<div><img style="width: 50px;height: 50px;border: 1px solid #e3e4e9;" :src="list" alt="" v-for="(list,index) in form_Listb.re_pic" @click="rec_pic(form_Listb.re_pic,index)" /></div>
			</span>
      </div>
      <div class="menu" v-show="handle_show">
        <el-button type="primary" plain @click="handle">处理</el-button>
        <div class="button" v-show="menuShow">
          <label>
            <el-input style="width: 435px" type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
          </label>
          <el-upload class="upload-demo" id="picc" v-model="many_enclosure"  multiple accept="image/jpeg,image/png" action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
          <el-button type="primary" round @click="agree">同意</el-button>
          <el-button type="danger" round @click="refuse">拒绝</el-button>
        </div>
      </div>
      <browsePic :pic_index="pic_index" ref="browe" :img_arr="arr_list"  v-show="pic_show"></browsePic>

      <loading v-show="loading_show"></loading>
    </div>

    <div class="contr" v-show="contrshow">
      <div class="top">
        <el-button size="small" type="info" plain @click="reInfo">返回列表</el-button>
        <p class="title">查看附件合同</p>
        <b @click="look_psb" v-if="pset">查看合同评审</b>
      </div>
      <iframe id="mom" class="win" ref="indx" width="100%" style="height: 600px" scrolling="yes" height="100%" :src="linked" seamless frameborder="0"></iframe>
    </div>

    <psb v-if="psb_if" :form_Lista="Lista" :qk_return="false" :form_Listb="Listb" :handle_show="false" @return_psb="returnLi" :file_arr="file_arr_com"></psb>
  </div>
</template>

<script>
	import loading from '@/base/loading/loading'
	import browsePic from '@/base/browse_pic/browse_pic'
  import psb from '@/base/exam_form/psb'
  import {getPic} from '@/common/js/pic.js'
  import {getAvatar} from '@/common/js/avatar.js'
  import { create_approval_list } from '@/common/js/approval/approval_list'
  import { create_hetongpingshen_list } from '@/common/js/approval/hetongpingshen'
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
        Lista:{},
        Listb:{},
        file_arr_com:[],
				menuShow: false,
				handle_txt: '',
				pic_index: 0,
				pic_show: false,
				loading_show: false,
				input_value: '',
				pic_hash: '',
				now_personnel_id: 0,
        pic_hash_arr: [],
        arr_list: [],
        picArr:[],
        fileList: [],
        many_enclosure:{},
        personnel_id:'',
        pic_time:0,
        enclosure_id:'',
        finance_state:'',
        status:'1',
        downUrl:'',
        form_show:true,
        contrshow:false,
        linked:'',
        psb_if:false,
			}
		},
		props: {
			form_Lista: {
				type: Object
			},
			form_Listb: {
				type: Object
			},
			handle_show: {
				type: Boolean
			},
			psb_approval_id: {
				type: String
			},
			file_arr: {
				type: Array
			},
      change_type:{

      },
      form_approval_id:{

      },
      down_show:{

      },
      pset:{
			  default:true
      }
		},
		created() {
			this._getToken()
      this.add_html()
		},
		computed: {
			...mapGetters([
				'user',
				'nowCompanyId',
				'token'
			])
		},
		methods: {
		  add_html(){
        if(this.form_approval_id){
          let param = new URLSearchParams
          param.append('uid',this.user.uid)
          param.append('company_id',this.nowCompanyId)
          param.append('approval_id',this.form_approval_id)
          let str = this.$test('/index.php/Mobile/find/get_download_token')
          this.$http.post(str,param)
            .then((res)=>{
              var cur = this
              var jud = res.data.code
              this.$testLogin(jud,cur)
              let str = this.$test('/index.php/Mobile/skey/aaampd_picture?token=')
              this.downUrl = str + res.data.data
            })
        }
      },
			rec_pic(item, index) {
        item.forEach((res)=>{
          let current = res.indexOf('?')
          this.arr_list.push(res.slice(0,current) + '?imageslim' )
        })
        this.pic_index = index
        this.pic_show = true
			},
			ctrl_pic_show(item, index) {
        item.forEach((res)=>{
          let current = res.indexOf('?')
          this.arr_list.push(res.slice(0,current) + '?imageslim' )
        })
        this.pic_index = index
        this.pic_show = true
			},
			cl_pic(item, index) {
        item.forEach((res)=>{
          let current = res.indexOf('?')
          this.arr_list.push(res.slice(0,current) + '?imageslim' )
        })
        this.pic_index = index
        this.pic_show = true
			},
			return_() {
				this.$emit('return_psb')
				this.handle_txt = ''
				this.pic_hash_arr = []
			},
			handle() {
				this.menuShow = true
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
        let str = this.$test("/index.php/Mobile/path/get_token")
				this.$http.post(str, param)
					.then((res) => {
						this.input_value = res.data.data
					})
			},
			closeMenu() {
				this.menuShow = false
			},
			getPic(event) {
				this.file = event.target.files;
			},
      agree() {
        this.finance_state = '1'
        if(this.handle_txt === '') {
          this.$message.error('请填写回执内容');
          return
        }
        if(this.fileList.length == 0) {
          this.$message.error('确认回执必须上传图片');
          return
        }
        let nparam = new URLSearchParams()
        nparam.append("uid",this.user.uid)
        nparam.append("company_id",this.nowCompanyId)
        let str = this.$test("/index.php/Mobile/User/return_company_new")
        this.$http.post(str,nparam)
          .then((res)=>{
            if(res.data.code == 0){
              this.personnel_id = res.data.data.personnel_id
            }
          })
        this.fileList.forEach((item) => {
          if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1' || item.name.indexOf("图像") != '-1') {
            this.picArr.push(item)
          }
        })
        this.loading_show = true
        setTimeout(()=>{
          var upload_enclosure_new = (fn)=>{
            this.picArr.forEach((item)=>{
              let formData = new FormData()
              formData.append('file',item.raw)
              formData.append('token',this.input_value)
              let config = {
                'Content-Type': 'multipart/form-data'
              }
              if(!item.size){
                this.pic_hash_arr.push(item.hash)
                this.pic_hash_arr.length == this.picArr.length && fn(item.name)
              }else{
                this.$http.post('https://up.qbox.me/', formData, config).then((res)=>{
                  this.pic_hash_arr.push(res.data.hash)
                  if(this.pic_hash_arr.length === this.picArr.length) {
                    fn(item.name);
                  }
                })
              }
            })
          }
          upload_enclosure_new((name)=>{
            let nparam = new URLSearchParams()
            nparam.append('uid',this.user.uid)
            nparam.append('picture',JSON.stringify(this.pic_hash_arr))
            let str = this.$test('/index.php/Mobile/approval/upload_enclosure_new')
            this.$http.post(str,nparam)
              .then((res)=>{
                this.enclosure_id = res.data.data.enclosure_id
                this.pic_time = Date.parse(new Date())
              })
          })
        },500)
      },
      refuse() {
        this.finance_state = '2'
        if(this.handle_txt === '') {
          this.$message.error('请填写回执内容');
          return
        }
        let nparam = new URLSearchParams()
        nparam.append("uid",this.user.uid)
        nparam.append("company_id",this.nowCompanyId)
        let str = this.$test("/index.php/Mobile/User/return_company_new")
        this.$http.post(str,nparam)
          .then((res)=>{
            if(res.data.code == 0){
              this.personnel_id = res.data.data.personnel_id
            }
          })
        if(this.fileList.length == 0) {
          let param = new URLSearchParams();
          param.append("uid", this.user.uid);
          param.append("approval_id", this.psb_approval_id);
          param.append("personnel_id", this.personnel_id);
          param.append("company_id", this.nowCompanyId);
          param.append("finance_state", 1);
          param.append("receipt_content", this.handle_txt);
          let str = this.$test("/index.php/Mobile/find/finance_receipt")
          this.$http.post(str, param)
            .then((res) => {
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              this.loading_show = false
              if(res.data.code === 0) {
                this.$message({
                  message: '恭喜你，操作成功',
                  type: 'success'
                });
                this.return_()
              } else {
                this.$message.error('操作失败');
              }
            })
        }
        if(this.fileList) {
          this.fileList.forEach((item) => {
            if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1' || item.name.indexOf("图像") != '-1') {
              this.picArr.push(item)
            }
          })
          this.loading_show = true
          setTimeout(()=>{
            var upload_enclosure_new = (fn)=>{
              this.picArr.forEach((item)=>{
                let formData = new FormData()
                formData.append('file',item.raw)
                formData.append('token',this.input_value)
                let config = {
                  'Content-Type': 'multipart/form-data'
                }
                if(!item.size){
                  this.pic_hash_arr.push(item.hash)
                  this.pic_hash_arr.length == this.picArr.length && fn(item.name)
                }else{
                  this.$http.post('https://up.qbox.me/', formData, config).then((res)=>{
                    this.pic_hash_arr.push(res.data.hash)
                    if(this.pic_hash_arr.length === this.picArr.length) {
                      fn(item.name);
                    }
                  })
                }
              })
            }
            upload_enclosure_new((name)=>{
              let nparam = new URLSearchParams()
              nparam.append('uid',this.user.uid)
              nparam.append('picture',JSON.stringify(this.pic_hash_arr))
              let str = this.$test('/index.php/Mobile/approval/upload_enclosure_new')
              this.$http.post(str,nparam)
                .then((res)=>{
                  this.enclosure_id = res.data.data.enclosure_id
                  this.pic_time = Date.parse(new Date())
                })
            })
          },500)
        }
      },
			_getToken() {
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
        let str = this.$test("/index.php/Mobile/path/get_token")
				this.$http.post(str, nparam)
					.then((res) => {
						localStorage.token = JSON.stringify(res.data.data);
						this.setToken(res.data.data)
					})
			},
			...mapMutations({
				setToken: 'SET_TOKEN'
			}),
      handleRemove(file, fileList) {
        this.fileList = fileList
      },
      handlePreview(file, fileList) {
        if(file.name.toLowerCase().indexOf('jpg') == '-1' && file.name.toLowerCase().indexOf('png') == '-1'){
          this.$message.error('上传文件格式错误')
          this.str = file
        }
        function remove(arr,val) {
          for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
              arr.splice(i, 1);
              break;
            }
          }
        }
        remove(fileList,this.str)
        this.fileList = fileList
      },
      show_html(){
		    this.form_show = false
        this.contrshow = true
        let str = this.$test('/index.php/Mobile/skey/look_draft?id=')
        this.linked =str+this.form_Lista.contract_request_id+'&operation=2&view=4'
      },
      reInfo(){
        this.form_show = true
        this.contrshow = false
        this.linked = ''
      },
      look_psb(){
		    let param = new URLSearchParams()
        param.append('approval_id',this.form_approval_id)
        let str = this.$test("/index.php/Mobile/approval/get_approval_contract_company_new")
        this.$http.post(str, param)
          .then((res)=>{
            if(res.data.code == 0){
              this.get_data(res.data.data)
            }else{
              this.$message.error(res.data.message)
            }
          })
      },
      get_data(obj){
        this.psb_if = true
        this.contrshow = false
        let param = new URLSearchParams();
        param.append("uid", this.user.uid);
        param.append("approval_id", obj.approval_id);
        let str = this.$test("/index.php/Mobile/approval/approval_process_show")
        this.$http.post(str, param)
          .then((res)=>{
            this.psb_if = true
            this.Lista = create_hetongpingshen_list(res.data.data)
            this.get_img(this.Lista.many_enclosure)
            this.get_file(this.Lista.many_enclosure)
          })
        let nparam = new URLSearchParams();
        nparam.append("uid", this.user.uid);
        nparam.append("approval_id", obj.approval_id);
        nparam.append("company_id", obj.company_id);
        let httpUrl = this.$test("/index.php/Mobile/approval/approval_process_personnel")
        this.$http.post(httpUrl, nparam)
          .then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            res.data.data.content.forEach((item, index) => {
              if(item.picture) {
                let arr = []
                let zparam = new URLSearchParams();
                zparam.append("enclosure_id", item.picture);
                let str = this.$test("/index.php/Mobile/approval/look_enclosure")
                this.$http.post(str, zparam)
                  .then((res) => {
                    var current = this
                    var judge = res.data.code
                    this.$testLogin(judge,current)
                    res.data.data.picture.forEach((item) => {
                      if(item != '') {
                        arr.push(getPic(item))
                      }
                    })
                  })
                res.data.data.content[index].picture = arr
              }
              if(item.many_enclosure){
                this.get_imgs(item.many_enclosure,item)
                this.get_files(item.many_enclosure,item)
              }
              if(item.replys){
                item.replys.forEach((pic)=>{
                  this.get_imgs(pic.many_enclosure,pic)
                  this.get_files(pic.many_enclosure,pic)
                })
              }
            })
            if(res.data.data.supply){
              res.data.data.supply.forEach((item,index)=>{
                this.get_imgs(item.many_enclosure,item)
                this.get_files(item.many_enclosure,item)
              })
            }
            if(res.data.data.finance) {
              if(res.data.data.finance.finance_state === '1') {
                res.data.data.finance.finance_state = '<span style="color:#67C23A">通过</span>'
              } else {
                res.data.data.finance.finance_state = '<span style="color:#EB9E05" >未通过</span>'
              }
              let zparam = new URLSearchParams();
              zparam.append("enclosure_id", res.data.data.finance.receipt_pic);
              let str = this.$test("/index.php/Mobile/approval/look_enclosure")
              this.$http.post(str, zparam)
                .then((res) => {
                  var current = this
                  var judge = res.data.code
                  this.$testLogin(judge,current)
                  let arr = []
                  res.data.data.picture.forEach((item) => {
                    if(item != '') {
                      arr.push(getPic(item))
                    }
                  })
                  this.$set(this.form_Listb, 're_pic', arr)
                })
            }
            this.Listb = create_approval_list(res.data.data)
          })
      },
      get_img(many_enclosure) {
        if(!many_enclosure) {
          return
        }
        if(typeof many_enclosure == 'string'){
          let param = new URLSearchParams();
          param.append("enclosure_id", many_enclosure);
          let str = this.$test("/index.php/Mobile/approval/look_enclosure")
          this.$http.post(str, param)
            .then((res) => {
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              let arr = []
              res.data.data.picture.forEach((item) => {
                if(item != '') {
                  arr.push(getAvatar(item))
                }
              })
              // this.img_arr = arr
              this.$set(this.form_Lista, 'img_list', arr)
            })
        }else{
          many_enclosure.forEach((item) => {
            if(item.type === 3) {
              let param = new URLSearchParams();
              param.append("enclosure_id", item.contract_id);
              let str = this.$test("/index.php/Mobile/approval/look_enclosure")
              this.$http.post(str, param)
                .then((res) => {
                  var current = this
                  var judge = res.data.code
                  this.$testLogin(judge,current)
                  let arr = []
                  res.data.data.picture.forEach((item) => {
                    if(item != '') {
                      arr.push(getAvatar(item))
                    }
                  })
                  // this.img_arr = arr
                  this.$set(this.form_Lista, 'img_list', arr)
                })
            }
          })
        }
      },
      get_file(many_enclosure) {
        this.file_arr_com = []
        if(!many_enclosure) {
          return
        }
        if(typeof many_enclosure == 'string'){
          return
        }
        many_enclosure.forEach((item) => {
          if(item.type === 4) {
            let param = new URLSearchParams();
            param.append("attachments_id", item.contract_id);
            let str = this.$test("/index.php/Mobile/approval/look_attachments")
            this.$http.post(str, param)
              .then((res) => {
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                let obj = {}
                let file_data = res.data.data
                var str = process.env.NODE_ENV
                var picLeader = ''
                str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
                let file_add = picLeader + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                obj.name = file_data.file_name+'.'+file_data.attribute
                obj.address = file_add
                this.file_arr_com.push(obj)
              })
          }
        })
      },
      get_imgs(many_enclosure,info){
        if(!many_enclosure){
          return
        }
        if(typeof many_enclosure == 'string'){
          let param = new URLSearchParams()
          param.append('enclosure_id',many_enclosure)
          let str = this.$test('/index.php/Mobile/approval/look_enclosure')
          this.$http.post(str,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              let arr = []
              res.data.data.picture.forEach((item)=>{
                if(item != ''){
                  arr.push(getAvatar(item))
                }
              })
              this.$set(info,'imgs',arr)
            })
        }else{
          many_enclosure.forEach((item)=>{
            if(item.type == 3){
              let param = new URLSearchParams()
              param.append('enclosure_id',item.contract_id)
              let str = this.$test('/index.php/Mobile/approval/look_enclosure')
              this.$http.post(str,param)
                .then((res)=>{
                  var current = this
                  var judge = res.data.code
                  this.$testLogin(judge,current)
                  let arr = []
                  res.data.data.picture.forEach((item)=>{
                    if(item != ''){
                      arr.push(getAvatar(item))
                    }
                  })
                  this.$set(info,'imgs',arr)
                })
            }
          })
        }
      },
      get_files(many_enclosure,info){
        if(!many_enclosure){
          return
        }
        if(typeof many_enclosure == 'string'){
          return
        }
        many_enclosure.forEach((item)=>{
          let arr =[]
          if(item.type == 4){
            let param = new URLSearchParams()
            param.append('attachments_id',item.contract_id)
            let str = this.$test('/index.php/Mobile/approval/look_attachments')
            this.$http.post(str,param)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                let obj = {}
                let file_data = res.data.data
                var str = process.env.NODE_ENV
                var picLeader = ''
                str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
                let file_add = picLeader + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                obj.name = file_data.file_name+'.'+file_data.attribute
                obj.address = file_add
                arr.push(obj)
              })
            this.$set(info,'files',arr)
          }
        })
      },
      returnLi(){
        this.psb_if = false
        this.contrshow = true
      }
		},
		components: {
			browsePic,
			loading,
      psb
		},
    watch:{
      pic_time(){
        let param = new URLSearchParams()
        param.append("uid", this.user.uid);
        param.append("approval_id", this.psb_approval_id);
        param.append("personnel_id", this.personnel_id);
        param.append("company_id", this.nowCompanyId);
        param.append("finance_state", this.finance_state);
        param.append("receipt_content", this.handle_txt);
        param.append("receipt_pic", this.enclosure_id);
        let str = this.$test("/index.php/Mobile/find/finance_receipt")
        this.$http.post(str, param)
          .then((res)=>{
            this.loading_show = false
            if(res.data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.return_()
            } else {
              this.$message.error('操作失败');
            }
          })
      }
    }
	}
</script>

<style lang="scss" scoped="scoped">
	.form {
		background: #FFFFFF;
		padding: 10px;
		color: #999999;
		.as {
			display: block;
			button {
				float: right;
				position: relative;
				bottom: 50px;
			}
		}
    .file{
      font-size: 14px;
      margin: 4px auto;
      display: block;
      height: 24px;
      width: 80%;
      line-height: 24px;
      color: #5A5E66;
      border: 1px solid #F9F9F9;
      border-radius: 4px;
      background: #DDDDDD;
      text-align: center;
    }
		>.top {
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #fff;
      .el-button {
        position: absolute;
        top: 8px;
        left: 5px;
        margin: 0 !important;
      }
      p {
        width: 500px;
        margin: 0 auto;
        text-align: center;
        font-weight: bolder;
        padding: 15px 0;
      }
      a {
        position: absolute;
        top: 13px;
        right: 13px;
        cursor: pointer;
      }
    }
    .exam_info {
      cursor: default;
      display: block;
      border-bottom: 1px solid #DDDDDD;
      font-size: 14px;
      transition: .3s;
      margin-bottom: 4px;
      b{
        margin-left: 20px;
        margin-bottom:5px;
        display: block;
        span{
          margin-right: 15px;
          &:last-child{
            color: red;
          }
        }
      }
      p{
        margin-left: 30px;
        margin-bottom: 10px;
      }
      .enclosure{
        a{
          font-size: 14px;
          margin: 4px auto;
          display: block;
          height: 24px;
          width: 80%;
          line-height: 24px;
          color: #5A5E66;
          border: 1px solid #F9F9F9;
          border-radius: 4px;
          background: #DDDDDD;
          text-align: center;
        }
        img{
          width: 50px;
          height: 50px;
          margin: 5px;
        }
      }
      &:last-child{
        border-bottom: none;
      }
    }
		>div {
			display: block;
			border-bottom: 1px solid #DDDDDD;
			>span {
				vertical-align: top;
				font-size: 14px;
				line-height: 24px;
				&:nth-child(2) {
					margin-left: 5px;
					color: #444444;
				}
			}
			.approval {
				display: inline-block;
				span {
					font-size: 14px;
					line-height: 24px;
				}
			}
			img {
				display: inline-block;
				height: 80px;
				margin-right: 10px;
				cursor: pointer;
			}
		}
		.qingdan {
			font-size: 14px;
			padding: 4px 0;
			h4 {
				color: #409EFF;
				font-size: 15px;
				margin: 2px 0px;
			}
			p {
				height: 30px;
				line-height: 30px;
				span {
					margin-left: 5px;
					color: #444444;
				}
			}
		}
		.qingdan_qinggou {
			font-size: 14px;
			padding: 4px 0;
			h4 {
				color: #409EFF;
				font-size: 15px;
				margin: 2px 0px;
			}
			p {
				display: inline-block;
				min-width: 180px;
				height: 30px;
				line-height: 30px;
				span {
					margin-left: 5px;
					color: #444444;
				}
			}
		}
    .menu {
      margin-top: 10px;
      border-bottom: none;
      >button {
        display: block;
      }
      .button {
        margin-top: 10px;
        display: block;
        font-size: 0;
        z-index: 2;
        width: 100%;
        >button {
          margin-left: 50px;
          margin-top: 10px;
        }
        >label{
          overflow: hidden;
          height: 55px;
          display: block;
          display: flex;
          justify-content: center;
          textarea{
            min-height: 33px;
            display: inline-block;
            resize: none;
            padding: 5px 15px;
            line-height: 1.5;
            box-sizing: border-box;
            width: 100%;
            font-size: 14px;
            color: #606266;
            background-color: #FFf;
            background-image: none;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            &:focus{
              outline: 0;
              border-color: #5393ff;
            }
          }
        }
        .miao{
          margin-left: 30px;
          font-size: 14px;
        }
        #picc{
          margin-top: 10px;
          margin-left: 30px;
          ul{
            li{
              width: 85px;
              height: 85px;
            }
          }
        }
        .el-upload--picture-card{
          width: 85px;
          height: 85px;
          .el-upload-list__item.is-success{
            width: 85px;
            height: 85px;
          }
        }
        .el-icon-plus{
          position: relative;
          top: -25px;
        }
        .upload-demo_a{
          margin-top: 20px;
          margin-left: 30px;
        }
      }
    }
	}
  .contr{
    background: #FFFFFF;
    .top {
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #fff;
      .el-button {
        position: absolute;
        top: 8px;
        left: 5px;
        margin: 0 !important;
      }
      p {
        width: 500px;
        margin: 0 auto;
        text-align: center;
        font-weight: bolder;
        padding: 15px 0;
      }
      b {
        position: absolute;
        top: 13px;
        right: 13px;
        cursor: pointer;
      }
    }
  }
</style>

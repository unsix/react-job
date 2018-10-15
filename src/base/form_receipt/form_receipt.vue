<template>
	<div class="form_receipt">
		<div class="nav">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="未处理"></el-tab-pane>
				<el-tab-pane label="已处理"></el-tab-pane>
			</el-tabs>
		</div>
		<div class="list" v-show="listShow">
			<ul>
				<li v-for="(item,index) in untreated" :key="item.approval_id">
					<div class="avatar">
						<img :src="item.avatar" alt="" />
					</div>
					<div class="edit">
						<el-button type="primary" round @click="listCli(item,index)">查看</el-button>
					</div>
					<div class="content">
						<div class="creatTime">
							<span>发起时间：{{item.add_time}}</span>
						</div>
						<div class="name">
							<span>名称：{{item.name}}</span>
						</div>
						<!--<div class="creatTime">
							<span>处理时间：{{item.add_time}}</span>
						</div>-->
						<div class="type">
							<span>类型：{{item.type}}</span>
						</div>
						<div class="title">
							<span>标题：{{item.title}}</span>
						</div>
					</div>
				</li>
				<div class="page">
					<span @click="first_page">首页</span>
					<span @click="last_page" v-show="pageIndex > 1">上一页</span>
					<span @click="next_page" v-show="nextPageShow">下一页</span>
				</div>
			</ul>
		</div>
		<psb v-if="psb_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="handle_show" :psb_approval_id="psb_approval_id" @return_psb="return_psb">
		</psb>
		<qgd v-if="qgd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="handle_show" :psb_approval_id="psb_approval_id" @return_psb="return_psb">
		</qgd>
		<qkd v-if="qkd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="handle_show" :psb_approval_id="psb_approval_id" @return_psb="return_psb">
		</qkd>
    <cpj v-if="cpj_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="handle_show" :psb_approval_id="psb_approval_id" @return_psb="return_psb"></cpj>

    <sqgz v-if="gz_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="handle_show" :psb_approval_id="psb_approval_id" @return_psb="return_psb"></sqgz>

    <bxd v-if="bxd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="handle_show" :psb_approval_id="psb_approval_id" @return_psb="return_psb"></bxd>

    <gzd style="background: #FFF" v-if="gzd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="handle_show" :psb_approval_id="psb_approval_id" @return_psb="return_psb"></gzd>
  </div>
</template>

<script>
	import psb from '@/base/exam_form/psb'
	import qgd from '@/base/exam_form/qgd'
	import qkd from '@/base/exam_form/qkd'
  import cpj from '@/base/exam_form/cpj'
  import sqgz from '@/base/exam_form/sqgz'
  import bxd from '@/base/exam_form/bxd'
  import gzd from '@/base/exam_form/gzd'
  import {getAvatar} from '@/common/js/avatar.js'
	import {getPic} from '@/common/js/pic.js'
  import { create_exam_list } from '@/common/js/approval/exam'
	import { create_gongzhang_list } from '@/common/js/approval/gongzhang'
	import { create_qinggoudan_list } from '@/common/js/approval/qinggoudan'
	import { create_qingkuandan_list } from '@/common/js/approval/qingkuandan'
	import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
  import { create_baoxiaodan_list } from "@/common/js/approval/baoxiaodan"
	import { create_hetongpingshen_list } from '@/common/js/approval/hetongpingshen'
	import { create_approval_list } from '@/common/js/approval/approval_list'
	import { mapGetters ,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				untreated: [],
				form_Lista: {},
				form_Listb: {},
				finance_type: 1,
				psb_if: false,
				qgd_if: false,
        cpj_if:false,
        bxd_if:false,
        qkd_if: false,
        gzd_if:false,
        gz_if:false,
				listShow: true,
				nextPageShow: true,
				handle_show: true,
				pageIndex: 1,
				psb_approval_id: '',
				activeName: ''
			}
		},
		watch: {
			pageIndex() {
				this._get_data()
			},
			nowCompanyId(){
				this._get_data()
			}
		},
		computed: {
			...mapGetters([
				'nowCompanyId',
				'user'
			])
		},
		mounted() {
			if(this.$route.path === '/work/formReceipt') {
				this.$emit('changeWorkIndex', '4-8-2')
			}
		},
		created() {
			if(!localStorage.user){
				this.$router.push({ path: '/login' })
			}
			this.setUser(JSON.parse(localStorage.user))
			this.setNowCompanyId(JSON.parse(localStorage.nowCompanyId))
			this._get_data()
			this._getUserCompanyList()

		},

		methods: {
			handleClick(tab) {
				this.psb_if = false
				this.qkd_if = false
				this.qgd_if = false
				this.listShow = true
				let index = tab.index
				if(index === '0') {
					this.handle_show = true
					this.finance_type = 1
					this._get_data()
				} else if(index === '1') {
					this.handle_show = false
					this.finance_type = 2
					this._get_data()
				}

			},
      first_page() {
        this.pageIndex = 1
      },
      last_page() {
        this.nextPageShow = true
        --this.pageIndex
      },
      next_page() {
        ++this.pageIndex
      },
			_getUserCompanyList() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
        let str = this.$test("/index.php/Mobile/user/companies_list")
				this.$http.post(str, param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
						this.setCompanyList(res.data.data)
					})
			},
			_get_data() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("type", this.finance_type);
				param.append("company_id", this.nowCompanyId);
				param.append("p", this.pageIndex);
				param.append("each", 10);
        let str = this.$test("/index.php/Mobile/find/finance_list_formal")
				this.$http.post(str, param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
						let arr = []
						res.data.data.forEach((item) => {
							arr.push(create_exam_list(item))
						})
						this.untreated = arr
						if(arr.length < 10) {
							this.nextPageShow = false
						}
					})
			},
      rec_pic(item, index) {
        item.forEach((res)=>{
          let current = res.indexOf('?')
          this.arr_list.push(res.slice(0,current) + '?imageslim' )
        })
        this.pic_index = index
        this.pic_show = true
      },
			return_psb() {
				this.psb_if = false
				this.qgd_if = false
				this.qkd_if = false
        this.bxd_if = false
        this.cpj_if = false
        this.gz_if = false
        this.gzd_if = false
				this.listShow = true
				this._get_data()
			},
			listCli(item) {
				this.listShow = false
				this.psb_approval_id = item.approval_id
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_id", item.approval_id);
        let str = this.$test("/index.php/Mobile/approval/approval_process_show")
				this.$http.post(str, param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            if(item.type === '呈批件') {
              this.cpj_if = true
              this.form_Lista = create_cengpijian_list(res.data.data)
              this.get_img(this.form_Lista.many_enclosure)
              this.get_file(this.form_Lista.many_enclosure)
            } else if(item.type === '合同评审表') {
              this.psb_if = true
              this.form_Lista = create_hetongpingshen_list(res.data.data)
              if(this.form_Lista.many_enclosure){
                this.get_img(this.form_Lista.many_enclosure)
                this.get_file(this.form_Lista.many_enclosure)
              }else{
                this.get_img(this.form_Lista.enclosure_id)
                this.get_file(this.form_Lista.enclosure_id)
              }
            } else if(item.type === '请款单') {
              this.qkd_if = true
              this.form_Lista = create_qingkuandan_list(res.data.data)
              this.get_img(this.form_Lista.many_enclosure)
              this.get_file(this.form_Lista.many_enclosure)
            } else if(item.type === '申请公章') {
              this.gz_if = true
              this.form_Lista = create_gongzhang_list(res.data.data)
              this.get_img(this.form_Lista.many_enclosure)
              this.get_file(this.form_Lista.many_enclosure)
            } else if(item.type === '请购单') {
              this.qgd_if = true
              this.form_Lista = create_qinggoudan_list(res.data.data)
              this.get_img(this.form_Lista.many_enclosure)
              this.get_file(this.form_Lista.many_enclosure)
            } else if(item.type === '报销单'){
              this.bxd_if = true
              this.form_Lista = create_baoxiaodan_list(res.data.data)
              this.get_img(this.form_Lista.many_enclosure)
              this.get_file(this.form_Lista.many_enclosure)
            } else if(item.type === '个人请款单'){
              this.gzd_if = true
              this.form_Lista = res.data.data
              this.form_Lista.project_manager_name = this.form_Lista.project_manager_name.name
              this.get_img(this.form_Lista.many_enclosure)
              this.get_file(this.form_Lista.many_enclosure)
            }
					})
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				nparam.append("approval_id", item.approval_id);
				nparam.append("company_id", item.company_id);
        let httpUrl = this.$test("/index.php/Mobile/approval/approval_process_personnel")
				this.$http.post(httpUrl, nparam)
					.then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
						this.form_Listb = create_approval_list(res.data.data)
						if(res.data.data.content) {
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
                          arr.push(getAvatar(item))
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
              this.form_Listb = create_approval_list(res.data.data)
						}
            let mparam = new URLSearchParams()
            mparam.append('approval_id',item.approval_id)
            let httpUrls = this.$test('/index.php/Mobile/approval/find_sequence_attachment_new')
            this.$http.post(httpUrls,mparam)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                if(res.data.code == 0){
                  let form = res.data.data
                  if(form.form_content.optional.length > 0){
                    this.choices = form.form_content.optional
                  }
                  if(form.form_content.required.length > 0){
                    this.mands = form.form_content.required
                  }
                  if(form.auto_fill_fields){
                    if(form.auto_fill_fields.optional){
                      this.option = form.auto_fill_fields.optional
                    }
                    if(form.auto_fill_fields.required){
                      this.requir = form.auto_fill_fields.required
                    }
                  }
                  this.describe = form.enclosure_describe
                }
              })
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

					})

			},

			...mapMutations({
				setUser: 'SET_USER',
				setNowCompanyId: 'SET_NOWCOMPANY_ID',
				setComPersonList: 'SET_COM_PERSON_LIST',
				setComDepartList: 'SET_COM_DEPART_LIST',
				setComPartPersonList: 'SET_COM_PART_PERSON_LIST',
				setNowCompanyName: 'SET_NOWCOMPANY_NAME',
				setToken: 'SET_TOKEN',
				setUserState: 'SET_USERSTATE',
				setCompanyList: 'SET_COMPANYLIST'
			}),
			//		获取图片
			get_img(contract_id) {
				if(!contract_id) {
					return
				}
				let param = new URLSearchParams();
				param.append("enclosure_id", contract_id);
        let str = this.$test("/index.php/Mobile/approval/look_enclosure")
				this.$http.post(str, param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
						let arr = []
						res.data.data.picture.forEach((item) => {
							if(item != '') {
								if(item.indexOf('jpg') > 0 || item.indexOf('png') > 0 || item.indexOf('Enclos') > 0) {
									arr.push('http://bbsf-file.hzxb.net/FvxX0Q9Xf_7jlhruiU9VVPntp0iA')
								} else {
									arr.push(getPic(item))
								}
							}
						})
						this.$set(this.form_Lista, 'img_list', arr)
					})
			},
			get_moreimg(many) {
				many.forEach((item) => {
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
										if(item.indexOf('jpg') > 0 || item.indexOf('png') > 0 || item.indexOf('Enclos') > 0) {
											arr.push('http://bbsf-file.hzxb.net/FvxX0Q9Xf_7jlhruiU9VVPntp0iA')
										} else {
											arr.push(getPic(item))
										}
									}
								})
								this.$set(this.form_Lista, 'img_list', arr)
							})
					}
				})
			},
			_getToken() {
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
        let str = this.$test("/index.php/Mobile/path/get_token")
				this.$http.post(str, nparam)
					.then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
						localStorage.token = JSON.stringify(res.data.data);
						this.setToken(res.data.data)
					})
			},
      get_file(many_enclosure) {
        this.file_arr = []
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
                var str = process.env.NODE_ENV
                var picLeader = ''
                str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
                let file_data = res.data.data
                let file_add = picLeader + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                obj.name = file_data.file_name+'.'+file_data.attribute
                obj.address = file_add
                this.file_arr.push(obj)
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
                var str = process.env.NODE_ENV
                var picLeader = ''
                str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
                let file_data = res.data.data
                let file_add = picLeader + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                obj.name = file_data.file_name+'.'+file_data.attribute
                obj.address = file_add
                arr.push(obj)
              })
            this.$set(info,'files',arr)
          }
        })
      },
		},

		components: {
			psb,
			qgd,
			qkd,
      cpj,
      sqgz,
      bxd,
      gzd
		}
	}
</script>

<style lang="scss">
	.form_receipt {
		>.nav {
			width: 100%;
			.el-tabs__nav {
				background: #FFFFFF;
				width: 100% !important;
			}
			.el-tabs__header {
				margin-bottom: 5px;
			}
			.el-tabs__active-bar {
				width: 50%!important;
			}
			.el-tabs__item {
				font-weight: 700;
				font-size: 15px;
				width: 50%;
				text-align: center;
			}
		}
		.list {
			width: 100%;
			ul {
				>.page {
					padding: 4px;
					text-align: center;
					background: #FFFFFF;
					span {
						cursor: pointer;
						font-size: 12px;
						&:hover {
							color: #409EFF;
						}
					}
				}
				li {
					padding: 5px;
					background: #ffffff;
					margin-bottom: 5px;
					color: #2D2F33;
					font-size: 14px;
					box-shadow: 0 0 2px rgba(0, 0, 0, .2);
					-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
					span {
						line-height: 18px;
					}
					.avatar {
						display: inline-block;
						vertical-align: top;
						margin-top: 4px;
						img {
							width: 30px;
							height: 30px;
							border-radius: 50%;
							display: block;
						}
					}
					.edit {
						display: inline-block;
						float: right;
						margin-right: 20px;
						margin-top: 30px;
						cursor: pointer;
						.el-button.is-round {
							padding: 4px 12px;
						}
					}
					.content {
						padding: 4px 0;
						display: inline-block;
						max-width: 400px;
					}
				}
			}
		}
	}
</style>

<template>
	<div class="form" name="合同评审表">
		<div class="top">
      <el-button type="info" size="small" plain @click="return_" v-if="!qk_return">返回列表</el-button>
      <el-button type="info" size="small" plain @click="return_qk" v-if="qk_return">返回列表</el-button>
			<p class="title">合同评审表</p>
		</div>
		<div v-if="form_Lista.contract_name">
			<span>工程名称：</span><span>{{form_Lista.contract_name}}</span>
		</div>
		<div v-if="form_Lista.contract_name_new">
			<span>合同名称：</span><span>{{form_Lista.contract_name_new}}</span>
		</div>
		<div v-if="form_Lista.contract_num">
			<span>合同编号：</span><span>{{form_Lista.contract_num}}</span>
		</div>
		<div v-if="form_Lista.a_name">
			<span>甲方：</span><span>{{form_Lista.a_name}}</span>
		</div>
		<div v-if="form_Lista.b_name">
			<span>乙方：</span><span>{{form_Lista.b_name}}</span>
		</div>
		<div v-if="form_Lista.executor">
			<span>执行人：</span><span>{{form_Lista.executor}}</span>
		</div>
		<div v-if="form_Lista.project_manager_name">
			<span>项目负责人(项目经理)：</span><span>{{form_Lista.project_manager_name}}</span>
		</div>
		<div v-if="form_Lista.prive">
			<span>单价：</span><span>{{form_Lista.prive}}</span>
		</div>
		<div v-if="form_Lista.total_prive">
			<span>总价：</span><span>{{form_Lista.total_prive}}</span>
		</div>
		<div v-if="form_Lista.difference">
			<span>与投标价格差异：</span><span>{{form_Lista.difference}}</span>
		</div>
		<div v-if="form_Lista.pay_method">
			<span>付款方式：</span><span>{{form_Lista.pay_method}}</span>
		</div>
		<div v-if="form_Lista.arrive_time">
			<span>到货时间：</span><span>{{form_Lista.arrive_time}}</span>
		</div>
		<div v-if="form_Lista.arrive_time">
			<span>完工时间：</span><span>{{form_Lista.arrive_time}}</span>
		</div>
    <div v-if="form_Lista.content">
      <ul>
        <li v-for="item in form_Lista.content">
          <p>材料名称：<span>{{item.material_name}}</span></p>
          <p><b>单位：<span>{{item.unit}}</span></b> <b>数量：<span>{{item.num}}</span></b></p>
          <p><b>单价：<span>{{item.prive}}</span></b> <b>合计：<span>{{item.total_prive}}</span></b></p>
          <p><b>联系人：<span>{{item.contacts}}</span></b> <b>联系方式：<span>{{item.tel}}</span></b></p>
        </li>
      </ul>
    </div>
		<div v-if="form_Lista.remarks">
			<span>合同主要内容：</span><span>{{form_Lista.remarks}}</span>
		</div>
		<div>
			<span>附件列表：</span>
			<a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
		</div>
		<div v-if="form_Lista.img_list">
			<span>图片附件：</span>
			<a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list">
				<img :src="item" alt="" @click="ctrl_pic_show(form_Lista.img_list,index)" />
			</a>
		</div>
		<div v-if="form_Listb.found_name">
			<span>发起人：</span><span>{{form_Listb.found_name}}</span>
		</div>
		<div v-if="form_Listb.list">
			<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444;margin-left: 4px;">{{item}}</span>
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
        <div style="width: 530px;margin-left: 50px;background: #e3e4e9;">
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
</template>

<script>
	import loading from '@/base/loading/loading'
	import browsePic from '@/base/browse_pic/browse_pic'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
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
        status:'1'
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
      qk_return: {
        type: Boolean,
        default: false
      },
		},
		computed: {
			...mapGetters([
				'user',
				'nowCompanyId'
			])
		},
		methods: {
      return_qk() {
        this.$emit('return_qk')
      },
      return_() {
        this.$emit('return_psb')
        this.handle_txt === ''
      },

			rec_pic(item, index) {
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
      ctrl_pic_show(item, index) {
        item.forEach((res)=>{
          let current = res.indexOf('?')
          this.arr_list.push(res.slice(0,current) + '?imageslim' )
        })
        this.pic_index = index
        this.pic_show = true
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
			getFile(event) {
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
      handleRemove(file, fileList) {
        this.fileList = fileList
      },
      handlePreview(file, fileList) {
        if(file.name.indexOf('jpg') == '-1' && file.name.indexOf('png') == '-1'){
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
		},
		components: {
			browsePic,
			loading
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
      b {
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
				margin-right: 10px;
				display: inline-block;
				width: 80px;
				cursor: pointer;
			}
      ul{
        li{
          margin-bottom: 5px;
          font-size: 14px;
          p{
            margin-top: 5px;
            span{
              color: #000;
            }
            b{
              width: 250px;
              display: inline-block;
              font-weight: normal;
              span{
                color: #000;
              }
            }
          }
        }
      }
		}
		.file {
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
</style>

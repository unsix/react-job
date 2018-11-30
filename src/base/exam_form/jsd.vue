<template>
    <div class="form" name="结算单">
      <div class="top">
        <el-button size="small" type="primary" plain @click="return_">返回列表</el-button>
        <p class="title">结算单</p>
      </div>
      <div class="main">
        <el-button class="addconstrution mar" type="info"  size="small" >基本信息</el-button>
        <p>工程项目名称:<span>{{form_Lista.project_name}}</span></p>
        <p>施工位置:<span>{{form_Lista.project_adress}}</span></p>
        <p>请款施工班组:<span>{{form_Lista.construction_name}}</span></p>
        <p>截止日期:<span>{{form_Lista.closing_data}}</span></p>
        <p>合同金额:<span>{{form_Lista.contract_price}}</span></p>
        <p>项目负责人:<span>{{form_Lista.project_manager_name}}</span></p>
        <el-button class="addconstrution mar" type="info"  size="small" >产值</el-button>
        <li v-for = '(item,index) in form_Lista.list_json'>
          <el-button class="addconstrution" type="primary"  size="small"  >{{index+1}}</el-button>
          <p>施工内容:<span>{{item.content}}</span></p>
          <p>单位:<span>{{item.unit}}</span></p>
          <p>数量:<span>{{item.amount}}</span></p>
          <p>单价:<span>{{item.unit_price}}</span></p>
          <p>合计金额:<span>{{item.sum_price}}</span></p>
          <p>备注:<span>{{item.remarks}}</span></p>
        </li>
        <p >截止到 {{form_Lista.closing_data}}班组产值合计:<span>{{form_Lista.total_price}}</span></p>
        <el-button  class="addconstrution mar" type="info"  size="small" >已支付</el-button>
        <li v-for = '(item,index) in form_Lista.pay_list_json'>
          <el-button class="addconstrution" type="primary"  size="small"  >{{index+1}}</el-button>
          <p>内容:<span>{{item.content}}</span></p>
          <p>合计金额:<span>{{item.sum_price}}</span></p>
        </li>
        <p >截止到 {{form_Lista.closing_data}}累计支付工程款:<span>{{form_Lista.pay_total_price}}</span></p>
        <el-button  class="addconstrution mar"  type="info"  size="small"  >扣款项</el-button>
        <li v-for = '(item,index) in form_Lista.chargebacks_list_json'>
          <el-button class="addconstrution" type="primary"  size="small"  >{{index+1}}</el-button>
          <p>内容:<span>{{item.content}}</span></p>
          <p>合计金额:<span>{{item.sum_price}}</span></p>
        </li>
        <el-button class="addconstrution mar" type="info"  size="small" >剩余工程款</el-button>
        <p>截止到 {{form_Lista.closing_data}} 班组剩余工程款:<span>{{form_Lista.chargebacks_price}}</span></p>
        <div  class="upload_arr">
          <li class="picture">
            <span >图片附件:</span>
            <img :src="item" alt=""  v-for="(item,index) in form_Lista.img_list"  @click="ctrl_pic_show(form_Lista.img_list,index)"/>
          </li>
          <li >
            <span >附件列表:</span>
            <!--<a v-for="(item,index) in form_Lista.many_enclosure"  target="_blank" class="file"><span>{{item.name}}</span></a>-->
          <li  v-for="item in form_Lista.app_list"  style="font-size: 14px;margin: 5px 10px;cursor: pointer;" @click="look(item)">
            <p><span style="margin-left: 0">{{item.add_time}}</span></p>
            <p>类型：<span>{{item.type}}</span></p>
            <p>标题：<span>{{item.title}}</span></p>
            <p>审批进程：<span v-html="item.approval_state"></span></p>
          </li>
          <li class="apple_list" v-for="item in form_Lista.apple_list"  @click="look(item)">
            <img class="avatar" :src="item.avatar" alt="">
            <p><span style="margin-left: 0">{{item.add_time}}</span></p>
            <p><span>{{item.name}}{{item.phone}}</span></p>
            <p>请款月份：<span>{{item.month}}</span></p>
            <p>应付金额:<span>{{item.pay_amount}}元</span></p>
            <p><span v-html="item.pryroll_status"></span></p>
          </li>
          </li>
        </div>
        <p>发起人:<span>{{form_Listb.found_name}}</span></p>
        审批人员:<li  v-for="item in form_Listb.list" style=" margin-left: 8px;display: inline-block">
        <p><span>{{item}}</span></p>
      </li>
      </div>
      <div>
        <span>审批：</span>
        <div v-for="item in form_Listb.content" class="exam_info">
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
    data(){
      return{
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
        many_enclosure:{},
        fileList: [],
        personnel_id:'',
        pic_time:0,
        enclosure_id:'',
        finance_state:'',
        status:'1',
        insdent:''
      }
    },
    methods:{
      add_html(){
        setTimeout(()=>{
          let str = this.$test('/index.php/Mobile/skey/look_draft?id=')
          this.insdent =str + this.form_Lista.contract_request_id+'&operation=2&view=4'
          let param = new URLSearchParams
          param.append('uid',this.user.uid)
          param.append('company_id',this.form_Lista.company_id)
          param.append('approval_id',this.form_Lista.approval_id)
          let src = this.$test('/index.php/Mobile/find/get_download_token')
          this.$http.post(src,param)
            .then((res)=>{
              var cur = this
              var jud = res.data.code
              this.$testLogin(jud,cur)
              let str = this.$test('/index.php/Mobile/skey/aaampd_picture?token=')
              this.downUrl = str + res.data.data
            })
        },500)
      },
      return_(){
        this.$emit('return_psb')
      },
      rec_pic(item,index){
        item.forEach((res)=>{
          let current = res.indexOf('?')
          this.arr_list.push(res.slice(0,current) + '?imageslim' )
        })
        this.pic_index = index
        this.pic_show = true
      },
      cl_pic(item,index){
        item.forEach((res)=>{
          let current = res.indexOf('?')
          this.arr_list.push(res.slice(0,current) + '?imageslim' )
        })
        this.pic_index = index
        this.pic_show = true
      },
      ctrl_pic_show(item,index){
        item.forEach((res)=>{
          let current = res.indexOf('?')
          this.arr_list.push(res.slice(0,current) + '?imageslim' )
        })
        this.pic_index = index
        this.pic_show = true
      },
      handle(){
        this.menuShow = !this.menuShow
        let param = new URLSearchParams()
        param.append("uid",this.user.uid)
        let str = this.$test("/index.php/Mobile/path/get_token")
        this.$http.post(str, param)
          .then((res)=>{
            this.input_value = res.data.data
          })
      },
      closeMenu(){
        this.menuShow = false
      },
      getFile(event){
        this.file = event.target.files
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
    },
    created(){
      this.add_html()
    },
    props:{
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
    },
    computed: {
      ...mapGetters([
        'user',
        'nowCompanyId'
      ])
    },
    components: {
      browsePic,
      loading
    },
  }
</script>

<style lang="scss">
  li{
    list-style: none;
  }
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
  .main{
    margin-left: 20px;
    line-height: 20px;
    font-size: 14px;
    li{
      border-bottom: 1px #eee solid;
    }
    p{
      line-height: 1.8;
      span{
        color: blue;
        margin-left: 5px;
      }
    }
  }
  .enclosure{
    margin-top: 10px;
    margin-left: 15px;
    font-size: 15px;
    div{
      margin-top: 5px;
      margin-left: 10px;
    }
    span{
      vertical-align: top;
      display: block;
    }
    a{
      font-size: 14px;
      margin-right: 20px;
      display: block;
      height: 24px;
      width: 80%;
      line-height: 24px;
      color: #5A5E66;
      border: 1px solid #F9F9F9;
      border-radius: 4px;
      background: #DDDDDD;
      text-align: center;
      float: right;
    }
    img{
      width: 50px;
      height: 50px;
      margin: 5px;
    }
  }
  .upload_arr{
    vertical-align: top;
    li{
      border-bottom: 1px #e3e4e9 solid;
      line-height: 2;
    }
    .picture{
      border: none;
    }
    .apple_list{
      display: inline-block;
      font-size: 14px;
      margin: 18px 21px;
      cursor: pointer;
      text-align: center;
      img{
        width: 50px!important;
        height: 50px;
        margin: 0 0 10px 0
      }
    }
    .avatar{
      border-radius: 50% ;
    }
  }
  .operate{
    font-size: 14px;
    margin-left: 25px;
    margin-top: 10px;
    padding-bottom: 10px;
    li{
      line-height: 20px;
    }
  }
  .choose_btn{
    margin-top: 30px;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    align-content: center;
  }
  .mar{
    width: 94%!important;
  }
  .addconstrution{
    clear: both;
    margin: 10px 0 7px 0!important;
  }
  .page_number_p{
    margin: 0 10px 20px 10px;
    font-size: 14px;
    line-height: 1.3;
  }

</style>

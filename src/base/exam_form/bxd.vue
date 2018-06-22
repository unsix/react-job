<template>
  <div class="form" name="报销单">
    <div class="top">
      <el-button type="primary" plain @click="return_">返回列表</el-button>
      <span class="title">报销单</span>
    </div>
    <div>
      <span>报销人：</span><span>{{form_Lista.title}}</span>
    </div>
    <div>
      <span>项目负责人(部门经理)：</span><span>{{form_Lista.project_manager_name}}</span>
    </div>
    <div>
      <span style="color: red;"><span>总额：</span>{{form_Lista.money}}<span style="display: block">{{form_Lista.big_money}}</span></span>
    </div>
    <div v-for="item in form_Lista.content" class="qingdan">
      <h4>报销条目</h4>
      <p>日期:<span>{{item.month_day}}</span></p>
      <p>报销内容:<span>{{item.content}}</span></p>
      <p>金额:<span>{{item.price}}</span></p>
      <p>单据张数:<span>{{item.amount}}</span></p>
      <p>备注:<span>{{item.remarks}}</span></p>
      <p>大写总额<span>{{item.big_price}}</span></p>
    </div>
    <div>
      <span>附件列表：</span>
      <a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
    </div>
    <div>
      <span>图片附件：</span>
      <a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list">
        <img :src="item" alt="" @click="ctrl_pic_show(form_Lista.img_list,index)" />
      </a>
    </div>
    <div>
      <span>发起人：</span><span>{{form_Listb.found_name}}</span>
    </div>
    <div>
      <span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444; margin-left: 8px;">{{item}}
						</span>
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
          </div>
        </div>
        <p>审批时间:{{item.add_time}}</p>
      </div>
    </div>
    <div class="menu" v-show="handle_show">
      <el-button type="primary" plain @click="handle">处理</el-button>
      <div class="button" v-show="menuShow">
        <el-input type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
        <input name="token" type="hidden" :value="input_value">
        <input type="file" @change="getPic($event)" multiple="multiple" accept="image/png,image/jpeg" />
        <el-button type="primary" round @click="agree($event)">同意</el-button>
        <el-button type="danger" round @click="refuse">拒绝</el-button>
      </div>
    </div>

    <browsePic :pic_index="pic_index" ref="browe" :img_arr="arr_list"  v-show="pic_show"></browsePic>

  </div>
</template>

<script>
  import loading from '@/base/loading/loading'
  import {getCro} from "@/common/js/crowd";
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
            arr_list: []
          }
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
          }
        },
        computed:{
          ...mapGetters([
            'user',
            'nowCompanyId'
          ])
        },
        methods:{
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
            this.menuShow = true
            let param = new URLSearchParams()
            param.append("uid",this.user.uid)
            this.$https.post("/index.php/Mobile/path/get_token", param)
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
          agree(){
            if(this.handle_txt === ''){
              this.$message.error('请填写回执内容')
            }
            if(!this.file){
              this.$message.error('确认回执必须上传图片')
              return
            }
            if(this.file){
              if(this.file.length === 0){
                this.$message.error('确认回执必须上传图片')
                return
              }
              for (let i = 0;i<this.file.length;i++){
                let formData = new FormData();
                formData.append('file',this.file[i])
                formData.append('token',this.input_value)
                let config = {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }
                this.$http.post('https://up.qbox.me/', formData, config)
                  .then((res)=>{
                    this.pic_hash_arr.push(res.data.hash)
                  })
              }
              if(this.pic_hash_arr.length === this.file.length){
                this.loading_show = true
                let nparam = new URLSearchParams()
                nparam.append("uid",this.user.uid)
                nparam.append("company_id",this.nowCompanyId)
                this.$http.post("/index.php/Mobile/User/return_company_new",nparam)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    getCro(judge,current)
                    this.now_personnel_id = res.data.data.personnel_id
                    if(this.now_personnel_id = res.data.data.personnel_id){
                      let nparam = new URLSearchParams()
                      nparam.append("uid",this.user.uid)
                      nparam.append("approval_id",this.psb_approval_id)
                      param.append("personnel_id", this.now_personnel_id);
                      param.append("company_id", this.nowCompanyId);
                      param.append("finance_state", 1);
                      param.append("receipt_content", '111');
                      param.append("receipt_pic", res.data.data.enclosure_id);
                      this.$http.post("/index.php/Mobile/find/finance_receipt", param)
                        .then((res)=>{
                          var current = this
                          var judge = res.data.code
                          getCro(judge,current)
                          this.loading_show = false
                          if(res.data.code === 0){
                            this.$message({
                              message: '恭喜你，操作成功',
                              type: 'success'
                            });
                            this.return_()
                          }else{
                            this.$message.error('操作失败')
                          }
                        })
                    }
                  })
              }
            }
          },
          refuse(){
            if(this.handle_txt === ''){
              this.$message.error('请填写回执内容')
              return
            }
            if(!this.file){
              let nparam = new URLSearchParams()
              nparam.append("uid", this.user.uid);
              nparam.append("approval_id", this.psb_approval_id);
              nparam.append("personnel_id", this.now_personnel_id);
              nparam.append("company_id", this.nowCompanyId);
              nparam.append("finance_state", 1);
              nparam.append("receipt_content", this.handle_txt);
              this.$http.post("/index.php/Mobile/find/finance_receipt", param)
                .then((res)=>{
                  var current = this
                  var judge = res.data.code
                  getCro(judge,current)
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
            if(this.file){
              for(let i = 0; i < this.file.length; i++) {
                let formData = new FormData();
                formData.append('file', this.file[i]);
                formData.append('token', this.input_value);
                let config = {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }
                this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
                  this.pic_hash_arr.push(res.data.hash)
                })
              }
              if(this.pic_hash_arr.length === this.file.length){
                this.loading_show = true
                let mparam = new URLSearchParams();
                mparam.append("uid",this.user.uid)
                mparam.append("company_id",this.nowCompanyId)
                this.$http.post("/index.php/Mobile/User/return_company_new", mparam)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    getCro(judge,current)
                    this.now_personnel_id = res.data.data.personnel_id
                    if(this.now_personnel_id === res.data.data.personnel_id) {
                      let nparam = new URLSearchParams();
                      nparam.append("uid", this.user.uid);
                      nparam.append("picture", JSON.stringify(this.pic_hash_arr));
                      this.$http.post("/index.php/Mobile/approval/upload_enclosure_new", nparam)
                        .then((res) => {
                          var current = this
                          var judge = res.data.code
                          getCro(judge,current)
                          let param = new URLSearchParams();
                          param.append("uid", this.user.uid);
                          param.append("approval_id", this.psb_approval_id);
                          param.append("personnel_id", this.now_personnel_id);
                          param.append("company_id", this.nowCompanyId);
                          param.append("finance_state", 1);
                          param.append("receipt_content", '111');
                          param.append("receipt_pic", res.data.data.enclosure_id);
                          this.$http.post("/index.php/Mobile/find/finance_receipt", param)
                            .then((res) => {
                              var current = this
                              var judge = res.data.code
                              getCro(judge,current)
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
                        })
                    }
                  })
              }
            }
          }
        },
        components:{
          browsePic,
          loading
        }
  }
</script>

<style lang="scss" scoped="scoped">
  .form {
    background: #FFFFFF;
    padding: 10px;
    color: #999999;
    >.top {
      width: 100%;
      display: block;
      button {
        margin-left: 10px;
        margin-top: 10px;
        display: inline-block;
      }
      .title {
        font-size: 16px;
        width: 100%;
        display: inline-block;
        text-align: center;
        height: 30px;
        line-height: 30px;
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
        margin-left: 120px;
        display: block;
        font-size: 0;
        z-index: 2;
        width: 300px;
        input[type="file"] {
          margin: 10px 0 10px 0px;
        }
        >button {
          margin-left: 50px;
        }
      }
    }
  }
</style>

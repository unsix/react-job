<template>
  <div class="form" name="请款单">
    <div class="top">
      <el-button type="info" plain @click="return_">返回列表</el-button>
      <span class="title">请款单</span>
    </div>
    <div v-if="form_Lista.contract_name">
      <span>工程名称：</span><span>{{form_Lista.contract_name}}</span>
    </div>
    <div v-if="form_Lista.contract_name_new">
      <span>合同名称：</span><span>{{form_Lista.contract_name_new}}</span>
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
    <div v-if="form_Lista.request_num">
      <span>请款次数：</span><span>{{form_Lista.request_num}}</span>
    </div>
    <div v-if="form_Lista.subtotal">
      <span>合同金额￥：</span><span>{{form_Lista.subtotal}}</span>
    </div>
    <div v-if="form_Lista.gain_reduction_subtotal">
      <span>增减金额￥：</span><span>{{form_Lista.gain_reduction_subtotal}}</span>
    </div>
    <div v-if="form_Lista.balance_subtotal">
      <span>已领工程款￥：</span><span>{{form_Lista.balance_subtotal}}</span>
    </div>
    <div v-if="form_Lista.request_subtotal">
      <span>本次请款￥：</span><span>{{form_Lista.request_subtotal}}</span>
    </div>
    <div v-if="form_Lista.request_content">
      <span>请款内容：</span><span>{{form_Lista.request_content}}</span>
    </div>
    <div v-if="file_arr">
      <span>附件列表：</span>
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
      <div class="exam_info">
        <div class="avatar lzz">
          <span style="margin-left: 5px;">状态</span>
        </div>
        <div class="name lzz">
          <span>姓名</span>
        </div>
        <div class="tel lzz">
          <span>时间</span>
        </div>
        <div class="operation lzz">
          <span>回复</span>
        </div>
      </div>
      <div v-for="item in form_Listb.content">
        <div class="exam_info">
          <div class="avatar">
            <span>{{item.is_agree}}</span>
          </div>
          <div class="name">
            <span>{{item.name}}</span>
          </div>
          <div class="tel">
            <span>{{item.add_time}}</span>
          </div>
          <div class="operation">
            <span>{{item.opinion}}</span>
          </div>
        </div>
        <div>
          <img :src="list" alt="" v-for="(list,index) in item.picture" @click="cl_pic(item,index)" />
        </div>
      </div>
    </div>
    <div v-if="form_Listb.finance">
      <span>表单回执：</span>
      <br />
      <span style="color: #444444;">
						<span v-html="form_Listb.finance.finance_state"></span> {{form_Listb.finance.name}} {{form_Listb.finance.receipt_content}} {{form_Listb.finance.save_time}}
			<div><img :src="list" alt="" v-for="(list,index) in form_Listb.re_pic" @click="rec_pic(form_Listb.re_pic,index)" /></div>
			</span>
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

    <loading v-show="loading_show"></loading>
  </div>
</template>

<script>
  import loading from '@/base/loading/loading'
  import browsePic from '@/base/browse_pic/browse_pic'
  import { mapGetters, mapMutations } from 'vuex'
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
        arr_list: []
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
      }
    },
    created() {
      this._getToken()
    },
    computed: {
      ...mapGetters([
        'user',
        'nowCompanyId',
        'token'
      ])
    },
    methods: {
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
        let httpUrl = this.$test("/index.php/Mobile/path/get_token")
        this.$http.post(httpUrl, param)
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
        if(this.handle_txt === '') {
          this.$message.error('请填写回执内容');
          return
        }
        if(!this.file) {
          this.$message.error('确认回执必须上传图片');
          return
        }
        if(this.file) {
          if(this.file.length === 0) {
            this.$message.error('确认回执必须上传图片');
            return
          }
          for(let i = 0; i < this.file.length; i++) {
            this.loading_show = true
            let formData = new FormData();
            formData.append('file', this.file[i]);
            formData.append('token', this.token);
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
              this.pic_hash_arr.push(res.data.hash)
              if(this.pic_hash_arr.length === this.file.length) {
                let mparam = new URLSearchParams();
                mparam.append("uid", this.user.uid);
                mparam.append("company_id", this.nowCompanyId);
                let httpUrl = this.$test("/index.php/Mobile/User/return_company_new")
                this.$http.post(httpUrl, mparam)
                  .then((res) => {
                    var current = this
                    var judge = res.data.code
                    this.$testLogin(judge,current)
                    this.now_personnel_id = res.data.data.personnel_id
                    if(this.now_personnel_id === res.data.data.personnel_id) {
                      let nparam = new URLSearchParams();
                      nparam.append("uid", this.user.uid);
                      nparam.append("picture", JSON.stringify(this.pic_hash_arr));
                      let httpUrl = this.$test("/index.php/Mobile/approval/upload_enclosure_new")
                      this.$http.post(httpUrl, nparam)
                        .then((res) => {
                          var current = this
                          var judge = res.data.code
                          this.$testLogin(judge,current)
                          let param = new URLSearchParams();
                          param.append("uid", this.user.uid);
                          param.append("approval_id", this.psb_approval_id);
                          param.append("personnel_id", this.now_personnel_id);
                          param.append("company_id", this.nowCompanyId);
                          param.append("finance_state", 1);
                          param.append("receipt_content", this.handle_txt);
                          param.append("receipt_pic", res.data.data.enclosure_id);
                          let httpUrl = this.$test("/index.php/Mobile/find/finance_receipt")
                          this.$http.post(httpUrl, param)
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
                        })
                    }
                  })
              }
            })
          }
        }
      },
      refuse() {
        if(this.handle_txt === '') {
          this.$message.error('请填写回执内容');
          return
        }
        if(!this.file) {
          let param = new URLSearchParams();
          param.append("uid", this.user.uid);
          param.append("approval_id", this.psb_approval_id);
          param.append("personnel_id", this.now_personnel_id);
          param.append("company_id", this.nowCompanyId);
          param.append("finance_state", 1);
          param.append("receipt_content", this.handle_txt);
          let httpUrl = this.$test("/index.php/Mobile/find/finance_receipt")
          this.$http.post(httpUrl, param)
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
        if(this.file) {
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
          if(this.pic_hash_arr.length === this.file.length) {
            this.loading_show = true
            let mparam = new URLSearchParams();
            mparam.append("uid", this.user.uid);
            mparam.append("company_id", this.nowCompanyId);
            let httpUrl = this.$test("/index.php/Mobile/User/return_company_new")
            this.$http.post(httpUrl, mparam)
              .then((res) => {
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                this.now_personnel_id = res.data.data.personnel_id
                if(this.now_personnel_id === res.data.data.personnel_id) {
                  let nparam = new URLSearchParams();
                  nparam.append("uid", this.user.uid);
                  nparam.append("picture", JSON.stringify(this.pic_hash_arr));
                  let httpUrl = this.$test("/index.php/Mobile/approval/upload_enclosure_new")
                  this.$http.post(httpUrl, nparam)
                    .then((res) => {
                      var current = this
                      var judge = res.data.code
                      this.$testLogin(judge,current)
                      let param = new URLSearchParams();
                      param.append("uid", this.user.uid);
                      param.append("approval_id", this.psb_approval_id);
                      param.append("personnel_id", this.now_personnel_id);
                      param.append("company_id", this.nowCompanyId);
                      param.append("finance_state", 1);
                      param.append("receipt_content",  this.handle_txt);
                      param.append("receipt_pic", res.data.data.enclosure_id);
                      let httpUrl = this.$test("/index.php/Mobile/find/finance_receipt")
                      this.$http.post(httpUrl, param)
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
                    })
                }
              })
          }
        }
      },
      _getToken() {
        let nparam = new URLSearchParams();
        nparam.append("uid", this.user.uid);
        let httpUrl = this.$test("/index.php/Mobile/path/get_token")
        this.$http.post(httpUrl, nparam)
          .then((res) => {
            localStorage.token = JSON.stringify(res.data.data);
            this.setToken(res.data.data)
          })
      },
      ...mapMutations({
        setToken: 'SET_TOKEN'
      })
    },
    components: {
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
    .as {
      display: block;
      button {
        float: right;
        position: relative;
        bottom: 50px;
      }
    }
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
      margin-bottom: 0px;
      >.lzz {
        font-weight: 700;
        font-size: 15px;
        text-indent: 2px;
      }
      &:nth-child(2) {
        background: rgb(245, 247, 250);
      }
      &:hover {
        background: #EEEEEE;
      }
      >div {
        height: 40px;
        line-height: 40px;
        display: inline-block;
      }
      .avatar {
        vertical-align: top;
        width: 70px;
      }
      .name {
        width: 80px;
      }
      .tel {
        width: 150px;
      }
      .operation {
        width: 240px;
        button {
          display: block;
        }
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

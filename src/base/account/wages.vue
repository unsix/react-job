<template>
  <div>
    <div class="wages" v-show="wage_show">
      <div class="top">
        <p>发工资</p>
        <b @click="look_bill('账单')">账单</b>
      </div>
      <div class="main">
        <el-form :rules="wage_rule" :model="wage_form" ref="wage_form" label-width="120px" class="wage">
          <el-form-item label="支付宝账号" prop="alipay">
            <el-input v-model="wage_form.alipay"></el-input>
          </el-form-item>
          <el-form-item label="选择合同" prop="contract">
            <el-input v-model="wage_form.contract" :readonly="true" @focus="choose_contract"></el-input>
          </el-form-item>
          <el-form-item label="对方姓名" prop="name">
            <el-input v-model="wage_form.name" :readonly="true" @focus="choose_contract"></el-input>
          </el-form-item>
          <el-form-item label="付款内容" prop="body">
            <el-input v-model="wage_form.body"></el-input>
          </el-form-item>
          <el-form-item label="总金额" prop="account">
            <el-input v-model="wage_form.account"></el-input>
          </el-form-item>
          <el-form-item label="本次付款金额" prop="once_money">
            <el-input v-model="wage_form.once_money"></el-input>
          </el-form-item>
          <el-form-item label="付款方式" prop="way_pay">
            <el-radio-group v-model="wage_form.way_pay" @change="choose">
              <el-radio label="支付宝"></el-radio>
              <el-radio label="其他"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-upload class="upload-demo" v-show="upload_show" id="picc" v-model="wage_form.many_enclosure"  multiple accept="image/jpeg,image/png" action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form>
        <span style="float: right;margin: 0 20px 20px;font-size: 14px;color: #5a5e66;display: block;cursor: pointer" @click="look_bill('更多记录')">更多记录</span>
        <el-button class="btn" type="primary" @click="send_pay('wage_form')">去付款</el-button>
      </div>
    </div>

    <div class="contract_list" v-show="list_show">
      <div class="top">
        <el-button @click="_relog" size="small" type="warning" plain>返回</el-button>
        <p>选择合同</p>
      </div>
      <div class="list">
        <ul>
          <li v-for="(item,index) in untreated" :key="item.approval_id" ref="list" :style="{background:item.tagging}">
            <div class="edit">
              <el-button type="primary" round @click="viewInfo(item)">查看</el-button>
              <el-button type="success" round @click="useInfo(item,index)">使用</el-button>
            </div>
            <div class="content">
              <div class="title">
                <span>{{item.add_time}}</span>
              </div>
              <div class="type">
                <span>{{item.contract_name}}</span>
              </div>
              <div class="type">
                <span>乙方姓名:{{item.worker_name}}</span>
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
    </div>

    <div class="order_contract" v-if="order_show">
      <div class="top">
        <el-button @click="_relogs" size="small" type="warning" plain>返回</el-button>
        <p>查看合同</p>
      </div>
      <iframe class="win" :src="core" scrolling="yes" height="100%" seamless frameborder="0"></iframe>
    </div>

    <div class="bill_list" v-show="bill_show">
      <div class="top">
        <el-button @click="_relogsd" size="small" type="warning" plain>返回</el-button>
        <p>账单</p>
        <b @click="screen">筛选</b>
      </div>
      <div class="bill_main">
        <div class="search">
          <el-input v-model="handle_name" @keyup.enter.native="_get_bill" placeholder="请输入用户名" style="text-align: center"></el-input>
        </div>
        <ul>
          <li v-for="item in list_bill" @click="viewInfo(item)">
            <div class="add_time">
              <span>交易时间:</span><span>{{item.add_time}}</span>
            </div>
            <ul>
              <li>
                <span>支付宝账号:</span><span>{{item.alipay_id}}</span>
              </li>
              <li>
                <span>目标用户:</span><span>{{item.handle_name}}</span>
              </li>
              <li>
                <span>目标合同:</span><span>{{item.contract_name}}</span>
              </li>
              <li>
                <span>付款内容:</span><span>{{item.body}}</span>
              </li>
              <li>
                <p><span>总金额:</span><span>{{item.money}}</span></p>
                <p><span>本次付款金额:</span><span>{{item.pay_paid}}</span></p>
              </li>
              <li>
                <span>付款方式:</span>
                <span>
                  <el-radio-group v-model="item.pay_type" disabled>
                    <el-radio label="支付宝"></el-radio>
                    <el-radio label="其他"></el-radio>
                  </el-radio-group>
                </span>
              </li>
            </ul>
            <div class="add_time">
              <span style="color: #81C9FF;cursor: pointer" @click.stop="show_pic(item.basis)">点击查看付款截图</span>
            </div>
          </li>
        </ul>

      </div>
      <div class="page">
        <span @click="first_page">首页</span>
        <span @click="last_page" v-show="pageIndex > 1">上一页</span>
        <span @click="next_page" v-show="nextPageShow">下一页</span>
      </div>
    </div>

    <loading v-show="loadingShow" style="z-index: 999"></loading>

    <div class="as_what" v-show="sendShow">
      <div>
        <i class="el-icon-close" @click="close_as"></i>
        <ul  v-show="secret == '列表'">
          <h2>选择筛选依据</h2>
          <li v-for="(item,index) in asType" @click="as_click(item)" >{{item}}</li>
        </ul>
        <el-date-picker v-show="secret == '年'" v-model="heaven.year" type="year" placeholder="选择年份" @change="choose_year"></el-date-picker>
        <el-date-picker v-show="secret == '月'" v-model="heaven.month" type="month" placeholder="选择月份" @change="choose_month"></el-date-picker>
      </div>
    </div>

    <browsePic :pic_index="pic_index" ref="browe" :img_arr="arr_list"  v-show="pic_show"></browsePic>
    </div>
</template>

<script>
  import loading from '@/base/loading/loading'
  import moment from 'moment'
  import { mapGetters, mapMutations } from 'vuex'
  import browsePic from '@/base/browse_pic/browse_pic'
  export default {
    data(){
      return{
        wage_rule:{
          alipay:[{
            required: true,
            message: '请填写支付宝账号',
            trigger: 'blur'
          }],
          body:[{
            required: true,
            message: '请填写付款内容',
            trigger: 'blur'
          }],
          contract:[{
            required: true,
            message:'',
            trigger: 'change'
          }],
          name:[{
            required: true,
            message:'',
            trigger: 'change'
          }],
          account:[{
            pattern:/^[1-9]\d*|0$/,
            message: '请填写正确的金额',
            trigger: 'change',
            required: true,
          }],
          once_money:[{
            pattern:/^[1-9]\d*|0$/,
            message: '请填写正确的金额',
            trigger: 'change',
            required: true,
          }],
          way_pay:[{
            required: true,
            message: '必须选择一个',
            trigger: 'change'
          }]
        },
        wage_form:{
          alipay:'',
          contract:'',
          name:'',
          account:'',
          once_money:'',
          way_pay:'',
          body:'',
          many_enclosure:[]
        },
        upload_show:false,
        fileList:[],
        str:'',
        wage_show:true,
        list_show:false,
        untreated: [],
        pageIndex: 1,
        nextPageShow: true,
        order_show:false,
        core:'',
        rate:'',
        contract_id:'',
        handle_uid:'',
        pay_type:'',
        picArr:[],
        pic_hash_arr:[],
        enclosure_id:'',
        loadingShow:false,
        bill_show:false,
        handle_name:'',
        list_bill:[],
        sendShow:false,
        asType:['年','月','出账','入账'],
        secret:'列表',
        heaven:{
          year:'',
          month:'',
        },
        way:'',
        year:'',
        month:'',
        type:'1',
        pic_index:0,
        arr_list:[],
        pic_show: false
      }
    },
    methods:{
      ...mapMutations({
        setToken: 'SET_TOKEN'
      }),
      _getToken() {
        let nparam = new URLSearchParams();
        nparam.append("uid", this.user.uid);
        this.$http.post("/index.php/Mobile/path/get_token", nparam)
          .then((res) => {
            localStorage.token = JSON.stringify(res.data.data);
            this.setToken(res.data.data)
          })
      },
      choose(res){
        if(res == '其他'){
          this.upload_show = true
        }else{
          this.upload_show = false
        }
      },
      send_pay(formName){
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.wage_form.way_pay == '其他'){
              if(this.fileList.length){
                this.fileList.forEach((item)=>{
                  this.picArr.push(item)
                })
                this.bill_submit()
              }else{
                this.$message.warning('其他方式付款必须上传一张附件')
              }
            }
            this.loading_show = true
          } else {
            this.$message.error('请将表单填写完整');
            return false;
          }
        });
      },
      bill_submit(){
        if(this.wage_form.way_pay == '支付宝'){
          this.pay_type = '1'
        }else if(this.wage_form.way_pay == '其他'){
          this.pay_type = '3'
        }
        this.$confirm('确认付款么','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          this.loadingShow = true
          var upload_enclosure_new = (fn) =>{
            this.picArr.forEach((item)=>{
              let formData = new FormData
              formData.append('file',item.raw)
              formData.append('token',this.token)
              let config = {
                headers:{
                  'Content-Type': 'multipart/form-data'
                }
              }
              if(!item.size){
                this.pic_hash_arr.push(item.hash)
                this.pic_hash_arr.length === this.picArr.length && fn(item.name)
              }else{
                this.$http.post('https://up.qbox.me/', formData, config).then((res)=>{
                  this.pic_hash_arr.push(res.data.hash)
                  if(this.pic_hash_arr.length == this.picArr.length){
                    fn(item.name)
                  }
                })
              }
            })
          }
          upload_enclosure_new((name)=>{
            let nparam = new URLSearchParams()
            nparam.append('uid',this.user.uid)
            nparam.append('picture',JSON.stringify(this.pic_hash_arr))
            this.$http.post('/index.php/Mobile/approval/upload_enclosure_new',nparam)
              .then((res)=>{
                this.enclosure_id = res.data.data.enclosure_id
                setTimeout(()=>{
                  let param = new URLSearchParams()
                  param.append('alipay_id',this.wage_form.alipay)
                  param.append('money',this.wage_form.account)
                  param.append('pay_paid',this.wage_form.once_money)
                  param.append('pay_type',this.pay_type)
                  param.append('contract_id',this.contract_id)
                  param.append('handle_uid',this.handle_uid)
                  param.append('body',this.wage_form.body)
                  param.append('basis',this.enclosure_id)
                  this.$http.post('index.php/Mobile/user/bookkeeping_book',param)
                    .then((res)=>{
                      if(res.data.code == 0){
                        this.loadingShow = false
                        this.$message.success('付款成功')
                        this.resetForm()
                      }else{
                        this.$message.error(res.data.message)
                      }
                    })
                },500)
              })
          })
        }).catch(()=>{
          this.$message.info('已取消操作')
        })
      },
      resetForm(){
        this.$refs.wage_form.resetFields()
        this.fileList = []
        this.picArr = []
        this.enclosure_id =''
        this.upload_show = false
      },
      handlePreview(file, fileList){
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
      handleRemove(file, fileList){
        this.fileList = fileList
      },
      choose_contract(){
        let param = new URLSearchParams()
        param.append('identity',1)
        param.append('type',2)
        param.append('each',10)
        param.append('p',this.pageIndex)
        this.$http.post('index.php/Mobile/find/contract_list',param)
          .then((res)=>{
            if(res.data.code == 0){
              this.untreated = res.data.data
            }
            if(this.untreated.length < 10){
              this.nextPageShow = false
              this.wage_show = false
              this.list_show = true
            }
          })
      },
      _relog(){
        this.list_show = false
        this.wage_show = true
      },
      _relogs(){
        if(this.way == '查看合同'){
          this.bill_show = true
        }else{
          this.list_show = true
        }
        this.order_show = false
      },
      _relogsd(){
        this.bill_show = false
        this.wage_show = true
        this.handle_name = ''
      },
      first_page() {
        this.nextPageShow = true
        this.pageIndex = 1
        if(this.list_show == true){
          this.choose_contract()
        }else if(this.bill_show == true){
          this._get_bill()
        }
      },
      last_page() {
        this.nextPageShow = true
        --this.pageIndex
        if(this.list_show == true){
          this.choose_contract()
        }else if(this.bill_show == true){
          this._get_bill()
        }
      },
      next_page() {
        ++this.pageIndex
        if(this.list_show == true){
          this.choose_contract()
        }else if(this.bill_show == true){
          this._get_bill()
        }
      },
      viewInfo(item){
        this.list_show = false
        this.bill_show = false
        this.order_show = true
        this.core = `/index.php/Mobile/skey/look_draft?id=${item.contract_id}&operation=2&view=1`
        if(item.handle_name){
          this.way = '查看合同'
        }
      },
      useInfo(item){
        this.wage_form.contract = item.contract_name
        this.wage_form.name = item.worker_name
        this.contract_id = item.contract_id
        this.handle_uid = item.worker_id
        this.list_show = false
        this.wage_show = true
      },
      look_bill(es){
        if(es == '账单'){
          this.wage_show = false
          this.bill_show = true
          this._get_bill()
        }
        if(es == '更多记录'){
          if(!this.wage_form.contract){
            this.$message.warning('请选择合同')
          }else{
            this.wage_show = false
            this.bill_show = true
            this.handle_name = this.wage_form.name
            this._get_bill()
          }
        }
      },
      get_rate(){
        this.$http.post('index.php/Mobile/find/return_rate')
          .then((res)=>{
            this.rate = res.data.data
          })
      },
      _get_bill(){
        this.list_bill = []
        let param = new URLSearchParams()
        param.append('p',this.pageIndex)
        param.append('each',10)
        param.append('type',this.type)
        if(this.year > 1){
          param.append('year',this.year)
        }
        if(this.month > 1){
          param.append('month',this.month)
        }
        if(this.handle_name != ''){
          param.append('handle_name',this.handle_name)
        }
        this.$http.post('index.php/Mobile/user/bookkeeping_list',param)
          .then((res)=>{
            if(res.data.code == 0){
              res.data.data.forEach((item)=>{
                (item.pay_type == 1) ? item.pay_type='支付宝': item.pay_type='其他'
                this.list_bill.push(item)
              })
              if(this.list_bill.length < 10){
                this.nextPageShow = false
                this.wage_show = false
                this.bill_show = true
              }
            }
          })
      },
      screen(){
        this.sendShow = true
      },
      as_click(pr){
        switch (pr){
          case '年':
            this.secret = '年'
            break;
          case '月':
            this.secret = '月'
            break;
          case '出账':
            this.sendShow = false
            this.type = '1'
            this._get_bill()
            break;
          case '入账':
            this.sendShow = false
            this.type = '2'
            this._get_bill()
            break;
        }
      },
      close_as(){
        this.secret = ''
        this.month = ''
        this.year = ''
        this.type = '1'
        this.sendShow = false
      },
      choose_year(val){
        this.year = moment(val).get('year')
        var str = moment().get('year')
        if(this.year > str ){
          this.$message.error('所选时间超出当前时间，请重新选择')
        }else{
          this.sendShow = false
          this._get_bill()
        }
      },
      choose_month(val){
        this.month = moment(val).get('month') + 1
        this.year = moment(val).get('year')
        let mon = moment().get('month') + 1
        let str = moment().get('year')
        if(this.year > str || this.month > mon){
          this.$message.error('所选时间超出当前时间，请重新选择')
        }else{
          this.sendShow = false
          this._get_bill()
        }
      },
      show_pic(item){
        let param = new URLSearchParams()
        param.append('enclosure_id',item)
        this.$http.post('index.php/Mobile/approval/look_enclosure',param)
          .then((res)=>{
            res.data.data.picture.forEach((item) => {
              if(item != '') {
                item = `http://bbsf-test-file.hzxb.net/${item}?imageView2`
                this.arr_list.push(item)
              }
            })
            document.body.style.overflow = 'hidden'
            this.pic_show = true
          })
      }
    },
    created(){
      this.get_rate()
      this._getToken()
      this._get_bill()
    },

    components:{
      loading,
      moment,
      browsePic
    },
    computed: {
      ...mapGetters([
        'comPersonList',
        'user',
        'nowCompanyId',
        'comDepartList',
        'token'
      ])
    },
    watch:{
      pageIndex(){
        if(this.list_show == false){
          this.pageIndex = '1'
        }
        if(this.bill_show == false){
          this.pageIndex = '1'
        }
      }
    }
  }
</script>

<style lang="scss">
.wages{
  width: 100%;
  .top{
    background: #fff;
    position: relative;
    p{
      width: 500px;
      margin: 0 auto;
      text-align: center;
      font-weight: bolder;
      padding: 15px 0;
    }
    b{
      position: absolute;
      top: 13px;
      right: 13px;
      cursor: pointer;
    }
  }
  .main{
    width: 100%;
    background: #fff;
    margin-top: 4px;
    overflow: hidden;
    >.wage{
      width: 90%;
      margin: 20px auto 0;
    }
  }
  .btn{
    width: 90%;
    display: block;
    margin: 10px auto 20px;
  }
}
#picc{
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
.contract_list{
  width: 100%;
  .top{
    background: #fff;
    position: relative;
    .el-button{
      position: absolute;
      top: 8px;
      left: 5px;
      margin: 0 !important;
    }
    p{
      width: 500px;
      margin: 0 auto;
      text-align: center;
      font-weight: bolder;
      padding: 15px 0;
    }
    b{
      position: absolute;
      top: 13px;
      right: 13px;
      cursor: pointer;
    }
  }
  .list {
    width: 600px;
    background: #Fff;
    >ul {
      padding: 4px;
      >.page {
        width: 100%;
        padding: 4px;
        text-align: center;
        span {
          cursor: pointer;
          font-size: 12px;
          &:hover {
            color: #409EFF;
          }
        }
      }
      >button {
        margin-bottom: 10px;
      }
      >li {
        display: block;
        margin-bottom: 10px;
        height: 100px;
        color: #2D2F33;
        font-size: 13px;
        oz-box-shadow: 1px 1px 2px #999999;
        -webkit-box-shadow: 1px 1px 2px #999999;
        box-shadow: 1px 1px 2px #999999;
        >.avatar {
          display: inline-block;
          vertical-align: top;
          margin: 8px 15px 0 15px;
          img {
            width: 40px;
            height: 40px;
            border-radius: 4px;
            display: block;
          }
        }
        >.edit {
          display: inline-block;
          float: right;
          margin-right: 20px;
          margin-top: 15px;
          cursor: pointer;
          .el-button.is-round {
            padding: 4px 12px;
            display: block;
            margin-bottom: 5px;
          }
          .el-button+.el-button {
            margin-left: 0;
          }
          .process {
            margin-top: 10px;
          }
        }
        .content {
          cursor: default;
          padding: 12px 10px;
          display: inline-block;
          >div {
            height: 25px;
            line-height: 25px;
          }
        }
      }
    }
  }
}
.order_contract{
  width: 100%;
  background: #FFF;
  .top{
    background: #fff;
    position: relative;
    .el-button{
      position: absolute;
      top: 8px;
      left: 5px;
      margin: 0 !important;
    }
    p{
      width: 500px;
      margin: 0 auto;
      text-align: center;
      font-weight: bolder;
      padding: 15px 0;
    }
    b{
      position: absolute;
      top: 13px;
      right: 13px;
      cursor: pointer;
    }
  }
  .win{
    width: 100%;
    height: 600px;
  }
}
.bill_list{
  width: 100%;
  .top{
    background: #fff;
    position: relative;
    .el-button{
      position: absolute;
      top: 8px;
      left: 5px;
      margin: 0 !important;
    }
    p{
      width: 500px;
      margin: 0 auto;
      text-align: center;
      font-weight: bolder;
      padding: 15px 0;
    }
    b{
      position: absolute;
      top: 13px;
      right: 13px;
      cursor: pointer;
    }
  }
  .bill_main{
    width: 100%;
    .search{
      background: #FFF;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      .el-input{
        width: 90%;
      }
    }
    ul{
      width: 100%;
      margin: 0 auto;

      li{
        padding: 5px 0px;
        margin-bottom: 5px;
        overflow: hidden;
        background: #FFF;
        box-shadow: 0 0 2px rgba(0, 0, 0, .2);
        -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
        font-size: 14px;
        .add_time{
          text-align: right;
          margin-right: 20px;
        }
        ul{
          li{
            padding: 5px !important;
            border-bottom: 1px solid #e3e4e9;
            margin-bottom: 0px;
            box-shadow: none;
            p{
              width: 280px;
              float: left;
            }
            &:last-child{
              border-bottom: none;
            }
          }
        }
      }
    }
  }
  .page {
    width: 100%;
    padding: 4px;
    text-align: center;
    background: #FFF;
    span {
      cursor: pointer;
      font-size: 12px;
      &:hover {
        color: #409EFF;
      }
    }
  }
}
.as_what {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
  >div{
    width: 200px;
    background: #FFFFFF;
    margin: 200px auto;
    padding: 10px;
    border-radius: 4px;
    height: 122px;
    ul {
      h2 {
        display: inline-block;
        margin-bottom: 10px;
        font-size: 20px;
        font-size: 16px;
        color: #409EFF;
      }
      li {
        cursor: pointer;
        display: block;
        height: 24px;
        line-height: 24px;
        font-size: 15px;
        &:hover {
          color: #5A5E66;
        }
      }
    }
    i {
      font-size: 20px;
      float: right;
      cursor: pointer;
      &:hover {
        color: #FA5555
      }
    }
    .el-date-editor{
      width: 80%;
      cursor: pointer;
    }
  }
}

</style>

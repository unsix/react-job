<template>
  <div>
    <div>
      <el-button style="margin-left: 50px" type="primary" size="small" v-if="btnShow" @click="_return">返回</el-button>
    </div>
    <div class="box">
      <div class="title">
        <p>类型：{{title}}</p>
        <p>发起人：{{content.initiator_name}}</p>
      </div>
      <div class="main">
        <el-button class="addconstrution mar" type="info"  size="small" >基本信息</el-button>
        <p>工程项目名称:<span>{{detail.project_name}}</span></p>
        <p>施工位置:<span>{{detail.project_adress}}</span></p>
        <p>施工班组:<span>{{detail.project_construction_name}}</span></p>
        <p>确认人:<span>{{detail.confirm_name}}</span></p>
        <p>联系方式:<span>{{detail.phone}}</span></p>
        <p>开户行:<span>{{detail.bank_name}}</span></p>
        <p>开户账号:<span>{{detail.bank_account}}</span></p>
        <p>身份证号:<span>{{detail.id_card}}</span></p>
        <p>施工进场时间:<span>{{detail.project_start_time}}</span></p>
        <p>截止时间:<span>{{detail.project_end_time}}</span></p>
        <el-button class="addconstrution mar" type="info"  size="small" >累计工资</el-button>
        <li v-for = '(item,index) in detail.payroll_list_json'>
          <el-button class="addconstrution" type="primary"  size="small"  >{{index+1}}</el-button>
          <p>施工内容:<span>{{item.content}}</span></p>
          <p>单位:<span>{{item.unit}}</span></p>
          <p>数量:<span>{{item.amount}}</span></p>
          <p>单价:<span>{{item.unit_price}}</span></p>
          <p>合计金额:<span>{{item.sum_price}}</span></p>
          <p>备注:<span>{{item.remarks}}</span></p>
        </li>
        <p>工人产值工资合计:<span>{{detail.total_price}}</span></p>
        <el-button class="addconstrution mar" type="info"  size="small" >累计已领金额</el-button>
        <p>累计已领内容:<span>{{detail.price_describe}}</span></p>
        <p>截止到 {{detail.project_end_time}} 累计已领金额:<span>{{detail.payroll_receive_total_price}}</span></p>
        <p>截止到 {{detail.project_end_time}} 工人剩余工资:<span>{{detail.rest_payroll_price}}</span></p>
        <el-button class="addconstrution mar" type="info"  size="small" >确认人</el-button>
        <p>班组确认人:<span>{{detail.team_name}}</span></p>
        <p>第三方确认人:<span>{{detail.third_name}}</span></p>
      </div>
      <div class="enclosure">
        <!--<el-button class="addconstrution mar" type="info"  size="small" >确认人</el-button>-->
        <p>附件：质量验收单，完工图片，合同</p>
        <div v-if="detail.imgs">
          <span>图片附件：</span>
          <img :src="item" alt=""  v-for="(item,index) in detail.imgs"  @click="ctrl_pic_show(detail.imgs,index)"/>
        </div>
        <div v-if="detail.files">
          <span>附件列表：</span>
          <a v-for="(item,index) in detail.files" :href="item.address" class="file">{{item.name}}</a>
        </div>
      </div>

      <div class="operate">
        <ul>
          <li v-for="item in content.operate">
            <p><i v-if="item.opration_status == 1" class="el-icon-circle-check-outline"></i><i v-if="item.opration_status == 2" class="el-icon-circle-close-outline"></i>{{item.operate_name}} <span v-if="item.opration_status == 1">已通过</span><span v-if="item.opration_status == 0">未处理</span><span v-if="item.opration_status == 2">拒绝</span></p>
            <p v-if="item.reason">{{item.reason}}</p>
            <p>{{item.opration_time}}</p>
          </li>
        </ul>
      </div>
      <div class="choose_btn" v-if="handle">
        <el-button type='warning' size="small" @click="refuse(content.payroll_id)">拒绝</el-button>
        <el-button type="success" size="small" @click="agree(content.payroll_id)">确认</el-button>
      </div>
      <p class=" page_number_p"> 承诺: 本人{{detail.project_name}}为{{detail.project_construction_name}}雇佣工人，在此承诺情况属实，核准无误，由此所引起的一切经济纠纷及法律责任由本人承担，与贵司无关。</p>
    </div>
    <browsePic :pic_index="pic_index" ref="browe" :img_arr="arr_list"  v-show="pic_show"></browsePic>
    <loading v-show="loadingShow"></loading>
  </div>
</template>

<script>
  import loading from '@/base/loading/loading'
  import { getAvatar } from '@/common/js/avatar.js'
  import browsePic from '@/base/browse_pic/browse_pic'
  export default {
    data(){
      return{
        detail:{},
        title:'',
        pic_index: 0,
        pic_show: false,
        arr_list: [],
        loadingShow:false,
      }
    },
    methods:{
      change_data(){
        if(this.content.type == '3'){
          this.title = '个人劳务承包请款单'
        }else if(this.content.type == '4'){
          this.title = '班组工人工资进度请款单'
        }
        if(this.content.detail){
          this.detail = this.content.detail
          if(this.detail.many_enclosure){
            this.get_files(this.detail.many_enclosure,this.detail)
            this.get_imgs(this.detail.many_enclosure,this.detail)
          }
        }
      },
      _return(){
        this.$emit('return_per')
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
      ctrl_pic_show(item,index){
        item.forEach((res)=>{
          let current = res.indexOf('?')
          this.arr_list.push(res.slice(0,current) + '?imageslim' )
        })
        this.pic_index = index
        this.pic_show = true
      },
      refuse(data){
        this.$prompt('请输入拒绝原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/.+/,
          inputErrorMessage:'拒绝原因不能为空'
        }).then(({ value })=>{
          this.loadingShow = true
          let param = new URLSearchParams()
          param.append('payroll_id',data)
          param.append('reason',value)
          param.append('operation',2)
          let str = this.$test('/index.php/Mobile/payroll/confirm_payroll')
          this.$http.post(str,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              this.loadingShow = false
              if(res.data.code == 0){
                this.$message.success('处理成功')
              }else{
                this.$message.error(res.data.data)
              }
              this.$parent.get_data()
              this.$parent._return()
            })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        })
      },
      agree(data){
        this.$confirm('确定同意此工资条么', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(()=>{
          this.loadingShow = true
          let param = new URLSearchParams()
          param.append('payroll_id',data)
          param.append('operation',1)
          let str = this.$test('/index.php/Mobile/payroll/confirm_payroll')
          this.$http.post(str,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              this.loadingShow = false
              if(res.data.code == 0){
                this.$message.success('处理成功')
              }else{
                this.$message.error(res.data.data)
              }
              this.$parent.get_data()
              this.$parent._return()
            })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        })
      }
    },
    created(){
      this.change_data()
    },
    props:{
      content:{},
      handle:{},
      btnShow:{}
    },
    components:{
      browsePic,
      loading
    }
  }
</script>

<style lang="scss">
  .box{
    li{
      list-style: none;
    }
    width: 100%;
    background: #FFF;
    padding-top: 10px;
    overflow: hidden;
    color: #2d2f33;
    min-height: 700px;
    .title{
      line-height: 23px;
      font-size: 15px;
      margin-left: 15px;
    }
    .main{
      margin-left: 20px;
      line-height: 20px;
      font-size: 14px;
      p{
        span{
          color: blue;
          margin-left: 5px;
          line-height: 1.8;
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
        width: 80px;
        float: left;
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
      margin: 10px 0 7px 0;
    }
    .page_number_p{
      margin: 0 10px 20px 10px;
      font-size: 14px;
      line-height: 1.3;
    }

  }
</style>

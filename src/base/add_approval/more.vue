<template>
    <div class="boxed">
      <div class="main">
        <el-button type="info" size="small" round @click="choose_ysd">验收单</el-button>
        <el-button type="primary" size="small" round @click="choose_jsd">结算单</el-button>
        <el-button type="warning" size="small" round @click="choose_gzd">工资单</el-button>
      </div>
      <div class="list">
        <div v-show="ys_list.length >= 1">
          <p>审批附件</p>
          <b @click="deletes('验收')">x</b>
          <ul style="font-size: 14px;margin-top: 5px;margin-left: 10px">
            <li v-for="(item,index) in ys_list" style="overflow: hidden">
              <p>{{item.add_time}}</p>
              <p>类型：{{item.type}}</p>
              <p>标题：{{item.title}}</p>
              <p>审批进程：<span v-html="item.approval_state"></span></p>
              <el-button type="primary" size="small" @click="remove('验收',index)">删除</el-button>
            </li>
          </ul>
        </div>
        <div v-show="gz_list.length >= 1">
          <p>工资条附件</p>
          <b @click="deletes('工资')">x</b>
          <ul style="font-size: 14px;margin-top: 5px;margin-left: 10px">
            <li v-for="(item,index) in gz_list" style="overflow: hidden">
              <p>{{item.add_time}}</p>
              <p>{{item.name}}{{item.phone}}</p>
              <p>请款月份：{{item.month}}</p>
              <p>应付金额:{{item.pay_amount}}元</p>
              <p><span v-html="item.pryroll_status"></span></p>
              <el-button type="primary" size="small" @click="remove('工资',index)">删除</el-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    data(){
      return{
        ys_list:[],
        js_list:[],
        gz_list:[],
        ys_id:{},
        js_id:{},
        gz_id:{},
        file:[],
      }
    },
    methods:{
      choose_ysd(){
        this.$parent.$parent.$parent.wrapper = false
        this.$parent.$parent.$parent.tips = '验收'
      },
      showlist(){
        this.ys_list = []
        this.gz_list = []
        if(this.$parent.$parent.$parent.ys_list.length >=1){
          this.ys_list.push(...this.$parent.$parent.$parent.ys_list)
        }
        if(this.$parent.$parent.$parent.js_list.length >=1){
          this.ys_list.push(...this.$parent.$parent.$parent.js_list)
        }
        this.ys_list.forEach((item)=>{
          switch (item.type) {
            case '12':
              item.type ='验收单'
              break;
            case '14':
              item.type ='结算单'
              break;
          }
        })
        if(this.$parent.$parent.$parent.gz_list.length >=1){
          this.gz_list = this.$parent.$parent.$parent.gz_list
        }
      },
      remove(pr,pre){
        switch (pr) {
          case '验收':
            if(this.ys_list.length == 1){
              this.$message('至少选择一个审批')
            }else{
              this.ys_list.splice(pre,1)
            }
            break;
          case '工资':
            if(this.gz_list.length == 1){
              this.$message('至少选择一个工资条')
            }else{
              this.gz_list.splice(pre,1)
            }
            break;
        }
      },
      deletes(pr){
        switch (pr) {
          case '验收':
          case '结算':
            this.ys_list = []
            this.$parent.$parent.$parent.ys_list = []
            this.$parent.$parent.$parent.js_list = []
            break;
          case '工资':
            this.gz_list = []
            this.$parent.$parent.$parent.gz_list = []
            break;
        }
      },
      choose_jsd(){
        this.$parent.$parent.$parent.wrapper = false
        this.$parent.$parent.$parent.tips = '结算'
      },
      choose_gzd(){
        this.$parent.$parent.$parent.wrapper = false
        this.$parent.$parent.$parent.tips = '工资'
      },
      submit(){
        if(this.ys_list.length != 0){
          let arr = []
          this.ys_list.forEach((item)=>{
            arr.push(item.approval_id)
          })
          let param = new URLSearchParams()
          param.append('items',JSON.stringify(arr))
          let str = this.$test('/index.php/Mobile/approval/add_enclosure_approval')
          this.$http.post(str,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              if(res.data.code == 0){
                this.ys_id.contract_id = res.data.data.id
                this.ys_id.name = `共${arr.length}个审批`
                this.ys_id.type = 5
                this.file.push(this.ys_id)
              }
            })
        }
        if(this.gz_list.length != 0){
          let arr = []
          this.gz_list.forEach((item)=>{
            arr.push(item.payroll_id)
          })
          let param = new URLSearchParams()
          param.append('items',JSON.stringify(arr))
          let rsc = this.$test('/index.php/Mobile/approval/add_enclosure_payroll')
          this.$http.post(rsc,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              if(res.data.code == 0){
                this.gz_id.contract_id = res.data.data.id
                this.gz_id.name = `共${arr.length}个工资条`
                this.gz_id.type = 6
                this.file.push(this.gz_id)
              }
            })
        }
      }
    },
    created(){
      this.showlist()
    },
    props: {

    },
  }
</script>

<style lang="scss" scoped>
  .boxed{
    overflow: hidden;
    margin-top: 10px;
    .list{
      >div{
        margin-top: 10px;
        p{
          width: 80%;
          float: left;
        }
        b{
          cursor: pointer;
        }
      }
    }
  }
</style>

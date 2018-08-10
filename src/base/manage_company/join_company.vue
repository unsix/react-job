<template>
  <div>
    <div class="join">
      <div class="top" v-show="mass">
        <el-button type="success" @click="show_search" size="small">申请加入</el-button>
        <p>处理申请</p>
      </div>
      <div class="searchs" v-show="mess">
        <el-select filterable remote v-model="name" :remote-method="remoteMethod" :loading="loading" @blur="shoe" placeholder="搜索">
          <el-option class="teams"  v-for="(item,index) in listed" :key="index" :value="item.company_name">
           <div @click="look_detail(item)">
             <p>{{item.company_name}}</p>
             <p>{{item.company_tel}}</p>
             <p>{{item.company_address}}</p>
           </div>
          </el-option>
        </el-select>
      </div>
      <div class="mains">
        <ul>
          <li v-for="item in personList">
            <img :src="item.avatar" alt="">
            <div class="info">
              <p>姓名：{{item.request_user_name}}</p>
              <p>电话：{{item.phone}}</p>
              <p>备注：{{item.request_content}}</p>
              <p>申请时间：{{item.add_time}}</p>
            </div>
            <el-dropdown v-show="item.state == 0" class="ment" split-button type="primary" @click="handleClick(item)" @command="handleCommand($event,item)" trigger="click">
              同意
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="同意">同意</el-dropdown-item>
                <el-dropdown-item command="拒绝">拒绝</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <p v-show="item.state == 1" style="margin-left: 130px">已同意</p>
            <p v-show="item.state == 2" style="margin-left: 130px">已拒绝</p>
          </li>
        </ul>
        <div class="page">
          <span @click="first_page">首页</span>
          <span @click="last_page" v-show="pageIndex > 1">上一页</span>
          <span @click="next_page" v-show="nextPageShow">下一页</span>
        </div>
      </div>
    </div>
    <div class="as_show" v-show="add_show">
      <div class="mens">
        <h2>用户加入公司申请</h2>
        <i class="el-icon-close" @click="close_as"></i>
        <p>
          <span>用户部门</span>
          <el-dropdown trigger="click" @command="choose_departent">
            <span class="el-dropdown-link" ref="secs">{{cur_departent.name}}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,index) in departmentList" :key="index" :command="item">{{item.department_name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </p>
        <p>
          <span>选择职位</span>
          <el-dropdown trigger="click" @command="choose_position">
            <span class="el-dropdown-link">{{cur_position.job_name}}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,index) in position_list" :key="index" :command="item">{{item.job_name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </p>
        <el-button type="primary" size="small" style="margin-left: 130px" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {getAvatar} from '@/common/js/avatar.js'
  import {create_depart_list} from 'common/js/initial/depart.js'
  export default {
    data(){
      return{
        pageIndex:1,
        personList:[],
        nextPageShow:true,
        add_show:false,
        cur_departent:{},
        departmentList:[],
        position_list:[{job_id:'',job_name:'[不指定]'}],
        cur_position:{},
        deal_with:'',
        request_id:'',
        company_id:'',
        mass:true,
        name:'',
        mess:false,
        loading:false,
        listed:[]
      }
    },
    methods:{
      ...mapMutations({
        setUser: 'SET_USER',
        setNowCompanyId: 'SET_NOWCOMPANY_ID',
        setComPersonList: 'SET_COM_PERSON_LIST',
        setComDepartList: 'SET_COM_DEPART_LIST',
        setComPartPersonList: 'SET_COM_PART_PERSON_LIST',
        setNowCompanyName: 'SET_NOWCOMPANY_NAME',
        setToken: 'SET_TOKEN',
        setUserState: 'SET_USERSTATE',
        setCompanyList: 'SET_COMPANYLIST',
      }),
      get_data(){
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        param.append('p',this.pageIndex)
        param.append('each',10)
        let httpUrl = this.$test('/index.php/Mobile/find/request_join_list')
        this.$http.post(httpUrl,param)
          .then((res)=>{
            if(res.data.code == 0){
              res.data.data.forEach((item)=>{
                item.avatar = getAvatar(item.avatar)
                this.personList.push(item)
              })
              if(this.personList.length <10){
                this.nextPageShow = false
              }
            }
          })
      },
      handleClick(pr){
        this.add_show = true
        this.set_ment()
        this.deal_with = pr.deal_with_id
        this.request_id = pr.request_id
        this.company_id = pr.company_id
      },
      handleCommand(pr,re){
        this.deal_with = re.deal_with_id
        this.request_id = re.request_id
        this.company_id = re.company_id
        if(pr == '同意'){
          this.add_show = true
          this.set_ment()
        }else if(pr == '拒绝'){
          this.$confirm('您确认要拒绝该申请么','提示',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
            let param = new URLSearchParams()
            param.append('request_id',re.request_id)
            param.append('deal_with_id',re.deal_with_id)
            param.append('is_agree',2)
            param.append('company_id',re.company_id)
            let httpUrl = this.$test('/index.php/Mobile/find/deal_with_request_join')
            this.$http.post(httpUrl,param)
              .then((res)=>{
                if(res.data.code == 0){
                  this.$message.success('拒绝成功')
                  this.get_data()
                }else{
                  this.$message.error('拒绝失败')
                }
              })
          }).catch(()=>{
            this.$message.info('已取消操作')
          })
        }
      },
      close_as(){
        this.add_show = false
        this.cur_departent = {}
        this.cur_position = {}
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
      choose_departent(pr){
        this.cur_departent.name = pr.department_name
        this.cur_departent.id = pr.department_id
        this.position_list = [{job_id:'',job_name:'[不指定]'}]
        this.cur_position = {job_id:'',job_name:'[不指定]'}
        if(pr.job){
          pr.job.forEach((item)=>{
            this.position_list.push(item)
          })
        }else{
          this.position_list = this.position_list
        }
      },
      set_ment(){
        this.departmentList = []
        this.position_list = [{job_id:'',job_name:'[不指定]'}]
        this.cur_position = {job_id:'',job_name:'[不指定]'}
        this.cur_departent = {}
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        let httpUrl = this.$test('/index.php/Mobile/user/get_department_lest')
        this.$http.post(httpUrl,param)
          .then((res)=>{
            if(res.data.code == 0){
              this.departmentList = res.data.data
              this.cur_departent.name = this.departmentList[0].department_name
              this.cur_departent.id = this.departmentList[0].department_id
              if(this.departmentList[0].job){
                this.departmentList[0].job.forEach((item)=>{
                  this.position_list.push(item)
                })
              }
            }
          })
      },
      choose_position(pr){
        this.cur_position.job_name = pr.job_name
        this.cur_position.job_id = pr.job_id
      },
      submit(){
        let param = new URLSearchParams()
        param.append('company_id',this.company_id)
        param.append('deal_with_id',this.deal_with)
        param.append('department_id',this.cur_departent.id)
        if(this.cur_position.job_id){
          param.append('job_id',this.cur_position.job_id)
        }
        param.append('is_agree',1)
        param.append('request_id',this.request_id)
        let httpUrl = this.$test('/index.php/Mobile/find/deal_with_request_join')
        this.$http.post(httpUrl,param)
          .then((res)=>{
            if(res.data.code == 0){
              this.$message.success('处理成功')
              this.close_as()
              this.get_data()
            }else{
              this.$message.error(res.data.message)
            }
          })
      },
      remoteMethod(res){
        this.listed = []
        if(res != ''){
          this.loading = true
          setTimeout(()=>{
            this.loading = false
            let param = new URLSearchParams()
            param.append('company_name',res)
            param.append('p',1)
            param.append('each',20)
            let httpUrl = this.$test('/index.php/Mobile/find/select_company_list')
            this.$http.post(httpUrl,param)
              .then((res)=>{
                if(res.data.code == 0){
                  this.listed = res.data.data
                }
              })
          })
        }
      },
      shoe(){
        this.mass = true
        this.mess = false
      },
      show_search(){
        this.mass = false
        this.mess = true
      },
      look_detail(res){
        this.$prompt('备注','申请加入公司',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value})=>{
          let param = new URLSearchParams()
          param.append('company_id',res.company_id)
          param.append('content',value)
          let httpUrl = this.$test('/index.php/Mobile/find/request_join_company')
          this.$http.post(httpUrl,param)
            .then((res)=>{
              this.shoe()
              if(res.data.code == 0){
                this.$message.success('加入成功')
              }else{
                this.$message.error(res.data.message)
              }
            })
        }).catch(()=>{
          this.shoe()
          this.$message.info('已取消操作')
        })
      }
    },
    created(){
      this.get_data()
      this.set_ment()
    },
    computed:{
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
        this.get_data
      }
    },
    mounted(){
      if(this.$route.path === '/work/join') {
        this.$emit('changeWorkIndex', '4-2')
      }
    }
  }
</script>

<style lang="scss">
  .join{
    width: 100%;
    .top{
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #FFF;
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
        cursor: pointer;
        top: 13px;
        right: 13px;
      }
    }
    .mains{
      width: 100%;
      margin-top: 5px;
      font-size: 14px;
      li{
        padding: 0 20px;
        display: flex;
        background: #fff;
        display: -webkit-flex;
        align-items: center;
        margin-bottom: 5px;
        overflow: hidden;
        box-shadow: 0 0 2px rgba(0, 0, 0, .2);
        -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
        justify-content: left;
        img{
          width: 50px;
          border-radius: 5px;
        }
        .info{
          width: 210px;
          margin: 10px 30px;
          p{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .ment{
          margin-left: 100px;
        }
      }
      .page {
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
    }
  }
  .as_show{
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
    .mens{
      width: 200px;
      background: #FFFFFF;
      margin: 200px auto;
      padding: 10px;
      border-radius: 4px;
      h2 {
        display: inline-block;
        margin-bottom: 10px;
        font-size: 16px;
        color: #409EFF;
      }
      .el-icon-close{
        font-size: 20px;
        float: right;
        cursor: pointer;
        &:hover {
          color: #FA5555
        }
      }
      p{
        margin: 10px 0 ;
      }
      span{
        font-size: 14px;
      }
      .el-dropdown{
        float: right;
        margin-right: 24px;
      }
    }
  }
  .searchs{
    width: 100%;
    background: #Fff;
    padding: 10px 0;
    .el-select{
      width: 80%;
      display: block;
      margin: 10px auto;

    }
  }
  .teams{
    font-size: 14px;
    height: auto;
    line-height: 21px;
    p{
      font-size: 13px;
    }
  }
</style>

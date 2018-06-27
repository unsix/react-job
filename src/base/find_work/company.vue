<template>
  <div>
    <div class="company" v-show="company_show">
      <div class="top">
        <p>公司列表</p>
      </div>
      <div class="main">
        <ul>
          <li @click="look_detail(item.main_company_id)" v-for="(item,index) in untreated">
            <p>{{item.company_big_name}}</p>
          </li>
        </ul>
        <div class="page">
          <span @click="first_page">首页</span>
          <span @click="last_page" v-show="pageIndex > 1">上一页</span>
          <span @click="next_page" v-show="nextPageShow">下一页</span>
        </div>
      </div>

    </div>

    <div class="detail" v-show="detail_show">
      <div class="top">
        <el-button type="primary" size="small" @click="_return">返回</el-button>
        <p class="title">{{details.company_name}}</p>
      </div>
      <div class="des">
        <p>联系方式:{{details.company_tel}}</p>
        <p>地址:{{details.company_address}}</p>
        <p>简介:{{details.introduction}}</p>
      </div>
      <div class="foot">
        <el-button type="info" class="btns" @click="join" size="small">申请加入公司</el-button>
        <el-button type="info" class="btns" @click="look_info()" size="small">招聘信息</el-button>
      </div>
    </div>

    <div class="ing" v-show="info_show">
      <div class="top" v-show="mean">
        <el-button type="primary" size="small" @click="_returns">返回</el-button>
        <p>{{details.company_name}}</p>
        <b @click="show_sea">搜索</b>
      </div>
      <div class="miss" v-show="miss">
        <el-select filterable remote v-model="name" :remote-method="remoteMethod" :loading="loading" @blur="shoe" placeholder="搜索">
          <el-option class="inset" v-for="(item,index) in listed" :key="index" :value="item.name">
            <div @click="search(item.iid)">
              <img :src="item.avatar" style="width: 50px;height: 50px">
              <div class="ens">
                <div class="mar">
                  <span style="width: 100px;text-align: left">{{item.name}}</span>
                  <span>预算<b style="font-weight: normal;color: #FFA574;">{{item.budget}}</b></span>
                </div>
                <div class="tip">
                  <span v-for="res in item.worker" style="border: 1px solid black;border-radius: 4px">{{res.type}}</span>
                </div>
              </div>
              <div class="disd">
                <span>{{item.add_time}}</span>
              </div>
            </div>
          </el-option>
        </el-select>
      </div>
      <div class="search">
        <el-select filterable v-model="type" @change="type_change" placeholder="工种">
          <el-option v-for="item in work_type" :label="item.type_name" :value="item.wid" :key="item.wid"></el-option>
        </el-select>
        <el-select filterable v-model="order" @change="order_change" placeholder="排序">
          <el-option v-for="item in dec" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </div>
      <div class="listed">
        <ul>
          <li v-for="(item,index) in nearList" @click="detailed(item.iid)">
            <img :src="item.avatar" style="width: 50px;height: 50px">
            <div class="ens">
              <div class="mar">
                <span style="width: 100px;text-align: left">{{item.name}}</span>
                <span>预算<b style="font-weight: normal;color: #FFA574;">{{item.budget}}</b></span>
              </div>
              <div class="tip">
                <span v-for="res in item.worker" style="border: 1px solid black;border-radius: 4px">{{res.type}}</span>
              </div>
            </div>
            <div class="disd">
              <span>{{item.add_time}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="page">
        <span @click="first_pages">首页</span>
        <span @click="last_pages" v-show="pageIndexs > 1">上一页</span>
        <span @click="next_pages" v-show="nextPageShows">下一页</span>
      </div>
    </div>

    <workDe v-show="details_show" ref="sou"></workDe>
  </div>
</template>

<script>
  import {getAvatar} from '@/common/js/avatar.js'
  import {getCro} from "@/common/js/crowd";
  import workDe from '@/base/find_work/workDeta'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data(){
      return{
        pageIndex:1,
        details_show:false,
        nextPageShow:true,
        nextPageShows:true,
        untreated:[],
        company_show:true,
        detail_show:false,
        details:{},
        info_show:false,
        type:'',
        order:'',
        pageIndexs:1,
        mean:true,
        miss:false,
        listed:[],
        loading:false,
        name:'',
        nearList:[],
        se:['距离','金额','发布时间'],
        dec:[],
        work_type:[],
        orders:'',
        company_id:''
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
      _get_company(){
        let param = new URLSearchParams()
        param.append('p',this.pageIndex)
        param.append('each',10)
        this.$http.post('index.php/Mobile/find/all_big_company_list',param)
          .then((res)=>{
            if(res.data.code == 0){
              this.untreated = res.data.data
              if(this.untreated.length < 10){
                this.nextPageShow = false
              }
            }
          })
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
      first_pages() {
        this.pageIndexs = 1
      },
      last_pages() {
        this.nextPageShows = true
        --this.pageIndexs
      },
      next_pages() {
        ++this.pageIndexs
      },
      look_detail(pr){
        let param = new URLSearchParams()
        param.append('company_id',pr)
        this.$http.post('index.php/Mobile/company/get_company_info',param)
          .then((res)=>{
            if(res.data.code == 0){
              this.details = res.data.data
              this.company_show = false
              this.detail_show = true
            }
          })
      },
      _return(){
        this.detail_show = false
        this.company_show =true
      },
      _returns(){
        this.info_show = false
        this.detail_show = true
      },
      join(){
        this.$prompt('申请加入公司', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder:'请输入备注'
        }).then(({value})=>{
          let param = new URLSearchParams()
          param.append('company_id',this.details.company_id)
          param.append('content',value)
          this.$http.post('index.php/Mobile/find/request_join_company',param)
            .then((res)=>{
              if(res.data.code == 0){
                this.$message.success('提交加入公司申请成功，请等候管理员处理')
              }else{
                this.$message.error(res.data.message)
              }
            })
        }).catch(()=>{
          this.$message.info('取消操作')
        })
      },
      look_info(){
        this.detail_show = false
        this.info_show = true
        this._get_Data(this.details.company_big_id)
      },
      _get_Data(pr){
        this.nearList = []
        this.company_id = pr
        let param = new URLSearchParams()
        param.append('company_id',this.company_id)
        param.append('wid',this.type)
        param.append('order',this.orders)
        param.append('p',this.pageIndexs)
        param.append('each',10)
        this.$http.post('index.php/Mobile/Find/find_work',param)
          .then((res)=>{
            if(res.data.code == 0){
              res.data.data.forEach((item)=>{
                item.avatar = getAvatar(item.avatar)
                console.log(item)
                this.nearList.push(item)
              })
              if(this.nearList.length<10){
                this.nextPageShows =false
              }
              this.dec = this.se.map(item=>{
                return { value: item, label: item };
              })
            }
          })
      },
      show_sea(){
        this.mean = false
        this.miss = true
      },
      remoteMethod(res){
        this.listed.splice(0,this.listed.length)
        if(res != ''){
          this.loading = true
          setTimeout(()=>{
            this.loading = false
            let param = new URLSearchParams()
            param.append('keyword',res)
            this.$http.post('index.php/Mobile/Task/get_work_list',param)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                getCro(judge,current)
                res.data.data.forEach((item)=>{
                  item.avatar = getAvatar(item.avatar)
                  item.distance = (item.distance / 1000).toFixed(2)
                  this.listed.push(item)
                })
              })
          })
        }
      },
      shoe(){
        this.mean = true
        this.miss = false
      },
      type_change(res){
        this.type = res
        this._get_Data()
      },
      order_change(res){
        if(res == '金额'){
          this.orders = 'm'
          this._get_Data()
        }
        if(res == '发布时间'){
          this.orders = 't'
          this._get_Data()
        }
        if(res == '距离'){
          this.orders = 'd'
          this._get_Data()
        }
      },
      _getType(){
        this.$http.post('/index.php/Mobile/Find/worker_type')
          .then((res)=>{
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            if(res.data.code == 0){
              res.data.data.forEach((item)=>{
                this.work_type.push(item)
              })
              var ss = {type_name:'全部',wid:'1'}
              this.work_type.unshift(ss)
            }
          })
      },
      detailed(pr){
        this.info_show = false
        this.details_show = true
        this.$refs.sou._getInfo(pr,this.user.uid,)
      },
      search(pr){
        this.info_show = false
        this.details_show = true
        this.$refs.sou._getInfo(pr,this.user.uid,)
      }
    },
    created(){
      this._get_company()
      this._getType()
    },
    mounted(){
      if(this.$route.path === '/work/company') {
        this.$emit('changeWorkIndex', '2-4')
      }
    },
    watch:{
      pageIndex(){
        this._get_company()
      },
      pageIndexs(){
        this._get_Data()
      }
    },
    components:{
      workDe
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
  }
</script>

<style lang="scss">
  .company{
    width: 100%;
    .top{
      position: relative;
      background: #Fff;
      p{
        text-align: center;
        font-size: 18px;
        font-weight: bolder;
        padding: 20px 0;
      }
      .el-button--success{
        position: absolute;
        top: 13px;
        right: 15px;
      }
    }
    .main{
      ul{
        background: white;
        margin-top: 5px;
        height: 370px;
        li{
          border-bottom: 1px solid #e3e4e9;
          padding: 10px 20px;
          cursor: pointer;
          &:hover {
            background: #e3e4e9;
          }
        }
      }
      .page {
        padding: 4px;
        margin-top: 10px;
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
  .detail{
    width: 100%;
    background: #FFF;
    .top{
      position: relative;
      border-bottom: 1px solid #e3e4e9;
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
      }
    }
    .des{
      width: 80%;
      margin: 0 auto;
      padding: 30px;
      p{
        padding: 5px;
      }
    }
    .foot{
      display: flex;
      display: -webkit-flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 20px;
      .btns{
        width: 150px;
        margin: 0 70px;
      }
    }

  }
  .ing{
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
        top: 13px;
        right: 13px;
      }
    }
    .search{
      display: flex;
      background: #Fff;
      padding-bottom: 10px;
      .el-select{
        flex-grow: 1;
      }
    }
    .miss{
      width: 100%;
      background: #Fff;
      padding: 10px 0;
      .el-select{
        width: 80%;
        display: block;
        margin: 10px auto;
      }

    }
    .listed{
      li{
        padding: 10px 0;
        background: #ffffff;
        margin-bottom: 5px;
        overflow: hidden;
        box-shadow: 0 0 2px rgba(0, 0, 0, .2);
        -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
        img{
          margin-left: 10px;
          float: left;
        }
        .ens{
          width: 380px;
          float: left;
          margin-left: 30px;
          .mar{
            span{
              display: inline-block;
              text-align: center;
            }
          }
          .tip{
            margin-top: 5px !important;
            span{
              margin-right: 5px;
              display: inline-block;
              margin-top: 3px;
            }
          }
        }
        .disd{
          width: 120px;
          float: left;
          height: 50px;
          span{
            display: inline-block;
          }
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
    .page {
      padding: 4px;
      margin-top: 10px;
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
  .inset{
    height: auto;
    margin-top: 5px;
    img{
      margin-top: 5px;
      float: left;
    }
    .ens{
      width: 260px;
      float: left;
      margin-left: 30px;
      .mar{
        height: 20px;
        span{
          display: inline-block;
          text-align: center;
          line-height: 20px!important;
        }
      }
      .tip{
        margin-top: -2px;
        span{
          display: inline-block;
          margin-right: 5px;
          margin-top: 5px;
        }
      }
    }
    .disd{
      width: 120px;
      float: left;
      height: 50px;
      span{
        display: inline-block;
        float: left;
        line-height: 20px!important;
      }
    }
  }
  .el-select-dropdown__item{
    white-space: normal;
  }
</style>

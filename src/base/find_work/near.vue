<template>
  <div>
    <div class="main" v-show="mains">
      <div class="top" v-show="mean">
        <p>工程列表</p>
        <el-button type="success" size="small" @click="show_sea">搜索</el-button>
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
                <span style="color: #FFA574;margin-top: 10px ">{{item.distance}}<b style="color: #000;font-weight: normal">KM</b></span>
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

      <div class="list">
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
              <span style="color: #FFA574;margin-top: 10px ">{{item.distance}}</span>KM
            </div>
          </li>
        </ul>
        <div class="page">
          <span @click="first_page">首页</span>
          <span @click="last_page" v-show="pageIndex > 1">上一页</span>
          <span @click="next_page" v-show="nextPageShow">下一页</span>
        </div>
      </div>
    </div>

    <workDe v-show="detail_show" ref="sou"></workDe>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {getCro} from "@/common/js/crowd";
  import {getAvatar} from '@/common/js/avatar.js'
  import workDe from '@/base/find_work/workDeta'

export default {
  data(){
    return{
      mains:true,
      work_type:[],
      mean:true,
      se:['距离','金额','发布时间'],
      orders:'d',
      typed:'',
      nearList:[],
      dec:[],
      order:'',
      type:'',
      pageIndex:1,
      nextPageShow: true,
      loading:false,
      miss:false,
      listed:[],
      name:'',
      detail_show:false
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
    _getList(){
      this.nearList.splice(0,this.nearList.length)
      let param = new URLSearchParams()
      // param.append('uid',this.user.uid)
      param.append('p',this.pageIndex)
      param.append('each','10')
      if(this.typed != '1'){
        param.append('wid',this.typed)
      }
      param.append('order',this.orders)
      this.$http.post('/index.php/Mobile/Find/find_work_personal',param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          getCro(judge,current)
          var arr = res.data.data
          for(var sr in arr){
            arr[sr].avatar = getAvatar(arr[sr].avatar)
            var sd = arr[sr].type
            let str = ''
            for(var ss in sd){
              str += sd[ss]
            }
            arr[sr].type = str
            arr[sr].distance = (arr[sr].distance/1000).toFixed(2)
            this.nearList.push(arr[sr])
          }
          if(this.nearList.length<10){
            this.nextPageShow =false
          }
          this.dec = this.se.map(item=>{
            return { value: item, label: item };
          })
        })
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
    type_change(res){
      this.typed = res
      this._getList()
    },
    order_change(res){
      if(res == '金额'){
        this.orders = 'm'
        this._getList()
      }
      if(res == '发布时间'){
        this.orders = 't'
        this._getList()
      }
      if(res == '距离'){
        this.orders = 'd'
        this._getList()
      }
    },
    show_sea(){
      this.mean = false
      this.miss = true
    },
    detailed(pr){
      this.mains = false
      this.detail_show = true
      this.$refs.sou._getInfo(pr,this.user.uid,)
    },
    first_page() {
      this.nextPageShow = true
      this.pageIndex = 1
    },
    last_page() {
      this.nextPageShow = true
      --this.pageIndex
    },
    next_page() {
      ++this.pageIndex
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
    search(pr){
      this.mains = false
      this.detail_show = true
      this.$refs.sou._getInfo(pr,this.user.uid,)
    }
  },
  mounted(){
    this._getType()
    this._getList()
    if(this.$route.path === '/work/list') {
      this.$emit('changeWorkIndex', 10)
    }
  },
  watch:{
    pageIndex() {
      this._getList()
    },
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
  components:{
    workDe
  }
}
</script>

<style lang="scss">
.main{
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
  .search{
    display: flex;
    background: #Fff;
    padding-bottom: 10px;
    .el-select{
      flex-grow: 1;
    }
  }
}
.list{
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
      height: 50px;
      float: left;
      margin-left: 30px;
      .mar{
        span{
          display: inline-block;
          text-align: center;
        }
      }
      .tip{
        margin-top: 15px;
        span{
          margin-right: 5px;
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
.inset{
  height: 60px;
  margin-top: 5px;
  img{
    margin-top: 5px;
    float: left;
  }
  .ens{
    width: 260px;
    height: 50px;
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
      height: 20px;
      margin-top: 5px;
      span{
        margin-right: 5px;
        line-height: 20px!important;
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
</style>

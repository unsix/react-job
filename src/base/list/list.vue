<template>
  <div>
    <div class="main" v-show="mains">
      <div class="top" v-show="mean">
        <p>工人列表</p>
        <el-button type="success" size="small" @click="show_sea">搜索</el-button>
      </div>
      <div class="tops" v-show="mess">
        <el-select filterable remote v-model="name" :remote-method="remoteMethod" :loading="loading" @blur="shoe"  placeholder="请输入工人姓名或手机号码">
          <el-option class="inset" v-for="(item,index) in listed" :key="index" :value="item.name" >
            <div @click="search(item.uid)">
              <img :src="item.avatar">
              <div class="main">
                <p>{{item.name}}</p>
                <span>{{item.type}}</span>
              </div>
              <div class="phone">
                <span><i class="iconfont icon-xiaoxi"></i>{{item.phone}}</span>
              </div>
              <div class="distance">
                <p>{{item.distance}}KM</p>
              </div>
            </div>
          </el-option>
        </el-select>
      </div>
      <div class="search">
        <el-select filterable v-model="type" @change="type_change">
          <el-option v-for="item in work_type" :label="item.type_name" :value="item.wid" :key="item.wid"></el-option>
        </el-select>
        <el-select filterable v-model="area" @change="area_change">
          <el-option v-for="item in list" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <el-select filterable v-model="order" @change="order_change">
          <el-option v-for="item in dec" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </div>
      <div class="list">
        <ul>
          <li v-for="(item,index) in nearList" @click="detailed(item.uid)">
            <img :src="item.avatar">
            <div class="ss">
              <p>{{item.name}}</p>
              <span>{{item.type}}</span>
            </div>
            <div class="year">
              <p>{{item.work_years}}</p>
            </div>
            <div class="phone">
              <p><i class="iconfont icon-xiaoxi"></i><span style="color: #FFA574;">{{item.phone}}</span></p>
            </div>
            <div class="dis">
              <p><span style="color: #FFA574;">{{item.distance}}</span>KM</p>
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

    <detail v-show="detail_show" ref="detail"></detail>

    <listed v-show="listedShow"></listed>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {getCro} from "@/common/js/crowd";
  import {getAvatar} from '@/common/js/avatar.js'
  import detail from "@/base/list/detail"
  import listed from "@/base/list/listed"
  export default {
    data(){
      return{
        work_type:[],
        str:'',
        area:[],
        x:'',
        y:'',
        loading: false,
        name:'',
        nearList:[],
        listed:[],
        list:[],
        type:'',
        area:'',
        order:'',
        se:['距离','好评率','雇佣次数'],
        pageIndex:1,
        nextPageShow: true,
        dec:[],
        province:["北京市","天津市","上海市","重庆市","河北省","山西省","辽宁省","吉林省","黑龙江省","江苏省","浙江省","安徽省","福建省","江西省","山东省","河南省","湖北省","湖南省","广东省","海南省","四川省","贵州省","云南省","陕西省","甘肃省","青海省","台湾省","内蒙古自治区","广西壮族自治区","西藏自治区","宁夏回族自治区","新疆维吾尔自治区","香港特别行政区","澳门特别行政区"],
        typed:'',
        home:'',
        orders:'',
        mean:true,
        mess:false,
        mains:true,
        detail_show:false,
        listedShow:false,
        usd:''
      }
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
      _getType(){
        this.$http.post('/index.php/Mobile/Find/worker_type')
          .then((res)=>{
            if(res.data.code == 0){
              res.data.data.forEach((item)=>{
                this.work_type.push(item)
              })
              var ss = {type_name:'全部',wid:'1'}
              this.work_type.unshift(ss)
            }
          })
      },
      // _getwid(){
      //   this.$jsonp('https://api.map.baidu.com/location/ip?ak=fyKtzB7I2n7PLscY90x7kUQMcr1DmcqD&ip&coor=bd09ll')
      //     .then((res)=>{
      //       this.x = res.content.point.x
      //       this.y = res.content.point.y
      //       this._creatMap()
      //     },function () {
      //       this.$message.error('获取位置出错')
      //     })
      //
      // },
      //创建地图
      // _creatMap(){
      //   var map = new BMap.Map("map");
      //   if(this.x != '' || this.y != ''){
      //     var point = new BMap.Point(this.x,this.y)
      //   }else{
      //     var point = new BMap.Point(116.404, 39.915)
      //   }
      //   map.centerAndZoom(point,14)
      //   map.enableScrollWheelZoom(true)
      //   map.addControl(new BMap.ScaleControl())
      //   map.addControl(new BMap.NavigationControl())
      //   map.addControl(new BMap.MapTypeControl())
      //   var marker = new BMap.Marker(point)
      //   map.addOverlay(marker);
      //   this._getNearWork(map)
      // },
      _getNearWork(){
        this.nearList.splice(0,this.nearList.length)
        let param = new URLSearchParams()
        param.append('uid',this.user.uid)
        param.append('p',this.pageIndex)
        if(this.typed != '1'){
          param.append('wid',this.typed)
        }
        param.append('hometown',this.home)
        param.append('order',this.orders)
        this.$http.post('/index.php/Mobile/Find/nearby_worker_list',param)
          .then((res)=>{
            var arr = res.data.data.nworker
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
            if(this.nearList.length<20){
              this.nextPageShow =false
            }
            this.dec = this.se.map(item=>{
              return { value: item, label: item };
            })
            this.list = this.province.map(item=>{
              return { value: item, label: item };
            })
          })

      },
      remoteMethod(res){
        if(res != ''){
          this.loading = true
          setTimeout(()=>{
            this.loading = false;
            let param = new URLSearchParams()
            param.append('keyword',res)
            this.$http.post('index.php/Mobile/worker/search_worker',param)
              .then((res)=>{
                res.data.data.forEach((item)=>{
                  item.avatar = getAvatar(item.avatar)
                  item.distance = (item.distance/1000).toFixed(2)
                  let str = ''
                  var arr = item.type
                  for(var sr in arr){
                    str += arr[sr]
                  }
                  item.type = str
                  this.listed.push(item)
                })
              })
          },200)
        }else{
          this.listed = []
        }
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
      type_change(res){
        this.typed = res
        this._getNearWork()
      },
      area_change(res){
        this.home = res
        this._getNearWork()
      },
      order_change(res){
        if(res == '好评率'){
          this.orders = 'w'
          this._getNearWork()
        }
        if(res == '雇佣次数'){
          this.orders = 'n'
          this._getNearWork()
        }
        if(res == '距离'){
          this.orders = 'd'
          this._getNearWork()
        }
      },
      show_sea(){
        this.mean = false
        this.mess = true
      },
      shoe(){
        this.mean = true
        this.mess = false
      },
      detailed(pr){
        this.mains = false
        this.detail_show = true
        this.$refs.detail._getInfo(pr,this.user.uid)
      },
      search(pr){
        this.mains = false
        this.detail_show = true
        this.$refs.detail._getInfo(pr,this.user.uid)
      }
    },
    mounted(){
      this._getType()
      this._getNearWork()
      if(this.$route.path === '/work/list') {
        this.$emit('changeWorkIndex', 9)
      }
    },
    created(){
      if(!localStorage.user){
        this.$router.push({ path: '/login' })
      }
    },
    watch:{
      pageIndex() {
        this._getNearWork()
      },
    },
    components:{
      detail,
      listed
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
      .ss{
        width: 120px;
        height: 50px;
        float: left;
        margin-left: 30px;
        p{
          text-align: center;
          margin-top: 8px;
        }
        span{
          display: block;
          text-align: center;

        }
      }
      .phone{
        width: 120px;
        float: left;
        height: 50px;
        margin-left: 40px;
        line-height: 50px;
      }
      .dis{
        width: 100px;
        float: left;
        height: 50px;
        margin-left: 70px;
        p{
          line-height: 50px;
        }
      }
      .year{
        width: 40px;
        float: left;
        height: 50px;
        p{
          line-height: 50px;
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
  .tops{
    width: 100%;
    background: #Fff;
    padding: 10px 0;
    .el-select{
      width: 80%;
      display: block;
      margin: 10px auto;

    }
  }
}
  .el-select-dropdown{
    width: 140px;
  }
.inset{
  height: 60px;
  margin-top: 5px;
  img{
    margin-top: 5px;
    float: left;
  }
  .main{
    width: 60px;
    float: left;
    background: none;
    margin-left: 10px;
    p{
      height: 22px;
      text-align: center;
    }
    span{
      width: 60px;
      text-align: center;
      display: inline-block;
    }
  }
  .phone{
    width: 120px;
    float: left;
    height: 60px;
    margin-left: 35px;
    span{
      margin-top: 10px;
      display: block;
    }
  }
  .distance{
    float: left;
    height: 60px;
    margin-left: 60px;
    p{
      margin-top: 10px;
    }
  }

}
</style>

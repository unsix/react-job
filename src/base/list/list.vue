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
            <div @click="search(item.uid)" style="overflow: hidden">
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
        <el-select filterable v-model="type" @change="type_change" placeholder="工种">
          <el-option v-for="item in work_type" :label="item.type_name" :value="item.wid" :key="item.wid"></el-option>
        </el-select>
        <el-select filterable v-model="area" @change="area_change" placeholder="地区">
          <el-option v-for="item in list" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <el-select filterable v-model="order" @change="order_change" placeholder="排序">
          <el-option v-for="item in dec" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </div>
      <div class="list">
        <ul>
          <li v-for="(item,index) in nearList" @click="detailed(item.uid)">
            <img :src="item.avatar" style="width: 50px;height: 50px">
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
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { create_depart_list } from 'common/js/initial/depart.js'
  import {getAvatar} from '@/common/js/avatar.js'
  import detail from "@/base/list/detail"
  export default {
    data(){
      return{
        work_type:[],
        str:'',
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
        let httpUrl = this.$test('/index.php/Mobile/Find/worker_type')
        this.$http.post(httpUrl)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
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
        param.append('each',10)
        if(this.typed != '1'){
          param.append('wid',this.typed)
        }
        param.append('hometown',this.home)
        param.append('order',this.orders)
        let httpUrl = this.$test('/index.php/Mobile/Find/nearby_worker_list')
        this.$http.post(httpUrl,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
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
            if(this.nearList.length<10){
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
        this.listed.splice(0,this.listed.length)
        if(res != ''){
          this.loading = true
          setTimeout(()=>{
            this.loading = false;
            let param = new URLSearchParams()
            param.append('keyword',res)
            let httpUrl = this.$test('/index.php/Mobile/worker/search_worker')
            this.$http.post(httpUrl,param)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
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
        if(pr == this.user.uid){
          this.mains = false
          this.detail_show = true
          this.$refs.detail._getInfo(pr,this.user.uid)
          this.$refs.detail.star = false
        }else{
          this.$refs.detail.star = true
          let nparam = new URLSearchParams()
          nparam.append('target_uid',pr)
          let httpUrl = this.$test('/index.php/Mobile/alisun/view_power')
          this.$http.post(httpUrl,nparam)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              if(res.data.data.status == 1){
                this.mains = false
                this.detail_show = true
                this.$refs.detail._getInfo(pr,this.user.uid)
              }else{
                this.$confirm('是否从余额付费一元查看用户详情','提示',{
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(()=>{
                  let param = new URLSearchParams()
                  param.append('target_uid',pr)
                  let httpUrl = this.$test('/index.php/Mobile/alisun/view_payment')
                  this.$http.post(httpUrl,param)
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      this.$testLogin(judge,current)
                      if(res.data.code == 0){
                        this.mains = false
                        this.detail_show = true
                        this.$refs.detail._getInfo(pr,this.user.uid)
                        if(pr == this.user.uid){
                          this.$refs.detail.star = false
                        }else{
                          this.$refs.detail.star = true
                        }
                      }else{
                        this.$message.warning(res.data.message)
                      }
                    })
                }).catch(()=>{
                  this.$message.warning('已取消支付')
                })
              }
            })
        }
      },
      search(pr){
        this.name = ''
        if(pr == this.user.uid){
          this.mains = false
          this.detail_show = true
          this.$refs.detail._getInfo(pr,this.user.uid)
          this.$refs.detail.star = false
        }else{
          this.$refs.detail.star = true
          let nparam = new URLSearchParams()
          nparam.append('target_uid',pr)
          let httpUrl = this.$test('/index.php/Mobile/alisun/view_power')
          this.$http.post(httpUrl,nparam)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              if(res.data.data.status == 1){
                this.mains = false
                this.detail_show = true
                this.$refs.detail._getInfo(pr,this.user.uid)
              }else{
                this.$confirm('是否从余额付费两元查看用户详情','提示',{
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(()=>{
                  let param = new URLSearchParams()
                  param.append('target_uid',pr)
                  let httpUrl = this.$test('/index.php/Mobile/alisun/view_payment')
                  this.$http.post(httpUrl,param)
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      this.$testLogin(judge,current)
                      if(res.data.code == 0){
                        this.mains = false
                        this.detail_show = true
                        this.$refs.detail._getInfo(pr,this.user.uid)
                        if(pr == this.user.uid){
                          this.$refs.detail.star = false
                        }else{
                          this.$refs.detail.star = true
                        }
                      }else{
                        this.$message.warning(res.data.message)
                      }
                    })
                }).catch(()=>{
                  this.$message.warning('已取消支付')
                })
              }
            })
        }
      },
      _getComDepart() {
        let param = new URLSearchParams();
        param.append("company_id", this.nowCompanyId);
        let httpUrl = this.$test("/index.php/Mobile/user/get_department_lest")
        this.$http.post(httpUrl, param)
          .then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            let arr = []
            res.data.data.forEach((item) => {
              arr.push(create_depart_list(item))
            })
            this.setComDepartList(arr)
          })
      },
      _getToken() {
        let nparam = new URLSearchParams();
        nparam.append("uid", this.user.uid);
        let httpUrl = this.$test("/index.php/Mobile/path/get_token")
        this.$http.post(httpUrl, nparam)
          .then((res) => {
            localStorage.token = JSON.stringify(res.data.data);
          })
      },
      _getUserCompanyList() {
        let param = new URLSearchParams();
        param.append("uid", this.user.uid);
        let httpUrl = this.$test("/index.php/Mobile/user/companies_list")
        this.$http.post(httpUrl, param)
          .then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            this.setCompanyList(res.data.data)
          })
      },
      _getComPersonList(){
        let newparam = new URLSearchParams();
        newparam.append("company_id",this.nowCompanyId);
        let httpUrl = this.$test("/index.php/Mobile/user/get_company_personnel")
        this.$http.post(httpUrl,newparam)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            let reaDa=[]
            res.data.data.forEach((item)=>{
              item.avatar = getAvatar(item.avatar)
              reaDa.push(item)
            })
            this.setComPersonList(reaDa)
          })
      }
    },
    mounted(){
      this._getType()
      this._getNearWork()
      if(this.$route.path === '/work/list') {
        this.$emit('changeWorkIndex', '4-2')
      }
    },
    created(){
      if(!localStorage.user){
        this.$router.push({ path: '/login' })
      }
      this.setUser(JSON.parse(localStorage.user))
      this.setNowCompanyId(JSON.parse(localStorage.nowCompanyId))
      this._getUserCompanyList()
      this._getToken()
      this._getComDepart()
      this._getComPersonList()
    },
    watch:{
      pageIndex() {
        this._getNearWork()
      },
    },
    components:{
      detail,
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

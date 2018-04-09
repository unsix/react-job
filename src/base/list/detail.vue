<template>
  <div>
    <div class="deta" v-show="deta">
      <div class="top">
        <el-button type="primary" size="small" @click="_return">返回</el-button>
        <p>{{moreInfo.name}}</p>
        <b><i class="iconfont icon-xiazai19" style="color: #62A4D7;cursor: pointer" @click="showMap"></i></b>
      </div>
      <div class="main">
        <img :src="moreInfo.avatar" alt="" @click="picShow(moreInfo.avatar)">
        <ul>
          <li>姓名：{{moreInfo.name}}</li>
          <li>职业：{{moreInfo.type}}</li>
          <li><i class="iconfont icon-weibiaoti-" style="color: #7CC7FF"></i>{{moreInfo.phone}}</li>
          <li><i class="iconfont icon-xiaoxi" style="color: #50BCBC;"></i>找他聊聊</li>
        </ul>
      </div>
      <div class="tab">
        <el-tabs v-model="activeName" @tab-click="handClick">
          <el-tab-pane label="信息详情" name="fir"></el-tab-pane>
          <el-tab-pane label="用户评价" name="sec"></el-tab-pane>
          <el-tab-pane label="工人作品" name="thr"></el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div class="info" v-show="infos">
      <div class="info_one" v-show="info">
        <ul>
          <li>年龄<span v-show="moreInfo.age != ''">{{moreInfo.age}}岁</span><span v-show="moreInfo.age == ''">无</span></li>
          <li>籍贯<span v-show="moreInfo.hometown != ''">{{moreInfo.hometown}}</span><span v-show="moreInfo.hometown == ''">无</span></li>
          <li>好评率<span>好评率{{moreInfo.nice}}%</span></li>
          <li>雇佣次数<span>被雇佣次数{{moreInfo.work_num}}次</span></li>
          <li>期望薪资<span>{{moreInfo.salary}}</span></li>
          <li>支付宝<span>无</span></li>
          <li>银行卡<span>无</span></li>
          <li>身份证号<span>{{moreInfo.idcard}}</span></li>
          <li>QQ<span v-show="moreInfo.qq != ''">{{moreInfo.qq}}</span><span v-show="moreInfo.qq == ''">无</span></li>
          <li>微信<span>{{moreInfo.wechat}}</span></li>
          <li>暂住地址<span v-show="moreInfo.address != ''">{{moreInfo.address}}</span><span v-show="moreInfo.address == ''">无</span></li>
          <li>个人评价<span>无</span></li>
        </ul>
      </div>
      <div class="comment" v-show="com"></div>
      <div class="works" v-show="works"></div>
      <div class="bottom">
        <span><i class="iconfont icon-fasongxinxi" style="color: #B6D8F2;"></i>发送合同</span>
        <span><i class="iconfont icon-wujiaoxing" style="color: #FFB59B;"></i>加入收藏</span>
      </div>
    </div>

    <div class="pic" ref="pic" v-show="show_pic">
      <i class="el-icon-close" @click="close_pp"></i>
      <img ref="img" :src="linked">
    </div>

    <div class="wide" ref="wide" v-show="wideShow"></div>

    <div class="maps" v-show="map">
      <div class="top">
        <el-button type="primary" size="small" @click="_remap">返回</el-button>
        <p>定位</p>
      </div>
      <div class="map" id="map"></div>
    </div>

    <loading v-show="loadingShow" style="z-index: 9999999"></loading>
  </div>
</template>

<script>
  import {getAvatar} from "../../common/js/avatar";
  import loading from '@/base/loading/loading'

  export default {
  data(){
    return{
      activeName:'fir',
      moreInfo:'',
      info:true,
      com:false,
      works:false,
      show_pic:false,
      linked:'',
      wideShow:false,
      infos:true,
      deta:true,
      map:false,
      x:'',
      y:'',
      loadingShow:false
    }
  },
  methods:{
    _getInfo(pr,re){
      let param = new URLSearchParams()
      param.append('uid',pr)
      param.append('user_id',re)
      this.$http.post('/index.php/Mobile/Find/worker_info',param)
        .then((res)=>{
          if(res.data.code == 0){
            this.moreInfo = res.data.data.worker
            this.moreInfo.avatar = getAvatar(this.moreInfo.avatar)
            let str = ''
            let arr = this.moreInfo.type
            for(var ss in arr){
              str += arr[ss]
            }
            this.moreInfo.type = str
            this.x = this.moreInfo.longitude
            this.y = this.moreInfo.latitude
          }
        })
    },
    handClick(tab){
      let index = parseInt(tab.index)
      if(index == 0){
        this.info = true
        this.com = false
        this.works = false
      }
      if(index == 1){
        this.info = false
        this.com = true
        this.works = false
      }
      if(index == 2){
        this.info = false
        this.com = false
        this.works = true
      }
    },
    _return(){
      this.$parent.mains = true
      this.$parent.detail_show = false
    },
    close_pp(){
      this.wideShow = false
      this.show_pic = false
      this.$refs.img.src = ''
      document.body.style.overflow = 'visible'
    },
    picShow(es){
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      this.$refs.wide.style.height = h + 'px'
      this.$refs.pic.style.height = h + 'px'
      this.wideShow = true
      this.show_pic = true
      var str = ''
      str = es.split('?')
      this.$refs.img.src = str[0]
      document.body.style.overflow = 'hidden'
    },
    showMap(){
      this.deta = false
      this.infos = false
      this.map = true
      this.loadingShow = true
      setTimeout(()=>{
        this.loadingShow = false
        this._creatMap()
      },200)
    },
    _remap(){
      this.deta = true
      this.infos = true
      this.map = false
    },
    _creatMap(){
      var map = new BMap.Map("map");
      if(this.x != '' || this.y != ''){
        var point = new BMap.Point(this.x,this.y)
      }else{
        var point = new BMap.Point(116.404, 39.915)
      }
      map.centerAndZoom(point,14)
      map.enableScrollWheelZoom(true)
      map.addControl(new BMap.ScaleControl())
      map.addControl(new BMap.NavigationControl())
      map.addControl(new BMap.MapTypeControl())
      var marker = new BMap.Marker(point)
      map.addOverlay(marker);
    },
  },
  mounted(){

  },
  components:{
    loading
  }
}
</script>

<style lang="scss">
.deta{
  width: 100%;
  background: #Fff;
  overflow: hidden;
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
  .main{
    width: 100%;
    overflow: hidden;
    img{
      border-radius: 50%;
      margin: 40px 15px 20px 20px;
      float: left;
    }
    ul{
      float: left;
      line-height: 22px;
      margin: 20px 0;
    }
  }
  .tab{
    width: 100%;
    .el-tabs{
      width: 100%;
      .el-tabs__item{
        width: 200px;
        text-align: center;
      }
    }
  }
}
.info{
  width: 100%;
  .info_one{
    width: 100%;
    background: #FFf;
    color: #5a5e66;
    height: 450px;
    overflow-y: auto;
    ul{
      li{
        border-bottom: 1px solid #e3e4e9;
        padding: 10px 20px;
        span{
          float: right;
        }
      }
    }
  }
  .comment{
    width: 100%;
    background: #FFf;
    color: #5a5e66;
    height: 450px;
    overflow-y: auto;
  }
  .works{
    width: 100%;
    background: #FFf;
    color: #5a5e66;
    height: 450px;
    overflow-y: auto;
  }
  .bottom{
    background: #Fff;
    padding: 20px 0;
    display: flex;
    display: -webkit-flex;
    span{
      flex-grow: 1;
      display: inline-block;
      text-align: center;
      cursor: pointer;
    }
  }
}
.wide{
    width: 100%;
    z-index: 99;
    /*height: 3000px;*/
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
  }
.pic{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99999;
  i{
    font-size: 58px;
    color: white;
    float: right;
    margin: 50px;
    cursor: pointer;
    &:hover{
      color: red;
    }
  }
  img{
    display: block;
    margin: 250px auto;
  }
}
.maps{
  width: 100%;
  background: #Fff;
  overflow: hidden;
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
  }
}
#map{
  height: 600px;
}
</style>

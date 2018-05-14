<template>
  <div>
    <div class="opus" v-show="opus">
      <div class="top">
        <p>我的作品</p>
      </div>
      <div class="main">
        <ul>
          <li v-for="(item,index) in untreated">
            <img :src="item.img_List[0]" alt="" @click="ctrl_pic_show(item.img_List,0)">
            <p>{{item.content}}</p>
            <span>{{item.works_time}}</span>
          </li>
        </ul>
      </div>
      <div class="bottom">
        <el-button type="primary">上传作品</el-button>
      </div>
    </div>

    <browsePic :pic_index="pic_index" ref="browe" :img_arr="arr_list"  v-show="pic_show"></browsePic>

    <div class="upload" v-show="upload">
      <div class="top">
        <el-button>返回</el-button>

      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {getAvatar} from '@/common/js/avatar.js'
  import browsePic from '@/base/browse_pic/browse_pic'
export default {
  data(){
    return{
      untreated:[],
      pic_index: 0,
      arr_list: [],
      pic_show:false,
      opus:true,
      upload:false
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
      setCompanyList: 'SET_COMPANYLIST'
    }),
    _getInfo(){
      let param = new URLSearchParams()
      param.append('uid',this.user.uid)
      this.$http.post('/index.php/Mobile/works/works',param)
        .then((res)=>{
          if(res.data.code == 0){
            res.data.data.forEach((item)=>{
              this.untreated.push(item)
              this.get_img(item.picture,item)
            })
          }
        })
    },
    get_img(pre,re){
      let arr = []
      pre.forEach((item)=>{
        arr.push(getAvatar(item))
      })
      this.$set(re,'img_List',arr)
    },
    ctrl_pic_show(item,index){
      item.forEach((res)=>{
        let current = res.indexOf('?')
        this.arr_list.push(res.slice(0,current) + '?imageslim' )
      })
      this.pic_index = index
      this.pic_show = true
    }
  },
  created(){
    this._getInfo()
  },
  computed:{
    ...mapGetters([
      'user',
      'token',
      'nowCompanyName',
      'userState',
      'nowCompanyId',
      'comDepartList',
      'companyList'
    ])
  },
  components:{
    browsePic
  }
}
</script>

<style lang="scss">
.opus{
  width: 100%;
  .top {
    background: #fff;
    position: relative;
    p {
      width: 500px;
      margin: 0 auto;
      text-align: center;
      font-weight: bolder;
      padding: 15px 0;
    }
  }
  .main{
    margin-top: 4px;
    width: 100%;
    background: #fff;
    height: 600px;
    overflow-y: auto;
    ul{
      overflow: hidden;
      li{
        margin: 10px 24px;
        width: 250px;
        border: 1px solid #e3e4e9;
        float: left;
        img{
          width: 50px;
          height: 50px;
          display: block;
          margin: 10px auto;
          border: 1px solid #e1f3d8;
          cursor: pointer;
        }
        p{
          text-align: center;
        }
        span{
          display: block;
          text-align: center;
          margin: 5px 0;
        }
      }
    }
  }
  .bottom{
    width: 100%;
    background: #Fff;
    button{
      width: 80%;
      margin-left: 60px;
      margin-bottom: 10px;
    }
  }
}
</style>

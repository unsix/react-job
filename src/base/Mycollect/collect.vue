<template>
  <div>
    <div class="collect" v-show="mains">
      <div class="top">
        <p>我的收藏</p>
      </div>
      <div class="main">
        <ul>
          <li v-for="item in list" @click="getMoreInfo(item.worker.uid)">
            <img :src="item.worker.avatar" style="width: 50px;height: 50px">
            <div class="ss">
              <p>{{item.worker.name}}</p>
              <span>{{item.worker.type}}</span>
            </div>
            <div class="sd" @click.stop="re_cheer(item.worker.uid)">取消收藏</div>
          </li>
        </ul>
      </div>
    </div>

    <detail v-show="detail_show" ref="detail"></detail>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {getCro} from "@/common/js/crowd";
  import {getAvatar} from '@/common/js/avatar.js'
  import detail from "@/base/list/detail"
export default {
  data(){
    return{
      list:[],
      mains:true,
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
      setCompanyList: 'SET_COMPANYLIST'
    }),
    _getInfo(){
      this.list = []
      this.$http.post('/index.php/Mobile/Myinfo/myCollection')
        .then((res)=>{
          var current = this
          var judge = res.data.code
          getCro(judge,current)
          if(res.data.code == 0){
            res.data.data.forEach((item)=>{
              item.worker.avatar = getAvatar(item.worker.avatar)
              item.worker.type = item.worker.type[0]
              this.list.push(item)
            })
          }
        })
    },
    re_cheer(pr){
      let param = new URLSearchParams()
      param.append('worker_id',pr)
      this.$http.post('/index.php/Mobile/Find/collect',param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          getCro(judge,current)
          if(res.data.code == 0){
            this.$message.success('取消收藏成功')
            this._getInfo()
          }
        })
    },
    getMoreInfo(pr){
      this.mains = false
      this.detail_show = true
      this.$refs.detail.star = false
      this.$refs.detail._getInfo(pr,this.user.uid)
    }
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
  created(){
    this._getInfo()
  },
  components:{
    detail
  },
  mounted(){
    if(this.$route.path === '/work/collect') {
      this.$emit('changeWorkIndex', '8-2')
    }
  }
}
</script>

<style lang="scss">
.collect{
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
    margin-top: 5px;
    ul{
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
          width: 300px;
          height: 50px;
          float: left;
          margin-left: 30px;
          p{
            margin-left: 20px;
            margin-top: 8px;
          }
          span{
            display: block;
          }
        }
        .sd{
          line-height: 50px;
          float: right;
          margin-right: 20px;
          cursor: pointer;
          color: #FF8054;
        }
      }
    }
  }
}
</style>

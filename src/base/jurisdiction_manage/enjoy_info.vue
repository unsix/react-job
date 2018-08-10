<template>
    <div>
      <div class="enjoy" v-if="enjoy_show">
        <div class="top">
          <el-button type="primary" size="small" @click="_return">返回</el-button>
          <p>信息共享</p>
          <b @click="add_infos">添加</b>
        </div>
        <div class="list">
          <ul>
            <li v-for="(item,index) in untreated">
              <div class="mained">
                <div v-for="pr in item.members">
                  <img :src="pr.avatar" alt="">
                  <p>{{pr.name}}</p>
                </div>
              </div>
              <div class="deleate" @click="delete_item(item.term_id)">
                <i class="el-icon-delete"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="perosns" v-show="person_show">
        <div class="top">
          <el-button type="primary" size="small" @click="return_">返回</el-button>
          <p>添加信息共享组</p>
          <b @click="add_person">确定</b>
        </div>
        <el-checkbox-group v-for="(item,index) in comPersonList" v-model="ccPer" :key="index">
          <el-checkbox :label="item.uid" >
            <img :src="item.avatar" alt="">
            <div class="price">
              <p>{{item.name}}</p>
              <p>{{item.phone}}</p>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <loading v-show="loadingShow"></loading>
    </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {getAvatar} from '@/common/js/avatar.js'
  import loading from '@/base/loading/loading'
  export default {
    data(){
      return{
        untreated:[],
        enjoy_show:true,
        person_show:false,
        ccPer:[],
        loadingShow:false
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
      add_infos(){
        this.enjoy_show =false
        this.person_show = true
      },
      get_data(){
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        let str= this.$test('/index.php/Mobile/approval/viewable_terms_list')
        this.$http.post(str,param)
          .then((res)=>{
             if(res.data.code == 0){
               this.untreated = res.data.data
               this.untreated.forEach((item)=>{
                 item.members.forEach((pr)=>{
                   pr.avatar = getAvatar(pr.avatar)
                 })
               })
             }
          })
      },
      delete_item(pr){
        let param = new URLSearchParams()
        param.append('term_id',pr)
        param.append('company_id',this.nowCompanyId)
        let str = this.$test('/index.php/Mobile/approval/del_viewable_term')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              this.$message.success('删除成功')
              this.return_()
              this.get_data()
            }else{
              this.$message.error(res.data.message)
            }
          })
      },
      return_(){
        this.enjoy_show =true
        this.person_show = false
      },
      add_person(){
        if(this.ccPer.length > 2){
          this.$message.error('至少选择两项')
          return
        }
        this.loadingShow = true
        let param = new URLSearchParams()
        param.append('viewable_uids',JSON.stringify(this.ccPer))
        param.append('company_id',this.nowCompanyId)
        let str= this.$test('/index.php/Mobile/approval/set_viewable_term')
        this.$http.post(str,param)
          .then((res)=>{
            this.loadingShow = false
            if(res.data.code == 0){
              this.$message.success('添加成功')
              this.return_()
              this.get_data()
            }else{
              this.$message.error(res.data.message)
            }
          })
      },
      _return(){
        this.enjoy_show = false
        this.$emit('return_manage')
      }
    },
    created(){
      this.get_data()
    },
    computed: {
      ...mapGetters([
        'nowCompanyId',
        'user',
        'comPersonList',
        'comPartPersonList'
      ])
    },
    components:{
      loading
    }
  }
</script>

<style lang="scss">
  .enjoy{
    width: 100%;
    background: #FFF;
    .top {
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #fff;
      .el-button {
        position: absolute;
        top: 8px;
        left: 5px;
        margin: 0 !important;
      }
      p {
        width: 500px;
        margin: 0 auto;
        text-align: center;
        font-weight: bolder;
        padding: 15px 0;
      }
      b {
        position: absolute;
        top: 13px;
        right: 13px;
        cursor: pointer;
      }
    }
    .list{
      width: 100%;
      li{
        background: #ffffff;
        margin-bottom: 5px;
        /*margin-top: 5px;*/
        overflow: hidden;
        oz-box-shadow: 1px 1px 2px #999999;
        -webkit-box-shadow: 1px 1px 2px #999999;
        box-shadow: 1px 1px 2px #999999;
        >.mained{
          width: 96%;
          float: left;
          >div{
            margin: 10px 15px;
            width: 120px;
            float: left;
            img{
              display: block;
              margin: 0 auto;
            }
            p{
              margin-top: 5px;
              text-align: center;
              font-size: 14px;
            }
          }
        }
        .deleate{
          float: left;
          margin: 50px 0 0 0;
        }
      }
    }
  }
  .perosns{
    width: 100%;
    background: #FFF;
    .top {
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #fff;
      .el-button {
        position: absolute;
        top: 8px;
        left: 5px;
        margin: 0 !important;
      }
      p {
        width: 500px;
        margin: 0 auto;
        text-align: center;
        font-weight: bolder;
        padding: 15px 0;
      }
      b {
        position: absolute;
        top: 13px;
        right: 13px;
        cursor: pointer;
      }
    }
    .el-checkbox{
      background: #FFF;
      margin-top: 5px;
      overflow: hidden;
      padding:5px 0px 5px 20px;
      font-size: 14px;
      display: flex;
      align-items: center;
      cursor: default;
      border-bottom: 1px solid #DDDDDD;
      transition: .3s;
      oz-box-shadow: 1px 1px 2px #999999;
      -webkit-box-shadow: 1px 1px 2px #999999;
      box-shadow: 1px 1px 2px #999999;
      margin-bottom: 5px;
      margin-left: 0px !important;
      img{
        width: 50px !important;
        height: 50px;
        display: block;
        float: left;
      }
      .price{
        width: 180px;
        float: left;
        margin: 0 15px;
      }
    }
  }
</style>

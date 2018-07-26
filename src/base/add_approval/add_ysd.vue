<template>
  <div style="overflow: hidden">
    <div class="fra" v-show="fra_show">
      <iframe id="mom" class="win" ref="indx" scrolling="yes" height="100%" :src="linked" seamless frameborder="0"></iframe>
      <el-button type="primary" class="btns" @click="submitForm_ysd">立即添加</el-button>
    </div>

    <div class="approval_person" v-show="person_show">
      <div class="top">
        <el-button @click="_relog" size="small" type="warning" plain>返回</el-button>
        <p>选择审批人</p>
        <b @click="submit_ysd">确定</b>
      </div>
      <div class="ofs">
        <el-checkbox-group v-for="(item,index) in comPersonList" v-model="ccPer_arr" :key="index">
          <el-checkbox :label="item.uid" >{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <loading v-show="loadingShow" style="z-index: 9999"></loading>
  </div>


</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import loading from '@/base/loading/loading'
  import { create_yanshoudan_list } from "@/common/js/approval/yanshoudan";

  export default {
  data(){
    return{
      fra_show:true,
      person_show:false,
      ccPer_arr:[],
      result:'',
      loadingShow:false,
      form_Lista:{},
      linked:''
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
    submitForm_ysd(){
      this.$parent.forms = false
      this.$refs.indx.contentWindow.getCustomFormResult()
      let tips = this.$refs.indx.contentWindow.tips
      let result = this.$refs.indx.contentWindow.result
      if(tips){
        this.$message.error(tips)
      }else{
        if(result){
          this.fra_show = false
          this.person_show = true
          this.result = result
        }
      }
    },
    _relog(){
      this.fra_show = true
      this.person_show = false
      this.ccPer = []
    },
    _getComPersonList() {
      let newparam = new URLSearchParams();
      newparam.append("company_id", this.nowCompanyId);
      let str = this.$test("/index.php/Mobile/user/get_company_personnel")
      this.$http.post(str, newparam)
        .then((res) => {
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          let reaDa = []
          res.data.data.forEach((item) => {
            item.avatar = 'http://bbsf-file.hzxb.net/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns'
            reaDa.push(item)
          })
          this.setComPersonList(reaDa)
        })
    },
    submit_ysd(){
      if(this.ccPer_arr.length == 0){
        this.$message.warning('请选择审批人')
      }else{
        this.loadingShow = true
        this.ccPer_arr = JSON.stringify(this.ccPer_arr)
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        param.append('approval_persons',this.ccPer_arr)
        param.append('inspection_type_id',this.inspection_type_id)
        param.append('content',this.result)
        let str = this.$test('/index.php/Mobile/approval/add_inspection')
        this.$http.post(str,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            this.loadingShow = false
            if(res.data.code == 0){
              this.person_show = false
              this.$message.success(res.data.message)
              this.$router.push({
                path: '/work/exam'
              })
            }else{
              this.$message.error(res.data.message)
              this.person_show = false
              this.ccPer_arr = []
              this.result = ''
            }
          })
      }
    },
    initial_data(){
      if(!this.approval_id){
        return
      }
      let param = new URLSearchParams()
      param.append('uid',this.user.uid)
      param.append('approval_id',this.approval_id)
      let str = this.$test('/index.php/Mobile/approval/approval_process_show')
      this.$http.post(str,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          this.form_Lista = create_yanshoudan_list(res.data.data)
          let str = this.$test('/index.php/Mobile/skey/look_inspection_company?type_id')
          this.linked = `${str}=${this.form_Lista.type_id}&form_id=${this.form_Lista.form_id}`
        })
    }
  },
  props:{

    inspection_type_id:{

    },
    approval_id:{
      type: String
    }
  },
  computed: {
    ...mapGetters([
      'comPersonList',
      'user',
      'nowCompanyId',
      'comDepartList',
      'token'
    ])
  },
  components:{
    loading
  },
  created(){
    this._getComPersonList()
    this.initial_data()
  },
  watch:{
    inspection_type_id(){
      let str = this.$test('/index.php/Mobile/skey/look_inspection_company?type_id')
      this.linked = `${str}=${this.inspection_type_id}&form_id=`
    }
  }
}
</script>

<style lang="scss">
  .win{
    width: 100%;
    height:700px;
    border-bottom: 1px solid #e3e4e9;
    margin-top: 20px;
  }
  .btns{
    float: right;
    margin-right: 20px;
  }
  .approval_person{
    width: 100%;
    position: relative;
    top: -20px;
    z-index: 99;
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
        cursor: pointer;
      }
    }
    .ofs{
      margin-left: 40px;
      width: 80%;
      float: left;
      height: 600px;
      overflow-y: auto;
      .el-checkbox-group{
        padding: 10px 0 0;
      }
    }
  }
</style>

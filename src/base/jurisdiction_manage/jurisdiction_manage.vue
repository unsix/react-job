<template>
  <div>
    <div class="manage" v-show="manage_show">
      <div class="top">
        <p>部门管理</p>
      </div>
      <div class="manage_sons">
        <ul>
          <li @click="choose_approval"><span>表单审批</span></li>
          <li @click="choose_receipt"><span>表单回执</span></li>
        </ul>
      </div>
    </div>
    <div class="as_what" v-show="as_what_show">
      <ul>
        <h2>设置审批权限</h2>
        <i class="el-icon-close" @click="close_as"></i>
        <li v-for="(item,index) in asType" @click="as_click(item)">{{item}}</li>
      </ul>
    </div>

    <div class="setFormRePer" v-show="setFormRePerShow">
      <div class="top">
        <el-button type="info" size="small" @click="return_">返回</el-button>
        <p>设置回执</p>
      </div>
      <div class="type">
        <div class="sec" v-for="(item,index) in setFormRe">
          <div class="secHead">
            <span class="headerName">{{item.name}}</span>
            <el-button type="primary" round @click="perShow(index)" :disabled="redactState">编辑</el-button>
          </div>
          <ul class="secUl">
            <li v-for="(group,gindex) in item.groups">
              <div class="avatar">
                <img :src="group.avatar" v-show="group.avatar" alt="" />
              </div>
              <div class="content">
                <span class="name" v-show="group.name">{{group.name}}</span>
              </div>
              <div class="delete">
                <i class="el-icon-circle-close-outline" @click="deleted(gindex,index)" v-show="formRePersonIndex === index"></i>
              </div>
            </li>
          </ul>
        </div>
        <!--表单回执-->
        <div class="person" ref="person">
          <div class="submit">
            <el-button type="primary" round @click="submit" v-show="showMe">保存更改</el-button>
            <el-button style="margin-top: 5px" type="info" @click="_ret" round v-show="showMe">取消</el-button>
          </div>
          <el-collapse v-model="activeNames">
            <el-collapse-item title="人员列表" name="1">
              <div class="info" v-for="(item,index) in comPersonList" @click="choosePerson(item,index)">
                <div class="avatar">
                  <img :src="item.avatar" alt="" />
                </div>
                <div class="content">
                  <span class="name">{{item.department_name}}</span>
                  <span class="name">{{item.name}}</span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>

    <jurisdictionItem class="other_item" :fuJias="fuJia" v-show="jurisdictionItemShow" @_return="_return" :formType="formType" @reload="reload" :submitAddPersonShow="submitAddPersonShow" :jurisdictionFormList="jurisdictionFormList"></jurisdictionItem>
  </div>
</template>

<script>
  import jurisdictionItem from '@/base/jurisdiction_manage/jurisdiction_item'
  import { createJurisdictionList } from 'common/js/jurisdiction_list.js'
  import {getAvatar} from '@/common/js/avatar.js'
  import { mapGetters, mapMutations } from 'vuex'
export default {
  data(){
    return{
      asType:['合同评审','请款单','请购单','申请公章','呈批件','报销单','个人请款单'],
      as_what_show:false,
      manage_show:true,
      jurisdictionItemShow:false,
      formType: 1,
      submitAddPersonShow: false,
      jurisdictionFormList: [],
      setFormRePerShow: false,
      setFormRe: {
        pingshen: {
          name: '合同评审表',
          type: 1,
          groups: []
        },
        qingkuan: {
          name: '请款单',
          type: 7,
          groups: []
        },
        qinggou: {
          name: '请购单',
          type: 3,
          groups: []
        },
        gongzhang:{
          name:'申请公章',
          type:5,
          groups:[]
        },
        chengpi:{
          name:'呈批件',
          type:6,
          groups:[]
        },
        baoxiao:{
          name:'报销单',
          type:11,
          groups:[]
        },
        gongzi:{
          name:'个人请款单',
          type:13,
          groups:[]
        }
      },
      showMe:false,
      activeName: '',
      activeNames: ['0'],
      redactState: false,
      formRePersonIndex: '',
      fuJia:[]
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
    choose_approval(){
      this.as_what_show = true
    },
    choose_receipt(){
      this.manage_show = false
      this.setFormRePerShow = true
      this._getHuizhi()
    },
    close_as(){
      this.as_what_show = false
    },
    as_click(pr){
      switch(pr) {
        case '合同评审':
          this.formType = 111
          break;
        case '请款单':
          this.formType = 8
          break;
        case '请购单':
          this.formType = 7
          break;
        case '申请公章':
          this.formType = 5
          break;
        case '呈批件':
          this.formType = 6
          break;
        case '报销单':
          this.formType = 11
          break;
        case '个人请款单':
          this.formType = 13
          break;
      }
      this._getApproval()
    },
    reload() {
      this._getApproval()
    },
    _getApproval(){
      if(this.formType == 7){
        let str = this.$test('/index.php/Mobile/approval/get_form_auto_filled')
        this.$http.post(str)
          .then((res)=>{
            res.data.data.forEach((item)=>{
              this.fuJia.push(JSON.parse(item))
            })
          })
      }
      let param = new URLSearchParams()
      param.append('company_id',this.nowCompanyId)
      param.append('type',this.formType)
      let str = this.$test('/index.php/Mobile/approval/can_set_sequence')
      this.$http.post(str,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == 0){
            if(res.data.data == 1){
              this.manage_show = false
              this.as_what_show = false
              this.jurisdictionItemShow = true
              this._get_list()
            }else{
              this.$message.error(res.data.message)
            }
          }
        })
    },
    _get_list(){
      this.jurisdictionFormList = []
      let param = new URLSearchParams()
      param.append('company_id',this.nowCompanyId)
      param.append('type',this.formType)
      let str = this.$test('/index.php/Mobile/user/get_approval_user_info')
      this.$http.post(str,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == 0){
            res.data.data.forEach((item)=>{
              this.jurisdictionFormList.push(createJurisdictionList(item))
            })
          }
        })
    },
    _getUserCompanyList() {
      let param = new URLSearchParams();
      param.append("uid", this.user.uid);
      let str = this.$test("/index.php/Mobile/user/companies_list")
      this.$http.post(str, param)
        .then((res) => {
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          this.setCompanyList(res.data.data)
        })
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
            item.avatar = getAvatar(item.avatar)
            reaDa.push(item)
          })
          this.setComPersonList(reaDa)
        })
    },
    _return(){
      this.jurisdictionItemShow = false
      this.manage_show = true
    },
    _getHuizhi() {
      let param = new URLSearchParams();
      param.append("company_id", this.nowCompanyId);
      param.append("uid", this.user.uid);
      let str = this.$test("/index.php/Mobile/find/finance_personnel_list")
      this.$http.post(str, param)
        .then((res) => {
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          res.data.data.forEach((item) => {
            console.log(item)
            if(item.type === 1) {
              let arr = []
              item.list.forEach((list) => {
                arr.push(createJurisdictionList(list))
              })
              this.$set(this.setFormRe.pingshen, 'groups', arr)
            } else if(item.type === 3) {
              let arr = []
              item.list.forEach((list) => {
                arr.push(createJurisdictionList(list))
              })
              this.$set(this.setFormRe.qinggou, 'groups', arr)
            } else if(item.type === 7) {
              let arr = []
              item.list.forEach((list) => {
                arr.push(createJurisdictionList(list))
              })
              this.$set(this.setFormRe.qingkuan, 'groups', arr)
            }else if(item.type === 5) {
              let arr = []
              item.list.forEach((list) => {
                arr.push(createJurisdictionList(list))
              })
              this.$set(this.setFormRe.gongzhang, 'groups', arr)
            }else if(item.type === 6) {
              let arr = []
              item.list.forEach((list) => {
                arr.push(createJurisdictionList(list))
              })
              this.$set(this.setFormRe.chengpi, 'groups', arr)
            }else if(item.type === 11) {
              let arr = []
              item.list.forEach((list) => {
                arr.push(createJurisdictionList(list))
              })
              this.$set(this.setFormRe.baoxiao, 'groups', arr)
            }else if(item.type === 12) {
              let arr = []
              item.list.forEach((list) => {
                arr.push(createJurisdictionList(list))
              })
              this.$set(this.setFormRe.yanshou, 'groups', arr)
            }else if(item.type === 13){
              let arr = []
              item.list.forEach((list)=>{
                arr.push(createJurisdictionList(list))
              })
              this.$set(this.setFormRe.gongzi,'groups',arr)
            }
          })
        })
    },
    perShow(index) {
      this.showMe = true
      this.formRePersonIndex = index
      this.redactState = true
      this.activeNames = ['1']
    },
    submit() {
      this.redactState = false
      this.activeNames = ['0']
      let zz = 0
      if(this.formRePersonIndex === 'pingshen') {
        zz = 1
      } else if(this.formRePersonIndex === 'qinggou') {
        zz = 3
      } else if(this.formRePersonIndex === 'qingkuan') {
        zz = 7
      } else if(this.formRePersonIndex == 'gongzhang'){
        zz = 5
      } else if(this.formRePersonIndex == 'chengpi'){
        zz = 6
      } else if(this.formRePersonIndex == 'baoxiao'){
        zz = 11
      } else if(this.formRePersonIndex == 'yanshou'){
        zz = 12
      } else if(this.formRePersonIndex == 'gongzi'){
        zz = 13
      }
      let narr = []
      this.setFormRe[this.formRePersonIndex].groups.forEach((item) => {
        narr.push(item.uid)
      })
      let param = new URLSearchParams();
      param.append("company_id", this.nowCompanyId);
      param.append("type", zz);
      param.append("personnel", JSON.stringify(narr));
      param.append("uid", this.user.uid);
      let str = this.$test("/index.php/Mobile/user/give_finance_new")
      this.$http.post(str, param)
        .then((res) => {
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code === 0) {
            this._getHuizhi()
            this.formRePersonIndex = -1
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          } else {
            this.$message.error('修改失败');
          }
        })
      this.showMe = false
    },
    _ret(){
      this.showMe = false
      this.redactState = false
      this.activeNames = ['0']
    },
    choosePerson(item, index) {
      console.log(item)
      if(this.setFormRe[this.formRePersonIndex].groups.indexOf(item) != -1) {
        this.$message({
          message: '列表中已存在' + item.name,
          type: 'warning'
        });
        return
      }
      this.setFormRe[this.formRePersonIndex].groups.push(item)
    },
    deleted(gindex, index) {
      this.setFormRe[index].groups.splice(gindex, 1)
    },
    return_(){
      this.setFormRePerShow = false
      this.manage_show = true
    }
  },
  computed: {
    ...mapGetters([
      'nowCompanyId',
      'user',
      'comPersonList'
    ])
  },
  components:{
    jurisdictionItem
  },
  created() {
    if(!localStorage.user) {
      this.$router.push({
        path: '/login'
      })
    }
    this.setUser(JSON.parse(localStorage.user))
    this.setNowCompanyId(JSON.parse(localStorage.nowCompanyId))
    this._getUserCompanyList()
    // this._getApproval()
    this._getComPersonList()
  },
  watch: {
    nowCompanyId() {
      this._getHuizhi()
      this._getComPersonList()
      this._getApproval()
    }
  }
}
</script>

<style lang="scss">
  .manage{
    width: 100%;
    .top{
      background: #fff;
      p{
        width: 500px;
        margin: 0 auto;
        text-align: center;
        font-weight: bolder;
        padding: 15px 0;
      }
    }
    .manage_sons{
      background: #FFF;
      margin-top: 5px;
      ul{
        li{
          background: #ffffff;
          margin-bottom: 5px;
          /*margin-top: 5px;*/
          overflow: hidden;
          oz-box-shadow: 1px 1px 2px #999999;
          -webkit-box-shadow: 1px 1px 2px #999999;
          box-shadow: 1px 1px 2px #999999;
          span{
            display: block;
            padding: 10px 8px;
          }
          &:hover {
            background: #EEEEEE;
          }
        }
      }
    }
  }
  .as_what {
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
    ul {
      width: 200px;
      background: #FFFFFF;
      margin: 200px auto;
      padding: 10px;
      border-radius: 4px;
      h2 {
        display: inline-block;
        margin-bottom: 10px;
        font-size: 20px;
        font-size: 16px;
        color: #409EFF;
      }
      i {
        font-size: 20px;
        float: right;
        cursor: pointer;
        &:hover {
          color: #FA5555
        }
      }
      li {
        cursor: pointer;
        display: block;
        height: 24px;
        line-height: 24px;
        font-size: 15px;
        &:hover {
          color: #5A5E66;
        }
      }
    }
  }
  .other_item{
    width: 100%;
    background: #Fff;
  }
  .setFormRePer {
    width: 100%;
    overflow: hidden;
    background: #FFF;
    .top {
      position: relative;
      border-bottom: 1px solid #e3e4e9;
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
    }
    .type {
      position: relative;
      margin-top: 10px;
      >.person {
        position: absolute;
        top: 0px;
        right: 10px;
        z-index: 10;
        width: 170px;
        height: 300px;
        overflow-y: scroll;
        overflow-x: hidden;
        .el-collapse-item__content {
          padding-bottom: 0;
        }
        >.submit {
          margin-bottom: 10px;
          margin-left: 30px;
        }
        .info {
          cursor: default;
          font-size: 0;
          margin-bottom: 4px;
          >.avatar {
            width: 40px;
            height: 40px;
            vertical-align: top;
            display: inline-block;
            img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }
          }
          >.content {
            display: inline-block;
            margin-left: 10px;
            >span {
              display: block;
              font-size: 12px;
            }
          }
        }
      }
      .sec {
        margin-bottom: 4px;
        .secHead {
          display: block;
          .headerName {
            display: inline-block;
            width: 300px;
            height: 26px;
            line-height: 26px;
            background: #9293A7;
            color: #FFFFFF;
            text-indent: 10px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            font-size: 14px;
            cursor: default;
          }
          button {
            padding: 5px 10px;
            width: 50px;
          }
        }
        .secUl {
          width: 300px;
          li {
            width: 300px;
            margin: 2px 0;
            .avatar {
              vertical-align: middle;
              display: inline-block;
              margin-left: 4px;
              img {
                display: inline-block;
                width: 28px;
                height: 28px;
                border-radius: 50%;
              }
            }
            .content {
              display: inline-block;
              margin-left: 8px;
              span {
                display: block;
                font-size: 14px;
                height: 28px;
                line-height: 28px;
                &:last-child {
                  color: #444444;
                }
              }
            }
            .delete {
              float: right;
              i {
                margin-top: 1px;
                margin-right: 2px;
                cursor: pointer
              }
            }
          }
        }
      }
    }
  }
</style>

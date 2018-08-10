<template>
  <div>
    <div class="manage" v-show="manage_show">
      <div class="top">
        <p>公司管理</p>
        <b @click="show_dis">解散</b>
      </div>
      <div class="manage_sons">
        <ul>
          <li @click="choose_small"><span>添加群组</span></li>
          <li @click="choose_approval"><span>表单审批</span></li>
          <li @click="choose_receipt"><span>表单回执</span></li>
          <li @click="choose_manage"><span>人员管理</span></li>
          <li @click="choose_depart"><span>添加部门</span></li>
          <li @click="choose_info"><span>设置信息共享</span></li>
          <li @click="choose_project"><span>添加工程项目</span></li>
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
    <div class="lists" v-show="listShow">
      <div class="top">
        <el-button @click="return_manage" type="primary" size="small">返回</el-button>
        <p>公司人员管理</p>
      </div>
      <el-collapse v-model="activeName1">
        <el-collapse-item title="管理员" name="1">
          <div v-for="(list,index) in adminArr" class="list_item" :key="index">
            <div class="avatar">
              <img :src="list.avatar" alt="" />
            </div>
            <div class="content">
              <span class="name">{{list.name}}</span>
              <span class="phone">{{list.phone}}</span>
            </div>
            <div class="button">
              <el-button type="warning" round @click="cancelAdministrator(list)">取消管理</el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-collapse v-model="activeName2" accordion>
        <el-collapse-item :title="item.department_name" :name="i" v-for="(item,i) in comPartPersonList" :key="i">
          <div v-for="(list,index) in item.person" class="list_item">
            <div class="avatar">
              <img :src="list.avatar" alt="" />
            </div>
            <div class="content">
              <span class="name">{{list.name}}</span>
              <span class="phone">{{list.phone}}</span>
            </div>
            <div class="button">
              <el-button type="success" round @click="setAdministrator(list)" v-if="list.is_manage !=1">设为管理</el-button>
              <el-button type="warning" round @click="deleteMember(list)">删除</el-button>
            </div>
          </div>
          <div class="com_unit">
            <el-button type="primary" round>添加人员</el-button>
            <!--<el-button type="danger" round @click="delDepartment(item.department_id)">删除部门</el-button>-->
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="addDepartment" v-show="addDepartmentShow">
      <div class="top">
        <el-button @click="return_manage" type="primary" size="small">返回</el-button>
        <p>添加部门</p>
      </div>
      <div class="operation">
        <el-input v-model="newDepartmentName" placeholder="请输入部门名称"></el-input>
        <el-button type="primary" round @click="addDepartment">确认添加</el-button>
      </div>
    </div>
    <div class="addProject" v-if="addPro" v-model="comProjectList">
      <div class="project"  v-show="project">
        <div class="top">
          <el-button @click="return_manage" type="primary" size="small">返回</el-button>
          <p>添加工程</p>
        </div>
        <ul>
          <li  v-show="addProjectShow">
            <div class="projectName">
              <span>项目名称</span>
            </div>
            <div class="addTime">
              <span>添加时间</span>
            </div>
          </li>
          <li v-for="item in comProjectList">
            <div class="name">
              <span>{{item.project_name}}</span>
            </div>
            <div class="time">
              <span>{{item.add_time}}</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="menu">
        <el-button type="success" round @click="_showMe" v-show="addButton">添加工程</el-button>
      </div>
      <div class="addproject"  v-show="addComProject">
        <div class="return">
          <el-button type="success" @click="_returns">返回</el-button>
        </div>
        <div class="operation">
          <el-input v-model="newProjectName" placeholder="请输入工程项目名称"></el-input>
          <el-button type="primary" round @click="addProject">确认添加</el-button>
        </div>
      </div>
    </div>
    <jurisdictionItem class="other_item" :fuJias="fuJia" v-show="jurisdictionItemShow" @_return="_return" :formType="formType" @reload="reload" :submitAddPersonShow="submitAddPersonShow" :jurisdictionFormList="jurisdictionFormList"></jurisdictionItem>
    <enjoy v-if="enjoy_if" @return_manage="return_manage"></enjoy>
  </div>
</template>

<script>
  import jurisdictionItem from '@/base/jurisdiction_manage/jurisdiction_item'
  import enjoy from '@/base/jurisdiction_manage/enjoy_info'
  import { createJurisdictionList } from 'common/js/jurisdiction_list.js'
  import {getAvatar} from '@/common/js/avatar.js'
  import { mapGetters, mapMutations } from 'vuex'
  import { createPersonInfo } from 'common/js/person_info'
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
      activeName1: ['1'],
      activeName2: '1',
      redactState: false,
      formRePersonIndex: '',
      fuJia:[],
      enjoy_if:false,
      listShow:false,
      adminArr:[],
      addDepartmentShow:false,
      newDepartmentName:'',
      addPro:false,
      comProjectList:[],
      addComProject:false,
      addButton:false,
      addProjectShow:false,
      project:false,
      newProjectName: '',
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
    choose_info(){
      this.manage_show = false
      this.enjoy_if = true
    },
    return_manage(){
      this.enjoy_if = false
      this.manage_show = true
    },
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
    _returns(){
      this.addComProject = false
      this.project = true
      this.addProjectShow = true
      this.addButton = true
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
    },
    show_dis(){
      this.$confirm('您确定解散此公司么？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        this.disBandAge()
      }).catch(()=>{
        this.$message.warning('已取消操作')
      })
    },
    disBandAge(){
      let param = new URLSearchParams()
      param.append('uid',this.user.uid)
      param.append('company_id',this.nowCompanyId)
      let httpUrl = this.$test("/index.php/Mobile/User/return_company_new")
      this.$http.post(httpUrl,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          let item = res.data.data
          this.m = item.is_manage
          this.personnel_id = item.personnel_id
          if(this.personnel_id != JSON.parse(localStorage.personnelId)){
            if(this.m == 1){
              let mparam = new URLSearchParams()
              mparam.append('personnel_id',this.personnel_id)
              mparam.append('uid',this.user.uid)
              mparam.append('company_id',this.nowCompanyId)
              let httpUrl = this.$test("/index.php/Mobile/User/quit_company")
              this.$http.post(httpUrl,mparam)
                .then((res)=>{
                  var current = this
                  var judge = res.data.code
                  this.$testLogin(judge,current)
                  if(res.data.code == 0){
                    this.$message({
                      message: '操作成功',
                      type: 'success'
                    })
                    let param = new URLSearchParams();
                    param.append("uid", this.user.uid);
                    let httpUrl = this.$test("/index.php/Mobile/user/companies_list")
                    this.$http.post(httpUrl, param)
                      .then((res)=>{
                        var current = this
                        var judge = res.data.code
                        this.$testLogin(judge,current)
                        this.setNowCompanyId(res.data.data[0].company_id)
                        this.setNowCompanyName(res.data.data[0].company_name)
                        localStorage.nowCompanyId = JSON.stringify(res.data.data[0].company_id);
                        localStorage.nowCompanyName = JSON.stringify(res.data.data[0].company_name);
                        this.$router.push('/list');
                      })
                  }
                })
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              })
              return
            }
          }else{
            this.$message({
              message: '请联系管理员',
              type: 'error'
            })
            return
          }
        })
    },
    choose_manage(){
      this.manage_show = false
      this.listShow = true
    },
    _getAdmin() {
      this.adminArr = []
      let mparam = new URLSearchParams();
      mparam.append("company_id", this.nowCompanyId);
      mparam.append("department_id", -1);
      let httpUrl = this.$test("/index.php/Mobile/user/get_company_personnel")
      this.$http.post(httpUrl, mparam)
        .then((res) => {
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.data.length != 0) {
            res.data.data.forEach((list) => {
              let mewObj = {}
              mewObj.personnel_id = list.personnel_id
              mewObj.department_name = list.department_name
              mewObj.name = list.name
              mewObj.phone = list.phone
              mewObj.avatar = getAvatar(list.avatar)
              this.adminArr.push(mewObj)

            })
          }
        })
    },
    _getComPartPersonList() {
      this.numOne = 0
      this.ComPartPersonList = []
      let param = new URLSearchParams();
      param.append("company_id", this.nowCompanyId);
      let httpUrl = this.$test("/index.php/Mobile/user/get_department_lest")
      this.$http.post(httpUrl, param)
        .then((res) => {
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          let resData = res.data.data
          for(let j = 0, len = resData.length; j < len; j++) {
            if(this.numOne >= len) {
              return
            }
            let obj = {}
            this.$set(obj, 'department_name', resData[j].department_name)
            this.$set(obj, 'department_id',resData[j].department_id)
            let newparam = new URLSearchParams();
            newparam.append("company_id", this.nowCompanyId);
            newparam.append("department_id", resData[j].department_id);
            let httpUrl = this.$test("/index.php/Mobile/user/get_company_personnel")
            this.$http.post(httpUrl, newparam)
              .then((res) => {
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                let reaDa = []
                res.data.data.forEach((item) => {
                  reaDa.push(createPersonInfo(item))
                })
                this.$set(obj, 'person', reaDa)
                this.ComPartPersonList.push(obj)
              })
            this.numOne++
          }
          this.setComPartPersonList(this.ComPartPersonList)
        })
    },
    return_manage(){
      this.manage_show = true
      this.listShow = false
      this.addDepartmentShow = false
      this.addPro = false
    },
    setAdministrator(item) {
      this.adminArr.forEach((list) => {
        if(list.personnel_id === item.personnel_id) {
          this.$message({
            message: item.name + '已是管理员',
            type: 'warning'
          });
          this.returnOne = true
        }
      })
      if(this.returnOne) {
        this.returnOne = false
        return
      }
      let arr = []
      arr.push(item.personnel_id)
      let param = new URLSearchParams();
      param.append("uid", this.user.uid);
      param.append("personnel_id", JSON.stringify(arr));
      param.append("company_id", this.nowCompanyId);
      let httpUrl = this.$test("/index.php/Mobile/User/give_manage")
      this.$http.post(httpUrl, param)
        .then((res) => {
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          this.activeName1 = ['1']
          this.activeName2 = '0'
          if(res.data.code === 0) {
            this._getAdmin()
            this._getComPartPersonList()
            this.$message({
              message: '添加成功',
              type: 'success'
            });
          } else {
            this.$message.error(res.data.message);
          }
        })
    },
    deleteMember(item, index, i) {
      this.$confirm('确定删除' + item.name + '吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let param = new URLSearchParams();
        param.append("uid", this.user.uid);
        param.append("personnel_id", item.personnel_id);
        param.append("company_id", this.nowCompanyId);
        let httpUrl = this.$test("/index.php/Mobile/user/del_company_personnel")
        this.$http.post(httpUrl, param)
          .then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            if(res.data.code === 0) {
              this._getComPartPersonList()
              this._getAdmin()
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            } else {
              this.$message.error(res.data.message);

            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    delDepartment(res){
      this.$confirm("确定删除吗",'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(()=>{
        // let nparam = new URLSearchParams()
        // nparam.append('uid',this.user.uid)
        // nparam.append('company_id',this.nowCompanyId)
      })
    },
    cancelAdministrator(item) {
      this.$alert('确定删除管理员' + item.name + '吗', '操作', {
        callback: action => {
          if(item.personnel_id === JSON.parse(localStorage.personnelId)) {
            this.$message.error('管理员不可删除自己')
            return
          }
          let param = new URLSearchParams();
          param.append("uid", this.user.uid);
          param.append("my_personnel_id", JSON.parse(localStorage.personnelId));
          param.append("personnel_id", item.personnel_id);
          param.append("company_id", this.nowCompanyId);
          let httpUrl = this.$test("/index.php/Mobile/User/del_manage")
          this.$http.post(httpUrl, param)
            .then((res) => {
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              if(res.data.code === 1) {
                this.$message.error(res.data.message);
              } else if(res.data.code === 0) {
                this._getComPartPersonList()
                this._getAdmin()
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
              }
            })
        }
      });

    },
    choose_depart(){
      this.manage_show = false
      this.addDepartmentShow = true
    },
    addDepartment() {
      this.$confirm('确认添加新部门吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = new URLSearchParams();
        param.append("uid", this.user.uid);
        param.append("department_name", this.newDepartmentName);
        param.append("company_id", this.nowCompanyId);
        let httpUrl = this.$test("/index.php/Mobile/User/add_department")
        this.$http.post(httpUrl, param)
          .then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            this._getComPartPersonList()
            if(res.data.code === 0) {
              this.activeName = '1'
              this.manage_show = true
              this.addDepartmentShow = false
              this.newDepartmentName = ''
              this.$message({
                message: '添加部门成功',
                type: 'success'
              });
            } else {
              this.$message.error(res.data.message);
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消添加'
        });
      });
    },
    choose_project(){
      this.project = true
      this.addProjectShow = true
      this.addButton = true
      this.addComProject = false
      this.addPro = true
      this.manage_show = false
    },
    _showMe(){
      this.addProjectShow = false
      this.addComProject = true
      this.addButton = false
      this.project = false
    },
    addProject(){
      this.$confirm('确认添加新工程项目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let nparam = new URLSearchParams()
        nparam.append("uid",this.user.uid)
        nparam.append("project_name",this.newProjectName)
        nparam.append("company_id",this.nowCompanyId)
        let httpUrl = this.$test("/index.php/Mobile/company/add_company_project")
        this.$http.post(httpUrl,nparam)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            this._getProjectList()
            if(res.data.code === 0){
              this.project = true
              this.addProjectShow = true
              this.addButton = true
              this.addComProject = false
              this.newProjectName = ''
              this.$message({
                message :'添加工程项目成功',
                type: 'success'
              })
            }else{
              this.$message.error(res.data.message);
            }
          })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消添加'
        });
      })
    },
    _getProjectList(){
      this.comProjectList=[]
      let mparam = new URLSearchParams()
      mparam.append('uid',this.user.uid)
      mparam.append('company_id',this.nowCompanyId)
      let httpUrl = this.$test("/index.php/Mobile/company/company_project_list")
      this.$http.post(httpUrl,mparam)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          res.data.data.forEach((item)=>{
            this.comProjectList.push(item)
          })
        })
    },
    choose_small(){
      this.manage_show = false
      this.$router.push({ path: '/work/small' })
    }
  },
  computed: {
    ...mapGetters([
      'nowCompanyId',
      'user',
      'comPersonList',
      'comPartPersonList'
    ])
  },
  mounted() {
    if(this.$route.path === '/work/jurisdictionManage') {
      this.$emit('changeWorkIndex', '4-4')
    }
  },
  components:{
    jurisdictionItem,
    enjoy
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
    this._getComPersonList()
    this._getAdmin()
    this._getComPartPersonList()
    this._getProjectList()
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
  .lists {
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
    .el-collapse-item__header {
      margin-left: 0;
      text-indent: 10px;
    }
    .el-collapse-item:last-child {
      margin-bottom: -2px;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
    .el-collapse-item.is-active .el-collapse-item__header {
      background: #EEEEEE;
    }
    .el-button.is-round {
      padding: 10px 20px;
    }
    .list_item {
      margin-top: 5px;
      height: 50px;
      font-size: 0;
      >.avatar {
        display: inline-block;
        vertical-align: top;
        margin-left: 40px;
        img {
          margin-top: 4px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }
      >.content {
        display: inline-block;
        margin-left: 10px;
        >span {
          font-size: 14px;
          display: block;
        }
      }
      .button {
        display: inline-block;
        float: right;
        margin-right: 10px;
        button {
          margin-left: 10px;
        }
      }
    }
    .com_unit{
      button{
        margin: 10px 10px;
      }
    }
  }
  .addDepartment {
    width: 100%;
    min-height: 200px;
    background: #FFF;
    overflow: hidden;
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
    .operation {
      width: 200px;
      margin: 100px auto;
      button {
        margin-left: 40px;
        margin-top: 20px;
      }
    }
  }
  .addProject {
    width: 100%;
    min-height: 200px;
    background: #FFF;

    .menu{
      button{
        display: block;
        margin: 40px auto 0;
      }
    }
    .project{
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
      background: #FFFFFF;
      box-shadow: 0 0 2px rgba(0, 0, 0, .2);
      -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
      >ul{
        padding: 10px;
        >li{
          cursor: default;
          display: block;
          border-bottom: 1px solid #DDDDDD;
          font-size: 14px;
          transition: .3s;
          &:first-child {
            border-bottom: 1px solid transparent;
            &:hover {
              background: none;
            }
          }
          >.projectName {
            font-weight: 700;
            font-size: 15px;
            text-indent: 2px;
          }
          >.addTime {
            font-weight: 700;
            font-size: 15px;
            text-indent: 2px;
            float: right;
            margin-right: 100px;
          }
          &:nth-child(even) {
            background: rgb(245, 247, 250);
          }
          &:hover {
            background: #EEEEEE;
          }
          >div {
            margin-top: 10px;
            height: 40px;
            line-height: 40px;
            display: inline-block;
          }
          .name {
            width: 300px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .time{
            width: 200px;
            float: right;
          }
        }
      }
    }
    .addproject{
      .return{
        button{
          margin-left: 20px;
        }
      }
      .operation {
        width: 200px;
        margin: 100px auto;
        button {
          margin-left: 40px;
          margin-top: 20px;
        }
      }
    }
  }
</style>

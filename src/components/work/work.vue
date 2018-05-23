<template>
	<div class="workWrapper">
		<div class="index">
			<div class="top">
				<div class="title">
					<span>{{nowCompanyName}}</span>
					<span class="changeCompany" @mouseover ="userIconOverLeft" @mouseout="userIconOutLeft">更换公司
					<ul v-show="userOperationLeftShow">
						<li v-for="(item,index) in companyList" @click="changeCompany(item,index)">{{item.company_name}}</li>
					</ul>
					<img src="../../assets/down.svg" @mouseover ="userIconOverLeft" @mouseout="userIconOutLeft" ref="userIconLeft"/>
				  </span>
				</div>
				<!--<div class="nav">-->
					<!--&lt;!&ndash;<div class="nav_main">&ndash;&gt;-->
						<!--&lt;!&ndash;<a v-for="(item,index) in typeArr" @click="changeType(item,index)">{{item.title}}</a>&ndash;&gt;-->
					<!--&lt;!&ndash;</div>&ndash;&gt;-->
				<!--</div>-->
				<!--<div class="search">-->
					<!--<input type="text" placeholder="暂不能使用" />-->
					<!--<img src="../../assets/find.svg" alt="" />-->
				<!--</div>-->
				<div class="personInfo">
					<div class="person_main">
						<a>{{user.name}}</a>
						<img src="../../assets/down.svg" alt="" @mouseover="userIconOver" @mouseout="userIconOut" ref="userIcon" />
						<div class="userOperation" v-show="userOperationShow" @mouseover="userIconOver" @mouseout="userIconOut">
							<li @click="change_status" style="list-style: none"><router-link to="" >个人设置</router-link></li>
							<!--<a>创建公司</a>-->
							<a @click="logOut">退出登录</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="work" v-show="workShow">
			<div class="side_left">
				<div class="info_wrapper">
					<a class="info">
						<img :src="user.avatar" />
						<span>{{user.name}}</span>
					</a>
				</div>
				<div class="work_wrapper">
					<ul>
						<li class="work_item" v-for="(item,index) in workList" @click="doList(item,index)">
							<router-link to="" :class="{'active' : index === workIndex}">
								<span class="content">{{item}}</span>
							</router-link>
						</li>
					</ul>
				</div>
			</div>
			<div class="info_main">
				<router-view @changeWorkIndex="changeWorkIndex" :workList="workList">

				</router-view>
			</div>
			<div class="side_right">
				<Date></Date>
			</div>
		</div>
    <div class="info" v-show="infoShow">
      <el-form :model="myInfo" :rules="rules2"  ref="myInfo" label-width="150px" class="demo-ruleForm"  >
        <div class="top">
          <el-button type="primary" size="small" @click="_reinfo">返回</el-button>
          <div>
            <croppa v-model="cros" :width="100" disable-click-to-choose   :height="100" placeholder="" :quality="2" :prevent-white-space="true">
              <img crossOrigin="anonymous" :src="this.linked" slot="initial">
            </croppa>
            <p @click="cros.chooseFile()">编辑图片</p>
          </div>
        </div>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="myInfo.name" placeholder="请输入您的名字"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="myInfo.idCard"  placeholder="请输入您的身份证号"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="工种" prop="type">
          <el-select v-model="myInfo.type" placeholder="请选择工种">
            <el-option-group v-for="group in work_type" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.wid" :label="item.type_name" :value="item.wid"></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="籍贯" prop="area">
          <el-select v-model="myInfo.area" placeholder="请选择籍贯">
            <el-option v-for="item in list" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工龄" prop="work_year">
          <el-select v-model="myInfo.work_year" placeholder="请选择工龄">
            <el-option v-for="(item,index) in kong" :label="item.label" :value="item.label" :key="index+1" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期望薪资" prop="salary">
          <el-input v-model="myInfo.salary" placeholder="请输入期望薪资"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="myInfo.qq" placeholder="请输入QQ号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="weChat">
          <el-input v-model="myInfo.weChat" placeholder="请输入微信号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付宝" prop="clipay">
          <el-input v-model="myInfo.clipay" placeholder="请输入支付宝"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="bank_card">
          <el-input v-model="myInfo.bank_card" placeholder="请输入银行卡号"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="bank_account">
          <el-input v-model="myInfo.bank_account"  placeholder="请输入银行卡开户行名称"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开户银行网点" prop="bank_point">
          <el-input v-model="myInfo.bank_point" placeholder="如：XX银行XX分行XX支行"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="暂住地址" prop="address">
          <el-input v-model="myInfo.address" placeholder="请输入您的暂住地址"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="个人评价" prop="self_evaluation">
          <el-input v-model="myInfo.self_evaluation" placeholder="请输入您对自己的评价"  auto-complete="off"></el-input>
        </el-form-item>
        <div class="card" style="width: 80%;margin: 0 auto">
          <croppa v-model="croe" :width="300" placeholder="上传身份证正面照" :height="140" :quality="2" :prevent-white-space="true">
            <img crossOrigin="anonymous" :src="this.pic_id" slot="initial">
          </croppa>
          <croppa v-model="crod" :width="300" :height="140" placeholder="上传暂住证照片" :quality="2" :prevent-white-space="true">
            <img crossOrigin="anonymous" :src="this.home_id" slot="initial">
          </croppa>
        </div>
      </el-form>
      <el-button type="warning" size="small" style="margin: 30px 0 0 30px" @click="twiter('myInfo')">保存</el-button>
    </div>
    <loading v-show="loadingShow"></loading>
	</div>
</template>
<script>
	import {getPic} from '@/common/js/pic.js'
	import { create_depart_list } from 'common/js/initial/depart.js'
	import { createPersonInfo } from 'common/js/person_info'
	import { mapMutations } from 'vuex'
	import Date from '@/base/date/date'
  import {getAvatar} from '@/common/js/avatar.js'
  import { getCro } from '@/common/js/crowd'
	import { prefixStyle } from '@/common/js/dom'
	const transform = prefixStyle('transform')
	const transitionDuration = prefixStyle('transitionDuration')
	import { mapGetters } from 'vuex'
  import crop from 'vue-core-image-upload'
  import loading from '@/base/loading/loading'
	export default {
		data() {
			return {
				examNav: ['日常', '审批'],
        workShow:true,
        infoShow:false,
				pStr: '',
        pic_id:'',
        home_id:'',
				currentIndex: 0,
				now_type_name: '日常',
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					}
				},
				pickerOptions1: {
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							picker.$emit('pick', new Date());
						}
					}, {
						text: '昨天',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit('pick', date);
						}
					}, {
						text: '一周前',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', date);
						}
					}]
				},
				typeArr: [{
						'title': '工作',
						'url': '/work'
					},
					{
						'title': '应用',
						'url': '/apply'
					}
				],
				value1: '',
				compamyShow: false,
				userOperationShow: false,
				userOperationLeftShow: false,
				ComPartPersonList: [],
				workList:[],
				workIndex:0,
        myInfo: {
          name: '',
          idCard: '',
          type:'',
          area:'',
          work_year:'',
          salary:'',
          qq:'',
          weChat:'',
          clipay:'',
          bank_card:'',
          bank_account:'',
          bank_point:'',
          address:'',
          self_evaluation:''
        },
        work_typies:[],
        rules2:{
				  name:[{
            required: true,
            message: '请填写您的名字',
            trigger: 'blur'
          }],
          idCard:[{
            required: true,
            message: '请填写您的身份证号',
            trigger: 'blur'
          },{
            pattern:/^\d{17}[\d|X]|\d{15}$/,
            message:'身份证号格式不正确'
          }],
          type:[{
            required: true,
            message: '请选择工种',
            trigger: 'change'
          }],
          area:[{
            required: true,
            message: '请选择籍贯',
            trigger: 'change'
          }],
          work_year:[{
            required: true,
            message: '请选择工龄',
            trigger: 'change'
          }],
        },
        work_type:[],
        province:["北京市","天津市","上海市","重庆市","河北省","山西省","辽宁省","吉林省","黑龙江省","江苏省","浙江省","安徽省","福建省","江西省","山东省","河南省","湖北省","湖南省","广东省","海南省","四川省","贵州省","云南省","陕西省","甘肃省","青海省","台湾省","内蒙古自治区","广西壮族自治区","西藏自治区","宁夏回族自治区","新疆维吾尔自治区","香港特别行政区","澳门特别行政区"],
        list:[],
        years:['1年','2年','3年','4年','5年','6年','7年','8年','9年','10年','10年以上'],
        kong:[],
        linked:'',
        cros:{},
        croe:{},
        crod:{},
        pic_hash:'',
        loadingShow:false,
        asd_hash:''
      }
		},
		methods: {
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
			logOut(){
				this.workIndex = 0
				this.userOperationShow = false
				localStorage.removeItem('nowCompanyId');
				localStorage.removeItem('nowCompanyName');
				localStorage.removeItem('personnelId');
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				this.$router.push({ path: '/login' })
				this.setUser('')
				this.setNowCompanyId('')
				this.setComPersonList('')
				this.setComPartPersonList('')
				this.setNowCompanyName('')
				this.setToken('')
				this.setUserState('')
				this.setCompanyList('')
				this.setUser('')
				this.setUser('')
			},
			judgeState() {
				let m = this.userState.manage
				let f = this.userState.finance
				if(m === 0 && f === 0) {
					this.workList = ['处理审批', '发起审批','创建公司', '工作记录','通讯录','工人列表','工程列表','我发布的','我发出的合同','我收到的合同','我的作品','我的收藏','消息提醒']
				}
				if(m === 1 && f === 0) {
					this.workList = ['处理审批', '发起审批', '公司管理', '创建公司', '权限管理', '邀请同事', '工作记录', '通讯录','工人列表','工程列表','我发布的','我发出的合同','我收到的合同','我的作品','我的收藏','消息提醒']
				}
				if(m === 0 && f === 1) {
					this.workList = ['处理审批', '发起审批', '表单回执','创建公司', '邀请同事', '工作记录', '通讯录','工人列表','工程列表','我发布的','我发出的合同','我收到的合同','我的作品','我的收藏','消息提醒']
				}
				if(m === 1 && f === 1) {
					this.workList = ['处理审批', '发起审批', '公司管理', '创建公司', '权限管理', '表单回执', '工作记录', '邀请同事', '通讯录','工人列表','工程列表','我发布的','我发出的合同','我收到的合同','我的作品','我的收藏','消息提醒']
				}
			},
			changeWorkIndex(num){
				this.workIndex = num
			},
			userIconOver() {
				this.$refs.userIcon.style.transition = 'all 0.4s'
				this.$refs.userIcon.style[transform] = `rotate(180deg)`
				this.userOperationShow = true
			},
			userIconOut() {
				this.$refs.userIcon.style.transition = 'all 0.4s'
				this.$refs.userIcon.style[transform] = `rotate(360deg)`
				this.userOperationShow = false
			},
			userIconOverLeft() {
				this.$refs.userIconLeft.style.transition = 'all 0.4s'
				this.$refs.userIconLeft.style[transform] = `rotate(180deg)`
				this.userOperationLeftShow = true
			},
			userIconOutLeft() {
				this.$refs.userIconLeft.style.transition = 'all 0.4s'
				this.$refs.userIconLeft.style[transform] = `rotate(360deg)`
				this.userOperationLeftShow = false
			},
			changeCompany(item, index) {
				this.workIndex = 0
				this.setNowCompanyName(item.company_name)
				this.userOperationLeftShow = false
				this.setNowCompanyId(item.company_id)
				localStorage.nowCompanyId = JSON.stringify(item.company_id);
				localStorage.nowCompanyName = JSON.stringify(item.company_name);
				this.$router.push('/work');
			},
			doList(item, index) {
				this.workIndex = index
				this.now_type_name = item
				switch(item) {
					case '公司管理':
						this._getComPartPersonList()
						this.$router.push({ path: '/work/manageCompany' })
						break;
					case '权限管理':
						this.$router.push({ path: '/work/jurisdictionManage' })
						break
					case '表单回执':
						this.$router.push({ path: '/work/formReceipt' })
						break;
					case '通讯录':
						this._getComPersonList()
						this.$router.push({ path: '/work/addressBook' })
						break;
					case '发起审批':
						this._getComPersonList()
						this._getComDepart()
						this.$router.push({ path: '/work/addApproval' })
						break;
					case '邀请同事':
						this._getComDepart()
						this.$router.push({ path: '/work/inviteCol' })
						break;
					case '处理审批':
						this.$router.push({ path: '/work/exam' })
						break;
          case '创建公司':
            this.$router.push({ path: '/work/create_company'})
            break;
          case '工作记录':
            this.$router.push({ path:'/work/record'})
            break;
          case '工人列表':
            this.$router.push({path:'/work/list'})
            break;
          case '工程列表':
            this.$router.push({path:'/work/nearWork'})
            break;
          case '我发布的':
            this.$router.push({path:'/work/release'})
            break;
          case '我发出的合同':
            this.$router.push({path:'/work/issue'})
            break;
          case '我收到的合同':
            this.$router.push({path:'/work/rece'})
            break;
          case '我的作品':
            this.$router.push({path:'/work/opus'})
            break;
          case '我的收藏':
            this.$router.push({path:'/work/collect'})
            break;
          case '消息提醒':
            this.$router.push({path:'/work/infos'})
            break;
				}
			},
			_getUserState() {
				let param = new URLSearchParams();
				param.append("company_id", this.nowCompanyId);
				param.append("uid", this.user.uid);
				this.$http.post("/index.php/Mobile/User/return_company_new", param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
						this.setUserState({
							'manage': parseInt(res.data.data.is_manage),
							'finance': parseInt(res.data.data.is_finance),
						})
						this.judgeState()
					})
			},
			_getToken(uid) {
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				this.$http.post("/index.php/Mobile/path/get_token", nparam)
					.then((res) => {
						this.setToken(res.data.data)
					})
			},
			_getComPartPersonList() {
				let param = new URLSearchParams();
				param.append("company_id", this.nowCompanyId);
				this.$http.post("/index.php/Mobile/user/get_department_lest", param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
						let resData = res.data.data
						for(let j = 0, len = resData.length; j < len; j++) {
							if(this.numOne >= len) {
								return
							}
							let obj = {}
							this.$set(obj, 'department_name', resData[j].department_name)
							let newparam = new URLSearchParams();
							newparam.append("company_id", this.nowCompanyId);
							newparam.append("department_id", resData[j].department_id);
							this.$http.post("/index.php/Mobile/user/get_company_personnel", newparam)
								.then((res) => {
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
			_getComDepart() {
				let param = new URLSearchParams();
				param.append("company_id", this.nowCompanyId);
				this.$http.post("/index.php/Mobile/user/get_department_lest", param)
					.then((res) => {
					  var current = this
            var judge = res.data.code
            getCro(judge,current)
						let arr = []
						res.data.data.forEach((item) => {
							arr.push(create_depart_list(item))
						})
						this.setComDepartList(arr)
					})
			},
			_getUserCompanyList() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				this.$http.post("/index.php/Mobile/user/companies_list", param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
						this.setNowCompanyId(res.data.data[0].company_id)
						this.setCompanyList(res.data.data)
						this.setNowCompanyName(res.data.data[0].company_name)
						this._getUserState()
					})
			},
			_getComPersonList() {
				let newparam = new URLSearchParams();
				newparam.append("company_id", this.nowCompanyId);
				this.$http.post("/index.php/Mobile/user/get_company_personnel", newparam)
					.then((res) => {
						let reaDa = []
						res.data.data.forEach((item) => {
							item.avatar = getPic(item.avatar)
							reaDa.push(item)
						})
						this.setComPersonList(reaDa)
					})
			},
      change_status(){
        // this.$message.error('功能尚未完善')
        this.workShow = false
        this.infoShow = true
        this._inited()
      },
      _inited(){
        let param = new URLSearchParams()
        param.append('phone',this.user.phone)
        this.$http.post('/index.php/Mobile/worker/get_info_phone',param)
          .then((res)=>{
            let arr = res.data.data
            this.linked = 'http://bbsf-file.hzxb.net/'+arr.avatar
            this.myInfo.name = arr.name
            this.myInfo.idCard = arr.idcard
            this.myInfo.type = arr.type_id
            this.myInfo.area = arr.hometown
            this.myInfo.work_year = arr.work_years
            this.myInfo.salary = arr.salary
            this.myInfo.qq = arr.qq
            this.myInfo.weChat = arr.wechat
            this.myInfo.address = arr.address
            this.myInfo.clipay = arr.clipay
            this.myInfo.bank_card = arr.bank_card
            this.myInfo.self_evaluation = arr.self_evaluation
            this.myInfo.bank_point = arr.bank_address
            this.myInfo.bank_account = arr.bank_name
            arr.idcard_p = 'http://bbsf-file.hzxb.net/'+arr.idcard_p
            this.pic_id = arr.idcard_p
            this.home_id = 'http://bbsf-file.hzxb.net/' + arr.idcard_n
          })
      },
      _getType(){
        this.$http.post('/index.php/Mobile/find/worker_type_list')
          .then((res)=>{
            var obj1 = new Object()
            obj1.label = '工人类'
            obj1.options = res.data.data.no_manage
            var obj2 = new Object()
            obj2.label = '管理类'
            obj2.options = res.data.data.is_manage
            this.work_type.push(obj1,obj2)
          })
        this.list = this.province.map(item=>{
          return { value: item, label: item };
        })
        this.kong = this.years.map(item=>{
          return { value: item, label: item };
        })
      },
      _reinfo(){
        this.workShow = true
        this.infoShow = false
        this.linked = ''
        this.myInfo.name = ''
        this.myInfo.type = ''
        this.myInfo.area = ''
        this.myInfo.work_year = ''
        this.myInfo.salary = ''
        this.myInfo.qq = ''
        this.myInfo.weChat = ''
        this.myInfo.address = ''
        this.myInfo.clipay = ''
        this.myInfo.bank_card = ''
        this.myInfo.self_evaluation = ''
        this.myInfo.bank_point = ''
        this.myInfo.bank_account = ''
        this.pic_id = ''
        this.home_id = ''
      },
      upload(){
        this.cros.generateBlob((blob)=>{
          let formData = new FormData();
          formData.append('file', blob);
          formData.append('token', this.token);
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
            this.pic_hash.push(res.data.hash)
            console.log(JSON.stringify(this.pic_hash))
            let param = new URLSearchParams()
            param.append('uid',this.user.uid)
            param.append('picture',JSON.stringify(this.pic_hash))
            this.$http.post('/index.php/Mobile/approval/upload_enclosure_new',param)
              .then((res)=>{
                console.log(res)
              })
          })
        })
      },
      twiter(formName){
        if (!this.cros.hasImage()) {
          this.$message.error('请传入头像')
          return
        }
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.submit()
            this.loadingShow = true
          } else {
            this.$message.error('请将表单填写完整');
            return false;
          }
        })
      },
      submit(){
        this.cros.generateBlob((blob)=>{
          let formData = new FormData();
          formData.append('file', blob);
          formData.append('token', this.token);
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          this.$http.post('https://up.qbox.me/',formData,config)
            .then((res)=>{
              this.Id_hash()
              setTimeout(()=>{
                let param = new URLSearchParams()
                param.append('avatar',res.data.hash)
                param.append('name',this.myInfo.name)
                param.append('uid',this.user.uid)
                param.append('idcard',this.myInfo.idCard)
                param.append('qq',this.myInfo.qq)
                param.append('work_years',this.myInfo.work_year)
                param.append('wechat',this.myInfo.weChat)
                param.append('work_type',this.myInfo.type)
                param.append('salary',this.myInfo.salary)
                param.append('clipay',this.myInfo.clipay)
                param.append('bank_card',this.myInfo.bank_card)
                param.append('address',this.myInfo.address)
                param.append('hometown',this.myInfo.area)
                param.append('self_evaluation',this.myInfo.self_evaluation)
                param.append('bank_address',this.myInfo.bank_point)
                param.append('bank_name',this.myInfo.bank_account)
                param.append('idcard_p',this.pic_hash)
                param.append('idcard_n',this.asd_hash)
                this.$http.post('/index.php/Mobile/User/update_user_info_new',param)
                  .then((res)=>{
                    if(res.data.code == 0){
                      this.loadingShow = false
                      this.$message({
                        type:'success',
                        message:'修改成功'
                      })
                      this.workShow = true
                      this.infoShow = false
                      let avatar = getAvatar(res.data.data.avatar)
                      this.setUser({
                        'uid':res.data.data.uid,
                        'name':res.data.data.name,
                        'avatar':avatar,
                        'phone':res.data.data.phone
                      })
                      localStorage.user = JSON.stringify(this.user);
                    }else{
                      this.loadingShow = false
                      this.$message({
                        type:'success',
                        message:'修改失败'
                      })
                    }
                  })
              },2000)
            })
        })
      },
      Id_hash(){
        if(this.croe.hasImage()){
          this.croe.generateBlob((blob)=>{
            let formData = new FormData();
            formData.append('file', blob);
            formData.append('token', this.token);
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            this.$http.post('https://up.qbox.me/',formData,config)
              .then((res)=>{
                this.pic_hash = res.data.hash
              })
          })
        }
        if(this.crod.hasImage()){
          this.crod.generateBlob((blob)=>{
            let formData = new FormData();
            formData.append('file', blob);
            formData.append('token', this.token);
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            this.$http.post('https://up.qbox.me/',formData,config)
              .then((res)=>{
                this.asd_hash = res.data.hash
              })
          })
        }
      }
		},
		computed: {
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
		components: {
			Date,
      crop,
      loading
		},
		mounted() {
      this._getType()
    },
		created() {
			this.setUser(JSON.parse(localStorage.user))
			this._getUserCompanyList(this.user.uid)
			this._getComDepart()
			this.setNowCompanyId(JSON.parse(localStorage.nowCompanyId))
			this.setNowCompanyName(JSON.parse(localStorage.nowCompanyName))
			this._getToken()
			this._getUserState()
		},
		watch: {
			nowCompanyId() {
				this.compamyShow = false
				this._getUserState()
				this._getToken()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.workWrapper {
		width: 100%;
		height: 100%;
		background: rgb(227, 228, 233);
    padding-bottom: 50px;
		.index {
			.top {
				width: 100%;
				background: #f4f6fc;
				display: flex;
				color: #666666;
				height: 60px;
				font-size: 14px;
				text-decoration: none;
				box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				.title {
					flex: 1;
					align-self: center;
					span {
						display: inline-block;
						float: left;
						margin-left: 40px;
						&.changeCompany {
							margin-left: 10px;
							font-size: 12px;
							color: #67C23A;
							cursor: pointer;
							margin-top: 1px;
							position: absolute;
							ul {
								min-width: 100px;
								position: absolute;
								top: 15px;
								left: 0px;
								background: #f4f6fc;
								padding: 10px 0;
								border-radius: 2px;
								box-shadow: 0 0 2px rgba(0, 0, 0, .2);
								z-index: 2;
								li {
									display: block;
									padding: 10px 6px;
									color: #666666;
									&:hover {
										color: #F09835;
									}
								}
							}
							img {
								width: 20px;
								height: 20px;
								position: absolute;
								top: -4px;
								left: 50px;
								cursor: pointer;
							}
						}
					}
				}
				.nav {
					flex: 0 20%;
					align-self: center;
					a {
						display: inline-block;
						border-bottom: 3px solid transparent;
						padding: 22px 10px 20px;
						color: #666666;
						cursor: pointer;
						&.active {
							border-bottom: 3px solid #fc923f;
						}
						&:hover {
							color: #FC923F;
						}
					}
				}
				.search {
					flex: 0 20%;
					align-self: center;
					position: relative;
					input {
						float: right;
						border: 1px solid #ccc;
						padding: 12px 100px;
						border-radius: 3px;
						/*css3属性IE不支持*/
						padding-left: 5px;
						text-indent: 10px;
						outline: none;
					}
					img {
						width: 16px;
						height: 16px;
						position: absolute;
						top: 12px;
						right: 20px;
						cursor: pointer;
					}
				}
				.personInfo {
					flex: 1;
					align-self: center;
					.person_main {
						position: relative;
						float: right;
						margin-right: 40px;
						.userOperation {
							position: absolute;
							top: 20px;
							right: 0px;
							width: 84px;
							padding: 10px 0;
							background: #FFF;
							border-radius: 2px;
							box-shadow: 0 0 2px rgba(0, 0, 0, .2);
							line-height: 27px;
							z-index: 2;
							a {
								display: block;
								height: 26px;
								line-height: 26px;
								padding: 0 15px;
								color: #333;
								font-size: 13px;
								&:hover {
									color: #3487E2;
								}
							}
						}
						a {
							cursor: pointer;
							display: inline-block;
							height: 20px;
							line-height: 20px;
						}
						img {
							width: 20px;
							vertical-align: top;
							cursor: pointer;
						}
					}
				}
			}
		}
		.work {
			margin-top: 5px;
			display: flex;
			justify-content:center;
			align-items:flex-start;
			>.info_main {
				width: 600px;
				margin: 0 10px;
			}
			>.side_left {
				width: 180px;
				background: #fff;
				padding: 20px;
				border-radius: 2px;
				box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				>.work_wrapper {
					padding: 7px 0;
					border-bottom: 1px solid #EEE;
					>ul {
						>.work_item {
							position: relative;
							color: #3e5685;
							font-size: 13px;
							line-height: 28px;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							font-size: 15px;
							>a {
								color: #4D6595;
								width: 100%;
								display: inline-block;
								&:hover {
									color: #199475;
								}
								&.active {
									color: #199475;
								}
							}
						}
					}
				}
				.department_wtapper {
					font-size: 13px;
					width: 180px;
					border-top: none;
					-webkit-border-bottom-left-radius: 2px;
					border-bottom-left-radius: 2px;
					-webkit-border-bottom-right-radius: 2px;
					border-bottom-right-radius: 2px;
					position: relative;
					>.title {
						color: #999;
						height: 28px;
						line-height: 28px;
						padding-top: 7px;
					}
					>a {
						position: relative;
						color: #3e5685;
						font-size: 13px;
						height: 28px;
						line-height: 28px;
					}
				}
				>.info_wrapper {
					padding-bottom: 20px;
					border-bottom: 1px solid #EEE;
					>.info {
						>img {
							width: 55px;
							height: 55px;
							margin-right: 20px;
							float: left;
							-moz-border-radius: 5px;
							-webkit-border-radius: 5px;
							border-radius: 5px;
						}
						>span {
							display: inline-block;
							font-size: 16px;
							color: #333;
							height: 55px;
							line-height: 55px;
							width: 105px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							vertical-align: middle;
						}
					}
				}
			}
			>.side_right {
				width: 310px;
			}
		}
		.el-input--prefix .el-input__inner {
			padding-left: 0px;
		}
		.el-input--suffix .el-input__inner {
			padding-right: 0px;
		}
		.el-icon-date:before {
			content: "";
		}
		.el-date-editor.el-input,
		.el-date-editor.el-input__inner {
			width: 150px;
		}
		.el-input {
			position: relative;
			font-size: 12px;
			display: inline-block;
			width: 100%;
			right: 14px;
		}
	}
  .info{
    width: 800px;
    overflow: hidden;
    margin: 0 auto;
    background: #FFf;
    padding-bottom: 50px;
    .top{
      width: 100px;
      margin: 0 auto;
      position: relative;
      .el-button{
        position: absolute;
        top: 10px;
        left: -340px;
      }
      img{
        margin: 20px 20px 10px 25px;
        display: inline-block;
      }
      p{
        font-size: 12px;
        color: #A3D7FF;
        text-align: center;
        padding-bottom: 10px;
        cursor: pointer;
        position: relative;
        input{
          outline: none;
          position: absolute;
          opacity: 0;
          top: -5px;
          left: 0;
          cursor: pointer;
        }
      }
    }
    .el-form-item{
      .el-input{
        width: 90%;
        float: right;
      }
      .el-select{
        width: 90%;
        float: right;
        right: 14px;
      }
    }
  }
  .card{
    display: flex;
    justify-content:center;
    div{
      margin: 0 10px;
    }
  }
</style>

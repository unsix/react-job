<template>
	<div class="login-wrapper">
		<div class="log">

		</div>
      <div class="choose" v-show="isD">
        <div class="btn">
          <el-button @click="aShow" type="primary">我是工人</el-button>
          <el-button @click="aFalse" type="success">我是雇主</el-button>
        </div>
      </div>
		  <div class="login" v-show="isA">
				<div class="title">
					<span style="line-height: 40px">请登录</span>
          <el-button type="info" @click="_onre" size="small" style="font-size: 13px;float: right;margin-top: 5px">返回</el-button>
				</div>
				<div class="signIn">
					<div class="username">
						<input type="text" name="phone" placeholder="请输入账号"  v-model.trim="account_num"/>
					</div>
					<div class="password">
						<input type="password" placeholder="请输入密码" v-model.trim="password_num"  @keyup.enter="login"/>
					</div>
					<div class="error" v-show="errorShow">
						<span>账号或密码错误</span>
					</div>
					<div class="submit">
						<a @click="login">登录<i class="el-icon-loading" v-show="loadingShow"></i></a>
					</div>
				</div>
				<div class="forget">
					<span @click="_forget">忘记密码?</span>
					<span @click="_register">注册账号</span>
				</div>
			</div>
      <div class="forget_pass" v-show="isB">
        <div class="title">
          <el-button @click="_return" type="success">返回</el-button>
        </div>
        <div class="keyboard">
          <div class="phone">
            <input type="tel" @change="checkTel(sender)" v-model="sender" name="phone" placeholder="请输入账号" />
          </div>
          <div class="pass">
            <input type="text" placeholder="请输入验证码" v-model="code" @keyup.enter="resetCode"/>
            <el-button type="primary" @click="getCode" v-show="codeShow">获取验证码</el-button>
            <el-button type="info" v-show="!codeShow">{{sec}}s</el-button>
          </div>
          <div class="true">
            <el-button type="warning" @click="resetCode">确定</el-button>
          </div>
        </div>
      </div>

      <div class="register" v-show="isC">
        <div class="title">
          <el-button @click="_return" type="success">返回</el-button>
        </div>
        <el-form :rules="sterRule" ref="ster_ruleForm" :model="ster_ruleForm">
          <el-form-item prop="phone">
            <el-input placeholder="请输入手机号" type="tel" v-model="ster_ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item class="pass">
            <input type="text" class="el-input__inner node" placeholder="请输入验证码" v-model="ster_ruleForm.code_a"/>
            <el-button type="primary" @click="getCodeSter" v-show="codeShow">获取验证码</el-button>
            <el-button type="info" v-show="!codeShow">{{sec}}s</el-button>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码" type="password" v-model="ster_ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item prop="check_password">
            <el-input placeholder="请再次输入" type="password" @keyup.enter="_ster" v-model="ster_ruleForm.check_password"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button type="info" @click="_ster">确定</el-button>
        </div>
      </div>

      <loading v-show="loadingShow"></loading>
      <div class="reset" v-show="resetPassShow">
        <el-form :rules="resetRule" ref="res_ruleForm" :model="res_ruleForm">
          <el-form-item prop="password">
            <el-input placeholder="请输入新密码"  type="password" v-model="res_ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item prop="check_password">
            <el-input placeholder="请再次输入" type="password" @keyup.enter="_reset" v-model="res_ruleForm.check_password"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button type="success" @click="_reset">确定</el-button>
        </div>
        <span style="width: 70%;display: block;font-size: 12px!important;text-align: center;margin: 10px auto;">以字母开头，长度在6~18之间，只能包含字符、数字和下划线</span>
      </div>
		<uncreatedCompany v-show="uncreatedCompanyShow"></uncreatedCompany>
	</div>
</template>

<script>
	import {create_depart_list} from 'common/js/initial/depart.js'
	import {createPersonInfo} from 'common/js/person_info'
	import uncreatedCompany from '@/base/uncreated_company/uncreated_company'
	import {mapMutations,mapGetters} from 'vuex'
	import {getPic} from '@/common/js/pic.js'
	import {getAvatar} from '@/common/js/avatar.js'
	import md5 from 'js-md5';
  import loading from '@/base/loading/loading'
	export default{
		data(){
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.res_ruleForm.check_password !== '') {
            this.$refs.res_ruleForm.validateField('check_password');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.res_ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validatePass3 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ster_ruleForm.check_password !== '') {
            this.$refs.ster_ruleForm.validateField('check_password');
          }
          callback();
        }
      };
      var validatePass4 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ster_ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
			return{
				isA:false,
				isB:false,
        isC:false,
        isD:true,
				account_num:'',
				password_num:'',
				uncreatedCompanyShow:false,
				errorShow:false,
				loadingShow:false,
				ComPartPersonList:[],
				numOne:0,
        codeShow:true,
        timer:null,
        sec:'',
        sender:'',
        code:'',
        resetPassShow:false,
        str : '',
        loadingShow:false,
        res_ruleForm:{
          password: '',
          check_password: ''
        },
        resetRule:{
          password: [
            { validator: validatePass, trigger: 'blur',},
            { pattern:/^[a-zA-Z0-9]\w{5,17}$/,message:'密码格式不正确'}
          ],
          check_password: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        ster_ruleForm:{
				  type:'1',
				  phone:'',
          password: '',
          check_password: '',
          code_a:''
        },
        sterRule:{
				  phone:[
            { pattern:/^[1][3,4,5,7,8][0-9]{9}$/,message:'手机号码格式不正确',trigger: 'blur'}
          ],
          password: [
            { validator: validatePass3, trigger: 'blur',},
            { pattern:/^[a-zA-Z0-9]\w{5,17}$/,message:'密码格式不正确'}
          ],
          check_password: [
            { validator: validatePass4, trigger: 'blur' }
          ]
        },
        perType:''
			}
		},
		computed:{
			...mapGetters([
				'nowCompanyId',
				'user'
			]),
			phone_num(){
				if(this.account_num.length !== 11){
					return true
				}else{
					return false
				}
			}
		},
		created(){
			if(JSON.parse(localStorage.user).uid){
				this.setUser(JSON.parse(localStorage.user))
				this._getUserCompanyList(this.user.uid)
				this._getComDepart()
				this.$router.push({ path: '/work' })
			}
		},
		methods:{
      _return(){
				this.isA = true
				this.isB = false
        this.isC = false
			},
      _register(){
        this.isA = false
        this.isC = true
      },
      _forget(){
				this.isA = false
				this.isB = true
			},
      _reset(){
        if(this.res_ruleForm.password != this.res_ruleForm.check_password){
          this.$message.error('两次密码输入不一致')
          return
        }
        var re = /^[a-zA-Z0-9]\w{5,17}$/
        if(!re.test(this.res_ruleForm.password)){
          this.$message.error('密码格式不正确')
          return
        }
        if(!re.test(this.res_ruleForm.check_password)){
          this.$message.error('密码格式不正确')
          return
        }
        this.loadingShow = true
        let password = md5(this.res_ruleForm.password)
        let check = md5(this.res_ruleForm.check_password)
        let nparam = new URLSearchParams()
        nparam.append('phone',this.sender)
        nparam.append('password',password)
        nparam.append('check_password',check)
        this.$http.post("/index.php/Mobile/skey/setPassword",nparam)
          .then((res)=>{
            if(res.data.code === 0 ){
              this.$message({
                showClose: true,
                message: '修改成功',
                type:'success'
              })
              this.loadingShow = false
              this.isA = true
              this.isB = false
              this.resetPassShow = false
            }
          })
      },
      getCode(){
        if(this.sender === ''){
          this.$message.error('请输入账号');
          return
        }
        const TIME_COUNT = 60;
        if(!this.timer){
          this.sec = TIME_COUNT
          this.codeShow = false
          this.timer = setInterval(()=>{
            if(this.sec>0 && this.sec<= TIME_COUNT){
              this.sec--
            }else{
              this.codeShow = true
              clearInterval(this.timer)
              this.timer = null
            }
          },1000)
        }
        let nparam = new URLSearchParams()
        nparam.append("sender",this.sender)
        this.$http.post('/index.php/Mobile/skey/sendValidate',nparam)
          .then((res)=>{
            if(res.data.code === 0){
              this.$message({
                showClose: true,
                message: '验证码已发送,请注意查收',
                type: 'success'
              })
            }else if(res.data.code = -5){
              this.$message({
                showClose: true,
                message: '此用户未注册',
                type: 'warning'
              })
            }
            this.str = res.data.data.code
          })
      },
      checkTel(data){
        var re = /^[1][3,4,5,7,8][0-9]{9}$/
        if(!re.test(data)) {
          this.$message({
            showClose: true,
            message: '手机号码格式错误',
            type: 'error'
          })
          this.sender = "";
        }
      },
      getCodeSter(){
        if(this.ster_ruleForm.phone === ''){
          this.$message.error('请输入账号');
          return
        }
        const TIME_COUNT = 60;
        if(!this.timer){
          this.sec = TIME_COUNT
          this.codeShow = false
          this.timer = setInterval(()=>{
            if(this.sec>0 && this.sec<= TIME_COUNT){
              this.sec--
            }else{
              this.codeShow = true
              clearInterval(this.timer)
              this.timer = null
            }
          },1000)
        }
        let mparam = new URLSearchParams()
        mparam.append('sender',this.ster_ruleForm.phone)
        this.$http.post('/index.php/Mobile/skey/send_validate_code',mparam)
          .then((res)=>{
            if(res.data.code === 0){
              this.$message({
                showClose: true,
                message: '验证码已发送,请注意查收',
                type: 'success'
              })
            }else if(res.data.code === 2){
              this.$message({
                showClose: true,
                message: '此用户已注册',
                type: 'warning'
              })
            }
            this.str = res.data.data.code
          })
      },
      _ster(){
        if(this.ster_ruleForm.phone === ''||this.ster_ruleForm.password === ''||this.ster_ruleForm.check_password === ''){
          this.$message.error('请将表单填写完整');
          return
        }
        if(this.ster_ruleForm.password != this.ster_ruleForm.check_password){
          this.$message.error('两次密码输入不一致')
          return
          this.ster_ruleForm.password = ''
          this.ster_ruleForm.check_password = ''
        }
        var re = /^[a-zA-Z0-9]\w{5,17}$/
        if(!re.test(this.ster_ruleForm.password)){
          this.$message.error('密码格式不正确')
          return
        }
        if(!re.test(this.ster_ruleForm.check_password)){
          this.$message.error('密码格式不正确')
          return
        }
        if(this.ster_ruleForm.code_a == this.str){
          let password = md5(this.ster_ruleForm.password)
          let check = md5(this.ster_ruleForm.check_password)
          let param = new URLSearchParams()
          param.append('type',this.ster_ruleForm.type)
          param.append('phone',this.ster_ruleForm.phone)
          console.log(this.ster_ruleForm.phone)
          param.append('password',password)
          param.append('check_password',check)
          this.$http.post('/index.php/Mobile/skey/register',param)
            .then((res)=>{
              console.log(res)
              if(res.data.code === 0){
                this.$message({
                  showClose: true,
                  message: '恭喜你 注册成功',
                  type: 'success'
                })
              }else if(res.data.code == 1){
                this.$message({
                  showClose: true,
                  message: "用户已注册",
                  type: 'error'
                })
              }
              this.ster_ruleForm.code_a = ''
              this.ster_ruleForm.password = ''
              this.ster_ruleForm.check_password = ''
              this.ster_ruleForm.phone = ''
              this.isC = false
              this.isA = true
            })
        }else{
          this.$message({
            showClose: true,
            message: '填写的验证码不正确，请重新输入',
            type: 'warning'
          })
          this.ster_ruleForm.code_a = ''
        }
      },
      resetCode(){
        if(this.sender === ''){
          this.$message.error('请填写账号');
          return
        }
        if(this.code === ''){
          this.$message.error('请填写验证码');
          return
        }
        if(this.code == this.str){
          this.isA = false
          this.isB = false
          this.resetPassShow = true
        }else{
          this.$message({
            showClose: true,
            message: '填写的验证码不正确，请重新输入',
            type: 'warning'
          })
          this.code = ''
        }
      },
			login(){
				if(this.account_num === ''){
					  this.$message.error('请填写账号');
					  return
				}
				if(this.password_num === ''){
					  this.$message.error('请填写密码');
					  return
				}
				let password_num = md5(this.password_num)
				let param = new URLSearchParams();
			    param.append("phone",this.account_num );
			    param.append("password",password_num);
			    param.append("phone_type",'web');
			    this.$http.post("/index.php/Mobile/skey/login",param)
			    .then((res)=>{
					if(res.data.code === 0){
						let avatar = getAvatar(res.data.data.avatar)
						this.setUser({
							'uid':res.data.data.uid,
							'name':res.data.data.name,
							'avatar':avatar,
              'phone':this.account_num
						})
						localStorage.user = JSON.stringify(this.user);
						this._getUserCompanyList(res.data.data.uid)
						this._getComDepart()
						this.loadingShow=true
						setTimeout(()=>{
							this.$router.push('/work');
							this.isA = false
              this.isD = true
							this.loadingShow=false
							this.account_num = ''
				 			this.password_num = ''
						},1000)

					}else{
						 this.$message.error(res.data.message);
					}
			    })
			},
			_getUserState(){
				let param = new URLSearchParams();
				param.append("company_id",this.nowCompanyId);
				param.append("uid",this.user.uid);
			    this.$http.post("/index.php/Mobile/User/return_company_new",param)
			    .then((res)=>{
			    	let is_manage = parseInt(res.data.data.is_manage)
			    	let is_finance = parseInt(res.data.data.is_finance)
			    	this.setUserState({
						'manage':is_manage,
						'finance':is_finance,
					})
        })
			},
			_getComDepart(){
				let param = new URLSearchParams();
				param.append("company_id",this.nowCompanyId);
			    this.$http.post("/index.php/Mobile/user/get_department_lest",param)
			    .then((res)=>{
			    	let arr=[]
			    	res.data.data.forEach((item)=>{
			    		arr.push(create_depart_list(item))
			    	})
			    })
			},
      aShow(){
        this.isA = true
        this.isD = false
      },
      aFalse(){
        this.isA = true
        this.isD = false
      },
      _onre(){
        this.isA = false
        this.isD = true
      },
      //获取创建的公司
			_getUserCompanyList(uid){
				let param = new URLSearchParams();
				param.append("uid",uid);
				this.$http.post("/index.php/Mobile/user/companies_list",param)
				.then((res)=>{
					this.setCompanyList(res.data.data)
					this.setNowCompanyId(res.data.data[0].company_id)
					this.setNowCompanyName(res.data.data[0].company_name)
					localStorage.nowCompanyId = JSON.stringify(res.data.data[0].company_id);
					localStorage.nowCompanyName = JSON.stringify(res.data.data[0].company_name);
					localStorage.personnelId = JSON.stringify(res.data.data[0].personnel_id);
					this._getUserState()
				})
			},
			...mapMutations({
				setUser: 'SET_USER',
				setNowCompanyId: 'SET_NOWCOMPANY_ID',
				setNowCompanyName: 'SET_NOWCOMPANY_NAME',
				setComDepartList: 'SET_COM_DEPART_LIST',
				setUserState: 'SET_USERSTATE',
				setCompanyList: 'SET_COMPANYLIST'
			})
		},
		components:{
			uncreatedCompany,
      loading
		}
	}
</script>

<style lang="scss" scoped>
$color1:#f4f6fc;
$color2:#cfd8f5;
$color3:#409EFF;
	.login-wrapper {
		position: fixed;
		top: 0px;
		right: 0px;
		width: 100%;
		height: 100%;
		background: url(../../assets/banner.jpg) no-repeat;
		background-size: 100% 100%;
		.log {
			width: 100%;
			height: 100%;
			background: rgba(255, 255, 255, 0.5);
		}
		.login {
			position: absolute;
			left: 50%;
			top: 50%;
			-webkit-transform: translateX(-50%) translateY(-50%);
			-moz-transform: translateX(-50%) translateY(-50%);
			-ms-transform: translateX(-50%) translateY(-50%);
			-o-transform: translateX(-50%) translateY(-50%);
			transform: translateX(-50%) translateY(-50%);
			width: 380px;
			height: 240px;
			background:rgba(222,228,247,0.8);
			box-shadow: 0 0 0 4px rgb(222,228,247);
			-moz-box-shadow: 10px 10px 5px #888888; /* 老的 Firefox */
			box-shadow: 3px 3px 5px rgba(195,188,207,0.7);
			.title{
				width: 70%;
				margin: 0 auto;
        padding-bottom: 10px;
				font-size: 13px;
				color: #878D99;
				cursor: default;
			}
			.forget{
				width: 70%;
				margin: 0 auto;
				font-size: 13px;
				color: #878D99;
				display: flex;
				span{
					flex: 1;
					cursor:pointer;
					&:hover{
						color: #2D2F33;
					}
					&:first-child{
						text-align: left;
					}
					&:last-child{
						text-align: right;
					}

				}
			}
			.signIn {
				width: 70%;
				margin: 0px auto;
				.username {
					span {
						display: block;
						color: red;
						font-size: 14px;
						text-indent: 6px;
						width: 100%;
					}
				}
				input {
					width: 100%;
					height: 34px;
					border: 1px solid #94aac7;
					outline: none;
					margin-bottom: 20px;
					-moz-border-radius: 4px;
					-webkit-border-radius: 4px;
					border-radius: 4px;
					text-indent: 10px;
				}
				.submit {
					width: 100%;
					a {
						position: relative;
						margin-bottom: 20px;
						display: inline-block;
						width: 100%;
						height: 34px;
						color: #fff;
						line-height: 34px;
						background: #9791a1;
						text-align: center;
						cursor: pointer;
						-webkit-border-radius: 4px;
						-moz-border-radius: 4px;
						border-radius: 4px;

						&:hover {
							background: #9293a7;
						}
					}
					i{
						position: absolute;
						left: 160px;
						top: 10px;
						font-size: 16px;
						display: inline-block;
					}
				}
				.error {
					span {
						display: block;
						width: 100%;
						text-align: center;
						margin-top: 10px;
						color: #FA5555;
						font-size: 12px;
					}
				}
			}
			.nav {
				width: 100%;
				a {
					display: inline-block;
					cursor: pointer;
					width: 50%;
					float: left;
					padding: 20px 0;
					text-align: center;
					&.active {
						background: $color3;
						color: #fff;
					}
				}
			}
		}
    .forget_pass{
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -180px;
      margin-top: -120px;
      width: 380px;
      height: 240px;
      background:rgba(222,228,247,0.8);
      box-shadow: 0 0 0 4px rgb(222,228,247);
      -moz-box-shadow: 10px 10px 5px #888888; /* 老的 Firefox */
      box-shadow: 3px 3px 5px rgba(195,188,207,0.7);
      .title{
        button{
          margin: 10px 10px 0px 10px;
          width: 70px;
          height: 34px;
          line-height: 9.5px;
        }
      }
      .phone {
        width: 70%;
        margin: 0px auto;
        input {
          width: 100%;
          height: 34px;
          border: 1px solid #94aac7;
          outline: none;
          margin-top: 20px;
          -moz-border-radius: 4px;
          -webkit-border-radius: 4px;
          border-radius: 4px;
          text-indent: 10px;
        }
      }
      .pass{
        width: 70%;
        margin: 0px auto;
        input{
          width: 45%;
          height: 34px;
          border: 1px solid #94aac7;
          outline: none;
          margin-top: 20px;
          -moz-border-radius: 4px;
          -webkit-border-radius: 4px;
          border-radius: 4px;
          text-indent: 10px;
        }
        button{
          width: 45%;
          float: right;
          margin-top: 20px;
          height: 34px;
          line-height: 9.5px;
        }
      }
      .true {
        width: 70%;
        margin: 0px auto;
        button{
          width: 100%;
          margin-top: 20px;
          height: 34px;
          line-height: 9.5px;
        }
      }
    }
    .reset{
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -180px;
      margin-top: -120px;
      width: 380px;
      height: 240px;
      background:rgba(222,228,247,0.8);
      box-shadow: 0 0 0 4px rgb(222,228,247);
      -moz-box-shadow: 10px 10px 5px #888888; /* 老的 Firefox */
      box-shadow: 3px 3px 5px rgba(195,188,207,0.7);
      .el-form{
        width: 70%;
        margin: 20px auto 0;
      }
      .btn{
        width: 70%;
        margin: 0 auto;
        button{
          width: 100%;
          margin: 10px auto 0;
          height: 34px;
          line-height: 9.5px;
        }
      }
    }
    .register{
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -180px;
      margin-top: -190px;
      width: 380px;
      height: 380px;
      background:rgba(222,228,247,0.8);
      box-shadow: 0 0 0 4px rgb(222,228,247);
      -moz-box-shadow: 10px 10px 5px #888888; /* 老的 Firefox */
      box-shadow: 3px 3px 5px rgba(195,188,207,0.7);
      .title{
        button{
          margin: 10px 10px 0px 10px;
          width: 70px;
          height: 34px;
          line-height: 9.5px;
        }
      }
      .pass{
        width: 100%;
        margin: 0px auto 10px;
        input{
          width: 45%;
          height: 34px;
          outline: none;
          margin-bottom: 10px;
          -moz-border-radius: 4px;
          -webkit-border-radius: 4px;
          border-radius: 4px;
        }
        button{
          width: 45%;
          float: right;
          margin-top: 3px;
          height: 34px;
          line-height: 9.5px;
        }
      }
      .el-form{
        width: 70%;
        margin: 20px auto 0;
      }
      .btn{
        width: 70%;
        margin: 0 auto;
        button{
          width: 100%;
          height: 34px;
          line-height: 9.5px;
        }
      }
    }
    .choose{
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translateX(-50%) translateY(-50%);
      -moz-transform: translateX(-50%) translateY(-50%);
      -ms-transform: translateX(-50%) translateY(-50%);
      -o-transform: translateX(-50%) translateY(-50%);
      transform: translateX(-50%) translateY(-50%);
      width: 380px;
      height: 240px;
      background:rgba(222,228,247,0.8);
      box-shadow: 0 0 0 4px rgb(222,228,247);
      -moz-box-shadow: 10px 10px 5px #888888; /* 老的 Firefox */
      box-shadow: 3px 3px 5px rgba(195,188,207,0.7);
      .btn{
        width: 250px;
        margin: 95px auto;
        .el-button--success{
          margin-left: 35px;
        }
      }
    }
	}
</style>

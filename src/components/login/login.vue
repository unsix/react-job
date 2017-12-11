<template>
	<div class="login-wrapper">
		<div class="log">
			
		</div>
		<div class="login">
				<div class="title">
					请登录
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
				<!--<div class="forget">
					<span>忘记密码?</span>
					<span>注册账号</span>
				</div>-->
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
	export default{
		data(){
			return{
				isA:true,
				isB:false,
				account_num:'',
				password_num:'',
				uncreatedCompanyShow:false,
				errorShow:false,
				loadingShow:false,
				ComPartPersonList:[],
				companyPersonList:[],
				numOne:0,
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
			toLogin(){
				this.isA = true
				this.isB = false
			},
			toRegister(){
				this.isA = false
				this.isB = true
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
			    	console.log(res.data)
					if(res.data.code === 0){
						let avatar = getAvatar(res.data.data.avatar)
						this.setUser({
							'uid':res.data.data.uid,
							'name':res.data.data.name,
							'avatar':avatar
						})
						localStorage.user = JSON.stringify(this.user);
						this._getUserCompanyList(res.data.data.uid)
						this._getComDepart()
						this.loadingShow=true
						setTimeout(()=>{
							this.$router.push('/work');
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
			uncreatedCompany
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
				font-size: 13px;
				color: #878D99;
				margin-top: 20px;
				cursor: default;
			}
			.forget{
				width: 70%;
				margin: 0 auto;
				font-size: 13px;
				color: #878D99;
				margin-top: 20px;
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
					margin-top: 20px;
					-moz-border-radius: 4px;
					-webkit-border-radius: 4px;
					border-radius: 4px;
					text-indent: 10px;
				}
				.submit {
					width: 100%;
					a {
						position: relative;
						margin-top: 20px;
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
	}
</style>
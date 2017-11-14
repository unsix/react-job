<template>
	<div class="login-wrapper">
		<div class="log">
			
		</div>
		<div class="login">
				<!--<div class="nav">
					<a :class="{ 'active': isA}" @click="toLogin">登录</a>
					<a :class="{ 'active': isB}" @click="toRegister">注册</a>
				</div>-->
				<div class="title">
					请登录
				</div>
				<div class="signIn">
					<div class="username">
						<input type="text" name="phone" placeholder="请输入账号"  v-model.trim="account_num"/>
					</div>
					<div class="password">
						<input type="password" placeholder="请输入密码" v-model.trim="password_num"/>
					</div>		
					<div class="error" v-show="errorShow">
						<span>账号或密码错误</span>
					</div>
					<div class="submit">
						<a @click="login">登录<i class="el-icon-loading" v-show="loadingShow"></i></a>
						
					</div>
				</div>
				<div class="forget">
					<span>忘记密码?</span>
					<span>注册账号</span>
				</div>
			</div>
		<uncreatedCompany v-show="uncreatedCompanyShow"></uncreatedCompany>
	</div>
</template>

<script>
	import {createPersonInfo} from 'common/js/person_info'
	import uncreatedCompany from '@/base/uncreated_company/uncreated_company'
	import {mapMutations,mapGetters} from 'vuex'
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
				companyPersonList:[],
				numOne:0
			}
		},
		computed:{
			...mapGetters([
				'nowCompanyId'
			]),
			phone_num(){
				if(this.account_num.length !== 11){
					return true
				}else{
					return false
				}
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
				let password_num = md5(this.password_num)
				let param = new URLSearchParams();
			    param.append("phone",this.account_num);
			    param.append("password",password_num);
			    param.append("phone","13625718871");
			    param.append("password","e10adc3949ba59abbe56e057f20f883e");
			    this.$http.post("/index/Mobile/skey/login",param)
			    .then((res)=>{
					if(res.data.code === 0){
						let avatar = res.data.data.avatar
//						this.uncreatedCompanyShow=true
//						setTimeout(()=>{
//							this.$router.push('/worker_list');
//							this.uncreatedCompanyShow=false
//						},3000)
						this.setUser({
							'uid':res.data.data.uid,
							'name':res.data.data.name,
							'avatar':getAvatar(res.data.data.avatar)
						})
						this._getUserCompanyList(res.data.data.uid)
						setTimeout(()=>{
							this._getComPersonList()
						},300)
						this.loadingShow=true
						setTimeout(()=>{
							this.$router.push('/index/work');
							this.loadingShow=false
						},1000)
					}else{
  						this.errorShow = true;
					}
			    })
			},
			_getComPersonList(){
				let param = new URLSearchParams();
				param.append("company_id",this.nowCompanyId);
			    this.$http.post("/index/Mobile/user/get_department_lest",param)
			    .then((res)=>{

			    	let resData=res.data.data
			    	for(let j = 0,len=resData.length; j < len; j++) {
			    		if(this.numOne>=len){
			    			return
			    		}
			    		let obj={}
   						this.$set(obj,'department_name',resData[j].department_name)
   						/**/
						let newparam = new URLSearchParams();
					    newparam.append("company_id",this.nowCompanyId); 
					    newparam.append("department_id",resData[j].department_id);
					    this.$http.post("/index/Mobile/user/get_company_personnel",newparam)
					    .then((res)=>{
					    
					    	let reaDa=[]
					    	res.data.data.forEach((item)=>{
					    		reaDa.push(createPersonInfo(item))
					    	})
					    	this.$set(obj,'person',reaDa)					    	
					    	this.companyPersonList.push(obj)
					    })	
					    this.numOne++				   
					}   	
					this.setComPersonList(this.companyPersonList)
					console.log(this.companyPersonList)
			    })
			},
			_getUserCompanyList(user_id){
				let param = new URLSearchParams();
				param.append("uid",user_id);
				this.$http.post("/index/Mobile/user/companies_list",param)
				.then((res)=>{
				    this.setNowCompanyId(res.data.data[0].company_id)
				})
			},
			...mapMutations({
				setUser: 'SET_USER',
				setNowCompanyId: 'SET_NOWCOMPANY_ID',
				setComPersonList: 'SET_COM_PERSON_LIST'
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
			height: 260px;
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
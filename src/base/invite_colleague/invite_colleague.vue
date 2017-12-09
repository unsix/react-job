<template>
	<div class="inviteColleagues">
		<div class="inviteCo">
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="姓名" style="margin-top: 30px;">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" style="margin-top: 10px;">
					<el-input v-model="form.phone"></el-input>
				</el-form-item>
				<el-form-item label="指定部门" style="margin-top: 10px;">
					<el-select v-model="form.depart" placeholder="请选择部门" style="width: 100%;">
						<el-option :label="item.department_name" :value="item.department_name" v-for="item in comDepartList" :key="item.department_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="margin-top: 30px;">
					<el-button type="primary" @click="onSubmit">立即邀请</el-button>
				</el-form-item>
			</el-form>
		</div>
		<loading v-show="loadingShow"></loading>
	</div>
</template>

<script>
	import { create_depart_list } from 'common/js/initial/depart.js'
	import loading from '@/base/loading/loading'
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				loadingShow: false,
				form: {
					name: '',
					phone: '',
					depart: ''
				}
			}
		},
		computed: {
			...mapGetters([
				'user',
				'comDepartList',
				'nowCompanyId'
			])
		},
		mounted() {
			if(this.$route.path === '/work/inviteCol') {
				this.$emit('changeWorkIndex', 5)
			}
		},
		watch: {
			nowCompanyId() {
				this._getComDepart()
			}
		},
		created() {
			this._getUserCompanyList()
			this.setNowCompanyId(JSON.parse(localStorage.nowCompanyId))
		},
		methods: {
			onSubmit() {
				let reg = /^1[0-9]{10}$/;
				if(!reg.test(this.form.phone)) {
					this.$message({
						message: '请填写正确手机号码',
						type: 'warning'
					});
					return
				}
				this.loadingShow = true
				let departId
				this.comDepartList.forEach((item) => {
					if(item.department_name === this.form.depart) {
						departId = item.department_id
					}
				})

				let param = new URLSearchParams();
				param.append("name", this.form.name);
				param.append("phone", this.form.phone);
				param.append("company_id", this.nowCompanyId);
				param.append("department_id", departId);
				this.$http.post("/index.php/Mobile/User/add_personnel", param)
					.then((res) => {
						console.log(res)
						this.loadingShow = false
						this.$emit('close')
						if(res.data.code === 0) {
							this.$message.success('添加成功');
							this._getComPersonList()
						} else {
							this.$message.error('添加失败');
						}

					})
			},
			_getUserCompanyList() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				this.$http.post("/index.php/Mobile/user/companies_list", param)
					.then((res) => {
//						this.setNowCompanyId(res.data.data[0].company_id)
						this.setCompanyList(res.data.data)
//						this.setNowCompanyName(res.data.data[0].company_name)
					})
			},
			_getComDepart() {
				let param = new URLSearchParams();
				param.append("company_id", this.nowCompanyId);
				this.$http.post("/index.php/Mobile/user/get_department_lest", param)
					.then((res) => {
						let arr = []
						res.data.data.forEach((item) => {
							arr.push(create_depart_list(item))
						})
						this.setComDepartList(arr)
					})
			},
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
			})
		},
		components: {
			loading
		}
	}
</script>

<style lang="scss">
	.inviteColleagues {
		width: 100%;
		height: 100%;
		min-height: 400px;
		background: #FFFFFF;
		>.inviteCo {
			padding: 10px;
			position: relative;
			.close {
				position: absolute;
				top: 5px;
				right: 5px;
				color: #878D99;
				z-index: 20;
				&:hover {
					color: #FA5555;
				}
			}
			.submit {
				width: 100%;
				margin-top: 10px;
				cursor: pointer;
				span {
					width: 100%;
					padding: 10px 0;
					text-align: center;
					background: #9DB5FB;
					display: block;
					color: #FFFFFF;
					-webkit-border-radius: 4px;
					-moz-border-radius: 4px;
					border-radius: 4px;
				}
			}
			.sec {
				margin-bottom: 10px;
				position: relative;
				.title {
					width: 100px;
					display: inline-block;
					margin-right: 30px;
					display: block;
					width: 100px;
					height: 30px;
					line-height: 30px;
					text-align: right;
					float: left;
				}
				.inputInfo {
					display: inline-block;
					height: 26px;
					width: 400px;
					outline: none;
				}
				.position {
					line-height: 30px;
					.addGroup {
						margin-left: 10px;
						color: #878D99;
						font-size: 20px;
						position: relative;
						top: 2px;
						&:hover {
							color: #409EFF;
						}
					}
				}
			}
		}
	}
</style>
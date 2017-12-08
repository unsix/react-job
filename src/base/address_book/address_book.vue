<template>
	<div class="address_book">
		<ul>
			<li>
				<div class="avatar lzz">
					<span style="margin-left: 10px;">头像</span>
				</div>
				<div class="name lzz">
					<span>名字</span>
				</div>

				<div class="tel lzz">
					<span>联系方式</span>
				</div>
				<div class="operation lzz">
					<span>操作</span>
				</div>
			</li>
			<li v-for="item in comPersonList">
				<div class="avatar">
					<img :src="item.avatar" alt="" />
				</div>
				<div class="name">
					<span>{{item.name}}</span>
				</div>
				<div class="tel">
					<span>{{item.phone}}</span>
				</div>
				<div class="operation">
					<el-button type="primary" round @click="view_info">查看</el-button>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {}
		},
		computed: {
			...mapGetters([
				'nowCompanyId',
				'user',
				'comPersonList'
			])
		},
		methods: {
			view_info() {
				this.$message({
					message: '暂时还不能查看',
					type: 'warning'
				});
			},
			_getComPersonList() {
				let newparam = new URLSearchParams();
				newparam.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/user/get_company_personnel", newparam)
					.then((res) => {
						let reaDa = []
						res.data.data.forEach((item) => {
							item.avatar = 'http://img-bbsf.6655.la/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns'
							reaDa.push(item)
						})
						this.setComPersonList(reaDa)
					})
			},
			_getUserCompanyList() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				this.$http.post("/index/Mobile/user/companies_list", param)
					.then((res) => {
						this.setNowCompanyId(res.data.data[0].company_id)
						this.setCompanyList(res.data.data)
						this.setNowCompanyName(res.data.data[0].company_name)
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
		created() {
			this._getUserCompanyList()

		},
		mounted() {
			if(this.$route.path === '/work/addressBook') {
				this.$emit('changeWorkIndex', 6)
			}
		},
		watch: {
			nowCompanyId() {
				this._getComPersonList()
			}
		}
	}
</script>

<style lang="scss">
	.address_book {
		background: #FFFFFF;
		box-shadow: 0 0 2px rgba(0, 0, 0, .2);
		-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
		>ul {
			padding: 10px;
			>li {
				cursor: default;
				display: block;
				border-bottom: 1px solid #DDDDDD;
				font-size: 14px;
				transition: .3s;
				.el-button.is-round {
					padding: 5px 10px;
				}
				>.lzz {
					font-weight: 700;
					font-size: 15px;
					text-indent: 2px;
				}
				&:first-child {
					border-bottom: 1px solid transparent;
					&:hover {
						background: none;
					}
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
				.avatar {
					vertical-align: top;
					width: 90px;
					margin-right: 20px;
					margin-left: 4px;
					img {
						margin-left: 10px;
						width: 40px;
						height: 40px;
						border-radius: 50%;
					}
				}
				.name {
					width: 150px;
				}
				.tel {
					width: 200px;
				}
				.operation {
					width: 80px;
					button {
						display: block;
					}
				}
			}
		}
	}
</style>
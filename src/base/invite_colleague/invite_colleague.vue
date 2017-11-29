<template>
	<div class="inviteColleagues" >
		<div class="inviteCo">
			<el-form ref="form" :model="form" label-width="80px">
			  <el-form-item label="姓名" style="margin-top: 50px;">
			    <el-input v-model="form.name"></el-input>
			  </el-form-item>
			   <el-form-item label="手机号码" style="margin-top: 10px;">
			    <el-input v-model="form.phone"></el-input>
			  </el-form-item>
			  <el-form-item label="指定部门" style="margin-top: 10px;">
			    <el-select v-model="form.depart" placeholder="请选择部门">
			    	<el-option :label="item.department_name" :value="item.department_name" v-for="item in comDepartList" :key="item.department_id"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item style="margin-top: 30px;">
			    <el-button type="primary" @click="onSubmit">立即创建</el-button>
			    <el-button>取消</el-button>
			  </el-form-item>
			</el-form>
		</div>
		<loading v-show="loadingShow"></loading>
	</div>
</template>

<script>
import loading from '@/base/loading/loading'
import {mapGetters} from 'vuex'
	export default{
		data(){
			return{
				loadingShow:false,
				 form: {
		          name: '',
		          phone: '',
		          depart:''
		        }
			}
		},
		computed:{
			...mapGetters([
				'comDepartList',
				'nowCompanyId'
			])
		},
		methods:{
			 onSubmit() {
			 	this.loadingShow = true
			 	let departId
			 	this.comDepartList.forEach((item) => {
						if(item.department_name === this.form.depart) {
							departId = item.department_id
						}
					})
		        let param = new URLSearchParams();
			    param.append("name",this.form.name);
			    param.append("phone",this.form.phone);
			    param.append("company_id",this.nowCompanyId);
			    param.append("department_id",departId);
			    this.$http.post("/index/Mobile/User/add_personnel",param)
			    .then((res)=>{
			    	this.loadingShow = false
			    	this.$emit('close')
			    	if(res.data.code === 0){
			    		this.$message('添加成功');
			    	}else{
			    		 this.$message.error('添加失败');
			    	}
			    	
			    })
		     }
		},
		components:{
			loading
		}
	}
</script>

<style lang="scss">
	.inviteColleagues {
		width: 100%;
		height: 100%;
		min-height: 400px;
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
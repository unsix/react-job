<template>
	<div class="form" name="合同评审表">
		<i class="el-icon-d-arrow-left" @click="return_"></i>
		<div v-if="form_Lista.contract_name">
			<span>工程名称：</span><span >{{form_Lista.contract_name}}</span>
		</div>
		<div v-if="form_Lista.contract_name_new">
			<span>合同名称：</span><span >{{form_Lista.contract_name_new}}</span>
		</div>
		<div v-if="form_Lista.contract_num">
			<span>合同编号：</span><span >{{form_Lista.contract_num}}</span>
		</div>
		<div v-if="form_Lista.a_name">
			<span>甲方：</span><span>{{form_Lista.a_name}}</span>
		</div>
		<div v-if="form_Lista.b_name">
			<span>乙方：</span><span >{{form_Lista.b_name}}</span>
		</div>
		<div  v-if="form_Lista.executor">
			<span>执行人：</span><span>{{form_Lista.executor}}</span>
		</div>
		<div v-if="form_Lista.project_manager_name">
			<span>项目负责人(项目经理)：</span><span>{{form_Lista.project_manager_name}}</span>
		</div>
		<div  v-if="form_Lista.prive">
			<span>单价：</span><span>{{form_Lista.prive}}</span>
		</div>
		<div  v-if="form_Lista.total_prive">
			<span>总价：</span><span>{{form_Lista.total_prive}}</span>
		</div>
		<div>
			<span v-if="form_Lista.difference">与投标价格差异：</span><span>{{form_Lista.difference}}</span>
		</div>
		<div v-if="form_Lista.pay_method">
			<span>付款方式：</span><span>{{form_Lista.pay_method}}</span>
		</div>
		<div v-if="form_Lista.arrive_time">
			<span>到货时间：</span><span>{{form_Lista.arrive_time}}</span>
		</div>
		<div v-if="form_Lista.arrive_time">
			<span>完工时间：</span><span>{{form_Lista.arrive_time}}</span>
		</div>
		<div>
			<span v-if="form_Lista.remarks">合同主要内容：</span><span>{{form_Lista.remarks}}</span>
		</div>
		<div>
			<span v-if="form_Lista.contract_name">附件列表：</span><span>{{form_Lista.contract_name}}</span>
		</div>
		<div  v-if="form_Lista.img_list">
			<span>图片附件：</span>
			<a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list">
				<img :src="item" alt="" @click="ctrl_pic_show(form_Lista.img_list,index)" />
			</a>
		</div>
		<div v-if="form_Listb.found_name">
						<span>发起人：</span><span>{{form_Listb.found_name}}</span>
					</div>
					<div v-if="form_Listb.list">
						<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444;margin-left: 4px;">{{item}}</span>
					</div>
		<div v-if="form_Listb.content">
			<span>审批：</span>
			<br />
			<span v-for="item in form_Listb.content" style="color: #444444;">
			{{item.department_name}}	{{item.name}} 	{{item.is_agree}} {{item.add_time}}
			<div><img :src="list" alt=""  v-for="(list,index) in item.picture" @click="cl_pic(item,index)"/></div>
			</span>
		</div>
		<div v-if="form_Listb.finance">
						<span>表单回执：</span>
						<br />
						<span style="color: #444444;">
						<span v-html="form_Listb.finance.finance_state"></span> 
						{{form_Listb.finance.name}}
						{{form_Listb.finance.receipt_content}}
						{{form_Listb.finance.save_time}}
						<div><img :src="list" alt=""  v-for="(list,index) in form_Listb.re_pic" @click="rec_pic(form_Listb.re_pic,index)"/></div>
						</span>
					</div>
		<div class="menu" v-show="handle_show">
			<span @click="handle">处理</span>
			<div class="button" v-show="menuShow">
				<span @click="agree">同意</span>
				<span @click="refuse">拒绝</span>
				<input type="text" v-model="handle_txt" placeholder="请输入回复内容" />
				<input name="token" type="hidden" :value="input_value">
				<input type="file" name="" id=""  @change="getFile($event)" multiple="multiple" />
				<i class="el-icon-close" @click="closeMenu"></i>
			</div>
		</div>
		<browsePic :pic_index="pic_index" :img_arr="img_arr" :pic_show="pic_show" @left="last_one" @right="next_one" @close_pic="close_pic"></browsePic>
		<loading v-show="loading_show"></loading>
	</div>
</template>

<script>
	import loading from '@/base/loading/loading'
	import browsePic from '@/base/browse_pic/browse_pic'
	import {mapGetters} from 'vuex'
	export default {
		data() {
			return {
				menuShow:false,
				handle_txt:'',
				pic_index:0,
				pic_show:false,
				loading_show:false,
				input_value:'',
				pic_hash:'',
				now_personnel_id:0,
				pic_hash_arr:[],
				img_arr:[]
			}
		},
		props:{
			form_Lista:{
				type:Object
			},
			form_Listb:{
				type:Object
			},
			handle_show:{
				type:Boolean
			},
			psb_approval_id:{
				type:String
			}
		},
		computed:{
			...mapGetters([
				'user',
				'nowCompanyId'
			])
		},
		methods:{
			return_(){
				this.$emit('return_psb')
			},
			close_pic(){
				this.pic_show = false
			},
			last_one(){
				if(this.pic_index === 0){
					return
				}
				--this.pic_index
			},
			next_one(){
				if(this.pic_index === this.img_arr.length-1){
					return
				}
				++this.pic_index
			},
			rec_pic(item,index){
				this.img_arr = item
				this.pic_index = index
				this.pic_show=true
			},
			cl_pic(item,index){
				this.img_arr = item.picture
				this.pic_index = index
				this.pic_show=true
			},
			ctrl_pic_show(item,index){			
				this.img_arr = item
				this.pic_index = index
				this.pic_show=true
			},
			handle(){
				this.menuShow=true
				let param = new URLSearchParams();
				param.append("uid",this.user.uid);
				this.$http.post("/index/Mobile/path/get_token",param)
				.then((res)=>{
					this.input_value = res.data.data
				})
			},
			closeMenu(){
				this.menuShow = false
			},
			getFile(event) {
	            this.file = event.target.files;
	        },
			agree(){
				if(this.handle_txt === ''){
					this.$message.error('请填写回执内容');
					return
				}
				if(!this.file){
					this.$message.error('确认回执必须上传图片');
					return 
				}
				if(this.file){
					if(this.file.length === 0){
						this.$message.error('确认回执必须上传图片');
						return 
					}
					for(let i=0;i<this.file.length; i++){
						let formData = new FormData();
			            formData.append('file', this.file[i]);
			            formData.append('token', this.input_value);
			            let config = {
			              headers: {
			                'Content-Type': 'multipart/form-data'
			              }
			            }
			            this.$http.post('http://up.qiniu.com', formData, config).then((res)=>{
			            	this.pic_hash_arr.push(res.data.hash)
				        }) 
					}
					if(this.pic_hash_arr.length === this.file.length){
						this.loading_show = true
						let mparam = new URLSearchParams();
						mparam.append("uid",this.user.uid);
						mparam.append("company_id",this.nowCompanyId);
						this.$http.post("/index/Mobile/User/return_company_new",mparam)
						.then((res)=>{
							this.now_personnel_id = res.data.data.personnel_id
							if(this.now_personnel_id === res.data.data.personnel_id){
								let nparam = new URLSearchParams();
								nparam.append("uid",this.user.uid);
								nparam.append("picture",JSON.stringify(this.pic_hash_arr));
								this.$http.post("/index/Mobile/approval/upload_enclosure_new",nparam)
								.then((res)=>{
									let param = new URLSearchParams();
						            param.append("uid",this.user.uid);
									param.append("approval_id",this.psb_approval_id);
									param.append("personnel_id",this.now_personnel_id);
									param.append("company_id",this.nowCompanyId);
									param.append("finance_state",1);
									param.append("receipt_content",'111');
									param.append("receipt_pic",res.data.data.enclosure_id);
									this.$http.post("/index/Mobile/find/finance_receipt",param)
									.then((res)=>{
										this.loading_show = false
										if(res.data.code === 0){
											 this.$message({
									          message: '恭喜你，操作成功',
									          type: 'success'
									        });
									        this.return_()
										}else{
											this.$message.error('操作失败');
										}
									})
								})
							}
						})	
					}
				}     
			},
			
			refuse(){
				
			}
		},
		components:{
			browsePic,
			loading
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.form{
			padding: 10px;
			color: #999999;
			>i{
				font-size: 20px;
				padding: 4px;
				cursor: pointer;
				&:hover{
					color: #000000;
				}
			}
			>div{
				display: block;
				border-bottom: 1px solid #DDDDDD;
				>span{
					vertical-align: top;
					font-size: 14px;
					line-height: 24px;
					&:nth-child(2){
						margin-left: 5px;
						color: #444444;
					}
				}
				.approval{
					display: inline-block;
					span{
						font-size: 14px;
						line-height: 24px;
					}
				}
				img{
					display: inline-block;
					width: 80px;
					margin-right: 10px;
					cursor: pointer;
				}
			}
			.qingdan{
				font-size: 14px;
				padding: 4px 0;
				h4{
					color: #409EFF;
					font-size: 15px;
					margin: 2px 0px;
				}
				p{
					height: 30px;
					line-height: 30px;
					span{
						margin-left: 5px;
						color: #444444;
					}
				}
			}
			.menu{
				margin-top: 10px;
				border-bottom: none;
				span{
					font-size: 14px;
					display: inline-block;
					padding: 2px 10px;
					border: 1px solid #3487E2;
					border-radius: 4px;
					cursor: pointer;
				}
				.button{
					margin-left: 20px;
					display: inline-block;
					font-size: 0;
					z-index: 2;
					　　width: 300px;
					　　height: 40px;
					　　line-height: 40px;
					span{
						color: #FA5555;
						border: 1px solid #FA5555;
						margin-left:4px;
						&:first-child{
							color:#67C23A;
							border: 1px solid #67C23A;
						}

					}
					input[type="text"]{
						width:200px;
						margin-left: 4px;
						height: 16px;
						outline: none;
						border: 1px solid #3487E2;
						border-radius: 4px;
						text-indent: 4px;
						line-height: 16px;
					}
					input[type="file"]{
						margin-left: 4px;
						margin-top: 4px;
					}
					i{
						font-size: 16px;
						padding: 4px;
						cursor: pointer;
						margin-left: 10px;
					}
					>a{
						font-size: 12px;
						display: inline-block;
						padding: 4px 10px;
						border: 1px solid #5E8579;
					}

				}
			}
		}
</style>
<template>
	<div class="form_receipt">
		<div class="nav">
			<span v-for="(item,index) in nav" :class="{'active': index == navIndex}" @click="nav_cli(index)">{{item}}</span>
		</div>
		<div class="list" v-show="listShow">
			<ul>
				<li v-for="(item,index) in untreated" :key="item.approval_id">
					<div class="avatar">
						<img :src="item.avatar" alt="" />
					</div>
					<div class="edit">
						<span @click="listCli(item,index)">查看</span>
					</div>
					<div class="content">
						<div class="creatTime">
							<span>发起时间：{{item.add_time}}</span>
						</div>
						<div class="name">
							<span>名称：{{item.name}}</span>
						</div>
						<!--<div class="creatTime">
							<span>处理时间：{{item.add_time}}</span>
						</div>-->
						<div class="type">
							<span>类型：{{item.type}}</span>
						</div>
						<div class="title">
							<span>标题：{{item.title}}</span>
						</div>
					</div>
				</li>
				<div class="page">
					<span @click="first_page" >首页</span>
					<span @click="last_page" v-show="pageIndex > 1">上一页</span>
					<span @click="next_page" v-show="nextPageShow">下一页</span>
				</div>
			</ul>
		</div>
		<psb 
			v-if="psb_if" 
			:form_Lista="form_Lista" 
			:form_Listb="form_Listb" 
			:handle_show="handle_show" 
			:img_arr="img_arr"
			:psb_approval_id="psb_approval_id"
			@return_psb="return_psb">
		</psb>
		<qgd 
			v-if="qgd_if" 
			:form_Lista="form_Lista" 
			:form_Listb="form_Listb" 
			:handle_show="handle_show" 
			:img_arr="img_arr"
			:psb_approval_id="psb_approval_id"
			@return_psb="return_psb">
		</qgd>
	</div>
</template>

<script>
	import psb from '@/base/exam_form/psb'
	import qgd from '@/base/exam_form/qgd'
	import {create_exam_list} from '@/common/js/approval/exam'
	import {create_gongzhang_list} from '@/common/js/approval/gongzhang'
	import {create_qingkuandan_list} from '@/common/js/approval/qingkuandan'
	import {create_cengpijian_list} from '@/common/js/approval/cengpijian'
	import {create_hetongpingshen_list} from '@/common/js/approval/hetongpingshen'
	import {create_approval_list} from '@/common/js/approval/approval_list'
	import {mapGetters} from 'vuex'
	export default{
		data(){
			return{
				nav:['未处理','已处理'],
				navIndex:0,
				untreated:[],
				form_Lista:{},
				form_Listb:{},
				finance_type:1,
				psb_if:false,
				qgd_if:false,
				listShow:true,
				nextPageShow:true,
				handle_show:true,
				img_arr:[],
				pageIndex:1,
				psb_approval_id:''
			}
		},
		computed:{
			...mapGetters([
				'nowCompanyId',
				'user'
			])
		},
		created(){
			this._get_data()
		},
		methods:{
			first_page(){
				this.nextPageShow = true
				this.pageIndex = 1
			},
			last_page(){
				this.nextPageShow = true
				--this.pageIndex
			},
			next_page(){
				++this.pageIndex
			},
			nav_cli(index){
				if(index === 0){
					this.handle_show = true
				}else{
					this.handle_show = false
				}
				this.navIndex = index
				this.finance_type = index + 1
				this._get_data()
			},
			_get_data(){
				let param = new URLSearchParams();
				param.append("uid",this.user.uid);
				param.append("type",this.finance_type);
				param.append("company_id",this.nowCompanyId);
				param.append("p",this.pageIndex);
				param.append("each",'10');
				this.$http.post("/index/Mobile/find/finance_list_formal",param)
				.then((res)=>{
					
					let arr = []
					this.untreated = res.data.data
					res.data.data.forEach((item)=>{
						arr.push(create_exam_list(item))
					})
					this.untreated = arr
					if(arr.length<10){
						this.nextPageShow = false
					}
				})
			},
			return_psb(){
				this.psb_if = false
				this.listShow = true
			},
			listCli(item){
				this.listShow=false
				this.psb_approval_id = item.approval_id
				let param = new URLSearchParams();
				param.append("uid",this.user.uid);
				param.append("approval_id",item.approval_id);
				this.$http.post("/index/Mobile/approval/approval_process_show",param)
				.then((res)=>{
					if(item.type === '呈批件'){
						this.form_Lista = create_cengpijian_list(res.data.data)
					    this.get_img(this.form_Lista.img_list)
					}else if(item.type === '合同评审表'){
						this.psb_if=true
						this.form_Lista = create_hetongpingshen_list(res.data.data)
						console.log(this.form_Lista)
						this.get_img(this.form_Lista.many_enclosure)
					}else if(item.type === '请款单'){
						this.form_Lista = create_qingkuandan_list(res.data.data)
						this.get_img(this.form_Lista.img)
					}else if(item.type === '申请公章'){
						this.form_Lista = create_gongzhang_list(res.data.data)
					}else if(item.type === '请购单'){
						this.qgd_if=true
						this.form_Lista = res.data.data
					}
				})
				let nparam = new URLSearchParams();
				nparam.append("uid",this.user.uid);
				nparam.append("approval_id",item.approval_id);
				nparam.append("company_id",this.nowCompanyId);
				this.$http.post("/index/Mobile/approval/approval_process_personnel",nparam)
				.then((res)=>{
					this.form_Listb=create_approval_list(res.data.data)
				})
			},
	//		获取图片
			get_img(many_enclosure) {
				if(!many_enclosure){
					return
				}
				many_enclosure.forEach((item)=>{
					if(item.type === 3){
					let param = new URLSearchParams();
					param.append("enclosure_id", item.contract_id);
					this.$http.post("/index/Mobile/approval/look_enclosure", param)
					.then((res) => {
						let arr=[]
						res.data.data.picture.forEach((item)=>{
							if(item != ''){
								arr.push('http://img-bbsf.6655.la/'+item)
							}
						})
						this.img_arr = arr
						this.$set(this.form_Lista,'img_list',arr)
					})
					}
				})
			}
		},
		watch:{
			pageIndex(){
				this._get_data()
			}
		},
		components:{
			psb,
			qgd
		}
	}
</script>

<style lang="scss" scoped>
.form_receipt {
	width: 100%;
	background: #FFFFFF;
	.nav {
		width: 100%;
		span {
			color: #0082CB;
			cursor: pointer;
			font-size: 12px;
			display: inline-block;
			width: 50%;
			height: 30px;
			text-align: center;
			line-height: 30px;
			border-bottom: 2px solid transparent;
			&.active {
				border-bottom: 2px solid #FC923F;
			}
		}
	}
	.list {
		width: 100%;
		ul {
			padding: 4px;
			>.page{
					width: 100%;
					padding: 4px;
					text-align: center;
					span{
						cursor: pointer;
						font-size: 12px;
						&:hover{
							color: #409EFF;
						}
					}	
				}
			li {
				color: #2D2F33;
				font-size: 14px;
				border-bottom: 1px solid #3487E2;
				span {
					line-height: 18px;
				}
				.avatar {
					display: inline-block;
					vertical-align: top;
					margin-top: 4px;
					img {
						width: 30px;
						height: 30px;
						border-radius: 50%;
						display: block;
					}
				}
				.edit {
					display: inline-block;
					float: right;
					margin-right: 20px;
					margin-top: 30px;
					cursor: pointer;
					span {
						font-size: 14px;
						border: 1px solid #3487E2;
						padding: 4px 10px;
					}
				}
				.content {
					padding: 4px 0;
					display: inline-block;
					max-width: 400px;
					/*margin-left: 38px;*/
				}
			}
		}
	}
}
</style>
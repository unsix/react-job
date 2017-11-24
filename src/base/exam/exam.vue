<template>
	<div class="exam_wrapper">
		<div class="exam" v-show="listShow">
			<div class="nav">
				<ul>
					<li v-for="(item,index) in navList" @click="navCli(index)"  :class="{'active': index === currentIndex}">
						<span>{{item}}</span>
					</li>
				</ul>
			</div>
			<div class="list" >
				<ul>
					<li v-for="(item,index) in untreated" :key="item.approval_id">
						<div class="avatar" v-if="ilaunched">
							<img :src="item.avatar" alt="" />
						</div>
						<div class="edit">
							<span @click="listCli(item,index)">查看</span>
						</div>
						<div class="content">
							<div class="name"  v-if="ilaunched">
								<span>名称：{{item.name}}</span>
							</div>
							<div class="creatTime">
								<span>发起时间：{{item.add_time}}</span>
							</div>
							<div class="creatTime" v-if="handle_time_show">
								<span>处理时间：{{item.add_time}}</span>
							</div>
							<div class="type">
								<span>类型：{{item.type}}</span>
							</div>
							<div class="title">
								<span>标题：{{item.title}}</span>
							</div>
							<div class="startComP">
								<span>发起公司：{{item.company_name}}</span>
							</div>
							<div class="process" v-if="approval_process">
								<span>审批进程：</span><span>{{item.approval_state}}</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="form_wrapper" v-show="formShow">
				<div class="top">
					<i class="el-icon-d-arrow-left" @click="return_list"></i>
					<span class="title">{{now_type_name}}</span>
				</div>
         <!--呈批件展示-->
				<div class="form" name="呈批件" v-if="cengpijian_show">
					<div>
						<span>呈批标题：</span><span>{{form_Lista.title}}</span>
					</div>
					<div>
						<span>呈批部门：</span><span>{{form_Lista.department_name}}</span>
					</div>
					<div>
						<span>文件编号：</span><span>{{form_Lista.chengpi_num}}</span>
					</div>
					<div>
						<span>主题内容：</span><span>{{form_Lista.content}}</span>
					</div>
					<div>
						<span>项目负责人(部门经理)：</span><span>{{form_Lista.project_manager_name}}</span>
					</div>
					<div>
						<span>附件列表：</span>
					</div>
					<div>
						<span >图片附件：</span>
						<a  v-for="item in form_Lista.img_list" v-if="form_Lista.img_list">
							<img :src="item" alt="" @click="ctrl_pic_show"/>
						</a>
					</div>
					<div>
						<span>发起人：</span><span>{{form_Listb.found_name}}</span>
					</div>
					<div>
						<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #409EFF;">{{item}}
						</span>
					</div>
					<div>
						<span>审批：</span>
						<div class="approval">
							<div v-for="item in form_Listb.content">
								<span>{{item.department_name}}</span>
								<span>{{item.name}}</span>
								<span style="color: #67C23A;">{{item.is_agree}}</span>
							</div>
							<div v-for="item in form_Listb.content">
								<span>审批时间</span>
								<span>{{item.add_time}}</span>
						</div>
						</div>
					</div>
					<div class="menu" v-show="handle_show">
						<span @click="handle">处理</span>
						<div class="button" v-show="menuShow">
							<span @click="agree($event)">同意</span>
							<span @click="refuse">拒绝</span>
							<input type="text" v-model="handle_txt" placeholder="请输入回复内容"/>
							<input name="token" type="hidden" :value="input_value">
							<input type="file" name="" id="" value="" />
							<i class="el-icon-close" @click="closeMenu" ></i>
						</div>
					</div>
				</div>
        <!--请购单展示-->
				<div class="form" name="请购单" v-if="qinggoudan_show">
					<div>
						<span>工程名称：</span><span>{{form_Lista.request_contract_address}}</span>
					</div>
					<div>
						<span>合同名称：</span><span>{{form_Lista.contract_name_new}}</span>
					</div>
					<div>
						<span>请购部门：</span><span>{{form_Lista.department_name}}</span>
					</div>
					<div>
						<span>采购执行人：</span><span>{{form_Lista.buy_person}}</span>
					</div>
					<div>
						<span>采购执行人联系方式：</span><span>{{form_Lista.buy_person_phone}}</span>
					</div>
					<div>
						<span>工程负责人：</span><span>{{form_Lista.contract_responsible}}</span>
					</div>
					<div>
						<span>工程负责人联系方式：</span><span>{{form_Lista.responsible_tel}}</span>
					</div>
					<div>
						<span>收货地址：</span><span>{{form_Lista.receive_address}}</span>
					</div>
					<div>
						<span>要求到货时间：</span><span>{{form_Lista.arrival_time}}</span>
					</div>
					<div>
						<span>收货人姓名：</span><span>{{form_Lista.consignee}}</span>
					</div>
					<div>
						<span>收货人联系方式：</span><span>{{form_Lista.consignee_phone}}</span>
					</div>
					<div>
						<span>项目负责人(部门经理)：</span><span>{{form_Lista.project_manager}}</span>
					</div>
					<div v-for="item in form_Lista.content" class="qingdan_qinggou">
						<h4>请购清单</h4>
						<p>请购名称：<span>{{item.name}}</span></p>
						<p>规格：<span>{{item.spec}}</span></p>
						<p>型号:<span>{{item.model}}</span></p>
						<p>单位：<span>{{item.unit}}</span></p>
						<p>数量:<span>{{item.num}}</span></p>
						<p>预计单价￥:<span>{{item.price}}</span></p>
						<p>总额￥:<span>{{item.subtotal}}</span></p>
						<p>申报采购原因及用途:<span>{{item.purpose}}</span></p>
					</div>
					<div>
						<span>发起人：</span><span>{{form_Listb.found_name}}</span>
					</div>
					<div>
						<span>审批人员：</span><span v-for="item in form_Listb.list">{{item}}</span>
					</div>
					<div>
						<span>审批：</span>
						<span v-for="item in form_Listb.content">
						{{item.department_name}}	{{item.name}} 	<a>{{item.is_agree}}</a>
						</span>
					</div>
					<div class="menu" v-show="handle_show">
						<span @click="handle">处理</span>
						<div class="button" v-show="menuShow">
							<span @click="agree($event)">同意</span>
							<span @click="refuse">拒绝</span>
							<input type="text" v-model="handle_txt" placeholder="请输入回复内容"/>
							<input name="token" type="hidden" :value="input_value">
							<input type="file" name="" id="" value="" />
							<i class="el-icon-close" @click="closeMenu" ></i>
						</div>
					</div>
				</div>
        <!--请款单展示-->
    		    <div class="form" name="请款单" v-if="qingkuandan_show">
					<div>
						<span>工程名称：</span><span>{{form_Lista.contract_name}}</span>
					</div>
					<div>
						<span>合同名称：</span><span>{{form_Lista.contract_name_new}}</span>
					</div>
					<div>
						<span>工种：</span><span>{{form_Lista.worker_type}}</span>
					</div>
					<div>
						<span>请款人姓名：</span><span>{{form_Lista.request_name}}</span>
					</div>
					<div>
						<span>联系方式：</span><span>{{form_Lista.phone}}</span>
					</div>
					<div>
						<span>账户名：</span><span>{{form_Lista.account_name}}</span>
					</div>
					<div>
						<span>开户行：</span><span>{{form_Lista.bank_address}}</span>
					</div>
					<div>
						<span>银行卡号：</span><span>{{form_Lista.bank_card}}</span>
					</div>
					<div>
						<span>请款次数：</span><span>{{form_Lista.request_num}}</span>
					</div>
					<div>
						<span>合同金额￥：</span><span>{{form_Lista.subtotal}}</span>
					</div>
					<div>
						<span>增减金额￥：</span><span>{{form_Lista.gain_reduction_subtotal}}</span>
					</div>
					<div>
						<span>已领工程款￥：</span><span>{{form_Lista.balance_subtotal}}</span>
					</div>
					<div>
						<span>本次请款￥：</span><span>{{form_Lista.request_subtotal}}</span>
					</div>
					<div>
						<span>合同执行进度：</span><span>{{form_Lista.contract_state}}</span>
					</div>
					<div>
						<span>请款内容：</span><span>{{form_Lista.request_content}}</span>
					</div>
					<div>
						<span>附件列表：</span>
					</div>
					<div>
						<span >图片附件：</span>
						<a  v-for="item in form_Lista.img_list" v-if="form_Lista.img_list">
							<img :src="item" alt="" @click="ctrl_pic_show"/>
						</a>
					</div>
					<div>
						<span>项目负责人(部门经理)：</span><span>{{form_Lista.project_manager_name}}</span>
					</div>
					<div>
						<span>发起人：</span><span>{{form_Listb.found_name}}</span>
					</div>
					<div>
						<span>审批人员：</span><span v-for="item in form_Listb.list">{{item}}</span>
					</div>
					<div>
						<span>审批：</span>
						<span v-for="item in form_Listb.content">
						{{item.department_name}}	{{item.name}} 	<a>{{item.is_agree}}</a>
						</span>
					</div>
					<div class="menu" v-show="handle_show">
						<span @click="handle">处理</span>
						<div class="button" v-show="menuShow">
							<span @click="agree($event)">同意</span>
							<span @click="refuse">拒绝</span>
							<input type="text" v-model="handle_txt" placeholder="请输入回复内容"/>
							<input name="token" type="hidden" :value="input_value">
							<input type="file" name="" id="" value="" />
							<i class="el-icon-close" @click="closeMenu" ></i>
						</div>
					</div>
				</div>
      <!--合同评审表展示-->
				<div class="form" name="合同评审表" v-if="pingshenbiao_show">
					<div>
						<span>工程名称：</span><span>{{form_Lista.contract_name}}</span>
					</div>
					<div>
						<span>合同名称：</span><span></span>
					</div>
					<div>
						<span>合同编号：</span><span>{{form_Lista.contract_num}}</span>
					</div>
					<div>
						<span>甲方：</span><span>{{form_Lista.a_name}}</span>
					</div>

					<div>
						<span>乙方：</span><span>{{form_Lista.b_name}}</span>
					</div>
					<div>
						<span>执行人：</span><span>{{form_Lista.executor}}</span>
					</div>
					<div>
						<span>项目负责人(项目经理)：</span><span>{{form_Lista.project_manager_name}}</span>
					</div>
					<div>
						<span>单价：</span><span>{{form_Lista.prive}}</span>
					</div>
					<div>
						<span>总价：</span><span>{{form_Lista.total_prive}}</span>
					</div>
					<div>
						<span>与投标价格差异：</span><span>{{form_Lista.difference}}</span>
					</div>
					<div>
						<span>付款方式：</span><span>{{form_Lista.pay_method}}</span>
					</div>
					<div>
						<span>到货时间：</span><span>{{form_Lista.arrive_time}}</span>
					</div>
					<div>
						<span>完工时间：</span><span>{{form_Lista.arrive_time}}</span>
					</div>
					<div>
						<span>合同主要内容：</span><span>{{form_Lista.remarks}}</span>
					</div>
					<div>
						<span>附件列表：</span><span>{{form_Lista.contract_name}}</span>
					</div>
					<div>
						<span >图片附件：</span>
						<a  v-for="item in form_Lista.img_list" v-if="form_Lista.img_list">
							<img :src="item" alt="" @click="ctrl_pic_show"/>
						</a>
					</div>
					<div>
						<span>发起人：</span><span v-for="item in form_Listb.list">{{item}}</span>
					</div>
					<div>
						<span>审批人员：</span><span v-for="item in form_Listb.list">{{item}}
						</span>
					</div>
					<div>
						<span>审批：</span>
						<span v-for="item in form_Listb.content">
						{{item.department_name}}	{{item.name}} 	<a>{{item.is_agree}}</a>
						</span>
					</div>
					<div class="menu" v-show="handle_show">
						<span @click="handle">处理</span>
						<div class="button" v-show="menuShow">
							<span @click="agree($event)">同意</span>
							<span @click="refuse">拒绝</span>
							<input type="text" v-model="handle_txt" placeholder="请输入回复内容"/>
							<input name="token" type="hidden" :value="input_value">
							<input type="file" name="" id="" value="" />
							<i class="el-icon-close" @click="closeMenu" ></i>
						</div>
					</div>
				</div>
			  <!--申请公章展示-->
     			<div class="form" name="申请公章" v-if="gongzhang_show">
					<div>
						<span>用章部门：</span><span>{{form_Lista.department_name}}</span>
					</div>
					<div>
						<span>申请人：</span><span>{{form_Lista.user_name}}</span>
					</div>
					<div>
						<span>项目负责人(部门经理)：</span><span>{{form_Lista.project_manager_name}}</span>
					</div>
					<div v-for="item in form_Lista.info" class="qingdan">
						<h4>申请清单</h4>
						<p>印章类别:<span>{{item.seal_type}}</span></p>
						<p>盖章事由:<span>{{item.reason}}</span></p>
						<p>资料名称:<span>{{item.contract_name}}</span></p>
						<p>公司名称:<span>{{item.name_company}}</span></p>
						<p>数量:<span>{{item.num}}</span></p>
						<p>备注:<span>{{item.remarks}}</span></p>
					</div>
					<div>
						<span>附件列表：</span>
					</div>
					<div>
						<span>图片附件：</span>
						<a v-for="item in form_Lista.img_list" v-if="form_Lista.img_list">
							<img :src="item" alt="" @click="ctrl_pic_show"/>
						</a>
					</div>
					<div>
						<span>发起人：</span><span>{{form_Listb.found_name}}</span>
					</div>
					<div>
						<span>审批人员：</span><span v-for="item in form_Listb.list" >{{item}}</span>
					</div>
					<div>
						<span>审批：</span>
						<div class="approval">
							<div v-for="item in form_Listb.content">
								<span>{{item.department_name}}</span>
								<span>{{item.name}}</span>
								<span style="color: #67C23A;">{{item.is_agree}}</span>
							</div>
							<div v-for="item in form_Listb.content">
								<span>审批时间</span>
								<span>{{item.add_time}}</span>
							</div>
						</div>
					</div>
					<div class="menu" v-show="handle_show">
						<span @click="handle">处理</span>
						<div class="button" v-show="menuShow">
							<span @click="agree($event)">同意</span>
							<span @click="refuse">拒绝</span>
							<input type="text" v-model="handle_txt" placeholder="请输入回复内容"/>
							<i class="el-icon-close" @click="closeMenu" ></i>
							<br />
							<input name="token" type="hidden" :value="input_value">
							<input type="file" multiple="multiple" />


						</div>
					</div>
				</div>
		</div>
		<browsePic :pic_index="pic_index" :img_arr="img_arr" :pic_show="pic_show" @left="last_one" @right="next_one" @close_pic="close_pic"></browsePic>
	</div>

</template>

<script>
import browsePic from '@/base/browse_pic/browse_pic'
import {create_qinggoudan_list} from '@/common/js/approval/qinggoudan'
import {create_gongzhang_list} from '@/common/js/approval/gongzhang'
import {create_qingkuandan_list} from '@/common/js/approval/qingkuandan'
import {create_cengpijian_list} from '@/common/js/approval/cengpijian'
import {create_hetongpingshen_list} from '@/common/js/approval/hetongpingshen'
import {create_exam_list} from '@/common/js/approval/exam'
import {create_approval_list} from '@/common/js/approval/approval_list'
import {mapGetters} from 'vuex'
export default{
	data(){
		return{
			currentIndex:0,
			navList:['未处理','已处理','我发起的'],
			untreated:[],
			now_type_name:'',
			handle_txt:'',
			nowType:1,
			listShow:true,
			formShow:false,
			qingkuandan_show:false,
			cengpijian_show:false,
			qinggoudan_show:false,
			pingshenbiao_show:false,
			gongzhang_show:false,
			form_Lista:[],
			form_Listb:[],
			menuShow:false,
			ilaunched:true,
			handle_time_show:false,
			approval_process:false,
			handle_show:true,
			pic_show:false,
			pic_index:0,
			handle_txt:'',
			input_value:'',
			file: '',
			pic_hash:'',
			cur_height:'',
			img_arr:[],
			fileList:[]
		}
	},
	computed:{
		...mapGetters([
			'user',
			'nowCompanyId'
		])
	},
	created(){
		this._getExamList()
	},
	components:{
		browsePic
	},
	methods:{
		handleUpload() {
//    document.getElementById('excel-upload-input').click()
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
		ctrl_pic_show(){
			this.pic_show=true
		},
		getFile(event) {
            this.file = event.target.files;
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
		agree(){
			let formData = new FormData();
            formData.append('file', this.file);
            formData.append('token', this.input_value);
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            this.$http.post('http://up.qiniu.com', formData, config).then((res)=>{
            	this.pic_hash=res.data.hash
	        })
            let param = new URLSearchParams();
				param.append("uid",this.user.uid);
				param.append("approval_id",this.untreated.approval_id);
				param.append("participation_id",this.form_Listb.participation_id);
				param.append("is_agree",'1');
				param.append("picture",this.pic_hash);
				param.append("company_id",this.nowCompanyId);
				this.$http.post("/index/Mobile/find/approval_process",param)
				.then((res)=>{
					if(res.status===200){
						this._getExamList()
						this.listShow = true
						this.formShow = false
					}
				})
		},
		refuse(){
			let formData = new FormData();
            formData.append('file', this.file);
            formData.append('token', this.input_value);
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            this.$http.post('http://up.qiniu.com', formData, config).then((res)=>{
            	this.pic_hash=res.data.hash
	        })
            let param = new URLSearchParams();
			param.append("uid",this.user.uid);
			param.append("approval_id",this.untreated.approval_id);
			param.append("participation_id",this.form_Listb.participation_id);
			param.append("is_agree",'2');
			param.append("picture",this.pic_hash);
			param.append("company_id",this.nowCompanyId);
			this.$http.post("/index/Mobile/find/approval_process",param)
			.then((res)=>{
				if(res.status==='200'){
					this.listShow = true
					this.formShow = false
				}

			})
		},
		return_list(){
			this.formShow=false
			this.listShow=true
			this.menuShow=false
			this.qingkuandan_show=false
			this.qinggoudan_show=false
			this.cengpijian_show=false
			this.pingshenbiao_show=false
			this.gongzhang_show=false

		},
		listCli(item){
			this.listShow = false
			this.formShow = true
			this.now_type_name=item.type
			console.log(item.type)
			if(item.type === '呈批件'){
				this.cengpijian_show = true
			}else if(item.type === '请款单'){
				this.qingkuandan_show = true
			}else if(item.type === '请购单'){
				this.qinggoudan_show = true
			}else if(item.type === '合同评审表'){
				this.pingshenbiao_show =true
			}else if(item.type === '申请公章'){
				this.gongzhang_show=true
			}
			let param = new URLSearchParams();
			param.append("uid",this.user.uid);
			param.append("approval_id",item.approval_id);
			this.$http.post("/index/Mobile/approval/approval_process_show",param)
			.then((res)=>{
				if(item.type === '呈批件'){
					this.form_Lista = create_cengpijian_list(res.data.data)
				    this.get_img(this.form_Lista.img_list)
				}else if(item.type === '合同评审表'){
					this.form_Lista = create_hetongpingshen_list(res.data.data)
					this.get_img(this.form_Lista.enclosure_id)
				}else if(item.type === '请款单'){
					this.form_Lista = create_qingkuandan_list(res.data.data)
					this.get_img(this.form_Lista.img)
				}else if(item.type === '申请公章'){
					this.form_Lista = create_gongzhang_list(res.data.data)
				}else if(item.type === '请购单'){
					this.form_Lista = create_qinggoudan_list(res.data.data)
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
		get_img(enclosure_id) {
			if(enclosure_id === '0'){
				return
			}
			let param = new URLSearchParams();
			param.append("enclosure_id", enclosure_id);
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
		},
		navCli(index){
			this.nowType = index+1
			if(index===0) {
				this.handle_time_show=false
				this.approval_process=false
				this.ilaunched=true
				this.handle_show=true
			}
			if(index===1) {
				this.handle_time_show=true
				this.approval_process=true
				this.ilaunched=true
				this.handle_show=false
			}
			if(index===2) {
				this.handle_time_show=false
				this.approval_process=true
				this.ilaunched=false
				this.handle_show = false
			}
			this.currentIndex = index
			this._getExamList()
		},
		closeMenu(){
			this.menuShow=false
		},
		_getExamList(){
			let param = new URLSearchParams();
			param.append("uid",this.user.uid);
			param.append("type",this.nowType);
			param.append("each",'20');
			param.append("company_id",this.nowCompanyId);
			this.$http.post("/index/Mobile/approval/see_approval_list",param)
			.then((res)=>{
				let arr=[]
				res.data.data.forEach((item)=>{
					arr.push(create_exam_list(item))
				})
				this.untreated=arr
			})
		}
	},
	watch:{
		nowCompanyId(){
			this._getExamList()
		}
	}
}
</script>

<style lang="scss" scoped>

.exam_wrapper{
	width: 100%;
	height: 100%;
	.form_wrapper{
		width: 556px;
		overflow: hidden;
		.top{
			width: 100%;
			display: block;
			position: relative;
			>i{
				position: absolute;
				top: 10px;
				left: 10px;
				cursor: pointer;
			}
			.title{
				display: block;
				text-align: center;
				height: 30px;
				line-height: 30px;
			}
		}
		.form{
			padding: 10px;
			color: #999999;
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
					height: 50px;
					width: 80px;
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
			.qingdan_qinggou{
				font-size: 14px;
				padding: 4px 0;
				h4{
					color: #409EFF;
					font-size: 15px;
					margin: 2px 0px;
				}
				p{
					display: inline-block;
					min-width:180px;
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
	}
	.exam{
		width: 560px;
		overflow: hidden;
		.list{
			width: 100%;
			ul{
				padding: 4px;
				li{
					color: #2D2F33;
					font-size: 14px;

					border-bottom: 1px solid #3487E2;
					span{
						line-height: 18px;
					}
					.avatar{
						display: inline-block;
						vertical-align: top;
						margin-top: 4px;
						img{
							width: 30px;
							height: 30px;
							border-radius: 50%;
							display: block;
						}
					}

					.edit{
						display: inline-block;
						float: right;
						margin-right: 20px;
						margin-top:30px;
						cursor: pointer;
						span{
							font-size: 14px;
							border: 1px solid #3487E2;
							padding: 4px 10px;
						}
					}
					.content{
						padding: 4px 0;
						display: inline-block;
						/*margin-left: 38px;*/
					}
				}
			}
		}
		.nav{
			width: 100%;
			height: 30px;
			ul{
				display:flex;
				li{
					line-height: 30px;
					flex: 1;
					text-align: center;
					cursor: pointer;
					&.active{
						background: #DDDDDD;
					}
					span{
						font-size: 12px;
					}
				}
			}
		}

	}
}

</style>

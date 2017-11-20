<template>
	<div class="add_approval_wrapper">
		<div class="add_approval">
			<div class="nav">
				<ul>
					<li v-for="(item,index) in nav" :class="{'active': index == navIndex}" @click="change_nav(index)">
						{{item}}
					</li>
				</ul>
			</div>
			<div class="form">
				<div class="qingkuan" v-show="qingkuan_show">
					<el-form :model="qkd_ruleForm" :rules="rules" ref="qkd_ruleForm" label-width="150px" class="demo-qkd_ruleForm">
						<el-form-item label="工程名称" prop="project_name">
							<el-input v-model="qkd_ruleForm.project_name"></el-input>
						</el-form-item>
						<el-form-item label="合同名称" prop="contract_name">
							<el-input v-model="qkd_ruleForm.contract_name"></el-input>
						</el-form-item>
						<el-form-item label="请款人姓名" prop="user_name">
							<el-input v-model="qkd_ruleForm.user_name" @focus="request_leader"></el-input>
						</el-form-item>
						<el-form-item label="联系方式" prop="phone">
							<el-input v-model="qkd_ruleForm.phone"></el-input>
						</el-form-item>
						<el-form-item label="项目负责人(部门经理)">
							<el-input v-model="qkd_ruleForm.project_manager_name" @focus="qkd_leader"></el-input>
						</el-form-item>
						<el-form-item label="银行账户名称" prop="bank_name">
							<el-input v-model="qkd_ruleForm.bank_name"></el-input>
						</el-form-item>
						<el-form-item label="工种" prop="work_type">
							<el-input v-model="qkd_ruleForm.work_type"></el-input>
						</el-form-item>
						<el-form-item label="开户行地址" prop="bank_address">
							<el-input v-model="qkd_ruleForm.bank_address"></el-input>
						</el-form-item>
						<el-form-item label="合同金额" prop="subtotal">
							<el-input v-model="qkd_ruleForm.subtotal"></el-input>
						</el-form-item>
						<el-form-item label="本次请款金额" prop="request_subtotal">
							<el-input v-model="qkd_ruleForm.request_subtotal"></el-input>
						</el-form-item>
						<el-form-item label="收款人姓名" prop="draw_money_name">
							<el-input v-model="qkd_ruleForm.draw_money_name"></el-input>
						</el-form-item>
						<el-form-item label="请款内容" prop="request_content">
							<el-input type="textarea" v-model="qkd_ruleForm.request_content"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitForm('qkd_ruleForm')">立即创建</el-button>
							<el-button @click="resetForm('qkd_ruleForm')">重置</el-button>
						</el-form-item>
					</el-form>
					<div class="person" v-if="personShow" ref="person">
						<div class="close el-icon-circle-close" @click="closePersonList"></div>
						<div class="personList" id="person">
							<ul>
								<li v-for="(item,index) in comPersonList" @click="choosePerson(item,index)" :key="index">
									<div class="avatar">
										<img :src="item.avatar" alt="" />
									</div>
									<div class="content">
										<span class="name">{{item.username}}</span>
										<span class="phone">{{item.phone}}</span>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="qinggou" v-show="qinggou_show">
					<el-form :model="qgd_ruleForm" :rules="qgd_rules" ref="qgd_ruleForm" label-width="150px" class="demo-qgd_ruleForm">
						<el-form-item label="是否加入月计划" prop="is_add_plan">
							<el-radio-group v-model="qgd_ruleForm.is_add_plan">
								<el-radio label="0">是</el-radio>
								<el-radio label="1">否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="是否应急" prop="is_urgent">
							<el-radio-group v-model="qgd_ruleForm.is_urgent">
								<el-radio label="0">是</el-radio>
								<el-radio label="1">否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="请购部门" prop="request_buy_department">
							<el-select v-model="qgd_ruleForm.request_buy_department" placeholder="请选择请购部门">
								<el-option :label="item.department_name" :value="item.department_name" v-for="item in comDepartList"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="工程负责人" prop="contract_responsible">
							<el-input v-model="qgd_ruleForm.contract_responsible" @focus="pro_leader()"></el-input>
						</el-form-item>
						<el-form-item label="负责人联系方式" prop="responsible_tel">
							<el-input v-model="qgd_ruleForm.responsible_tel"></el-input>
						</el-form-item>
						<el-form-item label="收货人姓名" prop="consignee">
							<el-input v-model="qgd_ruleForm.consignee" @focus="rec_leader()"></el-input>
						</el-form-item>
						<el-form-item label="收货人联系方式" prop="consignee_phone">
							<el-input v-model="qgd_ruleForm.consignee_phone"></el-input>
						</el-form-item>
						<el-form-item label="采购负责人" prop="buy_person">
							<el-input v-model="qgd_ruleForm.buy_person" @focus="buy_leader"></el-input>
						</el-form-item>
						<el-form-item label="采购负责人联系方式" prop="buy_person_phone">
							<el-input v-model="qgd_ruleForm.buy_person_phone"></el-input>
						</el-form-item>
						<el-form-item label="项目负责人(部门经理)">
							<el-input v-model="qgd_ruleForm.project_manager_name" @focus="qgd_leader"></el-input>
						</el-form-item>
						<el-form-item label="到货时间" prop="arrival_time">
							<el-date-picker type="date" v-model="qgd_ruleForm.arrival_time" style="width: 100%;"></el-date-picker>
						</el-form-item>
						<el-form-item label="合同" prop="contract_id">
							<el-input v-model="qgd_ruleForm.contract_id"></el-input>
						</el-form-item>
						<el-form-item label="合计" prop="total">
							<el-input v-model="qgd_ruleForm.total"></el-input>
						</el-form-item>
						<el-form-item label="请购工程地址" prop="request_contract_address">
							<el-input v-model="qgd_ruleForm.request_contract_address"></el-input>
						</el-form-item>
						<el-form-item label="请购内容" prop="content">
							<el-input v-model="qgd_ruleForm.content"></el-input>
						</el-form-item>

						<el-form-item label="收货地址" prop="receive_address">
							<el-input type="textarea" v-model="qgd_ruleForm.receive_address"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitForm_qgd('qgd_ruleForm')">立即创建</el-button>
							<el-button @click="resetForm('qgd_ruleForm')">重置</el-button>
						</el-form-item>
					</el-form>
					<div class="person" v-if="personShow" ref="person" id="person">
						<div class="close el-icon-circle-close" @click="closePersonList"></div>
						<div class="personList">
							<ul>
								<li v-for="(item,index) in comPersonList" @click="choosePerson(item,index)" :key="index">
									<div class="avatar">
										<img :src="item.avatar" alt="" />
									</div>
									<div class="content">
										<span class="name">{{item.name}}</span>
										<span class="phone">{{item.phone}}</span>
										<span class="depart">{{item.department_name}}</span>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="chengpijian" v-show="chengpijian_show">
					<el-form :model="cpj_ruleForm" :rules="cpj_rules" ref="cpj_ruleForm" label-width="150px" class="demo-cpj_ruleForm">
						<el-form-item label="呈批部门" prop="department_name">
							<el-select v-model="cpj_ruleForm.department_name" placeholder="请选择呈批部门">
								<el-option v-for="item in comDepartList" :value="item.department_name"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="呈批标题" prop="content">
							<el-input v-model="cpj_ruleForm.content"></el-input>
						</el-form-item>
						<el-form-item label="文件编号" prop="chengpi_num">
							<el-input v-model="cpj_ruleForm.chengpi_num"></el-input>
						</el-form-item>
						<el-form-item label="主题内容" prop="title">
							<el-input v-model="cpj_ruleForm.title"></el-input>
						</el-form-item>
						<el-form-item label="项目负责人">
							<el-input v-model="cpj_ruleForm.project_manager_name" @focus="cpj_leader"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitForm_cpj('qkd_ruleForm')">立即创建</el-button>
							<el-button @click="resetForm('qkd_ruleForm')">重置</el-button>
						</el-form-item>
					</el-form>
					<div class="person" v-if="personShow" ref="person">
						<div class="close el-icon-circle-close" @click="closePersonList"></div>
						<div class="personList" id="person">
							<ul>
								<li v-for="(item,index) in comPersonList" @click="choosePerson(item,index)" :key="index">
									<div class="avatar">
										<img :src="item.avatar" alt="" />
									</div>
									<div class="content">
										<span class="name">{{item.username}}</span>
										<span class="phone">{{item.phone}}</span>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="pingshenbiao" v-show="pingshenbiao_show">
					<el-form :model="psb_ruleForm" :rules="psb_rules" ref="psb_ruleForm" label-width="150px" class="demo-psb_ruleForm">
						<el-form-item label="工程名称" prop="contract_name">
							<el-input v-model="psb_ruleForm.contract_name"></el-input>
						</el-form-item>
						<el-form-item label="合同名称" prop="contract_name_new">
							<el-input v-model="psb_ruleForm.contract_name_new"></el-input>
						</el-form-item>
						<el-form-item label="合同编号" prop="contract_id">
							<el-input v-model="psb_ruleForm.contract_id"></el-input>
						</el-form-item>
						<el-form-item label="甲方" prop="a_name">
							<el-input v-model="psb_ruleForm.a_name"></el-input>
						</el-form-item>
						<el-form-item label="乙方" prop="b_name">
							<el-input v-model="psb_ruleForm.b_name"></el-input>
						</el-form-item>
						<el-form-item label="执行人" prop="executor">
							<el-input v-model="psb_ruleForm.executor"></el-input>
						</el-form-item>
						<el-form-item label="单价" prop="prive">
							<el-input v-model="psb_ruleForm.prive"></el-input>
						</el-form-item>
						<el-form-item label="总价" prop="total_prive">
							<el-input v-model="psb_ruleForm.total_prive"></el-input>
						</el-form-item>
						<el-form-item label="与投标价差异" prop="difference">
							<el-input v-model="psb_ruleForm.difference"></el-input>
						</el-form-item>
						<el-form-item label="付款方式" prop="pay_method">
							<el-input v-model="psb_ruleForm.pay_method"></el-input>
						</el-form-item>
						<el-form-item label="到货时间" prop="arrive_time">
							<el-date-picker type="date" v-model="psb_ruleForm.arrive_time" style="width: 100%;"></el-date-picker>
						</el-form-item>
						<el-form-item label="完工时间" prop="end_time">
							<el-date-picker type="date" v-model="psb_ruleForm.end_time" style="width: 100%;"></el-date-picker>
						</el-form-item>
						<el-form-item label="项目负责人(部门经理)">
							<el-input v-model="psb_ruleForm.project_manager_name" @focus="psb_leader"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitForm_psb('psb_ruleForm')">立即创建</el-button>
							<el-button @click="resetForm('psb_ruleForm')">重置</el-button>
						</el-form-item>
					</el-form>
					<div class="person" v-if="personShow" ref="person">
						<div class="close el-icon-circle-close" @click="closePersonList"></div>
						<div class="personList" id="person">
							<ul>
								<li v-for="(item,index) in comPersonList" @click="choosePerson(item,index)" :key="index">
									<div class="avatar">
										<img :src="item.avatar" alt="" />
									</div>
									<div class="content">
										<span class="name">{{item.username}}</span>
										<span class="phone">{{item.phone}}</span>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { prefixStyle } from '@/common/js/dom'
	import { mapGetters } from 'vuex'
	const transform = prefixStyle('transform')
	const transitionDuration = prefixStyle('transitionDuration')
	export default {
		data() {
			return {
				nav: ['请款单', '请购单', '呈批件', '合同审核表'],
				navIndex: 0,
				radio: '1’',
				personShow: false,
				qingkuan_show: false,
				qinggou_show: false,
				chengpijian_show: false,
				pingshenbiao_show:false,
				insertType: 0,
				qkd_ruleForm: {
					contract_name: '',
					project_name: '',
					user_name: '',
					phone: '',
					bank_name: '',
					work_type: '',
					bank_address: '',
					subtotal: '',
					request_subtotal: '',
					request_content: '',
					draw_money_name: '',
					project_manager_name: '',
					project_manager: {}
				},
				qgd_ruleForm: {
					is_add_plan: '0',
					is_urgent: '1',
					request_buy_department: '',
					request_contract_address: '',
					content: '',
					contract_responsible: '',
					responsible_tel: '',
					arrival_time: '',
					consignee: '',
					consignee_phone: '',
					contract_id: '',
					total: '',
					buy_person: '',
					buy_person_phone: '',
					consignee_uid: '',
					receive_address: '',
					project_manager_name: '',
					project_manager: {}
				},
				cpj_ruleForm: {
					department_id: '',
					department_name: '',
					content: '',
					chengpi_num: '',
					title: '',
					project_manager_name: '',
					project_manager: {}
				},
				psb_ruleForm: {
					contract_name:'',
					contract_id:'',
					a_name: '',
					b_name: '',
					prive: '',
					total_prive: '',
					difference: '',
					pay_method: '',
					arrive_time:'',
					end_time:'',
					executor:'',
					contract_name_new:'',
					project_manager: {}
				},
				psb_rules: {
					contract_name: [{
						required: true,
						message: '请填写工程名称',
						trigger: 'change'
					}],
					contract_id: [{
						required: true,
						message: '请填写合同编号',
						trigger: 'blur'
					}],
					a_name: [{
						required: true,
						message: '请填写甲方姓名',
						trigger: 'blur'
					}],
					b_name: [{
						required: true,
						message: '请填写乙方姓名',
						trigger: 'blur'
					}],
					prive: [{
						required: true,
						message: '请填写单价',
						trigger: 'blur'
					}],
					total_prive: [{
						required: true,
						message: '请填写总价',
						trigger: 'blur'
					}],
					difference: [{
						required: true,
						message: '请填写与投标价格差异',
						trigger: 'blur'
					}],
					pay_method: [{
						required: true,
						message: '请填写	付款方式',
						trigger: 'blur'
					}],
					arrive_time: [{
						type: 'date',
						required: true,
						message: '请填写到货时间',
						trigger: 'change'
					}],
					end_time: [{
						type: 'date',
						required: true,
						message: '请填写	完工时间',
						trigger: 'change'
					}],
					executor: [{
						required: true,
						message: '请填写	执行人',
						trigger: 'blur'
					}],
					contract_name_new: [{
						required: true,
						message: '请填写合同名称',
						trigger: 'blur'
					}],
				},
				cpj_rules: {
					department_name: [{
						required: true,
						message: '请填写呈批部门',
						trigger: 'change'
					}],
					content: [{
						required: true,
						message: '请填写主题内容',
						trigger: 'blur'
					}],
					chengpi_num: [{
						required: true,
						message: '请填写文件编号',
						trigger: 'blur'
					}],
					title: [{
						required: true,
						message: '请填写呈批标题',
						trigger: 'blur'
					}]
				},
				qgd_rules: {
					request_buy_department: [{
						required: true,
						message: '请填写请购部门',
						trigger: 'change'
					}],
					request_contract_address: [{
						required: true,
						message: '请填写请购工程地址',
						trigger: 'blur'
					}],
					content: [{
						required: true,
						message: '请填写请购内容',
						trigger: 'blur'
					}],
					contract_responsible: [{
						required: true,
						message: '请填写工程负责人',
						trigger: 'change'
					}],
					responsible_tel: [{
						required: true,
						message: '请填写负责人联系方式',
						trigger: 'change'
					}],
					arrival_time: [{
						type: 'date',
						required: true,
						message: '请填写到货时间',
						trigger: 'change'
					}],
					consignee: [{
						required: true,
						message: '请填写收货人姓名',
						trigger: 'change'
					}],
					consignee_phone: [{
						required: true,
						message: '请填写收货人联系方式',
						trigger: 'change'
					}],
					contract_id: [{
						required: true,
						message: '请填写本次请款金额',
						trigger: 'blur'
					}],
					total: [{
						required: true,
						message: '请填写合计',
						trigger: 'blur'
					}],
					buy_person: [{
						required: true,
						message: '请填写采购负责人',
						trigger: 'change'
					}],
					buy_person_phone: [{
						required: true,
						message: '请填写采购负责人联系方式',
						trigger: 'change'
					}],
					receive_address: [{
						required: true,
						message: '请填写收货地址',
						trigger: 'blur'
					}]
				},
				rules: {
					contract_name: [{
						required: true,
						message: '请填写合同名称',
						trigger: 'blur'
					}],
					project_name: [{
						required: true,
						message: '请填写项目名称',
						trigger: 'blur'
					}],
					user_name: [{
						required: true,
						message: '请填写请款人姓名',
						trigger: 'chagne'
					}],
					phone: [{
						required: true,
						message: '请填写联系方式',
						trigger: 'chagne'
					}],
					bank_name: [{
						required: true,
						message: '请填写银行账户名称',
						trigger: 'blur'
					}],
					work_type: [{
						required: true,
						message: '请填写工种',
						trigger: 'blur'
					}],
					bank_address: [{
						required: true,
						message: '请填写开户行地址',
						trigger: 'blur'
					}],
					subtotal: [{
						required: true,
						message: '请填写合同金额',
						trigger: 'blur'
					}],
					request_subtotal: [{
						required: true,
						message: '请填写本次请款金额',
						trigger: 'blur'
					}],
					request_content: [{
						required: true,
						message: '请填写请求内容',
						trigger: 'blur'
					}],
					draw_money_name: [{
						required: true,
						message: '请填写收款人姓名',
						trigger: 'blur'
					}]
				}
			}
		},
		computed: {
			...mapGetters([
				'comPersonList',
				'user',
				'nowCompanyId',
				'comDepartList'

			])
		},
		methods: {
			request_leader() {
				this.personShow = true
				this.insertType = 0
			},
			pro_leader() {
				this.personShow = true
				this.insertType = 1
			},
			rec_leader() {
				this.personShow = true
				this.insertType = 2
			},
			buy_leader() {
				this.personShow = true
				this.insertType = 3
			},
			cpj_leader() {
				this.personShow = true
				this.insertType = 4
			},
			qgd_leader() {
				this.personShow = true
				this.insertType = 5
			},
			qkd_leader() {
				this.personShow = true
				this.insertType = 6
			},
			psb_leader(){
				this.personShow = true
				this.insertType = 7
			},
			change_nav(index) {
				this.navIndex = index
				this.qingkuan_show = false
				this.qinggou_show = false
				this.chengpijian_show = false
				this.pingshenbiao_show = false
				if(index === 0){
					this.qingkuan_show = true
				}else if(index === 1){
					this.qinggou_show = true
				}
				else if(index === 2){
					this.chengpijian_show = true
				}
				else if(index === 3){
					this.pingshenbiao_show = true
				}
			},
			closePersonList() {
				this.personShow = false
			},
			choosePerson(item, index) {
				if(this.insertType === 0) {
					this.qkd_ruleForm.user_name = item.name
					this.qkd_ruleForm.phone = item.phone
				} else if(this.insertType === 1) {
					this.qgd_ruleForm.contract_responsible = item.name
					this.qgd_ruleForm.responsible_tel = item.phone
				} else if(this.insertType === 2) {
					this.qgd_ruleForm.consignee_uid = item.uid
					this.qgd_ruleForm.consignee = item.name
					this.qgd_ruleForm.consignee = item.name
					this.qgd_ruleForm.consignee_phone = item.phone
				} else if(this.insertType === 3) {
					this.qgd_ruleForm.buy_person_uid = item.uid
					this.qgd_ruleForm.buy_person = item.name
					this.qgd_ruleForm.buy_person_phone = item.phone
				} else if(this.insertType === 4) {
					this.cpj_ruleForm.project_manager_name = item.name
					this.$set(this.cpj_ruleForm.project_manager, 'uid', item.uid)
				} else if(this.insertType === 5) {
					this.qgd_ruleForm.project_manager_name = item.name
					this.$set(this.qgd_ruleForm.project_manager, 'uid', item.uid)
				} else if(this.insertType === 6) {
					this.qkd_ruleForm.project_manager_name = item.name
					this.$set(this.qkd_ruleForm.project_manager, 'uid', item.uid)
				} else if(this.insertType === 7) {
					this.psb_ruleForm.project_manager_name = item.name
					this.$set(this.psb_ruleForm.project_manager, 'uid', item.uid)
				}
				this.personShow = false

			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.submit()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			submitForm_qgd(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.qgd_submit()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			submitForm_cpj(formName) {
				this.comDepartList.forEach((item) => {
					if(item.department_name === this.cpj_ruleForm.department_name) {
						this.cpj_ruleForm.department_id = item.department_id
					}
				})
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.cpj_submit()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			submitForm_psb(formName){
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.cpj_submit()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			created() {
				//		    	console.log(this.comPersonList)
			},
			psb_submit() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("company_id", this.nowCompanyId);
				param.append("a_name", this.psb_ruleForm.a_name);
				param.append("b_name", this.psb_ruleForm.b_name	);
				param.append("prive", this.psb_ruleForm.prive);
				param.append("total_prive", this.psb_ruleForm.total_prive);
				param.append("difference", this.psb_ruleForm.difference);
				param.append("pay_method", this.psb_ruleForm.pay_method);
				param.append("contract_name", this.psb_ruleForm.contract_name);
				param.append("project_manager", this.psb_ruleForm.JSON.stringify(this.psb_ruleForm.project_manager));
				param.append("arrive_time", this.psb_ruleForm.arrive_time);
				param.append("end_time", this.psb_ruleForm.end_time);
				param.append("executor", this.psb_ruleForm.executor);
				param.append("contract_id", parseInt(this.psb_ruleForm.contract_id));
				param.append("contract_name_new", this.psb_ruleForm.contract_name_new);
				this.$http.post("/index/Mobile/approval/add_approval_conyract_company_new", param)
					.then((res) => {
						console.log(res)
					})
			},
			cpj_submit() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("company_id", this.nowCompanyId);
				param.append("department_id", this.cpj_ruleForm.department_id);
				param.append("content", this.cpj_ruleForm.content);
				param.append("chengpi_num", parseInt(this.cpj_ruleForm.chengpi_num));
				param.append("title", this.cpj_ruleForm.title);
				param.append("project_manager", JSON.stringify(this.cpj_ruleForm.project_manager));
				this.$http.post("/index/Mobile/approval/add_chengpi", param)
					.then((res) => {
						console.log(res)
					})
			},
			qgd_submit() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("company_id", this.nowCompanyId);
				param.append("request_buy_department", this.qgd_ruleForm.request_buy_department);
				param.append("is_add_plan", this.qgd_ruleForm.is_add_plan);
				param.append("request_contract_address", this.qgd_ruleForm.request_contract_address);
				param.append("is_urgent", this.qgd_ruleForm.is_urgent);
				param.append("content", this.qgd_ruleForm.content);
				param.append("contract_responsible", this.qgd_ruleForm.contract_responsible);
				param.append("responsible_tel", this.qgd_ruleForm.responsible_tel);
				param.append("arrival_time", this.qgd_ruleForm.arrival_time);
				param.append("consignee", this.qgd_ruleForm.consignee);
				param.append("consignee_phone", this.qgd_ruleForm.consignee_phone);
				param.append("total", this.qgd_ruleForm.total);
				param.append("receive_address", this.qgd_ruleForm.receive_address);
				param.append("buy_person", this.qgd_ruleForm.buy_person);
				param.append("buy_person_phone", this.qgd_ruleForm.buy_person_phone);
				param.append("consignee_uid", this.qgd_ruleForm.request_buy_department);
				param.append("buy_person_uid", this.qgd_ruleForm.request_buy_department);
				param.append("request_buy_department", this.qgd_ruleForm.request_buy_department);
				param.append("request_buy_department", this.qgd_ruleForm.request_buy_department);
				param.append("project_manager", JSON.stringify(this.qgd_ruleForm.project_manager));
				param.append("type", 2);
				this.$http.post("/index/Mobile/approval/add_request_buy", param)
					.then((res) => {
						console.log(res)
					})
			},
			submit() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("contract_name", this.qkd_ruleForm.contract_name);
				param.append("project_name", this.qkd_ruleForm.project_name);
				param.append("company_id", this.nowCompanyId);
				param.append("request_name", this.qkd_ruleForm.request_name);
				param.append("worker_type", this.qkd_ruleForm.worker_type);
				param.append("phone", this.qkd_ruleForm.phone);
				param.append("account_name", this.qkd_ruleForm.account_name);
				param.append("bank_card", this.qkd_ruleForm.bank_card);
				param.append("bank_address", this.qkd_ruleForm.bank_address);
				param.append("subtotal", this.qkd_ruleForm.subtotal);
				param.append("request_subtotal", this.qkd_ruleForm.request_subtotal);
				param.append("request_content", this.qkd_ruleForm.request_content);
				param.append("type", '2');
				param.append("draw_money_name", this.qkd_ruleForm.draw_money_name);
				param.append("project_manager", JSON.stringify(this.qkd_ruleForm.project_manager));
				this.$http.post("/index/Mobile/approval/add_request_money", param)
					.then((res) => {
						console.log(res)
					})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add_approval_wrapper {
		width: 558px;
		border: 1px solid #ddd;
		.add_approval {
			/*padding: 8px 10px;*/
			.nav {
				ul {
					li {
						display: inline-block;
						cursor: pointer;
						height: 35px;
						line-height: 35px;
						color: #0082CB;
						font-size: 12px;
						padding: 0 10px;
						&.active {
							background: #f9f9f9;
							color: #333333;
						}
					}
				}
			}
			.form {
				background-color: #f9f9f9;
				padding: 10px;
				.qingkuan {
					/*margin-top: 10px;*/
					table {
						background: #FFFFFF;
						td {
							border: 1px solid #ddd;
							text-indent: 14px;
							line-height: 36px;
							font-size: 12px;
							color: #666;
							.inputMid {
								width: 140px;
								height: 26px;
								border: none;
								outline: none;
							}
							i {
								display: inline-block;
								font-size: 18px;
								color: #3487E2;
								line-height: 1;
								position: relative;
								top: 2px;
							}
							input {
								width: 90%;
								height: 26px;
								border: none;
								outline: none;
							}
							.fbtInput {
								width: 400px;
								height: 26px;
								border: none;
								outline: none;
								font-size: 12px;
							}
						}
					}
					.person {
						position: absolute;
						left: 350px;
						top: 200px;
						z-index: 10;
						.close {
							position: absolute;
							right: 2px;
							top: 2px;
							color: #3487E2;
							&:hover {
								color: #FA5555;
							}
						}
						.personList {
							width: 200px;
							height: 280px;
							background: rgb(241, 241, 241);
							border: 1px solid #3487E2;
							overflow-y: scroll;
							-webkit-border-radius: 4px;
							-moz-border-radius: 4px;
							border-radius: 4px;
							ul {
								margin-top: 20px;
								padding: 4px;
								li {
									width: 100%;
									height: 60px;
									border-bottom: 1px solid #409EFF;
									color: #2D2F33;
									cursor: default;
									.avatar {
										display: inline-block;
										float: left;
										margin: 10px 6px 0 6px;
										img {
											display: block;
											width: 40px;
											height: 40px;
											border-radius: 50%;
										}
									}
									.content {
										display: inline-block;
										float: left;
										margin-left: 4px;
										span {
											display: block;
											font-size: 12px;
											height: 20px;
											line-height: 20px;
										}
									}
								}
							}
						}
					}
				}
				.qinggou {
					.el-form-item[data-v-1e3f67aa] {
						&:nth-child(1) {
							margin-bottom: 10px;
						}
						&:nth-child(2) {
							margin-bottom: 10px;
						}
					}
					.person {
						position: absolute;
						left: 350px;
						top: 400px;
						z-index: 10;
						.close {
							position: absolute;
							right: 2px;
							top: 2px;
							color: #3487E2;
							&:hover {
								color: #FA5555;
							}
						}
						.personList {
							width: 200px;
							height: 280px;
							background: rgb(241, 241, 241);
							border: 1px solid #3487E2;
							overflow-y: scroll;
							-webkit-border-radius: 4px;
							-moz-border-radius: 4px;
							border-radius: 4px;
							ul {
								margin-top: 20px;
								padding: 4px;
								li {
									width: 100%;
									height: 60px;
									border-bottom: 1px solid #409EFF;
									color: #2D2F33;
									cursor: default;
									.avatar {
										display: inline-block;
										float: left;
										margin: 10px 6px 0 6px;
										img {
											display: block;
											width: 40px;
											height: 40px;
											border-radius: 50%;
										}
									}
									.content {
										display: inline-block;
										float: left;
										margin-left: 4px;
										span {
											display: block;
											font-size: 12px;
											height: 20px;
											line-height: 20px;
										}
									}
								}
							}
						}
					}
				}
				.chengpijian {
					.person {
						position: absolute;
						left: 350px;
						top: 400px;
						z-index: 10;
						.close {
							position: absolute;
							right: 2px;
							top: 2px;
							color: #3487E2;
							&:hover {
								color: #FA5555;
							}
						}
						.personList {
							width: 200px;
							height: 280px;
							background: rgb(241, 241, 241);
							border: 1px solid #3487E2;
							overflow-y: scroll;
							-webkit-border-radius: 4px;
							-moz-border-radius: 4px;
							border-radius: 4px;
							ul {
								margin-top: 20px;
								padding: 4px;
								li {
									width: 100%;
									height: 60px;
									border-bottom: 1px solid #409EFF;
									color: #2D2F33;
									cursor: default;
									.avatar {
										display: inline-block;
										float: left;
										margin: 10px 6px 0 6px;
										img {
											display: block;
											width: 40px;
											height: 40px;
											border-radius: 50%;
										}
									}
									.content {
										display: inline-block;
										float: left;
										margin-left: 4px;
										span {
											display: block;
											font-size: 12px;
											height: 20px;
											line-height: 20px;
										}
									}
								}
							}
						}
					}
				}
				.pingshenbiao {
					.person {
						position: absolute;
						left: 346px;
						top: 574px;
						z-index: 10;
						.close {
							position: absolute;
							right: 2px;
							top: 2px;
							color: #3487E2;
							&:hover {
								color: #FA5555;
							}
						}
						.personList {
							width: 200px;
							height: 280px;
							background: rgb(241, 241, 241);
							border: 1px solid #3487E2;
							overflow-y: scroll;
							-webkit-border-radius: 4px;
							-moz-border-radius: 4px;
							border-radius: 4px;
							ul {
								margin-top: 20px;
								padding: 4px;
								li {
									width: 100%;
									height: 60px;
									border-bottom: 1px solid #409EFF;
									color: #2D2F33;
									cursor: default;
									.avatar {
										display: inline-block;
										float: left;
										margin: 10px 6px 0 6px;
										img {
											display: block;
											width: 40px;
											height: 40px;
											border-radius: 50%;
										}
									}
									.content {
										display: inline-block;
										float: left;
										margin-left: 4px;
										span {
											display: block;
											font-size: 12px;
											height: 20px;
											line-height: 20px;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	
	.el-radio+.el-radio {
		margin-left: 10px;
	}
	
	.el-form-item {
		margin-bottom: 30px;
	}
</style>
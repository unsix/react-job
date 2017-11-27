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
				<div class="qingkuan" v-show="qingkuan_big_show">
					<!--请款列表展示-->
					<div class="content" v-for="item in untreated" v-show="qingkuan_one_show">
						<div class="creatTime">
							<span>{{item.add_time}}</span>
						</div>
						<div class="type">
							<span>类型：{{item.type}}</span>
						</div>
						<div class="title">
							<span>标题：{{item.title}}</span>
						</div>
						<div class="process">
							<span>审批进程：</span><span>{{item.approval_state}}</span>
						</div>
						<div class="button">
							<span @click="user_qingkuan(item)">使用</span>
							<span @click="view_qingkuan(item)">查看</span>
						</div>
					</div>
					<!--请款模板详情查看-->
					<div class="template_view" v-show="template_view_show">
						<!--呈批件展示-->
						<div class="form" name="呈批件" v-if="chengpijian_if">
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
								<span>图片附件：</span>
								<a v-for="item in form_Lista.img_list" v-if="form_Lista.img_list">
									<img :src="item" alt="" @click="ctrl_pic_show" />
								</a>
							</div>
							<div>
								<span>发起人：</span><span>{{form_Listb.found_name}}</span>
							</div>
							<div>
								<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #409EFF;">{{item}}</span>
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
							<div @click="user_qingkuan(form_Lista)" class="user">使用</div>
						</div>
						<!--合同评审表展示-->
						<div class="form" name="合同评审表" v-if="pingshenbiao_if">
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
								<span>图片附件：</span>
								<a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list">
									<img :src="item" alt="" @click="ctrl_pic_show(index)" />
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
							<div @click="user_qingkuan(form_Lista)" class="user">使用</div>
						</div>
						<!--请购单展示-->
						<div class="form" name="请购单" v-if="qinggoudan_if">
							<div>
								<span>工程名称：</span><span>{{form_Lista.contract_name_new}}</span>
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
								<span>采购执行人联系方式</span><span>{{form_Lista.buy_person_phone}}</span>
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
								<span>项目负责人(部门经理)：</span><span>{{form_Lista.consignee_phone}}</span>
							</div>
							<div v-for="item in form_Lista.content" class="qingdan_qinggou">
								<h4>请购清单</h4>
								<p>请购名称：<span>{{item.name}}</span></p>
								<p>规格：<span>{{item.spec}}</span></p>
								<p>型号<span>{{item.model}}</span></p>
								<p>单位：<span>{{item.unit}}</span></p>
								<p>数量<span>{{item.num}}</span></p>
								<p>预计单价￥<span>{{item.price}}</span></p>
								<p>总额￥<span>{{item.subtotal}}</span></p>
								<p>申报采购原因及用途<span>{{item.purpose}}</span></p>
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
							<div @click="user_qingkuan(form_Lista)" class="user">使用</div>
							<div @click="return_qingkuan(form_Lista)" class="user">返回</div>

						</div>
					</div>
					<el-form v-show="qingkuan_show" :model="qkd_ruleForm" :rules="rules" ref="qkd_ruleForm" label-width="150px" class="demo-qkd_ruleForm">
						<el-form-item label="工程名称" prop="contract_name">
							<el-input v-model="qkd_ruleForm.contract_name"></el-input>
						</el-form-item>
						<el-form-item label="合同名称" prop="contract_name_new">
							<el-input v-model="qkd_ruleForm.contract_name_new"></el-input>
						</el-form-item>
						<el-form-item label="请款人姓名" prop="request_name">
							<el-input v-model="qkd_ruleForm.request_name" @focus="request_leader"></el-input>
						</el-form-item>
						<el-form-item label="联系方式" prop="phone">
							<el-input v-model="qkd_ruleForm.phone"></el-input>
						</el-form-item>
						<el-form-item label="项目负责人(部门经理)">
							<el-input v-model="qkd_ruleForm.project_manager_name" @focus="qkd_leader"></el-input>
						</el-form-item>
						<el-form-item label="银行账户名称" prop="account_name">
							<el-input v-model="qkd_ruleForm.account_name"></el-input>
						</el-form-item>
						<el-form-item label="工种" prop="worker_type">
							<el-input v-model="qkd_ruleForm.worker_type"></el-input>
						</el-form-item>
						<el-form-item label="开户行地址" prop="bank_address">
							<el-input v-model="qkd_ruleForm.bank_address"></el-input>
						</el-form-item>
						<el-form-item label="银行卡号" prop="bank_card">
							<el-input v-model="qkd_ruleForm.bank_card"></el-input>
						</el-form-item>
						<el-form-item label="合同金额" prop="subtotal">
							<el-input v-model="qkd_ruleForm.subtotal"></el-input>
						</el-form-item>
						<el-form-item label="本次请款金额" prop="request_subtotal">
							<el-input v-model="qkd_ruleForm.request_subtotal"></el-input>
						</el-form-item>
						<el-form-item label="请款内容" prop="request_content">
							<el-input type="textarea" v-model="qkd_ruleForm.request_content"></el-input>
						</el-form-item>
						<el-form-item label="收款人姓名" prop="draw_money_name">
							<el-input v-model="qkd_ruleForm.draw_money_name"></el-input>
						</el-form-item>
						<el-form-item label="增减金额">
							<el-input v-model="qkd_ruleForm.gain_reduction_subtotal"></el-input>
						</el-form-item>
						<el-form-item label="请款次数">
							<el-input v-model="qkd_ruleForm.request_num"></el-input>
						</el-form-item>
						<el-form-item label="已领工程款">
							<el-input v-model="qkd_ruleForm.balance_subtotal"></el-input>
						</el-form-item>
						<el-form-item label="添加图片">
							<input name="token" type="hidden" :value="token">
							<input type="file" name="" id=""  @change="getPic($event)" multiple="multiple" accept="image/jpg, image/jpeg, image/png" />
						</el-form-item>
						<el-form-item label="添加文件">
							<input name="token" type="hidden" :value="token">
							<input type="file" name="" id=""  @change="getFile($event)" multiple="multiple" 
								accept="application/msword,	text/plain,	application/pdf,application/vnd.ms-excel,application/vnd.ms-powerpoint"/>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitForm_qkd('qkd_ruleForm')">立即创建</el-button>
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
										<span class="name">{{item.name}}</span>
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
								<el-option :label="item.department_name" :value="item.department_name" v-for="item in comDepartList" :key="item.department_id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="合同名称" prop="contract_name_new">
							<el-input v-model="qgd_ruleForm.contract_name_new"></el-input>
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
						<div class="add_qgd">添加清单条目 <i class="el-icon-circle-plus" @click="add_qgd"></i></div>
						<div v-for="(item,index) in qgd_ruleForm.add" class="new_qgd">
							<div class="close"><i class="el-icon-close" @click="close_qgd(item,index)"></i></div>
							<el-form label-width="150px">
								<el-form-item label="请购名称">
									<el-input v-model="item.name"></el-input>
								</el-form-item>
								<el-form-item label="申报采购原因及用途">
									<el-input v-model="item.purpose"></el-input>
								</el-form-item>
							</el-form>
							<el-form :inline="true" class="demo-form-inline">
								<el-form-item label="规格">
									<el-input v-model="item.spec"></el-input>
								</el-form-item>
								<el-form-item label="型号">
									<el-input v-model="item.model"></el-input>
								</el-form-item>
							</el-form>
							<el-form :inline="true" class="demo-form-inline">
								<el-form-item label="数量">
									<el-input v-model="item.num"></el-input>
								</el-form-item>
								<el-form-item label="单位">
									<el-select v-model="item.unit">
										<el-option :label="item" :value="item" v-for="item in unit" :key="item"></el-option>
									</el-select>
								</el-form-item>
							</el-form>
							<el-form :inline="true" class="demo-form-inline">
								<el-form-item label="单价">
									<el-input v-model="item.subtotal"></el-input>
								</el-form-item>
								<el-form-item label="总额">
									<el-input v-model="item.price"></el-input>
								</el-form-item>

							</el-form>
						</div>
						<el-form-item label="添加图片">
							<input name="token" type="hidden" :value="token">
							<input type="file" name="" id=""  @change="getPic($event)" multiple="multiple" accept="image/jpg, image/jpeg, image/png" />
						</el-form-item>
						<el-form-item label="添加文件">
							<input name="token" type="hidden" :value="token">
							<input type="file" name="" id=""  @change="getFile($event)" multiple="multiple" 
								accept="application/msword,	text/plain,	application/pdf,application/vnd.ms-excel,application/vnd.ms-powerpoint"/>
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
								<el-option v-for="item in comDepartList" :value="item.department_name" :key="item.department_id"></el-option>
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
						<el-form-item label="添加图片">
							<input name="token" type="hidden" :value="token">
							<input type="file" name="" id=""  @change="getPic($event)" multiple="multiple" accept="image/jpg, image/jpeg, image/png" />
						</el-form-item>
						<el-form-item label="添加文件">
							<input name="token" type="hidden" :value="token">
							<input type="file" name="" id=""  @change="getFile($event)" multiple="multiple" 
								accept="application/msword,	text/plain,	application/pdf,application/vnd.ms-excel,application/vnd.ms-powerpoint"/>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitForm_cpj('cpj_ruleForm')">立即创建</el-button>
							<el-button @click="resetForm('cpj_ruleForm')">重置</el-button>
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
										<span class="name">{{item.name}}</span>
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
						<el-form-item label="合同编号">
							<el-input v-model="psb_ruleForm.contract_id"></el-input>
						</el-form-item>
						<el-form-item label="备注">
							<el-input v-model="psb_ruleForm.remarks"></el-input>
						</el-form-item>
						<el-form-item label="项目负责人(部门经理)">
							<el-input v-model="psb_ruleForm.project_manager_name" @focus="psb_leader"></el-input>
						</el-form-item>
						<el-form-item label="添加图片">
							<input name="token" type="hidden" :value="token">
							<input type="file" name="" id=""  @change="getPic($event)" multiple="multiple" accept="image/jpg, image/jpeg, image/png" />
						</el-form-item>
						<el-form-item label="添加文件">
							<input name="token" type="hidden" :value="token">
							<input type="file" name="" id=""  @change="getFile($event)" multiple="multiple" 
								accept="application/msword,	text/plain,	application/pdf,application/vnd.ms-excel,application/vnd.ms-powerpoint"/>
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
										<span class="name">{{item.name}}</span>
										<span class="phone">{{item.phone}}</span>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="shenqinggongzhang" v-show="shenqinggongzhang_show">
					<el-form :model="sqgz_ruleForm" :rules="sqgz_rules" ref="sqgz_ruleForm" label-width="150px" class="demo-sqgz_ruleForm">
						<el-form-item label="用章部门" prop="departmental">
							<el-select v-model="sqgz_ruleForm.departmental" placeholder="请选择呈批部门">
								<el-option v-for="item in comDepartList" :value="item.department_name" :key="item.department_id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="申请人" prop="user_name">
							<el-input v-model="sqgz_ruleForm.user_name"></el-input>
						</el-form-item>
						<el-form-item label="项目负责人(部门经理)">
							<el-input v-model="sqgz_ruleForm.project_manager_name" @focus="sqgz_leader"></el-input>
						</el-form-item>
						<div class="add_sqgz">添加清单条目 <i class="el-icon-circle-plus" @click="add_sqgz"></i></div>
						<div>
							<el-form v-for="(item,index) in sqgz_ruleForm.add" label-width="150px" :key="item.seal_type">
								<div class="close"><i class="el-icon-close" @click="close_sqgz(item,index)"></i></div>
								<el-form-item label="印章类别">
									<el-radio-group v-model="item.seal_type">
										<el-radio label="1">公章</el-radio>
										<el-radio label="2">法人章</el-radio>
										<el-radio label="3">财务章</el-radio>
										<el-radio label="4">发票章</el-radio>
										<el-radio label="5">合同章</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="盖章事由">
									<el-input v-model="item.reason"></el-input>
								</el-form-item>
								<el-form-item label="资料名称">
									<el-input v-model="item.contract_name"></el-input>
								</el-form-item>
								<el-form-item label="数量">
									<el-input v-model="item.num"></el-input>
								</el-form-item>
								<el-form-item label="公司名称">
									<el-input v-model="item.name_company"></el-input>
								</el-form-item>
								<el-form-item label="备注">
									<el-input v-model="item.remarks"></el-input>
								</el-form-item>
							</el-form>
						</div>
						<el-form-item label="添加图片">
							<input name="token" type="hidden" :value="token">
							<input type="file" name="" id=""  @change="getPic($event)" multiple="multiple" accept="image/jpg, image/jpeg, image/png" />
						</el-form-item>
						<el-form-item label="添加文件">
							<input name="token" type="hidden" :value="token">
							<input type="file" name="" id=""  @change="getFile($event)" multiple="multiple" 
								accept="application/msword,	text/plain,	application/pdf,application/vnd.ms-excel,application/vnd.ms-powerpoint"/>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitForm_sqgz('sqgz_ruleForm')">立即创建</el-button>
							<el-button @click="resetForm('sqgz_ruleForm')">重置</el-button>
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
		<div class="as_what" v-show="as_what_show">
			<ul>
				<h2>选择请款依据</h2>
				<i class="el-icon-close" @click="as_what_show = !as_what_show"></i>
				<li v-for="(item,index) in asType" @click="as_click(index)">{{item}}</li>
			</ul>
		</div>
		<browsePic :img_arr="img_arr" :pic_index="pic_index" :pic_show="pic_show" @left="last_one" @right="next_one" @close_pic="close_pic"></browsePic>
		<loading v-show="loading_show"></loading>
	</div>
</template>

<script>
	import loading from '@/base/loading/loading'
	import browsePic from '@/base/browse_pic/browse_pic'
	import { create_approval_list } from '@/common/js/approval/approval_list'
	import { create_gongzhang_list } from '@/common/js/approval/gongzhang'
	import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
	import { create_hetongpingshen_list } from '@/common/js/approval/hetongpingshen'
	import { create_exam_list } from '@/common/js/approval/exam'
	import { prefixStyle } from '@/common/js/dom'
	import { mapGetters } from 'vuex'
	const transform = prefixStyle('transform')
	const transitionDuration = prefixStyle('transitionDuration')
	export default {
		data() {
			return {
				nav: ['合同审核表', '请购单', '呈批件', '申请公章', '请款单'],
				asType: ['请购单', '合同评审表', '呈批件', '其他'],
				navIndex: 0,
				radio: '1',
				qkd_type: 0,
				form_Lista: [],
				form_Listb: [],
				pic_show: false,
				template_view_show: false,
				chengpijian_if: false,
				pingshenbiao_if: false,
				qinggoudan_if: false,
				as_what_show: false,
				qingkuan_one_show: false,
				personShow: false,
				qingkuan_big_show: false,
				qingkuan_show: false,
				qinggou_show: false,
				chengpijian_show: false,
				pingshenbiao_show: true,
				shenqinggongzhang_show: false,
				loading_show:false,
				untreated: [],
				img_arr: [],
				document_type:["png","jpg","jpeg","txt","doc","docx","xls","xlsx","ppt","pptx","pdf"],
				pic_hash_arr:[],
				file_hash_arr:[],
				afile_hash_arr:[],
				pic_index: 0,
				qingkuan_approval_id: '',
				nowType: 1,
				insertType: 0,
				afile_hash_obj:{},
				pic_enclosure_id:'',
				unit: ['个', '箱', '根', '斤', '吨', '米', '平方米'],
				begin_time:'',
				pic_time:'',
				file_time:'',
				qkd_ruleForm: {
					balance_subtotal: '',
					gain_reduction_subtotal: '',
					contract_name_new: '',
					contract_name: '',
					bank_name: '',
					account_name: '',
					bank_card: '',
					worker_type: '',
					bank_address: '',
					subtotal: '',
					request_subtotal: '',
					request_content: '',
					request_name:'',
					request_num:'',
					phone:'',
					draw_money_name: '',
					project_manager_name: '',
					project_manager: {}
				},
				qgd_ruleForm: {
					is_add_plan: '0',
					is_urgent: '1',
					request_buy_department: '',
					request_contract_address: '',
					contract_name_new: '',
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
					project_manager: {},
					add: [{
						name: "",
						spec: "",
						unit: "",
						model: "",
						num: "",
						price: "",
						subtotal: "",
						purpose: "",
						remarks: ''
					}]
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
					contract_name: '',
					contract_id: '',
					a_name: '',
					b_name: '',
					prive: '',
					total_prive: '',
					difference: '',
					pay_method: '',
					arrive_time: '',
					end_time: '',
					executor: '',
					contract_name_new: '',
					remarks: '',
					project_manager: {}
				},
				sqgz_ruleForm: {
					departmental: '',
					user_name: '',
					project_manager: '',
					department_id: '',
					project_manager_name: '',
					project_manager: {},
					add: [{
						seal_type: '1',
						reason: "",
						contract_name: "",
						num: "",
						remarks: "",
						company_type: "1",
						name_company: ""	
					}]
				},
				rules: {
					account_name: [{
						required: true,
						message: '请填写	银行账户名称',
						trigger: 'blur'
					}],
					contract_name_new: [{
						required: true,
						message: '请填写合同名称',
						trigger: 'blur'
					}],
					contract_name: [{
						required: true,
						message: '请填写工程名称',
						trigger: 'blur'
					}],
					request_name: [{
						required: true,
						message: '请填写请款人姓名',
						trigger: 'chagne'
					}],
					phone: [{
						required: true,
						message: '请填写联系方式',
						trigger: 'chagne'
					}],
					bank_card: [{
						required: true,
						message: '请填写银行卡号',
						trigger: 'blur'
					}],
					bank_name: [{
						required: true,
						message: '请填写银行账户名称',
						trigger: 'blur'
					}],
					worker_type: [{
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
				},
				sqgz_rules: {
					departmental: [{
						required: true,
						message: '请填写用章部门',
						trigger: 'change'
					}],
					user_name: [{
						required: true,
						message: '请填写申请人姓名',
						trigger: 'change'
					}],
					reason: [{
						required: true,
						message: '请填写盖章事由',
						trigger: 'change'
					}],
					contract_name: [{
						required: true,
						message: '请填写呈资料名称',
						trigger: 'change'
					}],
					num: [{
						required: true,
						message: '请填写数量',
						trigger: 'change'
					}],
					name_company: [{
						required: true,
						message: '请填写公司名称',
						trigger: 'change'
					}]
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
					contract_name_new: [{
						required: true,
						message: '请填写合同名称',
						trigger: 'change'
					}],
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
				}

			}
		},
		computed: {
			...mapGetters([
				'comPersonList',
				'user',
				'nowCompanyId',
				'comDepartList',
				'token'

			])
		},
		methods: {
			getPic(event) {
	            this.pic = event.target.files;   
	        },
	        getFile(event) {
	            this.file = event.target.files;   
	        },
			close_pic() {
				this.pic_show = false
			},
			last_one() {
				if(this.pic_index === 0) {
					return
				}
				--this.pic_index
			},
			next_one() {
				if(this.pic_index === this.img_arr.length - 1) {
					return
				}
				++this.pic_index
			},
			ctrl_pic_show(index) {
				this.pic_index = index
				this.pic_show = true
			},
			view_qingkuan(item) {
				this.template_view_show = true
				if(item.type === '呈批件') {
					this.chengpijian_if = true
				} else if(item.type === '合同评审表') {
					this.pingshenbiao_if = true
				} else if(item.type === '请购单') {
					this.qinggoudan_if = true
				}
				this.qingkuan_one_show = false
				this.listCli(item)
			},
			listCli(item) {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_id", item.approval_id);
				this.$http.post("/index/Mobile/approval/approval_process_show", param)
					.then((res) => {
						if(item.type === '呈批件') {
							this.form_Lista = create_cengpijian_list(res.data.data)
							this.get_img(this.form_Lista.img_list)
						} else if(item.type === '合同评审表') {
							this.form_Lista = create_hetongpingshen_list(res.data.data)
							console.log(this.form_Lista)
							this.get_img(this.form_Lista.enclosure_id)
						} else if(item.type === '请购单') {
							console.log(res.data.data)
							this.form_Lista = res.data.data
						}
					})
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				nparam.append("approval_id", item.approval_id);
				nparam.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/approval/approval_process_personnel", nparam)
					.then((res) => {
						this.form_Listb = create_approval_list(res.data.data)
					})
			},
			get_img(enclosure_id) {
				if(enclosure_id === '0') {
					return
				}
				let param = new URLSearchParams();
				param.append("enclosure_id", enclosure_id);
				this.$http.post("/index/Mobile/approval/look_enclosure", param)
					.then((res) => {
						let arr = []
						res.data.data.picture.forEach((item) => {
							if(item != '') {
								arr.push('http://img-bbsf.6655.la/' + item)
							}

						})
						this.img_arr = arr
						this.$set(this.form_Lista, 'img_list', arr)
					})
			},
			user_qingkuan(item) {
				this.template_view_show = false
				this.qkd_type = item.type
				this.qingkuan_one_show = false
				this.qingkuan_show = true
				this.qingkuan_approval_id = item.approval_id
			},
			return_qingkuan() {
				this.qingkuan_one_show = true
				this.template_view_show = false
			},
			close_sqgz(item, index) {
				this.sqgz_ruleForm.add.splice(index, 1)
			},
			close_qgd(item, index) {
				this.qgd_ruleForm.add.splice(index, 1)
			},
			add_sqgz() {
				let obj = {
					seal_type: '1',
					reason: "",
					contract_name: "",
					num: "",
					remarks: "",
					company_type: "1",
					name_company: ""
				}
				this.sqgz_ruleForm.add.push(obj)
			},
			add_qgd() {
				let obj = {
					name: "",
					spec: "",
					unit: "",
					model: "",
					num: "",
					price: "",
					subtotal: "",
					purpose: "",
					remarks: ''
				}
				this.qgd_ruleForm.add.push(obj)
			},
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
			psb_leader() {
				this.personShow = true
				this.insertType = 7
			},
			sqgz_leader(){
				this.personShow = true
				this.insertType = 8
			},
			change_nav(index) {
				this.navIndex = index
				this.qingkuan_big_show = false
				this.qinggou_show = false
				this.chengpijian_show = false
				this.pingshenbiao_show = false
				this.shenqinggongzhang_show = false
				if(index === 0) {
					this.pingshenbiao_show = true
				} else if(index === 1) {
					this.qinggou_show = true
				} else if(index === 2) {
					this.chengpijian_show = true
				} else if(index === 3) {
					this.shenqinggongzhang_show = true
				} else if(index === 4) {
					this.qingkuan_big_show = true
					this.as_what_show = true
				}
			},
			closePersonList() {
				this.personShow = false
			},
			choosePerson(item, index) {
				if(this.insertType === 0) {
					this.qkd_ruleForm.request_name = item.name
					this.qkd_ruleForm.phone = item.phone
				} else if(this.insertType === 1) {
					this.qgd_ruleForm.contract_responsible = item.name
					this.qgd_ruleForm.responsible_tel = item.phone
				} else if(this.insertType === 2) {
					this.qgd_ruleForm.consignee_uid = item.uid
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
				} else if(this.insertType === 8) {
					this.sqgz_ruleForm.project_manager_name = item.name
					this.$set(this.sqgz_ruleForm.project_manager, 'uid', item.uid)
				}
				this.personShow = false

			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.submit()
						this.loading_show =true
					} else {
						this.$message.error('请将表单填写完整');
						return false;
					}
				});
			},
			submitForm_qgd(formName) {
				
				this.qgd_ruleForm.add.forEach((item)=>{
					if(!item.model === '' || !item.name === '' || !item.num === '' || !item.price === ''
						|| !item.purpose === '' || !item.remarks === '' || !item.spec === '' || !item.subtotal === '' || !item.unit === ''){
						alert()
					}
				})
				
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.qgd_submit()
						this.loading_show =true
					} else {
						this.$message.error('请将表单填写完整');
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
						this.loading_show =true
					} else {
						this.$message.error('请将表单填写完整');
						return false;
					}
				});
			},
			submitForm_psb(formName) {
				this.loading_show =true
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.psb_submit()	
						this.loading_show =true
					} else {
						this.$message.error('请将表单填写完整');
						return false;
					}
				});
			},
			submitForm_qkd(formName) {
				
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.qkd_submit()
						this.loading_show =true
					} else {
						this.$message.error('请将表单填写完整');
						return false;
					}
				});
			},
			submitForm_sqgz(formName) {
				this.comDepartList.forEach((item) => {
					if(item.department_name === this.sqgz_ruleForm.departmental) {
						this.sqgz_ruleForm.department_id = item.department_id
					}
				})
				this.sqgz_submit()
//				this.$refs[formName].validate((valid) => {
//					if(valid) {
//						this.sqgz_submit()
//					} else {
//						console.log('error submit!!');
//						return false;
//					}
//				});
			},
			return_show() {
				this.$emit('add_approval_showF')
			},
			created() {},
			sqgz_submit() {
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []	
				this.file_time = 0
				this.pic_time = 0
				if( (!this.pic || this.pic.length === 0)&&(!this.file || this.file.length === 0)){
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("departmental", this.sqgz_ruleForm.department_id);
					param.append("user_name", this.sqgz_ruleForm.user_name);
					param.append("project_manager",  JSON.stringify(this.sqgz_ruleForm.project_manager));
					param.append("info", JSON.stringify(this.sqgz_ruleForm.add));
					this.$http.post("/index/Mobile/approval/add_request_seal", param)
					.then((res) => {
						console.log(res)
					})
				}else{
					if(this.pic){
						for(let i = 0; i < this.pic.length; i++) {
						let formData = new FormData();
						formData.append('file', this.pic[i]);
						formData.append('token', this.token);
						let config = {headers: {'Content-Type': 'multipart/form-data'}}
						this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
							this.pic_hash_arr.push(res.data.hash)
							if(this.pic_hash_arr.length === this.pic.length) {
								let nparam = new URLSearchParams();
								nparam.append("uid", this.user.uid);
								nparam.append("picture", JSON.stringify(this.pic_hash_arr));
								this.$http.post("/index/Mobile/approval/upload_enclosure_new", nparam)
									.then((res) => {
										this.pic_enclosure_id = res.data.data.enclosure_id
										this.afile_hash_arr.push({
											"type": 3,
											"contract_id": res.data.data.enclosure_id,
											"name": this.pic[i].name
										})
										let aDate = Date.parse(new Date())
										this.pic_time = aDate
									})
							}
						})
					}
					}
					if(this.file){
						for(let i = 0; i < this.file.length; i++) {
						let formData = new FormData();
						formData.append('file', this.file[i]);
							formData.append('token', this.token);
							let config = {headers: {'Content-Type': 'multipart/form-data'}}
							this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
							let index = this.file[i].name.indexOf('.')
							let attribute =this.file[i].name.slice(index)
							let file_name =this.file[i].name.slice(0,index)
							let param = new URLSearchParams();
							param.append("uid", this.user.uid);
							param.append("attribute", attribute);
							param.append("attachments", res.data.hash);
							param.append("file_name", file_name);
							this.$http.post("/index/Mobile/approval/add_attachments", param)
							.then((res)=>{
								this.file_hash_arr.push({
									"type":4,
									"contract_id":res.data.data.attachments_id,
									"name":this.file[i].name})
								if(this.file_hash_arr.length === this.file.length){
										let bDate = Date.parse(new Date())
										this.file_time = bDate
									}
								})
							})
						}
					}
				}	

			},
			psb_submit() {
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []
				this.file_time = 0
				this.pic_time = 0
				if( !this.pic &&!this.file ){
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("a_name", this.psb_ruleForm.a_name);
					param.append("b_name", this.psb_ruleForm.b_name);
					param.append("prive", this.psb_ruleForm.prive);
					param.append("total_prive", this.psb_ruleForm.total_prive);
					param.append("difference", this.psb_ruleForm.difference);
					param.append("pay_method", this.psb_ruleForm.pay_method);
					param.append("contract_name", this.psb_ruleForm.contract_name);
					param.append("project_manager", JSON.stringify(this.psb_ruleForm.project_manager));
					param.append("arrive_time", this.psb_ruleForm.arrive_time);
					param.append("end_time", this.psb_ruleForm.end_time);
					param.append("executor", this.psb_ruleForm.executor);
					param.append("remarks", this.psb_ruleForm.remarks);
					param.append("contract_num", this.psb_ruleForm.contract_id);
					param.append("contract_name_new", this.psb_ruleForm.contract_name_new);
					this.$http.post("/index/Mobile/approval/add_approval_conyract_company_new", param)
					.then((res) => {
						if(res.data.code === 0){
							this.loading_show = false
						}
						
					})
				}else{
					if(this.pic){
						for(let i = 0; i < this.pic.length; i++) {
							let formData = new FormData();
							formData.append('file', this.pic[i]);
							formData.append('token', this.token);
							let config = {headers: {'Content-Type': 'multipart/form-data'}}
							this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
								this.pic_hash_arr.push(res.data.hash)
								if(this.pic_hash_arr.length === this.pic.length) {
									let nparam = new URLSearchParams();
									nparam.append("uid", this.user.uid);
									nparam.append("picture", JSON.stringify(this.pic_hash_arr));
									this.$http.post("/index/Mobile/approval/upload_enclosure_new", nparam)
										.then((res) => {
											this.pic_enclosure_id = res.data.data.enclosure_id
											this.afile_hash_arr.push({
												"type": 3,
												"contract_id": res.data.data.enclosure_id,
												"name": this.pic[i].name
											})
											let aDate = Date.parse(new Date())
											this.pic_time = aDate
										})
								}
							})
						}
					}
					if(this.file){
						for(let i = 0; i < this.file.length; i++) {
							let formData = new FormData();
							formData.append('file', this.file[i]);
								formData.append('token', this.token);
								let config = {headers: {'Content-Type': 'multipart/form-data'}}
								this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
								let index = this.file[i].name.indexOf('.')
								let attribute =this.file[i].name.slice(index)
								let file_name =this.file[i].name.slice(0,index)
								let param = new URLSearchParams();
								param.append("uid", this.user.uid);
								param.append("attribute", attribute);
								param.append("attachments", res.data.hash);
								param.append("file_name", file_name);
								this.$http.post("/index/Mobile/approval/add_attachments", param)
								.then((res)=>{
									this.file_hash_arr.push({
										"type":4,
										"contract_id":res.data.data.attachments_id,
										"name":this.file[i].name})
									if(this.file_hash_arr.length === this.file.length){
											let bDate = Date.parse(new Date())
											this.file_time = bDate
										}
									})
								})
							}
						}	
					}
			},
			cpj_submit() {
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []
				this.file_time = 0
				this.pic_time = 0
				if( (!this.pic || this.pic.length === 0)&&(!this.file || this.file.length === 0)){
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
				}else{	
					if(this.pic){
						for(let i = 0; i < this.pic.length; i++) {
							let formData = new FormData();
							formData.append('file', this.pic[i]);
							formData.append('token', this.token);
							let config = {headers: {'Content-Type': 'multipart/form-data'}}
							this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
								this.pic_hash_arr.push(res.data.hash)
								if(this.pic_hash_arr.length === this.pic.length) {
									let nparam = new URLSearchParams();
									nparam.append("uid", this.user.uid);
									nparam.append("picture", JSON.stringify(this.pic_hash_arr));
									this.$http.post("/index/Mobile/approval/upload_enclosure_new", nparam)
										.then((res) => {
											this.pic_enclosure_id = res.data.data.enclosure_id
											this.afile_hash_arr.push({
												"type": 3,
												"contract_id": res.data.data.enclosure_id,
												"name": this.pic[i].name
											})
											let aDate = Date.parse(new Date())
											this.pic_time = aDate
										})
								}
							})
						}
					}
					if(this.file){
						for(let i = 0; i < this.file.length; i++) {
							let formData = new FormData();
							formData.append('file', this.file[i]);
								formData.append('token', this.token);
								let config = {headers: {'Content-Type': 'multipart/form-data'}}
								this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
								let index = this.file[i].name.indexOf('.')
								let attribute =this.file[i].name.slice(index)
								let file_name =this.file[i].name.slice(0,index)
								let param = new URLSearchParams();
								param.append("uid", this.user.uid);
								param.append("attribute", attribute);
								param.append("attachments", res.data.hash);
								param.append("file_name", file_name);
								this.$http.post("/index/Mobile/approval/add_attachments", param)
								.then((res)=>{
									this.file_hash_arr.push({
										"type":4,
										"contract_id":res.data.data.attachments_id,
										"name":this.file[i].name})
									if(this.file_hash_arr.length === this.file.length){
											let bDate = Date.parse(new Date())
											this.file_time = bDate
										}
									})
								})
							}
						}	
				}		

			},
			qgd_submit() {
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []
				this.file_time = 0
				this.pic_time = 0
				if( (!this.pic || this.pic.length === 0)&&(!this.file || this.file.length === 0)){
					let buy_depart_id
					this.comDepartList.forEach((item) => {
						if(item.department_name === this.qgd_ruleForm.request_buy_department) {
							buy_depart_id = item.department_id
						}
					})
					let consignee_uid
					this.comPersonList.forEach((item) => {
						if(item.name === this.qgd_ruleForm.consignee) {
							consignee_uid = item.uid
						}
					})
					let buy_person_uid
					this.comPersonList.forEach((item) => {
						if(item.name === this.qgd_ruleForm.buy_person) {
							buy_person_uid = item.uid
						}
					})
						let param = new URLSearchParams();
						param.append("uid", this.user.uid);
						param.append("company_id", this.nowCompanyId);
						param.append("request_buy_department", buy_depart_id);
						param.append("is_add_plan", this.qgd_ruleForm.is_add_plan);
						param.append("request_contract_address", this.qgd_ruleForm.request_contract_address);
						param.append("is_urgent", this.qgd_ruleForm.is_urgent);
						param.append("content", JSON.stringify(this.qgd_ruleForm.add));
						param.append("contract_responsible", this.qgd_ruleForm.contract_responsible);
						param.append("responsible_tel", this.qgd_ruleForm.responsible_tel);
						param.append("arrival_time", this.qgd_ruleForm.arrival_time);
						param.append("consignee", this.qgd_ruleForm.consignee);
						param.append("consignee_phone", this.qgd_ruleForm.consignee_phone);
						param.append("type", 2);
						param.append("project_manager", JSON.stringify(this.qgd_ruleForm.project_manager));
						param.append("total", this.qgd_ruleForm.total);
						param.append("receive_address", this.qgd_ruleForm.receive_address);
						param.append("buy_person", this.qgd_ruleForm.buy_person);
						param.append("buy_person_phone", this.qgd_ruleForm.buy_person_phone);
						param.append("contract_name_new", this.qgd_ruleForm.contract_name_new);
						param.append("consignee_uid", consignee_uid);
						param.append("buy_person_uid", buy_person_uid);
						this.$http.post("/index/Mobile/approval/add_request_buy", param)
						.then((res) => {
							console.log(res)
						})
				}else{
					if(this.pic){
						for(let i = 0; i < this.pic.length; i++) {
							let formData = new FormData();
							formData.append('file', this.pic[i]);
							formData.append('token', this.token);
							let config = {headers: {'Content-Type': 'multipart/form-data'}}
							this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
								this.pic_hash_arr.push(res.data.hash)
								if(this.pic_hash_arr.length === this.pic.length) {
									let nparam = new URLSearchParams();
									nparam.append("uid", this.user.uid);
									nparam.append("picture", JSON.stringify(this.pic_hash_arr));
									this.$http.post("/index/Mobile/approval/upload_enclosure_new", nparam)
										.then((res) => {
											this.pic_enclosure_id = res.data.data.enclosure_id
											this.afile_hash_arr.push({
												"type": 3,
												"contract_id": res.data.data.enclosure_id,
												"name": this.pic[i].name
											})
											let aDate = Date.parse(new Date())
											this.pic_time = aDate
										})
								}
							})
						}
					}
					if(this.file){
						for(let i = 0; i < this.file.length; i++) {
							let formData = new FormData();
							formData.append('file', this.file[i]);
								formData.append('token', this.token);
								let config = {headers: {'Content-Type': 'multipart/form-data'}}
								this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
								let index = this.file[i].name.indexOf('.')
								let attribute =this.file[i].name.slice(index)
								let file_name =this.file[i].name.slice(0,index)
								let param = new URLSearchParams();
								param.append("uid", this.user.uid);
								param.append("attribute", attribute);
								param.append("attachments", res.data.hash);
								param.append("file_name", file_name);
								this.$http.post("/index/Mobile/approval/add_attachments", param)
								.then((res)=>{
									this.file_hash_arr.push({
										"type":4,
										"contract_id":res.data.data.attachments_id,
										"name":this.file[i].name})
									if(this.file_hash_arr.length === this.file.length){
											let bDate = Date.parse(new Date())
											this.file_time = bDate
										}
									})
								})
							}
						}	
				}			

			
			},
			qkd_submit() {
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []	
				this.file_time = 0
				this.pic_time = 0
				if( !this.pic &&!this.file){
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("contract_name", this.qkd_ruleForm.contract_name);
					param.append("company_id", this.nowCompanyId);
					param.append("request_name", this.qkd_ruleForm.request_name);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("worker_type", this.qkd_ruleForm.worker_type);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("account_name", this.qkd_ruleForm.account_name);
					param.append("contract_name_new", this.qkd_ruleForm.contract_name_new);
					param.append("bank_card", this.qkd_ruleForm.bank_card);
					param.append("bank_address", this.qkd_ruleForm.bank_address);
					param.append("subtotal", this.qkd_ruleForm.subtotal);
					param.append("request_subtotal", this.qkd_ruleForm.request_subtotal);
					param.append("request_content", this.qkd_ruleForm.request_content);
					param.append("request_num", this.qkd_ruleForm.request_num);
					param.append("type", '2');
					param.append("form_approval_id", this.qingkuan_approval_id);
					param.append("balance_subtotal", this.qkd_ruleForm.balance_subtotal);
					param.append("request_money_basis_type", this.qkd_type);
					param.append("draw_money_name", this.qkd_ruleForm.draw_money_name);
					param.append("gain_reduction_subtotal", this.qkd_ruleForm.gain_reduction_subtotal);
					param.append("project_manager", JSON.stringify(this.qkd_ruleForm.project_manager));
					this.$http.post("/index/Mobile/approval/add_request_money", param)
					.then((res) => {
						console.log(res)
					})
				}else{
					if(this.pic){
						for(let i = 0; i < this.pic.length; i++) {
						let formData = new FormData();
						formData.append('file', this.pic[i]);
						formData.append('token', this.token);
						let config = {headers: {'Content-Type': 'multipart/form-data'}}
						this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
							this.pic_hash_arr.push(res.data.hash)
							if(this.pic_hash_arr.length === this.pic.length) {
								let nparam = new URLSearchParams();
								nparam.append("uid", this.user.uid);
								nparam.append("picture", JSON.stringify(this.pic_hash_arr));
								this.$http.post("/index/Mobile/approval/upload_enclosure_new", nparam)
									.then((res) => {
										this.pic_enclosure_id = res.data.data.enclosure_id
										this.afile_hash_arr.push({
											"type": 3,
											"contract_id": res.data.data.enclosure_id,
											"name": this.pic[i].name
										})
										let aDate = Date.parse(new Date())
										this.pic_time = aDate
										console.log(this.pic_time)
									})
							}
						})
					}
					}
					if(this.file){
						for(let i = 0; i < this.file.length; i++) {
						let formData = new FormData();
						formData.append('file', this.file[i]);
							formData.append('token', this.token);
							let config = {headers: {'Content-Type': 'multipart/form-data'}}
							this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
							let index = this.file[i].name.indexOf('.')
							let attribute =this.file[i].name.slice(index)
							let file_name =this.file[i].name.slice(0,index)
							let param = new URLSearchParams();
							param.append("uid", this.user.uid);
							param.append("attribute", attribute);
							param.append("attachments", res.data.hash);
							param.append("file_name", file_name);
							this.$http.post("/index/Mobile/approval/add_attachments", param)
							.then((res)=>{
								this.file_hash_arr.push({
									"type":4,
									"contract_id":res.data.data.attachments_id,
									"name":this.file[i].name})
								if(this.file_hash_arr.length === this.file.length){
										let bDate = Date.parse(new Date())
										this.file_time = bDate
										console.log(this.file_time)
									}
								})
							})
						}
					}
				}	
				
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			as_click(index) {
				this._getExamList(index)
				this.as_what_show = false
				if(index === 3) {
					this.qingkuan_show = true
					this.qingkuan_one_show = false
				} else {
					this.qingkuan_show = false
					this.qingkuan_one_show = true
				}
			},
			_getExamList(index) {
				let type
				if(index === 0) {
					type = 3
				} else if(index === 1) {
					type = 1
				} else if(index === 2) {
					type = 6
				} else {
					type = -1
					return
				}
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_type", type);
				param.append("each", '20');
				param.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/approval/request_monry_basis", param)
.then((res) => {
	let arr = []
	res.data.data.forEach((item) => {
		arr.push(create_exam_list(item))
	})
	this.untreated = arr
})
}
	},
	components: {
		browsePic,
		loading
	},
	watch: {
		file_time() {
			if(this.pic){
				if(this.pic_time === 0){
					return 
				}
			}
			if(this.file_time!=0 || this.pic_time !=0){
				if(this.navIndex === 0){
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("a_name", this.psb_ruleForm.a_name);
					param.append("b_name", this.psb_ruleForm.b_name);
					param.append("prive", this.psb_ruleForm.prive);
					param.append("total_prive", this.psb_ruleForm.total_prive);
					param.append("difference", this.psb_ruleForm.difference);
					param.append("pay_method", this.psb_ruleForm.pay_method);
					param.append("contract_name", this.psb_ruleForm.contract_name);
					param.append("project_manager", JSON.stringify(this.psb_ruleForm.project_manager));
					param.append("arrive_time", this.psb_ruleForm.arrive_time);
					param.append("end_time", this.psb_ruleForm.end_time);
					param.append("executor", this.psb_ruleForm.executor);
					param.append("remarks", this.psb_ruleForm.remarks);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					param.append("contract_num", this.psb_ruleForm.contract_id);
					param.append("contract_name_new", this.psb_ruleForm.contract_name_new);
					this.$http.post("/index/Mobile/approval/add_approval_conyract_company_new", param)
					.then((res) => {
						if(res.data.code === 0){
							this.loading_show = false
						}
					})
				}
				if(this.navIndex === 1){
					let buy_depart_id
					this.comDepartList.forEach((item) => {
						if(item.department_name === this.qgd_ruleForm.request_buy_department) {
							buy_depart_id = item.department_id
							}
						})
					let consignee_uid
					this.comPersonList.forEach((item) => {
						if(item.name === this.qgd_ruleForm.consignee) {
							consignee_uid = item.uid
						}
					})
					let buy_person_uid
					this.comPersonList.forEach((item) => {
						if(item.name === this.qgd_ruleForm.buy_person) {
							buy_person_uid = item.uid
						}
					})
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("request_buy_department", buy_depart_id);
					param.append("is_add_plan", this.qgd_ruleForm.is_add_plan);
					param.append("request_contract_address", this.qgd_ruleForm.request_contract_address);
					param.append("is_urgent", this.qgd_ruleForm.is_urgent);
					param.append("content", JSON.stringify(this.qgd_ruleForm.add));
					param.append("contract_responsible", this.qgd_ruleForm.contract_responsible);
					param.append("responsible_tel", this.qgd_ruleForm.responsible_tel);
					param.append("arrival_time", this.qgd_ruleForm.arrival_time);
					param.append("consignee", this.qgd_ruleForm.consignee);
					param.append("consignee_phone", this.qgd_ruleForm.consignee_phone);
					param.append("total", this.qgd_ruleForm.total);
					param.append("receive_address", this.qgd_ruleForm.receive_address);
					param.append("buy_person", this.qgd_ruleForm.buy_person);
					param.append("buy_person_phone", this.qgd_ruleForm.buy_person_phone);
					param.append("contract_name_new", this.qgd_ruleForm.contract_name_new);
					param.append("consignee_uid", consignee_uid);
					param.append("buy_person_uid", buy_person_uid);
					param.append("project_manager", JSON.stringify(this.qgd_ruleForm.project_manager));
					param.append("many_enclosure",JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					param.append("type", 2);
					this.$http.post("/index/Mobile/approval/add_request_buy", param)
					.then((res) => {
						if(res.data.code === 0){
							this.loading_show = false
						}
					})
				}
				if(this.navIndex === 2){
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("department_id", this.cpj_ruleForm.department_id);
					param.append("content", this.cpj_ruleForm.content);
					param.append("chengpi_num", parseInt(this.cpj_ruleForm.chengpi_num));
					param.append("title", this.cpj_ruleForm.title);
					param.append("project_manager", JSON.stringify(this.cpj_ruleForm.project_manager));
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index/Mobile/approval/add_chengpi", param)
					.then((res) => {
						if(res.data.code === 0){
							this.loading_show = false
						}
					})
				}
				if(this.navIndex === 3){
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("departmental", this.sqgz_ruleForm.department_id);
					param.append("user_name", this.sqgz_ruleForm.user_name);
					param.append("project_manager",  JSON.stringify(this.sqgz_ruleForm.project_manager));
					param.append("info", JSON.stringify(this.sqgz_ruleForm.add));
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index/Mobile/approval/add_request_seal", param)
					.then((res) => {
						if(res.data.code === 0){
							this.loading_show = false
						}
					})
				}
				if(this.navIndex === 4){
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("contract_name", this.qkd_ruleForm.contract_name);
					param.append("company_id", this.nowCompanyId);
					param.append("request_name", this.qkd_ruleForm.request_name);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("worker_type", this.qkd_ruleForm.worker_type);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("account_name", this.qkd_ruleForm.account_name);
					param.append("contract_name_new", this.qkd_ruleForm.contract_name_new);
					param.append("bank_card", this.qkd_ruleForm.bank_card);
					param.append("bank_address", this.qkd_ruleForm.bank_address);
					param.append("subtotal", this.qkd_ruleForm.subtotal);
					param.append("request_subtotal", this.qkd_ruleForm.request_subtotal);
					param.append("request_content", this.qkd_ruleForm.request_content);
					param.append("request_num", this.qkd_ruleForm.request_num);
					param.append("type", '2');
					param.append("form_approval_id", this.qingkuan_approval_id);
					param.append("balance_subtotal", this.qkd_ruleForm.balance_subtotal);
					param.append("request_money_basis_type", this.qkd_type);
					param.append("draw_money_name", this.qkd_ruleForm.draw_money_name);
					param.append("gain_reduction_subtotal", this.qkd_ruleForm.gain_reduction_subtotal);
					param.append("project_manager", JSON.stringify(this.qkd_ruleForm.project_manager));
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index/Mobile/approval/add_request_money", param)
					.then((res) => {
						if(res.data.code === 0){
							this.loading_show = false
						}
						
					})
				}
			}
	},
		pic_time() {
			if(this.file){
				if(this.file_time === 0){
					return 
				}
			}
			if(this.file_time!=0 || this.pic_time !=0){
				if(this.navIndex === 0){
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("a_name", this.psb_ruleForm.a_name);
					param.append("b_name", this.psb_ruleForm.b_name);
					param.append("prive", this.psb_ruleForm.prive);
					param.append("total_prive", this.psb_ruleForm.total_prive);
					param.append("difference", this.psb_ruleForm.difference);
					param.append("pay_method", this.psb_ruleForm.pay_method);
					param.append("contract_name", this.psb_ruleForm.contract_name);
					param.append("project_manager", JSON.stringify(this.psb_ruleForm.project_manager));
					param.append("arrive_time", this.psb_ruleForm.arrive_time);
					param.append("end_time", this.psb_ruleForm.end_time);
					param.append("executor", this.psb_ruleForm.executor);
					param.append("remarks", this.psb_ruleForm.remarks);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					param.append("contract_num", this.psb_ruleForm.contract_id);
					param.append("contract_name_new", this.psb_ruleForm.contract_name_new);
					this.$http.post("/index/Mobile/approval/add_approval_conyract_company_new", param)
					.then((res) => {
						if(res.data.code === 0){
							this.loading_show = false
						}
					})
				}
				if(this.navIndex === 1){
					let buy_depart_id
					this.comDepartList.forEach((item) => {
						if(item.department_name === this.qgd_ruleForm.request_buy_department) {
							buy_depart_id = item.department_id
							}
						})
					let consignee_uid
					this.comPersonList.forEach((item) => {
						if(item.name === this.qgd_ruleForm.consignee) {
							consignee_uid = item.uid
						}
					})
					let buy_person_uid
					this.comPersonList.forEach((item) => {
						if(item.name === this.qgd_ruleForm.buy_person) {
							buy_person_uid = item.uid
						}
					})
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("request_buy_department", buy_depart_id);
					param.append("is_add_plan", this.qgd_ruleForm.is_add_plan);
					param.append("request_contract_address", this.qgd_ruleForm.request_contract_address);
					param.append("is_urgent", this.qgd_ruleForm.is_urgent);
					param.append("content", JSON.stringify(this.qgd_ruleForm.add));
					param.append("contract_responsible", this.qgd_ruleForm.contract_responsible);
					param.append("responsible_tel", this.qgd_ruleForm.responsible_tel);
					param.append("arrival_time", this.qgd_ruleForm.arrival_time);
					param.append("consignee", this.qgd_ruleForm.consignee);
					param.append("consignee_phone", this.qgd_ruleForm.consignee_phone);
					param.append("total", this.qgd_ruleForm.total);
					param.append("receive_address", this.qgd_ruleForm.receive_address);
					param.append("buy_person", this.qgd_ruleForm.buy_person);
					param.append("buy_person_phone", this.qgd_ruleForm.buy_person_phone);
					param.append("contract_name_new", this.qgd_ruleForm.contract_name_new);
					param.append("consignee_uid", consignee_uid);
					param.append("buy_person_uid", buy_person_uid);
					param.append("project_manager", JSON.stringify(this.qgd_ruleForm.project_manager));
					param.append("many_enclosure",JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					param.append("type", 2);
					this.$http.post("/index/Mobile/approval/add_request_buy", param)
					.then((res) => {
						if(res.data.code === 0){
							this.loading_show = false
						}
					})
				}
				if(this.navIndex === 2){
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("department_id", this.cpj_ruleForm.department_id);
					param.append("content", this.cpj_ruleForm.content);
					param.append("chengpi_num", parseInt(this.cpj_ruleForm.chengpi_num));
					param.append("title", this.cpj_ruleForm.title);
					param.append("project_manager", JSON.stringify(this.cpj_ruleForm.project_manager));
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index/Mobile/approval/add_chengpi", param)
					.then((res) => {
						if(res.data.code === 0){
							this.loading_show = false
						}
					})
				}
				if(this.navIndex === 3){
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("departmental", this.sqgz_ruleForm.department_id);
					param.append("user_name", this.sqgz_ruleForm.user_name);
					param.append("project_manager",  JSON.stringify(this.sqgz_ruleForm.project_manager));
					param.append("info", JSON.stringify(this.sqgz_ruleForm.add));
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index/Mobile/approval/add_request_seal", param)
					.then((res) => {
						if(res.data.code === 0){
							this.loading_show = false
						}
					})
				}
				if(this.navIndex === 4){
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("contract_name", this.qkd_ruleForm.contract_name);
					param.append("company_id", this.nowCompanyId);
					param.append("request_name", this.qkd_ruleForm.request_name);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("worker_type", this.qkd_ruleForm.worker_type);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("account_name", this.qkd_ruleForm.account_name);
					param.append("contract_name_new", this.qkd_ruleForm.contract_name_new);
					param.append("bank_card", this.qkd_ruleForm.bank_card);
					param.append("bank_address", this.qkd_ruleForm.bank_address);
					param.append("subtotal", this.qkd_ruleForm.subtotal);
					param.append("request_subtotal", this.qkd_ruleForm.request_subtotal);
					param.append("request_content", this.qkd_ruleForm.request_content);
					param.append("request_num", this.qkd_ruleForm.request_num);
					param.append("type", '2');
					param.append("form_approval_id", this.qingkuan_approval_id);
					param.append("balance_subtotal", this.qkd_ruleForm.balance_subtotal);
					param.append("request_money_basis_type", this.qkd_type);
					param.append("draw_money_name", this.qkd_ruleForm.draw_money_name);
					param.append("gain_reduction_subtotal", this.qkd_ruleForm.gain_reduction_subtotal);
					param.append("project_manager", JSON.stringify(this.qkd_ruleForm.project_manager));
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index/Mobile/approval/add_request_money", param)
					.then((res) => {
						if(res.data.code === 0){
							this.loading_show = false
						}
					})
				}
			}
		}
	}
	}
</script>

<style lang="scss" scoped>
	.as_what {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		height: 100%;
		width: 100%;
		margin: 0 auto;
		background: rgba(0, 0, 0, 0.4);
		z-index: 10;
		ul {
			width: 300px;
			background: #FFFFFF;
			margin: 300px auto;
			padding: 10px;
			h2 {
				display: inline-block;
				margin-bottom: 10px;
				font-size: 20px;
			}
			i {
				font-size: 20px;
				float: right;
				cursor: pointer;
				&:hover {
					color: #FA5555
				}
			}
			li {
				cursor: pointer;
				display: block;
				height: 30px;
				line-height: 30px;
				&:hover {
					color: #5A5E66;
				}
			}
		}
	}
	
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
					.content {
						font-size: 14px;
						border-bottom: 1px solid #666666;
						position: relative;
						>div {
							line-height: 20px;
							display: block;
							max-width: 320px;
						}
						.button {
							position: absolute;
							top: 30px;
							right: 50px;
							span {
								cursor: pointer;
								color: #67C23A;
								border: 1px solid #67C23A;
								padding: 5px 10px;
								&:last-child {
									color: #409EFF;
									border: 1px solid #409EFF;
								}
							}
						}
					}
					.template_view {
						.form {
							padding: 10px;
							color: #999999;
							>div {
								display: block;
								border-bottom: 1px solid #DDDDDD;
								>span {
									vertical-align: top;
									font-size: 14px;
									line-height: 24px;
									&:nth-child(2) {
										margin-left: 5px;
										color: #444444;
									}
								}
								.approval {
									display: inline-block;
									span {
										font-size: 14px;
										line-height: 24px;
									}
								}
								img {
									display: inline-block;
									height: 50px;
									width: 80px;
									cursor: pointer;
								}
							}
							.user {
								&:last-child {
									color: #409EFF;
									border: 1px solid #409EFF;
									margin-left: 10px;
								}
								margin-top: 10px;
								display: inline-block;
								width: 50px;
								border-bottom: none;
								cursor: pointer;
								color: #67C23A;
								border: 1px solid #67C23A;
								text-align: center;
								height: 26px;
								line-height: 26px;
							}
							.qingdan {
								font-size: 14px;
								padding: 4px 0;
								h4 {
									color: #409EFF;
									font-size: 15px;
									margin: 2px 0px;
								}
								p {
									height: 30px;
									line-height: 30px;
									span {
										margin-left: 5px;
										color: #444444;
									}
								}
							}
							.qingdan_qinggou {
								font-size: 14px;
								padding: 4px 0;
								h4 {
									color: #409EFF;
									font-size: 15px;
									margin: 2px 0px;
								}
								p {
									display: inline-block;
									width: 200px;
									height: 30px;
									line-height: 30px;
									span {
										margin-left: 5px;
										color: #444444;
									}
								}
							}
						}
					}
					.as_type {
						ul {
							li {
								display: block;
								height: 30px;
								line-height: 30px;
							}
						}
					}
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
					.new_qgd {
						position: relative;
						.close {
							display: block;
							height: 20px;
							font-size: 16px;
							color: #3487E2;
							i {
								float: right;
								cursor: pointer;
								&:hover {
									color: #FA5555;
								}
							}
						}
					}
					.add_qgd {
						display: block;
						height: 30px;
						font-size: 14px;
						margin-left: 50px;
						i {
							cursor: pointer;
							display: inline-block;
							&:hover {
								color: #FA5555;
							}
						}
					}
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
										margin-top: 10px;
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
				.shenqinggongzhang {
					.close {
						display: block;
						height: 30px;
						i {
							cursor: pointer;
							font-size: 20px;
							display: block;
							float: right;
							&:hover {
								color: #FA5555;
							}
						}
					}
					.add_sqgz {
						font-size: 14px;
						color: #5a5e66;
						cursor: pointer;
						margin-left: 10px;
						i {
							&:hover {
								color: #3487E2;
							}
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
										margin-top: 10px;
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
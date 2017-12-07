<template>
	<div class="exam_wrapper">
		<div class="exam" v-show="listShow">
			<div class="nav">
				<transition name="fade">
				<el-tabs v-model="activeName" @tab-click="handleClick" v-show="!searchShow">
					<el-tab-pane label="未处理"></el-tab-pane>
					<el-tab-pane label="已处理"></el-tab-pane>
					<el-tab-pane label="我发起的"></el-tab-pane>
				</el-tabs>
				</transition>
				<div class="filtrate" @click="doFiltrate">筛选<i :class="{ 'el-icon-arrow-down': searchShow, 'el-icon-arrow-up': !searchShow }"></i></div>
			</div>
			<transition name="fade1">
				<div class="search" v-show="searchShow">
					<div class="one">
						<el-radio v-model="classRadio" label="1">我发起的</el-radio>
	  					<el-radio v-model="classRadio" label="2">我处理的</el-radio>
					</div>
					<div class="two">
						<el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchInfo"  style="display: inline-block;">
						</el-input>
					</div>
					<div class="three">
						<span v-for="(item,index) in group" :class="{'active':classIndex === index}" @click="classButton(item,index)">{{item}}</span>
					</div>
				</div>
			</transition>
			<div class="list" v-show="listSeaShow">
				<ul>
					<li v-for="(item,index) in untreated" :key="item.approval_id" ref="list" :style="{background:item.tagging}">
						<div class="avatar" v-if="ilaunched">
							<img :src="item.avatar" alt="" />
						</div>
						<div class="edit">
							<el-button type="primary" round @click="listCli(item,index)">查看</el-button>
							<div class="process" v-if="approval_process">
								<span v-html="item.approval_state" style="font-weight: 700; font-size: 14px;"></span>
							</div>
							<div class="color" v-if="handle_time_show">
								<span style="font-family: '黑体" @click="biao(index)">标</span>
								<div class="choose" v-show="index === colorIndex">
									<span @click="colorOne(item)"></span>
									<span @click="colorTwo(item)"></span>
									<span @click="colorThree(item)"></span>
									<span @click="colorFour(item)"></span>
								</div>
							</div>
						</div>
						<div class="content">
							<div class="name" v-if="ilaunched">
								<span>姓名：{{item.name}}</span>
							</div>
							<div class="title">
								<span>标题：{{item.title}}</span>
							</div>
							<div class="type">
								<span>类型：{{item.type}}</span>
							</div>
							<div class="startComP">
								<span>发起公司：{{item.company_name}}</span>
							</div>
							<div class="creatTime">
								<span>发起时间：{{item.add_time}}</span>
							</div>
							<div class="creatTime" v-if="handle_time_show">
								<span>处理时间：{{item.add_time}}</span>
							</div>

						</div>
					</li>
					<div class="page">
						<span @click="first_page">首页</span>
						<span @click="last_page" v-show="pageIndex > 1">上一页</span>
						<span @click="next_page" v-show="nextPageShow">下一页</span>
					</div>
				</ul>
			</div>
		</div>
		<div class="form_wrapper" v-show="formShow">
			<div class="top">
				<el-button type="info" plain @click="return_list">返回列表</el-button>
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
					<a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
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
					<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444;">{{item}}
						</span>
				</div>
				<div>
					<span></span>
					<div v-for="item in form_Listb.content">
						<div class="exam_info">
							<div class="avatar lzz">
								<span style="margin-left: 5px;">状态</span>
							</div>
							<div class="tel lzz">
								<span>姓名</span>
							</div>
							<div class="name lzz">
								<span>部门</span>
							</div>
							<div class="operation lzz">
								<span>处理时间</span>
							</div>
						</div>
						<div class="exam_info">
							<div class="avatar">
								<span>{{item.is_agree}}</span>
							</div>
							<div class="name">
								<span>{{item.name}}</span>
							</div>
							<div class="tel">
								<span>{{item.department_name}}</span>
							</div>
							<div class="operation">
								<span>{{item.add_time}}</span>
							</div>
						</div>
						<div>
							<img :src="list" alt="" v-for="(list,index) in item.picture" @click="cl_pic(item,index)" />
						</div>
					</div>
				</div>
				<div class="menu" v-show="handle_show">
					<el-button type="primary" plain @click="handle">处理</el-button>
					<div class="button" v-show="menuShow">
						<el-input type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
						<input name="token" type="hidden" :value="input_value">
						<input type="file" @change="getPic($event)" multiple="multiple" accept="image/png,image/jpeg" />
						<el-button type="primary" round @click="agree($event)">同意</el-button>
						<el-button type="danger" round @click="refuse">拒绝</el-button>
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
					<span>附件列表：</span>
					<a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
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
					<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444;">{{item}}
						</span>
				</div>
				<div>
					<span></span>
					<div v-for="item in form_Listb.content">
						<div class="exam_info">
							<div class="avatar lzz">
								<span style="margin-left: 5px;">状态</span>
							</div>
							<div class="tel lzz">
								<span>姓名</span>
							</div>
							<div class="name lzz">
								<span>部门</span>
							</div>
							<div class="operation lzz">
								<span>处理时间</span>
							</div>
						</div>
						<div class="exam_info">
							<div class="avatar">
								<span>{{item.is_agree}}</span>
							</div>
							<div class="name">
								<span>{{item.name}}</span>
							</div>
							<div class="tel">
								<span>{{item.department_name}}</span>
							</div>
							<div class="operation">
								<span>{{item.add_time}}</span>
							</div>
						</div>
						<div>
							<img :src="list" alt="" v-for="(list,index) in item.picture" @click="cl_pic(item,index)" />
						</div>
					</div>
				</div>
				<div class="menu" v-show="handle_show">
					<el-button type="primary" plain @click="handle">处理</el-button>
					<div class="button" v-show="menuShow">
						<el-input type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
						<input name="token" type="hidden" :value="input_value">
						<input type="file" @change="getPic($event)" multiple="multiple" accept="image/png,image/jpeg" />
						<el-button type="primary" round @click="agree($event)">同意</el-button>
						<el-button type="danger" round @click="refuse">拒绝</el-button>
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
					<span>请款内容：</span><span>{{form_Lista.request_content}}</span>
				</div>
				<div>
					<span>项目负责人(项目经理)：</span><span>{{form_Lista.project_manager_name}}</span>
				</div>

				<div>
					<span>附件列表：</span>
					<a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
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
					<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444;">{{item}}</span>
				</div>
				<div>
					<span></span>
					<div v-for="item in form_Listb.content">
						<div class="exam_info">
							<div class="avatar lzz">
								<span style="margin-left: 5px;">状态</span>
							</div>
							<div class="tel lzz">
								<span>姓名</span>
							</div>
							<div class="name lzz">
								<span>部门</span>
							</div>
							<div class="operation lzz">
								<span>处理时间</span>
							</div>
						</div>
						<div class="exam_info">
							<div class="avatar">
								<span>{{item.is_agree}}</span>
							</div>
							<div class="name">
								<span>{{item.name}}</span>
							</div>
							<div class="tel">
								<span>{{item.department_name}}</span>
							</div>
							<div class="operation">
								<span>{{item.add_time}}</span>
							</div>
						</div>
						<div>
							<img :src="list" alt="" v-for="(list,index) in item.picture" @click="cl_pic(item,index)" />
						</div>
					</div>
				</div>
				<div class="menu" v-show="handle_show">
					<el-button type="primary" plain @click="handle">处理</el-button>
					<div class="button" v-show="menuShow">
						<el-input type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
						<input name="token" type="hidden" :value="input_value">
						<input type="file" @change="getPic($event)" multiple="multiple" accept="image/png,image/jpeg" />
						<el-button type="primary" round @click="agree($event)">同意</el-button>
						<el-button type="danger" round @click="refuse">拒绝</el-button>
					</div>
				</div>
			</div>
			<!--合同评审表展示-->
			<div class="form" name="合同评审表" v-if="pingshenbiao_show">
				<div>
					<span>工程名称：</span><span>{{form_Lista.contract_name}}</span>
				</div>
				<div>
					<span>合同名称：</span><span>{{form_Lista.contract_name_new}}</span>
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
					<span>备注：</span><span>{{form_Lista.remarks}}</span>
				</div>
				<div>
					<span>附件列表：</span>
					<a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
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
					<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444;">{{item}}</span>
				</div>
				<div>
					<span></span>
					<div v-for="item in form_Listb.content">
						<div class="exam_info">
							<div class="avatar lzz">
								<span style="margin-left: 5px;">状态</span>
							</div>
							<div class="tel lzz">
								<span>姓名</span>
							</div>
							<div class="name lzz">
								<span>部门</span>
							</div>
							<div class="operation lzz">
								<span>处理时间</span>
							</div>
						</div>
						<div class="exam_info">
							<div class="avatar">
								<span>{{item.is_agree}}</span>
							</div>
							<div class="name">
								<span>{{item.name}}</span>
							</div>
							<div class="tel">
								<span>{{item.department_name}}</span>
							</div>
							<div class="operation">
								<span>{{item.add_time}}</span>
							</div>
						</div>
						<div>
							<img :src="list" alt="" v-for="(list,index) in item.picture" @click="cl_pic(item,index)" />
						</div>
					</div>
				</div>
				<div class="menu" v-show="handle_show">
					<el-button type="primary" plain @click="handle">处理</el-button>
					<div class="button" v-show="menuShow">
						<el-input type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
						<input name="token" type="hidden" :value="input_value">
						<input type="file" @change="getPic($event)" multiple="multiple" accept="image/png,image/jpeg" />
						<el-button type="primary" round @click="agree($event)">同意</el-button>
						<el-button type="danger" round @click="refuse">拒绝</el-button>
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
					<a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
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
					<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444;">{{item}}
						</span>
				</div>
				<div>
					<span></span>
					<div v-for="item in form_Listb.content">
						<div class="exam_info">
							<div class="avatar lzz">
								<span style="margin-left: 5px;">状态</span>
							</div>
							<div class="tel lzz">
								<span>姓名</span>
							</div>
							<div class="name lzz">
								<span>部门</span>
							</div>
							<div class="operation lzz">
								<span>处理时间</span>
							</div>
						</div>
						<div class="exam_info">
							<div class="avatar">
								<span>{{item.is_agree}}</span>
							</div>
							<div class="name">
								<span>{{item.name}}</span>
							</div>
							<div class="tel">
								<span>{{item.department_name}}</span>
							</div>
							<div class="operation">
								<span>{{item.add_time}}</span>
							</div>
						</div>
						<div>
							<img :src="list" alt="" v-for="(list,index) in item.picture" @click="cl_pic(item,index)" />
						</div>
					</div>
				</div>
				<div class="menu" v-show="handle_show">
					<el-button type="primary" plain @click="handle">处理</el-button>
					<div class="button" v-show="menuShow">
						<el-input type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
						<input name="token" type="hidden" :value="input_value">
						<input type="file" @change="getPic($event)" multiple="multiple" accept="image/png,image/jpeg" />
						<el-button type="primary" round @click="agree($event)">同意</el-button>
						<el-button type="danger" round @click="refuse">拒绝</el-button>
					</div>
				</div>
			</div>
		</div>
		<browsePic :pic_index="pic_index" :img_arr="img_arr" :pic_show="pic_show" @left="last_one" @right="next_one" @close_pic="close_pic"></browsePic>
		<loading v-show="loading_show"></loading>
	</div>

</template>

<script>
	import loading from '@/base/loading/loading'
	import browsePic from '@/base/browse_pic/browse_pic'
	import { create_qinggoudan_list } from '@/common/js/approval/qinggoudan'
	import { create_gongzhang_list } from '@/common/js/approval/gongzhang'
	import { create_qingkuandan_list } from '@/common/js/approval/qingkuandan'
	import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
	import { create_hetongpingshen_list } from '@/common/js/approval/hetongpingshen'
	import { create_exam_list } from '@/common/js/approval/exam'
	import { create_approval_list } from '@/common/js/approval/approval_list'
	import { mapGetters ,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				untreated: [],
				now_type_name: '',
				handle_txt: '',
				nowType: 1,
				listShow: true,
				formShow: false,
				colorIndex: -1,
				listSeaShow:true,
				qingkuandan_show: false,
				cengpijian_show: false,
				qinggoudan_show: false,
				pingshenbiao_show: false,
				gongzhang_show: false,
				form_Lista: [],
				form_Listb: [],
				menuShow: false,
				ilaunched: true,
				searchShow:false,
				handle_time_show: false,
				approval_process: false,
				handle_show: true,
				pic_show: false,
				loading_show: false,
				nextPageShow: true,
				pic_index: 0,
				colorShow: false,
				input_value: '',
				file: '',
				pic_hash: '',
				activeName: '',
				classRadio:'1',
				img_arr: [],
				fileList: [],
				file_arr: [],
				pic_hash_arr: [],
				pageIndex: 1,
				searchInfo: '',
				classValue: '',
				approval_type:0,
				classIndex:-1,
				group:['合同评审表','请购单','请款单','呈批件','申请公章']
			}
		},
		computed: {
			...mapGetters([
				'user',
				'nowCompanyId'
			])
		},
		watch: {
			pageIndex(){
				this._getExamList()
				if(this.searchShow){
					this.doSearch()
				}
			},
			searchInfo(){
				this.doSearch()
			},
			nowCompanyId(){
				this._getExamList()
			}
		},
		created() {
			this._getUserCompanyList()
			this._getToken()
			this._getExamList()
		},
		components: {
			browsePic,
			loading
		},
		methods: {
			classButton(item,index){
				this.pageIndex = 1
				this.classIndex = index 
				if(item === '合同评审表'){
					this.approval_type = 1
				}else if(item ==='请购单'){
					this.approval_type = 3
				}else if(item ==='申请公章'){
					this.approval_type = 5
				}else if(item ==='呈批件'){
					this.approval_type = 6
				}else if(item ==='请款单'){
					this.approval_type = 7
				}
				this.doSearch()
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
			doSearch(){
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("company_id", this.nowCompanyId);
				param.append("select", this.searchInfo);
				param.append("type",parseInt(this.classRadio));
				param.append("each", '10');
				param.append("p", this.pageIndex);
				if(this.approval_type != -1){
					param.append("approval_type",this.approval_type);
				}
				this.$http.post("/index/Mobile/approval/select_approval", param)
				.then((res)=>{
					console.log(res)
					if(res.data.code === 0){
						let arr = []
						res.data.data.forEach((item) => {
							arr.push(create_exam_list(item))
						})
						this.untreated = arr
						if(arr.length < 10) {
							this.nextPageShow = false
						}
						this.listSeaShow = true
					}else{
						this.listSeaShow = false
						 this.$message.error('未查到相关数据');
					}
				})
			},
			doFiltrate(){
				if(this.searchShow){
					this.pageIndex = 1
					this._getExamList()
					this.listSeaShow = true
					this.classIndex = -1
					this.searchShow = false
				}else{
					this.pageIndex = 1
					this.listSeaShow = false
					this.searchShow = true
				}
				
			},
			biao(index) {
				this.colorIndex = index
				this.colorShow = true
			},
			colorOne(item) {
				this.$refs.list[this.colorIndex].style.background = "rgba(255,0,0,0.1)"
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("tagging", '#FF0000');
				param.append("participation_id", item.participation_id);
				this.$http.post("/index/Mobile/approval/add_tagging", param)
					.then((res) => {
						console.log(res)
						if(res.data.code === 0) {
							this.$message.success('标记成功');
						} else {
							this.$message.error('标记失败');
						}
					})
			},
			colorTwo(item) {
				this.$refs.list[this.colorIndex].style.background = "rgba(255,255,0,0.1)"
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("tagging", '#FFF000');
				param.append("participation_id", item.participation_id);
				this.$http.post("/index/Mobile/approval/add_tagging", param)
					.then((res) => {
						console.log(res)
						if(res.data.code === 0) {
							this.$message.success('标记成功');
						} else {
							this.$message.error('标记失败');
						}
					})
			},
			colorThree(item) {
				this.$refs.list[this.colorIndex].style.background = "rgba(0,255,0,0.1)"
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("tagging", '#00FF00');
				param.append("participation_id", item.participation_id);
				this.$http.post("/index/Mobile/approval/add_tagging", param)
					.then((res) => {
						if(res.data.code === 0) {
							this.$message.success('标记成功');
						} else {
							this.$message.error('标记失败');
						}
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
			}),
			colorFour(item) {
				this.$refs.list[this.colorIndex].style.background = "rgba(0,0,255,0.1)"
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("tagging", '#0000FF');
				param.append("participation_id", item.participation_id);
				this.$http.post("/index/Mobile/approval/add_tagging", param)
					.then((res) => {
						if(res.data.code === 0) {
							this.$message.success('标记成功');
						} else {
							this.$message.error('标记失败');
						}
					})
			},
			first_page() {
				this.nextPageShow = true
				this.pageIndex = 1
			},
			last_page() {
				this.nextPageShow = true
					--this.pageIndex
			},
			next_page() {
				++this.pageIndex
			},
			cl_pic(item, index) {
				this.img_arr = item.picture
				this.pic_index = index
				this.pic_show = true
			},
			getPic(event) {
				this.pic = event.target.files;
			},
			handleUpload() {},
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
			ctrl_pic_show() {
				this.pic_show = true
			},
			handle() {
				this.menuShow = true
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				this.$http.post("/index/Mobile/path/get_token", param)
					.then((res) => {
						this.input_value = res.data.data
					})
			},
			agree() {
				this.pic_hash_arr = []
				if(this.handle_txt === '') {
					this.$message.error('请填写审批意见');
					return
				}
				if(!this.pic) {
					this.loading_show = true
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("approval_id", this.untreated.approval_id);
					param.append("participation_id", this.form_Listb.participation_id);
					param.append("is_agree", '1');
					param.append("company_id", this.nowCompanyId);
					param.append("handle_txt", this.handle_txt);
					param.append("opinion", this.handle_txt);
					this.$http.post("/index/Mobile/find/approval_process", param)
						.then((res) => {
							this.loading_show = false
							this.handle_txt = ''
							this.listShow = true
							this.formShow = false
							this._getExamList()
							if(res.data.code === 0) {
								this.$message({
									message: '操作成功',
									type: 'success'
								});
							} else {
								this.$message.error('操作失败');
							}
						})
				}
				if(this.pic) {
					this.loading_show = true
					for(let i = 0; i < this.pic.length; i++) {
						let formData = new FormData();
						formData.append('file', this.pic[i]);
						formData.append('token', JSON.parse(localStorage.token));
						let config = {
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						}
						this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
							this.pic_hash_arr.push(res.data.hash)
							if(this.pic_hash_arr.length === this.pic.length) {
								let nparam = new URLSearchParams();
								nparam.append("uid", this.user.uid);
								nparam.append("picture", JSON.stringify(this.pic_hash_arr));
								this.$http.post("/index/Mobile/approval/upload_enclosure_new", nparam)
									.then((res) => {
										let param = new URLSearchParams();
										param.append("uid", this.user.uid);
										param.append("approval_id", this.untreated.approval_id);
										param.append("participation_id", this.form_Listb.participation_id);
										param.append("is_agree", '1');
										param.append("picture", res.data.data.enclosure_id);
										param.append("company_id", this.nowCompanyId);
										param.append("handle_txt", this.handle_txt);
										param.append("opinion", this.handle_txt);
										this.$http.post("/index/Mobile/find/approval_process", param)
											.then((res) => {
												this.loading_show = false
												this.handle_txt = ''
												this.listShow = true
												this.formShow = false
												this._getExamList()
												if(res.data.code === 0) {
													this.$message({
														message: '操作成功',
														type: 'success'
													});
												} else {
													this.$message.error('操作失败');
												}
											})
									})
							}
						})
					}
				}
			},
			refuse() {
				this.pic_hash_arr = []
				if(this.handle_txt === '') {
					this.$message.error('请填写审批意见');
					return
				}
				if(!this.pic) {
					this.loading_show = true
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("approval_id", this.untreated.approval_id);
					param.append("participation_id", this.form_Listb.participation_id);
					param.append("is_agree", '2');
					param.append("company_id", this.nowCompanyId);
					param.append("handle_txt", this.handle_txt);
					param.append("opinion", this.handle_txt);
					this.$http.post("/index/Mobile/find/approval_process", param)
						.then((res) => {
							this.loading_show = false
							this.handle_txt = ''
							this.listShow = true
							this.formShow = false
							this._getExamList()
							if(res.data.code === 0) {
								this.$message({
									message: '操作成功',
									type: 'success'
								});
							} else {
								this.$message.error('操作失败');
							}
						})
				}
				if(this.pic) {
					this.loading_show = true
					for(let i = 0; i < this.pic.length; i++) {
						let formData = new FormData();
						formData.append('file', this.pic[i]);
						formData.append('token', JSON.parse(localStorage.token));
						let config = {
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						}
						this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
							this.pic_hash_arr.push(res.data.hash)
							if(this.pic_hash_arr.length === this.pic.length) {
								let nparam = new URLSearchParams();
								nparam.append("uid", this.user.uid);
								nparam.append("picture", JSON.stringify(this.pic_hash_arr));
								this.$http.post("/index/Mobile/approval/upload_enclosure_new", nparam)
									.then((res) => {
										let param = new URLSearchParams();
										param.append("uid", this.user.uid);
										param.append("approval_id", this.untreated.approval_id);
										param.append("participation_id", this.form_Listb.participation_id);
										param.append("is_agree", '2');
										param.append("picture", res.data.data.enclosure_id);
										param.append("company_id", this.nowCompanyId);
										param.append("handle_txt", this.handle_txt);
										param.append("opinion", this.handle_txt);
										this.$http.post("/index/Mobile/find/approval_process", param)
											.then((res) => {
												this.loading_show = false
												this.handle_txt = ''
												this.listShow = true
												this.formShow = false
												this._getExamList()
												if(res.data.code === 0) {
													this.$message({
														message: '操作成功',
														type: 'success'
													});
												} else {
													this.$message.error('操作失败');
												}
											})
									})
							}
						})
					}
				}
			},
			return_list() {
				this.formShow = false
				this.listShow = true
				this.menuShow = false
				this.qingkuandan_show = false
				this.qinggoudan_show = false
				this.cengpijian_show = false
				this.pingshenbiao_show = false
				this.gongzhang_show = false

			},
			listCli(item) {
				this.listShow = false
				this.formShow = true
				this.qingkuandan_show = false,
					this.cengpijian_show = false,
					this.qinggoudan_show = false,
					this.pingshenbiao_show = false,
					this.gongzhang_show = false,
					this.now_type_name = item.type
				if(item.type === '呈批件') {
					this.cengpijian_show = true
				} else if(item.type === '请款单') {
					this.qingkuandan_show = true
				} else if(item.type === '请购单') {
					this.qinggoudan_show = true
				} else if(item.type === '合同评审表') {
					this.pingshenbiao_show = true
				} else if(item.type === '申请公章') {
					this.gongzhang_show = true
				}
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_id", item.approval_id);
				this.$http.post("/index/Mobile/approval/approval_process_show", param)
					.then((res) => {
						if(item.type === '呈批件') {
							this.form_Lista = create_cengpijian_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(item.type === '合同评审表') {
							this.form_Lista = create_hetongpingshen_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(item.type === '请款单') {
							this.form_Lista = create_qingkuandan_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(item.type === '申请公章') {
							this.form_Lista = create_gongzhang_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)

						} else if(item.type === '请购单') {
							this.form_Lista = create_qinggoudan_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						}
					})
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				nparam.append("approval_id", item.approval_id);
				nparam.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/approval/approval_process_personnel", nparam)
					.then((res) => {
						res.data.data.content.forEach((item, index) => {
							if(item.picture) {
								let arr = []
								let zparam = new URLSearchParams();
								zparam.append("enclosure_id", item.picture);
								this.$http.post("/index/Mobile/approval/look_enclosure", zparam)
									.then((res) => {
										res.data.data.picture.forEach((item) => {
											if(item != '') {
												arr.push('http://img-bbsf.6655.la/' + item)
											}
										})
									})
								res.data.data.content[index].picture = arr
							}
						})
						this.form_Listb = create_approval_list(res.data.data)
					})
			},
			//		获取图片
			get_img(many_enclosure) {
				if(!many_enclosure) {
					return
				}
				many_enclosure.forEach((item) => {
					if(item.type === 3) {
						let param = new URLSearchParams();
						param.append("enclosure_id", item.contract_id);
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
					}
				})
			},
			get_file(many_enclosure) {
				this.file_arr = []
				if(!many_enclosure) {
					return
				}
				many_enclosure.forEach((item) => {

					if(item.type === 4) {
						let param = new URLSearchParams();
						param.append("attachments_id", item.contract_id);
						this.$http.post("/index/Mobile/approval/look_attachments", param)
							.then((res) => {
								let obj = {}
								let file_data = res.data.data
								let file_add = 'http://img-bbsf.6655.la/' + file_data.attachments + '?attname=' + file_data.file_name + file_data.attribute
								obj.name = file_data.file_name
								obj.address = file_add
								this.file_arr.push(obj)
							})
					}
				})
			},
			handleClick(tab) {
				this.pageIndex = 1
				let index = parseInt(tab.index)
				this.nowType = index + 1
				if(index === 0) {
					this.handle_time_show = false
					this.approval_process = false
					this.ilaunched = true
					this.handle_show = true
				}
				if(index === 1) {
					this.handle_time_show = true
					this.approval_process = true
					this.ilaunched = true
					this.handle_show = false
				}
				if(index === 2) {
					this.handle_time_show = false
					this.approval_process = true
					this.ilaunched = false
					this.handle_show = false
				}
				this._getExamList()
			},
			closeMenu() {
				this.menuShow = false
			},
			_getExamList() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("type", this.nowType);
				param.append("each", '10');
				param.append("p", this.pageIndex);
				param.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/approval/see_approval_list", param)
					.then((res) => {
						let arr = []
						res.data.data.forEach((item) => {
							arr.push(create_exam_list(item))
						})
						this.untreated = arr
						if(arr.length < 10) {
							this.nextPageShow = false
						}
					})
			},
			_getToken() {
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				this.$http.post("/index/Mobile/path/get_token", nparam)
					.then((res) => {
						localStorage.token = JSON.stringify(res.data.data);
					})
			}
		},
		
	}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0
}
.fade1-enter-active, .fade1-leave-active {
  transition: opacity .5s;
  transform: translateY(-54px);
}
.fade1-enter, .fade1-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0;
  
}
	.exam_wrapper {
		width: 100%;
		height: 100%;
		>.exam {
			width: 600px;
			overflow: hidden;
			/*background: #FFFFFF;*/
			>.nav {
				position: relative;
				font-weight: 700;
				>.filtrate {
					position: absolute;
					top: 12px;
					right: 20px;
					font-size: 14px;
					cursor: pointer;
				}
				.el-tabs__header{
					background: #FFFFFF;
					margin-bottom: 5px;
				}
				.el-tabs__active-bar {
					width: 150px;
				}
				.el-tabs__item {
					font-weight: 700;
					width: 160px;
					text-align: center;
				}
			}
			>.search {
				background: #FFFFFF;
				padding-top: 50px;
				padding-bottom: 20px;
				>.one {
					display: inline-block;
					margin-left: 40px;
				}
				>.two {
					display: inline-block;
					margin-left: 40px;
				}
				>.three{
					margin: 15px;
					span{
						display: inline-block;
						cursor: pointer;
						margin-left: 10px;
						padding: 8px 20px;
						border-radius: 4px;
						font-size: 14px;
						color: #878d99;
						background: #f3f4f5;
						&:hover{
							background: #878d99;
							color: #FFFFFF;
						}
						&.active{
							background: #878d99;
							color: #FFFFFF;
							
						}
					}
				}
				.el-input__inner {
					width: auto;
				}
				.el-input{
					width: auto;
				}
			}
			>.list {
				width: 600px;
				>ul {
					>.page {
						width: 100%;
						padding: 4px;
						text-align: center;
						span {
							cursor: pointer;
							font-size: 12px;
							&:hover {
								color: #409EFF;
							}
						}
					}
					>li {
						background: #FFFFFF;
						display: block;
						margin-bottom: 5px;
						color: #2D2F33;
						font-size: 13px;
						oz-box-shadow: 1px 1px 2px #999999;
						-webkit-box-shadow: 1px 1px 2px #999999;
						box-shadow: 1px 1px 2px #999999;
						>.avatar {
							display: inline-block;
							vertical-align: top;
							margin: 8px 15px 0 15px;
							img {
								width: 40px;
								height: 40px;
								border-radius: 4px;
								display: block;
							}
						}
						>.edit {
							display: inline-block;
							float: right;
							margin-right: 20px;
							margin-top: 20px;
							cursor: pointer;
							.el-button.is-round {
								padding: 4px 12px;
							}
							.process {
								margin-top: 10px;
							}
							>.color {
								position: relative;
								width: 50px;
								height: 30px;
								margin-top: 20px;
								>span {
									float: right;
									margin-right: 10px;
									display: inline-block;
									width: 28px;
									text-align: center;
									height: 28px;
									font-weight: 700;
									line-height: 28px;
									border-radius: 50%;
									background: #FFFFFF;
									border: 1px solid #999999;
								}
								>.choose {
									transition: all 1s;
									position: absolute;
									right: 50px;
									bottom: 2px;
									width: 128px;
									height: 28px;
									display: flex;
									>span {
										border-radius: 50%;
										flex: 1;
										margin-left: 4px;
										&:nth-child(1) {
											background: #ff0000;
										}
										&:nth-child(2) {
											background: #ffff00;
										}
										&:nth-child(3) {
											background: #00ff00;
										}
										&:nth-child(4) {
											background: #0000ff;
										}
									}
								}
							}
						}
						.content {
							padding: 4px 0;
							display: inline-block;
							>div {
								height: 20px;
								line-height: 20px;
							}
						}
					}
				}
			}
		}
		.form_wrapper {
			min-height: 400px;
			background: #FFFFFF;
			width: 600px;
			overflow: hidden;
			box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
			.top {
				width: 100%;
				display: block;
				button {
					margin-left: 10px;
					margin-top: 10px;
					display: inline-block;
				}
				.title {
					width: 100%;
					display: inline-block;
					text-align: center;
					height: 30px;
					line-height: 30px;
				}
			}
			.form {
				padding: 10px;
				color: #999999;
				.exam_info {
					cursor: default;
					display: block;
					border-bottom: 1px solid #DDDDDD;
					font-size: 14px;
					transition: .3s;
					margin-bottom: 4px;
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
						height: 40px;
						line-height: 40px;
						display: inline-block;
					}
					.avatar {
						vertical-align: top;
						width: 70px;
					}
					.name {
						width: 100px;
					}
					.tel {
						width: 100px;
					}
					.operation {
						width: 200px;
						button {
							display: block;
						}
					}
				}
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
						margin-right: 10px;
						display: inline-block;
						width: 80px;
						cursor: pointer;
					}
				}
				.file {
					font-size: 14px;
					margin: 4px auto;
					display: block;
					height: 24px;
					width: 80%;
					line-height: 24px;
					color: #5A5E66;
					border: 1px solid #F9F9F9;
					border-radius: 4px;
					background: #DDDDDD;
					text-align: center;
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
						min-width: 180px;
						height: 30px;
						line-height: 30px;
						span {
							margin-left: 5px;
							color: #444444;
						}
					}
				}
				.menu {
					margin-top: 10px;
					border-bottom: none;
					>button {
						display: block;
					}
					.button {
						margin-top: 10px;
						margin-left: 120px;
						display: block;
						font-size: 0;
						z-index: 2;
						width: 300px;
						input[type="file"] {
							margin: 10px 0 10px 0px;
						}
						>button {
							margin-left: 50px;
						}
					}
				}
			}
		}
	}
</style>
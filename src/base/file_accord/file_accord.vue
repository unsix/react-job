<template>
	<div class="file_accord">
		<div class="form" name="请购单" v-if="qgdShow">
			<div class="close">
				<el-button type="danger" plain @click="close">关闭</el-button>
			</div>
			<div class="top">
				<span class="title">请购单</span>
			</div>
			<div v-if="form_Lista.request_contract_address">
				<span>工程名称：</span><span>{{form_Lista.request_contract_address}}</span>
			</div>
			<div v-if="form_Lista.contract_name_new">
				<span>合同名称：</span><span>{{form_Lista.contract_name_new}}</span>
			</div>
			<div v-if="form_Lista.department_name">
				<span>请购部门：</span><span>{{form_Lista.department_name}}</span>
			</div>
			<div v-if="form_Lista.buy_person">
				<span>采购执行人：</span><span>{{form_Lista.buy_person}}</span>
			</div>
			<div v-if="form_Lista.buy_person_phone">
				<span>采购执行人联系方式：</span><span>{{form_Lista.buy_person_phone}}</span>
			</div>
			<div v-if="form_Lista.contract_responsible">
				<span>工程负责人：</span><span>{{form_Lista.contract_responsible}}</span>
			</div>
			<div v-if="form_Lista.responsible_tel">
				<span>工程负责人联系方式：</span><span>{{form_Lista.responsible_tel}}</span>
			</div>
			<div v-if="form_Lista.receive_address">
				<span>收货地址：</span><span>{{form_Lista.receive_address}}</span>
			</div>
			<div v-if="form_Lista.arrival_time">
				<span>要求到货时间：</span><span>{{form_Lista.arrival_time}}</span>
			</div>
			<div v-if="form_Lista.consignee">
				<span>收货人姓名：</span><span>{{form_Lista.consignee}}</span>
			</div>
			<div v-if="form_Lista.consignee_phone">
				<span>收货人联系方式：</span><span>{{form_Lista.consignee_phone}}</span>
			</div>
			<div v-if="form_Lista.project_manager_name ">
				<span>项目负责人(部门经理)：</span><span>{{form_Lista.project_manager_name}}</span>
			</div>
			<div v-if="form_Lista.content.length != 0" v-for="item in form_Lista.content" class="qingdan_qinggou">
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
				<a v-for="(item,index) in file_arr" :href="item.address" class="file">{{item.name}}</a>
			</div>
			<div>
				<span>图片附件：</span>
				<a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list">
					<img :src="item" alt=""  @click="ctrl_pic_show(form_Lista.img_list,index)"/>
				</a>
			</div>
			<div v-if="form_Listb.found_name">
				<span>发起人：</span><span>{{form_Listb.found_name}}</span>
			</div>
			<div v-if="form_Listb.list">
				<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444;">{{item}}</span>
			</div>
			<div>
				<span>审批：</span>
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
						<span>时间</span>
					</div>
				</div>
				<div v-for="item in form_Listb.content">
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
			<div v-if="form_Listb.finance">
				<span>表单回执：</span>
				<br />
				<span style="color: #444444;">
						<span v-html="form_Listb.finance.finance_state"></span> {{form_Listb.finance.name}} {{form_Listb.finance.receipt_content}} {{form_Listb.finance.save_time}}
				<div><img :src="list" alt="" v-for="(list,index) in form_Listb.re_pic" @click="rec_pic(form_Listb.re_pic,index)" /></div>
				</span>
			</div>
		</div>
		<div class="form" name="合同评审表" v-if="psbShow">
			<div class="close">
				<el-button type="danger" plain @click="close">关闭</el-button>
			</div>
			<div class="top">
				<span class="title">合同评审表</span>
			</div>
			<div v-if="form_Lista.contract_name ">
				<span>工程名称：</span><span>{{form_Lista.contract_name}}</span>
			</div>
			<div v-if="form_Lista.contract_name_new">
				<span>合同名称：</span><span>{{form_Lista.contract_name_new}}</span>
			</div>
			<div v-if="form_Lista.contract_num">
				<span>合同编号：</span><span>{{form_Lista.contract_num}}</span>
			</div>
			<div v-if="form_Lista.a_name">
				<span>甲方：</span><span>{{form_Lista.a_name}}</span>
			</div>
			<div v-if="form_Lista.b_name">
				<span>乙方：</span><span>{{form_Lista.b_name}}</span>
			</div>
			<div v-if="form_Lista.executor">
				<span>执行人：</span><span>{{form_Lista.executor}}</span>
			</div>
			<div v-if="form_Lista.project_manager_name">
				<span>项目负责人(项目经理)：</span><span>{{form_Lista.project_manager_name}}</span>
			</div>
			<div v-if="form_Lista.prive">
				<span>单价：</span><span>{{form_Lista.prive}}</span>
			</div>
			<div v-if="form_Lista.total_prive">
				<span>总价：</span><span>{{form_Lista.total_prive}}</span>
			</div>
			<div v-if="form_Lista.difference">
				<span>与投标价格差异：</span><span>{{form_Lista.difference}}</span>
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
      <div v-if="form_Lista.content">
        <ul>
          <li v-for="item in form_Lista.content">
            <p>材料名称：<span>{{item.material_name}}</span></p>
            <p><b>单位：<span>{{item.unit}}</span></b> <b>数量：<span>{{item.num}}</span></b></p>
            <p><b>单价：<span>{{item.prive}}</span></b> <b>合计：<span>{{item.total_prive}}</span></b></p>
            <p><b>联系人：<span>{{item.contacts}}</span></b> <b>联系方式：<span>{{item.tel}}</span></b></p>
          </li>
        </ul>
      </div>
			<div v-if="form_Lista.remarks">
				<span>合同主要内容：</span><span>{{form_Lista.remarks}}</span>
			</div>
			<div>
				<span>附件列表：</span>
				<a v-for="(item,index) in file_arr" :href="item.address" class="file">{{item.name}}</a>
			</div>
			<div v-if="form_Lista.img_list">
				<span>图片附件：</span>
				<a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list">
					<img :src="item" alt="" @click="ctrl_pic_show(form_Lista.img_list,index)"/>
				</a>
			</div>
			<div v-if="form_Listb.found_name">
				<span>发起人：</span><span>{{form_Listb.found_name}}</span>
			</div>
			<div v-if="form_Listb.list">
				<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444;margin-left: 4px;">{{item}}</span>
			</div>
			<div>
				<span>审批：</span>
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
						<span>时间</span>
					</div>
				</div>
				<div v-for="item in form_Listb.content">
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
						<img :src="list" alt="" v-for="(list,index) in item.picture" />
					</div>
				</div>
			</div>
			<div v-if="form_Listb.finance">
				<span>表单回执：</span>
				<br />
				<span style="color: #444444;">
				<span v-html="form_Listb.finance.finance_state"></span> {{form_Listb.finance.name}} {{form_Listb.finance.receipt_content}} {{form_Listb.finance.save_time}}
				<div>
					<img :src="list" alt="" v-for="(list,index) in form_Listb.re_pic" />
				</div>
				</span>
			</div>
		</div>
		<div class="form" name="呈批件" v-if="cpjShow">
			<div class="close">
				<el-button type="danger" plain @click="close">关闭</el-button>
			</div>
			<div class="top">
				<span class="title">呈批件</span>
			</div>
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
				<a  v-for="(item,index) in file_arr" :href="item.address"  class="file">{{item.name}}</a>
			</div>
			<div>
				<span>图片附件：</span>
				<a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list">
					<img :src="item" alt="" @click="ctrl_pic_show(form_Lista.img_list,index)"/>
				</a>
			</div>
			<div>
				<span>发起人：</span><span>{{form_Listb.found_name}}</span>
			</div>
			<div>
				<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444; margin-left: 8px;">{{item}}
						</span>
			</div>
			<div>
				<span>审批：</span>
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
						<span>时间</span>
					</div>
				</div>
				<div  v-for="item in form_Listb.content">
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
						<img :src="list" alt="" v-for="(list,index) in item.picture"  />
					</div>
				</div >

      </div>
		</div>

    <browsePic :pic_index="pic_index" ref="browe" :img_arr="arr_list"  v-show="pic_show"></browsePic>
	</div>
</template>

<script>
	import {getPic} from '@/common/js/pic.js'
  import { getAvatar } from '@/common/js/avatar.js'
  import { getCro } from "@/common/js/crowd";
  import { create_qinggoudan_list } from '@/common/js/approval/qinggoudan'
	import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
	import { create_hetongpingshen_list } from '@/common/js/approval/hetongpingshen'
	import { create_approval_list } from '@/common/js/approval/approval_list'
  import { create_approval_personal_list } from "@/common/js/approval/approval_personal_list";
  import browsePic from '@/base/browse_pic/browse_pic'
	import { mapGetters } from 'vuex'
	export default {
		props: {
			request_money_basis_type: {
				type: String
			},
			form_approval_id: {
				type: String,
				default: '0'
			}
		},
		created() {
			setTimeout(() => {
				this.zz()
			}, 300)
		},
		watch: {

		},
		data() {
			return {
				form_Lista: [],
				form_Listb: [],
				file_arr: [],
				img_arr: [],
				qgdShow: false,
				psbShow: false,
				cpjShow: false,
				type: '',
        pic_index: 0,
        pic_show: false,
        arr_list: [],
			}

		},
		computed: {
			...mapGetters([
				'user',
				'nowCompanyId'
			])

		},
		methods: {
			zz() {
        this.getData()
				if(!this.request_money_basis_type) {
					this.type = '请购单'
				} else {
					this.type = this.request_money_basis_type
				}
			},
			close() {
				this.$emit('closeAcc')
			},
			getData() {
				this.qgdShow = false
				this.psbShow = false
				this.cjpShow = false
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_id", this.form_approval_id);
				this.$http.post("/index.php/Mobile/approval/approval_process_show", param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
						if(this.type === '呈批件') {
							this.cpjShow = true
							this.form_Lista = create_cengpijian_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(this.type === '合同评审表') {
							this.psbShow = true
							this.form_Lista = create_hetongpingshen_list(res.data.data)
              if(this.form_Lista.many_enclosure){
                this.get_img(this.form_Lista.many_enclosure)
                this.get_file(this.form_Lista.many_enclosure)
              }else{
                this.get_img(this.form_Lista.enclosure_id)
                this.get_file(this.form_Lista.enclosure_id)
              }
						} else if(this.type === '请购单') {
							this.qgdShow = true
							this.form_Lista = create_qinggoudan_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						}
					})
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				nparam.append("approval_id", this.form_approval_id);
				nparam.append("company_id", this.nowCompanyId);
				this.$http.post("/index.php/Mobile/approval/approval_process_personnel", nparam)
					.then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
						res.data.data.content.forEach((item, index) => {
							if(item.picture) {
								let arr = []
								let zparam = new URLSearchParams();
								zparam.append("enclosure_id", item.picture);
								this.$http.post("/index.php/Mobile/approval/look_enclosure", zparam)
									.then((res) => {
                    var current = this
                    var judge = res.data.code
                    getCro(judge,current)
										res.data.data.picture.forEach((item) => {
											if(item != '') {
												arr.push(getPic(item))
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
        if(typeof many_enclosure == 'string'){
          let param = new URLSearchParams();
          param.append("enclosure_id", many_enclosure);
          this.$http.post("/index.php/Mobile/approval/look_enclosure", param)
            .then((res) => {
              var current = this
              var judge = res.data.code
              getCro(judge,current)
              let arr = []
              res.data.data.picture.forEach((item) => {
                if(item != '') {
                  arr.push(getAvatar(item))
                }
              })
              // this.img_arr = arr
              this.$set(this.form_Lista, 'img_list', arr)
            })
        }else{
          many_enclosure.forEach((item) => {
            if(item.type === 3) {
              let param = new URLSearchParams();
              param.append("enclosure_id", item.contract_id);
              this.$http.post("/index.php/Mobile/approval/look_enclosure", param)
                .then((res) => {
                  var current = this
                  var judge = res.data.code
                  getCro(judge,current)
                  let arr = []
                  res.data.data.picture.forEach((item) => {
                    if(item != '') {
                      arr.push(getAvatar(item))
                    }
                  })
                  // this.img_arr = arr
                  this.$set(this.form_Lista, 'img_list', arr)
                })
            }
          })
        }
      },
      get_file(many_enclosure) {
        this.file_arr = []
        if(!many_enclosure) {
          return
        }
        if(typeof many_enclosure == 'string'){
          return
        }
        many_enclosure.forEach((item) => {
          if(item.type === 4) {
            let param = new URLSearchParams();
            param.append("attachments_id", item.contract_id);
            this.$http.post("/index.php/Mobile/approval/look_attachments", param)
              .then((res) => {
                var current = this
                var judge = res.data.code
                getCro(judge,current)
                let obj = {}
                let file_data = res.data.data
                let file_add = 'http://bbsf-file.hzxb.net/' + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                obj.name = file_data.file_name+'.'+file_data.attribute
                obj.address = file_add
                this.file_arr.push(obj)
              })
          }
        })
      },
      ctrl_pic_show(item, index) {
        item.forEach((res)=>{
          let current = res.indexOf('?')
          this.arr_list.push(res.slice(0,current) + '?imageslim' )
        })
        this.pic_index = index
        this.pic_show = true
      },
		},
    components:{
      browsePic
    }
	}
</script>

<style lang="scss">
	.file_accord {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 10;
		.form {
			overflow-y: scroll;
			overflow-x: hidden;
			background: #FFFFFF;
			color: #999999;
			padding: 10px;
			width: 600px;
			margin: 50px auto;
			height: 600px;
			.close {
        width: 100%;
        height: 40px;
        button{
          float: right;
          margin-right: 20px;
        }
        padding-bottom: 10px;
			}
			>.top {
				width: 100%;
				display: block;
				button {
					margin-left: 10px;
					margin-top: 10px;
					display: inline-block;
				}
				.title {
					font-size: 16px;
					width: 100%;
					display: inline-block;
					text-align: center;
					height: 30px;
					line-height: 30px;
				}
			}
			.exam_info {
				cursor: default;
				display: block;
				border-bottom: 1px solid #DDDDDD;
				font-size: 14px;
				transition: .3s;
				margin-bottom: 0px;
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
					width: 40px;
				}
        ul{
          li{
            margin-bottom: 5px;
            font-size: 14px;
            p{
              margin-top: 5px;
              span{
                color: #000;
              }
              b{
                width: 250px;
                display: inline-block;
                font-weight: normal;
                span{
                  color: #000;
                }
              }
            }
          }
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
</style>

<template>
    <div class="contractApproval" v-show="contractApprovalShow">
      <div class="top">
        <el-button type="info" size="small" @click="_return">返回</el-button>
        <p>设置审批</p>
      </div>
      <div style="height: 50px;overflow: hidden">
        <div class="addPerson">
          <el-button type="primary" round style="margin-right: 10px;"  @click="save">保存修改</el-button>
        </div>
      </div>
      <div class="chooseApprovalPerson">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="人员列表" name="1">
            <div class="info" v-for="(item,index) in comPersonList" @click="chooseContractApprovalPerson(item,index)">
              <div class="avatar">
                <img :src="item.avatar" alt="" />
              </div>
              <div class="content">
                <span class="name">{{item.department_name}}</span>
                <span class="name">{{item.name}}</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="jurisdictionFormList">
        <ul>
          <li v-for="(item,index) in jurisdictionFormList" :key="item.name">
            <div class="info">
              <img :src="item.avatar" alt="" />
              <span>{{item.name}}</span>
							<i class="delete el-icon-error" @click="deletejurisdictionFormList(item,index)"></i>
							<i class="up el-icon-caret-top" @click="upjurisdictionFormList(item,index)" v-show="index!=0"></i>
							<i class="down el-icon-caret-bottom" @click="downjurisdictionFormList(item,index)" v-show="index != jurisdictionFormList.length-1"></i>
              <i class="setting" @click="setting(item,index)">设置</i>
            </div>
          </li>
        </ul>
      </div>
      <div class="dialog_wrapper" v-show="dialogVisible">
        <div class="dialog">
          <div class="title">
            <span>提示</span>
          </div>
          <div class="close">
            <i class="el-icon-close" @click="cancel"></i>
          </div>
          <div class="info">
            <span>您确定提交吗</span>
          </div>
          <div class="button">
            <span @click="submit">确定</span>
            <span @click="cancel">取消</span>
          </div>
        </div>
      </div>

      <div class="setting_main" v-if="setting_show">
        <div>
          <h2>设置审批权限</h2>
          <i class="el-icon-close" @click="close_as"></i>
          <div class="mand">
            <p style="padding-bottom:5px">必填字段</p>
            <el-tag style="margin-left: 5px" :key="item" v-for="item in form_content.required" closable :disable-transitions="false" @close="mandClose(item)">{{item}}</el-tag>
            <el-input class="input-new-tag" style="width: 90px;" v-if="mandVisible" v-model="mand_Value" ref="mand_tag" size="small" @keyup.enter.native="mands_con" @blur="mands_con"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="show_mand" >新建</el-button>
          </div>
          <div class="choice">
            <p style="padding-bottom:5px">可选字段</p>
            <el-tag style="margin-left: 5px" :key="item" v-for="item in form_content.optional" closable :disable-transitions="false" @close="choiceClose(item)">{{item}}</el-tag>
            <el-input class="input-new-tag" style="width: 90px;" v-if="choiceVisible" v-model="choice_Value" ref="choice_tag" size="small" @keyup.enter.native="choice_con" @blur="choice_con"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="show_choice" >新建</el-button>
          </div>
          <div class="describe">
            <p>
              <span>附件描述</span>
              <el-input class="input" style="width: 300px;margin-left: 25px" v-model="describe"></el-input>
            </p>
          </div>
          <div style="height: 25px">
            <el-button type="info" style="float: right;margin-right: 30px" @click="submit_mand" size="small">提交</el-button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
	import {getPic} from '@/common/js/pic.js'
  import {getCro} from "@/common/js/crowd";
  import {getAvatar} from '@/common/js/avatar.js'
  import { mapGetters, mapMutations } from 'vuex'
	import { createPersonInfo } from 'common/js/person_info'
	import { createOrder } from 'common/js/order'
	export default {
		data() {
			return {
				contractApprovalShow: false,
				originalJurisdictionFormList: [],
				dialogVisible: false,
				submitAddPersonShow: false,
				numOne: 0,
				perIndex: -1,
				arr: [],
				activeNames: ['1'],
        btn_show: true,
        setting_show:false,
        describe:'',
        target_uid:'',
        form_content:{
          required: [],
          optional:[],
        },
        mandVisible: false,
        choiceVisible:false,
        mand_Value: '',
        choice_Value:'',
        people_arr:[],
        form_fill:{
				  optional:[],
          required:[]
        }
			}
		},
		props: {
			jurisdictionFormList: {
				type: Array,
				default: []
			},
			formType: {
				type: Number
			},
      fuJias:{

      }
		},
		computed: {
			...mapGetters([
				'nowCompanyId',
				'user',
				'comPersonList',
				'comPartPersonList'
			])
		},
		methods: {
      ...mapMutations({
        setComPersonList: 'SET_COM_PERSON_LIST',
        setCompanyList: 'SET_COMPANYLIST'
      }),
			save() {
				this.dialogVisible = true
				this.activeNames = ['0']
			},
			cancel() {
				this.dialogVisible = false
				this.submitAddPersonShow = false
			},
			submit() {
				this.arr = []
				this.jurisdictionFormList.forEach((item, index) => {
					this.arr.push(createOrder(item, index))
				})
				this.dialogVisible = false
        this.btn_show=true
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("company_id", this.nowCompanyId);
				param.append("type", this.formType);
				param.append("sequence", JSON.stringify(this.arr));
				this.$http.post("/index.php/Mobile/approval/set_sequence", param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
						this.submitAddPersonShow = false
						this.$emit('reload')
						if(res.data.code === 0) {
							this.$message({
								message: '修改成功',
								type: 'success'
							});
						} else {
							this.$message.error('修改失败');
						}
					})
			},
			redact() {
				this.submitAddPersonShow = true
        this.btn_show = false
				this.activeNames = ['1']
				this.originalJurisdictionFormList = this.jurisdictionFormList
			},
      _returns(){
			  this.btn_show=true
        this.submitAddPersonShow = false
        this.activeNames = ['0']
        this.jurisdictionFormList = this.originalJurisdictionFormList
      },
			//			选择合同评审表人员
			chooseContractApprovalPerson(item) {
				for(let i = 0; i < this.jurisdictionFormList.length; i++) {
					if(item.name === this.jurisdictionFormList[i].name) {
						this.$message.error(item.name + '已经在列表中！');
						return
					}
				}
        this.activeNames = ['1']
				this.jurisdictionFormList.push(item)
			},
			//			删除合同评审表人员
			deletejurisdictionFormList(item, index) {

				this.jurisdictionFormList.splice(index, 1)
			},
			upjurisdictionFormList(item, index) {
				if(index === 0) {
					return
				}
				let nowItem = this.jurisdictionFormList[index]
				let upItem = this.jurisdictionFormList[index - 1]
				this.$set(this.jurisdictionFormList, index, upItem);
				this.$set(this.jurisdictionFormList, index - 1, nowItem);
			},
			downjurisdictionFormList(item, index) {
				let len = this.jurisdictionFormList.length
				if(index === len - 1) {
					return
				}
				let nowItem = this.jurisdictionFormList[index]
				let downItem = this.jurisdictionFormList[index + 1]
				this.$set(this.jurisdictionFormList, index, downItem);
				this.$set(this.jurisdictionFormList, index + 1, nowItem);
			},
      setting(item,index){
        this.setting_show = true
        this.target_uid =item.uid
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        param.append('approval_type',this.formType)
        param.append('target_uid',item.uid)
        this.$http.post('index.php/Mobile/approval/find_sequence_attachment_appoint_new',param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            if(res.data.code == 0){
              let obj = res.data.data
              if(obj.enclosure_describe){
                this.describe = obj.enclosure_describe
              }
              if(obj.form_content){
                if(obj.form_content.required.length > 0){
                  this.form_content.required = obj.form_content.required
                }
                if(obj.form_content.optional.length > 0){
                  this.form_content.optional = obj.form_content.optional
                }
              }
              if(obj.auto_fill_fields){
                if(obj.auto_fill_fields.required.length > 0){
                  obj.auto_fill_fields.required.forEach((item)=>{
                    this.form_content.required.push(item.name)
                    this.form_fill.required.push(item.id)
                  })
                }
                if(obj.auto_fill_fields.optional.length > 0){
                  obj.auto_fill_fields.optional.forEach((item)=>{
                    this.form_content.optional.push(item.name)
                    this.form_fill.optional.push(item.id)
                  })
                }
              }
            }
          })
      },
      close_as(){
        this.setting_show = false
        this.form_content.required = []
        this.form_content.optional = []
        this.fuJia = []
        this.describe = ''
      },
      submit_mand(){
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        param.append('type',this.formType)
        param.append('target_uid',this.target_uid)
        param.append('form_content',JSON.stringify(this.form_content))
        param.append('enclosure_describe',this.describe)
        param.append('auto_fill_fields',JSON.stringify(this.form_fill))
        this.$http.post('index.php/Mobile/approval/add_sequence_attachment',param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            if(res.data.code == 0){
              this.setting_show = false
              this.$message.success(res.data.message)
            }else{
              this.$message.error(res.data.message)
            }
          })
      },
      _getUserCompanyList() {
        let param = new URLSearchParams();
        param.append("uid", this.user.uid);
        this.$http.post("/index.php/Mobile/user/companies_list", param)
          .then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            this.setCompanyList(res.data.data)
          })
      },
      _getComPersonList() {
        let newparam = new URLSearchParams();
        newparam.append("company_id", this.nowCompanyId);
        this.$http.post("/index.php/Mobile/user/get_company_personnel", newparam)
          .then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            let reaDa = []
            res.data.data.forEach((item) => {
              item.avatar = getAvatar(item.avatar)
              reaDa.push(item)
            })
            this.setComPersonList(reaDa)
          })
      },
      _return(){
			  this.$emit('_return')
      },
      mandClose(tag) {
        this.form_content.required.splice(this.form_content.required.indexOf(tag), 1);
        this.fuJia.splice(this.fuJia.indexOf(tag), 1);

      },
      show_mand() {
        this.mandVisible = true;
        this.$nextTick(_ => {
          this.$refs.mand_tag.$refs.input.focus();
        });
      },
      mands_con() {
        let inputValue = this.mand_Value;
        if (inputValue) {
          this.form_content.required.push(inputValue);
        }
        this.mandVisible = false;
        this.mand_Value = '';
      },
      choiceClose(tag){
        this.form_content.optional.splice(this.form_content.optional.indexOf(tag), 1);
      },
      show_choice(){
        this.choiceVisible = true;
        this.$nextTick(_ => {
          this.$refs.choice_tag.$refs.input.focus();
        });
      },
      choice_con(){
        let inputValue = this.choice_Value;
        if (inputValue) {
          this.form_content.optional.push(inputValue);
        }
        this.choiceVisible = false;
        this.choice_Value = '';
      }
		},
		watch: {
			jurisdictionFormList() {
//				this.submitAddPersonShow = false
				this.activeNames = ['0']
			},
      formType(){
				this.submitAddPersonShow = false
			}
		},
    created(){
      this._getUserCompanyList()
      this._getComPersonList()
    }
	}
</script>

<style lang="scss" scoped>
	.dialog_wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		z-index: 10;
		.dialog {
			opacity: 1;
			width: 30%;
			background: #fff;
			margin: 200px auto;
			padding: 10px;
			>div {
				display: inline-block;
			}
			.close {
				cursor: pointer;
				float: right;
				padding: 2px;
				&:hover {
					color: #3487E2;
				}
			}
			.info {
				display: block;
				clear: both;
				height: 80px;
				line-height: 80px;
				font-size: 14px;
				color: #2D2F33;
			}
			.button {
				display: block;
				width: 100%;
				height: 30px;
				span {
					border-radius: 4px;
					text-align: center;
					font-size: 14px;
					cursor: pointer;
					float: right;
					margin-right: 10px;
					width: 60px;
					height: 30px;
					line-height: 30px;
					background: #FFFFFF;
					border: 1px solid #3487E2;
				}
			}
		}
	}

	.contractApproval {
		position: relative;
    .top {
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      .el-button {
        position: absolute;
        top: 8px;
        left: 5px;
        margin: 0 !important;
      }
      p {
        width: 500px;
        margin: 0 auto;
        text-align: center;
        font-weight: bolder;
        padding: 15px 0;
      }
    }
		.addPerson {
			display: block;
			float: right;
      padding: 10px 15px;
		}
		.submitAddPerson {
			position: absolute;
			top: 360px;
			right: 10px;
			display: inline-block;
			float: right;
		}
		.jurisdictionFormList {
			margin-top: 10px;
			width: 300px;
			ul {
				li {
					.group {
						display: block;
						height: 20px;
						color: #FFFFFF;
						background: #878D99;
						line-height: 20px;
						-webkit-border-radius: 4px;
						-moz-border-radius: 4px;
						border-radius: 4px;
						text-indent: 10px;
					}
					.info {
						display: block;
						height: 30px;
						font-size: 0;
						cursor: default;
						position: relative;
						border-bottom: 1px solid #5A5E66;
						img {
							display: inline-block;
							width: 26px;
							height: 26px;
							-webkit-border-radius: 50%;
							-moz-border-radius: 50%;
							border-radius: 50%;
							vertical-align: top;
							margin-top: 2px;
							margin-left: 4px;
						}
						span {
							font-size: 14px;
							line-height: 30px;
							margin-left: 10px;
						}
						.up {
							line-height: 30px;
							font-size: 14px;
							float: right;
							position: absolute;
							right: 45px;
							cursor: pointer;
							display: inline-block;
						}
						.down {
							display: inline-block;
							line-height: 30px;
							font-size: 14px;
							float: right;
							position: absolute;
							right: 80px;
							cursor: pointer;
						}
						.delete {
							line-height: 30px;
							font-size: 14px;
							float: right;
							margin-right: 10px;
							color: #878D99;
							&:hover {
								color: #FA5555;
							}
						}
            .setting{
              line-height: 30px;
              font-size: 14px;
              float: right;
              margin-right: 95px;
              color: #878D99;
              cursor: pointer;
            }
					}
				}
			}
		}
		.chooseApprovalPerson {
			position: absolute;
			right: 10px;
			top: 120px;
			width: 200px;
			height: 300px;
			overflow-y: scroll;
			overflow-x: hidden;
			.info {
				cursor: default;
				font-size: 0;
				margin-bottom: 4px;
				>.avatar {
					vertical-align: top;
					display: inline-block;
					img {
						width: 40px;
						height: 40px;
						border-radius: 50%;
					}
				}
				>.content {
					display: inline-block;
					margin-left: 10px;
					>span {
						display: block;
						font-size: 12px;
					}
				}
			}
		}
	}

	.el-button.is-round {
		padding: 6px 10px;
	}

	.v-modal {
		z-index: -100;
	}

  .setting_main{
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
    >div{
      width: 400px;
      background: #FFFFFF;
      margin: 200px auto;
      padding: 10px;
      border-radius: 4px;
      h2 {
        display: inline-block;
        margin-bottom: 10px;
        font-size: 16px;
        color: #409EFF;
      }
      i {
        font-size: 20px;
        float: right;
        cursor: pointer;
        &:hover {
          color: #FA5555
        }
      }
      >div{
        padding: 10px 0;
        border-bottom: 1px solid #e3e4e9;
        p{
          font-size: 14px;
        }
        &:last-child{
          border: none;
        }
      }
    }
  }
</style>

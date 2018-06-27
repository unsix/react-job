<template>
	<div class="qingdoudan">
		<el-form :model="qgd_ruleForm" :rules="qgd_rules" ref="qgd_ruleForm" label-width="150px" class="demo-qgd_ruleForm">
			<el-form-item label="请购部门" prop="request_buy_department">
				<el-select v-model="qgd_ruleForm.request_buy_department" placeholder="请选择请购部门">
					<el-option :label="item.department_name" :value="item.department_name" v-for="item in comDepartList" :key="item.department_id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="工程名称" prop="request_contract_address">
				<el-input v-model="qgd_ruleForm.request_contract_address"></el-input>
			</el-form-item>
			<el-form-item label="合同名称" prop="contract_name_new">
				<el-input v-model="qgd_ruleForm.contract_name_new"></el-input>
			</el-form-item>
			<el-form-item label="工程负责人" prop="contract_responsible">
				<el-select v-model="qgd_ruleForm.contract_responsible" placeholder="请选择" @change="qgdPro">
					<el-option v-for="item in comPersonList" :key="item.personnel_id" :label="item.name" :value="item.uid">
						<img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
						<span style="float: left;margin-left: 20px;">{{ item.name }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="负责人联系方式" prop="responsible_tel">
				<el-input v-model="qgd_ruleForm.responsible_tel"></el-input>
			</el-form-item>
			<el-form-item label="收货人姓名" prop="consignee">
				<el-select v-model="qgd_ruleForm.consignee" placeholder="请选择" @change="qgdShouhuo">
					<el-option v-for="item in comPersonList" :key="item.personnel_id" :label="item.name" :value="item.uid">
						<img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
						<span style="float: left;margin-left: 20px;">{{ item.name }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="收货人联系方式" prop="consignee_phone">
				<el-input v-model="qgd_ruleForm.consignee_phone"></el-input>
			</el-form-item>
			<el-form-item label="采购执行人" prop="buy_person">
				<el-select v-model="qgd_ruleForm.buy_person" placeholder="请选择" @change="qgdCaigou">
					<el-option v-for="item in comPersonList" :key="item.personnel_id" :label="item.name" :value="item.uid">
						<img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
						<span style="float: left;margin-left: 20px;">{{ item.name }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="采购执行人联系方式" prop="buy_person_phone">
				<el-input v-model="qgd_ruleForm.buy_person_phone"></el-input>
			</el-form-item>
			<el-form-item label="收货地址" prop="receive_address">
				<el-input type="textarea" v-model="qgd_ruleForm.receive_address"></el-input>
			</el-form-item>
			<el-form-item label="到货时间" prop="arrival_time">
				<el-date-picker type="date" v-model="qgd_ruleForm.arrival_time" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item label="项目负责人(部门经理)" >
				<el-select v-model="qgd_ruleForm.project_manager_name" placeholder="请选择" @change="qgdLeader">
					<el-option v-for="item in comPersonList" :key="item.personnel_id" :label="item.name" :value="item.uid">
						<img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
						<span style="float: left;margin-left: 20px;">{{ item.name }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
					</el-option>
				</el-select>
			</el-form-item>
			<div class="add_qgd">添加清单条目 <i class="el-icon-circle-plus" @click="add_qgd"></i><span style="color: red;" v-model="qgd_ruleForm.total">总额:{{qgd_ruleForm.total}}</span></div>
			<div v-for="(item,index) in qgd_ruleForm.add" class="new_qgd">
				<div class="close"><i class="fa fa-close" v-show="qgd_ruleForm.add.length > 1" @click="closeQd(index)"></i></div>
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
				<el-form :inline="true" :rules="rules" class="demo-form-inline">
					<el-form-item label="数量" prop="add_num">
            <input type="tel" class="el-input__inner" @change="checkNum(item)" v-model="item.num" id="num">
					</el-form-item>
					<el-form-item label="单位">
						<el-input v-model="item.unit"></el-input>
					</el-form-item>
					<!--<el-form-item label="单位">
						<el-select v-model="item.unit">
							<el-option :label="item" :value="item" v-for="item in unit" :key="item"></el-option>
						</el-select>
					</el-form-item>-->
				</el-form>
				<el-form :inline="true" :rules="rules" class="demo-form-inline">
					<el-form-item label="单价" prop="add_price" id="price">
						<!--<el-input v-model="item.price"></el-input>-->
            <input type="tel" class="el-input__inner" @change="checkPrice(item)" v-model="item.price">
					</el-form-item>
					<el-form-item label="总额">
						<el-input v-model="item.subtotal" :readonly="true" value="0">0</el-input>
            <!--<input type="tel" class="el-input__inner" v-model="item.subtotal" :readonly="true">-->
					</el-form-item>
				</el-form>
			</div>
      <el-upload class="upload-demo" id="picc" multiple action="https://up.qbox.me/" :on-change="handlePreview" accept="image/jpg,image/png,image/jpeg" :on-remove="handleRemove" list-type="picture-card"  :file-list="fileList" :auto-upload="false">
        <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        <!--<el-button size="small" type="info" plain>上传文件</el-button>-->
      </el-upload>
			<el-upload class="upload-demo_a" multiple action="https://up.qbox.me/" :on-change="handlePreview_a" :on-remove="handleRemove_a" :file-list="fileList_a" :auto-upload="false">
				<el-button size="small" type="info" plain>上传文本</el-button>
        <div slot="tip" class="el-upload__tip">信息附件上传，只传文本格式文件</div>
      </el-upload>
      <div style="color: #5a5e66;font-size: 14px;margin-top: 10px">
        <p>审批流程</p>
        <li v-for="(item,index) in userList" style="list-style: none;margin-top: 5px;margin-left: 10px">
          <span>{{item.name}}(<span v-for="list in item.require">{{list}},</span><span v-for="pr in item.option">{{pr}},</span><span v-show="item.enclosure_describe">,附件:{{item.enclosure_describe}}</span></span>)</span>
        </li>
      </div>
			<el-form-item>
				<el-button type="primary" @click="submitForm_qgd('qgd_ruleForm')">立即添加</el-button>
			</el-form-item>
		</el-form>
		<loading v-show="loadingShow"></loading>
	</div>
</template>

<script>

	import loading from '@/base/loading/loading'
  import {getCro} from "@/common/js/crowd";
	import { create_qinggoudan_list } from '@/common/js/approval/qinggoudan'
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				fileList: [],
        fileList_a:[],
				picArr: [],
				fileArr: [],
				qgd_ruleForm: {
					request_buy_department: '',
					request_contract_address: '',
					contract_name_new: '',
					content: '',
					contract_responsible: '',
					responsible_tel: '',
					arrival_time: '',
					consignee: '',
					consignee_phone: '',
					consignee_uid: '',
					contract_id: '',
					total: '',
					buy_person: '',
					buy_person_phone: '',
					buy_person_uid: '',
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
						purpose: ""
					}]
				},
				qgd_rules: {
					contract_name_new: [{
						required: true,
						message: '请填写合同名称',
						trigger: 'blur'
					}],
					request_buy_department: [{
						required: true,
						message: '请填写请购部门',
						trigger: 'blur'
					}],
					request_contract_address: [{
						required: true,
						message: '请填写请购工程名称',
						trigger: 'blur'
					}],
					contract_responsible: [{
						required: true,
						message: '请填写工程负责人',
						trigger: 'blur'
					}],
					responsible_tel: [{
						required: true,
						message: '请填写负责人联系方式',
						trigger: 'blur'
					}],
					arrival_time: [{
						type: 'date',
						required: true,
						message: '请填写到货时间',
						trigger: 'blur'
					}],
					consignee: [{
						required: true,
						message: '请填写收货人姓名',
						trigger: 'blur'
					}],
					consignee_phone: [{
						required: true,
						message: '请填写收货人联系方式',
						trigger: 'blur'
					}],
					contract_id: [{
						required: true,
						message: '请填写合同ID',
						trigger: 'blur'
					}],
					total: [{
						required: true,
						message: '请填写合计金额',
						trigger: 'blur'
					}],
					buy_person: [{
						required: true,
						message: '请填写采购负责人',
						trigger: 'blur'
					}],
					buy_person_phone: [{
						required: true,
						message: '请填写采购负责人联系方式',
						trigger: 'blur'
					}],
					receive_address: [{
						required: true,
						message: '请填写收货地址',
						trigger: 'blur'
					}],
				},
        rules:{
          add_num:[{
            //required: true,
            pattern:  /^-?[1-9]\d*$/,
            message: '数量请填入数字',
            trigger: 'blur'
          }],
          add_price:[{
            //required: true,
            pattern:  /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/,
            message: '单价请填入数字',
            trigger: 'blur'
          }]
        },
				unit: ['个', '箱', '根', '斤', '吨', '米', '平方米'],
				pic_hash_arr: [],
				file_hash_arr: [],
				afile_hash_arr: [],
				file_time: 0,
				pic_time: 0,
				pic_show: false,
				pic_index: 0,
				img_arr: [],
				pic_enclosure_id: '',
				loadingShow: false,
				returnOk: false,
        str:'',
        handler:''
			}
		},
		props: {
			approval_id: {
				type: String
			},
      userList:{

      }
		},
		created() {
			this._getToken()
			this.initial_data()
		},
		computed: {
			...mapGetters([
				'comPersonList',
				'user',
				'nowCompanyId',
				'comDepartList',
				'token'
			]),
		},
		components: {
			loading
		},
		methods: {
      resetForm(){
        this.$refs.qgd_ruleForm.resetFields();
        this.qgd_ruleForm.total = ''
        let arr = this.qgd_ruleForm.add
        for(var i = 0;i<arr.length;i++){
          arr[i].name = ''
          arr[i].spec = ''
          arr[i].unit = ''
          arr[i].model = ''
          arr[i].num = ''
          arr[i].price = ''
          arr[i].subtotal = ''
          arr[i].purpose = ''
        }
      },
			handleRemove(file, fileList) {
				this.fileList = fileList
			},
			handlePreview(file, fileList) {
        if(file.name.indexOf('jpg') == '-1' && file.name.indexOf('png') == '-1'){
          this.$message.error('上传文件格式错误')
          this.str = file
        }
        function remove(arr,val) {
          for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
              arr.splice(i, 1);
              break;
            }
          }
        }
        remove(fileList,this.str)
        this.fileList = fileList
			},
      handleRemove_a(file, fileList_a) {
        this.fileList_a = fileList_a
      },
      handlePreview_a(file, fileList_a){
        let index = file.name.lastIndexOf('.')
        let attribute = file.name.slice(index)
        if(attribute.substr(0,1)=='.'){
          attribute=attribute.substr(1)
        }
        this.$http.post("/index.php/Mobile/find/file_info")
          .then((res)=>{
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            let attr = res.data.data.attribute
            if(attr.indexOf(attribute) !=-1){
              this.fileList_a = fileList_a
            }else{
              this.$message.error('上传文件格式错误 请删除')
              this.fileList_a = fileList_a
            }

          })
      },
      checkNum:function (data) {
        var numReg =  /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/
        if(!numReg.test(data.num)){
          this.$message({
            showClose: true,
            message: '格式错误',
            type: 'error'
          })
          data.num = "";
        }
        var sub = this.qgd_ruleForm.add
        var tato = 0
        for (var i = 0;i<sub.length;i++){
          sub[i].subtotal = sub[i].price * sub[i].num
        }
        let val = ''
        for (var i = 0;i<sub.length;i++){
          tato +=Number(sub[i].subtotal)
          val=Math.floor(tato * 100) / 100
        }
        this.qgd_ruleForm.total =val
      },
      checkPrice:function (data) {
        var priceReg = /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/
        if(!priceReg.test(data.price)){
          this.$message({
            showClose: true,
            message: '格式错误',
            type: 'error'
          })
          data.price="";
        }
        var sub = this.qgd_ruleForm.add
        var tato = 0
        let val = ''
        for (var i = 0;i<sub.length;i++){
          sub[i].subtotal = sub[i].price * sub[i].num
        }
        for (var i = 0;i<sub.length;i++){
          tato +=sub[i].subtotal
          val=Math.floor(tato * 100) / 100
        }
        this.qgd_ruleForm.total =val
      },
			closeQd(index) {
				this.qgd_ruleForm.add.splice(index, 1)
			},
			initial_data() {
				if(!this.approval_id || this.approval_id === '')  {
					return
				}
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_id", this.approval_id);
				this.$http.post("/index.php/Mobile/approval/approval_process_show", param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
						this.form_Lista = create_qinggoudan_list(res.data.data)
						let department_name
						setTimeout(() => {
							this.comDepartList.forEach((item) => {
								if(item.department_id === this.form_Lista.request_buy_department) {
									department_name = item.department_name
								}
							})
							this.qgd_ruleForm.request_buy_department = department_name
							this.qgd_ruleForm.contract_name_new = this.form_Lista.contract_name_new
							this.qgd_ruleForm.contract_responsible = this.form_Lista.contract_responsible
							this.qgd_ruleForm.responsible_tel = this.form_Lista.responsible_tel
							this.qgd_ruleForm.consignee = this.form_Lista.consignee
							this.qgd_ruleForm.consignee_phone = this.form_Lista.consignee_phone
							this.qgd_ruleForm.buy_person = this.form_Lista.buy_person
							this.qgd_ruleForm.total = this.form_Lista.total
							this.qgd_ruleForm.buy_person_phone = this.form_Lista.buy_person_phone
							this.qgd_ruleForm.receive_address = this.form_Lista.receive_address
							this.qgd_ruleForm.request_contract_address = this.form_Lista.request_contract_address
              this.form_Lista.content.forEach((item)=>{
                if(item.subtotal.indexOf('元') != '-1'){
                  item.subtotal = item.subtotal.substr(0,item.subtotal.length-1)
                }
              })
							this.qgd_ruleForm.add = this.form_Lista.content
              this.qgd_ruleForm.arrival_time = this.form_Lista.arrival_time
              if(this.qgd_ruleForm.arrival_time){
                let strDate = this.qgd_ruleForm.arrival_time
                var time = new Date(strDate)
                this.qgd_ruleForm.arrival_time = time
              }
							this.qgd_ruleForm.project_manager_name = this.form_Lista.project_manager_name
              this.qgd_ruleForm.many_enclosure = this.form_Lista.many_enclosure
              this.form_Lista.many_enclosure.forEach((item)=>{
                let img_name = item.name
                if (item.type === 3){
                  let param = new URLSearchParams();
                  param.append("enclosure_id", item.contract_id);
                  this.$http.post("index.php/Mobile/approval/look_enclosure",param)
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      getCro(judge,current)
                      res.data.data.picture.forEach((item) => {
                        let obj = {}
                        let img_add = 'http://bbsf-file.hzxb.net/'+item
                        console.log(img_add)
                        obj.name = img_name
                        obj.url = img_add
                        obj.hash = item
                        this.fileList.push(obj)
                      })
                    })
                }else if(item.type === 4){
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
                      obj.hash = file_data.attachments
                      this.fileList_a.push(obj)
                    })
                }
              })
						}, 100)

					})
			},
			add_ok() {
				this.$message({
					showClose: true,
					message: '添加成功',
					type: 'success'
				});
			},
			add_fail() {
				this.$message({
					showClose: true,
					message: '添加失败',
					type: 'error'
				});
			},
			get_img(enclosure_id) {
				if(enclosure_id === '0') {
					return
				}
				let param = new URLSearchParams();
				param.append("enclosure_id", enclosure_id);
				this.$http.post("/index.php/Mobile/approval/look_enclosure", param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
						let arr = []
						res.data.data.picture.forEach((item) => {
							if(item != '') {
								arr.push('http://bbsf-file.hzxb.net/' + item)
							}
						})
						this.img_arr = arr
						this.$set(this.form_Lista, 'img_list', arr)
					})
			},
			get_moreimg(many) {
				many.forEach((item) => {
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
										if(item.indexOf('jpg') > 0 || item.indexOf('png') > 0 || item.indexOf('Enclos') > 0) {
											arr.push('http://bbsf-file.hzxb.net/FvxX0Q9Xf_7jlhruiU9VVPntp0iA')
										} else {
											arr.push('http://bbsf-file.hzxb.net/' + item)
										}
									}
								})
								this.$set(this.form_Lista, 'img_list', arr)
							})
					}
				})
			},
			ctrl_pic_show(index) {
				this.pic_index = index
				this.pic_show = true
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
			close_pic() {
				this.pic_show = false
			},
			_getToken() {
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				this.$http.post("/index.php/Mobile/path/get_token", nparam)
					.then((res) => {
						localStorage.token = JSON.stringify(res.data.data);
						this.setToken(res.data.data)
					})
			},
			...mapMutations({
				setToken: 'SET_TOKEN'
			}),
			qgdShouhuo(tab) {
        this.qgd_ruleForm.consignee_uid = tab
				this.comPersonList.forEach((item) => {
					if(item.uid === tab) {
						this.qgd_ruleForm.consignee = item.name
						this.qgd_ruleForm.consignee_phone = item.phone
						return
					}
				})
			},
			qgdCaigou(tab) {
        this.qgd_ruleForm.buy_person_uid = tab
				this.comPersonList.forEach((item) => {
					if(item.name === tab) {
						this.qgd_ruleForm.buy_person = item.name
						this.qgd_ruleForm.buy_person_phone = item.phone
						return
					}

				})
			},
			qgdLeader(tab) {
        this.handler = tab
				this.comPersonList.forEach((item) => {
					if(item.name === tab) {
						this.$set(this.qgd_ruleForm.project_manager, 'uid', item.uid)
					}
				})
			},
			qgdPro(tab) {
        console.log(tab)
				this.comPersonList.forEach((item) => {
					if(item.name === tab) {
						this.qgd_ruleForm.contract_responsible = item.name
						this.qgd_ruleForm.responsible_tel = item.phone
						return
					}
				})
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
					purpose: ""
				}
				this.qgd_ruleForm.add.push(obj)

			},
			submitForm_qgd(formName) {
				this.returnOk = false

				this.qgd_ruleForm.add.forEach((item) => {
					if(item.model === '' || item.name === '' || item.num === '' || item.price === '' ||
						item.purpose === '' || item.spec === '' || item.subtotal === '' || item.unit === '') {
						this.$message.error('请将清单条目填写完整');
						this.returnOk = true

          }
					var re = /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/;　　
					if(!re.test(item.num)) {　　　　
						this.$message.error('数量请填数字');　　　　
						this.returnOk = true　　
					}
					if(!re.test(item.price)) {　　　　
						this.$message.error('单价请填入数字');　　　　
						this.returnOk = true　　
					}
					if(!re.test(item.subtotal)) {　　　　
						this.$message.error('总额请填入数字');　　　　
						this.returnOk = true　　
					}
				})　
				if(this.returnOk === true) {
					return
				}
				this.$refs[formName].validate((valid) => {
					if(valid) {
            this.$confirm('确定总额为' + this.qgd_ruleForm.total + '吗', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(()=>{
              this.qgd_submit()
              this.loading_show = true
            }).catch(()=>{
              this.$message({
                type: 'info',
                message: '已取消操作'
              });
            })
					} else {
						this.$message.error('请将表单填写完整');
						return false;
					}
				});
			},
			qgd_submit() {
				this.picArr = []
				this.fileArr = []
				this.fileList.forEach((item) => {
					if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1' || item.name.indexOf("图像") != '-1') {
						this.picArr.push(item)
					}
				})
        this.fileList_a.forEach((item) =>{
          this.fileArr.push(item)
        })
				let timestamp2 = Date.parse(new Date(this.qgd_ruleForm.arrival_time));
				let date = new Date();
				date.setTime(timestamp2);
				let y = date.getFullYear();
				let m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				this.qgd_ruleForm.arrival_time = y + '-' + m + '-' + d

        this.$set(this.qgd_ruleForm.project_manager, 'uid', this.handler)
        console.log(this.qgd_ruleForm.project_manager)
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []
				this.file_time = 0
				this.pic_time = 0
				this.loadingShow = true
				this.qgd_ruleForm.arrival_time = JSON.stringify(this.qgd_ruleForm.arrival_time).slice(1, 11)
				setTimeout(() => {
					if(this.picArr.length === 0 && this.fileArr.length === 0) {
						let buy_depart_id
						this.comDepartList.forEach((item) => {
							if(item.department_name === this.qgd_ruleForm.request_buy_department) {
								buy_depart_id = item.department_id
							}
						})
						let param = new URLSearchParams();
            param.append("project_manager", JSON.stringify(this.qgd_ruleForm.project_manager));
						param.append("uid", this.user.uid);
						param.append("company_id", this.nowCompanyId);
						param.append("request_buy_department", buy_depart_id);
						param.append("request_contract_address", this.qgd_ruleForm.request_contract_address);
						param.append("content", JSON.stringify(this.qgd_ruleForm.add));
						param.append("contract_responsible", this.qgd_ruleForm.contract_responsible);
						param.append("responsible_tel", this.qgd_ruleForm.responsible_tel);
						param.append("arrival_time", this.qgd_ruleForm.arrival_time);
						param.append("consignee", this.qgd_ruleForm.consignee);
						param.append("consignee_phone", this.qgd_ruleForm.consignee_phone);
						param.append("type", 2);
						param.append("total", this.qgd_ruleForm.total);
						param.append("receive_address", this.qgd_ruleForm.receive_address);
						param.append("buy_person", this.qgd_ruleForm.buy_person);
						param.append("buy_person_phone", this.qgd_ruleForm.buy_person_phone);
						param.append("contract_name_new", this.qgd_ruleForm.contract_name_new);
						param.append("consignee_uid", this.qgd_ruleForm.consignee_uid);
						param.append("buy_person_uid", this.qgd_ruleForm.buy_person_uid);
            param.append("many_enclosure", this.qgd_ruleForm.many_enclosure);
						this.$http.post("/index.php/Mobile/approval/add_request_buy", param)
							.then((res) => {
                var current = this
                var judge = res.data.code
                getCro(judge,current)
								this.loadingShow = false
								if(res.data.code === 0) {
									this.add_ok()
									this.loading_show = false
									this.$emit('return_exam')
								} else {
									this.add_fail()
									this.qgd_ruleForm.arrival_time = ''
								}
							})
					} else {
						if(this.picArr.length != 0) {
              var upload_enclosure_new = (fn)=>{
                for(let i = 0; i < this.picArr.length; i++) {
                  let formData = new FormData();
                  formData.append('file', this.picArr[i].raw);
                  formData.append('token', this.token);
                  let config = {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  }
                  if(!this.picArr[i].size){
                    this.pic_hash_arr.push(this.picArr[i].hash);
                    this.pic_hash_arr.length === this.picArr.length && fn(this.picArr[i].name);
                  }else{
                    this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
                      this.pic_hash_arr.push(res.data.hash)
                      if(this.pic_hash_arr.length === this.picArr.length) {
                        fn(this.picArr[i].name);
                      }
                    })
                  }
                }
              }
              upload_enclosure_new((name)=>{
                let nparam = new URLSearchParams()
                nparam.append("uid", this.user.uid);
                nparam.append("picture", JSON.stringify(this.pic_hash_arr));
                this.$http.post("/index.php/Mobile/approval/upload_enclosure_new", nparam)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    getCro(judge,current)
                    this.afile_hash_arr.push({
                      "type": 3,
                      "contract_id": res.data.data.enclosure_id,
                      name,
                    })
                    let aDate = Date.parse(new Date())//看下把
                    this.pic_time = aDate
                  })
              })
						}
						if(this.fileArr.length != 0) {
							for(let i = 0; i < this.fileArr.length; i++) {
								let formData = new FormData();
								formData.append('file', this.fileArr[i].raw);
								formData.append('token', this.token);
								let config = {
									headers: {
										'Content-Type': 'multipart/form-data'
									}
								}
								if(!this.fileArr[i].size){
                  let index = this.fileArr[i].name.lastIndexOf('.')
                  let attribute = this.fileArr[i].name.slice(index)
                  if(attribute.substr(0,1)=='.'){
                    attribute=attribute.substr(1)
                  }
                  let file_name = this.fileArr[i].name.slice(0, index)
                  let param = new URLSearchParams();
                  param.append("uid", this.user.uid);
                  param.append("attribute", attribute);
                  param.append("attachments", this.fileArr[i].hash);
                  param.append("file_name", file_name);
                  this.$http.post("/index.php/Mobile/approval/add_attachments", param)
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      getCro(judge,current)
                      this.file_hash_arr.push({
                        "type": 4,
                        "contract_id": res.data.data.attachments_id,
                        "name": this.fileArr[i].name
                      })
                      if(this.file_hash_arr.length === this.fileArr.length) {
                        let bDate = Date.parse(new Date())
                        this.file_time = bDate
                      }
                    })
                }else{
                  let size = this.fileArr[i].size
                  let index = this.fileArr[i].name.lastIndexOf('.')
                  let attribute = this.fileArr[i].name.slice(index)
                  if(attribute.substr(0,1)=='.'){
                    attribute=attribute.substr(1)
                  }
                  this.$http.post("/index.php/Mobile/find/file_info")
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      getCro(judge,current)
                      let maxSize = res.data.data.max
                      let attr = res.data.data.attribute
                      if(attr.indexOf(attribute) !=-1){
                        if(size<maxSize){
                          this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
                            let file_name = this.fileArr[i].name.slice(0, index)
                            let param = new URLSearchParams();
                            param.append("uid", this.user.uid);
                            param.append("attribute", attribute);
                            param.append("attachments", res.data.hash);
                            param.append("file_name", file_name);
                            this.$http.post("/index.php/Mobile/approval/add_attachments", param)
                              .then((res) => {
                                this.file_hash_arr.push({
                                  "type": 4,
                                  "contract_id": res.data.data.attachments_id,
                                  "name": this.fileArr[i].name
                                })
                                if(this.file_hash_arr.length === this.fileArr.length) {
                                  let bDate = Date.parse(new Date())
                                  this.file_time = bDate
                                }
                              })
                          })
                        }else{
                          this.$message.error('上传文件过大 请删除')
                          this.loadingShow = false
                          return false
                        }
                      }else{
                        this.$message.error('请删除'+this.fileArr[i].name)
                        this.loadingShow = false
                        return false
                      }
                    })
                }
							}
						}
					}
				}, 500)
			},
		},
		watch: {
			file_time() {
				if(this.picArr.length != 0) {
					if(this.pic_time === 0) {
						return
					}
				}
				if(this.file_time != 0 || this.pic_time != 0) {
					let buy_depart_id
					this.comDepartList.forEach((item) => {
						if(item.department_name === this.qgd_ruleForm.request_buy_department) {
							buy_depart_id = item.department_id
						}
					})
					let consignee_uid
					this.comPersonList.forEach((item) => {
						if(item.name === this.qgd_ruleForm.consignee) {
							this.qgd_ruleForm.consignee_uid = item.uid
						}
					})
					let buy_person_uid
					this.comPersonList.forEach((item) => {
						if(item.name === this.qgd_ruleForm.buy_person) {
							this.qgd_ruleForm.buy_person_uid = item.uid
						}
					})
					let param = new URLSearchParams();
					if(this.qgd_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.qgd_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("request_buy_department", buy_depart_id);
					param.append("request_contract_address", this.qgd_ruleForm.request_contract_address);
					param.append("contract_name_new", this.qgd_ruleForm.contract_name_new);
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
					param.append("consignee_uid", this.qgd_ruleForm.consignee_uid);
					param.append("buy_person_uid", this.qgd_ruleForm.buy_person_uid);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					param.append("type", 2);
					this.$http.post("/index.php/Mobile/approval/add_request_buy", param)
						.then((res) => {
              var current = this
              var judge = res.data.code
              getCro(judge,current)
							this.loadingShow = false
							if(res.data.code === 0) {
								this.add_ok()
								this.loading_show = false
								this.$emit('return_exam')
							} else {
								this.add_fail()
								this.qgd_ruleForm.arrival_time = ''
							}
						})
				}
			},
			pic_time() {
				if(this.fileArr.length != 0) {
					if(this.file_time === 0) {
						return
					}
				}
				if(this.file_time != 0 || this.pic_time != 0) {
					let buy_depart_id
					this.comDepartList.forEach((item) => {
						if(item.department_name === this.qgd_ruleForm.request_buy_department) {
							buy_depart_id = item.department_id
						}
					})
					let consignee_uid
					this.comPersonList.forEach((item) => {
						if(item.name === this.qgd_ruleForm.consignee) {
							this.qgd_ruleForm.consignee_uid = item.uid
						}
					})
					let buy_person_uid
					this.comPersonList.forEach((item) => {
						if(item.name === this.qgd_ruleForm.buy_person) {
							this.qgd_ruleForm.buy_person_uid = item.uid
						}
					})
					let param = new URLSearchParams();
					if(this.qgd_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.qgd_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("request_buy_department", buy_depart_id);
					param.append("request_contract_address", this.qgd_ruleForm.request_contract_address);
					param.append("contract_name_new", this.qgd_ruleForm.contract_name_new);
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
					param.append("consignee_uid", this.qgd_ruleForm.consignee_uid);
					param.append("buy_person_uid", this.qgd_ruleForm.buy_person_uid);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					param.append("type", 2);
					this.$http.post("/index.php/Mobile/approval/add_request_buy", param)
						.then((res) => {
              var current = this
              var judge = res.data.code
              getCro(judge,current)
							this.loadingShow = false
							if(res.data.code === 0) {
								this.add_ok()
								this.loading_show = false
								this.$emit('return_exam')
							} else {
								this.add_fail()
								this.qgd_ruleForm.arrival_time = ''
							}
						})
				}
			},
		}
	}
</script>

<style lang="scss">
	.el-form--inline .el-form-item {
		margin-left: 20px;
	}

	.el-select {
		width: 100%;
	}

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
</style>

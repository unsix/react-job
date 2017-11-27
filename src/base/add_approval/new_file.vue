let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("contract_name", this.qkd_ruleForm.contract_name);
					param.append("company_id", this.nowCompanyId);
					param.append("request_name", this.qkd_ruleForm.request_name);
					param.append("worker_type", this.qkd_ruleForm.worker_type);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("account_name", this.qkd_ruleForm.account_name);
					param.append("contract_name_new", this.qkd_ruleForm.contract_name_new);
					param.append("bank_card", this.qkd_ruleForm.bank_card);
					param.append("bank_address", this.qkd_ruleForm.bank_address);
					param.append("subtotal", this.qkd_ruleForm.subtotal);
					param.append("request_subtotal", this.qkd_ruleForm.request_subtotal);
					param.append("request_content", this.qkd_ruleForm.request_content);
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
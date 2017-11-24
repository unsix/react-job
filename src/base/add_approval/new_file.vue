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
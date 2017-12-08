import Vue from 'vue'
import Router from 'vue-router'
import workerList from '@/components/worker_list/worker_list'
import projectList from '@/components/project_list/project_list'
import login from '@/components/login/login'
import index from '@/components/index/index'
import work from '@/components/work/work'
import apply from '@/components/apply/apply'
import mineApp from '@/components/apply/mine_app'
import allApp from '@/components/apply/all_app'
import serviceApp from '@/components/apply/service_app'

import inviteCol from '@/base/invite_colleague/invite_colleague'
import everyday from '@/base/everyday/everyday'
import formReceipt from '@/base/form_receipt/form_receipt'
import addressBook from '@/base/address_book/address_book'
import exam from '@/base/exam/exam'
import addApproval from '@/base/add_approval/add_approval'
import manageCompany from '@/base/manage_company/manage_company'
import jurisdictionManage from '@/base/jurisdiction_manage/jurisdiction_manage'
Vue.use(Router)

export default new Router({
	routes: [{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/worker_list',
			component: workerList
		},
		{
			path: '/project_list',
			component: projectList
		},
		{
			path: '/login',
			component: login
		},
		{
			path: '/work',
			component: work,
			children: [{
					path: 'exam',
					component: exam
				},
				{
					path: 'inviteCol',
					component: inviteCol
				},
				{
					path: 'formReceipt',
					component: formReceipt
				},
				{
					path: 'addressBook',
					component: addressBook
				},
				{
					path: 'addApproval',
					component: addApproval
				},
				{
					path: 'manageCompany',
					component: manageCompany
				},
				{
					path: 'jurisdictionManage',
					component: jurisdictionManage
				}
			]
		},
		{
			path: 'apply',
			component: apply,
			children: [{
					path: 'mineApp',
					component: mineApp
				},
				{
					path: 'allApp',
					component: allApp
				},
				{
					path: "serviceApp",
					component: serviceApp
				}
			]
		}
	]
})
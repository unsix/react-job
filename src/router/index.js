import Vue from 'vue'
import Router from 'vue-router'
const login = () => import('@/components/login/login')
const work = () => import('@/components/work/work')
const apply = () => import('@/components/apply/apply')
const inviteCol = () => import('@/base/invite_colleague/invite_colleague')
const formReceipt = () => import('@/base/form_receipt/form_receipt')
const addressBook = () => import('@/base/address_book/address_book')
const exam = () => import('@/base/exam/exam')
const addApproval = () => import('@/base/add_approval/add_approval')
const manageCompany = () => import('@/base/manage_company/manage_company')
const jurisdictionManage = () => import('@/base/jurisdiction_manage/jurisdiction_manage')
const create_company = () => import('@/base/create_company/create_company')

Vue.use(Router)

export default new Router({
	routes: [{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			component: login
		},
		{
			path: '/work',
			component: work,
			children: [
				{
					path: '',
					component: exam
				},
				{
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
				},
        {
          path: 'create_company',
          component:create_company
        }
			]
		},
		{
			path: 'apply',
			component: apply
		}
	]
})

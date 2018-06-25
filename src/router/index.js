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
const record = () => import('@/base/work_record/record')
const list = () => import('@/base/list/list')
const nearWork = () => import('@/base/find_work/near')
const release = () =>import('@/base/release/rele')
const issue = () =>import('@/base/issue_contract/issue')
const rece = () =>import('@/base/received/rece')
const opus = () =>import('@/base/myOpus/opus')
const collect = () =>import('@/base/Mycollect/collect')
const infos = () => import('@/base/info/infos')
const account = () =>import('@/base/account/myAccount')
const pay = () =>import('@/base/account/pay')
const wage = () =>import('@/base/account/wages')
const company = () =>import('@/base/find_work/company')
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
        },
        {
          path:'record',
          component:record
        },
        {
          path:'list',
          component:list
        },
        {
          path:'nearWork',
          component:nearWork
        },
        {
          path:'release',
          component:release
        },
        {
          path:'issue',
          component:issue
        },
        {
          path:'rece',
          component:rece
        },
        {
          path:'opus',
          component:opus
        },
        {
          path:'collect',
          component:collect
        },
        {
          path:'infos',
          component:infos
        },
        {
          path:'account',
          component:account
        },
        {
          path:'pay',
          component:pay
        },
        {
          path:'wage',
          component:wage
        },
        {
          path:'company',
          component:company
        }
			]
		},
		{
			path: 'apply',
			component: apply
		}
	]
})

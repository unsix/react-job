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
Vue.use(Router)

export default new Router({
routes: [
	{
      path: '/',
      component: workerList
    },
    {
      path: '/worker_list',
      component: workerList
    },
    {
    	path:'/project_list',
    	component:projectList
    },
    {
    	path:'/login',
    	component:login
    },
    {
    	path:'/index',
    	component:index,
    	children: [
        {
        	path: 'work',
        	component: work
        },
        {
        	path:'apply',
        	component:apply,
        	children: [
		        {
		        	path: 'mineApp',
		        	component: mineApp
		        },
		        {
		        	path:'allApp',
		        	component: allApp
		        },
		        {
		        	path:"serviceApp",
		        	component:serviceApp
		        }
		      ]
        }
      ]
    }
]
})

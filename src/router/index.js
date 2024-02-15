/*引入vue框架*/
import Vue from 'vue'
/*引入路由依赖*/
import VueRouter from 'vue-router'
/*引入页面组件，并命名*/
import Login from '../views/Login.vue'//管理员登录界面
import Home from '../views/Home.vue'//管理主界面
import Main from '../views/main.vue'//网站主页面
import OwnerApply from '../views/OwnerApply.vue'//房东认证页面
import UserDetail from '../views/UserDetial.vue'//个人信息页面
import UserHouseUp from '../views/UserHouseUp.vue'//个人房源信息上传界面
import UserHouseManger from '../views/UserHouseManger.vue'//个人房源管理页面
import HouseDetail from '../views/HouseDetail.vue'//房屋详情页面
import Register from '../views/Register.vue'//注册界面
import HomeUsers from '../views/HomeUsers.vue'//用户信息页面
import HomeOwner from '../views/HomeOwner.vue'//申请房东认证页面
import HomeHouse from '../views/HomeHouse.vue'//房源信息页面
import HomeHouseUp from '../views/HomeHouseUp.vue'//房源上传审核页面
import PersonalCenter from '../views/PersonalCenter.vue'//个人中心


/*使用路由依赖*/
Vue.use(VueRouter)

/*路由表*/
const routes = [
	{ path:'/', redirect:'/main' },//路由重定向至main页面
	{ path:'/main', component:Main},//定向至首页
	{ path:'/login', component:Login },//定向至管理员用户登录界面
	{ path:'/home',//定向至home（后台管理）页面
	  component:Home,
	  redirect:'/homeusers',//重定向至用户信息展示页面
	  children:[
		  { path:'/homeusers',component:HomeUsers},//用户信息展示页面
		  { path:'/homeowner',component:HomeOwner},//房东申请审核页面
		  { path:'/homehouse',component:HomeHouse},//房源详情页面
		  { path:'/homehouseup',component:HomeHouseUp},//房东上传房源审核页面
	  ]
	},
	{ path:'/ownerapply', component:OwnerApply},//定向至房东认证页面
	{ path:'/housedetail', component:HouseDetail},//定向至房屋详情页面
	{ path:'/register', component:Register},//定向至用户注册页面
	{ path:'/personalcenter',
	  component:PersonalCenter,
	  children:[
		  { path:'/userdetail',component:UserDetail },//个人信息详情页
		  { path:'/userhouseup', component:UserHouseUp},//个人房源信息上传页面
		  { path:'/userhousemanger',component:UserHouseManger }//个人房源管理
	  ]	
	},//个人中心主页
	
]

const router = new VueRouter({//依据上面的路由表，创建对应的路由管理对象，管理表中的路由
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
	//to 将要访问
	//from 从哪儿访问
	//next 继续进行的事 next(url)重定向到url next()继续访问 to路径
	if(to.path=='/login' || to.path=='/main' || to.path=='/register') return next();//访问管理员登录页面直接放行
	//if(to.path=='/userlogin') return next();//访问普通用户页面直接放行
	//if(to.path=='/main') return next();//访问主页面直接放行
	//if(to.path=='/register') return next();//访问注册页面直接放行
	
	if(to.path=='/home'){//访问后台管理页面
		const adminFlag = window.sessionStorage.getItem("admin1");//从session中读取管理员账户信息
		if(!adminFlag){//管理员信息为空 跳转到管理员登录页面
			return next('/login');
		}else{//有管理员信息，则进入后台管理页面
			return next();
		}
	}
	
	if(to.path=='/ownerapply'){//访问房东认证页面
		const userFlag = window.sessionStorage.getItem("user");//从session中读取普通用户账户信息
		if(userFlag && (window.sessionStorage.getItem("isowner") == "false")){//用户登录了并且已经认证为房东，跳转到主页面
			return next();
		}else{
			return next('/main');
		}
	}
	
	if(to.path=='/personalcenter' || to.path=='/userdetail'){//访问个人中心页面
		const userFlag = window.sessionStorage.getItem("user");//从session中读取普通用户账户信息
		if(!userFlag){//用户没有登录
			return next('/main');
		}else{//用户登录了并且已经认证为房东，跳转到主页面
			return next();
		}
	}
	
	if(to.path=='/userhouseup' || to.path=='/userhousemanger'){//访问个人房源上传
		const userFlag = window.sessionStorage.getItem("user");//从session中读取普通用户账户信息
		if(window.sessionStorage.getItem("isowner") == "true"){
			return next();
		}else{
			return next('/main');
		}
	}
	
	// if(to.path=='/houseup'){//访问房源上传页面
	// 	const userFlag = window.sessionStorage.getItem("user");//从session中读取普通用户账户信息
	// 	if(window.sessionStorage.getItem("isowner") == "true"){
	// 		return next();
	// 	}else{
	// 		return next('/main');
	// 	}
		// if(userFlag && window.sessionStorage.getItem("isowner")){//用户登录并且已经认证为房东，跳转到主页面
		// 	return next();
		// }else{
		// 	return next('/main');
		// }
	// }
	
	if(to.path=='/housedetail') return next();
	// if(to.path=='/housedetail'){//访问房屋详情页面
	// 	const userFlag = window.sessionStorage.getItem("user");//从session中读取普通用户账户信息
	// 	if(!userFlag){//用户未登录
	// 		return next('/main');
	// 	}else{
	// 		return next();
	// 	}	
	// }
	
	if(to.path=='/homeusers'|| to.path=='/homeowner' || to.path=='/homehouse' || to.path=='/homehouseup'){//总用户资料，房东申请,房源信息资料，房源上传
		const adminFlag = window.sessionStorage.getItem("admin1");//从session中读取管理员账户信息
		if(!adminFlag){//管理员信息为空 跳转到管理员登录页面
			return next('/login');
		}else{//有管理员信息，则进入后台管理页面
			return next();
		}
	} 
})

export default router

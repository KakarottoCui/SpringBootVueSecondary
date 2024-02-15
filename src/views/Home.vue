<template>
	<!-- container布局 -->
	<el-container class="home-container">
		<!-- 头部 -->
		<el-header class="el-header">
			<span>二手房交易后台管理系统</span>
			<el-button type="infor" @click="logout" class="el-button">退出</el-button>
		</el-header>
		<!-- 主体 -->
		<el-container>
			<!-- 侧边栏 -->
			<el-aside width="200px" class="el-aside">
				 <el-menu router default-active="11">
				      <el-submenu index='1'>
				        <template slot="title">
				          <i class="el-icon-more"></i>
				          <span>主功能</span>
				        </template>
				        <el-menu-item-group title="用户管理">
				          <el-menu-item index="11" route='/homeusers'>总用户管理</el-menu-item>
				          <el-menu-item index="12" route='/homeowner'>申请房东认证审核</el-menu-item>
				        </el-menu-item-group>
				        <el-menu-item-group title="房源管理">
				          <el-menu-item index="21" route='/homehouse'>总房源信息</el-menu-item>
						  <el-menu-item index="22" route='/homehouseup'>房源信息审核</el-menu-item>
				        </el-menu-item-group>
				      </el-submenu>
				    </el-menu>
			</el-aside>
			<!-- 内容框 -->
			<el-main class="el-main">
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			logout(){//退出
				window.sessionStorage.clear()//清楚session
				this.$router.push({path:"/login"});//回到管理员登陆页面
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.home-container{
		height: 100%;
	}
	.el-header{//头部样式
		background-color: dodgerblue;
		font-size: 20px;
		color: white;
		span{
			line-height: 60px;
		}
		.el-button{
			float: right;
			margin-top: 10px;
		}
	}
	.el-aside{//侧边栏样式
		background-color: #BBE6D6;
	}
	.el-main{//内容框样式
		background-color: #eaedf1;
	}
</style>

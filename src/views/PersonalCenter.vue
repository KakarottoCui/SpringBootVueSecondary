<template>
	<!-- container布局 -->
	<el-container class="home-container">
		<!-- 头部 -->
		<el-header class="el-header">
			<span>个人主页</span>
		</el-header>
		<!-- 主体 -->
		<el-container>
			<!-- 侧边栏 -->
			<el-aside width="200px" class="el-aside">
				<el-menu router default-active="11">
					<el-submenu index='1'>
						<template slot="title">
							<i class="el-icon-more"></i>
						</template>
						<el-menu-item-group title="个人中心">
							<el-menu-item index="11" route='/userdetail'>个人信息</el-menu-item>
							<el-menu-item index="12" route='/userhouseup'>房源上传</el-menu-item>
							<el-menu-item index="13" route='/userhousemanger'>房源管理</el-menu-item>
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
		created() {
			this.$router.push({path:"/userdetail"})
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.home-container {
		height: 100%;
	}

	.el-header {
		//头部样式
		background-color: mediumslateblue;
		font-size: 20px;
		color: white;

		span {
			line-height: 60px;
		}

		.el-button {
			float: right;
			margin-top: 10px;
		}
	}

	.el-aside {
		//侧边栏样式
		background-color: mediumslateblue;
	}

	.el-main {
		//内容框样式
		background-color: #eaedf1;
	}
</style>

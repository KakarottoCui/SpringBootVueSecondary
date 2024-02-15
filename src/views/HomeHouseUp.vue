<template>
	<div>
		<div>
			<el-input placeholder="请输入您要搜索房东认证申请记录的用户账号" v-model="HouseUpRecordInfo.account">
				<el-button slot="append" icon="el-icon-search" @click="getHouseUpRecords"></el-button>
			</el-input>
		</div>
		<div class="table">
			<el-table :data="HouseUpRecordList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="房屋编号" prop="houid"></el-table-column>
				<el-table-column label="房东账号" prop="account"></el-table-column>
				<el-table-column label="简要说明" prop="description" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="info" size="small" @click="housedetail=true,getHouseDetail(scope.row)">查看详情</el-button>
						<el-button type="primary" size="small" @click="HUsubmit(scope.row.houid)">通过</el-button>
						<el-button type="primary" size="small" @click="HUrefuse(scope.row.houid)">拒绝</el-button>
						<el-button type="danger" icon="el-icon-delete" size="small" @click='deleteHouseUpRecord(scope.row.houid)'></el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页 -->
		<div>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-size="HouseUpRecordInfo.pageSize"
			 layout="total, prev, pager, next, jumper" :total="HURecords" style="padding-left: 30%;">
			</el-pagination>
		</div>
		
		<el-dialog title="房屋详情" :visible.sync="housedetail">
			<el-form  label-position="right" :model="houseUpForm" label-width="85px">
				<!-- 账号 -->
				<el-form-item label="当前账号:">
					<el-input v-model="houseUpForm.account" disabled></el-input>
				</el-form-item>
				
				<!-- 房屋户型 -->
				<el-form-item label="房屋户型:" style="display: inline-block; width: 100%;">
					<el-input-number v-model="houseUpForm.houseType[0]" controls-position="right"  :min="1" :max="100" step-strictly></el-input-number>(室)
					<el-input-number v-model="houseUpForm.houseType[1]" controls-position="right"  :min="0" :max="100" step-strictly></el-input-number>(厅)
					<el-input-number v-model="houseUpForm.houseType[2]" controls-position="right"  :min="1" :max="100" step-strictly></el-input-number>(卫)
				</el-form-item>
				<!-- 房屋地区 -->
				<el-form-item label="房屋地区:" style="display: inline-block; width: 45%;">
					<el-cascader v-model="houseUpForm.houseID" size="large" :options="options" ></el-cascader>
				</el-form-item>
				
				<!-- 出售类型 -->
				<el-form-item label="出售类型:" style="display: inline-block; width: 45%;">
					<el-select v-model="houseUpForm.rentType" placeholder="请选择">
					    <el-option
					      v-for="item in rentTypeOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				
				<!-- 房屋面积 -->
				<el-form-item label="房屋面积:" style="display: inline-block; width: 45%;">
					<el-input-number v-model="houseUpForm.rentArea" controls-position="right"  :min="1" :max="99999" step-strictly></el-input-number>(m²)
				</el-form-item>
				
				<!-- 房屋楼层 -->
				<el-form-item label="房屋楼层:" style="display: inline-block; width: 45%;">
					<el-input-number v-model="houseUpForm.floor" controls-position="right"  :min="1" :max="99999" step-strictly></el-input-number>(楼层)
				</el-form-item>
				
				
				<!-- 详细地址 -->
				<el-form-item label="详细地址:">
					<el-input v-model="houseUpForm.addressDetail" type="textarea" :rows="2" maxlength="50" show-word-limit 
					placeholder="请输入出租房屋的详细地址,例如:xx省xx市xx区xx街道xx小区xx幢xx室"></el-input>
				</el-form-item>
				
				<!-- 房屋配套设置设施 -->
				<el-form-item label="配套设施:">
					  <el-checkbox-group v-model="houseUpForm.checkList">  
					    <el-checkbox label="冰箱"></el-checkbox>
					    <el-checkbox label="洗衣机"></el-checkbox>
					    <el-checkbox label="热水器"></el-checkbox>
						<el-checkbox label="微波炉"></el-checkbox>
						<el-checkbox label="燃气灶"></el-checkbox>
						<el-checkbox label="油烟机"></el-checkbox>
						<el-checkbox label="空调"></el-checkbox>
					    <el-checkbox label="沙发"></el-checkbox>
					    <el-checkbox label="宽带"></el-checkbox>
						<el-checkbox label="WIFI"></el-checkbox>
						<el-checkbox label="床"></el-checkbox>
						<el-checkbox label="洗漱用具"></el-checkbox>
						<el-checkbox label="衣柜"></el-checkbox>
						<el-checkbox label="卫生间"></el-checkbox>
						<el-checkbox label="阳台"></el-checkbox>
					  </el-checkbox-group>
				</el-form-item>
				
				<!-- 出售价格 -->
				<el-form-item label="出售价格:">
					<el-input-number v-model="houseUpForm.monthRent" controls-position="right"  :min="1" :max="99999999" step-strictly></el-input-number>(元)
				</el-form-item>
				
				<!--房屋详情-->
				<el-form-item label="房屋详情:">
					<el-input v-model="houseUpForm.description" type="textarea" :rows="4" maxlength="300" show-word-limit ></el-input>
				</el-form-item>
				
				<div style="width: 100%;height: 200px;overflow: scroll;">
					<img :src="showHousepic[0]" @click="showbigHousepic=true,showBig(showHousepic[0])"/>
					<img :src="showHousepic[1]" @click="showbigHousepic=true,showBig(showHousepic[1])"/>
					<img :src="showHousepic[2]" @click="showbigHousepic=true,showBig(showHousepic[2])"/>
					<img :src="showHousepic[3]" @click="showbigHousepic=true,showBig(showHousepic[3])"/>
					<img :src="showHousepic[4]" @click="showbigHousepic=true,showBig(showHousepic[4])"/>
				</div>
				<el-dialog title="图片详情" :visible.sync="showbigHousepic" append-to-body>
					<img :src="showBigBase64" style="width: 100%;"/>
				</el-dialog>
				
			</el-form>
		</el-dialog>
		
		<el-dialog :visible.sync="refuseDialog" width="30%" title="请选择拒绝理由">
					  <el-form>
						  <el-form-item>
							 
							    <el-radio-group v-model="refuseReaNo">
							      <el-radio :label="1" class="refuseRadio">房屋信息填写不符合要求。</el-radio>
							      <el-radio :label="2" class="refuseRadio">房屋照片不符合要求。</el-radio>
							      <el-radio :label="3" class="refuseRadio">其他特殊原因。</el-radio>
							    </el-radio-group>
						  </el-form-item>
						  <el-form-item label-width="42%">
						  	<el-button type="primary" @click="refuseHU">确认</el-button>
						  </el-form-item>
					  </el-form>
					  
		</el-dialog>
		<!-- <button @click="housedetail=true">test</button> -->
		
	</div>
</template>

<script>
	
	import {
		regionData,
		regionDataPlus,
		CodeToText,
		TextToCode
	} from 'element-china-area-data' //导入地区级联选择器
	
	export default{
		
		created() {
			this.getHouseUpRecords();
		},
		
		data(){
			return{
				options: regionData,//家庭住址选择器样式
				
				HouseUpRecordInfo:{
					account:'',//存放要查询的申请记录的账号
					pageStart: 1,//页面初始
					pageSize: 8,//页面长度
				},
				
				rentTypeOptions:[{
					value:0,
					label:'大产权',
				},{
					value:1,
					label:'小产权',
				}
				],
				
				HouseUpRecordList:[],//存放所有查询出来的列表
				HURecords:0,//查询结果数量
				
				housedetail:false,//房屋详情页面
				showbigHousepic:false,//展示大图片
				
				houseUpForm:{
					account:'test',
					houseType:[1,1,1],
					houseID:["110000", "110100", "110101"],
					rentType:1,
					rentArea:100,
					floor:1,
					addressDetail:'',
					checkList:['洗衣机'],
					monthRent:1000,
					description:'',
					housePic:[],
				},
				showHousepic:[],//图片格式代码和base64拼接后的图片src数组
				showBigBase64:'',
				
				refuseDialog:false,//拒绝房源信息申请对话框flag
				refuseReaNo:1,//拒绝理由编号
				refuseHouid:1,//拒绝房源的房源houid
			}
		},
		methods:{
			
			//获取列表
			async getHouseUpRecords(){
				const {
					data: res
				} = await this.$http.get("/api/gethouseUpRecord", {
					params: this.HouseUpRecordInfo
				});
				this.HouseUpRecordList = res.houseInfoArrayList;
				this.HURecords = res.HURecords;
				//console.log(res.ownerApplyList);
				//console.log(123);
			},
			
			
			//页面长度
			handleSizeChange(newSize) {
				this.HouseUpRecordInfo.pageSize = newSize;
				this.getHouseUpRecords();
			},
			//分页获取指定页面
			handleCurrentChange(newPage) {
				this.HouseUpRecordInfo.pageStart = newPage;
				this.getHouseUpRecords();
			},
			//查看房屋详情
			getHouseDetail(thishouse){
				this.houseUpForm.account = thishouse.account;
				this.houseUpForm.houseType = thishouse.houseType;
				this.houseUpForm.houseID = thishouse.houseID;
				this.houseUpForm.rentType = thishouse.rentType;
				this.houseUpForm.rentArea = thishouse.rentArea;
				this.houseUpForm.floor = thishouse.floor;
				this.houseUpForm.addressDetail = thishouse.addressDetail;
				this.houseUpForm.checkList = thishouse.checkList;
				this.houseUpForm.monthRent = thishouse.monthRent;
				this.houseUpForm.description = thishouse.description;
				this.houseUpForm.housePic = thishouse.housePic;
				
				this.showHousepic
				
				for(var i=0;i<this.houseUpForm.housePic.length;i++){
					if(this.houseUpForm.housePic[i] != ''){
						this.showHousepic[i] = 'data:image/jpg;base64,'+this.houseUpForm.housePic[i];
					}else{
						this.showHousepic[i] = '';
					}
				}
				// this.showHousepic[0] = 'data:image/jpg;base64,'+this.houseUpForm.housePic[0];
				// this.showHousepic[1] = 'data:image/jpg;base64,'+this.houseUpForm.housePic[1];
				// this.showHousepic[2] = 'data:image/jpg;base64,'+this.houseUpForm.housePic[2];
				// this.showHousepic[3] = 'data:image/jpg;base64,'+this.houseUpForm.housePic[3];
				// this.showHousepic[4] = 'data:image/jpg;base64,'+this.houseUpForm.housePic[4];
			},
			
			showBig(base64){
				this.showBigBase64 = base64;
			},
			
			//确认上传，通过
			async HUsubmit(houid){
				const {data:res} = await this.$http.put("/api/submitHouseUpRecord?houid="+houid);
				if(res == "success"){
					this.$message.success("审核通过！");
					this.getHouseUpRecords();
					return;
				}else{
					this.$message.error("操作出错,请重试!");
					return;
				}
			},
			HUrefuse(houid){
				this.refuseHouid = houid;
				this.refuseDialog = true;
				// const {data:res} = await this.$http.put("/api/refuseHouseUpRecord?houid=" + houid);
				// if(res == "success"){
				// 	this.$message.success("操作成功，已拒绝！");
				// 	this.getHouseUpRecords();
				// 	return;
				// }else{
				// 	this.$message.error("操作出错,请重试!");
				// 	return;
				// }
			},
			
			async refuseHU(){
				let formData = new FormData();
				formData.append('houid', this.refuseHouid);
				formData.append('refusereason',this.refuseReaNo)
				const {data:res} = await this.$http.put("/api/refuseHouseUpRecord",formData);
				if(res == "success"){
					this.$message.success("操作成功，已拒绝！");
					this.refuseDialog = false;
					this.getHouseUpRecords();
					return;
				}else{
					this.$message.error("操作出错,请重试!");
					this.refuseDialog = false;
					return;
				}
			},
			
			async deleteHouseUpRecord(houid){
				const confirRes = await this.$confirm('确认删除该用户房源申请？删除后不可恢复', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if (confirRes != 'confirm') {
					//取消
					return this.$message.info("已取消")
				}
				const {
					data: res
				} = await this.$http.delete("/api/deleteOneHouseUpRecord?houid=" + houid);
				if (res != "success") {
					return this.$message.error("删除失败！");
				}
				this.$message.success("删除成功！");
				this.getHouseUpRecords();
			},
		}
	}
	
</script>

<style lang="less" scoped>
	.table {
			margin-top: 15px;
		}
	img{
		width: 48%;
		margin-left: 3px;
	}
	.refuseRadio{
		display: block;
		margin-top: 5px;
	}
	
</style>

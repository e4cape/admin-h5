<template>
  <div id="wuliushenhe">
    <flexbox orient="vertical" class="flexbox">
      <flexbox-item>
        <el-table :data="auditData" border style="width: 100%">
          <el-table-column prop="routeCreateTime" label="提交日期" width="120" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.routeCreateTime | formatTime('YYYY-MM-DD HH:mm:ss')}}</template>
          </el-table-column>
          <el-table-column prop="routeState" label="审核状态" align="center">
            <template slot-scope="scope">
              <el-link type="info" :underline="false" v-if="scope.row.routeState ==0">待审核</el-link>
              <el-link type="info" :underline="false" v-else-if="scope.row.routeState ==1">已审核通过</el-link>
              <el-link type="info" :underline="false" v-else-if="scope.row.routeState ==2">审核未通过</el-link>
              <el-link type="info" :underline="false" v-else-if="scope.row.routeState ==3">已中标</el-link>
              <el-link type="info" :underline="false" v-else-if="scope.row.routeState ==4">投标结束</el-link>
              <el-link type="info" :underline="false" v-else-if="scope.row.routeState ==5">已付款</el-link>
              <el-link type="info" :underline="false" v-else>已失效</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="routeState" label="操作" align="center">
            <template slot-scope="scope">
              <x-button
                v-if="scope.row.routeState ==0"
                @click.native="checkOne(scope.row)"
                class="btn"
              >审核</x-button>
              <x-button
                type="primary"
                v-if="scope.row.routeState !=0"
                @click.native="watchAuditDeatil(scope.row)"
                class="btn"
              >详情</x-button>
              <x-button
                type="warn"
                v-if="scope.row.routeState ==3"
                @click.native="getPrice(scope.row)"
                class="btn"
              >竞价</x-button>
            </template>
          </el-table-column>
        </el-table>
      </flexbox-item>
    </flexbox>

    <!-- 审核弹框 -->
    <div v-transfer-dom>
      <x-dialog v-model="checkShowToast" class="dialog-demo" hide-on-blur>
        <div style="padding:15px;textAlign: left;">
          <el-form :model="checkForm" ref="ruleForm">
            <div>承运单号 : &nbsp;&nbsp;{{checkForm.routeSn}}</div>
            <div
              style="borderBottom: 1px dashed #000;marginBottom: 10px;paddingBottom: 10px;"
            >发布时间 : &nbsp;&nbsp;{{checkForm.routeCreateTime}}</div>
            <p>装货地 :&nbsp;&nbsp;{{checkForm.routeFromMarket}}{{checkForm.routeFromCity}}{{checkForm.routeFromArea}}{{checkForm.routeFromAddress}}</p>
            <p>卸货地 :&nbsp;&nbsp;{{checkForm.routeToMarket}}{{checkForm.routeToCity}}{{checkForm.routeToArea}}{{checkForm.routeToAddress}}</p>
            <p>车辆要求 :&nbsp;&nbsp;{{checkForm.routeCarType}}--{{checkForm.routeCarLong}}</p>
            <p>货物量 :&nbsp;&nbsp;{{checkForm.routeMinNumber}}{{checkForm.routeUnit==1?"吨":"方"}}至{{checkForm.routeMaxNumber}}{{checkForm.routeUnit==1?"吨":"方"}}</p>
            <p>货物名称 :&nbsp;&nbsp;{{checkForm.routeGoodsName}}</p>
            <p>装货时间 :&nbsp;&nbsp;{{checkForm.routeBeginTime}}</p>
            <p>期待送达时间 :&nbsp;&nbsp;{{checkForm.routeReceiveTime}}</p>
            <p>联系人 :&nbsp;&nbsp;{{checkForm.routeContactName}}</p>
            <p
              style="borderBottom: 1px dashed #000;marginBottom: 10px;paddingBottom: 10px;"
            >联系电话 :&nbsp;&nbsp;{{checkForm.routeContactPhone}}</p>
            <div style="marginBottom: 10px;paddingBottom: 10px;">
              指导价格 :&nbsp;&nbsp;
              <group>
                <x-input
                  v-model="checkForm.guidePrice"
                  type="text"
                  style="width:100px;height:18px;border: 1px solid #ccc;"
                ></x-input>
                <span>/{{checkForm.routeUnit==1?"吨":"方"}}</span>
              </group>
            </div>
            <div style="marginBottom: 10px;paddingBottom: 10px;borderBottom: 1px dashed #000;">
              驳回备注 :
              <group>
                <x-input
                  v-model="checkForm.auditText"
                  type="text"
                  style="width:200px;height:18px;border: 1px solid #ccc;"
                ></x-input>
              </group>
            </div>
          </el-form>
        </div>
        <div @click="showToast=false">
          <x-button
            :gradients="['#1D62F0', '#19D5FD']"
            @click.native="passCheck"
            style="width:80px;height: 30px;display: inline-block; marginBottom: 20px;lineHeight: 30px;"
          >通过</x-button>
          <x-button
            :gradients="['#FF2719', '#FF61AD']"
            @click.native="rejectCheck"
            style="width:80px;height: 30px;display: inline-block;marginBottom: 20px;lineHeight: 30px;"
          >拒绝</x-button>
        </div>
      </x-dialog>
    </div>

    <!-- 详情弹框 -->
    <div v-transfer-dom>
      <x-dialog v-model="showToast" class="dialog-demo" hide-on-blur>
        <div style="padding:15px;textAlign: left;">
          <el-form :model="auditForm" ref="ruleForm">
            <div>承运单号 : &nbsp;&nbsp;{{auditForm.routeSn}}</div>
            <div
              style="borderBottom: 1px dashed #000;marginBottom: 10px;paddingBottom: 10px;"
            >发布时间 : &nbsp;&nbsp;{{auditForm.routeCreateTime}}</div>
            <p>装货地 :&nbsp;&nbsp;{{auditForm.routeFromMarket}}{{auditForm.routeFromCity}}{{auditForm.routeFromArea}}{{auditForm.routeFromAddress}}</p>
            <p>卸货地 :&nbsp;&nbsp;{{auditForm.routeToMarket}}{{auditForm.routeToCity}}{{auditForm.routeToArea}}{{auditForm.routeToAddress}}</p>
            <p>车辆要求 :&nbsp;&nbsp;{{auditForm.routeCarType}}--{{auditForm.routeCarLong}}</p>
            <p>货物量 :&nbsp;&nbsp;{{auditForm.routeMinNumber}}{{auditForm.routeUnit==1?"吨":"方"}}至{{auditForm.routeMaxNumber}}{{auditForm.routeUnit==1?"吨":"方"}}</p>
            <p>货物名称 :&nbsp;&nbsp;{{auditForm.routeGoodsName}}</p>
            <p>装货时间 :&nbsp;&nbsp;{{auditForm.routeBeginTime}}</p>
            <p>期待送达时间 :&nbsp;&nbsp;{{auditForm.routeReceiveTime}}</p>
            <p>联系人 :&nbsp;&nbsp;{{auditForm.routeContactName}}</p>
            <p
              style="borderBottom: 1px dashed #000;marginBottom: 10px;paddingBottom: 10px;"
            >联系电话 :&nbsp;&nbsp;{{auditForm.routeContactPhone}}</p>
            <div style="marginBottom: 10px;paddingBottom: 10px;">
              指导价格 :&nbsp;&nbsp;
              <span style="color:#f00;">{{auditForm.routeGuidePrice}}</span>
              &nbsp;/&nbsp;{{auditForm.routeUnit==1?"吨":"方"}}
            </div>
            <div
              style="marginBottom: 10px;paddingBottom: 10px;borderBottom: 1px dashed #000;"
            >驳回备注 :&nbsp;&nbsp;{{auditForm.routeCheckReason}}</div>
            <div v-if="auditForm.routeState==4||auditForm.routeState==5" class="newRouteList">
              <p>承运商: &nbsp;&nbsp;{{auditForm.bidCarrierName}}</p>
              <p>报价 : &nbsp;&nbsp;{{auditForm.bidPrice}}</p>
              <p>承载量 : &nbsp;&nbsp;{{auditForm.bidNumber}}</p>
              <p>中标时间 : &nbsp;&nbsp;{{auditForm.routeRefreshTime}}</p>
              <p>信息费 : &nbsp;&nbsp;{{auditForm.routeMessagePrice}}</p>
            </div>

            <ul v-if="auditForm.routeState==3" style="padding-inline-start: 0px;">
              <li style="listStyle: none;" v-for="(item,index) in routePriceList" :key="index">
                <p style="display: flex;justify-content:space-between;">
                  <span>{{item.bidCarrierName}}</span>
                  <span style="color:#f00;">¥{{item.bidPrice}}/吨</span>
                </p>
                <p>承载量 : {{item.bidNumber}}</p>
                <p>投标时间 : {{item.bidTime}}</p>
              </li>
            </ul>
          </el-form>
        </div>
        <div @click="showToast=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>

    <!-- 竞价弹窗 -->
    <div v-transfer-dom>
      <confirm v-model="priceShow"
      title="操作提示"
      @on-cancel="priceShow=false;"
      @on-confirm="onConfirm">
        <p style="text-align:center;">确定要竞价吗?</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { TransferDomDirective as TransferDom } from "vux";
export default {
  name: "wuliushenhe",
  directives: {
    TransferDom
  },
  data() {
    return {
      auditData: [],
      auditPage: 1,
      showToast: false,
      checkShowToast: false,
      priceShow: false,
      // 审核表单
      checkForm: {
        routeId: "",
        routeSn: "",
        routeState: "",
        routeCreateTime: "",
        routeFromAddress: "",
        routeFromMarket: "",
        routeFromCity: "",
        routeFromArea: "",
        routeToAddress: "",
        routeToMarket: "",
        routeToCity: "",
        routeToArea: "",
        routeCarType: "",
        routeCarLong: "",
        routeMinNumber: "",
        routeMaxNumber: "",
        routeUnit: "",
        routeGoodsName: "",
        routeBeginTime: "",
        routeReceiveTime: "",
        routeContactName: "",
        routeContactPhone: "",
        routeGuidePrice: "",
        routeCheckReason: "",
        routeMessagePrice: "",
        routeRefreshTime: "",
        guidePrice: "",
        auditText: ""
      },
      //货源详情表单
      auditForm: {
        routeId: "",
        routeSn: "",
        routeState: "",
        routeCreateTime: "",
        routeFromAddress: "",
        routeFromMarket: "",
        routeFromCity: "",
        routeFromArea: "",
        routeToAddress: "",
        routeToMarket: "",
        routeToCity: "",
        routeToArea: "",
        routeCarType: "",
        routeCarLong: "",
        routeMinNumber: "",
        routeMaxNumber: "",
        routeUnit: "",
        routeGoodsName: "",
        routeBeginTime: "",
        routeReceiveTime: "",
        routeContactName: "",
        routeContactPhone: "",
        routeGuidePrice: "",
        routeCheckReason: "",
        routeMessagePrice: "",
        routeRefreshTime: "",

        bidCarrierName: "",
        bidPrice: "",
        bidNumber: "",
        bidTime: ""
      },
      //报价列表循环的数组
      routePriceList: [],
      //货源审核发请求的数据
      checkList: {
        routeCheckReason: "",
        routeGuidePrice: "",
        routeId: 0,
        //默认让通过,填1,不通过就传2
        routeState: 1
      },
      confirmId:0
    };
  },
  methods: {
    //获取货源审核列表事件
    async getAuditCheck() {
      let res = await this.$axios.get(
        `admin/sysUser/pageList?currentPage=${this.auditPage}&pageSize=1000`
      );
      //   console.log(res);
      if (res.data.code === 200) {
        this.auditData = res.data.data.items;
      }
    },
    //审核
    async checkOne(row) {
      console.log(row);

      let res = await this.$axios.get(
        `admin/logisticsController/routeDetil?routeId=${row.routeId}`
      );
      // console.log(res);
      if (res.data.code === 200) {
        let routeObj = res.data.data;
        for (var key in routeObj) {
          this.checkForm[key] = routeObj[key];
        }
      }
      this.checkShowToast = true;
    },
    //详情
    async watchAuditDeatil(row) {
      console.log(row);
      this.auditForm.routeState = row.routeState;

      // 状态<3或者为6调用detail接口
      if (row.routeState < 3 || row.routeState == 6) {
        let res = await this.$axios.get(
          `admin/logisticsController/routeDetil?routeId=${row.routeId}`
        );
        // console.log(res);
        if (res.data.code === 200) {
          let routeObj = res.data.data;
          for (var key in routeObj) {
            this.auditForm[key] = routeObj[key];
          }
        }
      }
      // 状态为3 4 5调用queryBid接口
      if (row.routeState == 3 || row.routeState == 4 || row.routeState == 5) {
        let res = await this.$axios.get(
          `admin/logisticsController/queryBid?bidRouteId=${row.routeId}`
        );
        // console.log(res);
        if (res.data.code === 200) {
          this.routePriceList = res.data.data.list;
          // console.log("循环数组");
          console.log(this.routePriceList);

          this.routePriceList.forEach(v => {
            // console.log(v);
            if (v.bidState == 4) {
              // console.log("被选中的是");
              // console.log(v);
              // console.log(v.route);
              for (var key in v.route) {
                this.auditForm[key] = v.route[key];
              }
              this.auditForm.bidCarrierName = v.bidCarrierName;
              this.auditForm.bidPrice = v.bidPrice;
              this.auditForm.bidNumber = v.bidNumber;
            } else {
              for (var key in row) {
                this.auditForm[key] = row[key];
              }
            }
          });
        }
      }
      this.showToast = true;
    },
    //竞价
    getPrice(row) {
      this.priceShow=true;
      this.confirmId=row.routeId;
    },
    //通过
    async passCheck() {
      this.checkList.routeId = this.checkForm.routeId;
      this.checkList.routeGuidePrice = this.checkForm.guidePrice;
      let res = await this.$axios.post(
        "admin/sysUser/checkRoute",
        this.checkList
      );
      if (res.data.code == 200) {
        
        this.$vux.alert.show({
          title: "提示",
          content: "审核已通过"
        });
        this.getAuditCheck();
      } else {
        
        this.$vux.alert.show({
          title: "提示",
          content: "审核失败"
        });
      }
      this.checkShowToast = false;
    },
    //拒绝
    async rejectCheck() {
      this.checkList.routeState = 2;
      this.checkList.routeCheckReason = this.checkForm.auditText;

      this.checkList.routeId = this.checkForm.routeId;

      let res = await this.$axios.post(
        "admin/sysUser/checkRoute",
        this.checkList
      );
      if (res.data.code == 200) {
        this.$vux.alert.show({
          title: "提示",
          content: "审核已驳回"
        });
        this.getAuditCheck();
      } else {
        this.$vux.alert.show({
          title: "提示",
          content: "审核失败"
        });
      }
      this.checkShowToast = false;
    },
    //确定竞价
    async onConfirm(){
      let res = await this.$axios.post(
        `logistics/bid/chooseThreeBid?bidRouteId=${this.confirmId}`
      );
      console.log(res);
      if (res.data.code === 200) {
        this.$vux.alert.show({
          title: "提示",
          content: "竞价成功!"
        });
        this.getAuditCheck();
      }else {
        this.$vux.alert.show({
          title: "提示",
          content: "竞价失败!"
        });
      }
      this.priceShow = false;
    },

  },
  created() {
    this.getAuditCheck();
  }
};
</script>

<style lang="less" scoped>
#wuliushenhe {
  background-color: #324157;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  .el-table {
    text-align: center;
    border: 1px solid #fff;
  }
  .el-table__header {
    border-bottom: 1px solid #fff;
  }
  .el-table__row {
    border-bottom: 1px solid #fff;
  }
  .btn {
    width: 13vw;
    height: 8vw;
    display: inline-block;
    font-size: 10px;
    padding: 0;
  }
}

@import "~vux/src/styles/close";

.dialog-demo {
  font-size: 3.6vw;
  // text-align: left;
  .weui-dialog {
    border-radius: 8px;
    padding-bottom: 8px;
    // text-align: left;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    height: 350px;
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>


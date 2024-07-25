<script lang="ts" setup>
import { onBeforeMount, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import axios from "../../request/index";
import { browser_transactionDetail } from "../../request/api";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";

interface TransactionInfo {
  name: string;
  value: any;
}
interface Detail {
  transaction_hash: string;
  transaction_time: any;

  form_address: string;

  to_address: string;

  block_chain_height: string;

  transaction_info?: TransactionInfo[];
}

const route = useRoute();

const loading = ref(false);

let detail = ref<Detail>({
  transaction_hash: "",
  transaction_time: 0,
  form_address: "",
  to_address: "",
  block_chain_height: "",
});

const getDetail = () => {
  loading.value = true;
  const data = {
    transaction_hash: route.query.transaction_hash,
  };
  axios.post(browser_transactionDetail, data).then((res: any) => {
    console.log(res);
    loading.value = false;
    if (res.code !== 200) {
      return ElMessage.error(res.msg);
    }
    res.data.transaction_time = dayjs(res.data.transaction_time * 1000).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    detail.value = Object.assign(detail, res.data);
  });
};
onBeforeMount(() => {
  getDetail();
});
</script>
<template>
  <div class="container" v-loading="loading">
    <div class="container-body">
      <div class="top">
        <img class="logo" src="/static/logo.png" alt="" />
      </div>
      <div class="content">
        <div class="block1 box_">
          <div class="title">流转详情</div>
          <div class="box_content">
            <div class="cell">
              <div class="cell_label">流转哈希</div>
              <div class="cell_value">{{ detail.transaction_hash }}</div>
            </div>
            <div class="cell">
              <div class="cell_label">区域高度</div>
              <div class="cell_value">{{ detail.block_chain_height }}</div>
            </div>
            <div class="cell">
              <div class="cell_label">上链时间</div>
              <div class="cell_value">{{ detail.transaction_time }}</div>
            </div>
            <div class="cell">
              <div class="cell_label">发送者</div>
              <div class="cell_value">{{ detail.form_address }}</div>
            </div>
            <div class="cell">
              <div class="cell_label">接收者</div>
              <div class="cell_value">{{ detail.to_address }}</div>
            </div>
          </div>
        </div>

        <template v-if="detail.transaction_info">
          <div class="block2 box_">
            <div class="title">流转信息</div>
            <div class="box_content">
              <div
                class="cell"
                v-for="item in detail.transaction_info"
                :key="item.name"
              >
                <div class="cell_label">{{ item.name }}</div>
                <div class="cell_value">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #0d0c10;

  .container-body {
    position: relative;
    min-height: 100vh;

    .top {
      position: relative;
      height: 89px;
      border-bottom: 1px solid #616161;
      .logo {
        position: absolute;
        top: 17px;
        left: 48px;
        width: 140px;
        height: 48px;
      }
    }
    .content {
      display: flex;
      justify-content: space-between;
      padding: 47px;
      .block1 {
        box-sizing: border-box;
        width: 712px;
      }
      .block2 {
        box-sizing: border-box;
        width: 608px;
      }

      .box_ {
        padding: 0 32px;
        border-radius: 20px;
        border: 1px solid #616161;
        .title {
          display: flex;
          align-items: center;
          height: 77px;
          border-bottom: 1px solid #616161;
          font-family: PingFang SC;
          font-size: 18px;
          font-weight: 500;
          line-height: 25.02px;
          text-align: left;
        }
        .box_content {
          padding-top: 42px;
          padding-bottom: 11px;
          .cell {
            display: flex;
            padding-bottom: 38px;
            font-family: PingFang SC;
            font-size: 16px;
            line-height: 22.24px;
            letter-spacing: 0.03em;
            text-align: left;

            .cell_label {
              width: 90px;
              font-weight: 500;
            }
            .cell_value {
              flex: 1;
              min-width: 0;
              font-weight: 400;
              text-align: right;
              word-wrap: break-word;
            }
          }
        }
      }
    }
  }
}
</style>

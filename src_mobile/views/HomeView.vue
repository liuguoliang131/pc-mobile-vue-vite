<template>
  <div class="container" @scroll="onScroll">
    <div class="container-body">
      <div class="top">
        <img @click="handReset" class="logo" src="/static/logo.png" alt="" />
        <div class="welcome">
          欢迎使用<span style="color: #06d8ed">憨猴</span>生态浏览器
        </div>
      </div>
      <div class="block2 total_box">
        <div class="total_box_1">
          <img class="icon" src="/static/total3.png" alt="" />
          <span class="title">今日流转数量</span>
        </div>
        <div class="total_box_2">
          {{ overviewData.day_transaction_num }}
        </div>
      </div>
      <div class="block3 total_box">
        <div class="total_box_1">
          <img class="icon" src="/static/total1.png" alt="" />
          <span class="title">最新区块高度</span>
        </div>
        <div class="total_box_2">{{ overviewData.chain_height }}</div>
      </div>
      <div class="block4 total_box">
        <div class="total_box_1">
          <img class="icon" src="/static/total2.png" alt="" />
          <span class="title">累计流转数量</span>
        </div>
        <div class="total_box_2">
          {{ overviewData.total_transaction_num }}
        </div>
      </div>
      <div class="block5">
        <input
          class="keyword"
          type="text"
          placeholder="请输入流转哈希/区块高度/TokenID搜索"
          v-model="params.value"
          @keyup="handEntSearch"
        />
        <div class="vertical"></div>
        <div class="search" @click="handSearch">搜索</div>
      </div>
      <div class="content">
        <table>
          <thead>
            <tr>
              <th>流转哈希</th>
              <th>
                <div class="date" @click="sortChange">
                  <div>流转时间</div>
                  <div class="date_button">
                    <img
                      :class="['up', params.order === 2 ? 'active' : '']"
                      src="/static/up-icon.svg"
                      alt=""
                    />
                    <img
                      :class="['down', params.order === 1 ? 'active' : '']"
                      src="/static/down-icon.svg"
                      alt=""
                    />
                  </div>
                </div>
              </th>
              <th>发送者</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.transaction_hash">
              <td class="td1">
                <div class="ent nowrap" @click="handGoInfo(item)">
                  {{ item.transaction_hash }}
                </div>
              </td>
              <td class="td2">
                <div class="chain_time nowrap">
                  {{
                    dayjs(item.chain_time * 1000).format("YYYY-MM-DD HH:mm:ss")
                  }}
                </div>
              </td>
              <td class="td3">
                <div class="form_address nowrap">
                  {{ item.form_address }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import axios from "../../request/index";
import { browser_overview, browser_transactionList } from "../../request/api";
import { showToast } from "vant";
import "vant/lib/index.css";
import dayjs from "dayjs";
interface SearchData {
  page: number;
  page_size: number;
  value: string;
  order: number;
}
interface OverviewData {
  chain_height: any;
  day_transaction_num: any;
  total_transaction_num: any;
}
interface TableItem {
  transaction_hash: string;
  chain_time?: any;
  form_address?: any;
  to_address?: any;
  chain_type?: any;
  option_type?: any;
  block_chain_height?: any;
}

const router = useRouter();

let timer: any = null;

const overviewData = ref<OverviewData>({
  chain_height: 0,
  day_transaction_num: 0,
  total_transaction_num: 0,
});

const tableData = ref<TableItem[]>([]);

const params = ref<SearchData>({
  page: 1,
  page_size: 10,
  value: "",
  order: 1, //1倒序 2正序
});

const loading = ref(false);
const finished = ref(false);

const handReset = () => {
  params.value = {
    page: 1,
    page_size: 10,
    value: "",
    order: 1, //1倒序 2正序
  };
  finished.value = false;
  getList();
};
const getOverview = () => {
  const req = () => {
    axios
      .get(browser_overview, {
        params: {},
      })
      .then((res: any) => {
        if (res.code !== 200) {
          clearTimeout(timer);
          return showToast(res.msg);
        }
        console.log(res);
        overviewData.value = res.data;
      });
  };
  req();
  timer = setInterval(() => {
    req();
  }, 10000);
};
// 获取表格数据
const getList = () => {
  if (loading.value) return;
  if (finished.value) return;
  loading.value = true;
  axios.post(browser_transactionList, params.value).then((res: any) => {
    console.log(res);
    if (res.code !== 200) {
      finished.value = true;
      return showToast(res.msg);
    }
    const maxLength = 300; // 数据最大显示量 防卡顿
    const prevList = [...tableData.value, ...res.data.list];
    prevList.splice(0, prevList.length - maxLength);
    tableData.value = prevList;
    if (res.data.list.length < params.value.page_size) {
      finished.value = true;
      showToast("没有更多数据了");
    }
    if (
      res.data.total_count === 1000 &&
      Math.ceil(res.data.total_count / params.value.page_size) ===
        params.value.page
    ) {
      console.log("1000");
      showToast("最多显示1000条数据,如没有找到数据请使用精准搜索");
    }
    params.value.page++;
    loading.value = false;
  });
};
// 搜索
const handSearch = () => {
  params.value.page = 1;
  tableData.value = [];
  finished.value = false;
  getList();
};

// 进入详情
const handGoInfo = (item: TableItem) => {
  console.log(item);
  router.push({
    path: "/info",
    query: {
      transaction_hash: item.transaction_hash,
    },
  });
};

// 升序降序
const sortChange = () => {
  params.value.order = params.value.order === 1 ? 2 : 1;
  params.value.page = 1;
  tableData.value = [];
  finished.value = false;
  getList();
};

const onScroll = (e) => {
  if (e.target.scrollTop + e.target.offsetHeight > e.target.scrollHeight - 20) {
    getList();
  }
};
// 挂载前钩子
onBeforeMount(() => {
  getOverview();
  getList();
});
onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>

<style scoped lang="less">
.container {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #0d0c10;
  color: #ffffff;

  background-image: url("/static/background.png");
  background-size: 316px 277px;
  background-position: 35.46px 128px;
  background-repeat: no-repeat;
  .container-body {
    position: relative;
    min-height: 100vh;
    .top {
      position: relative;
      height: 41px;
      .logo {
        position: absolute;
        top: 5px;
        left: 16px;
        width: 92px;
        height: 31px;
      }
      .welcome {
        position: absolute;
        top: 15px;
        right: 16px;
        text-align: right;
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 16.68px;
        letter-spacing: 0.04em;
      }
    }

    .block2 {
      position: absolute;
      top: 167.72px;
      left: 145.73px;
    }
    .block3 {
      position: absolute;
      left: 23px;
      top: 247.15px;
    }
    .block4 {
      position: absolute;
      left: 236px;
      top: 264.4px;
    }

    .total_box {
      display: flex;
      flex-direction: column;
      min-width: 115px;
      min-height: 62.71px;
      border: 1px solid #616161;
      border-radius: 12px;
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(7px);
      .total_box_1 {
        display: flex;
        align-items: center;
        padding-top: 8px;
        padding-left: 8.27px;
        .icon {
          width: 20px;
          height: 20px;
        }
        .title {
          text-indent: 3px;
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: 500;
          line-height: 16.68px;
          letter-spacing: 0.03em;
          text-align: left;
          color: #d3d3d3;
        }
      }
      .total_box_2 {
        padding-top: 5.16px;
        padding-left: 8.27px;
        font-family: Sintony;
        font-size: 16px;
        font-weight: 700;
        line-height: 22.24px;
        text-align: left;
        color: #ffffff;
      }
    }

    .block5 {
      position: absolute;
      left: 50%;
      top: 68px;
      transform: translate(-50%, 0);
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 317px;
      height: 44.82px;
      border: 1px solid #606060;
      border-radius: 10px;
      box-shadow: 0 0 0px 6px #202020;
      .keyword {
        flex: 1;
        height: 68px;
        padding: 0 18px;
        border-radius: 10px 0 0 10px;
        border: none;
        outline: none;
        font-size: 12px;
        font-weight: 400;
        letter-spacing: 0.05em;
        background-color: transparent;
        color: #fff;
      }
      .vertical {
        width: 1px;
        height: 15.82px;
        background-color: #b8b8b8;
      }
      .search {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 47.36px;
        height: 44.82px;
        border-radius: 0 10px 10px 0;
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        text-align: center;
        color: #06d8ed;
        user-select: none;
        cursor: pointer;
        &:active {
          opacity: 0.7;
        }
      }
    }

    .content {
      margin: 331px 16px 16px 16px;
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(7px);
      border: 1px solid #606060;
      border-radius: 16px;
      padding: 0 18px;

      table {
        width: 100%;
        text-align: center; /* 设置表格文字居中 */
        line-height: 40px; /* 设置表格行高 */
        border-collapse: collapse; /* 合并表格边框 */
        border-spacing: 0;
        background: transparent;
        .th {
          height: 50px;
          border: none;
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: 500;
          line-height: 16.68px;
          letter-spacing: 0.03em;
          text-align: center;
          color: #ffffff;
        }
        td {
          height: 54px;
          border: none;
          font-family: PingFang HK;
          font-size: 12px;
          font-weight: 400;
          line-height: 16.68px;
          letter-spacing: 0.03em;
          text-align: center;
          min-width: 0;
          max-width: 50px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        tbody {
          tr {
            border-top: 1px solid #606060; /* 设置表格边框样式和颜色 */
          }
        }
        .date {
          display: flex;
          align-items: center;
          justify-content: center;
          .date_button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-left: 3px;
            .up {
              width: 8px;
              height: 8px;
              filter: saturate(20%);
            }
            .down {
              width: 8px;
              height: 8px;
              filter: saturate(20%);
            }
            .active {
              filter: saturate(100%);
            }
          }
        }

        .td1 {
          width: 50px;
        }
        .td3 {
          width: 50px;
        }
        .ent {
          color: #06d8ed;
        }
      }
    }
  }
}
</style>
<template>
  <view
    :class="{
      'ndo-select': true,
      'ndo-select-disabled': disabled,
    }"
  >
    <t-input
      v-if="input"
      class="custom-input"
      v-model:value="innerValue"
      :disabled="disabled"
      :placeholder="placeholder || l('PleaseInput')"
      suffix-icon="bottom"
      @icon-click="handleShowPopupClick"
    />

    <uni-data-select
      v-else
      v-model="innerValue"
      disabled
      :localdata="formatLocalData"
      :placeholder="placeholder || l('PleaseSelect')"
      :clear="false"
      @click="handleShowPopupClick"
    />
  </view>
  <t-popup v-model:value="showPicker" :title="l('PleaseSelect')">
    <view class="detail-container">
      <uni-forms class="inner-forms" ref="form_x" :modelValue="filterEntity">
        <uni-forms-item name="filterValue">
          <t-search
            v-model:value="filterEntity.filterValue"
            :placeholder="l('PleaseScanOrEnter', l(''))"
            backgroundColor="#ffffff"
            @search="fetchDataGoToFirst"
            @keyup.enter="fetchDataGoToFirst()"
          />
        </uni-forms-item>
      </uni-forms>
      <view class="list">
        <t-pull-refresh
          ref="refreshRefresh"
          :fetch="fetchDataList"
          @load="load"
        >
          <view v-for="(item, index) in info.items" :key="item">
            <van-cell-group>
              <view class="sb-item" @click="handleItemClick(item, index)">
                <view
                  style="
                    white-space: nowrap;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                  "
                  >{{ formatFieldValue(formatFieldNames.name, item) }}
                </view>
                <radio
                  :value="formatFieldValue(formatFieldNames.name, item)"
                  :checked="
                    formatFieldValue(formatFieldNames.id, item) === innerValue
                  "
                />
              </view>
            </van-cell-group>
          </view>
        </t-pull-refresh>
      </view>
    </view>
    <template #footer>
      <van-button block type="primary" @click="handleClearClick">
        {{ l("Clear") }}
      </van-button>
    </template>
  </t-popup>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { AppComponentBase } from "@/shared/index";
import { CommonComboxServiceProxy } from "@/shared/index";
import { debounce, set, merge } from "lodash";

export default defineComponent({
  name: "NdoSelect",
  mixins: [AppComponentBase],
  props: {
    value: {
      type: [String, Number, Boolean],
      default: "",
    },
    /**
     * 自定义查询接口
     * @description dataSource参数将不生效
     */
    fetch: {
      type: Function,
      default: null,
    },
    /** 是否禁用 */
    disabled: {
      type: Boolean,
      default: false,
    },
    /** 数据源名称 */
    dataSource: {
      type: String,
    },
    /** 其它参数 */
    params: {
      type: Object,
      default: {},
    },
    /** 自定义字段 */
    fieldNames: {
      type: Object,
      default: {},
    },
    placeholder: {
      type: String,
      default: "",
    },
    /** 是否支持输入 */
    input: {
      type: Boolean,
      default: false,
    },
    apiName: {
      type: String,
      default: "getNdoCombox",
    },
  },
  emits: ["update:value", "change"],
  data() {
    return {
      defaultFieldNames: {
        id: "id",
        name: "name",
        selectId: "ndoId",
      },
      showPicker: false,
      filterEntity: {
        filterValue: "",
      },
      info: {
        items: [],
        totalCount: 0,
      },
      localdata: [],
      selectedRowKey: "",
      selectedRow: [],
    };
  },
  computed: {
    formatFieldValue() {
      return (key: string, value: any) => {
        let result = value;
        try {
          const field: Array<string> = key.split(".");
          field.map((item) => {
            result = result[item];
          });
          return result;
        } catch (error) {
          return null;
        }
      };
    },
    formatLocalData() {
      return this.localdata.map((i) => {
        return {
          ...i,
          text:
            this.formatFieldValue(this.formatFieldNames.name, i) ||
            this.formatFieldValue(this.formatFieldNames.id, i),
          value: this.formatFieldValue(this.formatFieldNames.id, i),
        };
      });
    },
    serverApiInstance() {
      return new CommonComboxServiceProxy(this.$apiUrl, this.$api);
    },
    innerValue: {
      set(val) {
        this.$emit("update:value", val);
      },
      get() {
        return this.value;
      },
    },
    formatFieldNames() {
      return {
        ...this.defaultFieldNames,
        ...this.fieldNames,
      };
    },
  },
  watch: {
    innerValue: {
      handler: function (val) {
        if (val) {
          let params = {
            maxResultCount: 1,
            customData: this.params["customData"] || {},
          };
          // 支持链式解析, 如 a.b.c => { a:{ b: { c: { } } } }
          if (this.formatFieldNames.selectId.includes(".")) {
            params = merge(
              {},
              params,
              set({}, this.formatFieldNames.selectId, val)
            );
          } else {
            params[this.formatFieldNames.selectId] = val;
          }
          this.fetchDataList(params).then((result) => {
            this.localdata = result.items;
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    fetchDataGoToFirst() {
      this.$refs.refreshRefresh.fetchDataGoToFirst();
    },
    /** 加载数据 */
    fetchDataList(otherParams = {}) {
      const params = {
        name: this.dataSource,
        filterText: this.filterEntity.filterValue,
        skipCount: this.$refs.refreshRefresh?.skipCount || 0,
        maxResultCount: 20,
        customData: this.params["customData"] || {},
        ...otherParams,
      };
      if (this.fetch) {
        return this.fetch(params);
      }
      if (!this.serverApiInstance) {
        return Promise.reject();
      }
      return new Promise((resole) => {
        this.serverApiInstance[this.apiName](params).then((result) => {
          resole(result);
        });
      });
    },
    /**
     * 下拉选择点击选中
     * @param row 选中的值
     */
    handleItemClick(e, index) {
      const str = this.formatFieldValue(this.formatFieldNames.id, e);
      if (str === this.innerValue) return;
      this.innerValue = str;
      this.localdata = [e];
      this.toggle();
      this.$emit("change", {
        value: str,
        selectRow: this.localdata,
      });
    },
    handleShowPopupClick() {
      if (this.disabled) return;
      this.toggle();
    },
    toggle() {
      this.filterEntity.filterValue = "";
      this.showPicker = !this.showPicker;
    },
    handleClearClick() {
      this.innerValue = "";
      this.localdata = [];
      this.toggle();
      this.$emit("change", {
        value: "",
        selectRow: this.localdata,
      });
    },
    load(res) {
      this.info = res;
    },
  },
});
</script>
<style lang="scss" scoped>
.ndo-select {
  :deep(.uni-select__input-text) {
    color: rgb(29, 33, 41);
  }
  :deep(.uni-select--disabled) {
    background-color: #f7f8fa;
    border-width: 0;
    border-radius: 0;
  }
  :deep(.uni-select__input-placeholder) {
    color: rgb(29, 33, 41);
    font-size: 14px;
    opacity: 0.3;
  }
}

.ndo-select-disabled {
  cursor: not-allowed;

  :deep(.uni-select--disabled) {
    background-color: #f2f3f5;
    .uni-select__input-text {
      color: rgb(201, 205, 212);
    }
  }
}

.detail-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .inner-forms {
    :deep(.uni-forms-item__inner) {
      padding-bottom: 0;
    }

    :deep(.uni-forms-item__label) {
      display: none;
    }
  }

  .list {
    flex: 1;
    overflow: auto;
  }
}

.sb-item {
  display: flex;
  padding: 12px 12px;
  justify-content: space-between;

  text {
    flex: 1;
  }
}

.custom-input {
  :deep(.uniui-bottom) {
    border-left: 1px solid rgb(229, 230, 235);
    padding: 0 12px;
    color: rgb(153, 153, 153) !important;
    font-size: 14px;
  }
}
</style>

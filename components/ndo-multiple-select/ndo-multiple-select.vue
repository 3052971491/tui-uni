<template>
  <view
    :class="{
      'ndo-multiple-select': true,
      'ndo-multiple-select-disabled': disabled,
    }"
    @click="handleShowPopupClick"
  >
    <t-input
      ref="input"
      class="custom-input"
      :value="innerValueContent"
      :readOnly="true"
      :placeholder="placeholder || l('PleaseSelect')"
      suffix-icon="bottom"
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
                  :checked="innerValue.includes(formatFieldValue(formatFieldNames.id, item))"
                />
              </view>
            </van-cell-group>
          </view>
        </t-pull-refresh>
      </view>
    </view>
    <template #footer>
      <van-row :gutter="8" style="width: 100%">
        <van-col :span="8">
          <van-button block @click="handleClearClick">
            {{ l("Clear") }}
          </van-button>
        </van-col>
        <van-col :span="16">
          <van-button block type="primary" @click="handleSubmitClick">
            {{ l("Ok") }}
          </van-button>
        </van-col>
      </van-row>
    </template>
  </t-popup>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { AppComponentBase } from "@/shared/index";
import { CommonComboxServiceProxy } from "@/shared/index";
import { debounce, set, merge, cloneDeep } from "lodash";

export default defineComponent({
  name: "NdoMultipleSelect",
  mixins: [AppComponentBase],
  props: {
    value: {
      type: Array,
      default: [],
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
        selectId: "ndoIds",
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
      localdata2: [],
      innerValue: [],
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
    serverApiInstance() {
      return new CommonComboxServiceProxy(this.$apiUrl, this.$api);
    },
    innerValue2: {
      set(val: any[]) {
        this.$emit("update:value", val);
      },
      get() {
        return this.value as any[];
      },
    },
    innerValueContent() {
      return this.localdata2.filter((i) => {
        return this.innerValue2.includes(this.formatFieldValue(this.formatFieldNames.id, i))
      }).map(i => {
        return this.formatFieldValue(this.formatFieldNames.name, i)
      }).join(', ')
    },
    formatFieldNames() {
      return {
        ...this.defaultFieldNames,
        ...this.fieldNames,
      };
    },
  },
  watch: {
    innerValue2: {
      handler: debounce(function (val: any[]) {
        if (val.length > 0) {
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
            this.innerValue = cloneDeep(val);
            this.localdata = cloneDeep(result.items);
            this.localdata2 = cloneDeep(result.items);
          });
        }
      }, 500),
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
      if (this.innerValue.includes(str)) {
        const i = this.innerValue.findIndex(i => i === str);
        this.innerValue.splice(i, 1);
        this.localdata.splice(i, 1);
        return
      };
      this.innerValue.push(str);
      this.localdata.push(e);
    },
    handleShowPopupClick() {
      const instance = this.$refs.input;
      if (instance) {
        instance.focus();
      }
      if (this.disabled) return;
      setTimeout(() => {
        this.toggle();
        instance.blur();
      }, 50)
    },
    toggle() {
      this.localdata = [];
      this.innerValue = cloneDeep(this.innerValue2);
      this.filterEntity.filterValue = "";
      this.showPicker = !this.showPicker;
    },
    handleClearClick() {
      this.innerValue = [];
      this.innerValue2 = [];
      this.localdata = [];
      this.localdata2 = [];
      this.handleSubmitClick();
    },
    handleSubmitClick() {
      this.innerValue2 = cloneDeep(this.innerValue);
      this.localdata2 = cloneDeep(this.localdata);
      this.toggle();
      this.$emit("change", {
        value: this.innerValue2,
        selectRow: this.localdata2,
      });
    },
    load(res) {
      this.info = res;
    },
  },
});
</script>
<style lang="scss" scoped>
.ndo-multiple-select {
  :deep(.uni-select__input-text) {
    color: rgb(29, 33, 41);
  }
  :deep(.uni-easyinput__content) {
    color: rgb(29, 33, 41);
    background-color: #f7f8fa !important;

    .uni-input-input {
      text-overflow: ellipsis;
    }

    .uni-input-placeholder {
      color: rgb(29, 33, 41);
      font-size: 14px;
      opacity: 0.3;
      font-weight: initial;
    }
  }
}

.ndo-multiple-select-disabled {
  cursor: not-allowed;

  :deep(.uni-easyinput__content) {
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
    padding-right: 5px;
    color: rgb(153, 153, 153) !important;
    font-size: 14px !important;
  }
}
:deep(.uni-radio-input) {
  border-radius: initial;
}
</style>

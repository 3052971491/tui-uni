<template>
  <view class="t-search">
    <view
      class="t-search-body"
      :style="{
        backgroundColor,
        padding: padding ? '10px 12px' : '0px',
      }"
    >
      <uni-easyinput
        ref="easy"
        class="van-search__content"
        prefix-icon="search"
        v-model="innerValue"
        :placeholder="placeholder"
        :focus="focus"
        :disabled="disabled"
        autocomplete="off"
        :input-border="false"
        @icon-click="handleSearch"
        @input="handleInput"
        @change="handleEnterSearch"
        @keyup.enter="handleEnterSearch"
        @confirm="handleEnterSearch"
      ></uni-easyinput>
      <view class="van-search__action">
        <van-icon
          name="scan"
          size="24"
          color="#1989fa"
          @click="startScanCode"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { debounce } from "lodash";

export default defineComponent({
  name: "Search",
  props: {
    value: {
      type: [String, null, undefined],
      default: "",
    },
    backgroundColor: {
      type: String,
      default: "rgb(9, 96, 189)",
    },
    placeholder: {
      type: String,
      default: "请输入搜索关键词",
    },
    padding: {
      type: Boolean,
      default: true,
    },
    focus: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    /** 是否立即触发搜索 */
    immediate: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:value", "search"],
  computed: {
    innerValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("update:value", newValue);
      },
    },
  },
  methods: {
    handleInput(e) {
      this.innerValue = e;
      if (this.immediate) {
        this.handleSearch();
      }
    },
    throttledSearch: debounce(function () {
      this.$refs.easy.focused = false;
      this.$emit("search", this.innerValue);
    }, 500),
    handleSearch() {
      this.throttledSearch();
    },

    startScanCode() {
      // 允许从相机和相册扫码
      uni.scanCode({
        success: (res) => {
          this.innerValue = res.result.trim();
          this.handleSearch();
        },
      });
    },
    handleEnterSearch() {
      this.handleSearch();
    },
    focusing() {
      this.$nextTick(() => {
        this.$refs.easy.focused = true;
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.t-search {
  &-body {
    overflow: hidden;
    display: flex;
    align-items: center;
    background: var(--van-search-background-color);

    :deep(.van-search__action) {
      font-size: 24px;
      line-height: 36px !important;
      background-color: var(--van-search-content-background-color);
    }

    :deep(.van-search--show-action) {
      padding-right: var(--van-padding-sm);
      border-radius: var(--van-border-radius-sm);
    }

    :deep(.van-field__control) {
      line-height: var(--van-cell-line-height);
    }

    :deep(.uni-easyinput__content) {
      background: transparent;
      line-height: 36px !important;
      height: 36px;
      min-height: 36px;

      .uni-easyinput__content-input {
        line-height: 36px !important;
      }
    }

    :deep(.van-search__content) {
      padding-left: 0;
      border-radius: 0 !important;
    }
  }
}
</style>

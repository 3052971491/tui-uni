<template>
  <van-action-sheet
    class="t-action-sheet"
    v-model:show="innerValue"
    :title="title"
    :closeable="false"
  >
    <view class="t-action-sheet-layout">
      <view class="content-wrapper">
        <slot></slot>
      </view>
      <view class="footer-wrapper">
        <slot name="footer"></slot>
      </view>
    </view>
  </van-action-sheet>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ActionSheet",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "标题",
    },
  },
  emits: ["update:value"],
  computed: {
    innerValue: {
      get() {
        return this.value || false;
      },
      set(newValue) {
        this.$emit("update:value", newValue);
      },
    },
  },
});
</script>
<style lang="scss" scoped>
:deep(.van-action-sheet__header) {
  position: relative;
}
:deep(.van-action-sheet__close) {
  position: absolute !important;
  right: 0 !important;
}

.t-action-sheet {
  &-layout {
    display: flex;
    flex-direction: column;
    padding: 24rpx;

    .content-wrapper {
      flex: 1;
      overflow: auto;
      min-height: 160px;
      height: 160rpx;
    }

    .footer-wrapper {
    }
  }
}
</style>

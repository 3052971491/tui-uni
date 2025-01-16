<template>
  <view class="mt-tag">
    <van-tag type="primary" size="large" v-bind="options">
      <slot></slot>
    </van-tag>
  </view>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
export default defineComponent({
  name: "Tag",
  props: {
    type: {
      type: String as PropType<
        "primary" | "success" | "danger" | "warning" | "default"
      >,
      default: "primary",
    },
  },
  computed: {
    options() {
      let color = "#EDEFF2";
      let textColor = "#606266";

      if (this.type === "primary") {
        color = "#E7F5FF";
        textColor = "#0392FF";
      }

      if (this.type === "success") {
        color = "#ECFFEE";
        textColor = "#7CC384";
      }

      if (this.type === "danger") {
        color = "#FFEDED";
        textColor = "#FF6B6B";
      }

      if (this.type === "warning") {
        color = "#FFF9E3";
        textColor = "#FFD229";
      }

      return {
        color,
        textColor,
      };
    },
  },
});
</script>
<style scoped lang="scss">
.mt-tag {
  :deep(.van-tag--large) {
    padding: 12rpx;
  }
}
</style>

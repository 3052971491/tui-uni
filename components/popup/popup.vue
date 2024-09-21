<template>
  <page-meta :page-style="'overflow:' + (value ? 'hidden' : 'visible')" />
  <uni-popup ref="popups" :type="type" @mask-click="close">
    <view class="popups-container" :style="rootStyle">
      <view v-if="title" class="popups-container-title">
        <view class="title">
          <view class="icon-right"></view>
          <view class="title-text">{{ title }}</view>
          <uni-icons
            type="closeempty"
            color="#BFBFBF"
            size="14"
            class="icon-right"
            @click="close"
          ></uni-icons>
        </view>
      </view>
      <view class="popups-container-content">
        <view class="content-wrapper">
          <slot></slot>
        </view>
        <!-- 底部按钮 -->
        <view v-if="footer" class="footer-wrapper">
          <slot name="footer"></slot>
        </view>
      </view>
    </view>
  </uni-popup>
</template>
<script lang="ts">
import { defineComponent, nextTick } from "vue";
export default defineComponent({
  name: "Popup",
  props: {
    /** 是否显示 */
    value: {
      type: Boolean,
      default: false,
    },
    /** 标题 */
    title: {
      type: String,
      default: "",
    },
    /** 是否显示底部操作栏 */
    footer: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "bottom",
    },
    height: {
      type: String,
      default: "86vh",
    },
  },
  emits: [
    "update:value",
    "open",
    "close",
    "beforeOpen",
    "afterOpen",
    "beforeClose",
    "afterClose",
  ],
  watch: {
    value(val) {
      this.$emit("update:value", val);
      if (val) {
        this.$emit("beforeOpen");
        this.open();
      } else {
        this.$emit("beforeClose");
        this.close();
      }
    },
  },
  computed: {
    rootStyle() {
      return {
        borderRadius:
          this.type === "top" ? "0px 0px 18px 18px" : "18px 18px 0px 0px",
      };
    },
  },
  methods: {
    open() {
      this.$emit("update:value", true);
      this.$refs.popups.open();

      nextTick(() => {
        this.$emit("afterOpen");
      });
    },
    close() {
      this.$emit("update:value", false);
      this.$refs.popups.close();
      nextTick(() => {
        this.$emit("afterClose");
      });
    },
  },
});
</script>

<style scoped lang="scss">
.popups-container {
  display: flex;
  flex-direction: column;
  height: v-bind(height);
  background-color: #f7f8fa;
  overflow: hidden;

  .popups-container-title {
    display: flex;
    flex-direction: column;
    background-color: #fff;

    .title {
      display: flex;
      height: 46px;
      text-align: center;
      line-height: 46px;
      padding-top: 4px;
      font-weight: bold;

      .title-text {
        flex: 1;
      }

      .icon-right {
        width: 36px;
      }
    }
  }

  .popups-container-content {
    overflow: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    .footer-wrapper {
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
      box-shadow: 0px -2px 6px rgba(0, 0, 0, 0.08);
    }
    .content-wrapper {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>

<template>
  <view
    ref="root"
    class="t-dropdown-menu-item"
    :class="show ? 't-dropdown-menu-item-active' : ''"
    @click="toggle"
  >
    <view class="t-dropdown-menu-item-title">
      <view class="van-ellipsis">{{ title }}</view>
    </view>
  </view>
  <Popup v-model:value="isShowPopup" type="top" :footer="false" height="auto">
    <view class="popup-title">
      <view class="van-ellipsis">{{ title }}</view>
    </view>
    <slot></slot>
  </Popup>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import Popup from "../popup/popup.vue";
import { useRect } from "@vant/use";
export default defineComponent({
  name: "DropdownItem",
  components: { Popup },
  emits: ["open", "close"],
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: false,
      isShowPopup: false,
    };
  },
  methods: {
    toggle() {
      if (!this.isShowPopup) {
        this.$emit("open");
      } else {
        this.$emit("close");
      }
      this.isShowPopup = !this.isShowPopup;

      this.$nextTick(() => {
        const root = this.$refs.root;
        const rect = useRect(root);
        let top = 0;
        if (rect) {
          top = rect.top;
        }
        (root?.style ?? {})['top'] = top;
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.t-dropdown-menu-item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  min-width: 0;

  .t-dropdown-menu-item-title {
    position: relative;
    box-sizing: border-box;
    max-width: 100%;
    padding: var(--van-dropdown-menu-title-padding);
    color: var(--van-dropdown-menu-title-text-color);
    font-size: var(--van-dropdown-menu-title-font-size);
    line-height: var(--van-dropdown-menu-title-line-height);

    &::after {
      position: absolute;
      top: 50%;
      right: -4px;
      margin-top: -5px;
      border: 3px solid;
      border-color: transparent transparent var(--van-gray-4) var(--van-gray-4);
      transform: rotate(-45deg);
      opacity: 0.8;
      content: "";
    }
  }
}

.t-dropdown-menu-item-active {
  .t-dropdown-menu-item-title {
    border-color: transparent transparent currentColor currentColor;

    &::after {
      margin-top: -1px;
      transform: rotate(135deg);
    }
  }
}

:deep(.popups-container) {
  border-radius: 0;
  background-color: #fff;
}

.popup-title {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  min-width: 0;
  padding: 12px;
  color: var(--van-dropdown-menu-title-text-color);
  font-size: var(--van-dropdown-menu-title-font-size);
  line-height: var(--van-dropdown-menu-title-line-height);
  font-weight: bold;
}
</style>

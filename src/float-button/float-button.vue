<template>
  <view class="t-float-button" :style="innerStyle">
    <view class="t-float-button-body">
      <uni-icons :type="type"  :size="size" :color="color"></uni-icons>
    </view>
  </view>
</template>
<script setup lang="ts"></script>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'FloatButton',
  props: {
    // 图标大小
    size: {
      type: Number,
      default: 32,
    },
    // 图标图案
    type: {
      type: String,
      default: 'plusempty',
    },
    // 图标颜色
    color: {
      type: String,
      default: '#fff',
    },
    /**
     * 位置
     * @description 可选：LeftTop、LeftBottom、RightTop、RightBottom
     */
    location: {
      type: String,
      default: 'RightBottom'
    },
    /** 按钮背景色 */
    buttonColor: {
      type: String,
      default: '#0960bd',
    },
    /** 间隙距离 */
    gutter: {
      type: Array,
      default: ['12px', '30px']
    }
  },
  computed: {
    innerStyle() {
      const isLeft = this.location.includes('Left');
      const isTop = this.location.includes('Top');
      const sly = {}
      if (isLeft) {
        sly['left'] = this.gutter[0];
      } else {
        sly['right'] = this.gutter[0];
      } 
      if (isTop) {
        sly['top'] = this.gutter[1];
      } else {
        sly['bottom'] = this.gutter[1];
      }
      return sly;
    }
  }
});
</script>
<style lang="scss" scoped>
.t-float-button {
  position: fixed;
  right: 12px;
  bottom: 30px;
  

  .t-float-button-body {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: v-bind(buttonColor);
    color: #ffffff;
    box-shadow: 4px 4px 8px #0960BD; 
    transition: box-shadow 0.3s; 
    transition: background-color 0.2s;
    cursor: pointer;

    &:hover {
      background-color: #2e75c1;
    }
  }
}
</style>

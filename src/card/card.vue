<template>
  <view class="mt-card">
    <view v-if="title" class="mt-card-header" :style="innerHeaderStyle">
      <view class="title">
        <slot name="title">{{ title }}</slot>
      </view>
      <view class="action">
        <slot name="action">
          <t-tag v-if="tag" :type="type">{{ tagTitle }}</t-tag>
        </slot>
      </view>
    </view>
    <view class="mt-card-content">
      <template v-for="(item, index) in dataSource" key="index">
        <slot name="items" :items="item">
          <view class="items" :class="[ellipsis ? '' : 'no-ellipsis-items']">
            <view class="label">{{ item[fieldNames.label] }}</view>
            <view
              class="value"
              :style="{
                '-webkit-line-clamp': item[fieldNames.line] || 1,
              }"
              >{{ item[fieldNames.value] }}</view
            >
          </view>
        </slot>
      </template>
    </view>
  </view>
</template>
<script lang="ts">
import { CSSProperties, defineComponent, PropType } from "vue";
export default defineComponent({
  name: "Card",
  props: {
    /** 标题 */
    title: {
      type: String,
      default: "",
    },
    /**
     * 类型
     * @description 可用于：primary 未开始，success 已完成，danger 超期，warning 进行中，default 取消
     */
    type: {
      type: String as PropType<
        "primary" | "success" | "danger" | "warning" | "default"
      >,
      default: "primary",
    },
    dataSource: {
      type: Object as PropType<
        Array<{
          [key: string]: any;
        }>
      >,
      default: () => [],
    },
    fieldNames: {
      type: Object as PropType<{
        label: string;
        value: string;
        line: string;
      }>,
      default: {
        label: "label",
        value: "value",
        line: "line",
      },
    },
    /** 是否显示标签 */
    tag: {
      type: Boolean,
      default: true,
    },
    /** 标签名称 */
    tagTitle: {
      type: String,
      default: "已完成",
    },
    headerStyle: {
      type: Object as PropType<CSSProperties>,
      default: {},
    },
    /** 是否开启内容省略 */
    ellipsis: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    innerHeaderStyle() {
      let color = "#EFF0F0";

      if (this.type === "primary") {
        color = "#E6F4FF";
      }

      if (this.type === "success") {
        color = "#F2F9F3";
      }

      if (this.type === "danger") {
        color = "#FFF0F0";
      }

      if (this.type === "warning") {
        color = "#FFF9E3";
      }

      const background = `linear-gradient(to right, ${color} 0%, #ffffff 100%)`;

      return {
        background: this.headerStyle?.background ?? background,
        ...this.headerStyle,
      };
    },
  },
});
</script>
<style scoped lang="scss">
.mt-card {
  &-header {
    height: 24px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;

    .title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 12px;
    }

    .action {
      text-align: right;
    }
  }

  &-content {
    padding: 12px;

    .items {
      display: flex;
      margin-bottom: 8px;
      justify-content: space-between;

      &:last-child {
        margin-bottom: 0;
      }
      .label {
        color: #a2a5aa;
        margin-right: 6px;
        flex: 1;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break: break-all;
      }

      .value {
        text-align: right;
        flex: 2;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break: break-all;
      }
    }

    .no-ellipsis-items {
      .label {
        display: initial;
      }

      .value {
        display: initial;
        flex: 2;
      }
    }
  }
}
</style>

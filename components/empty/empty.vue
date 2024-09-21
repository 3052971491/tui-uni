<template>
  <view class="blank">
    <image
      src="/static/image/no-resource@2x.png"
      style="width: 194px; height: 178px"
      alt=""
      mode="aspectFit"
    />
    <view
      style="
        font-size: 14px;
        font-weight: 500;
        line-height: 26px;
        color: #666666;
        margin-bottom: 7px;
      "
    >
      <slot>{{ l('NoData') }}</slot>
    </view>
  </view>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { AppComponentBase } from "@/shared/index";
export default defineComponent({
  mixins: [AppComponentBase],
  name: 'Empty',
  props: {
    type: {},
    height: {
      type: String,
      default: "100%",
    },
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.blank {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  text-align: center;
  height: inherit;
  overflow: hidden;
}
</style>

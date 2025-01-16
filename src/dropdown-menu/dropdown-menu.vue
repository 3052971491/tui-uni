<template>
  <view class="t-dropdown-menu-container"> <slot></slot> </view>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";

export default defineComponent({
  name: "DropdownMenu",
  emits: [],
  props: {},
  data() {
    return {};
  },
  methods: {},
});
</script>
<style lang="scss" scoped>
.t-dropdown-menu-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  height: 46px;
}
</style>

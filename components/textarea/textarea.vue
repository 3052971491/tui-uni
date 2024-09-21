<template>
  <t-input
    v-model:value="innerValue"
    v-bind="$attrs"
    class="t-textarea"
    type="textarea"
    autoHeight
  >
    <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </t-input>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Textarea",
  props: {
    value: {
      type: [String, null, undefined],
      default: "",
    },
  },
  emits: ["update:value"],
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
});
</script>
<style lang="scss" scoped>
.t-textarea {
  :deep(.uni-easyinput__content-textarea) {
    min-height: 63px;
  }
}
</style>

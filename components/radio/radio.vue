<template>
  <uni-data-checkbox
    v-model="innerValue"
    v-bind="$attrs"
    class="t-radio"
    :localdata="formatOptions"
  >
    <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </uni-data-checkbox>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import {
  getFormatOptions,
  getRealValueByFormatOptions,
  getInnerValueByFormatOptions,
} from "../utils/use-component-options";
export default defineComponent({
  name: "Radio",
  props: {
    value: {
      type: [String, Number, Boolean, null, undefined],
      default: "",
    },
    options: {
      type: Object as PropType<any[]>,
      default: () => [],
    },
    fieldNames: {
      type: Object as PropType<{
        label: string;
        value: string;
      }>,
      default: {
        label: "text",
        value: "value",
      },
    },
  },
  emits: ["update:value"],
  computed: {
    innerValue: {
      get() {
        return getInnerValueByFormatOptions(this.value, this.formatOptions, this.fieldNames);
      },
      set(newValue) {
        this.$emit(
          "update:value",
          getRealValueByFormatOptions(
            newValue,
            this.formatOptions,
            this.fieldNames
          )
        );
      },
    },
    formatOptions() {
      return getFormatOptions(this.options, this.fieldNames);
    },
  },
});
</script>
<style lang="scss" scoped>
.t-radio {
  :deep(.checklist-group .checklist-box .radio__inner) {
    height: 14px;
    width: 14px;
    border-radius: 50%;
    line-height: 14px;
    border: 2px solid rgb(229, 230, 235);
    background-color: #fff;
    .radio__inner-icon {
      width: 4px;
      height: 4px;
      border-color: #fff !important;
      background-color: #fff !important;
    }
  }

  :deep(.is-checked .radio__inner) {
    background-color: #0960bd !important;
    border-color: #0960bd !important;
  }
}
</style>

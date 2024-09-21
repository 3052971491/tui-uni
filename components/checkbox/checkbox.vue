<template>
  <uni-data-checkbox
    v-model="innerValue"
    v-bind="$attrs"
    class="t-radio"
    multiple
    :localdata="formatOptions"
  >
    <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </uni-data-checkbox>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  getFormatOptions,
  getRealValueByFormatOptions,
  getInnerValueByFormatOptions,
} from "../utils/use-component-options";
export default defineComponent({
  name: "Checkbox",
  props: {
    value: {
      type: Object as PropType<
        Array<string | number | boolean | null | undefined>
      >,
      default: [],
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
        return getInnerValueByFormatOptions(
          this.value,
          this.formatOptions,
          this.fieldNames,
          true
        );
      },
      set(newValue) {
        this.$emit(
          "update:value",
          getRealValueByFormatOptions(
            newValue,
            this.formatOptions,
            this.fieldNames,
            true
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
  :deep(.checklist-group) {
    justify-content: flex-start;
  }
  :deep(.checkbox__inner) {
    border-width: 2px !important;
    background-color: #fff !important;
    border-color: rgb(229, 230, 235) !important;

    .checkbox__inner-icon {
      top: 0 !important;
      left: 4px !important;
    }
  }

  :deep(.checklist-text) {
    color: rgb(29, 33, 41) !important;
  }

  :deep(.is-checked .checkbox__inner) {
    background-color: #0960bd !important;
    border-color: #0960bd !important;
  }
}
</style>

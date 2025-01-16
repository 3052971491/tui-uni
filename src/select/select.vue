<template>
  <uni-data-select
    v-model="innerValue"
    v-bind="$attrs"
    class="t-select"
    :localdata="formatOptions"
  >
    <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </uni-data-select>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  getFormatOptions,
  getRealValueByFormatOptions,
  getInnerValueByFormatOptions,
} from "../utils/use-component-options";
export default defineComponent({
  name: "Select",
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
  emits: ["update:value", "change"],
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
        this.$emit(
          "change",
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
.t-select {
  :deep(.uni-select) {
    color: rgb(29, 33, 41);
    background-color: #f7f8fa;
    line-height: 36px !important;
    height: 36px;
    min-height: 36px;
    border: none;
    border-radius: initial;
    .uni-easyinput__content-input {
      line-height: 36px !important;
    }
  }

  :deep(.uni-select__input-placeholder) {
    color: rgb(201, 205, 212);
    font-size: 14px;
  }

  :deep(.uni-select--disabled) {
    background-color: #f2f3f5;
    .uni-select__input-text {
      color: rgb(201, 205, 212);
    }
  }

  :deep(.uni-select__selector) {
    top: calc(100% + 4px);
    border-radius: initial;
    border: 1px solid rgb(229,230,235);

    .uni-popper__arrow {
      display: none;
    }
  }
  :deep(.uni-icons) {
    font-size: 15px !important;
  }
}
</style>

<template>
  <uni-easyinput
    ref="easy"
    v-bind="$attrs"
    class="t-input"
    v-model="innerValue"
    autocomplete="off"
    :input-border="false"
  >
    <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </uni-easyinput>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Input",
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
        return this.value || "";
      },
      set(newValue) {
        this.$emit("update:value", newValue || "");
      },
    },
  },
  methods: {
    blur() {
      this.$nextTick(() => {
        this.$refs.easy.focused = false;
      });
    },
    focus() {
      this.$nextTick(() => {
        this.$refs.easy.focused = true;
      });
    },
  }
});
</script>
<style lang="scss" scoped>
.t-input {
  width: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: rgb(29, 33, 41);
  font-size: 14px;

  :deep(.uni-easyinput__content) {
    background-color: #f7f8fa;
    line-height: 36px !important;
    height: 36px;
    min-height: 36px;
    padding-left: 0;
    .uni-easyinput__content-input {
      line-height: 36px !important;
    }

    .uni-easyinput__placeholder-class {
      font-size: 14px;
    }
  }

  :deep(.is-disabled) {
    color: rgb(201, 205, 212);
    background-color: rgb(242, 243, 245) !important;

    .uni-easyinput__placeholder-class {
      color: rgb(201, 205, 212);

    }
  }
}
</style>

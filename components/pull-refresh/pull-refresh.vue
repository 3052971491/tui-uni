<template>
  <mescroll-uni
    ref="mescrollRef"
    @init="mescrollInit"
    @down="fetchDataGoToFirst"
    :fixed="false"
    :down="downOptions"
    :up="upOptions"
    @up="fetchData"

  >
    <slot></slot>
  </mescroll-uni>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AppComponentBase } from "@/shared/index";
import MescrollUni from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-uni.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default defineComponent({
  name: "PullRefresh",
  components: { MescrollUni },
  mixins: [AppComponentBase, MescrollMixin],
  emits: ["load"],
  props: {
    fetch: {
      type: Function,
    },
    /** 自定义字段 */
    fieldNames: {
      type: Object,
      default: {},
    },
    auto: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      defaultFieldNames: {
        totalCount: "totalCount",
        items: "items",
      },
      loading: false,
      upOptions: {
        auto: this.auto,
        textLoading: this.l('LoadingThreeDot'),
        empty: {
          use: true,
          icon: '/static/image/no-resource@2x.png'
        }
      },
      downOptions: {
        auto: this.auto,
        textInOffset: this.l('PullToRefresh'),
        textOutOffset: this.l('ReleaseUpdate'),
        textLoading: this.l('LoadingThreeDot'),
        textSuccess: this.l('LoadSuccessfully'),
        textErr: this.l('LoadError')
      },
      skipCount: 0,
      dataList: [],
    };
  },
  computed: {
    formatFieldNames() {
      return {
        ...this.defaultFieldNames,
        ...this.fieldNames,
      };
    },
  },
  methods: {
    fetchList() {
      this.loading = true;
      this.fetch()
        .then((result) => {
          const { ...other } = result;
          const items = result[this.formatFieldNames.items] || [];
          const totalCount = result[this.formatFieldNames.totalCount] || 0;
          if (this.mescroll) {
            this.mescroll.endBySize(items?.length, totalCount);
          }
          this.dataList = [...this.dataList, ...items];
          this.$emit("load", {
            ...other,
            totalCount: totalCount,
            items: this.dataList,
          });
        })
        .catch(() => {
          this.mescroll.endErr();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    fetchDataGoToFirst() {
      this.mescroll.scrollTo(0);
      this.skipCount = 0;
      this.dataList = [];
      if (this.mescroll) {
        this.mescroll.resetUpScroll();
      }
    },
    /** 上拉加载 */
    fetchData(mescroll) {
      this.skipCount = (mescroll.num - 1) * 20;
      this.fetchList();
    },
  },
});
</script>

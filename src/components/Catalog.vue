<template>
  <Search />
  <div class="catalog" ref="catalog-container">
    <div
      v-for="(column, index) in columnsCatalog"
      :key="index"
      class="catalog__column"
      :ref="column.refName"
    >
      <div class="catalog__item" v-for="item of getList" :key="item.id">
        <div v-if="columnsCatalog.length <= 1">
          <picture>
            <source :srcset="item.urls.regular" media="(min-width: 1250px)" />
            <source :srcset="item.urls.small" media="(min-width: 300px)" />
            <img :src="item.urls.raw" :alt="item.alt_description" />
          </picture>
        </div>
        <div
          v-else-if="
            item[column.orderKey] === column.orderColumn &&
            columnsCatalog.length > 1
          "
        >
          <picture>
            <source :srcset="item.urls.regular" media="(min-width: 1250px)" />
            <source :srcset="item.urls.small" media="(min-width: 300px)" />
            <img :src="item.urls.raw" :alt="item.alt_description" />
          </picture>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Search from "./Search.vue";
export default {
  name: "Catalog",
  components: { Search },
  data() {
    return {
      //'three_order','two_order'
      defaultColumnsCatalog: [
        {
          orderKey: "three_col_order",
          refName: "column_one",
          orderColumn: 1,
        },
        {
          orderKey: "three_col_order",
          refName: "column_two",
          orderColumn: 2,
        },
        {
          orderKey: "three_col_order",
          refName: "column_three",
          orderColumn: 3,
        },
      ],
      columnsCatalog: [],
    };
  },

  created() {
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResizeWindow);

    this.getCatalogItems();
  },
  mounted() {
    this.handleResizeWindow();
  },
  computed: {
    ...mapGetters(["getList", "getLoadingStatus"]),
  },
  methods: {
    ...mapActions(["getCatalogItems", "uploadNewElements"]),
    handleScroll() {
      const refsColumnHeight = [];
      Object.keys(this.$refs).forEach((key) => {
        if (
          key === "column_one" ||
          key === "column_two" ||
          key === "column_three"
        ) {
          this.$refs[key][0]
            ? refsColumnHeight.push(this.$refs[key][0].clientHeight)
            : false;
        }
      });

      const minColumnHeight = Math.min(...refsColumnHeight);
      if (
        window.scrollY + window.outerHeight >
          minColumnHeight - window.outerHeight &&
        !this.getLoadingStatus
      ) {
        this.uploadNewElements();
      }
    },
    handleResizeWindow() {
      if (window.outerWidth <= 820 && window.outerWidth > 400) {
        this.columnsCatalog = [
          {
            orderKey: "two_col_order",
            refName: "column_one",
            orderColumn: 1,
          },
          {
            orderKey: "two_col_order",
            refName: "column_two",
            orderColumn: 2,
          },
        ];
      } else if (window.outerWidth >= 820) {
        this.columnsCatalog = this.defaultColumnsCatalog;
      } else if (window.outerWidth <= 400) {
        this.columnsCatalog = [
          {
            orderKey: "two_col_order",
            refName: "column_one",
            orderColumn: 1,
          },
        ];
      }
    },
  },
  watch: {
    getList(newList, oldList) {
      setTimeout(() => {
        console.log(
          this.$refs["catalog-container"].clientHeight < window.outerWidth,
          this.$refs["catalog-container"].clientHeight,
          window.outerWidth
        );
        if (this.$refs["catalog-container"].clientHeight < window.outerHeight) {
          this.uploadNewElements();
        }
      }, 2000);
    },
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResizeWindow);
  },
};
</script>

<style scoped>
.catalog {
  /* column-count: 3;
  column-width: 150px; */
  grid-row: auto;
  column-gap: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.catalog__column {
  height: max-content;
}

.catalog__item > img {
  object-fit: cover;
  object-position: 50% 50%;
  grid-row: 1 / -1;
  grid-column: 1;
}

img {
  max-width: 100%;
  display: block;
  margin-bottom: 10px;
}
.catalog__item {
  width: 100%;
  height: max-content;
  margin: 0;
  display: grid;
  grid-template-rows: 1fr;
  break-inside: avoid-column;
}
@media (max-width: 820px) {
  .catalog {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 400px) {
  .catalog {
    grid-template-columns: 1fr;
  }
}
</style>

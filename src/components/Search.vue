<template>
  <div class="search">
    <form class="search__form search-form" @submit.prevent="searchImages">
      <input class="search-form__input" type="text" v-model="searchPhrase" />
      <button class="search-form__btn">Search</button>
      <svg
        v-show="searchPhrase.length >= 1"
        class="icon icon--cross"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 1"
        viewBox="0 0 64 64"
        @click="clearSearchPhrase"
      >
        <line
          x1="9.37"
          x2="54.63"
          y1="9.37"
          y2="54.63"
          fill="none"
          stroke="#010101"
          stroke-miterlimit="10"
          stroke-width="4"
        />
        <line
          x1="9.37"
          x2="54.63"
          y1="54.63"
          y2="9.37"
          fill="none"
          stroke="#010101"
          stroke-miterlimit="10"
          stroke-width="4"
        />
      </svg>
    </form>
    <div class="search__result">
      <span class="search__result__error" v-if="getError.length">
        {{ getError }}
      </span>
      <span v-else>
        {{ getNumberSearchResult }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
// test search phrases 'calculation', 'cars'
export default {
  data() {
    return {
      searchPhrase: "",
    };
  },
  computed: {
    ...mapGetters(["getNumberSearchResult", "getError"]),
  },
  methods: {
    ...mapActions(["search"]),
    ...mapMutations(["clearSearch"]),
    searchImages() {
      this.search(this.searchPhrase);
    },
    clearSearchPhrase() {
      this.searchPhrase = "";
    },
  },
  watch: {
    searchPhrase(newPhrase, oldPhrase) {
      if (newPhrase.length === 0) {
        this.clearSearch();
      }
    },
  },
};
</script>

<style>
.search {
  margin: 0px auto 20px;
  width: max-content;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.search-form {
  margin-bottom: 10px;
  position: relative;
}

.search-form__input {
  border: 1px solid #000;
  height: 1em;
  font-size: 18px;
  padding: 6px;
  border-radius: 5px;
  margin-right: 10px;
  width: clamp(200px, 50vw, 320px);
}

.search-form__input:focus {
  outline: none;
  box-shadow: 0px 0px 8px rgb(188, 188, 188);
}

.search-form__btn {
  cursor: pointer;
  background: transparent;
  border: 1px solid #000;
  border-radius: 5px;
  transition: all 0.3s;
  font-size: 18px;
  padding: 4px 10px;
}

.search-form__btn:hover {
  box-shadow: 0px 0px 8px rgb(188, 188, 188);
}

.search__result {
  height: 20px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.search__result__error {
  color: rgb(194, 38, 38);
}

.icon {
  width: 18px;
  height: 18px;
}
.icon--cross {
  position: absolute;
  right: 90px;
  top: 7px;
  cursor: pointer;
}
</style>

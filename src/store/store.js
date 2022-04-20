import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state: {
    client_id: "Z6jsQgNitwjO6iC0ui-xZgy7ZPWqZxrRv01p1QuG-Po",
    loading: false,
    page: 1,
    list: [],
    search: { searchPhrase: "", total_pages: 0, total: 0 },
    error: "",
  },
  getters: {
    getList(state) {
      let newList = state.list;
      let three_order = 1;
      let two_order = 1;
      newList = newList.map((item) => {
        const newItem = {
          ...item,
          three_col_order: three_order,
          two_col_order: two_order,
        };
        three_order >= 3 ? (three_order = 1) : three_order++;
        two_order >= 2 ? (two_order = 1) : two_order++;

        return newItem;
      });
      return newList;
    },
    getLoadingStatus(state) {
      return state.loading;
    },
    getNumberSearchResult(state) {
      if (state.search.total !== 0 && state.search.searchPhrase.length !== 0) {
        return `Found ${state.search.total} pictures`;
      } else if (
        state.search.total === 0 &&
        state.search.searchPhrase.length !== 0
      ) {
        return "Pictures not founded";
      } else if (state.search.searchPhrase.length === 0) {
        return "";
      }
    },
    getError(state) {
      return state.error;
    },
  },
  mutations: {
    setListData(state, payload) {
      state.list = payload;
      state.page = 1;
    },
    addListElements(state, payload) {
      state.list = [...state.list, ...payload];
      // state.list = [].concat(state.list, payload);
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setPage(state, payload) {
      state.page = payload;
    },
    setSearch(state, payload) {
      state.search = payload;
    },
    clearSearch(state) {
      if (state.search.searchPhrase.length !== 0) {
        state.search = { searchPhrase: "", total_pages: 0, total: 0 };
        store.dispatch("getCatalogItems");
      }
    },
    setError(state, payload) {
      state.error = payload;
    },
  },
  actions: {
    getCatalogItems({ commit, state }) {
      axios
        .get("https://api.unsplash.com/photos/", {
          params: { client_id: state.client_id },
        })
        .then((response) => {
          commit("setListData", response.data);
          commit("setError", "");
        })
        .catch((error) => {
          console.error(error);
          commit("setError", error.response.data);
        });
    },
    uploadNewElements({ commit, state }) {
      if (
        (!state.loading && state.page < state.search.total_pages) ||
        0 === state.search.total_pages
      ) {
        commit("setLoading", true);
        const requestParams = {
          page: ++state.page,
          client_id: state.client_id,
        };
        let path = "photos/";
        if (state.search.searchPhrase.length) {
          requestParams.query = state.search.searchPhrase;
          path = "search/photos/";
        }

        axios
          .get(`https://api.unsplash.com/${path}`, {
            params: requestParams,
          })
          .then((response) => {
            if (state.search.searchPhrase.length) {
              commit("addListElements", response.data.results);
            } else {
              commit("addListElements", response.data);
            }

            commit("setPage", state.page++);
            commit("setError", "");
          })
          .catch((error) => {
            console.error(error);
            commit("setError", error.response.data);
          })
          .finally(() => {
            setTimeout(() => {
              commit("setLoading", false);
            }, 500);
          });
      }
    },
    search({ commit, state }, payload) {
      if (payload.length !== 0) {
        axios
          .get("https://api.unsplash.com/search/photos/", {
            params: {
              client_id: state.client_id,
              query: payload,
            },
          })
          .then((response) => {
            commit("setSearch", {
              searchPhrase: payload,
              total_pages: response.data.total_pages,
              total: response.data.total,
            });
            commit("setListData", response.data.results);
            commit("setError", "");
          })
          .catch((error) => {
            console.error(Object.keys(error), "error");
            commit("setError", error.response.data);
          });
      }
    },
  },
});

export default store;

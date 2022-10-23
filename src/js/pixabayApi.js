import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '30596565-cd6a6f45b4b1cdbc6709ed3e2';
export class PixabayApi {
  #page = 1;
  #searchQuery = '';
  #totalPages = 0;
  #perPage = 40;

  #params = {
    params: {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  };
  async getPhotos() {
    const url = `?key=${API_KEY}&q=${this.#searchQuery}&per_page=${
      this.#perPage
    }&page=${this.#page}`;

    const { data } = await axios.get(url, this.#params);
    return data;
  }

  set searchQuery(newSearchQuery) {
    this.#searchQuery = newSearchQuery;
  }

  get searchQuery() {
    return this.#searchQuery;
  }

  incrementPage() {
    this.#page += 1;
  }

  calculateTotalPages(totalHits) {
    this.#totalPages = Math.ceil(totalHits / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }

  resetPage() {
    this.#page = 1;
  }
}
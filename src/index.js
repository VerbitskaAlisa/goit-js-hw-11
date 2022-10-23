import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayApi } from './js/pixabayApi';
import { refs } from './js/refs';
import { createMarkup } from './js/createMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayApi = new PixabayApi();

let lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: "alt",
  captionType: "attr",
  captionDelay: 250,
});


const handelSubmit = async event => {
    event.preventDefault();
  
    const {
      elements: { searchQuery },
    } = event.currentTarget;
  
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) {
      Notify.failure('Please, enter data to search!');
      return;
    }
    pixabayApi.searchQuery = query;
    clearPage();
  
    try {
      const { hits, totalHits } = await pixabayApi.getPhotos();
      const markup = createMarkup(hits);
      refs.list.insertAdjacentHTML('beforeend', markup);
  
      pixabayApi.calculateTotalPages(totalHits);
  
      if (pixabayApi.isShowLoadMore) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }
      if (totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.info(`We found ${totalHits} images.`);
      }
    } catch (error) {
      Notify.failure(error.message, 'Something went wrong try more');
  
      clearPage();
    }
  };
  
  const BtnloadMore = async () => {
    pixabayApi.incrementPage();
  
    if (!pixabayApi.isShowLoadMore) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info('Were sorry, but youve reached the end of search results.');
    }
  
    try {
      const { hits } = await pixabayApi.getPhotos();
      const markup = createMarkup(hits);
      refs.list.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
    } catch (error) {
      Notify.failure(error.message, 'something went wrong try more');
      clearPage();
    }
  };
  
  refs.form.addEventListener('submit', handelSubmit);
  refs.loadMoreBtn.addEventListener('click', BtnloadMore);
  
  function clearPage() {
    pixabayApi.resetPage();
    refs.list.innerHTML = '';
    refs.loadMoreBtn.classList.add('is-hidden');
  }
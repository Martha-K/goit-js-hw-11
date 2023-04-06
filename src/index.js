import Notiflix from 'notiflix';
import axios from 'axios';

const API_KEY = '35106389-b5a872e61a54744fed1e01881';
const BASE_URL = 'https://pixabay.com/api/';

const form = document.querySelector('#search-form');
const wrapper = document.querySelector('.gallery');
const addPics = document.querySelector('.load-more');
form.addEventListener('submit', imageSearch);
addPics.addEventListener('click', nextPage);

let page = 1;
let inputValue = '';
addPics.classList.add('hidden');

function nextPage(e) {
  page += 1;
  imageSearch(e);
}

async function imageSearch(e) {
  e.preventDefault();
  const value = form.elements.searchQuery.value.trim();
  if (inputValue !== value) {
    page = 1;
    wrapper.innerHTML = '';
  }

  inputValue = value;
  const data = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  const totalPics = data.data.totalHits;
  const result = data.data.hits;

  addPics.classList.remove('hidden');

  result.map(el =>
    wrapper.insertAdjacentHTML(
      'beforeend',
      cardCreate(
        el.webformatURL,
        el.tags,
        el.likes,
        el.views,
        el.comments,
        el.downloads
      )
    )
  );

  if (result.length === 0) {
    addPics.classList.add('hidden');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  if (totalPics === result.length) {
    addPics.classList.add('hidden');
  }
}

function cardCreate(src, alt, likes, views, comments, downloads) {
  return `<div class="photo-card">
  <img src=${src} alt=${alt} loading="lazy" class="image"/>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
}

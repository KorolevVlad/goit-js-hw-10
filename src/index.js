import './css/styles.css';
import API from './fetchCountries';
import countryInfoCard from './partials/country-card.hbs';
import countriesListCards from './partials/countries-cards.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = getRefs();

function getRefs() {
  return {
    searchcountryInfoCards: document.querySelector('#search-box'),
    countriesListCards: document.querySelector('.country-list'),
    countryInfoCard: document.querySelector('.country-info'),
  };
}

refs.searchcountryInfoCards.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function clearSearchResult() {
  refs.countriesListCards.innerHTML = '';
  refs.countryInfoCard.innerHTML = '';
}

function onInputSearch(e) {
  e.preventDefault();
  const searchQuery = e.target.value.trim();
  clearSearchResult();
  if (searchQuery === '') {
    return;
  }

  API.fetchCountries(searchQuery)
    .then(renderCountryCard)
    .catch(error => {
      console.log(error);
    });
}

function renderCountryCard(country) {
  if (country.status === 404) {
    return Notify.failure(`Oops, there is no country with that name`);
  } else if (country.length === 1) {
    country.map(({ name, flags, capital, population, languages }) => {
      refs.countriesListCards.innerHTML = '';
      refs.countryInfoCard.insertAdjacentHTML(
        'beforeend',
        countryInfoCard({ name, flags, capital, population, languages }),
      );
    });
  } else if (country.length <= 10) {
    country.map(({ name, flags, capital, population, languages }) => {
      refs.countryInfoCard.innerHTML = '';
      refs.countriesListCards.insertAdjacentHTML(
        'beforeend',
        countriesListCards({ name, flags, capital, population, languages }),
      );
    });
  } else if (country.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}


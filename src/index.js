import { fetchCountries } from './fetchCountires';
import { debounce } from 'debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import 'notiflix/dist/notiflix-3.2.5.min.css';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryNameField: document.querySelector('#search-box'),
  countryCardContainer: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
};

//------------------------------FUNCTIONS------------------------------

function createCountryCardMarkup(country) {
  const { name, capital, population, flags, languages } = country;

  return `
        <img class="country-flag" src="${flags.svg}" alt="${
    name.common
  } flag" height="20"/>
        <h1 class="country-name">${name.official}</h1>
        <p class="country-characteristics"><span>Capital: </span>${capital}</p>
        <p class="country-characteristics"><span>Population: </span>${population}</p>
        <p class="country-characteristics"><span>Languages: </span>${Object.values(
          languages
        ).join(', ')}</p>
    `;
}

function addCountryCardMarkup(markup) {
  refs.countryCardContainer.insertAdjacentHTML('afterbegin', markup);
}

function createCountryListItem({ name, flags }) {
  return `
        <li class="country-list-item">
            <img class="country-flag" src="${flags.svg}" alt="${name.common} flag" width="25"/>
            <span >${name.common}</span>
        </li>
    `;
}

function createCountryListMarkup(countries) {
  return countries.map(createCountryListItem).join('');
}

function addCountryListMarkup(markup) {
  refs.countryList.insertAdjacentHTML('afterbegin', markup);
}

function deleteMarkup(...nodes) {
  nodes.forEach(node => {
    node.innerHTML = '';
  });
}

//------------------------------EVENT LISTENERS------------------------------

refs.countryNameField.addEventListener(
  'input',
  debounce(onCoutryNameFieldInput, DEBOUNCE_DELAY)
);

//------------------------------EVENT HANDLERS------------------------------

function onCoutryNameFieldInput({ target }) {
  if (!target.value.trim()) {
    deleteMarkup(refs.countryList, refs.countryCardContainer);
    return;
  }

  deleteMarkup(refs.countryList, refs.countryCardContainer);

  fetchCountries(target.value.trim())
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (data.length === 1) {
        const countryCardMarkup = createCountryCardMarkup(data[0]);
        addCountryCardMarkup(countryCardMarkup);
      } else {
        const countryListMarkup = createCountryListMarkup(data);
        addCountryListMarkup(countryListMarkup);
      }
    })

    .catch(err => {
      Notify.failure(err.message);
    });
}

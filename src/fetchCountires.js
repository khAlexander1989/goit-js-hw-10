const QUERY_PARAMS = '?fields=name,capital,population,flags,languages';

export function fetchCountries(name) {
  const url = `https://restcountries.com/v3.1/name/${name}${QUERY_PARAMS}`;

  return fetch(url).then(response => {
    if (!response.ok)
      throw new Error('Oops, there is no country with that name');
    return response.json();
  });
}

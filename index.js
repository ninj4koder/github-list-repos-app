'use strict';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)  //returnes name of a property
    .map(key => `${(key)}=${(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.length; i++){ 
    let description = responseJson[i].description;

    if (description === null) {
      description = "No description provided";
    }

    $('#results-list').append(
        `<li><h3>${responseJson[i].name}</h3>
        <li><p>${description}</p>
        <li><a href="${responseJson[i].html_url}">${responseJson[i].html_url}</a>
        <li><p>*** --- next --- ***</p>`);
    }
    
  // display the results section  
  $('#results').removeClass('hidden');
};

function getHandle(searchURL) {
  const params = {
    type: 'owner', 
    sort: 'created'
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);  //<== difference between these two errors
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {  

  let searchUser = '';
  // const searchURL = `https://api.github.com/users/${searchUser}/repos`;   <== how to update that variable with a searchUser
  
  $('form').submit(event => {
    event.preventDefault();
    searchUser = $('#js-search-user').val();
    const searchURL = `https://api.github.com/users/${searchUser}/repos`;
    getHandle(searchURL);
  });

  
}

$(watchForm);
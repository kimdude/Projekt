"use strict";

const input = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResult = document.getElementById("result");
const recommend = document.getElementById("recommendations");

searchBtn.addEventListener('click', function(){
    watchModeURL(input.value, "ID");
});


function watchModeURL(input, searchType) {

    if(searchType === "ID") {
        let URL = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=zgcdlr7nR2CnNZviJfCLLh73nbOSJVtaEzIzWfKW&search_value=${input}`;

        watchModeAPI(URL)

    } else if(searchType === "Details") {
        let URL = `https://api.watchmode.com/v1/title/${input}/details/?apiKey=zgcdlr7nR2CnNZviJfCLLh73nbOSJVtaEzIzWfKW`;

        watchModeAPI(URL)

    } else {
        console.log("Något har gått fel.");

    }
}

async function watchModeAPI(URL) {

    try{
        const response = await fetch(URL);

        if(!response.ok) {
            throw new Error('Ett fel har uppstått. Felaktigt svar från servern.');
        }

        const data = await response.json();
        retrieveWMdata(data);

    } catch (error) {
        console.error('Fel har inträffat:', error.message);
    }
} 

async function retrieveWMdata(data) {
    
    const array = data.results;

    array.forEach( item => createArticle(item));

}

async function createArticle(item) {
    let article = document.createElement("article");
    recommend.appendChild(article);

    let image = document.createElement("img");
    image.setAttribute("src",item.image_url);
    image.setAttribute("class","preview");
    article.appendChild(image);

    let heading = document.createElement("h3");
    let title = document.createTextNode(item.name);
    article.appendChild(heading);
    heading.appendChild(title);

    let paragraph = document.createElement("p");
    let released = document.createTextNode(item.year);
    article.appendChild(paragraph);
    paragraph.appendChild(released);
}
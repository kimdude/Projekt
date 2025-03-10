"use strict";

const input = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResult = document.getElementById("result");
const recommend = document.getElementById("recommendations");

searchBtn.addEventListener('click', function(){

    if(input.value.length >= 1) {
        recommend.innerHTML = "";
        searchDataWM();
    } 
});


function watchModeURL(input, searchType) {

    if(searchType === "ID") {
        let URL = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=zgcdlr7nR2CnNZviJfCLLh73nbOSJVtaEzIzWfKW&search_value=${input}`;

        return URL;

    } else if(searchType === "Details") {
        let URL = `https://api.watchmode.com/v1/title/${input}/details/?apiKey=zgcdlr7nR2CnNZviJfCLLh73nbOSJVtaEzIzWfKW&language=sv`;

        return URL;

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
        return data;

    } catch (error) {
        console.error('Fel har inträffat:', error.message);
    }
} 

async function searchDataWM() {
    
    const URL = watchModeURL(input.value, "ID");
    const data = await watchModeAPI(URL);

    const array = data.results;

    let recommendHeading = document.createElement("h1");
    let heading = document.createTextNode("Söker du...");

    recommend.appendChild(recommendHeading);
    recommendHeading.appendChild(heading);

    searchResult.innerHTML = "";

    array.forEach(item => createArticle(item));

}

async function createArticle(item) {
    if(item.name != null && item.year != null) {
        let article = document.createElement("article");
        recommend.appendChild(article);
    
        let image = document.createElement("img");
        image.setAttribute("src",item.image_url);
        image.setAttribute("class","preview");
        article.appendChild(image);
        
        let infoSummary = document.createElement("div");
        let heading = document.createElement("h3");
        let title = document.createTextNode(item.name);
        article.appendChild(infoSummary);
        infoSummary.appendChild(heading);
        heading.appendChild(title);
    
        let paragraph = document.createElement("p");
        let released = document.createTextNode(item.year);
        infoSummary.appendChild(paragraph);
        paragraph.appendChild(released);

        article.addEventListener('click', async function() {
            let id = item.imdb_id

            const URL = watchModeURL(id, "Details");
            const data = await watchModeAPI(URL);
            
            resultDataWM(data)
            availabilityAPI(id);

            console.log(data)
        })
    }
}


async function resultDataWM(data) {

    recommend.innerHTML = "";
    searchResult.innerHTML = "";

    const metaDiv = document.createElement("div");
    metaDiv.setAttribute("id","metaInfo");
    searchResult.appendChild(metaDiv);

    const image = document.createElement("img");
    image.setAttribute("src",data.poster);
    image.setAttribute("id","poster");
    metaDiv.appendChild(image);

    const infoDiv = document.createElement("div");
    infoDiv.setAttribute("id","infoDiv");
    metaDiv.appendChild(infoDiv);

    const mainHeading = document.createElement("h1");
    const title = document.createTextNode(data.title);
    infoDiv.appendChild(mainHeading);
    mainHeading.appendChild(title);

    const descrPara = document.createElement("p");
    const type = document.createTextNode(data.type);
    infoDiv.appendChild(descrPara);
    descrPara.appendChild(type);

    if(data.year !== null) {
        const year = document.createTextNode(", " + data.year);
        descrPara.appendChild(year);
    }

    if(data.end_year !== null) {
        const endYear = document.createTextNode("-" + data.endYear);
        descrPara.appendChild(endYear)
    }

    const genreArr = data.genre_names;
    const genres = genreArr.toString();
    const genrePara = document.createElement("p");
    const genreNode = document.createTextNode(genres);
    infoDiv.appendChild(genrePara);
    genrePara.appendChild(genreNode);

    const lengthPara = document.createElement("p");
    const length = document.createTextNode(data.runtime_minutes + " min");
    infoDiv.appendChild(lengthPara);
    lengthPara.appendChild(length);

    const summaryPara = document.createElement("p");
    summaryPara.setAttribute("class","plot");
    const summary = document.createTextNode(data.plot_overview);
    searchResult.appendChild(summaryPara);
    summaryPara.appendChild(summary);

    similarTitles(data.similar_titles);
}


async function availabilityAPI(id) {

    try {
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'aff5add623msh11be409471c1a11p1a27e9jsn9554cc153346',
		        'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
            }
        }

        const response = await fetch(`https://streaming-availability.p.rapidapi.com/shows/${id}?series_granularity=episode`,options);

        if(!response.ok) {
            throw Error("Ett fel har uppträtt. Felaktigt svar från servern.");
        }

        const data = await response.json();
        streamOptions(data);

    } catch (error) {
        console.error('Fel har inträffat:', error.message);
    }
}


async function streamOptions(item) {

    const options = item.streamingOptions.se;
    const infoDiv = document.getElementById("infoDiv");

    const logosDiv = document.createElement("div");
    logosDiv.setAttribute("id","availability");
    infoDiv.appendChild(logosDiv);

    for(let i = 0; i < options.length; i++){

            const logoImg = document.createElement("img");
            logoImg.setAttribute("src", options[i].service.imageSet.darkThemeImage);
    
            const logoLink = document.createElement("a");
            logoLink.href = options[i].link;

            logoLink.appendChild(logoImg);
            logosDiv.appendChild(logoLink);

    }
}

async function similarTitles(titles) {
    
    titles.forEach()
}
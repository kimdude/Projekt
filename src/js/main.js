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
        let URL = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=gADai968P03EJhARLoZCnzLEYsPsAwvDH4lBaWzE&search_value=${input}`;

        return URL;

    } else if(searchType === "Details") {
        let URL = `https://api.watchmode.com/v1/title/${input}/details/?apiKey=gADai968P03EJhARLoZCnzLEYsPsAwvDH4lBaWzE&language=sv`;

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

    searchResult.innerHTML = "";
    
    const URL = watchModeURL(input.value, "ID");
    const data = await watchModeAPI(URL);

    const array = data.results;

    let recommendHeading = document.createElement("h1");
    let heading = document.createTextNode("Söker du...");
    recommend.appendChild(recommendHeading);
    recommendHeading.appendChild(heading);

    const rowDiv = document.createElement("div");
    rowDiv.setAttribute("class","resultDisplay");
    recommend.appendChild(rowDiv);
    
    array.forEach(item => createArticle(item));

}

async function createArticle(item) {
    if(item.name != null && item.year != null || item.title != null && item.year != null) {

        let article = document.createElement("article");

        let image = document.createElement("img");
        article.appendChild(image);
        image.setAttribute("class","preview");

        //
        if(item.poster) {
            image.setAttribute("src",item.poster);
        } else if(item.image_url) {
            image.setAttribute("src",item.image_url);
        }
        
        let infoSummary = document.createElement("div");
        let heading = document.createElement("h3");
        article.appendChild(infoSummary);
        infoSummary.appendChild(heading);

        //
        if(item.title && item.title === "") {
            let title = document.createTextNode(item.original_title);
            heading.appendChild(title);

        } else if(item.name){
            let title = document.createTextNode(item.name);
            heading.appendChild(title);

        } else {
            let title = document.createTextNode(item.title);
            heading.appendChild(title);
        }

    
        let paragraph = document.createElement("p");
        let released = document.createTextNode(item.year);
        infoSummary.appendChild(paragraph);
        paragraph.appendChild(released);

        const displayContainer = document.getElementsByClassName("resultDisplay");

        const container = Array.from(displayContainer);
        const containerReversed = container.reverse();
        const currentContainer = containerReversed.findIndex(div => div.tagName.toLowerCase() === "div");

        if(container[currentContainer].childElementCount >= 3) {
            const rowDiv = document.createElement("div");
            rowDiv.setAttribute("class","resultDisplay");
            recommend.appendChild(rowDiv);
            rowDiv.appendChild(article);

        } else {
            container[currentContainer].appendChild(article);
        }


        article.addEventListener('click', async function() {
            let id = item.imdb_id

            const URL = watchModeURL(id, "Details");
            const data = await watchModeAPI(URL);

            resultDataWM(data)
            availabilityAPI(id);

        })

    }
}


async function resultDataWM(data) {

    console.log(data)
    console.log(data.end_year)

    recommend.innerHTML = "";
    searchResult.innerHTML = "";

    const metaDiv = document.createElement("div");
    metaDiv.setAttribute("id","metaInfo");
    searchResult.appendChild(metaDiv);

    const image = document.createElement("img");
    image.setAttribute("src",data.posterMedium);
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

    if(data.year && data.year !== null) {
        const year = document.createTextNode(", " + data.year);
        descrPara.appendChild(year);
    }

    if(data.end_year && data.end_year !== null) {
        const endYear = document.createTextNode("-" + data.end_year);
        descrPara.appendChild(endYear);
    }

    const genreArr = data.genre_names;
    const genres = genreArr.toString();
    const genrePara = document.createElement("p");
    const genreNode = document.createTextNode(genres);
    infoDiv.appendChild(genrePara);
    genrePara.appendChild(genreNode);

    if(data.runtime_minutes && data.runtime_minutes !== null) {
        const lengthPara = document.createElement("p");
        const length = document.createTextNode(data.runtime_minutes + " min");
        infoDiv.appendChild(lengthPara);
        lengthPara.appendChild(length);
    }

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

    if(item.streamingOptions.se && item.streamingOptions.se !== null) {
        const options = item.streamingOptions.se;
        const infoDiv = document.getElementById("infoDiv");
    
        const logosDiv = document.createElement("div");
        logosDiv.setAttribute("id","availability");
        infoDiv.appendChild(logosDiv);
    
        const unqiueOptions = options.filter((o,index,arr) =>
            arr.findIndex(option => JSON.stringify(option.service.id) === JSON.stringify(o.service.id)) === index 
        );
    
    
        for(let i = 0; i < unqiueOptions.length; i++){
    
                const logoImg = document.createElement("img");
                logoImg.setAttribute("src", unqiueOptions[i].service.imageSet.darkThemeImage);
        
                const logoLink = document.createElement("a");
                logoLink.href = unqiueOptions[i].link;
    
                logoLink.appendChild(logoImg);
                logosDiv.appendChild(logoLink);
    
        }
    }
}

async function similarTitles(titles) {
    
    const heading = document.createElement("h2");
    const headingNode = document.createTextNode("Att titta på näst");
    heading.appendChild(headingNode);
    recommend.appendChild(heading);

    const links = titles.map(item => watchModeURL(item, 'Details'));
    const data  = []

    for(let i = 0; i < 9; i++) {
        let item = await watchModeAPI(links[i]);
        data.push(item);
    }

    const rowDiv = document.createElement("div");
    rowDiv.setAttribute("class","resultDisplay");
    recommend.appendChild(rowDiv);

    data.forEach(item => createArticle(item));

    if(links.length > 9) {
        const moreBtn = document.createElement("button");
        moreBtn.setAttribute("class","btn");
        const btnText = document.createTextNode("Se mer");
        recommend.appendChild(moreBtn);
        moreBtn.appendChild(btnText);

        moreBtn.addEventListener("click", function() {
            showMore(links,moreBtn);
        })
    }
}

async function showMore(links,thisButton) {

    const moreData = []

    for(let i = 9; i < links.length; i++) {
        let item = await watchModeAPI(links[i]);
        moreData.push(item);
    }
    
    thisButton.style.display="none";

    moreData.forEach(item => createArticle(item));

}
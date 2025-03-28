"use strict";

//Fetching elements from HTML-file
/**
 * Hämtar element från HTML-filen.
 * 
 * @var input - Refererar sökfält från HTML-filen.
 * @type {document} - Representerar webbplatsen.
 * @method getElementById - Hämtar elementet från webbplatsen via ID.
 * 
 */
const input = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResult = document.getElementById("result");
const recommend = document.getElementById("recommendations");


//Adding eventlistener
/**
 * Lägger till eventlyssnare på sök-knapp och triggar funktion.
 * 
 * @var searchBtn - Variabel som refererar till sök-knappen på webbplatsen.
 * @method addEventListener - Lyssnar efter händelse för att starta funktion.
 * @param {string} click - Specifierar att händelselyssnaren lyssnar efter klick.
 * @param function - Triggar lokal funktion vid klick.
 * 
 * @param {number} - Sökfrasen ska vara längre än 1.
 * @var recommend - Refererar till sektion i HTML-filen.
 * @property {collection} innerHTML - Tömmer sektionens inehåll.
 * 
 * @function searchDataWM 
 * 
 */
searchBtn.addEventListener('click', function(){
    if(input.value.length >= 1) {
        recommend.innerHTML = "";
        searchDataWM();
    } 
});


//Creates correct URL
/**
 * Skapar en länk med hjälp av sökfras och söktyp.
 * 
 * @param input - Sökfras i form av textsträng eller id-nummer för film/serie.
 * @param {string} searchType - Tar emot 'ID', som hittar alternativa sökrestultat, eller 'Details', som ger detalj om specifikt vald film eller serie.
 * @var URL - Länk skapad med hjälp av sökfrasen och typ av sökning.
 * 
 * @returns {string} - Returnerar länken.
 * 
 */
function watchModeURL(input, searchType) {

    if(searchType === "ID") {
        let URL = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=gn6j3eUh5iHlVHHXGLxTWKRkhbxCEBCFFhIvZU0V&search_value=${input}`;

        return URL;

    } else if(searchType === "Details") {
        let URL = `https://api.watchmode.com/v1/title/${input}/details/?apiKey=gn6j3eUh5iHlVHHXGLxTWKRkhbxCEBCFFhIvZU0V&language=sv`;

        return URL;

    } else {
        console.log("Något har gått fel. Ange searchType 'ID' eller 'Details'.");
    }
}


//Receives URL to fetch data from API.
/**
 * Tar emot länk och hämtar data från API med hjälp av try/catch samt async/await.
 * @async watchModeAPI
 * 
 * @param {string} URL - Länk till API.
 * @var response - Hämtar och refererar till datan från API:n.
 * @throws - Kör felmeddelande när felaktigt svar kommer vid anrop till API.
 * @var data - Konverterar JSON-datan till JavaScript.
 * @param {Object} error - Fångas upp när fel uppstår.
 * @property {string} message - Läser ut angivet felmeddelande.
 * 
 * @returns - Objekt med hämtad data.
 * 
 */
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


//Fetches data on button-click and sends each item to createArticle().
/**
 * Hämtar data från watchModeAPI() och skickar varje array till createArticle().
 * @async searchDataWM()
 * 
 * @var searchResult - Refererar till sektion i HTML-filen.
 * @property {collection} innerHTML - Tömmer sektionens inehåll.
 * @var URL - Hämtar och refererar till länk.
 * @param input - Refererar till sökfält från HTML-filen.
 * @property {string} value - Hämtar angiven sökfras från sökfältet.
 * @param ID - Anger att den söker efter ID till film eller serie.
 * 
 * @var data - Hämtar och refererar till data från API:n.
 * @var array - Refererar till nyckeln 'results' i data-objektet.
 * 
 * @var recommendHeading - Refererar till h1-elementet i HTML-filen.
 * @method createElement - Skapar h1-elementet i HTML-filen.
 * 
 * @var recommend - Refererar till sektion i HTML-filen.
 * @method appendChild - Lägger till elementet som childelement.
 * 
 * @var type - Array med typ av resultat.
 * @method map - Loopar igenom datan och skapar ny array.
 * @param item - Varje värde i arrayen.
 * @property {string} result_type - Typ av varje värde läggs in i arrayen.
 * 
 * @method every - Loopar igenom arrayen och kollar om ingen av värdena innehåller typen 'title'.
 * @var heading - Refererar till textnode.
 * @method createTextNode - Skapar ny textnode.
 * 
 * @var rowDiv - Refererar till div i HTML-filen.
 * @method createElement - Skapar nytt element i HTML-filen.
 * @method setAttribute - Lägger till attribut på elementet.
 * @param {string} class - Anger klass som typ av attribut.
 * @param {string} resultDisplay - Anger värdet av class, klassen resultDisplay.
 * 
 * @method forEach - Anropar funktion för varje värde i arrayen.
 * @async createArticle
 * 
 */
async function searchDataWM() {

    searchResult.innerHTML = "";
    
    const URL = watchModeURL(input.value, "ID");
    const data = await watchModeAPI(URL);

    const array = data.results;

    let recommendHeading = document.createElement("h1");
    recommend.appendChild(recommendHeading);

    let type = array.map(item => item.result_type);

    if(array.length === 0 || type.every(type => type !== "title")) {
        let heading = document.createTextNode("Tyvärr hittar vi inte din sökning. Kontrollera stavning.");
        recommendHeading.appendChild(heading);
    } else {
        let heading = document.createTextNode("Söker du...");
        recommendHeading.appendChild(heading);
    }

    const rowDiv = document.createElement("div");
    rowDiv.setAttribute("class","resultDisplay");
    recommend.appendChild(rowDiv);
    
    array.forEach(item => createArticle(item));

}

//Creates articles for movies and series
/**
 * Skapar en artikel i recommend-sektionen.
 * @async createArticle
 * @param {Object} item - Objekt med film/serie.
 * 
 * @var article - Refererar till article-element i HTML-filen.
 * @method createElement - Skapar elementet i HTML-filen.
 * @var image - Refererar till image-elementet i HTML-filen.
 * @method appendChild - Lägger till elementet som childelement.
 * 
 * @method setAttribute - Lägger till attribut på elementet.
 * @param {string} class - Sätter class-attribut på elementet.
 * @param {string} preview - Sätter preview som klass.
 * 
 * @property {string} poster - Länk till bild för filmen/serien.
 * @property {string} image_url - Länk till bild för filmen/serien.
 * @param {string} src - Sätter src-attribut på img-elementet för att länka till bilden.
 * 
 * @var infoSummary - Refererar till div-elementet i HTML-filen.
 * @var heading - Refererar till h3-elementet i HTML-filen.
 * 
 * @property {string} title - Titel till filmen eller serien.
 * @var title - Refererar till textsträng med titeln.
 * @property {string} name - Titel till filmen eller serien.
 * @method createTextNode - Skapar ny textnode.
 * @property {string} original_title - Titel på originalspråket till filmen eller serien.
 * 
 * @var paragraph - Refererar till p-elementet i HTML-filen.
 * @var released - Refererar till textnode med release-datum.
 * @param {number} year - Årtal som filmen eller serien släpptes.
 * 
 * @var displayContainer - Refererar till div-elementet i HTML-filen.
 * @method getElementsByClassName - Retunerar HTML-Collection av element med angivet class-name.
 * @param {string} resultDisplay - Specifierar klassnamnet för element som ska hämtas.
 * @var {Array} container - Refererar till array med HTML-element.
 * @method Array.from - Gör array av objekt.
 * @var containerReversed - Refererar till array med Div-element som vänts baklänges.
 * @method reverse - Vänder på original arrayen med Div-element och sätter sista värdet som första.
 * 
 * @var currentContainer - Refererar till sista värdet, div:en, i original arrayen.
 * @method childElementCount - Räknar antal artiklar i sista div:en.
 * @var rowDiv - Refererar till nytt Div-element i HTML-filen.
 * 
 * @method addEventListener - Skapar eventlyssnare som lyssna på article-element.
 * @param {string} click - Specifierar att eventet som lyssnas efter är klick.
 * @param function - Triggar lokal funktion.
 * @var id - Refererar till id-nummret av en film/serie.
 * @property {string} imdb_id - ID-nummer för en filme/serie.
 * @var url - Refererar till länk för vald film/serie.
 * @param {string} Details - Anger att detaljer om vald film/serie ska returneras. 
 * @var data - Refererar till data om filmen/serien.
 * 
 */
async function createArticle(item) {
    if(item.name != null && item.year != null || item.title != null && item.year != null) {

        let article = document.createElement("article");

        let image = document.createElement("img");
        article.appendChild(image);
        image.setAttribute("class","preview");

        if(item.poster) {
            image.setAttribute("src",item.poster);
        } else if(item.image_url) {
            image.setAttribute("src",item.image_url);
        }
        
        let infoSummary = document.createElement("div");
        let heading = document.createElement("h3");
        article.appendChild(infoSummary);
        infoSummary.appendChild(heading);

        if(item.title && item.title !== "") {
            let title = document.createTextNode(item.title);
            heading.appendChild(title);

        } else if(item.name){
            let title = document.createTextNode(item.name);
            heading.appendChild(title);

        } else {
            let title = document.createTextNode(item.original_title);
            heading.appendChild(title);
        }

    
        let paragraph = document.createElement("p");
        let released = document.createTextNode(item.year);
        infoSummary.appendChild(paragraph);
        paragraph.appendChild(released);

        const displayContainer = document.getElementsByClassName("resultDisplay");
        const container = Array.from(displayContainer);
        const containerReversed = container.reverse();

        if(containerReversed[0].childElementCount >= 3) {
            const rowDiv = document.createElement("div");
            rowDiv.setAttribute("class","resultDisplay");
            recommend.appendChild(rowDiv);
            rowDiv.appendChild(article);

        } else {
            containerReversed[0].appendChild(article);
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


//Display clicked movie/show
/**
 * Visar vald film/serie vid klick
 * @async resultDataWM
 * 
 * @param {Object} data - Objekt med information om vald film/serie.
 * @var recommend - Refererar till sektion i HTML-filen.
 * @property {collection} innerHTML - Tömmer sektionens inehåll.
 * @var searchResult - Refererar till sektion i HTML-filen.
 * 
 * @var metaDiv - Refererar till div-element i HTML-filen.
 * @method createElement - Skapar elementet i HTML-filen.
 * @method setAttribute - Lägger till attribut på elementet.
 * @param {string} id - Sätter id-attribut på elementet.
 * @param {string} metaInfo - Sätter metaInfo som id.
 * @method appendChild - Lägger till elementet som childelement.
 * 
 * @var image - Refererar till img-element i HTML-filen.
 * @property {string} posterMedium - Länk till bild för filmen/serien.
 * @param {string} poster - Sätter poster som id på elementet.
 * @var infoDiv - Refererar till img-elementet i HTML-filen.
 * @param {string} infoDiv - Sätter infoDiv som id på elementet.
 * @var mainHeading - Refererar till h1-elementet i HTML-filen.
 * 
 * @property {string} title - Titel på filmen/serien.
 * @method createTextNode - Skapar ny textnode.
 * @property {string} original_title - Titeln i filmens/seriens original språk.
 * 
 * @var descrPara - Refererar till p-elementet i HTML-filen.
 * @var type - Refererar till typerna film, serie eller tv-show.
 * @param {string} type - Returnerar typen av resultat - film, serie eller tv-show.
 * 
 * @property {number} year - Årtal som filmen/serien släpptes.
 * @var year - Refererar till årtal som filmen/serien släpptes.
 * @property {number} end_year - Årtal som serien avslutades.
 * @var endYear - Refererar till årtal som serien avslutades.
 * @var genreArr - Refererar till array med genrer.
 * @property {Array} genre_names - Array med namn på genrer som filmen/serien har.
 * @var genre - Refererar till textsträng med alla genrer.
 * @method toString - Omvandlar arrayen till en textsträng.
 * @var genrePara - Refererar till p-element i HTML-filen.
 * @var genreNode - Refererar till textnode med genrer.
 * 
 * @property {number} runtime_minutes - Längd av filmen/serien i minuter.
 * @var lengthPara - Refererar till p-element i HTML-filen.
 * @var length - Refererar till textnode med antal minuter.
 * 
 * @var summaryPara - Refererar till p-element i HTML-filen.
 * @param {string} plot - Sätter klassen 'plot' på HTML-elementet.
 * @var summary - Refererar till textnode med summering av filmen/serien.
 * @property {string} plot_overview - Summering av filmen/serien.
 * 
 * @function similarTitles - Listar liknande titlar.
 * @property {Array} similar_titles - ID-nummer på liknande titlar.
 * 
 */
async function resultDataWM(data) {

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
    infoDiv.appendChild(mainHeading);
    if(data.title !== "") {
        let title = document.createTextNode(data.title);
        mainHeading.appendChild(title);
    } else {
        let title = document.createTextNode(data.original_title);
        mainHeading.appendChild(title);
    }

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


//Fetches data about where movie is available to watch from Streaming Availability API
/**
 * Hämtar info om vart filmen/serien finns att streama.
 * @async availabilityAPI
 * @param {string} id - Tar emot imdb-ID.
 * 
 * @var response - Hämtar och refererar till datan från API:n.
 * @throws - Kör felmeddelande när felaktigt svar kommer vid anrop till API.
 * @var data - Konverterar JSON-datan till JavaScript.
 * @function streamingOptions - Listar streaming möjligheter.
 * 
 * @param {Object} error - Fångas upp när fel uppstår.
 * @property {string} message - Läser ut angivet felmeddelande.
 * 
 */
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


//Lists streaming options
/**
 * @async streamOptions
 * @param {Object} item -
 * 
 * @property {Object} streamingOptions - Detaljer om streaming alternativen.
 * @property {Array} se - Alla streaming alternativ i Sverige.
 * 
 * @var options - Refererar till array med streaming alternativ i Sverige.
 * @var infoDiv - Refererar till div-element från HTML-filen.
 * @method getElementsById - Retunerar element från HTML-filen.
 * 
 * @var logosDiv - Refererar till Div-element i HTML-filen.
 * @method createElement - Skapar elementet i HTML-filen.
 * @method setAttribute - Lägger till attribut på elementet.
 * @param id - Specifierar att id-attributet skapas.
 * @param availability - Sätter availability som attribut.
 * @method appendChild - Lägger till elementet som childelement.
 * 
 * @var {Array} unqiueOptions - Array med endast unika streaming alternativ.
 * @method filter - Filtrerar original array med streaming alternativ och skapar ny array.
 * @param o - Aktuellt värde som ska jämföras, i original arrayen.
 * @param index - Index på det aktuella värdet som jämförs.
 * @param arr - Array som värdet kommer från.
 * @method findIndex - Hittar index av värdet som uppfyller villkor.
 * @param option - Andra aktuella värde som ska jämföras o.
 * @property {Object} service - Detaljer om specifikt streaming alternativ.
 * 
 * @var i - Refererar till en siffra, en index i arrayen.
 * @property {number} length - Returnerar längden på arrayen.
 * @var logoImg - Refererar till ett img-element.
 * @param src - Sätter attributet src på elementet för att länka bilden.
 * @property {Object} imageSet - Uppsättning av logotyper.
 * @property {String} darkThemeImage - Länk til logotyp för dark-theme.
 * @var logoLink - Refererar till a-element.
 * @property {string} href - Sätter URL på a-elementet.
 * @property {string} link - Länk till streaming tjänsten.
 * 
 */
async function streamOptions(item) {

    if(item.streamingOptions.se && item.streamingOptions.se !== null) {
        const options = item.streamingOptions.se;
        const infoDiv = document.getElementById("infoDiv");
    
        const logosDiv = document.createElement("div");
        logosDiv.setAttribute("id","availability");
        infoDiv.appendChild(logosDiv);
    
        const unqiueOptions = options.filter((o,index,arr) =>
            arr.findIndex(option => option.service.id === o.service.id) === index 
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


//Prepares recommend-section for title-recommendations.
/**
 * Hämtar länkar till liknande titlar och förbereder recommend-sektionen.
 * @async similarTitles
 * @param {Array} titles - ID-nummer till liknande titlar.
 * 
 * @var heading - Refererar till h2-element i HTML-filen.
 * @method createElement - Skapar elementet i HTML-filen.
 * @var headingNode - Refererar till textnode med titel för recommend-sektionen.
 * @method createTextNode - Skapar ny textnode.
 * @method appendChild - Lägger till elementet som childelement.
 * @var recommend - Refererar till sektion i HTML-filen.
 * 
 * @var {Array} links - Array med länkar till titlarna.
 * @method map - Loopar igenom datan och skapar ny array.
 * @param item - Aktuellt värde från original arrayen.
 * @function watchModeURL - Skapar korrekt länk till titeln.
 * @param {string} Details - Specifierar att länk för detaljerad info om titeln returneras.
 * 
 * @var {Array} data - Array för data om varje titel.
 * @var i - Refererar till en siffra, en index i arrayen.
 * @var item - Data för aktuell titel.
 * @method push - Lägger in nya datan i arrayen.
 * 
 * @var rowDiv - Refererar till Div-element.
 * @method setAttribute - Lägger till attribut på elementet.
 * @param {string} class - Specifierar att class-attributet läggs till.
 * @param {string} resultDisplay - Specifierar resultDisplay som klassen.
 * 
 * @method forEach - Anropar funktion för varje värde i arrayen.
 * @property {number} length - Längd på arrayen.
 * @var moreBtn - Refererar till Button-element.
 * @param btn - Specifierar btn som class.
 * @var btnText - Refererar till textnode.
 * @method addEventListener - Lyssnar efter händelse för att starta funktion.
 * @param {string} click - Specifierar att händelselyssnaren lyssnar efter klick.
 * @param function - Triggar lokal funktion vid klick.
 * 
 * @function showMore - Listar övriga liknande titlar.
 * 
 */
async function similarTitles(titles) {
    
    const heading = document.createElement("h2");
    const headingNode = document.createTextNode("Att titta på näst...");
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


//Lists remaining similiar titles
/**
 * Listar övriga liknande titlar.
 * @async showMore
 * @param {Array} links - Array med länkar till liknande titlar.
 * @param {HTMLElement} thisButton - Refererar till Button-element i HTML-filen.
 * 
 * @var moreData - Array till data om titlar.
 * 
 * @var i - Refererar till en siffra, en index i arrayen.
 * @var item - Data för aktuell titel.
 * @method push - Lägger in nya datan i arrayen.
 * 
 * @property {Object} style - CSS-style på elementet.
 * @property {string} display - Sätter display-style på elementet.
 * 
 * @method forEach - Anropar funktion för varje värde i arrayen.
 * @function createArticle - Skapar artikel för aktuell titel.
 * 
 */
async function showMore(links,thisButton) {

    const moreData = []

    for(let i = 9; i < links.length; i++) {
        let item = await watchModeAPI(links[i]);
        moreData.push(item);
    }
    
    thisButton.style.display="none";

    moreData.forEach(item => createArticle(item));

}
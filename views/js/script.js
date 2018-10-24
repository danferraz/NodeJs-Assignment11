var cityData = document.getElementById('cityName');
var populationValue = document.getElementById('populationValue');
var resultData = document.getElementById('result');
var resultDiv = document.getElementById('resultDiv');

// get the lowest population of the city
async function GetTheLowestPopulation(){
    let result = await fetch('/lowestPopulaion', {
        method: 'POST',
    });
    //now wait for the text of the response
    let resp = await result.text();
    //parse the string into a json object
    let listData = JSON.parse(resp);
    resultData.innerHTML = `Lowest population is ${listData.Population} from ${listData.City}`;
    resultDiv.style.visibility = 'visible';

}

// get avg population of cities
async function GetAvgPopulation(){
    let result = await fetch('/averagePopulaion', {
        method: 'POST',
    });
    //now wait for the text of the response
    let resp = await result.text();
    //parse the string into a json object
    let avgPopulation = JSON.parse(resp);
    resultData.innerHTML = `Average population of the cities is ${avgPopulation}`;
    resultDiv.style.visibility = 'visible';
}

// get cities by name
async function SortByPopulationCity(){
    let result = await fetch('/sortByPopulationCity', {
        method: 'POST',
    });
    //now wait for the text of the response
    let resp = await result.text();
    window.location.reload();

}

// get cities by name
async function SortByCity(){
    let result = await fetch('/sortByCity', {
        method: 'POST',
    });
    //now wait for the text of the response
    let resp = await result.text();
    window.location.reload();
}
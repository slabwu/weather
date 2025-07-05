async function fetchData(city) {
    try {
        let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=AZCAT733R2JW9VH8FKUAD45L4&contentType=json`
        let response = await fetch(url, {mode: 'cors'})
        let data = await response.json()
        console.log(data)
    } catch (err) {
        console.log(new Error('Unable to fetch data'));
    }
}

fetchData('New York')
const form = document.querySelector('form')
const $ = (id) => document.getElementById(id)

async function fetchData(city) {
    try {
        let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=AZCAT733R2JW9VH8FKUAD45L4&contentType=json`
        let response = await fetch(url, {mode: 'cors'})
        let data = await response.json()
        return processData(data)

    } catch (err) {
        throw new Error('Unable to fetch data')
    }
}

function processData(data) {
    let processed = {
        address: data.address
    }

    let today = ['datetime', 'temp', 'conditions', 'feelslike', 'humidity', 'precipprob', 'uvindex', 'visibility']
    today.forEach(value => processed[value] = data.currentConditions[value])

    
    let week = ['datetime', 'conditions', 'tempmax', 'tempmin']
    processed.forecast = {}
    for (i = 0; i < 5; i++) {
        processed.forecast[i] = {}
        week.forEach(value => processed.forecast[i][value] = data.days[i][value])
    }

    return processed
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let search = document.querySelector('#search').value
    if (search) fetchData(search).then(
        data => {
            $('error').innerText = ''
            console.log(data)
        },
        error => {
            $('error').innerText = 'City not found'
        }
    )
});
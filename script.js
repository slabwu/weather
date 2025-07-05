const form = document.querySelector('form')
const $ = (id) => document.getElementById(id)

async function fetchData(city) {
    try {
        let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=AZCAT733R2JW9VH8FKUAD45L4&contentType=json`
        let response = await fetch(url, {mode: 'cors'})
        let data = await response.json()
        return processData(data)
    } catch (err) {
        $('error').innerText = 'City not found'
        throw new Error('Unable to fetch data')
    }
}

function processData(data) {
    let processed = {
        address: data.address
    }

    let today = ['datetime', 'temp', 'conditions', 'feelslike', 'humidity', 'precipprob', 'uvindex', 'visibility', 'icon']
    today.forEach(value => processed[value] = data.currentConditions[value])

    
    let week = ['datetime', 'conditions', 'tempmax', 'tempmin', 'icon']
    processed.forecast = {}
    for (i = 0; i < 5; i++) {
        processed.forecast[i] = {}
        week.forEach(value => processed.forecast[i][value] = data.days[i][value])
    }

    return processed
}

function renderData(data) {
    $('error').innerText = ''
    console.log(data)

    $('city').innerText = data.address
    $('weather').innerText = data.conditions
    $('temperature').innerText = data.temp

    let details = ['feelslike', 'humidity', 'precipprob', 'uvindex', 'visibility']
    details.forEach(detail =>
        $(detail).innerText = `${detail}: ${data[detail]}`
    )

    for (i = 0; i < 5; i++) {
        let day = `D+${i}`
        addElement(day, 'div', 'forecast')

        let dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        addElement(`datetime${i}`, 'div', day, dayOfWeek[new Date(data.forecast[i].datetime).getDay()])

        let dayDetails = ['conditions', 'tempmin', 'tempmax']
        dayDetails.forEach(detail => addElement(`${detail}${i}`, 'div', day, data.forecast[i][detail]))
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let search = document.querySelector('#search').value
    if (search) fetchData(search).then(renderData)
})

function addElement(name, tag, target, text = '') {
    const element = document.createElement(`${tag}`);
    element.id = name;
    element.innerHTML = text;
    document.getElementById(`${target}`).appendChild(element);
}
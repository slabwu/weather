const form = document.querySelector('form')
const $ = (id) => document.getElementById(id)
let unit = 'metric'
let currentCity = 'New York'

async function fetchData(city, unit = 'metric') {
    try {
        let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=AZCAT733R2JW9VH8FKUAD45L4&contentType=json`
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
        address: data.resolvedAddress
    }

    let today = ['datetime', 'temp', 'conditions', 'feelslike', 'humidity', 'precipprob', 'uvindex', 'windspeed', 'icon']
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
    $('forecast').innerText = ''
    console.log(data)

    $('city').innerText = data.address
    $('weather').innerText = data.conditions
    $('temperature').innerText = `${data.temp}°`
    $('icon').src = `./assets/${data.icon}.svg`

    let details = [
        {name: 'feelslike', text: 'Feels Like', unit: '°', icon: 'thermometer'},
        {name: 'humidity', text: 'Humidity', unit: '%', icon: 'humidity'},
        {name: 'precipprob', text: 'Chance of Rain', unit: '%', icon: 'umbrella'},
        {name: 'uvindex', text: 'UV Index', unit: '', icon: 'star'},
        {name: 'windspeed', text: 'Wind Speed', unit: 'km/h', icon: 'wind'}
    ]

    details.forEach(detail => {
        $(detail.name).innerHTML = ''
        addIcon(detail.icon, detail.name)
        let content = ''
        content += `<div>${detail.text}</div>`
        if (unit === 'us' && detail.name === 'windspeed') {
            content += `<div>${data[detail.name]}mph</div>`
        } else {
            content += `<div>${data[detail.name]}${detail.unit}</div>`
        }
        $(detail.name).innerHTML += content
    })

    let dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    for (i = 0; i < 5; i++) {
        let content = ''

        content += `<div>${dayOfWeek[new Date(data.forecast[i].datetime).getDay()]}</div>`
        content += `<img src='./assets/${data.forecast[i].icon}.svg'>`
        content += `<div>${data.forecast[i]['conditions']}</div>`
        content += `<div class='temperature'><div>${data.forecast[i]['tempmin']}°</div><div>${data.forecast[i]['tempmax']}°</div></div>`

        let day = `D+${i}`
        addElement(day, 'div', 'forecast', content)
    }

    $('display').style.display = 'grid'
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    currentCity = document.querySelector('#search').value
    searchCity()
})

$('unit').addEventListener('click', (e) => {
    unit = (unit === 'metric') ? 'us' : 'metric'
    searchCity()
})

function searchCity() {
    let search = currentCity
    if (search) fetchData(search, unit).then(renderData)
    if (!search && $('city').innerText == 'New York') fetchData('New York', unit).then(renderData)
}

function addElement(name, tag, target, content = '') {
    const element = document.createElement(`${tag}`)
    element.id = name
    element.innerHTML = content
    document.getElementById(`${target}`).appendChild(element)
}

function addIcon(name, target) {
    const icon = document.createElement('img')
    icon.src = `./assets/${name}.svg`
    document.getElementById(`${target}`).appendChild(icon)
}

fetchData('New York').then(renderData)
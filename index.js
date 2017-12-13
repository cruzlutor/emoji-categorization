const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

const url = 'https://unicode.org/emoji/charts/emoji-ordering.html'

const gain = [
  'Smilies & People',
  'Nature & Animals',
  'Objects',
  'Travel & Places',
  'Symbols'
]

const unicode = [
  'Smileys & People',
  'Animals & Nature',
  'Food & Drink',
  'Travel & Places',
  'Activities',
  'Objects',
  'Symbols'
]

// mapping relation unicode > gain
const mapping = [0, 1, 2, 3, 2, 2, 4]

const emojis = {}

let currentCategory

function onRead(error, response, body) {

  if (!error) {
    let $ = cheerio.load(body)
    $('tr').each((index, element) => {

      // get category
      let isCategory = $('.bighead a', element)

      // ignore the category if doesnt exists
      if (mapping[currentCategory || 0] === undefined) return

      // create category
      if (isCategory.length === 1) {
        currentCategory = (currentCategory === undefined) ? 0 : currentCategory + 1
        if (mapping[currentCategory] != undefined && !emojis[gain[mapping[currentCategory]]]) emojis[gain[mapping[currentCategory]]] = []
        return
      }

      // add emoji
      $('img', element).each((index, element) => {
        emojis[gain[mapping[currentCategory]]].push($(element).attr('alt'))
      })
    })

    // saje in json
    const json = JSON.stringify(emojis)
    fs.writeFile('emojis.json', json, 'utf8', () => console.log('Success') );

  } else {
    console.log('We’ve encountered an error: ' + error)
  }
}

request(url, onRead)
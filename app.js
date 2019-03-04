const url = require('url');
const rp = require('request-promise');
const cheerio = require('cheerio');

function search(word) {
    const searchWord = word.split(' ').map(w => encodeURIComponent(w)).join('+');
    rp.get(`https://google.es/search?q=${searchWord}+wiki`).then(resp => {
        const $ = cheerio.load(resp);
        const urlWiki = decodeURI(decodeURI(($('#search .g .r a')
            .filter((i, element) => url.parse($(element).attr('href').replace('/url?q=', '')).hostname === 'es.wikipedia.org')
            .first() || {attr:(s) => ''}).attr('href').replace('/url?q=', '').split('&')[0]));
        rp.get(urlWiki).then(resp => {
            const $ = cheerio.load(resp);
            console.log(`${word}\n${$('#mw-content-text p').first().text()}`);
        });
    });
}

console.log('searching...');
process.argv.slice(2).forEach(word => search(word));
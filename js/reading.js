// Max Cohn
// Reading
const WIKI_LINK_HEAD = 'https://en.wikipedia.org/wiki/';
const readingLink = localStorage.getItem('readingLink');
// use origin * to avoid errors for some reason
const apiGetSections = `https://en.wikipedia.org/w/api.php?action=parse&prop=sections&format=json&origin=*&page=${readingLink}`;
const apiGetIntro = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&origin=*&exintro=&explaintext=&titles=${readingLink}`;

let readingParagraph = 'If you are seeing this something has gone wrong';
let readingDelay = 100;

$(document).ready(function() {
    console.log(WIKI_LINK_HEAD + readingLink);
    $('#title').text(readingLink.replaceAll('_', ' '));
    $.getJSON(apiGetIntro, function(data) {
        for (const page in data.query.pages)
            readingParagraph = (data.query.pages[page].extract);
    });
    // add sections to list below reading area
    $.getJSON(apiGetSections, function(data) {
        // use origin * to avoid errors for some reason
        data.parse.sections.forEach(section => {
            if (section.level === '2')
                $('#sections').append(`<li>${section.line.substring(section.line.indexOf('^'))}</li>`);
        });
    })
    $('#read').on('click', ReadParagraph);
});

async function ReadParagraph() {
    console.log(readingParagraph);
    const words = readingParagraph.split(' ');
    for (let word = 0; word < words.length; word++) {
        if (words[word] === '\n' || words[word] === '')
            continue;
        $('#read').text(words[word]);
        await sleep(readingDelay);
    }
    await sleep(readingDelay);
    $('#read').text('Read Again');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

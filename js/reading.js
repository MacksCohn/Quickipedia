// Max Cohn
// Reading
const WIKI_LINK_HEAD = 'https://en.wikipedia.org/wiki/';
const readingLink = localStorage.getItem('readingLink');
// use origin * to avoid errors for some reason
const apiGetSections = `https://en.wikipedia.org/w/api.php?action=parse&prop=sections&format=json&origin=*&page=${readingLink}`;
const apiGetIntro = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&origin=*&exintro=&explaintext=&titles=${readingLink}`;
const apiGetSectionText = `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${readingLink}&prop=wikitext&origin=*&disabletoc=1&section=`

let readingParagraph = 'If you are seeing this something has gone wrong';
let readingDelay = 120;

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
            if (section.level === '2') {
                const subtitle = section.line.substring(section.line.indexOf('^'));
                const element = $(`<li>${subtitle}</li>`);
                element.on('click', function() {ChangeSelectedParagraph(section.index, subtitle)});
                $('#sections').append(element);
            }
        });
    })
    $('#read').on('click', ReadParagraph);
});

function ChangeSelectedParagraph(index, subtitle) {
    $('#read').prop('disabled', true);
    $.getJSON(apiGetSectionText + index.toString(), function(data) {
        readingParagraph = parseWikitextToPlainText(data.parse.wikitext['*']);
        $('#category.subcategory').text(subtitle);
    });
    $('#read').prop('disabled', false);
}

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

function parseWikitextToPlainText(wikitext) {
    if (!wikitext)
        return "";
    let text = String(wikitext);
    text = text.replace(/<ref>[\s\S]*?<\/ref>/g, '');
    text = text.replace(/<ref[\s\S]*?\/>/g, '');
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/\{\{[^}]+\}\}/g, '');
    text = text.replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, '$1');
    text = text.replace(/\[\[([^\]]+)\]\]/g, '$1');
    text = text.replace(/\[\s*https?:\/\/[^ \]]+ ([^\]]+)\]/g, '$1');
    text = text.replace(/\[\s*https?:\/\/[^ \]]+\]/g, '');
    text = text.replace(/https?:\/\/[^\s]+/g, '');
    text = text.replace(/'''/g, ''); // Bold
    text = text.replace(/''/g, '');  // Italic
    text = text.replace(/[\=\*\#\:\;\|\-\{\}\[\]]/g, '');
    text = text.replace(/(\r\n|\n){3,}/g, '\n\n');
    text = text.replace(/^[ \t]+/gm, '');
    text = text.replace(/[ \t]+/g, ' ');

    return text.trim();
}

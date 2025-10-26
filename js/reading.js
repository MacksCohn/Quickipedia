// Max Cohn
// Reading
const WIKI_LINK_HEAD = 'https://en.wikipedia.org/wiki/';
const readingLink = localStorage.getItem('readingLink');
// use origin * to avoid errors for some reason
const apiGetSections = `https://en.wikipedia.org/w/api.php?action=parse&prop=sections&format=json&origin=*&page=${readingLink}`;
const apiGetIntro = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&origin=*&exintro=&explaintext=&titles=${readingLink}`;
const apiGetSectionText = `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${readingLink}&prop=wikitext&origin=*&disabletoc=1&section=`

let readingParagraph = 'If you are seeing this something has gone wrong';
let descriptionParagraph = '';
let readingDelay = 120;

$(document).ready(function() {
    $('#search-button').on('click', function() {ToggleSearchBar()});

    console.log(WIKI_LINK_HEAD + readingLink);
    $('#title').text(readingLink.replaceAll('_', ' '));
    $.getJSON(apiGetIntro, function(data) {
        for (const page in data.query.pages)
            readingParagraph = (data.query.pages[page].extract);
            descriptionParagraph = readingParagraph;
    });

    const titleName = 'Summary';
    const titleListElement = $(`<li>${titleName}</li>`);
    titleListElement.on('click', function() { 
        readingParagraph = descriptionParagraph;
        ChangeSectionName(titleName);
    });
    $('#sections').append(titleListElement);
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

function ChangeSectionName(name) {
    $('#category.subcategory').text(name);
    $('#category.subcategory').animate({
        fontSize: '100%',
    }, 100, 'swing');
    $('#category.subcategory').animate({
        fontSize: '80%',
    }, 100, 'swing');
}

function ChangeSelectedParagraph(index, subtitle) {
    ChangeSectionName(subtitle);

    $('#read').prop('disabled', true);
    $('#read a').text('Loading...');
    $.getJSON(apiGetSectionText + index.toString(), function(data) {
        readingParagraph = parseWikitextToPlainText(data.parse.wikitext['*']);
    });
    $('#read').prop('disabled', false);
    $('#read a').text('Read');
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

function ToggleSearchBar() {
    console.log('toggling');
    if ($('#search-box').is('[hidden]') === true) {
        $('#search-box').removeAttr('hidden');
        $('#search-button').addClass('active');
    }
    else {
        $('#search-box').attr('hidden', true);
        $('#search-button').removeClass('active');
    }
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

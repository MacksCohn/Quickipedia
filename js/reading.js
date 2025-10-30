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
        UpdateWordCounter(readingParagraph)
    });

    const titleName = 'Summary';
    const titleListElement = $(`<li>${titleName}</li>`);
    titleListElement.on('click', function() { 
        readingParagraph = descriptionParagraph;
        ChangeSectionName(titleName);
        UpdateWordCounter(readingParagraph)
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
    BounceTextAnimation('#category.subcategory', '100%', '80%');
}

function ChangeSelectedParagraph(index, subtitle) {
    $('#read').prop('disabled', true);
    $('#read a').text('Loading...');
    $.getJSON(apiGetSectionText + index.toString(), function(data) {
        ChangeSectionName(subtitle);
        readingParagraph = parseWikitextToPlainText(data.parse.wikitext['*']);
        UpdateWordCounter(readingParagraph)
        $('#read').prop('disabled', false);
        $('#read a').text('Read');
    });
    console.log($('#read a').text());
}

async function ReadParagraph() {
    console.log(readingParagraph);
    const words = readingParagraph.split(' ');
    for (let word = 0; word < words.length; word++) {
        if (words[word] === '\n' || words[word] === '')
            continue;
        $('#read a').text(words[word]);
        $('#current-word').text((word +1).toString());
        await sleep(readingDelay);
    }
    await sleep(readingDelay);
    $('#read a').text('Read Again');
}

function ToggleSearchBar() {
    console.log('toggling');
    if ($('#search-box').is('[hidden]') === true) {
        $('#search-box').removeAttr('hidden');
        $('#search-button').addClass('active');
        $('#search-box').animate({
            top: '-30px',
        }, 1, 'swing');
        $('#search-box').animate({
            top: '-3px',
        }, 150, 'swing');
        $('#search-box input').focus();
    }
    else {
        $('#search-box').animate({
            top: '-3px',
        }, 1, 'swing');
        $('#search-box').animate({
            top: '-30px',
        }, 150, 'swing', function() {
            $('#search-button').removeClass('active');
            $('#search-box').attr('hidden', true);
        });
    }
}

function UpdateWordCounter(paragraph) {
    $('#current-word').text('0');
    paragraph = paragraph.split(' ');
    paragraph = paragraph.filter(item => item !== '');
    paragraph = paragraph.filter(item => item !== '\n');
    $('#word-count').text(paragraph.length.toString());
    BounceTextAnimation('#word-count', '120%', '100%');
}

function BounceTextAnimation(object, big, small) {
    $(object).animate({
      fontSize: big,
    }, 150, 'swing');
    $(object).animate({
        fontSize: small,
    }, 150, 'swing');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function parseWikitextToPlainText(wikiText) {
    let text = wikiText;
    text = text.replace(/\n?={2,}.*?={2,}\n?/g, '\n');
    text = text.replace(/<ref[^>]*>.*?<\/ref>/gs, '');
    text = text.replace(/<ref[^>]*\/>/g, '');
    text = text.replace(/\[\[[^|\]]*?\|(.*?)\]\]/g, '$1');
    text = text.replace(/\[\[(.*?)\]\]/g, '$1');
    text = text.replace(/{{.*?}}/g, '');
    text = text.replace(/{{.*?}}/g, '');
    text = text.replace(/&vert;/g, '');
    text = text.replace(/'{2,}/g, '');
    text = text.replace(/\n\s*\n/g, '\n\n');
    text = text.split('\n').map(line => line.trim()).join('\n');
    text = text.trim();

    return text;
}

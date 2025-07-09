// Max Cohn
// Reading
const WIKI_LINK_HEAD = 'https://en.wikipedia.org/wiki/';
const readingLink = localStorage.getItem('readingLink');
// use origin * to avoid errors for some reason
const apiGetSections = `https://en.wikipedia.org/w/api.php?action=parse&prop=sections&format=json&origin=*&page=${readingLink}`;
const apiGetIntro = `https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&origin=*&section=0&page=${readingLink}`;
$(document).ready(function() {
    console.log(WIKI_LINK_HEAD + readingLink);
    $('#title').text(readingLink.replaceAll('_', ' '));
    $.getJSON(apiGetIntro, function(data) {
        const text = data.parse.text['*'];
        const $tempElement = $('<div>').html(text);
        console.log($tempElement.text());
    });
    $.getJSON(apiGetSections, function(data) {
        // use origin * to avoid errors for some reason
        data.parse.sections.forEach(section => {
            if (section.level === '2')
                $('#sections').append(`<li>${section.line}</li>`);
        });
    })
});

// Max Cohn
// Reading
const readingLink = localStorage.getItem('readingLink');
// use origin * to avoid errors for some reason
const apiLinkHead = `https://en.wikipedia.org/w/api.php?action=parse&prop=sections&format=json&origin=*&page=${readingLink}`;
$(document).ready(function() {
    console.log(readingLink);
    $.getJSON(apiLinkHead, function(data) {
        console.log(data);
    })
});

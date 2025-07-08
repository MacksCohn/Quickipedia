// Max Cohn
$(document).ready(function() {
    $('input').on('input', HandleSearch);
});

function HandleSearch() {
    const searchInput = $('input').val();
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchInput}&format=json&origin=*`;
    const list = $('#search-list');
    const visible = $('#visible-list');
    list.empty();
    visible.empty();
    $.getJSON(apiUrl, function(data) {
        if (data.length > 0) {
            data[1].forEach(searchTerm => {
                // const term = $('<option value="' + searchTerm + '">');
                // list.append(term);
                visible.append('<li>'+searchTerm+'</li>')
            });
        }
        else
            console.log('no data');
    });
}

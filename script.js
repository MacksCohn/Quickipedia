// Max Cohn
let selected = -1;

$(document).ready(function() {
    $('input').on('input', HandleSearch);
    $('input').on('keyup', HandleKeys);
});

function HandleKeys(event) {
    if (event.code === 'ArrowUp')
        OnKeyUp();
    else if (event.code === 'ArrowDown')
        OnKeyDown();
}

function OnKeyUp() {
    const $listElements = $('#visible-list li');
    if (selected != -1)
        $($listElements[selected]).removeClass('selected');
    if (selected === -1) {
        selected = 0;
    } else if (selected > 0) {
        selected--;
    }
    $('input').val($($listElements[selected]).text());
    $($listElements[selected]).addClass('selected');
}

function OnKeyDown() {
    const $listElements = $('#visible-list li');
    if (selected != -1)
        $($listElements[selected]).removeClass('selected');
    if (selected === -1) {
        selected = 0;
    } else if (selected < $listElements.length) {
        selected++;
    }
    $('input').val($($listElements[selected]).text());
    $($listElements[selected]).addClass('selected');
}

function HandleSearch() {
    const searchInput = $('input').val();
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchInput}&format=json&origin=*`;
    const list = $('#search-list');
    const visible = $('#visible-list');
    list.empty();
    visible.empty();
    selected = -1;
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

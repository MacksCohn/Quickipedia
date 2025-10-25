// Max Cohn
let selected = -1;
const MAX_LIST = 10;

$(document).ready(function() {
    $('#search').on('input', HandleSearch);
    $('input').on('keyup', HandleKeys);
});

function HandleKeys(event) {
    if (event.code === 'ArrowUp')
        OnKeyUp();
    else if (event.code === 'ArrowDown')
        OnKeyDown();
    else if (event.code === 'Backspace')
        ClearSelectedSearchElement();
    else if (event.code === 'Enter')
        SubmitSearch();
}

function SubmitSearch() {
    let pageName = $('#search').val();
    const topListValue = $('#visible-list li:first').text();
    if (topListValue.toLowerCase() === pageName.toLowerCase())
        pageName = $('#visible-list li:first').text().replaceAll(' ', '_');
    pageName = pageName.replaceAll(' ', '_');
    localStorage.setItem('readingLink', pageName);
    globalThis.location.href = './reading.html';
}

function ClearSelectedSearchElement() {
    $('#visible-list').children().each(function() {
        $(this).removeClass('selected');
    });
    selected = -1;
}

function OnKeyUp() {
    const $listElements = $('#visible-list li');
    if (selected != -1)
        $($listElements[selected]).removeClass('selected');
    if (selected === -1)
        SetSelected(0);
    else if (selected > 0)
        selected--;
    $('search').val($($listElements[selected]).text());
    $($listElements[selected]).addClass('selected');
}

function OnKeyDown() {
    const $listElements = $('#visible-list li');
    if (selected != -1)
        $($listElements[selected]).removeClass('selected');
    if (selected === -1)
        SetSelected(0);
    else if (selected < $listElements.length)
        selected++;

    $('#search').val($($listElements[selected]).text());
    $($listElements[selected]).addClass('selected');
}

function ClickSearchElement() {
    if (selected != -1)
        $($('#visible-list').children()[selected]).removeClass('selected');
    $(this).addClass('selected');
    $('#search').val($(this).text());
    selected = $(this).index();
    SubmitSearch();
}

function HandleSearch() {
    const searchInput = $('#search').val();
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchInput}&format=json&origin=*`;
    const $visible = $('#visible-list');
    while ($visible.children().length < MAX_LIST) {
        const $li = $('<li></li>');
        $li.on('click', ClickSearchElement);
        $visible.append($li);
    }
    $.getJSON(apiUrl, function(data) {
        if (data[1]) { 
            for (let i = 0; i < ((data[1].length < MAX_LIST) ? data[1].length : MAX_LIST); i++) {
                $($visible.children()[i]).text(data[1][i]);
                $($visible.children()[i]).on('click', ClickSearchElement);
            }
        }
        else {
            $($visible.children()).each(function() {
                $(this).text('');
            });
            selected = -1;
        }
    });
}

function SetSelected(index) {
    selected = index;
}

// Max Cohn
let selected = -1;
const MAX_LIST = 10;

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

function ClickSearchElement() {
    console.log($(this).text());
    if (selected != -1)
        $($('#visible-list').children()[selected]).removeClass('selected');
    $(this).addClass('selected');
    $('input').val($(this).text());
    selected = $(this).index();
}

function HandleSearch() {
    const searchInput = $('input').val();
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchInput}&format=json&origin=*`;
    const $visible = $('#visible-list');
    while ($visible.children().length < MAX_LIST) {
        $li = $('<li></li>');
        $li.on('click', ClickSearchElement);
        $visible.append($li);
    }
    selected = -1;
    $.getJSON(apiUrl, function(data) {
        if (data[1]) { 
            for (let i = 0; i < ((data[1].length < MAX_LIST) ? data[1].length : MAX_LIST); i++) {
                $($visible.children()[i]).text(data[1][i]);
                $li.on('click', ClickSearchElement);
            }
        } else {
            $($visible.children()).each(function() {
                $(this).text('');
            });
        }
    });
}

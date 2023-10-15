// GAME DATA
let clientID,
    socket,
    isMobile = false,
    gameOver = false,
    endGameMessageRecipients = [],
    sendingBugReport = false,
    firstLoad = true,
    reloaded = false;

const newActivitySoundEffect = new Audio('andy_and_leyley_switch_sound.mp3');

// CHAT VALUES
let lastChatter = '',
    currentChatColor = '';

// HTML ELEMENTS
// (for caching)
let bodyElement,
    submitButtonElement,
    swapButtonElement,
    passButtonElement,
    shuffleButtonElement,
    resetButtonElement,
    dockElement,
    scrabbleBoardElement,
    playerNameElements = [],
    playerScoreElements = [],
    inviteURLElement,
    currentPlayerElement,
    sidebarElement,
    sidebarContentsElement,
    sidebarToggleButtonElement,
    sidebarChatButtonElement,
    sidebarHelpButtonElement,
    sidebarBugButtonElement,
    sidebarHomeButtonElement,
    sidebarInfoElement,
    helpContainerElement,
    bugContainerElement,
    chatContainerElement,
    chatContentsElement,
    chatInputElement,
    tooltipElement,
    bugFormElement,
    bugMessageElement,
    bugSubmitElement,
    wildcardOverlayElement,
    wildcardFormElement,
    wildcardInputElement,
    wildcardPromptElement,
    roomCodeElement,
    copySymbolElement,
    chatFormElement;

// GAME PLAYER TURN DATA
let turnActive = false,
    currentPoints = 0,
    potentialPoints = 0,
    currentDockTiles = [],
    playableTileObjects = [],
    tilesToSwap = '',
    currentWordsAndPointsData = [],
    wordsToSubmit = [],
    pointsToEarn = 0,
    temporaryBoardState;

// WILDCARD VARIABLES
let wildcardCallback,
    wildcardCallback_playable_tile,
    wildcardCallback_playable_tile_destination;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// CSS CLASSES
const PLAYED_TILE_CLASS = 'played_tile',
    SWAP_TILE_CLASS = 'swap_tile',
    SWAP_TILE_IMAGE_URL = 'url(../images/swap.svg)';

// BOARD LAYOUT DATA
const TILE_WIDTH_MAGIC_NUMBER = 0.023958333333333,
    TILE_WIDTH_MAGIC_NUMBER_MOBILE = 0.111650485436893,
    BOARD_DIMENSION_MAGIC_NUMBER = 15.65217,
    BOARD_DIMENSION = 15;
let TILE_DIMENSION = 46,
    shortenTileValues = false;

const TW = 'TW', DW = 'DW', TL = 'TL', DL = 'DL', xx = '.';
const BASE_COLOR = 'rgb(252, 234, 218)';
const DEFAULT_VALUE_BOARD_TEXT = { TW: 'Triple Word', DW: 'Double Word', TL: 'Triple Letter', DL: 'Double Letter' };
const DEFAULT_BOARD_VALUES = [TW, DW, TL, DL, xx];

const TILE_POINT_VALUES = {
    'A': 1, 'E': 1, 'I': 1, 'O': 1, 'U': 1, 'L': 1, 'N': 1, 'S': 1, 'T': 1, 'R': 1,
    'D': 2, 'G': 2,
    'B': 3, 'C': 3, 'M': 3, 'P': 3,
    'F': 4, 'H': 4, 'V': 4, 'W': 4, 'Y': 4,
    'K': 5,
    'J': 8, 'X': 8,
    'Q': 10, 'Z': 10,

    'a': 1, 'e': 1, 'i': 1, 'o': 1, 'u': 1, 'l': 1, 'n': 1, 's': 1, 't': 1, 'r': 1,
    'd': 2, 'g': 2,
    'b': 3, 'c': 3, 'm': 3, 'p': 3,
    'f': 4, 'h': 4, 'v': 4, 'w': 4, 'y': 4,
    'k': 5,
    'j': 8, 'x': 8,
    'q': 10, 'z': 10,

    '*': 0
};

const COLOR_BOARD = [
    ['tomato', '', '', 'lightblue', '', '', '', 'tomato', '', '', '', 'lightblue', '', '', 'tomato'],
    ['', 'pink', '', '', '', 'steelblue', '', '', '', 'steelblue', '', '', '', 'pink', ''],
    ['', '', 'pink', '', '', '', 'lightblue', '', 'lightblue', '', '', '', 'pink', '', ''],
    ['lightblue', '', '', 'pink', '', '', '', 'lightblue', '', '', '', 'pink', '', '', 'lightblue'],
    ['', '', '', '', 'pink', '', '', '', '', '', 'pink', '', '', '', ''],
    ['', 'steelblue', '', '', '', 'steelblue', '', '', '', 'steelblue', '', '', '', 'steelblue', ''],
    ['', '', 'lightblue', '', '', '', 'lightblue', '', 'lightblue', '', '', '', 'lightblue', '', ''],
    ['tomato', '', '', 'lightblue', '', '', '', 'pink', '', '', '', 'lightblue', '', '', 'tomato'],
    ['', '', 'lightblue', '', '', '', 'lightblue', '', 'lightblue', '', '', '', 'lightblue', '', ''],
    ['', 'steelblue', '', '', '', 'steelblue', '', '', '', 'steelblue', '', '', '', 'steelblue', ''],
    ['', '', '', '', 'pink', '', '', '', '', '', 'pink', '', '', '', ''],
    ['lightblue', '', '', 'pink', '', '', '', 'lightblue', '', '', '', 'pink', '', '', 'lightblue'],
    ['', '', 'pink', '', '', '', 'lightblue', '', 'lightblue', '', '', '', 'pink', '', ''],
    ['', 'pink', '', '', '', 'steelblue', '', '', '', 'steelblue', '', '', '', 'pink', ''],
    ['tomato', '', '', 'lightblue', '', '', '', 'tomato', '', '', '', 'lightblue', '', '', 'tomato']
];

let currentBoardState = [
    [TW, xx, xx, DL, xx, xx, xx, TW, xx, xx, xx, DL, xx, xx, TW],
    [xx, DW, xx, xx, xx, TL, xx, xx, xx, TL, xx, xx, xx, DW, xx],
    [xx, xx, DW, xx, xx, xx, DL, xx, DL, xx, xx, xx, DW, xx, xx],
    [DL, xx, xx, DW, xx, xx, xx, DL, xx, xx, xx, DW, xx, xx, DL],
    [xx, xx, xx, xx, DW, xx, xx, xx, xx, xx, DW, xx, xx, xx, xx],
    [xx, TL, xx, xx, xx, TL, xx, xx, xx, TL, xx, xx, xx, TL, xx],
    [xx, xx, DL, xx, xx, xx, DL, xx, DL, xx, xx, xx, DL, xx, xx],
    [TW, xx, xx, DL, xx, xx, xx, DW, xx, xx, xx, DL, xx, xx, TW],
    [xx, xx, DL, xx, xx, xx, DL, xx, DL, xx, xx, xx, DL, xx, xx],
    [xx, TL, xx, xx, xx, TL, xx, xx, xx, TL, xx, xx, xx, TL, xx],
    [xx, xx, xx, xx, DW, xx, xx, xx, xx, xx, DW, xx, xx, xx, xx],
    [DL, xx, xx, DW, xx, xx, xx, DL, xx, xx, xx, DW, xx, xx, DL],
    [xx, xx, DW, xx, xx, xx, DL, xx, DL, xx, xx, xx, DW, xx, xx],
    [xx, DW, xx, xx, xx, TL, xx, xx, xx, TL, xx, xx, xx, DW, xx],
    [TW, xx, xx, DL, xx, xx, xx, TW, xx, xx, xx, DL, xx, xx, TW]
];

const iterateBoard = (callback) => {
    for (let x = 0; x < BOARD_DIMENSION; x++) {
        for (let y = 0; y < BOARD_DIMENSION; y++) {
            callback(x, y);
        }
    }
};

function debugBoard(board, showDefaultValues) {
    const debuggedBoard = board.map(row =>
        row.map(tile =>
            showDefaultValues ? `${tile} ` : (isBlank(tile) ? '. ' : `${tile} `)
        ).join('')
    ).join('\n');
    console.log(debuggedBoard);
}

function updateUIElements() {
    // update the data that's used in subsequent methods
    currentWordsAndPointsData = getAffectedWordsAndPoints();

    checkSubmitButtonStatus();
    updatePotentialPoints();
    checkSwapButtonStatus();
    enableElement(passButtonElement, turnActive);
}

function wildcardPrompt(callback) {
    wildcardPromptElement.css('display', 'flex');
    wildcardOverlayElement.show();
    wildcardInputElement.focus();

    wildcardCallback = callback;
}

function submitWildcardPrompt() {
    closeWildcardPrompt(wildcardInputElement.val().toUpperCase());
}

function closeWildcardPrompt(response) {
    wildcardPromptElement.hide();
    wildcardOverlayElement.hide();

    wildcardInputElement.val('');

    if (typeof response === 'string' && response.length === 1 && alphabet.includes(response)) {
        wildcardCallback(wildcardCallback_playable_tile, wildcardCallback_playable_tile_destination, true, response);
    }
    else {
        wildcardCallback(wildcardCallback_playable_tile, $(`#${wildcardCallback_playable_tile.data('board_position')}`));
    }
    updateUIElements();
}

function getTileLetter(tile) {
    return tile.text().includes('*') ? '*' : tile.text()[0];
}

async function playTile(playable_tile, playable_tile_destination, isWildcardResponse = false, wildcardValue) {
    playable_tile.css({
        left: playable_tile_destination.offset().left,
        top: playable_tile_destination.offset().top
    });

    const dest_id = playable_tile_destination.attr('id');
    const from_board = playable_tile.data('board_position').match(/tile(\d+)x(\d+)/);
    const from_dock = playable_tile.data('board_position').match(/dock(\d+)/);
    const to_board = dest_id.match(/tile(\d+)x(\d+)/);
    const to_dock = dest_id.match(/dock(\d+)/);
    let playable_tile_old_space;

    if (from_board) { // playable_tile came from board
        const from_x = parseInt(from_board[1]);
        const from_y = parseInt(from_board[2]);

        playable_tile_old_space = $(`#tile${from_x}x${from_y}`);
        const tile_to_swap = playableTileObjects.find((tile) => tile && tile.data('board_position') === dest_id);

        if (tile_to_swap) {
            if (getTileLetter(tile_to_swap) === '*') {
                playTile(playable_tile, playable_tile_old_space);
                return;
            }
            tile_to_swap
                .addClass(PLAYED_TILE_CLASS)
                .css({
                    left: playable_tile_old_space.offset().left,
                    top: playable_tile_old_space.offset().top
                })
                .data({
                    'played': true,
                    'board_position': playable_tile_old_space.attr('id')
                });
        }

        temporaryBoardState[from_x][from_y] = tile_to_swap ? getTileLetter(tile_to_swap) : currentBoardState[from_x][from_y];
    }
    else if (from_dock) { // playable_tile came from dock
        const from_x = parseInt(from_dock[1]);

        playable_tile_old_space = $(`#dock${from_x}`);

        if (to_board) {
            if (getTileLetter(playable_tile).includes('*') && !isWildcardResponse) {
                wildcardCallback_playable_tile = playable_tile;
                wildcardCallback_playable_tile_destination = playable_tile_destination;
                wildcardPrompt(playTile);
                return;
            }

            if (isWildcardResponse) {
                if (wildcardValue) {
                    playable_tile.html(`${wildcardValue}*`);
                    generateTilePointsDiv(playable_tile, getTileLetter(playable_tile));
                }
                else {
                    playTile(playable_tile, playable_tile_old_space);
                    return;
                }
            }
        }

        const tile_to_swap = playableTileObjects.find((tile) => tile && tile.data('board_position') === dest_id);

        if (tile_to_swap) {
            tile_to_swap
                .css({
                    left: playable_tile_old_space.offset().left,
                    top: playable_tile_old_space.offset().top
                })
                .data({
                    'played': false,
                    'board_position': playable_tile_old_space.attr('id')
                })
                .removeClass(PLAYED_TILE_CLASS);

            if (getTileLetter(tile_to_swap).includes('*')) {
                tile_to_swap.html('*');
                generateTilePointsDiv(tile_to_swap, getTileLetter(tile_to_swap));
            }
        }
    }

    if (to_board) {
        const to_x = parseInt(to_board[1]);
        const to_y = parseInt(to_board[2]);
        const char = playable_tile.text();
        if (playable_tile.hasClass(SWAP_TILE_CLASS)) {
            const index = tilesToSwap.indexOf(getTileLetter(playable_tile));
            tilesToSwap = tilesToSwap.slice(0, index) + tilesToSwap.slice(index + 1);
        }
        playable_tile
            .addClass(PLAYED_TILE_CLASS)
            .removeClass(SWAP_TILE_CLASS)
            .css({ 'background-image': playable_tile.hasClass(SWAP_TILE_CLASS) ? SWAP_TILE_IMAGE_URL : '' });
        temporaryBoardState[to_x][to_y] = char.includes('*') ? char.substring(0, 2) : char[0];
    }

    if (to_dock) {
        playable_tile
            .removeClass(PLAYED_TILE_CLASS)
            .css({ 'background-image': playable_tile.hasClass(SWAP_TILE_CLASS) ? SWAP_TILE_IMAGE_URL : '' });;
        if (getTileLetter(playable_tile).includes('*')) {
            playable_tile.html('*');
            generateTilePointsDiv(playable_tile, '*');
        }

        const tile_to_swap = playableTileObjects.find((tile) => tile && tile.data('board_position') === dest_id);

        if (tile_to_swap) {
            tile_to_swap
                .css({
                    left: playable_tile_old_space.offset().left,
                    top: playable_tile_old_space.offset().top
                })
                .data({
                    'played': false,
                    'board_position': playable_tile_old_space.attr('id')
                })
                .removeClass(PLAYED_TILE_CLASS);

            if (getTileLetter(tile_to_swap).includes('*')) {
                tile_to_swap.html('*');
                generateTilePointsDiv(tile_to_swap, getTileLetter(tile_to_swap));
            }
        }
    }

    playable_tile.data({
        'played': to_board,
        'board_position': dest_id
    });
}

function generateDock() {
    // don't cache dock_tile
    $('.dock_tile').remove();

    for (let i = 0; i < BOARD_DIMENSION; i++) {
        const dock_tile = $('<div>', {
            id: `dock${i}`,
            class: 'tile dock_tile unplayed_tile',
            css: {
                'width': TILE_DIMENSION,
                'height': TILE_DIMENSION
            }
        });
        dockElement.append(dock_tile);
    }

    $('.dock_tile').droppable({
        accept: '.playable_tile',
        drop: function (event, ui) {
            playTile(ui.helper, $(this));
            updateUIElements();
        }
    });
}

function generateGameButtons() {
    submitButtonElement.click(() => {
        // remove the tiles from the dock before they're turned lowercase
        removePlayedTilesFromDock();

        socket.emit('endTurn', {
            mode: 'submit',
            roomCode: getRoomCode(),
            points: potentialPoints,
            tilesToSwap: '',
            boardState: getBoardStateForServer(temporaryBoardState),
            dock: getDockTilesForServer(),
            wordsSubmitted: wordsToSubmit,
            pointsEarned: pointsToEarn
        });
    });

    swapButtonElement.click(() => {
        // remove the tiles to swap from the dock
        removeSwappedTilesFromDock();
        socket.emit('endTurn', {
            mode: 'swap',
            roomCode: getRoomCode(),
            points: currentPoints,
            tilesToSwap: tilesToSwap,
            boardState: getBoardStateForServer(currentBoardState),
            dock: getDockTilesForServer(),
            wordsSubmitted: [],
            pointsEarned: 0
        });
    });

    passButtonElement.click(() => {
        socket.emit('endTurn', {
            mode: 'pass',
            roomCode: getRoomCode(),
            points: currentPoints,
            tilesToSwap: '',
            boardState: getBoardStateForServer(currentBoardState),
            dock: getDockTilesForServer(),
            wordsSubmitted: [],
            pointsEarned: 0
        });
    });

    shuffleButtonElement.click(shufflePlayableTiles);

    resetButtonElement.click(resetAll);
}

function generatePlayableTiles() {
    // don't cache playable_tile
    $('.playable_tile').remove();
    playableTileObjects = [];

    for (let i = 0; i < currentDockTiles.length; i++) {
        const dockTileElement = $(`#dock${i}`);
        const left = dockTileElement.offset().left;
        const top = dockTileElement.offset().top;
        const value = currentDockTiles[i];

        const tile = $('<div>', {
            class: 'tile playable_tile unplayed_tile',
            css: {
                'left': `${left}px`,
                'top': `${top}px`,
                'width': TILE_DIMENSION,
                'height': TILE_DIMENSION,
                'font-size': isMobile ? '2rem' : 'rem'
            },
            html: value
        });
        // setting data here beforehand because the playTile() code relies on there being an old position for the tile
        tile.data({
            'played': false,
            'board_position': dockTileElement.attr('id')
        });

        playTile(tile, dockTileElement);

        generateTilePointsDiv(tile, value);

        bodyElement.append(tile);
        playableTileObjects.push(tile);
    }

    $('.playable_tile').draggable({
        snap: '#scrabble_board, #dock',
        snapMode: 'inner',
        snapTolerance: 10,
        revert: 'invalid',
        containment: 'window',
        start: function (event, ui) {
            ui.helper.css({
                'z-index': parseInt(ui.helper.css('z-index')) + 1,
                'box-shadow': '1px 1px 5px rgba(0, 0, 0, 0.35)',
                'filter': ui.helper.hasClass(SWAP_TILE_CLASS) ? 'brightness(1.8) saturate(0.1)' : 'brightness(1.03)',
                'background-image': ui.helper.hasClass(SWAP_TILE_CLASS) ? SWAP_TILE_IMAGE_URL : '',
                'cursor': 'grabbing'
            });
        },
        stop: function (event, ui) {
            ui.helper
                .draggable('option', 'revert', 'invalid')
                .css({
                    'z-index': parseInt(ui.helper.css('z-index')) - 1,
                    'box-shadow': '',
                    'filter': '',
                    'background-image': ui.helper.hasClass(SWAP_TILE_CLASS) ? SWAP_TILE_IMAGE_URL : '',
                    'cursor': 'pointer'
                });
        }
    });

    $('.playable_tile').click(function () {
        const playable_tile = $(this);
        if (playable_tile.hasClass(SWAP_TILE_CLASS)) {
            playable_tile
                .removeClass(SWAP_TILE_CLASS)
                .css({ 'background-image': '' });
            const index = tilesToSwap.indexOf(getTileLetter(playable_tile));
            tilesToSwap = tilesToSwap.slice(0, index) + tilesToSwap.slice(index + 1);
        }
        else {
            playable_tile
                .addClass(SWAP_TILE_CLASS)
                .css({ 'background-image': SWAP_TILE_IMAGE_URL });
            tilesToSwap += getTileLetter(playable_tile);
        }
        updateUIElements();
    });
}

function generateBoard() {
    // don't cache board_tile
    $('.board_tile').remove();

    iterateBoard((x, y) => {
        const value = currentBoardState[x][y];
        // locked-in letters are stored in lowercase, but are visually presented as uppercase
        const htmlValue = (value === xx) ? '' : (!isBlank(value) ? value.toUpperCase() : (shortenTileValues || isMobile ? value : DEFAULT_VALUE_BOARD_TEXT[value]));

        const tile = $('<div>', {
            id: `tile${x}x${y}`,
            class: `tile board_tile unplayed_tile ${isBlank(value) && x === 7 && y === 7 ? 'center_tile' : ''}`,
            text: isBlank(value) && x === 7 && y === 7 ? '' : htmlValue,
            css: {
                'color': isBlank(value) ? '#333333' : '#111111',
                'font-size': isBlank(value) ? (isMobile ? '1.5rem' : '10px') : (isMobile ? '2rem' : '1rem'),
                'background-color': isBlank(value) ? (COLOR_BOARD[x][y] === '' ? BASE_COLOR : COLOR_BOARD[x][y]) : 'darkorange',
                'width': TILE_DIMENSION,
                'height': TILE_DIMENSION,
                'filter': isBlank(value) ? '' : 'brightness(1.03)',
                'border': isBlank(value) ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid #ccc'
            }
        });

        generateTilePointsDiv(tile, value);

        scrabbleBoardElement.append(tile);
    });

    const activeBoardTiles = $('.board_tile').filter(function () {
        const match = $(this).attr('id').match(/tile(\d+)x(\d+)/);
        if (match) {
            const x = parseInt(match[1]);
            const y = parseInt(match[2]);
            return isBlank(currentBoardState[x][y]);
        }
        return false;
    });

    activeBoardTiles.droppable({
        accept: '.playable_tile',
        drop: function (event, ui) {
            playTile(ui.helper, $(this));
            updateUIElements();
        }
    });
}

function generateTilePointsDiv(tile, value) {
    if (!shortenTileValues) { // append the tile value if the screen is big enough for it
        tile.append($('<div>', {
            'class': 'tile_points',
            'text': value.includes('*') ? 0 : isBlank(value) ? '' : TILE_POINT_VALUES[value],
            'style': `font-size: ${(isMobile ? '1.2rem' : '0.7rem')}`
        }));
    } else { // if the screen isn't big enough, have the value appear in the corner as the user hovers the tile
        tile.attr({
            'data-toggle': 'tooltip',
            'title': value.includes('*') ? 0 : isBlank(value) ? '' : `${value} - ${TILE_POINT_VALUES[value]} point${TILE_POINT_VALUES[value] > 1 ? 's' : ''}`
        });
    }
}

function shufflePlayableTiles() {
    for (let i = currentDockTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentDockTiles[i], currentDockTiles[j]] = [currentDockTiles[j], currentDockTiles[i]];
    }
    resetAll();
}

function resetAll() {
    // reset temporary board. do this before updateUIElements()
    // this makes a deep copy, otherwise they become references
    temporaryBoardState = JSON.parse(JSON.stringify(currentBoardState));

    potentialPoints = currentPoints;
    wordsToSubmit = [];
    pointsToEarn = 0;
    tilesToSwap = '';

    setTooltipMessage(true, '');

    // generation needs to happen in this order
    generateBoard();
    generateDock();
    generatePlayableTiles();
    updateUIElements();

    $('[data-toggle="tooltip"]').tooltip({
        show: {
            delay: 0,
            when: shortenTileValues
        },
        hide: {
            delay: 0
        },
        position: {
            my: 'left bottom',
            at: 'left bottom',
            using: function (position, feedback) {
                const top = $(window).height() - $(this).outerHeight();
                const left = 0;
                $(this).css({
                    top: `${top}px`,
                    left: `${left}px`
                });
            }
        }
    });
}

function isUppercase(character) {
    return character === character.toUpperCase();
}

function isLowercase(character) {
    return character === character.toLowerCase();
}

function hasUppercase(str) {
    return /[A-Z]/.test(str);
}

function hasLowercase(str) {
    return /[a-z]/.test(str);
}

function isBlank(character) {
    return DEFAULT_BOARD_VALUES.includes(character);
}

function isFirstMove() {
    return isBlank(currentBoardState[7][7]);
}

function validatePosition() {
    // if it's the first move and there's nothing occupying the middle tile, it's always invalid
    if (isFirstMove() && isBlank(temporaryBoardState[7][7])) {
        setTooltipMessage(true, 'The first word must be placed on the center tile');
        return false;
    }

    let horizontallyValid = true, verticallyValid = true;
    let current_row = -1, current_column = -1;
    let atLeastOneLetterFound = false;

    // using manual for loop so it can break
    for (let x = 0; x < BOARD_DIMENSION; x++) {
        for (let y = 0; y < BOARD_DIMENSION; y++) {
            const char = temporaryBoardState[x][y];
            if (!isBlank(char) && isUppercase(char)) {
                atLeastOneLetterFound = true;

                if (current_row > -1 && x !== current_row) {
                    horizontallyValid = false;
                } else {
                    current_row = x;
                }

                if (current_column > -1 && y !== current_column) {
                    verticallyValid = false;
                } else {
                    current_column = y;
                }
            }

            if (!horizontallyValid && !verticallyValid) {
                break;
            }
        }
    }

    let wordFound = false, blankFound = false;
    if (current_row === -1 && current_column === -1) {
        verticallyValid = false;
        horizontallyValid = false;
    }
    else if (verticallyValid) {
        let y = current_column;
        for (let x = 0; x < BOARD_DIMENSION; x++) {
            const char = temporaryBoardState[x][y];
            if (!isBlank(char) && isUppercase(char)) {
                if (blankFound) {
                    verticallyValid = false;
                    break;
                }
                wordFound = true;
            }
            else if (wordFound && isBlank(char)) {
                blankFound = true;
            }
        }
    }
    else if (horizontallyValid) {
        let x = current_row;
        for (let y = 0; y < BOARD_DIMENSION; y++) {
            const char = temporaryBoardState[x][y];
            if (!isBlank(char) && isUppercase(char)) {
                if (blankFound) {
                    horizontallyValid = false;
                    break;
                }
                wordFound = true;
            }
            else if (wordFound && isBlank(char)) {
                blankFound = true;
            }
        }
    }

    if (wordFound) {
        if (!horizontallyValid && !verticallyValid) {
            setTooltipMessage(false, 'Invalid position');
        }
    }
    else if (!atLeastOneLetterFound) {
        setTooltipMessage(true, '');
    }
    else {
        setTooltipMessage(false, 'Invalid position');
    }

    return (horizontallyValid || verticallyValid);
}

function validateWord() {
    let wordList = JSON.parse(JSON.stringify(currentWordsAndPointsData));

    // after the first move, played words should have at least one lowercase letter
    // this means they're connected to at least one other word on the board
    if (!isFirstMove()) {
        // remove all words which don't have at least one lowercase letter
        wordList = wordList.filter((arr) => hasLowercase(arr[0]));
    }

    if (wordList.length === 0) {
        if (isFirstMove() && !isBlank(temporaryBoardState[7][7])) {
            setTooltipMessage(false, 'Word must be at least two letters long');
            enableElement(submitButtonElement, false);
            return;
        }

        console.log('No connected words');
        setTooltipMessage(false, 'Invalid position');
        enableElement(submitButtonElement, false);
        return;
    }

    // turn all the words lowercase to avoid confusion on server
    wordList = wordList.map((arr) => arr[0].toLowerCase());

    console.log('words to validate:', wordList);

    socket.emit('checkWord', {
        roomCode: getRoomCode(),
        words: wordList
    });
}

function calculateWordPoints(direction) {
    let wordList = [], currentWord = '', currentWordPoints = 0, currentWordMultiplier = 1, char = '', currentTile = '';

    // checks top to bottom and left to right, so the orientation of the word is always correct
    iterateBoard((x, y) => {
        // if we reach the edge of the board after a full loop, that's basically a "blank space" and the current word ends
        if (y === 0) {
            if (currentWord !== '' && currentWord.length > 1) {
                wordList.push([currentWord, currentWordPoints * currentWordMultiplier]);
            }
            currentWord = '';
            currentWordPoints = 0;
            currentWordMultiplier = 1;
        }

        char = (direction === 'vertical' ? temporaryBoardState[y][x] : temporaryBoardState[x][y]);
        currentTile = (direction === 'vertical' ? currentBoardState[y][x] : currentBoardState[x][y]);

        if (!isBlank(char)) {
            currentWord += char.replace('*', '');
            let letterMultiplier = 1;
            if (currentTile === TL) {
                letterMultiplier = 3;
            } else if (currentTile === DL) {
                letterMultiplier = 2;
            }

            if (!char.includes('*')) {
                currentWordPoints += TILE_POINT_VALUES[char.toUpperCase()] * letterMultiplier;
            }

            if (currentTile === TW) {
                currentWordMultiplier *= 3;
            } else if (currentTile === DW) {
                currentWordMultiplier *= 2;
            }
        } else if (currentWord !== '') {
            if (currentWord.length > 1) {
                wordList.push([currentWord, currentWordPoints * currentWordMultiplier]);
            }
            currentWord = '';
            currentWordPoints = 0;
            currentWordMultiplier = 1;
        }
    });

    if (currentWord !== '' && currentWord.length > 1) {
        wordList.push([currentWord, currentWordPoints * currentWordMultiplier]);
    }

    return wordList;
}

// VERY IMPORTANT FUNCTION
// THIS RETURNS A 2D ARRAY OF [word, points] TUPLES
// ALL WORDS ARE >1 IN LENGTH AND HAVE AT LEAST 1 UPPERCASE LETTER
function getAffectedWordsAndPoints() {
    return [...calculateWordPoints('vertical'), ...calculateWordPoints('horizontal')] // index 0 = words, index 1 = points
        .filter((arr) => (arr[0].length > 1)) // remove all 1-letter words
        .filter((arr) => hasUppercase(arr[0])); // then remove all words which don't have at least one uppercase letter in them
}

function updatePotentialPoints() {
    pointsToEarn = 0;
    for (const i of currentWordsAndPointsData) {
        pointsToEarn += i[1];
    }
    potentialPoints = currentPoints + pointsToEarn;
}

function enableElement(element, enabled) {
    element.prop('disabled', !enabled);
}

function checkSwapButtonStatus() {
    if (!turnActive) {
        enableElement(swapButtonElement, false);
    } else if (tilesToSwap === '') {
        enableElement(swapButtonElement, false);
    } else {
        socket.emit('checkRemainingLetters', {
            roomCode: getRoomCode()
        });
    }
}

function checkSubmitButtonStatus() {
    if (!turnActive) {
        enableElement(submitButtonElement, false);
        return;
    }

    if (validatePosition()) {
        validateWord();
    }
    else {
        enableElement(submitButtonElement, false);
    }
}

function removePlayedTilesFromDock() {
    iterateBoard((x, y) => {
        const char = temporaryBoardState[x][y];
        if (!isBlank(char) && isUppercase(char)) {
            const index = currentDockTiles.indexOf(char.includes('*') ? '*' : char);
            if (index !== -1) {
                currentDockTiles.splice(index, 1);
            }
        }
    });
}

function removeSwappedTilesFromDock() {
    for (const char of tilesToSwap) {
        const index = currentDockTiles.indexOf(char.includes('*') ? '*' : char);
        if (index !== -1) {
            currentDockTiles.splice(index, 1);
        }
    }
}

function sendChatMessage(isChat, sender, message) {
    if (!isChat || lastChatter !== sender) {
        currentChatColor = currentChatColor === '#333333' ? '#222222' : '#333333';
    }

    const messageContainerElement = $('<div>', { class: 'chat_message_container' })
        .css({
            'background-color': currentChatColor,
            'font-size': isMobile ? '2rem' : '1rem'
        })
        .css(sender === lastChatter && isChat ? {
            'margin-top': '-4px',
            'padding-top': '4px'
        } : { 'padding-top': '10px' });

    const senderElement = $('<div>', { class: 'sender' })
        .html(isChat ? `<b>${sender}</b> says` : `<i>${message.replace(/,/g, ', ')}</i>`)
        .css('margin-bottom', isChat ? '4px' : '0');

    // don't include sender if it's not a server message or that sender is currently talking
    if (!isChat || sender !== lastChatter) {
        messageContainerElement.append(senderElement);
    }

    if (isChat) {
        const contentElement = $('<div>', { class: 'message_content' })
            .html(createClickableLinks(message));

        messageContainerElement.append(contentElement);
    }

    lastChatter = isChat ? sender : '';

    chatContentsElement
        .append(messageContainerElement)
        .scrollTop(chatContentsElement[0].scrollHeight - chatContentsElement.height());

    if (sender === clientID) {
        chatInputElement.val('');
    }

    if (document.hidden) {
        document.title = 'New Activity';
        if (!isChat) {
            newActivitySoundEffect.play();
        }
    }
}

function createClickableLinks(text) {
    // Regular expression to match URLs with http/https and www
    const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;

    // Replace URLs with clickable links
    const replacedText = text.replace(urlRegex, function (url) {
        return `<a href='${url.startsWith('www.') ? 'http://' + url : url}' target='_blank'>${url}</a>`;
    });

    return replacedText;
}

function setScores(scoreboard, whoseTurn) {
    $('.divide_line').remove();

    for (let i = 0; i < 4; i++) {
        if (scoreboard[i][0]) {
            const dividingLine = $('<div>', { class: 'divide_line' })
                .text('—');
            playerNameElements[i]
                .html(scoreboard[i][0] === clientID ? `${scoreboard[i][0]} (You)` : scoreboard[i][0])
                .css('color', scoreboard[i][0] === whoseTurn ? 'wheat' : 'whitesmoke')
                .after(dividingLine);

            playerScoreElements[i].html(`${scoreboard[i][1]}`);

            if (clientID === scoreboard[i][0]) {
                currentPoints = scoreboard[i][1];
            }
        }
    }
}

function getBoardStateForServer(board) {
    // locked-in letters are stored in lowercase, even though visually they're presented as uppercase
    iterateBoard((x, y) => {
        const char = board[x][y];
        if (!isBlank(char)) {
            board[x][y] = board[x][y].toLowerCase();
        }
    });

    return board.map(row => row.join(',')).join(',');
}

function setBoardStateForClient(serverBoardState) {
    if (!serverBoardState) {
        return;
    }

    let convertedBoardState = [];
    const array = serverBoardState.split(',');
    for (let x = 0; x < BOARD_DIMENSION; x++) {
        let row = [];
        for (let y = 0; y < BOARD_DIMENSION; y++) {
            const value = array[(x * BOARD_DIMENSION) + y];
            row.push(value);
        }
        convertedBoardState.push(row);
    }

    currentBoardState = JSON.parse(JSON.stringify(convertedBoardState));
}

function getDockTilesForServer() {
    return currentDockTiles.join(',');
}

function setDockTilesForClient(serverDockTiles) {
    if (!serverDockTiles) {
        return;
    }

    const array = serverDockTiles.split(',');
    currentDockTiles = JSON.parse(JSON.stringify(array));
}

function setCurrentPlayerHTML(currentPlayer) {
    currentPlayerElement.html(currentPlayer ? `${currentPlayer}'s turn` : 'Waiting for player to join...');
}

function getClientID(callback) {
    // check if the unique client ID already exists in cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name.trim() === 'clientID') {
            return callback(value);
        }
    }

    // check if the unique client ID already exists in localStorage
    const storedClientID = localStorage.getItem('clientID');
    if (storedClientID) {
        return callback(storedClientID);
    }

    // if it doesn't exist, generate a new one
    // need to use ajax here because the socket can't be established without a username
    $.ajax({
        url: '/generateUsername',
        method: 'POST',
        success: function (response) {
            const { success, signature, data } = response;
            console.log(success ? 'SUCCESS' : 'FAIL', signature);
            if (success) {
                // store the generated client ID in cookies or localStorage
                const expirationDate = new Date();
                expirationDate.setMonth(expirationDate.getMonth() + 1); // Expires in 1 month
                document.cookie = `clientID=${data.username}; expires=${expirationDate.toUTCString()}; path=/`;
                localStorage.setItem('clientID', data.username);

                return callback(data.username);
            }
        },
        error: function (error) {
            console.error(error);
            return callback('');
        }
    });
}

function setTooltipMessage(valid, message) {
    tooltipElement
        .html(message)
        .css('color', valid ? 'whitesmoke' : 'tomato');
}

function closeSidebar() {
    sidebarElement.css('right', `-${sidebarInfoElement.width()}`);

    sidebarToggleButtonElement
        .removeClass('open')
        .addClass('closed')
        .css('background-image', 'url(../images/arrow_left1.png)');
}

function openSidebar() {
    sidebarElement.css('right', '0');

    sidebarToggleButtonElement
        .removeClass('closed')
        .addClass('open')
        .css('background-image', 'url(../images/arrow_right1.png)');
}

function copyURLToClipboard() {
    navigator.clipboard.writeText(inviteURLElement.val());
    inviteURLElement.val('Copied URL');
    setTimeout(function () {
        inviteURLElement.val(`${window.location.href}`.replace('Room', 'Invite'));
    }, 4 * 1000);
}

function scale() {
    TILE_DIMENSION = (isMobile ? window.outerWidth : window.innerWidth) * (isMobile ? TILE_WIDTH_MAGIC_NUMBER_MOBILE : TILE_WIDTH_MAGIC_NUMBER);
    TILE_DIMENSION = isMobile ? (window.outerWidth / BOARD_DIMENSION * 2) : TILE_DIMENSION;

    currentPlayerElement.css({
        'width': `${(TILE_DIMENSION * BOARD_DIMENSION) + (BOARD_DIMENSION * 2)}px`,
        'height': `${TILE_DIMENSION}px`
    });
    shortenTileValues = (TILE_DIMENSION < 32);
    sidebarElement.css({
        'top': 0,
        'width': isMobile ? `calc(100% - ${TILE_DIMENSION * (isMobile ? 2 : 1) + 16}px)` : sidebarInfoElement.width()
    });
    sidebarToggleButtonElement.css('right', `${sidebarInfoElement.width()}px`);
    sidebarContentsElement.css('height', `calc(100% - ${sidebarInfoElement.outerHeight(true)}px)`);
    $('#sidebar_buttons').css('left', `-${TILE_DIMENSION * (isMobile ? 1.5 : 1) + 12}px`);
    $('.sidebar_button').css({
        'width': `${TILE_DIMENSION * (isMobile ? 1.5 : 1)}px`,
        'height': `${TILE_DIMENSION * (isMobile ? 1.5 : 1)}px`
    });
}

function initializeSocket() {
    socket = io(window.location.origin, { query: { clientID: clientID } });

    socket.on('endTurnResponse', (response) => {
        const { success, signature, data } = response;
        if (data.roomCode !== getRoomCode()) {
            return;
        }

        console.log(success ? 'SUCCESS' : 'FAIL', signature, data.mode);
    });

    socket.on('endGameResponse', (response) => {
        const { success, signature, data } = response;
        if (data.roomCode !== getRoomCode()) {
            return;
        }

        console.log(success ? 'SUCCESS' : 'FAIL', signature);

        if (success) {
            console.log(`${data.winner_name} won with ${data.winner_points} points!`)
            gameOver = true;

            data.scoreboard.sort(function (a, b) {
                return b[1] - a[1];
            });

            for (let i = 0; i < 4; i++) {
                if (data.scoreboard[i][0]) {
                    const pName = data.scoreboard[i][0];
                    playerNameElements[i]
                        .html(`${pName === data.winner_name ? '👑 ' : ''}${pName} ${pName === clientID ? '(You)' : ''}`)
                        .css('color', pName === data.winner_name ? 'wheat' : 'whitesmoke');

                    playerScoreElements[i].html(`${data.scoreboard[i][1]}`);

                    endGameMessageRecipients.push(pName);
                }
            }

            endGame_triggerConfetti(currentPlayerElement.attr('id'));
            let counter = 5;
            const confettiInterval = setInterval(function () {
                if (counter > 0) {
                    endGame_triggerConfetti(currentPlayerElement.attr('id'));
                    counter--;
                }
                else {
                    clearInterval(confettiInterval);
                }
            }, 6 * 1000);

            turnActive = false;
            clientID = data.clientID;

            setBoardStateForClient(data.boardState);

            resetAll();
            enableElement(shuffleButtonElement, false);
            enableElement(resetButtonElement, false);
            currentPlayerElement.html(`${data.winner_name} won the game with ${data.winner_points} points!`);
        }
    });

    socket.on('getScrabbleRoomDataResponse', (response) => {
        const { success, signature, data } = response;
        if (data.roomCode !== getRoomCode()) {
            return;
        }

        console.log(success ? 'SUCCESS' : 'FAIL', signature);

        if (success) {
            turnActive = data.turnActive;
            clientID = data.clientID;

            // set relevant data
            setCurrentPlayerHTML(data.whoseTurn);
            setScores(data.scoreboard, data.whoseTurn);
            setBoardStateForClient(data.boardState);
            setDockTilesForClient(data.dockTiles);

            if ((!firstLoad && !isMobile) || (!firstLoad && isMobile && sidebarToggleButtonElement.hasClass('closed'))) {
                const loadingDiv = $('<div>', {
                    class: 'scrabble_board_loading_overlay',
                    css: {
                        'width': `${(TILE_DIMENSION * BOARD_DIMENSION) + (BOARD_DIMENSION * 2)}px`,
                        'height': `${(TILE_DIMENSION * BOARD_DIMENSION) + (BOARD_DIMENSION * 2)}px`,
                        'top': scrabbleBoardElement.offset().top,
                        'left': scrabbleBoardElement.offset().left
                    },
                    html: '<div class="dot-animation"></div>'
                });
                bodyElement.append(loadingDiv);
            }

            // reload relevant html
            resetAll();

            if ((!firstLoad && !isMobile) || (!firstLoad && isMobile && sidebarToggleButtonElement.hasClass('closed'))) {
                setTimeout(function () {
                    $('.scrabble_board_loading_overlay').remove();
                }, 1 * 1000);
            }

            // only ever happens once when the entire page loads
            if (firstLoad) {
                if (reloaded) {
                    $('#loading_overlay').hide();
                    if (isMobile) {
                        closeSidebar();
                    }
                    firstLoad = false;
                } else {
                    setTimeout(function () {
                        $('#loading_overlay').hide();
                        if (isMobile) {
                            closeSidebar();
                        }
                        firstLoad = false;
                    }, 4 * 1000);
                }
            }
        } else {
            window.location.href = '/scrabble';
        }
    });

    socket.on('checkRemainingLettersResponse', (response) => {
        const { success, signature, data } = response;
        if (data.roomCode !== getRoomCode()) {
            return;
        }

        console.log(success ? 'SUCCESS' : 'FAIL', signature);

        if (success) {
            enableElement(swapButtonElement, !data.remainingLettersEmpty);
        }
    });

    socket.on('joinScrabbleRoomSecondaryResponse', (response) => {
        const { success, signature, data } = response;
        if (data.roomCode !== getRoomCode()) {
            return;
        }

        console.log(success ? 'SUCCESS' : 'FAIL', signature);

        if (success) {
            setScores(data.scoreboard, data.whoseTurn);

            for (let i = 0; i < 4; i++) {
                if (data.scoreboard[i][0]) {
                    if (data.scoreboard[i][0] === data.whoseTurn) {
                        currentPlayer = data.scoreboard[i][0];
                        setCurrentPlayerHTML(currentPlayer);
                        break;
                    }
                }
            }
        }
    });

    socket.on('checkWordResponse', (response) => {
        const { success, signature, data } = response;
        if (data.roomCode !== getRoomCode()) {
            return;
        }

        console.log(success ? 'SUCCESS' : 'FAIL', signature);

        if (success) {
            if (turnActive) {
                console.log(data.wordList, 'is', data.isValid);
                wordsToSubmit = data.wordList;
                enableElement(submitButtonElement, data.isValid);
                setTooltipMessage(data.isValid, data.isValid ? `${pointsToEarn} potential points` : 'Invalid word');
            }
            else {
                console.log('It is not this player\'s turn');
                enableElement(submitButtonElement, false);
            }
        } else {
            enableElement(submitButtonElement, false);
        }
    });

    socket.on('sendMessageResponse', (response) => {
        const { success, signature, data } = response;
        if (data.roomCode !== getRoomCode()) {
            return;
        }

        console.log(success ? 'SUCCESS' : 'FAIL', signature);

        if (success) {
            sendChatMessage(data.isChat, data.sender, data.message);
        }
    });

    socket.on('sendBugReportResponse', (response) => {
        const { success, signature, data } = response;
        if (data.roomCode !== getRoomCode()) {
            return;
        }

        console.log(success ? 'SUCCESS' : 'FAIL', signature);

        if (success) {
            bugMessageElement
                .val('Sent! Thank you for playing!')
                .prop('readonly', true);
            setTimeout(function () {
                enableElement(bugSubmitElement, true);
                bugMessageElement
                    .val('')
                    .prop('readonly', false);
            }, 60 * 1000);
        }

        sendingBugReport = false;
    });
}

function initializeHTML() {
    roomCodeElement.html(getRoomCode());
    inviteURLElement.val(`${window.location.href}`.replace('Room', 'Invite'));

    copySymbolElement.click(copyURLToClipboard);

    chatFormElement.submit(function (event) {
        event.preventDefault();
        const val = chatInputElement.val();
        let message = val, isChat = true;
        if (val.startsWith('/me ')) {
            message = val.substring(4);
            message = `<b>${clientID}</b> ${message}`;
            isChat = false;
        }
        if (chatInputElement.val()) {
            socket.emit('sendMessage', {
                roomCode: getRoomCode(),
                isChat: isChat,
                message: message,
                recipients: gameOver ? endGameMessageRecipients : []
            });
        }
        chatInputElement.focus();
    });

    wildcardFormElement.submit(function (event) {
        event.preventDefault();
        if (alphabet.includes(wildcardInputElement.val().toUpperCase())) {
            submitWildcardPrompt();
        }
    });

    wildcardInputElement.on('input', function (event) {
        const inputValue = $(this).val();
        if (!alphabet.includes(inputValue.toUpperCase())) {
            $(this).val('');
        }
    });

    wildcardOverlayElement.click(closeWildcardPrompt);

    $(window).resize(function () {
        scale();
        resetAll();
    });

    sidebarToggleButtonElement.click(function () {
        if (sidebarToggleButtonElement.hasClass('open')) {
            closeSidebar();
        }
        else {
            openSidebar();
        }
    });

    sidebarChatButtonElement.click(function () {
        helpContainerElement.hide();
        bugContainerElement.hide();
        chatContainerElement.css('display', 'flex');
        if (sidebarToggleButtonElement.hasClass('closed')) {
            openSidebar();
        }
    });

    sidebarHelpButtonElement.click(function () {
        chatContainerElement.hide();
        bugContainerElement.hide();
        helpContainerElement.css('display', 'flex');
        if (sidebarToggleButtonElement.hasClass('closed')) {
            openSidebar();
        }
    });

    sidebarBugButtonElement.click(function () {
        chatContainerElement.hide();
        helpContainerElement.hide();
        bugContainerElement.css('display', 'flex');
        if (sidebarToggleButtonElement.hasClass('closed')) {
            openSidebar();
        }
    });

    sidebarHomeButtonElement.click(function () {
        if (gameOver) {
            window.location.href = `/scrabble`;
        }
        else {
            window.location.href = `/scrabble?from=${getRoomCode()}`;
        }
    });

    bugFormElement.submit(function (e) {
        e.preventDefault();

        if (sendingBugReport) {
            return;
        }

        const value = bugMessageElement.val();

        if (value.length < 3) {
            return;
        }

        sendingBugReport = true;
        enableElement(bugSubmitElement, false);

        socket.emit('sendBugReport', {
            roomCode: getRoomCode(),
            clientID: clientID,
            message: value
        });
    });

    $(document).on('visibilitychange', function () {
        if (!document.hidden) {
            document.title = 'Scrabble';
        }
    });
}

function cacheHTML() {
    bodyElement = $('body');

    roomCodeElement = $('#room_code');

    submitButtonElement = $('#SUBMIT');
    swapButtonElement = $('#SWAP');
    passButtonElement = $('#PASS');
    shuffleButtonElement = $('#SHUFFLE');
    resetButtonElement = $('#RESET');

    dockElement = $('#dock');
    scrabbleBoardElement = $('#scrabble_board');
    playerNameElements = [$('#player1_name'), $('#player2_name'), $('#player3_name'), $('#player4_name')];
    playerScoreElements = [$('#player1_score'), $('#player2_score'), $('#player3_score'), $('#player4_score')];
    currentPlayerElement = $('#current_player');
    tooltipElement = $('#tooltip');

    chatContentsElement = $('#chat_contents');
    chatInputElement = $('#chat_input');

    sidebarElement = $('#sidebar');
    sidebarInfoElement = $('#sidebar_info');

    sidebarToggleButtonElement = $('#sidebar_toggle');
    sidebarChatButtonElement = $('#sidebar_chat');
    sidebarHelpButtonElement = $('#sidebar_help');
    sidebarBugButtonElement = $('#sidebar_bug');
    sidebarHomeButtonElement = $('#sidebar_home');

    sidebarContentsElement = $('#sidebar_contents');
    chatContainerElement = $('#chat_container');
    helpContainerElement = $('#help_container');
    bugContainerElement = $('#bug_container');

    inviteURLElement = $('#invite_url');

    bugFormElement = $('#bug_form');
    bugMessageElement = $('#bug_message');
    bugSubmitElement = $('#bug_submit');

    wildcardOverlayElement = $('#wildcard_overlay');
    wildcardFormElement = $('#wildcard_form');
    wildcardInputElement = $('#wildcard_input');
    wildcardPromptElement = $('#wildcard_prompt');

    copySymbolElement = $('#copy_symbol');

    chatFormElement = $('#chat_form');
}

function structureHTML(structureForMobile) {
    const mainContainer = $('#main_container');
    mainContainer.empty();

    if (structureForMobile) {
        const textSize = '1.7rem';
        const gapSize = '24px';

        const wholeDiv = $('<div>')
            .css({
                'top': '50%',
                'display': 'flex',
                'flex-direction': 'column',
                'gap': '12px'
            }).appendTo(mainContainer);

        $('<div>')
            .attr('id', 'current_player')
            .css('font-size', '2rem')
            .appendTo(wholeDiv);
        $('<div>').attr('id', 'scrabble_board').appendTo(wholeDiv);
        $('<div>').attr('id', 'dock').appendTo(wholeDiv);
        $('<div>')
            .attr('id', 'tooltip')
            .css('font-size', textSize)
            .appendTo(wholeDiv);

        const rowContainer = $('<div>')
            .addClass('row_container')
            .appendTo(wholeDiv);

        const scoreboardContainer = $('<div>')
            .attr('id', 'scoreboard_container')
            .addClass('column_container')
            .css({
                'height': 'fit-content',
                'font-size': textSize,
                'gap': gapSize
            }).appendTo(rowContainer);
        const score1 = $('<div>')
            .addClass('row_container scoreboard_row')
            .appendTo(scoreboardContainer);
        $('<div>').attr('id', 'player1_name').addClass('player_name').appendTo(score1);
        $('<div>').attr('id', 'player1_score').addClass('player_score').appendTo(score1);
        const score2 = $('<div>')
            .addClass('row_container scoreboard_row')
            .appendTo(scoreboardContainer);
        $('<div>').attr('id', 'player2_name').addClass('player_name').appendTo(score2);
        $('<div>').attr('id', 'player2_score').addClass('player_score').appendTo(score2);
        const score3 = $('<div>')
            .addClass('row_container scoreboard_row')
            .appendTo(scoreboardContainer);
        $('<div>').attr('id', 'player3_name').addClass('player_name').appendTo(score3);
        $('<div>').attr('id', 'player3_score').addClass('player_score').appendTo(score3);
        const score4 = $('<div>')
            .addClass('row_container scoreboard_row')
            .appendTo(scoreboardContainer);
        $('<div>').attr('id', 'player4_name').addClass('player_name').appendTo(score4);
        $('<div>').attr('id', 'player4_score').addClass('player_score').appendTo(score4);

        const gameButtonsContainer = $('<div>')
            .attr('id', 'game_buttons_container')
            .appendTo(rowContainer);
        const columnContainer2 = $('<div>')
            .addClass('column_container')
            .css('gap', gapSize)
            .appendTo(gameButtonsContainer);
        $('<button>').attr('id', 'SUBMIT').addClass('game_button').text('SUBMIT').prop('disabled', true).appendTo(columnContainer2);
        $('<button>').attr('id', 'SWAP').addClass('game_button').text('SWAP').prop('disabled', true).appendTo(columnContainer2);
        $('<button>').attr('id', 'PASS').addClass('game_button').text('PASS').prop('disabled', true).appendTo(columnContainer2);
        $('<button>').attr('id', 'BLANK1').addClass('game_button').text('').prop('disabled', true).appendTo(columnContainer2);
        $('<button>').attr('id', 'SHUFFLE').addClass('game_button').text('SHUFFLE').prop('disabled', false).appendTo(columnContainer2);
        $('<button>').attr('id', 'RESET').addClass('game_button').text('RESET').prop('disabled', false).appendTo(columnContainer2);
        $('.game_button').css('font-size', textSize);
    } else {
        const textSize = '1rem';
        const gapSize = '8px';

        $('<div>').attr('id', 'current_player').appendTo(mainContainer);

        const rowContainer = $('<div>').addClass('row_container').appendTo(mainContainer);

        const columnContainer1 = $('<div>').addClass('column_container').css('width', '300px').appendTo(rowContainer); // centering element

        const scoreboardContainer = $('<div>')
            .attr('id', 'scoreboard_container')
            .addClass('column_container')
            .css({
                'height': 'fit-content',
                'font-size': textSize,
                'gap': gapSize
            }).appendTo(columnContainer1);
        const score1 = $('<div>')
            .addClass('row_container scoreboard_row')
            .appendTo(scoreboardContainer);
        $('<div>').attr('id', 'player1_name').addClass('player_name').appendTo(score1);
        $('<div>').attr('id', 'player1_score').addClass('player_score').appendTo(score1);
        const score2 = $('<div>')
            .addClass('row_container scoreboard_row')
            .appendTo(scoreboardContainer);
        $('<div>').attr('id', 'player2_name').addClass('player_name').appendTo(score2);
        $('<div>').attr('id', 'player2_score').addClass('player_score').appendTo(score2);
        const score3 = $('<div>')
            .addClass('row_container scoreboard_row')
            .appendTo(scoreboardContainer);
        $('<div>').attr('id', 'player3_name').addClass('player_name').appendTo(score3);
        $('<div>').attr('id', 'player3_score').addClass('player_score').appendTo(score3);
        const score4 = $('<div>')
            .addClass('row_container scoreboard_row')
            .appendTo(scoreboardContainer);
        $('<div>').attr('id', 'player4_name').addClass('player_name').appendTo(score4);
        $('<div>').attr('id', 'player4_score').addClass('player_score').appendTo(score4);

        const gameButtonsContainer = $('<div>').attr('id', 'game_buttons_container').appendTo(columnContainer1);
        const columnContainer2 = $('<div>')
            .addClass('column_container')
            .css('gap', gapSize)
            .appendTo(gameButtonsContainer);
        $('<button>').attr('id', 'SUBMIT').addClass('game_button').text('SUBMIT').prop('disabled', true).appendTo(columnContainer2);
        $('<button>').attr('id', 'SWAP').addClass('game_button').text('SWAP').prop('disabled', true).appendTo(columnContainer2);
        $('<button>').attr('id', 'PASS').addClass('game_button').text('PASS').prop('disabled', true).appendTo(columnContainer2);
        $('<button>').attr('id', 'BLANK1').addClass('game_button').text('').prop('disabled', true).appendTo(columnContainer2);
        $('<button>').attr('id', 'BLANK2').addClass('game_button').text('').prop('disabled', true).appendTo(columnContainer2);
        $('<button>').attr('id', 'SHUFFLE').addClass('game_button').text('SHUFFLE').prop('disabled', false).appendTo(columnContainer2);
        $('<button>').attr('id', 'RESET').addClass('game_button').text('RESET').prop('disabled', false).appendTo(columnContainer2);
        $('.game_button').css('font-size', textSize);

        const columnContainer3 = $('<div>').addClass('column_container').appendTo(rowContainer);
        $('<div>').attr('id', 'scrabble_board').appendTo(columnContainer3);

        $('<div>').addClass('column_container').css('width', '300px').appendTo(rowContainer); // centering element

        $('<div>').attr('id', 'dock').appendTo(mainContainer);
        $('<div>')
            .attr('id', 'tooltip')
            .css('font-size', textSize)
            .appendTo(mainContainer);
    }

    $('#chat_input').css('font-size', isMobile ? '2rem' : '1rem');
    $('#sidebar_info').find('*').css('font-size', isMobile ? '2rem' : '1rem');
    $('#copy_symbol').css({
        'width': isMobile ? '48px' : '28px',
        'height': isMobile ? '48px' : '28px'
    });
}

function getRoomCode() {
    return new URLSearchParams(window.location.search).get('roomCode');
}

$(document).ready(function () {
    reloaded = performance.navigation.type == 1;

    getClientID(function (result) {
        clientID = result;
        if (clientID) {
            console.log('Logged in as client', clientID);

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                isMobile = true;
            }
            structureHTML(isMobile);

            // only need to trigger once
            cacheHTML();
            generateGameButtons();
            initializeSocket();
            initializeHTML();

            if (!reloaded) {
                $('#loading_message').css('visibility', 'visible');
            }

            scale();

            socket.emit('getScrabbleRoomData', { roomCode: getRoomCode() });
        }
        else {
            console.log('Failed to get or create client ID');
            window.location.href = '/scrabble';
        }
    });
});
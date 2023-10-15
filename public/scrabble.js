let clientID;
let socket;
let from;

let loggedInAs;
let joinScrabbleGame;
let roomCodeInput;
let roomCodeForm;
let errorMessage;

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
                // expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Expires in 1 year
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

function initializeSocket() {
    socket = io(window.location.origin, { query: { clientID: clientID } });

    socket.on('createScrabbleRoomResponse', (response) => {
        const { success, signature, data } = response;
        console.log(success ? 'SUCCESS' : 'FAIL', signature);

        if (success) {
            window.location.href = `/redirectToScrabbleRoom?roomCode=${data.roomCode}`;
        }
    });

    // this also handles cases where the player tries to join an existing game that they have already participated in
    socket.on('joinScrabbleRoomResponse', (response) => {
        const { success, signature, data } = response;
        console.log(success ? 'SUCCESS' : 'FAIL', signature);

        if (success) {
            window.location.href = `/redirectToScrabbleRoom?roomCode=${data.roomCode}`;
        }
        else {
            errorMessage.text(data.message);
            errorMessage.css('opacity', '1');
        }
    });
}

function initializeHTML() {
    loggedInAs.html(`Logged in as <i>${clientID}</i>`);

    $('.create_scrabble_game_with_player_count').click(function () {
        const playerCount = $(this).attr('value');
        socket.emit('createScrabbleRoom', { playerCount: playerCount });
    });

    joinScrabbleGame.click(function () {
        const roomCode = roomCodeInput.val().toUpperCase();
        socket.emit('joinScrabbleRoom', { roomCode: roomCode });
    });

    if (from) {
        roomCodeInput.val(from);
        joinScrabbleGame.show();
    }

    roomCodeInput.focus();

    roomCodeInput.on('input', function () {
        const inputValue = $(this).val();

        if (inputValue.length === 5) {
            joinScrabbleGame.show();
        } else {
            joinScrabbleGame.hide();
            errorMessage.css('opacity', '0');
        }
    });

    roomCodeForm.submit(function (event) {
        event.preventDefault();
        if (roomCodeInput.val().length === 5) {
            const roomCode = roomCodeInput.val().toUpperCase();
            socket.emit('joinScrabbleRoom', { roomCode: roomCode });
        }
    });

    $('.create_scrabble_game_with_player_count').hover(
        function () {
            $(this).siblings('.create_game_tooltip').css('opacity', '0.65');
        },
        function () {
            $(this).siblings('.create_game_tooltip').css('opacity', '0');
        }
    );
}

function cacheHTML() {
    loggedInAs = $('#logged_in_as');
    joinScrabbleGame = $('#join_scrabble_game');
    roomCodeInput = $('#room_code_input');
    roomCodeForm = $('#room_code_form');
    errorMessage = $('#error_message');
}

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get('from')
    from = (fromParam && fromParam.length === 5) ? fromParam : null;

    if (from) {
        console.log(`User arriving from ${from}`);
    }

    getClientID(function (result) {
        clientID = result;
        if (clientID) {
            console.log('Logged in as client', clientID);
            cacheHTML();
            initializeSocket();
            initializeHTML();
        }
    });
});
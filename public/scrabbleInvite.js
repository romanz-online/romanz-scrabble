let clientID;
let socket;
let roomCode;

let errorMessage;
let joinScrabbleGame;
let loggedInAs;
let homeButton;
let roomCodeElement;

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
            errorMessage.html(data.message.toUpperCase());
            errorMessage.css('opacity', '1');
            joinScrabbleGame.prop('disabled', true);
        }
    });
}

function initializeHTML() {
    loggedInAs.html(`Logged in as <i>${clientID}</i>`);
    roomCodeElement.html(roomCode);

    joinScrabbleGame.click(function () {
        socket.emit('joinScrabbleRoom', { roomCode: roomCode });
    });

    homeButton.click(function () {
        window.location.href = `/scrabble`;
    });
}

function cacheHTML() {
    errorMessage = $('#error_message');
    joinScrabbleGame = $('#join_scrabble_game');
    loggedInAs = $('#logged_in_as');
    homeButton = $('#home_button');
    roomCodeElement = $('#room_code');
}

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    roomCode = urlParams.get('roomCode');

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
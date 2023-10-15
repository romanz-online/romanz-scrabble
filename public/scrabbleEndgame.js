// ammount to add on each trigger
const confettiCount = 40;
const sequinCount = 10;

// "physics" variables
const gravityConfetti = 0.3;
const dragConfetti = 0.08;
const terminalVelocity = 4.5;

let origin;
let canvas;
let ctx;
let cx;
let cy;

// add Confetto objects to arrays to draw them
let confetti = [];

// colors, back side is darker for confetti flipping
const colors = [
    { front: 'tomato', back: '#a53e2b' },
    { front: 'pink', back: '#916c72' },
    { front: 'lightblue', back: '#6e8992' },
    { front: 'steelblue', back: '#2a4c68' }
];

// helper function to pick a random number within a range
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// helper function to get initial velocities for confetti
// this weighted spread helps the confetti look more realistic
function initConfettoVelocity(xRange, yRange) {
    const range = yRange[1] - yRange[0] + 1;
    let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range);
    if (y >= yRange[1] - 1) {
        // Occasional confetto goes higher than the max
        y += (Math.random() < .25) ? randomRange(1, 3) : 0;
    }
    return {
        x: randomRange(xRange[0], xRange[1]),
        y: -y
    };
}

// Confetto Class
function Confetto() {
    this.randomModifier = randomRange(0, 99);
    this.color = colors[Math.floor(randomRange(0, colors.length))];
    this.dimensions = {
        x: randomRange(5, 9),
        y: randomRange(8, 15),
    };
    this.position = {
        // x: canvas.width / 2,
        x: randomRange(origin.offsetLeft, origin.offsetLeft + origin.offsetWidth),
        y: origin.offsetTop + origin.offsetHeight
        // y: randomRange(canvas.height / 2 - origin.offsetHeight / 2, canvas.height / 2 - (1.2 * origin.offsetHeight) - 8),
    };
    this.rotation = randomRange(0, 2 * Math.PI);
    this.scale = {
        x: 1,
        y: 1,
    };
    this.velocity = initConfettoVelocity([-9, 9], [6, 11]);
}

// draws the elements on the canvas
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((confetto, index) => {
        const width = (confetto.dimensions.x * confetto.scale.x);
        const height = (confetto.dimensions.y * confetto.scale.y);

        // move canvas to position and rotate
        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);

        // update confetto "physics" values
        confetto.update();

        // get front or back fill color
        ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

        // draw confetto
        ctx.fillRect(-width / 2, -height / 2, width, height);

        // reset transform matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    })

    // remove confetti that fall off the screen
    // must be done in seperate loops to avoid noticeable flickering
    confetti.forEach((confetto, index) => {
        if (confetto.position.y >= canvas.height) confetti.splice(index, 1);
    })

    window.requestAnimationFrame(render);
}

// add elements to arrays to be drawn
function burst() {
    for (let i = 0; i < confettiCount; i++) {
        confetti.push(new Confetto());
    }
}

$(document).ready(function () {
    origin = document.getElementById('current_player');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cx = ctx.canvas.width / 2;
    cy = ctx.canvas.height / 2;

    Confetto.prototype.update = function () {
        // apply forces to velocity
        this.velocity.x -= this.velocity.x * dragConfetti;
        this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity);
        this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

        // set position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // spin confetto by scaling y and set the color, .09 just slows cosine frequency
        this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
    }

    // resize listenter
    $(window).resize(function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cx = ctx.canvas.width / 2;
        cy = ctx.canvas.height / 2;
    });

    render();
});

function endGame_triggerConfetti(elementID) {
    origin = document.getElementById(elementID);
    burst();
}
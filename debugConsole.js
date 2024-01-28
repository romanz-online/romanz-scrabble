const depth = () => ((new Error()).stack.split('\n').length - 2);

function debugConsole(func, message) {
    // let str = '.'.repeat(Math.max(depth() - 7, 0));
    let str = '';
    str += func;
    str += '\t'.repeat(2 - Math.floor(str.length / 8));

    for (let i = 0; i < message.length; i += 80) {
        const piece = message.substring(i, i + 80);
        if (i === 0) {
            str += piece;
        } else {
            // For subsequent pieces, add tabs
            str += `\n\t\t${piece}`;
        }
    }
    console.log(str);
}

module.exports = { debugConsole };
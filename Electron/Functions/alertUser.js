module.exports = info 

function info(text, delay) {
    document.getElementById('Info').innerText = text
    if (delay) {
        setTimeout(function () {document.getElementById('Info').innerText = ''}, delay)
    } else {
        setTimeout(function () {document.getElementById('Info').innerText = ''}, 4000)
    }
    return
}
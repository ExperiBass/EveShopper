module.exports = info 

function info(text) {
    document.getElementById('Info').innerText = text
    setTimeout(function () {document.getElementById('Info').innerText = ''}, 4000)
    return
}
module.exports = parseFit

function parseFit(fit) {
    let array = fit.split('\n')

    for (let i = 0; i < array.length; i++) {
        if (a[i] == '' || a[i].startsWith('[')) {
            array.splice(i, 1)
            i--
        }
    }
    return array
}
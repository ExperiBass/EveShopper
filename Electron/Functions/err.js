module.exports = err

function err(error, info) {

        console.log('caught: ', error.message)
        if (info) {
          alert(`Please report this to the dev, along with what you searched for and what region! \n\n${error}\n${info}`)
        } else {
          alert(`Please report this to the dev, along with what you searched for and what region! \n\n${error}`)
        }
}
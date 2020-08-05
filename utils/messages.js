const date = new Date();

function formatMessage(username, text) { //Formatting a message as an object of username, text and time.
    return {
        username,
        text,
        time: "   " + date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
    }
}

module.exports = formatMessage;
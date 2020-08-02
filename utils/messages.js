const date = new Date();

function formatMessage(username, text) {
    return {
        username,
        text,
        time: "   " + date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
    }
}

module.exports = formatMessage;
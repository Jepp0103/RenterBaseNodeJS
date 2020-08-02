const date = new Date();
const messageDate = date.getDate();
const messageMonth = date.getMonth();
const messageYear = date.getFullYear();

function formatMessage(username, text) {
    return {
        username,
        text,
        time: messageDate + "/" + messageMonth + "/" + messageYear
    }
}

module.exports = formatMessage;
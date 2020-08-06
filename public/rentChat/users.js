const users = [];

//Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) { //Choosing minus 1 if user from index was not found in the array.
        return users.splice(index, 1)[0]; //Returning the array of users without the "not found"-user.
    }
}

//Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room); //Returning the room the user is passed into - filtering through the array.
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}
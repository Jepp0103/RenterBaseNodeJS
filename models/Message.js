const { Model } = require("objection");

const Item = require("./Item.js");
const User = require("./User.js");

class Message extends Model {
    static tableName = "messages";
    
    static relationMappings = {
        users: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: "messages.userId",
                to: "users.id"
            }
        },
        items: {
            relation: Model.BelongsToOneRelation,
            modelClass: Item,
            join: {
                from: "messages.itemId",
                to: "items.itemId"
            }
        }
    }
}

module.exports = Message;
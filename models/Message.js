const { Model } = require("objection");

const Item = require("./Item.js");
const User = require("./User.js");


class Message extends Model {
    static tableName = "messages";
    
    static relationMappings = {
        items: {
            relation: Model.BelongsToOneRelation,
            modelClass: Item,
            join: {
                from: "messages.itemId",
                to: "items.itemId"
            }
        },
        
        users: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: "messages.userId",
                to: "users.id"
            }
        }
    }
}

module.exports = Message;
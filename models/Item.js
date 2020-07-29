const { Model } = require("objection");
const Message = require("./Message.js");
const User = require("./User.js");

class Item extends Model {
    static tableName = "items";
    
    static relationMappings = {
        users: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: "items.userId",
                to: "users.id"
            }
        },
        messages: { 
            relation: Model.HasManyRelation, 
            modelClass: Message,
            join: {
                from: "items.itemId",
                to: "messages.itemId"
            }
        }
    }
}

module.exports = Item;
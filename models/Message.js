const { Model } = require("objection");

const Item = require("./Item.js");

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
    }
}

module.exports = Message;
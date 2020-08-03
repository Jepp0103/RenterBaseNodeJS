const { Model } = require("objection");

const Item = require("./Item.js");
const Message = require("./Message.js");

class User extends Model {
    static tableName = "users";

    static relationMappings = {
        items: {
            relation: Model.HasManyRelation,
            modelClass: Item,
            join: {
                from: "users.id",
                to: "items.userId"
            }
        },
        messages: {
            relation: Model.HasManyRelation,
            modelClass: Message,
            join: {
                from: "users.id",
                to: "messages.userId"
            }
        }
    }
}

module.exports = User;
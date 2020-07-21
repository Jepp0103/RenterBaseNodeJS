const { Model } = require("objection");

const Item = require("./Item.js");

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
        }
    }
}

module.exports = User;
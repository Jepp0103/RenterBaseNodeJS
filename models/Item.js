const { Model } = require("objection");

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
        }
    }
}

module.exports = Item;
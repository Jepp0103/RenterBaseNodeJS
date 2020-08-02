exports.up = function(knex) {
  return knex.schema
    .createTable("users", table => {
        table.increments("id");
        table.string("username").notNullable().unique();
        table.string("password").notNullable().unique();
        table.string("email").notNullable().unique();
        table.string("address");
        table.string("city");
        table.string("zipCode");
        table.integer("userAge");
        table.timestamp("createdAt").defaultTo(knex.fn.now());
    })
    .createTable("items", table => {
        table.increments("itemId");
        table.string("itemName")
        table.string("brand");
        table.string("category");
        table.string("description");
        table.integer("itemAge");
        table.integer("price");
        table.integer("days");
        table.integer("userId").unsigned().notNullable(); //Unsigned - no negative values
        table.foreign("userId").references("users.id");

    })
    .createTable("messages", table => {
        table.increments("messageId");
        table.string("message");
        table.string("time");
        table.integer("itemId").unsigned().notNullable();
        table.foreign("itemId").references("items.itemId");
        table.integer("userId").unsigned().notNullable(); //Unsigned - no negative values
        table.foreign("userId").references("users.id");
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("messages")
        .dropTableIfExists("items")
        .dropTableIfExists("users");
};

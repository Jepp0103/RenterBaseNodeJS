
exports.up = function(knex) {
  return knex.schema
    .createTable("users", table => {
        table.increments("id");
        table.string("username").notNullable().unique();
        table.string("password").notNullable().unique();
        table.string("email").notNullable().unique();
        table.timestamp("createdAt").defaultTo(knex.fn.now());
    })
    .createTable("items", table => {
        table.increments("itemId");
        table.string("name")
        table.string("brand");
        table.string("category");
        table.string("description");
        table.integer("age");
        table.integer("price");
        table.integer("userId").unsigned().notNullable(); //Unsigned - no negative values
        table.foreign("userId").references("users.id");
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("items")
        .dropTableIfExists("users");
};

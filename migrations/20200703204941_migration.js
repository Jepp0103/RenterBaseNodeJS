
exports.up = function(knex) {
  return knex.schema
    .createTable("users", table => {
        table.increments("id");
        table.string("username").notNullable().unique();
        table.string("password").notNullable().unique();
        table.string("email").notNullable().unique();
        table.timestamp("createdAt").defaultTo(knex.fn.now());
    })
    .createTable("bikes", table => {
        table.increments("bikeId");
        table.string("brand");
        table.string("type");
        table.string("description");
        table.integer("age");
        table.integer("userId").unsigned().notNullable(); //Unsigned - no negative values
        table.foreign("userId").references("users.id");
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("bikes")
        .dropTableIfExists("users");
};

-- Active: 1667896726254@@127.0.0.1@3306

PRAGMA foreign_keys;

CREATE TABLE ingredient(  
    id      INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name    NVARCHAR(100) NOT NULL
);

CREATE TABLE category(
    id      INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name    NVARCHAR(100) NOT NULL
);

CREATE TABLE branch(
    id      INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name    NVARCHAR(100) NOT NULL
);

CREATE TABLE recipe(
    id          INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name        NVARCHAR(100) NOT NULL,
    image_path  VARCHAR(255),
    description text
);

CREATE Table recipe_ingredient (    
    recipe_id       INTEGER NOT NULL,
    ingredient_id   INTEGER NOT NULL,
    quantity        INTEGER NOT NULL,
    section         TINYINT,
    order_no        TINYINT NOT NULL,

    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(id) ON DELETE CASCADE
);

CREATE Table category_recipe (
    recipe_id          INTEGER NOT NULL,
    category_id        INTEGER NOt NULL,
    PRIMARY KEY (recipe_id, category_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

CREATE Table branch_recipe (
    recipe_id          INTEGER NOT NULL,
    branch_id          INTEGER NOt NULL,
    PRIMARY KEY (recipe_id, branch_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branch(id) ON DELETE CASCADE
);

CREATE Table planner (
    id          INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    day         TINYINT NOT NULL,
    recipe_id   INTEGER NOT NULL,
    branch_id   INTEGER NOT NULL,
    quantity    INTEGER NOT NULL,

    FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branch(id)
);

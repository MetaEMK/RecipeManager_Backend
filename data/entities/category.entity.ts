import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToMany, JoinTable, Unique } from "typeorm";
import { Recipe } from "./recipe.entity.js";

@Entity()
@Unique(["name"])
export class Category {
    // ATTRIBUTES
    // ID
    @PrimaryGeneratedColumn()
    id!: number;

    // Name
    @Column({
        type: "nvarchar",
        length: 100
    })
    name!: string;

    // JUNCTION TABLES
    // Categories_Recipes
    @ManyToMany(() => Recipe, (recipe) => recipe.categories)
    @JoinTable({
        name: "categories_recipes",
        joinColumn: {
            name: "category_id"
        },
        inverseJoinColumn: {
            name: "recipe_id"
        }
    })
    recipes!: Relation<Recipe>[];
}
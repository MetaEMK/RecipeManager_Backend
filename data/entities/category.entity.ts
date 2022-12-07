import { Entity, PrimaryGeneratedColumn, Column, Relation, Unique, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Recipe } from "./recipe.entity.js";

@Entity()
@Unique(["name"])
export class Category {
    /**
     * Attributes
     */
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 100
    })
    name!: string;

    /**
     * Junction tables
     */
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

    /**
     * Timestamps
     */
    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
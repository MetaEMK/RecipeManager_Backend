import { Entity, PrimaryGeneratedColumn, Column, Relation, Unique, Like, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, FindOperator } from "typeorm";
import { Branch } from "./branch.entity.js";
import { Recipe } from "./recipe.entity.js";

@Entity()
@Unique(["name"])
@Unique(["slug"])
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 100
    })
    name!: string;

    @Column({
        type: "nvarchar"
    })
    slug!: string;

    /**
     * Non database attribute.
     * Needed to add additonal data to the entity for response purposes.
     */
    recipeBranches?: Branch[];

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

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "updated_at"
    })
    updatedAt!: Date;
}
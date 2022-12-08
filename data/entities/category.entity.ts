import { Entity, PrimaryGeneratedColumn, Column, Relation, Unique, Like, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, FindOperator } from "typeorm";
import { Recipe } from "./recipe.entity.js";

@Entity()
@Unique(["name"])
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 100
    })
    name!: string;

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

    /**
     * Returns an object with Category filter criteria.
     * 
     * @param name Searches entries with a similiar name attribute
     * @returns Object with specified where statements
     */
    public static getFilter(name: string|undefined): Object
    {
        const where: Record<string, FindOperator<string>> = {};

        if(name) {
            where.name = Like(`%${ name }%`);
        }

        return where;
    }
}
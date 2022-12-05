import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, ManyToMany, JoinTable, Unique, Like, FindOperator } from "typeorm";
import { Recipe } from "./recipe.entity.js";
import { ScheduledItem } from "./scheduled_item.entity.js";

@Entity()
@Unique(["name"])
export class Branch {
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

    // Slug
    @Column({
        type: "nvarchar",
        length: 100
    })
    slug!: string;

    // FOREIGN KEY REFERENCES
    // ScheduleItems
    @OneToMany(() => ScheduledItem, (scheduledItem) => scheduledItem.branch)
    scheduledItems!: Relation<ScheduledItem>[];

    // JUNCTION TABLES
    // Branches_Recipes
    @ManyToMany(() => Recipe, (recipe) => recipe.branches)
    @JoinTable({
        name: "branches_recipes",
        joinColumn: {
            name: "branch_id"
        },
        inverseJoinColumn: {
            name: "recipe_id"
        }
    })
    recipes!: Relation<Recipe>[];

    /**
     * Returns an object with Branch filter criteria. 
     * 
     * @param name Searches entries with a similiar name attribute.
     * @returns Object with specified where statements.
     */
    public static getFilter(name: string|undefined): Object 
    {
        const where: Record<string, FindOperator<string>> = {}

        if(name) {
            where.name = Like(`%${ name }%`)
        }

        return where;
    }
}
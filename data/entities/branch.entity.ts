import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, ManyToMany, JoinTable, Unique } from "typeorm";
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
}
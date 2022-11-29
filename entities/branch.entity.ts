import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Recipe } from "./recipe.entity.js";
import { ScheduledItem } from "./scheduled_item.entity.js";

@Entity()
export class Branch {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 100
    })
    name!: string;

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

    @OneToMany(() => ScheduledItem, (scheduledItem) => scheduledItem.branch)
    scheduledItems!: Relation<ScheduledItem>[];
}
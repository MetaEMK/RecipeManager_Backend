import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, Unique, Like, FindOperator, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Category } from "./category.entity.js";
import { Recipe } from "./recipe.entity.js";
import { ScheduledItem } from "./scheduled_item.entity.js";

@Entity()
@Unique(["name"])
@Unique(["slug"])
export class Branch {
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

    @Column({
        type: "nvarchar",
        length: 100
    })
    slug!: string;

    /**
     * Non database attributes.
     * Needed to add additonal data to the entity for response purposes.
     */
    recipe_categories?: Category[];

    /**
     * Junction tables
     */
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
     * Foreign key references
     */
    @OneToMany(() => ScheduledItem, (scheduledItem) => scheduledItem.branch)
    scheduledItems!: Relation<ScheduledItem>[];

    /**
     * Timestamps
     */
    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    /**
     * Returns an object with Branch filter criteria.
     * 
     * @param name Searches entries with a similiar name attribute
     * @returns Object with specified where statements
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
import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Recipe } from "./recipe.entity.js";
import { ScheduledItem } from "./scheduled_item.entity.js";
import { Size } from "./size.entity.js";
import { VariantIngredient } from "./variant_ingredient.entity.js";

@Entity()
export class Variant {
    // ATTRIBUTES
    // ID
    @PrimaryGeneratedColumn()
    id!: number;

    // Name
    @Column()
    name!: string;

    // Description
    @Column({
        type: "text",
        nullable: true
    })
    description!: string

    // FOREIGN KEYS
    // Recipe
    @ManyToOne(() => Recipe, (recipe) => recipe.variants, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "recipe_id"
    })
    recipe!: Relation<Recipe>;

    // Size
    @ManyToOne(() => Size, (size) => size.variants, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "basic_size_id"
    })
    basicSize!: Relation<Size>;

    // FOREIGN KEY REFERENCES
    // Scheduled items
    @OneToMany(() => ScheduledItem, (scheduledItem) => scheduledItem.variant)
    scheduledItems!: Relation<ScheduledItem>[];

    // Variant ingredients
    @OneToMany(() => VariantIngredient, (variantIngredient) => variantIngredient.variant)
    variantIngredients!: Relation<VariantIngredient>[];
}
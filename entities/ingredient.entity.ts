import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany } from "typeorm";
import { VariantIngredient } from "./variant_ingredient.entity.js";

@Entity()
export class Ingredient {
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
    // Variant ingredients
    @OneToMany(() => VariantIngredient, (variantIngredient) => variantIngredient.ingredient)
    variantIngredients!: Relation<VariantIngredient>[];
}
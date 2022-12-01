import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, Unique } from "typeorm";
import { VariantIngredient } from "./variant_ingredient.entity.js";

@Entity()
@Unique(["name"])
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
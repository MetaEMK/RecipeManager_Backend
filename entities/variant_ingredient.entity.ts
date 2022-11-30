import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn } from "typeorm";
import { Ingredient } from "./ingredient.entity.js";
import { Variant } from "./variant.entity.js";

@Entity()
export class VariantIngredient {
    // ATTRIBUTES
    // ID
    @PrimaryGeneratedColumn()
    id!: number;

    // Quantity
    @Column()
    quantity!: number;

    // Unit
    @Column({
        type: "nvarchar",
        length: 10
    })
    unit!: string;

    // Section
    @Column({
        type: "tinyint"
    })
    section!: number;

    // Order number
    @Column({
        name: "order_number",
        type: "smallint"
    })
    orderNumber!: number;

    // FOREIGN KEYS
    // Ingredient
    @ManyToOne(() => Ingredient, (ingredient) => ingredient.variantIngredients, {
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "ingredient_id"
    })
    ingredient!: Relation<Ingredient>;

    // Variant
    @ManyToOne(() => Variant, (variant) => variant.variantIngredients, {
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "variant_id"
    })
    variant!: Relation<Variant>;
}
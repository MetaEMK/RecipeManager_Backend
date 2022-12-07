import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { Ingredient } from "./ingredient.entity.js";
import { Variant } from "./variant.entity.js";

@Entity()
export class VariantIngredient {
    /**
     * Attributes
     */
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quantity!: number;

    @Column({
        type: "nvarchar",
        length: 10
    })
    unit!: string;

    @Column({
        type: "tinyint"
    })
    section!: number;

    @Column({
        name: "order_number",
        type: "smallint"
    })
    orderNumber!: number;

    /**
     * Foreign keys
     */
    @ManyToOne(() => Ingredient, (ingredient) => ingredient.variantIngredients, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "ingredient_id"
    })
    ingredient!: Relation<Ingredient>;

    @ManyToOne(() => Variant, (variant) => variant.variantIngredients, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "variant_id"
    })
    variant!: Relation<Variant>;

    /**
     * Timestamps
     */
    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
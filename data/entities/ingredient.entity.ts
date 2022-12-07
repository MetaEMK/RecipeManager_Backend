import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { VariantIngredient } from "./variant_ingredient.entity.js";

@Entity()
@Unique(["name"])
export class Ingredient {
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

    /**
     * Foreign key references
     */
    @OneToMany(() => VariantIngredient, (variantIngredient) => variantIngredient.ingredient)
    variantIngredients!: Relation<VariantIngredient>[];

    /** 
     * Timestamps
     */
    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
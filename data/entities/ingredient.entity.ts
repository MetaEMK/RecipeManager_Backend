import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { VariantIngredient } from "./variant_ingredient.entity.js";

@Entity()
@Unique(["name"])
export class Ingredient {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 100
    })
    name!: string;

    @OneToMany(() => VariantIngredient, (variantIngredient) => variantIngredient.ingredient)
    variantIngredients!: Relation<VariantIngredient>[];

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "updated_at"
    })
    updatedAt!: Date;
}
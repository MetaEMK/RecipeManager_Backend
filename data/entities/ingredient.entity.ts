import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, Unique, CreateDateColumn, UpdateDateColumn, FindOperator, Like } from "typeorm";
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

    /**
     * Returns an object with Ingredient filter criteria.
     * 
     * @param name Searches entries with a similiar name attribute
     * @returns Object with specified where statements
     */
        public static getFilter(name: string|undefined): object 
        {
            const where: Record<string, FindOperator<string>> = {}
    
            if(name) {
                where.name = Like(`%${ name }%`);
            }
    
            return where;
        }
}
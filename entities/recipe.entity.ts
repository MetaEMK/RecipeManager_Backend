import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToMany, OneToMany } from "typeorm";
import { Branch } from "./branch.entity.js";
import { Category } from "./category.entity.js";
import { Variant } from "./variant.entity.js";

@Entity()
export class Recipe {
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

    // Image URL
    @Column({
        nullable: true
    })
    image_path!: string

    // FOREIGN KEY REFERENCES
    // Variants
    @OneToMany(() => Variant, (variant) => variant.recipe)
    variants!: Relation<Variant>[];

    // JUNCTION TABLE REFERENCES
    // Branches_Recipes
    @ManyToMany(() => Branch, (branch) => branch.recipes, {
        onDelete: "CASCADE"
    })
    branches!: Relation<Branch>[];

    // Categories_Recipes
    @ManyToMany(() => Category, (category) => category.recipes, {
        onDelete: "CASCADE"
    })
    categories!: Relation<Category>[];
}
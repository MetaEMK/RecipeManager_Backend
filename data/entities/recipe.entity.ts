import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, Unique, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { Branch } from "./branch.entity.js";
import { Category } from "./category.entity.js";
import { Variant } from "./variant.entity.js";

@Entity()
@Unique(["name"])
export class Recipe {
    /**
     * Attributes
     */
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({
        type: "text",
        nullable: true
    })
    description!: string

    @Column({
        nullable: true
    })
    image_path!: string

    /**
     * Foreign key references
     */
    @OneToMany(() => Variant, (variant) => variant.recipe)
    variants!: Relation<Variant>[];

    /**
     * Junction table references
     */
    @ManyToMany(() => Branch, (branch) => branch.recipes)
    branches!: Relation<Branch>[];

    @ManyToMany(() => Category, (category) => category.recipes)
    categories!: Relation<Category>[];

    /**
     * Timestamps
     */
    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
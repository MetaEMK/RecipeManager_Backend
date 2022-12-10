import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, Unique, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { Branch } from "./branch.entity.js";
import { Category } from "./category.entity.js";
import { Variant } from "./variant.entity.js";

@Entity()
@Unique(["name"])
@Unique(["slug"])
export class Recipe {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 100
    })
    name!: string;

    @Column({
        type: "text",
        nullable: true
    })
    description!: string

    @Column({
        name: "image_path",
        nullable: true
    })
    imagePath!: string

    @Column({
        type: "nvarchar",
        length: 100
    })
    slug!: string;

    @ManyToMany(() => Branch, (branch) => branch.recipes)
    branches!: Relation<Branch>[];

    @ManyToMany(() => Category, (category) => category.recipes)
    categories!: Relation<Category>[];

    @OneToMany(() => Variant, (variant) => variant.recipe)
    variants!: Relation<Variant>[];

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "updated_at"
    })
    updatedAt!: Date;
}
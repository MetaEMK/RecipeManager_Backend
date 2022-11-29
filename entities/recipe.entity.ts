import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToMany } from "typeorm";
import { Branch } from "./branch.entity.js";

@Entity()
export class Recipe {
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

    @ManyToMany(() => Branch, (branch) => branch.recipes, {
        onDelete: "CASCADE"
    })
    branches!: Relation<Branch>[];
}
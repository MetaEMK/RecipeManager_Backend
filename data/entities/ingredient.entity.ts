import { Entity, Column, Relation, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique, PrimaryColumn } from "typeorm";
import { Variant } from "./variant.entity.js";

@Entity()
@Unique(["variant_id", "section", "order"])
@Unique(["variant_id", "name", "section"])
export class Ingredient {
    @PrimaryColumn({
        type: "nvarchar"
    })
    name!: string

    @Column()
    quantity!: number;

    @Column({
        type: "nvarchar",
        length: 10
    })
    unit!: string;

    @PrimaryColumn({
        type: "tinyint"
    })
    section!: number;

    @PrimaryColumn({
        name: "order",
        type: "smallint"
    })
    order!: number;

    @PrimaryColumn()
    variant_id!: number;

    @ManyToOne(() => Variant, (variant) => variant.ingredients, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "variant_id"
    })
    variant!: Relation<Variant>;

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "updated_at"
    })
    updatedAt!: Date;
}
import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Variant } from "./variant.entity.js";

@Entity()
export class VariantIngredient {
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
        name: "order",
        type: "smallint"
    })
    order!: number;

    @ManyToOne(() => Variant, (variant) => variant.variantIngredients, {
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
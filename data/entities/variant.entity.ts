import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { Recipe } from "./recipe.entity.js";
import { ScheduledItem } from "./scheduled_item.entity.js";
import { Size } from "./size.entity.js";
import { VariantIngredient } from "./variant_ingredient.entity.js";

@Entity()
export class Variant {
    /** Attributes */
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({
        type: "text",
        nullable: true
    })
    description!: string

    /**
     * Foreign keys
     */
    @ManyToOne(() => Recipe, (recipe) => recipe.variants, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "recipe_id"
    })
    recipe!: Relation<Recipe>;

    @ManyToOne(() => Size, (size) => size.variants, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "size_id"
    })
    size!: Relation<Size>;

    /**
     * Foreign key references
     */
    @OneToMany(() => ScheduledItem, (scheduledItem) => scheduledItem.variant)
    scheduledItems!: Relation<ScheduledItem>[];

    @OneToMany(() => VariantIngredient, (variantIngredient) => variantIngredient.variant)
    variantIngredients!: Relation<VariantIngredient>[];

    /**
     * Timestamps
     */
    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { Recipe } from "./recipe.entity.js";
import { ScheduledItem } from "./scheduled_item.entity.js";
import { Size } from "./size.entity.js";
import { Ingredient } from "./ingredient.entity.js";
import { ConversionType } from "./conversion_type.entity.js";

@Entity()
@Unique(["name", "recipe.id"])
export class Variant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 30
    })
    name!: string;

    @Column({
        type: "text",
        nullable: true
    })
    description!: string|null

    @ManyToOne(() => Recipe, (recipe) => recipe.variants, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "recipe_id"
    })
    recipe!: Relation<Recipe>;

    @ManyToOne(() => ConversionType, (conversionType) => conversionType.variants, {
        nullable: false
    })
    @JoinColumn({
        name: "conversion_type_id"
    })
    conversionType!: Relation<ConversionType>;

    @ManyToOne(() => Size, (size) => size.variants, {
        nullable: false
    })
    @JoinColumn({
        name: "size_id"
    })
    size!: Relation<Size>;

    @OneToMany(() => ScheduledItem, (scheduledItem) => scheduledItem.variant)
    scheduledItems!: Relation<ScheduledItem>[];

    @OneToMany(() => Ingredient, (ingredient) => ingredient.variant, {
        cascade: true
    })
    ingredients!: Relation<Ingredient>[];

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "updated_at"
    })
    updatedAt!: Date;
}
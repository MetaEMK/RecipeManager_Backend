import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn } from "typeorm";
import { Days } from "../enums/days.enum.js";
import { Branch } from "./branch.entity.js";
import { Size } from "./size.entity.js";
import { Variant } from "./variant.entity.js";

@Entity()
export class ScheduledItem {
    // ATTRIBUTES
    // ID
    @PrimaryGeneratedColumn()
    id!: number;

    // Day
    @Column({
        enum: Days,
        type: "tinyint"
    })
    day!: Days;

    // Quantity
    @Column()
    quantity!: number;

    // FOREIGN KEYS
    // Branch
    @ManyToOne(() => Branch, (branch) => branch.scheduledItems, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ 
        name: "branch_id" 
    })
    branch!: Relation<Branch>;

    // Variant
    @ManyToOne(() => Variant, (variant) => variant.scheduledItems, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "variant_id"
    })
    variant!: Relation<Variant>;
    
    // Size
    @ManyToOne(() => Size, (size) => size.scheduledItems, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "size_id"
    })
    size!: Relation<Size>;
}
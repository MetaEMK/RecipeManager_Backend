import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { Days } from "../../enums/Days.enum.js";
import { Branch } from "./branch.entity.js";
import { Size } from "./size.entity.js";
import { Variant } from "./variant.entity.js";

@Entity()
export class ScheduledItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        enum: Days,
        type: "tinyint"
    })
    day!: Days;

    @ManyToOne(() => Branch, (branch) => branch.scheduledItems, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ 
        name: "branch_id"
    })
    branch!: Relation<Branch>;

    @ManyToOne(() => Variant, (variant) => variant.scheduledItems, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "variant_id"
    })
    variant!: Relation<Variant>;
    
    @ManyToOne(() => Size, (size) => size.scheduledItems, {
        nullable: false
    })
    @JoinColumn({
        name: "size_id"
    })
    size!: Relation<Size>;

    @Column()
    quantity!: number;

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "updated_at"
    })
    updatedAt!: Date;
}
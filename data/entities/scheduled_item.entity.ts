import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { Days } from "../../enums/Days.enum.js";
import { Branch } from "./branch.entity.js";
import { Size } from "./size.entity.js";
import { Variant } from "./variant.entity.js";

@Entity()
export class ScheduledItem {
    /**
     * Attributes
     */
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        enum: Days,
        type: "tinyint"
    })
    day!: Days;

    @Column()
    quantity!: number;

    /**
     * Foreign keys
     */
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
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "size_id"
    })
    size!: Relation<Size>;

    /**
     * Timestamps
     */
    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
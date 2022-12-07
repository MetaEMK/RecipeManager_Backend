import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, OneToMany, JoinColumn, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Conversion } from "./conversion.entity.js";
import { ConversionType } from "./conversion_type.entity.js";
import { ScheduledItem } from "./scheduled_item.entity.js";
import { Variant } from "./variant.entity.js";

@Entity()
export class Size {
    /**
     * Attributes
     */
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 100
    })
    name!: string;

    /**
     * Foreign keys
     */
    @ManyToOne(() => ConversionType, (conversionType) => conversionType.sizes, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "conversion_type_id"
    })
    conversionType!: Relation<ConversionType>;

    /**
     * Foreign key references
     */
    @OneToMany(() => Conversion, (conversion) => conversion.fromSize)
    fromConversions!: Relation<Conversion>[];

    @OneToMany(() => Conversion, (conversion) => conversion.toSize)
    toConversions!: Relation<Conversion>[];

    @OneToMany(() => ScheduledItem, (scheduledItem) => scheduledItem.size)
    scheduledItems!: Relation<ScheduledItem>[];

    @OneToMany(() => Variant, (variant) => variant.size)
    variants!: Relation<Variant>[];

    /**
     * Timestamps
     */
    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
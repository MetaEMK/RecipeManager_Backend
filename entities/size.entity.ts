import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Conversion } from "./conversion.entity.js";
import { ConversionType } from "./conversion_type.entity.js";
import { ScheduledItem } from "./scheduled_item.entity.js";
import { Variant } from "./variant.entity.js";

@Entity()
export class Size {
    // ATTRIBUTES
    // ID
    @PrimaryGeneratedColumn()
    id!: number;

    // Name
    @Column({
        type: "nvarchar",
        length: 100
    })
    name!: string;

    // FOREIGN KEYS
    // Conversion type
    @ManyToOne(() => ConversionType, (conversionType) => conversionType.sizes, {
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "conversion_type_id"
    })
    conversionType!: Relation<ConversionType>;

    // FOREIGN KEY REFERENCES
    // From conversion
    @OneToMany(() => Conversion, (conversion) => conversion.fromSize)
    fromConversions!: Relation<Conversion>[];

    // To conversion
    @OneToMany(() => Conversion, (conversion) => conversion.toSize)
    toConversions!: Relation<Conversion>[];

    // Scheduled items
    @OneToMany(() => ScheduledItem, (scheduledItem) => scheduledItem.size)
    scheduledItems!: Relation<ScheduledItem>[];

    // Variants
    @OneToMany(() => Variant, (variant) => variant.basicSize)
    variants!: Relation<Variant>[];
}
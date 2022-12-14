import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, OneToMany, JoinColumn, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Conversion } from "./conversion.entity.js";
import { ConversionType } from "./conversion_type.entity.js";
import { ScheduledItem } from "./scheduled_item.entity.js";
import { Variant } from "./variant.entity.js";

@Entity()
@Unique(["name", "conversionType.id"])
export class Size {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 100
    })
    name!: string;

    @ManyToOne(() => ConversionType, (conversionType) => conversionType.sizes, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "conversion_type_id"
    })
    conversionType!: Relation<ConversionType>;
 
    @OneToMany(() => Conversion, (conversion) => conversion.fromSize)
    fromConversions!: Relation<Conversion>[];

    @OneToMany(() => Conversion, (conversion) => conversion.toSize)
    toConversions!: Relation<Conversion>[];    

    @OneToMany(() => ScheduledItem, (scheduledItem) => scheduledItem.size)
    scheduledItems!: Relation<ScheduledItem>[];

    @OneToMany(() => Variant, (variant) => variant.size)
    variants!: Relation<Variant>[];

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "updated_at"
    })
    updatedAt!: Date;
}
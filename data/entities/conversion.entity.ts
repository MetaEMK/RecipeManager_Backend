import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn } from "typeorm";
import { ConversionType } from "./conversion_type.entity.js";
import { Size } from "./size.entity.js";

@Entity()
export class Conversion {
    // ATTRIBUTES
    // ID
    @PrimaryGeneratedColumn()
    id!: number;

    // Multiplicator
    @Column({
        type: "double"
    })
    multiplicator!: number;

    // FOREIGN KEYS
    // Conversion type
    @ManyToOne(() => ConversionType, (conversionType) => conversionType.conversions, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "conversion_type_id"
    })
    conversionType!: Relation<ConversionType>;

    // From size
    @ManyToOne(() => Size, (size) => size.fromConversions, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "from_size_id"
    })
    fromSize!: Relation<Size>;

    // To size
    @ManyToOne(() => Size, (size) => size.toConversions, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "to_size_id"
    })
    toSize!: Relation<Size>;
}
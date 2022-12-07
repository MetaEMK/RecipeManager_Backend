import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { ConversionType } from "./conversion_type.entity.js";
import { Size } from "./size.entity.js";

@Entity()
export class Conversion {
    /**
     * Attributes
     */
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "double"
    })
    multiplicator!: number;

    /**
     * Foreign keys
     */
    @ManyToOne(() => ConversionType, (conversionType) => conversionType.conversions, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "conversion_type_id"
    })
    conversionType!: Relation<ConversionType>;

    @ManyToOne(() => Size, (size) => size.fromConversions, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "from_size_id"
    })
    fromSize!: Relation<Size>;

    @ManyToOne(() => Size, (size) => size.toConversions, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "to_size_id"
    })
    toSize!: Relation<Size>;

    /**
     * Timestamps
     */
    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
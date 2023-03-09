import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { ConversionType } from "./conversion_type.entity.js";
import { Size } from "./size.entity.js";

@Entity()
@Unique(["conversionType.id", "fromSize.id", "toSize.id"])
export class Conversion {
    @PrimaryGeneratedColumn()
    id!: number;

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

    @Column({
        type: "double"
    })
    multiplicator!: number;

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "updated_at"
    })
    updatedAt!: Date;
}
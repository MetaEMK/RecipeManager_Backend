import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, Unique, CreateDateColumn, UpdateDateColumn, FindOperator, Like } from "typeorm";
import { Conversion } from "./conversion.entity.js";
import { Size } from "./size.entity.js";
import { Variant } from "./variant.entity.js";

@Entity()
@Unique(["name"])
export class ConversionType {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 20
    })
    name!: string;

    @OneToMany(() => Conversion, (conversion) => conversion.conversionType)
    conversions!: Relation<Conversion>[];
    
    @OneToMany(() => Size, (size) => size.conversionType)
    sizes!: Relation<Size>[];

    @OneToMany(() => Variant, (variant) => variant.conversionType)
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
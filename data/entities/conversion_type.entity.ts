import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, Unique, CreateDateColumn, UpdateDateColumn, FindOperator, Like } from "typeorm";
import { Conversion } from "./conversion.entity.js";
import { Size } from "./size.entity.js";

@Entity()
@Unique(["name"])
export class ConversionType {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 30
    })
    name!: string;

    @OneToMany(() => Conversion, (conversion) => conversion.conversionType)
    conversions!: Relation<Conversion>[];
    
    @OneToMany(() => Size, (size) => size.conversionType)
    sizes!: Relation<Size>[];

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "updated_at"
    })
    updatedAt!: Date;
}
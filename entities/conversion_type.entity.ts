import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany } from "typeorm";
import { Conversion } from "./conversion.entity.js";
import { Size } from "./size.entity.js";

@Entity()
export class ConversionType {
    // ATTRIBUTES
    // ID
    @PrimaryGeneratedColumn()
    id!: number;

    // Name
    @Column({
        type: "nvarchar",
        length: 30
    })
    name!: string;

    // FOREIGN KEY REFERENCES
    // Conversions
    @OneToMany(() => Conversion, (conversion) => conversion.conversionType)
    conversions!: Relation<Conversion>[];
    
    // Sizes
    @OneToMany(() => Size, (size) => size.conversionType)
    sizes!: Relation<Size>[];
}
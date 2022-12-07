import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Conversion } from "./conversion.entity.js";
import { Size } from "./size.entity.js";

@Entity()
@Unique(["name"])
export class ConversionType {
    /**
     * Attributes
     */
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 30
    })
    name!: string;

    /**
     * Foreign key references
     */
    @OneToMany(() => Conversion, (conversion) => conversion.conversionType)
    conversions!: Relation<Conversion>[];
    
    @OneToMany(() => Size, (size) => size.conversionType)
    sizes!: Relation<Size>[];

    /**
     * Timestamps
     */
    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
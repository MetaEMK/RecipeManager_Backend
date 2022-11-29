import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ConversionType {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 30
    })
    name!: string;
}
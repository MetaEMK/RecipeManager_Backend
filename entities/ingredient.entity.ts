import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 100,
        nullable: true
    })
    name!: string;
}
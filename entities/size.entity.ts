import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Size {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "nvarchar",
        length: 100
    })
    name!: string;
}
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Variant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({
        type: "text",
        nullable: true
    })
    description!: string

    @Column({
        nullable: true
    })
    image_path!: string
}
import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne, JoinColumn } from "typeorm";
import { Days } from "../enums/days.enum.js";
import { Branch } from "./branch.entity.js";

@Entity()
export class ScheduledItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        enum: Days,
        type: "tinyint"
    })
    day!: Days;

    @ManyToOne(() => Branch, (branch) => branch.scheduledItems, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ 
        name: "branch_id" 
    })
    branch!: Relation<Branch>;
}
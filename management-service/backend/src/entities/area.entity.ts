import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('area')
export class Area {
    //primary key and automatically generates a value for that field when a new record is inserted into the database.
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column({ default: 0 })
    price_percentage: number;

    @Column()
    description: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @Column()
    deleted_at: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
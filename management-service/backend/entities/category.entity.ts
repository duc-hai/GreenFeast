import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @Column()
    deleted_at: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
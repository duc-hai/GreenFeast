import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('printer')
export class Printer {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    ip_address: string;

    @Column()
    printer_type: number;

    @Column()
    area_id: number;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @Column()
    deleted_at: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
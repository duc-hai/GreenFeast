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

    @Column({ nullable: true })
    area_id: number;

    @Column()
    created_at: Date;

    @Column({ nullable: true })
    updated_at: Date;

    @Column({ nullable: true })
    deleted_at: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
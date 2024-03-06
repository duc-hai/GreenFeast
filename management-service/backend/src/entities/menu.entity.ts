import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('menu')
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    image: string;

    @Column()
    price: number;

    @Column()
    menu_type: number; //0 is none, 1 is food, 2 is baverage

    @Column({ default: true })
    status: boolean;

    @Column()
    category_id: number;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @Column()
    deleted_at: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
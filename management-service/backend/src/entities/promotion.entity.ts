import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('promotion')
export class Promotion {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column({ default: true })
    status: boolean;

    @Column()
    note: string;

    //Convention in form-promotion.json
    @Column()
    form_promotion: number;

    //If it's a discount for the total bill, it's the bill amount. If it's a discount for each specific dish, it's the menu id
    @Column()
    condition_apply: number;

    //If there is a % character, it reduces the price by %, otherwise it reduces the amount directly
    //If it's less than 0, it's mean promotion. Eg: -5% (reduce 5%)
    //If it's greater than 0, it's mean surcharge. Eg: 15% for Tet Holiday
    @Column()
    promotion_value: string;

    @Column({ default: true })
    auto_apply: boolean;

    @Column()
    start_at: Date;

    @Column()
    end_at: Date;
 
    @Column()
    created_at: Date;

    @Column({ nullable: true })
    updated_at: Date;

    @Column({ nullable: true })
    deleted_at: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
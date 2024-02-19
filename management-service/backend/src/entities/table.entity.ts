//TypeORM supports the repository design pattern, so each entity has its own repository. These repositories can be obtained from database data sources
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('table')
export class Table {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

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

  // @OneToMany(type => Photo, photo => photo.user)
  // photos: Photo[];
}
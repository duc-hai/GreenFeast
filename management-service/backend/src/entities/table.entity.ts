//TypeORM supports the repository design pattern, so each entity has its own repository. These repositories can be obtained from database data sources
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('table')
export class Table {
    @PrimaryColumn()
    id: string;
    
    @Column()
    area_id: number;

    @Column()
    created_at: Date;

    @Column({ nullable: true })
    updated_at: Date;

    @Column({ nullable: true })
    deleted_at: Date;

    @Column({ default: false })
    isDeleted: boolean;

  // @OneToMany(type => Photo, photo => photo.user)
  // photos: Photo[];
}
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class House {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  rooms: number;

  @Column({ nullable: true })
  bathrooms?: number;

  @Column({ nullable: true })
  squareMeters?: number;

  @Column({ nullable: true })
  price?: number;

}
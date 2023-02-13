import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Lists {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain_id: number;

  @Column()
  collection_id: string;

  @Column()
  token_id: string;

  @Column()
  creator_address: string;

  @Column()
  collection_name: string;

  @Column()
  name: string;

  @Column()
  seller: string;

  @Column()
  price: number;

  @Column()
  coin_type: string;

  @Column()
  coin_denominator: string;
}

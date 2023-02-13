import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain_id: number;

  @Column()
  collection_id: string;

  @Column()
  creator_address: string;

  @Column()
  collection_name: string;

  @Column()
  description: string;

  @Column()
  supply: number;

  @Column()
  version: number;

  @Column()
  metadata_uri: string;
}

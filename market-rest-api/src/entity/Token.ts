import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain_id: number;

  @Column()
  token_id: string;

  @Column()
  collection_id: string;

  @Column()
  creator_address: string;

  @Column()
  collection_name: string;

  @Column()
  name: string;

  @Column()
  supply: number;

  @Column()
  version: number;

  @Column()
  royalty_points_numerator: number;

  @Column()
  royalty_points_denominator: number;

  @Column()
  metadata_uri: string;

  @Column()
  metadata_json: string;

  @Column()
  image: string;
}

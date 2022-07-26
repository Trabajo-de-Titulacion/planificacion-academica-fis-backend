import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Semestre')
export class SemestreEntity {
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column({ type: 'varchar'})
    abreviatura : string
}
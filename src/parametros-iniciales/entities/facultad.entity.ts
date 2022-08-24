import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TipoAulaEntity } from "./tipo-aula.entity";

@Entity('facultad')
export class FacultadEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({type: 'varchar'})
    nombre: string

    @OneToMany(() => TipoAulaEntity, tipoAula => tipoAula.facultad)
    tiposAulas: TipoAulaEntity[]
}
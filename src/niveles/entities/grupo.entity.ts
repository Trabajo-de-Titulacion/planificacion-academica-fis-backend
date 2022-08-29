import { SemestreEntity } from "src/parametros-iniciales/entities/semestre.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NivelEntity } from "./nivel.entity";

@Entity('grupo')
export class GrupoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @ManyToOne(() => NivelEntity, nivel => nivel.grupos)
    @JoinColumn({name: 'idGrupo'})
    nivel : NivelEntity;
}
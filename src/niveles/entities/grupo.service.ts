import { SemestreEntity } from "src/parametros-iniciales/entities/semestre.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NivelEntity } from "./nivel.service";

@Entity('grupo')
export class GrupoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @ManyToOne(() => NivelEntity, nivel => nivel.grupos)
    @JoinColumn({name: 'idNivel'})
    nivel : NivelEntity;
}
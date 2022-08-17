import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import ESTADO_SEMESTRE from "../types/estado-semestre.type";
import { JornadaLaboralEntity } from "./jornada-laboral.entity";

@Entity('Semestre')
export class SemestreEntity {
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column({ type: 'varchar', unique: true})
    abreviatura : string

    @OneToMany(() => JornadaLaboralEntity, jornada => jornada.semestre)
    jornadas : JornadaLaboralEntity[]

    @Column({ enum: ESTADO_SEMESTRE, default: ESTADO_SEMESTRE.PLANIFICACION_EN_PROGRESO})
    estado: ESTADO_SEMESTRE
}
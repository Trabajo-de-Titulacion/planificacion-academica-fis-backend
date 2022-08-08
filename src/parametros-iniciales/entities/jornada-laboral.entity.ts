import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import DIAS from "../types/dia.type";
import { SemestreEntity } from "./semestre.entity";

@Entity("Jornada_Laboral")
export class JornadaLaboralEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({enum: DIAS})
    dia : DIAS;

    @Column()
    horaInicio : string;

    @Column()
    horaAlmuerzo : string;

    @Column()
    horaFin : string;

    @ManyToOne(() => SemestreEntity, semestre => semestre.jornadas)
    @JoinColumn({ name: 'id_semestre'})
    semestre: SemestreEntity
}
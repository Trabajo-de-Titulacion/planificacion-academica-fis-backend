import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JornadaLaboralEntity } from "./jornada-laboral.entity";

@Entity('Semestre')
export class SemestreEntity {
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column({ type: 'varchar', unique: true})
    abreviatura : string

    @OneToMany(() => JornadaLaboralEntity, jornada => jornada.semestre)
    jornadas : JornadaLaboralEntity[]
}
import { AsignaturaEntity } from "../../../src/asignatura/entities/asignatura.entity";
import { SemestreEntity } from "../../../src/parametros-iniciales/entities/semestre.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('numeroEstudiantesPorSemestre')
export class NumeroEstudiantesPorSemestreEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne( () => SemestreEntity, semestre => semestre.id, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "idSemestre" })
    semestre: SemestreEntity;

    @ManyToOne( () => AsignaturaEntity, asignatura => asignatura.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "idSolicitud" })
    asignatura: AsignaturaEntity;

    @Column()
    numeroEstudiantes: number;
}
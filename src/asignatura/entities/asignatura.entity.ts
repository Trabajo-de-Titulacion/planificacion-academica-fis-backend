import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('asignatura')
export class AsignaturaEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50, unique: true })
    codigo: string;

    @Column({ length: 70 })
    nombre: string;

    @Column({ length: 3 })
    creditos: string;

    @Column({ length: 50 })
    @OneToMany(() => AsignaturaEntity, (asignatura) => asignatura.codigo)
    codigoRequisito: string;

    @Column({ length: 50 })
    @OneToMany(() => AsignaturaEntity, (asignatura) => asignatura.codigo)
    codigoCorrequisito: string;
}
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('asignatura')
export class AsignaturaEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50, unique: true })
    codigo: string;

    @Column({ length: 70 })
    nombre: string;

    @Column()
    creditos: number;
}
import { NivelEntity } from "src/niveles/entities/nivel.service";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('carrera')
export class CarreraEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50, unique: true })
    codigo: string;

    @Column({ length: 50 })
    nombre: string;

    @Column()
    duracion: number;

    @Column({ length: 50 })
    modalidad: string;
}
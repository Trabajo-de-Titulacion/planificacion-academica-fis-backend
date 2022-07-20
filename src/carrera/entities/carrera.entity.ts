import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Carrera {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    codigo: string;

    @Column({ length: 50 })
    nombre: string;

    @Column()
    duracion: number;

    @Column({ length: 50 })
    modalidad: string;
}
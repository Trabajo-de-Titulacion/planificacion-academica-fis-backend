import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Carrera')
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
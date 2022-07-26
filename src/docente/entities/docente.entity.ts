import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Docente {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    nombreCompleto: string;

    @Column({ length: 60 })
    correoElectronico: string;

    @Column({ length: 25 })
    codigoIngreso: string;
}
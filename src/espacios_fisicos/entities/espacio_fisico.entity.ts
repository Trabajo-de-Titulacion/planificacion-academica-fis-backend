import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Espacio_Fisico')
export class EspacioFisicoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 30})
    nombre: string;

    @Column({length: 30})
    tipo: string;

    @Column()
    aforo: number;
}
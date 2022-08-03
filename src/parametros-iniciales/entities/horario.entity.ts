import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import DIAS from "../types/dia.type";

@Entity('Horario')
export class HorarioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: "varchar"})
    dia: DIAS

    @Column({ type: "varchar"})
    horaInicio: string

    @Column({ type: "varchar"})
    horaFin: string
}
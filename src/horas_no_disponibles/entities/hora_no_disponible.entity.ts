import { DocenteEntity } from "../../../src/docente/entities/docente.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Hora_No_Disponible')
export class HoraNoDisponibleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 30})
    dia: string;

    @Column()
    hora_inicio: number;

    @ManyToOne( () => DocenteEntity, docente => docente.id )
    @JoinColumn({ name: "docente_id" })
    docente_id: DocenteEntity;
}
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class HoraNoDisponible {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 30})
    dia: string;

    @Column()
    hora_inicio: number;

    // @ManyToOne(type => Docente)
    // @JoinColumn({ name: "docente_id" })
    // docente: Docente
    @Column()
    docente_id: string;
}
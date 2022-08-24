import { TipoAulaEntity } from "../../../src/parametros-iniciales/entities/tipo-aula.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('espacioFisico')
export class EspacioFisicoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 30, unique: true })
    nombre: string;

    @ManyToOne( () => TipoAulaEntity, tipo => tipo.id )
    @JoinColumn({ name: "tipo_id" })
    tipo: TipoAulaEntity;

    @Column()
    aforo: number;
}
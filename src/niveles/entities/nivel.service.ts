import { CarreraEntity } from "src/carrera/entities/carrera.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GrupoEntity } from "./grupo.service";

@Entity('nivel')
export class NivelEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @OneToMany(() => GrupoEntity, grupo => grupo.nivel)
    grupos : GrupoEntity[]
}
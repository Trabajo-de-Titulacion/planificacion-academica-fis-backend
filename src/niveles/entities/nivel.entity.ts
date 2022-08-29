import { CarreraEntity } from "src/carrera/entities/carrera.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GrupoEntity } from "./grupo.entity";

@Entity('nivel')
export class NivelEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @OneToMany(() => GrupoEntity, grupo => grupo.nivel)
    grupos : GrupoEntity[]

    @ManyToOne( () => CarreraEntity, carrera => carrera.niveles)
    @JoinColumn({name: 'idCarrera'})
    carrera: CarreraEntity
}
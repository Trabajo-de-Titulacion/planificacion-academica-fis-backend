import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GrupoEntity } from "./grupo.entity";

@Entity('nivel')
export class NivelEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @OneToMany(() => GrupoEntity, grupo => grupo.nivel)
    grupos : GrupoEntity[]
}
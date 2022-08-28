import { RolUsuarioEntity } from "../../../src/auth/entities/rol-usuario.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { HorarioEntity } from "src/horario/entities/horario.entity";

@Entity('usuario')
export class UsuarioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    correo: string

    @Column()
    clave: string

    @OneToMany(() => RolUsuarioEntity, rolUsuario => rolUsuario.usuario)
    rolesUsuario: RolUsuarioEntity[]

    @OneToMany(() => HorarioEntity, horario => horario.usuario)
    horarios: HorarioEntity[]
}
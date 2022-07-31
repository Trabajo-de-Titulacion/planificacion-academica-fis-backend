import { RolUsuarioEntity } from "src/auth/entities/rol-usuario.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Usuario')
export class UsuarioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    correo: string

    @Column()
    clave: string

    @OneToMany( () => RolUsuarioEntity, rolUsuario => rolUsuario.usuario)
    rolesUsuario : RolUsuarioEntity[]
}
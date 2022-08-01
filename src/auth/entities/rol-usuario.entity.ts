import { UsuarioEntity } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolEntity } from "./rol.entity";

@Entity('Rol_Usuario')
export class RolUsuarioEntity {

    @Column({
        name: "id_user_rol",
        unique: true,
        nullable: false,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne( () => RolEntity, rol => rol.acciones )
    @JoinColumn({ name: 'id_rol'})
    rol: RolEntity;

    @ManyToOne( () => UsuarioEntity, usuario => usuario.rolesUsuario)
    @JoinColumn({ name: 'id_usuario'})
    usuario: UsuarioEntity;
}
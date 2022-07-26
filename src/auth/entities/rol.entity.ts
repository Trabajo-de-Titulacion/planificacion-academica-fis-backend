import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AccionEntity } from "./accion.entity";
import { RolUsuarioEntity } from "./rol-usuario.entity";

@Entity('Rol')
export class RolEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre : string;

    @OneToMany( () => RolUsuarioEntity, rolUsuario => rolUsuario.rol)
    rolesUsuarios : RolUsuarioEntity[];

    @OneToMany( () => AccionEntity, accion => accion.rol )
    acciones: AccionEntity[];
}
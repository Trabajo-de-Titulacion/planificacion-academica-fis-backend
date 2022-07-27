import { UsuarioEntity } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolEntity } from "./rol.entity";

@Entity('Rol_Usuario')
export class RolUsuarioEntity {

    @Column({
        name: "id_user_rol",
        unique: true,
        nullable: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;


}
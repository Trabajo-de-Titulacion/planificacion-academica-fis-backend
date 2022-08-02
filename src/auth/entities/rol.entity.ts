import ROLES from "src/utils/types/rol.type";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AccionEntity } from "./accion.entity";
import { RolUsuarioEntity } from "../../../src/auth/entities/rol-usuario.entity";

@Entity('Rol')
export class RolEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false, })
    nombre: ROLES;

    @OneToMany(() => AccionEntity, accion => accion.rol)
    acciones: AccionEntity[];
}
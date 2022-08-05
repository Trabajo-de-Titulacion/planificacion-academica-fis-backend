import ROLES from "src/utils/types/rol.type";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Rol')
export class RolEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false, })
    nombre: ROLES;
}
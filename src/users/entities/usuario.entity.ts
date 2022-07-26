import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Usuario')
export class UsuarioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    correo: string

    @Column()
    clave: string
}
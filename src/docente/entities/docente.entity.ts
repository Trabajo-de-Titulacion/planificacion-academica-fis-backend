import { UsuarioEntity } from "../../../src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Docente')
export class DocenteEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    nombreCompleto: string;

    @Column({ length: 60, unique: true })
    correoElectronico: string;

    @OneToOne(() => UsuarioEntity) @JoinColumn()
    usuario: UsuarioEntity;
}
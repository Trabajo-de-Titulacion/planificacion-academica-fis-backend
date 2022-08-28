import { UsuarioEntity } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("horario")
export class HorarioEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: "varchar"})
    fechaCreacion: Date

    @Column({type: "text"})
    horarioJson : string

    @ManyToOne( () => UsuarioEntity, usuario => usuario.horarios)
    @JoinColumn({name: "idUsuario"})
    usuario : UsuarioEntity
}
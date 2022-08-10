import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FacultadEntity } from "./facultad.entity";

@Entity('TipoAula')
export class TipoAulaEntity {
    @PrimaryGeneratedColumn('uuid')
    public id : string;

    @Column()
    public tipo : string;

    @ManyToOne( () => FacultadEntity, facultad => facultad.tiposAulas, {
        onDelete: "CASCADE"
    })
    facultad : FacultadEntity;
}
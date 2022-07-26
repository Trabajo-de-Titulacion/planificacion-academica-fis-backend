import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolEntity } from "./rol.entity";

@Entity('Action')
export class AccionEntity {
    
    @Column('id_action')
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column()
    name : string;

    @ManyToOne( () => RolEntity, rol => rol.acciones)
    @JoinColumn({ name: 'id_rol' })
    rol : RolEntity;
}
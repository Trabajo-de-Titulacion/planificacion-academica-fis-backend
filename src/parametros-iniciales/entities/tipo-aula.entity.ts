import { ActividadEntity } from '../../actividades/entities/actividad.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FacultadEntity } from './facultad.entity';

@Entity('tipoAula')
export class TipoAulaEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public tipo: string;

  @ManyToOne(() => FacultadEntity, (facultad) => facultad.tiposAulas, {
    onDelete: 'CASCADE',
  })
  facultad: FacultadEntity;

  @OneToMany(() => ActividadEntity, (actividades) => actividades.tipoAula)
  actividades?: ActividadEntity[];
}

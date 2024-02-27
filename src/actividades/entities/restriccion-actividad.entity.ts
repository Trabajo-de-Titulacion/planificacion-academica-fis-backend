import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActividadEntity } from './actividad.entity';
import { EspacioFisicoEntity } from 'src/espacios_fisicos/entities/espacio_fisico.entity';

@Entity('restriccion_actividad')
export class RestriccionActividadEntity {
  //@PrimaryGeneratedColumn('uuid')

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ActividadEntity, (actividad) => actividad.restricciones)
  @JoinColumn({
    name: 'idActividad',
  })
  actividad: ActividadEntity;

  @Column()
  dia: string;

  @Column()
  hora: string;

  @ManyToOne(() => EspacioFisicoEntity, (espacio) => espacio.restricciones)
  @JoinColumn({
    name: 'idEspacioFisico',
  })
  espacioFisico: EspacioFisicoEntity;
}

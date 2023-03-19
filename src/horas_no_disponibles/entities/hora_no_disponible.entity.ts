import { JornadaLaboralEntity } from '../../../src/parametros-iniciales/entities/jornada-laboral.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SolicitudHoraNoDisponibleEntity } from './solicitudHoraNoDisponible.entity';

@Entity('horaNoDisponible')
export class HoraNoDisponibleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JornadaLaboralEntity, (jornada) => jornada.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dia_id' })
  dia: JornadaLaboralEntity;

  @Column()
  hora_inicio: number;

  @ManyToOne(
    () => SolicitudHoraNoDisponibleEntity,
    (solicitud) => solicitud.id,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'idSolicitud' })
  solicitud: SolicitudHoraNoDisponibleEntity;
}

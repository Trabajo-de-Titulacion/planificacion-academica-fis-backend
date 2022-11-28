import { DocenteEntity } from '../../../src/docente/entities/docente.entity';
import { SemestreEntity } from '../../../src/parametros-iniciales/entities/semestre.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ESTADO_SOLICITUD_HORA_NO_DISPONIBLE from '../types/estadoSolicitudHoraNoDisponible.type';
import { HoraNoDisponibleEntity } from './hora_no_disponible.entity';

@Entity('solicitudHoraNoDisponible')
export class SolicitudHoraNoDisponibleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DocenteEntity, (docente) => docente.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idDocente' })
  docente: DocenteEntity;

  @Column({ default: new Date() })
  ultimaModificacion: Date;

  @ManyToOne(() => SemestreEntity, (semestre) => semestre.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idSemestre' })
  semestre: SemestreEntity;

  @Column({
    enum: ESTADO_SOLICITUD_HORA_NO_DISPONIBLE,
    default: ESTADO_SOLICITUD_HORA_NO_DISPONIBLE.POR_REVISAR,
  })
  estado: ESTADO_SOLICITUD_HORA_NO_DISPONIBLE;

  @OneToMany(
    () => HoraNoDisponibleEntity,
    (horaNoDisponible) => horaNoDisponible.solicitud,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      cascade: ['insert', 'update'],
    },
  )
  horasNoDisponibles: HoraNoDisponibleEntity[];

  get estaAprobada(): boolean {
    return this.estado == ESTADO_SOLICITUD_HORA_NO_DISPONIBLE.APROBADA;
  }
}

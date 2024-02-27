import { DocenteEntity } from 'src/docente/entities/docente.entity';
import { JornadaLaboralEntity } from '../../../src/parametros-iniciales/entities/jornada-laboral.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('horaNoDisponible')
export class HoraNoDisponibleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JornadaLaboralEntity, (jornada) => jornada.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'jornada_id' })
  jornada: JornadaLaboralEntity;

  @Column()
  hora_inicio: number;

  @ManyToOne(() => DocenteEntity, (docente) => docente.horasNoDisponibles)
  @JoinColumn({ name: 'docente_id' })
  docente: DocenteEntity;
}

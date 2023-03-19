import { AsignaturaEntity } from '../../asignatura/entities/asignatura.entity';
import { DocenteEntity } from '../../../src/docente/entities/docente.entity';
import { GrupoEntity } from '../../../src/niveles/entities/grupo.entity';
import { TipoAulaEntity } from '../../../src/parametros-iniciales/entities/tipo-aula.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('actividad')
export class ActividadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  estado: boolean; // true for active

  @Column()
  duracion: number;

  @Column()
  numeroEstudiantes: number;

  @ManyToOne(() => DocenteEntity, (docente) => docente.actividades)
  @JoinColumn({
    name: 'idDocente',
  })
  docente: DocenteEntity;

  @ManyToOne(() => TipoAulaEntity, (tipo) => tipo.actividades)
  @JoinColumn({
    name: 'idTipoAula',
  })
  tipoAula: TipoAulaEntity;

  @ManyToOne(() => AsignaturaEntity, (asignatura) => asignatura.actividades)
  @JoinColumn({
    name: 'idAsignatura',
  })
  asignatura: AsignaturaEntity;

  @ManyToOne(() => GrupoEntity, (grupo) => grupo.actividades)
  @JoinColumn({
    name: 'idGrupo',
  })
  grupo: GrupoEntity;
}

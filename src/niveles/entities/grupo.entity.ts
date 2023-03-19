import { ActividadEntity } from '../../actividades/entities/actividad.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NivelEntity } from './nivel.entity';

@Entity('grupo')
export class GrupoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  nombre: string;

  @Column({
    default: 20,
  })
  numeroEstudiantes: number;

  @ManyToOne(() => NivelEntity, (nivel) => nivel.grupos)
  @JoinColumn({ name: 'idGrupo' })
  nivel: NivelEntity;

  @OneToMany(() => ActividadEntity, (actividad) => actividad.grupo)
  actividades: ActividadEntity[];
}

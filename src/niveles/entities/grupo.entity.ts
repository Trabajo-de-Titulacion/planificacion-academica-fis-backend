import { ActividadEntity } from 'src/actividades/entities/actividad.entity';
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

  @ManyToOne(() => NivelEntity, (nivel) => nivel.grupos)
  @JoinColumn({ name: 'idGrupo' })
  nivel: NivelEntity;

  @OneToMany(() => ActividadEntity, (actividad) => actividad.grupo)
  actividades: ActividadEntity[];
}

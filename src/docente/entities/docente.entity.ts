import { UsuarioEntity } from '../../../src/usuarios/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActividadEntity } from '../../actividades/entities/actividad.entity';

@Entity('docente')
export class DocenteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  nombreCompleto: string;

  @Column({ length: 60, unique: true })
  correoElectronico: string;

  @OneToOne(() => UsuarioEntity)
  @JoinColumn()
  usuario?: UsuarioEntity;

  @OneToMany(() => ActividadEntity, (actividades) => actividades.docente)
  actividades?: ActividadEntity[];
}

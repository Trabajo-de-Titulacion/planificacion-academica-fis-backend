import { ActividadEntity } from 'src/actividades/entities/actividad.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('asignatura')
export class AsignaturaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 7, unique: true })
  codigo: string;

  @Column({ length: 80 })
  nombre: string;

  @Column()
  creditos: number;

  @OneToMany(() => ActividadEntity, (actividades) => actividades.asignatura)
  actividades: ActividadEntity[];
}

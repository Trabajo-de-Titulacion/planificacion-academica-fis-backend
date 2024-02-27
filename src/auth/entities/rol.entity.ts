import ROLES from 'src/utils/types/rol.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rol')
export class RolEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  nombre: ROLES;
}

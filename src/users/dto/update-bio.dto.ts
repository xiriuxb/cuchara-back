import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateBioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300) // Puedes ajustar el máximo según tu necesidad
  bio: string;
}

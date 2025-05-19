import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  Max,
  ValidateNested,
  MinLength,
  MaxLength,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class IngredientDto {
  @ApiProperty({ description: 'Nombre del ingrediente' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(128)
  name: string;

  @ApiProperty({ description: 'Cantidad del ingrediente' })
  @IsNumber()
  @IsPositive()
  @Max(999)
  quantity: number;

  @ApiProperty({ description: 'Unidad de medida' })
  @IsInt()
  @Min(1)
  unit: number;

  @ApiProperty({ description: 'ID del ingrediente (opcional)', required: false })
  @IsOptional()
  @IsString()
  @IsMongoId()
  id?: string;
}

export class CreateRecipeDto {
  @ApiProperty({ description: 'Nombre de la receta' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(128)
  name: string;

  @ApiProperty({ description: 'Descripción de la receta', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(512)
  description?: string;

  @ApiProperty({ description: 'Número de porciones' })
  @IsInt()
  @IsPositive()
  portions: number;

  @ApiProperty({ description: 'Tiempo de preparación en minutos' })
  @IsInt()
  @IsPositive()
  minutes: number;

  @ApiProperty({ description: 'Nivel de dificultad' })
  @IsInt()
  @Min(1)
  @Max(5)
  dificulty: number;

  @ApiProperty({ description: 'Proceso de preparación' })
  @IsString()
  @IsNotEmpty()
  process: string;

  @ApiProperty({ description: 'Lista de ingredientes' })
  @IsString()
  @Type(()=>String)
  ingredients: string;
}


export class ParsedCreateRecipeDto {
  @ApiProperty({ description: 'Nombre de la receta' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descripción de la receta', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Número de porciones' })
  @IsInt()
  @IsPositive()
  portions: number;

  @ApiProperty({ description: 'Tiempo de preparación en minutos' })
  @IsInt()
  @IsPositive()
  minutes: number;

  @ApiProperty({ description: 'Nivel de dificultad' })
  @IsInt()
  @Min(1)
  @Max(5)
  dificulty: number;

  @ApiProperty({ description: 'Proceso de preparación' })
  @IsString()
  @IsNotEmpty()
  process: string;

  @ApiProperty({ type: [IngredientDto], description: 'Lista de ingredientes' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  // Aquí asumimos que usas @UseInterceptors(FileInterceptor(...)) en el controlador
  @IsNotEmpty()
  image: Express.Multer.File;
}
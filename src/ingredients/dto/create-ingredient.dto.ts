import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { IngredientStatus } from '../schemas/ingredient.schema';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class CreateCustomIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class StoreIngredientDto {
  name: string;
  description?: string;
  imageUrl?: string;
  status: IngredientStatus;
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/recipe-create.dto';
import { CreateRecipeSwagger } from './swagger/recipe.swagger';
import { FileUploadPipe } from './pipes/file-upload.pipe';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateIngredientDto } from 'src/ingredients/dto/create-ingredient.dto';

@ApiTags('recipes')
@ApiBearerAuth()
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @CreateRecipeSwagger
  @ApiResponse({ status: 201, description: 'Receta creada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(
    @Body() createRecipeDto: CreateRecipeDto,
    @UploadedFile(FileUploadPipe)
    image: Express.Multer.File,
    @Request() req,
  ) {
    let ingredientsP = [];
    try {
      ingredientsP = JSON.parse(createRecipeDto.ingredients);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(
        'Invalid ingredients format. Expected JSON string',
      );
    }

    const ingredientsInstances = plainToInstance(
      CreateIngredientDto,
      ingredientsP,
      { enableImplicitConversion: true },
    );
    const errors = ingredientsInstances.flatMap((ingredient) =>
      validateSync(ingredient),
    );

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const dto = {
      ...createRecipeDto,
      ingredients: ingredientsP,
      image,
    };
    return this.recipeService.createRecipe(dto, req.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las recetas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de recetas obtenida exitosamente',
  })
  findAll() {
    return this.recipeService.findAll();
  }

  @Get('/my')
  @ApiOperation({ summary: 'Obtener recetas de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de recetas del usuario obtenida exitosamente',
  })
  async getMyRecipes(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('cursor') cursorId?: string,
  ) {
    const parsedLimit = Math.min(Number(limit) || 10, 50);
    return this.recipeService.getRecipesByUser(
      req.userId,
      parsedLimit,
      cursorId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una receta por ID' })
  @ApiResponse({ status: 200, description: 'Receta encontrada' })
  @ApiResponse({ status: 404, description: 'Receta no encontrada' })
  findOne(@Param('id') id: string) {
    return this.recipeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una receta' })
  @ApiResponse({ status: 200, description: 'Receta actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Receta no encontrada' })
  update(@Param('id') id: string, @Body() updateRecipeDto: any) {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una receta' })
  @ApiResponse({ status: 200, description: 'Receta eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Receta no encontrada' })
  remove(@Param('id') id: string) {
    return this.recipeService.remove(id);
  }

  @Get('/user/:username')
  @ApiOperation({ summary: 'Obtener recetas de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de recetas del usuario obtenida exitosamente',
  })
  async getRecipesByUser(
    @Param('username') username: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursorId?: string,
  ) {
    const parsedLimit = Math.min(Number(limit) || 10, 50);
    return this.recipeService.getRecipesByUsername(
      username,
      parsedLimit,
      cursorId,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateCustomIngredientDto,
  CreateIngredientDto,
  StoreIngredientDto,
} from './dto/create-ingredient.dto';
import { Ingredient } from './schemas/ingredient.schema';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(Ingredient.name) private ingredientModel: Model<Ingredient>,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    const createdIngredient = new this.ingredientModel(createIngredientDto);
    return createdIngredient.save();
  }

  async findAll() {
    return this.ingredientModel.find().exec();
  }

  async findOne(id: string) {
    return this.ingredientModel.findById(id).exec();
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientModel
      .findByIdAndUpdate(id, updateIngredientDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.ingredientModel.findByIdAndDelete(id).exec();
  }

  private async getByName(name: string) {
    return await this.ingredientModel.findOne({
      name: new RegExp(`^${name}$`, 'i'),
      status: { $ne: 'rejected' },
    });
  }

  private async storeNewIngredient(dto: StoreIngredientDto, ownerId: string) {
    const createdIngredient = new this.ingredientModel({
      ...dto,
      owner: ownerId,
    });
    return createdIngredient.save();
  }

  async createCustomOrReturnExistent(
    createIngredientDto: CreateCustomIngredientDto,
    ownerId: string,
  ) {
    return await this.ingredientModel.findOneAndUpdate(
      { name: new RegExp(`^${createIngredientDto.name}$`, 'i') },
      { $setOnInsert: { ...createIngredientDto, status: 'pending', ownerId } },
      { upsert: true, new: true },
    );
  }

  async createCustomIngredient(
    createIngredientDto: CreateCustomIngredientDto,
    ownerId: string,
  ) {
    const exists = await this.getByName(createIngredientDto.name);
    if (exists) {
      throw new ConflictException('Ya existe un ingrediente con ese nombre');
    }
    return await this.storeNewIngredient(
      { ...createIngredientDto, status: 'pending' },
      ownerId,
    );
  }

  async selectExistingIngredient(ingredientId: string) {
    const ingredient = await this.ingredientModel.findOne({
      _id: ingredientId,
      status: 'approved',
    });
    if (!ingredient) {
      throw new NotFoundException('Ingrediente no encontrado o no aprobado');
    }
    return ingredient;
  }
}

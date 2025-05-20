import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from 'src/recipe/recipe.schema';

@Module({
  controllers: [FeedController],
  providers: [FeedService],
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
  ],
})
export class FeedModule {}

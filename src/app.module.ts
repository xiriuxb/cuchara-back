import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { IngredientsModule } from './ingredients/ingredients.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeModule } from './recipe/recipe.module';
import { RecipeController } from './recipe/recipe.controller';
import { ClerkModule } from './clerk/clerk.module';
import { UserModule } from './users/user.module';
import { UserController } from './users/user.controller';
import { FeedModule } from './feed/feed.module';
import { FollowModule } from './follows/follow.module';
import { FollowController } from './follows/follow.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CommentModule } from './comment/comment.module';
import { CommentController } from './comment/comment.controller';
import { LikesController } from './likes/like.controller';
import { LikesModule } from './likes/like.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    AuthModule,
    IngredientsModule,
    RecipeModule,
    ClerkModule,
    UserModule,
    FeedModule,
    FollowModule,
    CommentModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        'auth/*',
        'ingredients/*',
        RecipeController,
        UserController,
        FollowController,
        CommentController,
        LikesController,
      );
  }
}

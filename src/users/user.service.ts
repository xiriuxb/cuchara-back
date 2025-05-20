import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { ClerkUserCreatedEvent } from 'src/types/clerk';
import clerkClient from '@clerk/clerk-sdk-node';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async handleUserCreated(data: ClerkUserCreatedEvent) {
    const { id, username, email_addresses, first_name, last_name, image_url } =
      data;
    const email = email_addresses?.[0]?.email_address;
    const user_name =
      username == null ? await this.generateUsername(email) : username;

    const existing = await this.userModel.findOne({ clerkId: id });

    if (existing) {
      await this.userModel.updateOne(
        { clerkId: id },
        {
          username,
          email,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      );
    } else {
      await this.userModel.create({
        clerkId: id,
        username: user_name,
        email,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      });
      await clerkClient.users.updateUser(id, {
        username: user_name,
      });
    }
  }

  async handleUserUpdated(data: any) {
    const { id, username, email_addresses, first_name, last_name, image_url } =
      data;
    const email = email_addresses?.[0]?.email_address;

    await this.userModel.updateOne(
      { clerkId: id },
      {
        username,
        email,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      },
    );
  }

  async handleUserDeleted(data: any) {
    const { id } = data;
    await this.userModel.deleteOne({ clerkId: id });
  }

  private async getUserWithStats(matchQuery: any) {
    const pipeline = [
      // Match inicial
      {
        $match: matchQuery,
      },
      // Lookup para followers
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'following',
          as: 'followers',
        },
      },
      // Lookup para following
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'follower',
          as: 'following',
        },
      },
      // Lookup para recipes
      {
        $lookup: {
          from: 'recipes',
          localField: 'clerkId',
          foreignField: 'createdBy',
          as: 'recipes',
        },
      },
      // Proyectar los campos necesarios con los conteos
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          imageUrl: 1,
          bio: 1,
          clerkId: 1,
          followersCount: { $size: '$followers' },
          followingCount: { $size: '$following' },
          recipesCount: { $size: '$recipes' },
        },
      },
    ];

    const [user] = await this.userModel.aggregate(pipeline).exec();
    return user;
  }

  async getUserProfile(userClerkId: string) {
    return this.getUserWithStats({ clerkId: userClerkId });
  }

  async getUserData(username: string) {
    return this.getUserWithStats({ username });
  }

  async updateBio(userClerkId: string, bio: string) {
    const updated = await this.userModel.findOneAndUpdate(
      { clerkId: userClerkId },
      { bio },
      { new: true },
    );
    return { bio: updated.bio };
  }

  private async generateUsername(email: string) {
    const { nanoid } = await import('nanoid');
    const localPart = email.split('@')[0];
    const base = localPart.toLowerCase().replace(/[^a-z0-9]/g, '');

    const suffix = nanoid(6);
    return `${base}_${suffix}`;
  }
}

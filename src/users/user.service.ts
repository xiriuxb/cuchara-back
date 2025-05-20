import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { nanoid } from 'nanoid';
import { ClerkUserCreatedEvent } from 'src/types/clerk';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async handleUserCreated(data: ClerkUserCreatedEvent) {
    const { id, username, email_addresses, first_name, last_name, image_url } =
      data;
    const email = email_addresses?.[0]?.email_address;
    const user_name =
      username == null ? this.generateUsername(email) : username;

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

  async getUserProfile(userClerkId: string) {
    return await this.userModel.findOne({ clerkId: userClerkId });
  }

  async updateBio(userClerkId: string, bio: string) {
    const updated = await this.userModel.findOneAndUpdate(
      { clerkId: userClerkId },
      { bio },
      { new: true },
    );
    return { bio: updated.bio };
  }

  private generateUsername(email: string): string {
    const localPart = email.split('@')[0];
    const base = localPart.toLowerCase().replace(/[^a-z0-9]/g, '');

    const suffix = nanoid(6);
    return `${base}_${suffix}`;
  }
}

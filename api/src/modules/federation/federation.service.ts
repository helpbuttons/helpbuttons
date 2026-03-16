import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import {
  FEDIFY_FEDERATION,
} from '@fedify/nestjs';
import { Federation } from '@fedify/fedify';
import { Person } from "@fedify/vocab";
import { UserService } from '../user/user.service';
@Injectable()
export class FederationService implements OnModuleInit {
  private initialized = false;

  constructor(
    @Inject(FEDIFY_FEDERATION) private federation: Federation<unknown>,
    private readonly userService: UserService,
  ) { }

  async onModuleInit() {
    if (!this.initialized) {
      await this.initialize();
      this.initialized = true;
    }
  }

  async initialize() {
    this.federation.setNodeInfoDispatcher("/nodeinfo/2.1", async (context) => {
      return {
        software: {
          name: "Fedify NestJS sample",
          version: "0.0.1"
        },
        protocols: ["activitypub"],
        usage: {
          users: {
            total: 0,
            activeHalfyear: 0,
            activeMonth: 0,
            activeDay: 0,
          },
          localPosts: 0,
          localComments: 0,
        },
      }
    });
    this.federation.setActorDispatcher("/users/{identifier}", async (ctx, identifier) => {
      const user = await this.userService.findByUsername(identifier)
      
      if (!user) return null;  // Other than "me" is not found.
      
      return new Person
        ({id: ctx.getActorUri(identifier),
          name: user.name,  // Display name
          summary: user.description,  // Bio
          preferredUsername: user.username
          ,  // Bare handle
          url: new URL("/", ctx.url),
        });
    });

  }

}
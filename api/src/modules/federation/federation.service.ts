import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import {
  FEDIFY_FEDERATION,
} from '@fedify/nestjs';
import { Federation } from '@fedify/fedify';
import { Actor, Follow, Note, Person, Place, Service, Image } from "@fedify/vocab";
import { UserService } from '../user/user.service';
import { StorageService } from '../storage/storage.service';
import { ButtonService } from '../button/button.service';
import configs from '@src/config/configuration';
import { Temporal } from '@js-temporal/polyfill';

const HELPBUTTON_ACTOR_PREFIX = "helpbuttons_";


@Injectable()
export class FederationService implements OnModuleInit {
  private initialized = false;

  constructor(
    @Inject(FEDIFY_FEDERATION) private federation: Federation<unknown>,
    private readonly userService: UserService,
    private readonly storageService: StorageService,
    private readonly buttonService: ButtonService,
  ) { }

  async onModuleInit() {
    if (!this.initialized) {
      await this.initialize();
      this.initialized = true;
    }
  }

  async initialize() {
    /*this.federation.setNodeInfoDispatcher("/nodeinfo/2.1", async (context) => {
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
    */
    this.federation.setActorDispatcher("/u/{identifier}", async (ctx, identifier) => {
      if (identifier.startsWith(HELPBUTTON_ACTOR_PREFIX)) {
        return this.helpButtonActorDispatcher(ctx, identifier)
      }
      return this.userActorDispatcher(ctx, identifier)

    });

    this.federation.setInboxListeners("/users/{identifier}/inbox", "/inbox").on(Follow, async (ctx, follow) => {
      if (follow.id == null || follow.actorId == null || follow.objectId == null) {
        return;
      }
      const parsed = ctx.parseUri(follow.objectId);
      if (parsed?.type !== "actor") return;
      const follower = await follow.getActor(ctx);
      console.debug(follower);
    });

  }

  helpButtonActorDispatcher(ctx, identifier: string): Promise<Service> {
    const id = identifier.replace(HELPBUTTON_ACTOR_PREFIX, '')
    return this.buttonService.findById(id)
      .then((button) => {
        return this.storageService.findFileType(button.image)
        .then((imageType) => {return {...button, imageType: imageType }})
      })
      .then((button) => {
      
        if (!button) return null;
        return new Service
          ({
            id: ctx.getActorUri(identifier),
            name: button.title,  // Display name
            summary: button.description,  // Bio
            published: dateToTemporalInstant(button.created_at),
            icon: this.imageForAP(button.image, button.imageType),
            attribution: new URL(`${configs().WEB_URL}/p/${button.owner.username}`),
            url: new URL("/", ctx.url),
            preferredUsername: identifier,
            // followers
            // inbox
            // outbox
            location: new Place({
              name: button.title,
              latitude: button.latitude,
              longitude: button.longitude
            }),
            discoverable: true,
            contexts: [new URL("https://www.w3.org/ns/activitystreams")],// ,  new { helpbutton: "https://yourapp.example/ns#" }], 
            inbox: ctx.getInboxUri(identifier),
          });
      }).catch(() => null)

  }

  userActorDispatcher(ctx, identifier: string): Promise<Person> {
    const username = identifier;
    return this.userService.findByUsername(username)
      .then((user) => {
        return this.storageService.findFileType(user.avatar)
        .then((imageType) => {return {...user, imageType: imageType }})
      })
      .then((user) => {
        return new Person
          ({
            id: ctx.getActorUri(identifier),
            name: user.name,  // Display name
            summary: user.description,  // Bio
            preferredUsername: user.username,
            url: new URL("/", ctx.url),
            icon: this.imageForAP(user.avatar, user.imageType),
            inbox: ctx.getInboxUri(identifier),  // Inbox URI
          });
      }).catch(() => null)
  }

  imageForAP(image, imageType) {
    if(!image) {
      return null
    }
    return new Image({ url: new URL(`${configs().WEB_URL}/api${image}`), mediaType: imageType})
  }
}


const dateToTemporalInstant = (date: Date): Temporal.Instant => {
  return Temporal.Instant.fromEpochMilliseconds(date.getTime());
}

/*
 // this.federation = createFederation<void>({
    //   kv: new MemoryKvStore(), // You can switch to RedisKvStore later
    // });
    // this.federation.setNodeInfoDispatcher("/nodeinfo/2.1", async (context) => {
    //   return {
    //     software: {
    //       name: "Fedify NestJS sample",
    //       version: "0.0.1"
    //     },
    //     protocols: ["activitypub"],
    //     usage: {
    //       users: {
    //         total: 0,
    //         activeHalfyear: 0,
    //         activeMonth: 0,
    //         activeDay: 0,
    //       },
    //       localPosts: 0,
    //       localComments: 0,
    //     },
    //   }
    // });
    // this.federationPerson.setActorDispatcher("/helpbutton/{identifier}", async (ctx, identifier) => {

    /*const user = await this.userService.findByUsername(identifier)

    if (!user) return null;  // Other than "me" is not found.

    return new Person
      ({
        id: ctx.getActorUri(identifier),
        name: user.name,  // Display name
        summary: user.description,  // Bio
        preferredUsername: user.username
        ,  // Bare handle
        url: new URL("/", ctx.url),
        // icon: user.avatar ? {type: 'Image', mediaType: ''}
      });
  });*/


/*
    // this.federation.setObjectDispatcher(
    //   Note,
    //   "/helpbutton/{noteId}",
    //   async (ctx, { noteId }) => {
    //     // Work with the database to find the note by the author ID and the note ID.
    //     const helpbutton = await this.buttonService.findById(noteId)

    //     if (helpbutton == null) return null;  // Return null if the note is not found.
    //     console.log(helpbutton)
    //     return new Note({
    //       id: ctx.getObjectUri(Note, { userId: helpbutton.owner.username, noteId }),
    //       content: helpbutton.title,
    //       url: new URL("/", ctx.url),
    //       attribution: new URL(`${configs().WEB_URL}/u/${helpbutton.owner.username}`),
    //       published: dateToTemporalInstant(helpbutton.created_at)
    //       // to: ['https://www.w3.org/ns/activitystreams#Public'],
    //       // Many more properties...
    //       // location: {
    //       //   type: 'Place',
    //       //   latitude: post.location.latitude,
    //       //   longitude: post.location.longitude,
    //       //   name: post.location.name || undefined,
    //       // },
    //     });
    //   }
    // );
    /*
        return ctx.createNote({
          id: new URL(postUrl),
          url: new URL(postUrl), // clickable link in clients
          attribution: new URL(`${process.env.CANONICAL_URL}/u/${post.author.username}`),
          published: post.createdAt,
          content: this.escapeHtml(post.content), // your existing safe HTML
          to: ['https://www.w3.org/ns/activitystreams#Public'],
          tag: post.hashtags?.map(tag => ({
            type: 'Hashtag',
            href: new URL(`${process.env.CANONICAL_URL}/explore/hashtag/${tag}`),
            name: `#${tag}`,
          })) || [],
      
          // Optional: Geo coordinates (Mastodon & Pixelfed LOVE this)
          ...(post.location && {
            location: {
              type: 'Place',
              latitude: post.location.latitude,
              longitude: post.location.longitude,
              name: post.location.name || undefined,
            },
          }),
      
          // Optional: Add attachment preview if you have images
          // attachment: post.images?.map(img => ({ type: 'Document', url: img.url, mediaType: 'image/webp' })) || [],
        });*/
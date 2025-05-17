import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { NetworkService } from '../network/network.service';
import configs from '@src/config/configuration';
// import { createFederation, Federation, MemoryKvStore } from '../../../node_modules/@fedify/fedify';
@Injectable()
export class FederationService {
    constructor(private readonly userService: UserService,
        private readonly networkService: NetworkService
    ) { }

    async webfinger(resource: string) {
      // const fedify = await import('../../../node_modules/@fedify/fedify')
      // const federation = createFederation<string>({
      //   kv: new MemoryKvStore()
      //   // Omitted for brevity; see the related section for details.
      // });
        const currentHost = this.getHostName(configs().WEB_URL)
        const fingerprint = this.getFingerPrint(resource)
        if (fingerprint.server != currentHost)
        {
            console.log(fingerprint)
            console.log(currentHost)
            console.log('host doesnt match...')
            return;
        }
        const user = await this.userService.findByUsername(fingerprint.identifier)
        const response = {
            "subject": `acct:${user.username}@${fingerprint.server}`,
            "aliases": [
                this.getActorUri(user.username)
            ],
            "links": [
                {
                    "rel": "self",
                    "href": this.getActorUri(user.username),
                    "type": "application/activity+json"
                },
                {
                    "rel": "http://webfinger.net/rel/profile-page",
                    "href": `${configs().WEB_URL}/`
                }
            ]
        };
        console.log(response)
        return response;
    }

    async users(identifier: string)
    {
        const user = await this.userService.findByUsername(identifier)

        
        const response = {
            '@context': [
                "https://www.w3.org/ns/activitystreams",
                "https://w3id.org/security/v1",
                "https://w3id.org/security/data-integrity/v1",
                "https://www.w3.org/ns/did/v1",
                "https://w3id.org/security/multikey/v1",
                {
                  "alsoKnownAs": {
                    "@id": "as:alsoKnownAs",
                    "@type": "@id"
                  },
                  "manuallyApprovesFollowers": "as:manuallyApprovesFollowers",
                  "movedTo": {
                    "@id": "as:movedTo",
                    "@type": "@id"
                  },
                  "toot": "http://joinmastodon.org/ns#",
                  "Emoji": "toot:Emoji",
                  "featured": {
                    "@id": "toot:featured",
                    "@type": "@id"
                  },
                  "featuredTags": {
                    "@id": "toot:featuredTags",
                    "@type": "@id"
                  },
                  "discoverable": "toot:discoverable",
                  "suspended": "toot:suspended",
                  "memorial": "toot:memorial",
                  "indexable": "toot:indexable",
                  "schema": "http://schema.org#",
                  "PropertyValue": "schema:PropertyValue",
                  "value": "schema:value",
                  "misskey": "https://misskey-hub.net/ns#",
                  "_misskey_followedMessage": "misskey:_misskey_followedMessage",
                  "isCat": "misskey:isCat"
                }
              ],
            "id": this.getActorUri(identifier),
            "type": "Person",
            "inbox": this.getInboxUri(identifier),
            "name": `${user.name}`,
            "preferredUsername": `${identifier}`,
            "summary": `${user.description}`,
            "url": `${configs().WEB_URL}/`,
          }
          console.log(response)
          return response;
    }

    /*
    "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://w3id.org/security/v1",
    "https://w3id.org/security/data-integrity/v1",
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/multikey/v1",
    {
      "alsoKnownAs": {
        "@id": "as:alsoKnownAs",
        "@type": "@id"
      },
      "manuallyApprovesFollowers": "as:manuallyApprovesFollowers",
      "movedTo": {
        "@id": "as:movedTo",
        "@type": "@id"
      },
      "toot": "http://joinmastodon.org/ns#",
      "Emoji": "toot:Emoji",
      "featured": {
        "@id": "toot:featured",
        "@type": "@id"
      },
      "featuredTags": {
        "@id": "toot:featuredTags",
        "@type": "@id"
      },
      "discoverable": "toot:discoverable",
      "suspended": "toot:suspended",
      "memorial": "toot:memorial",
      "indexable": "toot:indexable",
      "schema": "http://schema.org#",
      "PropertyValue": "schema:PropertyValue",
      "value": "schema:value",
      "misskey": "https://misskey-hub.net/ns#",
      "_misskey_followedMessage": "misskey:_misskey_followedMessage",
      "isCat": "misskey:isCat"
    }
  ],
  "id": "https://090679be208bea24ba4ee4dcc5090352.serveo.net/users/me",
  "type": "Person",
  "inbox": "https://090679be208bea24ba4ee4dcc5090352.serveo.net/users/me/inbox",
  "name": "Me",
  "preferredUsername": "me",
  "summary": "This is me!",
  "url": "https://090679be208bea24ba4ee4dcc5090352.serveo.net/"

     */

    getActorUri(identifier)
    {
        return `${configs().WEB_URL}/users/${identifier}`;
    }

    getInboxUri(identifier)
    {
        return `${configs().WEB_URL}/users/${identifier}/inbox`;
    }
    
    getFingerPrint(resource) {
        const regex = /^acct:(.+)@(.+)$/;
        const match = resource.match(regex);

        if (match) {
            return {
                identifier: match[1],
                server: match[2]
            };
        }
    }

    getHostName(url)
    {
        return url.replace(/^https?:\/\//, '');
    }
    
}

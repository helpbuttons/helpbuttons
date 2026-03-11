import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import {
  FEDIFY_FEDERATION,
} from '@fedify/nestjs';
import { Federation } from '@fedify/fedify';

@Injectable()
export class FederationService implements OnModuleInit {
  private initialized = false;

  constructor(
    @Inject(FEDIFY_FEDERATION) private federation: Federation<unknown>,
  ) { }

  async onModuleInit() {
    if (!this.initialized) {
      await this.initialize();
      this.initialized = true;
    }
  }

  async initialize() {
    // this.federation.setNodeInfoDispatcher(async (context) => {
    //   return {
    //     software: {
    //       name: "Fedify NestJS sample",
    //       version: "0.0.1"
    //     }
    //   }
    // });
  }
}

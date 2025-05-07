import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { FediverseService } from "./fediverse.service";
import { FedifyMiddleware } from "./fedify.middleware";

@Module({
  imports: [
  ],
  controllers: [
  ],
  providers: [
    FediverseService
  ],
  exports: [
    FediverseService
  ]
})
export class FediverseModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
      consumer.apply(FedifyMiddleware).forRoutes('*');
    }
  }
  
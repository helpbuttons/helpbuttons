import { createFederation, Federation, MemoryKvStore } from "@fedify/fedify";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FediverseService {
    private fedify: Federation<any>;
    constructor(
    ) {
        this.fedify = createFederation<string>({
            kv: new MemoryKvStore()
            // Omitted for brevity; see the related section for details.
        });
    }

    findUser(userId: string) {
        return userId;
    }
}
import { IsLatitude, IsLongitude, MinLength } from "class-validator";
import { KeyLocation } from "./keylocation.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateKeyLocationDto implements Partial<KeyLocation> {
    @ApiProperty({
      type: String,
      required: true,
    })
    @MinLength(3, {
      message: 'location address is too short',
    })
    address: string;
    
    @IsLatitude({message: 'invalid-latitude'})
    latitude: number;
    
    @IsLongitude({message: 'invalid-longitude'})
    longitude: number;

    zoom: number;
}
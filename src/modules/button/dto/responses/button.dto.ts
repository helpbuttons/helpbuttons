import { Button } from '@prisma/client';

import { ButtonWithRelations } from '../../types/button.type';

export class ButtonResponseDto implements Button {
  id: string;
  latitude: number;
  longitude: number;

  constructor(data: ButtonWithRelations) {
    this.id = data.id;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
  }
}

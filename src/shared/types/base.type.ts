export interface ICustomBaseEntity<T = string> {
  id: T;
  createdAt?: Date;
  updatedAt?: Date;
  agencyId?: string;
}

export abstract class CustomBaseEntity<T = string>
  implements ICustomBaseEntity<T>
{
  id!: T;
  createdAt?: Date;
  updatedAt?: Date;

  static isTenantSupport(): boolean {
    return false;
  }
}

export abstract class CustomTenantBaseEntity<T = string>
  implements ICustomBaseEntity<T>
{
  id!: T;
  createdAt?: Date;
  updatedAt?: Date;
  agencyId!: string;

  static isTenantSupport(): boolean {
    return true;
  }
}

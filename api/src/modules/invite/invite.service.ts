import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Invite } from "./invite.entity";
import { Repository } from "typeorm";
import { InviteCreateDto } from "./invite.dto";
import { dbIdGenerator } from "@src/shared/helpers/nanoid-generator.helper";
import { User } from "../user/user.entity";

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
    
  ) {}

  async create(newInvitation: InviteCreateDto, currentUser: User)
  {
    const invitation: Invite = {
        id: dbIdGenerator(),
        usage: 0,
        maximumUsage: newInvitation.maximumUsage,
        expiration: this.getExpirationDate(newInvitation.expirationTimeInSeconds),
        owner: currentUser,
        deleted: false,
    }

    if (newInvitation.followMe)
    {
        // follow user... somehow.
    }
    console.log(newInvitation)
    return this.inviteRepository.insert([invitation]).then((data) => invitation)
  }

  getExpirationDate(expirationTimeInSeconds): Date{
    
    if(expirationTimeInSeconds < 1)
    {
      return null;
    }
    return new Date(+new Date() + 1000 * expirationTimeInSeconds)
  }

  async find(currentUser: User)
  {
    return this.inviteRepository.find({where: {owner: {id: currentUser.id}}})
  }

  async isInviteCodeValid(inviteCode: string)
  {
    const invite = await this.inviteRepository.findOne({where: {id: inviteCode}})
    if(!invite)
    {
      return false;
    }
    if( invite.maximumUsage > 0 && invite.maximumUsage < invite.usage)
    {
      return false;
    }

    if(invite.expiration && new Date(invite.expiration) < new Date())
    {
      return false;
    }

    await this.inviteRepository.update(invite.id, {...invite, usage: invite.usage + 1 })
    return true;
  }
}

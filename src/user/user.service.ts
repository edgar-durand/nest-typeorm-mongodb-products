import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { getMongoManager, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { IResponse } from "../interfaces/api-interfaces";
import { mapFromDto, reduceEntity } from "../helpers/entity-utils";
import { responseToInterface } from "../helpers/return-utils";

@Injectable()
export class UserService {
  /**
   * set properties to protect and hide from Response
   * add to const HIDDEN values as fields to reduce before Controller Responses.
   */
  private readonly HIDDEN: string[] = ['password', 'token'];
constructor(
  @InjectRepository(User)private userRepository: Repository<User>,
) {}

  /**
   * Create new user
   *
   * @param createUserDTO
   */
  async create(createUserDTO: CreateUserDto): Promise<IResponse>{
    const manager = getMongoManager();
    const { data: { email } } = await this.findByEmail(createUserDTO.email);
    if (email){
      throw new BadRequestException('Email already in use');
    }
    try {
      const user = new User();
      user.active = true;
      user.confirmed = false;
      mapFromDto(user, createUserDTO);
      const newUser = await manager.save(user);
      return responseToInterface({ _id: newUser._id });
    }catch (e) {
      return responseToInterface({}, false, e.message);
    }
  }

  /**
   * List all Users
   */
  async list(): Promise<IResponse>{
  //  TODO: implement pagination
  try {
    const users = (await this.userRepository.find())
      .map((user) => reduceEntity(user, this.HIDDEN))
    return responseToInterface(users);
  }catch (e) {
    return responseToInterface({}, false, e.message)
  }
  }

  async update(): Promise<IResponse>{
  //TODO: Implement
  return
  }

  /**
   * Delete user by Id
   *
   * @param id
   */
  async delete(id: string): Promise<IResponse>{
  try {
    const user = await this.userRepository.findOne(id);
    if (user) {
      await this.userRepository.delete(id);
      return responseToInterface(
        {}, true, `User ${id} deleted successfully.`
      )
    }
    return responseToInterface(
     {}, true, 'The user id not found in database'
    )
  }catch (e) {
    return responseToInterface({}, false, e.message);
  }
  }

  /**
   * Find user by email
   *
   * @param email
   */
  async findByEmail(email: string): Promise<IResponse>{
  try {
    const user = await this.userRepository.findOne({ where: { email } });
    return responseToInterface(user);
  } catch (e) {
    return responseToInterface({}, false, e.message)
  }
  }

  /**
   * Find User by token
   *
   * @param token
   */
  async findByToken(token: string): Promise<IResponse>{
    try {
      const user = await this.userRepository.findOne({ where: { token } });
      return responseToInterface(user);
    } catch (e) {
      return responseToInterface({}, false, e.message)
    }
  }

  /**
   * Find user by Id
   *
   * @param userId
   */
  async findById(userId: string): Promise<IResponse>{
   try {
     const user = await this.userRepository.findOne(userId);
     return responseToInterface(user);
   } catch (e) {
     return responseToInterface({}, false, e.message);
   }
  }

  /**
   * Save the token for user in database
   *
   * @param userId
   * @param token
   * @param force
   */
  async saveTokenToDB(userId: string, token: string, force = false): Promise<void>{
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new NotFoundException();
    if (force){
      user.token = token;
      try {
        await this.userRepository.save(user);
      }catch (e) {
        throw new Error(e.message)
      }
      return
    }
    if (user.token) {
      console.log('Retrieving current token')
      return;
    }
    user.token = token;
    try {
      await this.userRepository.save(user);
    }catch (e) {
      throw new Error(e.message)
    }
  }

  /**
   * SIGN OUT USER FROM SYSTEM
   *
   * @param userId
   */
  async signOut(userId: string): Promise<void>{
    try {
      const { data: user } = await this.findById(userId);
      user.token = null;
      await this.userRepository.save(user);
    } catch (e) {

    }
  }
}

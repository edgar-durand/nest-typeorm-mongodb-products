import { Inject, Injectable, Logger, LoggerService, NotFoundException, UnauthorizedException } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { UserService } from "../user/user.service";
import { User } from "../user/entity/user.entity";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { IResponse } from "../interfaces/api-interfaces";
import { responseToInterface } from "../helpers/return-utils";
import { reduceEntity } from "../helpers/entity-utils";

@Injectable()
export class AuthService {
  /**
   * set properties to protect and hide from Response
   * add to const HIDDEN values as fields to reduce before Controller Responses.
   */
  private readonly HIDDEN: string[] = ["password", "_id", "token"];

  constructor(
    private jwtService: JwtService,
    @Inject(Logger) private readonly logger: LoggerService,
    private userService: UserService
  ) {
  }

  /**
   * Login to system
   *
   * @param credentials
   */
  async signIn(credentials: AuthCredentialDto): Promise<IResponse> {
    const response = await this.generateTokenAndProfile(credentials.email);
    if (!response) {
      this.logger.error("User Not Found!");
      throw new NotFoundException();
    }
    const isMatch = response.profile.validatePassword(credentials.password);
    if (!isMatch) {
      this.logger.error("Invalid Password");
      throw new UnauthorizedException(responseToInterface(
        {}, false, "Invalid Password."
      ));
    }

    await this.saveTokenToDB(response.profile._id, response.token);

    reduceEntity(response.profile, this.HIDDEN);
    return responseToInterface([], response);
  }

  /**
   * Register into the system
   *
   * @param signUpUserDto
   */
  async signUp(signUpUserDto: CreateUserDto): Promise<IResponse> {
    const result = await this.userService.create(signUpUserDto);
    return responseToInterface(result.data, result.result, result.message);

  }

  /**
   * SignOut from system
   *
   * @param userId
   */
  async signOut(userId: string): Promise<IResponse> {
    await this.userService.signOut(userId);
    return responseToInterface();
  }

  /**
   * RENEW TOKEN FOR CURRENT USER
   *
   * @param { string } tokenFromRequest
   */
  async renewToken(tokenFromRequest: string): Promise<IResponse> {
    const { data: user } = await this.userService.findByToken(tokenFromRequest);
    if (!user.id) {
      throw new UnauthorizedException();
    }
    try {
      const token = this.generateToken(user.id);
      await this.saveTokenToDB(user._id, token, true);
      return responseToInterface({ token });
    } catch (e) {
      return responseToInterface(null, false, "fail");
    }
  }

  /***************************************************************************
   *                                VALIDATORS
   **************************************************************************/
  /**
   * USER VALIDATION
   *
   * @param userId
   */
  async validateUser(userId: string): Promise<User> {
    const { data: user } = await this.userService.findById(userId);
    if (!user._id) {
      return null;
    }
    return user;
  }

  /**
   * TOKEN SIGNATURE AND PROFILE GENERATOR
   *
   * @param email
   */
  async generateTokenAndProfile(email: string): Promise<any> {
    const { data: profile } = await this.userService.findByEmail(email);
    if (profile._id) {
      const token = profile.token ? profile.token : this.generateToken(profile._id);
      return {
        profile,
        token
      };
    }
    return null;
  }

  /***************************************************************************
   *                                GENERATORS
   **************************************************************************/

  /**
   * TOKEN GENERATOR
   *
   * @param userId
   */
  generateToken(userId: string): string {
    return this.jwtService.sign({ userId });
  }

  /**
   * SAVE TOKEN TO DATABASE
   *
   * @param userId
   * @param token
   * @param force
   */
  async saveTokenToDB(userId: string, token: string, force = false): Promise<void> {
    await this.userService.saveTokenToDB(userId, token, force);
  }
}

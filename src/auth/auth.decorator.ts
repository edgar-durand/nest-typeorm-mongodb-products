import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JWTPayload } from "../interfaces/api-interfaces";
import { compareToken } from "../validators/token-vaidators";
import { responseToInterface } from "../helpers/return-utils";

/***********************************************************
 *            DECORATOR FOR COMMON USER ROUTES
 ***********************************************************/
export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Partial<JWTPayload> => {
    const { headers: { authorization }, user } = ctx.switchToHttp().getRequest();
    const tokenFromRequest = authorization.replace(/Bearer /, '');
    compareToken(user.token, tokenFromRequest)
    return { ...user, tokenFromRequest };
  }
);

/***********************************************************
 *            DECORATOR FOR ADMIN ROUTES
 ***********************************************************/
export const AdminAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Partial<JWTPayload> => {
    const { headers: { authorization }, user } = ctx.switchToHttp().getRequest();
    const tokenFromRequest = authorization.replace(/Bearer /, '');
    compareToken(user.token, tokenFromRequest)
    let isAdmin = false;
    if (user.roles && user.roles.includes('admin')){
      isAdmin = true;
    }
    if (!isAdmin){
      throw new ForbiddenException(responseToInterface(
        null, false, 'You have not access to this resource.'
      ));
    }
    return user
  }
);

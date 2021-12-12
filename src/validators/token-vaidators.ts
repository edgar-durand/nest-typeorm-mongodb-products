/**
 * COMPARE TOKENS
 *
 * @param { string } currentToken token stored in database
 * @param { string } incomingToken token coming in request
 */
import { UnauthorizedException } from "@nestjs/common";
import { responseToInterface } from "../helpers/return-utils";

export const compareToken = (currentToken: string, incomingToken: string): void => {
  if (!currentToken){
    throw new UnauthorizedException('You must log into system');
  }

  if (incomingToken !== currentToken) {
    throw new UnauthorizedException(responseToInterface(
       {}, false, 'Invalid access token'
    ));
  }
}
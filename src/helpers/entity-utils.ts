import * as bcrypt from 'bcrypt';

/**
 * Hash str
 *
 * @param str
 */
export const hash = async (str: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(str, salt);
}

/**
 * Update entity values accord Dto
 * @param entity
 * @param dto
 */
export const mapFromDto = (entity: any, dto: any): void => {
  Object.keys(dto).forEach((key) => {
    entity[key] = dto[key];
  })
}


/**
 * this function deletes from "entity" keys declared in "reducers" param
 * @param entity
 * @param reducers
 */
export const reduceEntity = <T>(entity: any, reducers: string[]): T => {
  reducers.forEach((toReduce: string) => {
    delete entity[toReduce];
  });
  return entity
}

/**
 * Send user notification by email
 *
 * @param email
 * @param product
 */
export const sendUserNotification = async (email: string, product: string): Promise<void> => {
  console.log(`Email sent to: ${email} for product ${product}`)
//  TODO: Send email to user saying the product is available now
}
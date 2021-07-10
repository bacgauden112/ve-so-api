import { ObjectID } from "typeorm";

export interface ITokenPayload {
  userId: ObjectID;
}

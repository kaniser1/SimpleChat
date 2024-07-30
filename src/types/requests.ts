import { Request } from "express";

export interface IGetUsernameInfoRequest extends Request {
  username?: string;
}

export interface IHandshakeQuery {
  username?: string;
}
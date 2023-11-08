import { NextFunction, Response, Request, RequestHandler } from "express";
declare namespace Express {
  export interface Request {
      user: any;
  }
  export interface Response {
      user: any;
  }
}
export default function tryCatchErr<
  ReqBody,
   Params = never,
   ReqQuery = never,
   ResBody = { message: string, data?: any ,token?:string},
>(fun: RequestHandler<Params, ResBody, ReqBody, ReqQuery>) {
  const tryCatchFun: RequestHandler<
    Params,
    ResBody,
    ReqBody,
    ReqQuery
  > = async (req, res, next) => {
    try {
      await fun(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return tryCatchFun;
}

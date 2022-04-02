import { handlerFactory } from "../common/handler-factory";
import { Job } from "./job.model";

const getJob = handlerFactory.getOne(Job);
const getAll = handlerFactory.getAll(Job);

export { getAll, getJob };

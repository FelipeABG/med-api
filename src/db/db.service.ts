import { Injectable } from "@nestjs/common";
import { PrismaClient } from "../generated/prisma/client.ts";

@Injectable()
export class DBService extends PrismaClient {}

import Fastify from "fastify";
import { fastifyView } from "@fastify/view";
import { fastifyStatic } from "@fastify/static";
import { fastifyFormbody } from "@fastify/formbody";
import { fastifyCookie } from "@fastify/cookie";
import { fastifySession } from "@fastify/session";
import ejs from "ejs";

export class ServerApp {
    constructor(game) {
        this.game = game;
    }
}
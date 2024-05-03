import Fastify from "fastify";
import fs from "fs";
import { fastifyStatic } from "@fastify/static";

export class ServerApp {
    build(logEnabled) {
        const fastify = new Fastify({logger: logEnabled})
        fastify.register(fastifyStatic, { root: new URL('static', import.meta.url) });
        fastify.setNotFoundHandler((request, reply) => this.sendIndex(reply));
        return fastify;
    }

    start(port, logEnabled) {
        const fastify = this.build(logEnabled);
        fastify.listen({ port: port }, (err, address) => {
            if (err) { fastify.log.error(err); process.exit(1) }
        });
    }

    sendIndex(reply) {
        const stream = fs.createReadStream(new URL('static/index.html', import.meta.url));
        reply.code(200).type('text/html').send(stream);
    }
}

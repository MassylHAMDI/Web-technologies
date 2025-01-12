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

    build(logEnabled) {
        const fastify = new Fastify({logger: logEnabled});
        fastify.get("/", (request, reply) => this.getIndex(request, reply));
        fastify.get("/level/:id(^\\d+$)", (request, reply) => this.getLevel(request, reply));
        fastify.setErrorHandler((error, request, reply) => {return this.handleError(error, reply);});
        fastify.setNotFoundHandler((request, reply) => {return this.handleNotFound(reply);});
        fastify.register(fastifyView, {engine: {ejs: ejs}});
        fastify.register(fastifyFormbody);
        fastify.post("/level/:id(^\\d+$)", (request, reply) => this.postWord(request, reply));
        fastify.register(fastifyCookie);
        fastify.register(fastifySession, {secret: '01234567890123456789012345678901', cookie: {secure: 'auto'}});
        return fastify.register(fastifyStatic, { root: new URL('static', import.meta.url) });
      }

    start(port, logEnabled) {
        const fastify = this.build(logEnabled);
        fastify.listen({ port: port }, (err, address) => {
            if (err) { fastify.log.error(err); process.exit(1) }
        });
    }


    // getIndex(request, reply) {
    //     // reply.type('application/json').send(this.game.levels());
    //     // reply.type('text/html').send('<h1>Hello World !</h1>');
    //     reply.view('templates/index.ejs', {
    //         levels: this.game.levels()
    //     });

    // }
    getIndex(request, reply) {
        try {
            reply.view('templates/index.ejs', {
                levels: this.game.levels()
            });
        } catch (error) {
            throw error; 
        }
    }
    getLevel(request, reply) {
        this.resetSessionIfNeeded(request);
        
        const id = parseInt(request.params.id);
        const level = this.game.level(id);
        const letters = this.game.letters(id);
        
        reply.view('templates/level.ejs', {
            level: level,
            letters: letters,
            lines: request.session.lines // Use session lines
        });
    }
    handleError(error, reply) {
        return reply
            .status(500)
            .view('templates/error.ejs', { 
                code: 500, 
                error: error.message 
            });
    }
    
    handleNotFound(reply) {
        return reply
            .status(404)
            .view('templates/error.ejs', { 
                code: 404, 
                error: 'Impossible de trouver cette page' 
            });
    }postWord(request, reply) {
        try {
            this.resetSessionIfNeeded(request);
            
            const id = parseInt(request.params.id);
            const playedWord = request.body.word;
            const line = this.game.computeLine(id, playedWord);
            
            request.session.lines.push(line);
            return reply.redirect(`/level/${id}`);  
        } catch (error) {
            return this.handleError(error, reply);
        }
    }
    resetSessionIfNeeded(request) {
        if (!request.session.levelId || request.params.id !== request.session.levelId) {
            request.session.levelId = request.params.id;
            request.session.lines = [];
        }
    }

    
}
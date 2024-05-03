import { ServerApp }  from "./server-app.js";

const app = new ServerApp();
app.start(5000, true);
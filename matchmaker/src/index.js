import * as Bull from 'bull';
import { matchmake } from './matchmake.js';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-x7RBJz72X56E7bqPT0Wpznwm",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const taskQueue = new Bull.default('taskQueue', process.env.VITE_REDIS_FULL_URL, {
    settings: {
        stalledInterval: 3000, // How often check for stalled jobs (use 0 for never checking).
        guardInterval: 2000, // Poll interval for delayed jobs and added jobs.
        drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
    }
});

taskQueue.process(async (job, done) => {
    console.log(job.data);
    await matchmake(openai);
    await taskQueue.add({
        queue: 'queue',
        id: `${Math.floor(new Date(Date.now() + 15000).getTime()/1000)}`,
    }, {
        delay: 2000,
    });
    done();
});

export default taskQueue;
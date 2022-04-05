import { Client, Intents } from 'discord.js'
import Config from './Config'
import type Event from './Event'
import ReadyEvent from './events/Ready'

export default class Bot {
    private static _instance: Bot
    client!: Client

    private constructor() {
        this.createClient()
    }

    static getInstance(): Bot {
        if (!this._instance) this._instance = new Bot()
        return this._instance
    }

    async login(): Promise<void> {
        const config = await Config.getInstance().getConfig()

        await this.createEvents()

        await this.client.login(config.botToken)
    }

    async createEvents() {
        this.registerEvent(new ReadyEvent())
    }

    async registerEvent(handler: Event): Promise<void> {
        this.client.on(handler.getEventName(), handler.execute)
    }

    private async createClient(): Promise<void> {
        this.client = new Client({
            intents: new Intents(32767),
        })
    }
}

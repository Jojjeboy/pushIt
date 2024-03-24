export class Todo {
    title: string;
    description: string;
    done: boolean;
    uuid: string;
    created: Date;
    lastTouched: Date;

    constructor(obj: any) {

        this.uuid = obj.uuid;
        this.title = obj.title;
        this.description = obj.description;
        this.done = obj.done;
        this.created = obj.created;
        this.lastTouched = obj.lastTouched;
    }

    public getUuid(): string {
        return this.uuid;
    }

    public setUuid(uuid: string): void {
        this.uuid = uuid;
    }

    public getTitle(): string {
        return this.title;
    }

    public setTitle(title: string): void {
        this.title = title;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public getIsDone(): boolean {
        return this.done;
    }

    public setIsDone(done: boolean): void {
        this.done = done;
    }

    public getCreated(): Date {
        return this.created;
    }

    public setCreated(created: Date): void {
        this.created = new Date(created);
    }

    public getLastTouched(): Date {
        return this.lastTouched;
    }

    public setLastTouched(lastTouched: Date): void {
        this.lastTouched = new Date(lastTouched);
    }
}

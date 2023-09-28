export class History {
    value: number;
    date: Date;

    constructor(obj: any) {

        this.value = obj.value;
        this.date = new Date(obj.date);
    }

    public getValue(): number {
        return this.value;
    }

    public setValue(value: number): void {
        this.value = value;
    }

    public getDate(): Date {
        return this.date;
    }

    public setDate(date: Date): void {
        this.date = new Date(date);
    }

}

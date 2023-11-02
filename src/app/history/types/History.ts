export class History {
    value: number;
    goal: number;
    date: Date;

    constructor(obj: any) {

        this.value = obj.value;
        this.goal = obj.goal;
        this.date = new Date(obj.date);
    }

    public getValue(): number {
        return this.value;
    }

    public setValue(value: number): void {
        this.value = value;
    }

    public getGoal(): number {
        return this.goal;
    }

    public setGoal(goal: number): void {
        this.goal = goal;
    }

    public getDate(): Date {
        return this.date;
    }

    public setDate(date: Date): void {
        this.date = new Date(date);
    }

}

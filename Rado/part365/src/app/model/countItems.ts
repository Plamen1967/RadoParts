export class CountItems {
    public countCar?: number;
    public countBus?: number;
    public countTyre?: number;
    public countRim?: number;
    public countTyreWithRim?: number;
    public Total(): number {
        return this.countCar! + this.countBus! + this.countRim! + this.countTyre! + this.countTyreWithRim!;
    }
  }

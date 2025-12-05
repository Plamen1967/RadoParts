export class UserCount
{
    carCount!: number;
    busCount!: number;
    partCarCount!: number;
    partBusCount!: number;
    rimCount!: number;
    tyreCount!: number;
    rimWithTyreCount!: number;

    total() {
        return this.carCount + this.busCount+ this.partCarCount + this.partBusCount+ this.rimCount+ this.tyreCount + this.rimWithTyreCount;

    }
}

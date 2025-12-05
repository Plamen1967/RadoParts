import { ImageData } from "./imageData";

export class StaticData {
    public companyName = "Part365";
    userImages: Map<number, ImageData> = new Map<number, ImageData>();
    getUserImage(userId: number) {
        if (this.userImages.has(userId))  
            return this.userImages.get(userId);
        return undefined;
    }

    addUserImage(userId: number, imageData: ImageData) {
        this.userImages.set(userId, imageData)
    }
}

export const globalStaticData: StaticData = new StaticData();

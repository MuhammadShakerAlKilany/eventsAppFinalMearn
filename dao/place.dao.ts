import { Schema } from "mongoose";
import { Place } from "../interfaces/place.interface";
import { PlaceDaoIntr } from "./interface/placeDao";
import placeModule from "../modules/DB/place.module";

export default class PlaceDao implements PlaceDaoIntr {
    async createPlace(place: Place): Promise<Place | null> {
        return await placeModule.create(place);
    }
    async addAdmin(placeId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId): Promise<Place | null> {
        return await placeModule.findByIdAndUpdate(placeId,{$push:{admins:userId}});
    }
    async removAdmin(placeId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId): Promise<Place | null> {
        return await placeModule.findByIdAndUpdate(placeId,{$pull:{admins:userId}});
    }
    async edit(placeId: Schema.Types.ObjectId, place: Place): Promise<Place | null> {
        return await placeModule.findByIdAndUpdate(placeId,place);;
    }


}
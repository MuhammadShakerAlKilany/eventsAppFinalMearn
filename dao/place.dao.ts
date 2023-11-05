import { ObjectId, Schema } from "mongoose";
import { Place } from "../interfaces/place.interface";
import { PlaceDaoIntr } from "./interface/placeDao";
import placeModule from "../modules/DB/place.module";

export default class PlaceDao implements PlaceDaoIntr {
    async findById(placeId: Schema.Types.ObjectId): Promise<Place | null> {
        return await placeModule.findById(placeId);
    }
    async createPlace(place: Place): Promise<Place | null> {
        return await placeModule.create(place);
    }
    async addAdmin(placeId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId, adminId: ObjectId): Promise<Place | null> {
        return await placeModule.findOneAndUpdate({_id:placeId,admins:adminId}, { $addToSet: { admins: userId } });
    }
    async removAdmin(placeId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId , adminId: ObjectId): Promise<Place | null> {
        return await placeModule.findOneAndUpdate({_id:placeId,admins:adminId}, { $pull: { admins: userId } });
    }
    async edit(placeId: Schema.Types.ObjectId, place: Place,adminId: ObjectId): Promise<Place | null> {
        return await placeModule.findOneAndUpdate({_id:placeId,admins:adminId},{$set:place});;
    }


}
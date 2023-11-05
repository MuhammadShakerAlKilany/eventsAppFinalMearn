import { ObjectId } from "mongoose";
import { Place } from "../../interfaces/place.interface";



export interface PlaceDaoIntr {
    createPlace(place: Place): Promise<Place| null> ,
    addAdmin(placeId: ObjectId, userId: ObjectId,adminId:ObjectId): Promise<Place | null>,
    removAdmin(placeId: ObjectId, userId: ObjectId,adminId:ObjectId): Promise<Place | null>,
    edit(placeId: ObjectId, place: Place,adminId: ObjectId): Promise<Place | null>,
    findById(placeId: ObjectId): Promise<Place | null>,
}
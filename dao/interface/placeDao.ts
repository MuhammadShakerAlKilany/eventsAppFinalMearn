import { ObjectId } from "mongoose";
import { Place } from "../../interfaces/place.interface";



export interface PlaceDaoIntr {
    createPlace(place: Place): Promise<Place| null> ,
    addAdmin(placeId: ObjectId, userId: ObjectId): Promise<Place | null>,
    removAdmin(placeId: ObjectId, userId: ObjectId): Promise<Place | null>,
    edet(placeId: ObjectId, place: Place): Promise<Place | null>,
}
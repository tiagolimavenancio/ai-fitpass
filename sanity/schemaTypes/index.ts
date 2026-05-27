import { type SchemaTypeDefinition } from "sanity";
import { userProfileType } from "./userProfileTypes";
import { activityType } from "./activityType";
import { categoryType } from "./categoryType";
import { classSessionType } from "./classSessionType";
import { bookingType } from "./bookingType";
import { venueType } from "./venueType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    userProfileType,
    venueType,
    categoryType,
    activityType,
    classSessionType,
    bookingType,
  ],
};

import { FIRESTORE_PATH_NAMES } from "../../constants/firestorePaths";

export type ExpenseType = keyof typeof FIRESTORE_PATH_NAMES;

/**
 * Keeps track of incremental session IDs
 * Ensures each new session gets a unique sequential ID
 */

import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    sequence_value: {type: Number, default: 0}
});

export const Counter = mongoose.model("Counter", counterSchema)

export const getNextSessionId = async() => {
    const updatedCounter = await Counter.findByIdAndUpdate(
        "sessionId",
        {$inc: {sequence_value: 1}},
        {new: true, upsert:true}
    );
    return updatedCounter.sequence_value
}
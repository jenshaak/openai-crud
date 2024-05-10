import mongoose from "mongoose";

export const connectToDb = async () => {
    type ConnectionType = {
        isConnected?: boolean;
    };
    const connection: ConnectionType = {};

    try {
        if (connection.isConnected) return;
        const db = await mongoose.connect(process.env.MONGODB_URI!);
        connection.isConnected = db.connections[0].readyState === 1;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Cannot connect to DataBase');
    }
};

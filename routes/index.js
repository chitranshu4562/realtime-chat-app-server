import authenticationRoutes from "./authenticationRoutes.js";
import userRoutes from "./userRoutes.js";
import groupRoutes from "./groupRoutes.js";
import conversationRoutes from "./conversationRoutes.js";

const initialRoutes = (app) => {
    // Use the authentication routes
    app.use('/authentication', authenticationRoutes);

    // Use the user routes
    app.use('/users', userRoutes);

    // Use the group routes
    app.use('/group', groupRoutes);

    // Use the conversation routes
    app.use('/conversation', conversationRoutes);
};

export default initialRoutes;

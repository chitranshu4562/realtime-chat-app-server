import User from "../models/user.js";

export const getContacts = async (req, res, next) => {
    try {
        const { searchTerm } = req.query;
        // query initialization
        let contacts = User.find({
            email: { $ne: req.currentUser.email }
        });

        // apply multiple lines
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            contacts = contacts.where('name').regex(regex);
        }

        // apply ascending sorting
        contacts = contacts.sort({ name: 1 });

        // apply case-insensitivity on sorting
        contacts = contacts.collation({ locale: 'en', strength: 2 });

        // add select statement
        contacts = contacts.select('-password');

        // execute query
        const contactsData = await contacts.exec();
        res.status(200).json({
            message: 'Data retrieved successfully.',
            contacts: contactsData
        })
    } catch (error) {
        next(error);
    }
}

import {validationResult} from "express-validator";
import Group from "../models/group.js";
import User from "../models/user.js";

export const createGroup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.status = 400;
            throw errors.array()[0].msg;
        }

        const name = req.body.name.trim();
        const participants = req.body.participants;
        const creator = req.currentUser;

        const existingGroup = await Group.exists({ name });
        if (existingGroup) {
            throw new Error('Group already exist');
        }

        const group = new Group();
        group.name = name;
        group.creator = creator;

        // insert current user into participants array
        participants.push(creator._id.toString());

        // insert participants
        const groupUsers = [];
        for (const participant of participants) {
            const user = await User.findById(participant);
            if (!user) {
                throw new Error(`User does not exist for ${participant}`);
            }
            groupUsers.push(user);
        }

        group.participants = groupUsers;
        const createdGroup = await group.save();

        // insert groupId into user groups attribute
        for (const participant of participants) {
            const user = await User.findById(participant);
            const userGroups = [...user.groups];
            userGroups.push(createdGroup._id.toString());
            user.groups = userGroups;
            await user.save();
        }

        const groupData = await Group.findById(createdGroup._id)
            .populate('participants', 'name').select('name')
        res.status(201).json({
            message: 'Group is created successfully',
            data: groupData
        });
    } catch (error) {
        next(error);
    }
}

export const getGroups = async (req, res, next) => {
    try {
        const { searchTerm, groupId } = req.query;
        const participant = req.currentUser._id;
        let query = Group.find({participants: {"$in": [participant]}});

        if (groupId) {
            query = query.where('_id').equals(groupId);
        }

        if (searchTerm && searchTerm.trim()) {
            const regex = new RegExp(searchTerm.trim(), 'i');
            query = query.where('name').regex(regex);
        }

        query = query.select('name createdAt').populate('creator', 'name');
        const groups = await query.exec();
        res.status(200).json({
            message: 'Data retrieved successfully',
            data: groups
        })
    } catch (error) {
        next(error);
    }
}

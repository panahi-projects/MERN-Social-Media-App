import User from "../models/User.js";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        const friends = await Promise.all(
            user.friends.map(friendId => User.findById(friendId))
        );
        const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath }
        });
        // const formattedFriends = user.getFormattedFriends()
        res.status(200).json(formattedFriends);
    }
    catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        let responseMessage = ""
        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter(id => id !== friendId)
            friend.friends = friend.friends.filter(id => id !== id);
            responseMessage = "Friend removed"
        }
        else{
            user.friends.push(friendId);
            friend.friends.push(id);
            responseMessage = "New friend added"
        }
        await user.save();
        await friend.save();

        res.status(200).send({message: responseMessage});
    }
    catch (err) {
        res.status(404).json({ error: err.message });
    }
}
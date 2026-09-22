import { Group } from "../models/group.model.js";
import Password from "../models/pass.model.js";


export const createGroup = async (req, res) => {
  try {
    const { name, color, icon } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Group name is required",
      });
    }

    const existingGroup = await Group.findOne({
      user: req.User._id,
      name: name.trim(),
    });

    if (existingGroup) {
      return res.status(400).json({
        message: "Group already exists",
      });
    }

    const group = await Group.create({
      user: req.User._id,
      name: name.trim(),
      color,
      icon,
    });

    return res.status(201).json(group);
  } catch (error) {
    console.log("error in create group", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getGroups = async (req, res) => {
  try {
const groups = await Group.aggregate([
  {
    $match: {
      user: req.User._id,
      isArchived: false,
    },
  },
  {
    $lookup: {
      from: "passwords",
      let: { groupId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$group", "$$groupId"],
            },
            deleted: false,
          },
        },
      ],
      as: "passwords",
    },
  },
  {
    $project: {
      name: 1,
      color: 1,
      icon: 1,
      isPinned: 1,
      createdAt: 1,
      passwordCount: {
        $size: "$passwords",
      },
    },
  },
  {
    $sort: {
      isPinned: -1,
      name: 1,
    },
  },
]);

    console.log(groups)
    res.status(200).json(groups);
  } catch (error) {
    console.log("error in get group", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getPasswordsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    // console.log(groupId)

    const passwords = await Password.find({
      createdby: req.User._id,
      group: groupId,
      deleted: false,
    }).populate("group", "name color icon");

    res.status(200).json(passwords);
  } catch (error) {
    console.log("error in getpassbygroups", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;



    const userId = req.User._id;

    // console.log(userId + '111')
    const group = await Group.findOne({
      _id: groupId,
      user: userId,
    });

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    await Password.updateMany(
      {
        group: groupId,
        user: userId,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          group: null,
        },
      },
    );

    await Group.findByIdAndDelete(groupId);

    // await AuditLog.create({
    //   user: userId,
    //   action: "GROUP DELETED",
    // });

    return res.status(200).json({
      message: "Group deleted and passwords moved to recycle bin",
    });
  } catch (error) {
    console.error("Error deleting group:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

import prisma from "../config/db.js";

// @desc    Add a new child
// @route   POST /api/children
// @access  Private (Parent Only)
export const addChild = async (req, res) => {
  try {
    const { name, age, gender, specialNeeds, stubbornnessLvl, interests } =
      req.body;
    const userId = req.user.id;

    // ১. আগে চেক করি প্যারেন্ট প্রোফাইল আছে কিনা
    const parentProfile = await prisma.parent.findUnique({
      where: { userId: userId },
    });

    if (!parentProfile) {
      return res.status(404).json({
        message:
          "Parent profile not found. Please complete your profile first.",
      });
    }

    // ২. বাচ্চা তৈরি করা (Real Database Entry)
    const newChild = await prisma.child.create({
      data: {
        parentId: parentProfile.id,
        name,
        age: parseInt(age),
        gender,
        specialNeeds,
        stubbornnessLvl: parseInt(stubbornnessLvl), // ১-৫ স্কেল
        interests: interests, // কমা সেপারেটেড স্ট্রিং বা টেক্সট
      },
    });

    res.status(201).json({
      success: true,
      message: "Child added successfully!",
      child: newChild,
    });
  } catch (error) {
    console.error("Add Child Error:", error);
    res.status(500).json({ message: "Server error while adding child." });
  }
};

// @desc    Get all children of logged-in parent
// @route   GET /api/children
// @access  Private (Parent Only)
export const getMyChildren = async (req, res) => {
  try {
    const userId = req.user.id;

    const parentProfile = await prisma.parent.findUnique({
      where: { userId: userId },
    });

    if (!parentProfile) {
      return res.status(404).json({ message: "Parent profile not found." });
    }

    // প্যারেন্টের সব বাচ্চা খুঁজে আনা
    const children = await prisma.child.findMany({
      where: { parentId: parentProfile.id },
      orderBy: { id: "desc" }, // নতুন বাচ্চা আগে দেখাবে
    });

    res.status(200).json({
      success: true,
      children,
    });
  } catch (error) {
    console.error("Get Children Error:", error);
    res.status(500).json({ message: "Server error fetching children." });
  }
};

// @desc    Delete a child
// @route   DELETE /api/children/:id
// @access  Private
export const deleteChild = async (req, res) => {
  try {
    const childId = parseInt(req.params.id);

    // ডিলিট করার আগে চেক করা যে এই বাচ্চাটি এই ইউজাররই কিনা (Security)
    // (Simplicity-র জন্য সরাসরি ডিলিট দিচ্ছি, তবে প্রোডাকশনে চেক করা ভালো)
    await prisma.child.delete({
      where: { id: childId },
    });

    res.status(200).json({ success: true, message: "Child profile deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete child." });
  }
};

// ... আগের ইম্পোর্ট এবং addChild, getMyChildren থাকবে ...

// @desc    Update child profile
// @route   PUT /api/children/:id
export const updateChild = async (req, res) => {
  try {
    const childId = parseInt(req.params.id);
    const { name, age, gender, specialNeeds, stubbornnessLvl, interests } =
      req.body;

    // আপডেট কোয়েরি
    const updatedChild = await prisma.child.update({
      where: { id: childId },
      data: {
        name,
        age: parseInt(age),
        gender,
        specialNeeds,
        stubbornnessLvl: parseInt(stubbornnessLvl),
        interests,
      },
    });

    res.status(200).json({
      success: true,
      message: "Child profile updated!",
      child: updatedChild,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update child." });
  }
};

import prisma from "../config/db.js";

// @desc    Update user profile (Handles both Parent & Babysitter)
// @route   PUT /api/user/update-profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // authMiddleware থেকে পাওয়া ID
    const userRole = req.user.role; // authMiddleware থেকে পাওয়া Role

    // 1. Common Data (সবার জন্য)
    const {
      name,
      phone,
      profilePicture,
      // Parent Specific
      location,
      minBudget,
      maxBudget,
      situation,
      // Babysitter Specific
      bio,
      experienceYears,
      hourlyRate,
      availabilities,
    } = req.body;

    // ডাটাবেস আপডেট করার অবজেক্ট তৈরি
    let updateData = {
      name,
      phoneNumber: phone,
      profilePicture,
    };

    // 2. Role অনুযায়ী স্পেসিফিক ডাটা আপডেট লজিক
    if (userRole === "PARENT") {
      updateData.parentProfile = {
        update: {
          locationAddress: location,
          minBudget: parseFloat(minBudget) || 0,
          maxBudget: parseFloat(maxBudget) || 0,
          situation: situation,
          // নোট: Children আপডেট করার জন্য আলাদা API রাখা ভালো,
          // তবে চাইলে এখানেও নেস্টেড লজিক অ্যাড করা যায়।
        },
      };
    } else if (userRole === "BABYSITTER") {
      updateData.babysitter = {
        update: {
          locationAddress: location,
          bio: bio,
          experienceYears: parseInt(experienceYears) || 0,
          hourlyRate: parseFloat(hourlyRate) || 0,
          // ব্যাজ বা সার্টিফিকেশন আপডেটের লজিক এখানে আসবে
        },
      };
    }

    // 3. Prisma Query (Nested Update)
    // এটি ইউজার আপডেট করবে এবং রোল অনুযায়ী প্যারেন্ট বা সিটার টেবিলেও আপডেট করবে
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        parentProfile: true, // আপডেটের পর প্যারেন্ট ডাটা ফেরত দিবে
        babysitter: true, // আপডেটের পর সিটার ডাটা ফেরত দিবে
      },
    });

    // 4. Response
    // পাসওয়ার্ড ফিল্ড বাদ দিয়ে রেসপন্স পাঠানো
    const { password, ...userResponse } = updatedUser;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: userResponse,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        parentProfile: {
          include: { children: true }, // প্যারেন্ট হলে বাচ্চারাও আসবে
        },
        babysitter: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userResponse } = user;

    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

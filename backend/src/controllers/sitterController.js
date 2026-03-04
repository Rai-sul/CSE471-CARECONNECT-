import prisma from "../config/db.js";

// @route   POST /api/sitters/availability
// @desc    Update Availability
export const updateAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { schedule } = req.body;

    // ১. সিটার প্রোফাইল খুঁজে বের করা (মডেলের নাম এখন Babysitter)
    // আগে ছিল prisma.babysitterProfile, এখন prisma.babysitter হতে পারে যদি মডেল নাম বদলে থাকেন।
    // তবে আপনার স্কিমা অনুযায়ী মডেল নাম 'Babysitter'
    const sitterProfile = await prisma.babysitter.findUnique({
      where: { userId: userId },
    });

    if (!sitterProfile)
      return res.status(404).json({ message: "Sitter profile not found" });

    // ২. আগের সব Availability মুছে ফেলা
    // 🛠️ CHANGE: 'babysitterProfileId' এর বদলে 'babysitterId'
    await prisma.availability.deleteMany({
      where: { babysitterId: sitterProfile.id },
    });

    // ৩. নতুন সময়গুলো অ্যাড করা
    if (schedule && schedule.length > 0) {
      const formattedData = schedule.map((item) => ({
        // 🛠️ CHANGE: 'babysitterProfileId' এর বদলে 'babysitterId'
        babysitterId: sitterProfile.id,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
      }));

      await prisma.availability.createMany({
        data: formattedData,
      });
    }

    res.status(200).json({ success: true, message: "Availability updated!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get My Sitter Profile
// @route   GET /api/sitters/me
// @access  Private (Babysitter only)
export const getMySitterProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const sitter = await prisma.babysitter.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
            profilePicture: true,
          },
        },
        certifications: {
          orderBy: { issueDate: "desc" },
        },
        availabilities: true,
      },
    });

    if (!sitter) {
      return res.status(404).json({ message: "Sitter profile not found" });
    }

    res.status(200).json({
      success: true,
      sitter,
    });
  } catch (error) {
    console.error("Get My Sitter Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get All Sitters (With Filters)
// @route   GET /api/sitters
export const getSitters = async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query;

    // ডিফল্ট ফিল্টার: শুধুমাত্র অ্যাপ্রুভড সিটার
    let filterClause = {
      role: "BABYSITTER",
      isApproved: true,
    };

    // 🛠️ FIX: এখানে 'babysitter' ব্যবহার করতে হবে (আগে babysitterProfile ছিল)
    if (location || minPrice || maxPrice) {
      filterClause.babysitter = {
        ...(location && {
          locationAddress: {
            contains: location, // MySQL-এ এটি সাধারণত Case-insensitive হয়
          },
        }),
        ...(minPrice && { hourlyRate: { gte: parseFloat(minPrice) } }),
        ...(maxPrice && { hourlyRate: { lte: parseFloat(maxPrice) } }),
      };
    }

    const sitters = await prisma.user.findMany({
      where: filterClause,
      select: {
        id: true,
        name: true,
        // 🛠️ FIX: এখানেও 'babysitter' ব্যবহার করুন
        babysitter: {
          select: {
            id: true,
            bio: true,
            hourlyRate: true,
            locationAddress: true,
            experienceYears: true,
            averageRating: true, // Frontend এ এটি লাগছে
            availabilities: true,
          },
        },
      },
    });

    res.status(200).json({ success: true, sitters });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// @desc    Get Single Sitter by ID (Profile ID or User ID)
// @route   GET /api/sitters/:id
export const getSitterById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Try to find by babysitter profile ID first
    let sitter = await prisma.babysitter.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
            isApproved: true,
            profilePicture: true,
          },
        },
        availabilities: true,
        certifications: true,
      },
    });

    // If not found by profile ID, try to find by user ID
    if (!sitter) {
      sitter = await prisma.babysitter.findUnique({
        where: { userId: id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
              isApproved: true,
              profilePicture: true,
            },
          },
          availabilities: true,
          certifications: true,
        },
      });
    }

    if (!sitter) {
      return res.status(404).json({ message: "Sitter not found" });
    }

    // Get reviews separately to include reviewer info
    const reviews = await prisma.review.findMany({
      where: { revieweeId: sitter.userId },
      include: {
        reviewer: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10, // Limit to recent reviews
    });

    res.status(200).json({
      success: true,
      sitter: {
        ...sitter,
        reviews: reviews,
        averageRating: sitter.averageRating,
        totalRatings: sitter.totalRatings,
      },
    });
  } catch (error) {
    console.error("Get Sitter Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// @desc    Get My Availability
// @route   GET /api/sitters/availability
export const getMyAvailability = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Find Sitter
    const sitter = await prisma.babysitter.findUnique({
      where: { userId: userId },
      include: { availabilities: true }, // ডাটা সহ আনা
    });

    if (!sitter)
      return res.status(404).json({ message: "Sitter profile not found" });

    res.status(200).json({ success: true, schedule: sitter.availabilities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

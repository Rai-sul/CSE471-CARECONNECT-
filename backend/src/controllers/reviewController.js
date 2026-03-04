import prisma from "../config/db.js";

// @desc    Create a Review for a Booking
// @route   POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const {
      bookingId,
      revieweeId,
      rating,
      comment,
      punctuality,
      professionalism,
      communication,
    } = req.body;
    const reviewerId = req.user.id;

    // ১. চেক করা যে বুকিংটি COMPLETED কিনা (বুকিং শেষ না হলে রিভিউ দেয়া যাবে না)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.status !== "COMPLETED") {
      return res
        .status(400)
        .json({ message: "You can only review completed bookings." });
    }

    // ২. রিভিউ তৈরি
    const review = await prisma.review.create({
      data: {
        bookingId,
        reviewerId,
        revieweeId,
        rating: parseInt(rating),
        comment,
        punctuality: punctuality ? parseInt(punctuality) : null,
        professionalism: professionalism ? parseInt(professionalism) : null,
        communication: communication ? parseInt(communication) : null,
      },
    });

    // ৩. Update babysitter's average rating if reviewee is a babysitter
    const reviewee = await prisma.user.findUnique({
      where: { id: revieweeId },
      include: { babysitter: true },
    });

    if (reviewee && reviewee.babysitter) {
      // Get all reviews for this babysitter
      const allReviews = await prisma.review.findMany({
        where: { revieweeId },
      });

      // Calculate new average rating
      const totalRatings = allReviews.length;
      const sumRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

      // Update babysitter's rating
      await prisma.babysitter.update({
        where: { id: reviewee.babysitter.id },
        data: {
          averageRating: Math.round(avgRating * 100) / 100, // 2 decimal places
          totalRatings: totalRatings,
        },
      });
    }

    res
      .status(201)
      .json({ success: true, message: "Review submitted!", review });
  } catch (error) {
    console.error(error);
    if (error.code === "P2002")
      return res
        .status(400)
        .json({ message: "You already reviewed this booking." });
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get Reviews for a Sitter
// @route   GET /api/reviews/sitter/:id
export const getSitterReviews = async (req, res) => {
  try {
    const sitterUserId = parseInt(req.params.id);
    const reviews = await prisma.review.findMany({
      where: { revieweeId: sitterUserId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        booking: {
          select: {
            id: true,
            startTime: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Get Sitter Reviews Error:", error);
    res.status(500).json({ message: "Failed to load reviews" });
  }
};

// @desc    Get My Reviews (Reviews I've given)
// @route   GET /api/reviews/my
// @access  Private
export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await prisma.review.findMany({
      where: { reviewerId: userId },
      include: {
        reviewee: {
          select: {
            id: true,
            name: true,
          },
        },
        booking: {
          select: {
            id: true,
            startTime: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      reviews,
      count: reviews.length,
    });
  } catch (error) {
    console.error("Get My Reviews Error:", error);
    res.status(500).json({ message: "Failed to load reviews" });
  }
};

// @desc    Get Reviews Received (For current user - babysitter or parent)
// @route   GET /api/reviews/received
// @access  Private
export const getReviewsReceived = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        booking: {
          select: {
            id: true,
            startTime: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate average ratings
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const avgPunctuality =
      reviews.filter((r) => r.punctuality).length > 0
        ? reviews
            .filter((r) => r.punctuality)
            .reduce((sum, r) => sum + (r.punctuality || 0), 0) /
          reviews.filter((r) => r.punctuality).length
        : 0;

    const avgProfessionalism =
      reviews.filter((r) => r.professionalism).length > 0
        ? reviews
            .filter((r) => r.professionalism)
            .reduce((sum, r) => sum + (r.professionalism || 0), 0) /
          reviews.filter((r) => r.professionalism).length
        : 0;

    const avgCommunication =
      reviews.filter((r) => r.communication).length > 0
        ? reviews
            .filter((r) => r.communication)
            .reduce((sum, r) => sum + (r.communication || 0), 0) /
          reviews.filter((r) => r.communication).length
        : 0;

    res.status(200).json({
      success: true,
      reviews,
      count: reviews.length,
      averages: {
        overall: Math.round(avgRating * 100) / 100,
        punctuality: Math.round(avgPunctuality * 100) / 100,
        professionalism: Math.round(avgProfessionalism * 100) / 100,
        communication: Math.round(avgCommunication * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Get Reviews Received Error:", error);
    res.status(500).json({ message: "Failed to load reviews" });
  }
};

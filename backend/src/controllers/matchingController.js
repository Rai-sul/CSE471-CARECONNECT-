import prisma from "../config/db.js";

/**
 * Intelligent AI Matching Algorithm - 7-Factor Smart Matching System
 * Factors:
 * 1. Location-based proximity matching
 * 2. Availability alignment
 * 3. Budget compatibility
 * 4. Child personality matching (stubbornness level)
 * 5. Experience level matching
 * 6. Rating-based recommendations
 * 7. Required days compatibility
 */

// Helper: Calculate distance between two GPS coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Helper: Check availability match
const checkAvailabilityMatch = (parentRequiredDays, sitterAvailabilities) => {
  if (!parentRequiredDays || !sitterAvailabilities?.length) return 0.5; // Neutral score

  const requiredDays = parentRequiredDays
    .split(",")
    .map((d) => d.trim().toUpperCase());
  const availableDays = sitterAvailabilities.map((a) =>
    a.dayOfWeek.toUpperCase()
  );

  const matchedDays = requiredDays.filter((day) => availableDays.includes(day));
  return matchedDays.length / requiredDays.length; // 0-1 score
};

// Helper: Check budget compatibility
const checkBudgetMatch = (parentMinBudget, parentMaxBudget, sitterRate) => {
  if (!parentMinBudget || !parentMaxBudget || !sitterRate) return 0.5;

  const minBudget = parseFloat(parentMinBudget);
  const maxBudget = parseFloat(parentMaxBudget);
  const rate = parseFloat(sitterRate);

  if (rate >= minBudget && rate <= maxBudget) return 1.0; // Perfect match
  if (rate < minBudget) return 0.3; // Below budget (might be acceptable)
  if (rate > maxBudget * 1.2) return 0.1; // Too expensive
  return 0.6; // Slightly over budget
};

// Helper: Check child personality match (stubbornness level)
const checkPersonalityMatch = (childStubbornness, sitterExperience) => {
  const stubbornness = parseInt(childStubbornness) || 1;
  const experience = parseInt(sitterExperience) || 0;

  // Higher stubbornness needs more experience
  if (stubbornness >= 4 && experience >= 3) return 1.0;
  if (stubbornness >= 3 && experience >= 2) return 0.8;
  if (stubbornness <= 2 && experience >= 1) return 0.9;
  return 0.5; // Neutral
};

// Main Matching Function
export const findMatchingSitters = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get Parent Profile with Children
    const parent = await prisma.parent.findUnique({
      where: { userId },
      include: { children: true },
    });

    if (!parent) {
      return res
        .status(404)
        .json({ message: "Parent profile not found. Complete your profile first." });
    }

    // 2. Get all approved babysitters
    const allSitters = await prisma.babysitter.findMany({
      where: {
        user: {
          isApproved: true,
          isBanned: false,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            phoneNumber: true,
          },
        },
        availabilities: true,
        certifications: true,
      },
    });

    // 3. Calculate match scores for each sitter
    const matches = allSitters
      .map((sitter) => {
        // Factor 1: Location Proximity (0-1 score, higher is better)
        let locationScore = 0.5;
        if (
          parent.latitude &&
          parent.longitude &&
          sitter.latitude &&
          sitter.longitude
        ) {
          const distance = calculateDistance(
            parseFloat(parent.latitude),
            parseFloat(parent.longitude),
            parseFloat(sitter.latitude),
            parseFloat(sitter.longitude)
          );
          // Score: closer = better (max 10km = 1.0, 50km = 0.1)
          locationScore = Math.max(0, 1 - distance / 50);
        }

        // Factor 2: Availability Alignment
        const availabilityScore = checkAvailabilityMatch(
          parent.requiredDays,
          sitter.availabilities
        );

        // Factor 3: Budget Compatibility
        const budgetScore = checkBudgetMatch(
          parent.minBudget,
          parent.maxBudget,
          sitter.hourlyRate
        );

        // Factor 4: Child Personality Match (average across all children)
        const avgStubbornness =
          parent.children.length > 0
            ? parent.children.reduce(
                (sum, child) => sum + (child.stubbornnessLvl || 1),
                0
              ) / parent.children.length
            : 1;
        const personalityScore = checkPersonalityMatch(
          avgStubbornness,
          sitter.experienceYears
        );

        // Factor 5: Experience Level (normalized 0-1)
        const experienceScore = Math.min(sitter.experienceYears / 10, 1.0);

        // Factor 6: Rating-based (normalized 0-1)
        const ratingScore = parseFloat(sitter.averageRating) / 5.0;

        // Factor 7: Required Days Compatibility (already in availability)
        const daysScore = availabilityScore; // Reuse availability score

        // Weighted Average (can be adjusted)
        const weights = {
          location: 0.2,
          availability: 0.2,
          budget: 0.15,
          personality: 0.15,
          experience: 0.1,
          rating: 0.15,
          days: 0.05,
        };

        const totalScore =
          locationScore * weights.location +
          availabilityScore * weights.availability +
          budgetScore * weights.budget +
          personalityScore * weights.personality +
          experienceScore * weights.experience +
          ratingScore * weights.rating +
          daysScore * weights.days;

        return {
          sitter: {
            id: sitter.id,
            userId: sitter.userId,
            name: sitter.user.name,
            email: sitter.user.email,
            profilePicture: sitter.user.profilePicture,
            phoneNumber: sitter.user.phoneNumber,
            bio: sitter.bio,
            experienceYears: sitter.experienceYears,
            hourlyRate: sitter.hourlyRate,
            locationAddress: sitter.locationAddress,
            latitude: sitter.latitude,
            longitude: sitter.longitude,
            averageRating: sitter.averageRating,
            totalRatings: sitter.totalRatings,
            badges: sitter.badges,
            availabilities: sitter.availabilities,
            certifications: sitter.certifications,
          },
          matchScore: Math.round(totalScore * 100) / 100, // 2 decimal places
          factorScores: {
            location: Math.round(locationScore * 100) / 100,
            availability: Math.round(availabilityScore * 100) / 100,
            budget: Math.round(budgetScore * 100) / 100,
            personality: Math.round(personalityScore * 100) / 100,
            experience: Math.round(experienceScore * 100) / 100,
            rating: Math.round(ratingScore * 100) / 100,
          },
        };
      })
      .filter((match) => match.matchScore > 0.3) // Filter out very low matches
      .sort((a, b) => b.matchScore - a.matchScore); // Sort by score descending

    res.status(200).json({
      success: true,
      matches,
      totalMatches: matches.length,
    });
  } catch (error) {
    console.error("Matching Error:", error);
    res.status(500).json({ message: "Failed to find matching sitters" });
  }
};


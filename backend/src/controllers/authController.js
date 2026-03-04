import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { sendRegistrationEmail } from "../services/emailService.js";

// --- REGISTER USER ---
export const registerUser = async (req, res) => {
  try {
    const { email, password, role, name, location, phone } = req.body;

    // ... (আগের ভ্যালিডেশন কোড একই থাকবে) ...

    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction এর মাধ্যমে ইউজার তৈরি
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role.toUpperCase(),
          name: name, // নাম সেভ করা হচ্ছে
          phoneNumber: phone,
          isApproved: false,
        },
      });

      if (role.toUpperCase() === "PARENT") {
        await tx.parent.create({
          data: {
            userId: newUser.id,
            locationAddress: location || "",
            minBudget: 0,
            maxBudget: 0,
          },
        });
      } else if (role.toUpperCase() === "BABYSITTER") {
        await tx.babysitter.create({
          data: {
            userId: newUser.id,
            locationAddress: location || "",
            experienceYears: 0,
            hourlyRate: 0,
          },
        });
      }

      return newUser;
    });

    // 🔥 নতুন পরিবর্তন: টোকেন জেনারেট করা (Signup এর সাথে সাথেই)
    const token = jwt.sign(
      { id: result.id, role: result.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send registration email
    try {
      await sendRegistrationEmail(result);
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
      // Continue even if email fails
    }

    // পাসওয়ার্ড বাদ দিয়ে ইউজার ডাটা পাঠানো
    const { password: _, ...userData } = result;

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token, // টোকেন পাঠানো হলো
      user: userData, // ইউজার ডাটা পাঠানো হলো
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- LOGIN USER ---
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Send Response (Hide password)
    const { password: _, ...userData } = user; // password বাদ দিয়ে বাকি ডাটা

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

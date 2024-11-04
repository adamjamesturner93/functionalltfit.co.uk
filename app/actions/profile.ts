"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Unit } from "@prisma/client";
import { profileSchema } from "@/lib/schemas/profile";

export type ProfileFormValues = z.infer<typeof profileSchema>;

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { preferences: true },
  });

  if (!user) {
    return null;
  }

  return {
    ...user,
    dateOfBirth: user.dateOfBirth
      ? user.dateOfBirth.toISOString().split("T")[0]
      : undefined,
    lengthUnit: user.preferences?.lengthUnit || Unit.METRIC,
    weightUnit: user.preferences?.weightUnit || Unit.METRIC,
    image: user.image || undefined,
  };
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const validatedFields = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    dateOfBirth: formData.get("dateOfBirth"),
    lengthUnit: formData.get("lengthUnit"),
    weightUnit: formData.get("weightUnit"),
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, email, dateOfBirth, lengthUnit, weightUnit, image } =
    validatedFields.data;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        image,
        preferences: {
          upsert: {
            create: { lengthUnit, weightUnit },
            update: { lengthUnit, weightUnit },
          },
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function uploadProfileImage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  try {
    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image");
    }

    const { url } = await uploadResponse.json();

    // Update the user's profile image URL in the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: url },
    });

    return { url };
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return { error: "Failed to upload profile image" };
  }
}

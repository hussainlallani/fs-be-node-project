import { Course, GetCoursesParams, ICourse } from "@/models/course.model";
import mongoose, { SortOrder } from "mongoose";

export async function createCourse(data: Partial<ICourse>): Promise<ICourse> {
  const course = new Course(data);
  return await course.save();
}

export async function getCourses(
  query: any = {},
  options: GetCoursesParams = {}
) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, options.limit || 10);
  const skip = (page - 1) * limit;
  const sort: Record<string, SortOrder> = options.sort
    ? { [options.sort]: options.order === "desc" ? -1 : 1 }
    : {};

  const [data, total] = await Promise.all([
    Course.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Course.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getCourseById(id: string): Promise<ICourse | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  return await Course.findById(id).lean();
}

export async function updateCourse(
  id: string,
  updates: Partial<ICourse>
): Promise<ICourse | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  return await Course.findByIdAndUpdate(id, updates, { new: true });
}

export async function deleteCourse(
  id: string
): Promise<{ deletedCount: number }> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  const res = await Course.deleteOne({ _id: id });
  return { deletedCount: res.deletedCount ?? 0 };
}

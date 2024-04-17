import { apiSlice } from "../api/apiSlice";

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation<any, Course>({
      query: (courseData: Course) => ({
        url: "/course",
        body: { ...courseData },
        method: "POST",
      }),
      invalidatesTags: ["Courses"],
    }),
    updateCourse: builder.mutation<any, Course>({
      query: (data) => ({
        url: `/course/${data.id}`,
        body: { ...data },
        method: "PUT",
      }),
      invalidatesTags: ["Courses"],
    }),
    updateCourseContent: builder.mutation<
      any,
      { id: string; payload: ContentPayload }
    >({
      query: (data) => ({
        url: `/course/${data.id}`,
        body: data?.payload,
        method: "PUT",
      }),
      invalidatesTags: ["Courses"],
    }),
    getAllCourses: builder.query<{ allCourse: Course[] }, null>({
      query: () => ({
        url: "/course",
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),
    getCourseById: builder.query<{ foundCourse: Course }, { id: string }>({
      query: (data) => ({
        url: `/course/${data.id}`,
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),
    deleteCourse: builder.mutation<any, { id: string }>({
      query: (data) => ({
        url: `/course/${data.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});
export const {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useUpdateCourseContentMutation,
} = courseApiSlice;

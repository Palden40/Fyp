import { apiSlice } from "../api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
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
    getAllTeachers: builder.query<{ teachers: Teacher[] }, null>({
      query: () => ({
        url: "/teachers",
        method: "GET",
      }),
      providesTags: ["Teachers"],
    }),
    getAllStudents: builder.query<{ students: Students[] }, null>({
      query: () => ({
        url: "/students",
        method: "GET",
      }),
      providesTags: ["Students"],
    }),
    getCurrentUser: builder.query<Teacher, null>({
      query: () => ({
        url: "/currentUser",
        method: "GET",
      }),
    }),
    getCourseById: builder.query<{ foundCourse: Course }, { id: string }>({
      query: (data) => ({
        url: `/course/${data.id}`,
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),
    deleteTeacher: builder.mutation<any, { id: string }>({
      query: (data) => ({
        url: `/teacher/${data.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teachers"],
    }),
  }),
});
export const {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteTeacherMutation,
  useGetAllTeachersQuery,
  useGetAllStudentsQuery,
  useGetCourseByIdQuery,
  useGetCurrentUserQuery,
  useUpdateCourseContentMutation,
} = usersApiSlice;

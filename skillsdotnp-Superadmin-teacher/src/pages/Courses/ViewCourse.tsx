import { Link } from "react-router-dom";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "../../app/courses/courseApiSlice";
import Breadcrumb from "../../components/Breadcrumb";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { PiBooksFill } from "react-icons/pi";

export default function ViewCourse() {
  const { data: courseData } = useGetAllCoursesQuery(null);
  console.log("courseData", courseData);
  const [deleteCourse, { isLoading: isCourseDelete }] =
    useDeleteCourseMutation();

  const handleDelete = (courseID: string | undefined) => {
    deleteCourse({ id: courseID || "ifNoId" })
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res.ok) {
          toast.success("Succesfully deleted.", {
            position: "top-right",
          });
          return;
        }
        toast.error(`Error: ${res.msg}`);
      })
      .catch((err) => {
        toast.error(`Error: ${err.data.msg}`);
      });
  };

  return (
    <>
      <Breadcrumb pageName="View Course" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Course name
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Enrollments
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Price
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Category
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Actions
              </h5>
            </div>
          </div>
          {courseData?.allCourse.map((course) => (
            <div
              key={course._id}
              className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5"
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">
                  {course.courseName}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {course.enrollments}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3">Rs. {course.price}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black dark:text-white">{course.category}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5 gap-2">
                <Link
                  to={`/course-edit/${course._id}`}
                  className="h-10 w-10  bg-meta-5 text-white flex justify-center items-center"
                >
                  <FaPen />
                </Link>
                <Link
                  to={`/course-content/${course._id}`}
                  className="h-10 w-10 text-2xl  bg-meta-5 text-white flex justify-center items-center"
                >
                  <PiBooksFill />
                </Link>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="h-10 w-10 bg-red-600 text-white flex justify-center items-center text-lg"
                  value={course._id}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

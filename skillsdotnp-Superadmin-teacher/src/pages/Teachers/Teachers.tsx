import Breadcrumb from "../../components/Breadcrumb";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import {
  useDeleteTeacherMutation,
  useGetAllTeachersQuery,
} from "@/app/users/usersApiSlice";

export default function Teachers() {
  const { data: teachersData } = useGetAllTeachersQuery(null);
  console.log("teachersData", teachersData);
  const [deleteTeacher, { isLoading: isTeacherDelete }] =
    useDeleteTeacherMutation();

  const handleDelete = (teacherId: string | undefined) => {
    deleteTeacher({ id: teacherId || "ifNoId" })
      .unwrap()
      .then((res) => {
        console.log(res);
        toast.success("Succesfully deleted.", {
          position: "top-right",
        });
      })
      .catch((err) => {
        toast.error(`Error: ${err.data.msg}`);
      });
  };

  return (
    <>
      <Breadcrumb pageName="Teachers" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Username
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Email
              </h5>
            </div>

            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Actions
              </h5>
            </div>
          </div>
          {teachersData?.teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-3"
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">
                  {teacher?.username || "NA"}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {teacher?.email || "NA"}
                </p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5 gap-2">
                <button
                  onClick={() => handleDelete(teacher._id)}
                  className="h-10 w-10 bg-red-600 text-white flex justify-center items-center text-lg"
                  value={teacher._id}
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

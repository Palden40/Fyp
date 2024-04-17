import {
  useDeleteCourseMutation,
  // useGetAllStudentsQuery,
} from "../../app/courses/courseApiSlice";
import Breadcrumb from "../../components/Breadcrumb";
import toast from "react-hot-toast";
import { useGetAllStudentsQuery } from "@/app/users/usersApiSlice";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Students() {
  const { data: studentsData } = useGetAllStudentsQuery(null);
  console.log("courseData", studentsData);

  const [selectedStudent, setSelectedStudent] = useState<any>({});

  const [deleteCourse, { isLoading: isCourseDelete }] =
    useDeleteCourseMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <Breadcrumb pageName="Students" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Name
              </h5>
            </div>

            <div className="hidden p-2.5 text-center sm:block xl:p-5">
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
          {studentsData?.students?.map((student, i) => (
            <div
              key={i}
              className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-3"
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">
                  {student?.username}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{student?.email}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5 gap-2">
                <button
                  onClick={() => {
                    setSelectedStudent(studentsData?.students[i]);
                    onOpen();
                  }}
                  className="h-10 w-auto text-xs bg-primary text-white flex justify-center items-center px-5 font-medium rounded-sm hover:opacity-80 transition-opacity duration-300"
                >
                  View Progress
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedStudent?.username}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="grid grid-cols-2">
            <h1 className="text-md font-semibold">Course Names:</h1>
            <p className=" text-md font-semibold justify-self-end">progress</p>
            {selectedStudent?.enrolledCourses?.map((course: any) => (
              <>
                <p>{course?.courseId.courseName}</p>
                <p className="justify-self-end">
                  {course.progress.completedIndexes.length /
                    course?.courseId.content.length}
                  %
                </p>
              </>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

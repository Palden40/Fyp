import Breadcrumb from "@/components/Breadcrumb";
import { MdDelete } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Select,
  Input,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";

import { useForm, useFieldArray } from "react-hook-form";
import { FaPen } from "react-icons/fa";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { useEffect, useState } from "react";
import {
  useGetCourseByIdQuery,
  useUpdateCourseContentMutation,
} from "@/app/courses/courseApiSlice";
import toast from "react-hot-toast";
import { useUpdateFormByFetchData } from "@/hooks/useUpdateFormByFetchData";
import Loader from "@/common/Loader";

export default function EditCourseContent() {
  const [selectedContent, setSelectedContent] = useState<any>();
  const [contentIndex, setContextIndex] = useState<number>(0);

  const { courseId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    reset,
    formState: { errors },
    watch,
    getValues,
    setValue,
    control,
    handleSubmit,
  } = useForm<ContentPayload>();

  const contentArr = useFieldArray({
    control,
    name: "content",
  } as never);
  // useEffect(() => {
  //   console.log("all values`", getValues());
  //   console.log("selcon", selectedContent);
  // }, [watch("content")]);

  const [updateContent, { isLoading }] = useUpdateCourseContentMutation();

  const { data: courseData, isFetching } = useGetCourseByIdQuery({
    id: courseId || "noId",
  });
  useEffect(() => {
    if (courseData?.foundCourse?.content) {
      console.log("hello");
      setValue("content", courseData?.foundCourse?.content);
      console.log("getValues", getValues());
    }
  }, [courseData?.foundCourse?.content]);

  const handleContentUpdate = (data: ContentPayload) => {
    updateContent({ id: courseId || "", payload: data })
      .unwrap()
      .then((res) => toast.success("success"))
      .catch((err) => toast.error("error"));
  };

  if (isFetching) {
    return <Loader />;
  }
  return (
    <>
      <Breadcrumb pageName="Course-Contents" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <button
          className="bg-primary w-full text-white py-5 text-xl font-bold my-3"
          onClick={() => {
            contentArr.append({
              content_type: "undefined",
              title: "Undefined",
              data: "Undefined",
            });
            handleContentUpdate(getValues());
          }}
        >
          Add Content
        </button>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
            <div className="p-2.5 xl:p-5 w-20">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                S.N.
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Title
              </h5>
            </div>

            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Type
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Actions
              </h5>
            </div>
          </div>
          {contentArr.fields?.map((content, i) => (
            <div
              key={content.id}
              className="group grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-4 relative"
            >
              <div className="flex relative items-center gap-3 p-2.5 xl:p-5 w-20">
                <p className="hidden text-black dark:text-white sm:block">
                  {i + 1}
                </p>
              </div>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">
                  {/* @ts-ignore */}
                  {content?.title}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3">
                  {/* @ts-ignore */}
                  {content.content_type}
                </p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5 gap-2">
                <Link
                  onClick={() => {
                    onOpen();
                    setContextIndex(i);
                    setSelectedContent(contentArr.fields[i]);
                  }}
                  to={`#`}
                  className="h-10 w-10  bg-meta-5 text-white flex justify-center items-center"
                >
                  <FaPen />
                </Link>
                <div className="flex flex-col w-10 h-10">
                  <button
                    className="rounded-sm w-full h-1/2 p-1 backdrop-filter backdrop-blur backdrop-contrast-200 bg-blue-600 text-white transition-all duration-500 justify-center items-center flex"
                    onClick={() => i != 0 && contentArr.swap(i, i - 1)}
                  >
                    <BiSolidUpArrow />
                  </button>
                  <button
                    className="rounded-sm w-full h-1/2 p-1 backdrop-filter backdrop-blur backdrop-contrast-200 bg-blue-600 text-white transition-all duration-500 items-center flex justify-center"
                    onClick={() =>
                      i != contentArr.fields.length - 1 &&
                      contentArr.swap(i, i + 1)
                    }
                  >
                    <BiSolidDownArrow />
                  </button>
                </div>
                <button
                  onClick={() => contentArr.remove(i)}
                  className="h-10 w-10 bg-red-600 text-white flex justify-center items-center text-lg"
                  // value={course.id}
                >
                  <MdDelete />
                </button>
              </div>

              <button
                className="rounded-sm w-fit h-fit p-1 absolute top-0 backdrop-filter backdrop-blur backdrop-contrast-200 bg-blue-600 bg-opacity-10 z-9 group-hover:block transition-all opacity-0 group-hover:opacity-100 duration-500 justify-center items-center left-1/2 -translate-x-1/2 -translate-y-full"
                onClick={() =>
                  contentArr.insert(i, {
                    content_type: "undefined",
                    title: "Undefined",
                    data: "Undefined",
                  })
                }
              >
                <FaPlus />
              </button>
            </div>
          ))}
        </div>
        <button
          className="bg-primary px-3 text-white text-xl py-4 mt-6 mb-2 rounded-lg opacity-100 hover:opacity-90 transition-opacity duration-600"
          onClick={handleSubmit(handleContentUpdate)}
        >
          Update Content
        </button>
      </div>
      <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Course Content</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={"1rem"}>
            <div>
              <label htmlFor="title">Title:</label>
              <Input
                onChange={(e) =>
                  setSelectedContent({
                    ...selectedContent,
                    title: e.target.value,
                  })
                }
                id="title"
                defaultValue={selectedContent?.title}
              ></Input>
            </div>
            <div>
              <label htmlFor="contentType">Content Type:</label>
              <Select
                id={"contentType"}
                defaultValue={selectedContent?.content_type || "default"}
                onChange={(e) => {
                  console.log("e", e.target.value);

                  if (e.target.value == "video") {
                    setSelectedContent({
                      ...selectedContent,
                      data: "",
                      content_type: e.target.value,
                    });
                  } else if (e.target.value == "trueFalse") {
                    console.log("tjsdlkasd");
                    setSelectedContent({
                      ...selectedContent,
                      data: {
                        option1: "True",
                        option2: "False",
                        correctAnswer: "",
                      },
                      content_type: e.target.value,
                    });
                  } else {
                    setSelectedContent({
                      ...selectedContent,
                      data: {
                        option1: "",
                        option2: "",
                        option3: "",
                        option4: "",
                        correctAnswer: "",
                      },
                      content_type: e.target.value,
                    });
                  }
                }}
              >
                <option value="default" disabled>
                  Select Content Type
                </option>
                <option value="video">Video</option>
                <option value="mcq">MCQ</option>
                <option value="trueFalse">True or False</option>
                <option value="fillBlank">Fill In The Blanks</option>
              </Select>
            </div>

            {selectedContent?.content_type == "video" && (
              <div>
                <label htmlFor="video">Video URL:</label>
                <Input
                  onChange={(e) =>
                    setSelectedContent({
                      ...selectedContent,
                      data: e.target.value,
                    })
                  }
                  defaultValue={selectedContent?.data}
                  id="video"
                />
              </div>
            )}
            {selectedContent?.content_type == "mcq" && (
              <>
                <div>
                  <label htmlFor="mcq">Question:</label>
                  <Input
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent.data,
                          question: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data.question}
                    id="mcq"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="option1">Option 1:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          option1: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data.option1}
                    id="option1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="option2">Option 2:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          option2: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data.option2}
                    id="option2"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="option3">Option 3:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          option3: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data.option3}
                    id="option3"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="option4">Option 4:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          option4: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data.option4}
                    id="option4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="correctAns">Answer:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          correctAnswer: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data.correctAnswer}
                    id="correctAns"
                  />
                </div>
              </>
            )}

            {selectedContent?.content_type == "trueFalse" && (
              <>
                <div>
                  <label htmlFor="mcq">Question:</label>
                  <Input
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          question: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data.question}
                    id="question"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="option1">Option 1:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          option1: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data.option1}
                    id="option1"
                    readOnly
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="option2">Option 2:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          option2: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data.option2}
                    id="option2"
                    readOnly
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="correctAns">Answer:</label>
                  <Select
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          correctAnswer: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data?.correctAnswer || ""}
                    id={"correctAns"}
                  >
                    <option value="" disabled>
                      Select True Or False
                    </option>

                    <option value="True">True</option>
                    <option value="False">False</option>
                  </Select>
                </div>
              </>
            )}

            {selectedContent?.content_type == "fillBlank" && (
              <>
                <div>
                  <label htmlFor="fillBlank">Question:</label>
                  <Input
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          question: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data?.question}
                    id="fillBlank"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="option1">Option 1:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          option1: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data?.option1}
                    id="option1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="option2">Option 2:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          option2: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data?.option2}
                    id="option2"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="option3">Option 3:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          option3: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data?.option3}
                    id="option3"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="option4">Option 3:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          option4: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data?.option4}
                    id="option4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="placeholder">Placeholder:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          placeholder: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data?.placeholder}
                    id="placeholder"
                    placeholder="[ans]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="correctAns">Answer:</label>
                  <Input
                    width={"80%"}
                    onChange={(e) =>
                      setSelectedContent({
                        ...selectedContent,
                        data: {
                          ...selectedContent?.data,
                          correctAnswer: e.target.value,
                        },
                      })
                    }
                    defaultValue={selectedContent?.data?.correctAnswer}
                    id="correctAns"
                  />
                </div>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                contentArr.update(contentIndex, selectedContent);
                onClose();
                handleContentUpdate(getValues());
              }}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

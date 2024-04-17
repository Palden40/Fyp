import { useEffect } from "react";
import Header from "../../Component/Headers";
import Topbar from "../../Component/Headers/Topbar";
import { MdPlayCircle } from "react-icons/md";
import baseUrl from "../../services/baseUrl";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { MdQuiz } from "react-icons/md";
import CookieHelper from "../../utils/CookieHelper";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Content() {
  const [courseData, setCourseData] = useState();
  const [selectedContent, setSelectedContent] = useState();
  const [selectedAns, setSelectedAns] = useState();
  const [isCorrect, setIsCorrect] = useState("unchecked");
  const [displayedQues, setDisplayedQues] = useState("");
  const [completedIndexes, setCompletedIndexes] = useState();
  const [displayCongrats, setDisplayCongrats] = useState(false);

  const progressRef = useRef();
  const navigate = useNavigate();
  const [progressVal, setProgressVal] = useState(0);
  console.log("progressVal", progressVal);

  // console.log("selectedContent", selectedContent, "anssel", selectedAns);

  useEffect(() => {
    if (selectedContent?.content_type === "fillBlank") {
      const placeholder = selectedContent?.data?.placeholder;
      const blankline = "_____________";
      if (isCorrect === true) {
        // console.log("insid", isCorrect);
        const modQues = selectedContent?.data?.question.replace(
          placeholder,
          selectedAns
        );
        setDisplayedQues(modQues);
      } else {
        const modQues = selectedContent?.data?.question.replace(
          placeholder,
          blankline
        );
        setDisplayedQues(modQues);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContent, isCorrect]);

  useEffect(() => {
    courseData && setSelectedContent(courseData.content[0]);
  }, [courseData]);
  const { id } = useParams();
  useFetchCourseById(id, setCourseData);
  useFindLastContext(
    id,
    courseData?.content,
    setSelectedContent,
    progressRef,
    setCompletedIndexes,
    navigate,
    setProgressVal
  );

  // useUpdateProgress(
  //   selectedContent,
  //   courseData?.content,
  //   progressRef,
  //   checkEnrolledRes
  // );

  const setNextContent = async () => {
    console.log("ere");
    const currIndex = courseData?.content?.findIndex(
      (con) => con._id === selectedContent._id
    );

    if (completedIndexes.includes(selectedContent._id)) {
      console.log("already exist");
      setSelectedContent(courseData?.content[currIndex + 1]);

      const isCongrats =
        courseData.content.findIndex(
          (content) => selectedContent._id === content._id
        ) ===
        courseData.content.length - 1;
      isCongrats && setDisplayCongrats(true);

      return;
    }
    try {
      const res = await fetch(
        `${baseUrl}/course/${id}/content/${selectedContent?._id}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${CookieHelper.getCookie("token")}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setSelectedContent(courseData.content[currIndex + 1]);
        const completedIndexesRes =
          data?.updatedEnrolled?.progress?.completedIndexes;
        setCompletedIndexes(completedIndexesRes);
        console.log("next res", completedIndexesRes.length);
        const progressValue =
          (completedIndexesRes.length / courseData?.content?.length) * 100;
        console.log("progressValue", progressValue, "%");

        progressRef.current.style.width = `${
          progressValue == undefined
            ? 0
            : progressValue <= 100
            ? progressValue
            : 100
        }%`;

        setProgressVal(progressValue);

        const isCongrats =
          courseData.content.findIndex(
            (content) => selectedContent._id === content._id
          ) ===
          courseData.content.length - 1;
        console.log(
          "display congrrates",
          data?.updatedEnrolled?.progress?.currentIndex === null && isCongrats
        );
        console.log(
          "selcon index",
          courseData.content.findIndex(
            (content) => selectedContent._id === content._id
          )
        );
        console.log("coudesdata length", courseData.content.length - 1);
        if (
          data?.updatedEnrolled?.progress?.currentIndex === null ||
          isCongrats
        ) {
          setDisplayCongrats(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Topbar />
      <Header
        className="header-02"
        logo="assets/images/ElearningLogo.webp"
        search={true}
      />
      <div className="tw-w-[70%] tw-mt-40 tw-border tw-border-[#cccccc] tw-mx-auto tw-h-5 tw-rounded-xl tw-bg-[#cccccc]">
        <div
          ref={progressRef}
          className={`tw-h-full tw-bg-[#00b5ff] tw-rounded-xl`}
        ></div>
      </div>
      <center>
        <span>{Math.floor(progressVal)} %</span>
      </center>
      {displayCongrats ? (
        <div className="tw-flex tw-items-center  tw-text-black tw-flex-col tw-w-50% tw-gap-5">
          <img
            className="tw-w-80 tw-h-80"
            src="/assets/images/congratulation.png"
            alt=""
          />
          <span>
            Congratulations You have successfully completed this course
          </span>
          <button
            onClick={() => navigate("/")}
            className="tw-bg-green-500 tw-w-40 tw-py-5 tw-px-10 tw-rounded-xl tw-text-white"
          >
            Go Back
          </button>
        </div>
      ) : (
        <section className="tw-mt-5 tw-grid tw-grid-cols-3 tw-justify-center tw-items-center w-auto ">
          <div className="tw-h-[calc(100vh-160px)] tw-items-center tw-gap-5 tw-overflow-y-auto tw-pl-10 ">
            {courseData?.content?.map((content, i) => (
              <div
                key={i}
                className={`${
                  completedIndexes?.some((index) => index === content._id)
                    ? "tw-bg-[#eaeaff]"
                    : ""
                } tw-w-[auto] tw-h-16 tw-border-[#898989] tw-border tw-flex tw-items-center tw-px-10 tw-gap-5 tw-mb-5`}
                onClick={() => {
                  setSelectedContent(content);
                  setIsCorrect("unchecked");
                }}
              >
                <span className="tw-text-[#807A82] tw-text-xl">
                  {content.content_type === "video" ? (
                    <MdPlayCircle />
                  ) : (
                    <MdQuiz />
                  )}
                </span>
                <p className="tw-text-[#414141]">{content.title}</p>
              </div>
            ))}
          </div>
          <div className="tw-flex tw-w-full tw-h-full tw-items-center tw-justify-center tw-flex-col tw-col-span-2">
            {selectedContent?.content_type === "video" && (
              <iframe
                width="90%"
                height="90%"
                src={`https://www.youtube.com/embed/${selectedContent?.data}`}
                title={selectedContent?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullscreen
              ></iframe>
            )}
            {selectedContent?.content_type === "mcq" && (
              <div className="tw-w-full tw-flex tw-flex-col tw-justify-between tw-h-full tw-align-items tw-items-center">
                {/* mcq question */}
                <h1 className="tw-text-2xl tw-font-semibold tw-text-black tw-flex tw-justify-center">
                  {selectedContent?.data.question}
                </h1>

                <a
                  className="tw-border tw-border-[#898989] tw-w-9/12 tw-transition-colors tw-duration-300 tw-rounded-2xl tw-h-14 tw-flex tw-justify-center tw-items-center focus:tw-border-blue-500 hover:tw-bg-gray-200 tw-text-black"
                  tabIndex={0}
                  value={`${selectedContent?.data.option1}`}
                  onClick={(e) => {
                    setSelectedAns(e?.target?.innerHTML);
                  }}
                >
                  {selectedContent?.data.option1}
                </a>
                <a
                  className="tw-border tw-border-[#898989] tw-w-9/12 tw-transition-colors tw-duration-300 tw-rounded-2xl tw-h-14 tw-flex tw-justify-center tw-items-center focus:tw-border-blue-500 hover:tw-bg-gray-200 tw-text-black"
                  tabIndex={0}
                  value={`${selectedContent?.data.option2}`}
                  onClick={(e) => {
                    setSelectedAns(e?.target?.innerHTML);
                  }}
                >
                  {selectedContent?.data.option2}
                </a>
                <a
                  className="tw-border tw-border-[#898989] tw-w-9/12 tw-transition-colors tw-duration-300 tw-rounded-2xl tw-h-14 tw-flex tw-justify-center tw-items-center focus:tw-border-blue-500 hover:tw-bg-gray-200 tw-text-black"
                  value={`${selectedContent?.data.option3}`}
                  onClick={(e) => {
                    setSelectedAns(e?.target?.innerHTML);
                  }}
                  tabIndex={0}
                >
                  {selectedContent?.data.option3}
                </a>
                <a
                  className="tw-border tw-border-[#898989] hover:tw-bg-gray-200 tw-w-9/12 tw-transition-colors tw-duration-300 tw-rounded-2xl tw-h-14 tw-flex tw-justify-center tw-items-center focus:tw-border-blue-500 tw-text-black"
                  value={`${selectedContent?.data.option4}`}
                  onClick={(e) => {
                    console.log("etarget", e?.target?.innerHTML);
                    setSelectedAns(e?.target?.innerHTML);
                  }}
                  tabIndex={0}
                >
                  {selectedContent?.data.option4}
                </a>
              </div>
            )}
            {selectedContent?.content_type === "trueFalse" && (
              <div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-gap-7 tw-h-full tw-align-items tw-items-center">
                <h1 className="tw-text-2xl tw-font-semibold tw-text-black tw-flex tw-justify-center">
                  {selectedContent?.data.question}
                </h1>

                <a
                  className="tw-border tw-border-[#898989] hover:tw-bg-gray-200 hover:tw-border-[#898989] tw-w-9/12 tw-transition-colors tw-duration-300 tw-rounded-2xl tw-h-14 tw-flex tw-justify-center tw-items-center focus:tw-border-blue-500  tw-text-black"
                  value={`${selectedContent?.data.option1}`}
                  onClick={(e) => {
                    setSelectedAns(e.target.innerHTML);
                  }}
                  tabIndex={0}
                >
                  {selectedContent?.data.option1}
                </a>
                <a
                  className="tw-border tw-border-[#898989] hover:tw-bg-gray-200 hover:tw-border-[#898989] tw-w-9/12 tw-transition-colors tw-duration-300 tw-rounded-2xl tw-h-14 tw-flex tw-justify-center tw-items-center focus:tw-border-blue-500 tw-text-black"
                  value={`${selectedContent?.data.option2}`}
                  onClick={(e) => {
                    setSelectedAns(e.target.innerHTML);
                  }}
                  tabIndex={0}
                >
                  {selectedContent?.data.option2}
                </a>
              </div>
            )}
            {selectedContent?.content_type === "fillBlank" && (
              <div className="tw-w-full tw-flex tw-flex-col tw-justify-between tw-h-full tw-align-items tw-items-center">
                <h1 className="tw-text-2xl tw-font-semibold tw-text-black tw-flex tw-justify-center">
                  {displayedQues}
                </h1>

                <a
                  className="tw-border tw-border-[#898989]  tw-w-9/12 tw-transition-colors tw-duration-300 tw-rounded-2xl tw-h-14 tw-flex tw-justify-center tw-items-center focus:tw-border-blue-500 hover:tw-bg-gray-200 tw-text-black"
                  value={`${selectedContent?.data.option1}`}
                  onClick={(e) => {
                    setSelectedAns(e.target.innerHTML);
                  }}
                  tabIndex={0}
                >
                  {selectedContent?.data.option1}
                </a>
                <a
                  className="tw-border tw-border-[#898989] hover:tw-bg-gray-200 tw-w-9/12 tw-transition-colors tw-duration-300 tw-rounded-2xl tw-h-14 tw-flex tw-justify-center tw-items-center focus:tw-border-blue-500 tw-text-black"
                  value={`${selectedContent?.data.option2}`}
                  onClick={(e) => {
                    setSelectedAns(e.target.innerHTML);
                  }}
                  tabIndex={0}
                >
                  {selectedContent?.data.option2}
                </a>
                <a
                  className="tw-border tw-border-[#898989] hover:tw-bg-gray-200 tw-w-9/12 tw-transition-colors tw-duration-300 tw-rounded-2xl tw-h-14 tw-flex tw-justify-center tw-items-center focus:tw-border-blue-500 tw-text-black"
                  value={`${selectedContent?.data.option3}`}
                  onClick={(e) => {
                    setSelectedAns(e.target.innerHTML);
                  }}
                  tabIndex={0}
                >
                  {selectedContent?.data.option3}
                </a>
                <a
                  className="tw-border tw-border-[#898989] hover:tw-bg-gray-200 tw-w-9/12 tw-transition-colors tw-duration-300 tw-rounded-2xl tw-h-14 tw-flex tw-justify-center tw-items-center focus:tw-border-blue-500 tw-text-black"
                  value={`${selectedContent?.data.option4}`}
                  onClick={(e) => {
                    setSelectedAns(e.target.innerHTML);
                  }}
                  tabIndex={0}
                >
                  {selectedContent?.data.option4}
                </a>
              </div>
            )}

            <div className="tw-self-end">
              {(selectedContent?.content_type === "video") === true ||
              isCorrect === "unchecked" ? (
                <></>
              ) : isCorrect === true ? (
                <span className="tw-mr-2 tw-text-green-600 tw-text-xl tw-font-semibold">
                  Correct Answer!!
                </span>
              ) : (
                <span className="tw-mr-2 tw-text-red-600 tw-text-xl tw-font-semibold">
                  In-Correct Answer!!
                </span>
              )}
              {!(selectedContent?.content_type === "video") && (
                <button
                  className="tw-h-10 tw-w-40 tw-bg-white tw-text-black  tw-mr-10 tw-rounded-md tw-mt-10 tw-mb-3 tw-text-xl tw-font-semibold"
                  onClick={() => setNextContent()}
                >
                  Skip
                </button>
              )}
              <button
                className="tw-h-10 tw-w-40 tw-bg-[#5838fc] tw-text-white  tw-mr-10 tw-rounded-md tw-mt-10 tw-mb-3 tw-text-xl tw-font-semibold"
                onClick={() => {
                  selectedContent?.content_type != "video" &&
                  selectedAns === selectedContent?.data?.correctAnswer
                    ? setIsCorrect(true)
                    : setIsCorrect(false);

                  selectedContent?.content_type === "video"
                    ? (setNextContent(), setIsCorrect("unchecked"))
                    : isCorrect === true
                    ? (setNextContent(), setIsCorrect("unchecked"))
                    : selectedAns === selectedContent?.data?.correctAnswer
                    ? setIsCorrect(true)
                    : null;
                }}
              >
                {(selectedContent?.content_type === "video") === true
                  ? "Next"
                  : isCorrect === "unchecked" || isCorrect === false
                  ? "Check"
                  : "Next"}
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
const useFetchCourseById = (id, setCourseData) => {
  useEffect(() => {
    fetch(`${baseUrl}/course/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        setCourseData(res.foundCourse);
      })
      .catch((err) => console.error(err));
  }, []);
};

const useFindLastContext = (
  id,
  content,
  setSelectedContent,
  progressRef,
  setCompletedIndexes,
  navigate,
  setProgressVal
) => {
  useEffect(() => {
    fetch(`${baseUrl}/course/${id}/enroll/user/check`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CookieHelper.getCookie("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const toSelContent = content?.find((con) => {
          return con._id === res.data[0].progress.lastIndex;
        });
        setSelectedContent(toSelContent);
        setCompletedIndexes(res.data[0]?.progress?.completedIndexes);

        console.log(
          "length completed Indexes",
          res.data[0]?.progress?.completedIndexes.length,
          content?.length
        );
        const progressValue =
          (res.data[0].progress?.completedIndexes?.length / content?.length) *
          100;
        setProgressVal(progressValue);
        console.log("progressvalue", progressValue, "%");
        progressRef.current.style.width = `${
          progressValue == undefined
            ? 0
            : progressValue <= 100
            ? progressValue
            : 100
        }%`;
      })
      .catch((err) => {
        navigate(`/single-course/${id}`);
        console.error(err);
      });
  }, [content]);
};

const useUpdateProgress = (
  selectedContent,
  content,
  progressRef,
  checkEnrolledRes,
  setProgressVal
) => {
  useEffect(() => {
    if (checkEnrolledRes) {
      console.log("checkEnrolled", checkEnrolledRes);
      const progressValue =
        (checkEnrolledRes[0].progress.completedIndexes.length /
          content.length) *
        100;
      setProgressVal(progressValue);
      console.log("progressvalue", progressValue, "%");
      progressRef.current.style.width = `${progressValue}%`;
    }
  }, [content, checkEnrolledRes, selectedContent]);
};

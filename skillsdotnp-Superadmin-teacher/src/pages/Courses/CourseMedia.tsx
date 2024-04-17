import Breadcrumb from "../../components/Breadcrumb";

export default function CourseMedia() {
  return (
    <>
      <Breadcrumb pageName="Course-Media" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col">
          <div className="rounded-sm flex flex-col gap-3 p-6.5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div>
              <label className="mb-3 block text-black dark:text-white">
                Attach file
              </label>
              <input
                type="file"
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-5.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Video URL:
                </label>
                <input
                  type="text"
                  placeholder="url"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="flex flex-col gap-5.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Benefits of studying this course:
                </label>
                <input
                  type="text"
                  placeholder="benefits..."
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="flex flex-col gap-5.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Prerequisites for starting this course?
                </label>
                <input
                  type="text"
                  placeholder="Prerequisites..."
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="flex flex-col gap-5.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Skills gained from the course:
                </label>
                <input
                  type="text"
                  placeholder="skills..."
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

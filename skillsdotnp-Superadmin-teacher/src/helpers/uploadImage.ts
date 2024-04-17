const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "oenqkbeb");
  const resData = await fetch(
    "https://api.cloudinary.com/v1_1/dohth1rzz/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  const json = await resData.json();
  console.log("resData", json.url);
  return await json.url;
  // postImage({ data: formData })
  //   .unwrap()
  //   .then((data: cloudinaryResponseData) => {
  //     if (setValue) {
  //       setValue(name, data.url);
  //     }
  //   })
  //   .catch((err) => {
  // toast({
  //   title: 'Error',
  //   description: err.message,
  //   status: 'error',
  //   duration: 3000,
  //   isClosable: true,
  // });
  // });
};
export default uploadImage;

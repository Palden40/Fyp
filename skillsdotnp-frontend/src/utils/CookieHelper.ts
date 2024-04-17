const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    name + "=" + encodeURIComponent(value) + "; expires=" + expires;
};

const getCookie = (c_name: string) => {
  const cookie = document.cookie;

  const ls = cookie.split(";");
  const reqCookie = ls.find((c) => c.includes(c_name));
  if (reqCookie) {
    return reqCookie.split("=")[1];
  }
  return "";
};

const deleteCookie = (name: string) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

const deleteAllCookies = () => {
  // Get all cookies
  var cookies = document.cookie.split(";");

  // Iterate through each cookie and delete it
  cookies.forEach(function (cookie) {
    var cookieParts = cookie.split("=");
    var cookieName = cookieParts[0].trim();
    document.cookie =
      cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });
};
export default { getCookie, deleteCookie, deleteAllCookies, setCookie };

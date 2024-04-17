interface Teacher {
  _id: string;
  email: string;
  passwordHash: string;
  role: string;
  username: string;
  profilePicture: string;
}
interface Students {
  _id: string;
  email: string;
  passwordHash: string;
  role: string;
  username: string;
  enrolledCourses: any;
}

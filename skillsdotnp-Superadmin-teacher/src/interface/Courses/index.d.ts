interface Course {
  description?: string;
  category?: string;
  language?: string;
  courseName?: string;
  tagLine?: string;
  price?: number;
  hadDiscount?: boolean;
  discountPrice?: number;
  banner?: string;
  content?: CourseContent[];
  bannerImageUrl?: string;
  isFeatured?: boolean;
  chapterPassMark?: number;
  ReviewId?: {
    type: string;
    ref: string;
  }[];
  AverageReview?: number;
  _id?: string;
  enrollments?: string;
}
interface CourseContent {
  content_type: string | undefined;
  title: string;
  data:
    | {
        question: string;
        option1?: string;
        option2?: string;
        option3?: string;
        option4?: string;
        placeholder?: string;
        correctAnswer: string;
      }
    | string;
}
interface ContentPayload {
  content: CourseContent[];
}

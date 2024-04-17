const courseModel = require('../../models/entities/course.model');
const customError = require('../../error/CustomAPIError');
const EnrolledUser = require('../../models/entities/enrolledUser.model');
const { StatusCodes } = require('http-status-codes');
const userModel = require('../../models/user.model');
const { ACCESS_SECRET } = require('../../main.config');
const paymentModel = require('../../models/payment.model');
const axios = require('axios');
const jwt = require("jsonwebtoken");

const createCourse = (req, res, next) => {
    const { body } = req;
    const { id: teacherId } = req.user;
    if (teacherId) {
        body.teacherId = teacherId;
    }
    console.log(body);
    new courseModel({
        ...body,
    })
        .save()
        .then((savedCourse) => {
            return res.status(201).json({
                savedCourse,
                message: 'Course added successfully!',
            });
        })
        .catch((err) => next(err));
};

const getCourse = async (req, res, next) => {
    const {
        category,
        search: courseName,
        hadDiscount,
        language,
        minPrice,
        maxPrice,
    } = req.query;

    const filters = {};

    if (category) {
        filters.category = category;
    }

    if (courseName) {
        filters.courseName = { $regex: new RegExp(courseName, 'i') };
    }

    if (hadDiscount) {
        filters.hadDiscount = hadDiscount;
    }

    if (language) {
        filters.language = language;
    }

    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) {
            filters.price.$gte = minPrice;
        }
        if (maxPrice) {
            filters.price.$lte = maxPrice;
        }
    }

    if (req.headers.authorization) {
        let id,role;
        try {
            const token = req.headers.authorization.split(' ')[1].trim();
            console.log('Token: ', token);
            let verified_payload = jwt.verify(token, ACCESS_SECRET);
            console.log(verified_payload);
            id = verified_payload.id;
            role = verified_payload.role;
        } catch (e) {
            console.log(e);
            return res.status(401).json({
                message: 'Invalid Tokenadsffd!',
            });
        }
        if (!id) {
            console.log("Invalid token, No id.")
            return res.status(401).json({
                message: 'Invalid Token!',
            });
        }
        req.user = { id, role };
    }
    console.log('User: ', req.user)
    if (req.user?.role === 'teacher' || req.user?.role === 'admin') {
        filters.teacherId = req.user.id;
    }

    try {
        let courses = await courseModel.find(filters).populate("teacherId");

        if (!courses || courses.length === 0) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'No courses found!' });
        }

        courses = courses.map((course) => course.toObject());

        courses = await Promise.all(
            courses.map(async (course) => {
                const enrollments = await EnrolledUser.find({
                    courseId: course._id,
                });
                course.enrollments = enrollments.length;
                return course;
            })
        );

        res.status(StatusCodes.OK).json({
            message: 'Courses Fetched successfully',
            allCourse: courses,
        });
    } catch (err) {
        console.log(err);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

const addCourseContent = async (req, res) => {
    const { id: courseId } = req.params;
    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new customError(`No course with id: ${courseId}`, 404);
    }

    if (course.teacherId !== req.user.id) {
        throw new customError('You cannot edit or delete this course.', 403);
    }

    const updatedCourse = await courseModel.findByIdAndUpdate(courseId, {
        $push: {
            content: {
                ...req.body,
            },
        },
    });

    return res
        .status(StatusCodes.OK)
        .json({ message: 'Successfully added course content!', updatedCourse });
};

const addCourseContents = async (req, res) => {
    const { id: courseId } = req.params;
    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new customError(`No course with id: ${courseId}`, 404);
    }

    if (course.teacherId !== req.user.id) {
        throw new customError('You cannot edit or delete this course.', 403);
    }

    const updatedCourse = await courseModel.findByIdAndUpdate(courseId, {
        $push: {
            content: {
                $each: req.body.contents,
            },
        },
    });

    return res
        .status(StatusCodes.OK)
        .json({ message: 'Successfully added course content!', updatedCourse });
};

const getCourseById = async (req, res, next) => {
    const { id } = req.params;
    const course = await courseModel.findById(id).populate('teacherId');
    if (!course) {
        return res.status(404).json({ message: 'Course not found!' });
    }
    return res.status(200).json({ foundCourse: course });
};

const updateCourse = async (req, res, next) => {
    const {
        params: { id: courseId },
        body,
    } = req;
    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new customError(`No course with id: ${courseId}`, 404);
    }
    console.log('Course.teacherId: ', course.teacherId);
    console.log('req.user.id: ', req.user.id);
    if (course.teacherId.toString() !== req.user.id.toString()) {
        throw new customError('You cannot edit or delete this course.', 403);
    }

    courseModel
        .findById(courseId)
        .then((course) => {
            if (!course) {
                return res.status(404).json({
                    message: 'Course not found!',
                });
            }
            Object.keys(body).forEach((key) => {
                course[key] = body[key];
            });
            return course.save();
        })
        .then((updatedCourse) => {
            return res.status(200).json({
                message: 'Course updated successfully!',
                updatedCourse,
            });
        })
        .catch((err) => next(err));
};

const deleteCourse = async (req, res, next) => {
    const { id: courseId } = req.params;

    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new customError(`No course with id: ${courseId}`, 404);
    }

    if (course.teacherId !== req.user.id) {
        throw new customError('You cannot edit or delete this course.', 403);
    }

    courseModel
        .findByIdAndDelete(courseId)
        .then((deletedCourse) => {
            return res.status(204).json({
                message: 'course deleted!',
                deletedCourse,
            });
        })
        .catch((err) => next(err));
};

const initiateCourseEnrollment = async (req, res) => {
    const { id: courseId } = req.params;
    const { id: userId } = req.user;

    const { return_url, website_url } = req.body;

    if (!courseId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid request, provide courseId as id in parameters.',
        });
    }
    if (!return_url) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Invalid request, provide return_url in body.' });
    }
    if (!website_url) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Invalid request, provide website_url in body.' });
    }

    try {
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'No course with that id' });
        }

        // Check if user has already enrolled in that particular course
        const isEnrolled = await EnrolledUser.findOne({ courseId, userId });
        if (isEnrolled) {
            return res.status(StatusCodes.OK).json({
                success: false,
                message: 'You have already enrolled in this course',
            });
        }

        let khaltiResponse;

        const alreadyInitiated = await paymentModel.findOne({
            student: userId,
            course: courseId,
            status: 'pending',
        });

        if (alreadyInitiated) {
            return res.status(StatusCodes.OK).json({
                message: 'Payment already initiated',
                payment: alreadyInitiated,
            });
        }

        console.log('Khalti Secret: ', process.env.KHALTI_SECRET_KEY);
        console.log('Khalti URL: ', process.env.KHALTI_BASE_URL);
        
        try {
            khaltiResponse = await axios.post(
                `${process.env.KHALTI_BASE_URL}/epayment/initiate/`,
                {
                    return_url,
                    website_url,
                    purchase_order_id: courseId,
                    amount: parseInt(course.price)*100,
                    purchase_order_name: course.courseName,
                    product_url: `${website_url}/course/${courseId}`,
                },
                {
                    headers: {
                        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!khaltiResponse.data?.pidx) {
                console.log(
                    'Invalid response from khalti: ',
                    khaltiResponse?.data
                );
                return res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Internal server error' });
            }
            let payment;
            if (alreadyInitiated) {
                payment = await paymentModel.findByIdAndUpdate(
                    alreadyInitiated._id,
                    {
                        pidx: khaltiResponse.data.pidx,
                        paymentUrl: khaltiResponse.data.payment_url,
                        amount: parseInt(course.price)*100,
                    },
                    { new: true }
                );
            } else {
                payment = await new paymentModel({
                    student: userId,
                    course: courseId,
                    amount: parseInt(course.price)*100,
                    pidx: khaltiResponse.data.pidx,
                    status: 'pending',
                    paymentUrl: khaltiResponse.data.payment_url,
                }).save();
            }
            return res.status(StatusCodes.OK).json({
                message: 'Payment initiated successfully',
                payment,
            });
        } catch (error) {
            console.log('Error response from khalti: ', error.response?.data);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: 'Internal server error' });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

const verifyCourseEnrollment = async (req, res) => {
    const { id: userId } = req.user;

    const { pidx, status, amount, purchase_order_id } = req.query;

    const courseId = purchase_order_id;

    req.params.id = courseId;

    console.log('Course ID: ', courseId);
    console.log('PIDX:', pidx);
    console.log('UserID: ', userId);
    try {
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'No course with that id' });
        }

        const payment = await paymentModel.findOne({
            student: userId,
            course: courseId,
            pidx,
        });

        if (parseInt(amount) < parseInt(payment.amount)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Invalid amount!' });
        }

        if (!payment) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'Payment not initiated!' });
        }

        if (payment.status === 'success') {
            const enrolled = await EnrolledUser.findOne({ courseId, userId }).populate('courseId');
            if (enrolled) {
                return res
                    .status(StatusCodes.OK)
                    .json({
                        message: 'You have already enrolled in this course',
                        enrolled,
                 });
            } else {
                enrollCourse(req, res);
                return;
            }
        }

        if (status.toLowerCase().trim() === 'completed') {
            await paymentModel.findByIdAndUpdate(
                payment._id,
                {
                    status: 'success',
                    paymentDate: Date.now(),
                },
                { new: true }
            );

            enrollCourse(req, res);
            return;
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Payment not completed yet!' });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

const enrollCourse = async (req, res) => {
    const { id: courseId } = req.params;
    const { id: userId } = req.user;

    try {
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'No course with that id' });
        }

        // Check if user has already enrolled in that particular course
        const isEnrolled = await EnrolledUser.findOne({ courseId, userId });
        if (isEnrolled) {
            return res.status(StatusCodes.OK).json({
                success: false,
                message: 'You have already enrolled in this course',
            });
        }

        // Create a new enrolled user object
        const enrolled = new EnrolledUser({
            courseId,
            userId,
            enrolled_Date: new Date().toLocaleDateString(),
            completed_date: null,
            isCompleted: false,
        });

        await enrolled.save();
        await enrolled.populate('courseId');

        return res.status(201).json({
            message: 'You have successfully enrolled in this course',
            enrolled,
        });
    } catch (error) {
        console.log(error);
        throw new customError(error.message, 500);
    }
};

const unenrollCourse = async (req, res) => {
    const { id: courseId } = req.params;
    const { id: userId } = req.user;

    try {
        const course = await courseModel.findById(courseId);
        if (!course) {
            throw new customError(`No course with id: ${courseId}`, 404);
        }

        // Check if user has already enrolled in that particular course
        const isEnrolled = await EnrolledUser.findOne({ courseId, userId });
        if (isEnrolled) {
            await EnrolledUser.findOneAndDelete({ courseId, userId });
        }

        res.status(StatusCodes.OK).json({
            message: 'You have successfully unenrolled in this course',
        });
    } catch (error) {
        console.log(error);
        throw new customError(error.message, 500);
    }
};

const getEnrollUsers = async (req, res) => {
    const { id: courseId } = req.params;
    let enrollUsers = (await EnrolledUser.find({ courseId })).toObject();
    if (!enrollCourse.length) {
        throw new customError('No Enroll user found!!!', StatusCodes.NOT_FOUND);
    }
    enrollUsers = await Promise.all(
        enrollUsers.map(async (enrollUser) => {
            enrollUser.user = await userModel.findById(enrollUser.userId);
            enrollUser.course = await courseModel.findById(enrollUser.courseId);
            return enrollUser;
        })
    );

    res.status(200).json({ msg: 'Fetched successfully', enrollUsers });
};

const getEnrollUser = async (req, res) => {
    let enrollUsers = (
        await EnrolledUser.find({
            userId: req.user.id,
        })
    ).map((o) => o.toObject());
    if (enrollUsers.length === 0) {
        throw new customError(
            `you have not enroll to any courses yet!!!`,
            StatusCodes.NOT_FOUND
        );
    }

    enrollUsers = await Promise.all(
        enrollUsers.map(async (enrollUser) => {
            enrollUser.user = await userModel.findById(enrollUser.userId);
            enrollUser.course = await courseModel.findById(enrollUser.courseId);
            return enrollUser;
        })
    );

    res.status(200).json({ msg: 'Fetched successfully', enrollUsers });
};

const registerCompleted = async (req, res) => {
    const { id: courseId, contentId } = req.params;
    const { id: userId } = req.user;

    if (!courseId || !contentId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message:
                'Invalid request, provide courseId as id and contentId in parameters.',
        });
    }

    try {
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'No course with that id' });
        }

        const isEnrolled = await EnrolledUser.findOne({ courseId, userId });
        if (!isEnrolled) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'You have not enrolled in this course' });
        }

        let currentId = '';
        for (let i = 0; i < course.content.length; i++) {
            if (course.content[i]._id.toString() === contentId.toString()) {
                if (i === course.content.length - 1) {
                    currentId = null;
                } else {
                    currentId = course.content[i + 1]._id;
                }
                break;
            }
        }
        const completed = currentId === null;

        const updatedEnrolled = await EnrolledUser.findOneAndUpdate(
            { courseId, userId },
            {
                $push: {
                    'progress.completedIndexes': contentId,
                },
                'progress.lastIndex': contentId,
                'progress.currentIndex': currentId,
                completed,
            },
            { new: true }
        );

        res.status(StatusCodes.OK).json({
            message: 'You have successfully registered the completed content',
            updatedEnrolled,
        });
    } catch (error) {
        console.log(error);
        throw new customError(error.message, 500);
    }
};

const checkEnrollUserByCourse = async (req, res) => {
    const enrollUser = await EnrolledUser.find({
        userId: req.user.id,
        courseId: req.params.id,
    });
    if (enrollUser.length === 0) {
        throw new customError(
            `you have not enroll to this course yet!!!`,
            StatusCodes.NOT_FOUND
        );
    }
    res.status(200).json({
        status: true,
        msg: 'You have enrolled in this course',
        data: enrollUser,
    });
};

module.exports = {
    deleteCourse,
    createCourse,
    getCourse,
    getCourseById,
    updateCourse,
    enrollCourse,
    unenrollCourse,
    getEnrollUser,
    getEnrollUsers,
    checkEnrollUserByCourse,
    addCourseContent,
    addCourseContents,
    registerCompleted,
    initiateCourseEnrollment,
    verifyCourseEnrollment,
};

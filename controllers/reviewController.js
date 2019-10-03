const Review = require('./../models/reviewModel');
//const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// MIDDLEWARE
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// GET ALL REVIEWS
exports.getAllReviews = factory.getAll(Review);

// GET A REVIEW
exports.getReview = factory.getOne(Review);

// CREATE A REVIEW
exports.createReview = factory.createOne(Review);

// UPDATE A REVIEW
exports.updateReview = factory.updateOne(Review);

// DELETE A REVIEW
exports.deleteReview = factory.deleteOne(Review);

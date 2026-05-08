const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.index = async (req, res) => {
  let listings = await Listing.find({}).populate("reviews").populate("owner");
  res.render("listings/index", { listings });
};

module.exports.postNew = async (req, res) => {
  let listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  await listing.save();
  req.flash("success", "listing Added Successfully");
  res.redirect("/listings");
};

module.exports.getNew = (req, res) => {
  res.render("listings/new");
};

module.exports.postUpdate = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.user._id)) {
    req.flash("error", "you don't have permission");
    return res.redirect(`/listings/${id}`);
  }
  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.getUpdate = async (req, res) => {
  let { id } = req.params;
  let Mylisting = await Listing.findOne({ _id: id });
  res.render("listings/edit", { Mylisting });
};

module.exports.detailedView = async (req, res) => {
  let { id } = req.params;
  await Review.find({});
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Not Found");
    res.redirect("/listings");
  } else {
    res.render("listings/detailedView", { listing });
    console.log(listing);
  }
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let result = await Listing.findByIdAndDelete(id);
  req.flash("success", `Listing ${listing.title} Deleted Successfully`);
  res.redirect(`/listings`);
};

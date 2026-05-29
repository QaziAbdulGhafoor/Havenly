const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");
const axios = require("axios");

async function getCoord(address) {
  let result = await axios.get(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address,
    )}&format=json&limit=1`,
    {
      headers: {
        "User-Agent": "havenly-app",
      },
    },
  );
  return [Number(result.data[0].lon), Number(result.data[0].lat)];
}
// const coordinates = [result.data[0].lon, result.data[0].lat];
// console.log(coordinates);
// module.exports.coordinates = coordinates;

module.exports.index = async (req, res) => {
  let category = req.query.category;
  let search = req.query.search;
  let listings;
  if (category) {
    listings = await Listing.find({ category: category })
      .populate("reviews")
      .populate("owner");
    if (listings.length !== 0) {
      res.render("listings/index", { listings });
    } else {
      req.flash("error", `Sorry! Nothing in ${category} category`);
      res.redirect("/listings");
    }
  } else if (search) {
    listings = await Listing.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ],
    });
    // if (listings.length !== 0) {
    //   res.render("listings/index", { listings });
    // } else {
    //   req.flash("error", `Sorry! Nothing for '${search}'`);
    //   res.redirect("/listings");
    // }
    res.render("listings/index", { listings });
  } else {
    listings = await Listing.find({}).populate("reviews").populate("owner");
    res.render("listings/index", { listings });
  }
};

module.exports.postNew = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = new Listing(req.body.listing);
  let address = req.body.listing.location;
  const coordinates = await getCoord(address);
  listing.geometry = {
    type: "Point",
    coordinates: coordinates,
  };
  listing.owner = req.user._id;
  listing.image = { url, filename };
  await listing.save();

  // console.log(listing);

  const result = req.flash("success", "listing Added Successfully");
  res.redirect("/listings");
};

module.exports.getNew = (req, res) => {
  res.render("listings/new");
};

module.exports.postUpdate = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  let updateListings = await Listing.findByIdAndUpdate(id, req.body.listing);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updateListings.image = { url, filename };
    await updateListings.save();
  }
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.getUpdate = async (req, res) => {
  let { id } = req.params;
  let Mylisting = await Listing.findOne({ _id: id });
  let originalImage = Mylisting.image.url;
  originalImage = originalImage.replace("/upload", "/upload/w_150,h_150");
  res.render("listings/edit", { Mylisting, originalImage });
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
  }
  let isFavourite = false;
  if (req.user) {
    let user = await User.findById(req.user._id);
    isFavourite = user.favourites.some(
      (favId) => favId.toString() === listing._id.toString(),
    );
  }

  res.render("listings/detailedView", { listing, isFavourite });
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let result = await Listing.findByIdAndDelete(id);
  req.flash("success", `Listing ${listing.title} Deleted Successfully`);
  res.redirect(`/listings`);
};

module.exports.addnewfavourite = async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(req.user._id);
  let alreadySaved = user.favourites.some((favId) => favId.toString() === id);
  if (!alreadySaved) {
    user.favourites.push(id);
    await user.save();
    req.flash("success", "Added to favourites!");
  }
  res.redirect(`/listings/${id}`);
};

module.exports.showfavourites = async (req, res) => {
  let userId = req.params.id;
  let user = await User.findById(userId).populate("favourites");
  if (!user) {
    res.redirect("/listings");
  }

  if (user.favourites.length !== 0) {
    res.render("listings/index", { listings: user.favourites });
  } else {
    req.flash("error", "no favourites saved by your account");
    res.redirect("/listings");
  }
};

module.exports.removeFavourite = async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(req.user._id);
  user.favourites = user.favourites.filter((favId) => favId.toString() !== id);
  await user.save();
  req.flash("success", "Removed from favourites!");
  res.redirect(`/listings/${id}`);
};

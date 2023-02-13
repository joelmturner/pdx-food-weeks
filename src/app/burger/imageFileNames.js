const fs = require("fs");
const burgerData = require("./data.json");
const slugify = require("slugify");
const path = require("path");

// load all the images from ./images folder using fs.readFileSync
const imageFileNames = fs
  .readdirSync(path.join(__dirname, "images"))
  .filter(fileName => fileName.endsWith(".jpg"));

// imageFileNames.forEach(fileName => {
//   const burger = burgerData.find(
//     burger => `Picture${burger.id < 10 ? "0" : ""}${burger.id}` === fileName
//   );

//   if (!burger) {
//     console.log(`Missing burger for image: ${fileName}`);
//   } else {
//     console.log(`Found burger for image: ${fileName}`);
//   }
// });

module.exports.updateImageFileNamesWithBurgerNames =
  function updateImageFileNamesWithBurgerNames() {
    imageFileNames.forEach(fileName => {
      //   const slug = slugify(fileName, {
      //     lower: true,
      //     remove: /[*+~.()'"!:@]/g,
      //   });

      const resolvedSlug = fileName.replace("jpg", ".jpg");

      fs.rename(
        path.join(__dirname, "images", fileName),
        path.join(__dirname, "images", resolvedSlug),
        err => {
          if (err) console.log("error", err);
        }
      );
    });
    //     const newImageFileNames = imageFileNames.map(fileName => {
    //       const burger = burgerData.find(
    //         burger =>
    //           `Picture${burger.id < 10 ? "0" : ""}${burger.id}.jpg` === fileName
    //       );
    //       if (!burger) {
    //         return fileName;
    //       }
    //   return `${slugify(burger.burger, { lower: true })}.jpg`;
    //     });

    //     console.log(newImageFileNames);

    //     imageFileNames.forEach((fileName, index) => {
    //       console.log("fileName", fileName);
    //       console.log("newImageFileNames[index]", newImageFileNames[index]);
    //       fs.rename(
    //         path.join(__dirname, "images", fileName),
    //         path.join(__dirname, "images", newImageFileNames[index]),
    //         err => {
    //           if (err) console.log("error", err);
    //         }
    //       );
    //     });
  };

// module.exports.updateImageUrls = function updateImageUrls() {
//   burgerData.forEach(burger => {
//     const slug = slugify(burger.title, {
//       lower: true,
//       remove: /[*+~.()'"!:@]/g,
//     });
//     const imageUrl = `https://res.cloudinary.com/joelmturner/image/upload/v1676133951/burgerweek/2019/${slug}.jpg`;
//     burger["imageUrl"] = imageUrl;

//     console.log(slug, burger.imageUrl);
//   });

//   fs.writeFileSync(
//     path.join(__dirname, "data.json"),
//     JSON.stringify(burgerData, null, 2)
//   );
// };

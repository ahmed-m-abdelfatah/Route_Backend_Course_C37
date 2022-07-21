const userModel = require('../../DB/model/user_model.js');
const productModel = require('../../DB/model/product_model.js');
const fs = require('fs');
const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');
const internalServerError = require('../../utils/internal_server_error.js');
const { sendConfirmationEmail } = require('../../utils/send_emails.js');
const pagination = require('../../services/pagination.js');
const { roles } = require('../../middleware/auth.js');

const displayProfile = async (req, res) => {
  try {
    const user = req.user;
    const products = await productModel.find({ createdBy: req.user._id, isDeleted: false }).populate({
      path: 'comments',
      match: { isDeleted: false },
      select: 'commentBody type',
      populate: {
        path: 'replies',
        match: { isDeleted: false },
        select: 'commentBody type',
        populate: {
          path: 'replies',
          match: { isDeleted: false },
          select: 'commentBody type',
        },
      },
    });
    const qrCode = await QRCode.toDataURL(user.email, { errorCorrectionLevel: 'H' });
    res.status(200).json({ user, products, qrCode });
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateProfile = async (req, res) => {
  // UPDATED PASSWORD SHOULD BE IN ONE SEPARATE API BECAUSE THE REQUIRED FIELDS IN JOI VALIDATION
  try {
    // check if there is data in the body because every data is optional
    if (req.body && Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'No data in the body' }); // 400 Bad Request
    }

    const { email, ...rest } = req.body;

    let passedData;
    let message = 'Done';

    if (email && email !== req.user.email) {
      passedData = { email, emailConfirmed: false, ...rest };
    } else {
      passedData = { ...rest };
    }

    // updating user
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, passedData, { new: true });

    // send confirmation email if user is trying to change email
    if (updatedUser.email !== req.user.email) {
      sendConfirmationEmail(req, updatedUser, 5 * 60);
      message = 'Confirmation email sent';
    }

    res.status(200).json({ message, updatedUser }); // 200 OK
  } catch (error) {
    if (error?.keyValue?.email) {
      // if email is already taken by another user
      res.status(409).json({ message: 'Email already exists' }); // 409: Conflict
    } else {
      internalServerError(res, error);
    }
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id);

    if (oldPassword == newPassword) {
      res.status(400).json({ message: 'new password cannot equal old password' }); // 400 Bad Request
    } else {
      const match = await bcrypt.compare(oldPassword, user.password);

      if (!match) {
        res.status(400).json({ message: 'in-valid old password' }); // 400 Bad Request
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_JS_SALT_ROUNDS));
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
        res.status(200).json({ message: 'Done' }); // 200 OK
      }
    }
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: 'Done, the user was honestly deleted' }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateProfilePic = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: 'Invalid file format' }); // 400 Bad Request
    }

    // delete old profile pic if there is one
    if (req.user.profilePic) {
      req.user.profilePic.forEach(file => {
        try {
          fs.unlinkSync(file);
        } catch (error) {
          console.log('~ unlinkSync error', error);
        }
      });
    }

    const imageUrls = [];

    req.files.forEach(file => {
      imageUrls.push(`${req.filePath}/${file.filename}`);
    });

    const user = await userModel.findByIdAndUpdate(req.user._id, { profilePic: imageUrls }, { new: true });

    res.status(200).json({ message: 'Done adding profilePic', user }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateProfileCoverPic = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: 'Invalid file format' }); // 400 Bad Request
    }

    // delete old cover pic if there is one
    if (req.user.coverPic) {
      try {
        fs.unlinkSync(req.user.coverPic);
      } catch (error) {
        console.log('~ unlinkSync error', error);
      }
    }

    const newImageURL = `${req.filePath}/${req.file.filename}`;
    const updatedUserImage = await userModel.findByIdAndUpdate(req.user.id, { coverPic: newImageURL }, { new: true });

    res.status(200).json({ message: 'Done', updatedUserImage }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const qr = async (req, res) => {
  const user = await userModel.findOne({ _id: req.user._id }).select('email');

  QRCode.toDataURL(`${req.protocol}://${req.headers.host}/user/profile${user._id}`, function (err, url) {
    if (err) {
      res.json({ message: 'Qr code error' });
    } else {
      res.json({ message: 'Done', url });
    }
  });
};

const deActive = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.user._id, { isDeactivated: true }, { new: true });
    res.status(200).json({ message: 'Done', user }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    // get all products with each user child parent
    const { page, size } = req.query;
    const { skip, limit } = pagination(page, size);

    const cursor = userModel
      .find({ role: roles.user, isDeleted: false, isBlocked: false, emailConfirmed: true })
      .limit(limit)
      .skip(skip)
      .populate({
        path: 'wishlist',
      })
      .cursor();

    const users = [];

    for (let user = await cursor.next(); user != null; user = await cursor.next()) {
      const products = await productModel.find({ createdBy: user._id }).populate({
        path: 'comments',
        match: { isDeleted: false },
        select: 'commentBody type',
        populate: {
          path: 'replies',
          match: { isDeleted: false },
          select: 'commentBody type',
          populate: {
            path: 'replies',
            match: { isDeleted: false },
            select: 'commentBody type',
          },
        },
      });

      users.push({ ...user.toJSON(), products });
    }

    res.status(200).json({ message: 'Done', users }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  displayProfile,
  updateProfile,
  updatePassword,
  deleteUser,
  updateProfilePic,
  updateProfileCoverPic,
  qr,
  deActive,
  getAllUsers,
};

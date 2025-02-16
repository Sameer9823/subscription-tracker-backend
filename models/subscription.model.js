import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
      minlength: [3, "Name cannot be less than 3 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be less than 0"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "personal",
        "business",
        "family",
        "sports",
        "health",
        "entertainment",
        "other",
      ],
      required: [true, "Category is required"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Start Date is required"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      required: [true, "Renewal Date is required"],
      default: function () {
        if (!this.startDate || !this.frequency) return undefined;

        const renewalPeriods = {
          daily: 1,
          weekly: 7,
          monthly: 30,
          yearly: 365,
        };

        const renewal = new Date(this.startDate);
        renewal.setDate(renewal.getDate() + renewalPeriods[this.frequency]);
        return renewal;
      },
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be in the future",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Automatically update `status` before saving
subscriptionSchema.pre("save", function (next) {
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    _id: false,
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    description: { type: String }
});

const imageSchema = new Schema({
    data: { type: String, required: true }
});

const productSchema = new Schema({
    name: { type: String, required: true },
    images: { type: [imageSchema], required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: [
            'Mobiles, Tablets & More',
            'Computers & Accessories',
            'Appliances',
            'Electronics',
            'Fashion',
            'Home & Kitchen',
            'Beauty & Health',
        ],
    },
    brand: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    reviews: [reviewSchema]
}, {
    timestamps: true,
    virtuals: {
        avgRating: {
            get() {
                if(this.reviews) {
                    let ratingSum = 0;
                    this.reviews.forEach(review => ratingSum += review.rating)
                    return (ratingSum / this.reviews.length);
                }
            }
        }
    }
});

productSchema.index({ name: 'text', description: 'text', category: 'text', brand: 'text', seller: 'text' });
productSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('Product', productSchema);
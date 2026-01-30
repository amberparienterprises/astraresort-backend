exports.calculateFinalPrice = (basePrice, ratePlan, offers, nights) => {
    let total = basePrice;

    // 1. Add Rate Plan charges (e.g., +1500 for "With Food")
    if (ratePlan && ratePlan.extraCharge) {
        total += ratePlan.extraCharge;
    }

    // 2. Apply Discount Offers (e.g., "Happy Hour" discount)
    let discount = 0;
    if (offers && offers.length > 0) {
        offers.forEach(offer => {
            if (offer.discountPercentage > 0) {
                discount += (total * (offer.discountPercentage / 100));
            }
        });
    }

    const finalPricePerNight = total - discount;
    return {
        pricePerNight: finalPricePerNight,
        totalStayPrice: finalPricePerNight * nights,
        savings: discount * nights
    };
};
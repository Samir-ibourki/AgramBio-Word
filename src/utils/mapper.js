
export const mapProduct = (wpProduct) => {
  if (!wpProduct) return null;

  
  const extractPrice = (priceStr) => {
    if (!priceStr) return null;
    const match = priceStr.match(/\d+([.,]\d+)?/);
    return match ? parseFloat(match[0].replace(',', '.')) : null;
  };

  const categoryNode = wpProduct.productCategories?.nodes?.[0];
  const categorySlug = categoryNode ? categoryNode.slug : 'uncategorized';

  // Gather images
  const images = [];
  if (wpProduct.image?.sourceUrl) {
    images.push(wpProduct.image.sourceUrl);
  }
  if (wpProduct.galleryImages?.nodes) {
    wpProduct.galleryImages.nodes.forEach(img => {
      if (img?.sourceUrl) images.push(img.sourceUrl);
    });
  }

  // Determine pricing
  let price = extractPrice(wpProduct.price);
  let originalPrice = extractPrice(wpProduct.regularPrice);
  
  // If price and originalPrice are the same, it means there's no sale
  if (price === originalPrice) {
    originalPrice = null;
  }

  return {
    id: wpProduct.databaseId,
    slug: wpProduct.slug,
    name: wpProduct.name || "Product",
    price: price,
    originalPrice: originalPrice,
    categorySlug: categorySlug,
    categoryName: categoryNode ? categoryNode.name : 'Uncategorized',
    isNew: false,
    images: images,
    description: wpProduct.description || wpProduct.shortDescription || "",
    rating: 5.0, 
    reviews: 0,
    features: [
      { icon: "ShieldCheck", textKey: "product.features.pure" },
      { icon: "Droplets", textKey: "product.features.raw" },
      { icon: "Leaf", textKey: "product.features.organic" }
    ]
  };
};

export const mapProducts = (wpProductsNodes) => {
  if (!wpProductsNodes || !Array.isArray(wpProductsNodes)) return [];
  return wpProductsNodes.map(mapProduct);
};

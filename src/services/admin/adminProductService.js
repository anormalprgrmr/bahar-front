import {
  apiClient,
  toApiImagePath,
  toQueryString,
} from "@/services/api/client";
import { normalizeProduct } from "@/services/products/productService";

/**
 * @param {object} [params]
 * @returns {Promise<import('@/types/product').PaginatedProducts>}
 */
export async function adminListProducts(params = {}) {
  const query = toQueryString({
    page: params.page ?? 1,
    page_size: params.pageSize ?? 20,
    q: params.q,
    category: params.category,
    in_stock: params.inStock,
    on_sale: params.onSale,
    is_published: params.isPublished,
  });
  const result = await apiClient(`/admin/products${query}`, { auth: true });
  return {
    data: (result?.data ?? []).map(normalizeProduct),
    pagination: result?.pagination,
  };
}

/**
 * @param {import('@/types/product').ProductUpsertPayload} payload
 * @returns {Promise<import('@/types/product').Product>}
 */
export async function adminCreateProduct(payload) {
  const product = await apiClient("/products", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeProduct(product);
}

/**
 * @param {string} id
 * @param {import('@/types/product').ProductUpsertPayload} payload
 */
export async function adminGetProduct(id) {
  const product = await apiClient(`/admin/products/${id}`, { auth: true });
  return normalizeProduct(product);
}

/**
 * @param {string} id
 * @param {import('@/types/product').ProductUpsertPayload} payload
 */
export async function adminUpdateProduct(id, payload) {
  return apiClient(`/products/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

function buildProductUpdatePayload(product, overrides = {}) {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    newPrice: product.newPrice ?? null,
    image: toApiImagePath(product.image),
    stock: product.stock,
    images: (product.images ?? []).map(toApiImagePath).filter(Boolean),
    categoryIds:
      product.categoryIds ??
      product.categories?.map((category) => category.id) ??
      [],
    country: product.country ?? "",
    skinType: product.skinType ?? "",
    famousProducts: product.famousProducts ?? "",
    suitableFor: product.suitableFor ?? "",
    keywords: product.keywords ?? "",
    onSale: product.onSale,
    isPublished: product.isPublished,
    ...overrides,
  };
}

/**
 * Update the currently displayed price while preserving the product's regular/sale price setup.
 * @param {import('@/types/product').Product} product
 * @param {number} displayedPrice
 */
export async function adminUpdateProductPrice(product, displayedPrice) {
  const hasSalePrice = product.newPrice != null;
  return adminUpdateProduct(
    product.id,
    buildProductUpdatePayload(product, {
      price: hasSalePrice ? product.price : displayedPrice,
      newPrice: hasSalePrice ? displayedPrice : null,
    }),
  );
}

/**
 * Update the product's available stock quantity.
 * @param {import('@/types/product').Product} product
 * @param {number} stock
 */
export async function adminUpdateProductStock(product, stock) {
  return adminUpdateProduct(
    product.id,
    buildProductUpdatePayload(product, { stock }),
  );
}

/**
 * @param {string} id
 */
export async function adminDeleteProduct(id) {
  return apiClient(`/products/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

/**
 * @param {string} productId
 * @param {File} file
 * @param {boolean} [setAsMain=false]
 */
export async function adminUploadProductImage(
  productId,
  file,
  setAsMain = false,
) {
  const formData = new FormData();
  formData.append("image", file);

  const query = setAsMain ? "?set_as_main=true" : "";
  const result = await apiClient(`/products/${productId}/images${query}`, {
    method: "POST",
    auth: true,
    formData,
  });

  return {
    imageUrl: result?.image_url ?? "",
    product: result?.product ? normalizeProduct(result.product) : null,
  };
}

/**
 * @param {string} productId
 * @param {File[]} files
 * @param {boolean} [setAsMain=false]
 */
export async function adminUploadProductImages(
  productId,
  files,
  setAsMain = false,
) {
  const results = [];
  for (const file of files) {
    results.push(await adminUploadProductImage(productId, file, setAsMain));
  }
  return results;
}

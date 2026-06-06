import productModel from "../models/productModel.js";

// ==================================
// SITEMAP DYNAMIQUE SEO
// ==================================
const sitemapProducts = async (req, res) => {

  try {

    const products =
      await productModel.find({});


    const baseUrl =
      "https://k-mystore.com";


    // ==================================
    // ÉCHAPPER XML
    // ==================================
    const escapeXml = (unsafe = "") => {

      return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };


    // ==================================
    // PAGES FIXES
    // ==================================
    const staticPages =
      [
        "",
        "collection",
        "about",
        "video",
        "nos-sites"
      ]
        .map((page) => `
<url>
  <loc>${escapeXml(baseUrl)}/${escapeXml(page)}</loc>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>`)
        .join("");


    // ==================================
    // CATÉGORIES + SOUS-CATÉGORIES
    // ==================================
    const categoryUrls =
      [
        ...new Set(
          products.map((p) =>
            JSON.stringify({
              category:
                p.category || "",
              subCategory:
                p.subCategory || ""
            })
          )
        )
      ]
        .map((item) => {

          const {
            category,
            subCategory
          } = JSON.parse(item);

          const safeCategory =
            encodeURIComponent(
              category
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
            );

          const safeSubCategory =
            encodeURIComponent(
              subCategory
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
            );

          return `
<url>
  <loc>${escapeXml(baseUrl)}/category/${escapeXml(safeCategory)}/subcategory/${escapeXml(safeSubCategory)}</loc>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>`;
        })
        .join("");


    // ==================================
    // PRODUITS
    // ==================================
    const productUrls =
      products
        .filter(
          (product) =>
            product.slug
        )
        .map((product) => {

          const safeSlug =
            encodeURIComponent(
              product.slug
            );

          const updatedAt =
            product.updatedAt
              ? new Date(
                  product.updatedAt
                ).toISOString()
              : new Date()
                  .toISOString();

          return `
<url>
  <loc>${escapeXml(baseUrl)}/product/${escapeXml(safeSlug)}</loc>
  <lastmod>${updatedAt}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>1.0</priority>
</url>`;
        })
        .join("");


    // ==================================
    // XML FINAL
    // ==================================
    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages}
${categoryUrls}
${productUrls}
</urlset>`;


    res.set(
      "Content-Type",
      "application/xml"
    );

    res.status(200).send(xml);

  } catch (error) {

    console.error(
      "Erreur sitemap :",
      error
    );

    res
      .status(500)
      .send(
        "Erreur sitemap"
      );
  }
};

export default sitemapProducts;
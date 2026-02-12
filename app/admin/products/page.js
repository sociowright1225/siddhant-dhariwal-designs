import { getProducts } from "@/lib/api";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div style={{ padding: 40 }}>
      <h2>Products</h2>

      <Link href="/admin/add-product">➕ Add Product</Link>

      <ul>
        {products.map((p) => (
          <li key={p._id}>
            <b>{p.title}
                {p.category}</b> – {p.slug}
          </li>
        ))} 
      </ul>
    </div>
  );
}

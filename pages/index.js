import styles from "../styles/Home.module.css";
import axios from "axios";

export default function Home({ code, products }) {
  return (
    <div className={styles.container}>
      <a
        href="http://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=2081047667304031
"
      >
        <button>Log me in</button>
      </a>
      <span>Code: {code}</span>
      {products && (
        <ul>
          {products.map((product, key) => {
            return (
              <li key={key}>
                Posición: {product.position}, id: {product.id}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { code } = query;
  let products = [];
  if (code) {
    const response = await axios.post(
      "http://localhost:3000/api/highlight/MLA1055",
      {
        code
      }
    );

    products = response.data.products;
  }

  return {
    props: {
      code: query.code ?? "No hay codigo",
      products
    }
  };
}

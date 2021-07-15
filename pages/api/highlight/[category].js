import axios from "axios";

let savedToken = undefined;

//Sorry for the ugly code, it was just for showing in a stream how to get an access_token from MELI's API
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { category } = req.query;
    const { body } = req;
    let products = [];

    if (body?.code) {
      if (!savedToken) {
        savedToken = await getToken(body.code);
        if (!savedToken)
          return res.status(500).json({ message: "El mundo esta en llamas" });
      }

      try {
        const getHightlights = await axios.get(
          `https://api.mercadolibre.com/highlights/MLA/category/MLA1055`,
          {
            headers: {
              Authorization: `Bearer ${savedToken}`
            }
          }
        );

        products = getHightlights?.data?.content ?? [];
      } catch (err) {
        return res.status(500).json({ message: "El mundo esta en llamas" });
      }
    } else {
      return res.status(400).json({
        message: "Bad request"
      });
    }

    res.status(200).json({
      categoryId: category,
      products
    });
  }
}

async function getToken(code) {
  const { APP_ID, CLIENT_SECRET } = process.env;
  try {
    const response = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: APP_ID, // In here just add your App ID, you can get it from https://developers.mercadolibre.com.ar/es_ar/primeros-pasos
        client_secret: CLIENT_SECRET, // In here just add your Client secret ID you can get it from https://developers.mercadolibre.com.ar/es_ar/primeros-pasos,
        code: code,
        redirect_uri: "http://localhost:3000"
      }
    );

    savedToken = response.data.access_token;
    return response.data.access_token;
  } catch (err) {
    return false;
  }
}
